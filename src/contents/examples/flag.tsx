import { defer } from "../defer";
import { h } from "../../h";
import { on } from "@opennetwork/vnode-fragment";
import { VNode } from "@opennetwork/vnode";

export async function *Flag() {
  const flag = Symbol("Our flag");
  let found = false;

  yield h(
    on(isVNodeWithOurFlag, setFound),
    {},
    <Run />
  );

  yield <fragment>Did we find our value: {flag ? "Yes" : "No"}</fragment>;

  async function *Run() {
    const { resolve: click, promise: onClicked } = defer();
    yield (
      <button
        type="button"
        onBeforeRender={element => element.addEventListener("click", click, { once: true })}
      >
        Click me!
      </button>
    );
    await onClicked;

    yield flag;
  }

  function isVNodeWithOurFlag(node: VNode): node is VNode & { source: typeof flag } {
    return node.source === flag;
  }

  function setFound() {
    found = true;
  }
}
