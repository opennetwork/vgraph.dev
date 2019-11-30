import { h } from "../../h";
import { Example } from "./example";

const TIMEOUT_SECONDS = 2;
const TIMEOUT_MILLISECONDS = TIMEOUT_SECONDS * 1000;

export const ExampleContents = (
  <fragment>
    <h2>Examples</h2>
    <p>
      Below are examples authored in TypeScript which show different ways you can express virtual nodes<br />
      For these examples we're utilising <a href="https://github.com/opennetwork/vdom">vdom</a> to project the graph state into the DOM<br/>
      You can view each of these examples source on <a href="https://github.com/opennetwork/vgraph.dev/tree/master/src/contents/examples">GitHub</a>
    </p>
    <p>
      All examples below will be displayed for {TIMEOUT_SECONDS} seconds after the final render has completed<br />
      Some examples, for example the context example, won't complete unless all utilised sources have completed
    </p>
    <h3>Single Render</h3>
    <p>
      The next example shows a single rendering component<br />
      This means that the component only updates the visual state once, and can be considered static to VGraph
    </p>
    <Example source="single-render" wait={TIMEOUT_MILLISECONDS} />
    <h3>Static Nodes</h3>
    <p>
      The next example shows static nodes<br />
      We don't need an instance of a function or class to render these, they are re-evaluated each time they are referenced<br />
      A static node can be used the same way as any other node
    </p>
    <Example source="static-node" wait={TIMEOUT_MILLISECONDS} />
    <h3>Async Single Render</h3>
    <p>
      The next example shows an async single rendering component<br />
      This means that the component only updates the visual state once, but it is not updated until the component returns its visual state using a promise
    </p>
    <Example source="async-single-render" wait={TIMEOUT_MILLISECONDS} />
    <h3>Async Generator</h3>
    <p>
      The next example shows an async generator component<br />
      Each value that is yielded will be rendered within the visual state<br />
      This can be used to provide a loading component while an async task is being used for example
    </p>
    <Example source="interval" wait={TIMEOUT_MILLISECONDS} />
    <h3>Interactive Button</h3>
    <p>
      The next example shows one way to implement interactive components<br />
      After the button is rendered the component waits for the "onClicked" promise to resolve before it updates the visual state again
    </p>
    <Example source="interactive-button" wait={TIMEOUT_MILLISECONDS} />
    <h3>Reference Flag</h3>
    <p>
      The next example shows a flag being found within the virtual graph
    </p>
    <Example source="flag" wait={TIMEOUT_MILLISECONDS} />
    <h3>Context</h3>
    <p>
      The next example shows a context value being defined that can be utilised within any async context.
    </p>
    <Example source="user-preference" wait={TIMEOUT_MILLISECONDS} />
    <h3>Cube</h3>
    <p>
      The next example shows a set of cubes with updating state
    </p>
    <Example source="cube" wait={TIMEOUT_MILLISECONDS} />
  </fragment>
);
