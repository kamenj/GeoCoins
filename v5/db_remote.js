/**
 * db_remote.js - Remote database API implementation
 * Handles all communication with the remote server via JSON API calls
 */

/**
 * Remote database configuration
 */
const remoteConfig = {
  baseUrl: "http://localhost:3000/api",
  endpoints: {
    users: "/users",
    points: "/points",
    auth: "/auth",
    settings: "/settings",
    currentUser: "/current-user",
    reset: "/reset",
  },
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
};

/**
 * Initialize remote database configuration
 * @param {object} config - Configuration object
 */
export function initRemoteDB(config) {
  if (config.baseUrl) {
    remoteConfig.baseUrl = config.baseUrl;
  }
  if (config.endpoints) {
    remoteConfig.endpoints = { ...remoteConfig.endpoints, ...config.endpoints };
  }
  if (config.headers) {
    remoteConfig.headers = { ...remoteConfig.headers, ...config.headers };
  }
  if (config.timeout) {
    remoteConfig.timeout = config.timeout;
  }
}

/**
 * Get current remote configuration
 * @returns {object} Current configuration
 */
export function getRemoteConfig() {
  return { ...remoteConfig };
}

/**
 * Set authentication token for API requests
 * @param {string} token - Authentication token
 */
export function setAuthToken(token) {
  if (token) {
    remoteConfig.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete remoteConfig.headers["Authorization"];
  }
}

/**
 * Generic fetch wrapper with timeout and error handling
 * @param {string} endpoint - API endpoint (relative to baseUrl)
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} Response object with success flag and data/error
 */
async function fetchWithTimeout(endpoint, options = {}) {
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

// ===== USER OPERATIONS =====

/**
 * Get all users from remote server
 * @param {object} params - Query parameters (e.g., page, limit, filter)
 * @returns {Promise<object>} Result object with users array
 */
export async function remoteGetAllUsers(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString
    ? `${remoteConfig.endpoints.users}?${queryString}`
    : remoteConfig.endpoints.users;
  
  return await fetchWithTimeout(endpoint, { method: "GET" });
}

/**
 * Get a user by username from remote server
 * @param {string} username - Username to find
 * @returns {Promise<object>} Result object with user data
 */
export async function remoteGetUserByUsername(username) {
  const endpoint = `${remoteConfig.endpoints.users}/${encodeURIComponent(username)}`;
  return await fetchWithTimeout(endpoint, { method: "GET" });
}

/**
 * Add a new user to remote server
 * @param {object} user - User object to add
 * @returns {Promise<object>} Result object with created user data
 */
export async function remoteAddUser(user) {
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
export async function remoteUpdateUser(username, userData) {
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
export async function remoteDeleteUser(username) {
  const endpoint = `${remoteConfig.endpoints.users}/${encodeURIComponent(username)}`;
  return await fetchWithTimeout(endpoint, {
    method: "DELETE",
  });
}

/**
 * Authenticate a user with remote server
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<object>} Result object with user data and token if successful
 */
export async function remoteAuthenticateUser(username, password) {
  return await fetchWithTimeout(remoteConfig.endpoints.auth, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// ===== MAP POINTS OPERATIONS =====

/**
 * Get all map points from remote server
 * @param {object} params - Query parameters (e.g., username, page, limit, bounds)
 * @returns {Promise<object>} Result object with points array
 */
export async function remoteGetAllPoints(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString
    ? `${remoteConfig.endpoints.points}?${queryString}`
    : remoteConfig.endpoints.points;
  
  return await fetchWithTimeout(endpoint, { method: "GET" });
}

/**
 * Get a map point by ID from remote server
 * @param {number} id - Point ID
 * @returns {Promise<object>} Result object with point data
 */
export async function remoteGetPointById(id) {
  const endpoint = `${remoteConfig.endpoints.points}/${id}`;
  return await fetchWithTimeout(endpoint, { method: "GET" });
}

/**
 * Add a new map point to remote server
 * @param {object} point - Point object to add
 * @returns {Promise<object>} Result object with created point data
 */
export async function remoteAddPoint(point) {
  return await fetchWithTimeout(remoteConfig.endpoints.points, {
    method: "POST",
    body: JSON.stringify(point),
  });
}

/**
 * Update an existing map point on remote server
 * @param {number} id - Point ID to update
 * @param {object} pointData - Updated point data
 * @returns {Promise<object>} Result object with updated point data
 */
export async function remoteUpdatePoint(id, pointData) {
  const endpoint = `${remoteConfig.endpoints.points}/${id}`;
  return await fetchWithTimeout(endpoint, {
    method: "PUT",
    body: JSON.stringify(pointData),
  });
}

/**
 * Delete a map point from remote server
 * @param {number} id - Point ID to delete
 * @returns {Promise<object>} Result object
 */
export async function remoteDeletePoint(id) {
  const endpoint = `${remoteConfig.endpoints.points}/${id}`;
  return await fetchWithTimeout(endpoint, {
    method: "DELETE",
  });
}

// ===== SETTINGS OPERATIONS =====

/**
 * Get user settings from remote server
 * @returns {Promise<object>} Result object with settings
 */
export async function remoteGetSettings() {
  return await fetchWithTimeout(remoteConfig.endpoints.settings, {
    method: "GET",
  });
}

/**
 * Save user settings to remote server
 * @param {object} settings - Settings object
 * @returns {Promise<object>} Result object
 */
export async function remoteSaveSettings(settings) {
  return await fetchWithTimeout(remoteConfig.endpoints.settings, {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

// ===== SESSION OPERATIONS =====

/**
 * Get current user from remote server
 * @returns {Promise<object>} Result object with current user
 */
export async function remoteGetCurrentUser() {
  return await fetchWithTimeout(remoteConfig.endpoints.currentUser, {
    method: "GET",
  });
}

/**
 * Set current user on remote server
 * @param {string} username - Username to set as current
 * @returns {Promise<object>} Result object
 */
export async function remoteSetCurrentUser(username) {
  return await fetchWithTimeout(remoteConfig.endpoints.currentUser, {
    method: "PUT",
    body: JSON.stringify({ username }),
  });
}

/**
 * Clear current user on remote server (logout)
 * @returns {Promise<object>} Result object
 */
export async function remoteClearCurrentUser() {
  return await fetchWithTimeout(remoteConfig.endpoints.currentUser, {
    method: "DELETE",
  });
}

// ===== BATCH OPERATIONS =====

/**
 * Get multiple points by IDs (batch operation)
 * @param {number[]} ids - Array of point IDs
 * @returns {Promise<object>} Result object with points array
 */
export async function remoteGetPointsByIds(ids) {
  const idsParam = ids.join(",");
  const endpoint = `${remoteConfig.endpoints.points}/batch?ids=${idsParam}`;
  return await fetchWithTimeout(endpoint, { method: "GET" });
}

/**
 * Get multiple users by usernames (batch operation)
 * @param {string[]} usernames - Array of usernames
 * @returns {Promise<object>} Result object with users array
 */
export async function remoteGetUsersByUsernames(usernames) {
  const usernamesParam = usernames.join(",");
  const endpoint = `${remoteConfig.endpoints.users}/batch?usernames=${usernamesParam}`;
  return await fetchWithTimeout(endpoint, { method: "GET" });
}

// ===== ADMIN OPERATIONS =====

/**
 * Reset all data on remote server (admin only)
 * @returns {Promise<object>} Result object
 */
export async function remoteResetAllData() {
  return await fetchWithTimeout(remoteConfig.endpoints.reset, {
    method: "POST",
  });
}

/**
 * Get server statistics (admin only)
 * @returns {Promise<object>} Result object with statistics
 */
export async function remoteGetStatistics() {
  return await fetchWithTimeout("/statistics", {
    method: "GET",
  });
}

/**
 * Health check endpoint
 * @returns {Promise<object>} Result object with server health status
 */
export async function remoteHealthCheck() {
  return await fetchWithTimeout("/health", {
    method: "GET",
  });
}

// ===== PAGINATION HELPERS =====

/**
 * Get paginated users
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @param {object} filters - Optional filters (role, search, etc.)
 * @returns {Promise<object>} Result with users array and pagination metadata
 */
export async function remoteGetUsersPaginated(page = 1, limit = 20, filters = {}) {
  const params = {
    page,
    limit,
    ...filters,
  };
  return await remoteGetAllUsers(params);
}

/**
 * Get paginated points
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @param {object} filters - Optional filters (username, status, bounds, etc.)
 * @returns {Promise<object>} Result with points array and pagination metadata
 */
export async function remoteGetPointsPaginated(page = 1, limit = 20, filters = {}) {
  const params = {
    page,
    limit,
    ...filters,
  };
  return await remoteGetAllPoints(params);
}

/**
 * Get points within map bounds (for map view)
 * @param {object} bounds - Map bounds {north, south, east, west}
 * @param {number} limit - Maximum number of points to return
 * @returns {Promise<object>} Result with points array
 */
export async function remoteGetPointsInBounds(bounds, limit = 100) {
  const params = {
    north: bounds.north,
    south: bounds.south,
    east: bounds.east,
    west: bounds.west,
    limit,
  };
  return await remoteGetAllPoints(params);
}

// Export all remote API functions
export default {
  // Configuration
  initRemoteDB,
  getRemoteConfig,
  setAuthToken,
  
  // Users
  remoteGetAllUsers,
  remoteGetUserByUsername,
  remoteAddUser,
  remoteUpdateUser,
  remoteDeleteUser,
  remoteAuthenticateUser,
  
  // Map Points
  remoteGetAllPoints,
  remoteGetPointById,
  remoteAddPoint,
  remoteUpdatePoint,
  remoteDeletePoint,
  
  // Settings
  remoteGetSettings,
  remoteSaveSettings,
  
  // Session
  remoteGetCurrentUser,
  remoteSetCurrentUser,
  remoteClearCurrentUser,
  
  // Batch Operations
  remoteGetPointsByIds,
  remoteGetUsersByUsernames,
  
  // Admin
  remoteResetAllData,
  remoteGetStatistics,
  remoteHealthCheck,
  
  // Pagination
  remoteGetUsersPaginated,
  remoteGetPointsPaginated,
  remoteGetPointsInBounds,
};
