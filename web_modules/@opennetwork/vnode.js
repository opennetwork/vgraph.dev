import { isAsyncIterable, isIterable, asyncExtendedIterable, isPromise, asyncIterable, isIterableIterator, getNext, source } from '../iterable.js';

/**
 * Indicates if a value is a {@link MarshalledSourceReference}
 * @param value
 */
function isMarshalledSourceReference(value) {
    return (typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean");
}
/**
 * Indicates if a value is a {@link SourceReference}
 * @param value
 */
function isSourceReference(value) {
    return (typeof value === "symbol" ||
        isMarshalledSourceReference(value));
}

/**
 * `unique symbol` to represent a {@link FragmentVNode}, this will be used on the {@link VNode.reference} property.
 * The {@link FragmentVNode} should be ignored and the {@link VNode.children} values should be used in its place
 */
const Fragment = Symbol.for("@opennetwork/vnode/fragment");

function isVNodeLike(value) {
    return typeof value === "object";
}
/**
 * Indicates if a value is a {@link VNode}
 * @param value
 */
function isVNode(value) {
    return !!(isVNodeLike(value) &&
        isSourceReference(value.reference) &&
        (!value.children ||
            isAsyncIterable(value.children)) &&
        (!value.options ||
            typeof value.options === "object"));
}
/**
 * Indicates if a value is a {@link HydratedVNode}
 * @param value
 */
function isHydratedVNode(value) {
    function isHydratedVNodeLike(value) {
        return isVNode(value);
    }
    return (isHydratedVNodeLike(value) &&
        value.hydrated === true);
}
/**
 * Indicates if a value is a {@link NativeVNode}
 * @param value
 */
function isNativeVNode(value) {
    function isNativeVNodeLike(value) {
        return isVNode(value);
    }
    return (isNativeVNodeLike(value) &&
        value.native === true);
}
/**
 * Indicates if a value is a {@link ScalarVNode}
 * @param value
 */
function isScalarVNode(value) {
    function isScalarVNodeLike(value) {
        return isVNode(value);
    }
    return (isScalarVNodeLike(value) &&
        isSourceReference(value.source) &&
        value.scalar === true);
}
/**
 * Indicates if a value is a {@link FragmentVNode}
 * @param value
 */
function isFragmentVNode(value) {
    return (isVNode(value) &&
        value.reference === Fragment);
}
/**
 * Indicates if a valid is a {@link MarshalledVNode}
 * @param value
 */
function isMarshalledVNode(value) {
    return (isVNodeLike(value) &&
        (!value.reference ||
            isSourceReference(value.reference)) &&
        // If we don't have children, then we have a normal VNode
        isIterable(value.children) &&
        (!value.options ||
            typeof value.options === "object"));
}

async function* childrenUnion(childrenGroups) {
    yield asyncExtendedIterable(childrenGroups)
        .map(children => ({
        reference: Fragment,
        children
    }));
}
async function* children(createVNode, context, ...source) {
    if (context.children) {
        const result = context.children(source);
        if (result) {
            return yield* result;
        }
    }
    async function* eachSource(source) {
        if (isPromise(source)) {
            return yield* eachSource(await source);
        }
        if (isVNode(source)) {
            return yield asyncIterable([
                source
            ]);
        }
        // These need further processing through createVNodeWithContext
        if (isSourceReference(source) || isMarshalledVNode(source) || isIterableIterator(source)) {
            return yield* eachSource(createVNode(context, source));
        }
        return yield* childrenUnion(asyncExtendedIterable(source).map(source => children(createVNode, context, source)));
    }
    if (source.length === 1) {
        return yield* eachSource(source[0]);
    }
    else {
        return yield* childrenUnion(asyncExtendedIterable(source).map(source => eachSource(source)));
    }
}

/**
 * Generates instances of {@link FragmentVNode} based on the provided source
 *
 * See {@link Source} for an explanation on each type and how they are represented as a {@link VNode}
 *
 * The provided {@link VContext} may override this functionality, possibly resulting in a {@link NativeVNode}
 *
 * The special case to point out here is if the source is an `IterableIterator` (see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#Is_a_generator_object_an_iterator_or_an_iterable})
 * then each iteration will result in a new {@link VNode} being created
 *
 * @param context
 * @param source
 * @param options
 * @param children
 */
function createVNodeWithContext(context, source, options, ...children$1) {
    /**
     * Allow {@link VContext} to override the _createVNode_ process
     *
     * This is where a context would inject its native types
     *
     * The result returned is either going to be an `AsyncIterable` or `undefined`
     *
     * If it is `undefined` the context is indicating that we can continue as normal
     */
    if (typeof context.createVNode === "function") {
        const result = context.createVNode(source, options);
        if (result) {
            return result;
        }
    }
    /**
     * If the source is a function we're going to invoke it as soon as possible with the provided options
     *
     * The function _may_ return any other kind of source, so we need to start our process again
     */
    if (source instanceof Function) {
        return {
            reference: Fragment,
            children: functionGenerator(source)
        };
    }
    /**
     * Only if the source is a promise we want to await it
     *
     * This may be wasteful, but the idea is that we wouldn't cause a next tick for no reason
     * Maybe this isn't the case if the value isn't a promise to start with ¯\_(ツ)_/¯
     */
    if (isPromise(source)) {
        return {
            reference: Fragment,
            children: promiseGenerator(source)
        };
    }
    /**
     * If we have a fragment then we want to pass it back through our function so the next
     * statement is invoked to handle fragments with children
     */
    if (source === Fragment) {
        return createVNodeWithContext(context, { reference: Fragment }, options, ...children$1);
    }
    /**
     * This allows fragments to be extended with children
     */
    if (isFragmentVNode(source) && !source.children) {
        // If a fragment has no children then we will attach our children to it
        return {
            ...source,
            children: children(createVNodeWithContext, context, ...children$1)
        };
    }
    /**
     * If we already have a {@link VNode} then we don't and can't do any more
     */
    if (isVNode(source)) {
        return source;
    }
    /**
     * If we already have a {@link MarshalledVNode} then we need to turn its children into an async iterable
     * and ensure they're unmarshalled
     */
    if (isMarshalledVNode(source)) {
        return {
            reference: Fragment,
            children: unmarshalGenerator(source)
        };
    }
    const reference = getReference(context, options);
    /**
     * A source reference may be in reference to a context we don't know about, this can be resolved from
     * external contexts by rolling through the {@link VNode} state, or watching context events
     *
     * This could be used by analytics tracking for tags that show up
     *
     * Either way, if we have a source reference, we have a primitive value that we can look up later on
     */
    if (isSourceReference(source)) {
        return {
            reference: Fragment,
            children: sourceReferenceGenerator(reference, source, options, ...children$1)
        };
    }
    /**
     * Here is our nice `IterableIterator` that allows us to produce multiple versions for the same source
     *
     * See {@link generator} for details
     */
    if (isIterableIterator(source)) {
        return {
            reference: Fragment,
            children: generator(Symbol("Iterable Iterator"), source)
        };
    }
    /**
     * This will cover `Array`, `Set`, `Map`, and anything else implementing `Iterable` or `AsyncIterable`
     *
     * We will create a `Fragment` that holds our node state to grab later
     */
    if (isIterable(source) || isAsyncIterable(source)) {
        const childrenInstance = children(createVNodeWithContext, context, ...children$1);
        return {
            reference: Fragment,
            children: children(createVNodeWithContext, context, asyncExtendedIterable(source).map(value => createVNodeWithContext(context, value, options, childrenInstance)))
        };
    }
    /**
     * Allows for `undefined`, an empty `VNode`
     */
    if (!source) {
        return { reference: Fragment };
    }
    /**
     * We _shouldn't_ get here AFAIK, each kind of source should have been dealt with by the time we get here
     */
    throw new Error("Unexpected VNode source provided");
    /**
     * Iterates through an `IterableIterator` to generate new {@link VNode} instances
     *
     * This allows an implementor to decide when their node returns state, including pushing new values _as they arrive_
     *
     * {@link getNext} provides an error boundary if the `IterableIterator` provides a `throw` function
     *
     * @param newReference
     * @param reference
     */
    async function* generator(newReference, reference) {
        const childrenInstance = children(createVNodeWithContext, context, ...children$1);
        let next;
        do {
            next = await getNext(reference, newReference);
            if (next.done) {
                continue;
            }
            const node = createVNodeWithContext(context, next.value, options, childrenInstance);
            if (!isFragmentVNode(node) || !node.children) {
                // Let it do its thing
                yield asyncIterable([node]);
                continue;
            }
            // Flatten it out a little as we can match the expected structure
            for await (const children of node.children) {
                yield children;
            }
        } while (!next.done);
    }
    async function* promiseGenerator(promise) {
        const result = await promise;
        yield asyncIterable([
            createVNodeWithContext(context, result, options, ...children$1)
        ]);
    }
    async function* functionGenerator(source) {
        const nextSource = source(options, {
            reference: Fragment,
            children: children(createVNodeWithContext, context, ...children$1)
        });
        yield asyncIterable([
            createVNodeWithContext(context, nextSource, options, undefined)
        ]);
    }
    async function* unmarshalGenerator(source) {
        yield asyncIterable([
            unmarshal(source)
        ]);
        function unmarshal(source) {
            if (isSourceReference(source)) {
                return sourceReferenceVNode(getReference(context), source);
            }
            if (!isMarshalledVNode(source)) {
                return source;
            }
            return {
                ...source,
                // Replace our reference if required
                reference: isSourceReference(source.reference) ? getMarshalledReference(context, source.reference) : getReference(context, source.options),
                children: asyncExtendedIterable(source.children).map(children => asyncExtendedIterable(children).map(unmarshal).toIterable()).toIterable()
            };
        }
    }
    async function* sourceReferenceGenerator(reference, source, options, ...children) {
        yield asyncIterable([
            sourceReferenceVNode(reference, source, options, ...children)
        ]);
    }
    function sourceReferenceVNode(reference, source, options, ...children$1) {
        return {
            reference: reference || getReference(context, options),
            scalar: true,
            source: source,
            options,
            children: children(createVNodeWithContext, context, ...children$1)
        };
    }
}
function getMarshalledReference(context, reference) {
    if (context.reference) {
        return context.reference(reference);
    }
    return reference;
}
function getReference(context, options) {
    const fromOptions = getReferenceFromOptions(options);
    const fromContext = context.reference ? context.reference(fromOptions) : fromOptions;
    return fromContext || Symbol("@opennetwork/vnode");
}
function isReferenceOptions(options) {
    function isReferenceOptionsLike(options) {
        return options && options.hasOwnProperty("reference");
    }
    return (isReferenceOptionsLike(options) &&
        isSourceReference(options.reference));
}
function getReferenceFromOptions(options) {
    if (!isReferenceOptions(options)) {
        return undefined;
    }
    return options.reference;
}

function createVContextEvents() {
    const target = {
        createVNode: source(),
        children: source(),
        hydrate: source()
    };
    return {
        target,
        events: {
            createVNode: asyncIterable(target.createVNode),
            children: asyncIterable(target.children),
            hydrate: asyncIterable(target.hydrate)
        }
    };
}

class WeakVContext {
    constructor(weak) {
        this.weak = weak || new WeakMap();
        const { events, target } = createVContextEvents();
        this.events = events;
        this.eventsTarget = target;
    }
    createVNode(source, options) {
        this.eventsTarget.createVNode.push({
            source,
            options
        });
        return undefined;
    }
    children(children) {
        this.eventsTarget.children.push({
            children
        });
        return undefined;
    }
    hydrate(node, tree) {
        this.eventsTarget.hydrate.push({
            node,
            tree
        });
        return Promise.resolve();
    }
    close() {
        this.eventsTarget.children.close();
        this.eventsTarget.hydrate.close();
        this.eventsTarget.createVNode.close();
        return Promise.resolve();
    }
}

/**
 * Hydrates a group of children obtained from {@link VNode.children}
 *
 * Children are hydrated in parallel, this means we aren't blocking sibling children from hydrating
 *
 * @param context
 * @param node
 * @param tree
 * @param children
 */
async function hydrateChildrenGroup(context, node, tree, children) {
    /**
     * We want to grab the snapshot of the current children into an array
     * This allows us to trigger the entire tree to hydrate at the same time meaning
     * we don't need to wait for "slow" nodes
     *
     * Get us much done as we can as quick as we can
     */
    const childrenArray = await asyncExtendedIterable(children).toArray();
    /**
     * Create a tree so that hydrators can "figure out" where they are
     *
     * We want this information to be as simple as possible, which means only
     * recording the references being used
     * rather than passing vnode references around
     *
     * We want those vnodes to be as weakly referenced as possible because
     * they're just a state snapshot
     */
    const nextTree = Object.freeze({
        children: Object.freeze(childrenArray
            .map(child => child ? child.reference : undefined)),
        parent: tree,
        reference: node.reference
    });
    /**
     * Wait for all children to hydrate
     */
    await Promise.all(childrenArray.map(child => hydrate(context, child, nextTree)));
}
/**
 * This will continue until there are no more generated children for the given {@link VNode}
 *
 * This allows values to be hydrated every time there is a new group of children instances
 *
 * At a top level this means that if we still have children being generated, we're still
 * going to be waiting for it to complete, if you need only one group of children to be hydrated then
 * use {@link hydrateChildrenGroup}
 *
 * @param context
 * @param node
 * @param tree
 */
async function hydrateChildren(context, node, tree) {
    if (!node.children) {
        return;
    }
    for await (const nextChildren of node.children) {
        await hydrateChildrenGroup(context, node, tree, nextChildren);
    }
}
/**
 * If available, invokes {@link VContext.hydrate} with the given {@link VNode} and {@link Tree}
 *
 * The {@link VContext} is expected to hydrate the associated {@link VNode.children} when required
 *
 * @param context
 * @param node
 * @param tree
 */
async function hydrate(context, node, tree) {
    if (!context.hydrate || !node) {
        return;
    }
    return context.hydrate(node, tree);
}

/**
 * Marshals a VNode into a synchronous state allowing for transmission or storage
 *
 * This involves two parts:
 *
 * - All references will be turned into a `number`, or if a `getReference` `function` is passed, a `number`, `string`, or `boolean`
 * - All children will be represented as an array of arrays, where the values have also passed through the marshal process
 *
 * This process only changes the representation of {@link VNode.reference} and {@link VNode.children}, this means that if
 * something like a `Symbol` is used then it will be lost when the value is finally serialised, these cases must be handled
 * by the consumer of this function
 *
 * @param node
 * @param parent
 * @param getReference
 */
async function marshal(node, parent, getReference) {
    /**
     * If no parent is passed this will be a process unique reference, meaning we can use it to start off our reference generation
     */
    const rootParent = Symbol("Root");
    const { reference: currentReference, ...nodeBase } = node;
    /**
     * This will be our marshalled reference for the current node, this will be passed down to children to have a context
     * reference for further reference generation
     */
    const reference = getReferenceInternal(parent, currentReference);
    const children = await asyncExtendedIterable(node.children || []).map(children => asyncExtendedIterable(children || []).map(child => marshal(child, reference, getReferenceInternal)).toArray()).toArray();
    const marshalled = {
        ...nodeBase,
        children
    };
    if (reference) {
        marshalled.reference = reference;
    }
    return marshalled;
    /**
     * This is a template for `getReference`, something similar would be expected of an implementor of said function,
     * we want a unique reference across each child, children across {@link VNode} values can have the same reference
     *
     * @param parent
     * @param sourceReference
     */
    function getReferenceInternal(parent, sourceReference) {
        if (getReference) {
            const value = getReference(parent || rootParent, sourceReference);
            if (value && !isMarshalledSourceReference(value)) {
                throw new Error(`getReference returned a value that wasn't string, number, or boolean, which is not expected`);
            }
            return value;
        }
        if (typeof sourceReference === "symbol") {
            return undefined;
        }
        return sourceReference;
    }
}

/**
 * Generates instances of {@link VNode} based on the provided source
 *
 * See {@link createVNodeWithContext}
 *
 * @param context
 * @param source
 * @param options
 * @param children
 */
function createVNode(context, source, options, ...children) {
    return createVNodeWithContext(context, source, options, ...children);
}
/**
 * Binds {@link createVNode} to the given context
 *
 * The returned function matches {@link createVNode} in both arguments and return type
 * If a context is given to the returned function, it will override the bound context
 *
 * @param context
 */
function withContext(context) {
    return function createVNodeWithContext(source, options, ...children) {
        return createVNode(context, source, options, ...children);
    };
}

export { Fragment, WeakVContext, children, createVContextEvents, createVNode, createVNodeWithContext, hydrate, hydrateChildren, hydrateChildrenGroup, isFragmentVNode, isHydratedVNode, isMarshalledSourceReference, isMarshalledVNode, isNativeVNode, isScalarVNode, isSourceReference, isVNode, marshal, withContext };
