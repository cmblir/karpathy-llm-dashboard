# Memex

A cross-platform desktop wiki app for plain markdown vaults. Built with
Tauri 2 + React + TypeScript. Ships as a small native bundle (no Chromium),
edits real files on disk, and resolves `[[wikilinks]]` like Obsidian.

## What is Memex?

Memex is an editor for a directory of markdown files. Open any folder; it
becomes the vault. Files stay on disk in their original layout; nothing is
rewritten or copied into a proprietary store. Memex adds the things a plain
editor doesn't:

- A two-pane source/preview workflow with live wikilink resolution
- A backlinks panel that lists every file linking into the current note
- A graph view of the entire vault (nodes = files, edges = wikilinks)
- Tag and folder filters on the graph for quick subsetting
- Atomic disk writes (tempfile + rename) so saves never tear

## Install

Download `Memex_x.y.z_aarch64.dmg` (macOS Apple Silicon) or
`Memex_x.y.z_x64-setup.exe` (Windows) from a tagged release, mount/run, drag
to Applications/Programs.

The first launch opens with no vault. Click **Open…** in the sidebar header
to pick a directory; Memex remembers the choice for next launch.

## Dev

Prerequisites: Node 20+, Rust 1.77+, platform-specific Tauri prerequisites
(see <https://tauri.app/start/prerequisites/>).

```bash
cd app
npm install
npm run tauri dev
```

Other useful scripts:

```bash
npm run build          # frontend type-check + vite bundle
npm run lint           # eslint over src/
npm run format         # prettier write src/
cargo fmt              # in app/src-tauri
cargo clippy -- -D warnings
cargo test
```

## Build

Produce a release bundle for the host platform:

```bash
cd app
npm run tauri build
```

Outputs land in `app/src-tauri/target/release/bundle/`:

- `dmg/Memex_x.y.z_aarch64.dmg` — macOS installer
- `nsis/Memex_x.y.z_x64-setup.exe` — Windows installer (when run on Windows)

The Cargo release profile uses `lto`, `opt-level = "s"`, and `strip = true`,
so the resulting binary is small (~5 MB on Apple Silicon).

## Architecture

```
app/
├── src/                       # React + Vite frontend
│   ├── components/            # Pure UI components
│   │   ├── Sidebar.tsx
│   │   ├── Splitter.tsx
│   │   ├── Editor.tsx         # CodeMirror 6 mount
│   │   ├── Viewer.tsx         # markdown-it preview
│   │   ├── ModeToggle.tsx
│   │   ├── BacklinksPanel.tsx
│   │   ├── GraphView.tsx      # Cytoscape.js
│   │   └── GraphFilters.tsx
│   ├── stores/                # Zustand stores
│   │   ├── vaultStore.ts      # vault, files, active file, save
│   │   └── uiStore.ts         # view mode, panel state, filters
│   └── lib/                   # Pure helpers
│       ├── ipc.ts             # typed Tauri invoke wrappers
│       ├── markdown.ts        # markdown-it + wikilink rule
│       └── wikilinks.ts
└── src-tauri/                 # Tauri shell (Rust)
    ├── src/
    │   ├── main.rs            # entry point
    │   ├── lib.rs             # Tauri builder + IPC handler list
    │   ├── commands.rs        # IPC adapter layer
    │   ├── vault.rs           # filesystem ops (open/list/read/write)
    │   ├── parser.rs          # wikilink regex parser
    │   └── index.rs           # link graph + SQLite cache
    ├── capabilities/          # Tauri 2 permission policy
    └── tauri.conf.json
```

### IPC surface

All communication goes through a small typed boundary defined in
`src/lib/ipc.ts` and `src-tauri/src/commands.rs`:

| Command           | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `open_vault`      | Validate a directory and return canonical path/name  |
| `list_files`      | Recursive `.md` walk; returns a tree of FileNode     |
| `read_file`       | Read a file; parse YAML frontmatter via gray_matter  |
| `write_file`      | Atomic write via tempfile + rename                   |
| `parse_links`     | Extract `[[wikilinks]]` from a single file           |
| `build_link_graph`| Full vault scan; cached at `<vault>/.memex/cache.db` |

### Storage

Files on disk are the source of truth. Memex never modifies your files
beyond explicit writes. The SQLite cache at `<vault>/.memex/cache.db`
holds derived link data only and is rebuilt on every `build_link_graph`
call.

## License

MIT.
