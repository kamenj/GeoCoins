/**
 * users.js - User operations API
 */

import { remoteConfig } from "./config.js";
import { fetchWithTimeout } from "./fetchUtil.js";

/**
 * Users API class - handles all user-related remote operations
 */
export class UsersAPI {
  /**
   * Get all users from remote server
   * @param {object} params - Query parameters (e.g., page, limit, filter)
   * @returns {Promise<object>} Result object with users array
   */
  static async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${remoteConfig.endpoints.users}?${queryString}`
      : remoteConfig.endpoints.users;
    
    return await fetchWithTimeout(endpoint, { method: "GET" });
  }

  /**
   * Get a user by username from remote server
   * @param {string} username - Username to find
   * @param {boolean} silent - If true, suppress console errors (useful for existence checks)
   * @returns {Promise<object>} Result object with user data
   */
  static async getByUsername(username, silent = false) {
    const endpoint = `${remoteConfig.endpoints.users}/${encodeURIComponent(username)}`;
    return await fetchWithTimeout(endpoint, { method: "GET", silent });
  }

  /**
   * Get a user by ID from remote server
   * @param {number} userId - User ID to find
   * @returns {Promise<object>} Result object with user data
   */
  static async getById(userId) {
    const endpoint = `${remoteConfig.endpoints.users}/${userId}`;
    return await fetchWithTimeout(endpoint, { method: "GET" });
  }

  /**
   * Add a new user to remote server
   * @param {object} user - User object to add
   * @returns {Promise<object>} Result object with created user data
   */
  static async add(user) {
    return await fetchWithTimeout(remoteConfig.endpoints.users, {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  /**
   * Update an existing user on remote server
   * @param {string} username - Username to update
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} Result object with updated user data
   */
  static async update(username, userData) {
    const endpoint = `${remoteConfig.endpoints.users}/${encodeURIComponent(username)}`;
    return await fetchWithTimeout(endpoint, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  /**
   * Delete a user from remote server
   * @param {string} username - Username to delete
   * @returns {Promise<object>} Result object
   */
  static async delete(username) {
    const endpoint = `${remoteConfig.endpoints.users}/${encodeURIComponent(username)}`;
    return await fetchWithTimeout(endpoint, {
      method: "DELETE",
    });
  }

  /**
   * Get multiple users by usernames (batch operation)
   * @param {string[]} usernames - Array of usernames
   * @returns {Promise<object>} Result object with users array
   */
  static async getByUsernames(usernames) {
    const usernamesParam = usernames.join(",");
    const endpoint = `${remoteConfig.endpoints.users}/batch?usernames=${usernamesParam}`;
    return await fetchWithTimeout(endpoint, { method: "GET" });
  }

  /**
   * Get paginated users
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page
   * @param {object} filters - Optional filters (role, search, etc.)
   * @returns {Promise<object>} Result with users array and pagination metadata
   */
  static async getPaginated(page = 1, limit = 20, filters = {}) {
    const params = {
      page,
      limit,
      ...filters,
    };
    return await this.getAll(params);
  }

  /**
   * Check if a username exists (returns 200 OK with exists flag)
   * @param {string} username - Username to check
   * @returns {Promise<object>} Result with exists: true/false
   */
  static async checkUsernameExists(username) {
    const endpoint = `${remoteConfig.endpoints.users}/check/${encodeURIComponent(username)}`;
    return await fetchWithTimeout(endpoint, { method: "GET" });
  }
}
