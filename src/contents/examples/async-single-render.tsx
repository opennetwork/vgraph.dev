import { h } from "../../h";

export default async function AsyncSingleRender() {
  const result = await new Promise(resolve => setTimeout(() => resolve("I was fetched using a promise!"), 50));
  return <fragment>Async result: {result}</fragment>;
}
