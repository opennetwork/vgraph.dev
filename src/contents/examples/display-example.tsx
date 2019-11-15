import { h } from "../../h";
import { BROWSER } from "../../environment";
import { createPreference } from "../../preference";
import { string } from "io-ts";

export const SourceTypes = ["jsx", "tsx", "js"];
export type SourceType = "jsx" | "tsx" | "js";
export function isSourceType(value: unknown): value is SourceType {
  return typeof value === "string" && (SourceTypes as string[]).includes(value);
}

const [type, updateType] = createPreference<SourceType>("tsx", "display-examples-as", isSourceType);

export type DisplayExampleOptions = {
  source: string;
};

export async function *DisplayExample({ source: name }: DisplayExampleOptions) {
  yield <p>Loading example</p>;
  if (!BROWSER) {
    return;
  }
  yield (
    <div class="code-example">
      <div class="code-actions">
        <button type="button" title="Display example in JSX" onBeforeRender={onBeforeRenderTypePreference.bind(undefined, "jsx")}>
          jsx
        </button>
        <button type="button" title="Display example in TypeScript with JSX" onBeforeRender={onBeforeRenderTypePreference.bind(undefined, "tsx")}>
          tsx
        </button>
        <button type="button" title="Display example in JavaScript" onBeforeRender={onBeforeRenderTypePreference.bind(undefined, "js")}>
          js
        </button>
      </div>
      <Code />
    </div>
  );

  function onBeforeRenderTypePreference(type: SourceType, element: HTMLElement) {
    element.addEventListener("click", () => {
      updateType(type);
    });
  }

  async function *Code() {
    yield *type().map(
      async (currentType) => {
        const response = await fetch(`/contents/examples/${name}.${currentType}`);
        const text = await response.text();
        return (
          <pre>
            <code>
              {text.trim()}
            </code>
          </pre>
        );
      }
    );
  }
}
