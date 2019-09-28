import { h } from "../../h";

export async function *IntervalExample() {
  if (typeof window === "undefined") {
    return;
  }

  let count = 0;
  while (true) {
    yield <p onAttached={console.log} data-value={count}>Interval {count}</p>;
    await new Promise(resolve => setTimeout(resolve, 1000));
    count += 1;
  }

}
