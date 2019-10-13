import { h } from "../h";
import { BROWSER } from "../environment";

export type ExampleOptions = {
  runnable: string;
  key: string;
  source?: string;
};

export async function *Example({ runnable, source, key }: ExampleOptions) {
  yield <p>Loading example</p>;
  if (!BROWSER) {
    return;
  }
  const [imported, response] = await Promise.all([
    import(runnable),
    fetch(source || runnable)
  ]);
  const text = await response.text();
  const Component = imported[key];
  yield (
    <fragment>
      <div class="example">
        <Component />
      </div>
      <pre>
        {text.trim()}
      </pre>
    </fragment>
  );
}
