import { h } from "../re-render";
import { ExampleContents } from "./examples";
import { ModulesContents } from "./modules";

export const SiteContents = (
  <main>
    <h1>VGraph</h1>
    <p>
      VGraph is a collection of tooling to generate and observe virtual graphs using JavaScript.
    </p>
    <hr />
    <ModulesContents />
    <hr />
    <ExampleContents />
  </main>
);
