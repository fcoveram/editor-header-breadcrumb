/**
 * DocumentMenu
 *
 * The document-actions dropdown shown from the breadcrumb's current item.
 * Built with the WordPress `Menu` component — the new Ariakit-based menu that
 * supersedes `DropdownMenu`.
 *
 * Storybook:
 *   https://wordpress.github.io/gutenberg/?path=/docs/components-menu--docs
 *
 * PRIVATE API NOTE
 * ────────────────
 * `Menu` is a 🔒 private API of `@wordpress/components` — it is not exported
 * publicly yet. The editor and Storybook reach it through the private-APIs
 * lock/unlock, and so do we here, so the prototype renders the *real*
 * component. In core this is already unlocked inside editor packages:
 *
 *   import { privateApis as componentsPrivateApis } from '@wordpress/components';
 *   const { Menu } = unlock( componentsPrivateApis );
 *
 * BEHAVIOUR
 * ─────────
 * The menu opens as a `bottom-start` popover anchored to its trigger with an
 * 8px gutter — the same way the editor's `editor-preview-dropdown` toggle
 * opens its menu. The trigger is supplied by the caller via the `trigger` prop
 * (the breadcrumb's chevron IconButton in A/B, the "My pattern" Button in C);
 * `Menu.TriggerButton` renders *as* that element through Ariakit's `render`
 * prop, so the existing control becomes the menu's button + anchor.
 *
 * All items are DUMMY (they only log) — this prototype mirrors styles/behaviour
 * without wiring real document actions.
 *
 * Menu content (Figma 17:5158):
 *   Rename · Duplicate · ─── · [category] All pages ·
 *   [template] Edit template: {name} · ─── · Send to trash
 *
 * Note: `@wordpress/icons` (v12) has no `template` glyph, so the "Edit
 * template" item uses `layout` — WordPress's template icon.
 */

import { privateApis as componentsPrivateApis } from '@wordpress/components';
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@wordpress/private-apis';
import { Icon } from '@wordpress/ui';
import { category, layout } from '@wordpress/icons';

// Opt in to the private APIs the same way a core editor package would. The
// module name must be one of the allow-listed core modules; the consent string
// is verbatim from `@wordpress/private-apis`.
const { unlock } = __dangerousOptInToUnstableAPIsOnlyForCoreModules(
	'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.',
	'@wordpress/editor'
);

const { Menu } = unlock( componentsPrivateApis );

// Dummy handler — actions are inert in the prototype.
const log = ( action ) => () => console.log( 'Document menu:', action );

export default function DocumentMenu( { trigger, templateName = 'Blog Home' } ) {
	return (
		<Menu>
			<Menu.TriggerButton render={ trigger } />
			<Menu.Popover>
				<Menu.Item onClick={ log( 'Rename' ) }>
					<Menu.ItemLabel>Rename</Menu.ItemLabel>
				</Menu.Item>
				<Menu.Item onClick={ log( 'Duplicate' ) }>
					<Menu.ItemLabel>Duplicate</Menu.ItemLabel>
				</Menu.Item>

				<Menu.Separator />

				<Menu.Item
					onClick={ log( 'All pages' ) }
					prefix={ <Icon icon={ category } size={ 24 } /> }
				>
					<Menu.ItemLabel>All pages</Menu.ItemLabel>
				</Menu.Item>
				<Menu.Item
					onClick={ log( 'Edit template' ) }
					prefix={ <Icon icon={ layout } size={ 24 } /> }
				>
					<Menu.ItemLabel>
						Edit template: { templateName }
					</Menu.ItemLabel>
				</Menu.Item>

				<Menu.Separator />

				<Menu.Item onClick={ log( 'Send to trash' ) }>
					<Menu.ItemLabel>Send to trash</Menu.ItemLabel>
				</Menu.Item>
			</Menu.Popover>
		</Menu>
	);
}
