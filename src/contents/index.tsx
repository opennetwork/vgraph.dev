import { h } from "../h";
import { Example } from "./example";

export function SiteContents() {
  return (
    <fragment>
      <h1 onBeforeRender={console.log}>Test</h1>
      <p onBeforeRender={console.log}>This is an example</p>
      <Example runnable="./examples/interval.js" source="/contents/examples/interval.tsx" key="IntervalExample" />
    </fragment>
  );
}
