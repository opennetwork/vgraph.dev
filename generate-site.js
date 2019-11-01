import dom from "./jsdom";
import { SiteHead, SiteBody } from "./dist/site.js";
import { litRender } from "@opennetwork/vdom";
import { writeFile } from "fs";
import { promisify } from "util";
import { hookFragments } from "@opennetwork/vnode-fragment";

async function generate() {
  await Promise.all([
    litRender(SiteHead(), dom.window.document.head),
    litRender(await hookFragments()(SiteBody()), dom.window.document.body)
  ]);

  clean(dom);
  const html = dom.serialize();
  console.log(html);
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
