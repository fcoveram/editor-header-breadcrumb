/**
 * WordPressAdminBar
 *
 * A faithful, NON-functional replica of the WordPress admin bar (Toolbar),
 * rendered directly above the editor header to place the prototype in
 * realistic context.
 *
 * Reference: https://github.com/WordPress/gutenberg/pull/77964
 *   ("Add experiment to show admin bar in Post and Site Editor")
 *
 * IMPLEMENTATION NOTE FOR DEVELOPERS
 * ──────────────────────────────────
 * There is no admin bar to build in JS. The real `#wpadminbar` is printed
 * server-side by WordPress on every page. PR #77964 simply stops the
 * fullscreen editor from covering it — it adds the body class
 * `.is-admin-bar-in-editor-enabled` (registered by the
 * `gutenberg-admin-bar-in-editor` experiment in
 * `lib/experimental/admin-bar-in-editor/load.php`) and replaces the top-left
 * site icon with an explicit Back button so users can exit the editor.
 *
 * This component only re-creates the bar's *appearance* (see
 * `src/styles/admin-bar.css`, which mirrors `wp-includes/css/admin-bar.css`).
 * Dynamic fields below use SAMPLE data; every control is a dummy.
 */

/* ── Sample data for the dynamic fields ─────────────────────────────────── */
const SITE_NAME = 'My WordPress site';
const USER_NAME = 'Fran';
const COMMENT_COUNT = 0;

/*
 * Real dashicon path data (viewBox "0 0 20 20"), inlined so the prototype
 * doesn't need to load the Dashicons icon font. Codepoints map to the glyphs
 * the core admin bar uses:
 *   wordpress \f120 · admin-home \f102 · admin-comments \f101 · plus \f132
 */
const DASHICON = {
	wordpress:
		'M20 10c0-5.52-4.48-10-10-10s-10 4.48-10 10 4.48 10 10 10 10-4.48 10-10zM10 1.010c4.97 0 8.99 4.020 8.99 8.99s-4.020 8.99-8.99 8.99-8.99-4.020-8.99-8.99 4.020-8.99 8.99-8.99zM8.010 14.82l-3.050-8.21c0.49-0.030 1.050-0.080 1.050-0.080 0.43-0.050 0.38-1.010-0.060-0.99 0 0-1.29 0.1-2.13 0.1-0.15 0-0.33 0-0.52-0.010 1.44-2.17 3.9-3.6 6.7-3.6 2.090 0 3.99 0.79 5.41 2.090-0.6-0.080-1.45 0.35-1.45 1.42 0 0.66 0.38 1.22 0.79 1.88 0.31 0.54 0.5 1.22 0.5 2.21 0 1.34-1.27 4.48-1.27 4.48l-2.71-7.5c0.48-0.030 0.75-0.16 0.75-0.16 0.43-0.050 0.38-1.1-0.050-1.080 0 0-1.3 0.11-2.14 0.11-0.78 0-2.11-0.11-2.11-0.11-0.43-0.020-0.48 1.060-0.050 1.080l0.84 0.080 1.12 3.040zM14.030 16.97l2.61-6.97s0.67-1.69 0.39-3.81c0.63 1.14 0.94 2.42 0.94 3.81 0 2.96-1.56 5.58-3.94 6.97zM2.68 6.77l3.82 10.48c-2.67-1.3-4.47-4.080-4.47-7.25 0-1.16 0.2-2.23 0.65-3.23zM10.13 11.3l2.29 6.25c-0.75 0.27-1.57 0.42-2.42 0.42-0.72 0-1.41-0.11-2.060-0.3z',
	home: 'M16 8.5l1.53 1.53-1.060 1.060-6.47-6.47-6.47 6.47-1.060-1.060 7.53-7.53 4 4v-2h2v4zM10 6.040l6 5.99v5.97h-12v-5.97zM12 17v-5h-4v5h4z',
	comments:
		'M5 2h9c1.1 0 2 0.9 2 2v7c0 1.1-0.9 2-2 2h-2l-5 5v-5h-2c-1.1 0-2-0.9-2-2v-7c0-1.1 0.9-2 2-2z',
	plus: 'M17 7v3h-5v5h-3v-5h-5v-3h5v-5h3v5h5z',
};

function Dashicon( { path } ) {
	return (
		<span className="wp-admin-bar__icon" aria-hidden="true">
			<svg viewBox="0 0 20 20" focusable="false">
				<path d={ path } />
			</svg>
		</span>
	);
}

/* Controls are intentionally inert — mirror the styles, not the behavior. */
const noop = ( event ) => event.preventDefault();

export default function WordPressAdminBar() {
	return (
		<div className="wp-admin-bar" role="navigation" aria-label="Toolbar">
			{ /* ── Primary group (left) ───────────────────────────────── */ }
			<ul className="wp-admin-bar__group">
				<li>
					<a
						className="wp-admin-bar__item wp-admin-bar__item--logo"
						href="#"
						onClick={ noop }
						aria-label="About WordPress"
					>
						<Dashicon path={ DASHICON.wordpress } />
					</a>
				</li>

				<li>
					<a
						className="wp-admin-bar__item"
						href="#"
						onClick={ noop }
					>
						<Dashicon path={ DASHICON.home } />
						{ SITE_NAME }
					</a>
				</li>

				<li>
					<a
						className="wp-admin-bar__item"
						href="#"
						onClick={ noop }
					>
						⌘K
					</a>
				</li>

				<li>
					<a
						className="wp-admin-bar__item"
						href="#"
						onClick={ noop }
						aria-label={ `${ COMMENT_COUNT } comments awaiting moderation` }
					>
						<Dashicon path={ DASHICON.comments } />
						<span className="wp-admin-bar__count">
							{ COMMENT_COUNT }
						</span>
					</a>
				</li>

				<li>
					<a
						className="wp-admin-bar__item"
						href="#"
						onClick={ noop }
					>
						<Dashicon path={ DASHICON.plus } />
						New
					</a>
				</li>

				<li>
					<a
						className="wp-admin-bar__item"
						href="#"
						onClick={ noop }
					>
						View Page
					</a>
				</li>
			</ul>

			{ /* ── Secondary group (right) — current user ─────────────── */ }
			<ul className="wp-admin-bar__group">
				<li>
					<a
						className="wp-admin-bar__item"
						href="#"
						onClick={ noop }
					>
						Howdy, { USER_NAME }
						<span
							className="wp-admin-bar__avatar"
							aria-hidden="true"
						/>
					</a>
				</li>
			</ul>
		</div>
	);
}
