import { h } from "../h";
import { Example } from "./example";

export function SiteContents() {
  return (
    <fragment>
      <h1>VGraph</h1>
      <p>
        VGraph is a collection of tooling to generate virtual graphs using JavaScript.
      </p>
      <h2>Examples</h2>
      <p>
        Below are examples written in TypeScript which show different ways you can express virtual nodes<br />
        For these examples we're utilising <a href="https://github.com/opennetwork/vdom">vdom</a> to project the graph state into the DOM<br/>
        You can view each of these examples source on <a href="https://github.com/opennetwork/vgraph.dev/tree/master/src/contents/examples">GitHub</a>
      </p>
      <h3>Single Render</h3>
      <p>
        The next example shows a single rendering component<br />
        This means that the component only updates the visual state once, and can be considered static to VGraph
      </p>
      <Example runnable="./examples/single-render.js" key="SingleRender" source="/contents/examples/single-render.tsx" wait={5000} />
      <hr />
      <p>
        The next example shows an async single rendering component<br />
        This means that the component only updates the visual state once, but it is not updated until the component returns its visual state using a promise
      </p>
      <Example runnable="./examples/async-single-render.js" key="AsyncSingleRender" source="/contents/examples/async-single-render.tsx" wait={5000} />
      <hr />
      <p>
        The next example shows an async generator component<br />
        Each value that is yielded will be rendered within the visual state<br />
        This can be used to provide a loading component while an async task is being used for example
      </p>
      <Example runnable="./examples/interval.js" source="/contents/examples/interval.tsx" key="IntervalExample" wait={1000} />
      <hr />
      <p>
        The next example shows one way to implement interactive components<br />
        After the button is rendered the component waits for the "onClicked" promise to resolve before it updates the visual state again
      </p>
      <Example runnable="./examples/interactive-button.js" source="/contents/examples/interactive-button.tsx" key="InteractiveButton" wait={5000} />
    </fragment>
  );
}
