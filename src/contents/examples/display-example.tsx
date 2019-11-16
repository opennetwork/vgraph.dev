import { h } from "../../h";
import { BROWSER } from "../../environment";
import { createPreference } from "../../preference";
import { string } from "io-ts";

export const SourceTypes: SourceType[] = ["jsx", "tsx", "js"];
export type SourceType = "jsx" | "tsx" | "js";
export const SourceTypesDisplayTitles: Record<SourceType, string> = {
  jsx: "Display example in JSX",
  tsx: "Display example in TypeScript with JSX",
  js: "Display example in JavaScript"
};

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
      <div class="code-actions" role="tablist">
        <TabListContents />
      </div>
      {
        SourceTypes.map(
          type => <Tab type={type} />
        )
      }
    </div>
  );

  function onBeforeRenderTypePreference(type: SourceType, element: Element) {
    element.addEventListener("click", () => {
      updateType(type);
    });
  }

  async function *Tab({ type: displayType }: { type: SourceType }) {
    yield* type().map(
      currentType => (
        <div
          tabindex={SourceTypes.indexOf(displayType)}
          role="tabpanel"
          id={`${name}-${displayType}-tab`}
          aria-labelledby={`${name}-${displayType}-tab-button`}
          hidden={currentType !== displayType}
        >
          {currentType === displayType ? <Code type={displayType} /> : undefined}
        </div>
      )
    );
  }

  async function *TabListContents() {
    yield* type().map(
      currentType => (
        <fragment>
          {
            SourceTypes.map(
              displayType => (
                <button
                  role="tab"
                  type="button"
                  aria-selected={currentType === displayType}
                  id={`${name}-${displayType}-tab-button`}
                  aria-controls={`${name}-${displayType}-tab`}
                  title={SourceTypesDisplayTitles[displayType]}
                  onBeforeRender={element => onBeforeRenderTypePreference(displayType, element)}
                >
                  {displayType}
                </button>
              )
            )
          }
        </fragment>
      )
    );
  }

  async function Code({ type }: { type: SourceType }) {
    const response = await fetch(`/contents/examples/${name}.${type}`);
    const text = await response.text();
    return (
      <pre>
        <code>
          {text.trim()}
        </code>
      </pre>
    );
  }
}
