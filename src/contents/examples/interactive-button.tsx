import { defer } from "../defer";
import { h } from "../../h";

export async function *InteractiveButton() {
  const { resolve: click, promise: onClicked } = defer();
  yield (
    <button
      type="button"
      onBeforeRender={element => element.addEventListener("click", click, { once: true })}
    >
      Click me!
    </button>
  );
  await onClicked;
  yield <fragment>Clicked!</fragment>;
}
