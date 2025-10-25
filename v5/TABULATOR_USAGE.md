# Tabulator Table Integration - Users List

## Overview

The Users List table has been upgraded to use **Tabulator** - a powerful, open-source JavaScript table library. This provides advanced features including sorting, filtering, custom views, and more.

## Features Implemented

### 1. **Sorting**
- Click on any column header to sort ascending/descending
- Visual indicators show current sort direction
- Default sort: Username (ascending)

### 2. **Filtering**
- Input filters appear below column headers
- Type to filter data in real-time
- Works across Username, Name, and Role columns

### 3. **View Modes**
The table supports two view modes configured in `Config.UsersTable.view`:

#### Details View (`"details"`)
Shows all user information in separate columns:
- # (row number)
- Username
- Name
- Role
- Actions (Edit/Delete buttons)

#### Compact View (`"compact"`)
Condensed single-row format:
- User Info: `Username - Name [Role Badge]`
- Actions (Edit/Delete buttons)

### 4. **Alternating Row Colors**
- Automatic zebra-striping for better readability
- Configurable via `Config.UsersTable.rowAlternating`

### 5. **Custom Row Rendering**
- Role badges with custom styling
- Action buttons (Edit/Delete) per row
- Clickable usernames to view details

## Configuration

All table settings are stored in `Config.UsersTable`:

```javascript
Config.UsersTable = {
  view: "details",              // Current view: "details" or "compact"
  layout: "fitDataStretch",     // Tabulator layout mode
  height: "auto",               // Table height
  maxHeight: "500px",           // Max height before scrolling
  pagination: false,            // Enable/disable pagination
  paginationSize: 10,           // Rows per page (if enabled)
  columns: {
    details: [...],             // Column definitions for details view
    compact: [...]              // Column definitions for compact view
  },
  initialSort: [                // Default sorting
    { column: "username", dir: "asc" }
  ],
  rowAlternating: true          // Enable alternating row colors
}
```

## Customization Examples

### Change View Mode
```javascript
// Switch to compact view
Config.UsersTable.view = "compact";
refreshUsersTable();
```

### Enable Pagination
```javascript
Config.UsersTable.pagination = true;
Config.UsersTable.paginationSize = 15; // Show 15 rows per page
refreshUsersTable();
```

### Change Default Sort
```javascript
Config.UsersTable.initialSort = [
  { column: "name", dir: "desc" }
];
refreshUsersTable();
```

### Add New Column (Details View)
```javascript
Config.UsersTable.columns.details.push({
  title: "Email",
  field: "email",
  headerFilter: "input",
  sorter: "string",
  formatter: function(cell) {
    var user = cell.getRow().getData();
    return user.email || "N/A";
  }
});
refreshUsersTable();
```

## Styling

Custom CSS has been added to match the app's theme system:
- Respects light/dark theme settings
- Uses CSS variables for colors (`var(--bg)`, `var(--fg)`, etc.)
- Matches existing button and input styling
- Responsive to font size settings

### Theme-Aware Elements
- Header background
- Row backgrounds (even/odd)
- Hover states
- Sort indicators
- Filter inputs
- Action buttons

## Advanced Features Available

Tabulator supports many additional features that can be enabled:

### Column Grouping
```javascript
columns: [
  { title: "User Info", columns: [...] },
  { title: "Actions", columns: [...] }
]
```

### Cell Editing
```javascript
{ 
  title: "Name", 
  field: "name", 
  editor: "input",
  cellEdited: function(cell) {
    // Handle edit
  }
}
```

### Export Data
```javascript
State.usersTable.download("csv", "users.csv");
State.usersTable.download("json", "users.json");
```

### Row Selection
```javascript
// Enable in config
selectable: true,
selectableCheck: function(row) {
  return row.getData().username !== "admin";
}

// Get selected rows
var selectedRows = State.usersTable.getSelectedData();
```

## API Reference

Access the Tabulator instance via `State.usersTable`:

### Common Methods
```javascript
// Refresh data
State.usersTable.setData(State.users);

// Get all data
var allUsers = State.usersTable.getData();

// Get filtered data
var filteredUsers = State.usersTable.getData("active");

// Clear filters
State.usersTable.clearHeaderFilter();

// Programmatically set filter
State.usersTable.setHeaderFilterValue("username", "alice");

// Redraw table
State.usersTable.redraw();

// Destroy table
State.usersTable.destroy();
```

## Documentation Links

- **Tabulator Official Docs**: https://tabulator.info/
- **Column Setup**: https://tabulator.info/docs/6.2/columns
- **Sorting**: https://tabulator.info/docs/6.2/sort
- **Filtering**: https://tabulator.info/docs/6.2/filter
- **Formatting**: https://tabulator.info/docs/6.2/format

## Troubleshooting

### Table Not Displaying
- Check browser console for errors
- Ensure Tabulator CDN is loaded (check Network tab)
- Verify `State.usersTable` is initialized

### Styling Issues
- Check that custom CSS is loaded after Tabulator's CSS
- Verify CSS variables are defined in `:root` and `body[data-theme]`
- Clear browser cache

### Click Events Not Working
- Verify event delegation is set up on `#users-table` container
- Check that button classes match (`cmd`, `link-btn`)
- Ensure `data-cmd` and `data-payload` attributes are present

### Performance Issues
- Enable pagination for large datasets
- Use virtual DOM rendering (built-in to Tabulator)
- Limit the number of columns with complex formatters
