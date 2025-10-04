import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// If running inside Capacitor on Android, listen for the hardware back button
// and navigate browser history instead of closing the app when possible.
(() => {
	try {
		// Try to locate the Capacitor App plugin at runtime from the global Capacitor object.
		// We'll poll briefly for it because native initialization can occur after the bundle loads.
		const win: any = window as any;

		const findCapacitorApp = () => {
			const Capacitor = win.Capacitor ?? null;
			return win.CapacitorApp ?? (Capacitor && (Capacitor.App || (Capacitor.Plugins && Capacitor.Plugins.App))) ?? null;
		};

		// Diagnostic logs to help confirm runtime wiring on device/emulator
		try {
			console.info('[diag] initial window.Capacitor present:', !!win.Capacitor);
		} catch (e) {}

		let registered = false;
		const tryRegister = () => {
			if (registered) return;
			const CapacitorApp = findCapacitorApp();
			try {
				console.info('[diag] findCapacitorApp ->', !!CapacitorApp);
			} catch (e) {}

			if (CapacitorApp && typeof CapacitorApp.addListener === 'function') {
				registered = true;
				console.info('[diag] registering Capacitor backButton listener');
				CapacitorApp.addListener('backButton', () => {
					try {
						const currentPath = window.location.pathname;

						if (currentPath !== '/') {
							const prev = currentPath;
							// Try to navigate back in SPA history
							try {
								window.history.back();
								console.info('[diag] invoked history.back() from', prev);
							} catch (e) {
								console.warn('[diag] history.back() failed', e);
							}

							// After a short delay, if the path hasn't changed, perform a SPA-friendly fallback
							setTimeout(() => {
								if (window.location.pathname === prev) {
									console.info('[diag] history did not change; performing SPA fallback to root');
									try {
										// Replace current history entry and trigger popstate so React Router responds
										window.history.replaceState({}, '', '/');
										window.dispatchEvent(new PopStateEvent('popstate'));
									} catch (e) {
										// As a last resort, navigate (this triggers a full reload)
										console.warn('[diag] SPA fallback failed, falling back to location.href', e);
										window.location.href = '/';
									}
								}
							}, 150);
						} else {
							// At root: allow default behavior (app will close). We intentionally do nothing.
							console.info('[diag] backButton at root; letting platform handle default behavior');
						}
					} catch (err) {
						console.warn('backButton handler error', err);
					}
				});
			}
		};

			// Try immediately, then poll for up to ~10 seconds for the Capacitor App plugin.
			tryRegister();
			const pollInterval = setInterval(() => {
				tryRegister();
			}, 250);
			setTimeout(() => clearInterval(pollInterval), 10000);

			// Log SPA history changes so we can observe popstate events in DevTools
			try {
				window.addEventListener('popstate', () => {
					try {
						console.info('[diag] popstate fired, path now', window.location.pathname, 'history.length', window.history.length);
					} catch (e) {}
				});
			} catch (e) {}
	} catch (e) {
		// ignore if Capacitor App plugin isn't available at runtime
	}
})();

createRoot(document.getElementById("root")!).render(<App />);
