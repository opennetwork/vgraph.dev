import { createVNodeWithContext, Source, VNode, VNodeRepresentationSource, Fragment } from "@opennetwork/vnode";
import { isExperimental, isGetDocumentNode, isOnBeforeRender, EXPERIMENT_onBeforeRender, EXPERIMENT_getDocumentNode, EXPERIMENT_attributes } from "@opennetwork/vdom";


export function h<O extends object>(source: Source<O>, options?: O, ...children: VNodeRepresentationSource[]): VNode {
  if (source === "fragment") {
    return h(Fragment, options, ...children);
  }

  if (typeof source === "string" && !isExperimental(options)) {
    // Please if you have a solution to do this without any, please let me know
    const resultingOptions: any = {
      [EXPERIMENT_attributes]: {},
    };
    const toJSON = () => ({
      attributes: resultingOptions[EXPERIMENT_attributes]
    });
    Object.defineProperty(resultingOptions, "toJSON", {
      value: toJSON,
      enumerable: false
    });

    let remainingOptions: object = options;

    if (isGetDocumentNode(remainingOptions)) {
      const { getDocumentNode, ...nextRemainingOptions } = remainingOptions;
      remainingOptions = nextRemainingOptions;
      resultingOptions[EXPERIMENT_getDocumentNode] = getDocumentNode;
    }

    if (isOnBeforeRender(remainingOptions)) {
      const { onBeforeRender, ...nextRemainingOptions } = remainingOptions;
      remainingOptions = nextRemainingOptions;
      resultingOptions[EXPERIMENT_onBeforeRender] = onBeforeRender;
    }

    resultingOptions[EXPERIMENT_attributes] = remainingOptions;

    return h(source, resultingOptions, ...children);
  }
  return createVNodeWithContext({}, source, options || {}, ...children);
}
