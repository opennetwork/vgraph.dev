import dom from "./jsdom";
import { SiteHead, SiteBody } from "./dist/site.js";
import { marshal } from "@opennetwork/vnode";
import { produce } from "@opennetwork/vdom/dist/produce";
import { writeFile } from "fs";
import { promisify } from "util";

async function generate() {
  const marshalled = [await marshal(SiteHead()), await marshal(SiteBody())];
  await promisify(writeFile)("./dist/index.json", JSON.stringify(marshalled, null, "  "));

  const produced = [
    await marshal(produce(SiteHead())),
    await marshal(produce(SiteBody()))
  ];
  await promisify(writeFile)("./dist/index.html.json", JSON.stringify(produced, null, "  "));
}

generate()
  .then(() => console.log("Generation complete"))
  .catch(error => console.error(error));

