import { isPromise, asyncExtendedIterable } from '../iterable.js';

function hook(fn) {
    return async function hookFn(node, parent) {
        let hooked = fn(node, parent);
        if (isPromise(hooked)) {
            hooked = await hooked;
        }
        if (!hooked) {
            return undefined;
        }
        if (!hooked.children) {
            return hooked;
        }
        return {
            ...hooked,
            children: asyncExtendedIterable(hooked.children).map(children => asyncExtendedIterable(children).map(child => hookFn(child, parent)))
        };
    };
}

export { hook };
