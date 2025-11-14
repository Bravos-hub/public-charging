import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './core';

// Prevent reload loops in development - MUST RUN IMMEDIATELY, BEFORE ANYTHING ELSE
if (process.env.NODE_ENV !== 'production') {
  try {
    // Override window.location.reload to prevent accidental reloads
    const originalReload = window.location.reload.bind(window.location);
    let reloadBlocked = false;

    const safeReload = (forcedReload?: boolean): void => {
      if (reloadBlocked) {
        console.warn('Reload blocked in development mode');
        return;
      }
      // Only allow reload if explicitly forced
      if (forcedReload === true) {
        reloadBlocked = true;
        originalReload();
      } else {
        console.warn('Reload prevented in development. Use location.reload(true) to force.');
      }
    };

    const patchReload = (): boolean => {
      try {
        (window.location as any).reload = safeReload;
        return true;
      } catch {
        // ignore and fall back to prototype patch
      }
      if (window.Location?.prototype) {
        try {
          Object.defineProperty(window.Location.prototype, 'reload', {
            configurable: true,
            value(this: Location, forced?: boolean) {
              safeReload(forced);
            },
          });
          return true;
        } catch {
          // Prototype patching not supported
        }
      }
      return false;
    };

    if (!patchReload()) {
      console.warn('Reload override not supported; dev reload guard disabled.');
    }
  } catch (err) {
    console.warn('Failed to set reload override:', err);
  }
  
  // IMMEDIATELY unregister all service workers - don't wait for 'load' event
  // This must run synchronously before React renders to prevent reload loops
  if ('serviceWorker' in navigator) {
    // Block ALL service worker events immediately to prevent reloads
    const blockSWEvents = (e: Event) => {
      e.stopImmediatePropagation();
      e.preventDefault();
      console.warn('Service worker event blocked in development:', e.type);
    };
    
    navigator.serviceWorker.addEventListener('controllerchange', blockSWEvents, { capture: true, passive: false });
    navigator.serviceWorker.addEventListener('message', blockSWEvents, { capture: true, passive: false });
    
    // Unregister all service workers immediately (async but we start it now)
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => {
        // Unregister the registration
        r.unregister().catch(() => {});
        // If there's a waiting worker, tell it to skip waiting (but we'll unregister it anyway)
        if (r.waiting) {
          try {
            r.waiting.postMessage('skipWaiting');
          } catch {}
        }
        // If there's an installing worker, abort it
        if (r.installing) {
          try {
            r.installing.postMessage({ type: 'ABORT' });
          } catch {}
        }
      });
    }).catch(() => {});
    
    // Clear all caches immediately
    caches.keys().then((keys) => {
      keys.forEach((k) => caches.delete(k).catch(() => {}));
    }).catch(() => {});
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const appTree = (
  <AppProvider>
    <App />
  </AppProvider>
);

if (process.env.NODE_ENV === 'production') {
  root.render(<React.StrictMode>{appTree}</React.StrictMode>);
} else {
  // Avoid StrictMode double-invoke in development to reduce perceived flicker
  root.render(appTree);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
