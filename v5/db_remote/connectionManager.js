/**
 * connectionManager.js - Handles connection loss detection and automatic reconnection
 * 
 * This module provides a dialog that:
 * - Shows when connection to remote DB is lost
 * - Attempts periodic reconnection
 * - Retries the failed operation once connection is restored
 * - Allows cancellation to go to developer tools for debugging
 */

import { remoteConfig } from "./config.js";

// Connection state
let isConnectionLost = false;
let reconnectionInterval = null;
let pendingOperation = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 30; // 30 attempts = 30 seconds (1 second interval)
const RECONNECT_INTERVAL = 1000; // 1 second

/**
 * Check if the server is reachable
 * @returns {Promise<boolean>} True if server is reachable
 */
async function checkConnection() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    // Health endpoint is at root level, not under /api
    const baseUrl = remoteConfig.baseUrl.replace('/api', '');
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: remoteConfig.headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Show the connection loss dialog
 */
function showConnectionLossDialog() {
  const modal = document.getElementById('connectionLossModal');
  const message = document.getElementById('connectionLossMessage');
  
  if (modal) {
    modal.classList.remove('hidden');
    updateConnectionMessage(message, 0);
  }
}

/**
 * Hide the connection loss dialog
 */
function hideConnectionLossDialog() {
  const modal = document.getElementById('connectionLossModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

/**
 * Update the connection status message
 */
function updateConnectionMessage(messageEl, attempts) {
  if (messageEl) {
    if (attempts === 0) {
      messageEl.textContent = 'Attempting to reconnect...';
    } else {
      messageEl.textContent = `Reconnection attempt ${attempts}/${MAX_RECONNECT_ATTEMPTS}...`;
    }
  }
}

/**
 * Start periodic reconnection attempts
 */
async function startReconnection() {
  if (reconnectionInterval) {
    return; // Already trying to reconnect
  }
  
  reconnectAttempts = 0;
  const message = document.getElementById('connectionLossMessage');
  
  reconnectionInterval = setInterval(async () => {
    reconnectAttempts++;
    updateConnectionMessage(message, reconnectAttempts);
    
    const isConnected = await checkConnection();
    
    if (isConnected) {
      // Connection restored!
      stopReconnection();
      hideConnectionLossDialog();
      isConnectionLost = false;
      
      // Retry the pending operation if any
      if (pendingOperation) {
        try {
          const result = await pendingOperation.operation();
          pendingOperation.resolve(result);
        } catch (error) {
          pendingOperation.reject(error);
        }
        pendingOperation = null;
      }
    } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      // Max attempts reached
      stopReconnection();
      if (message) {
        message.textContent = `Unable to reconnect after ${MAX_RECONNECT_ATTEMPTS} attempts. Please check your connection.`;
      }
    }
  }, RECONNECT_INTERVAL);
}

/**
 * Stop reconnection attempts
 */
function stopReconnection() {
  if (reconnectionInterval) {
    clearInterval(reconnectionInterval);
    reconnectionInterval = null;
  }
}

/**
 * Handle connection loss with dialog and reconnection
 * @param {Function} operation - The operation to retry once connection is restored
 * @returns {Promise<any>} - Promise that resolves with the operation result or rejects on cancel
 */
export async function handleConnectionLoss(operation) {
  return new Promise((resolve, reject) => {
    // If already handling a connection loss, queue this operation
    if (isConnectionLost && pendingOperation) {
      reject(new Error('Connection lost - another operation is already pending'));
      return;
    }
    
    isConnectionLost = true;
    pendingOperation = { operation, resolve, reject };
    
    // Show the dialog
    showConnectionLossDialog();
    
    // Start reconnection attempts
    startReconnection();
    
    // Set up cancel button
    const cancelBtn = document.getElementById('connectionLossCancel');
    
    const handleCancel = () => {
      stopReconnection();
      hideConnectionLossDialog();
      isConnectionLost = false;
      pendingOperation = null;
      
      // Reload the page
      window.location.reload();
      
      cancelBtn.removeEventListener('click', handleCancel);
      reject(new Error('Connection attempt cancelled by user'));
    };
    
    cancelBtn.addEventListener('click', handleCancel);
  });
}

/**
 * Check if we're currently handling a connection loss
 * @returns {boolean}
 */
export function isHandlingConnectionLoss() {
  return isConnectionLost;
}

/**
 * Initialize the connection manager
 * This should be called on app startup
 */
export function initConnectionManager() {
  console.log('🔌 Connection manager initialized');
}
