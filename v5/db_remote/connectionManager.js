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
let userCancelledReconnection = false; // Track if user explicitly cancelled
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
      hideReconnectButton(); // Hide reconnect button if it was showing
      isConnectionLost = false;
      userCancelledReconnection = false; // Reset cancel flag
      
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
      console.error(`❌ Failed to reconnect after ${MAX_RECONNECT_ATTEMPTS} attempts`);
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
    // If user has already cancelled reconnection, don't show dialog again
    if (userCancelledReconnection) {
      reject(new Error('Connection lost - user cancelled reconnection'));
      return;
    }
    
    // If already handling a connection loss, don't show dialog again
    if (isConnectionLost) {
      reject(new Error('Connection lost - reconnection in progress'));
      return;
    }
    
    isConnectionLost = true;
    pendingOperation = { operation, resolve, reject };
    
    // Show the dialog
    showConnectionLossDialog();
    
    // Start reconnection attempts
    startReconnection();
    
    // Set up cancel button - use once:true to ensure it only fires once
    const cancelBtn = document.getElementById('connectionLossCancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        stopReconnection();
        hideConnectionLossDialog();
        
        // Mark that user cancelled - prevents dialog from showing again
        userCancelledReconnection = true;
        pendingOperation = null;
        
        // Show reconnect button in status bar
        showReconnectButton();
        
        reject(new Error('Connection attempt cancelled by user'));
      }, { once: true }); // Ensure this only runs once
    }
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
 * Show the reconnect button in the status bar
 */
function showReconnectButton() {
  const reconnectBtn = document.getElementById('statusBar-reconnect');
  if (reconnectBtn) {
    reconnectBtn.style.display = 'inline-block';
    
    // Add click handler if not already added
    if (!reconnectBtn.hasAttribute('data-handler-attached')) {
      reconnectBtn.addEventListener('click', handleReconnectClick);
      reconnectBtn.setAttribute('data-handler-attached', 'true');
    }
  }
  
  // Hide all content sections - only show status bar
  if (window.showContent) {
    window.showContent(null); // This hides all content
  }
  
  // Explicitly hide menuTop and menuBottom using inline styles
  const menuTop = document.getElementById('menuTop');
  if (menuTop) {
    menuTop.classList.remove('visible');
    menuTop.style.display = 'none';
  }
  
  const menuBottom = document.getElementById('menuBottom');
  if (menuBottom) {
    menuBottom.classList.remove('visible');
    menuBottom.style.display = 'none';
  }
}

/**
 * Hide the reconnect button in the status bar
 */
function hideReconnectButton() {
  const reconnectBtn = document.getElementById('statusBar-reconnect');
  if (reconnectBtn) {
    reconnectBtn.style.display = 'none';
  }
}

/**
 * Handle reconnect button click
 */
function handleReconnectClick() {
  // Reset all connection state before reload
  isConnectionLost = false;
  userCancelledReconnection = false;
  pendingOperation = null;
  stopReconnection();
  
  hideReconnectButton();
  window.location.reload();
}

/**
 * Initialize the connection manager
 * This should be called on app startup
 */
export function initConnectionManager() {
  // Ensure reconnect button is hidden initially
  hideReconnectButton();
}
