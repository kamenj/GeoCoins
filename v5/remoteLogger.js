/**
 * Remote Logger - Sends log messages to the server
 * Usage: 
 *   import { remoteLog } from './remoteLogger.js';
 *   remoteLog('This is a log message', 'INFO');
 *   remoteLog('[DBG-CHEVRON-001] Some debug info', 'DEBUG');
 */

// Import Config to check RemoteLogging setting
let Config = null;

// Function to set Config from app.js after it's loaded
export function setRemoteLoggerConfig(config) {
  Config = config;
}

// Use backend API URL for logging endpoint
const LOG_QUEUE = [];
let isProcessing = false;

/**
 * Send a log message to the server
 * @param {string} message - The log message
 * @param {string} level - Log level: INFO, DEBUG, WARN, ERROR
 */
export async function remoteLog(message, level = 'INFO') {
  // Check if remote logging is enabled in Config
  if (!Config || !Config.RemoteLogging) {
    // Remote logging disabled - just log to console instead
    console.log(`[${level}] ${message}`);
    return;
  }
  
  // Add to queue
  LOG_QUEUE.push({ message, level, timestamp: Date.now() });
  
  // Process queue
  processLogQueue();
}

/**
 * Process the log queue (send logs to server)
 */
async function processLogQueue() {
  if (isProcessing || LOG_QUEUE.length === 0) {
    return;
  }
  
  isProcessing = true;
  
  while (LOG_QUEUE.length > 0) {
    const logEntry = LOG_QUEUE.shift();
    
    try {
      // Send logs to the webserver's /log endpoint (not the backend Express server)
      // The webserver proxies the frontend and handles logging to v5/logs/
      const logEndpoint = '/log';  // Relative URL - goes to the webserver
      
      const response = await fetch(logEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
      });
      
      if (!response.ok) {
        console.error('Failed to send log to server:', response.statusText);
        // Re-add to queue if failed (but limit retries)
        if (!logEntry.retryCount || logEntry.retryCount < 3) {
          logEntry.retryCount = (logEntry.retryCount || 0) + 1;
          LOG_QUEUE.push(logEntry);
        }
      }
    } catch (error) {
      console.error('Error sending log to server:', error);
      // Re-add to queue if failed (but limit retries)
      if (!logEntry.retryCount || logEntry.retryCount < 3) {
        logEntry.retryCount = (logEntry.retryCount || 0) + 1;
        LOG_QUEUE.push(logEntry);
      }
    }
    
    // Small delay between requests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  isProcessing = false;
}

/**
 * Convenience methods for different log levels
 */
export const rlog = {
  info: (msg) => remoteLog(msg, 'INFO'),
  debug: (msg) => remoteLog(msg, 'DEBUG'),
  warn: (msg) => remoteLog(msg, 'WARN'),
  error: (msg) => remoteLog(msg, 'ERROR')
};
