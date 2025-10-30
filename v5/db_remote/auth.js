/**
 * auth.js - Authentication operations API
 */

import { remoteConfig } from "./config.js";
import { fetchWithTimeout } from "./fetchUtil.js";

/**
 * Auth API class - handles authentication operations
 */
export class AuthAPI {
  /**
   * Authenticate a user with remote server
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<object>} Result object with user data and token if successful
   */
  static async authenticate(username, password) {
    return await fetchWithTimeout(remoteConfig.endpoints.auth, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  /**
   * Get current user from remote server
   * @returns {Promise<object>} Result object with current user
   */
  static async getCurrentUser() {
    return await fetchWithTimeout(remoteConfig.endpoints.currentUser, {
      method: "GET",
    });
  }

  /**
   * Set current user on remote server
   * @param {string} username - Username to set as current
   * @returns {Promise<object>} Result object
   */
  static async setCurrentUser(username) {
    return await fetchWithTimeout(remoteConfig.endpoints.currentUser, {
      method: "PUT",
      body: JSON.stringify({ username }),
    });
  }

  /**
   * Clear current user on remote server (logout)
   * @returns {Promise<object>} Result object
   */
  static async clearCurrentUser() {
    return await fetchWithTimeout(remoteConfig.endpoints.currentUser, {
      method: "DELETE",
    });
  }
}
