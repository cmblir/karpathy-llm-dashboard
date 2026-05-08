// UI store. Holds presentation state that should outlive a single render but
// not require backend round-trips. Persisted to localStorage so window reopens
// keep their tree-expansion shape.

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SIDEBAR_MIN = 200;
export const SIDEBAR_MAX = 600;
export const SIDEBAR_DEFAULT = 280;

export type ViewMode = "source" | "preview" | "split";
export type TopView = "editor" | "graph";

export interface UIState {
  expandedFolders: Record<string, boolean>;
  sidebarWidth: number;
  viewMode: ViewMode;
  topView: TopView;
  graphTagFilter: string | null;
  graphFolderFilter: string | null;
  toggleFolder: (path: string) => void;
  setFolder: (path: string, open: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setTopView: (view: TopView) => void;
  setGraphTagFilter: (tag: string | null) => void;
  setGraphFolderFilter: (folder: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      expandedFolders: {},
      sidebarWidth: SIDEBAR_DEFAULT,
      viewMode: "split",
      topView: "editor",
      graphTagFilter: null,
      graphFolderFilter: null,
      toggleFolder: (path) =>
        set((state) => ({
          expandedFolders: {
            ...state.expandedFolders,
            [path]: !state.expandedFolders[path],
          },
        })),
      setFolder: (path, open) =>
        set((state) => ({
          expandedFolders: { ...state.expandedFolders, [path]: open },
        })),
      setSidebarWidth: (width) =>
        set({
          sidebarWidth: Math.min(Math.max(width, SIDEBAR_MIN), SIDEBAR_MAX),
        }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setTopView: (view) => set({ topView: view }),
      setGraphTagFilter: (tag) => set({ graphTagFilter: tag }),
      setGraphFolderFilter: (folder) => set({ graphFolderFilter: folder }),
    }),
    {
      name: "memex-ui",
      version: 1,
    },
  ),
);
