import { useState } from 'react';
import { scenarios } from './data/scenarios.js';
import WordPressAdminBar from './components/WordPressAdminBar.jsx';
import EditorHeader from './components/EditorHeader.jsx';

const styles = {
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		width: '100%',
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	},

	/*
	 * Prototype-only scenario switcher — not part of the design. Given a
	 * light-gray surface so it reads as a separate dev control strip, clearly
	 * distinct from the dark (#1e1e1e) admin bar below it. Inner colors meet
	 * WCAG AA on this background: text ≥ 4.5:1, control borders ≥ 3:1.
	 */
	scenarioBar: {
		display: 'flex',
		alignItems: 'center',
		gap: '6px',
		padding: '6px 12px',
		backgroundColor: '#e0e0e0',
		flexShrink: 0,
	},
	scenarioLabel: {
		color: '#50575e', // gray-700 on #e0e0e0 → 5.5:1
		fontSize: '11px',
		marginRight: '2px',
		whiteSpace: 'nowrap',
	},
	scenarioBtn: ( isActive ) => ( {
		padding: '3px 10px',
		borderRadius: '4px',
		// Selected state is a neutral "raised" white chip — no loud blue fill.
		// active:  white bg + bold #1e1e1e text (16:1)
		// inactive: transparent + muted #50575e text (5.5:1)
		// border #757575 on the bar → 3.5:1 (both states).
		border: '1px solid #757575',
		backgroundColor: isActive ? '#fff' : 'transparent',
		color: isActive ? '#1e1e1e' : '#50575e',
		fontWeight: isActive ? 600 : 400,
		cursor: 'pointer',
		fontSize: '11px',
		lineHeight: '1.5',
	} ),

	/* Editor canvas — near-white, fills remaining height */
	canvas: {
		flex: 1,
		backgroundColor: '#fcfcfc',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#1e1e1e',
		fontSize: '13px',
		overflow: 'hidden',
		minHeight: 0,
	},
};

export default function App() {
	const [ activeId, setActiveId ] = useState( scenarios[ 0 ].id );
	const activeScenario = scenarios.find( ( s ) => s.id === activeId );

	return (
		<div style={ styles.root }>
			<div style={ styles.scenarioBar }>
				<span style={ styles.scenarioLabel }>Version:</span>
				{ scenarios.map( ( s ) => (
					<button
						key={ s.id }
						onClick={ () => setActiveId( s.id ) }
						style={ styles.scenarioBtn( s.id === activeId ) }
					>
						{ s.label }
					</button>
				) ) }
			</div>

			<WordPressAdminBar />

			<EditorHeader scenario={ activeScenario } />

			<div style={ styles.canvas }>Block Editor</div>
		</div>
	);
}
