import { h } from "../h";
import { BROWSER } from "../environment";
import { defer } from "./defer";

export type RunExampleOptions = {
  runnable: string;
  key: string;
};

export async function *RunExample({ runnable, key }: RunExampleOptions) {
  const { resolve, promise } = defer();
  yield <button type="button" onBeforeRender={element => element.addEventListener("click", resolve)}>Run example</button>;
  if (!BROWSER) {
    return;
  }
  await promise;
  yield <p>Loading example</p>;
  const imported = await import(runnable);
  const Component = imported[key];
  yield <Component />;
}
