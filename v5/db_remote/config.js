/**
 * config.js - Remote database configuration
 * Last updated: 2025-11-02 07:45 - Changed to 127.0.0.1 for JWT cookies
 */

/**
 * Remote database configuration
 */
export const remoteConfig = {
  baseUrl: "http://127.0.0.1:3000/api",
  endpoints: {
    users: "/users",
    points: "/map_points",
    auth: "/auth", // Legacy endpoint (deprecated)
    authLogin: "/auth/login", // New JWT login endpoint
    authLogout: "/auth/logout", // New JWT logout endpoint
    authCurrent: "/auth/current", // New JWT current user endpoint
    settings: "/settings",
    currentUser: "/current-user", // Legacy endpoint (deprecated)
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
