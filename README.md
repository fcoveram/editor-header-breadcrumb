# Editor Header — Breadcrumb Prototype

A prototype exploring a breadcrumb-style document bar for the WordPress block editor — replacing the flat document title with a hierarchical trail (e.g. *Blog Home / Pattern / My pattern*) plus a document-actions menu. It shows three variants for how the current document item could behave.

**Live demo:** https://fvm.house/prototype/editor-header-breadcrumb/

## How it was made

A standalone Vite + React app built entirely from the WordPress Design System — no custom UI styling:

- **`@wordpress/ui`** — the header toolbar and breadcrumb controls (`Button`, `IconButton`, `Icon`, `Stack`, `Text`).
- **`@wordpress/components`** — the document-actions dropdown (the `Menu` component).
- **`@wordpress/icons`** + **`@wordpress/theme`** tokens — icons and the design-system colors.
- A static, non-functional replica of the WordPress admin bar provides realistic editor chrome.

Run locally with `npm install && npm run dev`.
