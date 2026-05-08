// Splitter: a draggable divider that adjusts the sidebar width. Stores the
// pending width locally during drag, then commits to the UI store on release
// so we don't thrash localStorage on every mousemove.

import { useCallback, useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import { SIDEBAR_MAX, SIDEBAR_MIN, useUIStore } from "../stores/uiStore";

export default function Splitter(): JSX.Element {
  const sidebarWidth = useUIStore((s) => s.sidebarWidth);
  const setSidebarWidth = useUIStore((s) => s.setSidebarWidth);
  const [dragging, setDragging] = useState(false);
  const dragValueRef = useRef(sidebarWidth);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const next = clamp(e.clientX, SIDEBAR_MIN, SIDEBAR_MAX);
      dragValueRef.current = next;
      document.documentElement.style.setProperty(
        "--memex-sidebar-width",
        `${next}px`,
      );
    },
    [],
  );

  const onMouseUp = useCallback(() => {
    setDragging(false);
    setSidebarWidth(dragValueRef.current);
  }, [setSidebarWidth]);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  return (
    <div
      className={`memex-splitter${dragging ? " memex-splitter--dragging" : ""}`}
      role="separator"
      aria-orientation="vertical"
      aria-valuemin={SIDEBAR_MIN}
      aria-valuemax={SIDEBAR_MAX}
      aria-valuenow={sidebarWidth}
      onMouseDown={(e) => {
        e.preventDefault();
        dragValueRef.current = sidebarWidth;
        setDragging(true);
      }}
    />
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}
