// Viewer renders markdown content as HTML. The renderer emits `data-link`
// attributes on wikilink anchors; the parent attaches a delegated click
// handler to dispatch navigation.

import { useMemo } from "react";
import type { JSX, MouseEvent } from "react";
import { markdownRenderer } from "../lib/markdown";

export interface ViewerProps {
  content: string;
  onLinkClick?: (target: string) => void;
}

export default function Viewer({
  content,
  onLinkClick,
}: ViewerProps): JSX.Element {
  const html = useMemo(() => markdownRenderer.render(content), [content]);

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const linkTarget = target.closest<HTMLElement>("[data-link]");
    if (!linkTarget) return;
    e.preventDefault();
    const value = linkTarget.getAttribute("data-link");
    if (value) onLinkClick?.(value);
  }

  return (
    <div
      className="memex-viewer"
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
