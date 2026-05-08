// GraphFilters: tag chips + folder dropdown shown above the graph view.
// Selecting a filter updates the UI store; GraphView reads the filters and
// rebuilds its element set when they change.

import type { JSX } from "react";
import { useMemo } from "react";
import { useUIStore } from "../stores/uiStore";
import { useVaultStore } from "../stores/vaultStore";

export default function GraphFilters(): JSX.Element {
  const adjacency = useVaultStore((s) => s.adjacency);
  const currentVault = useVaultStore((s) => s.currentVault);
  const tagFilter = useUIStore((s) => s.graphTagFilter);
  const folderFilter = useUIStore((s) => s.graphFolderFilter);
  const setTagFilter = useUIStore((s) => s.setGraphTagFilter);
  const setFolderFilter = useUIStore((s) => s.setGraphFolderFilter);

  const tags = useMemo(() => collectTags(adjacency?.tags ?? {}), [adjacency]);
  const folders = useMemo(
    () => collectFolders(currentVault?.path ?? "", adjacency),
    [currentVault?.path, adjacency],
  );

  return (
    <div className="memex-graph-filters">
      <div className="memex-graph-filters__chips" role="group" aria-label="Tags">
        <button
          type="button"
          className={`memex-chip${tagFilter === null ? " memex-chip--active" : ""}`}
          onClick={() => setTagFilter(null)}
        >
          All tags
        </button>
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            className={`memex-chip${tagFilter === t ? " memex-chip--active" : ""}`}
            onClick={() => setTagFilter(tagFilter === t ? null : t)}
          >
            #{t}
          </button>
        ))}
      </div>
      <label className="memex-graph-filters__folder">
        Folder
        <select
          value={folderFilter ?? ""}
          onChange={(e) => setFolderFilter(e.target.value || null)}
        >
          <option value="">All folders</option>
          {folders.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function collectTags(tagMap: Record<string, string[]>): string[] {
  const all = new Set<string>();
  for (const tags of Object.values(tagMap)) {
    for (const t of tags) all.add(t);
  }
  return Array.from(all).sort();
}

function collectFolders(
  vaultRoot: string,
  adjacency: { forward: Record<string, string[]>; tags: Record<string, string[]> } | null,
): string[] {
  if (!adjacency || !vaultRoot) return [];
  const paths = new Set<string>();
  for (const p of Object.keys(adjacency.forward)) paths.add(p);
  for (const targets of Object.values(adjacency.forward)) {
    for (const p of targets) paths.add(p);
  }
  for (const p of Object.keys(adjacency.tags)) paths.add(p);

  const folders = new Set<string>();
  const root = trimTrailingSep(vaultRoot);
  for (const p of paths) {
    if (!p.startsWith(root)) continue;
    const rel = p.slice(root.length).replace(/^[\\/]+/, "");
    const idx = rel.indexOf("/");
    if (idx > 0) folders.add(rel.slice(0, idx));
  }
  return Array.from(folders).sort();
}

function trimTrailingSep(p: string): string {
  return p.replace(/[\\/]+$/, "");
}
