import { h } from "../../re-render";
import { UserType } from "./user-preference";

const Header = (
  <header style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
    <h1>Header</h1>
    <UserType take={1} />
  </header>
);

const Body = (
  <main>
    Body
  </main>
);

const Footer = (
  <footer>
    Footer
  </footer>
);

export default function () {
  return (
    <fragment>
      <Header />
      <Body />
      <Footer />
    </fragment>
  );
}
