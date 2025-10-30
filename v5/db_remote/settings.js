/**
 * settings.js - Settings operations API
 */

import { remoteConfig } from "./config.js";
import { fetchWithTimeout } from "./fetchUtil.js";

/**
 * Settings API class - handles settings operations
 */
export class SettingsAPI {
  /**
   * Get user settings from remote server
   * @returns {Promise<object>} Result object with settings
   */
  static async get() {
    return await fetchWithTimeout(remoteConfig.endpoints.settings, {
      method: "GET",
    });
  }

  /**
   * Save user settings to remote server
   * @param {object} settings - Settings object
   * @returns {Promise<object>} Result object
   */
  static async save(settings) {
    return await fetchWithTimeout(remoteConfig.endpoints.settings, {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }
}
