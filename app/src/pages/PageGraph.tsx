// Graph page — renders the real link graph from vault adjacency using
// Cytoscape.js with the fcose layout. Tag chips (from frontmatter) act as
// filters; clicking a node opens the corresponding file.

import { useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
import cytoscape from "cytoscape";
import type { ElementDefinition, StylesheetCSS } from "cytoscape";
import fcose from "cytoscape-fcose";
import type { Strings } from "../lib/i18n";
import { useUIStore } from "../stores/uiStore";
import { useVaultStore } from "../stores/vaultStore";

let layoutRegistered = false;

function ensureLayoutRegistered(): void {
  if (!layoutRegistered) {
    cytoscape.use(fcose);
    layoutRegistered = true;
  }
}

export default function PageGraph({ t }: { t: Strings }): JSX.Element {
  const adjacency = useVaultStore((s) => s.adjacency);
  const currentVault = useVaultStore((s) => s.currentVault);
  const setRoute = useUIStore((s) => s.setRoute);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState<string | null>(null);

  const tags = useMemo(() => collectTags(adjacency?.tags ?? {}), [adjacency]);
  const folders = useMemo(
    () => collectFolders(currentVault?.path ?? "", adjacency),
    [adjacency, currentVault?.path],
  );

  useEffect(() => {
    if (!containerRef.current || !adjacency) return;
    ensureLayoutRegistered();
    const allowed = computeAllowed(adjacency, {
      tagFilter,
      folderFilter,
      vaultRoot: currentVault?.path ?? "",
    });
    const elements = buildElements(adjacency, allowed);
    if (elements.length === 0) {
      containerRef.current.innerHTML = "";
      return;
    }
    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: STYLE,
      layout: {
        name: "fcose",
        animate: false,
        fit: true,
        padding: 30,
        nodeSeparation: 80,
      } as unknown as cytoscape.LayoutOptions,
      wheelSensitivity: 0.2,
      minZoom: 0.1,
      maxZoom: 4,
    });
    cy.on("tap", "node", (event) => {
      const path = event.target.id();
      setRoute(`page:${path}`);
    });
    cy.ready(() => {
      cy.fit(undefined, 30);
    });
    return () => {
      cy.destroy();
    };
  }, [adjacency, tagFilter, folderFilter, currentVault?.path, setRoute]);

  const nodeCount = adjacency
    ? new Set(
        Object.entries(adjacency.forward).flatMap(([s, ts]) => [s, ...ts]),
      ).size
    : 0;
  const edgeCount = adjacency
    ? Object.values(adjacency.forward).reduce((s, a) => s + a.length, 0)
    : 0;

  return (
    <div className="workspace workspace-wide">
      <header className="page-head">
        <div className="page-eyebrow">{t.nav_graph}</div>
        <h1 className="page-title">{t.gr_title}</h1>
        <p className="page-lede">{t.gr_lede}</p>
      </header>
      <div
        className="card"
        style={{
          padding: 0,
          overflow: "hidden",
          background: "var(--bg-soft)",
        }}
      >
        <div
          className="row"
          style={{
            padding: "10px 14px",
            borderBottom: "1px solid var(--line)",
            background: "var(--bg)",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span className="chip">
            {nodeCount} {t.gr_node_count}
          </span>
          <span className="chip">
            {edgeCount} {t.gr_edge_count}
          </span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button
              type="button"
              className={`chip${tagFilter === null ? " chip-active" : ""}`}
              style={chipBtn(tagFilter === null)}
              onClick={() => setTagFilter(null)}
            >
              all tags
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                style={chipBtn(tagFilter === tag)}
                onClick={() =>
                  setTagFilter(tagFilter === tag ? null : tag)
                }
              >
                #{tag}
              </button>
            ))}
          </div>
          {folders.length > 0 ? (
            <select
              className="pill"
              style={{ marginLeft: "auto" }}
              value={folderFilter ?? ""}
              onChange={(e) => setFolderFilter(e.target.value || null)}
            >
              <option value="">all folders</option>
              {folders.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          ) : null}
        </div>
        {nodeCount === 0 ? (
          <p className="muted" style={{ padding: 40, textAlign: "center" }}>
            No wikilinks found in the vault yet. Add some{" "}
            <code style={{ fontFamily: "var(--font-mono)" }}>
              [[wikilinks]]
            </code>{" "}
            to see the graph grow.
          </p>
        ) : (
          <div
            ref={containerRef}
            style={{
              height: 560,
              width: "100%",
              background: "var(--bg)",
            }}
          />
        )}
      </div>
    </div>
  );
}

function chipBtn(active: boolean): React.CSSProperties {
  return {
    fontSize: 11.5,
    padding: "2px 8px",
    borderRadius: 3,
    background: active ? "var(--ink)" : "var(--bg-soft)",
    color: active ? "var(--bg)" : "var(--ink-3)",
    border: "1px solid var(--line)",
    cursor: "pointer",
  };
}

interface AllowFilterOpts {
  tagFilter: string | null;
  folderFilter: string | null;
  vaultRoot: string;
}

function computeAllowed(
  adjacency: NonNullable<
    ReturnType<typeof useVaultStore.getState>["adjacency"]
  >,
  { tagFilter, folderFilter, vaultRoot }: AllowFilterOpts,
): Set<string> {
  const all = new Set<string>();
  for (const p of Object.keys(adjacency.forward)) all.add(p);
  for (const targets of Object.values(adjacency.forward)) {
    for (const p of targets) all.add(p);
  }
  for (const p of Object.keys(adjacency.tags)) all.add(p);
  return new Set(
    Array.from(all).filter((p) => {
      if (tagFilter && !(adjacency.tags[p] ?? []).includes(tagFilter)) {
        return false;
      }
      if (folderFilter && !inFolder(vaultRoot, p, folderFilter)) {
        return false;
      }
      return true;
    }),
  );
}

function buildElements(
  adjacency: NonNullable<
    ReturnType<typeof useVaultStore.getState>["adjacency"]
  >,
  allowed: Set<string>,
): ElementDefinition[] {
  const nodes = new Set<string>();
  const edges: ElementDefinition[] = [];
  for (const [source, targets] of Object.entries(adjacency.forward)) {
    if (!allowed.has(source)) continue;
    nodes.add(source);
    for (const target of targets) {
      if (!allowed.has(target)) continue;
      nodes.add(target);
      edges.push({
        data: { id: `${source}::${target}`, source, target },
      });
    }
  }
  return [
    ...Array.from(nodes).map((p) => ({
      data: { id: p, label: stem(p) },
    })),
    ...edges,
  ];
}

function collectTags(map: Record<string, string[]>): string[] {
  const set = new Set<string>();
  for (const arr of Object.values(map)) {
    for (const tag of arr) set.add(tag);
  }
  return Array.from(set).sort();
}

function collectFolders(
  root: string,
  adjacency:
    | { forward: Record<string, string[]>; tags: Record<string, string[]> }
    | null,
): string[] {
  if (!adjacency || !root) return [];
  const trimmed = root.replace(/[\\/]+$/, "");
  const set = new Set<string>();
  const paths = new Set<string>();
  for (const p of Object.keys(adjacency.forward)) paths.add(p);
  for (const arr of Object.values(adjacency.forward)) {
    for (const p of arr) paths.add(p);
  }
  for (const p of Object.keys(adjacency.tags)) paths.add(p);
  for (const p of paths) {
    if (!p.startsWith(trimmed)) continue;
    const rel = p.slice(trimmed.length).replace(/^[\\/]+/, "");
    const idx = rel.indexOf("/");
    if (idx > 0) set.add(rel.slice(0, idx));
  }
  return Array.from(set).sort();
}

function inFolder(root: string, path: string, folder: string): boolean {
  const trimmed = root.replace(/[\\/]+$/, "");
  if (!path.startsWith(trimmed)) return false;
  const rel = path.slice(trimmed.length).replace(/^[\\/]+/, "");
  return rel.startsWith(`${folder}/`) || rel.startsWith(`${folder}\\`);
}

function stem(path: string): string {
  const name = path.split(/[\\/]/).pop() ?? path;
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

const STYLE: StylesheetCSS[] = [
  {
    selector: "node",
    css: {
      "background-color": "#6c8eef",
      label: "data(label)",
      color: "var(--ink-2)",
      "font-size": 10,
      "text-valign": "bottom",
      "text-halign": "center",
      "text-margin-y": 4,
      width: 14,
      height: 14,
    },
  },
  {
    selector: "edge",
    css: {
      "line-color": "rgba(127, 127, 127, 0.28)",
      "curve-style": "bezier",
      width: 1,
    },
  },
  {
    selector: "node:selected",
    css: { "background-color": "#a4b7f2" },
  },
];
