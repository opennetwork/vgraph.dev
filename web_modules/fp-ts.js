

var Alt = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var Alternative = /*#__PURE__*/Object.freeze({
    __proto__: null
});

function getFunctorComposition(F, G) {
    return {
        map: function (fa, f) { return F.map(fa, function (ga) { return G.map(ga, f); }); }
    };
}

var Functor = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFunctorComposition: getFunctorComposition
});

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
function getApplicativeComposition(F, G) {
    return __assign(__assign({}, getFunctorComposition(F, G)), { of: function (a) { return F.of(G.of(a)); }, ap: function (fgab, fga) {
            return F.ap(F.map(fgab, function (h) { return function (ga) { return G.ap(h, ga); }; }), fga);
        } });
}

var Applicative = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getApplicativeComposition: getApplicativeComposition
});

/**
 * @since 2.0.0
 */
function identity(a) {
    return a;
}
/**
 * @since 2.0.0
 */
var unsafeCoerce = identity;
/**
 * @since 2.0.0
 */
function not(predicate) {
    return function (a) { return !predicate(a); };
}
/**
 * @since 2.0.0
 */
function constant(a) {
    return function () { return a; };
}
/**
 * A thunk that returns always `true`
 *
 * @since 2.0.0
 */
var constTrue = function () {
    return true;
};
/**
 * A thunk that returns always `false`
 *
 * @since 2.0.0
 */
var constFalse = function () {
    return false;
};
/**
 * A thunk that returns always `null`
 *
 * @since 2.0.0
 */
var constNull = function () {
    return null;
};
/**
 * A thunk that returns always `undefined`
 *
 * @since 2.0.0
 */
var constUndefined = function () {
    return;
};
/**
 * A thunk that returns always `void`
 *
 * @since 2.0.0
 */
var constVoid = function () {
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
/**
 * @since 2.0.0
 */
function increment(n) {
    return n + 1;
}
/**
 * @since 2.0.0
 */
function decrement(n) {
    return n - 1;
}
/**
 * @since 2.0.0
 */
function absurd(_) {
    throw new Error('Called `absurd` function which should be uncallable');
}

var _function = /*#__PURE__*/Object.freeze({
    __proto__: null,
    identity: identity,
    unsafeCoerce: unsafeCoerce,
    not: not,
    constant: constant,
    constTrue: constTrue,
    constFalse: constFalse,
    constNull: constNull,
    constUndefined: constUndefined,
    constVoid: constVoid,
    flip: flip,
    flow: flow,
    tuple: tuple,
    increment: increment,
    decrement: decrement,
    absurd: absurd
});

function curried(f, n, acc) {
    return function (x) {
        var combined = acc.concat([x]);
        return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined);
    };
}
var tupleConstructors = {};
function getTupleConstructor(len) {
    if (!tupleConstructors.hasOwnProperty(len)) {
        tupleConstructors[len] = curried(tuple, len - 1, []);
    }
    return tupleConstructors[len];
}
function sequenceT(F) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        var f = getTupleConstructor(len);
        var fas = F.map(args[0], f);
        for (var i = 1; i < len; i++) {
            fas = F.ap(fas, args[i]);
        }
        return fas;
    };
}
function getRecordConstructor(keys) {
    var len = keys.length;
    return curried(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var r = {};
        for (var i = 0; i < len; i++) {
            r[keys[i]] = args[i];
        }
        return r;
    }, len - 1, []);
}
function sequenceS(F) {
    return function (r) {
        var keys = Object.keys(r);
        var len = keys.length;
        var f = getRecordConstructor(keys);
        var fr = F.map(r[keys[0]], f);
        for (var i = 1; i < len; i++) {
            fr = F.ap(fr, r[keys[i]]);
        }
        return fr;
    };
}

var Apply = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sequenceT: sequenceT,
    sequenceS: sequenceS
});

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
        var flatten = function (mma) { return I.chain(mma, identity); };
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
        var duplicate = function (wa) { return I.extend(wa, identity); };
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

var pipeable$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    pipe: pipe,
    pipeable: pipeable
});

var __assign$1 = (undefined && undefined.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
/**
 * @since 2.0.0
 */
var URI = 'Option';
/**
 * @since 2.0.0
 */
var none = { _tag: 'None' };
/**
 * @since 2.0.0
 */
function some(a) {
    return { _tag: 'Some', value: a };
}
/**
 * Returns `true` if the option is an instance of `Some`, `false` otherwise
 *
 * @example
 * import { some, none, isSome } from 'fp-ts/lib/Option'
 *
 * assert.strictEqual(isSome(some(1)), true)
 * assert.strictEqual(isSome(none), false)
 *
 * @since 2.0.0
 */
function isSome(fa) {
    return fa._tag === 'Some';
}
/**
 * Returns `true` if the option is `None`, `false` otherwise
 *
 * @example
 * import { some, none, isNone } from 'fp-ts/lib/Option'
 *
 * assert.strictEqual(isNone(some(1)), false)
 * assert.strictEqual(isNone(none), true)
 *
 * @since 2.0.0
 */
function isNone(fa) {
    return fa._tag === 'None';
}
/**
 * Takes a default value, a function, and an `Option` value, if the `Option` value is `None` the default value is
 * returned, otherwise the function is applied to the value inside the `Some` and the result is returned.
 *
 * @example
 * import { some, none, fold } from 'fp-ts/lib/Option'
 * import { pipe } from 'fp-ts/lib/pipeable'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     fold(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a some containing 1'
 * )
 *
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     fold(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a none'
 * )
 *
 * @since 2.0.0
 */
function fold(onNone, onSome) {
    return function (ma) { return (isNone(ma) ? onNone() : onSome(ma.value)); };
}
/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`
 *
 * @example
 * import { none, some, fromNullable } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(fromNullable(undefined), none)
 * assert.deepStrictEqual(fromNullable(null), none)
 * assert.deepStrictEqual(fromNullable(1), some(1))
 *
 * @since 2.0.0
 */
function fromNullable(a) {
    return a == null ? none : some(a);
}
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `null`.
 *
 * @example
 * import { some, none, toNullable } from 'fp-ts/lib/Option'
 * import { pipe } from 'fp-ts/lib/pipeable'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toNullable
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toNullable
 *   ),
 *   null
 * )
 *
 * @since 2.0.0
 */
function toNullable(ma) {
    return isNone(ma) ? null : ma.value;
}
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `undefined`.
 *
 * @example
 * import { some, none, toUndefined } from 'fp-ts/lib/Option'
 * import { pipe } from 'fp-ts/lib/pipeable'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toUndefined
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toUndefined
 *   ),
 *   undefined
 * )
 *
 * @since 2.0.0
 */
function toUndefined(ma) {
    return isNone(ma) ? undefined : ma.value;
}
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns the given default value
 *
 * @example
 * import { some, none, getOrElse } from 'fp-ts/lib/Option'
 * import { pipe } from 'fp-ts/lib/pipeable'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @since 2.0.0
 */
function getOrElse(onNone) {
    return function (ma) { return (isNone(ma) ? onNone() : ma.value); };
}
/**
 * Returns `true` if `ma` contains `a`
 *
 * @example
 * import { some, none, elem } from 'fp-ts/lib/Option'
 * import { eqNumber } from 'fp-ts/lib/Eq'
 *
 * assert.strictEqual(elem(eqNumber)(1, some(1)), true)
 * assert.strictEqual(elem(eqNumber)(2, some(1)), false)
 * assert.strictEqual(elem(eqNumber)(1, none), false)
 *
 * @since 2.0.0
 */
function elem(E) {
    return function (a, ma) { return (isNone(ma) ? false : E.equals(a, ma.value)); };
}
/**
 * Returns `true` if the predicate is satisfied by the wrapped value
 *
 * @example
 * import { some, none, exists } from 'fp-ts/lib/Option'
 * import { pipe } from 'fp-ts/lib/pipeable'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 0)
 *   ),
 *   true
 * )
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 1)
 *   ),
 *   false
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     exists(n => n > 0)
 *   ),
 *   false
 * )
 *
 * @since 2.0.0
 */
function exists(predicate) {
    return function (ma) { return (isNone(ma) ? false : predicate(ma.value)); };
}
function fromPredicate(predicate) {
    return function (a) { return (predicate(a) ? some(a) : none); };
}
/**
 * Transforms an exception into an `Option`. If `f` throws, returns `None`, otherwise returns the output wrapped in
 * `Some`
 *
 * @example
 * import { none, some, tryCatch } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(
 *   tryCatch(() => {
 *     throw new Error()
 *   }),
 *   none
 * )
 * assert.deepStrictEqual(tryCatch(() => 1), some(1))
 *
 * @since 2.0.0
 */
function tryCatch(f) {
    try {
        return some(f());
    }
    catch (e) {
        return none;
    }
}
/**
 * Returns an `E` value if possible
 *
 * @since 2.0.0
 */
function getLeft(ma) {
    return ma._tag === 'Right' ? none : some(ma.left);
}
/**
 * Returns an `A` value if possible
 *
 * @since 2.0.0
 */
function getRight(ma) {
    return ma._tag === 'Left' ? none : some(ma.right);
}
/**
 * Returns a `Refinement` (i.e. a custom type guard) from a `Option` returning function.
 * This function ensures that a custom type guard definition is type-safe.
 *
 * ```ts
 * import { some, none, getRefinement } from 'fp-ts/lib/Option'
 *
 * type A = { type: 'A' }
 * type B = { type: 'B' }
 * type C = A | B
 *
 * const isA = (c: C): c is A => c.type === 'B' // <= typo but typescript doesn't complain
 * const isA = getRefinement<C, A>(c => (c.type === 'B' ? some(c) : none)) // static error: Type '"B"' is not assignable to type '"A"'
 * ```
 *
 * @since 2.0.0
 */
function getRefinement(getOption) {
    return function (a) { return isSome(getOption(a)); };
}
/**
 * This is `chain` + `fromNullable`, useful when working with optional values
 *
 * @example
 * import { some, none, fromNullable, mapNullable } from 'fp-ts/lib/Option'
 * import { pipe } from 'fp-ts/lib/pipeable'
 *
 * interface Employee {
 *   company?: {
 *     address?: {
 *       street?: {
 *         name?: string
 *       }
 *     }
 *   }
 * }
 *
 * const employee1: Employee = { company: { address: { street: { name: 'high street' } } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee1.company),
 *     mapNullable(company => company.address),
 *     mapNullable(address => address.street),
 *     mapNullable(street => street.name)
 *   ),
 *   some('high street')
 * )
 *
 * const employee2: Employee = { company: { address: { street: {} } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee2.company),
 *     mapNullable(company => company.address),
 *     mapNullable(address => address.street),
 *     mapNullable(street => street.name)
 *   ),
 *   none
 * )
 *
 * @since 2.0.0
 */
function mapNullable(f) {
    return function (ma) { return (isNone(ma) ? none : fromNullable(f(ma.value))); };
}
/**
 * @since 2.0.0
 */
function getShow(S) {
    return {
        show: function (ma) { return (isNone(ma) ? 'none' : "some(" + S.show(ma.value) + ")"); }
    };
}
/**
 * @example
 * import { none, some, getEq } from 'fp-ts/lib/Option'
 * import { eqNumber } from 'fp-ts/lib/Eq'
 *
 * const E = getEq(eqNumber)
 * assert.strictEqual(E.equals(none, none), true)
 * assert.strictEqual(E.equals(none, some(1)), false)
 * assert.strictEqual(E.equals(some(1), none), false)
 * assert.strictEqual(E.equals(some(1), some(2)), false)
 * assert.strictEqual(E.equals(some(1), some(1)), true)
 *
 * @since 2.0.0
 */
function getEq(E) {
    return {
        equals: function (x, y) { return x === y || (isNone(x) ? isNone(y) : isNone(y) ? false : E.equals(x.value, y.value)); }
    };
}
/**
 * The `Ord` instance allows `Option` values to be compared with
 * `compare`, whenever there is an `Ord` instance for
 * the type the `Option` contains.
 *
 * `None` is considered to be less than any `Some` value.
 *
 *
 * @example
 * import { none, some, getOrd } from 'fp-ts/lib/Option'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * const O = getOrd(ordNumber)
 * assert.strictEqual(O.compare(none, none), 0)
 * assert.strictEqual(O.compare(none, some(1)), -1)
 * assert.strictEqual(O.compare(some(1), none), 1)
 * assert.strictEqual(O.compare(some(1), some(2)), -1)
 * assert.strictEqual(O.compare(some(1), some(1)), 0)
 *
 * @since 2.0.0
 */
function getOrd(O) {
    return {
        equals: getEq(O).equals,
        compare: function (x, y) { return (x === y ? 0 : isSome(x) ? (isSome(y) ? O.compare(x.value, y.value) : 1) : -1); }
    };
}
/**
 * `Apply` semigroup
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | none               |
 * | none    | some(a) | none               |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getApplySemigroup, some, none } from 'fp-ts/lib/Option'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getApplySemigroup(semigroupSum)
 * assert.deepStrictEqual(S.concat(none, none), none)
 * assert.deepStrictEqual(S.concat(some(1), none), none)
 * assert.deepStrictEqual(S.concat(none, some(1)), none)
 * assert.deepStrictEqual(S.concat(some(1), some(2)), some(3))
 *
 * @since 2.0.0
 */
function getApplySemigroup(S) {
    return {
        concat: function (x, y) { return (isSome(x) && isSome(y) ? some(S.concat(x.value, y.value)) : none); }
    };
}
/**
 * @since 2.0.0
 */
function getApplyMonoid(M) {
    return __assign$1(__assign$1({}, getApplySemigroup(M)), { empty: some(M.empty) });
}
/**
 * Monoid returning the left-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(a) | some(a)      |
 * | some(a) | some(b) | some(a)      |
 *
 * @example
 * import { getFirstMonoid, some, none } from 'fp-ts/lib/Option'
 *
 * const M = getFirstMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(1))
 *
 * @since 2.0.0
 */
function getFirstMonoid() {
    return {
        concat: function (x, y) { return (isNone(x) ? y : x); },
        empty: none
    };
}
/**
 * Monoid returning the right-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(a) | some(a)      |
 * | some(a) | some(b) | some(b)      |
 *
 * @example
 * import { getLastMonoid, some, none } from 'fp-ts/lib/Option'
 *
 * const M = getLastMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(2))
 *
 * @since 2.0.0
 */
function getLastMonoid() {
    return {
        concat: function (x, y) { return (isNone(y) ? x : y); },
        empty: none
    };
}
/**
 * Monoid returning the left-most non-`None` value. If both operands are `Some`s then the inner values are
 * appended using the provided `Semigroup`
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | some(a)            |
 * | none    | some(a) | some(a)            |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getMonoid, some, none } from 'fp-ts/lib/Option'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const M = getMonoid(semigroupSum)
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(3))
 *
 * @since 2.0.0
 */
function getMonoid(S) {
    return {
        concat: function (x, y) { return (isNone(x) ? y : isNone(y) ? x : some(S.concat(x.value, y.value))); },
        empty: none
    };
}
var defaultSeparate = { left: none, right: none };
var identity$1 = function (a) { return a; };
/**
 * @since 2.0.0
 */
var option = {
    URI: URI,
    map: function (ma, f) { return (isNone(ma) ? none : some(f(ma.value))); },
    of: some,
    ap: function (mab, ma) { return (isNone(mab) ? none : isNone(ma) ? none : some(mab.value(ma.value))); },
    chain: function (ma, f) { return (isNone(ma) ? none : f(ma.value)); },
    reduce: function (fa, b, f) { return (isNone(fa) ? b : f(b, fa.value)); },
    foldMap: function (M) { return function (fa, f) { return (isNone(fa) ? M.empty : f(fa.value)); }; },
    reduceRight: function (fa, b, f) { return (isNone(fa) ? b : f(fa.value, b)); },
    traverse: function (F) { return function (ta, f) {
        return isNone(ta) ? F.of(none) : F.map(f(ta.value), some);
    }; },
    sequence: function (F) { return function (ta) {
        return isNone(ta) ? F.of(none) : F.map(ta.value, some);
    }; },
    zero: function () { return none; },
    alt: function (ma, f) { return (isNone(ma) ? f() : ma); },
    extend: function (wa, f) { return (isNone(wa) ? none : some(f(wa))); },
    compact: function (ma) { return option.chain(ma, identity$1); },
    separate: function (ma) {
        var o = option.map(ma, function (e) { return ({
            left: getLeft(e),
            right: getRight(e)
        }); });
        return isNone(o) ? defaultSeparate : o.value;
    },
    filter: function (fa, predicate) {
        return isNone(fa) ? none : predicate(fa.value) ? fa : none;
    },
    filterMap: function (ma, f) { return (isNone(ma) ? none : f(ma.value)); },
    partition: function (fa, predicate) {
        return {
            left: option.filter(fa, function (a) { return !predicate(a); }),
            right: option.filter(fa, predicate)
        };
    },
    partitionMap: function (fa, f) { return option.separate(option.map(fa, f)); },
    wither: function (F) { return function (fa, f) {
        return isNone(fa) ? F.of(none) : f(fa.value);
    }; },
    wilt: function (F) { return function (fa, f) {
        var o = option.map(fa, function (a) {
            return F.map(f(a), function (e) { return ({
                left: getLeft(e),
                right: getRight(e)
            }); });
        });
        return isNone(o)
            ? F.of({
                left: none,
                right: none
            })
            : o.value;
    }; },
    throwError: function () { return none; }
};
var _a = pipeable(option), alt = _a.alt, ap = _a.ap, apFirst = _a.apFirst, apSecond = _a.apSecond, chain = _a.chain, chainFirst = _a.chainFirst, duplicate = _a.duplicate, extend = _a.extend, filter = _a.filter, filterMap = _a.filterMap, flatten = _a.flatten, foldMap = _a.foldMap, map = _a.map, partition = _a.partition, partitionMap = _a.partitionMap, reduce = _a.reduce, reduceRight = _a.reduceRight, compact = _a.compact, separate = _a.separate, fromEither = _a.fromEither;

var Option = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI,
    none: none,
    some: some,
    isSome: isSome,
    isNone: isNone,
    fold: fold,
    fromNullable: fromNullable,
    toNullable: toNullable,
    toUndefined: toUndefined,
    getOrElse: getOrElse,
    elem: elem,
    exists: exists,
    fromPredicate: fromPredicate,
    tryCatch: tryCatch,
    getLeft: getLeft,
    getRight: getRight,
    getRefinement: getRefinement,
    mapNullable: mapNullable,
    getShow: getShow,
    getEq: getEq,
    getOrd: getOrd,
    getApplySemigroup: getApplySemigroup,
    getApplyMonoid: getApplyMonoid,
    getFirstMonoid: getFirstMonoid,
    getLastMonoid: getLastMonoid,
    getMonoid: getMonoid,
    option: option,
    alt: alt,
    ap: ap,
    apFirst: apFirst,
    apSecond: apSecond,
    chain: chain,
    chainFirst: chainFirst,
    duplicate: duplicate,
    extend: extend,
    filter: filter,
    filterMap: filterMap,
    flatten: flatten,
    foldMap: foldMap,
    map: map,
    partition: partition,
    partitionMap: partitionMap,
    reduce: reduce,
    reduceRight: reduceRight,
    compact: compact,
    separate: separate,
    fromEither: fromEither
});

/**
 * @since 2.0.0
 */
function sign(n) {
    return n <= -1 ? -1 : n >= 1 ? 1 : 0;
}
/**
 * @since 2.0.0
 */
var eqOrdering = {
    equals: function (x, y) { return x === y; }
};
/**
 * @since 2.0.0
 */
var semigroupOrdering = {
    concat: function (x, y) { return (x !== 0 ? x : y); }
};
/**
 * @since 2.0.0
 */
function invert(O) {
    switch (O) {
        case -1:
            return 1;
        case 1:
            return -1;
        default:
            return 0;
    }
}

var Ordering = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sign: sign,
    eqOrdering: eqOrdering,
    semigroupOrdering: semigroupOrdering,
    invert: invert
});

/**
 * @file The `Ord` type class represents types which support comparisons with a _total order_.
 *
 * Instances should satisfy the laws of total orderings:
 *
 * 1. Reflexivity: `S.compare(a, a) <= 0`
 * 2. Antisymmetry: if `S.compare(a, b) <= 0` and `S.compare(b, a) <= 0` then `a <-> b`
 * 3. Transitivity: if `S.compare(a, b) <= 0` and `S.compare(b, c) <= 0` then `S.compare(a, c) <= 0`
 *
 * See [Getting started with fp-ts: Ord](https://dev.to/gcanti/getting-started-with-fp-ts-ord-5f1e)
 */
/**
 * @since 2.0.0
 */
var URI$1 = 'Ord';
// default compare for primitive types
var compare = function (x, y) {
    return x < y ? -1 : x > y ? 1 : 0;
};
function strictEqual(a, b) {
    return a === b;
}
/**
 * @since 2.0.0
 */
var ordString = {
    equals: strictEqual,
    compare: compare
};
/**
 * @since 2.0.0
 */
var ordNumber = {
    equals: strictEqual,
    compare: compare
};
/**
 * @since 2.0.0
 */
var ordBoolean = {
    equals: strictEqual,
    compare: compare
};
/**
 * Test whether one value is _strictly less than_ another
 *
 * @since 2.0.0
 */
function lt(O) {
    return function (x, y) { return O.compare(x, y) === -1; };
}
/**
 * Test whether one value is _strictly greater than_ another
 *
 * @since 2.0.0
 */
function gt(O) {
    return function (x, y) { return O.compare(x, y) === 1; };
}
/**
 * Test whether one value is _non-strictly less than_ another
 *
 * @since 2.0.0
 */
function leq(O) {
    return function (x, y) { return O.compare(x, y) !== 1; };
}
/**
 * Test whether one value is _non-strictly greater than_ another
 *
 * @since 2.0.0
 */
function geq(O) {
    return function (x, y) { return O.compare(x, y) !== -1; };
}
/**
 * Take the minimum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
function min(O) {
    return function (x, y) { return (O.compare(x, y) === 1 ? y : x); };
}
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
function max(O) {
    return function (x, y) { return (O.compare(x, y) === -1 ? y : x); };
}
/**
 * Clamp a value between a minimum and a maximum
 *
 * @since 2.0.0
 */
function clamp(O) {
    var minO = min(O);
    var maxO = max(O);
    return function (low, hi) { return function (x) { return maxO(minO(x, hi), low); }; };
}
/**
 * Test whether a value is between a minimum and a maximum (inclusive)
 *
 * @since 2.0.0
 */
function between(O) {
    var lessThanO = lt(O);
    var greaterThanO = gt(O);
    return function (low, hi) { return function (x) { return (lessThanO(x, low) || greaterThanO(x, hi) ? false : true); }; };
}
/**
 * @since 2.0.0
 */
function fromCompare(compare) {
    var optimizedCompare = function (x, y) { return (x === y ? 0 : compare(x, y)); };
    return {
        equals: function (x, y) { return optimizedCompare(x, y) === 0; },
        compare: optimizedCompare
    };
}
/**
 * Returns an `Ord` such that its `concat(ord1, ord2)` operation will order first by `ord1`, and then by `ord2`.
 *
 * @example
 * import { sort } from 'fp-ts/lib/Array'
 * import { contramap, getDualOrd, getSemigroup, ordBoolean, ordNumber, ordString } from 'fp-ts/lib/Ord'
 * import { pipe } from 'fp-ts/lib/pipeable'
 * import { fold } from 'fp-ts/lib/Semigroup'
 *
 * interface User {
 *   id: number
 *   name: string
 *   age: number
 *   rememberMe: boolean
 * }
 *
 * const byName = pipe(
 *   ordString,
 *   contramap((p: User) => p.name)
 * )
 *
 * const byAge = pipe(
 *   ordNumber,
 *   contramap((p: User) => p.age)
 * )
 *
 * const byRememberMe = pipe(
 *   ordBoolean,
 *   contramap((p: User) => p.rememberMe)
 * )
 *
 * const S = getSemigroup<User>()
 *
 * const users: Array<User> = [
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true }
 * ]
 *
 * // sort by name, then by age, then by `rememberMe`
 * const O1 = fold(S)(byName, [byAge, byRememberMe])
 * assert.deepStrictEqual(sort(O1)(users), [
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * // now `rememberMe = true` first, then by name, then by age
 * const O2 = fold(S)(getDualOrd(byRememberMe), [byName, byAge])
 * assert.deepStrictEqual(sort(O2)(users), [
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * @since 2.0.0
 */
function getSemigroup() {
    return {
        concat: function (x, y) { return fromCompare(function (a, b) { return semigroupOrdering.concat(x.compare(a, b), y.compare(a, b)); }); }
    };
}
/**
 * Given a tuple of `Ord`s returns an `Ord` for the tuple
 *
 * @example
 * import { getTupleOrd, ordString, ordNumber, ordBoolean } from 'fp-ts/lib/Ord'
 *
 * const O = getTupleOrd(ordString, ordNumber, ordBoolean)
 * assert.strictEqual(O.compare(['a', 1, true], ['b', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 1, false]), 1)
 *
 * @since 2.0.0
 */
function getTupleOrd() {
    var ords = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ords[_i] = arguments[_i];
    }
    var len = ords.length;
    return fromCompare(function (x, y) {
        var i = 0;
        for (; i < len - 1; i++) {
            var r = ords[i].compare(x[i], y[i]);
            if (r !== 0) {
                return r;
            }
        }
        return ords[i].compare(x[i], y[i]);
    });
}
/**
 * @since 2.0.0
 */
function getDualOrd(O) {
    return fromCompare(function (x, y) { return O.compare(y, x); });
}
/**
 * @since 2.0.0
 */
var ord = {
    URI: URI$1,
    contramap: function (fa, f) { return fromCompare(function (x, y) { return fa.compare(f(x), f(y)); }); }
};
var contramap = pipeable(ord).contramap;
/**
 * @since 2.0.0
 */
var ordDate = ord.contramap(ordNumber, function (date) { return date.valueOf(); });

var Ord = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$1,
    ordString: ordString,
    ordNumber: ordNumber,
    ordBoolean: ordBoolean,
    lt: lt,
    gt: gt,
    leq: leq,
    geq: geq,
    min: min,
    max: max,
    clamp: clamp,
    between: between,
    fromCompare: fromCompare,
    getSemigroup: getSemigroup,
    getTupleOrd: getTupleOrd,
    getDualOrd: getDualOrd,
    ord: ord,
    contramap: contramap,
    ordDate: ordDate
});

/**
 * @since 2.0.0
 */
var URI$2 = 'Array';
/**
 * @since 2.0.0
 */
function getShow$1(S) {
    return {
        show: function (as) { return "[" + as.map(S.show).join(', ') + "]"; }
    };
}
var concat = function (x, y) {
    var lenx = x.length;
    if (lenx === 0) {
        return y;
    }
    var leny = y.length;
    if (leny === 0) {
        return x;
    }
    var r = Array(lenx + leny);
    for (var i = 0; i < lenx; i++) {
        r[i] = x[i];
    }
    for (var i = 0; i < leny; i++) {
        r[i + lenx] = y[i];
    }
    return r;
};
/**
 * Returns a `Monoid` for `Array<A>`
 *
 * @example
 * import { getMonoid } from 'fp-ts/lib/Array'
 *
 * const M = getMonoid<number>()
 * assert.deepStrictEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
 *
 * @since 2.0.0
 */
function getMonoid$1() {
    return {
        concat: concat,
        empty: empty
    };
}
/**
 * Derives an `Eq` over the `Array` of a given element type from the `Eq` of that type. The derived `Eq` defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given `E`. In case of arrays of
 * different lengths, the result is non equality.
 *
 * @example
 * import { eqString } from 'fp-ts/lib/Eq'
 * import { getEq } from 'fp-ts/lib/Array'
 *
 * const E = getEq(eqString)
 * assert.strictEqual(E.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(E.equals(['a'], []), false)
 *
 * @since 2.0.0
 */
function getEq$1(E) {
    return {
        equals: function (xs, ys) { return xs === ys || (xs.length === ys.length && xs.every(function (x, i) { return E.equals(x, ys[i]); })); }
    };
}
/**
 * Derives an `Ord` over the `Array` of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 * @example
 * import { getOrd } from 'fp-ts/lib/Array'
 * import { ordString } from 'fp-ts/lib/Ord'
 *
 * const O = getOrd(ordString)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 *
 * @since 2.0.0
 */
function getOrd$1(O) {
    return fromCompare(function (a, b) {
        var aLen = a.length;
        var bLen = b.length;
        var len = Math.min(aLen, bLen);
        for (var i = 0; i < len; i++) {
            var ordering = O.compare(a[i], b[i]);
            if (ordering !== 0) {
                return ordering;
            }
        }
        return ordNumber.compare(aLen, bLen);
    });
}
/**
 * An empty array
 *
 * @since 2.0.0
 */
var empty = [];
/**
 * Return a list of length `n` with element `i` initialized with `f(i)`
 *
 * @example
 * import { makeBy } from 'fp-ts/lib/Array'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @since 2.0.0
 */
function makeBy(n, f) {
    var r = [];
    for (var i = 0; i < n; i++) {
        r.push(f(i));
    }
    return r;
}
/**
 * Create an array containing a range of integers, including both endpoints
 *
 * @example
 * import { range } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @since 2.0.0
 */
function range(start, end) {
    return makeBy(end - start + 1, function (i) { return start + i; });
}
/**
 * Create an array containing a value repeated the specified number of times
 *
 * @example
 * import { replicate } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(replicate(3, 'a'), ['a', 'a', 'a'])
 *
 * @since 2.0.0
 */
function replicate(n, a) {
    return makeBy(n, function () { return a; });
}
/**
 * Removes one level of nesting
 *
 * @example
 * import { flatten } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(flatten([[1], [2], [3]]), [1, 2, 3])
 *
 * @since 2.0.0
 */
function flatten$1(mma) {
    var rLen = 0;
    var len = mma.length;
    for (var i = 0; i < len; i++) {
        rLen += mma[i].length;
    }
    var r = Array(rLen);
    var start = 0;
    for (var i = 0; i < len; i++) {
        var arr = mma[i];
        var l = arr.length;
        for (var j = 0; j < l; j++) {
            r[j + start] = arr[j];
        }
        start += l;
    }
    return r;
}
/**
 * Break an array into its first element and remaining elements
 *
 * @example
 * import { foldLeft } from 'fp-ts/lib/Array'
 *
 * const len: <A>(as: Array<A>) => number = foldLeft(() => 0, (_, tail) => 1 + len(tail))
 * assert.strictEqual(len([1, 2, 3]), 3)
 *
 * @since 2.0.0
 */
function foldLeft(onNil, onCons) {
    return function (as) { return (isEmpty(as) ? onNil() : onCons(as[0], as.slice(1))); };
}
/**
 * Break an array into its initial elements and the last element
 *
 * @since 2.0.0
 */
function foldRight(onNil, onCons) {
    return function (as) { return (isEmpty(as) ? onNil() : onCons(as.slice(0, as.length - 1), as[as.length - 1])); };
}
/**
 * Same as `reduce` but it carries over the intermediate steps
 *
 * ```ts
 * import { scanLeft } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(scanLeft(10, (b, a: number) => b - a)([1, 2, 3]), [10, 9, 7, 4])
 * ```
 *
 * @since 2.0.0
 */
function scanLeft(b, f) {
    return function (as) {
        var l = as.length;
        var r = new Array(l + 1);
        r[0] = b;
        for (var i = 0; i < l; i++) {
            r[i + 1] = f(r[i], as[i]);
        }
        return r;
    };
}
/**
 * Fold an array from the right, keeping all intermediate results instead of only the final result
 *
 * @example
 * import { scanRight } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(scanRight(10, (a: number, b) => b - a)([1, 2, 3]), [4, 5, 7, 10])
 *
 * @since 2.0.0
 */
function scanRight(b, f) {
    return function (as) {
        var l = as.length;
        var r = new Array(l + 1);
        r[l] = b;
        for (var i = l - 1; i >= 0; i--) {
            r[i] = f(as[i], r[i + 1]);
        }
        return r;
    };
}
/**
 * Test whether an array is empty
 *
 * @example
 * import { isEmpty } from 'fp-ts/lib/Array'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @since 2.0.0
 */
function isEmpty(as) {
    return as.length === 0;
}
/**
 * Test whether an array is non empty narrowing down the type to `NonEmptyArray<A>`
 *
 * @since 2.0.0
 */
function isNonEmpty(as) {
    return as.length > 0;
}
/**
 * Test whether an array contains a particular index
 *
 * @since 2.0.0
 */
function isOutOfBound(i, as) {
    return i < 0 || i >= as.length;
}
/**
 * This function provides a safe way to read a value at a particular index from an array
 *
 * @example
 * import { lookup } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(lookup(1, [1, 2, 3]), some(2))
 * assert.deepStrictEqual(lookup(3, [1, 2, 3]), none)
 *
 * @since 2.0.0
 */
function lookup(i, as) {
    return isOutOfBound(i, as) ? none : some(as[i]);
}
/**
 * Attaches an element to the front of an array, creating a new non empty array
 *
 * @example
 * import { cons } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(cons(0, [1, 2, 3]), [0, 1, 2, 3])
 *
 * @since 2.0.0
 */
function cons(head, tail) {
    var len = tail.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i + 1] = tail[i];
    }
    r[0] = head;
    return r;
}
/**
 * Append an element to the end of an array, creating a new non empty array
 *
 * @example
 * import { snoc } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(snoc([1, 2, 3], 4), [1, 2, 3, 4])
 *
 * @since 2.0.0
 */
function snoc(init, end) {
    var len = init.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i] = init[i];
    }
    r[len] = end;
    return r;
}
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
 * assert.deepStrictEqual(head([]), none)
 *
 * @since 2.0.0
 */
function head(as) {
    return isEmpty(as) ? none : some(as[0]);
}
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
 * assert.deepStrictEqual(last([]), none)
 *
 * @since 2.0.0
 */
function last(as) {
    return lookup(as.length - 1, as);
}
/**
 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { tail } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(tail([]), none)
 *
 * @since 2.0.0
 */
function tail(as) {
    return isEmpty(as) ? none : some(as.slice(1));
}
/**
 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { init } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepStrictEqual(init([]), none)
 *
 * @since 2.0.0
 */
function init(as) {
    var len = as.length;
    return len === 0 ? none : some(as.slice(0, len - 1));
}
/**
 * Keep only a number of elements from the start of an array, creating a new array.
 * `n` must be a natural number
 *
 * @example
 * import { takeLeft } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(takeLeft(2)([1, 2, 3]), [1, 2])
 *
 * @since 2.0.0
 */
function takeLeft(n) {
    return function (as) { return as.slice(0, n); };
}
/**
 * Keep only a number of elements from the end of an array, creating a new array.
 * `n` must be a natural number
 *
 * @example
 * import { takeRight } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(takeRight(2)([1, 2, 3, 4, 5]), [4, 5])
 *
 * @since 2.0.0
 */
function takeRight(n) {
    return function (as) { return (n === 0 ? empty : as.slice(-n)); };
}
function takeLeftWhile(predicate) {
    return function (as) {
        var i = spanIndexUncurry(as, predicate);
        var init = Array(i);
        for (var j = 0; j < i; j++) {
            init[j] = as[j];
        }
        return init;
    };
}
var spanIndexUncurry = function (as, predicate) {
    var l = as.length;
    var i = 0;
    for (; i < l; i++) {
        if (!predicate(as[i])) {
            break;
        }
    }
    return i;
};
function spanLeft(predicate) {
    return function (as) {
        var i = spanIndexUncurry(as, predicate);
        var init = Array(i);
        for (var j = 0; j < i; j++) {
            init[j] = as[j];
        }
        var l = as.length;
        var rest = Array(l - i);
        for (var j = i; j < l; j++) {
            rest[j - i] = as[j];
        }
        return { init: init, rest: rest };
    };
}
/**
 * Drop a number of elements from the start of an array, creating a new array
 *
 * @example
 * import { dropLeft } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(dropLeft(2)([1, 2, 3]), [3])
 *
 * @since 2.0.0
 */
function dropLeft(n) {
    return function (as) { return as.slice(n, as.length); };
}
/**
 * Drop a number of elements from the end of an array, creating a new array
 *
 * @example
 * import { dropRight } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(dropRight(2)([1, 2, 3, 4, 5]), [1, 2, 3])
 *
 * @since 2.0.0
 */
function dropRight(n) {
    return function (as) { return as.slice(0, as.length - n); };
}
/**
 * Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new array
 *
 * @example
 * import { dropLeftWhile } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(dropLeftWhile((n: number) => n % 2 === 1)([1, 3, 2, 4, 5]), [2, 4, 5])
 *
 * @since 2.0.0
 */
function dropLeftWhile(predicate) {
    return function (as) {
        var i = spanIndexUncurry(as, predicate);
        var l = as.length;
        var rest = Array(l - i);
        for (var j = i; j < l; j++) {
            rest[j - i] = as[j];
        }
        return rest;
    };
}
/**
 * Find the first index for which a predicate holds
 *
 * @example
 * import { findIndex } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
 *
 * @since 2.0.0
 */
function findIndex(predicate) {
    return function (as) {
        var len = as.length;
        for (var i = 0; i < len; i++) {
            if (predicate(as[i])) {
                return some(i);
            }
        }
        return none;
    };
}
function findFirst(predicate) {
    return function (as) {
        var len = as.length;
        for (var i = 0; i < len; i++) {
            if (predicate(as[i])) {
                return some(as[i]);
            }
        }
        return none;
    };
}
/**
 * Find the first element returned by an option based selector function
 *
 * @example
 * import { findFirstMap } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * interface Person {
 *   name: string
 *   age?: number
 * }
 *
 * const persons: Array<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the first person that has an age
 * assert.deepStrictEqual(findFirstMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Mary'))
 *
 * @since 2.0.0
 */
function findFirstMap(f) {
    return function (as) {
        var len = as.length;
        for (var i = 0; i < len; i++) {
            var v = f(as[i]);
            if (isSome(v)) {
                return v;
            }
        }
        return none;
    };
}
function findLast(predicate) {
    return function (as) {
        var len = as.length;
        for (var i = len - 1; i >= 0; i--) {
            if (predicate(as[i])) {
                return some(as[i]);
            }
        }
        return none;
    };
}
/**
 * Find the last element returned by an option based selector function
 *
 * @example
 * import { findLastMap } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * interface Person {
 *   name: string
 *   age?: number
 * }
 *
 * const persons: Array<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the last person that has an age
 * assert.deepStrictEqual(findLastMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Joey'))
 *
 * @since 2.0.0
 */
function findLastMap(f) {
    return function (as) {
        var len = as.length;
        for (var i = len - 1; i >= 0; i--) {
            var v = f(as[i]);
            if (isSome(v)) {
                return v;
            }
        }
        return none;
    };
}
/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @example
 * import { findLastIndex } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * interface X {
 *   a: number
 *   b: number
 * }
 * const xs: Array<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepStrictEqual(findLastIndex((x: { a: number }) => x.a === 1)(xs), some(1))
 * assert.deepStrictEqual(findLastIndex((x: { a: number }) => x.a === 4)(xs), none)
 *
 *
 * @since 2.0.0
 */
function findLastIndex(predicate) {
    return function (as) {
        var len = as.length;
        for (var i = len - 1; i >= 0; i--) {
            if (predicate(as[i])) {
                return some(i);
            }
        }
        return none;
    };
}
/**
 * @since 2.0.0
 */
function copy(as) {
    var l = as.length;
    var r = Array(l);
    for (var i = 0; i < l; i++) {
        r[i] = as[i];
    }
    return r;
}
/**
 * @since 2.0.0
 */
function unsafeInsertAt(i, a, as) {
    var xs = copy(as);
    xs.splice(i, 0, a);
    return xs;
}
/**
 * Insert an element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { insertAt } from 'fp-ts/lib/Array'
 * import { some } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(insertAt(2, 5)([1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @since 2.0.0
 */
function insertAt(i, a) {
    return function (as) { return (i < 0 || i > as.length ? none : some(unsafeInsertAt(i, a, as))); };
}
/**
 * @since 2.0.0
 */
function unsafeUpdateAt(i, a, as) {
    if (as[i] === a) {
        return as;
    }
    else {
        var xs = copy(as);
        xs[i] = a;
        return xs;
    }
}
/**
 * Change the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { updateAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(updateAt(1, 1)([1, 2, 3]), some([1, 1, 3]))
 * assert.deepStrictEqual(updateAt(1, 1)([]), none)
 *
 * @since 2.0.0
 */
function updateAt(i, a) {
    return function (as) { return (isOutOfBound(i, as) ? none : some(unsafeUpdateAt(i, a, as))); };
}
/**
 * @since 2.0.0
 */
function unsafeDeleteAt(i, as) {
    var xs = copy(as);
    xs.splice(i, 1);
    return xs;
}
/**
 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { deleteAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(deleteAt(0)([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(deleteAt(1)([]), none)
 *
 * @since 2.0.0
 */
function deleteAt(i) {
    return function (as) { return (isOutOfBound(i, as) ? none : some(unsafeDeleteAt(i, as))); };
}
/**
 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
 * of bounds
 *
 * @example
 * import { modifyAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepStrictEqual(modifyAt(1, double)([1, 2, 3]), some([1, 4, 3]))
 * assert.deepStrictEqual(modifyAt(1, double)([]), none)
 *
 * @since 2.0.0
 */
function modifyAt(i, f) {
    return function (as) { return (isOutOfBound(i, as) ? none : some(unsafeUpdateAt(i, f(as[i]), as))); };
}
/**
 * Reverse an array, creating a new array
 *
 * @example
 * import { reverse } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @since 2.0.0
 */
function reverse(as) {
    return copy(as).reverse();
}
/**
 * Extracts from an array of `Either` all the `Right` elements. All the `Right` elements are extracted in order
 *
 * @example
 * import { rights } from 'fp-ts/lib/Array'
 * import { right, left } from 'fp-ts/lib/Either'
 *
 * assert.deepStrictEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
 *
 * @since 2.0.0
 */
function rights(as) {
    var r = [];
    var len = as.length;
    for (var i = 0; i < len; i++) {
        var a = as[i];
        if (a._tag === 'Right') {
            r.push(a.right);
        }
    }
    return r;
}
/**
 * Extracts from an array of `Either` all the `Left` elements. All the `Left` elements are extracted in order
 *
 * @example
 * import { lefts } from 'fp-ts/lib/Array'
 * import { left, right } from 'fp-ts/lib/Either'
 *
 * assert.deepStrictEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @since 2.0.0
 */
function lefts(as) {
    var r = [];
    var len = as.length;
    for (var i = 0; i < len; i++) {
        var a = as[i];
        if (a._tag === 'Left') {
            r.push(a.left);
        }
    }
    return r;
}
/**
 * Sort the elements of an array in increasing order, creating a new array
 *
 * @example
 * import { sort } from 'fp-ts/lib/Array'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepStrictEqual(sort(ordNumber)([3, 2, 1]), [1, 2, 3])
 *
 * @since 2.0.0
 */
function sort(O) {
    return function (as) { return copy(as).sort(O.compare); };
}
/**
 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
 * input array is short, excess elements of the longer array are discarded.
 *
 * @example
 * import { zipWith } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
 *
 * @since 2.0.0
 */
function zipWith(fa, fb, f) {
    var fc = [];
    var len = Math.min(fa.length, fb.length);
    for (var i = 0; i < len; i++) {
        fc[i] = f(fa[i], fb[i]);
    }
    return fc;
}
/**
 * Takes two arrays and returns an array of corresponding pairs. If one input array is short, excess elements of the
 * longer array are discarded
 *
 * @example
 * import { zip } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(zip([1, 2, 3], ['a', 'b', 'c', 'd']), [[1, 'a'], [2, 'b'], [3, 'c']])
 *
 * @since 2.0.0
 */
function zip(fa, fb) {
    return zipWith(fa, fb, function (a, b) { return [a, b]; });
}
/**
 * The function is reverse of `zip`. Takes an array of pairs and return two corresponding arrays
 *
 * @example
 * import { unzip } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(unzip([[1, 'a'], [2, 'b'], [3, 'c']]), [[1, 2, 3], ['a', 'b', 'c']])
 *
 * @since 2.0.0
 */
function unzip(as) {
    var fa = [];
    var fb = [];
    for (var i = 0; i < as.length; i++) {
        fa[i] = as[i][0];
        fb[i] = as[i][1];
    }
    return [fa, fb];
}
/**
 * Rotate an array to the right by `n` steps
 *
 * @example
 * import { rotate } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 *
 * @since 2.0.0
 */
function rotate(n) {
    return function (as) {
        var len = as.length;
        if (n === 0 || len <= 1 || len === Math.abs(n)) {
            return as;
        }
        else if (n < 0) {
            return rotate(len + n)(as);
        }
        else {
            return as.slice(-n).concat(as.slice(0, len - n));
        }
    };
}
/**
 * Test if a value is a member of an array. Takes a `Eq<A>` as a single
 * argument which returns the function to use to search for a value of type `A` in
 * an array of type `Array<A>`.
 *
 * @example
 * import { elem } from 'fp-ts/lib/Array'
 * import { eqNumber } from 'fp-ts/lib/Eq'
 *
 * assert.strictEqual(elem(eqNumber)(1, [1, 2, 3]), true)
 * assert.strictEqual(elem(eqNumber)(4, [1, 2, 3]), false)
 *
 * @since 2.0.0
 */
function elem$1(E) {
    return function (a, as) {
        var predicate = function (element) { return E.equals(element, a); };
        var i = 0;
        var len = as.length;
        for (; i < len; i++) {
            if (predicate(as[i])) {
                return true;
            }
        }
        return false;
    };
}
/**
 * Remove duplicates from an array, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/lib/Array'
 * import { eqNumber } from 'fp-ts/lib/Eq'
 *
 * assert.deepStrictEqual(uniq(eqNumber)([1, 2, 1]), [1, 2])
 *
 * @since 2.0.0
 */
function uniq(E) {
    var elemS = elem$1(E);
    return function (as) {
        var r = [];
        var len = as.length;
        var i = 0;
        for (; i < len; i++) {
            var a = as[i];
            if (!elemS(a, r)) {
                r.push(a);
            }
        }
        return len === r.length ? as : r;
    };
}
/**
 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import { sortBy } from 'fp-ts/lib/Array'
 * import { ord, ordString, ordNumber } from 'fp-ts/lib/Ord'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 * const byName = ord.contramap(ordString, (p: Person) => p.name)
 * const byAge = ord.contramap(ordNumber, (p: Person) => p.age)
 *
 * const sortByNameByAge = sortBy([byName, byAge])
 *
 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @since 2.0.0
 */
function sortBy(ords) {
    return sort(ords.slice(1).reduce(getSemigroup().concat, ords[0]));
}
/**
 * A useful recursion pattern for processing an array to produce a new array, often used for "chopping" up the input
 * array. Typically chop is called with some function that will consume an initial prefix of the array and produce a
 * value and the rest of the array.
 *
 * @example
 * import { Eq, eqNumber } from 'fp-ts/lib/Eq'
 * import { chop, spanLeft } from 'fp-ts/lib/Array'
 *
 * const group = <A>(S: Eq<A>): ((as: Array<A>) => Array<Array<A>>) => {
 *   return chop(as => {
 *     const { init, rest } = spanLeft((a: A) => S.equals(a, as[0]))(as)
 *     return [init, rest]
 *   })
 * }
 * assert.deepStrictEqual(group(eqNumber)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @since 2.0.0
 */
function chop(f) {
    return function (as) {
        var result = [];
        var cs = as;
        while (isNonEmpty(cs)) {
            var _a = f(cs), b = _a[0], c = _a[1];
            result.push(b);
            cs = c;
        }
        return result;
    };
}
/**
 * Splits an array into two pieces, the first piece has `n` elements.
 *
 * @example
 * import { splitAt } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(splitAt(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @since 2.0.0
 */
function splitAt(n) {
    return function (as) { return [as.slice(0, n), as.slice(n)]; };
}
/**
 * Splits an array into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the array. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that
 *
 * ```ts
 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
 * ```
 *
 * whenever `n` evenly divides the length of `xs`.
 *
 * @example
 * import { chunksOf } from 'fp-ts/lib/Array'
 *
 * assert.deepStrictEqual(chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
 *
 *
 * @since 2.0.0
 */
function chunksOf(n) {
    return function (as) { return (as.length === 0 ? empty : isOutOfBound(n - 1, as) ? [as] : chop(splitAt(n))(as)); };
}
function comprehension(input, f, g) {
    if (g === void 0) { g = function () { return true; }; }
    var go = function (scope, input) {
        if (input.length === 0) {
            return g.apply(void 0, scope) ? [f.apply(void 0, scope)] : empty;
        }
        else {
            return array.chain(input[0], function (x) { return go(snoc(scope, x), input.slice(1)); });
        }
    };
    return go(empty, input);
}
/**
 * Creates an array of unique values, in order, from all given arrays using a `Eq` for equality comparisons
 *
 * @example
 * import { union } from 'fp-ts/lib/Array'
 * import { eqNumber } from 'fp-ts/lib/Eq'
 *
 * assert.deepStrictEqual(union(eqNumber)([1, 2], [2, 3]), [1, 2, 3])
 *
 * @since 2.0.0
 */
function union(E) {
    var elemE = elem$1(E);
    return function (xs, ys) { return concat(xs, ys.filter(function (a) { return !elemE(a, xs); })); };
}
/**
 * Creates an array of unique values that are included in all given arrays using a `Eq` for equality
 * comparisons. The order and references of result values are determined by the first array.
 *
 * @example
 * import { intersection } from 'fp-ts/lib/Array'
 * import { eqNumber } from 'fp-ts/lib/Eq'
 *
 * assert.deepStrictEqual(intersection(eqNumber)([1, 2], [2, 3]), [2])
 *
 * @since 2.0.0
 */
function intersection(E) {
    var elemE = elem$1(E);
    return function (xs, ys) { return xs.filter(function (a) { return elemE(a, ys); }); };
}
/**
 * Creates an array of array values not included in the other given array using a `Eq` for equality
 * comparisons. The order and references of result values are determined by the first array.
 *
 * @example
 * import { difference } from 'fp-ts/lib/Array'
 * import { eqNumber } from 'fp-ts/lib/Eq'
 *
 * assert.deepStrictEqual(difference(eqNumber)([1, 2], [2, 3]), [1])
 *
 * @since 2.0.0
 */
function difference(E) {
    var elemE = elem$1(E);
    return function (xs, ys) { return xs.filter(function (a) { return !elemE(a, ys); }); };
}
var identity$2 = function (a) { return a; };
/**
 * @since 2.0.0
 */
var of = function (a) { return [a]; };
/**
 * @since 2.0.0
 */
var array = {
    URI: URI$2,
    map: function (fa, f) { return fa.map(function (a) { return f(a); }); },
    mapWithIndex: function (fa, f) { return fa.map(function (a, i) { return f(i, a); }); },
    compact: function (as) { return array.filterMap(as, identity$2); },
    separate: function (fa) {
        var left = [];
        var right = [];
        for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
            var e = fa_1[_i];
            if (e._tag === 'Left') {
                left.push(e.left);
            }
            else {
                right.push(e.right);
            }
        }
        return {
            left: left,
            right: right
        };
    },
    filter: function (as, predicate) {
        return as.filter(predicate);
    },
    filterMap: function (as, f) { return array.filterMapWithIndex(as, function (_, a) { return f(a); }); },
    partition: function (fa, predicate) {
        return array.partitionWithIndex(fa, function (_, a) { return predicate(a); });
    },
    partitionMap: function (fa, f) { return array.partitionMapWithIndex(fa, function (_, a) { return f(a); }); },
    of: of,
    ap: function (fab, fa) { return flatten$1(array.map(fab, function (f) { return array.map(fa, f); })); },
    chain: function (fa, f) {
        var resLen = 0;
        var l = fa.length;
        var temp = new Array(l);
        for (var i = 0; i < l; i++) {
            var e = fa[i];
            var arr = f(e);
            resLen += arr.length;
            temp[i] = arr;
        }
        var r = Array(resLen);
        var start = 0;
        for (var i = 0; i < l; i++) {
            var arr = temp[i];
            var l_1 = arr.length;
            for (var j = 0; j < l_1; j++) {
                r[j + start] = arr[j];
            }
            start += l_1;
        }
        return r;
    },
    reduce: function (fa, b, f) { return array.reduceWithIndex(fa, b, function (_, b, a) { return f(b, a); }); },
    foldMap: function (M) {
        var foldMapWithIndexM = array.foldMapWithIndex(M);
        return function (fa, f) { return foldMapWithIndexM(fa, function (_, a) { return f(a); }); };
    },
    reduceRight: function (fa, b, f) { return array.reduceRightWithIndex(fa, b, function (_, a, b) { return f(a, b); }); },
    unfold: function (b, f) {
        var ret = [];
        var bb = b;
        while (true) {
            var mt = f(bb);
            if (isSome(mt)) {
                var _a = mt.value, a = _a[0], b_1 = _a[1];
                ret.push(a);
                bb = b_1;
            }
            else {
                break;
            }
        }
        return ret;
    },
    traverse: function (F) {
        var traverseWithIndexF = array.traverseWithIndex(F);
        return function (ta, f) { return traverseWithIndexF(ta, function (_, a) { return f(a); }); };
    },
    sequence: function (F) { return function (ta) {
        return array.reduce(ta, F.of(array.zero()), function (fas, fa) { return F.ap(F.map(fas, function (as) { return function (a) { return snoc(as, a); }; }), fa); });
    }; },
    zero: function () { return empty; },
    alt: function (fx, f) { return concat(fx, f()); },
    extend: function (fa, f) { return fa.map(function (_, i, as) { return f(as.slice(i)); }); },
    wither: function (F) {
        var traverseF = array.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), array.compact); };
    },
    wilt: function (F) {
        var traverseF = array.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), array.separate); };
    },
    reduceWithIndex: function (fa, b, f) {
        var l = fa.length;
        var r = b;
        for (var i = 0; i < l; i++) {
            r = f(i, r, fa[i]);
        }
        return r;
    },
    foldMapWithIndex: function (M) { return function (fa, f) { return fa.reduce(function (b, a, i) { return M.concat(b, f(i, a)); }, M.empty); }; },
    reduceRightWithIndex: function (fa, b, f) { return fa.reduceRight(function (b, a, i) { return f(i, a, b); }, b); },
    traverseWithIndex: function (F) { return function (ta, f) {
        return array.reduceWithIndex(ta, F.of(array.zero()), function (i, fbs, a) {
            return F.ap(F.map(fbs, function (bs) { return function (b) { return snoc(bs, b); }; }), f(i, a));
        });
    }; },
    partitionMapWithIndex: function (fa, f) {
        var left = [];
        var right = [];
        for (var i = 0; i < fa.length; i++) {
            var e = f(i, fa[i]);
            if (e._tag === 'Left') {
                left.push(e.left);
            }
            else {
                right.push(e.right);
            }
        }
        return {
            left: left,
            right: right
        };
    },
    partitionWithIndex: function (fa, predicateWithIndex) {
        var left = [];
        var right = [];
        for (var i = 0; i < fa.length; i++) {
            var a = fa[i];
            if (predicateWithIndex(i, a)) {
                right.push(a);
            }
            else {
                left.push(a);
            }
        }
        return {
            left: left,
            right: right
        };
    },
    filterMapWithIndex: function (fa, f) {
        var result = [];
        for (var i = 0; i < fa.length; i++) {
            var optionB = f(i, fa[i]);
            if (isSome(optionB)) {
                result.push(optionB.value);
            }
        }
        return result;
    },
    filterWithIndex: function (fa, predicateWithIndex) {
        return fa.filter(function (a, i) { return predicateWithIndex(i, a); });
    }
};
var _a$1 = pipeable(array), alt$1 = _a$1.alt, ap$1 = _a$1.ap, apFirst$1 = _a$1.apFirst, apSecond$1 = _a$1.apSecond, chain$1 = _a$1.chain, chainFirst$1 = _a$1.chainFirst, duplicate$1 = _a$1.duplicate, extend$1 = _a$1.extend, filter$1 = _a$1.filter, filterMap$1 = _a$1.filterMap, filterMapWithIndex = _a$1.filterMapWithIndex, filterWithIndex = _a$1.filterWithIndex, foldMap$1 = _a$1.foldMap, foldMapWithIndex = _a$1.foldMapWithIndex, map$1 = _a$1.map, mapWithIndex = _a$1.mapWithIndex, partition$1 = _a$1.partition, partitionMap$1 = _a$1.partitionMap, partitionMapWithIndex = _a$1.partitionMapWithIndex, partitionWithIndex = _a$1.partitionWithIndex, reduce$1 = _a$1.reduce, reduceRight$1 = _a$1.reduceRight, reduceRightWithIndex = _a$1.reduceRightWithIndex, reduceWithIndex = _a$1.reduceWithIndex, compact$1 = _a$1.compact, separate$1 = _a$1.separate;

var _Array = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$2,
    getShow: getShow$1,
    getMonoid: getMonoid$1,
    getEq: getEq$1,
    getOrd: getOrd$1,
    empty: empty,
    makeBy: makeBy,
    range: range,
    replicate: replicate,
    flatten: flatten$1,
    foldLeft: foldLeft,
    foldRight: foldRight,
    scanLeft: scanLeft,
    scanRight: scanRight,
    isEmpty: isEmpty,
    isNonEmpty: isNonEmpty,
    isOutOfBound: isOutOfBound,
    lookup: lookup,
    cons: cons,
    snoc: snoc,
    head: head,
    last: last,
    tail: tail,
    init: init,
    takeLeft: takeLeft,
    takeRight: takeRight,
    takeLeftWhile: takeLeftWhile,
    spanLeft: spanLeft,
    dropLeft: dropLeft,
    dropRight: dropRight,
    dropLeftWhile: dropLeftWhile,
    findIndex: findIndex,
    findFirst: findFirst,
    findFirstMap: findFirstMap,
    findLast: findLast,
    findLastMap: findLastMap,
    findLastIndex: findLastIndex,
    copy: copy,
    unsafeInsertAt: unsafeInsertAt,
    insertAt: insertAt,
    unsafeUpdateAt: unsafeUpdateAt,
    updateAt: updateAt,
    unsafeDeleteAt: unsafeDeleteAt,
    deleteAt: deleteAt,
    modifyAt: modifyAt,
    reverse: reverse,
    rights: rights,
    lefts: lefts,
    sort: sort,
    zipWith: zipWith,
    zip: zip,
    unzip: unzip,
    rotate: rotate,
    elem: elem$1,
    uniq: uniq,
    sortBy: sortBy,
    chop: chop,
    splitAt: splitAt,
    chunksOf: chunksOf,
    comprehension: comprehension,
    union: union,
    intersection: intersection,
    difference: difference,
    of: of,
    array: array,
    alt: alt$1,
    ap: ap$1,
    apFirst: apFirst$1,
    apSecond: apSecond$1,
    chain: chain$1,
    chainFirst: chainFirst$1,
    duplicate: duplicate$1,
    extend: extend$1,
    filter: filter$1,
    filterMap: filterMap$1,
    filterMapWithIndex: filterMapWithIndex,
    filterWithIndex: filterWithIndex,
    foldMap: foldMap$1,
    foldMapWithIndex: foldMapWithIndex,
    map: map$1,
    mapWithIndex: mapWithIndex,
    partition: partition$1,
    partitionMap: partitionMap$1,
    partitionMapWithIndex: partitionMapWithIndex,
    partitionWithIndex: partitionWithIndex,
    reduce: reduce$1,
    reduceRight: reduceRight$1,
    reduceRightWithIndex: reduceRightWithIndex,
    reduceWithIndex: reduceWithIndex,
    compact: compact$1,
    separate: separate$1
});



var Bifunctor = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * @since 2.0.0
 */
var booleanAlgebraBoolean = {
    meet: function (x, y) { return x && y; },
    join: function (x, y) { return x || y; },
    zero: false,
    one: true,
    implies: function (x, y) { return !x || y; },
    not: function (x) { return !x; }
};
/**
 * @since 2.0.0
 */
var booleanAlgebraVoid = {
    meet: function () { return undefined; },
    join: function () { return undefined; },
    zero: undefined,
    one: undefined,
    implies: function () { return undefined; },
    not: function () { return undefined; }
};
/**
 * @since 2.0.0
 */
function getFunctionBooleanAlgebra(B) {
    return function () { return ({
        meet: function (x, y) { return function (a) { return B.meet(x(a), y(a)); }; },
        join: function (x, y) { return function (a) { return B.join(x(a), y(a)); }; },
        zero: function () { return B.zero; },
        one: function () { return B.one; },
        implies: function (x, y) { return function (a) { return B.implies(x(a), y(a)); }; },
        not: function (x) { return function (a) { return B.not(x(a)); }; }
    }); };
}
/**
 * Every boolean algebras has a dual algebra, which involves reversing one/zero as well as join/meet.
 *
 * @since 2.0.0
 */
function getDualBooleanAlgebra(B) {
    return {
        meet: function (x, y) { return B.join(x, y); },
        join: function (x, y) { return B.meet(x, y); },
        zero: B.one,
        one: B.zero,
        implies: function (x, y) { return B.join(B.not(x), y); },
        not: B.not
    };
}

var BooleanAlgebra = /*#__PURE__*/Object.freeze({
    __proto__: null,
    booleanAlgebraBoolean: booleanAlgebraBoolean,
    booleanAlgebraVoid: booleanAlgebraVoid,
    getFunctionBooleanAlgebra: getFunctionBooleanAlgebra,
    getDualBooleanAlgebra: getDualBooleanAlgebra
});

var __assign$2 = (undefined && undefined.__assign) || function () {
    __assign$2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$2.apply(this, arguments);
};
/**
 * @since 2.0.0
 */
var boundedNumber = __assign$2(__assign$2({}, ordNumber), { top: Infinity, bottom: -Infinity });

var Bounded = /*#__PURE__*/Object.freeze({
    __proto__: null,
    boundedNumber: boundedNumber
});

/**
 * @since 2.0.0
 */
function getMinMaxDistributiveLattice(O) {
    return {
        meet: min(O),
        join: max(O)
    };
}

var DistributiveLattice = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getMinMaxDistributiveLattice: getMinMaxDistributiveLattice
});

var __assign$3 = (undefined && undefined.__assign) || function () {
    __assign$3 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$3.apply(this, arguments);
};
/**
 * @since 2.0.0
 */
function getMinMaxBoundedDistributiveLattice(O) {
    return function (min, max) { return (__assign$3(__assign$3({}, getMinMaxDistributiveLattice(O)), { zero: min, one: max })); };
}

var BoundedDistributiveLattice = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getMinMaxBoundedDistributiveLattice: getMinMaxBoundedDistributiveLattice
});



var BoundedJoinSemilattice = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var BoundedLattice = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var BoundedMeetSemilattice = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var Category = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var Chain = /*#__PURE__*/Object.freeze({
    __proto__: null
});

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

var ChainRec = /*#__PURE__*/Object.freeze({
    __proto__: null,
    tailRec: tailRec
});

function splitChoice(F) {
    return function (pab, pcd) {
        return F.compose(F.left(pab), F.right(pcd));
    };
}
function fanin(F) {
    var splitChoiceF = splitChoice(F);
    return function (pac, pbc) {
        var join = F.promap(F.id(), function (e) { return (e._tag === 'Left' ? e.left : e.right); }, identity);
        return F.compose(join, splitChoiceF(pac, pbc));
    };
}

var Choice = /*#__PURE__*/Object.freeze({
    __proto__: null,
    splitChoice: splitChoice,
    fanin: fanin
});



var Comonad = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var __assign$4 = (undefined && undefined.__assign) || function () {
    __assign$4 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$4.apply(this, arguments);
};
function getCompactableComposition(F, G) {
    var FC = getFunctorComposition(F, G);
    var CC = __assign$4(__assign$4({}, FC), { compact: function (fga) { return F.map(fga, G.compact); }, separate: function (fge) {
            var left = CC.compact(FC.map(fge, getLeft));
            var right = CC.compact(FC.map(fge, getRight));
            return { left: left, right: right };
        } });
    return CC;
}

var Compactable = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getCompactableComposition: getCompactableComposition
});

/**
 * @since 2.0.0
 */
function log(s) {
    return function () { return console.log(s); }; // tslint:disable-line:no-console
}
/**
 * @since 2.0.0
 */
function warn(s) {
    return function () { return console.warn(s); }; // tslint:disable-line:no-console
}
/**
 * @since 2.0.0
 */
function error(s) {
    return function () { return console.error(s); }; // tslint:disable-line:no-console
}
/**
 * @since 2.0.0
 */
function info(s) {
    return function () { return console.info(s); }; // tslint:disable-line:no-console
}

var Console = /*#__PURE__*/Object.freeze({
    __proto__: null,
    log: log,
    warn: warn,
    error: error,
    info: info
});

var __assign$5 = (undefined && undefined.__assign) || function () {
    __assign$5 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$5.apply(this, arguments);
};
/**
 * @since 2.0.0
 */
var URI$3 = 'Const';
/**
 * @since 2.0.0
 */
var make = unsafeCoerce;
/**
 * @since 2.0.0
 */
function getShow$2(S) {
    return {
        show: function (c) { return "make(" + S.show(c) + ")"; }
    };
}
/**
 * @since 2.0.0
 */
var getEq$2 = identity;
/**
 * @since 2.0.0
 */
function getApply(S) {
    return {
        URI: URI$3,
        _E: undefined,
        map: const_.map,
        ap: function (fab, fa) { return make(S.concat(fab, fa)); }
    };
}
/**
 * @since 2.0.0
 */
function getApplicative(M) {
    return __assign$5(__assign$5({}, getApply(M)), { of: function () { return make(M.empty); } });
}
/**
 * @since 2.0.0
 */
var const_ = {
    URI: URI$3,
    map: unsafeCoerce,
    contramap: unsafeCoerce
};
var _a$2 = pipeable(const_), contramap$1 = _a$2.contramap, map$2 = _a$2.map;

var Const = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$3,
    make: make,
    getShow: getShow$2,
    getEq: getEq$2,
    getApply: getApply,
    getApplicative: getApplicative,
    const_: const_,
    contramap: contramap$1,
    map: map$2
});



var Contravariant = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * Returns the current `Date`
 *
 * @since 2.0.0
 */
var create = function () { return new Date(); };
/**
 * Returns the number of milliseconds elapsed since January 1, 1970, 00:00:00 UTC
 *
 * @since 2.0.0
 */
var now = function () { return new Date().getTime(); };

var _Date = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create,
    now: now
});

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
var __assign$6 = (undefined && undefined.__assign) || function () {
    __assign$6 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$6.apply(this, arguments);
};
/**
 * @since 2.0.0
 */
var URI$4 = 'Either';
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure
 *
 * @since 2.0.0
 */
function left(e) {
    return { _tag: 'Left', left: e };
}
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure
 *
 * @since 2.0.0
 */
function right(a) {
    return { _tag: 'Right', right: a };
}
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
function fromNullable$1(e) {
    return function (a) { return (a == null ? left(e) : right(a)); };
}
/**
 * Default value for the `onError` argument of `tryCatch`
 *
 * @since 2.0.0
 */
function toError(e) {
    return e instanceof Error ? e : new Error(String(e));
}
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
function tryCatch$1(f, onError) {
    try {
        return right(f());
    }
    catch (e) {
        return left(onError(e));
    }
}
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
function fold$1(onLeft, onRight) {
    return function (ma) { return (isLeft(ma) ? onLeft(ma.left) : onRight(ma.right)); };
}
/**
 * @since 2.0.0
 */
function getShow$3(SE, SA) {
    return {
        show: function (ma) { return (isLeft(ma) ? "left(" + SE.show(ma.left) + ")" : "right(" + SA.show(ma.right) + ")"); }
    };
}
/**
 * @since 2.0.0
 */
function getEq$3(EL, EA) {
    return {
        equals: function (x, y) {
            return x === y || (isLeft(x) ? isLeft(y) && EL.equals(x.left, y.left) : isRight(y) && EA.equals(x.right, y.right));
        }
    };
}
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
function getSemigroup$1(S) {
    return {
        concat: function (x, y) { return (isLeft(y) ? x : isLeft(x) ? y : right(S.concat(x.right, y.right))); }
    };
}
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
function getApplySemigroup$1(S) {
    return {
        concat: function (x, y) { return (isLeft(x) ? x : isLeft(y) ? y : right(S.concat(x.right, y.right))); }
    };
}
/**
 * @since 2.0.0
 */
function getApplyMonoid$1(M) {
    return __assign$6(__assign$6({}, getApplySemigroup$1(M)), { empty: right(M.empty) });
}
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
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise
 *
 * @since 2.0.0
 */
function isRight(ma) {
    return isLeft(ma) ? false : true;
}
/**
 * @since 2.0.0
 */
function swap(ma) {
    return isLeft(ma) ? right(ma.left) : left(ma.right);
}
/**
 * @since 2.0.0
 */
function orElse(onLeft) {
    return function (ma) { return (isLeft(ma) ? onLeft(ma.left) : ma); };
}
/**
 * @since 2.0.0
 */
function getOrElse$1(onLeft) {
    return function (ma) { return (isLeft(ma) ? onLeft(ma.left) : ma.right); };
}
/**
 * @since 2.0.0
 */
function elem$2(E) {
    return function (a, ma) { return (isLeft(ma) ? false : E.equals(a, ma.right)); };
}
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
function exists$1(predicate) {
    return function (ma) { return (isLeft(ma) ? false : predicate(ma.right)); };
}
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
    return tryCatch$1(function () { return JSON.parse(s); }, onError);
}
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
    return tryCatch$1(function () { return JSON.stringify(u); }, onError);
}
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
        var traverseF = either.traverse(F);
        return function (ma, f) { return F.map(traverseF(ma, f), compact); };
    };
    var wilt = function (F) {
        var traverseF = either.traverse(F);
        return function (ma, f) { return F.map(traverseF(ma, f), separate); };
    };
    return {
        URI: URI$4,
        _E: phantom,
        map: either.map,
        compact: compact,
        separate: separate,
        filter: filter,
        filterMap: filterMap,
        partition: partition,
        partitionMap: partitionMap,
        traverse: either.traverse,
        sequence: either.sequence,
        reduce: either.reduce,
        foldMap: either.foldMap,
        reduceRight: either.reduceRight,
        wither: wither,
        wilt: wilt
    };
}
/**
 * @since 2.0.0
 */
function getValidation(S) {
    return {
        URI: URI$4,
        _E: phantom,
        map: either.map,
        of: either.of,
        ap: function (mab, ma) {
            return isLeft(mab)
                ? isLeft(ma)
                    ? left(S.concat(mab.left, ma.left))
                    : mab
                : isLeft(ma)
                    ? ma
                    : right(mab.right(ma.right));
        },
        chain: either.chain,
        alt: function (fx, f) {
            if (isRight(fx)) {
                return fx;
            }
            var fy = f();
            return isLeft(fy) ? left(S.concat(fx.left, fy.left)) : fy;
        }
    };
}
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
/**
 * @since 2.0.0
 */
function getValidationMonoid(SE, SA) {
    return {
        concat: getValidationSemigroup(SE, SA).concat,
        empty: right(SA.empty)
    };
}
/**
 * @since 2.0.0
 */
var either = {
    URI: URI$4,
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
        return tailRec(f(a), function (e) {
            return isLeft(e) ? right(left(e.left)) : isLeft(e.right) ? left(f(e.right.left)) : right(right(e.right.right));
        });
    },
    throwError: left
};
var _a$3 = pipeable(either), alt$2 = _a$3.alt, ap$2 = _a$3.ap, apFirst$2 = _a$3.apFirst, apSecond$2 = _a$3.apSecond, bimap = _a$3.bimap, chain$2 = _a$3.chain, chainFirst$2 = _a$3.chainFirst, duplicate$2 = _a$3.duplicate, extend$2 = _a$3.extend, flatten$2 = _a$3.flatten, foldMap$2 = _a$3.foldMap, map$3 = _a$3.map, mapLeft = _a$3.mapLeft, reduce$2 = _a$3.reduce, reduceRight$2 = _a$3.reduceRight, fromOption = _a$3.fromOption, fromPredicate$1 = _a$3.fromPredicate, filterOrElse = _a$3.filterOrElse;

var Either = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$4,
    left: left,
    right: right,
    fromNullable: fromNullable$1,
    toError: toError,
    tryCatch: tryCatch$1,
    fold: fold$1,
    getShow: getShow$3,
    getEq: getEq$3,
    getSemigroup: getSemigroup$1,
    getApplySemigroup: getApplySemigroup$1,
    getApplyMonoid: getApplyMonoid$1,
    isLeft: isLeft,
    isRight: isRight,
    swap: swap,
    orElse: orElse,
    getOrElse: getOrElse$1,
    elem: elem$2,
    exists: exists$1,
    parseJSON: parseJSON,
    stringifyJSON: stringifyJSON,
    getWitherable: getWitherable,
    getValidation: getValidation,
    getValidationSemigroup: getValidationSemigroup,
    getValidationMonoid: getValidationMonoid,
    either: either,
    alt: alt$2,
    ap: ap$2,
    apFirst: apFirst$2,
    apSecond: apSecond$2,
    bimap: bimap,
    chain: chain$2,
    chainFirst: chainFirst$2,
    duplicate: duplicate$2,
    extend: extend$2,
    flatten: flatten$2,
    foldMap: foldMap$2,
    map: map$3,
    mapLeft: mapLeft,
    reduce: reduce$2,
    reduceRight: reduceRight$2,
    fromOption: fromOption,
    fromPredicate: fromPredicate$1,
    filterOrElse: filterOrElse
});

var __assign$7 = (undefined && undefined.__assign) || function () {
    __assign$7 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$7.apply(this, arguments);
};
function getEitherM(M) {
    var A = getApplicativeComposition(M, either);
    return __assign$7(__assign$7({}, A), { chain: function (ma, f) { return M.chain(ma, function (e) { return (isLeft(e) ? M.of(left(e.left)) : f(e.right)); }); }, alt: function (fx, f) { return M.chain(fx, function (e) { return (isLeft(e) ? f() : A.of(e.right)); }); }, bimap: function (ma, f, g) { return M.map(ma, function (e) { return either.bimap(e, f, g); }); }, mapLeft: function (ma, f) { return M.map(ma, function (e) { return either.mapLeft(e, f); }); }, fold: function (ma, onLeft, onRight) { return M.chain(ma, fold$1(onLeft, onRight)); }, getOrElse: function (ma, onLeft) { return M.chain(ma, fold$1(onLeft, M.of)); }, orElse: function (ma, f) { return M.chain(ma, fold$1(f, function (a) { return A.of(a); })); }, swap: function (ma) { return M.map(ma, swap); }, rightM: function (ma) { return M.map(ma, right); }, leftM: function (ml) { return M.map(ml, left); }, left: function (e) { return M.of(left(e)); } });
}

var EitherT = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getEitherM: getEitherM
});

/**
 * @since 2.0.0
 */
var URI$5 = 'Eq';
/**
 * @since 2.0.0
 */
function fromEquals(equals) {
    return {
        equals: function (x, y) { return x === y || equals(x, y); }
    };
}
/**
 * @since 2.0.0
 */
function strictEqual$1(a, b) {
    return a === b;
}
var eqStrict = { equals: strictEqual$1 };
/**
 * @since 2.0.0
 */
var eqString = eqStrict;
/**
 * @since 2.0.0
 */
var eqNumber = eqStrict;
/**
 * @since 2.0.0
 */
var eqBoolean = eqStrict;
/**
 * @since 2.0.0
 */
function getStructEq(eqs) {
    return fromEquals(function (x, y) {
        for (var k in eqs) {
            if (!eqs[k].equals(x[k], y[k])) {
                return false;
            }
        }
        return true;
    });
}
/**
 * Given a tuple of `Eq`s returns a `Eq` for the tuple
 *
 * @example
 * import { getTupleEq, eqString, eqNumber, eqBoolean } from 'fp-ts/lib/Eq'
 *
 * const E = getTupleEq(eqString, eqNumber, eqBoolean)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, true]), true)
 * assert.strictEqual(E.equals(['a', 1, true], ['b', 1, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 2, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, false]), false)
 *
 * @since 2.0.0
 */
function getTupleEq() {
    var eqs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        eqs[_i] = arguments[_i];
    }
    return fromEquals(function (x, y) { return eqs.every(function (E, i) { return E.equals(x[i], y[i]); }); });
}
/**
 * @since 2.0.0
 */
var eq = {
    URI: URI$5,
    contramap: function (fa, f) { return fromEquals(function (x, y) { return fa.equals(f(x), f(y)); }); }
};
var contramap$2 = pipeable(eq).contramap;
/**
 * @since 2.0.0
 */
var eqDate = eq.contramap(eqNumber, function (date) { return date.valueOf(); });

var Eq = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$5,
    fromEquals: fromEquals,
    strictEqual: strictEqual$1,
    eqString: eqString,
    eqNumber: eqNumber,
    eqBoolean: eqBoolean,
    getStructEq: getStructEq,
    getTupleEq: getTupleEq,
    eq: eq,
    contramap: contramap$2,
    eqDate: eqDate
});



var Extend = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * @since 2.0.0
 */
var fieldNumber = {
    add: function (x, y) { return x + y; },
    zero: 0,
    mul: function (x, y) { return x * y; },
    one: 1,
    sub: function (x, y) { return x - y; },
    degree: function (_) { return 1; },
    div: function (x, y) { return x / y; },
    mod: function (x, y) { return x % y; }
};
/**
 * The *greatest common divisor* of two values
 *
 * @since 2.0.0
 */
function gcd(E, field) {
    var zero = field.zero;
    var f = function (x, y) { return (E.equals(y, zero) ? x : f(y, field.mod(x, y))); };
    return f;
}
/**
 * The *least common multiple* of two values
 *
 * @since 2.0.0
 */
function lcm(E, F) {
    var zero = F.zero;
    var gcdSF = gcd(E, F);
    return function (x, y) { return (E.equals(x, zero) || E.equals(y, zero) ? zero : F.div(F.mul(x, y), gcdSF(x, y))); };
}

var Field = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fieldNumber: fieldNumber,
    gcd: gcd,
    lcm: lcm
});

var __assign$8 = (undefined && undefined.__assign) || function () {
    __assign$8 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$8.apply(this, arguments);
};
function getFilterableComposition(F, G) {
    var FC = __assign$8(__assign$8({}, getCompactableComposition(F, G)), { partitionMap: function (fga, f) {
            var left = FC.filterMap(fga, function (a) { return getLeft(f(a)); });
            var right = FC.filterMap(fga, function (a) { return getRight(f(a)); });
            return { left: left, right: right };
        }, partition: function (fga, p) {
            var left = FC.filter(fga, function (a) { return !p(a); });
            var right = FC.filter(fga, p);
            return { left: left, right: right };
        }, filterMap: function (fga, f) { return F.map(fga, function (ga) { return G.filterMap(ga, f); }); }, filter: function (fga, f) { return F.map(fga, function (ga) { return G.filter(ga, f); }); } });
    return FC;
}

var Filterable = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFilterableComposition: getFilterableComposition
});



var FilterableWithIndex = /*#__PURE__*/Object.freeze({
    __proto__: null
});

function getFoldableComposition(F, G) {
    return {
        reduce: function (fga, b, f) { return F.reduce(fga, b, function (b, ga) { return G.reduce(ga, b, f); }); },
        foldMap: function (M) {
            var foldMapF = F.foldMap(M);
            var foldMapG = G.foldMap(M);
            return function (fa, f) { return foldMapF(fa, function (ga) { return foldMapG(ga, f); }); };
        },
        reduceRight: function (fa, b, f) { return F.reduceRight(fa, b, function (ga, b) { return G.reduceRight(ga, b, f); }); }
    };
}
function foldM(M, F) {
    return function (fa, b, f) { return F.reduce(fa, M.of(b), function (mb, a) { return M.chain(mb, function (b) { return f(b, a); }); }); };
}
function intercalate(M, F) {
    return function (sep, fm) {
        var go = function (_a, x) {
            var init = _a.init, acc = _a.acc;
            return init ? { init: false, acc: x } : { init: false, acc: M.concat(M.concat(acc, sep), x) };
        };
        return F.reduce(fm, { init: true, acc: M.empty }, go).acc;
    };
}
function traverse_(M, F) {
    var applyFirst = function (mu, mb) { return M.ap(M.map(mu, constant), mb); };
    var mu = M.of(undefined);
    return function (fa, f) { return F.reduce(fa, mu, function (mu, a) { return applyFirst(mu, f(a)); }); };
}

var Foldable = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFoldableComposition: getFoldableComposition,
    foldM: foldM,
    intercalate: intercalate,
    traverse_: traverse_
});

var __assign$9 = (undefined && undefined.__assign) || function () {
    __assign$9 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$9.apply(this, arguments);
};
function getFoldableWithIndexComposition(F, G) {
    return __assign$9(__assign$9({}, getFoldableComposition(F, G)), { reduceWithIndex: function (fga, b, f) {
            return F.reduceWithIndex(fga, b, function (fi, b, ga) { return G.reduceWithIndex(ga, b, function (gi, b, a) { return f([fi, gi], b, a); }); });
        }, foldMapWithIndex: function (M) {
            var foldMapWithIndexF = F.foldMapWithIndex(M);
            var foldMapWithIndexG = G.foldMapWithIndex(M);
            return function (fga, f) { return foldMapWithIndexF(fga, function (fi, ga) { return foldMapWithIndexG(ga, function (gi, a) { return f([fi, gi], a); }); }); };
        }, reduceRightWithIndex: function (fga, b, f) {
            return F.reduceRightWithIndex(fga, b, function (fi, ga, b) { return G.reduceRightWithIndex(ga, b, function (gi, a, b) { return f([fi, gi], a, b); }); });
        } });
}

var FoldableWithIndex = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFoldableWithIndexComposition: getFoldableWithIndexComposition
});

var __assign$a = (undefined && undefined.__assign) || function () {
    __assign$a = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$a.apply(this, arguments);
};
function getFunctorWithIndexComposition(F, G) {
    return __assign$a(__assign$a({}, getFunctorComposition(F, G)), { mapWithIndex: function (fga, f) { return F.mapWithIndex(fga, function (fi, ga) { return G.mapWithIndex(ga, function (gi, a) { return f([fi, gi], a); }); }); } });
}

var FunctorWithIndex = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFunctorWithIndexComposition: getFunctorWithIndexComposition
});



var Group = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var HeytingAlgebra = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * @file Type defunctionalization (as describe in [Lightweight higher-kinded polymorphism](https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf))
 */

var HKT = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * @since 2.0.0
 */
var URI$6 = 'Identity';
/**
 * @since 2.0.0
 */
var getShow$4 = identity;
/**
 * @since 2.0.0
 */
var getEq$4 = identity;
/**
 * @since 2.0.0
 */
var identity$3 = {
    URI: URI$6,
    map: function (ma, f) { return f(ma); },
    of: identity,
    ap: function (mab, ma) { return mab(ma); },
    chain: function (ma, f) { return f(ma); },
    reduce: function (fa, b, f) { return f(b, fa); },
    foldMap: function (_) { return function (fa, f) { return f(fa); }; },
    reduceRight: function (fa, b, f) { return f(fa, b); },
    traverse: function (F) { return function (ta, f) {
        return F.map(f(ta), identity);
    }; },
    sequence: function (F) { return function (ta) {
        return F.map(ta, identity);
    }; },
    alt: identity,
    extract: identity,
    extend: function (wa, f) { return f(wa); },
    chainRec: function (a, f) {
        var v = f(a);
        while (v._tag === 'Left') {
            v = f(v.left);
        }
        return v.right;
    }
};
var _a$4 = pipeable(identity$3), alt$3 = _a$4.alt, ap$3 = _a$4.ap, apFirst$3 = _a$4.apFirst, apSecond$3 = _a$4.apSecond, chain$3 = _a$4.chain, chainFirst$3 = _a$4.chainFirst, duplicate$3 = _a$4.duplicate, extend$3 = _a$4.extend, flatten$3 = _a$4.flatten, foldMap$3 = _a$4.foldMap, map$4 = _a$4.map, reduce$3 = _a$4.reduce, reduceRight$3 = _a$4.reduceRight;

var Identity = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$6,
    getShow: getShow$4,
    getEq: getEq$4,
    identity: identity$3,
    alt: alt$3,
    ap: ap$3,
    apFirst: apFirst$3,
    apSecond: apSecond$3,
    chain: chain$3,
    chainFirst: chainFirst$3,
    duplicate: duplicate$3,
    extend: extend$3,
    flatten: flatten$3,
    foldMap: foldMap$3,
    map: map$4,
    reduce: reduce$3,
    reduceRight: reduceRight$3
});



var Invariant = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * @file `IO<A>` represents a non-deterministic synchronous computation that can cause side effects, yields a value of
 * type `A` and **never fails**. If you want to represent a synchronous computation that may fail, please see
 * `IOEither`.
 *
 * `IO` actions are _thunks_ so they are terminated by calling their `()` function application that executes the
 * computation and returns the result. Ideally each application should call `()` only once for a root value of type
 * `Task` or `IO` that represents the entire application. However, this might vary a bit depending on how you construct
 * your application.  An application framework with `fp-ts` types might take care of calling `()` for you, while another
 * application framework without `fp-ts` typing might force you to call `()` at multiple locations whenever the
 * framework demands less strictly typed values as inputs for its method calls.
 *
 * Below are some basic examples of how you can wrap values and function calls with `IO`.
 *
 * ```ts
 * import { IO, io } from 'fp-ts/lib/IO'
 *
 * const constant: IO<number> = io.of(123)
 * constant()  // returns 123
 *
 * const random: IO<number> = () => Math.random()
 * random()  // returns a random number
 * random()  // returns another random number
 *
 * const log = (...args): IO<void> => () => console.log(...args)
 * log('hello world')()  // returns undefined and outputs "hello world" to console
 * ```
 *
 * In the example above we implemented type safe alternatives for `Math.random()` and `console.log()`. The main
 * motivation was to explain how you can wrap values. However, `fp-ts` provides type safe alternatives for such basic
 * tools through `Console` and `Random` modules. So you don't need to constantly redefine them.
 *
 * The next code snippet below is an example of a case where type safety affects the end result. Using `console.log()`
 * directly would break the code, resulting in both logging actions being executed when the value is not `null`.  You
 * can confirm this by removing `()` from the end of the example code and replacing calls to `log()` with standard
 * `console.log()`.
 *
 * ```ts
 * import { fromNullable, fold } from 'fp-ts/lib/Option'
 * import { log } from 'fp-ts/lib/Console'
 * import { pipe } from 'fp-ts/lib/pipeable'
 *
 * const logger = (input: number | null) =>
 *  pipe(
 *    fromNullable(input),
 *    fold(log('Received null'), value => log(`Received ${value}`)),
 *  );
 *
 * logger(123)() // returns undefined and outputs "Received 123" to console
 * ```
 *
 * In addition to creating `IO` actions we need a way to combine them to build the application. For
 * example, we might want to combine several `IO<void>` actions into one `IO<void[]>` action for
 * sequential execution. This can be done with `array.sequence(io)` as follows.
 *
 * ```ts
 * import { IO, io } from 'fp-ts/lib/IO'
 * import { array } from 'fp-ts/lib/Array'
 * import { log } from 'fp-ts/lib/Console'
 *
 * const logGiraffe: IO<void> = log('giraffe');
 * const logZebra: IO<void> = log('zebra');
 *
 * const logGiraffeThenZebra: IO<void[]> = array.sequence(io)([ logGiraffe, logZebra ])
 *
 * logGiraffeThenZebra() // returns undefined and outputs words "giraffe" and "zebra" to console
 * ```
 *
 * We might also have several `IO` actions that yield some values that we want to capture. We can combine them by using
 * `sequenceS(io)` over an object matching the structure of the expected result. This is useful when you care about the
 * results but do not care about the execution order.
 *
 * ```ts
 * import { IO, io } from 'fp-ts/lib/IO'
 * import { sequenceS } from 'fp-ts/lib/Apply'
 *
 * interface Result {
 *   name: string,
 *   age: number,
 * }
 *
 * const computations: { [K in keyof Result]: IO<Result[K]> } = {
 *   name: io.of('Aristotle'),
 *   age: io.of(60),
 * }
 *
 * const computation: IO<Result> = sequenceS(io)(computations)
 *
 * computation() // returns { name: 'Aristotle', age: 60 }
 * ```
 */
/**
 * @since 2.0.0
 */
var URI$7 = 'IO';
/**
 * @since 2.0.0
 */
function getSemigroup$2(S) {
    return {
        concat: function (x, y) { return function () { return S.concat(x(), y()); }; }
    };
}
/**
 * @since 2.0.0
 */
function getMonoid$2(M) {
    return {
        concat: getSemigroup$2(M).concat,
        empty: io.of(M.empty)
    };
}
/**
 * @since 2.0.0
 */
var of$1 = function (a) { return function () { return a; }; };
/**
 * @since 2.0.0
 */
var io = {
    URI: URI$7,
    map: function (ma, f) { return function () { return f(ma()); }; },
    of: of$1,
    ap: function (mab, ma) { return function () { return mab()(ma()); }; },
    chain: function (ma, f) { return function () { return f(ma())(); }; },
    fromIO: identity
};
var _a$5 = pipeable(io), ap$4 = _a$5.ap, apFirst$4 = _a$5.apFirst, apSecond$4 = _a$5.apSecond, chain$4 = _a$5.chain, chainFirst$4 = _a$5.chainFirst, flatten$4 = _a$5.flatten, map$5 = _a$5.map;

var IO = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$7,
    getSemigroup: getSemigroup$2,
    getMonoid: getMonoid$2,
    of: of$1,
    io: io,
    ap: ap$4,
    apFirst: apFirst$4,
    apSecond: apSecond$4,
    chain: chain$4,
    chainFirst: chainFirst$4,
    flatten: flatten$4,
    map: map$5
});

var __assign$b = (undefined && undefined.__assign) || function () {
    __assign$b = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$b.apply(this, arguments);
};
function getValidationM(S, M) {
    var A = getApplicativeComposition(M, getValidation(S));
    return __assign$b(__assign$b({}, A), { chain: function (ma, f) { return M.chain(ma, function (e) { return (isLeft(e) ? M.of(left(e.left)) : f(e.right)); }); }, alt: function (fx, f) {
            return M.chain(fx, function (e1) {
                return isRight(e1) ? A.of(e1.right) : M.map(f(), function (e2) { return (isLeft(e2) ? left(S.concat(e1.left, e2.left)) : e2); });
            });
        } });
}

var ValidationT = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getValidationM: getValidationM
});

var __assign$c = (undefined && undefined.__assign) || function () {
    __assign$c = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$c.apply(this, arguments);
};
var T = getEitherM(io);
/**
 * @since 2.0.0
 */
var URI$8 = 'IOEither';
/**
 * @since 2.0.0
 */
var left$1 = T.left;
/**
 * @since 2.0.0
 */
var right$1 = T.of;
/**
 * @since 2.0.0
 */
var rightIO = T.rightM;
/**
 * @since 2.0.0
 */
var leftIO = T.leftM;
/**
 * @since 2.0.0
 */
function fold$2(onLeft, onRight) {
    return function (ma) { return T.fold(ma, onLeft, onRight); };
}
/**
 * @since 2.0.0
 */
function getOrElse$2(onLeft) {
    return function (ma) { return T.getOrElse(ma, onLeft); };
}
/**
 * @since 2.0.0
 */
function orElse$1(onLeft) {
    return function (ma) { return T.orElse(ma, onLeft); };
}
/**
 * @since 2.0.0
 */
var swap$1 = T.swap;
/**
 * @since 2.0.0
 */
function getSemigroup$3(S) {
    return getSemigroup$2(getSemigroup$1(S));
}
/**
 * @since 2.0.0
 */
function getApplySemigroup$2(S) {
    return getSemigroup$2(getApplySemigroup$1(S));
}
/**
 * @since 2.0.0
 */
function getApplyMonoid$2(M) {
    return {
        concat: getApplySemigroup$2(M).concat,
        empty: right$1(M.empty)
    };
}
/**
 * Constructs a new `IOEither` from a function that performs a side effect and might throw
 *
 * @since 2.0.0
 */
function tryCatch$2(f, onError) {
    return function () { return tryCatch$1(f, onError); };
}
/**
 * Make sure that a resource is cleaned up in the event of an exception (*). The release action is called regardless of
 * whether the body action throws (*) or returns.
 *
 * (*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
function bracket(acquire, use, release) {
    return T.chain(acquire, function (a) {
        return T.chain(io.map(use(a), right), function (e) { return T.chain(release(a, e), function () { return (isLeft(e) ? T.left(e.left) : T.of(e.right)); }); });
    });
}
/**
 * @since 2.0.0
 */
function getIOValidation(S) {
    var T = getValidationM(S, io);
    return __assign$c({ URI: URI$8, _E: undefined }, T);
}
var phantom$1 = undefined;
/**
 * @since 2.1.0
 */
function getFilterable(M) {
    var F = getWitherable(M);
    return __assign$c({ URI: URI$8, _E: phantom$1 }, getFilterableComposition(io, F));
}
/**
 * @since 2.0.0
 */
var ioEither = {
    URI: URI$8,
    bimap: T.bimap,
    mapLeft: T.mapLeft,
    map: T.map,
    of: right$1,
    ap: T.ap,
    chain: T.chain,
    alt: T.alt,
    fromIO: rightIO,
    throwError: left$1
};
var _a$6 = pipeable(ioEither), alt$4 = _a$6.alt, ap$5 = _a$6.ap, apFirst$5 = _a$6.apFirst, apSecond$5 = _a$6.apSecond, bimap$1 = _a$6.bimap, chain$5 = _a$6.chain, chainFirst$5 = _a$6.chainFirst, flatten$5 = _a$6.flatten, map$6 = _a$6.map, mapLeft$1 = _a$6.mapLeft, fromEither$1 = _a$6.fromEither, fromOption$1 = _a$6.fromOption, fromPredicate$2 = _a$6.fromPredicate, filterOrElse$1 = _a$6.filterOrElse;

var IOEither = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$8,
    left: left$1,
    right: right$1,
    rightIO: rightIO,
    leftIO: leftIO,
    fold: fold$2,
    getOrElse: getOrElse$2,
    orElse: orElse$1,
    swap: swap$1,
    getSemigroup: getSemigroup$3,
    getApplySemigroup: getApplySemigroup$2,
    getApplyMonoid: getApplyMonoid$2,
    tryCatch: tryCatch$2,
    bracket: bracket,
    getIOValidation: getIOValidation,
    getFilterable: getFilterable,
    ioEither: ioEither,
    alt: alt$4,
    ap: ap$5,
    apFirst: apFirst$5,
    apSecond: apSecond$5,
    bimap: bimap$1,
    chain: chain$5,
    chainFirst: chainFirst$5,
    flatten: flatten$5,
    map: map$6,
    mapLeft: mapLeft$1,
    fromEither: fromEither$1,
    fromOption: fromOption$1,
    fromPredicate: fromPredicate$2,
    filterOrElse: filterOrElse$1
});

/**
 * @example
 * import { io } from 'fp-ts/lib/IO'
 * import { newIORef } from 'fp-ts/lib/IORef'
 *
 * assert.strictEqual(io.chain(newIORef(1), ref => io.chain(ref.write(2), () => ref.read))(), 2)
 *
 * @since 2.0.0
 */
var IORef = /** @class */ (function () {
    function IORef(value) {
        var _this = this;
        this.value = value;
        this.read = function () { return _this.value; };
    }
    /**
     * @since 2.0.0
     */
    IORef.prototype.write = function (a) {
        var _this = this;
        return function () {
            _this.value = a;
        };
    };
    /**
     * @since 2.0.0
     */
    IORef.prototype.modify = function (f) {
        var _this = this;
        return function () {
            _this.value = f(_this.value);
        };
    };
    return IORef;
}());
/**
 * @since 2.0.0
 */
function newIORef(a) {
    return function () { return new IORef(a); };
}

var IORef$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IORef: IORef,
    newIORef: newIORef
});

/**
 * @file A join-semilattice (or upper semilattice) is a semilattice whose operation is called `join`, and which can be thought
 * of as a least upper bound.
 *
 * A `JoinSemilattice` must satisfy the following laws:
 *
 * - Associativity: `a ∨ (b ∨ c) = (a ∨ b) ∨ c`
 * - Commutativity: `a ∨ b = b ∨ a`
 * - Idempotency:   `a ∨ a = a`
 *
 */

var JoinSemilattice = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var Lattice = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var Magma = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var __assign$d = (undefined && undefined.__assign) || function () {
    __assign$d = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$d.apply(this, arguments);
};
/**
 * @since 2.0.0
 */
var URI$9 = 'Map';
/**
 * @since 2.0.0
 */
function getShow$5(SK, SA) {
    return {
        show: function (m) {
            var elements = '';
            m.forEach(function (a, k) {
                elements += "[" + SK.show(k) + ", " + SA.show(a) + "], ";
            });
            if (elements !== '') {
                elements = elements.substring(0, elements.length - 2);
            }
            return "new Map([" + elements + "])";
        }
    };
}
/**
 * Calculate the number of key/value pairs in a map
 *
 * @since 2.0.0
 */
function size(d) {
    return d.size;
}
/**
 * Test whether or not a map is empty
 *
 * @since 2.0.0
 */
function isEmpty$1(d) {
    return d.size === 0;
}
/**
 * Test whether or not a key exists in a map
 *
 * @since 2.0.0
 */
function member(E) {
    var lookupE = lookup$1(E);
    return function (k, m) { return isSome(lookupE(k, m)); };
}
/**
 * Test whether or not a value is a member of a map
 *
 * @since 2.0.0
 */
function elem$3(E) {
    return function (a, m) {
        var values = m.values();
        var e;
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = values.next()).done) {
            var v = e.value;
            if (E.equals(a, v)) {
                return true;
            }
        }
        return false;
    };
}
/**
 * Get a sorted array of the keys contained in a map
 *
 * @since 2.0.0
 */
function keys(O) {
    return function (m) { return Array.from(m.keys()).sort(O.compare); };
}
/**
 * Get a sorted array of the values contained in a map
 *
 * @since 2.0.0
 */
function values(O) {
    return function (m) { return Array.from(m.values()).sort(O.compare); };
}
/**
 * @since 2.0.0
 */
function collect(O) {
    var keysO = keys(O);
    return function (f) { return function (m) {
        var out = [];
        var ks = keysO(m);
        for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
            var key = ks_1[_i];
            out.push(f(key, m.get(key)));
        }
        return out;
    }; };
}
/**
 * Get a sorted of the key/value pairs contained in a map
 *
 * @since 2.0.0
 */
function toArray(O) {
    return collect(O)(function (k, a) { return [k, a]; });
}
function toUnfoldable(O, U) {
    var toArrayO = toArray(O);
    return function (d) {
        var arr = toArrayO(d);
        var len = arr.length;
        return U.unfold(0, function (b) { return (b < len ? some([arr[b], b + 1]) : none); });
    };
}
/**
 * Insert or replace a key/value pair in a map
 *
 * @since 2.0.0
 */
function insertAt$1(E) {
    var lookupWithKeyE = lookupWithKey(E);
    return function (k, a) { return function (m) {
        var found = lookupWithKeyE(k, m);
        if (isNone(found)) {
            var r = new Map(m);
            r.set(k, a);
            return r;
        }
        else if (found.value[1] !== a) {
            var r = new Map(m);
            r.set(found.value[0], a);
            return r;
        }
        return m;
    }; };
}
/**
 * Delete a key and value from a map
 *
 * @since 2.0.0
 */
function deleteAt$1(E) {
    var lookupWithKeyE = lookupWithKey(E);
    return function (k) { return function (m) {
        var found = lookupWithKeyE(k, m);
        if (isSome(found)) {
            var r = new Map(m);
            r.delete(found.value[0]);
            return r;
        }
        return m;
    }; };
}
/**
 * @since 2.0.0
 */
function updateAt$1(E) {
    var lookupWithKeyE = lookupWithKey(E);
    return function (k, a) { return function (m) {
        var found = lookupWithKeyE(k, m);
        if (isNone(found)) {
            return none;
        }
        var r = new Map(m);
        r.set(found.value[0], a);
        return some(r);
    }; };
}
/**
 * @since 2.0.0
 */
function modifyAt$1(E) {
    var lookupWithKeyE = lookupWithKey(E);
    return function (k, f) { return function (m) {
        var found = lookupWithKeyE(k, m);
        if (isNone(found)) {
            return none;
        }
        var r = new Map(m);
        r.set(found.value[0], f(found.value[1]));
        return some(r);
    }; };
}
/**
 * Delete a key and value from a map, returning the value as well as the subsequent map
 *
 * @since 2.0.0
 */
function pop(E) {
    var lookupE = lookup$1(E);
    var deleteAtE = deleteAt$1(E);
    return function (k) {
        var deleteAtEk = deleteAtE(k);
        return function (m) { return option.map(lookupE(k, m), function (a) { return [a, deleteAtEk(m)]; }); };
    };
}
/**
 * Lookup the value for a key in a `Map`.
 * If the result is a `Some`, the existing key is also returned.
 *
 * @since 2.0.0
 */
function lookupWithKey(E) {
    return function (k, m) {
        var entries = m.entries();
        var e;
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = entries.next()).done) {
            var _a = e.value, ka = _a[0], a = _a[1];
            if (E.equals(ka, k)) {
                return some([ka, a]);
            }
        }
        return none;
    };
}
/**
 * Lookup the value for a key in a `Map`.
 *
 * @since 2.0.0
 */
function lookup$1(E) {
    var lookupWithKeyE = lookupWithKey(E);
    return function (k, m) { return option.map(lookupWithKeyE(k, m), function (_a) {
        var _ = _a[0], a = _a[1];
        return a;
    }); };
}
/**
 * Test whether or not one Map contains all of the keys and values contained in another Map
 *
 * @since 2.0.0
 */
function isSubmap(SK, SA) {
    var lookupWithKeyS = lookupWithKey(SK);
    return function (d1, d2) {
        var entries = d1.entries();
        var e;
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = entries.next()).done) {
            var _a = e.value, k = _a[0], a = _a[1];
            var d2OptA = lookupWithKeyS(k, d2);
            if (isNone(d2OptA) || !SK.equals(k, d2OptA.value[0]) || !SA.equals(a, d2OptA.value[1])) {
                return false;
            }
        }
        return true;
    };
}
/**
 * @since 2.0.0
 */
var empty$1 = new Map();
/**
 * @since 2.0.0
 */
function getEq$5(SK, SA) {
    var isSubmap_ = isSubmap(SK, SA);
    return fromEquals(function (x, y) { return isSubmap_(x, y) && isSubmap_(y, x); });
}
/**
 * Gets `Monoid` instance for Maps given `Semigroup` instance for their values
 *
 * @since 2.0.0
 */
function getMonoid$3(SK, SA) {
    var lookupWithKeyS = lookupWithKey(SK);
    return {
        concat: function (mx, my) {
            if (mx === empty$1) {
                return my;
            }
            if (my === empty$1) {
                return mx;
            }
            var r = new Map(mx);
            var entries = my.entries();
            var e;
            // tslint:disable-next-line: strict-boolean-expressions
            while (!(e = entries.next()).done) {
                var _a = e.value, k = _a[0], a = _a[1];
                var mxOptA = lookupWithKeyS(k, mx);
                if (isSome(mxOptA)) {
                    r.set(mxOptA.value[0], SA.concat(mxOptA.value[1], a));
                }
                else {
                    r.set(k, a);
                }
            }
            return r;
        },
        empty: empty$1
    };
}
/**
 * Create a map with one key/value pair
 *
 * @since 2.0.0
 */
function singleton(k, a) {
    return new Map([[k, a]]);
}
function fromFoldable(E, M, F) {
    return function (fka) {
        var lookupWithKeyE = lookupWithKey(E);
        return F.reduce(fka, new Map(), function (b, _a) {
            var k = _a[0], a = _a[1];
            var bOpt = lookupWithKeyE(k, b);
            if (isSome(bOpt)) {
                b.set(bOpt.value[0], M.concat(bOpt.value[1], a));
            }
            else {
                b.set(k, a);
            }
            return b;
        });
    };
}
var _mapWithIndex = function (fa, f) {
    var m = new Map();
    var entries = fa.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, key = _a[0], a = _a[1];
        m.set(key, f(key, a));
    }
    return m;
};
var _partitionMapWithIndex = function (fa, f) {
    var left = new Map();
    var right = new Map();
    var entries = fa.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], a = _a[1];
        var ei = f(k, a);
        if (isLeft(ei)) {
            left.set(k, ei.left);
        }
        else {
            right.set(k, ei.right);
        }
    }
    return {
        left: left,
        right: right
    };
};
var _partitionWithIndex = function (fa, p) {
    var left = new Map();
    var right = new Map();
    var entries = fa.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], a = _a[1];
        if (p(k, a)) {
            right.set(k, a);
        }
        else {
            left.set(k, a);
        }
    }
    return {
        left: left,
        right: right
    };
};
var _filterMapWithIndex = function (fa, f) {
    var m = new Map();
    var entries = fa.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], a = _a[1];
        var o = f(k, a);
        if (isSome(o)) {
            m.set(k, o.value);
        }
    }
    return m;
};
var _filterWithIndex = function (fa, p) {
    var m = new Map();
    var entries = fa.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], a = _a[1];
        if (p(k, a)) {
            m.set(k, a);
        }
    }
    return m;
};
/**
 * @since 2.0.0
 */
function getFilterableWithIndex() {
    return __assign$d(__assign$d({}, map_), { _E: undefined, mapWithIndex: _mapWithIndex, partitionMapWithIndex: _partitionMapWithIndex, partitionWithIndex: _partitionWithIndex, filterMapWithIndex: _filterMapWithIndex, filterWithIndex: _filterWithIndex });
}
/**
 * @since 2.0.0
 */
function getWitherable$1(O) {
    var keysO = keys(O);
    var reduceWithIndex = function (fa, b, f) {
        var out = b;
        var ks = keysO(fa);
        var len = ks.length;
        for (var i = 0; i < len; i++) {
            var k = ks[i];
            out = f(k, out, fa.get(k));
        }
        return out;
    };
    var foldMapWithIndex = function (M) { return function (fa, f) {
        var out = M.empty;
        var ks = keysO(fa);
        var len = ks.length;
        for (var i = 0; i < len; i++) {
            var k = ks[i];
            out = M.concat(out, f(k, fa.get(k)));
        }
        return out;
    }; };
    var reduceRightWithIndex = function (fa, b, f) {
        var out = b;
        var ks = keysO(fa);
        var len = ks.length;
        for (var i = len - 1; i >= 0; i--) {
            var k = ks[i];
            out = f(k, fa.get(k), out);
        }
        return out;
    };
    var traverseWithIndex = function (F) {
        return function (ta, f) {
            var fm = F.of(empty$1);
            var entries = ta.entries();
            var e;
            var _loop_1 = function () {
                var _a = e.value, key = _a[0], a = _a[1];
                fm = F.ap(F.map(fm, function (m) { return function (b) { return new Map(m).set(key, b); }; }), f(key, a));
            };
            // tslint:disable-next-line: strict-boolean-expressions
            while (!(e = entries.next()).done) {
                _loop_1();
            }
            return fm;
        };
    };
    var traverse = function (F) {
        var traverseWithIndexF = traverseWithIndex(F);
        return function (ta, f) { return traverseWithIndexF(ta, function (_, a) { return f(a); }); };
    };
    var sequence = function (F) {
        var traverseWithIndexF = traverseWithIndex(F);
        return function (ta) { return traverseWithIndexF(ta, function (_, a) { return a; }); };
    };
    return __assign$d(__assign$d({}, map_), { _E: undefined, reduce: function (fa, b, f) { return reduceWithIndex(fa, b, function (_, b, a) { return f(b, a); }); }, foldMap: function (M) {
            var foldMapWithIndexM = foldMapWithIndex(M);
            return function (fa, f) { return foldMapWithIndexM(fa, function (_, a) { return f(a); }); };
        }, reduceRight: function (fa, b, f) { return reduceRightWithIndex(fa, b, function (_, a, b) { return f(a, b); }); }, traverse: traverse,
        sequence: sequence, mapWithIndex: _mapWithIndex, reduceWithIndex: reduceWithIndex,
        foldMapWithIndex: foldMapWithIndex,
        reduceRightWithIndex: reduceRightWithIndex,
        traverseWithIndex: traverseWithIndex, wilt: function (F) {
            var traverseF = traverse(F);
            return function (wa, f) { return F.map(traverseF(wa, f), map_.separate); };
        }, wither: function (F) {
            var traverseF = traverse(F);
            return function (wa, f) { return F.map(traverseF(wa, f), map_.compact); };
        } });
}
/**
 * @since 2.0.0
 */
var map_ = {
    URI: URI$9,
    map: function (fa, f) { return _mapWithIndex(fa, function (_, a) { return f(a); }); },
    compact: function (fa) {
        var m = new Map();
        var entries = fa.entries();
        var e;
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = entries.next()).done) {
            var _a = e.value, k = _a[0], oa = _a[1];
            if (isSome(oa)) {
                m.set(k, oa.value);
            }
        }
        return m;
    },
    separate: function (fa) {
        var left = new Map();
        var right = new Map();
        var entries = fa.entries();
        var e;
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = entries.next()).done) {
            var _a = e.value, k = _a[0], ei = _a[1];
            if (isLeft(ei)) {
                left.set(k, ei.left);
            }
            else {
                right.set(k, ei.right);
            }
        }
        return {
            left: left,
            right: right
        };
    },
    filter: function (fa, p) { return _filterWithIndex(fa, function (_, a) { return p(a); }); },
    filterMap: function (fa, f) { return _filterMapWithIndex(fa, function (_, a) { return f(a); }); },
    partition: function (fa, predicate) {
        return _partitionWithIndex(fa, function (_, a) { return predicate(a); });
    },
    partitionMap: function (fa, f) { return _partitionMapWithIndex(fa, function (_, a) { return f(a); }); }
};
var _a$7 = pipeable(map_), filter$2 = _a$7.filter, filterMap$2 = _a$7.filterMap, map$7 = _a$7.map, partition$2 = _a$7.partition, partitionMap$2 = _a$7.partitionMap, compact$2 = _a$7.compact, separate$2 = _a$7.separate;

var _Map = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$9,
    getShow: getShow$5,
    size: size,
    isEmpty: isEmpty$1,
    member: member,
    elem: elem$3,
    keys: keys,
    values: values,
    collect: collect,
    toArray: toArray,
    toUnfoldable: toUnfoldable,
    insertAt: insertAt$1,
    deleteAt: deleteAt$1,
    updateAt: updateAt$1,
    modifyAt: modifyAt$1,
    pop: pop,
    lookupWithKey: lookupWithKey,
    lookup: lookup$1,
    isSubmap: isSubmap,
    empty: empty$1,
    getEq: getEq$5,
    getMonoid: getMonoid$3,
    singleton: singleton,
    fromFoldable: fromFoldable,
    getFilterableWithIndex: getFilterableWithIndex,
    getWitherable: getWitherable$1,
    map_: map_,
    filter: filter$2,
    filterMap: filterMap$2,
    map: map$7,
    partition: partition$2,
    partitionMap: partitionMap$2,
    compact: compact$2,
    separate: separate$2
});

/**
 * @file A meet-semilattice (or lower semilattice) is a semilattice whose operation is called `meet`, and which can be thought
 * of as a greatest lower bound.
 *
 * A `MeetSemilattice` must satisfy the following laws:
 *
 * - Associativity: `a ∧ (b ∧ c) = (a ∧ b) ∧ c`
 * - Commutativity: `a ∧ b = b ∧ a`
 * - Idempotency:   `a ∧ a = a`
 */

var MeetSemilattice = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var Monad = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var MonadIO = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var MonadTask = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var MonadThrow = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * @file See [Getting started with fp-ts: Semigroup](https://dev.to/gcanti/getting-started-with-fp-ts-semigroup-2mf7)
 */
/**
 * @since 2.0.0
 */
function fold$3(S) {
    return function (a, as) { return as.reduce(S.concat, a); };
}
/**
 * @since 2.0.0
 */
function getFirstSemigroup() {
    return { concat: identity };
}
/**
 * @since 2.0.0
 */
function getLastSemigroup() {
    return { concat: function (_, y) { return y; } };
}
/**
 * Given a tuple of semigroups returns a semigroup for the tuple
 *
 * @example
 * import { getTupleSemigroup, semigroupString, semigroupSum, semigroupAll } from 'fp-ts/lib/Semigroup'
 *
 * const S1 = getTupleSemigroup(semigroupString, semigroupSum)
 * assert.deepStrictEqual(S1.concat(['a', 1], ['b', 2]), ['ab', 3])
 *
 * const S2 = getTupleSemigroup(semigroupString, semigroupSum, semigroupAll)
 * assert.deepStrictEqual(S2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
 *
 * @since 2.0.0
 */
function getTupleSemigroup() {
    var semigroups = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        semigroups[_i] = arguments[_i];
    }
    return {
        concat: function (x, y) { return semigroups.map(function (s, i) { return s.concat(x[i], y[i]); }); }
    };
}
/**
 * @since 2.0.0
 */
function getDualSemigroup(S) {
    return {
        concat: function (x, y) { return S.concat(y, x); }
    };
}
/**
 * @since 2.0.0
 */
function getFunctionSemigroup(S) {
    return function () { return ({
        concat: function (f, g) { return function (a) { return S.concat(f(a), g(a)); }; }
    }); };
}
/**
 * @since 2.0.0
 */
function getStructSemigroup(semigroups) {
    return {
        concat: function (x, y) {
            var r = {};
            for (var _i = 0, _a = Object.keys(semigroups); _i < _a.length; _i++) {
                var key = _a[_i];
                r[key] = semigroups[key].concat(x[key], y[key]);
            }
            return r;
        }
    };
}
/**
 * @since 2.0.0
 */
function getMeetSemigroup(O) {
    return {
        concat: min(O)
    };
}
/**
 * @since 2.0.0
 */
function getJoinSemigroup(O) {
    return {
        concat: max(O)
    };
}
/**
 * Returns a `Semigroup` instance for objects preserving their type
 *
 * @example
 * import { getObjectSemigroup } from 'fp-ts/lib/Semigroup'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 *
 * const S = getObjectSemigroup<Person>()
 * assert.deepStrictEqual(S.concat({ name: 'name', age: 23 }, { name: 'name', age: 24 }), { name: 'name', age: 24 })
 *
 * @since 2.0.0
 */
function getObjectSemigroup() {
    return {
        concat: function (x, y) { return Object.assign({}, x, y); }
    };
}
/**
 * Boolean semigroup under conjunction
 * @since 2.0.0
 */
var semigroupAll = {
    concat: function (x, y) { return x && y; }
};
/**
 * Boolean semigroup under disjunction
 * @since 2.0.0
 */
var semigroupAny = {
    concat: function (x, y) { return x || y; }
};
/**
 * Number `Semigroup` under addition
 * @since 2.0.0
 */
var semigroupSum = {
    concat: function (x, y) { return x + y; }
};
/**
 * Number `Semigroup` under multiplication
 * @since 2.0.0
 */
var semigroupProduct = {
    concat: function (x, y) { return x * y; }
};
/**
 * @since 2.0.0
 */
var semigroupString = {
    concat: function (x, y) { return x + y; }
};
/**
 * @since 2.0.0
 */
var semigroupVoid = {
    concat: function () { return undefined; }
};

var Semigroup = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fold: fold$3,
    getFirstSemigroup: getFirstSemigroup,
    getLastSemigroup: getLastSemigroup,
    getTupleSemigroup: getTupleSemigroup,
    getDualSemigroup: getDualSemigroup,
    getFunctionSemigroup: getFunctionSemigroup,
    getStructSemigroup: getStructSemigroup,
    getMeetSemigroup: getMeetSemigroup,
    getJoinSemigroup: getJoinSemigroup,
    getObjectSemigroup: getObjectSemigroup,
    semigroupAll: semigroupAll,
    semigroupAny: semigroupAny,
    semigroupSum: semigroupSum,
    semigroupProduct: semigroupProduct,
    semigroupString: semigroupString,
    semigroupVoid: semigroupVoid
});

/**
 * Boolean monoid under conjunction
 * @since 2.0.0
 */
var monoidAll = {
    concat: semigroupAll.concat,
    empty: true
};
/**
 * Boolean monoid under disjunction
 * @since 2.0.0
 */
var monoidAny = {
    concat: semigroupAny.concat,
    empty: false
};
/**
 * Number monoid under addition
 * @since 2.0.0
 */
var monoidSum = {
    concat: semigroupSum.concat,
    empty: 0
};
/**
 * Number monoid under multiplication
 * @since 2.0.0
 */
var monoidProduct = {
    concat: semigroupProduct.concat,
    empty: 1
};
/**
 * @since 2.0.0
 */
var monoidString = {
    concat: semigroupString.concat,
    empty: ''
};
/**
 * @since 2.0.0
 */
var monoidVoid = {
    concat: semigroupVoid.concat,
    empty: undefined
};
/**
 * @since 2.0.0
 */
function fold$4(M) {
    var foldSemigroupM = fold$3(M);
    return function (as) { return foldSemigroupM(M.empty, as); };
}
/**
 * Given a tuple of monoids returns a monoid for the tuple
 *
 * @example
 * import { getTupleMonoid, monoidString, monoidSum, monoidAll } from 'fp-ts/lib/Monoid'
 *
 * const M1 = getTupleMonoid(monoidString, monoidSum)
 * assert.deepStrictEqual(M1.concat(['a', 1], ['b', 2]), ['ab', 3])
 *
 * const M2 = getTupleMonoid(monoidString, monoidSum, monoidAll)
 * assert.deepStrictEqual(M2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
 *
 * @since 2.0.0
 */
function getTupleMonoid() {
    var monoids = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        monoids[_i] = arguments[_i];
    }
    return {
        concat: getTupleSemigroup.apply(void 0, monoids).concat,
        empty: monoids.map(function (m) { return m.empty; })
    };
}
/**
 * @since 2.0.0
 */
function getDualMonoid(M) {
    return {
        concat: getDualSemigroup(M).concat,
        empty: M.empty
    };
}
/**
 * @since 2.0.0
 */
function getFunctionMonoid(M) {
    return function () { return ({
        concat: getFunctionSemigroup(M)().concat,
        empty: function () { return M.empty; }
    }); };
}
/**
 * @since 2.0.0
 */
function getEndomorphismMonoid() {
    return {
        concat: function (x, y) { return function (a) { return x(y(a)); }; },
        empty: identity
    };
}
/**
 * @since 2.0.0
 */
function getStructMonoid(monoids) {
    var empty = {};
    for (var _i = 0, _a = Object.keys(monoids); _i < _a.length; _i++) {
        var key = _a[_i];
        empty[key] = monoids[key].empty;
    }
    return {
        concat: getStructSemigroup(monoids).concat,
        empty: empty
    };
}
/**
 * @since 2.0.0
 */
function getMeetMonoid(B) {
    return {
        concat: getMeetSemigroup(B).concat,
        empty: B.top
    };
}
/**
 * @since 2.0.0
 */
function getJoinMonoid(B) {
    return {
        concat: getJoinSemigroup(B).concat,
        empty: B.bottom
    };
}

var Monoid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    monoidAll: monoidAll,
    monoidAny: monoidAny,
    monoidSum: monoidSum,
    monoidProduct: monoidProduct,
    monoidString: monoidString,
    monoidVoid: monoidVoid,
    fold: fold$4,
    getTupleMonoid: getTupleMonoid,
    getDualMonoid: getDualMonoid,
    getFunctionMonoid: getFunctionMonoid,
    getEndomorphismMonoid: getEndomorphismMonoid,
    getStructMonoid: getStructMonoid,
    getMeetMonoid: getMeetMonoid,
    getJoinMonoid: getJoinMonoid
});

/**
 * @since 2.0.0
 */
var URI$a = 'NonEmptyArray';
/**
 * Append an element to the front of an array, creating a new non empty array
 *
 * @example
 * import { cons } from 'fp-ts/lib/NonEmptyArray'
 *
 * assert.deepStrictEqual(cons(1, [2, 3, 4]), [1, 2, 3, 4])
 *
 * @since 2.0.0
 */
var cons$1 = cons;
/**
 * Append an element to the end of an array, creating a new non empty array
 *
 * @example
 * import { snoc } from 'fp-ts/lib/NonEmptyArray'
 *
 * assert.deepStrictEqual(snoc([1, 2, 3], 4), [1, 2, 3, 4])
 *
 * @since 2.0.0
 */
var snoc$1 = snoc;
/**
 * Builds a `NonEmptyArray` from an `Array` returning `none` if `as` is an empty array
 *
 * @since 2.0.0
 */
function fromArray(as) {
    return isNonEmpty(as) ? some(as) : none;
}
/**
 * @since 2.0.0
 */
var getShow$6 = getShow$1;
/**
 * @since 2.0.0
 */
function head$1(nea) {
    return nea[0];
}
/**
 * @since 2.0.0
 */
function tail$1(nea) {
    return nea.slice(1);
}
/**
 * @since 2.0.0
 */
var reverse$1 = reverse;
/**
 * @since 2.0.0
 */
function min$1(ord) {
    var S = getMeetSemigroup(ord);
    return function (nea) { return nea.reduce(S.concat); };
}
/**
 * @since 2.0.0
 */
function max$1(ord) {
    var S = getJoinSemigroup(ord);
    return function (nea) { return nea.reduce(S.concat); };
}
/**
 * Builds a `Semigroup` instance for `NonEmptyArray`
 *
 * @since 2.0.0
 */
function getSemigroup$4() {
    return {
        concat: function (x, y) { return x.concat(y); }
    };
}
/**
 * @example
 * import { getEq, cons } from 'fp-ts/lib/NonEmptyArray'
 * import { eqNumber } from 'fp-ts/lib/Eq'
 *
 * const E = getEq(eqNumber)
 * assert.strictEqual(E.equals(cons(1, [2]), [1, 2]), true)
 * assert.strictEqual(E.equals(cons(1, [2]), [1, 3]), false)
 *
 * @since 2.0.0
 */
var getEq$6 = getEq$1;
/**
 * Group equal, consecutive elements of an array into non empty arrays.
 *
 * @example
 * import { cons, group } from 'fp-ts/lib/NonEmptyArray'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepStrictEqual(group(ordNumber)([1, 2, 1, 1]), [
 *   cons(1, []),
 *   cons(2, []),
 *   cons(1, [1])
 * ])
 *
 * @since 2.0.0
 */
function group(E) {
    return function (as) {
        var len = as.length;
        if (len === 0) {
            return empty;
        }
        var r = [];
        var head = as[0];
        var nea = [head];
        for (var i = 1; i < len; i++) {
            var x = as[i];
            if (E.equals(x, head)) {
                nea.push(x);
            }
            else {
                r.push(nea);
                head = x;
                nea = [head];
            }
        }
        r.push(nea);
        return r;
    };
}
/**
 * Sort and then group the elements of an array into non empty arrays.
 *
 * @example
 * import { cons, groupSort } from 'fp-ts/lib/NonEmptyArray'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepStrictEqual(groupSort(ordNumber)([1, 2, 1, 1]), [cons(1, [1, 1]), cons(2, [])])
 *
 * @since 2.0.0
 */
function groupSort(O) {
    var sortO = sort(O);
    var groupO = group(O);
    return function (as) { return groupO(sortO(as)); };
}
/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * import { cons, groupBy } from 'fp-ts/lib/NonEmptyArray'
 *
 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['foo', 'bar', 'foobar']), {
 *   '3': cons('foo', ['bar']),
 *   '6': cons('foobar', [])
 * })
 *
 * @since 2.0.0
 */
function groupBy(f) {
    return function (as) {
        var r = {};
        for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
            var a = as_1[_i];
            var k = f(a);
            if (r.hasOwnProperty(k)) {
                r[k].push(a);
            }
            else {
                r[k] = cons$1(a, []);
            }
        }
        return r;
    };
}
/**
 * @since 2.0.0
 */
function last$1(nea) {
    return nea[nea.length - 1];
}
/**
 * @since 2.0.0
 */
function sort$1(O) {
    return sort(O);
}
/**
 * @since 2.0.0
 */
function insertAt$2(i, a) {
    return insertAt(i, a);
}
/**
 * @since 2.0.0
 */
function updateAt$2(i, a) {
    return updateAt(i, a);
}
/**
 * @since 2.0.0
 */
function modifyAt$2(i, f) {
    return modifyAt(i, f);
}
/**
 * @since 2.0.0
 */
var copy$1 = copy;
function filter$3(predicate) {
    return filterWithIndex$1(function (_, a) { return predicate(a); });
}
/**
 * @since 2.0.0
 */
function filterWithIndex$1(predicate) {
    return function (nea) { return fromArray(nea.filter(function (a, i) { return predicate(i, a); })); };
}
/**
 * @since 2.0.0
 */
var of$2 = of;
/**
 * @since 2.0.0
 */
var nonEmptyArray = {
    URI: URI$a,
    map: array.map,
    mapWithIndex: array.mapWithIndex,
    of: of$2,
    ap: array.ap,
    chain: array.chain,
    extend: array.extend,
    extract: head$1,
    reduce: array.reduce,
    foldMap: array.foldMap,
    reduceRight: array.reduceRight,
    traverse: array.traverse,
    sequence: array.sequence,
    reduceWithIndex: array.reduceWithIndex,
    foldMapWithIndex: array.foldMapWithIndex,
    reduceRightWithIndex: array.reduceRightWithIndex,
    traverseWithIndex: array.traverseWithIndex
};
var _a$8 = pipeable(nonEmptyArray), ap$6 = _a$8.ap, apFirst$6 = _a$8.apFirst, apSecond$6 = _a$8.apSecond, chain$6 = _a$8.chain, chainFirst$6 = _a$8.chainFirst, duplicate$4 = _a$8.duplicate, extend$4 = _a$8.extend, flatten$6 = _a$8.flatten, foldMap$4 = _a$8.foldMap, foldMapWithIndex$1 = _a$8.foldMapWithIndex, map$8 = _a$8.map, mapWithIndex$1 = _a$8.mapWithIndex, reduce$4 = _a$8.reduce, reduceRight$4 = _a$8.reduceRight, reduceRightWithIndex$1 = _a$8.reduceRightWithIndex, reduceWithIndex$1 = _a$8.reduceWithIndex;

var NonEmptyArray = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$a,
    cons: cons$1,
    snoc: snoc$1,
    fromArray: fromArray,
    getShow: getShow$6,
    head: head$1,
    tail: tail$1,
    reverse: reverse$1,
    min: min$1,
    max: max$1,
    getSemigroup: getSemigroup$4,
    getEq: getEq$6,
    group: group,
    groupSort: groupSort,
    groupBy: groupBy,
    last: last$1,
    sort: sort$1,
    insertAt: insertAt$2,
    updateAt: updateAt$2,
    modifyAt: modifyAt$2,
    copy: copy$1,
    filter: filter$3,
    filterWithIndex: filterWithIndex$1,
    of: of$2,
    nonEmptyArray: nonEmptyArray,
    ap: ap$6,
    apFirst: apFirst$6,
    apSecond: apSecond$6,
    chain: chain$6,
    chainFirst: chainFirst$6,
    duplicate: duplicate$4,
    extend: extend$4,
    flatten: flatten$6,
    foldMap: foldMap$4,
    foldMapWithIndex: foldMapWithIndex$1,
    map: map$8,
    mapWithIndex: mapWithIndex$1,
    reduce: reduce$4,
    reduceRight: reduceRight$4,
    reduceRightWithIndex: reduceRightWithIndex$1,
    reduceWithIndex: reduceWithIndex$1
});

var __assign$e = (undefined && undefined.__assign) || function () {
    __assign$e = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$e.apply(this, arguments);
};
function getOptionM(M) {
    var A = getApplicativeComposition(M, option);
    var fnone = M.of(none);
    return __assign$e(__assign$e({}, A), { chain: function (ma, f) { return M.chain(ma, fold(function () { return fnone; }, f)); }, alt: function (fx, fy) { return M.chain(fx, fold(fy, function (a) { return M.of(some(a)); })); }, fold: function (ma, onNone, onSome) { return M.chain(ma, fold(onNone, onSome)); }, getOrElse: function (ma, onNone) { return M.chain(ma, fold(onNone, M.of)); }, fromM: function (ma) { return M.map(ma, some); }, none: function () { return fnone; } });
}

var OptionT = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getOptionM: getOptionM
});



var Profunctor = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * @file Adapted from https://github.com/purescript/purescript-random
 */
/**
 * Returns a random number between 0 (inclusive) and 1 (exclusive). This is a direct wrapper around JavaScript's
 * `Math.random()`.
 *
 * @since 2.0.0
 */
var random = function () { return Math.random(); };
/**
 * Takes a range specified by `low` (the first argument) and `high` (the second), and returns a random integer uniformly
 * distributed in the closed interval `[low, high]`. It is unspecified what happens if `low > high`, or if either of
 * `low` or `high` is not an integer.
 *
 * @since 2.0.0
 */
function randomInt(low, high) {
    return io.map(random, function (n) { return Math.floor((high - low + 1) * n + low); });
}
/**
 * Returns a random number between a minimum value (inclusive) and a maximum value (exclusive). It is unspecified what
 * happens if `maximum < minimum`.
 *
 * @since 2.0.0
 */
function randomRange(min, max) {
    return io.map(random, function (n) { return (max - min) * n + min; });
}
/**
 * Returns a random boolean value with an equal chance of being `true` or `false`
 *
 * @since 2.0.0
 */
var randomBool = io.map(random, function (n) { return n < 0.5; });

var Random = /*#__PURE__*/Object.freeze({
    __proto__: null,
    random: random,
    randomInt: randomInt,
    randomRange: randomRange,
    randomBool: randomBool
});

function getReaderM(M) {
    return {
        map: function (ma, f) { return function (r) { return M.map(ma(r), f); }; },
        of: function (a) { return function () { return M.of(a); }; },
        ap: function (mab, ma) { return function (r) { return M.ap(mab(r), ma(r)); }; },
        chain: function (ma, f) { return function (r) { return M.chain(ma(r), function (a) { return f(a)(r); }); }; },
        ask: function () { return M.of; },
        asks: function (f) { return function (r) { return M.map(M.of(r), f); }; },
        local: function (ma, f) { return function (q) { return ma(f(q)); }; },
        fromReader: function (ma) { return function (r) { return M.of(ma(r)); }; },
        fromM: function (ma) { return function () { return ma; }; }
    };
}

var ReaderT = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getReaderM: getReaderM
});

var T$1 = getReaderM(identity$3);
/**
 * @since 2.0.0
 */
var URI$b = 'Reader';
/**
 * Reads the current context
 *
 * @since 2.0.0
 */
var ask = T$1.ask;
/**
 * Projects a value from the global context in a Reader
 *
 * @since 2.0.0
 */
var asks = T$1.asks;
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.0.0
 */
function local(f) {
    return function (ma) { return T$1.local(ma, f); };
}
/**
 * @since 2.0.0
 */
function getSemigroup$5(S) {
    return {
        concat: function (x, y) { return function (e) { return S.concat(x(e), y(e)); }; }
    };
}
/**
 * @since 2.0.0
 */
function getMonoid$4(M) {
    return {
        concat: getSemigroup$5(M).concat,
        empty: function () { return M.empty; }
    };
}
/**
 * @since 2.0.0
 */
var of$3 = T$1.of;
/**
 * @since 2.0.0
 */
var reader = {
    URI: URI$b,
    map: function (ma, f) { return function (e) { return f(ma(e)); }; },
    of: of$3,
    ap: T$1.ap,
    chain: T$1.chain,
    promap: function (mbc, f, g) { return function (a) { return g(mbc(f(a))); }; },
    compose: function (ab, la) { return function (l) { return ab(la(l)); }; },
    id: function () { return identity; },
    first: function (pab) { return function (_a) {
        var a = _a[0], c = _a[1];
        return [pab(a), c];
    }; },
    second: function (pbc) { return function (_a) {
        var a = _a[0], b = _a[1];
        return [a, pbc(b)];
    }; },
    left: function (pab) {
        return fold$1(function (a) { return left(pab(a)); }, right);
    },
    right: function (pbc) {
        return fold$1(left, function (b) { return right(pbc(b)); });
    }
};
var _a$9 = pipeable(reader), ap$7 = _a$9.ap, apFirst$7 = _a$9.apFirst, apSecond$7 = _a$9.apSecond, chain$7 = _a$9.chain, chainFirst$7 = _a$9.chainFirst, compose = _a$9.compose, flatten$7 = _a$9.flatten, map$9 = _a$9.map, promap = _a$9.promap;

var Reader = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$b,
    ask: ask,
    asks: asks,
    local: local,
    getSemigroup: getSemigroup$5,
    getMonoid: getMonoid$4,
    of: of$3,
    reader: reader,
    ap: ap$7,
    apFirst: apFirst$7,
    apSecond: apSecond$7,
    chain: chain$7,
    chainFirst: chainFirst$7,
    compose: compose,
    flatten: flatten$7,
    map: map$9,
    promap: promap
});

var T$2 = getEitherM(reader);
/**
 * @since 2.0.0
 */
var URI$c = 'ReaderEither';
/**
 * @since 2.0.0
 */
var left$2 = T$2.left;
/**
 * @since 2.0.0
 */
var right$2 = T$2.of;
/**
 * @since 2.0.0
 */
var rightReader = T$2.rightM;
/**
 * @since 2.0.0
 */
var leftReader = T$2.leftM;
/**
 * @since 2.0.0
 */
function fold$5(onLeft, onRight) {
    return function (ma) { return T$2.fold(ma, onLeft, onRight); };
}
/**
 * @since 2.0.0
 */
function getOrElse$3(onLeft) {
    return function (ma) { return T$2.getOrElse(ma, onLeft); };
}
/**
 * @since 2.0.0
 */
function orElse$2(onLeft) {
    return function (ma) { return T$2.orElse(ma, onLeft); };
}
/**
 * @since 2.0.0
 */
var swap$2 = T$2.swap;
/**
 * @since 2.0.0
 */
function getSemigroup$6(S) {
    return getSemigroup$5(getSemigroup$1(S));
}
/**
 * @since 2.0.0
 */
function getApplySemigroup$3(S) {
    return getSemigroup$5(getApplySemigroup$1(S));
}
/**
 * @since 2.0.0
 */
function getApplyMonoid$3(M) {
    return {
        concat: getApplySemigroup$3(M).concat,
        empty: right$2(M.empty)
    };
}
/**
 * @since 2.0.0
 */
function ask$1() {
    return right;
}
/**
 * @since 2.0.0
 */
function asks$1(f) {
    return function (r) { return right(f(r)); };
}
/**
 * @since 2.0.0
 */
function local$1(f) {
    return function (ma) { return function (q) { return ma(f(q)); }; };
}
/**
 * @since 2.0.0
 */
var readerEither = {
    URI: URI$c,
    bimap: T$2.bimap,
    mapLeft: T$2.mapLeft,
    map: T$2.map,
    of: right$2,
    ap: T$2.ap,
    chain: T$2.chain,
    alt: T$2.alt,
    throwError: left$2
};
var _a$a = pipeable(readerEither), alt$5 = _a$a.alt, ap$8 = _a$a.ap, apFirst$8 = _a$a.apFirst, apSecond$8 = _a$a.apSecond, bimap$2 = _a$a.bimap, chain$8 = _a$a.chain, chainFirst$8 = _a$a.chainFirst, flatten$8 = _a$a.flatten, map$a = _a$a.map, mapLeft$2 = _a$a.mapLeft, fromEither$2 = _a$a.fromEither, fromOption$2 = _a$a.fromOption, fromPredicate$3 = _a$a.fromPredicate, filterOrElse$2 = _a$a.filterOrElse;

var ReaderEither = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$c,
    left: left$2,
    right: right$2,
    rightReader: rightReader,
    leftReader: leftReader,
    fold: fold$5,
    getOrElse: getOrElse$3,
    orElse: orElse$2,
    swap: swap$2,
    getSemigroup: getSemigroup$6,
    getApplySemigroup: getApplySemigroup$3,
    getApplyMonoid: getApplyMonoid$3,
    ask: ask$1,
    asks: asks$1,
    local: local$1,
    readerEither: readerEither,
    alt: alt$5,
    ap: ap$8,
    apFirst: apFirst$8,
    apSecond: apSecond$8,
    bimap: bimap$2,
    chain: chain$8,
    chainFirst: chainFirst$8,
    flatten: flatten$8,
    map: map$a,
    mapLeft: mapLeft$2,
    fromEither: fromEither$2,
    fromOption: fromOption$2,
    fromPredicate: fromPredicate$3,
    filterOrElse: filterOrElse$2
});

var __assign$f = (undefined && undefined.__assign) || function () {
    __assign$f = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$f.apply(this, arguments);
};
/**
 * @since 2.0.0
 */
var URI$d = 'Task';
/**
 * @since 2.0.0
 */
var never = function () { return new Promise(function (_) { return undefined; }); };
/**
 * @since 2.0.0
 */
function getSemigroup$7(S) {
    return {
        concat: function (x, y) { return function () { return x().then(function (rx) { return y().then(function (ry) { return S.concat(rx, ry); }); }); }; }
    };
}
/**
 * @since 2.0.0
 */
function getMonoid$5(M) {
    return {
        concat: getSemigroup$7(M).concat,
        empty: task.of(M.empty)
    };
}
/**
 * @since 2.0.0
 */
function getRaceMonoid() {
    return {
        concat: function (x, y) { return function () {
            return new Promise(function (resolve, reject) {
                var running = true;
                var resolveFirst = function (a) {
                    if (running) {
                        running = false;
                        resolve(a);
                    }
                };
                var rejectFirst = function (e) {
                    if (running) {
                        running = false;
                        reject(e);
                    }
                };
                x().then(resolveFirst, rejectFirst);
                y().then(resolveFirst, rejectFirst);
            });
        }; },
        empty: never
    };
}
/**
 * @since 2.0.0
 */
function delay(millis) {
    return function (ma) { return function () {
        return new Promise(function (resolve) {
            setTimeout(function () {
                // tslint:disable-next-line: no-floating-promises
                ma().then(resolve);
            }, millis);
        });
    }; };
}
/**
 * @since 2.0.0
 */
function fromIO(ma) {
    return function () { return Promise.resolve(ma()); };
}
var identity$4 = function (a) { return a; };
/**
 * @since 2.0.0
 */
function of$4(a) {
    return function () { return Promise.resolve(a); };
}
/**
 * @since 2.0.0
 */
var task = {
    URI: URI$d,
    map: function (ma, f) { return function () { return ma().then(f); }; },
    of: of$4,
    ap: function (mab, ma) { return function () { return Promise.all([mab(), ma()]).then(function (_a) {
        var f = _a[0], a = _a[1];
        return f(a);
    }); }; },
    chain: function (ma, f) { return function () { return ma().then(function (a) { return f(a)(); }); }; },
    fromIO: fromIO,
    fromTask: identity$4
};
/**
 * Like `Task` but `ap` is sequential
 *
 * @since 2.0.0
 */
var taskSeq = __assign$f(__assign$f({}, task), { ap: function (mab, ma) { return function () { return mab().then(function (f) { return ma().then(function (a) { return f(a); }); }); }; } });
var _a$b = pipeable(task), ap$9 = _a$b.ap, apFirst$9 = _a$b.apFirst, apSecond$9 = _a$b.apSecond, chain$9 = _a$b.chain, chainFirst$9 = _a$b.chainFirst, flatten$9 = _a$b.flatten, map$b = _a$b.map;

var Task = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$d,
    never: never,
    getSemigroup: getSemigroup$7,
    getMonoid: getMonoid$5,
    getRaceMonoid: getRaceMonoid,
    delay: delay,
    fromIO: fromIO,
    of: of$4,
    task: task,
    taskSeq: taskSeq,
    ap: ap$9,
    apFirst: apFirst$9,
    apSecond: apSecond$9,
    chain: chain$9,
    chainFirst: chainFirst$9,
    flatten: flatten$9,
    map: map$b
});

var __assign$g = (undefined && undefined.__assign) || function () {
    __assign$g = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$g.apply(this, arguments);
};
var T$3 = getEitherM(task);
/**
 * @since 2.0.0
 */
var URI$e = 'TaskEither';
/**
 * @since 2.0.0
 */
var left$3 = T$3.left;
/**
 * @since 2.0.0
 */
var right$3 = T$3.of;
/**
 * @since 2.0.0
 */
function rightIO$1(ma) {
    return rightTask(task.fromIO(ma));
}
/**
 * @since 2.0.0
 */
function leftIO$1(me) {
    return leftTask(task.fromIO(me));
}
/**
 * @since 2.0.0
 */
var rightTask = T$3.rightM;
/**
 * @since 2.0.0
 */
var leftTask = T$3.leftM;
/**
 * @since 2.0.0
 */
var fromIOEither = task.fromIO;
/**
 * @since 2.0.0
 */
function fold$6(onLeft, onRight) {
    return function (ma) { return T$3.fold(ma, onLeft, onRight); };
}
/**
 * @since 2.0.0
 */
function getOrElse$4(onLeft) {
    return function (ma) { return T$3.getOrElse(ma, onLeft); };
}
/**
 * @since 2.0.0
 */
function orElse$3(onLeft) {
    return function (ma) { return T$3.orElse(ma, onLeft); };
}
/**
 * @since 2.0.0
 */
var swap$3 = T$3.swap;
/**
 * @since 2.0.0
 */
function getSemigroup$8(S) {
    return getSemigroup$7(getSemigroup$1(S));
}
/**
 * @since 2.0.0
 */
function getApplySemigroup$4(S) {
    return getSemigroup$7(getApplySemigroup$1(S));
}
/**
 * @since 2.0.0
 */
function getApplyMonoid$4(M) {
    return {
        concat: getApplySemigroup$4(M).concat,
        empty: right$3(M.empty)
    };
}
/**
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Either` instead.
 *
 * Note: `f` should never `throw` errors, they are not caught.
 *
 * @example
 * import { left, right } from 'fp-ts/lib/Either'
 * import { tryCatch } from 'fp-ts/lib/TaskEither'
 *
 * tryCatch(() => Promise.resolve(1), String)().then(result => {
 *   assert.deepStrictEqual(result, right(1))
 * })
 * tryCatch(() => Promise.reject('error'), String)().then(result => {
 *   assert.deepStrictEqual(result, left('error'))
 * })
 *
 * @since 2.0.0
 */
function tryCatch$3(f, onRejected) {
    return function () { return f().then(right, function (reason) { return left(onRejected(reason)); }); };
}
/**
 * Make sure that a resource is cleaned up in the event of an exception (*). The release action is called regardless of
 * whether the body action throws (*) or returns.
 *
 * (*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
function bracket$1(acquire, use, release) {
    return T$3.chain(acquire, function (a) {
        return T$3.chain(task.map(use(a), right), function (e) {
            return T$3.chain(release(a, e), function () { return (isLeft(e) ? T$3.left(e.left) : T$3.of(e.right)); });
        });
    });
}
function taskify(f) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return function () {
            return new Promise(function (resolve) {
                var cbResolver = function (e, r) { return (e != null ? resolve(left(e)) : resolve(right(r))); };
                f.apply(null, args.concat(cbResolver));
            });
        };
    };
}
/**
 * @since 2.0.0
 */
function getTaskValidation(S) {
    var T = getValidationM(S, task);
    return __assign$g({ URI: URI$e, _E: undefined }, T);
}
var phantom$2 = undefined;
/**
 * @since 2.1.0
 */
function getFilterable$1(M) {
    var F = getWitherable(M);
    return __assign$g({ URI: URI$e, _E: phantom$2 }, getFilterableComposition(task, F));
}
/**
 * @since 2.0.0
 */
var taskEither = {
    URI: URI$e,
    bimap: T$3.bimap,
    mapLeft: T$3.mapLeft,
    map: T$3.map,
    of: T$3.of,
    ap: T$3.ap,
    chain: T$3.chain,
    alt: T$3.alt,
    fromIO: rightIO$1,
    fromTask: rightTask,
    throwError: left$3
};
/**
 * Like `TaskEither` but `ap` is sequential
 *
 * @since 2.0.0
 */
var taskEitherSeq = __assign$g(__assign$g({}, taskEither), { ap: function (mab, ma) { return T$3.chain(mab, function (f) { return T$3.map(ma, f); }); } });
var _a$c = pipeable(taskEither), alt$6 = _a$c.alt, ap$a = _a$c.ap, apFirst$a = _a$c.apFirst, apSecond$a = _a$c.apSecond, bimap$3 = _a$c.bimap, chain$a = _a$c.chain, chainFirst$a = _a$c.chainFirst, flatten$a = _a$c.flatten, map$c = _a$c.map, mapLeft$3 = _a$c.mapLeft, fromEither$3 = _a$c.fromEither, fromOption$3 = _a$c.fromOption, fromPredicate$4 = _a$c.fromPredicate, filterOrElse$3 = _a$c.filterOrElse;

var TaskEither = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$e,
    left: left$3,
    right: right$3,
    rightIO: rightIO$1,
    leftIO: leftIO$1,
    rightTask: rightTask,
    leftTask: leftTask,
    fromIOEither: fromIOEither,
    fold: fold$6,
    getOrElse: getOrElse$4,
    orElse: orElse$3,
    swap: swap$3,
    getSemigroup: getSemigroup$8,
    getApplySemigroup: getApplySemigroup$4,
    getApplyMonoid: getApplyMonoid$4,
    tryCatch: tryCatch$3,
    bracket: bracket$1,
    taskify: taskify,
    getTaskValidation: getTaskValidation,
    getFilterable: getFilterable$1,
    taskEither: taskEither,
    taskEitherSeq: taskEitherSeq,
    alt: alt$6,
    ap: ap$a,
    apFirst: apFirst$a,
    apSecond: apSecond$a,
    bimap: bimap$3,
    chain: chain$a,
    chainFirst: chainFirst$a,
    flatten: flatten$a,
    map: map$c,
    mapLeft: mapLeft$3,
    fromEither: fromEither$3,
    fromOption: fromOption$3,
    fromPredicate: fromPredicate$4,
    filterOrElse: filterOrElse$3
});

var __assign$h = (undefined && undefined.__assign) || function () {
    __assign$h = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$h.apply(this, arguments);
};
var T$4 = getReaderM(taskEither);
/**
 * @since 2.0.0
 */
var URI$f = 'ReaderTaskEither';
/**
 * @since 2.0.0
 */
function run(ma, r) {
    return ma(r)();
}
/**
 * @since 2.0.0
 */
function left$4(e) {
    return fromTaskEither(left$3(e));
}
/**
 * @since 2.0.0
 */
var right$4 = T$4.of;
/**
 * @since 2.0.0
 */
function rightTask$1(ma) {
    return fromTaskEither(rightTask(ma));
}
/**
 * @since 2.0.0
 */
function leftTask$1(me) {
    return fromTaskEither(leftTask(me));
}
/**
 * @since 2.0.0
 */
var fromTaskEither = T$4.fromM;
/**
 * @since 2.0.0
 */
var rightReader$1 = T$4.fromReader;
/**
 * @since 2.0.0
 */
function leftReader$1(me) {
    return function (r) { return left$3(me(r)); };
}
/**
 * @since 2.0.0
 */
function fromIOEither$1(ma) {
    return fromTaskEither(fromIOEither(ma));
}
/**
 * @since 2.0.0
 */
function fromReaderEither(ma) {
    return function (r) { return fromEither$3(ma(r)); };
}
/**
 * @since 2.0.0
 */
function rightIO$2(ma) {
    return fromTaskEither(rightIO$1(ma));
}
/**
 * @since 2.0.0
 */
function leftIO$2(me) {
    return fromTaskEither(leftIO$1(me));
}
/**
 * @since 2.0.0
 */
function fold$7(onLeft, onRight) {
    return function (ma) { return function (r) {
        return pipe(ma(r), fold$6(function (e) { return onLeft(e)(r); }, function (a) { return onRight(a)(r); }));
    }; };
}
/**
 * @since 2.0.0
 */
function getOrElse$5(onLeft) {
    return function (ma) { return function (r) { return getOrElse$4(function (e) { return onLeft(e)(r); })(ma(r)); }; };
}
/**
 * @since 2.0.0
 */
function orElse$4(onLeft) {
    return function (ma) { return function (r) { return orElse$3(function (e) { return onLeft(e)(r); })(ma(r)); }; };
}
/**
 * @since 2.0.0
 */
function swap$4(ma) {
    return function (e) { return swap$3(ma(e)); };
}
/**
 * @since 2.0.0
 */
function getSemigroup$9(S) {
    return getSemigroup$5(getSemigroup$8(S));
}
/**
 * @since 2.0.0
 */
function getApplySemigroup$5(S) {
    return getSemigroup$5(getApplySemigroup$4(S));
}
/**
 * @since 2.0.0
 */
function getApplyMonoid$5(M) {
    return {
        concat: getApplySemigroup$5(M).concat,
        empty: right$4(M.empty)
    };
}
/**
 * @since 2.0.0
 */
var ask$2 = T$4.ask;
/**
 * @since 2.0.0
 */
var asks$2 = T$4.asks;
/**
 * @since 2.0.0
 */
function local$2(f) {
    return function (ma) { return T$4.local(ma, f); };
}
/**
 * Make sure that a resource is cleaned up in the event of an exception (*). The release action is called regardless of
 * whether the body action throws (*) or returns.
 *
 * (*) i.e. returns a `Left`
 *
 * @since 2.0.4
 */
function bracket$2(aquire, use, release) {
    return function (r) { return bracket$1(aquire(r), function (a) { return use(a)(r); }, function (a, e) { return release(a, e)(r); }); };
}
/**
 * @since 2.0.0
 */
var readerTaskEither = {
    URI: URI$f,
    map: T$4.map,
    of: right$4,
    ap: T$4.ap,
    chain: T$4.chain,
    alt: function (fx, fy) { return function (r) { return taskEither.alt(fx(r), function () { return fy()(r); }); }; },
    bimap: function (ma, f, g) { return function (e) { return taskEither.bimap(ma(e), f, g); }; },
    mapLeft: function (ma, f) { return function (e) { return taskEither.mapLeft(ma(e), f); }; },
    fromIO: rightIO$2,
    fromTask: rightTask$1,
    throwError: left$4
};
/**
 * Like `readerTaskEither` but `ap` is sequential
 * @since 2.0.0
 */
var readerTaskEitherSeq = __assign$h(__assign$h({}, readerTaskEither), { ap: function (mab, ma) { return T$4.chain(mab, function (f) { return T$4.map(ma, f); }); } });
var _a$d = pipeable(readerTaskEither), alt$7 = _a$d.alt, ap$b = _a$d.ap, apFirst$b = _a$d.apFirst, apSecond$b = _a$d.apSecond, bimap$4 = _a$d.bimap, chain$b = _a$d.chain, chainFirst$b = _a$d.chainFirst, flatten$b = _a$d.flatten, map$d = _a$d.map, mapLeft$4 = _a$d.mapLeft, fromOption$4 = _a$d.fromOption, fromEither$4 = _a$d.fromEither, fromPredicate$5 = _a$d.fromPredicate, filterOrElse$4 = _a$d.filterOrElse;

var ReaderTaskEither = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$f,
    run: run,
    left: left$4,
    right: right$4,
    rightTask: rightTask$1,
    leftTask: leftTask$1,
    fromTaskEither: fromTaskEither,
    rightReader: rightReader$1,
    leftReader: leftReader$1,
    fromIOEither: fromIOEither$1,
    fromReaderEither: fromReaderEither,
    rightIO: rightIO$2,
    leftIO: leftIO$2,
    fold: fold$7,
    getOrElse: getOrElse$5,
    orElse: orElse$4,
    swap: swap$4,
    getSemigroup: getSemigroup$9,
    getApplySemigroup: getApplySemigroup$5,
    getApplyMonoid: getApplyMonoid$5,
    ask: ask$2,
    asks: asks$2,
    local: local$2,
    bracket: bracket$2,
    readerTaskEither: readerTaskEither,
    readerTaskEitherSeq: readerTaskEitherSeq,
    alt: alt$7,
    ap: ap$b,
    apFirst: apFirst$b,
    apSecond: apSecond$b,
    bimap: bimap$4,
    chain: chain$b,
    chainFirst: chainFirst$b,
    flatten: flatten$b,
    map: map$d,
    mapLeft: mapLeft$4,
    fromOption: fromOption$4,
    fromEither: fromEither$4,
    fromPredicate: fromPredicate$5,
    filterOrElse: filterOrElse$4
});

/**
 * @since 2.0.0
 */
var showString = {
    show: function (a) { return JSON.stringify(a); }
};
/**
 * @since 2.0.0
 */
var showNumber = {
    show: function (a) { return JSON.stringify(a); }
};
/**
 * @since 2.0.0
 */
var showBoolean = {
    show: function (a) { return JSON.stringify(a); }
};
/**
 * @since 2.0.0
 */
function getStructShow(shows) {
    return {
        show: function (s) {
            return "{ " + Object.keys(shows)
                .map(function (k) { return k + ": " + shows[k].show(s[k]); })
                .join(', ') + " }";
        }
    };
}
/**
 * @since 2.0.0
 */
function getTupleShow() {
    var shows = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        shows[_i] = arguments[_i];
    }
    return {
        show: function (t) { return "[" + t.map(function (a, i) { return shows[i].show(a); }).join(', ') + "]"; }
    };
}

var Show = /*#__PURE__*/Object.freeze({
    __proto__: null,
    showString: showString,
    showNumber: showNumber,
    showBoolean: showBoolean,
    getStructShow: getStructShow,
    getTupleShow: getTupleShow
});

var __assign$i = (undefined && undefined.__assign) || function () {
    __assign$i = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$i.apply(this, arguments);
};
/**
 * @since 2.0.0
 */
var URI$g = 'Record';
/**
 * @since 2.0.0
 */
function getShow$7(S) {
    return {
        show: function (r) {
            var elements = collect$1(function (k, a) { return showString.show(k) + ": " + S.show(a); })(r).join(', ');
            return elements === '' ? '{}' : "{ " + elements + " }";
        }
    };
}
/**
 * Calculate the number of key/value pairs in a record
 *
 * @since 2.0.0
 */
function size$1(r) {
    return Object.keys(r).length;
}
/**
 * Test whether a record is empty
 *
 * @since 2.0.0
 */
function isEmpty$2(r) {
    return Object.keys(r).length === 0;
}
var unorderedKeys = function (r) { return Object.keys(r); };
/**
 * @since 2.0.0
 */
function keys$1(r) {
    return unorderedKeys(r).sort();
}
/**
 * Map a record into an array
 *
 * @example
 * import {collect} from 'fp-ts/lib/Record'
 *
 * const x: { a: string, b: boolean } = { a: 'foo', b: false }
 * assert.deepStrictEqual(
 *   collect((key, val) => ({key: key, value: val}))(x),
 *   [{key: 'a', value: 'foo'}, {key: 'b', value: false}]
 * )
 *
 * @since 2.0.0
 */
function collect$1(f) {
    return function (r) {
        var out = [];
        for (var _i = 0, _a = keys$1(r); _i < _a.length; _i++) {
            var key = _a[_i];
            out.push(f(key, r[key]));
        }
        return out;
    };
}
/**
 * @since 2.0.0
 */
var toArray$1 = collect$1(function (k, a) { return [k, a]; });
function toUnfoldable$1(unfoldable) {
    return function (r) {
        var arr = toArray$1(r);
        var len = arr.length;
        return unfoldable.unfold(0, function (b) { return (b < len ? some([arr[b], b + 1]) : none); });
    };
}
function insertAt$3(k, a) {
    return function (r) {
        if (r[k] === a) {
            return r;
        }
        var out = Object.assign({}, r);
        out[k] = a;
        return out;
    };
}
var _hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * @since 2.0.0
 */
function hasOwnProperty(k, r) {
    return _hasOwnProperty.call(r, k);
}
function deleteAt$2(k) {
    return function (r) {
        if (!_hasOwnProperty.call(r, k)) {
            return r;
        }
        var out = Object.assign({}, r);
        delete out[k];
        return out;
    };
}
/**
 * @since 2.0.0
 */
function updateAt$3(k, a) {
    return function (r) {
        if (!hasOwnProperty(k, r)) {
            return none;
        }
        if (r[k] === a) {
            return some(r);
        }
        var out = Object.assign({}, r);
        out[k] = a;
        return some(out);
    };
}
/**
 * @since 2.0.0
 */
function modifyAt$3(k, f) {
    return function (r) {
        if (!hasOwnProperty(k, r)) {
            return none;
        }
        var out = Object.assign({}, r);
        out[k] = f(r[k]);
        return some(out);
    };
}
function pop$1(k) {
    var deleteAtk = deleteAt$2(k);
    return function (r) {
        var oa = lookup$2(k, r);
        return isNone(oa) ? none : some([oa.value, deleteAtk(r)]);
    };
}
/**
 * Test whether one record contains all of the keys and values contained in another record
 *
 * @since 2.0.0
 */
function isSubrecord(E) {
    return function (x, y) {
        for (var k in x) {
            if (!_hasOwnProperty.call(y, k) || !E.equals(x[k], y[k])) {
                return false;
            }
        }
        return true;
    };
}
function getEq$7(E) {
    var isSubrecordE = isSubrecord(E);
    return fromEquals(function (x, y) { return isSubrecordE(x, y) && isSubrecordE(y, x); });
}
function getMonoid$6(S) {
    return {
        concat: function (x, y) {
            if (x === empty$2) {
                return y;
            }
            if (y === empty$2) {
                return x;
            }
            var keys = Object.keys(y);
            var len = keys.length;
            if (len === 0) {
                return x;
            }
            var r = __assign$i({}, x);
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                r[k] = _hasOwnProperty.call(x, k) ? S.concat(x[k], y[k]) : y[k];
            }
            return r;
        },
        empty: empty$2
    };
}
/**
 * Lookup the value for a key in a record
 *
 * @since 2.0.0
 */
function lookup$2(k, r) {
    return _hasOwnProperty.call(r, k) ? some(r[k]) : none;
}
/**
 * @since 2.0.0
 */
var empty$2 = {};
function mapWithIndex$2(f) {
    return function (fa) { return record.mapWithIndex(fa, f); };
}
function map$e(f) {
    return mapWithIndex$2(function (_, a) { return f(a); });
}
function reduceWithIndex$2(b, f) {
    return function (fa) { return record.reduceWithIndex(fa, b, f); };
}
function foldMapWithIndex$2(M) {
    var foldMapWithIndexM = record.foldMapWithIndex(M);
    return function (f) { return function (fa) { return foldMapWithIndexM(fa, f); }; };
}
function reduceRightWithIndex$2(b, f) {
    return function (fa) { return record.reduceRightWithIndex(fa, b, f); };
}
/**
 * Create a record with one key/value pair
 *
 * @since 2.0.0
 */
function singleton$1(k, a) {
    var _a;
    return _a = {}, _a[k] = a, _a;
}
function traverseWithIndex(F) {
    var traverseWithIndexF = record.traverseWithIndex(F);
    return function (f) { return function (ta) { return traverseWithIndexF(ta, f); }; };
}
function traverse(F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
}
function sequence(F) {
    return traverseWithIndex(F)(function (_, a) { return a; });
}
function partitionMapWithIndex$1(f) {
    return function (fa) { return record.partitionMapWithIndex(fa, f); };
}
function partitionWithIndex$1(predicateWithIndex) {
    return function (fa) { return record.partitionWithIndex(fa, predicateWithIndex); };
}
function filterMapWithIndex$1(f) {
    return function (fa) { return record.filterMapWithIndex(fa, f); };
}
function filterWithIndex$2(predicateWithIndex) {
    return function (fa) { return record.filterWithIndex(fa, predicateWithIndex); };
}
function fromFoldable$1(M, F) {
    var fromFoldableMapM = fromFoldableMap(M, F);
    return function (fka) { return fromFoldableMapM(fka, identity); };
}
function fromFoldableMap(M, F) {
    return function (ta, f) {
        return F.reduce(ta, {}, function (r, a) {
            var _a = f(a), k = _a[0], b = _a[1];
            r[k] = _hasOwnProperty.call(r, k) ? M.concat(r[k], b) : b;
            return r;
        });
    };
}
/**
 * @since 2.0.0
 */
function every(predicate) {
    return function (r) {
        for (var k in r) {
            if (!predicate(r[k])) {
                return false;
            }
        }
        return true;
    };
}
/**
 * @since 2.0.0
 */
function some$1(predicate) {
    return function (r) {
        for (var k in r) {
            if (predicate(r[k])) {
                return true;
            }
        }
        return false;
    };
}
/**
 * @since 2.0.0
 */
function elem$4(E) {
    return function (a, fa) {
        for (var k in fa) {
            if (E.equals(fa[k], a)) {
                return true;
            }
        }
        return false;
    };
}
/**
 * @since 2.0.0
 */
var record = {
    URI: URI$g,
    map: function (fa, f) { return record.mapWithIndex(fa, function (_, a) { return f(a); }); },
    reduce: function (fa, b, f) { return record.reduceWithIndex(fa, b, function (_, b, a) { return f(b, a); }); },
    foldMap: function (M) {
        var foldMapWithIndexM = record.foldMapWithIndex(M);
        return function (fa, f) { return foldMapWithIndexM(fa, function (_, a) { return f(a); }); };
    },
    reduceRight: function (fa, b, f) { return record.reduceRightWithIndex(fa, b, function (_, a, b) { return f(a, b); }); },
    traverse: function (F) {
        var traverseWithIndexF = record.traverseWithIndex(F);
        return function (ta, f) { return traverseWithIndexF(ta, function (_, a) { return f(a); }); };
    },
    sequence: sequence,
    compact: function (fa) {
        var r = {};
        var keys = Object.keys(fa);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var optionA = fa[key];
            if (isSome(optionA)) {
                r[key] = optionA.value;
            }
        }
        return r;
    },
    separate: function (fa) {
        var left = {};
        var right = {};
        var keys = Object.keys(fa);
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            var e = fa[key];
            switch (e._tag) {
                case 'Left':
                    left[key] = e.left;
                    break;
                case 'Right':
                    right[key] = e.right;
                    break;
            }
        }
        return {
            left: left,
            right: right
        };
    },
    filter: function (fa, predicate) {
        return record.filterWithIndex(fa, function (_, a) { return predicate(a); });
    },
    filterMap: function (fa, f) { return record.filterMapWithIndex(fa, function (_, a) { return f(a); }); },
    partition: function (fa, predicate) {
        return record.partitionWithIndex(fa, function (_, a) { return predicate(a); });
    },
    partitionMap: function (fa, f) { return record.partitionMapWithIndex(fa, function (_, a) { return f(a); }); },
    wither: function (F) {
        var traverseF = record.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), record.compact); };
    },
    wilt: function (F) {
        var traverseF = record.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), record.separate); };
    },
    mapWithIndex: function (fa, f) {
        var out = {};
        var keys = Object.keys(fa);
        for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
            var key = keys_3[_i];
            out[key] = f(key, fa[key]);
        }
        return out;
    },
    reduceWithIndex: function (fa, b, f) {
        var out = b;
        var keys = Object.keys(fa).sort();
        var len = keys.length;
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            out = f(k, out, fa[k]);
        }
        return out;
    },
    foldMapWithIndex: function (M) { return function (fa, f) {
        var out = M.empty;
        var keys = Object.keys(fa).sort();
        var len = keys.length;
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            out = M.concat(out, f(k, fa[k]));
        }
        return out;
    }; },
    reduceRightWithIndex: function (fa, b, f) {
        var out = b;
        var keys = Object.keys(fa).sort();
        var len = keys.length;
        for (var i = len - 1; i >= 0; i--) {
            var k = keys[i];
            out = f(k, fa[k], out);
        }
        return out;
    },
    traverseWithIndex: function (F) { return function (ta, f) {
        var keys = Object.keys(ta);
        if (keys.length === 0) {
            return F.of(empty$2);
        }
        var fr = F.of({});
        var _loop_1 = function (key) {
            fr = F.ap(F.map(fr, function (r) { return function (b) {
                r[key] = b;
                return r;
            }; }), f(key, ta[key]));
        };
        for (var _i = 0, keys_4 = keys; _i < keys_4.length; _i++) {
            var key = keys_4[_i];
            _loop_1(key);
        }
        return fr;
    }; },
    partitionMapWithIndex: function (fa, f) {
        var left = {};
        var right = {};
        var keys = Object.keys(fa);
        for (var _i = 0, keys_5 = keys; _i < keys_5.length; _i++) {
            var key = keys_5[_i];
            var e = f(key, fa[key]);
            switch (e._tag) {
                case 'Left':
                    left[key] = e.left;
                    break;
                case 'Right':
                    right[key] = e.right;
                    break;
            }
        }
        return {
            left: left,
            right: right
        };
    },
    partitionWithIndex: function (fa, predicateWithIndex) {
        var left = {};
        var right = {};
        var keys = Object.keys(fa);
        for (var _i = 0, keys_6 = keys; _i < keys_6.length; _i++) {
            var key = keys_6[_i];
            var a = fa[key];
            if (predicateWithIndex(key, a)) {
                right[key] = a;
            }
            else {
                left[key] = a;
            }
        }
        return {
            left: left,
            right: right
        };
    },
    filterMapWithIndex: function (fa, f) {
        var r = {};
        var keys = Object.keys(fa);
        for (var _i = 0, keys_7 = keys; _i < keys_7.length; _i++) {
            var key = keys_7[_i];
            var optionB = f(key, fa[key]);
            if (isSome(optionB)) {
                r[key] = optionB.value;
            }
        }
        return r;
    },
    filterWithIndex: function (fa, predicateWithIndex) {
        var out = {};
        var changed = false;
        for (var key in fa) {
            if (_hasOwnProperty.call(fa, key)) {
                var a = fa[key];
                if (predicateWithIndex(key, a)) {
                    out[key] = a;
                }
                else {
                    changed = true;
                }
            }
        }
        return changed ? out : fa;
    }
};
var _a$e = pipeable(record), filter$4 = _a$e.filter, filterMap$3 = _a$e.filterMap, foldMap$5 = _a$e.foldMap, partition$3 = _a$e.partition, partitionMap$3 = _a$e.partitionMap, reduce$5 = _a$e.reduce, reduceRight$5 = _a$e.reduceRight, compact$3 = _a$e.compact, separate$3 = _a$e.separate;

var Record = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$g,
    getShow: getShow$7,
    size: size$1,
    isEmpty: isEmpty$2,
    keys: keys$1,
    collect: collect$1,
    toArray: toArray$1,
    toUnfoldable: toUnfoldable$1,
    insertAt: insertAt$3,
    hasOwnProperty: hasOwnProperty,
    deleteAt: deleteAt$2,
    updateAt: updateAt$3,
    modifyAt: modifyAt$3,
    pop: pop$1,
    isSubrecord: isSubrecord,
    getEq: getEq$7,
    getMonoid: getMonoid$6,
    lookup: lookup$2,
    empty: empty$2,
    mapWithIndex: mapWithIndex$2,
    map: map$e,
    reduceWithIndex: reduceWithIndex$2,
    foldMapWithIndex: foldMapWithIndex$2,
    reduceRightWithIndex: reduceRightWithIndex$2,
    singleton: singleton$1,
    traverseWithIndex: traverseWithIndex,
    traverse: traverse,
    sequence: sequence,
    partitionMapWithIndex: partitionMapWithIndex$1,
    partitionWithIndex: partitionWithIndex$1,
    filterMapWithIndex: filterMapWithIndex$1,
    filterWithIndex: filterWithIndex$2,
    fromFoldable: fromFoldable$1,
    fromFoldableMap: fromFoldableMap,
    every: every,
    some: some$1,
    elem: elem$4,
    record: record,
    filter: filter$4,
    filterMap: filterMap$3,
    foldMap: foldMap$5,
    partition: partition$3,
    partitionMap: partitionMap$3,
    reduce: reduce$5,
    reduceRight: reduceRight$5,
    compact: compact$3,
    separate: separate$3
});

/**
 * @file The `Semiring` class is for types that support an addition and multiplication operation.
 *
 * Instances must satisfy the following laws:
 *
 * - Commutative monoid under addition:
 *   - Associativity: `(a + b) + c = a + (b + c)`
 *   - Identity: `zero + a = a + zero = a`
 *   - Commutative: `a + b = b + a`
 * - Monoid under multiplication:
 *   - Associativity: `(a * b) * c = a * (b * c)`
 *   - Identity: `one * a = a * one = a`
 * - Multiplication distributes over addition:
 *   - Left distributivity: `a * (b + c) = (a * b) + (a * c)`
 *   - Right distributivity: `(a + b) * c = (a * c) + (b * c)`
 * - Annihilation: `zero * a = a * zero = zero`
 *
 * **Note:** The `number` type is not fully law abiding members of this class hierarchy due to the potential
 * for arithmetic overflows, and the presence of `NaN` and `Infinity` values. The behaviour is
 * unspecified in these cases.
 */
/**
 * @since 2.0.0
 */
function getFunctionSemiring(S) {
    return {
        add: function (f, g) { return function (x) { return S.add(f(x), g(x)); }; },
        zero: function () { return S.zero; },
        mul: function (f, g) { return function (x) { return S.mul(f(x), g(x)); }; },
        one: function () { return S.one; }
    };
}

var Semiring = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFunctionSemiring: getFunctionSemiring
});

var __assign$j = (undefined && undefined.__assign) || function () {
    __assign$j = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$j.apply(this, arguments);
};
/**
 * @since 2.0.0
 */
function getFunctionRing(ring) {
    return __assign$j(__assign$j({}, getFunctionSemiring(ring)), { sub: function (f, g) { return function (x) { return ring.sub(f(x), g(x)); }; } });
}
/**
 * `negate x` can be used as a shorthand for `zero - x`
 *
 * @since 2.0.0
 */
function negate(ring) {
    return function (a) { return ring.sub(ring.zero, a); };
}
/**
 * Given a tuple of `Ring`s returns a `Ring` for the tuple
 *
 * @example
 * import { getTupleRing } from 'fp-ts/lib/Ring'
 * import { fieldNumber } from 'fp-ts/lib/Field'
 *
 * const R = getTupleRing(fieldNumber, fieldNumber, fieldNumber)
 * assert.deepStrictEqual(R.add([1, 2, 3], [4, 5, 6]), [5, 7, 9])
 * assert.deepStrictEqual(R.mul([1, 2, 3], [4, 5, 6]), [4, 10, 18])
 * assert.deepStrictEqual(R.one, [1, 1, 1])
 * assert.deepStrictEqual(R.sub([1, 2, 3], [4, 5, 6]), [-3, -3, -3])
 * assert.deepStrictEqual(R.zero, [0, 0, 0])
 *
 * @since 2.0.0
 */
function getTupleRing() {
    var rings = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rings[_i] = arguments[_i];
    }
    return {
        add: function (x, y) { return rings.map(function (R, i) { return R.add(x[i], y[i]); }); },
        zero: rings.map(function (R) { return R.zero; }),
        mul: function (x, y) { return rings.map(function (R, i) { return R.mul(x[i], y[i]); }); },
        one: rings.map(function (R) { return R.one; }),
        sub: function (x, y) { return rings.map(function (R, i) { return R.sub(x[i], y[i]); }); }
    };
}

var Ring = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFunctionRing: getFunctionRing,
    negate: negate,
    getTupleRing: getTupleRing
});



var Semigroupoid = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * @since 2.0.0
 */
function getShow$8(S) {
    return {
        show: function (s) {
            var elements = '';
            s.forEach(function (a) {
                elements += S.show(a) + ', ';
            });
            if (elements !== '') {
                elements = elements.substring(0, elements.length - 2);
            }
            return "new Set([" + elements + "])";
        }
    };
}
/**
 * @since 2.0.0
 */
var empty$3 = new Set();
/**
 * @since 2.0.0
 */
function toArray$2(O) {
    return function (x) {
        var r = [];
        x.forEach(function (e) { return r.push(e); });
        return r.sort(O.compare);
    };
}
/**
 * @since 2.0.0
 */
function getEq$8(E) {
    var subsetE = subset(E);
    return fromEquals(function (x, y) { return subsetE(x, y) && subsetE(y, x); });
}
/**
 * @since 2.0.0
 */
function some$2(predicate) {
    return function (set) {
        var values = set.values();
        var e;
        var found = false;
        // tslint:disable-next-line: strict-boolean-expressions
        while (!found && !(e = values.next()).done) {
            found = predicate(e.value);
        }
        return found;
    };
}
/**
 * Projects a Set through a function
 *
 * @since 2.0.0
 */
function map$f(E) {
    var elemE = elem$5(E);
    return function (f) { return function (set) {
        var r = new Set();
        set.forEach(function (e) {
            var v = f(e);
            if (!elemE(v, r)) {
                r.add(v);
            }
        });
        return r;
    }; };
}
/**
 * @since 2.0.0
 */
function every$1(predicate) {
    return not(some$2(not(predicate)));
}
/**
 * @since 2.0.0
 */
function chain$c(E) {
    var elemE = elem$5(E);
    return function (f) { return function (set) {
        var r = new Set();
        set.forEach(function (e) {
            f(e).forEach(function (e) {
                if (!elemE(e, r)) {
                    r.add(e);
                }
            });
        });
        return r;
    }; };
}
/**
 * `true` if and only if every element in the first set is an element of the second set
 *
 * @since 2.0.0
 */
function subset(E) {
    var elemE = elem$5(E);
    return function (x, y) { return every$1(function (a) { return elemE(a, y); })(x); };
}
function filter$5(predicate) {
    return function (set) {
        var values = set.values();
        var e;
        var r = new Set();
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = values.next()).done) {
            var value = e.value;
            if (predicate(value)) {
                r.add(value);
            }
        }
        return r;
    };
}
function partition$4(predicate) {
    return function (set) {
        var values = set.values();
        var e;
        var right = new Set();
        var left = new Set();
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = values.next()).done) {
            var value = e.value;
            if (predicate(value)) {
                right.add(value);
            }
            else {
                left.add(value);
            }
        }
        return { left: left, right: right };
    };
}
/**
 * Test if a value is a member of a set
 *
 * @since 2.0.0
 */
function elem$5(E) {
    return function (a, set) {
        var values = set.values();
        var e;
        var found = false;
        // tslint:disable-next-line: strict-boolean-expressions
        while (!found && !(e = values.next()).done) {
            found = E.equals(a, e.value);
        }
        return found;
    };
}
/**
 * Form the union of two sets
 *
 * @since 2.0.0
 */
function union$1(E) {
    var elemE = elem$5(E);
    return function (x, y) {
        if (x === empty$3) {
            return y;
        }
        if (y === empty$3) {
            return x;
        }
        var r = new Set(x);
        y.forEach(function (e) {
            if (!elemE(e, r)) {
                r.add(e);
            }
        });
        return r;
    };
}
/**
 * The set of elements which are in both the first and second set
 *
 * @since 2.0.0
 */
function intersection$1(E) {
    var elemE = elem$5(E);
    return function (x, y) {
        if (x === empty$3 || y === empty$3) {
            return empty$3;
        }
        var r = new Set();
        x.forEach(function (e) {
            if (elemE(e, y)) {
                r.add(e);
            }
        });
        return r;
    };
}
/**
 * @since 2.0.0
 */
function partitionMap$4(EB, EC) {
    return function (f) { return function (set) {
        var values = set.values();
        var e;
        var left = new Set();
        var right = new Set();
        var hasB = elem$5(EB);
        var hasC = elem$5(EC);
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = values.next()).done) {
            var v = f(e.value);
            switch (v._tag) {
                case 'Left':
                    if (!hasB(v.left, left)) {
                        left.add(v.left);
                    }
                    break;
                case 'Right':
                    if (!hasC(v.right, right)) {
                        right.add(v.right);
                    }
                    break;
            }
        }
        return { left: left, right: right };
    }; };
}
/**
 * Form the set difference (`x` - `y`)
 *
 * @example
 * import { difference } from 'fp-ts/lib/Set'
 * import { eqNumber } from 'fp-ts/lib/Eq'
 *
 * assert.deepStrictEqual(difference(eqNumber)(new Set([1, 2]), new Set([1, 3])), new Set([2]))
 *
 *
 * @since 2.0.0
 */
function difference$1(E) {
    var elemE = elem$5(E);
    return function (x, y) { return filter$5(function (a) { return !elemE(a, y); })(x); };
}
/**
 * @since 2.0.0
 */
function getUnionMonoid(E) {
    return {
        concat: union$1(E),
        empty: empty$3
    };
}
/**
 * @since 2.0.0
 */
function getIntersectionSemigroup(E) {
    return {
        concat: intersection$1(E)
    };
}
/**
 * @since 2.0.0
 */
function reduce$6(O) {
    var toArrayO = toArray$2(O);
    return function (b, f) { return function (fa) { return toArrayO(fa).reduce(f, b); }; };
}
/**
 * @since 2.0.0
 */
function foldMap$6(O, M) {
    var toArrayO = toArray$2(O);
    return function (f) { return function (fa) { return toArrayO(fa).reduce(function (b, a) { return M.concat(b, f(a)); }, M.empty); }; };
}
/**
 * Create a set with one element
 *
 * @since 2.0.0
 */
function singleton$2(a) {
    return new Set([a]);
}
/**
 * Insert a value into a set
 *
 * @since 2.0.0
 */
function insert(E) {
    var elemE = elem$5(E);
    return function (a) { return function (set) {
        if (!elemE(a, set)) {
            var r = new Set(set);
            r.add(a);
            return r;
        }
        else {
            return set;
        }
    }; };
}
/**
 * Delete a value from a set
 *
 * @since 2.0.0
 */
function remove(E) {
    return function (a) { return function (set) { return filter$5(function (ax) { return !E.equals(a, ax); })(set); }; };
}
/**
 * Create a set from an array
 *
 * @since 2.0.0
 */
function fromArray$1(E) {
    return function (as) {
        var len = as.length;
        var r = new Set();
        var has = elem$5(E);
        for (var i = 0; i < len; i++) {
            var a = as[i];
            if (!has(a, r)) {
                r.add(a);
            }
        }
        return r;
    };
}
/**
 * @since 2.0.0
 */
function compact$4(E) {
    return filterMap$4(E)(identity);
}
/**
 * @since 2.0.0
 */
function separate$4(EE, EA) {
    return function (fa) {
        var elemEE = elem$5(EE);
        var elemEA = elem$5(EA);
        var left = new Set();
        var right = new Set();
        fa.forEach(function (e) {
            switch (e._tag) {
                case 'Left':
                    if (!elemEE(e.left, left)) {
                        left.add(e.left);
                    }
                    break;
                case 'Right':
                    if (!elemEA(e.right, right)) {
                        right.add(e.right);
                    }
                    break;
            }
        });
        return { left: left, right: right };
    };
}
/**
 * @since 2.0.0
 */
function filterMap$4(E) {
    var elemE = elem$5(E);
    return function (f) { return function (fa) {
        var r = new Set();
        fa.forEach(function (a) {
            var ob = f(a);
            if (ob._tag === 'Some' && !elemE(ob.value, r)) {
                r.add(ob.value);
            }
        });
        return r;
    }; };
}

var _Set = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getShow: getShow$8,
    empty: empty$3,
    toArray: toArray$2,
    getEq: getEq$8,
    some: some$2,
    map: map$f,
    every: every$1,
    chain: chain$c,
    subset: subset,
    filter: filter$5,
    partition: partition$4,
    elem: elem$5,
    union: union$1,
    intersection: intersection$1,
    partitionMap: partitionMap$4,
    difference: difference$1,
    getUnionMonoid: getUnionMonoid,
    getIntersectionSemigroup: getIntersectionSemigroup,
    reduce: reduce$6,
    foldMap: foldMap$6,
    singleton: singleton$2,
    insert: insert,
    remove: remove,
    fromArray: fromArray$1,
    compact: compact$4,
    separate: separate$4,
    filterMap: filterMap$4
});

function getStateM(M) {
    return {
        map: function (fa, f) { return function (s) { return M.map(fa(s), function (_a) {
            var a = _a[0], s1 = _a[1];
            return [f(a), s1];
        }); }; },
        of: function (a) { return function (s) { return M.of([a, s]); }; },
        ap: function (fab, fa) { return function (s) { return M.chain(fab(s), function (_a) {
            var f = _a[0], s = _a[1];
            return M.map(fa(s), function (_a) {
                var a = _a[0], s = _a[1];
                return [f(a), s];
            });
        }); }; },
        chain: function (fa, f) { return function (s) { return M.chain(fa(s), function (_a) {
            var a = _a[0], s1 = _a[1];
            return f(a)(s1);
        }); }; },
        get: function () { return function (s) { return M.of([s, s]); }; },
        put: function (s) { return function () { return M.of([undefined, s]); }; },
        modify: function (f) { return function (s) { return M.of([undefined, f(s)]); }; },
        gets: function (f) { return function (s) { return M.of([f(s), s]); }; },
        fromState: function (sa) { return function (s) { return M.of(sa(s)); }; },
        fromM: function (ma) { return function (s) { return M.map(ma, function (a) { return [a, s]; }); }; },
        evalState: function (ma, s) { return M.map(ma(s), function (_a) {
            var a = _a[0];
            return a;
        }); },
        execState: function (ma, s) { return M.map(ma(s), function (_a) {
            var _ = _a[0], s = _a[1];
            return s;
        }); }
    };
}

var StateT = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getStateM: getStateM
});

var T$5 = getStateM(identity$3);
/**
 * @since 2.0.0
 */
var URI$h = 'State';
/**
 * Run a computation in the `State` monad, discarding the final state
 *
 * @since 2.0.0
 */
var evalState = T$5.evalState;
/**
 * Run a computation in the `State` monad discarding the result
 *
 * @since 2.0.0
 */
var execState = T$5.execState;
/**
 * Get the current state
 *
 * @since 2.0.0
 */
var get = T$5.get;
/**
 * Set the state
 *
 * @since 2.0.0
 */
var put = T$5.put;
/**
 * Modify the state by applying a function to the current state
 *
 * @since 2.0.0
 */
var modify = T$5.modify;
/**
 * Get a value which depends on the current state
 *
 * @since 2.0.0
 */
var gets = T$5.gets;
/**
 * @since 2.0.0
 */
var of$5 = T$5.of;
/**
 * @since 2.0.0
 */
var state = {
    URI: URI$h,
    map: T$5.map,
    of: of$5,
    ap: T$5.ap,
    chain: T$5.chain
};
var _a$f = pipeable(state), ap$c = _a$f.ap, apFirst$c = _a$f.apFirst, apSecond$c = _a$f.apSecond, chain$d = _a$f.chain, chainFirst$c = _a$f.chainFirst, flatten$c = _a$f.flatten, map$g = _a$f.map;

var State = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$h,
    evalState: evalState,
    execState: execState,
    get: get,
    put: put,
    modify: modify,
    gets: gets,
    of: of$5,
    state: state,
    ap: ap$c,
    apFirst: apFirst$c,
    apSecond: apSecond$c,
    chain: chain$d,
    chainFirst: chainFirst$c,
    flatten: flatten$c,
    map: map$g
});

var __assign$k = (undefined && undefined.__assign) || function () {
    __assign$k = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$k.apply(this, arguments);
};
var T$6 = getStateM(readerTaskEither);
/**
 * @since 2.0.0
 */
var URI$i = 'StateReaderTaskEither';
/**
 * @since 2.0.0
 */
function run$1(ma, s, r) {
    return ma(s)(r)();
}
/**
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 2.0.0
 */
var evalState$1 = T$6.evalState;
/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 2.0.0
 */
var execState$1 = T$6.execState;
/**
 * @since 2.0.0
 */
function left$5(e) {
    return fromReaderTaskEither(left$4(e));
}
/**
 * @since 2.0.0
 */
var right$5 = T$6.of;
/**
 * @since 2.0.0
 */
function rightTask$2(ma) {
    return fromReaderTaskEither(rightTask$1(ma));
}
/**
 * @since 2.0.0
 */
function leftTask$2(me) {
    return fromReaderTaskEither(leftTask$1(me));
}
/**
 * @since 2.0.0
 */
function fromTaskEither$1(ma) {
    return fromReaderTaskEither(fromTaskEither(ma));
}
/**
 * @since 2.0.0
 */
function rightReader$2(ma) {
    return fromReaderTaskEither(rightReader$1(ma));
}
/**
 * @since 2.0.0
 */
function leftReader$2(me) {
    return fromReaderTaskEither(leftReader$1(me));
}
/**
 * @since 2.0.0
 */
function fromIOEither$2(ma) {
    return fromReaderTaskEither(fromIOEither$1(ma));
}
/**
 * @since 2.0.0
 */
function fromReaderEither$1(ma) {
    return fromReaderTaskEither(fromReaderEither(ma));
}
/**
 * @since 2.0.0
 */
function rightIO$3(ma) {
    return fromReaderTaskEither(rightIO$2(ma));
}
/**
 * @since 2.0.0
 */
function leftIO$3(me) {
    return fromReaderTaskEither(leftIO$2(me));
}
/**
 * @since 2.0.0
 */
var rightState = T$6.fromState;
/**
 * @since 2.0.0
 */
function leftState(me) {
    return function (s) { return left$4(me(s)[0]); };
}
/**
 * @since 2.0.0
 */
var fromReaderTaskEither = T$6.fromM;
/**
 * Get the current state
 *
 * @since 2.0.0
 */
var get$1 = T$6.get;
/**
 * Set the state
 *
 * @since 2.0.0
 */
var put$1 = T$6.put;
/**
 * Modify the state by applying a function to the current state
 *
 * @since 2.0.0
 */
var modify$1 = T$6.modify;
/**
 * Get a value which depends on the current state
 *
 * @since 2.0.0
 */
var gets$1 = T$6.gets;
/**
 * @since 2.0.0
 */
var stateReaderTaskEither = {
    URI: URI$i,
    map: T$6.map,
    of: right$5,
    ap: T$6.ap,
    chain: T$6.chain,
    throwError: left$5
};
/**
 * Like `stateReaderTaskEither` but `ap` is sequential
 * @since 2.0.0
 */
var stateReaderTaskEitherSeq = __assign$k(__assign$k({}, stateReaderTaskEither), { ap: function (mab, ma) { return stateReaderTaskEither.chain(mab, function (f) { return stateReaderTaskEither.map(ma, f); }); } });
var _a$g = pipeable(stateReaderTaskEither), ap$d = _a$g.ap, apFirst$d = _a$g.apFirst, apSecond$d = _a$g.apSecond, chain$e = _a$g.chain, chainFirst$d = _a$g.chainFirst, flatten$d = _a$g.flatten, map$h = _a$g.map, fromEither$5 = _a$g.fromEither, fromOption$5 = _a$g.fromOption;

var StateReaderTaskEither = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$i,
    run: run$1,
    evalState: evalState$1,
    execState: execState$1,
    left: left$5,
    right: right$5,
    rightTask: rightTask$2,
    leftTask: leftTask$2,
    fromTaskEither: fromTaskEither$1,
    rightReader: rightReader$2,
    leftReader: leftReader$2,
    fromIOEither: fromIOEither$2,
    fromReaderEither: fromReaderEither$1,
    rightIO: rightIO$3,
    leftIO: leftIO$3,
    rightState: rightState,
    leftState: leftState,
    fromReaderTaskEither: fromReaderTaskEither,
    get: get$1,
    put: put$1,
    modify: modify$1,
    gets: gets$1,
    stateReaderTaskEither: stateReaderTaskEither,
    stateReaderTaskEitherSeq: stateReaderTaskEitherSeq,
    ap: ap$d,
    apFirst: apFirst$d,
    apSecond: apSecond$d,
    chain: chain$e,
    chainFirst: chainFirst$d,
    flatten: flatten$d,
    map: map$h,
    fromEither: fromEither$5,
    fromOption: fromOption$5
});

/**
 * @since 2.0.0
 */
var URI$j = 'Store';
/**
 * Reposition the focus at the specified position
 *
 * @since 2.0.0
 */
function seek(s) {
    return function (wa) { return ({ peek: wa.peek, pos: s }); };
}
/**
 * Reposition the focus at the specified position, which depends on the current position
 *
 * @since 2.0.0
 */
function seeks(f) {
    return function (wa) { return ({ peek: wa.peek, pos: f(wa.pos) }); };
}
/**
 * Extract a value from a position which depends on the current position
 *
 * @since 2.0.0
 */
function peeks(f) {
    return function (wa) { return wa.peek(f(wa.pos)); };
}
function experiment(F) {
    return function (f) { return function (wa) { return F.map(f(wa.pos), function (s) { return wa.peek(s); }); }; };
}
/**
 * @since 2.0.0
 */
var store = {
    URI: URI$j,
    map: function (wa, f) { return ({
        peek: function (s) { return f(wa.peek(s)); },
        pos: wa.pos
    }); },
    extract: function (wa) { return wa.peek(wa.pos); },
    extend: function (wa, f) { return ({
        peek: function (s) { return f({ peek: wa.peek, pos: s }); },
        pos: wa.pos
    }); }
};
var _a$h = pipeable(store), duplicate$5 = _a$h.duplicate, extend$5 = _a$h.extend, map$i = _a$h.map;

var Store = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$j,
    seek: seek,
    seeks: seeks,
    peeks: peeks,
    experiment: experiment,
    store: store,
    duplicate: duplicate$5,
    extend: extend$5,
    map: map$i
});

function splitStrong(F) {
    return function (pab, pcd) {
        return F.compose(F.first(pab), F.second(pcd));
    };
}
function fanout(F) {
    var splitStrongF = splitStrong(F);
    return function (pab, pac) {
        var split = F.promap(F.id(), identity, function (a) { return [a, a]; });
        return F.compose(splitStrongF(pab, pac), split);
    };
}

var Strong = /*#__PURE__*/Object.freeze({
    __proto__: null,
    splitStrong: splitStrong,
    fanout: fanout
});

/**
 * @since 2.0.0
 */
var URI$k = 'These';
/**
 * @since 2.0.0
 */
function left$6(left) {
    return { _tag: 'Left', left: left };
}
/**
 * @since 2.0.0
 */
function right$6(right) {
    return { _tag: 'Right', right: right };
}
/**
 * @since 2.0.0
 */
function both(left, right) {
    return { _tag: 'Both', left: left, right: right };
}
/**
 * @since 2.0.0
 */
function fold$8(onLeft, onRight, onBoth) {
    return function (fa) {
        switch (fa._tag) {
            case 'Left':
                return onLeft(fa.left);
            case 'Right':
                return onRight(fa.right);
            case 'Both':
                return onBoth(fa.left, fa.right);
        }
    };
}
/**
 * @since 2.0.0
 */
function getShow$9(SE, SA) {
    return {
        show: fold$8(function (l) { return "left(" + SE.show(l) + ")"; }, function (a) { return "right(" + SA.show(a) + ")"; }, function (l, a) { return "both(" + SE.show(l) + ", " + SA.show(a) + ")"; })
    };
}
/**
 * @since 2.0.0
 */
function getEq$9(EE, EA) {
    return fromEquals(function (x, y) {
        return isLeft$1(x)
            ? isLeft$1(y) && EE.equals(x.left, y.left)
            : isRight$1(x)
                ? isRight$1(y) && EA.equals(x.right, y.right)
                : isBoth(y) && EE.equals(x.left, y.left) && EA.equals(x.right, y.right);
    });
}
/**
 * @since 2.0.0
 */
function getSemigroup$a(SL, SA) {
    return {
        concat: function (x, y) {
            return isLeft$1(x)
                ? isLeft$1(y)
                    ? left$6(SL.concat(x.left, y.left))
                    : isRight$1(y)
                        ? both(x.left, y.right)
                        : both(SL.concat(x.left, y.left), y.right)
                : isRight$1(x)
                    ? isLeft$1(y)
                        ? both(y.left, x.right)
                        : isRight$1(y)
                            ? right$6(SA.concat(x.right, y.right))
                            : both(y.left, SA.concat(x.right, y.right))
                    : isLeft$1(y)
                        ? both(SL.concat(x.left, y.left), x.right)
                        : isRight$1(y)
                            ? both(x.left, SA.concat(x.right, y.right))
                            : both(SL.concat(x.left, y.left), SA.concat(x.right, y.right));
        }
    };
}
/**
 * @since 2.0.0
 */
function getMonad(S) {
    var chain = function (ma, f) {
        if (isLeft$1(ma)) {
            return ma;
        }
        if (isRight$1(ma)) {
            return f(ma.right);
        }
        var fb = f(ma.right);
        return isLeft$1(fb)
            ? left$6(S.concat(ma.left, fb.left))
            : isRight$1(fb)
                ? both(ma.left, fb.right)
                : both(S.concat(ma.left, fb.left), fb.right);
    };
    return {
        URI: URI$k,
        _E: undefined,
        map: these.map,
        of: right$6,
        ap: function (mab, ma) { return chain(mab, function (f) { return these.map(ma, f); }); },
        chain: chain
    };
}
/**
 *
 * @example
 * import { toTuple, left, right, both } from 'fp-ts/lib/These'
 *
 * assert.deepStrictEqual(toTuple('a', 1)(left('b')), ['b', 1])
 * assert.deepStrictEqual(toTuple('a', 1)(right(2)), ['a', 2])
 * assert.deepStrictEqual(toTuple('a', 1)(both('b', 2)), ['b', 2])
 *
 * @since 2.0.0
 */
function toTuple(e, a) {
    return function (fa) { return (isLeft$1(fa) ? [fa.left, a] : isRight$1(fa) ? [e, fa.right] : [fa.left, fa.right]); };
}
/**
 * Returns an `L` value if possible
 *
 * @example
 * import { getLeft, left, right, both } from 'fp-ts/lib/These'
 * import { none, some } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(getLeft(left('a')), some('a'))
 * assert.deepStrictEqual(getLeft(right(1)), none)
 * assert.deepStrictEqual(getLeft(both('a', 1)), some('a'))
 *
 * @since 2.0.0
 */
function getLeft$1(fa) {
    return isLeft$1(fa) ? some(fa.left) : isRight$1(fa) ? none : some(fa.left);
}
/**
 * Returns an `A` value if possible
 *
 * @example
 * import { getRight, left, right, both } from 'fp-ts/lib/These'
 * import { none, some } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(getRight(left('a')), none)
 * assert.deepStrictEqual(getRight(right(1)), some(1))
 * assert.deepStrictEqual(getRight(both('a', 1)), some(1))
 *
 * @since 2.0.0
 */
function getRight$1(fa) {
    return isLeft$1(fa) ? none : isRight$1(fa) ? some(fa.right) : some(fa.right);
}
/**
 * Returns `true` if the these is an instance of `Left`, `false` otherwise
 *
 * @since 2.0.0
 */
function isLeft$1(fa) {
    return fa._tag === 'Left';
}
/**
 * Returns `true` if the these is an instance of `Right`, `false` otherwise
 *
 * @since 2.0.0
 */
function isRight$1(fa) {
    return fa._tag === 'Right';
}
/**
 * Returns `true` if the these is an instance of `Both`, `false` otherwise
 *
 * @since 2.0.0
 */
function isBoth(fa) {
    return fa._tag === 'Both';
}
/**
 * @example
 * import { leftOrBoth, left, both } from 'fp-ts/lib/These'
 * import { none, some } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(leftOrBoth('a')(none), left('a'))
 * assert.deepStrictEqual(leftOrBoth('a')(some(1)), both('a', 1))
 *
 * @since 2.0.0
 */
function leftOrBoth(defaultLeft) {
    return function (ma) { return (isNone(ma) ? left$6(defaultLeft) : both(defaultLeft, ma.value)); };
}
/**
 * @example
 * import { rightOrBoth, right, both } from 'fp-ts/lib/These'
 * import { none, some } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(rightOrBoth(1)(none), right(1))
 * assert.deepStrictEqual(rightOrBoth(1)(some('a')), both('a', 1))
 *
 * @since 2.0.0
 */
function rightOrBoth(defaultRight) {
    return function (me) { return (isNone(me) ? right$6(defaultRight) : both(me.value, defaultRight)); };
}
/**
 * Returns the `L` value if and only if the value is constructed with `Left`
 *
 * @example
 * import { getLeftOnly, left, right, both } from 'fp-ts/lib/These'
 * import { none, some } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(getLeftOnly(left('a')), some('a'))
 * assert.deepStrictEqual(getLeftOnly(right(1)), none)
 * assert.deepStrictEqual(getLeftOnly(both('a', 1)), none)
 *
 * @since 2.0.0
 */
function getLeftOnly(fa) {
    return isLeft$1(fa) ? some(fa.left) : none;
}
/**
 * Returns the `A` value if and only if the value is constructed with `Right`
 *
 * @example
 * import { getRightOnly, left, right, both } from 'fp-ts/lib/These'
 * import { none, some } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(getRightOnly(left('a')), none)
 * assert.deepStrictEqual(getRightOnly(right(1)), some(1))
 * assert.deepStrictEqual(getRightOnly(both('a', 1)), none)
 *
 *
 * @since 2.0.0
 */
function getRightOnly(fa) {
    return isRight$1(fa) ? some(fa.right) : none;
}
/**
 * Takes a pair of `Option`s and attempts to create a `These` from them
 *
 * @example
 * import { fromOptions, left, right, both } from 'fp-ts/lib/These'
 * import { none, some } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(fromOptions(none, none), none)
 * assert.deepStrictEqual(fromOptions(some('a'), none), some(left('a')))
 * assert.deepStrictEqual(fromOptions(none, some(1)), some(right(1)))
 * assert.deepStrictEqual(fromOptions(some('a'), some(1)), some(both('a', 1)))
 *
 * @since 2.0.0
 */
function fromOptions(fe, fa) {
    return isNone(fe)
        ? isNone(fa)
            ? none
            : some(right$6(fa.value))
        : isNone(fa)
            ? some(left$6(fe.value))
            : some(both(fe.value, fa.value));
}
var identity$5 = function (a) { return a; };
/**
 * @since 2.0.0
 */
var these = {
    URI: URI$k,
    map: function (fa, f) { return (isLeft$1(fa) ? fa : isRight$1(fa) ? right$6(f(fa.right)) : both(fa.left, f(fa.right))); },
    bimap: function (fea, f, g) {
        return isLeft$1(fea) ? left$6(f(fea.left)) : isRight$1(fea) ? right$6(g(fea.right)) : both(f(fea.left), g(fea.right));
    },
    mapLeft: function (fea, f) { return these.bimap(fea, f, identity$5); },
    reduce: function (fa, b, f) { return (isLeft$1(fa) ? b : isRight$1(fa) ? f(b, fa.right) : f(b, fa.right)); },
    foldMap: function (M) { return function (fa, f) { return (isLeft$1(fa) ? M.empty : isRight$1(fa) ? f(fa.right) : f(fa.right)); }; },
    reduceRight: function (fa, b, f) { return (isLeft$1(fa) ? b : isRight$1(fa) ? f(fa.right, b) : f(fa.right, b)); },
    traverse: function (F) { return function (ta, f) {
        return isLeft$1(ta) ? F.of(ta) : isRight$1(ta) ? F.map(f(ta.right), right$6) : F.map(f(ta.right), function (b) { return both(ta.left, b); });
    }; },
    sequence: function (F) { return function (ta) {
        return isLeft$1(ta) ? F.of(ta) : isRight$1(ta) ? F.map(ta.right, right$6) : F.map(ta.right, function (b) { return both(ta.left, b); });
    }; }
};
var _a$i = pipeable(these), bimap$5 = _a$i.bimap, foldMap$7 = _a$i.foldMap, map$j = _a$i.map, mapLeft$5 = _a$i.mapLeft, reduce$7 = _a$i.reduce, reduceRight$6 = _a$i.reduceRight;

var These = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$k,
    left: left$6,
    right: right$6,
    both: both,
    fold: fold$8,
    getShow: getShow$9,
    getEq: getEq$9,
    getSemigroup: getSemigroup$a,
    getMonad: getMonad,
    toTuple: toTuple,
    getLeft: getLeft$1,
    getRight: getRight$1,
    isLeft: isLeft$1,
    isRight: isRight$1,
    isBoth: isBoth,
    leftOrBoth: leftOrBoth,
    rightOrBoth: rightOrBoth,
    getLeftOnly: getLeftOnly,
    getRightOnly: getRightOnly,
    fromOptions: fromOptions,
    these: these,
    bimap: bimap$5,
    foldMap: foldMap$7,
    map: map$j,
    mapLeft: mapLeft$5,
    reduce: reduce$7,
    reduceRight: reduceRight$6
});

/**
 * @since 2.0.0
 */
var URI$l = 'Traced';
/**
 * Extracts a value at a relative position which depends on the current value.
 *
 * @since 2.0.0
 */
function tracks(M, f) {
    return function (wa) { return wa(f(wa(M.empty))); };
}
/**
 * Get the current position
 *
 * @since 2.0.0
 */
function listen(wa) {
    return function (e) { return [wa(e), e]; };
}
/**
 * Get a value which depends on the current position
 *
 * @since 2.0.0
 */
function listens(f) {
    return function (wa) { return function (e) { return [wa(e), f(e)]; }; };
}
/**
 * Apply a function to the current position
 *
 * @since 2.0.0
 */
function censor(f) {
    return function (wa) { return function (e) { return wa(f(e)); }; };
}
/**
 * @since 2.0.0
 */
function getComonad(monoid) {
    function extend(wa, f) {
        return function (p1) { return f(function (p2) { return wa(monoid.concat(p1, p2)); }); };
    }
    function extract(wa) {
        return wa(monoid.empty);
    }
    return {
        URI: URI$l,
        _E: undefined,
        map: traced.map,
        extend: extend,
        extract: extract
    };
}
/**
 * @since 2.0.0
 */
var traced = {
    URI: URI$l,
    map: function (wa, f) { return function (p) { return f(wa(p)); }; }
};
var map$k = pipeable(traced).map;

var Traced = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$l,
    tracks: tracks,
    listen: listen,
    listens: listens,
    censor: censor,
    getComonad: getComonad,
    traced: traced,
    map: map$k
});

var __assign$l = (undefined && undefined.__assign) || function () {
    __assign$l = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$l.apply(this, arguments);
};
function getTraversableComposition(F, G) {
    return __assign$l(__assign$l(__assign$l({}, getFunctorComposition(F, G)), getFoldableComposition(F, G)), { traverse: function (H) {
            var traverseF = F.traverse(H);
            var traverseG = G.traverse(H);
            return function (fga, f) { return traverseF(fga, function (ga) { return traverseG(ga, f); }); };
        }, sequence: function (H) {
            var sequenceF = F.sequence(H);
            var sequenceG = G.sequence(H);
            return function (fgha) { return sequenceF(F.map(fgha, sequenceG)); };
        } });
}

var Traversable = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getTraversableComposition: getTraversableComposition
});



var TraversableWithIndex = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * @since 2.0.0
 */
var URI$m = 'Tree';
/**
 * @since 2.0.0
 */
function make$1(value, forest) {
    if (forest === void 0) { forest = empty; }
    return {
        value: value,
        forest: forest
    };
}
/**
 * @since 2.0.0
 */
function getShow$a(S) {
    var show = function (t) {
        return t.forest === empty || t.forest.length === 0
            ? "make(" + S.show(t.value) + ")"
            : "make(" + S.show(t.value) + ", [" + t.forest.map(show).join(', ') + "])";
    };
    return {
        show: show
    };
}
/**
 * @since 2.0.0
 */
function getEq$a(E) {
    var SA;
    var R = fromEquals(function (x, y) { return E.equals(x.value, y.value) && SA.equals(x.forest, y.forest); });
    SA = getEq$1(R);
    return R;
}
var draw = function (indentation, forest) {
    var r = '';
    var len = forest.length;
    var tree;
    for (var i = 0; i < len; i++) {
        tree = forest[i];
        var isLast = i === len - 1;
        r += indentation + (isLast ? '└' : '├') + '─ ' + tree.value;
        r += draw(indentation + (len > 1 && !isLast ? '│  ' : '   '), tree.forest);
    }
    return r;
};
/**
 * Neat 2-dimensional drawing of a forest
 *
 * @since 2.0.0
 */
function drawForest(forest) {
    return draw('\n', forest);
}
/**
 * Neat 2-dimensional drawing of a tree
 *
 * @example
 * import { make, drawTree, tree } from 'fp-ts/lib/Tree'
 *
 * const fa = make('a', [
 *   tree.of('b'),
 *   tree.of('c'),
 *   make('d', [tree.of('e'), tree.of('f')])
 * ])
 *
 * assert.strictEqual(drawTree(fa), `a
 * ├─ b
 * ├─ c
 * └─ d
 *    ├─ e
 *    └─ f`)
 *
 *
 * @since 2.0.0
 */
function drawTree(tree) {
    return tree.value + drawForest(tree.forest);
}
/**
 * Build a tree from a seed value
 *
 * @since 2.0.0
 */
function unfoldTree(b, f) {
    var _a = f(b), a = _a[0], bs = _a[1];
    return { value: a, forest: unfoldForest(bs, f) };
}
/**
 * Build a tree from a seed value
 *
 * @since 2.0.0
 */
function unfoldForest(bs, f) {
    return bs.map(function (b) { return unfoldTree(b, f); });
}
function unfoldTreeM(M) {
    var unfoldForestMM = unfoldForestM(M);
    return function (b, f) { return M.chain(f(b), function (_a) {
        var a = _a[0], bs = _a[1];
        return M.chain(unfoldForestMM(bs, f), function (ts) { return M.of({ value: a, forest: ts }); });
    }); };
}
function unfoldForestM(M) {
    var traverseM = array.traverse(M);
    return function (bs, f) { return traverseM(bs, function (b) { return unfoldTreeM(M)(b, f); }); };
}
/**
 * @since 2.0.0
 */
function elem$6(E) {
    var go = function (a, fa) {
        if (E.equals(a, fa.value)) {
            return true;
        }
        return fa.forest.some(function (tree) { return go(a, tree); });
    };
    return go;
}
/**
 * @since 2.0.0
 */
var tree = {
    URI: URI$m,
    map: function (fa, f) { return ({
        value: f(fa.value),
        forest: fa.forest.map(function (t) { return tree.map(t, f); })
    }); },
    of: function (a) { return ({
        value: a,
        forest: empty
    }); },
    ap: function (fab, fa) { return tree.chain(fab, function (f) { return tree.map(fa, f); }); },
    chain: function (fa, f) {
        var _a = f(fa.value), value = _a.value, forest = _a.forest;
        var concat = getMonoid$1().concat;
        return {
            value: value,
            forest: concat(forest, fa.forest.map(function (t) { return tree.chain(t, f); }))
        };
    },
    reduce: function (fa, b, f) {
        var r = f(b, fa.value);
        var len = fa.forest.length;
        for (var i = 0; i < len; i++) {
            r = tree.reduce(fa.forest[i], r, f);
        }
        return r;
    },
    foldMap: function (M) { return function (fa, f) { return tree.reduce(fa, M.empty, function (acc, a) { return M.concat(acc, f(a)); }); }; },
    reduceRight: function (fa, b, f) {
        var r = b;
        var len = fa.forest.length;
        for (var i = len - 1; i >= 0; i--) {
            r = tree.reduceRight(fa.forest[i], r, f);
        }
        return f(fa.value, r);
    },
    traverse: function (F) {
        var traverseF = array.traverse(F);
        var r = function (ta, f) {
            return F.ap(F.map(f(ta.value), function (value) { return function (forest) { return ({
                value: value,
                forest: forest
            }); }; }), traverseF(ta.forest, function (t) { return r(t, f); }));
        };
        return r;
    },
    sequence: function (F) {
        var traverseF = tree.traverse(F);
        return function (ta) { return traverseF(ta, identity); };
    },
    extract: function (wa) { return wa.value; },
    extend: function (wa, f) { return ({
        value: f(wa),
        forest: wa.forest.map(function (t) { return tree.extend(t, f); })
    }); }
};
var _a$j = pipeable(tree), ap$e = _a$j.ap, apFirst$e = _a$j.apFirst, apSecond$e = _a$j.apSecond, chain$f = _a$j.chain, chainFirst$e = _a$j.chainFirst, duplicate$6 = _a$j.duplicate, extend$6 = _a$j.extend, flatten$e = _a$j.flatten, foldMap$8 = _a$j.foldMap, map$l = _a$j.map, reduce$8 = _a$j.reduce, reduceRight$7 = _a$j.reduceRight;

var Tree = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$m,
    make: make$1,
    getShow: getShow$a,
    getEq: getEq$a,
    drawForest: drawForest,
    drawTree: drawTree,
    unfoldTree: unfoldTree,
    unfoldForest: unfoldForest,
    unfoldTreeM: unfoldTreeM,
    unfoldForestM: unfoldForestM,
    elem: elem$6,
    tree: tree,
    ap: ap$e,
    apFirst: apFirst$e,
    apSecond: apSecond$e,
    chain: chain$f,
    chainFirst: chainFirst$e,
    duplicate: duplicate$6,
    extend: extend$6,
    flatten: flatten$e,
    foldMap: foldMap$8,
    map: map$l,
    reduce: reduce$8,
    reduceRight: reduceRight$7
});

var __assign$m = (undefined && undefined.__assign) || function () {
    __assign$m = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$m.apply(this, arguments);
};
/**
 * @since 2.0.0
 */
var URI$n = 'Tuple';
/**
 * @since 2.0.0
 */
function fst(sa) {
    return sa[0];
}
/**
 * @since 2.0.0
 */
function snd(sa) {
    return sa[1];
}
/**
 * @since 2.0.0
 */
function swap$5(sa) {
    return [snd(sa), fst(sa)];
}
/**
 * @since 2.0.0
 */
function getApply$1(S) {
    return {
        URI: URI$n,
        _E: undefined,
        map: tuple$1.map,
        ap: function (fab, fa) { return [fst(fab)(fst(fa)), S.concat(snd(fab), snd(fa))]; }
    };
}
var of$6 = function (M) { return function (a) {
    return [a, M.empty];
}; };
/**
 * @since 2.0.0
 */
function getApplicative$1(M) {
    return __assign$m(__assign$m({}, getApply$1(M)), { of: of$6(M) });
}
/**
 * @since 2.0.0
 */
function getChain(S) {
    return __assign$m(__assign$m({}, getApply$1(S)), { chain: function (fa, f) {
            var _a = f(fst(fa)), b = _a[0], s = _a[1];
            return [b, S.concat(snd(fa), s)];
        } });
}
/**
 * @since 2.0.0
 */
function getMonad$1(M) {
    return __assign$m(__assign$m({}, getChain(M)), { of: of$6(M) });
}
/**
 * @since 2.0.0
 */
function getChainRec(M) {
    var chainRec = function (a, f) {
        var result = f(a);
        var acc = M.empty;
        var s = fst(result);
        while (s._tag === 'Left') {
            acc = M.concat(acc, snd(result));
            result = f(s.left);
            s = fst(result);
        }
        return [s.right, M.concat(acc, snd(result))];
    };
    return __assign$m(__assign$m({}, getChain(M)), { chainRec: chainRec });
}
/**
 * @since 2.0.0
 */
var tuple$1 = {
    URI: URI$n,
    compose: function (ba, ae) { return [fst(ba), snd(ae)]; },
    map: function (ae, f) { return [f(fst(ae)), snd(ae)]; },
    bimap: function (fea, f, g) { return [g(fst(fea)), f(snd(fea))]; },
    mapLeft: function (fea, f) { return [fst(fea), f(snd(fea))]; },
    extract: fst,
    extend: function (ae, f) { return [f(ae), snd(ae)]; },
    reduce: function (ae, b, f) { return f(b, fst(ae)); },
    foldMap: function (_) { return function (ae, f) { return f(fst(ae)); }; },
    reduceRight: function (ae, b, f) { return f(fst(ae), b); },
    traverse: function (F) { return function (as, f) {
        return F.map(f(fst(as)), function (b) { return [b, snd(as)]; });
    }; },
    sequence: function (F) { return function (fas) {
        return F.map(fst(fas), function (a) { return [a, snd(fas)]; });
    }; }
};
var _a$k = pipeable(tuple$1), bimap$6 = _a$k.bimap, compose$1 = _a$k.compose, duplicate$7 = _a$k.duplicate, extend$7 = _a$k.extend, foldMap$9 = _a$k.foldMap, map$m = _a$k.map, mapLeft$6 = _a$k.mapLeft, reduce$9 = _a$k.reduce, reduceRight$8 = _a$k.reduceRight;

var Tuple = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$n,
    fst: fst,
    snd: snd,
    swap: swap$5,
    getApply: getApply$1,
    getApplicative: getApplicative$1,
    getChain: getChain,
    getMonad: getMonad$1,
    getChainRec: getChainRec,
    tuple: tuple$1,
    bimap: bimap$6,
    compose: compose$1,
    duplicate: duplicate$7,
    extend: extend$7,
    foldMap: foldMap$9,
    map: map$m,
    mapLeft: mapLeft$6,
    reduce: reduce$9,
    reduceRight: reduceRight$8
});



var Unfoldable = /*#__PURE__*/Object.freeze({
    __proto__: null
});



var Witherable = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * @since 2.0.0
 */
var URI$o = 'Writer';
/**
 * @since 2.0.0
 */
function evalWriter(fa) {
    return fa()[0];
}
/**
 * @since 2.0.0
 */
function execWriter(fa) {
    return fa()[1];
}
/**
 * Appends a value to the accumulator
 *
 * @since 2.0.0
 */
function tell(w) {
    return function () { return [undefined, w]; };
}
/**
 * Modifies the result to include the changes to the accumulator
 *
 * @since 2.0.0
 */
function listen$1(fa) {
    return function () {
        var _a = fa(), a = _a[0], w = _a[1];
        return [[a, w], w];
    };
}
/**
 * Applies the returned function to the accumulator
 *
 * @since 2.0.0
 */
function pass(fa) {
    return function () {
        var _a = fa(), _b = _a[0], a = _b[0], f = _b[1], w = _a[1];
        return [a, f(w)];
    };
}
/**
 * Projects a value from modifications made to the accumulator during an action
 *
 * @since 2.0.0
 */
function listens$1(f) {
    return function (fa) { return function () {
        var _a = fa(), a = _a[0], w = _a[1];
        return [[a, f(w)], w];
    }; };
}
/**
 * Modify the final accumulator value by applying a function
 *
 * @since 2.0.0
 */
function censor$1(f) {
    return function (fa) { return function () {
        var _a = fa(), a = _a[0], w = _a[1];
        return [a, f(w)];
    }; };
}
/**
 * @since 2.0.0
 */
function getMonad$2(M) {
    return {
        URI: URI$o,
        _E: undefined,
        map: writer.map,
        of: function (a) { return function () { return [a, M.empty]; }; },
        ap: function (mab, ma) { return function () {
            var _a = mab(), f = _a[0], w1 = _a[1];
            var _b = ma(), a = _b[0], w2 = _b[1];
            return [f(a), M.concat(w1, w2)];
        }; },
        chain: function (ma, f) { return function () {
            var _a = ma(), a = _a[0], w1 = _a[1];
            var _b = f(a)(), b = _b[0], w2 = _b[1];
            return [b, M.concat(w1, w2)];
        }; }
    };
}
/**
 * @since 2.0.0
 */
var writer = {
    URI: URI$o,
    map: function (fa, f) { return function () {
        var _a = fa(), a = _a[0], w = _a[1];
        return [f(a), w];
    }; }
};
var map$n = pipeable(writer).map;

var Writer = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URI: URI$o,
    evalWriter: evalWriter,
    execWriter: execWriter,
    tell: tell,
    listen: listen$1,
    pass: pass,
    listens: listens$1,
    censor: censor$1,
    getMonad: getMonad$2,
    writer: writer,
    map: map$n
});

export { Alt as alt, Alternative as alternative, Applicative as applicative, Apply as apply, _Array as array, Bifunctor as bifunctor, BooleanAlgebra as booleanAlgebra, Bounded as bounded, BoundedDistributiveLattice as boundedDistributiveLattice, BoundedJoinSemilattice as boundedJoinSemilattice, BoundedLattice as boundedLattice, BoundedMeetSemilattice as boundedMeetSemilattice, Category as category, Chain as chain, ChainRec as chainRec, Choice as choice, Comonad as comonad, Compactable as compactable, Console as console, Const as const, Contravariant as contravariant, _Date as date, DistributiveLattice as distributiveLattice, Either as either, EitherT as eitherT, Eq as eq, Extend as extend, Field as field, Filterable as filterable, FilterableWithIndex as filterableWithIndex, Foldable as foldable, FoldableWithIndex as foldableWithIndex, _function as function, Functor as functor, FunctorWithIndex as functorWithIndex, Group as group, HeytingAlgebra as heytingAlgebra, HKT as hkt, Identity as identity, Invariant as invariant, IO as io, IOEither as ioEither, IORef$1 as ioRef, JoinSemilattice as joinSemilattice, Lattice as lattice, Magma as magma, _Map as map, MeetSemilattice as meetSemilattice, Monad as monad, MonadIO as monadIO, MonadTask as monadTask, MonadThrow as monadThrow, Monoid as monoid, NonEmptyArray as nonEmptyArray, Option as option, OptionT as optionT, Ord as ord, Ordering as ordering, pipeable$1 as pipeable, Profunctor as profunctor, Random as random, Reader as reader, ReaderEither as readerEither, ReaderT as readerT, ReaderTaskEither as readerTaskEither, Record as record, Ring as ring, Semigroup as semigroup, Semigroupoid as semigroupoid, Semiring as semiring, _Set as set, Show as show, State as state, StateReaderTaskEither as stateReaderTaskEither, StateT as stateT, Store as store, Strong as strong, Task as task, TaskEither as taskEither, These as these, Traced as traced, Traversable as traversable, TraversableWithIndex as traversableWithIndex, Tree as tree, Tuple as tuple, Unfoldable as unfoldable, ValidationT as validationT, Witherable as witherable, Writer as writer };
