/**
 * EditorHeader
 *
 * Reconstructs the block editor toolbar using @wordpress/ui components.
 * Design reference: https://www.figma.com/design/61XvHsq3I7yipitlk7RmmB/Editor-s-header?node-id=17-5388
 *
 * Three regions — left toolbar / center breadcrumb / right toolbar.
 * Left and right toolbars are identical across all three design versions.
 * The center varies by scenario `variant` (see DocumentBreadcrumb).
 *
 * --- Gutenberg implementation notes (by toolbar button) ---
 *
 * LEFT TOOLBAR
 *   Exit         → edit-site: Back button  |  edit-post: close/X button
 *   Inserter (+) → packages/editor/src/components/inserter/index.js
 *   Styles (✏)  → packages/edit-site/src/components/global-styles/index.js
 *   Undo / Redo  → dispatch( 'core/editor' ).undo() / .redo()
 *   List view    → packages/editor/src/components/list-view/index.js
 *
 * RIGHT TOOLBAR
 *   Preview      → packages/editor/src/components/post-preview-button/index.js
 *   View         → appearance / view options panel
 *   Settings     → packages/editor/src/components/sidebar/index.js (sidebar toggle)
 *   Save         → packages/editor/src/components/entities-saved-states/index.js
 *   More options → editor options menu
 */

import { useState } from 'react';
import { Button, IconButton } from '@wordpress/ui';
import {
	plus,
	pencil,
	undo,
	redo,
	listView,
	desktop,
	styles as stylesIcon,
	drawerRight,
	moreVertical,
} from '@wordpress/icons';
import DocumentBreadcrumb from './DocumentBreadcrumb.jsx';

const styles = {
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: '64px',
		backgroundColor: '#fff',
		borderBottom: '1px solid #e0e0e0',
		padding: '0 16px',
		boxSizing: 'border-box',
		flexShrink: 0,
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
		flexShrink: 0,
	},
	center: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
};

export default function EditorHeader( { scenario } ) {
	const [ isListViewActive, setListViewActive ] = useState( false );
	const [ isSidebarActive, setSidebarActive ] = useState( false );

	return (
		<header style={ styles.header } role="banner">
			{ /* ── Left toolbar (Figma node 17:4964 / 17:5198 / 17:5250) ── */ }
			<div style={ styles.toolbar }>
				<Button
					variant="outline"
					tone="neutral"
					size="compact"
					onClick={ () => console.log( 'Exit editor' ) }
				>
					Exit
				</Button>

				{ /* Block inserter — solid brand style matches Figma */ }
				<IconButton
					icon={ plus }
					label="Toggle block inserter"
					variant="solid"
					tone="brand"
					size="compact"
				/>

				{ /* Styles panel (pencil icon) */ }
				<IconButton
					icon={ pencil }
					label="Styles"
					variant="minimal"
					tone="neutral"
					size="compact"
				/>

				<IconButton
					icon={ undo }
					label="Undo"
					variant="minimal"
					tone="neutral"
					size="compact"
				/>
				<IconButton
					icon={ redo }
					label="Redo"
					variant="minimal"
					tone="neutral"
					size="compact"
				/>

				<IconButton
					icon={ listView }
					label="List View"
					variant="minimal"
					tone="neutral"
					size="compact"
					aria-pressed={ isListViewActive }
					onClick={ () => setListViewActive( ( v ) => ! v ) }
				/>
			</div>

			{ /* ── Center: document breadcrumb ─────────────────────────── */ }
			<div style={ styles.center }>
				<DocumentBreadcrumb
					items={ scenario.items }
					variant={ scenario.variant }
				/>
			</div>

			{ /* ── Right toolbar (Figma node 17:4971 / 17:5302 / 17:5345) ── */ }
			<div style={ styles.toolbar }>
				{ /* Preview — desktop icon */ }
				<IconButton
					icon={ desktop }
					label="Preview"
					variant="minimal"
					tone="neutral"
					size="compact"
				/>

				{ /* Styles / appearance options */ }
				<IconButton
					icon={ stylesIcon }
					label="Styles"
					variant="minimal"
					tone="neutral"
					size="compact"
				/>

				{ /* Settings sidebar toggle — drawer-right icon */ }
				<IconButton
					icon={ drawerRight }
					label="Settings"
					variant="minimal"
					tone="neutral"
					size="compact"
					aria-pressed={ isSidebarActive }
					onClick={ () => setSidebarActive( ( v ) => ! v ) }
				/>

				<Button
					variant="solid"
					tone="brand"
					size="compact"
					onClick={ () => console.log( 'Save' ) }
				>
					Save
				</Button>

				<IconButton
					icon={ moreVertical }
					label="More options"
					variant="minimal"
					tone="neutral"
					size="compact"
				/>
			</div>
		</header>
	);
}
