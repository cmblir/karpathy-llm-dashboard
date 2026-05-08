// Sidebar renders the vault file tree. It is purely presentational: it reads
// fileTree from the store and emits onSelect for leaf clicks; the container is
// responsible for opening the file.

import type { JSX } from "react";
import { useVaultStore } from "../stores/vaultStore";
import type { FileNode } from "../lib/ipc";

export interface SidebarProps {
  onSelect?: (path: string) => void;
}

export default function Sidebar({ onSelect }: SidebarProps): JSX.Element {
  const fileTree = useVaultStore((s) => s.fileTree);
  const currentVault = useVaultStore((s) => s.currentVault);

  return (
    <aside className="memex-sidebar" aria-label="Vault file tree">
      <header className="memex-sidebar__header">
        <span className="memex-sidebar__title">
          {currentVault?.name ?? "No vault"}
        </span>
      </header>
      {fileTree.length === 0 ? (
        <p className="memex-sidebar__empty">Open a vault to see files.</p>
      ) : (
        <ul className="memex-sidebar__tree" role="tree">
          {fileTree.map((node) => (
            <NodeRow key={node.path} node={node} depth={0} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </aside>
  );
}

function NodeRow({
  node,
  depth,
  onSelect,
}: {
  node: FileNode;
  depth: number;
  onSelect?: (path: string) => void;
}): JSX.Element {
  if (node.kind === "file") {
    return (
      <li role="treeitem" className="memex-sidebar__leaf">
        <button
          type="button"
          className="memex-sidebar__file"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => onSelect?.(node.path)}
        >
          {node.name}
        </button>
      </li>
    );
  }
  return (
    <li role="treeitem" className="memex-sidebar__group">
      <span
        className="memex-sidebar__dir"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {node.name}
      </span>
      <ul role="group">
        {node.children.map((child) => (
          <NodeRow
            key={child.path}
            node={child}
            depth={depth + 1}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </li>
  );
}
