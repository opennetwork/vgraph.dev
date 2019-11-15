import { h } from "../../h";
import { RunExample, RunExampleOptions } from "./run-example";
import { DisplayExample, DisplayExampleOptions } from "./display-example";

export type ExampleOptions = {
  source: string;
  wait?: number;
};

export async function *Example({ source, wait }: ExampleOptions) {
  yield (
    <fragment>
      <DisplayExample source={source} />
      <RunExample runnable={`./${source}.js`} wait={wait} />
    </fragment>
  );
}
