import { h } from "../../h";
import { BROWSER } from "../../environment";
import { defer } from "../defer";

export type RunExampleOptions = {
  runnable: string;
  key: string;
  wait?: number;
};

export function RunExample({ runnable, key, wait }: RunExampleOptions) {

  return (
    <div class="run-example">
      <Example />
    </div>
  );

  async function *Example() {
    const { resolve: start, promise: onStart } = defer();
    yield <button type="button" onBeforeRender={element => element.addEventListener("click", start, { once: true })}>Run example</button>;
    if (!BROWSER) {
      return;
    }
    await onStart;
    yield <p>Loading example</p>;
    const imported = await import(runnable);
    const Component = imported[key];
    yield <Run />;

    async function *Run() {
      yield <Component />;
      if (wait) {
        await new Promise(resolve => setTimeout(resolve, wait));
      }
      const { resolve: restart, promise: onRestart } = defer();
      yield (
        <fragment>
          <p>Example complete</p>
          <button type="button" onBeforeRender={(element: Element) => element.addEventListener("click", restart, { once: true })}>Restart</button>
        </fragment>
      );
      await onRestart;
      yield <Run />;
    }
  }

}
