/**
 * config.js - Remote database configuration
 */

/**
 * Remote database configuration
 */
export const remoteConfig = {
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
