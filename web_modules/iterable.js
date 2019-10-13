function asyncIterator(value) {
    return asyncIterable(value)[Symbol.asyncIterator]();
}
function asyncIterable(value) {
    if (isAsyncIterable(value)) {
        return value;
    }
    return {
        [Symbol.asyncIterator]: async function* () {
            if (!isIterable(value)) {
                return;
            }
            for (const item of value) {
                yield item;
            }
        }
    };
}
function isAsyncIterable(value) {
    function isAsyncIterableInstance(value) {
        return !!value;
    }
    return !!(isAsyncIterableInstance(value) &&
        value[Symbol.asyncIterator] instanceof Function);
}
function isIterable(value) {
    function isIterableInstance(value) {
        return !!value;
    }
    return !!(isIterableInstance(value) &&
        value[Symbol.iterator] instanceof Function);
}
function isIterableIterator(value) {
    function isIteratorLike(value) {
        return typeof value === "object";
    }
    return (isIteratorLike(value) &&
        value.next instanceof Function &&
        (isAsyncIterable(value) ||
            isIterable(value)));
}
function isPromise(value) {
    function isPromiseLike(value) {
        return typeof value === "object";
    }
    return (isPromiseLike(value) &&
        value.then instanceof Function);
}
async function getNext(iterator, value) {
    let next;
    try {
        next = iterator.next(value);
        if (isPromise(next)) {
            next = await next;
        }
        if (next.done) {
            if (iterator.return) {
                next = iterator.return(value);
                if (isPromise(next)) {
                    next = await next;
                }
            }
        }
        return next;
    }
    catch (e) {
        if (!iterator.throw) {
            throw e;
        }
        next = iterator.throw(e);
        if (isPromise(next)) {
            next = await next;
        }
        return next;
    }
}

async function asyncDrain(iterable) {
    if (!iterable) {
        return;
    }
    const iterator = asyncIterator(iterable);
    let next, anyValue = false;
    do {
        next = await iterator.next();
        anyValue = anyValue || !next.done;
    } while (!next.done);
    return anyValue;
}
function drain(iterable) {
    if (!iterable) {
        return;
    }
    const iterator = iterable[Symbol.iterator]();
    let next, anyValue = false;
    do {
        next = iterator.next();
        anyValue = anyValue || !next.done;
    } while (!next.done);
    return anyValue;
}

function negateIfNeeded(negate, value) {
    return negate ? !value : value;
}
function* filterNegatable(iterable, callbackFn, negate = false, thisValue, parent) {
    for (const value of iterable) {
        if (negateIfNeeded(negate, callbackFn.call(thisValue, value, parent))) {
            yield value;
        }
    }
}
async function* asyncFilterNegatable(iterable, callbackFn, negate = false, thisValue, parent) {
    for await (const value of asyncIterable(iterable)) {
        if (negateIfNeeded(negate, await callbackFn.call(thisValue, value, parent))) {
            yield value;
        }
    }
}
function filter(iterable, callbackFn, thisValue, parent) {
    return filterNegatable(iterable, callbackFn, false, thisValue, parent);
}
function asyncFilter(iterable, callbackFn, thisValue, parent) {
    return asyncFilterNegatable(iterable, callbackFn, false, thisValue, parent);
}

function except(iterable, callbackFn, thisValue, parent) {
    return filterNegatable(iterable, callbackFn, true, thisValue, parent);
}
function asyncExcept(iterable, callbackFn, thisValue, parent) {
    return asyncFilterNegatable(iterable, callbackFn, true, thisValue, parent);
}

function hasAny(iterable) {
    const iterator = iterable[Symbol.iterator]();
    const result = iterator.next();
    return !result.done;
}
async function asyncHasAny(iterable) {
    const iterator = asyncIterable(iterable)[Symbol.asyncIterator]();
    const result = await iterator.next();
    return !result.done;
}

function every(iterable, callbackFn, thisValue, parent) {
    const iterableResult = except(iterable, callbackFn, thisValue, parent);
    return !hasAny(iterableResult);
}
async function asyncEvery(iterable, callbackFn, thisValue, parent) {
    const iterableResult = asyncExcept(iterable, callbackFn, thisValue, parent);
    return !await asyncHasAny(iterableResult);
}

function forEach(iterable, callbackFn, thisValue, parent) {
    for (const value of iterable) {
        callbackFn.call(thisValue, value, parent);
    }
}
async function forEachAsync(iterable, callbackFn, thisValue, parent) {
    for await (const value of asyncIterable(iterable)) {
        await callbackFn.call(thisValue, value, parent);
    }
}

function* map(iterable, callbackFn, thisValue, parent) {
    for (const value of iterable) {
        yield callbackFn.call(thisValue, value, parent);
    }
}
async function* asyncMap(iterable, callbackFn, thisValue, parent) {
    for await (const value of asyncIterable(iterable)) {
        yield callbackFn.call(thisValue, value, parent);
    }
}

function reduce(iterable, callbackFn, initialValue, thisValue, parent) {
    let accumulator = initialValue;
    for (const value of iterable) {
        if (accumulator == undefined) {
            accumulator = value;
            continue;
        }
        accumulator = callbackFn.call(thisValue, accumulator, value, parent);
    }
    return accumulator;
}
async function asyncReduce(iterable, callbackFn, initialValue, thisValue, parent) {
    let accumulator = initialValue;
    for await (const value of asyncIterable(iterable)) {
        if (accumulator == undefined) {
            accumulator = value;
            continue;
        }
        accumulator = await callbackFn.call(thisValue, accumulator, value, parent);
    }
    return accumulator;
}

function some(iterable, callbackFn, thisValue, parent) {
    const iterableResult = filter(iterable, callbackFn, thisValue, parent);
    return hasAny(iterableResult);
}
async function asyncSome(iterable, callbackFn, thisValue, parent) {
    const iterableResult = asyncFilter(iterable, callbackFn, thisValue, parent);
    return asyncHasAny(iterableResult);
}

function* union(left, right) {
    for (const value of left) {
        yield value;
    }
    for (const value of right) {
        yield value;
    }
}
async function* asyncUnion(left, right) {
    for await (const value of asyncIterable(left)) {
        yield value;
    }
    for await (const value of asyncIterable(right)) {
        yield value;
    }
}

function arrayRetainer(has) {
    const values = [];
    return {
        add: value => {
            if (has && has(value, values)) {
                return;
            }
            values.push(value);
        },
        [Symbol.iterator]: () => values[Symbol.iterator]()
    };
}
function setRetainer() {
    return new Set();
}
function retain(iterable, retainer = arrayRetainer()) {
    const iterator = iterable[Symbol.iterator]();
    function* generator() {
        for (const value of retainer) {
            yield value;
        }
        let next;
        do {
            next = iterator.next();
            if (next.done) {
                continue;
            }
            // If we're not adding it to our retainer, then the value
            // will never be added in the same order
            // this means that when the iterable is run again, that values
            // will show up in _a different order_
            //
            // This is no good for ordered sets
            //
            // Specifically MDN describes a sets iterator as:
            //
            // Set.prototype[@@iterator]()
            // Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
            //
            // We should follow that if it is available
            if (retainer.has && retainer.has(next.value)) {
                continue;
            }
            retainer.add(next.value);
            yield next.value;
        } while (!next.done);
    }
    return {
        [Symbol.iterator]: generator
    };
}
function asyncRetain(iterable, retainer = arrayRetainer()) {
    const iterator = asyncIterator(iterable);
    async function* generator() {
        for await (const value of asyncIterable(retainer)) {
            yield value;
        }
        let next;
        do {
            next = await iterator.next();
            if (next.done) {
                continue;
            }
            // See explanation @ sync version of retain
            if (retainer.has && await retainer.has(next.value)) {
                continue;
            }
            await retainer.add(next.value);
            yield next.value;
        } while (!next.done);
    }
    return {
        [Symbol.asyncIterator]: generator
    };
}

function toArray(iterable) {
    return Array.from(iterable);
}
async function asyncToArray(iterable) {
    const result = [];
    for await (const value of asyncIterable(iterable)) {
        result.push(value);
    }
    return result;
}

function mask(iterable, maskIterable) {
    return maskReversible(iterable, maskIterable, false);
}
function asyncMask(iterable, maskIterable) {
    return asyncMaskReversible(iterable, maskIterable, false);
}
function* maskReversible(iterable, maskIterable, reverse = false) {
    const iterator = iterable[Symbol.iterator]();
    const maskIterator = maskIterable[Symbol.iterator]();
    let next, nextMask;
    do {
        nextMask = maskIterator.next();
        if (reverse === true && nextMask.done) {
            break;
        }
        next = iterator.next();
        if (next.done) {
            break;
        }
        // if `reverse` is `true` and if `maskIterable` returns `true` then I want the value to be used, if it is `done` then I want to finish
        if (reverse === true && nextMask.value === true) {
            yield next.value;
        }
        // if reverse is false and if maskIterable returns `true` then I want the value to be skipped, if it is `done` then I want to finish
        if (reverse === false && nextMask.value !== true) {
            yield next.value;
        }
    } while (!next.done);
    if (iterator.return) {
        iterator.return();
    }
}
async function* asyncMaskReversible(iterable, maskIterable, reverse = false) {
    const iterator = asyncIterator(iterable);
    const maskIterator = asyncIterator(maskIterable);
    let next, nextMask;
    do {
        nextMask = await maskIterator.next();
        // If we have reversed, then as soon as mask
        if (reverse && nextMask.done) {
            break;
        }
        next = await iterator.next();
        if (next.done) {
            break;
        }
        // If no value, we're done
        // If mask has a value, we want to ignore
        if (nextMask.value !== reverse) {
            continue;
        }
        yield next.value;
    } while (!next.done);
    if (iterator.return) {
        await iterator.return();
    }
}
function* skip(count) {
    for (let remaining = count; remaining > 0; remaining -= 1) {
        yield true;
    }
}
function* take(count) {
    for (let remaining = count; remaining > 0; remaining -= 1) {
        yield true;
    }
}

function* flatMap(iterable, callbackFn, thisValue, parent) {
    for (const value of iterable) {
        const newIterable = callbackFn.call(thisValue, value, parent);
        for (const value of newIterable) {
            yield value;
        }
    }
}
async function* asyncFlatMap(iterable, callbackFn, thisValue, parent) {
    for await (const value of asyncIterable(iterable)) {
        const newIterable = await callbackFn.call(thisValue, value, parent);
        for await (const value of asyncIterable(newIterable)) {
            yield value;
        }
    }
}

function distinctRetainer(equalityFn) {
    if (!equalityFn) {
        return new Set();
    }
    const values = [];
    return {
        has(value) {
            for (const otherValue of values) {
                if (equalityFn(otherValue, value)) {
                    return true;
                }
            }
            return false;
        },
        add(value) {
            values.push(value);
        },
        [Symbol.iterator]: values[Symbol.iterator].bind(values)
    };
}
function* distinct(iterable, equalityFn) {
    const retainer = distinctRetainer(equalityFn);
    for (const value of iterable) {
        if (retainer.has(value)) {
            continue;
        }
        retainer.add(value);
        yield value;
    }
}
function asyncDistinctRetainer(equalityFn) {
    if (!equalityFn) {
        return setRetainer();
    }
    const values = [];
    return {
        async has(value) {
            for (const otherValue of values) {
                if (await equalityFn(otherValue, value)) {
                    return true;
                }
            }
            return false;
        },
        async add(value) {
            values.push(value);
        },
        async *[Symbol.asyncIterator]() {
            for (const value of values) {
                yield value;
            }
        }
    };
}
async function* asyncDistinct(iterable, equalityFn) {
    const retainer = asyncDistinctRetainer(equalityFn);
    for await (const value of asyncIterable(iterable)) {
        if (await retainer.has(value)) {
            continue;
        }
        await retainer.add(value);
        yield value;
    }
}

function* group(iterable, callbackFn, thisValue, parent) {
    const groups = {};
    const newGroups = [];
    function getGroup(value) {
        return callbackFn.call(thisValue, value, parent);
    }
    const baseIterator = iterable[Symbol.iterator]();
    function* groupIterable(key, initialValue) {
        yield initialValue;
        function* drainGroup() {
            while (groups[key].length) {
                yield groups[key].shift();
            }
        }
        let done = false;
        yield* drainGroup();
        do {
            done = doNextValue();
            yield* drainGroup();
        } while (!done);
    }
    function doNextValue() {
        const next = baseIterator.next();
        if (next.done) {
            return true;
        }
        const nextKey = getGroup(next.value);
        if (groups[nextKey]) {
            groups[nextKey].push(next.value);
        }
        else {
            groups[nextKey] = [];
            newGroups.push(groupIterable(nextKey, next.value));
        }
        return false;
    }
    let done = false;
    do {
        done = doNextValue();
        while (newGroups.length) {
            yield newGroups.shift();
        }
    } while (!done);
}
async function* asyncGroup(iterable, callbackFn, thisValue, parent) {
    const groups = {};
    const newGroups = [];
    async function getGroup(value) {
        return callbackFn.call(thisValue, value, parent);
    }
    const baseIterator = asyncIterator(iterable);
    async function* groupIterable(key, initialValue) {
        yield initialValue;
        let done;
        function* drainGroup() {
            while (groups[key].length) {
                yield groups[key].shift();
            }
        }
        yield* drainGroup();
        do {
            done = await doNextValue();
            yield* drainGroup();
        } while (!done);
    }
    async function doNextValue() {
        const next = await baseIterator.next();
        if (next.done) {
            return true;
        }
        const nextKey = await getGroup(next.value);
        if (groups[nextKey]) {
            groups[nextKey].push(next.value);
        }
        else {
            groups[nextKey] = [];
            newGroups.push(groupIterable(nextKey, next.value));
        }
        return false;
    }
    let done = false;
    do {
        done = await doNextValue();
        while (newGroups.length) {
            yield newGroups.shift();
        }
    } while (!done);
}

class SimpleCancellable {
    constructor() {
        this.isCancelled = false;
    }
    get requested() {
        return this.isCancelled;
    }
    cancel() {
        this.isCancelled = true;
    }
}
function isCancelled(cancellable) {
    return !!(cancellable &&
        (cancellable.cancelled ||
            cancellable.requested ||
            cancellable.reason));
}

function source(source, cancellable) {
    return TransientAsyncIteratorSource.from(source, cancellable);
}
class TransientAsyncIteratorSource {
    constructor(source, sourceCancellable, onThrow) {
        this.source = source;
        this.sourceCancellable = sourceCancellable;
        this.onThrow = onThrow;
        this.idGenerator = 0;
        this.indexes = new Map();
        this.inFlightValues = [];
        this.deferred = [];
        this.isDone = false;
        this.errorValue = undefined;
        this.pullPromise = undefined;
        this.holding = false;
    }
    static from(source, cancellable) {
        if (!source) {
            return new TransientAsyncIteratorSource(undefined, cancellable);
        }
        if (isAsyncIterable(source) || isIterable(source)) {
            return new TransientAsyncIteratorSource(source, cancellable);
        }
        const iterable = {
            [Symbol.asyncIterator]: () => ({
                next: async () => ({ done: false, value: await source() })
            })
        };
        return new TransientAsyncIteratorSource(iterable, cancellable);
    }
    get error() {
        return this.errorValue;
    }
    get open() {
        return !(this.isDone || this.error);
    }
    // Allows for querying if anything was _pushed_ to the source
    get inFlight() {
        return this.open && this.inFlightValues.length > 0;
    }
    get hasSource() {
        if (!this.open || isCancelled(this.sourceCancellable)) {
            return false;
        }
        return !!(this.source || this.sourceIterator);
    }
    hold() {
        this.holding = true;
    }
    /**
     * @param value
     * @returns {boolean} false if the value won't be processed
     */
    push(value) {
        if (!this.open) {
            return false;
        }
        if (!this.indexes.size && !this.holding) {
            // Nothing to do, don't push to in flight because
            // otherwise they'll just be sitting there for no reason
            //
            // No one is listening to hear the tree fall
            return false;
        }
        this.inFlightValues.push(value);
        this.invokeDeferred(undefined);
        return true;
    }
    /**
     * @returns {boolean} false if the pushable is not open
     */
    close() {
        if (!this.open) {
            return false;
        }
        this.isDone = true;
        this.invokeDeferred(undefined);
        return true;
    }
    /**
     * @param error
     * @returns {boolean} false if the pushable is not open
     */
    throw(error) {
        if (!this.open) {
            return false;
        }
        this.errorValue = error || new Error();
        this.invokeDeferred(this.error);
        return true;
    }
    async setSource(source, sourceCancellable) {
        const hadSource = this.hasSource;
        this.source = source;
        this.sourceCancellable = sourceCancellable;
        this.sourceIterator = undefined;
        // If there wasn't a source before, and there is a source now, then pull the next value
        // to trigger the waiting iterators
        //
        // The caller of this function should wait for this to be done in case we run into an issue
        // The issue will only be from _their source_ rather than one of the deferred functions
        // as pull invokes `push` rather than invoking the iterators directly
        //
        // If someone replaces the source while we're pulling, then we will
        // be waiting for that source as well, so be aware that this _may_ throw an error from _a separate source_
        // this is because we loop around when we get a new source
        if (!hadSource && source && this.deferred.length) {
            return this.pull();
        }
    }
    pull() {
        if (!(this.source || this.sourceIterator)) {
            return;
        }
        if (this.pullPromise) {
            return this.pullPromise;
        }
        const doPull = async () => {
            if (isCancelled(this.sourceCancellable)) {
                if (this.sourceIterator && this.sourceIterator.return) {
                    // Invoking this method notifies the AsyncIterator object that the caller does not intend to make any more next method calls to the AsyncIterator.
                    await this.sourceIterator.return();
                }
                this.pullPromise = undefined;
                this.source = undefined;
                this.sourceIterator = undefined;
                return;
            }
            // Swap to the iterator and get rid of the iterable
            // we no longer need it
            if (!this.sourceIterator) {
                this.sourceIterator = asyncIterator(this.source);
                this.source = undefined;
            }
            const iterator = this.sourceIterator;
            const next = await iterator.next();
            // The source iterator could change while we're in progress
            // as soon as it has, ignore what you found and move on
            if (!next.done && this.sourceIterator === iterator) {
                this.push(next.value);
            }
            else if (this.sourceIterator !== iterator) {
                // We have a new source iterator, so lets start again
                return doPull();
            }
            else if (next.done) {
                this.sourceIterator = undefined;
            }
            this.pullPromise = undefined;
        };
        this.pullPromise = doPull();
        return this.pullPromise;
    }
    async waitForNext() {
        const promise = new Promise((resolve, reject) => {
            this.deferred.push(error => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
        await this.pull();
        return promise;
    }
    invokeDeferred(error) {
        let fn;
        while (fn = this.deferred.shift()) {
            fn(error);
        }
    }
    moveForwardInFlightValues() {
        if (!this.indexes.size) {
            if (this.inFlightValues.length !== 0 && !this.holding) {
                // No need to hold any values if we have nothing to consume them
                this.inFlightValues = [];
            }
            return; // No need to move forward, no indexes
        }
        const newMinimumIndex = reduce(this.indexes.values(), (min, next) => Math.min(next, min));
        if (newMinimumIndex === 0) {
            // Nothing to do, already there
            return;
        }
        if (newMinimumIndex < 0) {
            throw new Error("0: Pushable is in an invalid state, please report this here https://github.com/opennetwork/iterable");
        }
        // We want to go down to zero so we don't keep climbing to infinity
        this.inFlightValues = this.inFlightValues.slice(newMinimumIndex);
        this.indexes.forEach((value, key, map) => map.set(key, 0));
    }
    [Symbol.asyncIterator]() {
        const id = (this.idGenerator += 1);
        // Start at the head
        this.indexes.set(id, this.inFlightValues.length);
        let returned = false;
        const iterator = {
            next: async () => {
                const index = this.indexes.get(id);
                if (index >= this.inFlightValues.length) {
                    if (returned || this.isDone) {
                        // Force to always be done
                        returned = true;
                        return { done: true, value: undefined };
                    }
                    if (this.error) {
                        throw this.error;
                    }
                    await this.waitForNext();
                    return iterator.next();
                }
                const value = this.inFlightValues[index];
                this.indexes.set(id, index + 1);
                this.moveForwardInFlightValues();
                return { done: false, value };
            },
            return: async () => {
                returned = true;
                this.indexes.delete(id);
                this.moveForwardInFlightValues();
                return { done: true, value: undefined };
            },
            throw: async (error) => {
                // Notify that we found an issue
                //
                // If we have no `onThrow` function, but have a sourceIterator, tell the iterator of the issue
                if (this.onThrow) {
                    const result = await this.onThrow(error);
                    return result || Promise.reject(error);
                }
                else if (this.sourceIterator && this.sourceIterator.throw) {
                    return this.sourceIterator.throw(error);
                }
                return Promise.reject(error);
            }
        };
        return iterator;
    }
}
function isTransientAsyncIteratorSource(value) {
    function isTransientAsyncIteratorSourceLike(value) {
        return isAsyncIterable(value);
    }
    return (isTransientAsyncIteratorSourceLike(value) &&
        typeof value.open === "boolean" &&
        typeof value.inFlight === "boolean" &&
        typeof value.hasSource === "boolean" &&
        typeof value.push === "function" &&
        typeof value.close === "function" &&
        typeof value.throw === "function" &&
        typeof value.setSource === "function");
}

function isListenableAdd(listenable) {
    function isListenableAddInstance(listenable) {
        return !!listenable;
    }
    return (isListenableAddInstance(listenable) &&
        listenable.addListener instanceof Function);
}
function eventSource(listenable, map, eventName = "data", endEventName = "end", errorEventName = "error") {
    const on = (isListenableAdd(listenable) ? listenable.addListener : listenable.on).bind(listenable);
    const off = ((isListenableAdd(listenable) ? listenable.removeListener : listenable.off) || (() => { })).bind(listenable);
    const once = listenable.once ? listenable.once.bind(listenable) : function (eventName, handler) {
        const newHandler = (...args) => {
            off(eventName, newHandler);
            handler(...args);
        };
        on(eventName, newHandler);
    };
    const target = new TransientAsyncIteratorSource();
    on(eventName, onEvent);
    once(endEventName, onEnd);
    once(errorEventName, onError);
    return target;
    function onOff() {
        off(eventName, onEvent);
        off(endEventName, onEnd);
        off(errorEventName, onError);
    }
    function onEvent(...args) {
        target.push(map(...args));
    }
    function onEnd() {
        onOff();
        target.close();
    }
    function onError(error) {
        onOff();
        target.throw(error);
    }
}

function hooks(options) {
    return function* (iterable) {
        if (options.preIterator) {
            options.preIterator(iterable);
        }
        const iterator = options.iterator ? options.iterator(iterable) : iterable[Symbol.iterator]();
        if (options.postIterator) {
            options.postIterator(iterator, iterable);
        }
        let next;
        let value;
        let returned = undefined;
        do {
            if (options.preNext) {
                options.preNext(iterator, iterable);
            }
            next = options.next ? options.next(iterator, iterable) : iterator.next(returned);
            if (options.postNext) {
                options.postNext(next, iterator, iterable);
            }
            if (next.done) {
                break;
            }
            value = next.value;
            if (options.preYield) {
                options.preYield(value, iterator, iterable);
            }
            returned = yield options.yield ? options.yield(value, iterator, iterable) : value;
            if (options.postYield) {
                options.postYield(value, returned, iterator, iterable);
            }
        } while (!next.done);
        if (options.done) {
            options.done(value, returned, iterator, iterable);
        }
    };
}
function asyncHooks(options) {
    return async function* (iterable) {
        if (options.preIterator) {
            await options.preIterator(iterable);
        }
        const iterator = options.iterator ? options.iterator(iterable) : asyncIterator(iterable);
        if (options.postIterator) {
            await options.postIterator(iterator, iterable);
        }
        let next;
        let value;
        let returned = undefined;
        do {
            if (options.preNext) {
                await options.preNext(iterator, iterable);
            }
            next = await (options.next ? options.next(iterator, iterable) : iterator.next(returned));
            if (options.postNext) {
                await options.postNext(next, iterator, iterable);
            }
            if (next.done) {
                break;
            }
            value = next.value;
            if (options.preYield) {
                await options.preYield(value, iterator, iterable);
            }
            returned = yield options.yield ? options.yield(value, iterator, iterable) : value;
            if (options.postYield) {
                await options.postYield(value, returned, iterator, iterable);
            }
        } while (!next.done);
        if (options.done) {
            await options.done(value, returned, iterator, iterable);
        }
    };
}

function view(iterable) {
    return {
        [Symbol.iterator]: () => {
            let baseIterable;
            return {
                next() {
                    if (!baseIterable) {
                        baseIterable = retain(iterable, arrayRetainer());
                    }
                    return { done: false, value: baseIterable };
                },
                return() {
                    baseIterable = undefined;
                    return { done: true, value: undefined };
                }
            };
        }
    };
}
function asyncView(iterable) {
    return {
        [Symbol.asyncIterator]: () => {
            let baseIterable;
            return {
                async next() {
                    if (!baseIterable) {
                        baseIterable = asyncRetain(iterable, arrayRetainer());
                    }
                    return { done: false, value: baseIterable };
                },
                async return() {
                    baseIterable = undefined;
                    return { done: true, value: undefined };
                }
            };
        }
    };
}

function* peek(iterable, count) {
    const peekedValues = [];
    const iterator = iterable[Symbol.iterator]();
    let next;
    for (let peeked = 0; peeked < count; peeked += 1) {
        next = iterator.next();
        if (next.done) {
            break;
        }
        peekedValues.push(next.value);
    }
    while (peekedValues.length) {
        yield peekedValues.shift();
    }
    if (next && next.done) {
        return;
    }
    while (!next.done) {
        next = iterator.next();
        if (!next.done) {
            yield next.value;
        }
    }
    iterator.return();
}
async function* asyncPeek(iterable, count) {
    const peekedValues = [];
    const iterator = asyncIterator(iterable);
    let next;
    for (let peeked = 0; peeked < count; peeked += 1) {
        next = await iterator.next();
        if (next.done) {
            break;
        }
        peekedValues.push(next.value);
    }
    while (peekedValues.length) {
        yield peekedValues.shift();
    }
    if (next && next.done) {
        return;
    }
    while (!next.done) {
        next = await iterator.next();
        if (!next.done) {
            yield next.value;
        }
    }
    await iterator.return();
}

class RequiredError extends Error {
    constructor(required, received) {
        super(`Required ${required} iterations, received ${received}`);
        this.required = required;
        this.received = received;
    }
}
function* takeMinimum(iterable, count) {
    let next;
    const iterator = iterable[Symbol.iterator]();
    for (let foundCount = 0; foundCount < 0; foundCount += 1) {
        next = iterator.next();
        if (next.done) {
            const error = new RequiredError(count, foundCount);
            if (iterator.throw) {
                // This function may throw, which is perfect, allows for a different error to be used
                iterator.throw(error);
            }
            throw error;
        }
        yield next.value;
    }
    do {
        const next = iterator.next();
        if (next.done) {
            break;
        }
        yield next.value;
    } while (next.done);
    if (iterator.return) {
        iterator.return();
    }
}
async function* asyncTakeMinimum(iterable, count) {
    let next;
    const iterator = asyncIterator(iterable);
    for (let foundCount = 0; foundCount < 0; foundCount += 1) {
        next = await iterator.next();
        if (next.done) {
            const error = new RequiredError(count, foundCount);
            if (iterator.throw) {
                // This function may throw, which is perfect, allows for a different error to be used
                await iterator.throw(error);
            }
            throw error;
        }
        yield next.value;
    }
    do {
        const next = await iterator.next();
        if (next.done) {
            break;
        }
        yield next.value;
    } while (next.done);
    if (iterator.return) {
        await iterator.return();
    }
}

class ExtendedIterableAsyncImplementation {
    constructor(iterable, referenceMap) {
        this.referenceMap = referenceMap;
        this.iterable = asyncIterable(iterable);
    }
    drain() {
        return asyncDrain(this);
    }
    every(fn) {
        return asyncEvery(this, fn, this, this);
    }
    some(fn) {
        return asyncSome(this, fn, this, this);
    }
    hasAny() {
        return asyncHasAny(this);
    }
    reduce(fn, initialValue) {
        return asyncReduce(this, fn, initialValue, this, this);
    }
    retain(retainer = arrayRetainer()) {
        return this.referenceMap.asyncExtendedIterable(asyncRetain(this, retainer));
    }
    map(fn) {
        return this.referenceMap.asyncExtendedIterable(asyncMap(this, fn, this, this));
    }
    flatMap(fn) {
        return this.referenceMap.asyncExtendedIterable(asyncFlatMap(this, fn, this, this));
    }
    union(other) {
        return this.referenceMap.asyncExtendedIterable(asyncUnion(this, other));
    }
    filter(fn) {
        return this.referenceMap.asyncExtendedIterable(asyncFilter(this, fn, this, this));
    }
    except(fn) {
        const iterable = asyncExcept(this, fn, this, this);
        return this.referenceMap.asyncExtendedIterable(iterable);
    }
    toArray() {
        return asyncToArray(this);
    }
    mask(maskIterable) {
        return this.referenceMap.asyncExtendedIterable(asyncMask(this, maskIterable));
    }
    maskReversible(maskIterable, reverse = false) {
        return this.referenceMap.asyncExtendedIterable(asyncMaskReversible(this, maskIterable, reverse));
    }
    skip(count) {
        return this.mask(skip(count));
    }
    take(count) {
        return this.maskReversible(take(count), true);
    }
    distinct(equalityFn) {
        return this.referenceMap.asyncExtendedIterable(asyncDistinct(this, equalityFn));
    }
    group(fn) {
        return this.referenceMap.asyncExtendedIterable(asyncMap(asyncGroup(this, fn, this, this), async (iterable) => this.referenceMap.asyncExtendedIterable(iterable)));
    }
    tap(fn) {
        return this.referenceMap.asyncExtendedIterable(asyncHooks({ preYield: (value) => fn(value) })(this));
    }
    forEach(fn) {
        return forEachAsync(this, fn, this, this);
    }
    toTuple(size) {
        return this.referenceMap.asyncIterableTuple(this, size);
    }
    toIterable() {
        async function* iterable(iterable) {
            for await (const value of iterable) {
                yield value;
            }
        }
        return iterable(this.iterable);
    }
    [Symbol.asyncIterator]() {
        return this.iterable[Symbol.asyncIterator]();
    }
}

class ExtendedIterableImplementation {
    constructor(iterable, referenceMap) {
        this.referenceMap = referenceMap;
        this.iterable = iterable;
    }
    drain() {
        return drain(this);
    }
    hasAny() {
        return hasAny(this);
    }
    every(fn) {
        return every(this, fn, this, this);
    }
    some(fn) {
        return some(this, fn, this, this);
    }
    reduce(fn, initialValue) {
        return reduce(this, fn, initialValue, this, this);
    }
    retain(retainer = arrayRetainer()) {
        return this.referenceMap.extendedIterable(retain(this, retainer));
    }
    map(fn) {
        return this.referenceMap.extendedIterable(map(this, fn, this, this));
    }
    flatMap(fn) {
        return this.referenceMap.extendedIterable(flatMap(this, fn, this, this));
    }
    union(other) {
        return this.referenceMap.extendedIterable(union(this, other));
    }
    filter(fn) {
        return this.referenceMap.extendedIterable(filter(this, fn, this, this));
    }
    except(fn) {
        return this.referenceMap.extendedIterable(except(this, fn, this, this));
    }
    mask(maskIterable) {
        return this.referenceMap.extendedIterable(mask(this, maskIterable));
    }
    maskReversible(maskIterable, reverse = false) {
        return this.referenceMap.extendedIterable(maskReversible(this, maskIterable, reverse));
    }
    skip(count) {
        return this.mask(skip(count));
    }
    take(count) {
        return this.maskReversible(take(count), true);
    }
    distinct(equalityFn) {
        return this.referenceMap.extendedIterable(distinct(this, equalityFn));
    }
    group(fn) {
        return this.referenceMap.extendedIterable(map(group(this, fn, this, this), iterable => this.referenceMap.extendedIterable(iterable)));
    }
    tap(fn) {
        return this.referenceMap.extendedIterable(hooks({ preYield: (value) => fn(value) })(this));
    }
    forEach(fn) {
        forEach(this, fn, this, this);
    }
    toArray() {
        return toArray(this);
    }
    toTuple(size) {
        return this.referenceMap.iterableTuple(this, size);
    }
    toIterable() {
        function* iterable(iterable) {
            for (const value of iterable) {
                yield value;
            }
        }
        return iterable(this.iterable);
    }
    [Symbol.iterator]() {
        return this.iterable[Symbol.iterator]();
    }
}

/*
// This is the ideal way to do tuples, but typescript won't allow it in interfaces, because of recursion:

type GetLength<T extends any[]> = T extends { length: infer L } ? L : never;
type ArrayUnshift<T extends any[], X> = T extends any ? ((x: X, ...t: T) => void) extends (...t: infer R) => void ? R : never : never;
type SizeToTupleCreator<T, A extends T[], S extends number> = {
  1: A;
  0: SizeToTupleAdder<T, A, S>;
}[[GetLength<A>] extends [S] ? 1 : 0];
type SizeToTupleAdder<T, A extends any[], S extends number> = S extends any ? SizeToTupleCreator<T, ArrayUnshift<A, T>, S> : never;
export type TupleArray<T, S extends number> = SizeToTupleCreator<T, [], S>;
 */
function isTupleArray(array, size) {
    if (!Array.isArray(array)) {
        return false;
    }
    return array.length === size;
}

class ExtendedIterableAsyncTupleImplementation extends ExtendedIterableAsyncImplementation {
    constructor(iterable, size, referenceMap) {
        super(asyncTakeMinimum(iterable, size), referenceMap);
        this.size = size;
    }
    async toArray() {
        const array = await asyncToArray(this);
        if (!isTupleArray(array, this.size)) {
            throw new Error("Tuple incorrect size");
        }
        return array;
    }
}

class ExtendedIterableTupleImplementation extends ExtendedIterableImplementation {
    constructor(iterable, size, referenceMap) {
        super(takeMinimum(iterable, size), referenceMap);
        this.size = size;
    }
    toArray() {
        const array = toArray(this);
        if (!isTupleArray(array, this.size)) {
            throw new Error("Tuple incorrect size");
        }
        return array;
    }
}

const BasicMap = {
    extendedIterable(iterable) {
        return new ExtendedIterableImplementation(iterable, BasicMap);
    },
    asyncExtendedIterable(iterable) {
        return new ExtendedIterableAsyncImplementation(iterable, BasicMap);
    },
    asyncIterableTuple(iterable, size) {
        return new ExtendedIterableAsyncTupleImplementation(iterable, size, BasicMap);
    },
    iterableTuple(iterable, size) {
        return new ExtendedIterableTupleImplementation(iterable, size, BasicMap);
    }
};

function extendedIterable(iterable) {
    return BasicMap.extendedIterable(iterable);
}
function asyncExtendedIterable(iterable) {
    return BasicMap.asyncExtendedIterable(iterable);
}

export { RequiredError, SimpleCancellable, TransientAsyncIteratorSource, arrayRetainer, asyncDistinct, asyncDistinctRetainer, asyncDrain, asyncEvery, asyncExcept, asyncExtendedIterable, asyncFilter, asyncFilterNegatable, asyncFlatMap, asyncGroup, asyncHasAny, asyncHooks, asyncIterable, asyncIterator, asyncMap, asyncMask, asyncMaskReversible, asyncPeek, asyncReduce, asyncRetain, asyncSome, asyncTakeMinimum, asyncToArray, asyncUnion, asyncView, distinct, distinctRetainer, drain, eventSource, every, except, extendedIterable, filter, filterNegatable, flatMap, forEach, forEachAsync, getNext, group, hasAny, hooks, isAsyncIterable, isCancelled, isIterable, isIterableIterator, isPromise, isTransientAsyncIteratorSource, map, mask, maskReversible, peek, reduce, retain, setRetainer, skip, some, source, take, takeMinimum, toArray, union, view };
