/**
 * Global Error Handler Module
 * Intercepts and logs all JavaScript errors to State.Errors
 */

/**
 * Format error details for logging (similar to browser console)
 */
function formatErrorDetails(errorInfo) {
  return {
    timestamp: new Date().toISOString(),
    type: errorInfo.type || 'error',
    message: errorInfo.message || 'Unknown error',
    source: errorInfo.source || null,
    line: errorInfo.lineno || null,
    column: errorInfo.colno || null,
    stack: errorInfo.stack || null,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
}

/**
 * Check if error should be ignored (benign browser warnings)
 */
function shouldIgnoreError(message) {
  const ignoredPatterns = [
    /ResizeObserver loop completed with undelivered notifications/i,
    /ResizeObserver loop limit exceeded/i
  ];
  
  return ignoredPatterns.some(pattern => pattern.test(message));
}

/**
 * Add error to State.Errors array
 */
function logError(errorDetails) {
  // Ignore benign errors
  if (shouldIgnoreError(errorDetails.message)) {
    console.log('Ignored benign error:', errorDetails.message);
    return;
  }
  
  // Initialize State.Errors if not exists
  if (!window.State) {
    window.State = {};
  }
  if (!window.State.Errors) {
    window.State.Errors = [];
  }
  
  window.State.Errors.push(errorDetails);
  console.error('Error logged:', errorDetails);
  
  // Update error indicator if function exists
  if (window.updateErrorIndicator) {
    window.updateErrorIndicator();
  }
}

/**
 * Install global error handler for synchronous errors
 */
export function installGlobalErrorHandler() {
  if (!window.Config || !window.Config.Errors_GlobalHandlerEnabled) {
    return;
  }

  window.onerror = function(message, source, lineno, colno, error) {
    const errorDetails = formatErrorDetails({
      type: 'JavaScript Error',
      message: message,
      source: source,
      lineno: lineno,
      colno: colno,
      stack: error ? error.stack : null
    });
    
    logError(errorDetails);
    
    // Return false to allow default browser error handling
    return false;
  };

  // console.log('Global error handler installed');
}

/**
 * Install handler for unhandled promise rejections
 */
export function installPromiseRejectionHandler() {
  if (!window.Config || !window.Config.Errors_GlobalHandlerEnabled) {
    return;
  }

  window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason;
    const errorDetails = formatErrorDetails({
      type: 'Unhandled Promise Rejection',
      message: reason ? (reason.message || reason.toString()) : 'Unknown rejection',
      stack: reason && reason.stack ? reason.stack : null
    });
    
    logError(errorDetails);
    
    // Prevent default handling
    event.preventDefault();
  });

  // console.log('Promise rejection handler installed');
}

/**
 * Initialize all error handlers
 */
export function initializeErrorHandlers() {
  if (!window.Config || !window.Config.Errors_GlobalHandlerEnabled) {
    // console.log('Error handlers disabled in config');
    return;
  }

  installGlobalErrorHandler();
  installPromiseRejectionHandler();
  
  // console.log('Error handlers initialized');
}

/**
 * Clear all logged errors
 */
export function clearErrors() {
  if (!window.State) return;
  window.State.Errors = [];
  if (window.updateErrorIndicator) {
    window.updateErrorIndicator();
  }
}

/**
 * Get all logged errors
 */
export function getErrors() {
  return window.State && window.State.Errors ? window.State.Errors : [];
}

/**
 * Check if there are any errors
 */
export function hasErrors() {
  return window.State && window.State.Errors && window.State.Errors.length > 0;
}
