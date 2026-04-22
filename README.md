# LLM Wiki

A personal knowledge base built and maintained by an LLM. Based on the [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

**Obsidian** is the IDE. **Claude Code** is the programmer. **The wiki** is the codebase.

You never write the wiki yourself — the LLM writes and maintains all of it. You curate sources, explore, and ask the right questions.

## Setup

### 1. Clone and open in Obsidian

```bash
git clone <this-repo> my-wiki
```

Open Obsidian → "Open folder as vault" → select `my-wiki`. Obsidian settings (attachment path, graph colors, hotkeys) are pre-configured.

### 2. Install recommended Obsidian plugins

- **Dataview** — queries over page frontmatter (tables, lists). Install from Community Plugins.
- **Obsidian Web Clipper** — browser extension to clip articles as markdown into `raw/`.

Optional:
- **Marp Slides** — generate slide decks from wiki content.

### 3. Start Claude Code

Open a terminal in the same directory:

```bash
claude
```

Claude reads `CLAUDE.md` and knows how to operate the wiki. That's it.

## Usage

### Ingest a source

Drop a document into `raw/`, then:

```
Ingest raw/some-article.md
```

Claude reads it, creates wiki pages (source summary, entities, concepts), updates the index and log, and wires up cross-references. You see everything appear in Obsidian live.

### Ask questions

```
What are the main arguments for scaling laws vs data quality?
```

Claude searches the wiki, reads relevant pages, and synthesizes an answer with `[[wikilinks]]`. Good answers can be filed back into the wiki.

### Health check

```
Lint the wiki
```

Claude scans for contradictions, orphan pages, missing links, stale claims, and suggests fixes.

## Structure

```
raw/                Source documents (you add these, LLM reads them)
raw/assets/         Images (Obsidian downloads here via Cmd+Shift+D)
wiki/               LLM-maintained pages (LLM writes, you read in Obsidian)
  index.md          Content catalog
  log.md            Activity timeline
  overview.md       Wiki summary and stats
CLAUDE.md           Schema — tells Claude Code how to maintain the wiki
.obsidian/          Vault settings (pre-configured)
```

## Tips

- **One source at a time** works best. Stay involved, read the summaries, guide emphasis.
- **File good answers** back into the wiki. Don't let analyses disappear into chat history.
- **Obsidian graph view** (`Cmd+G`) shows the shape of your wiki — hubs, orphans, clusters.
- **Web Clipper** (`Cmd+Shift+S` in browser) → clips articles straight to `raw/`.
- **`Cmd+Shift+D`** in Obsidian downloads all images in a clipped article to `raw/assets/`.
- It's just markdown in a git repo. You get version history for free.
