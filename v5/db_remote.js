/**
 * db_remote.js - Remote database API implementation
 * Handles all communication with the remote server via JSON API calls
 * 
 * This file provides backward compatibility with the original flat API structure.
 * The new modular structure is available in the db_remote/ subfolder.
 */

// Import the new modular API
import { 
  initRemoteDB, 
  getRemoteConfig, 
  setAuthToken,
  UsersAPI,
  PointsAPI,
  AuthAPI,
  SettingsAPI,
  AdminAPI
} from "./db_remote/index.js";

// Re-export configuration functions
export { initRemoteDB, getRemoteConfig, setAuthToken };

// ===== USER OPERATIONS =====
// Backward compatibility wrappers for the original flat API

/**
 * Get all users from remote server
 * @param {object} params - Query parameters (e.g., page, limit, filter)
 * @returns {Promise<object>} Result object with users array
 */
export async function remoteGetAllUsers(params = {}) {
  return await UsersAPI.getAll(params);
}

/**
 * Get a user by username from remote server
 * @param {string} username - Username to find
 * @returns {Promise<object>} Result object with user data
 */
export async function remoteGetUserByUsername(username) {
  return await UsersAPI.getByUsername(username);
}

/**
 * Add a new user to remote server
 * @param {object} user - User object to add
 * @returns {Promise<object>} Result object with created user data
 */
export async function remoteAddUser(user) {
  return await UsersAPI.add(user);
}

/**
 * Update an existing user on remote server
 * @param {string} username - Username to update
 * @param {object} userData - Updated user data
 * @returns {Promise<object>} Result object with updated user data
 */
export async function remoteUpdateUser(username, userData) {
  return await UsersAPI.update(username, userData);
}

/**
 * Delete a user from remote server
 * @param {string} username - Username to delete
 * @returns {Promise<object>} Result object
 */
export async function remoteDeleteUser(username) {
  return await UsersAPI.delete(username);
}

/**
 * Authenticate a user with remote server
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<object>} Result object with user data and token if successful
 */
export async function remoteAuthenticateUser(username, password) {
  return await AuthAPI.authenticate(username, password);
}

// ===== MAP POINTS OPERATIONS =====
// Backward compatibility wrappers for the original flat API

/**
 * Get all map points from remote server
 * @param {object} params - Query parameters (e.g., username, page, limit, bounds)
 * @returns {Promise<object>} Result object with points array
 */
export async function remoteGetAllPoints(params = {}) {
  return await PointsAPI.getAll(params);
}

/**
 * Get a map point by ID from remote server
 * @param {number} id - Point ID
 * @returns {Promise<object>} Result object with point data
 */
export async function remoteGetPointById(id) {
  return await PointsAPI.getById(id);
}

/**
 * Add a new map point to remote server
 * @param {object} point - Point object to add
 * @returns {Promise<object>} Result object with created point data
 */
export async function remoteAddPoint(point) {
  return await PointsAPI.add(point);
}

/**
 * Update an existing map point on remote server
 * @param {number} id - Point ID to update
 * @param {object} pointData - Updated point data
 * @returns {Promise<object>} Result object with updated point data
 */
export async function remoteUpdatePoint(id, pointData) {
  return await PointsAPI.update(id, pointData);
}

/**
 * Delete a map point from remote server
 * @param {number} id - Point ID to delete
 * @returns {Promise<object>} Result object
 */
export async function remoteDeletePoint(id) {
  return await PointsAPI.delete(id);
}

// ===== SETTINGS OPERATIONS =====
// Backward compatibility wrappers for the original flat API

/**
 * Get user settings from remote server
 * @returns {Promise<object>} Result object with settings
 */
export async function remoteGetSettings() {
  return await SettingsAPI.get();
}

/**
 * Save user settings to remote server
 * @param {object} settings - Settings object
 * @returns {Promise<object>} Result object
 */
export async function remoteSaveSettings(settings) {
  return await SettingsAPI.save(settings);
}

// ===== SESSION OPERATIONS =====
// Backward compatibility wrappers for the original flat API

/**
 * Get current user from remote server
 * @returns {Promise<object>} Result object with current user
 */
export async function remoteGetCurrentUser() {
  return await AuthAPI.getCurrentUser();
}

/**
 * Set current user on remote server
 * @param {string} username - Username to set as current
 * @returns {Promise<object>} Result object
 */
export async function remoteSetCurrentUser(username) {
  return await AuthAPI.setCurrentUser(username);
}

/**
 * Clear current user on remote server (logout)
 * @returns {Promise<object>} Result object
 */
export async function remoteClearCurrentUser() {
  return await AuthAPI.clearCurrentUser();
}

// ===== BATCH OPERATIONS =====
// Backward compatibility wrappers for the original flat API

/**
 * Get multiple points by IDs (batch operation)
 * @param {number[]} ids - Array of point IDs
 * @returns {Promise<object>} Result object with points array
 */
export async function remoteGetPointsByIds(ids) {
  return await PointsAPI.getByIds(ids);
}

/**
 * Get multiple users by usernames (batch operation)
 * @param {string[]} usernames - Array of usernames
 * @returns {Promise<object>} Result object with users array
 */
export async function remoteGetUsersByUsernames(usernames) {
  return await UsersAPI.getByUsernames(usernames);
}

// ===== ADMIN OPERATIONS =====
// Backward compatibility wrappers for the original flat API

/**
 * Reset all data on remote server (admin only)
 * @returns {Promise<object>} Result object
 */
export async function remoteResetAllData() {
  return await AdminAPI.resetAllData();
}

/**
 * Get server statistics (admin only)
 * @returns {Promise<object>} Result object with statistics
 */
export async function remoteGetStatistics() {
  return await AdminAPI.getStatistics();
}

/**
 * Health check endpoint
 * @returns {Promise<object>} Result object with server health status
 */
export async function remoteHealthCheck() {
  return await AdminAPI.healthCheck();
}

// ===== PAGINATION HELPERS =====
// Backward compatibility wrappers for the original flat API

/**
 * Get paginated users
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @param {object} filters - Optional filters (role, search, etc.)
 * @returns {Promise<object>} Result with users array and pagination metadata
 */
export async function remoteGetUsersPaginated(page = 1, limit = 20, filters = {}) {
  return await UsersAPI.getPaginated(page, limit, filters);
}

/**
 * Get paginated points
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @param {object} filters - Optional filters (username, status, bounds, etc.)
 * @returns {Promise<object>} Result with points array and pagination metadata
 */
export async function remoteGetPointsPaginated(page = 1, limit = 20, filters = {}) {
  return await PointsAPI.getPaginated(page, limit, filters);
}

/**
 * Get points within map bounds (for map view)
 * @param {object} bounds - Map bounds {north, south, east, west}
 * @param {number} limit - Maximum number of points to return
 * @returns {Promise<object>} Result with points array
 */
export async function remoteGetPointsInBounds(bounds, limit = 100) {
  return await PointsAPI.getInBounds(bounds, limit);
}

// Export all remote API functions (backward compatibility)
export default {
  // Configuration
  initRemoteDB,
  getRemoteConfig,
  setAuthToken,
  
  // Users (backward compatible flat API)
  remoteGetAllUsers,
  remoteGetUserByUsername,
  remoteAddUser,
  remoteUpdateUser,
  remoteDeleteUser,
  remoteAuthenticateUser,
  
  // Map Points (backward compatible flat API)
  remoteGetAllPoints,
  remoteGetPointById,
  remoteAddPoint,
  remoteUpdatePoint,
  remoteDeletePoint,
  
  // Settings (backward compatible flat API)
  remoteGetSettings,
  remoteSaveSettings,
  
  // Session (backward compatible flat API)
  remoteGetCurrentUser,
  remoteSetCurrentUser,
  remoteClearCurrentUser,
  
  // Batch Operations (backward compatible flat API)
  remoteGetPointsByIds,
  remoteGetUsersByUsernames,
  
  // Admin (backward compatible flat API)
  remoteResetAllData,
  remoteGetStatistics,
  remoteHealthCheck,
  
  // Pagination (backward compatible flat API)
  remoteGetUsersPaginated,
  remoteGetPointsPaginated,
  remoteGetPointsInBounds,
  
  // New organized API classes (recommended for new code)
  Users: UsersAPI,
  Points: PointsAPI,
  Auth: AuthAPI,
  Settings: SettingsAPI,
  Admin: AdminAPI,
};
