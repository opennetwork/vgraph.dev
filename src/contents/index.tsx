import { h } from "../h";
import { IntervalExample } from "./examples/interval";

export function SiteContents() {
  return (
    <fragment>
      <h1 onBeforeRender={console.log}>Test</h1>
      <p onBeforeRender={console.log}>This is an example</p>
      <IntervalExample />
    </fragment>
  );
}
