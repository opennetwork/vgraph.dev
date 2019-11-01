import { SiteBody, SiteHead } from "./site";
import { litRender } from "@opennetwork/vdom";
import { hookFragments } from "@opennetwork/vnode-fragment";

const start = Date.now();

(async function run() {
  await Promise.all([
    litRender(SiteHead(), window.document.head),
    litRender(await hookFragments()(SiteBody()), window.document.body)
  ]);
})()
  .then(() => console.log(`Render complete after ${(Date.now() - start) / 1000} seconds`))
  .catch(error => console.error(error));
