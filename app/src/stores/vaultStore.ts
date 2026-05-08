// Vault store. Single source of truth for the currently opened vault, file
// tree, and active file. The store mediates all Tauri IPC for vault data.

import { create } from "zustand";
import { ipc } from "../lib/ipc";
import type { FileContent, FileNode, VaultMeta } from "../lib/ipc";

export interface VaultState {
  currentVault: VaultMeta | null;
  fileTree: FileNode[];
  activeFile: FileContent | null;
  isLoading: boolean;
  error: string | null;
  openVault: (path: string) => Promise<void>;
  openFile: (path: string) => Promise<void>;
  saveFile: (path: string, content: string) => Promise<void>;
  resolveWikilink: (target: string) => string | null;
  reset: () => void;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  currentVault: null,
  fileTree: [],
  activeFile: null,
  isLoading: false,
  error: null,

  async openVault(path) {
    set({ isLoading: true, error: null });
    try {
      const meta = await ipc.openVault(path);
      const tree = await ipc.listFiles(meta.path);
      set({
        currentVault: meta,
        fileTree: tree,
        activeFile: null,
        isLoading: false,
      });
    } catch (err) {
      set({ error: errorMessage(err), isLoading: false });
    }
  },

  async openFile(path) {
    set({ isLoading: true, error: null });
    try {
      const file = await ipc.readFile(path);
      set({ activeFile: file, isLoading: false });
    } catch (err) {
      set({ error: errorMessage(err), isLoading: false });
    }
  },

  async saveFile(path, content) {
    try {
      await ipc.writeFile(path, content);
      set((state) =>
        state.activeFile?.path === path
          ? { activeFile: { ...state.activeFile, content }, error: null }
          : { error: null },
      );
    } catch (err) {
      set({ error: errorMessage(err) });
    }
  },

  resolveWikilink(target) {
    return findFileByStem(get().fileTree, target.toLowerCase());
  },

  reset() {
    set({
      currentVault: null,
      fileTree: [],
      activeFile: null,
      isLoading: false,
      error: null,
    });
  },
}));

function findFileByStem(nodes: FileNode[], lowerStem: string): string | null {
  for (const node of nodes) {
    if (node.kind === "file") {
      const stem = stripExtension(node.name).toLowerCase();
      if (stem === lowerStem) return node.path;
    } else {
      const found = findFileByStem(node.children, lowerStem);
      if (found) return found;
    }
  }
  return null;
}

function stripExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "unknown error";
}
