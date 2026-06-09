/**
 * Prototype scenarios — one per Figma design version.
 *
 * All three scenarios show the same editorial context (editing "My pattern"
 * inside a template), but explore three different ways to present the
 * current document item at the end of the breadcrumb trail.
 *
 * The breadcrumb content is fixed across all versions:
 *   [page icon]  /  [pattern icon]  /  My pattern
 *
 * What varies is the `variant` of the current (last) item and the icon
 * style of the middle (parent) item. This is the design space being explored.
 *
 * --- How the breadcrumb data would be derived in Gutenberg ---
 *
 * A new `useDocumentHierarchy()` hook in
 *   packages/editor/src/components/document-bar/
 * would compose:
 *   - getCurrentPostType()              → icon and type label
 *   - useEditedSectionDetails()         → patternTitle, type ('pattern' | 'template-part')
 *   - getEntityRecord('postType', ...)  → parent template title + href
 */

export const scenarios = [
	{
		id: 'label-button',
		label: 'A — Label + Button',
		figmaNode: '17:4961',
		description:
			'The current document is shown as a single button: icon + label + chevron ▾ all together. The middle (parent) item uses a filled icon variant.',
		variant: 'label-button',
		items: [
			// First crumb: parent template context
			// In Gutenberg: getEntityRecord('postType', 'wp_template', id).title
			{ label: 'Blog Home', icon: 'page', href: '/templates/blog-home' },

			// Second crumb: pattern type indicator
			// In Gutenberg: getCurrentPostType() === 'wp_block'
			// icon variant = symbolFilled (filled diamond) in this version
			{ label: 'Pattern', icon: 'symbolFilled', href: '/patterns' },

			// Third crumb (current document): the pattern being edited
			// In Gutenberg: useEditedSectionDetails().patternTitle
			{ label: 'My pattern', icon: 'symbol' },
		],
	},
	{
		id: 'icon-button',
		label: 'B — Breadcrumb + IconButton',
		figmaNode: '17:4574',
		description:
			'The current document label and the chevron ▾ are split: the label is a standalone Button, and the dropdown trigger is a separate IconButton to the right of the breadcrumbs. The middle item uses an outline icon variant.',
		variant: 'icon-button',
		items: [
			{ label: 'Blog Home', icon: 'page', href: '/templates/blog-home' },

			// icon variant = symbolFilled (filled diamond), same as versions A and C
			{ label: 'Pattern', icon: 'symbolFilled', href: '/patterns' },

			{ label: 'My pattern', icon: 'symbol' },
		],
	},
	{
		id: 'button',
		label: 'C — Button only',
		figmaNode: '17:4432',
		description:
			'The current document is a plain Button with icon + label — no chevron. The dropdown concept is removed entirely. Middle item uses the filled icon variant.',
		variant: 'button',
		items: [
			{ label: 'Blog Home', icon: 'page', href: '/templates/blog-home' },

			// icon variant = symbolFilled (filled diamond) in this version
			{ label: 'Pattern', icon: 'symbolFilled', href: '/patterns' },

			{ label: 'My pattern', icon: 'symbol' },
		],
	},
];
