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

  async function *UserType() {
    yield* user().map(
      user => <p>{user.type}</p>
    );
  }
}

interface Window {
  updateUser(value: User): void;
}
