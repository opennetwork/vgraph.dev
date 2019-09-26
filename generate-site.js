import { Site } from "./dist/site/index.js";
import JSDOM from "jsdom";
import { render } from "@opennetwork/vdom";
import { writeFile } from "fs";
import { promisify } from "util";

async function generate() {
  const dom = new JSDOM.JSDOM();
  await render(Site(), dom.window.document.body);
  const html = dom.window.document.body.innerHTML;
  await promisify(writeFile)("./dist/index.html", html);
}

generate()
  .then(() => console.log("Generation complete"))
  .catch(error => console.error(error));

