# CLAUDE.md - AI Tools Hub

## Project Overview

AI Tools Hub is a static single-page web application that provides curated ratings, comparisons, and information about AI developer tools, frameworks, and learning resources. It is built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies.

## Architecture

```
aitools/
├── index.html   # Entry point — semantic HTML structure, script/style includes
├── data.js      # Tool database — exports AI_TOOLS array (27 tools)
├── app.js       # Application logic — state, rendering, filtering, modal
├── style.css    # All styling — dark theme, responsive, CSS custom properties
└── README.md    # Project readme
```

### File Responsibilities

- **`index.html`** — Semantic HTML5 document. Loads `data.js` before `app.js` (order matters since `app.js` references `AI_TOOLS` from `data.js`). Contains header, search/filter toolbar, tools grid container, modal overlay, and footer.
- **`data.js`** — Single `const AI_TOOLS = [...]` array of tool objects. Each tool has: `id`, `name`, `category`, `rating`, `trending`, `url`, `tagline`, `description`, `whyGood[]`, `useCases[]`, `tags[]`, `stars`, `pricing`, `lastUpdated`.
- **`app.js`** — All interactivity. Manages state (`filteredTools`, `currentCategory`, `currentSort`, `searchQuery`), renders tool cards to the grid, handles modal open/close, and wires up event listeners for search, filter, sort, and keyboard navigation.
- **`style.css`** — Dark theme using CSS custom properties in `:root`. Responsive grid layout (auto-fill, minmax 340px). Mobile breakpoint at 600px with single-column grid and bottom-sheet modal.

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 with semantic elements |
| Styling | Vanilla CSS3, custom properties, no preprocessor |
| Logic | Vanilla JavaScript (ES6+), no framework |
| Build | None — static files served directly |
| Package manager | None — no `package.json` |
| Testing | None configured |
| Linting | None configured |
| CI/CD | None configured |

## Development Workflow

### Running Locally

Open `index.html` directly in a browser. No server, build step, or install required.

For a local dev server (optional):
```sh
python3 -m http.server 8000
# or
npx serve .
```

### Making Changes

1. **Adding a new tool** — Append a new object to the `AI_TOOLS` array in `data.js`. Follow the existing object schema exactly (all fields are required).
2. **Adding a new category** — Add the category value in `data.js` tool objects, add a `<option>` in `index.html` category filter dropdown, add a label mapping in `categoryLabel()` in `app.js`, and add a `.badge-{category}` CSS class in `style.css`.
3. **Styling changes** — Modify CSS custom properties in `:root` for theme-wide changes. Component styles use the `// ── Section ──` comment convention.

## Code Conventions

### JavaScript
- **Section comments**: `// ── Section Name ──`
- **Variables**: camelCase (`filteredTools`, `currentCategory`)
- **Functions**: camelCase, action-verb naming (`renderCards`, `openModal`, `applyFilters`)
- **DOM refs**: Cached at module top level via `document.getElementById()`
- **Rendering**: Direct `innerHTML` assignment with template literals
- **No modules**: All scripts are plain `<script>` tags; `data.js` declares a global `const`

### CSS
- **Custom properties**: Defined in `:root` for colors, radius, shadows
- **Class naming**: kebab-case (`card-header`, `modal-overlay`, `tools-grid`)
- **Category badges**: `.badge-{category-id}` pattern (e.g., `.badge-cli-tool`)
- **Section comments**: `/* ── Section Name ── */`
- **Responsive**: Mobile-first with `@media (max-width: 600px)` breakpoint
- **Units**: `rem` for spacing, `px` for borders and small values

### HTML
- Semantic elements (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`)
- IDs for JS hooks (`id="search"`, `id="tools-grid"`, `id="modal-overlay"`)
- Accessibility attributes: `role="button"`, `tabindex="0"` on interactive cards
- Keyboard support: Enter to open card, Escape to close modal

## Tool Data Schema

Each object in `AI_TOOLS` must have:

```js
{
  id: "kebab-case-id",           // Unique identifier
  name: "Display Name",          // Tool name
  category: "category-id",       // One of the valid categories below
  rating: 4.5,                   // Number 0-5, supports half increments
  trending: true,                // Boolean
  url: "https://...",            // Project/product URL
  tagline: "Short description",  // Shown on card
  description: "Long text...",   // Shown in modal
  whyGood: ["...", "..."],       // Array of benefit strings
  useCases: ["...", "..."],      // Array of use case strings
  tags: ["Tag1", "Tag2"],        // Array of tag strings
  stars: "10k+",                 // GitHub stars string or "N/A"
  pricing: "Free / $X/mo",      // Pricing summary string
  lastUpdated: "Mon YYYY",      // Last update date string
}
```

### Valid Categories

| ID | Display Label |
|---|---|
| `coding-assistant` | Coding Assistant |
| `cli-tool` | CLI Tool |
| `agent-framework` | Agent Framework |
| `ai-platform` | AI Platform |
| `github-project` | GitHub Project |
| `skill` | Skill |

## Key Behaviors

- **Filtering**: Category dropdown + text search (matches against `name`, `tagline`, `description`, `tags`)
- **Sorting**: By rating (default), name, trending, or newest (`lastUpdated`)
- **Modal**: Click card or press Enter to open. Click overlay, close button, or press Escape to close. Body scroll is locked while modal is open.
- **Stats bar**: Shows total tool count and category count, computed from `AI_TOOLS` at init.

## Known Patterns and Pitfalls

- Script load order matters: `data.js` must load before `app.js` since `app.js` immediately references `AI_TOOLS`.
- Modal uses `.active` CSS class toggle (not `hidden` attribute) — `display: none` by default, `display: flex` when `.active` is added.
- Star rendering uses Unicode characters: `★` (full star) and `½` (half star). Half star threshold is `rating % 1 >= 0.3`.
- No XSS sanitization on tool data fields that are rendered via `innerHTML`. All data is static and author-controlled, but be careful if user-generated content is ever introduced.
