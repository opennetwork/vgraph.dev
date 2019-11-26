import { h } from "../../h";
import { createContext } from "../../context";

export interface User {
  type: "Authenticated" | "Anonymous";
}

export const [user, updateUser] = createContext<User>({ type: "Anonymous" });

export default function UserPreference() {

  return (
    <fragment>
      <p>
        Current User Type: <UserType />
      </p>
      <button onBeforeRender={onBeforeRenderUpdateUserType.bind(undefined, "Authenticated")}>
        Set type as Authenticated
      </button>
      <button onBeforeRender={onBeforeRenderUpdateUserType.bind(undefined, "Anonymous")}>
        Set type as Anonymous
      </button>
    </fragment>
  );

  function onBeforeRenderUpdateUserType(type: User["type"], element: HTMLElement) {
    element.addEventListener("click", () => {
      updateUser({ type });
    });
  }

}

export async function *UserType({ take = Number.POSITIVE_INFINITY }: { take?: number }) {
  console.log({ take });
  yield* user().take(take).map(
    user => <p>{user.type}</p>
  );
}

interface Window {
  updateUser(value: User): void;
}
