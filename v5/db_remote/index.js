/**
 * index.js - Main entry point for db_remote module
 * Exports all API classes and configuration functions
 */

// Configuration
export { initRemoteDB, getRemoteConfig, setAuthToken } from "./config.js";

// API Classes
export { UsersAPI } from "./users.js";
export { PointsAPI } from "./points.js";
export { AuthAPI } from "./auth.js";
export { SettingsAPI } from "./settings.js";
export { AdminAPI } from "./admin.js";

// Import for default export
import { initRemoteDB, getRemoteConfig, setAuthToken } from "./config.js";
import { UsersAPI } from "./users.js";
import { PointsAPI } from "./points.js";
import { AuthAPI } from "./auth.js";
import { SettingsAPI } from "./settings.js";
import { AdminAPI } from "./admin.js";

/**
 * Default export with all APIs organized by category
 */
export default {
  // Configuration
  initRemoteDB,
  getRemoteConfig,
  setAuthToken,
  
  // API Classes
  Users: UsersAPI,
  Points: PointsAPI,
  Auth: AuthAPI,
  Settings: SettingsAPI,
  Admin: AdminAPI,
};
