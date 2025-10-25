# Quick Reference: Switching Table View Modes

## Method 1: Via Browser Console (Developer Tools)

### Switch to Compact View
```javascript
Config.UsersTable.view = "compact";
refreshUsersTable();
```

### Switch to Details View
```javascript
Config.UsersTable.view = "details";
refreshUsersTable();
```

## Method 2: Add Menu Commands

Add view toggle buttons to the Users List menu:

### In `Config.Commands.LIST[Constants.ContentSection.UsersList]` array, add:

```javascript
{
  name: "users.viewDetails",
  caption: "Details View",
  menu: { location: "menu.bottom.title" },
  action: function () {
    Config.UsersTable.view = "details";
    refreshUsersTable();
  },
  visible: true,
  enabled: true,
},
{
  name: "users.viewCompact",
  caption: "Compact View",
  menu: { location: "menu.bottom.title" },
  action: function () {
    Config.UsersTable.view = "compact";
    refreshUsersTable();
  },
  visible: true,
  enabled: true,
}
```

## Method 3: Default View Setting

Change the default view in `Config.UsersTable`:

```javascript
Config.UsersTable = {
  view: "compact",  // Changed from "details"
  // ... rest of config
}
```

## View Comparison

### Details View
- Shows each piece of information in separate columns
- Best for: Desktop displays, when you need to compare data across rows
- Columns: #, Username, Name, Role, Actions
- Pros: Easy to scan specific fields, better for sorting/filtering individual columns
- Cons: Takes more horizontal space

### Compact View
- Combines user info into a single formatted string
- Best for: Mobile/narrow displays, when horizontal space is limited
- Columns: User (Username - Name [Role]), Actions
- Pros: Fits more rows on screen, works on smaller displays
- Cons: Harder to sort/filter by specific fields

## Testing Both Views

```javascript
// Store the current view
var originalView = Config.UsersTable.view;

// Test compact view
Config.UsersTable.view = "compact";
refreshUsersTable();

// Wait a moment, then test details view
setTimeout(function() {
  Config.UsersTable.view = "details";
  refreshUsersTable();
}, 3000);

// Restore original view after another 3 seconds
setTimeout(function() {
  Config.UsersTable.view = originalView;
  refreshUsersTable();
}, 6000);
```

## Persist View Choice

To remember user's view preference, modify the view switching code:

```javascript
function setUsersTableView(viewMode) {
  Config.UsersTable.view = viewMode;
  localStorage.setItem('app.usersTable.view', viewMode);
  refreshUsersTable();
}

// On app initialization, restore saved view
var savedView = localStorage.getItem('app.usersTable.view');
if (savedView) {
  Config.UsersTable.view = savedView;
}
```

## Advanced: Custom View

Create your own custom view by adding to `getTableColumns()`:

```javascript
function getTableColumns(viewMode) {
  var columns = {
    details: [...],
    compact: [...],
    minimal: [  // New custom view
      { 
        title: "User", 
        field: "username", 
        headerFilter: "input",
        formatter: function(cell) {
          var user = cell.getRow().getData();
          return user.username + ' (' + getRolesDisplay(user) + ')';
        }
      },
      { 
        title: "Edit", 
        field: "edit",
        width: 80,
        formatter: function(cell) {
          var user = cell.getRow().getData();
          return renderCommandHTML({ payload: user.username }, Config.Constants.CommandName.UsersEditRow);
        }
      }
    ]
  };
  
  return columns[viewMode] || columns.details;
}
```

Then use it:
```javascript
Config.UsersTable.view = "minimal";
refreshUsersTable();
```
