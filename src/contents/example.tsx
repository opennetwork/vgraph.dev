import { h } from "../h";
import { BROWSER } from "../environment";

export type ExampleOptions = {
  src: string;
  key: string;
};

export async function *Example({ src, key }: ExampleOptions) {
  yield <p>Loading example</p>;
  if (!BROWSER) {
    return;
  }
  const [imported, response] = await Promise.all([
    import(src),
    fetch(src)
  ]);
  const text = await response.text();
  const Component = imported[key];
  yield (
    <fragment>
      <div class="example">
        <Component />
      </div>
      <pre>
        {text.replace(/\/\/# sourceMapping.+/, "").trim()}
      </pre>
    </fragment>
  );
}
