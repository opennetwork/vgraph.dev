import { h } from "../../h";
import { BROWSER } from "../../environment";
import { source, asyncExtendedIterable, asyncHooks } from "iterable";

export type SourceType = "jsx" | "tsx" | "js";

const typePreference = source<SourceType>();
typePreference.hold();

const typePreferenceTriggered = new WeakMap();

const typePreferenceTrigger = asyncHooks({
  next: async (iterator: AsyncIterator<SourceType>): Promise<IteratorResult<SourceType>> => {
    if (typePreferenceTriggered.has(iterator)) {
      return iterator.next();
    }
    typePreferenceTriggered.set(iterator, true);
    return {
      done: false,
      value: "jsx"
    };
  }
});

export type DisplayExampleOptions = {
  source: string;
};

export async function *DisplayExample({ source: name }: DisplayExampleOptions) {
  yield <p>Loading example</p>;
  if (!BROWSER) {
    return;
  }
  const type = source(typePreference);
  type.hold();
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
      typePreference.push(type);
    });
  }

  async function *Code() {
    yield *asyncExtendedIterable(typePreferenceTrigger(type))
        .map(
          async (type) => {
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
        );
  }
}
