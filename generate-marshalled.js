import { Site } from "./dist/site/index.js";
import { marshal } from "@opennetwork/vnode";
import { produce } from "@opennetwork/vdom/dist/produce";
import { writeFile } from "fs";
import { promisify } from "util";
import { asyncExtendedIterable } from "iterable";

async function generate() {
  const marshalled = await marshal(Site());
  await promisify(writeFile)("./dist/index.json", JSON.stringify(marshalled, null, "  "));

  const produced = await asyncExtendedIterable(produce(Site())).map(list => asyncExtendedIterable(list).map(node => marshal(node)).toArray()).toArray();
  await promisify(writeFile)("./dist/index.html.json", JSON.stringify(produced, null, "  "));
}

generate()
  .then(() => console.log("Generation complete"))
  .catch(error => console.error(error));

