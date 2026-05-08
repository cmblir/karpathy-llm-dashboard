// BacklinksPanel: lists the files that link to the active file. The list is
// derived from the cached adjacency map so toggling the active file does not
// require a re-scan.

import type { JSX } from "react";
import { useVaultStore } from "../stores/vaultStore";

export default function BacklinksPanel(): JSX.Element | null {
  const activeFile = useVaultStore((s) => s.activeFile);
  const adjacency = useVaultStore((s) => s.adjacency);
  const openFile = useVaultStore((s) => s.openFile);

  if (!activeFile) return null;

  const inbound = adjacency?.backward[activeFile.path] ?? [];

  return (
    <aside className="memex-backlinks" aria-label="Backlinks">
      <header className="memex-backlinks__header">
        Backlinks ({inbound.length})
      </header>
      {inbound.length === 0 ? (
        <p className="memex-backlinks__empty">No files link here yet.</p>
      ) : (
        <ul className="memex-backlinks__list">
          {dedupe(inbound).map((path) => (
            <li key={path}>
              <button
                type="button"
                className="memex-backlinks__link"
                onClick={() => void openFile(path)}
              >
                {fileName(path)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function dedupe(items: string[]): string[] {
  return Array.from(new Set(items));
}

function fileName(path: string): string {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] || path;
}
