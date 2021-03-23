import { SiteBody, SiteHead } from "./site";
import { render } from "@opennetwork/vdom";

const start = Date.now();

(async function run() {
  await Promise.all([
    render(SiteHead, window.document.head),
    render(SiteBody, window.document.body)
  ]);
})()
  .then(() => console.log(`Render complete after ${(Date.now() - start) / 1000} seconds`))
  .catch(error => console.error(error));
