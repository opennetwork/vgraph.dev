import { h } from "../../h";
import { BROWSER } from "../../environment";
import { createContext } from "../../context";
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

const [type, updateType] = createContext<SourceType>("tsx", "display-examples-as", isSourceType);

export type DisplayExampleOptions = {
  source: string;
};

export function DisplayExample({ source: name }: DisplayExampleOptions) {
  return (
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
    if (!BROWSER) {
      return;
    }
    element.addEventListener("click", () => {
      updateType(type);
    });
  }

  async function *Tab({ type: displayType }: { type: SourceType }) {
    yield* type().map(
      currentType => (
        <div
          tabindex="0"
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
                  onBeforeRender={element => onBeforeRenderTypePreference(displayType, element)}
                >
                  {SourceTypesDisplayTitles[displayType]}
                </button>
              )
            )
          }
        </fragment>
      )
    );
  }

  async function Code({ type }: { type: SourceType }) {
    if (!BROWSER) {
      return undefined;
    }
    const response = await fetch(`/contents/examples/${name}.${type}`);
    const text = await response.text();
    return (
      <pre>
        <code>
          {text.replace(/(^\/\/.+$)/gm, "").trim()}
        </code>
      </pre>
    );
  }
}
