import { SiteHead, SiteBody } from "./dist/site/index.js";
import { marshal } from "@opennetwork/vnode";
import { produce } from "@opennetwork/vdom/dist/produce";
import { writeFile } from "fs";
import { promisify } from "util";
import { asyncExtendedIterable } from "iterable";

async function generate() {
  const marshalled = [await marshal(SiteHead()), await marshal(SiteBody())];
  await promisify(writeFile)("./dist/index.json", JSON.stringify(marshalled, null, "  "));

  const produced = [
    await asyncExtendedIterable(produce(SiteHead())).map(node => marshal(node)).toArray(),
    await asyncExtendedIterable(produce(SiteBody())).map(node => marshal(node)).toArray()
  ];
  await promisify(writeFile)("./dist/index.html.json", JSON.stringify(produced, null, "  "));
}

generate()
  .then(() => console.log("Generation complete"))
  .catch(error => console.error(error));

