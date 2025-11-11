/**
 * SSE Client with Backoff (TypeScript)
 * Purpose: robust EventSource wrapper with backoff + visibility pause
 */

export interface SseClientOptions {
  onEvent?: (data: any) => void;
  onOpen?: (event: Event) => void;
  onError?: (event: Event) => void;
  maxDelayMs?: number;
}

export type Unsubscribe = () => void;

export function createSseClient(
  url: string,
  options: SseClientOptions = {}
): Unsubscribe {
  const { onEvent, onOpen, onError, maxDelayMs = 15000 } = options;
  let es: EventSource | null = null;
  let stopped = false;
  let delay = 1000;

  function start(): void {
    if (stopped) return;
    es = new EventSource(url);
    es.onopen = (e: Event) => {
      delay = 1000;
      onOpen?.(e);
    };
    es.onmessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onEvent?.(data);
      } catch (err) {
        // Silently ignore parse errors
      }
    };
    es.onerror = (e: Event) => {
      onError?.(e);
      restart();
    };
  }

  function restart(): void {
    if (es) {
      try {
        es.close();
      } catch (_) {
        // Ignore close errors
      }
      es = null;
    }
    if (stopped) return;
    setTimeout(start, delay);
    delay = Math.min(maxDelayMs, delay * 2);
  }

  function stop(): void {
    stopped = true;
    if (es) {
      try {
        es.close();
      } catch (_) {
        // Ignore close errors
      }
    }
  }

  // Pause/resume on tab visibility
  function onVis(): void {
    if (document.hidden) {
      stop();
    } else {
      stopped = false;
      start();
    }
  }

  document.addEventListener('visibilitychange', onVis);
  start();

  return (): void => {
    document.removeEventListener('visibilitychange', onVis);
    stop();
  };
}

