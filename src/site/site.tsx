import { h } from "./h";
import { VNode } from "@opennetwork/vnode";

export function Site(): VNode {
  return (
    <fragment>
      <html lang="en">
        <head>
          <title>VGraph</title>
        </head>
        <body>
          <h1>Test</h1>
          <p>This is an example</p>
          <script type="module" src="/index.js"></script>
        </body>
      </html>
    </fragment>
  );
}
