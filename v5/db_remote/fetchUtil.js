/**
 * fetchUtil.js - Generic fetch utility with timeout and error handling
 */

import { remoteConfig } from "./config.js";

/**
 * Generic fetch wrapper with timeout and error handling
 * @param {string} endpoint - API endpoint (relative to baseUrl)
 * @param {object} options - Fetch options (method, body, headers, silent, etc.)
 * @param {boolean} options.silent - If true, suppress console errors (default: false)
 * @returns {Promise<object>} Response object with success flag and data/error
 */
export async function fetchWithTimeout(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), remoteConfig.timeout);
  
  // Extract silent flag and remove it from options before passing to fetch
  const { silent = false, ...fetchOptions } = options;
  
  try {
    const url = `${remoteConfig.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: { ...remoteConfig.headers, ...fetchOptions.headers },
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
}
