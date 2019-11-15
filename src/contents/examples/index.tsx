import { h } from "../../h";
import { Example } from "./example";

export function ExampleContents() {
  return (
    <fragment>
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
      <Example source="single-render" wait={5000} />
      <h3>Async Single Render</h3>
      <p>
        The next example shows an async single rendering component<br />
        This means that the component only updates the visual state once, but it is not updated until the component returns its visual state using a promise
      </p>
      <Example source="async-single-render" wait={5000} />
      <h3>Async Generator</h3>
      <p>
        The next example shows an async generator component<br />
        Each value that is yielded will be rendered within the visual state<br />
        This can be used to provide a loading component while an async task is being used for example
      </p>
      <Example source="interval" wait={1000} />
      <h3>Interactive Button</h3>
      <p>
        The next example shows one way to implement interactive components<br />
        After the button is rendered the component waits for the "onClicked" promise to resolve before it updates the visual state again
      </p>
      <Example source="interactive-button" wait={5000} />
      <h3>Reference Flag</h3>
      <p>
        The next example shows a flag being found within the virtual graph
      </p>
      <Example source="flag" wait={5000} />
    </fragment>
  );
}
