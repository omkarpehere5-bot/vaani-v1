/**
 * Utility to suppress harmless ResizeObserver loop errors
 * This error occurs when ResizeObserver callbacks trigger DOM changes
 * that cause additional resize events, creating a loop.
 * 
 * The error is typically harmless but can clutter the console.
 */

export function suppressResizeObserverErrors() {
  // Store original error handler
  const originalError = window.onerror;
  const originalUnhandledRejection = window.onunhandledrejection;

  // Override error handler to filter out ResizeObserver errors
  window.onerror = function(message, source, lineno, colno, error) {
    if (
      typeof message === 'string' && 
      message.includes('ResizeObserver loop completed with undelivered notifications')
    ) {
      // Suppress this specific error
      return true;
    }
    
    // Call original error handler for other errors
    if (originalError) {
      return originalError.call(this, message, source, lineno, colno, error);
    }
    
    return false;
  };

  // Also handle unhandled promise rejections that might contain this error
  window.onunhandledrejection = function(event) {
    if (
      event.reason && 
      typeof event.reason.message === 'string' &&
      event.reason.message.includes('ResizeObserver loop completed with undelivered notifications')
    ) {
      // Suppress this specific error
      event.preventDefault();
      return;
    }
    
    // Call original handler for other rejections
    if (originalUnhandledRejection) {
      return originalUnhandledRejection.call(this, event);
    }
  };
}

/**
 * Debounced ResizeObserver wrapper to prevent loops
 */
export function createDebounceResizeObserver(
  callback: ResizeObserverCallback,
  delay: number = 100
): ResizeObserver {
  let timeoutId: number | null = null;
  
  return new ResizeObserver((entries, observer) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      callback(entries, observer);
      timeoutId = null;
    }, delay);
  });
}
