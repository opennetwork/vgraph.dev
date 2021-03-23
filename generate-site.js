import dom from "./jsdom.js";
import { SiteHead, SiteBody } from "./dist/site.js";
import { render } from "@opennetwork/vdom";
import { writeFile } from "fs";
import { promisify } from "util";

async function generate() {
  await Promise.all([
    render(SiteHead, dom.window.document.head),
    render(SiteBody, dom.window.document.body)
  ]);
  const html = dom.serialize();
  await promisify(writeFile)("./dist/index.html", html);
}

generate()
  .then(() => console.log("Generation complete"))
  .catch(error => console.error(error));

export function clean(node) {
  if (!node.childNodes) {
    return;
  }
  const remove = [];
  for (let index = 0; index < node.childNodes.length; index += 1) {
    const child = node.childNodes[index];
    if (child.nodeType !== child.TEXT_NODE && child.nodeType !== child.ELEMENT_NODE) {
      remove.push(child);
    }
    clean(child);
  }
  remove.forEach(child => node.removeChild(child));
}
