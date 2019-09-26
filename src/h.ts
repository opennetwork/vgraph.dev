import { createVNodeWithContext, Source, VNode, VNodeRepresentationSource, Fragment } from "@opennetwork/vnode";

export function h<O extends object>(source: Source<O>, options?: O, ...children: VNodeRepresentationSource[]): VNode {
  if (source === "fragment") {
    return h(Fragment, options, ...children);
  }
  return createVNodeWithContext({}, source, options || {}, ...children);
}
