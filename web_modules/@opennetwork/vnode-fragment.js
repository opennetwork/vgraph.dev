import { isFragmentVNode, Fragment, isSourceReference } from './vnode.js';
import { asyncExtendedIterable } from '../iterable.js';

function isReferencedVNode(given, value) {
    return value.reference === given;
}

const ReferenceFragment = Symbol("Reference Fragment");
function isReferenceFragmentVNode(node) {
    function isReferenceFragmentVNodeLike(node) {
        return isFragmentVNode(node) && !!node.options;
    }
    return (isReferenceFragmentVNodeLike(node) &&
        node.source === ReferenceFragment &&
        typeof node.options.is === "function" &&
        typeof node.options.on === "function");
}
function isReferenceFragmentVNodeForVNode(node, referencedNode) {
    return (isReferenceFragmentVNode(node) &&
        node.options.is(referencedNode));
}
function on(...args) {
    if (args.length >= 2 && typeof args[0] === "function" && typeof args[1] === "function") {
        return resolvedOn(args[0], args[1], getMode(args[2]));
    }
    if (args.length >= 2 && isSourceReference(args[0]) && typeof args[1] === "function") {
        return resolvedOn(isReferencedVNode.bind(undefined, args[0]), args[1], getMode(args[2]));
    }
    if (args.length >= 1 && typeof args[0] === "function") {
        return resolvedOn((node) => true, args[0], getMode(args[1]));
    }
    throw new Error("Unexpected arguments");
    function getMode(value) {
        if (value === "child") {
            return value;
        }
        return "child";
    }
    function resolvedOn(isFn, onFn, mode) {
        return {
            reference: Fragment,
            source: ReferenceFragment,
            options: {
                is: isFn,
                on: onFn,
                mode
            }
        };
    }
}

const MutationFragment = Symbol("Mutation Fragment");
function isMutationFragmentVNode(node) {
    function isMutationFragmentVNodeLike(node) {
        return isFragmentVNode(node) && !!node.options;
    }
    return (isMutationFragmentVNodeLike(node) &&
        node.source === MutationFragment &&
        typeof node.options.is === "function" &&
        typeof node.options.mutate === "function");
}
function isMutationFragmentVNodeForVNode(node, referencedNode) {
    return (isMutationFragmentVNode(node) &&
        node.options.is(referencedNode));
}
function mutate(...args) {
    if (args.length >= 2 && typeof args[0] === "function" && typeof args[1] === "function") {
        return resolvedMutate(args[0], args[1], getMode(args[2]));
    }
    if (args.length >= 2 && isSourceReference(args[0]) && typeof args[1] === "function") {
        return resolvedMutate(isReferencedVNode.bind(undefined, args[0]), args[1], getMode(args[2]));
    }
    if (args.length >= 1 && typeof args[0] === "function") {
        return resolvedMutate((node) => true, args[0], getMode(args[1]));
    }
    throw new Error("Unexpected arguments");
    function getMode(value) {
        if (value === "child") {
            return value;
        }
        return "child";
    }
    function resolvedMutate(isFn, mutateFn, mode) {
        return {
            reference: Fragment,
            source: MutationFragment,
            options: {
                is: isFn,
                mutate: mutateFn,
                mode
            }
        };
    }
}

const IsolatedFragment = Symbol("Isolated Fragment");
function isIsolatedFragmentVNode(node) {
    return (isFragmentVNode(node) &&
        node.source === IsolatedFragment);
}

function hookFragments(fragments = [], depth = 0) {
    return async (node) => {
        let trackingFragments = fragments, trackingNode = node;
        if (isMutationFragmentVNode(node) || isReferenceFragmentVNode(node) || isIsolatedFragmentVNode(node)) {
            if (!node.children) {
                // We will never utilise the fragments, so we can ignore them for now
                return node;
            }
            trackingFragments = fragments.concat({ fragment: node, depth });
        }
        else {
            trackingNode = await run(node, fragments);
        }
        if (!trackingNode.children) {
            return trackingNode;
        }
        const nextHook = hooksFragmentChildren(trackingFragments, depth);
        return {
            ...trackingNode,
            children: nextHook(trackingNode.children)
        };
    };
}
function hooksFragmentChildren(fragments, depth) {
    const hook = hookFragments(fragments, depth + 1);
    return (updates) => {
        return asyncExtendedIterable(updates).map(children => asyncExtendedIterable(children).map(hook));
    };
}
async function run(node, fragments = []) {
    if (!fragments.length) {
        return node;
    }
    const isolated = fragments.filter(isIsolatedFragmentVNodeDescriptor);
    const isolatedDepth = isolated.reduce((depth, descriptor) => Math.min(depth, descriptor.depth), Number.POSITIVE_INFINITY);
    function isAllowedDepth(descriptor) {
        if (isolatedDepth === Number.POSITIVE_INFINITY) {
            return true;
        }
        return descriptor.depth >= isolatedDepth;
    }
    const mutators = fragments
        .filter(isMutationFragmentVNodeDescriptor)
        .filter(isAllowedDepth);
    const references = fragments
        .filter(isReferenceFragmentVNodeDescriptor)
        .filter(isAllowedDepth);
    // Reference before we mutate
    await reference(node, references);
    const mutated = await mutate(node, mutators);
    // If _any_ change is made then we will re-invoke our references
    // This is a very important point that we may invoke reference fragments multiple times with the same vnode
    //
    // The implementation will need to track whether the reference was found before
    //
    // Mutators should only be returning a new node instance if they have a change!
    if (mutated !== node) {
        await reference(mutated, references);
    }
    return mutated;
    function reference(node, fragments) {
        // Invoke all at once
        return Promise.all(fragments
            .map(descriptor => descriptor.fragment)
            .filter((fragment) => isReferenceFragmentVNodeForVNode(fragment, node))
            .map(fragment => fragment.options.on(node)));
    }
    async function mutate(node, mutators) {
        if (!mutators.length) {
            return node;
        }
        const currentMutators = mutators.slice();
        const nextMutator = currentMutators.shift();
        if (!isMutationFragmentVNodeForVNode(nextMutator.fragment, node)) {
            return mutate(node, currentMutators);
        }
        const nextValue = await nextMutator.fragment.options.mutate(node);
        return mutate(nextValue, mutators);
    }
}
function isIsolatedFragmentVNodeDescriptor(descriptor) {
    return isIsolatedFragmentVNode(descriptor.fragment);
}
function isMutationFragmentVNodeDescriptor(descriptor) {
    return isMutationFragmentVNode(descriptor.fragment);
}
function isReferenceFragmentVNodeDescriptor(descriptor) {
    return isReferenceFragmentVNode(descriptor.fragment);
}

export { IsolatedFragment, MutationFragment, ReferenceFragment, hookFragments, isIsolatedFragmentVNode, isMutationFragmentVNode, isMutationFragmentVNodeForVNode, isReferenceFragmentVNode, isReferenceFragmentVNodeForVNode, mutate, on };
