import { h } from "../../h";
import { BROWSER } from "../../environment";

export async function *IntervalExample() {

  let count = 0;
  while (true) {
    yield <p onBeforeRender={console.log} data-value={count}>Interval {count}</p>;
    if (!BROWSER) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    count += 1;
  }

}
