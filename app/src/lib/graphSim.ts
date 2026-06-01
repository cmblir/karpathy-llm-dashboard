// d3-force simulation over a graphology graph. Mirrors the Obsidian force
// mapping the cytoscape port arrived at: uncapped Barnes-Hut repulsion, long
// links, gentle center gravity, and per-link degree normalization
// (linkStrength = slider / (1 + min(deg))) — the rule that turns a hairball
// into separated radial "dandelions".
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
  forceCollide,
  type Simulation,
} from "d3-force";
import type { GraphSettings } from "./graphSettings";
import type { VaultGraph } from "./graphData";

// Mutated in place by d3 (it also adds vx/vy/index at runtime). x/y are seeded
// from the graph before the sim runs, so they are always present.
export interface SimNode {
  id: string;
  x: number;
  y: number;
  size: number;
  deg: number;
  fx?: number | null;
  fy?: number | null;
}
interface SimLink {
  source: SimNode | string;
  target: SimNode | string;
}

// Galaxy: uniform per-node repulsion + uniform gravity gives one cohesive disk
// with a dense core that fades to a sparse star halo (not separated clusters).
const REPEL_SCALE = 9; // slider 10 → charge -90 (uncapped, Barnes-Hut)
const CENTER_SCALE = 0.13; // slider 0.5 → x/y strength ≈0.065 (clusters spread, stay cohesive)

export interface GraphSim {
  nodes: SimNode[];
  sim: Simulation<SimNode, SimLink>;
  reheat(alpha: number): void;
  // Re-apply force parameters from changed sliders without rebuilding the sim,
  // then gently reheat so the layout eases to the new configuration.
  update(next: GraphSettings): void;
  stop(): void;
}

export function createSim(
  graph: VaultGraph,
  s: GraphSettings,
  onTick: (nodes: SimNode[]) => void,
): GraphSim {
  let cur = s;
  // ALL nodes take part — orphans included — so everything settles into one
  // cohesive "galaxy": a dense core fading to a sparse halo of field stars.
  const nodes: SimNode[] = graph.mapNodes((id, a) => ({
    id,
    x: a.x,
    y: a.y,
    size: a.size,
    deg: a.deg,
  }));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const links: SimLink[] = graph.mapEdges((_e, _a, src, tgt) => ({
    source: byId.get(src) as SimNode,
    target: byId.get(tgt) as SimNode,
  }));

  // Per-link strength, degree-normalized (d3's native rule). A leaf (deg 1) on
  // a hub pulls at 1/2; two hubs (deg 30) pull each other at only 1/31, so
  // leaves hug their hub while clusters drift apart.
  const linkStrength = (l: SimLink): number => {
    const sN = typeof l.source === "object" ? l.source.deg : 1;
    const tN = typeof l.target === "object" ? l.target.deg : 1;
    return cur.linkForce / (1 + Math.min(sN, tN));
  };
  const centerOf = (g: GraphSettings): number =>
    Math.max(0.005, g.centerForce * CENTER_SCALE);

  const linkF = forceLink<SimNode, SimLink>(links)
    .id((d) => d.id)
    .distance(s.linkDistance)
    .strength(linkStrength)
    .iterations(1);
  const chargeF = forceManyBody<SimNode>()
    .strength(() => -cur.repelForce * REPEL_SCALE)
    .theta(0.9)
    .distanceMin(2); // distanceMax left at Infinity (uncapped)
  const xF = forceX<SimNode>(0).strength(centerOf(s));
  const yF = forceY<SimNode>(0).strength(centerOf(s));

  const sim = forceSimulation<SimNode, SimLink>(nodes)
    .force("link", linkF)
    .force("charge", chargeF)
    .force("x", xF)
    .force("y", yF)
    .force(
      "collide",
      forceCollide<SimNode>((n) => n.size / 2 + 1.5)
        .strength(0.9)
        .iterations(1),
    )
    .alpha(1)
    .alphaDecay(0.018)
    .alphaMin(0.002)
    .velocityDecay(0.45);

  sim.on("tick", () => onTick(nodes));

  return {
    nodes,
    sim,
    // Gentle re-activation for interactive drag — tows neighbours, then cools.
    reheat(alpha) {
      sim.alpha(alpha).alphaTarget(0).restart();
    },
    update(next) {
      cur = next;
      linkF.distance(next.linkDistance).strength(linkStrength);
      chargeF.strength(() => -next.repelForce * REPEL_SCALE);
      xF.strength(centerOf(next));
      yF.strength(centerOf(next));
      sim.alpha(0.3).alphaTarget(0).restart();
    },
    stop() {
      sim.stop();
    },
  };
}
