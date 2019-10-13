import { h } from "../h";
import { BROWSER } from "../environment";

export type DisplayExampleOptions = {
  source: string;
};

export async function *DisplayExample({ source }: DisplayExampleOptions) {
  yield <p>Loading example</p>;
  if (!BROWSER) {
    return;
  }
  const response = await fetch(source );
  const text = await response.text();
  yield (
    <pre>
      <code>
        {text.trim()}
      </code>
    </pre>
  );
}
