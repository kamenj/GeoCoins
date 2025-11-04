const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 8081;
const ROOT_DIR = path.join(__dirname, '..', 'v5');
const BACKEND_HOST = 'localhost';
const BACKEND_PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.xml': 'application/xml',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  // Proxy API requests to backend server
  if (req.url.startsWith('/api') || req.url.startsWith('/health')) {
    console.log(`🔄 Proxying ${req.method} ${req.url} to backend:${BACKEND_PORT}`);
    
    const proxyReq = http.request({
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers
    }, (proxyRes) => {
      // Forward status code and headers
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      
      // Pipe the response
      proxyRes.pipe(res);
      
      console.log(`✅ ${proxyRes.statusCode} - ${req.method} ${req.url}`);
    });
    
    proxyReq.on('error', (err) => {
      console.error(`❌ Proxy error for ${req.url}:`, err.message);
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('502 Bad Gateway - Backend server unavailable');
    });
    
    // Pipe request body to backend
    req.pipe(proxyReq);
    return;
  }
  
  // Remove query string and decode URI
  let filePath = decodeURIComponent(req.url.split('?')[0]);
  
  // Default to index.html for root
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // Construct full file path
  const fullPath = path.join(ROOT_DIR, filePath);
  
  // Security: Prevent directory traversal
  if (!fullPath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }
  
  // Check if file exists
  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      console.log(`404 - ${req.method} ${req.url}`);
      return;
    }
    
    // Get MIME type
    const ext = path.extname(fullPath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Read and serve file
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        console.error(`Error reading file: ${fullPath}`, err);
        return;
      }
      
      // Set headers for no-cache during development
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(data);
      console.log(`200 - ${req.method} ${req.url} (${mimeType})`);
    });
  });
});

server.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 Web Server Started Successfully!');
  console.log('========================================');
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📁 Root: ${ROOT_DIR}`);
  console.log('========================================');
  console.log('Press Ctrl+C to stop the server');
  console.log('========================================');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n⚠️  Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
