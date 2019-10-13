import { asyncHooks } from '../iterable.js';

function hooks(hooks, children) {
    const hook = hooks ? asyncHooks(hooks) : undefined;
    const childrenHook = children ? asyncHooks(children) : undefined;
    return async function* hooked(instance) {
        if (!hook && !childrenHook) {
            return instance; // Nothing ever to be done
        }
        for await (const node of (hook ? hook(instance) : instance)) {
            if (!childrenHook || !node.children) {
                yield node;
            }
            else {
                yield {
                    ...node,
                    children: childrenHook(node.children)
                };
            }
        }
    };
}

export { hooks };
