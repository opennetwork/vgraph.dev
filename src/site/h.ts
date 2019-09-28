import { createVNodeWithContext, Source, VNode, VNodeRepresentationSource, Fragment } from "@opennetwork/vnode";
import { DOMNativeVNode, EXPERIMENT_onAttached, EXPERIMENT_getDocumentNode, EXPERIMENT_attributeMode, EXPERIMENT_attributes } from "@opennetwork/vdom";


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
    return h(source, {
      [EXPERIMENT_attributes]: options,
      [EXPERIMENT_attributeMode]: "exact"
    }, ...children);
  }
  return createVNodeWithContext({}, source, options || {}, ...children);
}
