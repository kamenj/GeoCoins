/**
 * points.js - Map points operations API
 */

import { remoteConfig } from "./config.js";
import { fetchWithTimeout } from "./fetchUtil.js";

/**
 * Points API class - handles all map point-related remote operations
 */
export class PointsAPI {
  /**
   * Get all map points from remote server
   * @param {object} params - Query parameters (e.g., username, page, limit, bounds)
   * @returns {Promise<object>} Result object with points array
   */
  static async getAll(params = {}) {
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
  static async getById(id) {
    const endpoint = `${remoteConfig.endpoints.points}/${id}`;
    return await fetchWithTimeout(endpoint, { method: "GET" });
  }

  /**
   * Add a new map point to remote server
   * @param {object} point - Point object to add
   * @returns {Promise<object>} Result object with created point data
   */
  static async add(point) {
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
  static async update(id, pointData) {
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
  static async delete(id) {
    const endpoint = `${remoteConfig.endpoints.points}/${id}`;
    return await fetchWithTimeout(endpoint, {
      method: "DELETE",
    });
  }

  /**
   * Get multiple points by IDs (batch operation)
   * @param {number[]} ids - Array of point IDs
   * @returns {Promise<object>} Result object with points array
   */
  static async getByIds(ids) {
    const idsParam = ids.join(",");
    const endpoint = `${remoteConfig.endpoints.points}/batch?ids=${idsParam}`;
    return await fetchWithTimeout(endpoint, { method: "GET" });
  }

  /**
   * Get paginated points
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page
   * @param {object} filters - Optional filters (username, status, bounds, etc.)
   * @returns {Promise<object>} Result with points array and pagination metadata
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
   * Get points within map bounds (for map view)
   * @param {object} bounds - Map bounds {north, south, east, west}
   * @param {number} limit - Maximum number of points to return
   * @returns {Promise<object>} Result with points array
   */
  static async getInBounds(bounds, limit = 100) {
    const params = {
      north: bounds.north,
      south: bounds.south,
      east: bounds.east,
      west: bounds.west,
      limit,
    };
    return await this.getAll(params);
  }
}
