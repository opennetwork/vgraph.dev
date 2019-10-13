import { h } from "../h";
import { RunExample, RunExampleOptions } from "./run-example";
import { DisplayExample, DisplayExampleOptions } from "./display-example";

export type ExampleOptions = RunExampleOptions & DisplayExampleOptions;

export async function *Example({ runnable, source, key }: ExampleOptions) {
  yield (
    <fragment>
      <DisplayExample source={source} />
      <RunExample runnable={runnable} key={key} />
    </fragment>
  );
}
