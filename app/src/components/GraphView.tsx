// GraphView: renders the vault link graph as a Cytoscape.js canvas. Nodes are
// markdown files (label = stem), edges are wikilink relationships.

import { useEffect, useRef } from "react";
import type { JSX } from "react";
import cytoscape from "cytoscape";
import type { ElementDefinition } from "cytoscape";
import fcose from "cytoscape-fcose";
import { useVaultStore } from "../stores/vaultStore";
import { useUIStore } from "../stores/uiStore";
import GraphFilters from "./GraphFilters";

let layoutRegistered = false;

function ensureLayoutRegistered() {
  if (!layoutRegistered) {
    cytoscape.use(fcose);
    layoutRegistered = true;
  }
}

export default function GraphView(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const adjacency = useVaultStore((s) => s.adjacency);
  const currentVault = useVaultStore((s) => s.currentVault);
  const openFile = useVaultStore((s) => s.openFile);
  const setTopView = useUIStore((s) => s.setTopView);
  const tagFilter = useUIStore((s) => s.graphTagFilter);
  const folderFilter = useUIStore((s) => s.graphFolderFilter);

  useEffect(() => {
    if (!containerRef.current) return;
    ensureLayoutRegistered();

    const elements = buildElements(adjacency, {
      tagFilter,
      folderFilter,
      vaultRoot: currentVault?.path ?? "",
    });
    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: GRAPH_STYLE,
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
      void openFile(path);
      setTopView("editor");
    });

    cy.ready(() => {
      cy.fit(undefined, 30);
    });

    return () => {
      cy.destroy();
    };
  }, [
    adjacency,
    openFile,
    setTopView,
    tagFilter,
    folderFilter,
    currentVault?.path,
  ]);

  return (
    <div className="memex-graph-container">
      <GraphFilters />
      <div
        ref={containerRef}
        className="memex-graph"
        role="img"
        aria-label="Vault link graph"
      />
    </div>
  );
}

interface FilterOpts {
  tagFilter: string | null;
  folderFilter: string | null;
  vaultRoot: string;
}

function buildElements(
  adjacency: ReturnType<typeof useVaultStore.getState>["adjacency"],
  opts: FilterOpts,
): ElementDefinition[] {
  if (!adjacency) return [];
  const allowed = computeAllowedPaths(adjacency, opts);
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
  const nodeDefs: ElementDefinition[] = Array.from(nodes).map((path) => ({
    data: { id: path, label: stem(path) },
  }));
  return [...nodeDefs, ...edges];
}

function computeAllowedPaths(
  adjacency: NonNullable<
    ReturnType<typeof useVaultStore.getState>["adjacency"]
  >,
  { tagFilter, folderFilter, vaultRoot }: FilterOpts,
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

const GRAPH_STYLE: cytoscape.StylesheetCSS[] = [
  {
    selector: "node",
    css: {
      "background-color": "#6c8eef",
      label: "data(label)",
      color: "#e8e8e8",
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
      "line-color": "rgba(232, 232, 232, 0.18)",
      "curve-style": "bezier",
      width: 1,
    },
  },
  {
    selector: "node:selected",
    css: { "background-color": "#a4b7f2" },
  },
];
