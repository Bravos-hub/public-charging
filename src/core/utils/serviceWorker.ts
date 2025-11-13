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

