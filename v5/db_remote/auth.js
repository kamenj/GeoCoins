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
   * Authenticate a user with remote server (JWT-based with httpOnly cookies)
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<object>} Result object with user data (JWT stored in cookie)
   */
  static async authenticate(username, password) {
    console.log(`🔐 [AuthAPI] Authenticating user: ${username}`);
    const result = await fetchWithTimeout(remoteConfig.endpoints.authLogin, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      credentials: 'include', // Send and receive cookies
    });
    
    if (result.success) {
      console.log(`✅ [AuthAPI] Login successful, JWT cookie should be set`);
      console.log(`🍪 [AuthAPI] Check browser cookies for 'authToken'`);
    } else {
      console.error(`❌ [AuthAPI] Login failed:`, result.error);
    }
    
    return result;
  }

  /**
   * Get current authenticated user from server (validates JWT cookie)
   * @returns {Promise<object>} Result object with current user or null if not authenticated
   */
  static async getCurrentUser() {
    console.log(`📖 [AuthAPI] Getting current authenticated user`);
    console.log(`🍪 [AuthAPI] Browser will automatically send authToken cookie if it exists`);
    
    const result = await fetchWithTimeout(remoteConfig.endpoints.authCurrent, {
      method: "GET",
      credentials: 'include', // Send cookies for JWT validation
      silent: true, // Don't log errors if not authenticated
    });
    
    if (result.success) {
      console.log(`✅ [AuthAPI] JWT validated, user:`, result.data?.username);
    } else {
      console.warn(`⚠️ [AuthAPI] JWT validation failed (${result.status}):`, result.error);
    }
    
    return result;
  }

  /**
   * Logout current user (clears JWT cookie)
   * @returns {Promise<object>} Result object
   */
  static async logout() {
    console.log(`🚪 [AuthAPI] Logging out user`);
    return await fetchWithTimeout(remoteConfig.endpoints.authLogout, {
      method: "POST",
      credentials: 'include', // Send cookies to clear
    });
  }

  /**
   * @deprecated Use logout() instead. Kept for backwards compatibility.
   * Clear current user on remote server (logout)
   * @returns {Promise<object>} Result object
   */
  static async clearCurrentUser() {
    console.warn(`⚠️ [AuthAPI] clearCurrentUser() is deprecated, use logout() instead`);
    return await this.logout();
  }

  /**
   * @deprecated No longer needed with JWT authentication. Username stored in JWT cookie.
   * Set current user on remote server
   * @param {string} username - Username to set as current
   * @returns {Promise<object>} Result object
   */
  static async setCurrentUser(username) {
    console.warn(`⚠️ [AuthAPI] setCurrentUser() is deprecated - JWT handles user session`);
    // In JWT mode, this is a no-op - authentication is handled via cookie
    return { success: true, message: "JWT mode - no action needed" };
  }
}
