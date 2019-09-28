import { h } from "./h";
import { VNode } from "@opennetwork/vnode";

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
      <h1>Test</h1>
      <p>This is an example</p>
      {/*<script type="module" src="/index.js"></script>*/}
    </fragment>
  );
}
