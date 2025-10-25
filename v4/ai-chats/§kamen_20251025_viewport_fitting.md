# Generic Viewport Fitting Implementation

**Date:** October 25, 2025  
**Objective:** Make a generic function that handles viewport fitting for content views and make it configurable through the Config object.

## Problem
The `mapPoints` view (along with all its menus top/bottom) occupies more space than the parent viewport, causing scrolling issues.

## Solution
Created a generic `fitContentToViewport()` function that can be applied to any content view, with configuration controlled through the `Config.ViewportFitting` object.

## Changes Made

### 1. Added Generic Viewport Fitting Configuration
Added `Config.ViewportFitting` object that allows per-content-section configuration:

```javascript
ViewportFitting: {
  [Constants.ContentSection.Login]: { enabled: false },
  [Constants.ContentSection.UsersList]: { enabled: false },
  [Constants.ContentSection.UserDetails]: { enabled: false },
  [Constants.ContentSection.Message]: { enabled: false },
  [Constants.ContentSection.MapPoints]: { 
    enabled: true,
    containerSelector: "#mapPoints-container", // The element to resize
    minHeight: 400,                            // Minimum height in pixels
    paddingBottom: 16                          // Extra padding at bottom
  },
  [Constants.ContentSection.MapPointDetails]: { enabled: false },
  [Constants.ContentSection.Settings]: { enabled: false },
  [Constants.ContentSection.About]: { enabled: false },
  [Constants.ContentSection.DeveloperTools]: { enabled: false },
}
```

### 2. Created Generic `fitContentToViewport()` Function
```javascript
/**
 * Adjusts the height of a content section's container to fit within the viewport.
 * Ensures the container and bottom menu are visible without scrolling.
 * 
 * @param {string} contentId - The ID of the content section (e.g., "mapPoints")
 */
export function fitContentToViewport(contentId)
```

**Features:**
- Checks if viewport fitting is enabled for the content section
- Calculates available height based on viewport, container position, and bottom menu
- Applies minimum height constraint
- Sets the container height dynamically
- Includes debug logging

### 3. Integrated with `showContent()` Function
Modified `showContent()` to automatically apply viewport fitting when showing content:

```javascript
// Apply generic viewport fitting after a short delay to ensure rendering is complete
setTimeout(function() {
  fitContentToViewport(State.currentContentId);
}, 150);
```

### 4. Updated `updateMapPointsLayout()` Function
Modified to use the generic viewport fitting function when enabled:

```javascript
// Use the generic viewport fitting function if enabled
if (Config.ViewportFitting && 
    Config.ViewportFitting[Constants.ContentSection.MapPoints] && 
    Config.ViewportFitting[Constants.ContentSection.MapPoints].enabled) {
  fitContentToViewport(Constants.ContentSection.MapPoints);
} else {
  // Fallback: old behavior
}
```

### 5. Enhanced Window Resize Handler
Updated window resize event listener to apply viewport fitting for any content:

```javascript
window.addEventListener('resize', function() {
  if (State.currentContentId) {
    // Apply viewport fitting for the current content section
    fitContentToViewport(State.currentContentId);
    
    // Special handling for MapPoints
    if (State.currentContentId === Constants.ContentSection.MapPoints) {
      updateMapPointsLayout();
      // ...
    }
  }
});
```

### 6. Added FitToViewport Flags (Optional)
Added backward-compatible flags to specific config sections:
- `Config.MapPointsList.FitToViewport = true`
- `Config.MapPointDetails.FitToViewport = false`
- `Config.UserDetails.FitToViewport = false`

These can be used as additional checks in future implementations.

## Usage

### To Enable Viewport Fitting for a Content View

1. Add configuration in `Config.ViewportFitting`:
```javascript
[Constants.ContentSection.YourView]: { 
  enabled: true,
  containerSelector: "#your-container-id",
  minHeight: 300,
  paddingBottom: 16
}
```

2. The function will automatically be called when:
   - The content view is shown via `showContent()`
   - The window is resized
   - (For MapPoints) The container is resized

### Configuration Options

- **enabled** (boolean): Whether viewport fitting is enabled for this section
- **containerSelector** (string): CSS selector for the container element to resize
- **minHeight** (number): Minimum height in pixels (default: 400)
- **paddingBottom** (number): Extra padding at the bottom in pixels (default: 16)

## Benefits

1. **Generic Solution**: Can be applied to any content view, not just MapPoints
2. **Configurable**: Easy to enable/disable and configure per content section
3. **No Scrolling**: Ensures content + menus fit within viewport
4. **Responsive**: Automatically adjusts on window resize
5. **Backward Compatible**: Old behavior preserved when not enabled
6. **Debug Friendly**: Includes console logging for troubleshooting

## Testing Recommendations

1. Test with different viewport sizes (desktop, tablet, mobile)
2. Test window resizing while viewing different content sections
3. Test with MapPoints in different view modes (List, Map, Both)
4. Verify bottom menu is always visible without scrolling
5. Check that other content sections are not affected (enabled: false)

## Future Enhancements

- Could extend to handle horizontal fitting as well
- Could add max-height constraints
- Could add responsive breakpoints for different screen sizes
- Could add smooth transitions when resizing
