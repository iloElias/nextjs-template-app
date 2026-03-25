// Utility to render KaTeX math in the editor
import katex from "katex";

export const renderMathInElement = (element: HTMLElement) => {
  if (!element) return;

  // Find all text nodes that contain $ or $$
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  const nodesToReplace: { node: Node; parent: Node }[] = [];

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.textContent || "";
    if (text.includes("$")) {
      nodesToReplace.push({ node, parent: node.parentNode! });
    }
  }

  nodesToReplace.forEach(({ node, parent }) => {
    const text = node.textContent || "";
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    // Match block math ($$...$$) first
    const blockMathRegex = /\$\$([^$]+)\$\$/g;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let match: any;
    const blockMatches: { start: number; end: number; formula: string }[] = [];

    while ((match = blockMathRegex.exec(text)) !== null) {
      blockMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        formula: match[1],
      });
    }

    // Match inline math ($...$) but not in block math regions
    const inlineMathRegex = /\$([^$\n]+)\$/g;
    const inlineMatches: { start: number; end: number; formula: string }[] = [];

    while ((match = inlineMathRegex.exec(text)) !== null) {
      // Check if this match is inside a block math region
      const isInBlock = blockMatches.some(
        (block) => match.index >= block.start && match.index < block.end,
      );
      if (!isInBlock) {
        inlineMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          formula: match[1],
        });
      }
    }

    // Combine and sort all matches
    const allMatches = [...blockMatches, ...inlineMatches].sort(
      (a, b) => a.start - b.start,
    );

    allMatches.forEach((match) => {
      // Add text before formula
      if (lastIndex < match.start) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.start)),
        );
      }

      // Create math span
      const span = document.createElement("span");
      span.className = blockMatches.includes(match)
        ? "math-display"
        : "math-inline";
      span.setAttribute("data-formula", match.formula);

      try {
        katex.render(match.formula, span, {
          displayMode: blockMatches.includes(match),
          throwOnError: false,
          output: "html",
        });
      } catch (e) {
        span.textContent = blockMatches.includes(match)
          ? `$$${match.formula}$$`
          : `$${match.formula}$`;
        span.style.color = "red";
      }

      fragment.appendChild(span);
      lastIndex = match.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    if (allMatches.length > 0) {
      parent.replaceChild(fragment, node);
    }
  });
};
