import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { register } from './serviceWorker';  // Importando a função register corretamente

import App from "./App";

// Desabilitar overlay de erros em desenvolvimento
if (process.env.NODE_ENV === 'development') {
	const originalError = console.error;
	console.error = (...args) => {
		if (typeof args[0] === 'string' && args[0].includes('Request failed')) {
			return;
		}
		originalError.apply(console, args);
	};

	// Desabilitar o overlay do React
	window.addEventListener('error', (e) => {
		if (e.message.includes('Request failed')) {
			e.stopImmediatePropagation();
		}
	});
}

ReactDOM.render(
	<CssBaseline>
		<App />
	</CssBaseline>,
	document.getElementById("root"),
	() => {
		window.finishProgress();
	}
);

// Registrar o service worker
register();
