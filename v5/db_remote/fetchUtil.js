/**
 * fetchUtil.js - Generic fetch utility with timeout and error handling
 */

import { remoteConfig } from "./config.js";

/**
 * Generic fetch wrapper with timeout and error handling
 * @param {string} endpoint - API endpoint (relative to baseUrl)
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} Response object with success flag and data/error
 */
export async function fetchWithTimeout(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), remoteConfig.timeout);
  
  try {
    const url = `${remoteConfig.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: { ...remoteConfig.headers, ...options.headers },
      signal: controller.signal,
      ...options,
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
      return {
        success: false,
        error: data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
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
