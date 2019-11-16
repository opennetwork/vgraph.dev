var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var ChainRec = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 2.0.0
 */
function tailRec(a, f) {
    var v = f(a);
    while (v._tag === 'Left') {
        v = f(v.left);
    }
    return v.right;
}
exports.tailRec = tailRec;
});

unwrapExports(ChainRec);
var ChainRec_1 = ChainRec.tailRec;

var _function = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 2.0.0
 */
function identity(a) {
    return a;
}
exports.identity = identity;
/**
 * @since 2.0.0
 */
exports.unsafeCoerce = identity;
/**
 * @since 2.0.0
 */
function not(predicate) {
    return function (a) { return !predicate(a); };
}
exports.not = not;
/**
 * @since 2.0.0
 */
function constant(a) {
    return function () { return a; };
}
exports.constant = constant;
/**
 * A thunk that returns always `true`
 *
 * @since 2.0.0
 */
exports.constTrue = function () {
    return true;
};
/**
 * A thunk that returns always `false`
 *
 * @since 2.0.0
 */
exports.constFalse = function () {
    return false;
};
/**
 * A thunk that returns always `null`
 *
 * @since 2.0.0
 */
exports.constNull = function () {
    return null;
};
/**
 * A thunk that returns always `undefined`
 *
 * @since 2.0.0
 */
exports.constUndefined = function () {
    return;
};
/**
 * A thunk that returns always `void`
 *
 * @since 2.0.0
 */
exports.constVoid = function () {
    return;
};
/**
 * Flips the order of the arguments of a function of two arguments.
 *
 * @since 2.0.0
 */
function flip(f) {
    return function (b, a) { return f(a, b); };
}
exports.flip = flip;
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
        case 1:
            return ab;
        case 2:
            return function () {
                return bc(ab.apply(this, arguments));
            };
        case 3:
            return function () {
                return cd(bc(ab.apply(this, arguments)));
            };
        case 4:
            return function () {
                return de(cd(bc(ab.apply(this, arguments))));
            };
        case 5:
            return function () {
                return ef(de(cd(bc(ab.apply(this, arguments)))));
            };
        case 6:
            return function () {
                return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
            };
        case 7:
            return function () {
                return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
            };
        case 8:
            return function () {
                return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
            };
        case 9:
            return function () {
                return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
            };
    }
}
exports.flow = flow;
/**
 * @since 2.0.0
 */
function tuple() {
    var t = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        t[_i] = arguments[_i];
    }
    return t;
}
exports.tuple = tuple;
/**
 * @since 2.0.0
 */
function increment(n) {
    return n + 1;
}
exports.increment = increment;
/**
 * @since 2.0.0
 */
function decrement(n) {
    return n - 1;
}
exports.decrement = decrement;
/**
 * @since 2.0.0
 */
function absurd(_) {
    throw new Error('Called `absurd` function which should be uncallable');
}
exports.absurd = absurd;
});

unwrapExports(_function);
var _function_1 = _function.identity;
var _function_2 = _function.unsafeCoerce;
var _function_3 = _function.not;
var _function_4 = _function.constant;
var _function_5 = _function.constTrue;
var _function_6 = _function.constFalse;
var _function_7 = _function.constNull;
var _function_8 = _function.constUndefined;
var _function_9 = _function.constVoid;
var _function_10 = _function.flip;
var _function_11 = _function.flow;
var _function_12 = _function.tuple;
var _function_13 = _function.increment;
var _function_14 = _function.decrement;
var _function_15 = _function.absurd;

var pipeable_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

function pipe(a, ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
        case 1:
            return a;
        case 2:
            return ab(a);
        case 3:
            return bc(ab(a));
        case 4:
            return cd(bc(ab(a)));
        case 5:
            return de(cd(bc(ab(a))));
        case 6:
            return ef(de(cd(bc(ab(a)))));
        case 7:
            return fg(ef(de(cd(bc(ab(a))))));
        case 8:
            return gh(fg(ef(de(cd(bc(ab(a)))))));
        case 9:
            return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
        case 10:
            return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));
    }
}
exports.pipe = pipe;
var isFunctor = function (I) { return typeof I.map === 'function'; };
var isContravariant = function (I) { return typeof I.contramap === 'function'; };
var isFunctorWithIndex = function (I) { return typeof I.mapWithIndex === 'function'; };
var isApply = function (I) { return typeof I.ap === 'function'; };
var isChain = function (I) { return typeof I.chain === 'function'; };
var isBifunctor = function (I) { return typeof I.bimap === 'function'; };
var isExtend = function (I) { return typeof I.extend === 'function'; };
var isFoldable = function (I) { return typeof I.reduce === 'function'; };
var isFoldableWithIndex = function (I) { return typeof I.reduceWithIndex === 'function'; };
var isAlt = function (I) { return typeof I.alt === 'function'; };
var isCompactable = function (I) { return typeof I.compact === 'function'; };
var isFilterable = function (I) { return typeof I.filter === 'function'; };
var isFilterableWithIndex = function (I) {
    return typeof I.filterWithIndex === 'function';
};
var isProfunctor = function (I) { return typeof I.promap === 'function'; };
var isSemigroupoid = function (I) { return typeof I.compose === 'function'; };
var isMonadThrow = function (I) { return typeof I.throwError === 'function'; };
function pipeable(I) {
    var r = {};
    if (isFunctor(I)) {
        var map = function (f) { return function (fa) { return I.map(fa, f); }; };
        r.map = map;
    }
    if (isContravariant(I)) {
        var contramap = function (f) { return function (fa) { return I.contramap(fa, f); }; };
        r.contramap = contramap;
    }
    if (isFunctorWithIndex(I)) {
        var mapWithIndex = function (f) { return function (fa) { return I.mapWithIndex(fa, f); }; };
        r.mapWithIndex = mapWithIndex;
    }
    if (isApply(I)) {
        var ap = function (fa) { return function (fab) { return I.ap(fab, fa); }; };
        var apFirst = function (fb) { return function (fa) { return I.ap(I.map(fa, function (a) { return function () { return a; }; }), fb); }; };
        r.ap = ap;
        r.apFirst = apFirst;
        r.apSecond = function (fb) { return function (fa) { return I.ap(I.map(fa, function () { return function (b) { return b; }; }), fb); }; };
    }
    if (isChain(I)) {
        var chain = function (f) { return function (ma) { return I.chain(ma, f); }; };
        var chainFirst = function (f) { return function (ma) { return I.chain(ma, function (a) { return I.map(f(a), function () { return a; }); }); }; };
        var flatten = function (mma) { return I.chain(mma, _function.identity); };
        r.chain = chain;
        r.chainFirst = chainFirst;
        r.flatten = flatten;
    }
    if (isBifunctor(I)) {
        var bimap = function (f, g) { return function (fa) { return I.bimap(fa, f, g); }; };
        var mapLeft = function (f) { return function (fa) { return I.mapLeft(fa, f); }; };
        r.bimap = bimap;
        r.mapLeft = mapLeft;
    }
    if (isExtend(I)) {
        var extend = function (f) { return function (wa) { return I.extend(wa, f); }; };
        var duplicate = function (wa) { return I.extend(wa, _function.identity); };
        r.extend = extend;
        r.duplicate = duplicate;
    }
    if (isFoldable(I)) {
        var reduce = function (b, f) { return function (fa) { return I.reduce(fa, b, f); }; };
        var foldMap = function (M) {
            var foldMapM = I.foldMap(M);
            return function (f) { return function (fa) { return foldMapM(fa, f); }; };
        };
        var reduceRight = function (b, f) { return function (fa) { return I.reduceRight(fa, b, f); }; };
        r.reduce = reduce;
        r.foldMap = foldMap;
        r.reduceRight = reduceRight;
    }
    if (isFoldableWithIndex(I)) {
        var reduceWithIndex = function (b, f) { return function (fa) {
            return I.reduceWithIndex(fa, b, f);
        }; };
        var foldMapWithIndex = function (M) {
            var foldMapM = I.foldMapWithIndex(M);
            return function (f) { return function (fa) { return foldMapM(fa, f); }; };
        };
        var reduceRightWithIndex = function (b, f) { return function (fa) {
            return I.reduceRightWithIndex(fa, b, f);
        }; };
        r.reduceWithIndex = reduceWithIndex;
        r.foldMapWithIndex = foldMapWithIndex;
        r.reduceRightWithIndex = reduceRightWithIndex;
    }
    if (isAlt(I)) {
        var alt = function (that) { return function (fa) { return I.alt(fa, that); }; };
        r.alt = alt;
    }
    if (isCompactable(I)) {
        r.compact = I.compact;
        r.separate = I.separate;
    }
    if (isFilterable(I)) {
        var filter = function (predicate) { return function (fa) {
            return I.filter(fa, predicate);
        }; };
        var filterMap = function (f) { return function (fa) { return I.filterMap(fa, f); }; };
        var partition = function (predicate) { return function (fa) {
            return I.partition(fa, predicate);
        }; };
        var partitionMap = function (f) { return function (fa) { return I.partitionMap(fa, f); }; };
        r.filter = filter;
        r.filterMap = filterMap;
        r.partition = partition;
        r.partitionMap = partitionMap;
    }
    if (isFilterableWithIndex(I)) {
        var filterWithIndex = function (predicateWithIndex) { return function (fa) { return I.filterWithIndex(fa, predicateWithIndex); }; };
        var filterMapWithIndex = function (f) { return function (fa) {
            return I.filterMapWithIndex(fa, f);
        }; };
        var partitionWithIndex = function (predicateWithIndex) { return function (fa) { return I.partitionWithIndex(fa, predicateWithIndex); }; };
        var partitionMapWithIndex = function (f) { return function (fa) {
            return I.partitionMapWithIndex(fa, f);
        }; };
        r.filterWithIndex = filterWithIndex;
        r.filterMapWithIndex = filterMapWithIndex;
        r.partitionWithIndex = partitionWithIndex;
        r.partitionMapWithIndex = partitionMapWithIndex;
    }
    if (isProfunctor(I)) {
        var promap = function (f, g) { return function (fa) { return I.promap(fa, f, g); }; };
        r.promap = promap;
    }
    if (isSemigroupoid(I)) {
        var compose = function (that) { return function (fa) {
            return I.compose(fa, that);
        }; };
        r.compose = compose;
    }
    if (isMonadThrow(I)) {
        var fromOption = function (onNone) { return function (ma) {
            return ma._tag === 'None' ? I.throwError(onNone()) : I.of(ma.value);
        }; };
        var fromEither = function (ma) {
            return ma._tag === 'Left' ? I.throwError(ma.left) : I.of(ma.right);
        };
        var fromPredicate = function (predicate, onFalse) { return function (a) { return (predicate(a) ? I.of(a) : I.throwError(onFalse(a))); }; };
        var filterOrElse = function (predicate, onFalse) { return function (ma) { return I.chain(ma, function (a) { return (predicate(a) ? I.of(a) : I.throwError(onFalse(a))); }); }; };
        r.fromOption = fromOption;
        r.fromEither = fromEither;
        r.fromPredicate = fromPredicate;
        r.filterOrElse = filterOrElse;
    }
    return r;
}
exports.pipeable = pipeable;
});

unwrapExports(pipeable_1);
var pipeable_2 = pipeable_1.pipe;
var pipeable_3 = pipeable_1.pipeable;

var Either = createCommonjsModule(function (module, exports) {
/**
 * @file Represents a value of one of two possible types (a disjoint union).
 *
 * An instance of `Either` is either an instance of `Left` or `Right`.
 *
 * A common use of `Either` is as an alternative to `Option` for dealing with possible missing values. In this usage,
 * `None` is replaced with a `Left` which can contain useful information. `Right` takes the place of `Some`. Convention
 * dictates that `Left` is used for failure and `Right` is used for success.
 *
 * For example, you could use `Either<string, number>` to detect whether a received input is a `string` or a `number`.
 *
 * ```ts
 * const parse = (errorMessage: string) => (input: string): Either<string, number> => {
 *   const n = parseInt(input, 10)
 *   return isNaN(n) ? left(errorMessage) : right(n)
 * }
 * ```
 *
 * `Either` is right-biased, which means that `Right` is assumed to be the default case to operate on. If it is `Left`,
 * operations like `map`, `chain`, ... return the `Left` value unchanged:
 *
 * ```ts
 * import { either } from 'fp-ts/lib/Either'
 *
 * either.map(right(12), double) // right(24)
 * either.map(left(23), double)  // left(23)
 * ```
 */
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });


/**
 * @since 2.0.0
 */
exports.URI = 'Either';
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure
 *
 * @since 2.0.0
 */
function left(e) {
    return { _tag: 'Left', left: e };
}
exports.left = left;
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure
 *
 * @since 2.0.0
 */
function right(a) {
    return { _tag: 'Right', right: a };
}
exports.right = right;
/**
 * Takes a default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`
 *
 * @example
 * import { fromNullable, left, right } from 'fp-ts/lib/Either'
 *
 * const parse = fromNullable('nully')
 *
 * assert.deepStrictEqual(parse(1), right(1))
 * assert.deepStrictEqual(parse(null), left('nully'))
 *
 * @since 2.0.0
 */
function fromNullable(e) {
    return function (a) { return (a == null ? left(e) : right(a)); };
}
exports.fromNullable = fromNullable;
/**
 * Default value for the `onError` argument of `tryCatch`
 *
 * @since 2.0.0
 */
function toError(e) {
    return e instanceof Error ? e : new Error(String(e));
}
exports.toError = toError;
/**
 * Constructs a new `Either` from a function that might throw
 *
 * @example
 * import { Either, left, right, tryCatch } from 'fp-ts/lib/Either'
 *
 * const unsafeHead = <A>(as: Array<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw new Error('empty array')
 *   }
 * }
 *
 * const head = <A>(as: Array<A>): Either<Error, A> => {
 *   return tryCatch(() => unsafeHead(as), e => (e instanceof Error ? e : new Error('unknown error')))
 * }
 *
 * assert.deepStrictEqual(head([]), left(new Error('empty array')))
 * assert.deepStrictEqual(head([1, 2, 3]), right(1))
 *
 * @since 2.0.0
 */
function tryCatch(f, onError) {
    try {
        return right(f());
    }
    catch (e) {
        return left(onError(e));
    }
}
exports.tryCatch = tryCatch;
/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import { fold, left, right } from 'fp-ts/lib/Either'
 * import { pipe } from 'fp-ts/lib/pipeable'
 *
 * function onLeft(errors: Array<string>): string {
 *   return `Errors: ${errors.join(', ')}`
 * }
 *
 * function onRight(value: number): string {
 *   return `Ok: ${value}`
 * }
 *
 * assert.strictEqual(
 *   pipe(
 *     right(1),
 *     fold(onLeft, onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     left(['error 1', 'error 2']),
 *     fold(onLeft, onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @since 2.0.0
 */
function fold(onLeft, onRight) {
    return function (ma) { return (isLeft(ma) ? onLeft(ma.left) : onRight(ma.right)); };
}
exports.fold = fold;
/**
 * @since 2.0.0
 */
function getShow(SE, SA) {
    return {
        show: function (ma) { return (isLeft(ma) ? "left(" + SE.show(ma.left) + ")" : "right(" + SA.show(ma.right) + ")"); }
    };
}
exports.getShow = getShow;
/**
 * @since 2.0.0
 */
function getEq(EL, EA) {
    return {
        equals: function (x, y) {
            return x === y || (isLeft(x) ? isLeft(y) && EL.equals(x.left, y.left) : isRight(y) && EA.equals(x.right, y.right));
        }
    };
}
exports.getEq = getEq;
/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * appended using the provided `Semigroup`
 *
 * @example
 * import { getSemigroup, left, right } from 'fp-ts/lib/Either'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getSemigroup<string, number>(semigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), right(2))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), right(1))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 *
 * @since 2.0.0
 */
function getSemigroup(S) {
    return {
        concat: function (x, y) { return (isLeft(y) ? x : isLeft(x) ? y : right(S.concat(x.right, y.right))); }
    };
}
exports.getSemigroup = getSemigroup;
/**
 * `Apply` semigroup
 *
 * @example
 * import { getApplySemigroup, left, right } from 'fp-ts/lib/Either'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getApplySemigroup<string, number>(semigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), left('a'))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), left('b'))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 *
 * @since 2.0.0
 */
function getApplySemigroup(S) {
    return {
        concat: function (x, y) { return (isLeft(x) ? x : isLeft(y) ? y : right(S.concat(x.right, y.right))); }
    };
}
exports.getApplySemigroup = getApplySemigroup;
/**
 * @since 2.0.0
 */
function getApplyMonoid(M) {
    return __assign(__assign({}, getApplySemigroup(M)), { empty: right(M.empty) });
}
exports.getApplyMonoid = getApplyMonoid;
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise
 *
 * @since 2.0.0
 */
function isLeft(ma) {
    switch (ma._tag) {
        case 'Left':
            return true;
        case 'Right':
            return false;
    }
}
exports.isLeft = isLeft;
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise
 *
 * @since 2.0.0
 */
function isRight(ma) {
    return isLeft(ma) ? false : true;
}
exports.isRight = isRight;
/**
 * @since 2.0.0
 */
function swap(ma) {
    return isLeft(ma) ? right(ma.left) : left(ma.right);
}
exports.swap = swap;
/**
 * @since 2.0.0
 */
function orElse(onLeft) {
    return function (ma) { return (isLeft(ma) ? onLeft(ma.left) : ma); };
}
exports.orElse = orElse;
/**
 * @since 2.0.0
 */
function getOrElse(onLeft) {
    return function (ma) { return (isLeft(ma) ? onLeft(ma.left) : ma.right); };
}
exports.getOrElse = getOrElse;
/**
 * @since 2.0.0
 */
function elem(E) {
    return function (a, ma) { return (isLeft(ma) ? false : E.equals(a, ma.right)); };
}
exports.elem = elem;
/**
 * Returns `false` if `Left` or returns the result of the application of the given predicate to the `Right` value.
 *
 * @example
 * import { exists, left, right } from 'fp-ts/lib/Either'
 *
 * const gt2 = exists((n: number) => n > 2)
 *
 * assert.strictEqual(gt2(left('a')), false)
 * assert.strictEqual(gt2(right(1)), false)
 * assert.strictEqual(gt2(right(3)), true)
 *
 * @since 2.0.0
 */
function exists(predicate) {
    return function (ma) { return (isLeft(ma) ? false : predicate(ma.right)); };
}
exports.exists = exists;
/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 *
 * @example
 * import { parseJSON, toError, right, left } from 'fp-ts/lib/Either'
 *
 * assert.deepStrictEqual(parseJSON('{"a":1}', toError), right({ a: 1 }))
 * assert.deepStrictEqual(parseJSON('{"a":}', toError), left(new SyntaxError('Unexpected token } in JSON at position 5')))
 *
 * @since 2.0.0
 */
function parseJSON(s, onError) {
    return tryCatch(function () { return JSON.parse(s); }, onError);
}
exports.parseJSON = parseJSON;
/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 *
 * @example
 * import { stringifyJSON, toError, right, left } from 'fp-ts/lib/Either'
 *
 * assert.deepStrictEqual(stringifyJSON({ a: 1 }, toError), right('{"a":1}'))
 * const circular: any = { ref: null }
 * circular.ref = circular
 * assert.deepStrictEqual(stringifyJSON(circular, toError), left(new TypeError('Converting circular structure to JSON')))
 *
 * @since 2.0.0
 */
function stringifyJSON(u, onError) {
    return tryCatch(function () { return JSON.stringify(u); }, onError);
}
exports.stringifyJSON = stringifyJSON;
var phantom = undefined;
/**
 * Builds `Witherable` instance for `Either` given `Monoid` for the left side
 *
 * @since 2.0.0
 */
function getWitherable(M) {
    var empty = left(M.empty);
    var compact = function (ma) {
        return isLeft(ma) ? ma : ma.right._tag === 'None' ? left(M.empty) : right(ma.right.value);
    };
    var separate = function (ma) {
        return isLeft(ma)
            ? { left: ma, right: ma }
            : isLeft(ma.right)
                ? { left: right(ma.right.left), right: empty }
                : { left: empty, right: right(ma.right.right) };
    };
    var partitionMap = function (ma, f) {
        if (isLeft(ma)) {
            return { left: ma, right: ma };
        }
        var e = f(ma.right);
        return isLeft(e) ? { left: right(e.left), right: empty } : { left: empty, right: right(e.right) };
    };
    var partition = function (ma, p) {
        return isLeft(ma)
            ? { left: ma, right: ma }
            : p(ma.right)
                ? { left: empty, right: right(ma.right) }
                : { left: right(ma.right), right: empty };
    };
    var filterMap = function (ma, f) {
        if (isLeft(ma)) {
            return ma;
        }
        var ob = f(ma.right);
        return ob._tag === 'None' ? left(M.empty) : right(ob.value);
    };
    var filter = function (ma, predicate) {
        return isLeft(ma) ? ma : predicate(ma.right) ? ma : left(M.empty);
    };
    var wither = function (F) {
        var traverseF = exports.either.traverse(F);
        return function (ma, f) { return F.map(traverseF(ma, f), compact); };
    };
    var wilt = function (F) {
        var traverseF = exports.either.traverse(F);
        return function (ma, f) { return F.map(traverseF(ma, f), separate); };
    };
    return {
        URI: exports.URI,
        _E: phantom,
        map: exports.either.map,
        compact: compact,
        separate: separate,
        filter: filter,
        filterMap: filterMap,
        partition: partition,
        partitionMap: partitionMap,
        traverse: exports.either.traverse,
        sequence: exports.either.sequence,
        reduce: exports.either.reduce,
        foldMap: exports.either.foldMap,
        reduceRight: exports.either.reduceRight,
        wither: wither,
        wilt: wilt
    };
}
exports.getWitherable = getWitherable;
/**
 * @since 2.0.0
 */
function getValidation(S) {
    return {
        URI: exports.URI,
        _E: phantom,
        map: exports.either.map,
        of: exports.either.of,
        ap: function (mab, ma) {
            return isLeft(mab)
                ? isLeft(ma)
                    ? left(S.concat(mab.left, ma.left))
                    : mab
                : isLeft(ma)
                    ? ma
                    : right(mab.right(ma.right));
        },
        chain: exports.either.chain,
        alt: function (fx, f) {
            if (isRight(fx)) {
                return fx;
            }
            var fy = f();
            return isLeft(fy) ? left(S.concat(fx.left, fy.left)) : fy;
        }
    };
}
exports.getValidation = getValidation;
/**
 * @since 2.0.0
 */
function getValidationSemigroup(SE, SA) {
    return {
        concat: function (fx, fy) {
            return isLeft(fx)
                ? isLeft(fy)
                    ? left(SE.concat(fx.left, fy.left))
                    : fx
                : isLeft(fy)
                    ? fy
                    : right(SA.concat(fx.right, fy.right));
        }
    };
}
exports.getValidationSemigroup = getValidationSemigroup;
/**
 * @since 2.0.0
 */
function getValidationMonoid(SE, SA) {
    return {
        concat: getValidationSemigroup(SE, SA).concat,
        empty: right(SA.empty)
    };
}
exports.getValidationMonoid = getValidationMonoid;
/**
 * @since 2.0.0
 */
exports.either = {
    URI: exports.URI,
    map: function (ma, f) { return (isLeft(ma) ? ma : right(f(ma.right))); },
    of: right,
    ap: function (mab, ma) { return (isLeft(mab) ? mab : isLeft(ma) ? ma : right(mab.right(ma.right))); },
    chain: function (ma, f) { return (isLeft(ma) ? ma : f(ma.right)); },
    reduce: function (fa, b, f) { return (isLeft(fa) ? b : f(b, fa.right)); },
    foldMap: function (M) { return function (fa, f) { return (isLeft(fa) ? M.empty : f(fa.right)); }; },
    reduceRight: function (fa, b, f) { return (isLeft(fa) ? b : f(fa.right, b)); },
    traverse: function (F) { return function (ma, f) {
        return isLeft(ma) ? F.of(left(ma.left)) : F.map(f(ma.right), right);
    }; },
    sequence: function (F) { return function (ma) {
        return isLeft(ma) ? F.of(left(ma.left)) : F.map(ma.right, right);
    }; },
    bimap: function (fea, f, g) { return (isLeft(fea) ? left(f(fea.left)) : right(g(fea.right))); },
    mapLeft: function (fea, f) { return (isLeft(fea) ? left(f(fea.left)) : fea); },
    alt: function (fx, fy) { return (isLeft(fx) ? fy() : fx); },
    extend: function (wa, f) { return (isLeft(wa) ? wa : right(f(wa))); },
    chainRec: function (a, f) {
        return ChainRec.tailRec(f(a), function (e) {
            return isLeft(e) ? right(left(e.left)) : isLeft(e.right) ? left(f(e.right.left)) : right(right(e.right.right));
        });
    },
    throwError: left
};
var _a = pipeable_1.pipeable(exports.either), alt = _a.alt, ap = _a.ap, apFirst = _a.apFirst, apSecond = _a.apSecond, bimap = _a.bimap, chain = _a.chain, chainFirst = _a.chainFirst, duplicate = _a.duplicate, extend = _a.extend, flatten = _a.flatten, foldMap = _a.foldMap, map = _a.map, mapLeft = _a.mapLeft, reduce = _a.reduce, reduceRight = _a.reduceRight, fromOption = _a.fromOption, fromPredicate = _a.fromPredicate, filterOrElse = _a.filterOrElse;
exports.alt = alt;
exports.ap = ap;
exports.apFirst = apFirst;
exports.apSecond = apSecond;
exports.bimap = bimap;
exports.chain = chain;
exports.chainFirst = chainFirst;
exports.duplicate = duplicate;
exports.extend = extend;
exports.flatten = flatten;
exports.foldMap = foldMap;
exports.map = map;
exports.mapLeft = mapLeft;
exports.reduce = reduce;
exports.reduceRight = reduceRight;
exports.fromOption = fromOption;
exports.fromPredicate = fromPredicate;
exports.filterOrElse = filterOrElse;
});

unwrapExports(Either);
var Either_1 = Either.URI;
var Either_2 = Either.left;
var Either_3 = Either.right;
var Either_4 = Either.fromNullable;
var Either_5 = Either.toError;
var Either_6 = Either.tryCatch;
var Either_7 = Either.fold;
var Either_8 = Either.getShow;
var Either_9 = Either.getEq;
var Either_10 = Either.getSemigroup;
var Either_11 = Either.getApplySemigroup;
var Either_12 = Either.getApplyMonoid;
var Either_13 = Either.isLeft;
var Either_14 = Either.isRight;
var Either_15 = Either.swap;
var Either_16 = Either.orElse;
var Either_17 = Either.getOrElse;
var Either_18 = Either.elem;
var Either_19 = Either.exists;
var Either_20 = Either.parseJSON;
var Either_21 = Either.stringifyJSON;
var Either_22 = Either.getWitherable;
var Either_23 = Either.getValidation;
var Either_24 = Either.getValidationSemigroup;
var Either_25 = Either.getValidationMonoid;
var Either_26 = Either.either;
var Either_27 = Either.alt;
var Either_28 = Either.ap;
var Either_29 = Either.apFirst;
var Either_30 = Either.apSecond;
var Either_31 = Either.bimap;
var Either_32 = Either.chain;
var Either_33 = Either.chainFirst;
var Either_34 = Either.duplicate;
var Either_35 = Either.extend;
var Either_36 = Either.flatten;
var Either_37 = Either.foldMap;
var Either_38 = Either.map;
var Either_39 = Either.mapLeft;
var Either_40 = Either.reduce;
var Either_41 = Either.reduceRight;
var Either_42 = Either.fromOption;
var Either_43 = Either.fromPredicate;
var Either_44 = Either.filterOrElse;

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var map = Either_26.map;
var chain = Either_26.chain;
/**
 * @since 1.0.0
 */
var Type = /** @class */ (function () {
    function Type(
    /** a unique name for this codec */
    name, 
    /** a custom type guard */
    is, 
    /** succeeds if a value of type I can be decoded to a value of type A */
    validate, 
    /** converts a value of type A to a value of type O */
    encode) {
        this.name = name;
        this.is = is;
        this.validate = validate;
        this.encode = encode;
        this.decode = this.decode.bind(this);
    }
    /**
     * @since 1.0.0
     */
    Type.prototype.pipe = function (ab, name) {
        var _this = this;
        if (name === void 0) { name = "pipe(" + this.name + ", " + ab.name + ")"; }
        return new Type(name, ab.is, function (i, c) { return chain(_this.validate(i, c), function (a) { return ab.validate(a, c); }); }, this.encode === identity && ab.encode === identity ? identity : function (b) { return _this.encode(ab.encode(b)); });
    };
    /**
     * @since 1.0.0
     */
    Type.prototype.asDecoder = function () {
        return this;
    };
    /**
     * @since 1.0.0
     */
    Type.prototype.asEncoder = function () {
        return this;
    };
    /**
     * a version of `validate` with a default context
     * @since 1.0.0
     */
    Type.prototype.decode = function (i) {
        return this.validate(i, [{ key: '', type: this, actual: i }]);
    };
    return Type;
}());
/**
 * @since 1.0.0
 */
var identity = function (a) { return a; };
/**
 * @since 1.0.0
 */
var getFunctionName = function (f) {
    return f.displayName || f.name || "<function" + f.length + ">";
};
/**
 * @since 1.0.0
 */
var getContextEntry = function (key, decoder) { return ({ key: key, type: decoder }); };
/**
 * @since 1.0.0
 */
var appendContext = function (c, key, decoder, actual) {
    var len = c.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i] = c[i];
    }
    r[len] = { key: key, type: decoder, actual: actual };
    return r;
};
/**
 * @since 1.0.0
 */
var failures = Either_2;
/**
 * @since 1.0.0
 */
var failure = function (value, context, message) {
    return failures([{ value: value, context: context, message: message }]);
};
/**
 * @since 1.0.0
 */
var success = Either_3;
var pushAll = function (xs, ys) {
    var l = ys.length;
    for (var i = 0; i < l; i++) {
        xs.push(ys[i]);
    }
};
var getIsCodec = function (tag) { return function (codec) { return codec._tag === tag; }; };
var isUnknownCodec = getIsCodec('UnknownType');
// tslint:disable-next-line: deprecation
var isAnyCodec = getIsCodec('AnyType');
var isInterfaceCodec = getIsCodec('InterfaceType');
var isPartialCodec = getIsCodec('PartialType');
//
// basic types
//
/**
 * @since 1.0.0
 */
var NullType = /** @class */ (function (_super) {
    __extends(NullType, _super);
    function NullType() {
        var _this = _super.call(this, 'null', function (u) { return u === null; }, function (u, c) { return (_this.is(u) ? success(u) : failure(u, c)); }, identity) || this;
        _this._tag = 'NullType';
        return _this;
    }
    return NullType;
}(Type));
/**
 * @since 1.0.0
 */
var nullType = new NullType();
/**
 * @since 1.0.0
 */
var UndefinedType = /** @class */ (function (_super) {
    __extends(UndefinedType, _super);
    function UndefinedType() {
        var _this = _super.call(this, 'undefined', function (u) { return u === void 0; }, function (u, c) { return (_this.is(u) ? success(u) : failure(u, c)); }, identity) || this;
        _this._tag = 'UndefinedType';
        return _this;
    }
    return UndefinedType;
}(Type));
var undefinedType = new UndefinedType();
/**
 * @since 1.2.0
 */
var VoidType = /** @class */ (function (_super) {
    __extends(VoidType, _super);
    function VoidType() {
        var _this = _super.call(this, 'void', undefinedType.is, undefinedType.validate, identity) || this;
        _this._tag = 'VoidType';
        return _this;
    }
    return VoidType;
}(Type));
/**
 * @since 1.2.0
 */
var voidType = new VoidType();
/**
 * @since 1.5.0
 */
var UnknownType = /** @class */ (function (_super) {
    __extends(UnknownType, _super);
    function UnknownType() {
        var _this = _super.call(this, 'unknown', function (_) { return true; }, success, identity) || this;
        _this._tag = 'UnknownType';
        return _this;
    }
    return UnknownType;
}(Type));
/**
 * @since 1.5.0
 */
var unknown = new UnknownType();
/**
 * @since 1.0.0
 */
var StringType = /** @class */ (function (_super) {
    __extends(StringType, _super);
    function StringType() {
        var _this = _super.call(this, 'string', function (u) { return typeof u === 'string'; }, function (u, c) { return (_this.is(u) ? success(u) : failure(u, c)); }, identity) || this;
        _this._tag = 'StringType';
        return _this;
    }
    return StringType;
}(Type));
/**
 * @since 1.0.0
 */
var string = new StringType();
/**
 * @since 1.0.0
 */
var NumberType = /** @class */ (function (_super) {
    __extends(NumberType, _super);
    function NumberType() {
        var _this = _super.call(this, 'number', function (u) { return typeof u === 'number'; }, function (u, c) { return (_this.is(u) ? success(u) : failure(u, c)); }, identity) || this;
        _this._tag = 'NumberType';
        return _this;
    }
    return NumberType;
}(Type));
/**
 * @since 1.0.0
 */
var number = new NumberType();
/**
 * @since 1.0.0
 */
var BooleanType = /** @class */ (function (_super) {
    __extends(BooleanType, _super);
    function BooleanType() {
        var _this = _super.call(this, 'boolean', function (u) { return typeof u === 'boolean'; }, function (u, c) { return (_this.is(u) ? success(u) : failure(u, c)); }, identity) || this;
        _this._tag = 'BooleanType';
        return _this;
    }
    return BooleanType;
}(Type));
/**
 * @since 1.0.0
 */
var boolean = new BooleanType();
/**
 * @since 1.0.0
 */
var AnyArrayType = /** @class */ (function (_super) {
    __extends(AnyArrayType, _super);
    function AnyArrayType() {
        var _this = _super.call(this, 'UnknownArray', Array.isArray, function (u, c) { return (_this.is(u) ? success(u) : failure(u, c)); }, identity) || this;
        _this._tag = 'AnyArrayType';
        return _this;
    }
    return AnyArrayType;
}(Type));
/**
 * @since 1.7.1
 */
var UnknownArray = new AnyArrayType();
/**
 * @since 1.0.0
 */
var AnyDictionaryType = /** @class */ (function (_super) {
    __extends(AnyDictionaryType, _super);
    function AnyDictionaryType() {
        var _this = _super.call(this, 'UnknownRecord', function (u) { return u !== null && typeof u === 'object'; }, function (u, c) { return (_this.is(u) ? success(u) : failure(u, c)); }, identity) || this;
        _this._tag = 'AnyDictionaryType';
        return _this;
    }
    return AnyDictionaryType;
}(Type));
/**
 * @since 1.7.1
 */
var UnknownRecord = new AnyDictionaryType();
/**
 * @since 1.0.0
 * @deprecated
 */
var FunctionType = /** @class */ (function (_super) {
    __extends(FunctionType, _super);
    function FunctionType() {
        var _this = _super.call(this, 'Function', 
        // tslint:disable-next-line:strict-type-predicates
        function (u) { return typeof u === 'function'; }, function (u, c) { return (_this.is(u) ? success(u) : failure(u, c)); }, identity) || this;
        _this._tag = 'FunctionType';
        return _this;
    }
    return FunctionType;
}(Type));
/**
 * @since 1.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
var Function = new FunctionType();
/**
 * @since 1.0.0
 */
var RefinementType = /** @class */ (function (_super) {
    __extends(RefinementType, _super);
    function RefinementType(name, is, validate, encode, type, predicate) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this.predicate = predicate;
        _this._tag = 'RefinementType';
        return _this;
    }
    return RefinementType;
}(Type));
/**
 * @since 1.8.1
 */
var brand = function (codec, predicate, name) {
    // tslint:disable-next-line: deprecation
    return refinement(codec, predicate, name);
};
/**
 * A branded codec representing an integer
 * @since 1.8.1
 */
var Int = brand(number, function (n) { return Number.isInteger(n); }, 'Int');
/**
 * @since 1.0.0
 */
var LiteralType = /** @class */ (function (_super) {
    __extends(LiteralType, _super);
    function LiteralType(name, is, validate, encode, value) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.value = value;
        _this._tag = 'LiteralType';
        return _this;
    }
    return LiteralType;
}(Type));
/**
 * @since 1.0.0
 */
var literal = function (value, name) {
    if (name === void 0) { name = JSON.stringify(value); }
    var is = function (u) { return u === value; };
    return new LiteralType(name, is, function (u, c) { return (is(u) ? success(value) : failure(u, c)); }, identity, value);
};
/**
 * @since 1.0.0
 */
var KeyofType = /** @class */ (function (_super) {
    __extends(KeyofType, _super);
    function KeyofType(name, is, validate, encode, keys) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.keys = keys;
        _this._tag = 'KeyofType';
        return _this;
    }
    return KeyofType;
}(Type));
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * @since 1.0.0
 */
var keyof = function (keys, name) {
    if (name === void 0) { name = Object.keys(keys)
        .map(function (k) { return JSON.stringify(k); })
        .join(' | '); }
    var is = function (u) { return string.is(u) && hasOwnProperty.call(keys, u); };
    return new KeyofType(name, is, function (u, c) { return (is(u) ? success(u) : failure(u, c)); }, identity, keys);
};
/**
 * @since 1.0.0
 */
var RecursiveType = /** @class */ (function (_super) {
    __extends(RecursiveType, _super);
    function RecursiveType(name, is, validate, encode, runDefinition) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.runDefinition = runDefinition;
        _this._tag = 'RecursiveType';
        return _this;
    }
    Object.defineProperty(RecursiveType.prototype, "type", {
        get: function () {
            return this.runDefinition();
        },
        enumerable: true,
        configurable: true
    });
    return RecursiveType;
}(Type));
/**
 * @since 1.0.0
 */
var recursion = function (name, definition) {
    var cache;
    var runDefinition = function () {
        if (!cache) {
            cache = definition(Self);
            cache.name = name;
        }
        return cache;
    };
    var Self = new RecursiveType(name, function (u) { return runDefinition().is(u); }, function (u, c) { return runDefinition().validate(u, c); }, function (a) { return runDefinition().encode(a); }, runDefinition);
    return Self;
};
/**
 * @since 1.0.0
 */
var ArrayType = /** @class */ (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ArrayType';
        return _this;
    }
    return ArrayType;
}(Type));
/**
 * @since 1.0.0
 */
var array = function (codec, name) {
    if (name === void 0) { name = "Array<" + codec.name + ">"; }
    return new ArrayType(name, function (u) { return UnknownArray.is(u) && u.every(codec.is); }, function (u, c) {
        return chain(UnknownArray.validate(u, c), function (us) {
            var len = us.length;
            var as = us;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var ui = us[i];
                var result = codec.validate(ui, appendContext(c, String(i), codec, ui));
                if (Either_13(result)) {
                    pushAll(errors, result.left);
                }
                else {
                    var ai = result.right;
                    if (ai !== ui) {
                        if (as === us) {
                            as = us.slice();
                        }
                        as[i] = ai;
                    }
                }
            }
            return errors.length > 0 ? failures(errors) : success(as);
        });
    }, codec.encode === identity ? identity : function (a) { return a.map(codec.encode); }, codec);
};
/**
 * @since 1.0.0
 */
var InterfaceType = /** @class */ (function (_super) {
    __extends(InterfaceType, _super);
    function InterfaceType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'InterfaceType';
        return _this;
    }
    return InterfaceType;
}(Type));
var getNameFromProps = function (props) {
    return Object.keys(props)
        .map(function (k) { return k + ": " + props[k].name; })
        .join(', ');
};
var useIdentity = function (codecs) {
    for (var i = 0; i < codecs.length; i++) {
        if (codecs[i].encode !== identity) {
            return false;
        }
    }
    return true;
};
var getInterfaceTypeName = function (props) {
    return "{ " + getNameFromProps(props) + " }";
};
/**
 * @since 1.0.0
 */
var type = function (props, name) {
    if (name === void 0) { name = getInterfaceTypeName(props); }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    return new InterfaceType(name, function (u) {
        if (!UnknownRecord.is(u)) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            if (!hasOwnProperty.call(u, k) || !types[i].is(u[k])) {
                return false;
            }
        }
        return true;
    }, function (u, c) {
        return chain(UnknownRecord.validate(u, c), function (o) {
            var a = o;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                if (!hasOwnProperty.call(a, k)) {
                    if (a === o) {
                        a = __assign({}, o);
                    }
                    a[k] = a[k];
                }
                var ak = a[k];
                var type_1 = types[i];
                var result = type_1.validate(ak, appendContext(c, k, type_1, ak));
                if (Either_13(result)) {
                    pushAll(errors, result.left);
                }
                else {
                    var vak = result.right;
                    if (vak !== ak) {
                        /* istanbul ignore next */
                        if (a === o) {
                            a = __assign({}, o);
                        }
                        a[k] = vak;
                    }
                }
            }
            return errors.length > 0 ? failures(errors) : success(a);
        });
    }, useIdentity(types)
        ? identity
        : function (a) {
            var s = __assign({}, a);
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var encode = types[i].encode;
                if (encode !== identity) {
                    s[k] = encode(a[k]);
                }
            }
            return s;
        }, props);
};
/**
 * @since 1.0.0
 */
var PartialType = /** @class */ (function (_super) {
    __extends(PartialType, _super);
    function PartialType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'PartialType';
        return _this;
    }
    return PartialType;
}(Type));
var getPartialTypeName = function (inner) {
    return "Partial<" + inner + ">";
};
/**
 * @since 1.0.0
 */
var partial = function (props, name) {
    if (name === void 0) { name = getPartialTypeName(getInterfaceTypeName(props)); }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    return new PartialType(name, function (u) {
        if (!UnknownRecord.is(u)) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            var uk = u[k];
            if (uk !== undefined && !props[k].is(uk)) {
                return false;
            }
        }
        return true;
    }, function (u, c) {
        return chain(UnknownRecord.validate(u, c), function (o) {
            var a = o;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ak = a[k];
                var type_2 = props[k];
                var result = type_2.validate(ak, appendContext(c, k, type_2, ak));
                if (Either_13(result)) {
                    if (ak !== undefined) {
                        pushAll(errors, result.left);
                    }
                }
                else {
                    var vak = result.right;
                    if (vak !== ak) {
                        /* istanbul ignore next */
                        if (a === o) {
                            a = __assign({}, o);
                        }
                        a[k] = vak;
                    }
                }
            }
            return errors.length > 0 ? failures(errors) : success(a);
        });
    }, useIdentity(types)
        ? identity
        : function (a) {
            var s = __assign({}, a);
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ak = a[k];
                if (ak !== undefined) {
                    s[k] = types[i].encode(ak);
                }
            }
            return s;
        }, props);
};
/**
 * @since 1.0.0
 */
var DictionaryType = /** @class */ (function (_super) {
    __extends(DictionaryType, _super);
    function DictionaryType(name, is, validate, encode, domain, codomain) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.domain = domain;
        _this.codomain = codomain;
        _this._tag = 'DictionaryType';
        return _this;
    }
    return DictionaryType;
}(Type));
var isObject = function (r) { return Object.prototype.toString.call(r) === '[object Object]'; };
/**
 * @since 1.7.1
 */
var record = function (domain, codomain, name) {
    if (name === void 0) { name = "{ [K in " + domain.name + "]: " + codomain.name + " }"; }
    return new DictionaryType(name, function (u) {
        if (!UnknownRecord.is(u)) {
            return false;
        }
        if (!isUnknownCodec(codomain) && !isAnyCodec(codomain) && !isObject(u)) {
            return false;
        }
        return Object.keys(u).every(function (k) { return domain.is(k) && codomain.is(u[k]); });
    }, function (u, c) {
        return chain(UnknownRecord.validate(u, c), function (o) {
            if (!isUnknownCodec(codomain) && !isAnyCodec(codomain) && !isObject(o)) {
                return failure(u, c);
            }
            var a = {};
            var errors = [];
            var keys = Object.keys(o);
            var len = keys.length;
            var changed = false;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ok = o[k];
                var domainResult = domain.validate(k, appendContext(c, k, domain, k));
                if (Either_13(domainResult)) {
                    pushAll(errors, domainResult.left);
                }
                else {
                    var vk = domainResult.right;
                    changed = changed || vk !== k;
                    k = vk;
                    var codomainResult = codomain.validate(ok, appendContext(c, k, codomain, ok));
                    if (Either_13(codomainResult)) {
                        pushAll(errors, codomainResult.left);
                    }
                    else {
                        var vok = codomainResult.right;
                        changed = changed || vok !== ok;
                        a[k] = vok;
                    }
                }
            }
            return errors.length > 0 ? failures(errors) : success((changed ? a : o));
        });
    }, domain.encode === identity && codomain.encode === identity
        ? identity
        : function (a) {
            var s = {};
            var keys = Object.keys(a);
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                s[String(domain.encode(k))] = codomain.encode(a[k]);
            }
            return s;
        }, domain, codomain);
};
/**
 * @since 1.0.0
 */
var UnionType = /** @class */ (function (_super) {
    __extends(UnionType, _super);
    function UnionType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'UnionType';
        return _this;
    }
    return UnionType;
}(Type));
var getUnionName = function (codecs) {
    return '(' + codecs.map(function (type) { return type.name; }).join(' | ') + ')';
};
/**
 * @since 1.0.0
 */
var union = function (codecs, name) {
    if (name === void 0) { name = getUnionName(codecs); }
    var index = getIndex(codecs);
    if (index !== undefined && codecs.length > 0) {
        var tag_1 = index[0], groups_1 = index[1];
        var len_1 = groups_1.length;
        var find_1 = function (value) {
            for (var i = 0; i < len_1; i++) {
                if (groups_1[i].indexOf(value) !== -1) {
                    return i;
                }
            }
            return undefined;
        };
        // tslint:disable-next-line: deprecation
        return new TaggedUnionType(name, function (u) {
            if (!UnknownRecord.is(u)) {
                return false;
            }
            var i = find_1(u[tag_1]);
            return i !== undefined ? codecs[i].is(u) : false;
        }, function (u, c) {
            return chain(UnknownRecord.validate(u, c), function (r) {
                var i = find_1(r[tag_1]);
                if (i === undefined) {
                    return failure(u, c);
                }
                var codec = codecs[i];
                return codec.validate(r, appendContext(c, String(i), codec, r));
            });
        }, useIdentity(codecs)
            ? identity
            : function (a) {
                var i = find_1(a[tag_1]);
                if (i === undefined) {
                    // https://github.com/gcanti/io-ts/pull/305
                    throw new Error("no codec found to encode value in union codec " + name);
                }
                else {
                    return codecs[i].encode(a);
                }
            }, codecs, tag_1);
    }
    else {
        return new UnionType(name, function (u) { return codecs.some(function (type) { return type.is(u); }); }, function (u, c) {
            var errors = [];
            for (var i = 0; i < codecs.length; i++) {
                var codec = codecs[i];
                var result = codec.validate(u, appendContext(c, String(i), codec, u));
                if (Either_13(result)) {
                    pushAll(errors, result.left);
                }
                else {
                    return success(result.right);
                }
            }
            return failures(errors);
        }, useIdentity(codecs)
            ? identity
            : function (a) {
                for (var _i = 0, codecs_1 = codecs; _i < codecs_1.length; _i++) {
                    var codec = codecs_1[_i];
                    if (codec.is(a)) {
                        return codec.encode(a);
                    }
                }
                // https://github.com/gcanti/io-ts/pull/305
                throw new Error("no codec found to encode value in union type " + name);
            }, codecs);
    }
};
/**
 * @since 1.0.0
 */
var IntersectionType = /** @class */ (function (_super) {
    __extends(IntersectionType, _super);
    function IntersectionType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'IntersectionType';
        return _this;
    }
    return IntersectionType;
}(Type));
var mergeAll = function (base, us) {
    var r = base;
    for (var i = 0; i < us.length; i++) {
        var u = us[i];
        if (u !== base) {
            // `u` contains a prismatic value or is the result of a stripping combinator
            if (r === base) {
                r = Object.assign({}, u);
                continue;
            }
            for (var k in u) {
                if (u[k] !== base[k] || !r.hasOwnProperty(k)) {
                    r[k] = u[k];
                }
            }
        }
    }
    return r;
};
function intersection(codecs, name) {
    if (name === void 0) { name = "(" + codecs.map(function (type) { return type.name; }).join(' & ') + ")"; }
    var len = codecs.length;
    return new IntersectionType(name, function (u) { return codecs.every(function (type) { return type.is(u); }); }, codecs.length === 0
        ? success
        : function (u, c) {
            var us = [];
            var errors = [];
            for (var i = 0; i < len; i++) {
                var codec = codecs[i];
                var result = codec.validate(u, appendContext(c, String(i), codec, u));
                if (Either_13(result)) {
                    pushAll(errors, result.left);
                }
                else {
                    us.push(result.right);
                }
            }
            return errors.length > 0 ? failures(errors) : success(mergeAll(u, us));
        }, codecs.length === 0 ? identity : function (a) { return mergeAll(a, codecs.map(function (codec) { return codec.encode(a); })); }, codecs);
}
/**
 * @since 1.0.0
 */
var TupleType = /** @class */ (function (_super) {
    __extends(TupleType, _super);
    function TupleType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'TupleType';
        return _this;
    }
    return TupleType;
}(Type));
function tuple(codecs, name) {
    if (name === void 0) { name = "[" + codecs.map(function (type) { return type.name; }).join(', ') + "]"; }
    var len = codecs.length;
    return new TupleType(name, function (u) { return UnknownArray.is(u) && u.length === len && codecs.every(function (type, i) { return type.is(u[i]); }); }, function (u, c) {
        return chain(UnknownArray.validate(u, c), function (us) {
            var as = us.length > len ? us.slice(0, len) : us; // strip additional components
            var errors = [];
            for (var i = 0; i < len; i++) {
                var a = us[i];
                var type_3 = codecs[i];
                var result = type_3.validate(a, appendContext(c, String(i), type_3, a));
                if (Either_13(result)) {
                    pushAll(errors, result.left);
                }
                else {
                    var va = result.right;
                    if (va !== a) {
                        /* istanbul ignore next */
                        if (as === us) {
                            as = us.slice();
                        }
                        as[i] = va;
                    }
                }
            }
            return errors.length > 0 ? failures(errors) : success(as);
        });
    }, useIdentity(codecs) ? identity : function (a) { return codecs.map(function (type, i) { return type.encode(a[i]); }); }, codecs);
}
/**
 * @since 1.0.0
 */
var ReadonlyType = /** @class */ (function (_super) {
    __extends(ReadonlyType, _super);
    function ReadonlyType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ReadonlyType';
        return _this;
    }
    return ReadonlyType;
}(Type));
/**
 * @since 1.0.0
 */
var readonly = function (codec, name) {
    if (name === void 0) { name = "Readonly<" + codec.name + ">"; }
    return new ReadonlyType(name, codec.is, function (u, c) {
        return map(codec.validate(u, c), function (x) {
            {
                return Object.freeze(x);
            }
        });
    }, codec.encode === identity ? identity : codec.encode, codec);
};
/**
 * @since 1.0.0
 */
var ReadonlyArrayType = /** @class */ (function (_super) {
    __extends(ReadonlyArrayType, _super);
    function ReadonlyArrayType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ReadonlyArrayType';
        return _this;
    }
    return ReadonlyArrayType;
}(Type));
/**
 * @since 1.0.0
 */
var readonlyArray = function (codec, name) {
    if (name === void 0) { name = "ReadonlyArray<" + codec.name + ">"; }
    var arrayType = array(codec);
    return new ReadonlyArrayType(name, arrayType.is, function (u, c) {
        return map(arrayType.validate(u, c), function (x) {
            {
                return Object.freeze(x);
            }
        });
    }, arrayType.encode, codec);
};
/**
 * Strips additional properties
 * @since 1.0.0
 */
var strict = function (props, name) {
    return exact(type(props), name);
};
/**
 * @since 1.3.0
 * @deprecated
 */
var TaggedUnionType = /** @class */ (function (_super) {
    __extends(TaggedUnionType, _super);
    function TaggedUnionType(name, 
    // tslint:disable-next-line: deprecation
    is, 
    // tslint:disable-next-line: deprecation
    validate, 
    // tslint:disable-next-line: deprecation
    encode, codecs, tag) {
        var _this = _super.call(this, name, is, validate, encode, codecs) /* istanbul ignore next */ // <= workaround for https://github.com/Microsoft/TypeScript/issues/13455
         || this;
        _this.tag = tag;
        return _this;
    }
    return TaggedUnionType;
}(UnionType));
/**
 * Use `union` instead
 *
 * @since 1.3.0
 * @deprecated
 */
var taggedUnion = function (tag, codecs, name
// tslint:disable-next-line: deprecation
) {
    if (name === void 0) { name = getUnionName(codecs); }
    var U = union(codecs, name);
    // tslint:disable-next-line: deprecation
    if (U instanceof TaggedUnionType) {
        return U;
    }
    else {
        console.warn("[io-ts] Cannot build a tagged union for " + name + ", returning a de-optimized union");
        // tslint:disable-next-line: deprecation
        return new TaggedUnionType(name, U.is, U.validate, U.encode, codecs, tag);
    }
};
/**
 * @since 1.1.0
 */
var ExactType = /** @class */ (function (_super) {
    __extends(ExactType, _super);
    function ExactType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ExactType';
        return _this;
    }
    return ExactType;
}(Type));
var getProps = function (codec) {
    switch (codec._tag) {
        case 'RefinementType':
        case 'ReadonlyType':
            return getProps(codec.type);
        case 'InterfaceType':
        case 'StrictType':
        case 'PartialType':
            return codec.props;
        case 'IntersectionType':
            return codec.types.reduce(function (props, type) { return Object.assign(props, getProps(type)); }, {});
    }
};
var stripKeys = function (o, props) {
    var keys = Object.getOwnPropertyNames(o);
    var shouldStrip = false;
    var r = {};
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!hasOwnProperty.call(props, key)) {
            shouldStrip = true;
        }
        else {
            r[key] = o[key];
        }
    }
    return shouldStrip ? r : o;
};
var getExactTypeName = function (codec) {
    if (isInterfaceCodec(codec)) {
        return "{| " + getNameFromProps(codec.props) + " |}";
    }
    else if (isPartialCodec(codec)) {
        return getPartialTypeName("{| " + getNameFromProps(codec.props) + " |}");
    }
    return "Exact<" + codec.name + ">";
};
/**
 * Strips additional properties
 * @since 1.1.0
 */
var exact = function (codec, name) {
    if (name === void 0) { name = getExactTypeName(codec); }
    var props = getProps(codec);
    return new ExactType(name, codec.is, function (u, c) { return chain(UnknownRecord.validate(u, c), function () { return map(codec.validate(u, c), function (a) { return stripKeys(a, props); }); }); }, function (a) { return codec.encode(stripKeys(a, props)); }, codec);
};
/**
 * @since 1.0.0
 * @deprecated
 */
var getValidationError /* istanbul ignore next */ = function (value, context) { return ({
    value: value,
    context: context
}); };
/**
 * @since 1.0.0
 * @deprecated
 */
var getDefaultContext /* istanbul ignore next */ = function (decoder) { return [
    { key: '', type: decoder }
]; };
/**
 * @since 1.0.0
 * @deprecated
 */
var NeverType = /** @class */ (function (_super) {
    __extends(NeverType, _super);
    function NeverType() {
        var _this = _super.call(this, 'never', function (_) { return false; }, function (u, c) { return failure(u, c); }, 
        /* istanbul ignore next */
        function () {
            throw new Error('cannot encode never');
        }) || this;
        _this._tag = 'NeverType';
        return _this;
    }
    return NeverType;
}(Type));
/**
 * @since 1.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
var never = new NeverType();
/**
 * @since 1.0.0
 * @deprecated
 */
var AnyType = /** @class */ (function (_super) {
    __extends(AnyType, _super);
    function AnyType() {
        var _this = _super.call(this, 'any', function (_) { return true; }, success, identity) || this;
        _this._tag = 'AnyType';
        return _this;
    }
    return AnyType;
}(Type));
/**
 * Use `unknown` instead
 * @since 1.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
var any = new AnyType();
/**
 * Use `UnknownRecord` instead
 * @since 1.0.0
 * @deprecated
 */
var Dictionary = UnknownRecord;
/**
 * @since 1.0.0
 * @deprecated
 */
var ObjectType = /** @class */ (function (_super) {
    __extends(ObjectType, _super);
    function ObjectType() {
        var _this = _super.call(this, 'object', UnknownRecord.is, UnknownRecord.validate, identity) || this;
        _this._tag = 'ObjectType';
        return _this;
    }
    return ObjectType;
}(Type));
/**
 * Use `UnknownRecord` instead
 * @since 1.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
var object = new ObjectType();
/**
 * Use `brand` instead
 * @since 1.0.0
 * @deprecated
 */
function refinement(codec, predicate, name) {
    if (name === void 0) { name = "(" + codec.name + " | " + getFunctionName(predicate) + ")"; }
    return new RefinementType(name, function (u) { return codec.is(u) && predicate(u); }, function (i, c) { return chain(codec.validate(i, c), function (a) { return (predicate(a) ? success(a) : failure(a, c)); }); }, codec.encode, codec, predicate);
}
/**
 * Use `Int` instead
 * @since 1.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
var Integer = refinement(number, Number.isInteger, 'Integer');
/**
 * Use `record` instead
 * @since 1.0.0
 * @deprecated
 */
var dictionary = record;
/**
 * @since 1.0.0
 * @deprecated
 */
var StrictType = /** @class */ (function (_super) {
    __extends(StrictType, _super);
    function StrictType(name, 
    // tslint:disable-next-line: deprecation
    is, 
    // tslint:disable-next-line: deprecation
    validate, 
    // tslint:disable-next-line: deprecation
    encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'StrictType';
        return _this;
    }
    return StrictType;
}(Type));
/**
 * Drops the codec "kind"
 * @since 1.1.0
 * @deprecated
 */
function clean(codec) {
    return codec;
}
function alias(codec) {
    return function () { return codec; };
}
var isNonEmpty = function (as) { return as.length > 0; };
/**
 * @internal
 */
var emptyTags = {};
function intersect(a, b) {
    var r = [];
    for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
        var v = a_1[_i];
        if (b.indexOf(v) !== -1) {
            r.push(v);
        }
    }
    return r;
}
function mergeTags(a, b) {
    if (a === emptyTags) {
        return b;
    }
    if (b === emptyTags) {
        return a;
    }
    var r = Object.assign({}, a);
    for (var k in b) {
        if (a.hasOwnProperty(k)) {
            var intersection_1 = intersect(a[k], b[k]);
            if (isNonEmpty(intersection_1)) {
                r[k] = intersection_1;
            }
            else {
                r = emptyTags;
                break;
            }
        }
        else {
            r[k] = b[k];
        }
    }
    return r;
}
function intersectTags(a, b) {
    if (a === emptyTags || b === emptyTags) {
        return emptyTags;
    }
    var r = emptyTags;
    for (var k in a) {
        if (b.hasOwnProperty(k)) {
            var intersection_2 = intersect(a[k], b[k]);
            if (intersection_2.length === 0) {
                if (r === emptyTags) {
                    r = {};
                }
                r[k] = a[k].concat(b[k]);
            }
        }
    }
    return r;
}
function isLiteralC(codec) {
    return codec._tag === 'LiteralType';
}
function isTypeC(codec) {
    return codec._tag === 'InterfaceType';
}
// tslint:disable-next-line: deprecation
function isStrictC(codec) {
    return codec._tag === 'StrictType';
}
function isExactC(codec) {
    return codec._tag === 'ExactType';
}
// tslint:disable-next-line: deprecation
function isRefinementC(codec) {
    return codec._tag === 'RefinementType';
}
function isIntersectionC(codec) {
    return codec._tag === 'IntersectionType';
}
function isUnionC(codec) {
    return codec._tag === 'UnionType';
}
function isRecursiveC(codec) {
    return codec._tag === 'RecursiveType';
}
var lazyCodecs = [];
/**
 * @internal
 */
function getTags(codec) {
    if (lazyCodecs.indexOf(codec) !== -1) {
        return emptyTags;
    }
    if (isTypeC(codec) || isStrictC(codec)) {
        var index = emptyTags;
        // tslint:disable-next-line: forin
        for (var k in codec.props) {
            var prop = codec.props[k];
            if (isLiteralC(prop)) {
                if (index === emptyTags) {
                    index = {};
                }
                index[k] = [prop.value];
            }
        }
        return index;
    }
    else if (isExactC(codec) || isRefinementC(codec)) {
        return getTags(codec.type);
    }
    else if (isIntersectionC(codec)) {
        return codec.types.reduce(function (tags, codec) { return mergeTags(tags, getTags(codec)); }, emptyTags);
    }
    else if (isUnionC(codec)) {
        return codec.types.slice(1).reduce(function (tags, codec) { return intersectTags(tags, getTags(codec)); }, getTags(codec.types[0]));
    }
    else if (isRecursiveC(codec)) {
        lazyCodecs.push(codec);
        var tags = getTags(codec.type);
        lazyCodecs.pop();
        return tags;
    }
    return emptyTags;
}
/**
 * @internal
 */
function getIndex(codecs) {
    var tags = getTags(codecs[0]);
    var keys = Object.keys(tags);
    var len = codecs.length;
    var _loop_1 = function (k) {
        var all = tags[k].slice();
        var index = [tags[k]];
        for (var i = 1; i < len; i++) {
            var codec = codecs[i];
            var ctags = getTags(codec);
            var values = ctags[k];
            // tslint:disable-next-line: strict-type-predicates
            if (values === undefined) {
                return "continue-keys";
            }
            else {
                if (values.some(function (v) { return all.indexOf(v) !== -1; })) {
                    return "continue-keys";
                }
                else {
                    all.push.apply(all, values);
                    index.push(values);
                }
            }
        }
        return { value: [k, index] };
    };
    keys: for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var k = keys_1[_i];
        var state_1 = _loop_1(k);
        if (typeof state_1 === "object")
            return state_1.value;
        switch (state_1) {
            case "continue-keys": continue keys;
        }
    }
    return undefined;
}

export { AnyArrayType, AnyDictionaryType, AnyType, UnknownArray as Array, ArrayType, BooleanType, Dictionary, DictionaryType, ExactType, Function, FunctionType, Int, Integer, InterfaceType, IntersectionType, KeyofType, LiteralType, NeverType, NullType, NumberType, ObjectType, PartialType, ReadonlyArrayType, ReadonlyType, RecursiveType, RefinementType, StrictType, StringType, TaggedUnionType, TupleType, Type, UndefinedType, UnionType, UnknownArray, UnknownRecord, UnknownType, VoidType, alias, any, appendContext, array, boolean, brand, clean, dictionary, emptyTags, exact, failure, failures, getContextEntry, getDefaultContext, getFunctionName, getIndex, getTags, getValidationError, identity, type as interface, intersection, keyof, literal, never, nullType as null, nullType, number, object, partial, readonly, readonlyArray, record, recursion, refinement, strict, string, success, taggedUnion, tuple, type, undefinedType as undefined, union, unknown, voidType as void, voidType };
