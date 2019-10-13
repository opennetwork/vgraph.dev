import { h } from "./h";
import { VNode } from "@opennetwork/vnode";
import { SiteContents } from "./contents";

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
      <script src="./index.js" onBeforeRender={console.log} />
    </fragment>
  );
}
