# Frontend Authentication Changes

## Overview
Update the frontend to use JWT-based authentication with httpOnly cookies instead of storing username in localStorage.

## Changes to `db_remote/authAPI.js`

### Update `getCurrentUser()`

```javascript
/**
 * Get current user from server (validates session token)
 * @returns {Promise<object>} Result with user data
 */
export async function getCurrentUser() {
  try {
    const response = await fetch(`${baseUrl}/auth/current`, {
      method: 'GET',
      credentials: 'include', // Important: Send cookies with request
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      // 401 = not authenticated, 403 = invalid token
      if (response.status === 401 || response.status === 403) {
        return { success: true, data: null }; // No user logged in
      }
      return { success: false, error: data.error || 'Failed to get current user' };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { success: false, error: error.message };
  }
}
```

### Update `authenticateUser()` (login)

```javascript
/**
 * Authenticate user (sets httpOnly cookie on success)
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<object>} Result with user data
 */
export async function authenticateUser(username, password) {
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      credentials: 'include', // Important: Receive cookies from server
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Authentication failed' };
    }

    // Server sets httpOnly cookie automatically
    // We just return the user data
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { success: false, error: error.message };
  }
}
```

### Add `clearCurrentUser()` (logout)

```javascript
/**
 * Logout user (clears httpOnly cookie)
 * @returns {Promise<object>} Result
 */
export async function clearCurrentUser() {
  try {
    const response = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Important: Send cookies with request
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Logout failed' };
    }

    return { success: true, data: null };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
}
```

## Changes to `db.js`

### Update `getCurrentUser()`

```javascript
export async function getCurrentUser() {
  console.log('👤 DB.getCurrentUser called');
  
  if (dbConfig.mode === DB_MODE.LOCAL) {
    // LOCAL mode: Use localStorage (existing behavior)
    const key = dbConfig.local.storageKeys.currentUser;
    console.log('👤 Reading from localStorage key:', key);
    
    const directCheck = localStorage.getItem(key);
    console.log('👤 DIRECT localStorage.getItem result:', directCheck);
    
    const currentUser = loadFromLocalStorage(key, null);
    console.log('👤 DB.getCurrentUser loaded:', currentUser);
    console.log('👤 Type of loaded data:', typeof currentUser);
    
    if (currentUser && typeof currentUser === 'string') {
      // String = username, fetch full user
      const fullUserResult = await getUserByUsername(currentUser);
      if (fullUserResult.success) {
        return { success: true, data: fullUserResult.data };
      }
    } else if (currentUser && typeof currentUser === 'object') {
      // Object = full user
      return { success: true, data: currentUser };
    }
    
    return { success: true, data: null };
    
  } else {
    // REMOTE mode: Server validates JWT token from httpOnly cookie
    console.log('👤 REMOTE mode: Checking session with server...');
    const result = await AuthAPI.getCurrentUser();
    console.log('👤 Server session result:', result);
    return result;
  }
}
```

### Update `clearCurrentUser()`

```javascript
export async function clearCurrentUser() {
  console.log('🗑️ DB.clearCurrentUser called');
  
  if (dbConfig.mode === DB_MODE.LOCAL) {
    // LOCAL mode: Clear localStorage
    try {
      console.log('🗑️ Removing currentUser from localStorage, key:', dbConfig.local.storageKeys.currentUser);
      localStorage.removeItem(dbConfig.local.storageKeys.currentUser);
      console.log('🗑️ localStorage.removeItem SUCCESS');
      return { success: true, data: null };
    } catch (error) {
      console.error('❌ Error removing currentUser from localStorage:', error);
      return { success: false, error: error.message };
    }
  } else {
    // REMOTE mode: Tell server to clear session cookie
    console.log('🗑️ REMOTE mode: Clearing session with server...');
    const result = await AuthAPI.clearCurrentUser();
    console.log('🗑️ Server clear session result:', result);
    return result;
  }
}
```

### Remove `setCurrentUser()` (No Longer Needed)

The server manages the session token automatically via cookies. We don't need to manually store anything on the frontend.

## Changes to `app.js`

### Update `handleLogin()`

```javascript
export async function handleLogin() {
  var user = getVal("login-username"),
    pass = $("login-password").value;
  
  var result = await DB.authenticateUser(user, pass);
  if (result.success && result.data) {
    // Server has set httpOnly cookie
    // Just update the UI state
    State.currentUser = result.data;
    
    // Cache the user data for menu rendering
    State._userCache[result.data.username] = result.data;
    
    await updateStatusBar();
    showContent(null);
  } else {
    await customAlert("Login Failed", "Wrong username or password.");
  }
}
```

### Update `loadAll()` - Remove Migration Logic

Remove the legacy migration code since we're no longer storing username in localStorage in REMOTE mode:

```javascript
// In loadAll(), replace the user loading section with:

// Load current user
console.log('👤 Loading current user...');
console.log('👤 Config.AutoLoadCachedUser:', Config.AutoLoadCachedUser);
console.log('👤 Config.SaveGuiState:', Config.SaveGuiState);

var currentUserResult = await DB.getCurrentUser();
console.log('👤 getCurrentUser result:', currentUserResult);

if (currentUserResult.success && currentUserResult.data && (Config.AutoLoadCachedUser || Config.SaveGuiState)) {
  State.currentUser = currentUserResult.data;
  console.log('👤 State.currentUser set to:', State.currentUser);
  // Pre-cache the current user for menu rendering
  State._userCache[State.currentUser.username] = State.currentUser;
  console.log('👤 User loaded and cached:', State.currentUser.username);
} else {
  State.currentUser = null;
  console.log('👤 No user loaded');
}
```

## Important: CORS Configuration

Update your backend to allow credentials:

```javascript
// In kzzNodeServer/src/index.js
app.use(cors({
  origin: 'http://localhost:8080', // Your frontend URL
  credentials: true // Allow cookies to be sent
}));
```

## Testing Checklist

### Local Mode (No Changes)
- [x] Login works
- [x] Logout works  
- [x] Refresh keeps you logged in (via localStorage)
- [x] Manual localStorage edit changes user (expected behavior)

### Remote Mode (New Secure Behavior)
- [ ] Login sets httpOnly cookie (check in DevTools > Application > Cookies)
- [ ] Cookie contains JWT token (not readable by JavaScript)
- [ ] Refresh keeps you logged in (server validates cookie)
- [ ] Logout clears cookie
- [ ] Cannot modify cookie in DevTools to change user
- [ ] Expired token automatically logs you out

## Security Benefits

✅ **Session hijacking prevented**: Can't steal/modify session by editing localStorage  
✅ **XSS protection**: httpOnly cookie can't be accessed by malicious scripts  
✅ **CSRF protection**: SameSite=strict prevents cross-site requests  
✅ **Token expiration**: Sessions automatically expire after 7 days  
✅ **Server validation**: Every request validates the token with the secret key

## Migration Notes

1. Old localStorage data will be ignored in REMOTE mode
2. Users will need to login again after this update
3. Local mode still works the same way (for development/testing)
