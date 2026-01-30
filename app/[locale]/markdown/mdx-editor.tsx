"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Checkbox } from "@heroui/react";
import ThemeToggle from "@/components/ui/theme-toggle";

const MDXEditorComponent = dynamic(
  () => import("@/components/markdown/mdx-editor").then(mod => ({ default: mod.MDXEditorComponent })),
  { ssr: false }
);

const INITIAL_MARKDOWN = `# Welcome to MDX Editor

## Getting Started

This is a **rich text editor** for *Markdown* and **MDX** content with advanced features.

> **Note:** This editor supports a wide range of Markdown features including tables, code blocks, lists, and much more!

---

## Text Formatting

You can use **bold text**, *italic text*, ***bold and italic***, ~~strikethrough~~, and even combine them: ***~~bold italic strikethrough~~***.

Inline \`code\` can be added anywhere in your text.

---

## Links and References

- [Simple Link](https://mesf.app)
- [Link with Title](https://github.com "GitHub Homepage")
- [React Documentation](https://react.dev "React Docs")
- Auto-linked URLs: https://www.example.com

---

## Lists

### Unordered Lists

* First level item
  * Nested item 1
  * Nested item 2
    * Deep nested item
      * Even deeper!
* Another first level item
  1. Mixed with ordered
  2. Nested lists

### Ordered Lists

1. First item
2. Second item
   1. Nested ordered item
   2. Another nested item
      - Mixed with unordered
      - Another unordered item
3. Third item

### Task Lists

- [x] Completed task
- [x] Another completed task
- [ ] Pending task
  - [x] Subtask completed
  - [ ] Subtask pending
- [ ] Another pending task

---

## Code Blocks

### TypeScript Example

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "user" }
];
\`\`\`

### Python Example

\`\`\`python
class DataProcessor:
    def __init__(self, data):
        self.data = data
    
    def process(self):
        """Process the data and return results."""
        results = []
        for item in self.data:
            if item['active']:
                results.append({
                    'id': item['id'],
                    'value': item['value'] * 2
                })
        return results

# Usage
processor = DataProcessor([
    {'id': 1, 'value': 10, 'active': True},
    {'id': 2, 'value': 20, 'active': False}
])
print(processor.process())
\`\`\`

### JavaScript Example

\`\`\`javascript
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Event handler with debouncing
const handleSearch = debounce((query) => {
  console.log(\`Searching for: \${query}\`);
  fetch(\`/api/search?q=\${encodeURIComponent(query)}\`)
    .then(res => res.json())
    .then(data => console.log(data));
}, 300);
\`\`\`

### SQL Example

\`\`\`sql
SELECT 
    u.id,
    u.name,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 10;
\`\`\`

---

## Tables

### Simple Table

| Feature | Supported | Notes |
| ------- | --------- | ----- |
| Bold | ✅ | Yes |
| Italic | ✅ | Yes |
| Code | ✅ | Inline and blocks |
| Tables | ✅ | Full support |

### Complex Table with Alignment

| Left Aligned | Center Aligned | Right Aligned | Mixed Content |
| :----------- | :------------: | ------------: | ------------- |
| Text | **Bold** | 100 | [Link](https://example.com) |
| More text | *Italic* | 200 | \`code\` |
| Data | ***Both*** | 300 | ~~strike~~ |
| Final row | Mixed **bold** and *italic* | 999 | Total |

### Pricing Table

| Plan | Price | Users | Storage | Support |
| ---- | ----: | ----: | ------: | :-----: |
| Free | $0 | 1 | 5 GB | Community |
| Pro | $9.99 | 5 | 100 GB | Email |
| Business | $29.99 | 25 | 1 TB | Priority |
| Enterprise | $99.99 | Unlimited | Unlimited | 24/7 |

---

## Blockquotes

> This is a simple blockquote.

> ### Blockquote with Heading
> 
> This blockquote contains a heading and multiple paragraphs.
> 
> It can span multiple lines and include **formatting**.

> **Nested Blockquotes:**
> 
> > This is a nested blockquote.
> > 
> > > And this is even deeper!
> > > 
> > > > Inception level deep!

---

## Horizontal Rules

You can create horizontal rules in different ways:

---

***

___

---

## Nested Structures

1. **Project Setup**
   - Create a new project
     \`\`\`bash
     npm create next-app@latest
     \`\`\`
   - Install dependencies
     - Core packages
     - Dev dependencies
   
2. **Configuration**
   > Make sure to configure your environment variables
   
   | Variable | Description | Required |
   | -------- | ----------- | -------- |
   | API_KEY | Your API key | ✅ |
   | API_URL | API endpoint | ✅ |
   
3. **Development**
   - [ ] Set up components
   - [ ] Create pages
   - [x] Configure routing

---

## Special Characters & Escaping

You can escape special characters: \\* \\_ \\# \\[ \\]

Emojis: 🚀 ⭐ 💡 🎉 ✨ 🔥 💻 📝

---

## Summary

This comprehensive example demonstrates the MDX Editor's capabilities including:

* ✅ Multiple heading levels (H1-H6)
* ✅ Text formatting (bold, italic, strikethrough, combinations)
* ✅ Lists (ordered, unordered, nested, task lists)
* ✅ Code blocks with syntax highlighting (TypeScript, Python, JavaScript, SQL, etc.)
* ✅ Tables (simple, complex, with alignment)
* ✅ Blockquotes (simple, nested, with formatting)
* ✅ Links (inline, reference, auto-linked)
* ✅ Horizontal rules
* ✅ Mixed and nested content structures

**Try editing this content to explore all features!** 🎨`;


const PREVIOUS_VERSION = `# Welcome to MDX Editor

## Getting Started

This is a text editor for Markdown content.

### Features

- Bold and italic text
- Lists
- Code blocks
- Links

\`\`\`javascript
console.log("Hello!");
\`\`\`

---

Try it out!
`;

export default function MdxEditor() {
  const [showPreviousVersion] = useState(true);
  const [isEditable, setIsEditable] = useState<boolean>(true);

  return (
    <div className="mx-auto p-6 max-w-5xl container">
      <div className="flex flex-col gap-3 mb-3">
        <h1 className="font-bold text-3xl">Markdown Editor</h1>
        <Checkbox
          isSelected={isEditable}
          onChange={(e) => setIsEditable(e.target.checked)}
        >
          Manter editável
        </Checkbox>
        <ThemeToggle />
      </div>
      <MDXEditorComponent
        readOnly={!isEditable}
        markdown={INITIAL_MARKDOWN}
        previousVersion={showPreviousVersion ? PREVIOUS_VERSION : undefined}
        // onChange={setMarkdown}
      />
    </div>
  );
}
