import { h } from "../h";

export type ExampleOptions = {
  src: string;
};

export async function *Example(options: ExampleOptions) {
  yield <p>Loading example</p>;

  const imported = await import(options.src);

  console.log({ imported });

  yield <p>Loaded example</p>;

}
