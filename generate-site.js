import { SiteHead, SiteBody } from "./dist/site/index.js";
import JSDOM from "jsdom";
import { render } from "@opennetwork/vdom";
import { writeFile } from "fs";
import { promisify } from "util";

async function generate() {
  const dom = new JSDOM.JSDOM();
  await Promise.all([
    render(SiteHead(), dom.window.document.head),
    render(SiteBody(), dom.window.document.body)
  ]);
  const html = dom.window.document.documentElement.outerHTML;
  await promisify(writeFile)("./dist/index.html", html);
}

generate()
  .then(() => console.log("Generation complete"))
  .catch(error => console.error(error));

