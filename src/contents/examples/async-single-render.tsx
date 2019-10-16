import { h } from "../../h";

export async function AsyncSingleRender() {
  const response = await fetch("https://rickandmortyapi.com/api/", { mode: "cors" });
  const result = await response.json();
  return <p>Async result: {JSON.stringify(result, undefined, "  ")}</p>;
}
