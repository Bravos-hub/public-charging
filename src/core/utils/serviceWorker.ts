/**
 * Service worker registration helper.
 * Registers the service worker at `/service-worker.js` in production builds.
 */

export function register(): void {
  if ('serviceWorker' in navigator) {
    const swUrl = '/service-worker.js';
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(swUrl)
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.warn('SW registration failed:', err);
        });
    });
  }
}

export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister());
    });
  }
}

/**
 * Register the service worker and notify when an update is available (waiting state).
 * Calls `onUpdate` when a new SW has installed and is waiting to activate.
 */
export function registerWithUpdate(onUpdate: (reg: ServiceWorkerRegistration) => void): void {
  if (!('serviceWorker' in navigator)) return;
  const swUrl = '/service-worker.js';
  const doRegister = (): void => {
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        // If there's an already waiting worker, signal immediately
        if (reg.waiting) onUpdate(reg);

        // Listen for updates found
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              // New update available
              onUpdate(reg);
            }
          });
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('SW registration failed:', err);
      });
  };
  if (document.readyState === 'complete') doRegister();
  else window.addEventListener('load', doRegister, { once: true });
}

/**
 * Attempt to activate a waiting service worker and reload the page when ready.
 */
export function activateUpdate(reg: ServiceWorkerRegistration): void {
  // Never reload in development
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  
  if (!('serviceWorker' in navigator)) {
    return; // Don't reload if service worker isn't supported
  }
  
  // Prevent multiple reload attempts
  if ((window as any).__swReloading) {
    return;
  }
  (window as any).__swReloading = true;
  
  if (reg.waiting) {
    // Some SWs listen for a SKIP_WAITING message
    try {
      reg.waiting.postMessage('skipWaiting');
    } catch {}
  }
  
  // Reload on controller change (only once)
  const handleControllerChange = () => {
    if (!(window as any).__swReloaded) {
      (window as any).__swReloaded = true;
      window.location.reload();
    }
  };
  
  navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange, { once: true });
  
  // Fallback reload after short delay in case controllerchange doesn't fire
  setTimeout(() => {
    if (document.visibilityState === 'visible' && !(window as any).__swReloaded) {
      (window as any).__swReloaded = true;
      window.location.reload();
    }
  }, 1500);
}
