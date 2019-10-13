import { SiteBody, SiteHead } from "./site";
import { litRender } from "@opennetwork/vdom";

const start = Date.now();
Promise.all([
  litRender(SiteHead(), window.document.head),
  litRender(SiteBody(), window.document.body)
])
  .then(() => console.log(`Render complete after ${(Date.now() - start) / 1000} seconds`))
  .catch(error => console.error(error));
