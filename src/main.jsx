import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@wordpress/theme/design-tokens.css';
import '@wordpress/components/build-style/style.css';
import './styles/global.css';
import './styles/admin-bar.css';
import App from './App.jsx';

createRoot( document.getElementById( 'root' ) ).render(
	<StrictMode>
		<App />
	</StrictMode>
);
