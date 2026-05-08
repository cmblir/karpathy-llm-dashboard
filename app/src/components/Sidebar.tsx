// Sidebar renders the vault file tree. It is purely presentational: it reads
// fileTree from the vault store and folder expansion state from the UI store.

import type { JSX } from "react";
import { useVaultStore } from "../stores/vaultStore";
import { useUIStore } from "../stores/uiStore";
import { ipc } from "../lib/ipc";
import type { FileNode } from "../lib/ipc";

export interface SidebarProps {
  onSelect?: (path: string) => void;
}

export default function Sidebar({ onSelect }: SidebarProps): JSX.Element {
  const fileTree = useVaultStore((s) => s.fileTree);
  const currentVault = useVaultStore((s) => s.currentVault);
  const openVault = useVaultStore((s) => s.openVault);

  async function handleOpen() {
    const path = await ipc.pickDirectory();
    if (path) await openVault(path);
  }

  return (
    <aside className="memex-sidebar" aria-label="Vault file tree">
      <header className="memex-sidebar__header">
        <span className="memex-sidebar__title">
          {currentVault?.name ?? "No vault"}
        </span>
        <button
          type="button"
          className="memex-sidebar__open"
          onClick={() => void handleOpen()}
        >
          Open…
        </button>
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
  return <DirectoryRow node={node} depth={depth} onSelect={onSelect} />;
}

function DirectoryRow({
  node,
  depth,
  onSelect,
}: {
  node: Extract<FileNode, { kind: "directory" }>;
  depth: number;
  onSelect?: (path: string) => void;
}): JSX.Element {
  const expanded = useUIStore((s) => s.expandedFolders[node.path] ?? true);
  const toggle = useUIStore((s) => s.toggleFolder);

  return (
    <li
      role="treeitem"
      aria-expanded={expanded}
      className="memex-sidebar__group"
    >
      <button
        type="button"
        className="memex-sidebar__dir"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => toggle(node.path)}
      >
        <span className="memex-sidebar__chevron" aria-hidden="true">
          {expanded ? "▾" : "▸"}
        </span>
        {node.name}
      </button>
      {expanded ? (
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
      ) : null}
    </li>
  );
}
