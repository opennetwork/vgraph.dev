import { Fragment, Source, VNode, VNodeRepresentationSource } from "@opennetwork/vnode";
import { h as hBase } from "./h";
import { asyncExtendedIterable } from "iterable";

export function h<O extends object>(source: Source<O>, options?: O, ...children: VNodeRepresentationSource[]): VNode {
  return {
    reference: Fragment,
    children: {
      [Symbol.asyncIterator]: () => {
        let made: boolean = false;
        return {
          async next(): Promise<IteratorResult<ReadonlyArray<VNode>>> {
            if (made) {
              return { done: true, value: undefined };
            }
            made = true;
            return {
              done: false,
              value: [
                // New one every time
                hBase(source, options, ...children)
              ]
            };
          }
        };
      }
    }
  };
}
