/**
 * DocumentBreadcrumb
 *
 * Three layout variants matching the Figma design versions (node 17:5388).
 *
 * VARIANTS
 * ────────
 * 'label-button'  — Version A (Figma 24:651)
 *   Parent items : IconButton (icon only, navigable)
 *   Current item : Static Icon + Text label grouped as one unit (icon and
 *                  label 4px / gap-xs apart; the document name is
 *                  informational, NOT a button), followed flush (0px gap) by a
 *                  chevron-down `IconButton` — the only interactive control.
 *                  Clicking the chevron opens the DocumentMenu.
 *
 * 'icon-button'   — Version B (Figma 17:4574)
 *   Parent items : IconButton (icon only, navigable)
 *   Current item : Button (icon + label text, Storybook: Button--with-icon)
 *                  + a separate chevron `IconButton`. Clicking the chevron
 *                  opens the DocumentMenu.
 *
 * 'button'        — Version C (Figma 17:4432)
 *   Parent items : IconButton (icon only, navigable)
 *   Current item : Button (icon + label text) — no chevron. Clicking the
 *                  whole button opens the DocumentMenu.
 *
 * In every variant the trigger is supplied to `DocumentMenu` (see
 * DocumentMenu.jsx), which renders the WordPress `Menu` component as a
 * dropdown — the same interaction as the editor's `editor-preview-dropdown`.
 *
 * ICON RENDERING NOTE
 * ───────────────────
 * Parent crumbs and Version A's static current item render icons with the
 * full-size `<Icon size={ 24 } />` (full "0 0 24 24" viewBox — never clipped).
 *
 * Versions B and C compose their current-item Button exactly like the design
 * system's canonical "Button — with icon" story: `<Button.Icon>` + label text
 * (Storybook: design-system-components-button--with-icon, size compact).
 * `Button.Icon` forces `viewBox="4 4 16 16"` (size 16), so any icon whose
 * geometry reaches the outer 4px ring is trimmed there — including `symbol` /
 * `symbolFilled` (x ≈ 2..22), whose left/right points get clipped. That is the
 * same trimming the story applies to its `wordpress` icon; it is intrinsic to
 * `Button.Icon`, the official button-icon component.
 *
 * SPACING NOTE
 * ────────────
 * The `/` separator mirrors `@wordpress/admin-ui`'s Breadcrumbs component:
 * `margin: 0 var(--wpds-dimension-gap-sm)` and
 * `color: var(--wpds-color-stroke-surface-neutral)`. The outer Stack uses no
 * gap so the separator margins alone govern the trail spacing — matching the
 * Storybook story (Admin UI / Breadcrumbs).
 *
 * GUTENBERG IMPLEMENTATION NOTE
 * ──────────────────────────────
 * Replace this component with `<Breadcrumbs>` from `@wordpress/admin-ui` for
 * the parent items once TanStack Router context is available in the editor
 * (packages/editor/src/components/document-bar/index.js).
 */

import { Fragment } from 'react';
import { Button, IconButton, Icon, Stack, Text } from '@wordpress/ui';
import {
	chevronDown,
	page,
	symbol,
	symbolFilled,
	blockDefault,
	layout,
} from '@wordpress/icons';
import DocumentMenu from './DocumentMenu.jsx';

const ICON_MAP = { page, symbol, symbolFilled, blockDefault, layout };

/**
 * Trail separator — matches the admin-ui Breadcrumbs separator exactly:
 * body-lg text, neutral surface stroke color, gap-sm horizontal margin.
 */
function Separator() {
	return (
		<Text
			variant="body-lg"
			aria-hidden="true"
			style={ {
				color: 'var(--wpds-color-stroke-surface-neutral)',
				margin: '0 var(--wpds-dimension-gap-sm)',
				userSelect: 'none',
			} }
		>
			/
		</Text>
	);
}

/** Icon-only navigable parent crumb. */
function ParentItem( { item } ) {
	const icon = ICON_MAP[ item.icon ];
	if ( ! icon ) return null;
	return (
		<IconButton
			icon={ icon }
			label={ item.label }
			variant="minimal"
			tone="neutral"
			size="compact"
			onClick={ () => item.href && console.log( 'Navigate to:', item.href ) }
		/>
	);
}

export default function DocumentBreadcrumb( { items, variant } ) {
	if ( ! items || items.length === 0 ) return null;

	const parentItems = items.slice( 0, -1 );
	const currentItem = items[ items.length - 1 ];
	const currentIcon = ICON_MAP[ currentItem.icon ];
	// The template the current document belongs to (first crumb) — used as the
	// sample "Edit template: …" target inside the document menu.
	const templateName = parentItems[ 0 ]?.label ?? 'Blog Home';

	return (
		<nav aria-label="Document location">
			<Stack direction="row" align="center" gap={ 0 }>
				{ parentItems.map( ( item, i ) => (
					<Fragment key={ i }>
						<ParentItem item={ item } />
						<Separator />
					</Fragment>
				) ) }

				{ /* ── Version A: static icon + label unit, interactive chevron IconButton ── */ }
				{ variant === 'label-button' && (
					<Stack
						direction="row"
						align="center"
						gap="xs"
						style={ { paddingLeft: 'var(--wpds-dimension-gap-xs)' } }
					>
						{ /* Icon + label read as one static unit, 4px apart. */ }
						<Stack direction="row" align="center" gap="xs">
							{ currentIcon && (
								<Icon icon={ currentIcon } size={ 24 } />
							) }
							<Text variant="body-lg">
								{ currentItem.label }
							</Text>
						</Stack>
						{ /* Chevron opens the document menu (its trigger + anchor). */ }
						<DocumentMenu
							templateName={ templateName }
							trigger={
								<IconButton
									icon={ chevronDown }
									label="Switch document"
									variant="minimal"
									tone="neutral"
									size="compact"
								/>
							}
						/>
					</Stack>
				) }

				{ /* ── Version B: Button (icon + label) + separate chevron IconButton ── */ }
				{ variant === 'icon-button' && (
					<Stack direction="row" align="center" gap={ 0 }>
						<Button
							variant="minimal"
							tone="neutral"
							size="compact"
							aria-current="page"
						>
							{ currentIcon && (
								<Button.Icon icon={ currentIcon } />
							) }
							{ currentItem.label }
						</Button>
						<DocumentMenu
							templateName={ templateName }
							trigger={
								<IconButton
									icon={ chevronDown }
									label="Switch document"
									variant="minimal"
									tone="neutral"
									size="compact"
								/>
							}
						/>
					</Stack>
				) }

				{ /* ── Version C: the whole Button opens the document menu ── */ }
				{ variant === 'button' && (
					<DocumentMenu
						templateName={ templateName }
						trigger={
							<Button
								variant="minimal"
								tone="neutral"
								size="compact"
								aria-current="page"
							>
								{ currentIcon && (
									<Button.Icon icon={ currentIcon } />
								) }
								{ currentItem.label }
							</Button>
						}
					/>
				) }
			</Stack>
		</nav>
	);
}
