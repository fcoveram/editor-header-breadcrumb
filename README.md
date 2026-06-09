# Editor Header — Breadcrumb Prototype

A standalone prototype exploring a new breadcrumb-style document bar for the WordPress block editor. The breadcrumb replaces the current flat `DocumentBar` title with a hierarchical trail that communicates where the current document lives (e.g., *Templates / Blog Home / My pattern*).

**Design reference:** [Figma — Editor's header (node 17:4963)](https://www.figma.com/design/61XvHsq3I7yipitlk7RmmB/Editor-s-header?node-id=17-4963&m=dev)

---

## Running the prototype

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

Use the scenario switcher at the top of the page to preview different document hierarchy states.

---

## What this prototype demonstrates

The block editor header has three regions. This prototype rebuilds all three using `@wordpress/ui` and documents how the **center region** (the document bar) would change:

| Region | Today | This proposal |
|--------|-------|---------------|
| Left toolbar | Undo, redo, inserter, list view | No change |
| **Center** | **Flat document title + post-type badge** | **Breadcrumb trail showing full document hierarchy** |
| Right toolbar | Preview, settings, save | No change |

The breadcrumb shows the route from the outermost context (e.g., the template) down to the currently edited document (e.g., the pattern inside it). Each ancestor item is a clickable link; the current item has a chevron for a future "switch document" dropdown.

---

## Files in Gutenberg to change for the real implementation

| File | What to change |
|------|----------------|
| `packages/editor/src/components/document-bar/index.js` | Replace the existing title display with `<Breadcrumbs>` from `@wordpress/admin-ui` fed by the new hook below |
| `packages/editor/src/components/document-bar/useEditedSectionDetails.js` | Extend to return a full parent chain, not just the immediate parent context |
| `packages/editor/src/store/selectors.js` | Add (or compose) selectors for resolving the full document ancestry array |
| `packages/admin-ui/src/breadcrumbs/index.tsx` | **No change needed** — this component is already suitable |

### New hook: `useDocumentHierarchy()`

The real implementation needs a new hook in `packages/editor/src/components/document-bar/` that returns an array of `{ label, icon, href }` items representing the full hierarchy from outermost context to current document.

It would compose these existing Gutenberg APIs:

```js
// packages/editor/src/store/selectors.js
getCurrentPostType( state )
// → 'post' | 'page' | 'wp_template' | 'wp_block' | 'wp_template_part' | ...

getEditedPostAttribute( state, 'parent' )
// → parent post ID (for hierarchical post types like 'page')

// packages/editor/src/components/document-bar/useEditedSectionDetails.js
useEditedSectionDetails()
// → { patternName, patternTitle, type: 'pattern' | 'synced-pattern' | 'template-part' }
// Already handles the "editing a block/pattern inside a template" case

// packages/core-data
getEntityRecord( 'postType', postTypeSlug, postId )
// → resolves the parent post object (title, link) for building ancestor items
```

### Post-type → icon mapping

A small helper mapping post-type slugs to `@wordpress/icons` exports is needed:

```js
// Suggested location: packages/editor/src/utils/postTypeIcon.js
import { page, layout, symbol, blockDefault } from '@wordpress/icons';

const POST_TYPE_ICONS = {
  post:               page,
  page:               page,
  wp_template:        layout,
  wp_block:           symbol,       // unsynced pattern / reusable block
  wp_template_part:   blockDefault,
};

export function getPostTypeIcon( postTypeSlug ) {
  return POST_TYPE_ICONS[ postTypeSlug ] ?? blockDefault;
}
```

---

## Admin bar (Toolbar)

The prototype renders a faithful, **non-functional** replica of the WordPress admin bar above the editor header (`src/components/WordPressAdminBar.jsx` + `src/styles/admin-bar.css`) so the breadcrumb is shown inside realistic editor chrome.

**Reference:** [PR #77964 — Add experiment to show admin bar in Post and Site Editor](https://github.com/WordPress/gutenberg/pull/77964)

### There is no admin bar to build in JS

The real `#wpadminbar` is printed **server-side** by WordPress on every admin page. PR #77964 does **not** re-create it — it stops the fullscreen editor from covering it:

| File (in the PR) | Role |
|------|------|
| `lib/experimental/admin-bar-in-editor/load.php` | Registers the `gutenberg-admin-bar-in-editor` experiment and adds the `.is-admin-bar-in-editor-enabled` body class |
| `packages/edit-post/src/experimental-admin-bar-in-editor.scss`, `packages/edit-site/src/experimental-admin-bar-in-editor.scss` | Adjust editor offsets so the bar is uncovered |
| `packages/edit-post/src/components/back-button/fullscreen-mode-close.js`, `packages/boot/src/components/canvas/back-button.tsx` | Replace the top-left site icon with an explicit **Back** button to exit the editor |

So the real work is layout/CSS plus a Back button — **not** building an admin bar component.

### What the prototype replica mirrors

`src/styles/admin-bar.css` copies the key values from core `wp-includes/css/admin-bar.css` (height 32px, background `#1d2327`, links `#f0f0f1`, icons `rgba(240,246,252,.6)`, hover `#2c3338` / `#72aee6`, item padding `0 8px 0 7px`). Icons are the real **Dashicons** (`wordpress`, `admin-home`, `admin-comments`, `plus`) inlined as SVG paths to avoid loading the Dashicons font. Dynamic fields (site name, comment count, user name, avatar) use **sample data**; every control is a dummy (no navigation).

---

## Document menu

Clicking the current-item control opens a document-actions dropdown built with the WordPress **`Menu`** component (`src/components/DocumentMenu.jsx`).

- **Version A & B:** the chevron `IconButton` is the trigger.
- **Version C:** the whole "My pattern" `Button` is the trigger.

The menu opens as a `bottom-start` popover with an 8px gutter — the same interaction as the editor's `editor-preview-dropdown` toggle. Items (Figma 17:5158): _Rename_, _Duplicate_, divider, _All pages_ (`category` icon), _Edit template: {name}_ (`layout` icon), divider, _Send to trash_. All actions are dummies.

### `Menu` is a private API

The new [`Menu` component](https://wordpress.github.io/gutenberg/?path=/docs/components-menu--docs) is **🔒 locked as a private API** in `@wordpress/components`. The prototype reaches it the same way core editor packages (and Storybook) do — via the private-APIs lock/unlock:

```js
import { privateApis as componentsPrivateApis } from '@wordpress/components';
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@wordpress/private-apis';

const { unlock } = __dangerousOptInToUnstableAPIsOnlyForCoreModules(
  'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.',
  '@wordpress/editor' // any allow-listed core module
);
const { Menu } = unlock( componentsPrivateApis );
```

> **Vite note:** `@wordpress/private-apis` must resolve to a **single instance** (its lock/unlock share one module-scoped `WeakMap`). `vite.config.js` adds it to `resolve.dedupe` and `optimizeDeps.include` so the unlocked `Menu` reads the same `WeakMap` `@wordpress/components` locked with. Without this the unlock throws at runtime.

In a real Gutenberg implementation no unlock is needed in your own code path — `Menu` is already available unlocked inside editor packages. The trigger is supplied via `Menu.TriggerButton`'s `render` prop, so the existing breadcrumb control becomes the menu button + anchor.

| Icon noted in Figma | `@wordpress/icons` export used | Note |
|---|---|---|
| category | `category` | — |
| template | `layout` | `@wordpress/icons` v12 has no `template` glyph; `layout` is WordPress's template icon |

---

## Components used and why

| Component | Package | Why |
|-----------|---------|-----|
| `Breadcrumbs` | `@wordpress/admin-ui` | Official accessible breadcrumb — `<nav aria-label="Breadcrumbs">`, separator-aware, routes via `@wordpress/route`. **Use this in the real implementation.** |
| `Button` | `@wordpress/ui` | Current-item button with `Button.Icon` slots for prefix icon and chevron |
| `Button.Icon` | `@wordpress/ui` | Icon slot inside Button, renders at 24 px with correct CSS class |
| `IconButton` | `@wordpress/ui` | All toolbar actions — includes built-in `Tooltip` |
| `Stack` | `@wordpress/ui` | Flex layout primitive for breadcrumb item rows |
| `Text` | `@wordpress/ui` | Typography primitive for the `/` separator |

### Why `Breadcrumbs` is not used directly in this prototype

`@wordpress/admin-ui`'s `Breadcrumbs` renders link items via `@wordpress/route`, which wraps `@tanstack/react-router`. That requires a TanStack Router context (and React 19 peer dep) that this standalone Vite prototype does not provide.

The `DocumentBreadcrumb` component in this prototype (`src/components/DocumentBreadcrumb.jsx`) is a structurally equivalent stand-in using `@wordpress/ui` primitives. The in-code comments mark exactly where to swap in the real `Breadcrumbs` component.

In Gutenberg, the editor already has a TanStack Router context set up in `packages/edit-site` and `packages/edit-post`, so `Breadcrumbs` from `@wordpress/admin-ui` will work directly there.

---

## Scenarios

The scenario switcher (top bar, prototype-only) simulates the different document hierarchy states Gutenberg exposes:

| Scenario | Post type | How Gutenberg detects it |
|----------|-----------|--------------------------|
| Standalone post | `post` | `getCurrentPostType() === 'post'` |
| Standalone page | `page` | `getCurrentPostType() === 'page'` |
| Pattern inside a template | `wp_block` | `useEditedSectionDetails().type === 'pattern'` |
| Template part inside a template | `wp_template_part` | `useEditedSectionDetails().type === 'template-part'` |
| Deep nest (3 levels) | `wp_block` inside `wp_template` | Composed from above + `getEntityRecord` for template ancestry |
| Synced pattern (reusable block) | `wp_block` | `useEditedSectionDetails().type === 'synced-pattern'` |

---

## What still needs design/product decisions

1. **Chevron dropdown content** — the current item's `▾` suggests a "switch document" menu. What should it show? Options: jump to parent, switch to another template, close editing session.
2. **Truncation** — for very deep hierarchies, how many crumbs to show before collapsing with `…`.
3. **Animation** — the existing `DocumentBar` has an entrance animation. Should the breadcrumb animate on hierarchy changes?
4. **Mobile / narrow viewport** — at small widths the breadcrumb may overflow. A collapsed version may be needed.
