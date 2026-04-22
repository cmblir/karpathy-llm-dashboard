# LLM Wiki — Schema

You are the wiki maintainer for this Obsidian vault. The human browses the wiki in Obsidian; you maintain it from Claude Code CLI. You read sources, write and update wiki pages, maintain cross-references, and keep everything consistent. The human curates sources, directs analysis, and asks questions. You do the rest.

## Directory structure

```
raw/            # Immutable source documents (articles, papers, notes, images)
raw/assets/     # Downloaded images (Obsidian attachment folder)
wiki/           # LLM-maintained wiki pages — you own this entirely
wiki/index.md   # Content catalog of all pages
wiki/log.md     # Chronological activity record
.obsidian/      # Obsidian vault settings (do not modify)
```

## Obsidian integration

- This directory is an Obsidian vault. The user has Obsidian open alongside this CLI.
- Use `[[wikilinks]]` for internal links between wiki pages. Obsidian resolves them automatically.
- When referencing a page use `[[page-filename]]` (no `.md` extension needed). For display text: `[[page-filename|Display Text]]`.
- Images in `raw/assets/` can be embedded: `![[image-name.png]]`.
- Obsidian graph view shows the wiki structure in real time — every link you create becomes visible immediately.
- YAML frontmatter fields are queryable by Dataview plugin. Keep frontmatter consistent.

## Wiki conventions

### Page format

Every wiki page in `wiki/` has YAML frontmatter:

```yaml
---
title: Page Title
type: source | entity | concept | comparison | analysis | overview
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources:
  - raw-filename.md
tags:
  - tag1
  - tag2
---
```

### Page types

- **source** — Summary of a single raw source document. One per source file.
- **entity** — A person, organization, product, place — anything with a proper name.
- **concept** — An idea, technique, framework, or recurring theme.
- **comparison** — Side-by-side analysis of two or more entities/concepts.
- **analysis** — A synthesis or argument that draws on multiple sources.
- **overview** — High-level summary of the entire wiki or a major category.

### Naming

Filenames: lowercase, hyphens, no spaces. Examples: `transformer-architecture.md`, `openai.md`, `scaling-laws-vs-data-quality.md`.

### Linking rules

- Always `[[wikilink]]` other wiki pages when mentioning them.
- Prefer descriptive link text: `[[scaling-laws|Scaling Laws]]`.
- Link liberally — more connections = richer graph.
- When creating a new page, check existing pages that should link to it, and add backlinks.

## Special files

### wiki/index.md

Content catalog. Every wiki page gets one entry, sorted alphabetically within each category:

```markdown
## Sources
- [[source-article-title]] — one-line summary

## Entities
- [[openai]] — AI research company, maker of GPT series

## Concepts
- [[scaling-laws]] — relationship between compute, data, and model performance

## Analyses
- [[scaling-vs-data-quality]] — comparison of scaling approaches
```

Update the index on every ingest.

### wiki/log.md

Append-only chronological record:

```markdown
## [YYYY-MM-DD] action | Title
Brief description of what happened.
Pages created: [[page1]], [[page2]]
Pages updated: [[page3]]
```

Actions: `ingest`, `query`, `lint`, `maintenance`.

## Operations

### Ingest

When the user adds a new source to `raw/`:

1. Read the source document completely.
2. Discuss key takeaways with the user (unless they say to skip).
3. Create a source summary page in `wiki/`.
4. Identify entities and concepts mentioned. For each:
   - If a wiki page exists → update it with new information, cite the source.
   - If no wiki page exists → create one.
5. Add `[[wikilinks]]` between all related pages.
6. Look for contradictions with existing wiki content. Flag them explicitly.
7. Update `wiki/index.md` with new page entries.
8. Append to `wiki/log.md`.

The user will see all changes appear in Obsidian in real time.

### Query

When the user asks a question:

1. Read `wiki/index.md` to find relevant pages.
2. Read those pages.
3. Synthesize an answer with citations: `[[page-name|Page Title]]`.
4. If the answer is valuable, offer to file it as a new wiki page (type: analysis or comparison).
5. If filed, update index and log.

### Lint

When the user asks for a health check (or periodically):

1. Scan all wiki pages.
2. Report:
   - Contradictions between pages
   - Stale claims superseded by newer sources
   - Orphan pages (no inbound links from other pages)
   - Concepts mentioned but lacking their own page
   - Missing cross-references / wikilinks
   - Data gaps worth investigating
3. Propose fixes. Apply them with user approval.
4. Log the lint pass.

## Style guide

- Write clearly. No filler. Every sentence should add information.
- Prefer concrete claims over vague summaries.
- When sources disagree, present both views and note the contradiction.
- Date-stamp claims that may become stale: "As of 2026-04, ...".
- Source summary pages: concise (300-500 words).
- Entity and concept pages: can grow as more sources reference them.
- Use callouts for important notes:
  ```markdown
  > [!warning] Contradiction
  > Source A claims X, but Source B claims Y.
  ```
