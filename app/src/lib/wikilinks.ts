// Wikilink parsing helpers. The canonical wikilink form is `[[target]]` or
// `[[target|display]]`. Targets are matched case-insensitively against file
// stems to mirror Obsidian's resolution behavior.

export interface ParsedWikilink {
  target: string;
  display: string;
}

const WIKILINK_RE = /\[\[([^\]\n|]+?)(?:\|([^\]\n]+?))?\]\]/g;

export function parseWikilink(token: string): ParsedWikilink | null {
  const match = /^\[\[([^\]\n|]+?)(?:\|([^\]\n]+?))?\]\]$/.exec(token);
  if (!match) return null;
  const target = match[1].trim();
  if (!target) return null;
  return { target, display: (match[2] ?? target).trim() };
}

export function findWikilinks(input: string): ParsedWikilink[] {
  const out: ParsedWikilink[] = [];
  for (const match of input.matchAll(WIKILINK_RE)) {
    const target = match[1].trim();
    if (!target) continue;
    out.push({ target, display: (match[2] ?? target).trim() });
  }
  return out;
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
