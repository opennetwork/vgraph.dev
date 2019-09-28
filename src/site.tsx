import { h } from "./h";
import { VNode } from "@opennetwork/vnode";
import { IntervalExample } from "./contents/examples/interval";

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
      <h1 onAttached={console.log}>Test</h1>
      <p onAttached={console.log}>This is an example</p>
      <IntervalExample />
      <script src="./index.js" onAttached={console.log} />
    </fragment>
  );
}
