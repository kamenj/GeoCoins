/**
 * fetchUtil.js - Generic fetch utility with timeout and error handling
 */

import { remoteConfig } from "./config.js";
import { handleConnectionLoss, isHandlingConnectionLoss } from "./connectionManager.js";

/**
 * Detect if an error indicates connection loss
 * @param {object} error - The error object or result
 * @returns {boolean} True if this is a connection loss error
 */
function isConnectionError(error) {
  if (!error) return false;
  
  // Check error.error string directly (our standard format)
  if (error.error && typeof error.error === 'string' && (
    error.error.includes('Failed to fetch') ||
    error.error.includes('Network error') ||
    error.error.includes('NetworkError') ||
    error.error.includes('net::ERR_') ||
    error.error.includes('ERR_CONNECTION_REFUSED') ||
    error.error.includes('ECONNREFUSED')
  )) {
    return true;
  }
  
  // Network errors in message field
  if (error.message && (
    error.message.includes('Failed to fetch') ||
    error.message.includes('Network error') ||
    error.message.includes('NetworkError') ||
    error.message.includes('net::ERR_') ||
    error.message.includes('ERR_CONNECTION_REFUSED') ||
    error.message.includes('ECONNREFUSED') ||
    error.name === 'TypeError' && error.message.includes('fetch')
  )) {
    return true;
  }
  
  // Timeout errors
  if (error.error === "Request timeout" || error.name === "AbortError") {
    return true;
  }
  
  // Server unreachable (status codes)
  if (error.status !== undefined && (error.status === 0 || error.status >= 500)) {
    return true;
  }
  
  return false;
}

/**
 * Generic fetch wrapper with timeout and error handling
 * @param {string} endpoint - API endpoint (relative to baseUrl)
 * @param {object} options - Fetch options (method, body, headers, silent, etc.)
 * @param {boolean} options.silent - If true, suppress console errors (default: false)
 * @param {boolean} options.skipConnectionHandler - If true, skip connection loss handling (default: false)
 * @returns {Promise<object>} Response object with success flag and data/error
 */
export async function fetchWithTimeout(endpoint, options = {}) {
  // Extract custom flags
  const { silent = false, skipConnectionHandler = false, ...fetchOptions } = options;
  
  // Define the actual fetch operation
  const performFetch = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), remoteConfig.timeout);
    
    try {
      const url = `${remoteConfig.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        headers: { ...remoteConfig.headers, ...fetchOptions.headers },
        credentials: 'include', // Always send cookies (JWT tokens)
        signal: controller.signal,
        ...fetchOptions,
      });
      
      clearTimeout(timeoutId);
      
      // Parse JSON response
      let data = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }
      
      // Check if request was successful
      if (!response.ok) {
        const errorResult = {
          success: false,
          error: data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
        
        // Log error to console unless silent mode
        if (!silent) {
          console.error(`❌ ${fetchOptions.method || 'GET'} ${url} - ${response.status}:`, errorResult.error);
        }
        
        return errorResult;
      }

      // If the server response already has success/data structure, return it directly
      // Otherwise wrap it in our standard format
      if (data && typeof data === 'object' && 'success' in data) {
        return data;
      }
      
      return {
        success: true,
        data: data,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout",
        };
      }
      
      return {
        success: false,
        error: error.message || "Network error",
      };
    }
  };
  
  // Try the fetch operation
  const result = await performFetch();
  
  // If operation failed due to connection loss and we're not skipping the handler
  if (!result.success && !skipConnectionHandler && isConnectionError(result)) {
    // Don't show dialog if already handling a connection loss
    if (!isHandlingConnectionLoss()) {
      console.warn('🔌 Connection lost detected:', {
        endpoint,
        error: result.error,
        status: result.status
      });
      console.warn('🔌 Attempting to reconnect...');
      
      try {
        // Show connection loss dialog and attempt reconnection
        return await handleConnectionLoss(performFetch);
      } catch (handlerError) {
        // User cancelled or max attempts reached
        console.error('❌ Connection handler failed:', handlerError.message);
        return result; // Return original error
      }
    } else {
      // Already handling connection loss, just return error
      console.warn('⏳ Connection handler already active, skipping duplicate');
    }
  }
  
  return result;
}
