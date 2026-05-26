// Graph view settings — persisted to localStorage so the user's slider
// positions survive reloads. Mirrors Obsidian's graph settings panel:
// Filters / Display / Forces. Field names and value ranges follow the
// `obsidian-typings` `GraphPluginInstanceOptions` interface so behaviour
// matches the real Obsidian sliders unit-for-unit. References:
//   - github.com/Fevol/obsidian-typings
//   - github.com/ElsaTam/obsidian-extended-graph (default values)
//   - github.com/ycnmhd/obsidian-graph-presets (slider ranges)

export interface GraphSettings {
  // Filters
  search: string;
  showOrphans: boolean;
  existingOnly: boolean;
  tagFilter: string | null;
  folderFilter: string | null;

  // Display
  arrows: boolean;
  textFadeThreshold: number; // zoom level at which labels appear (0.1..3)
  nodeSize: number; // multiplier 0.5..3
  linkThickness: number; // 0.3..3

  // Forces — names and ranges mirror Obsidian's `ForceOptions`.
  centerForce: number; // 0..1 — center pull strength (Obsidian: centerStrength)
  repelForce: number; // 0..20 — node repulsion (Obsidian: repelStrength)
  linkForce: number; // 0..1 — link spring stiffness (Obsidian: linkStrength)
  linkDistance: number; // 30..500 — ideal edge length (Obsidian: linkDistance)
}

// Tuned to match Obsidian's actual graph view: low gravity, strong
// repulsion, long edges. Produces hub-and-spoke "dandelion" clusters
// where leaves spring radially out of their hub instead of all 21
// nodes balling up around the centre.
export const DEFAULT_GRAPH_SETTINGS: GraphSettings = {
  search: "",
  showOrphans: true,
  existingOnly: false,
  tagFilter: null,
  folderFilter: null,
  arrows: false,
  textFadeThreshold: 1.1,
  nodeSize: 1,
  linkThickness: 1,
  // Defaults tuned against the karpathy vault (21 nodes, 88 edges —
  // very dense). Weaker links + stronger repulsion is what lets the
  // cluster breathe; otherwise dense graphs collapse into a blob.
  // Anchored to Obsidian's published defaults but pushed a couple of
  // ticks tighter on centerForce and farther on linkDistance — this
  // gives the silhouette a stronger overall-round feel (no cluster
  // ever drifts off-axis for long) while keeping leaves visibly
  // apart.
  centerForce: 0.7, // → internal strength ≈ 0.158 after log curve
  repelForce: 10,
  linkForce: 1,
  linkDistance: 320,
};

// v10: visual second-pass — smaller font/edges/outline, degree-aware
// label visibility. Key bumped so any user who had toggled `arrows`
// on in v9 gets the clean Obsidian default back.
const KEY = "memex.graph.settings.v10";

export function loadGraphSettings(): GraphSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_GRAPH_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<GraphSettings>;
    return { ...DEFAULT_GRAPH_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_GRAPH_SETTINGS };
  }
}

export function saveGraphSettings(s: GraphSettings): void {
  try {
    // Don't persist the search box — it's transient.
    const { search: _ignored, ...rest } = s;
    void _ignored;
    localStorage.setItem(KEY, JSON.stringify(rest));
  } catch {
    /* quota or disabled — ignore */
  }
}
