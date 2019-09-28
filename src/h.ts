import { createVNodeWithContext, Source, VNode, VNodeRepresentationSource, Fragment } from "@opennetwork/vnode";
import { DOMNativeVNode, EXPERIMENT_onAttached, EXPERIMENT_getDocumentNode, EXPERIMENT_attributeMode, EXPERIMENT_attributes } from "@opennetwork/vdom";
import { DOMNativeVNodeOptions } from "@opennetwork/vdom/src";


function isAttributes(options: object): options is { attributes: Record<string, string> } {
    function isAttributesLike(options: object): options is { attributes?: unknown } {
        return !!options;
    }
    return (
        isAttributesLike(options) &&
        typeof options.attributes === "object"
    );
}

function isAttributesMode(options: object): options is { attributeMode: "set" | "remove" | "exact" } {
    function isAttributeModeLike(options: object): options is { attributeMode?: unknown } {
        return !!options;
    }
    return (
        isAttributeModeLike(options) &&
        (
            options.attributeMode === "set" ||
            options.attributeMode === "remove" ||
            options.attributeMode === "exact"
        )
    );
}

function isOnAttached(options: object): options is { onAttached: DOMNativeVNode["options"][typeof EXPERIMENT_onAttached] } {
    function isOnAttachedLike(options: object): options is { onAttached?: unknown } {
        return !!options;
    }
    return (
        isOnAttachedLike(options) &&
        typeof options.onAttached === "function"
    );
}

function isGetDocumentNode(options: object): options is { getDocumentNode: DOMNativeVNode["options"][typeof EXPERIMENT_getDocumentNode] } {
    function isGetDocumentNodeLike(options: object): options is { getDocumentNode?: unknown } {
        return !!options;
    }
    return (
        isGetDocumentNodeLike(options) &&
        typeof options.getDocumentNode === "function"
    );
}

function isExperimental(options: object): boolean {
    function isExperimentalLike(options: object): options is { [EXPERIMENT_attributes]?: unknown, [EXPERIMENT_attributeMode]?: unknown, [EXPERIMENT_onAttached]?: unknown, [EXPERIMENT_getDocumentNode]?: unknown } {
        return !!options;
    }
    return !!(
        isExperimentalLike(options) &&
        (
            options[EXPERIMENT_attributeMode] ||
            options[EXPERIMENT_attributes] ||
            options[EXPERIMENT_getDocumentNode] ||
            options[EXPERIMENT_onAttached]
        )
    );
}

export function h<O extends object>(source: Source<O>, options?: O, ...children: VNodeRepresentationSource[]): VNode {
  if (source === "fragment") {
    return h(Fragment, options, ...children);
  }
  if (typeof source === "string" && !isExperimental(options)) {
    // Please if you have a solution to do this without any, please let me know
    const resultingOptions: any = {
      [EXPERIMENT_attributeMode]: "exact",
      [EXPERIMENT_attributes]: {}
    };

    let remainingOptions: object = options;

    if (isAttributesMode(remainingOptions)) {
      const { attributeMode, ...nextRemainingOptions } = remainingOptions;
      remainingOptions = nextRemainingOptions;
      resultingOptions[EXPERIMENT_attributeMode] = attributeMode;
    }

    if (isGetDocumentNode(remainingOptions)) {
      const { getDocumentNode, ...nextRemainingOptions } = remainingOptions;
      remainingOptions = nextRemainingOptions;
      resultingOptions[EXPERIMENT_getDocumentNode] = getDocumentNode;
    }

    if (isOnAttached(remainingOptions)) {
      const { onAttached, ...nextRemainingOptions } = remainingOptions;
      remainingOptions = nextRemainingOptions;
      resultingOptions[EXPERIMENT_onAttached] = onAttached;
    }

    resultingOptions[EXPERIMENT_attributes] = remainingOptions;

    return h(source, resultingOptions, ...children);
  }
  return createVNodeWithContext({}, source, options || {}, ...children);
}
