import { h } from "./h";
import { VNode } from "@opennetwork/vnode";
import { SiteContents } from "./contents";
import { PRIMARY_SCRIPT_SOURCE } from "./environment";

export function SiteHead(): VNode {
  return (
    <fragment>
      <title>VGraph</title>
      <link href="index.css" rel="stylesheet" type="text/css" />
    </fragment>
  );
}

export function SiteBody(): VNode {
 return (
   <fragment>
     <SiteContents />
     <script src={PRIMARY_SCRIPT_SOURCE} onBeforeRender={console.log} type="module" />
   </fragment>
 );
}
