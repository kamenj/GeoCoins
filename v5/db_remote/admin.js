/**
 * admin.js - Admin operations API
 */

import { remoteConfig } from "./config.js";
import { fetchWithTimeout } from "./fetchUtil.js";

/**
 * Admin API class - handles admin operations
 */
export class AdminAPI {
  /**
   * Reset all data on remote server (admin only)
   * @returns {Promise<object>} Result object
   */
  static async resetAllData() {
    return await fetchWithTimeout(remoteConfig.endpoints.reset, {
      method: "POST",
    });
  }

  /**
   * Get server statistics (admin only)
   * @returns {Promise<object>} Result object with statistics
   */
  static async getStatistics() {
    return await fetchWithTimeout("/statistics", {
      method: "GET",
    });
  }

  /**
   * Health check endpoint
   * @returns {Promise<object>} Result object with server health status
   */
  static async healthCheck() {
    return await fetchWithTimeout("/health", {
      method: "GET",
    });
  }
}
