import type { JSX } from "react";
import Sidebar from "./components/Sidebar";

export default function App(): JSX.Element {
  return (
    <div className="memex-layout">
      <Sidebar />
      <main className="memex-main">
        <header className="memex-main__header">
          <h1>Memex</h1>
          <p className="memex-main__tagline">
            Desktop wiki for plain markdown vaults.
          </p>
        </header>
        <section className="memex-main__placeholder">
          <p>Open a vault to begin editing.</p>
        </section>
      </main>
    </div>
  );
}
