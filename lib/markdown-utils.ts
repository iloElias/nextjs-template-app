/**
 * Converte links de referência markdown para links inline
 *
 * @param markdown - O conteúdo markdown com links de referência
 * @returns O markdown com links convertidos para inline
 *
 * @example
 * ```ts
 * const input = `
 * [link text][ref]
 *
 * [ref]: https://example.com
 * `;
 *
 * const output = convertReferenceLinksToInline(input);
 * // Result: "[link text](https://example.com)"
 * ```
 */
export function convertReferenceLinksToInline(markdown: string): string {
  const references: Record<string, { url: string; title?: string }> = {};

  const referenceDefRegex =
    /^\s*\[([^\]]+)\]:\s*(?:<([^>]+)>|(\S+))(?:\s+["'(]([^"')]+)["')])?.*$/gm;

  const lines: string[] = [];

  markdown.split("\n").forEach((line) => {
    const match = line.match(
      /^\s*\[([^\]]+)\]:\s*(?:<([^>]+)>|(\S+))(?:\s+["'(]([^"')]+)["')])?/,
    );
    if (match) {
      const ref = match[1];
      const url = match[2] || match[3]; // <url> ou url
      const title = match[4];

      if (ref.startsWith("^")) {
        lines.push(line);
        return;
      }

      if (!url.match(/^(https?|ftps?|mailto|file|tel|#|\/|\.)/i)) {
        lines.push(line);
        return;
      }

      references[ref.toLowerCase()] = { url, title };
    } else {
      lines.push(line);
    }
  });

  markdown = lines.join("\n");

  const referenceLinkRegex = /\[([^\]^]+)\](?:\[([^\]]*)\])?(?!\()/g;

  markdown = markdown.replace(referenceLinkRegex, (match, text, ref) => {
    if (text.startsWith("^") || (ref && ref.startsWith("^"))) {
      return match;
    }

    const refKey = (ref || text).toLowerCase().trim();

    const definition = references[refKey];

    if (definition) {
      if (definition.title) {
        return `[${text}](${definition.url} "${definition.title}")`;
      }
      return `[${text}](${definition.url})`;
    }

    return match;
  });

  markdown = markdown.replace(/\n{3,}/g, "\n\n");

  return markdown.trim();
}
