import { h } from "./h";
import { VNode } from "@opennetwork/vnode";
import { SiteContents } from "./contents";
import { BROWSER, PRIMARY_SCRIPT_SOURCE } from "./environment";

export function SiteHead(): VNode {
  return (
    <fragment>
      <title>VGraph</title>
    </fragment>
  );
}

export function SiteBody(): VNode {
  return (
    <fragment>
      <SiteContents />
      {BROWSER ? undefined : <script src={PRIMARY_SCRIPT_SOURCE} onBeforeRender={console.log} />}
    </fragment>
  );
}
