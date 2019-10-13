import { isNativeVNode, isFragmentVNode, isSourceReference, isScalarVNode, Fragment, isVNode } from './vnode.js';
import { asyncExtendedIterable, isPromise } from '../iterable.js';
import { directive, NodePart, createMarker, render, noChange, nothing } from '../lit-html.js';

const EXPERIMENT_onBeforeRender = Symbol("onBeforeRender");
const EXPERIMENT_getDocumentNode = Symbol("getDocumentNode");
const EXPERIMENT_attributes = Symbol("attributes");
function isAttributes(options) {
    function isAttributesLike(options) {
        return !!options;
    }
    return (isAttributesLike(options) &&
        typeof options.attributes === "object");
}
function isAttributesExperiment(options) {
    function isAttributesLike(options) {
        return !!options;
    }
    return (isAttributesLike(options) &&
        typeof options[EXPERIMENT_attributes] === "object");
}
function isOnBeforeRender(options) {
    function isOnBeforeRenderLike(options) {
        return !!options;
    }
    return (isOnBeforeRenderLike(options) &&
        typeof options.onBeforeRender === "function");
}
function isOnBeforeRenderExperiment(options) {
    function isOnBeforeRenderLike(options) {
        return !!options;
    }
    return (isOnBeforeRenderLike(options) &&
        typeof options[EXPERIMENT_onBeforeRender] === "function");
}
function isGetDocumentNode(options) {
    function isGetDocumentNodeLike(options) {
        return !!options;
    }
    return (isGetDocumentNodeLike(options) &&
        typeof options.getDocumentNode === "function");
}
function isGetDocumentNodeExperiment(options) {
    function isGetDocumentNodeLike(options) {
        return !!options;
    }
    return (isGetDocumentNodeLike(options) &&
        typeof options[EXPERIMENT_getDocumentNode] === "function");
}
function isExperimental(options) {
    function isExperimentalLike(options) {
        return !!options;
    }
    return !!(isExperimentalLike(options) &&
        (options[EXPERIMENT_attributes] ||
            options[EXPERIMENT_onBeforeRender] ||
            options[EXPERIMENT_getDocumentNode]));
}

const HydratedDOMNativeVNodeSymbol = Symbol("Hydrated DOM Native VNode");
function getHydratedDOMNativeVNode(node) {
    const nextNode = {
        ...node,
        hydrated: true,
        [HydratedDOMNativeVNodeSymbol]: true
    };
    if (!isHydratedDOMNativeVNode(nextNode)) {
        throw new Error("isHydratedDOMNativeVNode returned false when we expected it to return true");
    }
    return nextNode;
}
function isHydratedDOMNativeVNode(node) {
    function isHydratedDOMNativeVNodeLike(node) {
        return isDOMNativeVNode(node);
    }
    return (isHydratedDOMNativeVNodeLike(node) &&
        node[HydratedDOMNativeVNodeSymbol] === true);
}
function isDOMNativeVNode(node) {
    function isDOMNativeVNodeLike(node) {
        return isNativeVNode(node);
    }
    return (isDOMNativeVNodeLike(node) &&
        typeof node.source === "string" &&
        !!node.options &&
        typeof node.options.type === "string" &&
        (node.options.type === "Element" ||
            node.options.type === "Text") &&
        (!node.options.is ||
            isIsOptions(node.options)));
}
function isNativeCompatible(vnode) {
    return !!getNativeOptions(vnode);
}
function getNativeOptions(vnode) {
    if (isFragmentVNode(vnode)) {
        return undefined;
    }
    // Everything but a symbol can be a node, if you want to reference a symbol for a node, use a custom factory
    if (typeof vnode.source === "symbol" || !isSourceReference(vnode.source)) {
        return undefined;
    }
    // If we have no given options, then we have a text node
    if (isScalarVNode(vnode) && !vnode.options && typeof vnode.source !== "symbol") {
        return {
            type: "Text"
        };
    }
    // We can only create elements from string sources
    if (typeof vnode.source !== "string") {
        return undefined;
    }
    return {
        ...vnode.options,
        type: "Element",
        is: isIsOptions(vnode.options) ? vnode.options.is : undefined
    };
}
function native(options, children) {
    const nativeOptions = getNativeOptions(children);
    if (!nativeOptions) {
        return children;
    }
    else {
        return {
            source: String(children.source),
            reference: children.reference || Symbol("DOM Native"),
            native: true,
            options: nativeOptions,
            // We're going to git these children a few times, so we want to retain our values
            children: asyncExtendedIterable(children.children).retain()
        };
    }
}
function isIsOptions(options) {
    function isIsOptionsLike(options) {
        return !!options;
    }
    return (isIsOptionsLike(options) &&
        typeof options.is === "string");
}

function produce(node) {
    if (isDOMNativeVNode(node)) {
        return getHydratedDOMNativeVNode({
            ...node,
            children: produceChildren(node)
        });
    }
    else if (isNativeCompatible(node)) {
        return produce(native(undefined, node));
    }
    else {
        return {
            reference: Fragment,
            children: produceChildren(node)
        };
    }
}
async function* produceChildren(node) {
    for await (const children of node.children) {
        yield asyncExtendedIterable(children).map(child => produce(child));
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var __asyncValues = (undefined && undefined.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
/**
 * A directive that renders the items of an async iterable[1], appending new
 * values after previous values, similar to the built-in support for iterables.
 *
 * Async iterables are objects with a [Symbol.asyncIterator] method, which
 * returns an iterator who's `next()` method returns a Promise. When a new
 * value is available, the Promise resolves and the value is appended to the
 * Part controlled by the directive. If another value other than this
 * directive has been set on the Part, the iterable will no longer be listened
 * to and new values won't be written to the Part.
 *
 * [1]: https://github.com/tc39/proposal-async-iteration
 *
 * @param value An async iterable
 * @param mapper An optional function that maps from (value, index) to another
 *     value. Useful for generating templates for each item in the iterable.
 */
const asyncAppend = directive((value, mapper) => async (part) => {
    var e_1, _a;
    if (!(part instanceof NodePart)) {
        throw new Error('asyncAppend can only be used in text bindings');
    }
    // If we've already set up this particular iterable, we don't need
    // to do anything.
    if (value === part.value) {
        return;
    }
    part.value = value;
    // We keep track of item Parts across iterations, so that we can
    // share marker nodes between consecutive Parts.
    let itemPart;
    let i = 0;
    try {
        for (var value_1 = __asyncValues(value), value_1_1; value_1_1 = await value_1.next(), !value_1_1.done;) {
            let v = value_1_1.value;
            // Check to make sure that value is the still the current value of
            // the part, and if not bail because a new value owns this part
            if (part.value !== value) {
                break;
            }
            // When we get the first value, clear the part. This lets the
            // previous value display until we can replace it.
            if (i === 0) {
                part.clear();
            }
            // As a convenience, because functional-programming-style
            // transforms of iterables and async iterables requires a library,
            // we accept a mapper function. This is especially convenient for
            // rendering a template for each item.
            if (mapper !== undefined) {
                // This is safe because T must otherwise be treated as unknown by
                // the rest of the system.
                v = mapper(v, i);
            }
            // Like with sync iterables, each item induces a Part, so we need
            // to keep track of start and end nodes for the Part.
            // Note: Because these Parts are not updatable like with a sync
            // iterable (if we render a new value, we always clear), it may
            // be possible to optimize away the Parts and just re-use the
            // Part.setValue() logic.
            let itemStartNode = part.startNode;
            // Check to see if we have a previous item and Part
            if (itemPart !== undefined) {
                // Create a new node to separate the previous and next Parts
                itemStartNode = createMarker();
                // itemPart is currently the Part for the previous item. Set
                // it's endNode to the node we'll use for the next Part's
                // startNode.
                itemPart.endNode = itemStartNode;
                part.endNode.parentNode.insertBefore(itemStartNode, part.endNode);
            }
            itemPart = new NodePart(part.options);
            itemPart.insertAfterNode(itemStartNode);
            itemPart.setValue(v);
            itemPart.commit();
            i++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (value_1_1 && !value_1_1.done && (_a = value_1.return)) await _a.call(value_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});

function isNode(value) {
    function isNodeLike(value) {
        return !!value;
    }
    return (isNodeLike(value) &&
        typeof value.nodeType === "number" &&
        typeof value.TEXT_NODE === "number" &&
        typeof value.ELEMENT_NODE === "number");
}
function isText(node) {
    return isNode(node) && typeof node.nodeType === "number" && node.nodeType === node.TEXT_NODE;
}
function isElement(node) {
    return isNode(node) && typeof node.nodeType === "number" && node.nodeType === node.ELEMENT_NODE;
}
function isExpectedNode(expected, given) {
    if (!given) {
        return false;
    }
    if (expected.options.type === "Text") {
        return isText(given);
    }
    if (expected.options.type !== "Element") {
        throw new Error(`Expected Element or Text, received ${expected.options.type}`);
    }
    if (!isElement(given)) {
        return false;
    }
    return expected.source === given.localName;
}
async function getDocumentNode(root, node) {
    if (typeof node.options[EXPERIMENT_getDocumentNode] === "function") {
        let result = node.options[EXPERIMENT_getDocumentNode](root, node);
        if (isPromise(result)) {
            result = await result;
        }
        if (result) {
            if (!isExpectedNode(node, result)) {
                if (node.options.type === "Text") {
                    throw new Error(`Expected getDocumentNode to return a Text node`);
                }
                else if (node.options.type === "Element") {
                    throw new Error(`Expected getDocumentNode to return an Element node with the localName ${node.source}, but didn't receive this`);
                }
                else {
                    throw new Error(`getDocumentNode returned an unexpected node type, expected ${node.options.type}, see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType`);
                }
            }
            return result;
        }
    }
    if (node.options.type === "Text") {
        if (isText(node.options.instance)) {
            return node.options.instance;
        }
        return root.ownerDocument.createTextNode(node.source);
    }
    if (node.options.type !== "Element") {
        throw new Error("type must be Text or Element");
    }
    if (isElement(node.options.instance)) {
        return node.options.instance;
    }
    if (node.options.whenDefined && root.ownerDocument.defaultView.customElements && root.ownerDocument.defaultView.customElements.whenDefined) {
        await root.ownerDocument.defaultView.customElements.whenDefined(node.source);
    }
    return root.ownerDocument.createElement(node.source, { is: node.options.is });
}

function setAttributes(node, documentNode) {
    const attributes = node.options[EXPERIMENT_attributes];
    if (!attributes) {
        return;
    }
    const keys = Object.keys(attributes);
    const lowerKeys = keys.map(key => key.toLowerCase());
    const duplicates = lowerKeys.filter((value, index, array) => {
        const before = array.slice(0, index);
        return before.includes(value);
    });
    if (duplicates.length) {
        throw new Error(`Duplicate keys found for ${duplicates.join(", ")}, this will lead to unexpected behaviour, and is not supported`);
    }
    // Don't use lower keys here as we need to access attributes
    keys.forEach(key => {
        documentNode.setAttribute(key, attributes[key]);
    });
    const attributesLength = documentNode.attributes.length;
    // Assume we set all of these attributes, and don't need to check further if there
    if (attributesLength === keys.length) {
        return;
    }
    const toRemove = [];
    for (let attributeIndex = 0; attributeIndex < attributesLength; attributeIndex += 1) {
        const attribute = documentNode.attributes.item(attributeIndex);
        if (lowerKeys.includes(attribute.name)) {
            continue;
        }
        toRemove.push(attribute.name);
    }
    toRemove.forEach(key => documentNode.removeAttribute(key));
}

function isWithPromiseContext(value) {
    function isWithPromiseContextLike(value) {
        return !!value;
    }
    return !!(isWithPromiseContextLike(value) &&
        value.context &&
        Array.isArray(value.within));
}
class AsyncContext {
    constructor() {
        this.promises = [];
    }
    pushPromise(promise, context) {
        const newPromise = !context ? promise : promise.catch(error => {
            if (isWithPromiseContext(error)) {
                // Re-throw, it has the original info
                error.within.push(context);
                throw error;
            }
            const newError = new Error(error);
            newError.context = context;
            newError.originalError = error;
            newError.within = [];
            throw newError;
        });
        this.promises.push(newPromise);
        // Catch unhandled errors, we _will_ grab these
        newPromise.catch(() => { });
    }
    async flush() {
        do {
            const currentPromises = this.promises.slice();
            await Promise.all(currentPromises);
            this.promises = this.promises.filter(promise => !currentPromises.includes(promise));
        } while (this.promises.length);
    }
}
async function litRender(initialNode, container) {
    if (!initialNode) {
        return;
    }
    const asyncContext = new AsyncContext();
    const produced = produce(initialNode);
    const documentNodes = new WeakMap();
    if (isFragmentVNode(produced)) {
        render(fragment(container, produced, asyncContext, documentNodes), container);
    }
    else if (isHydratedDOMNativeVNode(produced)) {
        render(node(container, produced, asyncContext, documentNodes), container);
    }
    await asyncContext.flush();
}
function fragment(container, produced, asyncContext, documentNodes) {
    let previousPromise = undefined;
    return asyncReplace(produced.children, async (children, index, asyncContext) => {
        if (previousPromise) {
            await previousPromise;
            previousPromise = undefined;
        }
        return wrapAsyncDirective(asyncAppend, asyncContext, nextPromise => previousPromise = nextPromise, { node: produced, from: "asyncAppend" })(children, child => {
            if (!isVNode(child)) {
                return nothing;
            }
            if (isFragmentVNode(child)) {
                return fragment(container, child, asyncContext, documentNodes);
            }
            else if (isHydratedDOMNativeVNode(child)) {
                return node(container, child, asyncContext, documentNodes);
            }
            else {
                return nothing;
            }
        });
    }, asyncContext);
}
function node(root, node, context, documentNodes) {
    return wrapAsyncDirective(directive(() => part => run(part)), context)();
    async function run(part) {
        const documentNode = await getNode();
        if (isElement(documentNode)) {
            // Set attributes here, this will mean by the time we get to commit, it will change the attributes
            //
            // If this isn't the first time this document node was rendered, it will be changing a live DOM node
            setAttributes(node, documentNode);
        }
        if (node.options[EXPERIMENT_onBeforeRender]) {
            // This happens _before_ mount, it only provides a way
            const result = node.options[EXPERIMENT_onBeforeRender](documentNode);
            if (isPromise(result)) {
                await result;
            }
        }
        part.setValue(documentNode);
        part.commit();
        if (!isElement(documentNode) || !node.children) {
            return;
        }
        context.pushPromise(litRender({ reference: Fragment, children: node.children }, documentNode), { node, from: "child render" });
    }
    async function getNode() {
        // Node is checked directly, but it needs to be in the global scope for this to work
        // https://github.com/Polymer/lit-html/blob/master/src/lib/parts.ts#L310
        const currentDocumentNode = documentNodes.get(node);
        if (currentDocumentNode) {
            // We already had one for this object, so retain and use again
            return currentDocumentNode;
        }
        const documentNode = await getDocumentNode(root, node);
        documentNodes.set(node, documentNode);
        return documentNode;
    }
}
function wrapAsyncDirective(fn, context, onPromise, promiseContext) {
    return directive((...args) => {
        const nextFn = fn(...args);
        return (part) => {
            // Set to noChange, this can be reset by implementation no issues
            part.setValue(noChange);
            const result = nextFn(part);
            if (isPromise(result)) {
                context.pushPromise(result, promiseContext);
                if (onPromise) {
                    onPromise(result);
                }
            }
            return result;
        };
    });
}
// This is a near clone of https://github.com/Polymer/lit-html/blob/master/src/directives/async-replace.ts
// However we want to both collect promises, and flush promises after each commit
const asyncReplace = directive((value, mapper, givenContext) => (part) => {
    givenContext.pushPromise(run());
    async function run() {
        if (!(part instanceof NodePart)) {
            throw new Error("asyncReplace can only be used in text bindings");
        }
        // If we've already set up this particular iterable, we don't need
        // to do anything.
        if (value === part.value) {
            return;
        }
        const context = new AsyncContext();
        // We nest a new part to keep track of previous item values separately
        // of the iterable as a value itself.
        const itemPart = new NodePart(part.options);
        part.value = value;
        let i = 0;
        for await (let v of value) {
            // Check to make sure that value is the still the current value of
            // the part, and if not bail because a new value owns this part
            if (part.value !== value) {
                break;
            }
            // When we get the first value, clear the part. This let's the
            // previous value display until we can replace it.
            if (i === 0) {
                part.clear();
                itemPart.appendIntoPart(part);
            }
            if (mapper !== undefined) {
                v = await mapper(v, i, context);
            }
            itemPart.setValue(v);
            itemPart.commit();
            i++;
            // Wait for this context to be ready for the next render
            await context.flush();
        }
    }
});

export { EXPERIMENT_attributes, EXPERIMENT_getDocumentNode, EXPERIMENT_onBeforeRender, getHydratedDOMNativeVNode, isAttributes, isAttributesExperiment, isDOMNativeVNode, isExperimental, isGetDocumentNode, isGetDocumentNodeExperiment, isHydratedDOMNativeVNode, isNativeCompatible, isOnBeforeRender, isOnBeforeRenderExperiment, litRender, native };
