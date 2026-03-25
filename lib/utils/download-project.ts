import katex from "katex";
import { marked } from "marked";

/**
 * Download a file with the given content and filename
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download project as Markdown file
 */
export function downloadAsMarkdown(title: string, content: string) {
  const filename = `${title || "untitled"}.md`;
  downloadFile(content, filename, "text/markdown");
}

/**
 * Download project as HTML file
 */
export async function downloadAsHtml(title: string, content: string) {
  const htmlContent = await marked.parse(content);
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || "Untitled"}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.25em; }
    code {
      background-color: #f4f4f4;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', Courier, monospace;
    }
    pre {
      background-color: #f4f4f4;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin-left: 0;
      padding-left: 1em;
      color: #666;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 0.5em;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
      font-weight: 600;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>${title || "Untitled"}</h1>
  ${htmlContent}
</body>
</html>`;

  const filename = `${title || "untitled"}.html`;
  downloadFile(fullHtml, filename, "text/html");
}

/**
 * Download project as plain text file
 */
export function downloadAsText(title: string, content: string) {
  // Remove markdown formatting for plain text
  const plainText = content
    // Remove headers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove emphasis
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove links and keep just the text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove horizontal rules
    .replace(/^(-{3,}|\*{3,}|_{3,})$/gm, "")
    // Remove blockquotes
    .replace(/^>\s+/gm, "")
    // Clean up multiple blank lines
    .replace(/\n{3,}/g, "\n\n");

  const filename = `${title || "untitled"}.txt`;
  downloadFile(plainText, filename, "text/plain");
}

/**
 * Process markdown content and render math formulas
 */
function processMathInMarkdown(content: string): string {
  // Process inline math: $...$
  content = content.replace(/\$([^$\n]+)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { throwOnError: false });
    } catch {
      return match;
    }
  });

  // Process block math: $$...$$
  content = content.replace(/\$\$([^$]+)\$\$/g, (match, formula) => {
    try {
      return `<div class="math-block">${katex.renderToString(formula, { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return match;
    }
  });

  return content;
}

/**
 * Download project as PDF file
 */
export async function downloadAsPdf(title: string, content: string) {
  // Dynamic import to avoid SSR issues
  const html2pdf = (await import("html2pdf.js")).default;
  
  // Process math formulas first
  const processedContent = processMathInMarkdown(content);

  // Convert markdown to HTML
  const htmlContent = await marked.parse(processedContent);

  // Create container with full styling including KaTeX
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "800px";
  container.style.backgroundColor = "white";

  container.innerHTML = `
    <style>
      @import url('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .content {
        padding: 40px;
      }
      h1 { font-size: 2em; margin-bottom: 0.5em; font-weight: 600; }
      h2 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; }
      h3 { font-size: 1.25em; margin-top: 1.25em; margin-bottom: 0.5em; font-weight: 600; }
      h4, h5, h6 { margin-top: 1em; margin-bottom: 0.5em; font-weight: 600; }
      
      p { margin: 1em 0; }
      
      code {
        background-color: #f4f4f4;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.9em;
      }
      
      pre {
        background-color: #f4f4f4;
        padding: 1em;
        border-radius: 5px;
        overflow-x: auto;
        margin: 1em 0;
      }
      
      pre code {
        background-color: transparent;
        padding: 0;
      }
      
      blockquote {
        border-left: 4px solid #ddd;
        margin: 1em 0;
        padding-left: 1em;
        color: #666;
      }
      
      img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 1em 0;
      }
      
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }
      
      th, td {
        border: 1px solid #ddd;
        padding: 0.5em;
        text-align: left;
      }
      
      th {
        background-color: #f4f4f4;
        font-weight: 600;
      }
      
      a {
        color: #0066cc;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
      
      ul, ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      
      li {
        margin: 0.5em 0;
      }
      
      hr {
        border: none;
        border-top: 2px solid #ddd;
        margin: 2em 0;
      }
      
      .math-block {
        margin: 1.5em 0;
        text-align: center;
        overflow-x: auto;
      }
      
      .katex {
        font-size: 1.1em;
      }
      
      .katex-display {
        margin: 1.5em 0;
      }
    </style>
    <div class="content">
      <h1>${title || "Untitled"}</h1>
      ${htmlContent}
    </div>
  `;

  document.body.appendChild(container);

  const options = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: `${title || "untitled"}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
  };

  try {
    await html2pdf().set(options).from(container).save();
  } finally {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Export type for download formats
 */
export type DownloadFormat = "markdown" | "html" | "text" | "pdf";

/**
 * Download project in the specified format
 */
export async function downloadProject(
  format: DownloadFormat,
  title: string,
  content: string,
) {
  switch (format) {
    case "markdown":
      downloadAsMarkdown(title, content);
      break;
    case "html":
      await downloadAsHtml(title, content);
      break;
    case "text":
      downloadAsText(title, content);
      break;
    case "pdf":
      await downloadAsPdf(title, content);
      break;
  }
}
