import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig( {
	// Relative asset paths so the SAME build works both at the Vercel root and
	// under a subpath (e.g. www.fvm.house/prototype/editor-header-breadcrumb/).
	// Safe here: the prototype has no client-side routing.
	base: './',
	plugins: [ react() ],
	resolve: {
		// Prevent duplicate React instances when @wordpress packages
		// internally import their own copy.
		//
		// `@wordpress/private-apis` MUST resolve to a single instance: its
		// lock/unlock share one module-scoped WeakMap. If it were duplicated,
		// the `Menu` component unlocked in DocumentMenu would point at a
		// different WeakMap than the one `@wordpress/components` locked with,
		// and `unlock()` would throw.
		dedupe: [
			'react',
			'react-dom',
			'@wordpress/element',
			'@wordpress/private-apis',
			'@wordpress/components',
		],
	},
	optimizeDeps: {
		// Pre-bundle these together in one esbuild pass so the shared
		// `@wordpress/private-apis` instance is a single shared chunk.
		include: [
			'@wordpress/components',
			'@wordpress/private-apis',
			'@ariakit/react',
		],
	},
} );
