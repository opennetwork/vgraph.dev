import { h } from "../../h";

export async function *IntervalExample() {
  for (let count = 0; count <= 10; count += 1) {
    yield <p>Interval {count}</p>;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
