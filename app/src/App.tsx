import type { JSX } from "react";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Splitter from "./components/Splitter";
import { useVaultStore } from "./stores/vaultStore";
import { useUIStore } from "./stores/uiStore";

export default function App(): JSX.Element {
  const activeFile = useVaultStore((s) => s.activeFile);
  const openFile = useVaultStore((s) => s.openFile);
  const error = useVaultStore((s) => s.error);
  const sidebarWidth = useUIStore((s) => s.sidebarWidth);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--memex-sidebar-width",
      `${sidebarWidth}px`,
    );
  }, [sidebarWidth]);

  return (
    <div className="memex-layout">
      <Sidebar onSelect={(p) => void openFile(p)} />
      <Splitter />
      <main className="memex-main">
        <header className="memex-main__header">
          <h1>{activeFile ? fileName(activeFile.path) : "Memex"}</h1>
          {!activeFile ? (
            <p className="memex-main__tagline">
              Desktop wiki for plain markdown vaults.
            </p>
          ) : null}
        </header>
        {error ? <p className="memex-main__error">{error}</p> : null}
        <section className="memex-main__placeholder">
          {activeFile ? (
            <pre className="memex-main__raw">{activeFile.content}</pre>
          ) : (
            <p>Open a vault to begin editing.</p>
          )}
        </section>
      </main>
    </div>
  );
}

function fileName(path: string): string {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] || path;
}
