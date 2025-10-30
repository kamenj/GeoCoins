/**
 * db.js - Database abstraction layer
 * Supports two modes: LOCAL (using localStorage) and REMOTE (using fetch API)
 */

import { SAMPLE_USERS, SAMPLE_POINTS } from "./data.js";
import * as RemoteDB from "./db_remote.js";

// Database modes
export const DB_MODE = {
  LOCAL: "LOCAL",
  REMOTE: "REMOTE",
};

// Database configuration
let dbConfig = {
  mode: DB_MODE.LOCAL,
  remote: {
    baseUrl: "http://localhost:3000/api",
    endpoints: {
      users: "/users",
      points: "/points",
      auth: "/auth",
    },
    headers: {
      "Content-Type": "application/json",
    },
  },
  local: {
    storageKeys: {
      users: "app.users",
      points: "app.mapPoints",
      currentUser: "app.currentUser",
      settings: "app.settings",
    },
  },
};

/**
 * Initialize the database configuration
 * @param {object} config - Configuration object from app.js
 */
export function initDB(config) {
  if (config) {
    dbConfig = { ...dbConfig, ...config };
    
    // Initialize remote DB if config provided
    if (config.remote) {
      RemoteDB.initRemoteDB(config.remote);
    }
  }
}

/**
 * Set the database mode
 * @param {string} mode - DB_MODE.LOCAL or DB_MODE.REMOTE
 */
export function setDBMode(mode) {
  if (mode === DB_MODE.LOCAL || mode === DB_MODE.REMOTE) {
    dbConfig.mode = mode;
  } else {
    throw new Error(`Invalid DB mode: ${mode}`);
  }
}

/**
 * Get the current database mode
 * @returns {string} Current mode
 */
export function getDBMode() {
  return dbConfig.mode;
}

// ===== LOCAL STORAGE HELPERS =====

function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { success: true };
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return { success: false, error: error.message };
  }
}

function loadFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
}

// ===== REMOTE API HELPERS =====

async function fetchRemote(endpoint, options = {}) {
  // This is now deprecated - use db_remote.js functions directly
  console.warn("fetchRemote is deprecated, using db_remote.js instead");
  try {
    const url = `${dbConfig.remote.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: dbConfig.remote.headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Remote fetch error:", error);
    return { success: false, error: error.message };
  }
}

// ===== USER OPERATIONS =====

/**
 * Get all users
 * @returns {Promise<object>} Result object with users array
 */
export async function getAllUsers() {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const users = loadFromLocalStorage(
      dbConfig.local.storageKeys.users,
      SAMPLE_USERS
    );
    return { success: true, data: users };
  } else {
    return await RemoteDB.remoteGetAllUsers();
  }
}

/**
 * Get a user by username
 * @param {string} username - Username to find
 * @returns {Promise<object>} Result object with user data
 */
export async function getUserByUsername(username) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const users = loadFromLocalStorage(
      dbConfig.local.storageKeys.users,
      SAMPLE_USERS
    );
    const user = users.find((u) => u.username === username);
    return {
      success: !!user,
      data: user,
      error: user ? null : "User not found",
    };
  } else {
    return await RemoteDB.remoteGetUserByUsername(username);
  }
}

/**
 * Add a new user
 * @param {object} user - User object to add
 * @returns {Promise<object>} Result object
 */
export async function addUser(user) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const users = loadFromLocalStorage(
      dbConfig.local.storageKeys.users,
      SAMPLE_USERS
    );
    
    // Check if user already exists
    if (users.find((u) => u.username === user.username)) {
      return { success: false, error: "User already exists" };
    }
    
    // Auto-assign unique ID if not provided
    if (user.id === undefined || user.id === null) {
      const maxId = users.reduce((max, u) => Math.max(max, u.id || 0), 0);
      user.id = maxId + 1;
    }
    
    users.push(user);
    const result = saveToLocalStorage(dbConfig.local.storageKeys.users, users);
    return result.success ? { success: true, data: user } : result;
  } else {
    return await RemoteDB.remoteAddUser(user);
  }
}

/**
 * Update an existing user
 * @param {string} username - Username to update
 * @param {object} userData - Updated user data
 * @returns {Promise<object>} Result object
 */
export async function updateUser(username, userData) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const users = loadFromLocalStorage(
      dbConfig.local.storageKeys.users,
      SAMPLE_USERS
    );
    const index = users.findIndex((u) => u.username === username);
    
    if (index === -1) {
      return { success: false, error: "User not found" };
    }
    
    // If username is being changed, check for duplicates
    if (userData.username && userData.username !== username) {
      if (users.find((u) => u.username === userData.username)) {
        return { success: false, error: "New username already exists" };
      }
    }
    
    users[index] = { ...users[index], ...userData };
    const result = saveToLocalStorage(dbConfig.local.storageKeys.users, users);
    return result.success ? { success: true, data: users[index] } : result;
  } else {
    return await RemoteDB.remoteUpdateUser(username, userData);
  }
}

/**
 * Delete a user
 * @param {string} username - Username to delete
 * @returns {Promise<object>} Result object
 */
export async function deleteUser(username) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const users = loadFromLocalStorage(
      dbConfig.local.storageKeys.users,
      SAMPLE_USERS
    );
    const filteredUsers = users.filter((u) => u.username !== username);
    
    if (filteredUsers.length === users.length) {
      return { success: false, error: "User not found" };
    }
    
    const result = saveToLocalStorage(
      dbConfig.local.storageKeys.users,
      filteredUsers
    );
    return result.success
      ? { success: true, data: { username } }
      : result;
  } else {
    return await RemoteDB.remoteDeleteUser(username);
  }
}

/**
 * Authenticate a user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<object>} Result object with user data if successful
 */
export async function authenticateUser(username, password) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const users = loadFromLocalStorage(
      dbConfig.local.storageKeys.users,
      SAMPLE_USERS
    );
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    return {
      success: !!user,
      data: user,
      error: user ? null : "Invalid credentials",
    };
  } else {
    return await RemoteDB.remoteAuthenticateUser(username, password);
  }
}

// ===== MAP POINTS OPERATIONS =====

/**
 * Get all map points
 * @param {string} username - Optional filter by username
 * @returns {Promise<object>} Result object with points array
 */
export async function getAllPoints(username = null) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    let points = loadFromLocalStorage(
      dbConfig.local.storageKeys.points,
      SAMPLE_POINTS
    );
    
    if (username) {
      points = points.filter((p) => p.username === username);
    }
    
    return { success: true, data: points };
  } else {
    const params = username ? { username } : {};
    return await RemoteDB.remoteGetAllPoints(params);
  }
}

/**
 * Get a map point by ID
 * @param {number} id - Point ID
 * @returns {Promise<object>} Result object with point data
 */
export async function getPointById(id) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const points = loadFromLocalStorage(
      dbConfig.local.storageKeys.points,
      SAMPLE_POINTS
    );
    const point = points.find((p) => p.id === id);
    return {
      success: !!point,
      data: point,
      error: point ? null : "Point not found",
    };
  } else {
    return await RemoteDB.remoteGetPointById(id);
  }
}

/**
 * Add a new map point
 * @param {object} point - Point object to add
 * @returns {Promise<object>} Result object
 */
export async function addPoint(point) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const points = loadFromLocalStorage(
      dbConfig.local.storageKeys.points,
      SAMPLE_POINTS
    );
    
    // Auto-generate ID if not provided
    if (point.id === undefined || point.id === null) {
      const maxId = points.reduce((max, p) => Math.max(max, p.id || 0), -1);
      point.id = maxId + 1;
    }
    
    points.push(point);
    const result = saveToLocalStorage(dbConfig.local.storageKeys.points, points);
    return result.success ? { success: true, data: point } : result;
  } else {
    return await RemoteDB.remoteAddPoint(point);
  }
}

/**
 * Update an existing map point
 * @param {number} id - Point ID to update
 * @param {object} pointData - Updated point data
 * @returns {Promise<object>} Result object
 */
export async function updatePoint(id, pointData) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const points = loadFromLocalStorage(
      dbConfig.local.storageKeys.points,
      SAMPLE_POINTS
    );
    const index = points.findIndex((p) => p.id === id);
    
    if (index === -1) {
      return { success: false, error: "Point not found" };
    }
    
    points[index] = { ...points[index], ...pointData, id }; // Preserve ID
    const result = saveToLocalStorage(dbConfig.local.storageKeys.points, points);
    return result.success ? { success: true, data: points[index] } : result;
  } else {
    return await RemoteDB.remoteUpdatePoint(id, pointData);
  }
}

/**
 * Delete a map point
 * @param {number} id - Point ID to delete
 * @returns {Promise<object>} Result object
 */
export async function deletePoint(id) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const points = loadFromLocalStorage(
      dbConfig.local.storageKeys.points,
      SAMPLE_POINTS
    );
    const filteredPoints = points.filter((p) => p.id !== id);
    
    if (filteredPoints.length === points.length) {
      return { success: false, error: "Point not found" };
    }
    
    const result = saveToLocalStorage(
      dbConfig.local.storageKeys.points,
      filteredPoints
    );
    return result.success
      ? { success: true, data: { id } }
      : result;
  } else {
    return await RemoteDB.remoteDeletePoint(id);
  }
}

// ===== SETTINGS OPERATIONS =====

/**
 * Get user settings
 * @returns {Promise<object>} Result object with settings
 */
export async function getSettings() {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const settings = loadFromLocalStorage(
      dbConfig.local.storageKeys.settings,
      { theme: "light", font: "medium", autoHideTopMenu: true }
    );
    return { success: true, data: settings };
  } else {
    return await RemoteDB.remoteGetSettings();
  }
}

/**
 * Save user settings
 * @param {object} settings - Settings object
 * @returns {Promise<object>} Result object
 */
export async function saveSettings(settings) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const result = saveToLocalStorage(
      dbConfig.local.storageKeys.settings,
      settings
    );
    return result.success ? { success: true, data: settings } : result;
  } else {
    return await RemoteDB.remoteSaveSettings(settings);
  }
}

/**
 * Get current user
 * @returns {Promise<object>} Result object with current user
 */
export async function getCurrentUser() {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const currentUser = loadFromLocalStorage(
      dbConfig.local.storageKeys.currentUser,
      null
    );
    return { success: true, data: currentUser };
  } else {
    return await RemoteDB.remoteGetCurrentUser();
  }
}

/**
 * Set current user
 * @param {string} username - Username to set as current
 * @returns {Promise<object>} Result object
 */
export async function setCurrentUser(username) {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const result = saveToLocalStorage(
      dbConfig.local.storageKeys.currentUser,
      username
    );
    return result.success ? { success: true, data: username } : result;
  } else {
    return await RemoteDB.remoteSetCurrentUser(username);
  }
}

/**
 * Clear current user (logout)
 * @returns {Promise<object>} Result object
 */
export async function clearCurrentUser() {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    const result = saveToLocalStorage(
      dbConfig.local.storageKeys.currentUser,
      null
    );
    return result.success ? { success: true, data: null } : result;
  } else {
    return await RemoteDB.remoteClearCurrentUser();
  }
}

/**
 * Reset all data (for settings reset)
 * @returns {Promise<object>} Result object
 */
export async function resetAllData() {
  if (dbConfig.mode === DB_MODE.LOCAL) {
    try {
      localStorage.removeItem(dbConfig.local.storageKeys.users);
      localStorage.removeItem(dbConfig.local.storageKeys.points);
      localStorage.removeItem(dbConfig.local.storageKeys.currentUser);
      localStorage.removeItem(dbConfig.local.storageKeys.settings);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  } else {
    return await RemoteDB.remoteResetAllData();
  }
}

// Export the DB API as a default object
export default {
  // Configuration
  initDB,
  setDBMode,
  getDBMode,
  DB_MODE,
  
  // Users
  getAllUsers,
  getUserByUsername,
  addUser,
  updateUser,
  deleteUser,
  authenticateUser,
  
  // Map Points
  getAllPoints,
  getPointById,
  addPoint,
  updatePoint,
  deletePoint,
  
  // Settings & Session
  getSettings,
  saveSettings,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  resetAllData,
};
