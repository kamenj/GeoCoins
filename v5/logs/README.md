# Client Logs

This folder contains log files sent from the client browser to the server.

## Log Files

Log files are created with the naming pattern: `client-YYYY-MM-DD.log`

Each log entry includes:
- Timestamp (ISO format)
- Log level (INFO, DEBUG, WARN, ERROR)
- Message

## Usage

Client-side logging is done via the `remoteLogger.js` module:

```javascript
import { rlog } from './remoteLogger.js';

// Log at different levels
rlog.info('Information message');
rlog.debug('Debug message');
rlog.warn('Warning message');
rlog.error('Error message');
```

## Viewing Logs

Logs are automatically created when the web server receives log requests from clients.
View them with:

```bash
# View today's log
type client-2025-11-04.log

# Tail the log file (Windows PowerShell)
Get-Content client-2025-11-04.log -Wait -Tail 50
```
