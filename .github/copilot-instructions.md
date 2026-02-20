# Next.js Template App - Development Instructions

## Main Libraries

### Framework & Core

- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Static typing

### UI & Design System

- **@heroui/react 2.8+** - Main UI component library
- **Tailwind CSS 4** - Utility-first CSS framework
- **@tailwindcss/typography** - Typography styles
- **Framer Motion 12** - Animations and transitions
- **next-themes** - Theme management (light/dark)
- **@solar-icons/react** - Icon library

### Internationalization

- **next-international 1.0** - i18n system (supports en and pt-BR)
- **@react-aria/i18n** - Internationalization utilities
- **@internationalized/date** - Internationalized date handling

### Forms & Validation

- **react-hook-form 7.66+** - Form management
- **zod 4.1+** - Schema validation

### State & Data

- **@tanstack/react-query 5.90+** - Async state management and caching
- **axios 1.13+** - HTTP client
- **react-cookie** - Cookie management

### Editors

- **@mdxeditor/editor 3.52+** - Rich MDX editor
- **@monaco-editor/react 4.7+** - Code editor (VS Code)

### Other Libraries

- **@react-oauth/google** - Google authentication
- **emojibase-data** - Emoji data
- **frimousse** - Utilities
- **ilias-use-debounce** - Custom debounce hook
- **ilias-use-storage** - Custom storage hook

## Custom Components

### Base Components

- `button.tsx` - Custom button
- `component.tsx` - Generic component
- `dialogue.tsx` - Dialogues
- `loading.tsx` - Loading states
- `modal.tsx` - Modals

### Document

- `document/body.tsx` - Body wrapper
- `document/html.tsx` - HTML wrapper

### Emoji

- `emoji/emoji-picker.tsx` - Emoji picker
- `emoji/emoji-picker-button.tsx` - Button with emoji popover
- `emoji/emoji-picker-container.tsx` - Picker container
- `emoji/emoji-picker-search.tsx` - Emoji search
- `emoji/emoji-autocomplete.tsx` - Emoji autocomplete
- `emoji/emoji-autocomplete-plugin.tsx` - Autocomplete plugin
- `emoji/emoji-autocomplete-plugin-wrapper.tsx` - Plugin wrapper

### Error

- `error/error-display.tsx` - Error display
- `error/resource-not-found.tsx` - Custom 404 error
- `error/types.ts` - Error types

### Form

- `form/form.tsx` - Form wrapper
- `form/input.tsx` - Text input
- `form/number-input.tsx` - Number input
- `form/textarea.tsx` - Textarea
- `form/select.tsx` - Simple select
- `form/select-multiple.tsx` - Multiple select
- `form/date-picker.tsx` - Date picker

### Icons

- `icons/bulle-list.tsx` - Bullet list icon
- `icons/numbered-list.tsx` - Numbered list icon

### Layout

- `layout/layout.tsx` - Main layout
- `layout/dashboard.tsx` - Dashboard layout
- `layout/header.tsx` - Header
- `layout/navigation-menu.tsx` - Navigation menu
- `layout/section.tsx` - Sections

### Markdown/MDX

- `markdown/mdx-editor.tsx` - Main MDX editor
- `markdown/mdx-editor-context.tsx` - Editor context
- `markdown/mdx-toolbar.tsx` - Toolbar
- `markdown/mdx-toolbar-buttons.tsx` - Toolbar buttons
- `markdown/mdx-button.tsx` - MDX button
- `markdown/mdx-code-block-form.tsx` - Code block form
- `markdown/mdx-image-form.tsx` - Image form
- `markdown/mdx-image-edit-toolbar.tsx` - Image edit toolbar
- `markdown/mdx-link-form.tsx` - Link form
- `markdown/mdx-link-preview.tsx` - Link preview
- `markdown/mdx-link-dialog-monitor.tsx` - Link dialog monitor

### Monaco Editor

- `monaco-editor/monaco-editor.tsx` - Main Monaco editor
- `monaco-editor/monaco-editor-core.tsx` - Editor core
- `monaco-editor/monaco-code-editor.tsx` - Code editor
- `monaco-editor/monaco-language-selector.tsx` - Language selector

### UI Components

- `ui/accordion.tsx` - Accordion component
- `ui/language-select.tsx` - Language selector
- `ui/menu-item.tsx` - Menu item
- `ui/theme-toggle.tsx` - Theme toggle

### Pages

- `pages/index.tsx` - Page exports
- `pages/playground/` - Demo pages

## Custom Hooks

### Application Hooks

- `use-app.ts` - Application context hook
- `use-session.ts` - User session hook

### Internationalization Hooks

- `use-safe-i18n.ts` - Safe wrapper for i18n hooks (handles errors)
  - `useSafeI18n()` - Returns translations or null
  - `useSafeCurrentLocale()` - Returns current locale or null

### External Library Hooks

- `ilias-use-debounce` - Value debouncing
- `ilias-use-storage` - localStorage/sessionStorage sync

## Internationalization Rules

### ⚠️ CRITICAL RULE: All user-facing text MUST be internationalized

#### Using next-international

```typescript
import { useI18n } from "@/locales/client";

// In client components
const t = useI18n();
<Button>{t("button.submit")}</Button>

// For contexts that may not have provider
import { useSafeI18n } from "@/hooks/use-safe-i18n";
const t = useSafeI18n();
```

#### Supported Languages

- `en` - English (default)
- `pt-BR` - Brazilian Portuguese

#### DON'T do this:

```typescript
// ❌ WRONG - Hardcoded text
<Button>Submit</Button>
<p>Welcome to our app</p>

// ❌ WRONG - Direct Portuguese text
buttonLabel="Adicionar Emoji"
```

#### ALWAYS do this:

```typescript
// ✅ CORRECT - Use translation hook
<Button>{t("common.submit")}</Button>
<p>{t("welcome.message")}</p>

// ✅ CORRECT - Internationalized text props
buttonLabel={t("emoji.addButton")}
```

## Code Conventions

### Imports

- HeroUI: always import from `@heroui/react`
- i18n client: import from `@/locales/client`
- i18n server: import from `@/locales/server`

### Components

- Use strict TypeScript with interfaces for props
- Client components must have `"use client"` at the top
- Prefer composition of HeroUI + Tailwind components

### File Structure

- Components in `components/`
- Hooks in `hooks/`
- Pages in `app/`
- Utilities in `lib/`
- Types in `types/`

## Useful Commands

```bash
npm run dev        # Development (turbopack) on localhost:3030
npm run build      # Production build
npm start          # Production server on localhost:3030
npm run lint       # Run linter
npm run audit      # Security audit
```
