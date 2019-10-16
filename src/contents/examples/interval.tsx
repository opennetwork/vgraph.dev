import { h } from "../../h";

export async function *IntervalExample() {
  yield <fragment>Waiting for interval</fragment>;
  for (let count = 0; count <= 5; count += 1) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield <fragment>Interval {count}</fragment>;
  }
}
