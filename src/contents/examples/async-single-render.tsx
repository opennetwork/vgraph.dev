import { h } from "../../h";

export async function AsyncSingleRender() {
  const result = await new Promise(resolve => setTimeout(() => resolve("I was fetched using a promise!"), 50));
  return <p>Async result: {result}</p>;
}
