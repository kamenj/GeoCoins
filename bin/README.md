# GeoCoins Utility Scripts

This folder contains utility batch files for running the GeoCoins application.

## Available Scripts

### start-webserver-8081.bat
Starts a Node.js web server on port 8081 serving the `v5` folder.

**Prerequisites:**
- Node.js must be installed (no additional packages needed!)

**Usage:**
- Double-click the batch file, or
- Run from command line:
  ```bash
  bin\start-webserver-8081.bat
  ```

**Access the application:**
- Open your browser to: http://localhost:8081

**Features:**
- Serves files from the `v5` folder using native Node.js (no dependencies)
- Runs on port 8081
- Disables caching for development
- Handles all common MIME types (HTML, CSS, JS, images, fonts, etc.)
- Security: Prevents directory traversal attacks

**To stop the server:**
- Press `Ctrl+C` in the command window

### webserver.js
The underlying Node.js script that implements the web server. Can be run directly:
```bash
node bin\webserver.js 8081
```
You can specify a different port as an argument.

## Backend Server

Don't forget to also start the backend Node.js server (kzzNodeServer) on port 3000:
```bash
cd kzzNodeServer
npm start
```

Or use the debug mode from VS Code.
