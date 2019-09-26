import { Site } from "./site";
import { render } from "@opennetwork/vdom";

const start = Date.now();
render(Site(), window.document.body)
  .then(() => console.log(`Render complete after ${(Date.now() - start) / 1000} seconds`))
  .catch(error => console.error(error));
