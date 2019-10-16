import { h } from "../../h";

export async function *IntervalExample() {
  yield <p>Waiting for interval</p>;
  for (let count = 0; count <= 5; count += 1) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield <p>Interval {count}</p>;
  }
}
