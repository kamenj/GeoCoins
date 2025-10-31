/**
 * roles.js - Roles API for remote database
 */

import { fetchWithTimeout } from "./fetchUtil.js";
import { remoteConfig } from "./config.js";

/**
 * RolesAPI - Handles all role-related remote operations
 */
export const RolesAPI = {
  /**
   * Get all roles
   * @returns {Promise<object>} Result with roles array
   */
  async getAll() {
    return fetchWithTimeout("/roles", {
      method: "GET",
    });
  },

  /**
   * Get a role by ID
   * @param {number} id - Role ID
   * @returns {Promise<object>} Result with role data
   */
  async getById(id) {
    return fetchWithTimeout(`/roles/${id}`, {
      method: "GET",
    });
  },

  /**
   * Get a role by name
   * @param {string} name - Role name
   * @returns {Promise<object>} Result with role data
   */
  async getByName(name) {
    return fetchWithTimeout(`/roles?name=${encodeURIComponent(name)}`, {
      method: "GET",
    });
  },

  /**
   * Get roles for a specific user
   * @param {number} userId - User ID
   * @returns {Promise<object>} Result with array of role names
   */
  async getUserRoles(userId) {
    return fetchWithTimeout(`/users/${userId}/roles`, {
      method: "GET",
    });
  },

  /**
   * Assign a role to a user
   * @param {number} userId - User ID
   * @param {number} roleId - Role ID
   * @returns {Promise<object>} Result
   */
  async assignRoleToUser(userId, roleId) {
    return fetchWithTimeout("/user_roles", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, role_id: roleId }),
    });
  },

  /**
   * Remove a role from a user
   * @param {number} userId - User ID
   * @param {number} roleId - Role ID
   * @returns {Promise<object>} Result
   */
  async removeRoleFromUser(userId, roleId) {
    return fetchWithTimeout(`/user_roles/${userId}/${roleId}`, {
      method: "DELETE",
    });
  },

  /**
   * Set all roles for a user (replaces existing roles)
   * @param {number} userId - User ID
   * @param {array} roleIds - Array of role IDs
   * @returns {Promise<object>} Result
   */
  async setUserRoles(userId, roleIds) {
    return fetchWithTimeout(`/users/${userId}/roles`, {
      method: "PUT",
      body: JSON.stringify({ role_ids: roleIds }),
    });
  },
};

export default RolesAPI;
