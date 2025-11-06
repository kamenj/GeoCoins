import { SAMPLE_USERS, SAMPLE_POINTS } from "./data.js";
import { syncArrayWithTemplate } from "./dataUtils.js";
import DB from "./db.js";
import { rlog, setRemoteLoggerConfig } from "./remoteLogger.js";

const Constants = {
  HtmlElement: {
    Button: "button",
  },
  ClassName: {
    CmdBtn: "cmd-btn",
    LinkBtn: "link-btn",
    Cmd: "cmd",
    Collapsed: "collapsed",
  },
  ContentSection: {
    Login: "login",
    UsersList: "usersList",
    UserDetails: "userDetails",
    Message: "message",
    MapPoints: "mapPoints",
    MapPointDetails: "mapPointDetails",
    Settings: "settings",
    About: "about",
    DeveloperTools: "developerTools",
    Help: "help",
    Errors: "errors",
  },
  CommandName: {
    // Login commands
    LoginOk: "login.ok",
    LoginCancel: "login.cancel",
    LoginRegister: "login.register",
    // Users commands
    UsersAdd: "users.add",
    UsersRefresh: "users.refresh",
    UsersViewDetails: "users.viewDetails",
    UsersViewCompact: "users.viewCompact",
    UsersDeleteRow: "users.deleteRow",
    UsersEditRow: "users.editRow",
    UsersCancel: "users.cancel",
    // User details commands
    UserSave: "user.save",
    UserDelete: "user.delete",
    UserCancel: "user.cancel",
    // Message commands
    MessageOk: "message.ok",
    // Points commands
    PointsAdd: "points.add",
    PointsMyLoc: "points.myLoc",
    PointsRefresh: "points.refresh",
    PointsViewDetails: "points.viewDetails",
    PointsViewCompact: "points.viewCompact",
    PointsDeleteRow: "points.deleteRow",
    PointsEditRow: "points.editRow",
    PointsCancel: "points.cancel",
    PointsLogin: "points.login",
    PointsShowList: "points.showList",
    PointsShowMap: "points.showMap",
    PointsShowBoth: "points.showBoth",
    PointsFullScreen: "points.fullScreen",
    // Map point details commands
    MpdSave: "mpd.save",
    MpdDelete: "mpd.delete",
    MpdCancel: "mpd.cancel",
    // Settings commands
    SettingsApply: "settings.apply",
    SettingsReset: "settings.reset",
    SettingsClose: "settings.close",
    // About commands
    AboutOk: "about.ok",
    // Developer Tools commands
    DevToolsShowDb: "devtools.showDb",
    DevToolsSaveDb: "devtools.saveDb",
    DevToolsFontIncrease: "devtools.fontIncrease",
    DevToolsFontDecrease: "devtools.fontDecrease",
    DevToolsClose: "devtools.close",
    // Show commands
    ShowLogin: "show.login",
    ShowRegister: "show.register",
    ShowUsers: "show.users",
    ShowPoints: "show.points",
    ShowSettings: "show.settings",
    ShowAbout: "show.about",
    ShowDeveloperTools: "show.developerTools",
    ShowHelp: "show.help",
    ViewIssues: "view.issues",
    NewIssue: "new.issue",
  },
  MenuLocation: {
    TopTitle: "menu.top.title",
    TopTop: "menu.top.top",
    TopBottom: "menu.top.bottom",
    BottomTitle: "menu.bottom.title",
    BottomTop: "menu.bottom.top",
    BottomBottom: "menu.bottom.bottom",
    MapPointsTitle: "menu.mapPoints.title",
    ListRow: "list.row",
  },
  ElementId: {
    MenuTopTitleCommands: "menuTop-title-commands",
    MenuTopTopCommands: "menuTop-top-commands",
    MenuTopBottomCommands: "menuTop-bottom-commands",
    MenuBottomTitleCommands: "menuBottom-title-commands",
    MenuBottomTopCommands: "menuBottom-top-commands",
    MenuBottomBottomCommands: "menuBottom-bottom-commands",
    MapPointsTitleCommands: "mapPoints-title-commands",
    MenuTop: "menuTop",
    MenuBottom: "menuBottom",
    MenuTopHeader: "menuTop-header",
    MenuBottomHeader: "menuBottom-header",
    LoginHeader: "login-header",
    UsersListHeader: "usersList-header",
    UserDetailsHeader: "userDetails-header",
    MessageHeader: "message-header",
    MapPointsHeader: "mapPoints-header",
    MapPointDetailsHeader: "mapPointDetails-header",
    SettingsHeader: "settings-header",
    AboutHeader: "about-header",
    DeveloperToolsHeader: "developerTools-header",
    HelpHeader: "help-header",
    ErrorsHeader: "errors-header",
    UsersTbody: "users-tbody",
    UsersTable: "users-table",
    UsersEmpty: "users-empty",
    MpsTbody: "mps-tbody",
    MpsTable: "mps-table",
    MpsEmpty: "mps-empty",
    MessageText: "message-text",
    Message: "message",
    StatusBar: "statusBar",
    StatusBarTitle: "statusBar-title",
    StatusBarUser: "statusBar-user",
  },
  Attribute: {
    DataOpenUser: "data-open-user",
    DataOpenPoint: "data-open-point",
    DataCmd: "data-cmd",
    DataPayload: "data-payload",
    DataTheme: "data-theme",
    DataFont: "data-font",
  },
  Theme: {
    Light: "light",
  },
  FontSize: {
    Medium: "medium",
  },
  CommandPrefix: {
    Users: "users.",
    Points: "points.",
  },
};

const Config = {
  LS: {
    users: "app.users",
    points: "app.mapPoints",
    currentUser: "app.currentUser",
    settings: "app.settings",
  },
  Constants: Constants,
  AppTitle: "Dani-Geo-Coins v5",
  MenuButtons: {
    minWidth: 70,  // Reduced from 80 to fit more buttons on mobile
    minHeight: 30,
    MainMenu: {
      maxWidth: 120  // If any button exceeds this width, arrange in multi-column grid
    }
  },
  ISSUES_VIEW_LINK: "https://github.com/kamenj/GeoCoins/issues",
  ISSUES_NEW_LINK: "https://github.com/kamenj/GeoCoins/issues/new",
  Errors_GlobalHandlerEnabled: true, // Global error handler (admin setting)
  SaveGuiState: true, // Save GUI state to cookies (admin setting) - default TRUE
  RemoteLogging: false, // Enable remote logging to backend /log endpoint (admin setting) - default FALSE (auto-enabled for admin/dev/tester on first login)
  Debug: {
    UseDefaultCredentials: true,
    //  DefaultUser: "bob", //hider
    //  DefaultUser: "diana", //seeker
    DefaultUser: "alice", //admin
    
    DefaultPassword: "1234"
  },
  AutoLoadCachedUser: false, // Set to true to auto-login with previously logged-in user
  UsersTable: {
    view: "details",         // Current view mode: "details" or "compact"
    layout: "fitDataStretch", // Tabulator layout mode
    height: "400px",         // Table height - fixed height enables scrolling
    maxHeight: "400px",      // Maximum table height before scrolling
    pagination: false,       // Enable pagination
    paginationSize: 10,      // Rows per page
    // Column definitions will be created by getTableColumns() function
    initialSort: [           // Default sort configuration
      { column: "username", dir: "asc" }
    ],
    rowAlternating: true     // Enable alternating row colors (handled by CSS)
  },
  PointsTable: {
    view: "details",         // Current view mode: "details" or "compact"
    layout: "fitData",       // Tabulator layout mode - allows horizontal scrolling
    height: "100%",          // Table height (100% to fill parent container)
    maxHeight: "none",       // No maximum height constraint
    pagination: false,       // Enable pagination
    paginationSize: 10,      // Rows per page
    // Column definitions will be created by getPointsTableColumns() function
    initialSort: [           // Default sort configuration
      { column: "title", dir: "asc" }
    ],
    rowAlternating: true     // Enable alternating row colors (handled by CSS)
  },
  MapPointsList: {
    DockLeftWidth: 400,      // Width when docked left (horizontal layout). 0 = auto-calculate
    DockTopHeight: 0,        // Height when docked top (vertical layout). 0 = auto-calculate
    MinRowsVisible: 5,       // Minimum rows to show for auto-calculating height
    MinRowWidth: 300,        // Minimum width for list columns for auto-calculating width
    ContainerHeight: 0,      // Height of the entire MapPoints container. 0 or negative = fit to viewport (so container + bottom menu are visible without scrolling)
    InitialView: {
      showList: true,        // Show list subview initially
      showMap: true,         // Show map subview initially
    },
    ViewToggleButtonsLocation: "menu.bottom.title",  // Where to place List/Map/L+M buttons: "menu.bottom.title", "menu.bottom.top", or "menu.bottom.bottom"
    FitToViewport: true      // If true, auto-adjust container height to fit viewport
  },
  Map: {
    longPressMs: 1000,  // Duration in milliseconds to trigger long-press on map
    markers: {
      // Marker appearance configuration based on status
      statusStyles: {
        pending: {
          color: 'yellow',
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
          badgeColor: '#ffc107',
          badgeTextColor: '#000',
          badgeText: 'PENDING'
        },
        found: {
          color: 'green',
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          badgeColor: '#28a745',
          badgeTextColor: '#fff',
          badgeText: 'FOUND'
        },
        hidden: {
          color: 'blue',
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          badgeColor: '#007bff',
          badgeTextColor: '#fff',
          badgeText: 'HIDDEN'
        },
        default: {
          color: 'grey',
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
          badgeColor: '#6c757d',
          badgeTextColor: '#fff',
          badgeText: 'UNKNOWN'
        }
      },
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }
  },
  MapPointDetails: {
    mode: "view",  // "view", "edit", or "add" - controls whether fields are editable and which actions are available
    defaultCoords: null,  // {lat, lng} set by long-press on map
    FitToViewport: false   // If true, auto-adjust container height to fit viewport
  },
  UserDetails: {
    mode: "view",  // "view", "edit", "add", or "register" - controls whether fields are editable and which actions are available
    FitToViewport: false   // If true, auto-adjust container height to fit viewport
  },
  Database: {
    mode: "REMOTE", // "LOCAL" or "REMOTE"
    remote: {
      baseUrl: "/api", // Relative URL - uses webserver proxy which forwards to backend
      endpoints: {
        users: "/users",
        points: "/map_points",
        auth: "/auth",
      },
      headers: {
        "Content-Type": "application/json",
      },
    },
    local: {
      storageKeys: {
        users: "app.users",
        points: "app.mapPoints",
        currentUser: "app.currentUser",
        settings: "app.settings",
      },
    },
  },
  CONTENT_SECTIONS: [
    Constants.ContentSection.Login,
    Constants.ContentSection.UsersList,
    Constants.ContentSection.UserDetails,
    Constants.ContentSection.Message,
    Constants.ContentSection.MapPoints,
    Constants.ContentSection.MapPointDetails,
    Constants.ContentSection.Settings,
    Constants.ContentSection.About,
    Constants.ContentSection.DeveloperTools,
    Constants.ContentSection.Help,
    Constants.ContentSection.Errors,
  ],
  
  // Generic viewport fitting configuration per content section
  ViewportFitting: {
    [Constants.ContentSection.Login]: { enabled: false },
    [Constants.ContentSection.UsersList]: { enabled: false },
    [Constants.ContentSection.UserDetails]: { enabled: false },
    [Constants.ContentSection.Message]: { enabled: false },
    [Constants.ContentSection.MapPoints]: { 
      enabled: true,
      containerSelector: "#mapPoints-container", // The element to resize
      minHeight: 400,                            // Minimum height in pixels
      paddingBottom: 40                          // Extra padding at bottom to ensure bottom menu is visible
    },
    [Constants.ContentSection.MapPointDetails]: { enabled: false },
    [Constants.ContentSection.Settings]: { enabled: false },
    [Constants.ContentSection.About]: { enabled: false },
    [Constants.ContentSection.DeveloperTools]: { enabled: false },
    [Constants.ContentSection.Help]: { enabled: false },
  },

  Commands: {
    LIST: {
      [Constants.ContentSection.Login]: [
      {
        name: "login.ok",
        caption: "OK",
        menu: { location: "menu.bottom.title" },
        action: async function () {
          await handleLogin();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "login.cancel",
        caption: "Cancel",
        menu: { location: "menu.bottom.title" },
        action: function () {
          showContent(null);
        },
        visible: true,
        enabled: true,
      },
      {
        name: "login.register",
        caption: "Register",
        menu: { location: "menu.bottom.title" },
        action: function () {
          openUserDetailsForRegister();
        },
        visible: true,
        enabled: true,
      },
    ],
    [Constants.ContentSection.UsersList]: [
      {
        name: "users.add",
        caption: "Add user",
        menu: { location: "menu.bottom.title" },
        action: function () {
          openUserDetailsForAdd();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "users.refresh",
        caption: "Refresh",
        menu: { location: "menu.bottom.title" },
        action: function () {
          refreshUsersTable();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "users.viewDetails",
        caption: "Details",
        menu: { location: "menu.bottom.title" },
        action: function () {
          var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
          var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
          
          Config.UsersTable.view = "details";
          refreshUsersTable();
          renderMenusFor(State.currentContentId);
          
          // Force restore collapse state after render completes
          setTimeout(function() {
            setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
          }, 0);
        },
        visible: function() {
          return Config.UsersTable.view !== "details";
        },
        enabled: true,
      },
      {
        name: "users.viewCompact",
        caption: "Compact",
        menu: { location: "menu.bottom.title" },
        action: function () {
          var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
          var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
          
          Config.UsersTable.view = "compact";
          refreshUsersTable();
          renderMenusFor(State.currentContentId);
          
          // Force restore collapse state after render completes
          setTimeout(function() {
            setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
          }, 0);
        },
        visible: function() {
          return Config.UsersTable.view !== "compact";
        },
        enabled: true,
      },
      {
        name: "users.deleteRow",
        caption: "Delete",
        menu: { location: "list.row" },
        action: async function (username) {
          await removeUserByUsername(username);
          refreshUsersTable();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "users.editRow",
        caption: "Edit",
        menu: { location: "list.row" },
        action: async function (userId) {
          await openUserDetails(userId);
        },
        visible: true,
        enabled: true,
      },
      {
        name: "users.cancel",
        caption: "Cancel",
        menu: { location: "menu.bottom.title" },
        action: function () {
          showContent(null);
        },
        visible: true,
        enabled: true,
      },
    ],
    [Constants.ContentSection.UserDetails]: [
      {
        name: "user.save",
        caption: "Save",
        menu: { location: "menu.bottom.title" },
        action: async function () {
          await saveUserDetails();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "user.delete",
        caption: "Delete",
        menu: { location: "menu.bottom.title" },
        action: async function () {
          await deleteUser();
        },
        visible: function() {
          return Config.UserDetails.mode === "edit";
        },
        enabled: true,
      },
      {
        name: "user.cancel",
        caption: "Cancel",
        menu: { location: "menu.bottom.title" },
        action: function () {
          cancelUserDetails();
        },
        visible: true,
        enabled: true,
      },
    ],
    [Constants.ContentSection.Message]: [
      {
        name: "message.ok",
        caption: "OK",
        menu: { location: "menu.bottom.title" },
        action: function () {
          closeMessage();
        },
        visible: true,
        enabled: true,
      },
    ],
    [Constants.ContentSection.MapPoints]: [
      {
        name: "points.login",
        caption: "Login",
        menu: { location: "menu.mapPoints.title" },
        action: function () {
          // Exit fullscreen mode if active before showing login
          if (State.fullScreen.active) {
            exitMapPointsFullScreen();
          }
          showContent("login");
        },
        visible: function() {
          // Only show when not logged in
          return !State.currentUser;
        },
        enabled: true,
      },
      {
        name: "points.add",
        caption: "Add Point",
        menu: { location: "menu.bottom.title" },
        action: function () {
          openMapPointDetailsForAdd();
        },
        visible: function() {
          // Only show if user can add points (not hider-only)
          return canCurrentUserAddPoints();
        },
        enabled: true,
      },
      {
        name: "points.myLoc",
        caption: "My Loc",
        menu: { location: "menu.bottom.title" },
        action: function () {
          addPlaceholderAtMyLocation();
        },
        visible: function() {
          // Always show - useful for everyone to see their location
          return true;
        },
        enabled: true,
      },
      {
        name: "points.refresh",
        caption: "Refresh",
        menu: { location: "menu.bottom.title" },
        action: function () {
          refreshMapPointsTable();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "points.viewDetails",
        caption: "Details",
        menu: { location: "menu.bottom.title" },
        action: function () {
          var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
          var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
          
          Config.PointsTable.view = "details";
          refreshMapPointsTable();
          renderMenusFor(State.currentContentId);
          
          // Force restore collapse state after render completes
          setTimeout(function() {
            setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
          }, 0);
        },
        visible: function() {
          return Config.PointsTable.view !== "details";
        },
        enabled: true,
      },
      {
        name: "points.viewCompact",
        caption: "Compact",
        menu: { location: "menu.bottom.title" },
        action: function () {
          var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
          var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
          
          Config.PointsTable.view = "compact";
          refreshMapPointsTable();
          renderMenusFor(State.currentContentId);
          
          // Force restore collapse state after render completes
          setTimeout(function() {
            setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
          }, 0);
        },
        visible: function() {
          return Config.PointsTable.view !== "compact";
        },
        enabled: true,
      },
      {
        name: "points.showList",
        caption: "List",
        menu: { location: "menu.bottom.title" },  // Will be configurable via Config.MapPointsList.ViewToggleButtonsLocation
        action: function () {
          toggleMapPointsView('list');
        },
        visible: true,
        enabled: true,
      },
      {
        name: "points.showMap",
        caption: "Map",
        menu: { location: "menu.bottom.title" },  // Will be configurable via Config.MapPointsList.ViewToggleButtonsLocation
        action: function () {
          toggleMapPointsView('map');
        },
        visible: true,
        enabled: true,
      },
      {
        name: "points.showBoth",
        caption: "L+M",
        menu: { location: "menu.bottom.title" },  // Will be configurable via Config.MapPointsList.ViewToggleButtonsLocation
        action: function () {
          toggleMapPointsView('both');
        },
        visible: true,
        enabled: true,
      },
      {
        name: "points.fullScreen",
        caption: "Full Screen",
        menu: { location: "menu.bottom.title" },
        action: function () {
          enterMapPointsFullScreen();
        },
        visible: function() {
          return !State.fullScreen.active;
        },
        enabled: true,
      },
      {
        name: "points.deleteRow",
        caption: "Delete",
        menu: { location: "list.row" },
        action: async function (id) {
          // Fetch the point to check permissions
          var point = await findPointById(id);
          
          if (!point) {
            await customAlert('Error', 'Point not found');
            return;
          }
          
          // Check permission
          if (!canCurrentUserEditPoint(point)) {
            await customAlert('Permission Denied', 'You do not have permission to delete this point');
            return;
          }
          
          var result = await DB.deletePoint(Number(id));
          if (result.success) {
            // Invalidate cache
            invalidatePointCache(id);
            refreshMapPointsTable();
            // Update status bar to reflect changes
            await updateStatusBar();
          }
        },
        visible: true,
        enabled: true,
      },
      {
        name: "points.editRow",
        caption: "Edit",
        menu: { location: "list.row" },
        action: function (id) {
          openMapPointDetailsForEdit(id);
        },
        visible: true,
        enabled: true,
      },
      {
        name: "points.cancel",
        caption: "Cancel",
        menu: { location: "menu.bottom.title" },
        action: function () {
          // If in fullscreen mode, exit fullscreen instead of hiding content
          if (State.fullScreen.active) {
            exitMapPointsFullScreen();
          } else {
            showContent(null);
          }
        },
        visible: true,
        enabled: true,
      },
    ],
    [Constants.ContentSection.MapPointDetails]: [
      {
        name: "mpd.save",
        caption: "Save",
        menu: { location: "menu.bottom.title" },
        action: async function () {
          await saveMapPointFromDetails();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "mpd.delete",
        caption: "Delete",
        menu: { location: "menu.bottom.title" },
        action: async function () {
          await deleteMapPointFromDetails();
        },
        visible: function() {
          return Config.MapPointDetails.mode !== "add";
        },
        enabled: true,
      },
      {
        name: "mpd.cancel",
        caption: "Cancel",
        menu: { location: "menu.bottom.title" },
        action: function () {
          // Don't refresh markers when canceling, just switch view
          State.skipMapRefresh = true;
          showContent("mapPoints");
          State.skipMapRefresh = false;
        },
        visible: true,
        enabled: true,
      },
    ],
    [Constants.ContentSection.Settings]: [
      {
        name: "settings.apply",
        caption: "Apply",
        menu: { location: "menu.bottom.title" },
        action: async function () {
          await applySettings();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "settings.reset",
        caption: "Reset",
        menu: { location: "menu.bottom.title" },
        action: async function () {
          await resetAll();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "settings.close",
        caption: "Close",
        menu: { location: "menu.bottom.title" },
        action: async function () {
          // Check if settings have changed
          if (hasUnsavedSettingsChanges()) {
            var confirmed = await customConfirm(
              'Unsaved Changes',
              'You have unsaved changes. Close without saving?'
            );
            if (confirmed) {
              showContent(null);
            }
          } else {
            showContent(null);
          }
        },
        visible: true,
        enabled: true,
      },
    ],
    [Constants.ContentSection.About]: [
      {
        name: "about.ok",
        caption: "OK",
        menu: { location: "menu.bottom.title" },
        action: function () {
          showContent(null);
        },
        visible: true,
        enabled: true,
      },
    ],
    [Constants.ContentSection.DeveloperTools]: [
      {
        name: "devtools.showDb",
        caption: "Show DB",
        menu: { location: "menu.bottom.title" },
        action: function () {
          showDbInEditor();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "devtools.saveDb",
        caption: "Save DB",
        menu: { location: "menu.bottom.title" },
        action: async function () {
          await saveDbFromEditor();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "devtools.testError",
        caption: "Test Error",
        menu: { location: "menu.bottom.title" },
        action: function () {
          // Simulate a realistic error - accessing property of undefined
          var obj = null;
          var result = obj.someProperty.nestedProperty;
        },
        visible: true,
        enabled: true,
      },
      {
        name: "devtools.fontIncrease",
        caption: "A+",
        menu: { location: "menu.bottom.title" },
        action: function () {
          adjustEditorFontSize(2);
        },
        visible: true,
        enabled: true,
      },
      {
        name: "devtools.fontDecrease",
        caption: "A-",
        menu: { location: "menu.bottom.title" },
        action: function () {
          adjustEditorFontSize(-2);
        },
        visible: true,
        enabled: true,
      },
      {
        name: "devtools.close",
        caption: "Close",
        menu: { location: "menu.bottom.title" },
        action: function () {
          showContent(null);
        },
        visible: true,
        enabled: true,
      },
    ],
    [Constants.ContentSection.Errors]: [
      {
        name: "errors.copy",
        caption: "Copy to Clipboard",
        menu: { location: "menu.bottom.title" },
        action: function () {
          copyErrorsToClipboard();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "errors.clear",
        caption: "Clear All",
        menu: { location: "menu.bottom.title" },
        action: function () {
          clearAllErrors();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "errors.refresh",
        caption: "Refresh",
        menu: { location: "menu.bottom.title" },
        action: function () {
          showErrorsInEditor();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "errors.close",
        caption: "Close",
        menu: { location: "menu.bottom.title" },
        action: function () {
          showContent(null);
        },
        visible: true,
        enabled: true,
      },
    ],
  },
  DEFAULT_MENU_TOP: [
    {
      name: "show.login",
      caption: "Login",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("login");
      },
      visible: true,
      enabled: true,
    },
    {
      name: "show.register",
      caption: "Register",
      menu: { location: "menu.top.top" },
      action: function () {
        openUserDetailsForRegister();
      },
      visible: true,
      enabled: true,
    },
    {
      name: "show.users",
      caption: "Users List",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("usersList");
      },
      visible: function() {
        // Only show for admins
        if (!State.currentUser) return false;
        return hasRole(State.currentUser, 'admin');
      },
      enabled: true,
    },
    {
      name: "show.points",
      caption: "Map Points",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("mapPoints");
      },
      visible: true,
      enabled: true,
    },
    {
      name: "show.settings",
      caption: "Settings",
      menu: { location: "menu.top.top" },
      action: function () {
        openSettings(); // Call openSettings() instead of showContent() to properly initialize
      },
      visible: true,
      enabled: true,
    },
    {
      name: "show.about",
      caption: "About",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("about");
      },
      visible: true,
      enabled: true,
    },
    {
      name: "show.help",
      caption: "Help",
      menu: { location: "menu.top.top" },
      action: function () {
        // Scroll to help section
        var helpSection = $("help");
        if (helpSection) {
          helpSection.scrollIntoView({ behavior: "smooth", block: "start" });
          // Ensure it's expanded
          setCollapsed("help", false);
        }
      },
      visible: true,
      enabled: true,
    },
    {
      name: "show.developerTools",
      caption: "Developer Tools",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("developerTools");
      },
      visible: function() {
        // Only show for developers or admins
        if (!State.currentUser) return false;
        return hasRole(State.currentUser, 'developer') || hasRole(State.currentUser, 'admin');
      },
      enabled: true,
    },
    {
      name: "show.errors",
      caption: "Errors",
      menu: { location: "menu.top.top" },
      action: function () {
        showErrorsInEditor();
        showContent(Config.Constants.ContentSection.Errors);
      },
      visible: function() {
        var hasErrors = State.Errors && State.Errors.length > 0;
        return hasErrors && Config.Errors_GlobalHandlerEnabled;
      },
      enabled: true,
    },
    {
      name: "view.issues",
      caption: "View Issues",
      menu: { location: "menu.top.top" },
      action: function () {
        window.open(Config.ISSUES_VIEW_LINK, '_blank');
      },
      visible: function() {
        // Only show for users with tester or developer role
        if (!State.currentUser) return false;
        return hasRole(State.currentUser, 'tester') || hasRole(State.currentUser, 'developer');
      },
      enabled: true,
    },
    {
      name: "new.issue",
      caption: "New Issue",
      menu: { location: "menu.top.top" },
      action: function () {
        window.open(Config.ISSUES_NEW_LINK, '_blank');
      },
      visible: function() {
        // Only show for users with tester or developer role
        if (!State.currentUser) return false;
        return hasRole(State.currentUser, 'tester') || hasRole(State.currentUser, 'developer');
      },
      enabled: true,
    },
    {
      name: "logout",
      caption: "Logout",
      menu: { location: "menu.top.bottom" },
      action: function () {
        logout();
      },
      visible: true,
      enabled: true,
    },
  ],
  },
};

const State = {
  currentContentId: null,
  message_BefireDisplayContentID: null,
  users: [], // Array of user IDs only (for server mode) - populated on demand
  mapPoints: [], // Array of point IDs only (for server mode) - populated on demand
  currentUser: null,
  settings: { 
    theme: Config.Constants.Theme.Light, 
    font: Config.Constants.FontSize.Medium,
    autoHideTopMenu: true,
    saveGuiState: true, // Persisted setting for SaveGuiState
    errorsGlobalHandlerEnabled: true, // Persisted setting for global error handler
    remoteLogging: false // Persisted setting for remote logging
  },
  afterMessageShowId: null, // target section to show after closing the message
  mapPointsView: {
    showList: true,
    showMap: true,
  },
  leafletMap: null, // Store the Leaflet map instance
  tempPlacemark: null, // Temporary marker for long-press default coordinates
  jsonEditor: null, // JSONEditor instance for Developer Tools
  jsonEditorFontSize: 14, // Default font size for JSON editor
  usersTable: null, // Tabulator instance for Users table
  usersTableFilters: null, // Store table filter state
  pointsTable: null, // Tabulator instance for Points table
  pointsTableFilters: null, // Store table filter state
  Errors: [], // Global error log
  errorsJsonEditor: null, // JSONEditor instance for Errors view
  fullScreen: {
    active: false, // Whether full screen mode is active
    preFullScreenState: null, // Store the state before entering full screen for restoration
  },
  // Cache for recently accessed items (server mode optimization)
  _userCache: {}, // username -> user object
  _pointCache: {}, // id -> point object
  markers: {}, // pointId -> Leaflet marker object
};

// Expose Config, State, and showContent to window for errorHandler.js and connectionManager.js
window.Config = Config;
window.State = State;
window.showContent = showContent;


export function $(id) {
  return document.getElementById(id);
}
export function setText(id, txt) {
  var el = $(id);
  if (el) el.textContent = txt;
}
export function setVal(id, v) {
  var el = $(id);
  if (el) el.value = (v !== null && v !== undefined) ? v : "";
}
export function getVal(id) {
  var el = $(id);
  return el ? ("" + el.value).trim() : "";
}
export function save(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}
export function load(k, def) {
  try {
    var v = localStorage.getItem(k);
    return v ? JSON.parse(v) : def;
  } catch (e) {
    return def;
  }
}

/* ===== Cookie Management ===== */
export function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Strict";
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/* ===== GUI State Management ===== */
/**
 * Captures the current GUI state including visible content, input values, and collapsed states
 */
export function captureGuiState() {
  if (!Config.SaveGuiState) {
    return;
  }
  
  var guiState = {
    currentContentId: State.currentContentId,
    inputs: {},
    collapsed: {},
    mapPointsView: {
      showList: State.mapPointsView.showList,
      showMap: State.mapPointsView.showMap
    },
    usersTableView: Config.UsersTable.view,
    pointsTableView: Config.PointsTable.view,
    timestamp: new Date().toISOString()
  };
  
  // Capture all input field values (except passwords and settings inputs)
  var inputs = document.querySelectorAll('input:not([type="password"]), textarea, select');
  inputs.forEach(function(input) {
    // Skip passwords and settings inputs (settings should only be saved via Apply button)
    var isSettingsInput = input.id && input.id.startsWith('set-');
    var isPasswordInput = input.id === 'login-password' || input.id === 'ud-password';
    
    if (input.id && !isPasswordInput && !isSettingsInput) {
      if (input.type === 'checkbox') {
        guiState.inputs[input.id] = input.checked;
      } else {
        guiState.inputs[input.id] = input.value;
      }
    }
  });
  
  // Capture collapsed states for all sections
  Config.CONTENT_SECTIONS.forEach(function(sectionId) {
    var section = $(sectionId);
    if (section) {
      var isCollapsed = section.classList.contains(Config.Constants.ClassName.Collapsed);
      guiState.collapsed[sectionId] = isCollapsed;
    }
  });
  
  // Capture menu collapsed states
  [Config.Constants.ElementId.MenuTop, Config.Constants.ElementId.MenuBottom].forEach(function(menuId) {
    var menu = $(menuId);
    if (menu) {
      guiState.collapsed[menuId] = menu.classList.contains(Config.Constants.ClassName.Collapsed);
    }
  });
  
  // Capture Help section collapsed state
  var help = $(Config.Constants.ContentSection.Help);
  if (help) {
    guiState.collapsed[Config.Constants.ContentSection.Help] = help.classList.contains(Config.Constants.ClassName.Collapsed);
  }
  
  // Save to cookie (expires in 30 days)
  try {
    var guiStateJson = JSON.stringify(guiState);
    setCookie('guiState', guiStateJson, 30);
  } catch (e) {
    console.error('❌ Failed to save GUI state to cookie:', e);
  }
}

/**
 * Restores the GUI state from cookie if SaveGuiState is enabled
 */
export function restoreGuiState() {
  if (!Config.SaveGuiState) {
    return;
  }
  
  // If no user is logged in, don't restore GUI state (they might have logged out)
  if (!State.currentUser) {
    return;
  }
  
  try {
    var guiStateCookie = getCookie('guiState');
    if (!guiStateCookie) {
      return;
    }
    
    var guiState = JSON.parse(guiStateCookie);
    
    // Restore input field values
    if (guiState.inputs) {
      Object.keys(guiState.inputs).forEach(function(inputId) {
        var input = $(inputId);
        if (input) {
          if (input.type === 'checkbox') {
            input.checked = guiState.inputs[inputId];
          } else {
            input.value = guiState.inputs[inputId];
          }
        }
      });
    }
    
    // Restore map points view state
    if (guiState.mapPointsView) {
      State.mapPointsView.showList = guiState.mapPointsView.showList;
      State.mapPointsView.showMap = guiState.mapPointsView.showMap;
    }
    
    // Restore table views
    if (guiState.usersTableView) {
      Config.UsersTable.view = guiState.usersTableView;
    }
    if (guiState.pointsTableView) {
      Config.PointsTable.view = guiState.pointsTableView;
    }
    
    // Restore the current content view first (this will show Help section)
    if (guiState.currentContentId) {
      // Don't restore login screen if user is already logged in
      if (guiState.currentContentId === Config.Constants.ContentSection.Login && State.currentUser) {
      } else {
        showContent(guiState.currentContentId);
        
        // If restoring Settings, initialize the form values after showing it
        if (guiState.currentContentId === Config.Constants.ContentSection.Settings) {
          // Defer to ensure DOM is ready
          setTimeout(function() {
            setVal("set-theme", State.settings.theme || Config.Constants.Theme.Light);
            setVal("set-font", State.settings.font || Config.Constants.FontSize.Medium);
            
            var autoHideCheckbox = $("set-autoHideTopMenu");
            if (autoHideCheckbox) {
              autoHideCheckbox.checked = State.settings.autoHideTopMenu !== false;
            }
            
            var currentUser = State.currentUser;
            var isAdmin = currentUser && hasRole(currentUser, 'admin');
            
            var errorHandlerCheckbox = $('set-errorHandler');
            if (errorHandlerCheckbox && isAdmin) {
              errorHandlerCheckbox.checked = Config.Errors_GlobalHandlerEnabled;
            }
            
            var saveGuiStateCheckbox = $('set-saveGuiState');
            if (saveGuiStateCheckbox && isAdmin) {
              saveGuiStateCheckbox.checked = Config.SaveGuiState;
            }
            
            var remoteLoggingCheckbox = $('set-remoteLogging');
            if (remoteLoggingCheckbox && isAdmin) {
              remoteLoggingCheckbox.checked = Config.RemoteLogging;
            }
          }, 100);
        }
      }
    }
    
    // Restore collapsed states AFTER showing content
    if (guiState.collapsed) {
      Object.keys(guiState.collapsed).forEach(function(sectionId) {
        var section = $(sectionId);
        if (section) {
          var collapsedState = guiState.collapsed[sectionId];
          setCollapsed(sectionId, collapsedState);
        }
      });
    }
    
    // Ensure Help section is visible after restoration if content is shown or user is logged in
    if (State.currentContentId || State.currentUser) {
      setSectionVisible(Config.Constants.ContentSection.Help, true);
      // Restore Help collapsed state if it was saved
      if (guiState.collapsed && guiState.collapsed[Config.Constants.ContentSection.Help] !== undefined) {
        setCollapsed(Config.Constants.ContentSection.Help, guiState.collapsed[Config.Constants.ContentSection.Help]);
      }
    }
    
  } catch (e) {
    console.error('❌ Failed to restore GUI state from cookie:', e);
  }
}

/* ===== Coin Counting Functions ===== */
// Server mode compatible: these functions fetch data through DB API
export async function getCoinsFoundByUser(username) {
  if (!username) return 0;
  var result = await DB.getAllPoints();
  if (!result.success) return 0;
  var points = result.data || [];
  var count = 0;
  for (var i = 0; i < points.length; i++) {
    if (points[i].foundBy === username) {
      count++;
    }
  }
  return count;
}

export async function getCoinsHiddenByUser(username) {
  if (!username) return 0;
  var result = await DB.getAllPoints();
  if (!result.success) return 0;
  var points = result.data || [];
  var count = 0;
  for (var i = 0; i < points.length; i++) {
    if (points[i].username === username && points[i].status === 'hidden') {
      count++;
    }
  }
  return count;
}

export async function getTotalCoinsInGame() {
  var result = await DB.getAllPoints();
  if (!result.success) return 0;
  return (result.data || []).length;
}

export async function getCoinsFoundInGame() {
  var result = await DB.getAllPoints();
  if (!result.success) return 0;
  var points = result.data || [];
  var count = 0;
  for (var i = 0; i < points.length; i++) {
    if (points[i].status === 'found') {
      count++;
    }
  }
  return count;
}

export async function getCoinsHiddenInGame() {
  var result = await DB.getAllPoints();
  if (!result.success) return 0;
  var points = result.data || [];
  var count = 0;
  for (var i = 0; i < points.length; i++) {
    if (points[i].status === 'hidden') {
      count++;
    }
  }
  return count;
}

export async function getCoinsPendingInGame() {
  var result = await DB.getAllPoints();
  if (!result.success) return 0;
  var points = result.data || [];
  var count = 0;
  for (var i = 0; i < points.length; i++) {
    if (points[i].status === 'pending') {
      count++;
    }
  }
  return count;
}

/* ===== Status Bar ===== */
export async function setStatusBarTitle(title) {
  // Add coin counts to title if user is logged in
  if (State.currentUser) {
    var username = getCurrentUsername();
    var foundByUser = await getCoinsFoundByUser(username);
    var hiddenByUser = await getCoinsHiddenByUser(username);
    var totalFound = await getCoinsFoundInGame();
    var totalHidden = await getCoinsHiddenInGame();
    // Exclude pending coins from total count (only count found + hidden)
    var totalCoins = totalFound + totalHidden;
    
    var coinInfo = " | Found: " + foundByUser + " | Hidden: " + hiddenByUser + " | Total: " + totalFound + "/" + totalCoins;
    setText(Config.Constants.ElementId.StatusBarTitle, title + coinInfo);
  } else {
    setText(Config.Constants.ElementId.StatusBarTitle, title);
  }
}
export async function setStatusBarUser(userObj) {
  var username = userObj ? userObj.username : null;
  var userText = username ? "User: " + username : "Not logged in";
  
  // Add roles if user is logged in
  if (userObj) {
    var rolesDisplay = getRolesDisplay(userObj);
    if (rolesDisplay) {
      userText += " [" + rolesDisplay + "]";
    }
  }
  
  setText(Config.Constants.ElementId.StatusBarUser, userText);
}
export async function updateStatusBar() {
  await setStatusBarTitle(Config.AppTitle);
  await setStatusBarUser(State.currentUser);
  updateErrorIndicator();
}

/**
 * Show a brief message in the status bar title area
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds (default 3000)
 */
export async function showStatusBarMessage(message, duration) {
  duration = duration || 3000;
  
  // Save the current title
  var statusBarTitle = $(Config.Constants.ElementId.StatusBarTitle);
  if (!statusBarTitle) return;
  
  var originalTitle = statusBarTitle.textContent;
  
  // Show the message
  setText(Config.Constants.ElementId.StatusBarTitle, message);
  
  // Clear any existing timeout
  if (window._statusBarMessageTimer) {
    clearTimeout(window._statusBarMessageTimer);
  }
  
  // Restore the original title after duration
  window._statusBarMessageTimer = setTimeout(async function() {
    await updateStatusBar();
  }, duration);
}

/* ===== Error Indicator ===== */
export function updateErrorIndicator() {
  var errorBtn = $('statusBar-errors');
  if (!errorBtn) return;
  
  var hasErrors = State.Errors && State.Errors.length > 0;
  
  // Show button to all users if there are errors and handler is enabled
  if (hasErrors && Config.Errors_GlobalHandlerEnabled) {
    errorBtn.style.display = 'inline-block';
    errorBtn.textContent = 'Errors (' + State.Errors.length + ')';
  } else {
    errorBtn.style.display = 'none';
  }
}

// Make updateErrorIndicator available globally for errorHandler.js
window.updateErrorIndicator = updateErrorIndicator;

/* ===== Visibility / Collapse ===== */
export function setSectionVisible(id, visible) {
  var el = $(id);
  if (!el) {
    return;
  }
  
  // Use CSS class instead of inline style for better initial page load
  if (visible) {
    el.classList.add('visible');
    // Clear display:none for menus when showing them
    if (id === 'menuTop' || id === 'menuBottom') {
      el.style.display = '';
    }
  } else {
    el.classList.remove('visible');
    // Also set display:none for menus to ensure they're hidden
    if (id === 'menuTop' || id === 'menuBottom') {
      el.style.display = 'none';
    }
  }
  updateChevron(id);
}
export function setCollapsed(id, collapsed) {
  var el = $(id);
  if (!el) return;
  
  if (collapsed) {
    el.classList.add(Config.Constants.ClassName.Collapsed);
  } else {
    el.classList.remove(Config.Constants.ClassName.Collapsed);
  }
  
  updateChevron(id);
}
export function toggleCollapse(id) {
  var el = $(id);
  if (!el) return;
  
  setCollapsed(id, !el.classList.contains(Config.Constants.ClassName.Collapsed));
}

/* ===== Button Sizing and Overflow Management ===== */
export function ensureButtonSizes() {
  var buttons = document.querySelectorAll('.cmd-bar button, .title-cmds button');
  buttons.forEach(function(btn) {
    if (Config.MenuButtons.minWidth) {
      btn.style.minWidth = Config.MenuButtons.minWidth + 'px';
    }
    if (Config.MenuButtons.minHeight) {
      btn.style.minHeight = Config.MenuButtons.minHeight + 'px';
    }
  });
}

export function applyMainMenuLayout() {
  // Apply multi-column layout ONLY to DEFAULT_MENU_TOP (main menu when logged in)
  // This is only applied when user is logged in and no specific content is shown
  if (!State.currentUser) return;
  
  var mainMenu = $(Config.Constants.ElementId.MenuTopTopCommands);
  if (!mainMenu) return;
  
  var buttons = Array.from(mainMenu.querySelectorAll('button'));
  if (buttons.length === 0) return;
  
  // Only apply to DEFAULT_MENU_TOP - check if we have show.users, show.points, etc buttons
  var isDefaultMenu = buttons.some(function(btn) {
    var cmdName = btn.getAttribute('data-cmd');
    return cmdName === 'show.users' || cmdName === 'show.points' || cmdName === 'show.settings';
  });
  
  if (!isDefaultMenu) {
    // Not the default menu, reset to normal layout
    mainMenu.style.display = '';
    mainMenu.style.gridTemplateColumns = '';
    mainMenu.style.gap = '';
    mainMenu.style.justifyItems = '';
    buttons.forEach(function(btn) {
      btn.style.width = '';
    });
    return;
  }
  
  var maxWidth = Config.MenuButtons.MainMenu && Config.MenuButtons.MainMenu.maxWidth 
    ? Config.MenuButtons.MainMenu.maxWidth 
    : 120;
  
  // Check if any button exceeds max width
  var needsGrid = false;
  buttons.forEach(function(btn) {
    if (btn.offsetWidth > maxWidth) {
      needsGrid = true;
    }
  });
  
  if (needsGrid) {
    // Determine number of columns based on button count
    var columns = buttons.length >= 6 ? 3 : 2;
    
    mainMenu.style.display = 'grid';
    mainMenu.style.gridTemplateColumns = 'repeat(' + columns + ', 1fr)';
    mainMenu.style.gap = '8px';
    mainMenu.style.justifyItems = 'stretch';
    
    // Make all buttons take full width of their grid cell
    buttons.forEach(function(btn) {
      btn.style.width = '100%';
    });
  } else {
    // Reset to flex layout
    mainMenu.style.display = 'flex';
    mainMenu.style.gridTemplateColumns = '';
    mainMenu.style.gap = '';
    mainMenu.style.justifyItems = '';
    
    buttons.forEach(function(btn) {
      btn.style.width = '';
    });
  }
}

export function handleMenuOverflow(menuId) {
  var menu = $(menuId);
  if (!menu) return;
  
  // Get the title commands container
  var titleCommands = menu.querySelector('.title-cmds');
  if (!titleCommands) return;
  
  // Get the top commands container (expandable area inside .section-content)
  var topCommands = menu.querySelector('[id$="-top-commands"]');
  if (!topCommands) return;
  
  // Check if menu is currently expanded - if so, don't rearrange buttons
  // This prevents buttons from shifting during user interaction
  var isExpanded = !menu.classList.contains(Config.Constants.ClassName.Collapsed);
  if (isExpanded) {
    // Menu is expanded, user might be interacting - don't rearrange
    return;
  }
  
  // First, remove any existing expand button to start fresh
  var existingExpandBtn = titleCommands.querySelector('.menu-expand-btn');
  if (existingExpandBtn && existingExpandBtn.parentNode) {
    existingExpandBtn.parentNode.removeChild(existingExpandBtn);
  }
  
  // Move all buttons back from top commands to title commands (reset state)
  var buttonsInTop = Array.from(topCommands.querySelectorAll('button'));
  buttonsInTop.forEach(function(btn) {
    titleCommands.insertBefore(btn, titleCommands.lastChild);
  });
  
  // Get all buttons in title area (excluding expand button)
  var buttons = Array.from(titleCommands.querySelectorAll('button:not(.menu-expand-btn)'));
  
  // If no buttons in title, hide top commands and return (don't create expand button)
  if (buttons.length === 0) {
    topCommands.style.display = 'none';
    return;
  }
  
  // Calculate available width
  // Don't use titleCommands width (it's already constrained by buttons)
  // Use header width minus title-left width
  var header = menu.querySelector('.section-header');
  var titleLeft = menu.querySelector('.title-left');
  
  if (!header || !titleLeft) return;
  
  var headerWidth = header.getBoundingClientRect().width;
  var titleLeftWidth = titleLeft.getBoundingClientRect().width;
  var headerPadding = 20; // Estimated padding/gaps
  var availableWidth = headerWidth - titleLeftWidth - headerPadding;
  
  // First pass: calculate total width needed for all buttons
  var totalWidth = 0;
  var buttonWidths = [];
  for (var i = 0; i < buttons.length; i++) {
    var width = buttons[i].offsetWidth;
    buttonWidths.push(width);
    totalWidth += width + 8; // 8px for gap
  }
  
  // If all buttons fit, no overflow needed
  if (totalWidth <= availableWidth) {
    topCommands.style.display = 'none';
    // Don't auto-collapse - let user control expand/collapse state
    // Just update the chevron to reflect current state
    updateChevron(menuId);
    return;
  }
  
  // Some buttons don't fit - need to calculate overflow
  // Reserve space for expand button (50px)
  var expandBtnSpace = 50;
  availableWidth -= expandBtnSpace;
  
  totalWidth = 0;
  var overflowButtons = [];
  
  // Determine which buttons fit (with space for expand button)
  for (var i = 0; i < buttons.length; i++) {
    var btnWidth = buttons[i].offsetWidth + 8; // 8px for gap
    if (totalWidth + btnWidth <= availableWidth) {
      totalWidth += btnWidth;
    } else {
      overflowButtons.push(buttons[i]);
    }
  }
  
  // Only create and show expand button if there are overflow buttons
  if (overflowButtons.length > 0) {
    // Create expand button
    var expandBtn = document.createElement('button');
    expandBtn.className = 'menu-expand-btn';
    expandBtn.textContent = '▼';
    expandBtn.title = 'Show more commands';
    
    // Add both click and touch events for mobile support
    var expandHandler = function(e) {
      e.stopPropagation();
      e.preventDefault();
      toggleCollapse(menuId);
    };
    expandBtn.addEventListener('click', expandHandler);
    expandBtn.addEventListener('touchstart', expandHandler);
    
    titleCommands.appendChild(expandBtn);
    
    // Move overflow buttons to top commands section (inside .section-content)
    overflowButtons.forEach(function(btn) {
      topCommands.appendChild(btn);
    });
    
    // Show top commands section (will be visible when menu is expanded)
    topCommands.style.display = 'grid';
    // Don't auto-collapse - let user control the expand/collapse state
  } else {
    // No overflow - hide top commands but don't force collapse
    topCommands.style.display = 'none';
  }
  
  // Update chevron to reflect current state
  updateChevron(menuId);
}



export function updateChevron(id) {
  var chev = $("chev-" + id),
    el = $(id);
  if (!chev || !el) return;
  
  var isCollapsed = el.classList.contains(Config.Constants.ClassName.Collapsed);
  
  // Special handling for menuTop and menuBottom - only show chevron if they have collapsible content
  if (id === 'menuTop' || id === 'menuBottom') {
    var prefix = id === 'menuTop' ? 'menuTop' : 'menuBottom';
    var topCommands = $(prefix + '-top-commands');
    var bottomCommands = $(prefix + '-bottom-commands');
    
    // Check if there's actual visible content in the collapsible area
    var hasCollapsibleContent = false;
    
    // Check top-commands (where overflow buttons go)
    if (topCommands && topCommands.children.length > 0) {
      var topStyle = window.getComputedStyle(topCommands);
      if (topStyle.display !== 'none') {
        hasCollapsibleContent = true;
      }
    }
    
    // Check bottom-commands (legacy area)
    if (!hasCollapsibleContent && bottomCommands && bottomCommands.children.length > 0) {
      var bottomStyle = window.getComputedStyle(bottomCommands);
      if (bottomStyle.display !== 'none') {
        hasCollapsibleContent = true;
      }
    }
    
    if (hasCollapsibleContent) {
      chev.textContent = isCollapsed ? "▶" : "▼";
    } else {
      chev.textContent = "";
    }
    return;
  }
  
  // For bottom menu overflow sections, check if there's content
  var isBottomOverflow = id.indexOf('-bottom') !== -1;
  
  if (isBottomOverflow) {
    // Check if content area has any visible items
    var contentArea = el.querySelector('[id$="-bottom-commands"]');
    var hasContent = false;
    
    if (contentArea) {
      var children = Array.from(contentArea.children);
      hasContent = children.some(function(child) {
        return child.offsetWidth > 0 || child.offsetHeight > 0;
      });
    }
    
    // Only show chevron if there's overflow content
    if (hasContent) {
      chev.textContent = isCollapsed ? "▶" : "▼";
    } else {
      chev.textContent = "";
    }
  } else {
    // Regular section - always show chevron
    chev.textContent = isCollapsed ? "▶" : "▼";
  }
}

/* ===== Generic Viewport Fitting ===== */
/**
 * Adjusts the height of a content section's container to fit within the viewport.
 * Ensures the container and bottom menu are visible without scrolling.
 * 
 * @param {string} contentId - The ID of the content section (e.g., "mapPoints")
 */
export function fitContentToViewport(contentId) {
  if (!contentId) return;
  
  // Check if viewport fitting is enabled for this content section
  var viewportConfig = Config.ViewportFitting && Config.ViewportFitting[contentId];
  if (!viewportConfig || !viewportConfig.enabled) {
    return; // Viewport fitting not enabled for this section
  }
  
  // Get the container element
  var containerSelector = viewportConfig.containerSelector;
  if (!containerSelector) return;
  
  var container = document.querySelector(containerSelector);
  if (!container) return;
  
  // Get configuration values
  var minHeight = viewportConfig.minHeight || 400;
  var paddingBottom = viewportConfig.paddingBottom || 16;
  
  // Calculate available height
  var viewportHeight = window.innerHeight;
  var containerTop = container.getBoundingClientRect().top;
  
  // Get bottom menu height (including its margins)
  var menuBottom = $(Config.Constants.ElementId.MenuBottom);
  var menuBottomHeight = 0;
  if (menuBottom && menuBottom.style.display !== 'none') {
    var menuBottomRect = menuBottom.getBoundingClientRect();
    menuBottomHeight = menuBottomRect.height;
    
    // Add bottom menu's margins (10px top + 10px bottom = 20px from CSS)
    var menuBottomStyles = window.getComputedStyle(menuBottom);
    var menuBottomMarginTop = parseFloat(menuBottomStyles.marginTop) || 0;
    var menuBottomMarginBottom = parseFloat(menuBottomStyles.marginBottom) || 0;
    menuBottomHeight += menuBottomMarginTop + menuBottomMarginBottom;
  }
  
  // Account for body padding bottom (8px from CSS)
  var bodyPaddingBottom = 8;
  
  // Calculate available height: viewport - container top position - bottom menu height (with margins) - body padding - extra padding
  // Note: Help section is NOT included - it will be scrollable below the viewport
  var availableHeight = viewportHeight - containerTop - menuBottomHeight - bodyPaddingBottom - paddingBottom;
  
  // Apply minimum height constraint
  var finalHeight = Math.max(minHeight, availableHeight);
  
  // Set the container height
  container.style.height = finalHeight + 'px';
  
  //console.log("fitContentToViewport(" + contentId + "): set height to " + finalHeight + "px (viewport=" + viewportHeight + ", top=" + Math.round(containerTop) + ", menuBottom=" + Math.round(menuBottomHeight) + ", bodyPadding=" + bodyPaddingBottom + ", extraPadding=" + paddingBottom + ")");
}

/* ===== Show one content at a time ===== */
function hideAllContent() {
  for (var i = 0; i < Config.CONTENT_SECTIONS.length; i++) {
    // Keep Help section always visible
    if (Config.CONTENT_SECTIONS[i] !== Config.Constants.ContentSection.Help) {
      setSectionVisible(Config.CONTENT_SECTIONS[i], false);
    }
  }
  
  // Also hide menuTop and menuBottom when hiding all content
  setSectionVisible('menuTop', false);
  setSectionVisible('menuBottom', false);
}
export function showContent(id) {
  // Check if reconnect button is visible - if so, don't show any content
  var reconnectBtn = document.getElementById('statusBar-reconnect');
  var isReconnectMode = reconnectBtn && reconnectBtn.style.display !== 'none';
  
  if (isReconnectMode) {
    return; // Don't show any content while in reconnect mode
  }
  
  // Save filter state when leaving Users List
  if (State.currentContentId === Constants.ContentSection.UsersList && State.usersTable) {
    State.usersTableFilters = State.usersTable.getHeaderFilters();
  }
  
  // Save filter state when leaving Map Points
  if (State.currentContentId === Constants.ContentSection.MapPoints && State.pointsTable) {
    State.pointsTableFilters = State.pointsTable.getHeaderFilters();
  }
  
  // Save the previous content ID to detect if we're leaving Settings
  var previousContentId = State.currentContentId;
  
  State.currentContentId = id || null;
  hideAllContent();
  
  // Capture GUI state when content changes (debounced)
  // We DO capture when Settings is opened (so refresh works), but settings inputs are excluded from capture
  // We DON'T capture when closing Settings (to avoid capturing half-changed values)
  var isClosingSettings = previousContentId === Constants.ContentSection.Settings;
  
  if (Config.SaveGuiState && !isClosingSettings) {
    clearTimeout(window._guiStateSaveTimer);
    window._guiStateSaveTimer = setTimeout(captureGuiState, 500);
  }
  
  if (State.currentContentId) {
    setSectionVisible(State.currentContentId, true);
    
    // Ensure MapPoints starts expanded by default when first shown (good UX)
    // This ensures captureGuiState() saves it as expanded on first load
    if (State.currentContentId === Constants.ContentSection.MapPoints) {
      setCollapsed(State.currentContentId, false);
    }
    
    // Auto-fill login credentials for debugging
    if (State.currentContentId === Constants.ContentSection.Login && 
        Config.Debug.UseDefaultCredentials) {
      setVal("login-username", Config.Debug.DefaultUser);
      setVal("login-password", Config.Debug.DefaultPassword);
    }
    
    // Set focus to username field when login view is displayed
    if (State.currentContentId === Constants.ContentSection.Login) {
      setTimeout(function() {
        var usernameInput = $("login-username");
        if (usernameInput) {
          usernameInput.focus();
        }
      }, 100);
    }
    
    // Initialize Settings controls when Settings section is shown (only if not already initialized)
    if (State.currentContentId === Constants.ContentSection.Settings) {
      // Only initialize if this is the first time showing settings (not from openSettings call)
      if (!State._settingsInitialized) {
        setTimeout(function() {
          initializeSettingsControls();
        }, 0);
      }
    }
    
    // Initialize map when MapPoints section is shown
    if (State.currentContentId === Constants.ContentSection.MapPoints) {
      // Apply initial view state from config
      State.mapPointsView.showList = Config.MapPointsList.InitialView.showList;
      State.mapPointsView.showMap = Config.MapPointsList.InitialView.showMap;
      
      // Control visibility of the form based on user login status
      var mapPointsForm = $("mapPointsForm");
      if (mapPointsForm) {
        if (State.currentUser) {
          mapPointsForm.style.display = "block";
        } else {
          mapPointsForm.style.display = "none";
        }
      }
      
      // Set initial visibility
      var listDiv = $("mapPointsList");
      var mapDiv = $("mapPointsGeoView");
      var divider = $("mapPointsDivider");
      var container = $("mapPoints-container");
      
      if (State.mapPointsView.showList) {
        listDiv.classList.remove("hidden");
      } else {
        listDiv.classList.add("hidden");
      }
      
      if (State.mapPointsView.showMap) {
        mapDiv.classList.remove("hidden");
      } else {
        mapDiv.classList.add("hidden");
      }
      
      // Show divider only when both views are visible
      if (State.mapPointsView.showList && State.mapPointsView.showMap) {
        if (divider) divider.classList.remove("hidden");
      } else {
        if (divider) divider.classList.add("hidden");
      }
      
      // Update layout
      updateMapPointsLayout();
      
      // Refresh the points table to ensure columns reflect current user context
      refreshMapPointsTable();
      
      // Set up the divider drag handlers (needs to be done after elements are visible)
      setTimeout(function() {
        setupMapPointsDivider();
      }, 50);
      
      // Initialize map after a short delay to ensure container is rendered
      setTimeout(function() {
        initializeLeafletMap();
      }, 100);
    }
    
    // Initialize JSON editor when Developer Tools section is shown
    if (State.currentContentId === Constants.ContentSection.DeveloperTools) {
      setTimeout(function() {
        initializeJsonEditor();
      }, 100);
    }
  } else {
    // No content shown - check if reconnect button is visible
    var reconnectBtn = document.getElementById('statusBar-reconnect');
    var isReconnectMode = reconnectBtn && reconnectBtn.style.display !== 'none';
    
    if (!isReconnectMode) {
      // Only show top menu if NOT in reconnect mode
      var topHas =
        hasAnyChild(Config.Constants.ElementId.MenuTopTitleCommands) ||
        hasAnyChild(Config.Constants.ElementId.MenuTopTopCommands) ||
        hasAnyChild(Config.Constants.ElementId.MenuTopBottomCommands);
      if (topHas) {
        setSectionVisible(Config.Constants.ElementId.MenuTop, true);
      }
    }
  }
  
  // Don't render menus or show help if in reconnect mode
  var reconnectBtn = document.getElementById('statusBar-reconnect');
  var isReconnectMode = reconnectBtn && reconnectBtn.style.display !== 'none';
  
  if (!isReconnectMode) {
    renderMenusFor(State.currentContentId);
    // Note: setMenusVisibility() is called at the end of renderMenusFor()
    // so we don't need to manually show menuTop here
  }
  
  // Ensure Help section always remains visible when user is logged in OR content is shown
  // BUT not in reconnect mode
  if (!isReconnectMode && (State.currentContentId || State.currentUser)) {
    
    // Get Help section to check its current collapsed state
    var helpSection = $(Config.Constants.ContentSection.Help);
    var wasCollapsed = helpSection ? helpSection.classList.contains(Config.Constants.ClassName.Collapsed) : true;
    
    setSectionVisible(Config.Constants.ContentSection.Help, true);
    
    // Preserve the collapsed state (don't force it to collapsed)
    // Only set to collapsed if this is the first time showing it
    if (helpSection && !helpSection.classList.contains('visible')) {
      // First time showing, default to collapsed
      setCollapsed(Config.Constants.ContentSection.Help, true);
    }
    // If it was already visible, keep its current collapsed state (don't touch it)
    
    // Sync help section with current content (iframe scrolls internally, won't affect main page)
    if (State.currentContentId) {
      syncHelpSection(State.currentContentId);
    }
  } else {
    // No content shown and not logged in, hide Help section
    setSectionVisible(Config.Constants.ContentSection.Help, false);
  }
  
  // Apply generic viewport fitting after menus are rendered and a short delay to ensure rendering is complete
  // Skip for MapPoints since updateMapPointsLayout() already handles it
  if (State.currentContentId && State.currentContentId !== Constants.ContentSection.MapPoints) {
    setTimeout(function() {
      fitContentToViewport(State.currentContentId);
    }, 200);
  }
}

/* ===== Errors Content View ===== */
function initializeErrorsJsonEditor() {
  if (State.errorsJsonEditor) {
    State.errorsJsonEditor.destroy();
  }

  var container = $('errors-json-editor');
  if (!container) return;

  var options = {
    mode: 'code', // Code mode (read-only will be enforced)
    modes: ['code', 'tree', 'view'],
    onError: function (err) {
      customAlert('JSON Editor Error', err.toString());
    },
    onModeChange: function(newMode, oldMode) {
      // Keep it read-only in all modes
      if (State.errorsJsonEditor) {
        State.errorsJsonEditor.setMode(newMode);
      }
    }
  };

  State.errorsJsonEditor = new JSONEditor(container, options);
  
  // Make the editor read-only by disabling the textarea/ace editor
  setTimeout(function() {
    var aceEditor = container.querySelector('.ace_editor');
    if (aceEditor && aceEditor.env && aceEditor.env.editor) {
      aceEditor.env.editor.setReadOnly(true);
    }
    var textarea = container.querySelector('.jsoneditor-text');
    if (textarea) {
      textarea.setAttribute('readonly', 'readonly');
    }
  }, 100);
}

export function showErrorsInEditor() {
  var errors = State.Errors || [];
  
  if (!State.errorsJsonEditor) {
    initializeErrorsJsonEditor();
  }
  
  if (State.errorsJsonEditor) {
    State.errorsJsonEditor.set(errors);
  }
}

export function copyErrorsToClipboard() {
  var errors = State.Errors || [];
  var errorsJson = JSON.stringify(errors, null, 2);
  
  navigator.clipboard.writeText(errorsJson).then(function() {
    showMessage('Errors copied to clipboard!', 'errors');
  }).catch(function(err) {
    showMessage('Failed to copy errors: ' + err, 'errors');
  });
}

export function clearAllErrors() {
  State.Errors = [];
  updateErrorIndicator();
  showErrorsInEditor();
  showMessage('All errors cleared', 'errors');
}

/* ===== Help Section Synchronization ===== */
function syncHelpSection(contentId) {
  // Don't sync if no content is being shown
  if (!contentId) return;
  
  // Map content sections to help section IDs
  var helpSectionMap = {
    'login': 'help-getting-started',
    'usersList': 'help-managing-users',
    'userDetails': 'help-managing-users',
    'mapPoints': 'help-map-points',
    'mapPointDetails': 'help-map-points',
    'settings': 'help-settings',
    'about': 'help-getting-started',
    'developerTools': 'help-advanced-features'
  };
  
  var helpSectionId = helpSectionMap[contentId];
  
  if (helpSectionId) {
    // Get the help iframe
    var helpIframe = $('help-iframe');
    if (helpIframe && helpIframe.contentWindow) {
      // Wait a bit to ensure iframe is loaded, then send message
      setTimeout(function() {
        // Send message to iframe to scroll to the relevant section
        helpIframe.contentWindow.postMessage({
          type: 'scrollToHelpSection',
          sectionId: helpSectionId
        }, '*');
      }, 100);
    }
  }
}

/* ===== Message helpers ===== */
// export function showMessage(text, afterId) {
//   setText("message-text", text);
//   showContent(afterId ? afterId : "message");
// }
// export function closeMessageTo(id) {
//   showContent(id || null);
// }
function showMessage(text, showAfterId) {
  State.message_BefireDisplayContentID = State.currentContentId;
  // Remember where we were before showing the message
  // (same approach as v1: store the array of currently visible sections)
  State.afterMessageShowId = showAfterId || null;
  //save(Config.LS.messagePrev, uiVisible.slice(0));

  setText(Config.Constants.ElementId.MessageText, text);
  hideAllContent();
  // Hide everything, show only the message section
  showContent(Config.Constants.ContentSection.Message); //  setSectionVisible("message", true);
}

function closeMessage() {
  // Hide the message
  setSectionVisible(Config.Constants.ElementId.Message, false);

  // If a target was specified в†’ navigate there.
  // Otherwise restore the previously visible sections.
  // var prev = load(Config.LS.messagePrev, ["menu", "login"]);
  if (State.afterMessageShowId) {
    showContent(State.afterMessageShowId);
  } else {
    // If user is logged in, don't show login content
    if (State.message_BefireDisplayContentID && State.currentUser && State.message_BefireDisplayContentID === Config.Constants.ContentSection.Login) {
      showContent(null);
    } else if (State.message_BefireDisplayContentID) {
      showContent(State.message_BefireDisplayContentID);
    } else {
      showContent(null);
    }
  }

  // Reset intent
  State.afterMessageShowId = null;
  State.message_BefireDisplayContentID = null;
}

/* ===== Custom Prompt Modal ===== */
/**
 * Custom prompt dialog that returns a promise
 * @param {string} title - The title of the modal
 * @param {string} message - The message/label for the input
 * @param {string} defaultValue - Default value for the input (optional)
 * @returns {Promise<string|null>} - Returns the entered value or null if cancelled
 */
function customPrompt(title, message, defaultValue = '') {
  return new Promise((resolve) => {
    const modal = document.getElementById('customPromptModal');
    const titleEl = document.getElementById('customPromptTitle');
    const labelEl = document.getElementById('customPromptLabel');
    const inputEl = document.getElementById('customPromptInput');
    const okBtn = document.getElementById('customPromptOk');
    const cancelBtn = document.getElementById('customPromptCancel');
    
    // Set content
    titleEl.textContent = title;
    labelEl.textContent = message;
    inputEl.value = defaultValue;
    
    // Show modal
    modal.classList.remove('hidden');
    inputEl.focus();
    inputEl.select();
    
    // Handle OK
    const handleOk = () => {
      const value = inputEl.value.trim();
      cleanup();
      resolve(value || null);
    };
    
    // Handle Cancel
    const handleCancel = () => {
      cleanup();
      resolve(null);
    };
    
    // Handle Enter key
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleOk();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    };
    
    // Cleanup function
    const cleanup = () => {
      modal.classList.add('hidden');
      okBtn.removeEventListener('click', handleOk);
      cancelBtn.removeEventListener('click', handleCancel);
      inputEl.removeEventListener('keydown', handleKeyDown);
    };
    
    // Attach event listeners
    okBtn.addEventListener('click', handleOk);
    cancelBtn.addEventListener('click', handleCancel);
    inputEl.addEventListener('keydown', handleKeyDown);
  });
}

/**
 * Custom alert dialog that returns a promise
 * @param {string} title - The title of the modal
 * @param {string} message - The message to display
 * @returns {Promise<void>} - Returns when user clicks OK
 */
function customAlert(title, message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('customAlertModal');
    const titleEl = document.getElementById('customAlertTitle');
    const messageEl = document.getElementById('customAlertMessage');
    const okBtn = document.getElementById('customAlertOk');
    
    // Set content
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    // Show modal
    modal.classList.remove('hidden');
    okBtn.focus();
    
    // Handle OK
    const handleOk = () => {
      cleanup();
      resolve();
    };
    
    // Handle Enter/Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        handleOk();
      }
    };
    
    // Cleanup function
    const cleanup = () => {
      modal.classList.add('hidden');
      okBtn.removeEventListener('click', handleOk);
      document.removeEventListener('keydown', handleKeyDown);
    };
    
    // Attach event listeners
    okBtn.addEventListener('click', handleOk);
    document.addEventListener('keydown', handleKeyDown);
  });
}

/**
 * Custom confirm dialog with Yes/No buttons
 * @param {string} title - The title of the modal
 * @param {string} message - The message to display
 * @returns {Promise<boolean>} - Returns true if Yes clicked, false if No clicked
 */
function customConfirm(title, message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('customPromptModal');
    const titleEl = document.getElementById('customPromptTitle');
    const labelEl = document.getElementById('customPromptLabel');
    const inputEl = document.getElementById('customPromptInput');
    const okBtn = document.getElementById('customPromptOk');
    const cancelBtn = document.getElementById('customPromptCancel');
    
    // Set content
    titleEl.textContent = title;
    labelEl.textContent = message;
    
    // Hide input field and change button labels
    inputEl.style.display = 'none';
    okBtn.textContent = 'Yes';
    cancelBtn.textContent = 'No';
    
    // Show modal
    modal.classList.remove('hidden');
    cancelBtn.focus();
    
    // Handle Yes
    const handleYes = () => {
      cleanup();
      resolve(true);
    };
    
    // Handle No
    const handleNo = () => {
      cleanup();
      resolve(false);
    };
    
    // Handle key press
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleYes();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleNo();
      }
    };
    
    // Cleanup function
    const cleanup = () => {
      modal.classList.add('hidden');
      // Restore button labels
      okBtn.textContent = 'OK';
      cancelBtn.textContent = 'Cancel';
      // Show input field
      inputEl.style.display = 'block';
      // Remove event listeners
      okBtn.removeEventListener('click', handleYes);
      cancelBtn.removeEventListener('click', handleNo);
      document.removeEventListener('keydown', handleKeyDown);
    };
    
    // Attach event listeners
    okBtn.addEventListener('click', handleYes);
    cancelBtn.addEventListener('click', handleNo);
    document.addEventListener('keydown', handleKeyDown);
  });
}

/* ===== Role Management API ===== */
export function getRolesArray(user) {
  // Ensure roles is always an array
  if (!user) return [];
  if (Array.isArray(user.roles)) return user.roles;
  return [];
}
export function setRolesArray(user, rolesArray) {
  if (!user) return;
  user.roles = Array.isArray(rolesArray) ? rolesArray : [];
}
export function getRolesDisplay(user) {
  // Display roles as first letters in uppercase (e.g., "A, S, H")
  var roles = getRolesArray(user);
  if (roles.length === 0) return "";
  var letters = [];
  for (var i = 0; i < roles.length; i++) {
    var role = roles[i];
    if (role && role.length > 0) {
      letters.push(role.charAt(0).toUpperCase());
    }
  }
  return letters.join(", ");
}
export function hasRole(user, roleName) {
  var roles = getRolesArray(user);
  return roles.indexOf(roleName) !== -1;
}
export function addRole(user, roleName) {
  if (!user || !roleName) return;
  var roles = getRolesArray(user);
  if (roles.indexOf(roleName) === -1) {
    roles.push(roleName);
    setRolesArray(user, roles);
  }
}
export function removeRole(user, roleName) {
  if (!user || !roleName) return;
  var roles = getRolesArray(user);
  var newRoles = roles.filter(function (r) {
    return r !== roleName;
  });
  setRolesArray(user, newRoles);
}
export function canCurrentUserSeekPoints() {
  // Check if current user has seeker or admin role
  if (!State.currentUser) return false;
  return hasRole(State.currentUser, 'seeker') || hasRole(State.currentUser, 'admin');
}
export function canCurrentUserAddPoints() {
  // Check if current user can add points (not seeker-only)
  // Users who are ONLY seekers cannot add points
  if (!State.currentUser) return false;
  var roles = getRolesArray(State.currentUser);
  
  // If user has no roles, they can't add points
  if (roles.length === 0) return false;
  
  // If user only has 'seeker' role, they can't add points
  if (roles.length === 1 && roles[0] === 'seeker') return false;
  
  // Otherwise they can add points
  return true;
}
export function canCurrentUserEditPoint(point) {
  // Check if current user can edit/delete a point
  // Only the owner or an admin can edit/delete a point
  if (!State.currentUser || !point) return false;
  
  // Admins can edit any point
  if (hasRole(State.currentUser, 'admin')) return true;
  
  // Owners can edit their own points
  if (point.username === getCurrentUsername()) return true;
  
  return false;
}

/* ===== Wildcard Filter Helper ===== */
/**
 * Converts a wildcard pattern (like SQL LIKE) to a regex and tests against a value
 * Supports * as wildcard (matches any characters)
 * Supports OR operator using | or 'or' (case-insensitive)
 * Supports AND operator using 'and' (case-insensitive) - for multi-field filters only
 * Examples:
 *   "P*" matches "Pending", "Park"
 *   "*den" matches "Hidden", "Garden"
 *   "*und*" matches "Found", "Underground"
 *   "a*|b*" or "a* or b*" matches "Alice", "Bob", "Adam", "Betty"
 *   "pending|hidden" matches "pending", "hidden"
 * @param {string} pattern - The wildcard pattern (can contain | or 'or' for OR logic)
 * @param {string} value - The value to test (can be a string or array for multi-value matching)
 * @returns {boolean} - True if pattern matches value
 */
function matchWildcard(pattern, value) {
  if (!pattern) return true;
  if (!value) return false;
  
  // Check if this is an AND operation (contains ' and ' but not within a value context)
  var hasAnd = /\s+and\s+/i.test(pattern);
  
  if (hasAnd) {
    // AND operation - all patterns must match (useful for role filters)
    var andPatterns = pattern.split(/\s+and\s+/i);
    for (var j = 0; j < andPatterns.length; j++) {
      var andPattern = andPatterns[j].trim();
      if (!andPattern) continue;
      
      // For AND, we need to check if this pattern matches
      // This is primarily useful when value is an array or multi-value
      if (!matchSinglePattern(andPattern, value)) {
        return false;
      }
    }
    return true;
  }
  
  // OR operation (default)
  return matchSinglePattern(pattern, value);
}

/**
 * Helper function to match a single pattern (which may contain OR operators)
 * @param {string} pattern - The pattern to match
 * @param {string|array} value - The value(s) to test against
 * @returns {boolean} - True if pattern matches
 */
function matchSinglePattern(pattern, value) {
  // Split pattern by OR operators (| or 'or' with word boundaries)
  var normalizedPattern = pattern.replace(/\s+or\s+/gi, '|');
  var patterns = normalizedPattern.split('|');
  
  // Test each OR pattern - if any matches, return true
  for (var i = 0; i < patterns.length; i++) {
    var currentPattern = patterns[i].trim();
    if (!currentPattern) continue;
    
    // If value is an array, check if pattern matches any element
    if (Array.isArray(value)) {
      for (var k = 0; k < value.length; k++) {
        if (testPattern(currentPattern, value[k])) {
          return true;
        }
      }
    } else {
      // Single value
      if (testPattern(currentPattern, value)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Test a single pattern against a single value
 * @param {string} pattern - The pattern (may contain wildcards)
 * @param {string} value - The value to test
 * @returns {boolean} - True if matches
 */
function testPattern(pattern, value) {
  if (!value) return false;
  var strValue = String(value);
  
  // Check if pattern contains wildcard
  if (pattern.indexOf('*') === -1) {
    // No wildcard, use simple case-insensitive substring match
    return strValue.toLowerCase().indexOf(pattern.toLowerCase()) >= 0;
  }
  
  // Convert wildcard pattern to regex
  var regexPattern = pattern
    .replace(/[.+?^${}()[\]\\]/g, '\\$&')  // Escape special chars
    .replace(/\*/g, '.*');                   // Replace * with .*
  
  // Create regex with case-insensitive flag
  var regex = new RegExp('^' + regexPattern + '$', 'i');
  return regex.test(strValue);
}

/* ===== Users ===== */
// Server mode compatible: all operations go through DB API
export async function addUser(u) {
  var result = await DB.addUser(u);
  if (result.success) {
    // Invalidate cache
    delete State._userCache[u.username];
    // Note: We don't store the user in State.users anymore
  }
  return result;
}
export async function removeUserByUsername(username) {
  var result = await DB.deleteUser(username);
  if (result.success) {
    // Invalidate cache
    delete State._userCache[username];
    // Note: We don't store users in State.users anymore
  }
  return result;
}
export async function findUser(userId) {
  // Check cache first - but invalidate if password is missing (for edit mode)
  if (State._userCache[userId] && State._userCache[userId].password !== undefined) {
    return State._userCache[userId];
  }
  
  // Fetch from DB by ID (either not cached or cached without password)
  var result = await DB.getUserById(userId);
  if (result.success && result.data) {
    // Cache it
    State._userCache[userId] = result.data;
    return result.data;
  }
  return null;
}

/* ===== Map Points - Server Mode Compatible ===== */
// Helper function to find a point by ID (with caching)
export async function findPointById(id) {
  var numId = Number(id);
  
  // Check cache first
  if (State._pointCache[numId]) {
    return State._pointCache[numId];
  }
  
  // Fetch from DB
  var result = await DB.getPointById(numId);
  if (result.success && result.data) {
    // Cache it
    State._pointCache[numId] = result.data;
    return result.data;
  }
  return null;
}

// Synchronous helper to check user from cache (for UI rendering)
export function findUserFromCache(username) {
  // Only returns from cache, doesn't fetch
  return State._userCache[username] || null;
}

// Helper to get current user ID
export function getCurrentUserId() {
  return State.currentUser ? State.currentUser.id : null;
}

// Helper to get current username
export function getCurrentUsername() {
  return State.currentUser ? State.currentUser.username : null;
}

// Invalidate point cache
export function invalidatePointCache(id) {
  if (id !== undefined && id !== null) {
    delete State._pointCache[Number(id)];
  } else {
    // Clear entire cache
    State._pointCache = {};
  }
}

function getTableColumns(viewMode) {
  // Returns column definitions for Tabulator based on view mode
  // This function is defined here so it can access getRolesDisplay and renderCommandHTML
  
  var columns = {
    details: [
      { 
        title: "#", 
        field: "index", 
        widthGrow: 0,
        widthShrink: 1,
        minWidth: 40,
        headerSort: false, 
        formatter: function(cell) { 
          return cell.getRow().getPosition(); 
        },
        titleFormatter: function(cell, formatterParams, onRendered) {
          var container = document.createElement('div');
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'center';
          container.style.width = '100%';
          var currentView = Config.UsersTable.view;
          if (currentView !== 'details') {
            var detailsBtn = document.createElement('button');
            detailsBtn.textContent = '#';
            detailsBtn.className = 'cmd-btn view-toggle-btn';
            detailsBtn.title = 'Details View';
            detailsBtn.onclick = function(e) {
              e.stopPropagation();
              e.preventDefault();
              var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
              var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
              Config.UsersTable.view = "details";
              refreshUsersTable();
              renderMenusFor(State.currentContentId);
              setTimeout(function() {
                setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
              }, 0);
            };
            container.appendChild(detailsBtn);
          }
          if (currentView !== 'compact') {
            var compactBtn = document.createElement('button');
            compactBtn.textContent = '#';
            compactBtn.className = 'cmd-btn view-toggle-btn';
            compactBtn.title = 'Compact View';
            compactBtn.onclick = function(e) {
              e.stopPropagation();
              e.preventDefault();
              var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
              var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
              Config.UsersTable.view = "compact";
              refreshUsersTable();
              renderMenusFor(State.currentContentId);
              setTimeout(function() {
                setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
              }, 0);
            };
            container.appendChild(compactBtn);
          }
          return container;
        }
      },
      { title: "Username", field: "username", headerFilter: "input", sorter: "string", 
        headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
          return matchWildcard(headerValue, rowValue);
        }
      },
      { title: "Name", field: "name", headerFilter: "input", sorter: "string",
        headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
          return matchWildcard(headerValue, rowValue);
        }
      },
      { title: "Role", field: "roles", headerFilter: "input", sorter: "string", formatter: function(cell) {
        var user = cell.getRow().getData();
        return getRolesDisplay(user);
      },
        headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
          var rolesArray = getRolesArray(rowData);
          return matchWildcard(headerValue, rolesArray);
        }
      },
      { title: "Actions", field: "actions", headerSort: false, width: 150, formatter: function(cell) {
        var user = cell.getRow().getData();
        return renderCommandHTML({ payload: user.id }, Config.Constants.CommandName.UsersDeleteRow) + " " +
               renderCommandHTML({ payload: user.id }, Config.Constants.CommandName.UsersEditRow);
      }
      }
    ],
    compact: [
      { 
        title: "User", 
        field: "username", 
        headerFilter: "input", 
        sorter: "string",
        headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
          var username = rowData.username || '';
          return matchWildcard(headerValue, username);
        },
        formatter: function(cell) {
          var user = cell.getRow().getData();
          var rolesDisplay = getRolesDisplay(user);
          var rolesBadge = rolesDisplay ? ' <span class="role-badge">' + rolesDisplay + '</span>' : '';
          return '<strong>' + user.username + '</strong> - ' + (user.name || '') + rolesBadge;
        },
        titleFormatter: function(cell, formatterParams, onRendered) {
          var container = document.createElement('div');
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'center';
          container.style.width = '100%';
          var currentView = Config.UsersTable.view;
          if (currentView !== 'details') {
            var detailsBtn = document.createElement('button');
            detailsBtn.textContent = '#';
            detailsBtn.className = 'cmd-btn view-toggle-btn';
            detailsBtn.title = 'Details View';
            detailsBtn.onclick = function(e) {
              e.stopPropagation();
              e.preventDefault();
              var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
              var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
              Config.UsersTable.view = "details";
              refreshUsersTable();
              renderMenusFor(State.currentContentId);
              setTimeout(function() {
                setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
              }, 0);
            };
            container.appendChild(detailsBtn);
          }
          if (currentView !== 'compact') {
            var compactBtn = document.createElement('button');
            compactBtn.textContent = '#';
            compactBtn.className = 'cmd-btn view-toggle-btn';
            compactBtn.title = 'Compact View';
            compactBtn.onclick = function(e) {
              e.stopPropagation();
              e.preventDefault();
              var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
              var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
              Config.UsersTable.view = "compact";
              refreshUsersTable();
              renderMenusFor(State.currentContentId);
              setTimeout(function() {
                setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
              }, 0);
            };
            container.appendChild(compactBtn);
          }
          return container;
        },
        headerVertical: true
      },
      { title: "Actions", field: "actions", headerSort: false, width: 150, formatter: function(cell) {
        var user = cell.getRow().getData();
        return renderCommandHTML({ payload: user.id }, Config.Constants.CommandName.UsersDeleteRow) + " " +
               renderCommandHTML({ payload: user.id }, Config.Constants.CommandName.UsersEditRow);
      },
        headerVertical: true
      }
    ]
  };
  return columns[viewMode] || columns.details;
}

function getPointsTableColumns(viewMode) {
  // Returns column definitions for Tabulator for the points table based on view mode
  
  var baseDetailsColumns = [
    { 
      title: "#", 
      field: "index", 
      widthGrow: 0,
      widthShrink: 1,
      minWidth: 40,
      headerSort: false, 
      formatter: function(cell) { 
        return cell.getRow().getPosition(); 
      },
      titleFormatter: function(cell, formatterParams, onRendered) {
        // Create container for button only
        var container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.width = '100%';
        
        // Add view toggle button with # as text
        var currentView = Config.PointsTable.view;
        
        // Details button - shows # when in compact view
        if (currentView !== 'details') {
          var detailsBtn = document.createElement('button');
          detailsBtn.textContent = '#';
          detailsBtn.className = 'cmd-btn view-toggle-btn';
          detailsBtn.title = 'Details View';
          detailsBtn.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
            var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
            
            Config.PointsTable.view = "details";
            refreshMapPointsTable();
            renderMenusFor(State.currentContentId);
            
            setTimeout(function() {
              setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
            }, 0);
          };
          container.appendChild(detailsBtn);
        }
        
        // Compact button - shows # when in details view
        if (currentView !== 'compact') {
          var compactBtn = document.createElement('button');
          compactBtn.textContent = '#';
          compactBtn.className = 'cmd-btn view-toggle-btn';
          compactBtn.title = 'Compact View';
          compactBtn.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
            var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
            
            Config.PointsTable.view = "compact";
            refreshMapPointsTable();
            renderMenusFor(State.currentContentId);
            
            setTimeout(function() {
              setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
            }, 0);
          };
          container.appendChild(compactBtn);
        }
        
        return container;
      }
    },
    { title: "Title", field: "title", headerFilter: "input", sorter: "string", formatter: function(cell) {
      var point = cell.getRow().getData();
      return '<button class="' + Config.Constants.ClassName.LinkBtn + '" ' + 
             Config.Constants.Attribute.DataOpenPoint + '="' + point.id + '">' +
             (point.title || "(no title)") + '</button>';
    },
      headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        return matchWildcard(headerValue, rowValue);
      }
    },
    { title: "User", field: "username", headerFilter: "input", sorter: "string",
      headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        return matchWildcard(headerValue, rowValue);
      }
    },
    { title: "Status", field: "status", headerFilter: "input", sorter: "string", formatter: function(cell) {
      var status = cell.getValue() || "pending";
      var badge = '<span class="role-badge">' + status + '</span>';
      return badge;
    },
      headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        var status = rowValue || "pending";
        return matchWildcard(headerValue, status);
      }
    },
    // Code column hidden - users can enter code via "Enter Code" button
    // { title: "Code", field: "code", headerFilter: "input", sorter: "string", formatter: function(cell) {
    //   var point = cell.getRow().getData();
    //   // Only show code if current user is the point owner
    //   var isOwner = State.currentUser && point.username === State.currentUser;
    //   return isOwner ? (point.code || "") : "вЂўвЂўвЂўвЂўвЂў";
    // }},
    { title: "Found By", field: "foundBy", headerFilter: "input", sorter: "string", formatter: function(cell) {
      return cell.getValue() || "";
    },
      headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        return matchWildcard(headerValue, rowValue);
      }
    }
    // Latitude and Longitude columns hidden - users can navigate via Navigate button
    // { title: "Latitude", field: "lat", headerFilter: "input", sorter: "number", formatter: function(cell) {
    //   return Number(cell.getValue()).toFixed(6);
    // }},
    // { title: "Longitude", field: "lng", headerFilter: "input", sorter: "number", formatter: function(cell) {
    //   return Number(cell.getValue()).toFixed(6);
    // }}
  ];
  
  var baseCompactColumns = [
    { 
      title: "Point", 
      field: "title", 
      headerFilter: "input", 
      sorter: "string",
      titleFormatter: function(cell, formatterParams, onRendered) {
        // Create container for button only
        var container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.width = '100%';
        
        // Add view toggle button with # as text
        var currentView = Config.PointsTable.view;
        
        // Details button - shows # when in compact view
        if (currentView !== 'details') {
          var detailsBtn = document.createElement('button');
          detailsBtn.textContent = '#';
          detailsBtn.className = 'cmd-btn view-toggle-btn';
          detailsBtn.title = 'Details View';
          detailsBtn.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
            var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
            
            Config.PointsTable.view = "details";
            refreshMapPointsTable();
            renderMenusFor(State.currentContentId);
            
            setTimeout(function() {
              setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
            }, 0);
          };
          container.appendChild(detailsBtn);
        }
        
        // Compact button - shows # when in details view
        if (currentView !== 'compact') {
          var compactBtn = document.createElement('button');
          compactBtn.textContent = '#';
          compactBtn.className = 'cmd-btn view-toggle-btn';
          compactBtn.title = 'Compact View';
          compactBtn.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            var menuBottomEl = $(Config.Constants.ElementId.MenuBottom);
            var wasCollapsed = menuBottomEl ? menuBottomEl.classList.contains(Config.Constants.ClassName.Collapsed) : true;
            
            Config.PointsTable.view = "compact";
            refreshMapPointsTable();
            renderMenusFor(State.currentContentId);
            
            setTimeout(function() {
              setCollapsed(Config.Constants.ElementId.MenuBottom, wasCollapsed);
            }, 0);
          };
          container.appendChild(compactBtn);
        }
        
        return container;
      },
      headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        // Filter only by title field in compact view
        var title = rowData.title || '';
        return matchWildcard(headerValue, title);
      },
      formatter: function(cell) {
        var point = cell.getRow().getData();
        var coords = Number(point.lat).toFixed(4) + ', ' + Number(point.lng).toFixed(4);
        var userBadge = point.username ? ' <span class="role-badge">' + point.username + '</span>' : '';
        var statusBadge = point.status ? ' <span class="role-badge">' + point.status + '</span>' : '';
        
        // Show code only if current user is the point owner
        var isOwner = State.currentUser && point.username === getCurrentUsername();
        var codeBadge = isOwner && point.code ? ' <span class="role-badge">Code: ' + point.code + '</span>' : '';
        
        // Show foundBy if available
        var foundByBadge = point.foundBy ? ' <span class="role-badge">Found by: ' + point.foundBy + '</span>' : '';
        
        return '<strong>' + (point.title || '(no title)') + '</strong> - ' + coords + userBadge + statusBadge + codeBadge + foundByBadge;
      }
    }
  ];
  
  // Add Actions column - always visible (Navigate button for all, other buttons when logged in)
  baseDetailsColumns.push({
    title: "Actions", field: "actions", headerSort: false, width: 320, formatter: function(cell) {
      var point = cell.getRow().getData();
      var buttons = '';
      
      // Add Navigate button for all users (logged in or not)
      if (point.lat && point.lng) {
        var googleMapsUrl = 'https://www.google.com/maps?q=' + point.lat + ',' + point.lng;
        buttons += '<button class="' + Config.Constants.ClassName.CmdBtn + '" onclick="window.open(\'' + googleMapsUrl + '\', \'_blank\')" style="padding:4px 6px;font-size:0.85em;">Navigate</button> ';
      }
      
      // Add Enter Code and Edit/Delete buttons only if user is logged in
      if (State.currentUser) {
        var isOwner = point.username === getCurrentUsername();
        var isAdmin = hasRole(State.currentUser, 'admin');
        var isSeeker = hasRole(State.currentUser, 'seeker');
        
        // Add Enter Code button for seekers/admins on unfound, non-pending points they don't own
        var canEnterCode = (isSeeker || isAdmin) && !isOwner && point.status !== 'found' && point.status !== 'pending';
        if (canEnterCode) {
          buttons += '<button class="' + Config.Constants.ClassName.CmdBtn + '" onclick="window.appEnterPointCode(' + point.id + ')">Enter Code</button> ';
        }
        
        // Show Edit/Delete buttons if user is admin or owner
        var canEdit = isAdmin || isOwner;
        if (canEdit) {
          buttons += renderCommandHTML({ payload: point.id }, Config.Constants.CommandName.PointsDeleteRow) + " " +
                     renderCommandHTML({ payload: point.id }, Config.Constants.CommandName.PointsEditRow);
        }
      }
      
      return buttons;
    }
  });

  baseCompactColumns.push({
    title: "Actions", field: "actions", headerSort: false, width: 320, formatter: function(cell) {
      var point = cell.getRow().getData();
      var buttons = '';
      
      // Add Navigate button for all users (logged in or not)
      if (point.lat && point.lng) {
        var googleMapsUrl = 'https://www.google.com/maps?q=' + point.lat + ',' + point.lng;
        buttons += '<button class="' + Config.Constants.ClassName.CmdBtn + '" onclick="window.open(\'' + googleMapsUrl + '\', \'_blank\')" style="padding:4px 6px;font-size:0.85em;">Navigate</button> ';
      }
      
      // Add Enter Code and Edit/Delete buttons only if user is logged in
      if (State.currentUser) {
        var isOwner = point.username === getCurrentUsername();
        var isAdmin = hasRole(State.currentUser, 'admin');
        var isSeeker = hasRole(State.currentUser, 'seeker');
        
        // Add Enter Code button for seekers/admins on unfound, non-pending points they don't own
        var canEnterCode = (isSeeker || isAdmin) && !isOwner && point.status !== 'found' && point.status !== 'pending';
        if (canEnterCode) {
          buttons += '<button class="' + Config.Constants.ClassName.CmdBtn + '" onclick="window.appEnterPointCode(' + point.id + ')">Enter Code</button> ';
        }
        
        // Show Edit/Delete buttons if user is admin or owner
        var canEdit = isAdmin || isOwner;
        if (canEdit) {
          buttons += renderCommandHTML({ payload: point.id }, Config.Constants.CommandName.PointsDeleteRow) + " " +
                     renderCommandHTML({ payload: point.id }, Config.Constants.CommandName.PointsEditRow);
        }
      }
      
      return buttons;
    }
  });
  
  var columns = {
    details: baseDetailsColumns,
    compact: baseCompactColumns
  };
  
  return columns[viewMode] || columns.details;
}

function renderUsersRow(u, i) {
  var actionsHTML = [
    renderCommandHTML({ payload: u.id }, Config.Constants.CommandName.UsersDeleteRow),
    renderCommandHTML({ payload: u.id }, Config.Constants.CommandName.UsersEditRow),
  ].join(" ");
  var rolesDisplay = getRolesDisplay(u);
  var html = `
    <tr>
      <td>${i + 1}</td>
      <td><button class="${Config.Constants.ClassName.LinkBtn}" ${Config.Constants.Attribute.DataOpenUser}="${u.id}">${
    u.username
  }</button></td>
      <td>${u.name || ""}</td>
      <td>${rolesDisplay}</td>
      <td>${actionsHTML}</td>
    </tr>`;

  return html;
}
export function refreshUsersTable() {
  var tableDiv = $(Config.Constants.ElementId.UsersTable);
  var empty = $(Config.Constants.ElementId.UsersEmpty);
  
  // Fetch users from DB for display
  DB.getAllUsers().then(function(result) {
    var users = result.success ? (result.data || []) : [];
    
    if (users.length === 0) {
      tableDiv.style.display = "none";
      empty.style.display = "block";
      if (State.usersTable) {
        State.usersTable.destroy();
        State.usersTable = null;
      }
      return;
    }
    
    tableDiv.style.display = "block";
    empty.style.display = "none";
    
    // Save current filter state before updating (only if table is already initialized)
    if (State.usersTable && State.usersTable.initialized) {
      try {
        State.usersTableFilters = State.usersTable.getHeaderFilters();
      } catch(e) {
        // Ignore errors if table not ready
        State.usersTableFilters = null;
      }
    }
    
    // Get current view mode from config
    var viewMode = Config.UsersTable.view || "details";
    var columns = getTableColumns(viewMode);
    
    // Initialize or update the Tabulator table
    if (!State.usersTable) {
      // Create new Tabulator instance
      State.usersTable = new Tabulator("#" + Config.Constants.ElementId.UsersTable, {
        data: users,
        layout: Config.UsersTable.layout,
        height: Config.UsersTable.height,
        maxHeight: Config.UsersTable.maxHeight,
        columns: columns,
        initialSort: Config.UsersTable.initialSort,
        pagination: Config.UsersTable.pagination,
        paginationSize: Config.UsersTable.paginationSize,
        rowFormatter: function(row) {
          // Add alternating row colors
          if (Config.UsersTable.rowAlternating) {
            var rowIndex = row.getPosition();
            if (rowIndex % 2 === 0) {
              row.getElement().classList.add("tabulator-row-even");
            } else {
              row.getElement().classList.add("tabulator-row-odd");
            }
          }
        }
      });
      
      // Add row click handler to show selection indicator
      State.usersTable.on("rowClick", function(e, row) {
        // Remove selection indicator from all rows
        var allRows = State.usersTable.getRows();
        for (var i = 0; i < allRows.length; i++) {
          allRows[i].getElement().classList.remove("row-selected");
        }
        // Add selection indicator to clicked row
        row.getElement().classList.add("row-selected");
      });
      
      // Restore filter state after table is built
      State.usersTable.on("tableBuilt", function() {
        if (State.usersTableFilters && State.usersTableFilters.length > 0) {
          for (var i = 0; i < State.usersTableFilters.length; i++) {
            var filter = State.usersTableFilters[i];
            State.usersTable.setHeaderFilterValue(filter.field, filter.value);
          }
        }
      });
    } else {
      // Update existing table with new data and columns
      // Wait for table to be ready before updating
      if (State.usersTable.initialized) {
        State.usersTable.setColumns(columns);
        State.usersTable.setData(users);
        
        // Restore filter state after update
        if (State.usersTableFilters && State.usersTableFilters.length > 0) {
          setTimeout(function() {
            for (var i = 0; i < State.usersTableFilters.length; i++) {
              var filter = State.usersTableFilters[i];
              State.usersTable.setHeaderFilterValue(filter.field, filter.value);
            }
          }, 100);
        }
      }
    }
  });
}

function fillUserDetails(u, mode) {
  // mode: "edit", "add", or "register"
  Config.UserDetails.mode = mode || "edit";
  
  // Update mode indicator
  var modeText = mode === "add" ? "(Add New)" : mode === "register" ? "(Register)" : "(Edit)";
  setText("ud-mode-indicator", modeText);
  
  setVal("ud-username-old", u.username || "");
  setVal("ud-username", u.username || "");
  setVal("ud-name", u.name || "");
  setVal("ud-password", u.password || "");
  
  // Set role checkboxes
  var roles = getRolesArray(u);
  
  // For register or add mode, default to seeker if no roles are set
  if ((mode === "register" || mode === "add") && roles.length === 0) {
    roles = ["seeker"];
  }
  
  $("ud-role-admin").checked = roles.indexOf("admin") !== -1;
  $("ud-role-seeker").checked = roles.indexOf("seeker") !== -1;
  $("ud-role-hider").checked = roles.indexOf("hider") !== -1;
  $("ud-role-tester").checked = roles.indexOf("tester") !== -1;
  $("ud-role-developer").checked = roles.indexOf("developer") !== -1;
  
  // Hide admin checkbox in register mode
  var adminLabel = $("ud-role-admin").closest("label");
  if (adminLabel) {
    if (mode === "register") {
      adminLabel.style.display = "none";
      $("ud-role-admin").checked = false; // Ensure admin is false
    } else {
      adminLabel.style.display = "inline-block";
    }
  }
}
export async function openUserDetails(userId) {
  var u = await findUser(userId);
  if (!u) return;
  showContent("userDetails");
  fillUserDetails(u, "edit");
}
export function openUserDetailsForAdd() {
  var emptyUser = {
    username: "",
    name: "",
    password: "",
    roles: []
  };
  showContent("userDetails");
  fillUserDetails(emptyUser, "add");
}
export function openUserDetailsForRegister() {
  var emptyUser = {
    username: "",
    name: "",
    password: "",
    roles: []
  };
  showContent("userDetails");
  fillUserDetails(emptyUser, "register");
}
export async function saveUserDetails() {
  var mode = Config.UserDetails.mode;
  var oldU = getVal("ud-username-old");
  var newU = getVal("ud-username");
  var newName = getVal("ud-name");
  var newPassword = getVal("ud-password");
  
  // Validate username is not empty
  if (!newU) return await customAlert("Validation Error", "Username cannot be empty.");

  // Validate username length
  if (newU.length > 20) {
    await customAlert("Validation Error", "Username must be maximum 20 characters.");
    return;
  }
  
  // Validate name is not empty (for register and add modes)
  if ((mode === "register" || mode === "add") && !newName) {
    return await customAlert("Validation Error", "Name cannot be empty.");
  }
  
  // Validate password is not empty (for register and add modes)
  if ((mode === "register" || mode === "add") && !newPassword) {
    return await customAlert("Validation Error", "Password cannot be empty.");
  }
  
  // Check if username already exists (skip check if editing the same user)
  if (mode !== "edit" || oldU !== newU) {
    // Use dedicated endpoint that returns 200 OK with exists flag (no 404 errors)
    var checkResult = await DB.checkUsernameExists(newU);
    if (checkResult.success && checkResult.exists) {
      return await customAlert("Validation Error", "Username already exists. Please choose a different username.");
    }
  }
  
  // Get roles from checkboxes
  var newRoles = [];
  // In register mode, admin checkbox is hidden and should be false
  if (mode !== "register" && $("ud-role-admin").checked) {
    newRoles.push("admin");
  }
  if ($("ud-role-seeker").checked) newRoles.push("seeker");
  if ($("ud-role-hider").checked) newRoles.push("hider");
  if ($("ud-role-tester").checked) newRoles.push("tester");
  if ($("ud-role-developer").checked) newRoles.push("developer");
  
  // Validate at least one role is selected
  if (newRoles.length === 0) {
    return await customAlert("Validation Error", "Please select at least one role.");
  }
  
  // Update user via DB
  var userData = {
    username: newU,
    name: newName,
    password: newPassword,
    roles: newRoles
  };
  
  if (mode === "edit") {
    // Update existing user
    var result = await DB.updateUser(oldU, userData);
    if (result.success) {
      // Invalidate cache
      delete State._userCache[oldU];
      delete State._userCache[newU];
      
      // Update current user if needed
      if (State.currentUser && State.currentUser.username === oldU) {
        State.currentUser.username = newU;
        State.currentUser.name = newName;
        State.currentUser.roles = newRoles;
        await DB.setCurrentUser(newU);
        await updateStatusBar(); // Update status bar if current user changed
      }
      
      refreshUsersTable();
      showContent("usersList");
    } else {
      await customAlert("Error", "Failed to save user: " + result.error);
    }
  } else if (mode === "add" || mode === "register") {
    // Add new user
    var newUser = {
      username: newU,
      password: newPassword,
      name: newName,
      roles: newRoles
    };
    
    var result = await addUser(newUser);
    if (result.success) {
      refreshUsersTable();
      
      if (mode === "register") {
        // Auto-login after registration - store the full user object
        State.currentUser = result.data; // result.data contains the full user with ID
        await DB.setCurrentUser(result.data.username);
        // Cache the user data for menu rendering
        State._userCache[result.data.username] = result.data;
        await updateStatusBar();
        showContent(null); // Just show main content, no success message
      } else {
        // mode === "add" - admin adding a user
        await customAlert("Success", "User added successfully.");
        showContent("usersList");
      }
    } else {
      await customAlert("Error", "Failed to add user: " + result.error);
    }
  }
}
export async function deleteUser() {
  var username = getVal("ud-username-old");
  if (!username) return;
  
  var result = await removeUserByUsername(username);
  if (result.success) {
    if (State.currentUser && State.currentUser.username === username) {
      State.currentUser = null;
      await DB.clearCurrentUser();
    }
    refreshUsersTable();
    showContent("usersList");
  } else {
    await customAlert("Error", "Failed to delete user: " + result.error);
  }
}
export function cancelUserDetails() {
  var mode = Config.UserDetails.mode;
  
  if (mode === "register") {
    // If canceling registration, go back to login
    showContent("login");
  } else {
    // If canceling add or edit, go back to users list
    showContent("usersList");
  }
}

/* ===== Auth ===== В§kamen_20251010_180801 */
export async function handleLogin() {
  var user = getVal("login-username"),
    pass = $("login-password").value;
  
  var result = await DB.authenticateUser(user, pass);
  if (result.success && result.data) {
    // Store the entire user object (with id, username, roles, etc.)
    State.currentUser = result.data;
    await DB.setCurrentUser(result.data.username);
    // Cache the user data immediately for menu rendering
    State._userCache[result.data.username] = result.data;
    
    // Check if this is first login (no cached GUI state)
    var guiStateCookie = getCookie('guiState');
    var isFirstLogin = !guiStateCookie;
    
    // Enable remote logging by default for admin/debug/tester users on first login
    if (isFirstLogin && (hasRole(result.data, 'admin') || hasRole(result.data, 'developer') || hasRole(result.data, 'tester'))) {
      // Load current settings or create defaults
      var settingsResult = await DB.getSettings();
      if (settingsResult.success && settingsResult.data) {
        State.settings = settingsResult.data;
      } else {
        State.settings = {
          theme: Config.Constants.Theme.Light,
          font: Config.Constants.FontSize.Medium,
          autoHideTopMenu: true,
          saveGuiState: true,
          errorsGlobalHandlerEnabled: true,
          remoteLogging: false
        };
      }
      
      // Enable remote logging
      State.settings.remoteLogging = true;
      Config.RemoteLogging = true;
      await DB.saveSettings(State.settings);
      setRemoteLoggerConfig(Config);
      console.log('Remote logging enabled by default for admin/developer/tester user:', result.data.username);
    }
    
    await updateStatusBar();
    // No message on successful login - just proceed
    showContent(null);
  } else {
    await customAlert("Login Failed", "Wrong username or password.");
  }
}
export async function logout() {
  State.currentUser = null;
  var clearResult = await DB.clearCurrentUser();
  // Clear user cache on logout
  State._userCache = {};
  // Delete GUI state cookie on logout (fresh start for next login)
  deleteCookie('guiState');
  // Show map points in view-only mode after logout
  showContent("mapPoints");
  // Show logout message after a short delay to ensure all status bar updates are complete
  setTimeout(function() {
    showStatusBarMessage("You have been logged out", 5000);
  }, 100);
}

/* ===== Map Points ===== */
function nextPointId() {
  var max = -1;
  for (var i = 0; i < State.mapPoints.length; i++) {
    var n = Number(State.mapPoints[i].id);
    if (isFinite(n) && n > max) max = n;
  }
  return max + 1;
}
async function savePoints() {
  // Not used anymore - DB operations happen directly in functions
  // Keeping for backward compatibility
}
function renderPointsRow(p, i) {
  // Deprecated - kept for backward compatibility but not used anymore
  // Points table now uses Tabulator
  var actionsHTML = [
    renderCommandHTML({ payload: p.id }, Config.Constants.CommandName.PointsDeleteRow),
    renderCommandHTML({ payload: p.id }, Config.Constants.CommandName.PointsEditRow),
  ].join(" ");
  var html = `
    <tr>
      <td>${i + 1}</td>
      <td><button class="${Config.Constants.ClassName.LinkBtn}" ${Config.Constants.Attribute.DataOpenPoint}="${p.id}">${
    p.title || "(no title)"
  }</button></td>
      <td>${p.username || ""}</td>
      <td>${p.lat}</td>
      <td>${p.lng}</td>
      <td>${actionsHTML}</td>
    </tr>`;
  return html;
}
export function refreshMapPointsTable() {
  // Control visibility of the form based on user login status
  var mapPointsForm = $("mapPointsForm");
  if (mapPointsForm) {
    if (State.currentUser) {
      mapPointsForm.style.display = "block";
    } else {
      mapPointsForm.style.display = "none";
    }
  }
  
  var tableDiv = $(Config.Constants.ElementId.MpsTable);
  var empty = $(Config.Constants.ElementId.MpsEmpty);
  
  // Ensure current user is cached before rendering table
  var currentUsername = getCurrentUsername();
  var cacheUserPromise = currentUsername && !State._userCache[currentUsername] 
    ? DB.getUserByUsername(currentUsername).then(function(result) {
        if (result.success && result.data) {
          State._userCache[currentUsername] = result.data;
        }
      })
    : Promise.resolve();
  
  // Fetch points from DB for display
  cacheUserPromise.then(function() {
    return DB.getAllPoints();
  }).then(function(result) {
    var points = result.success ? (result.data || []) : [];
    
    if (points.length === 0) {
      tableDiv.style.display = "none";
      empty.style.display = "block";
      if (State.pointsTable) {
        State.pointsTable.destroy();
        State.pointsTable = null;
      }
      
      // Also refresh map markers if map is initialized
      if (State.leafletMap) {
        refreshMapMarkers();
      }
      
      // Update status bar to reflect changes
      updateStatusBar();
      return;
    }
    
    tableDiv.style.display = "block";
    empty.style.display = "none";
    
    // Save current filter state before updating (only if table is already initialized)
    if (State.pointsTable && State.pointsTable.initialized) {
      try {
        State.pointsTableFilters = State.pointsTable.getHeaderFilters();
      } catch(e) {
        // Ignore errors if table not ready
        State.pointsTableFilters = null;
      }
    }
    
    // Get current view mode from config
    var viewMode = Config.PointsTable.view || "details";
    var columns = getPointsTableColumns(viewMode);
    
    // Initialize or update the Tabulator table
    if (!State.pointsTable) {
      // Calculate initial height based on parent container (mapPointsList)
      var mapPointsList = document.getElementById('mapPointsList');
      var mpsTableContainer = document.getElementById('mps-table');
      // Subtract some space for padding and other elements in the list
      var listPadding = 20; // padding in .mappoints-list
      var initialHeight = mapPointsList ? (mapPointsList.clientHeight - listPadding) : 500;
      
      // Create new Tabulator instance
      State.pointsTable = new Tabulator("#" + Config.Constants.ElementId.MpsTable, {
        data: points,
        layout: Config.PointsTable.layout,
        height: initialHeight, // Set initial pixel height
        maxHeight: Config.PointsTable.maxHeight,
        columns: columns,
        initialSort: Config.PointsTable.initialSort,
        pagination: Config.PointsTable.pagination,
        paginationSize: Config.PointsTable.paginationSize,
        rowFormatter: function(row) {
          // Add alternating row colors
          if (Config.PointsTable.rowAlternating) {
            var rowIndex = row.getPosition();
            if (rowIndex % 2 === 0) {
              row.getElement().classList.add("tabulator-row-even");
            } else {
              row.getElement().classList.add("tabulator-row-odd");
            }
          }
        }
      });
      
      // Force immediate redraw to ensure formatters use cached user data
      setTimeout(function() {
        if (State.pointsTable) {
          State.pointsTable.redraw(true);
        }
      }, 0);
      
      // Add row click handler to show selection indicator
      State.pointsTable.on("rowClick", function(e, row) {
        // Remove selection indicator from all rows
        var allRows = State.pointsTable.getRows();
        for (var i = 0; i < allRows.length; i++) {
          allRows[i].getElement().classList.remove("row-selected");
        }
        // Add selection indicator to clicked row
        row.getElement().classList.add("row-selected");
      });
      
      // Restore filter state after table is built
      State.pointsTable.on("tableBuilt", function() {
        if (State.pointsTableFilters && State.pointsTableFilters.length > 0) {
          for (var i = 0; i < State.pointsTableFilters.length; i++) {
            var filter = State.pointsTableFilters[i];
            State.pointsTable.setHeaderFilterValue(filter.field, filter.value);
          }
        }
      });
    } else {
      // Update existing table with new data and columns
      // Wait for table to be ready before updating
      if (State.pointsTable.initialized) {
        // Recalculate height based on parent container size
        var mapPointsList = document.getElementById('mapPointsList');
        if (mapPointsList && mapPointsList.clientHeight > 0) {
          var listPadding = 20;
          var newHeight = mapPointsList.clientHeight - listPadding;
          State.pointsTable.setHeight(newHeight);
        }
        
        State.pointsTable.setColumns(columns);
        State.pointsTable.setData(points);
        
        // Restore filter state after update
        if (State.pointsTableFilters && State.pointsTableFilters.length > 0) {
          setTimeout(function() {
            for (var i = 0; i < State.pointsTableFilters.length; i++) {
              var filter = State.pointsTableFilters[i];
              State.pointsTable.setHeaderFilterValue(filter.field, filter.value);
            }
          }, 100);
        }
      }
    }
    
    // Also refresh map markers if map is initialized
    if (State.leafletMap) {
      refreshMapMarkers();
    }
    
    // Update status bar to reflect changes
    updateStatusBar();
  });
}

export function clearMapPointForm() {
  setVal("mp-id", ""),
    setVal("mp-username", ""),
    setVal("mp-title", ""),
    setVal("mp-lat", ""),
    setVal("mp-lng", ""),
    setVal("mp-desc", "");
}
export async function saveMapPoint() {
  var idStr = getVal("mp-id"),
    username = getVal("mp-username"),
    title = getVal("mp-title"),
    lat = Number(getVal("mp-lat")),
    lng = Number(getVal("mp-lng")),
    desc = getVal("mp-desc");
  if (!isFinite(lat) || !isFinite(lng))
    return await customAlert("Validation Error", "Latitude and Longitude must be numbers.");
  
  if (idStr) {
    // Update existing point
    var id = Number(idStr);
    var pointData = {
      id: id,
      username: username,
      title: title,
      lat: lat,
      lng: lng,
      desc: desc,
    };
    
    var result = await DB.updatePoint(id, pointData);
    if (result.success) {
      // Update local state
      for (var i = 0; i < State.mapPoints.length; i++) {
        if (State.mapPoints[i].id === id) {
          State.mapPoints[i] = pointData;
        }
      }
      refreshMapPointsTable();
      showContent("mapPoints");
    } else {
      await customAlert("Error", "Failed to update point: " + result.error);
    }
  } else {
    // Add new point
    var newPoint = {
      username: username,
      title: title,
      lat: lat,
      lng: lng,
      desc: desc,
    };
    
    var result = await DB.addPoint(newPoint);
    if (result.success) {
      State.mapPoints.push(result.data);
      refreshMapPointsTable();
      clearMapPointForm();
      await customAlert("Success", "Map point added.");
      showContent("mapPoints");
    } else {
      await customAlert("Error", "Failed to add point: " + result.error);
    }
  }
}
export async function openMapPointDetails(id) {
  var p = await findPointById(id);
  if (!p) return;
  
  // Navigate map to this point if map is initialized and map view is visible
  if (State.leafletMap && State.mapPointsView.showMap) {
    navigateMapToPoint(p);
  }
  // Don't show details page - just navigate the map
}

export function navigateMapToPoint(point) {
  if (!State.leafletMap || !point || !point.lat || !point.lng) return;
  
  // Set view to the point with a good zoom level
  State.leafletMap.setView([point.lat, point.lng], 15);
  
  // Open the marker's popup if it exists in our stored markers
  if (State.markers[point.id]) {
    State.markers[point.id].openPopup();
  } else {
    // Fallback: search through all layers (for backwards compatibility)
    State.leafletMap.eachLayer(function(layer) {
      if (layer instanceof L.Marker) {
        var latlng = layer.getLatLng();
        if (latlng.lat === point.lat && latlng.lng === point.lng) {
          layer.openPopup();
        }
      }
    });
  }
}

export function openMapPointDetailsForAdd() {
  Config.MapPointDetails.mode = "add";
  setText("mpd-mode-indicator", "(Add New)");
  setVal("mpd-id", "");
  
  // State.currentUser is now the user object
  var currentUsername = getCurrentUsername() || "";
  setVal("mpd-username", currentUsername);
  
  setVal("mpd-title", "");
  
  // If a default coordinate was set by long-press, prefill them
  if (Config.MapPointDetails.defaultCoords) {
    setVal("mpd-lat", Config.MapPointDetails.defaultCoords.lat);
    setVal("mpd-lng", Config.MapPointDetails.defaultCoords.lng);
  } else {
    setVal("mpd-lat", "");
    setVal("mpd-lng", "");
  }
  
  setVal("mpd-desc", "");
  setVal("mpd-status", "pending");
  setVal("mpd-code", "");
  
  // Show code field (user is creating their own point)
  var codeLabel = $("mpd-code-label");
  if (codeLabel) codeLabel.style.display = "block";
  
  // Remove the temp placemark (coords are already stored)
  if (State.tempPlacemark && State.leafletMap) {
    State.leafletMap.removeLayer(State.tempPlacemark);
    State.tempPlacemark = null;
  }
  
  showContent("mapPointDetails");
}

export async function openMapPointDetailsForEdit(id) {
  var p = await findPointById(id);
  if (!p) return;
  
  // Check if user has permission to edit
  if (!canCurrentUserEditPoint(p)) {
    showMessage('You do not have permission to edit this point', 'mapPoints');
    return;
  }
  
  Config.MapPointDetails.mode = "edit";
  setText("mpd-mode-indicator", "(Edit)");
  setVal("mpd-id", p.id);
  setVal("mpd-username", p.username || "");
  setVal("mpd-title", p.title || "");
  setVal("mpd-lat", "" + p.lat);
  setVal("mpd-lng", "" + p.lng);
  setVal("mpd-desc", p.description || "");
  setVal("mpd-status", p.status || "pending");
  setVal("mpd-code", p.code || "");
  
  // Show/hide code field based on whether current user is the point owner
  var codeLabel = $("mpd-code-label");
  if (codeLabel) {
    var isOwner = State.currentUser && p.username === getCurrentUsername();
    codeLabel.style.display = isOwner ? "block" : "none";
  }
  
  showContent("mapPointDetails");
}

export async function saveMapPointFromDetails() {
  var idStr = getVal("mpd-id");
  var username = getVal("mpd-username") || getCurrentUsername() || "";
  var title = getVal("mpd-title").trim();
  var lat = Number(getVal("mpd-lat"));
  var lng = Number(getVal("mpd-lng"));
  var desc = getVal("mpd-desc");
  var status = getVal("mpd-status") || "pending";
  var code = getVal("mpd-code") || "";
  
  // Validate title is non-empty
  if (!title) {
    return showMessage("Title cannot be empty.", "mapPointDetails");
  }
  
  // Validate lat/lng are valid numbers
  if (!isFinite(lat) || !isFinite(lng)) {
    return showMessage("Latitude and Longitude must be valid numbers.", "mapPointDetails");
  }
  
  // Validate lat/lng are in valid ranges
  if (lat < -90 || lat > 90) {
    return showMessage("Latitude must be between -90 and 90.", "mapPointDetails");
  }
  if (lng < -180 || lng > 180) {
    return showMessage("Longitude must be between -180 and 180.", "mapPointDetails");
  }
  
  // Check title uniqueness - fetch all points from DB
  var currentId = Config.MapPointDetails.mode === "edit" ? Number(idStr) : null;
  var allPointsResult = await DB.getAllPoints();
  if (allPointsResult.success) {
    var allPoints = allPointsResult.data || [];
    for (var i = 0; i < allPoints.length; i++) {
      var point = allPoints[i];
      // Skip the current point when editing
      if (currentId !== null && Number(point.id) === currentId) {
        continue;
      }
      // Check if another point has the same title
      if (point.title && point.title.trim().toLowerCase() === title.toLowerCase()) {
        return showMessage("A map point with this title already exists. Please use a unique title.", "mapPointDetails");
      }
    }
  }
  
  if (Config.MapPointDetails.mode === "add") {
    // Add new point - send user_id instead of username
    var newPointData = {
      user_id: getCurrentUserId(),  // Send user_id directly to server
      title: title,
      lat: lat,
      lng: lng,
      description: desc,
      status: status,
      code: code
    };
    
    var result = await DB.addPoint(newPointData);
    if (result.success) {
      // Invalidate cache
      invalidatePointCache();
      refreshMapPointsTable();
      // Update status bar to reflect changes
      await updateStatusBar();
      showContent("mapPoints");
    } else {
      showMessage("Failed to add point: " + result.error, "mapPointDetails");
    }
  } else if (Config.MapPointDetails.mode === "edit") {
    // Update existing point - send user_id instead of username
    var id = Number(idStr);
    var pointData = {
      user_id: getCurrentUserId(),  // Send user_id directly to server
      title: title,
      lat: lat,
      lng: lng,
      description: desc,
      status: status,
      code: code
    };
    
    var result = await DB.updatePoint(id, pointData);
    if (result.success) {
      // Invalidate cache
      invalidatePointCache(id);
      refreshMapPointsTable();
      // Update status bar to reflect changes
      await updateStatusBar();
      showContent("mapPoints");
    } else {
      showMessage("Failed to update point: " + result.error, "mapPointDetails");
    }
  }
}

export function editMapPointFromDetails() {
  var id = Number(getVal("mpd-id"));
  var p = null;
  for (var i = 0; i < State.mapPoints.length; i++) {
    if (Number(State.mapPoints[i].id) === id) p = State.mapPoints[i];
  }
  if (!p) return;
  setVal("mp-id", p.id);
  setVal("mp-username", p.username || "");
  setVal("mp-title", p.title || "");
  setVal("mp-lat", "" + p.lat);
  setVal("mp-lng", "" + p.lng);
  setVal("mp-desc", p.description || "");
  showContent("mapPoints");
}
export async function deleteMapPointFromDetails() {
  var id = Number(getVal("mpd-id"));
  
  var result = await DB.deletePoint(id);
  if (result.success) {
    // Invalidate cache
    invalidatePointCache(id);
    refreshMapPointsTable();
    // Update status bar to reflect changes
    await updateStatusBar();
    showContent("mapPoints");
  } else {
    showMessage("Failed to delete point: " + result.error, "mapPointDetails");
  }
}

/* ===== Temporary Marker Popup ===== */
function createTempMarkerPopupContent(lat, lng, title, accuracy) {
  // title: optional string like "Your Location" or "Default coordinates for new point"
  // accuracy: optional accuracy in meters
  var titleText = title || "Marker";
  var content = titleText + '<br>Lat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6);
  
  // Add accuracy information if provided
  if (accuracy !== undefined && accuracy !== null) {
    content += '<br><small>Accuracy: В±' + Math.round(accuracy) + 'm</small>';
  }
  
  content += '<br>Drag to adjust<br>' +
         '<button onclick="window.appAddMapPoint()" style="margin-top:5px;margin-right:5px;">Add</button>' +
         '<button onclick="window.appDeleteTempMarker()" style="margin-top:5px;">Delete</button>';
  
  return content;
}

/* ===== My Location ===== */
export function addPlaceholderAtMyLocation() {
  if (!navigator.geolocation) {
    showMessage("Geolocation is not supported by your browser.", "mapPoints");
    return;
  }
  
  // Show loading message (optional)
  showMessage("Getting your location...", null);
  
  navigator.geolocation.getCurrentPosition(
    function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var accuracy = position.coords.accuracy; // Accuracy in meters
      
      // Store as default coords
      Config.MapPointDetails.defaultCoords = { lat: lat, lng: lng };
      
      // Remove previous temp marker if any
      if (State.tempPlacemark && State.leafletMap) {
        State.leafletMap.removeLayer(State.tempPlacemark);
        State.tempPlacemark = null;
      }
      
      // Add a temporary marker at the device's location
      if (State.leafletMap) {
        State.tempPlacemark = L.marker([lat, lng], { 
          draggable: true, 
          title: 'My Location',
          opacity: 0.6
        }).addTo(State.leafletMap);
        
        // Create popup with action buttons including accuracy info
        State.tempPlacemark.bindPopup(createTempMarkerPopupContent(lat, lng, 'Your Location', accuracy)).openPopup();
        
        // Center map on the marker
        State.leafletMap.setView([lat, lng], 15);
        
        // If marker is dragged, update default coords
        State.tempPlacemark.on('dragend', function(ev) {
          var p = ev.target.getLatLng();
          Config.MapPointDetails.defaultCoords = { lat: p.lat, lng: p.lng };
          State.tempPlacemark.setPopupContent(createTempMarkerPopupContent(p.lat, p.lng, 'Your Location (adjusted)'));
        });
      }
      
      // Close the loading message
      showContent("mapPoints");
    },
    function(error) {
      var errorMsg = "Unable to get your location. ";
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMsg += "Permission denied.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg += "Position unavailable.";
          break;
        case error.TIMEOUT:
          errorMsg += "Request timed out.";
          break;
        default:
          errorMsg += "Unknown error.";
      }
      showMessage(errorMsg, "mapPoints");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}


/* ===== Map Points View Management ===== */
export function toggleMapPointsView(mode) {
  // mode: 'list', 'map', or 'both'
  var listDiv = $("mapPointsList");
  var mapDiv = $("mapPointsGeoView");
  var divider = $("mapPointsDivider");
  var container = $("mapPoints-container");
  
  if (mode === 'list') {
    State.mapPointsView.showList = true;
    State.mapPointsView.showMap = false;
    listDiv.classList.remove("hidden");
    mapDiv.classList.add("hidden");
    if (divider) divider.classList.add("hidden");
    container.classList.add("show-list-only");
    container.classList.remove("show-map-only");
  } else if (mode === 'map') {
    State.mapPointsView.showList = false;
    State.mapPointsView.showMap = true;
    listDiv.classList.add("hidden");
    mapDiv.classList.remove("hidden");
    if (divider) divider.classList.add("hidden");
    container.classList.add("show-map-only");
    container.classList.remove("show-list-only");
  } else if (mode === 'both') {
    State.mapPointsView.showList = true;
    State.mapPointsView.showMap = true;
    listDiv.classList.remove("hidden");
    mapDiv.classList.remove("hidden");
    if (divider) divider.classList.remove("hidden");
    container.classList.remove("show-list-only");
    container.classList.remove("show-map-only");
  }
  
  // Update layout after visibility changes
  updateMapPointsLayout();
  
  // Refresh map if it's now visible
  if (State.mapPointsView.showMap && State.leafletMap) {
    setTimeout(function() {
      State.leafletMap.invalidateSize();
      refreshMapMarkers();
    }, 100);
  }
  
  // Re-render menu to update button visibility
  renderMenusFor(State.currentContentId);
}

/* ===== Full Screen Mode for MapPoints ===== */
export function enterMapPointsFullScreen() {
  // Save the current state before entering full screen
  State.fullScreen.preFullScreenState = {
    scrollY: window.scrollY || window.pageYOffset,
    visibleSections: [],
    collapsedStates: {},
    menuBottomParent: null,
    menuBottomNextSibling: null
  };
  
  // Record which sections were visible and collapsed before full screen
  for (var i = 0; i < Config.CONTENT_SECTIONS.length; i++) {
    var sectionId = Config.CONTENT_SECTIONS[i];
    var section = $(sectionId);
    if (section && section.style.display !== 'none') {
      State.fullScreen.preFullScreenState.visibleSections.push(sectionId);
    }
    // Save collapsed state
    if (section) {
      State.fullScreen.preFullScreenState.collapsedStates[sectionId] = section.classList.contains(Config.Constants.ClassName.Collapsed);
    }
  }
  
  // Also save collapsed states for menus
  var menuTop = $(Constants.ElementId.MenuTop);
  if (menuTop) {
    State.fullScreen.preFullScreenState.collapsedStates[Constants.ElementId.MenuTop] = menuTop.classList.contains(Config.Constants.ClassName.Collapsed);
  }
  
  var menuBottom = $(Constants.ElementId.MenuBottom);
  if (menuBottom) {
    State.fullScreen.preFullScreenState.collapsedStates[Constants.ElementId.MenuBottom] = menuBottom.classList.contains(Config.Constants.ClassName.Collapsed);
  }
  
  var help = $(Constants.ContentSection.Help);
  if (help) {
    State.fullScreen.preFullScreenState.collapsedStates[Constants.ContentSection.Help] = help.classList.contains(Config.Constants.ClassName.Collapsed);
  }
  
  // Set full screen active
  State.fullScreen.active = true;
  
  // Save menuBottom's original parent and next sibling BEFORE any operations
  if (menuBottom) {
    State.fullScreen.preFullScreenState.menuBottomParent = menuBottom.parentNode;
    State.fullScreen.preFullScreenState.menuBottomNextSibling = menuBottom.nextSibling;
  }
  
  // Add fullscreen CSS class to body
  document.body.classList.add('fullscreen-mode');
  
  // Hide all sections except MapPoints
  for (var j = 0; j < Config.CONTENT_SECTIONS.length; j++) {
    var id = Config.CONTENT_SECTIONS[j];
    if (id !== Constants.ContentSection.MapPoints) {
      setSectionVisible(id, false);
    }
  }
  
  // Hide status bar
  var statusBar = $(Constants.ElementId.StatusBar);
  if (statusBar) {
    statusBar.style.display = 'none';
  }
  
  // Hide top menu
  setSectionVisible(Constants.ElementId.MenuTop, false);
  
  // Ensure MapPoints section is visible (but don't override collapsed state with inline styles)
  var mapPoints = $(Constants.ContentSection.MapPoints);
  if (mapPoints) {
    // Don't set inline display style - let CSS handle it based on .collapsed class
    mapPoints.classList.add('visible');
    // Don't force expand - keep the collapsed state as it was
  }
  
  // Scroll to top to show the full MapPoints view
  window.scrollTo(0, 0);
  
  // Move menuBottom to be a direct child of body (to show in fullscreen)
  // But preserve its collapsed state
  var menuBottom = $(Constants.ElementId.MenuBottom);
  var menuBottomWasCollapsed = menuBottom ? menuBottom.classList.contains(Constants.ClassName.Collapsed) : false;
  if (menuBottom) {
    document.body.appendChild(menuBottom);
    menuBottom.style.display = 'flex';
    // Don't force expand - keep collapsed state
    if (!menuBottomWasCollapsed) {
      menuBottom.classList.remove(Constants.ClassName.Collapsed);
    }
  }
  
  // Re-render menus to update button visibility (Full Screen -> Exit Full Screen)
  renderMenusFor(State.currentContentId);
  
  // Restore menuBottom collapsed state after re-render
  setTimeout(function() {
    if (menuBottom && menuBottomWasCollapsed) {
      setCollapsed(Constants.ElementId.MenuBottom, true);
    }
  }, 50);
  
  // Enter browser fullscreen mode (hides browser UI)
  var elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(function(err) {
    });
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
  
  // Refresh map and table to adjust to new size
  setTimeout(function() {
    // Update Tabulator to use full available space
    if (State.pointsTable) {
      // Calculate the height we want the tabulator to be
      var listDiv = document.querySelector('.mappoints-list');
      var targetHeight = listDiv ? listDiv.offsetHeight : 700;
      
      // Access Tabulator's internal options and modify maxHeight
      if (State.pointsTable.options) {
        State.pointsTable.options.maxHeight = "none";
      }
      
      // Get the tabulator div and remove inline max-height style
      var tabulatorDiv = document.querySelector('.mappoints-list .tabulator');
      if (tabulatorDiv) {
        tabulatorDiv.style.maxHeight = 'none';
      }
      
      // Set height to the calculated pixel value
      State.pointsTable.setHeight(targetHeight);
      State.pointsTable.redraw(true);
    }
    
    if (State.leafletMap && State.mapPointsView.showMap) {
      State.leafletMap.invalidateSize();
      refreshMapMarkers();
    }
  }, 300);
}

export function exitMapPointsFullScreen() {
  if (!State.fullScreen.active || !State.fullScreen.preFullScreenState) {
    return;
  }
  
  // Exit browser fullscreen mode only if currently in fullscreen
  var isInFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  if (isInFullscreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(function(err) {
        console.warn('Failed to exit fullscreen:', err);
      });
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
  }
  
  // Restore menuBottom to its original parent and position
  var menuBottom = $(Constants.ElementId.MenuBottom);
  if (menuBottom && State.fullScreen.preFullScreenState.menuBottomParent) {
    // Use insertBefore to restore to exact original position (before Help section)
    var parent = State.fullScreen.preFullScreenState.menuBottomParent;
    var nextSibling = State.fullScreen.preFullScreenState.menuBottomNextSibling;
    
    if (nextSibling && nextSibling.parentNode === parent) {
      parent.insertBefore(menuBottom, nextSibling);
    } else {
      parent.appendChild(menuBottom);
    }
    
    // Ensure menuBottom has proper display style restored
    menuBottom.style.display = '';
    // Remove any flex styling that was added during fullscreen
    menuBottom.style.flex = '';
    menuBottom.style.order = '';
  }
  
  // Restore full screen state
  State.fullScreen.active = false;
  
  // Remove fullscreen CSS class from body
  document.body.classList.remove('fullscreen-mode');
  
  // Restore body padding
  document.body.style.padding = '';
  document.body.style.margin = '';
  document.body.style.overflow = '';
  document.body.style.display = '';
  document.body.style.flexDirection = '';
  document.body.style.height = '';
  document.body.style.width = '';
  
  // Hide all content sections (except Help which is always visible)
  hideAllContent();
  
  // Show only the current content section (typically mapPoints)
  if (State.currentContentId) {
    setSectionVisible(State.currentContentId, true);
  }
  
  // Restore collapsed states for content sections (but not menus yet - they'll be re-rendered)
  var collapsedStates = State.fullScreen.preFullScreenState.collapsedStates || {};
  for (var sectionId in collapsedStates) {
    if (collapsedStates.hasOwnProperty(sectionId)) {
      // Skip menus - we'll restore their state after renderMenusFor
      if (sectionId === Constants.ElementId.MenuTop || 
          sectionId === Constants.ElementId.MenuBottom) {
        continue;
      }
      var section = $(sectionId);
      if (section) {
        var wasCollapsed = collapsedStates[sectionId];
        setCollapsed(sectionId, wasCollapsed);
      }
    }
  }
  
  // Show status bar
  var statusBar = $(Constants.ElementId.StatusBar);
  if (statusBar) {
    statusBar.style.display = '';
  }
  
  // Show top menu (unless autoHide setting is active)
  if (!State.settings.autoHideTopMenu || !State.currentContentId) {
    setSectionVisible(Constants.ElementId.MenuTop, true);
  }
  
  // Ensure Help section is visible (it should always be visible)
  setSectionVisible(Constants.ContentSection.Help, true);
  
  // Restore scroll position - but ensure menuBottom is visible
  var scrollY = State.fullScreen.preFullScreenState.scrollY || 0;
  
  // Wait a moment for layout to settle, then scroll and check menuBottom visibility
  setTimeout(function() {
    window.scrollTo(0, scrollY);
    
    // Ensure menuBottom is visible in viewport
    if (menuBottom) {
      var menuBottomRect = menuBottom.getBoundingClientRect();
      var viewportHeight = window.innerHeight;
      
      // If menuBottom is below the viewport, scroll to make it visible
      if (menuBottomRect.top > viewportHeight) {
        menuBottom.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, 150);
  
  // Clear pre-full screen state - but save collapsed states for menus
  var savedMenuTopCollapsed = collapsedStates[Constants.ElementId.MenuTop];
  var savedMenuBottomCollapsed = collapsedStates[Constants.ElementId.MenuBottom];
  State.fullScreen.preFullScreenState = null;
  
  // Re-fit the viewport to the normal layout
  setTimeout(function() {
    // Restore Tabulator height and maxHeight to original settings
    if (State.pointsTable) {
      // Restore maxHeight option
      if (State.pointsTable.options) {
        State.pointsTable.options.maxHeight = Config.PointsTable.maxHeight;
      }
      
      // Clear inline max-height style (let Tabulator manage it)
      var tabulatorDiv = document.querySelector('.mappoints-list .tabulator');
      if (tabulatorDiv) {
        tabulatorDiv.style.maxHeight = '';
      }
      
      State.pointsTable.setHeight(Config.PointsTable.height);
      State.pointsTable.redraw(true);
    }
    
    fitContentToViewport(Constants.ContentSection.MapPoints);
    
    // Refresh map to adjust to new size
    if (State.leafletMap && State.mapPointsView.showMap) {
      State.leafletMap.invalidateSize();
      refreshMapMarkers();
    }
  }, 100);
  
  // Re-render menu to show Full Screen button again
  renderMenusFor(State.currentContentId);
  
  // Restore menu collapsed states AFTER renderMenusFor
  setTimeout(function() {
    if (savedMenuTopCollapsed !== undefined) {
      setCollapsed(Constants.ElementId.MenuTop, savedMenuTopCollapsed);
    }
    if (savedMenuBottomCollapsed !== undefined) {
      setCollapsed(Constants.ElementId.MenuBottom, savedMenuBottomCollapsed);
    }
  }, 50);
}

export function updateMapPointsLayout() {
  var container = $("mapPoints-container");
  if (!container) return;
  
  // Use the generic viewport fitting function if enabled
  if (Config.ViewportFitting && 
      Config.ViewportFitting[Constants.ContentSection.MapPoints] && 
      Config.ViewportFitting[Constants.ContentSection.MapPoints].enabled) {
    fitContentToViewport(Constants.ContentSection.MapPoints);
  } else {
    // Fallback: Set container height based on configuration (old behavior)
    var containerHeight = Config.MapPointsList.ContainerHeight;
    if (containerHeight <= 0 && Config.MapPointsList.FitToViewport) {
      // Auto-calculate to fit viewport: ensure container + bottom menu are visible
      var viewportHeight = window.innerHeight;
      var containerTop = container.getBoundingClientRect().top;
      var menuBottom = $("menuBottom");
      var menuBottomHeight = menuBottom ? menuBottom.getBoundingClientRect().height : 100; // Default estimate if not found
      
      // Calculate available height: viewport - container top position - bottom menu height - some padding
      var padding = 16; // Small padding at bottom
      var availableHeight = viewportHeight - containerTop - menuBottomHeight - padding;
      
      // Set minimum height to avoid too small containers
      var minHeight = 400;
      containerHeight = Math.max(minHeight, availableHeight);
      
      container.style.height = containerHeight + 'px';
    } else if (containerHeight > 0) {
      // Use fixed height from config
      container.style.height = containerHeight + 'px';
    }
  }
  
  // Get viewport dimensions to determine orientation
  var viewportWidth = window.innerWidth;
  var viewportHeight = window.innerHeight;
  
  // Determine layout based on viewport aspect ratio
  // If viewport width > height: landscape (horizontal layout: list left, map right)
  // If viewport height >= width: portrait (vertical layout: list top, map bottom)
  var isLandscape = viewportWidth > viewportHeight;
  
  var currentLayout = container.classList.contains("layout-horizontal") ? "horizontal" : "vertical";
  var targetLayout = isLandscape ? "horizontal" : "vertical";
  
  if (isLandscape) {
    // Horizontal layout: list on left, map on right
    container.classList.remove("layout-vertical");
    container.classList.add("layout-horizontal");
    
    // Apply dock left width
    var dockLeftWidth = Config.MapPointsList.DockLeftWidth;
    if (dockLeftWidth <= 0) {
      // Auto-calculate based on MinRowWidth
      dockLeftWidth = Config.MapPointsList.MinRowWidth || 300;
    }
    container.style.setProperty('--list-dock-left-width', dockLeftWidth + 'px');
  } else {
    // Vertical layout: list on top, map on bottom
    container.classList.remove("layout-horizontal");
    container.classList.add("layout-vertical");
    
    // Apply dock top height
    var dockTopHeight = Config.MapPointsList.DockTopHeight;
    if (dockTopHeight <= 0) {
      // Auto-calculate based on MinRowsVisible
      var rowHeight = 40; // Approximate height per row including borders
      var formHeight = 350; // Approximate height of the form inputs
      dockTopHeight = formHeight + (Config.MapPointsList.MinRowsVisible * rowHeight);
    }
    
    // Ensure list doesn't exceed 60% of container height to leave room for map
    var containerHeight = container.offsetHeight;
    var maxListHeight = Math.floor(containerHeight * 0.6); // List takes max 60%
    var minMapHeight = 200; // Minimum height for map
    var dividerHeight = 8;
    
    // Calculate the maximum list height that leaves enough room for map and divider
    var maxAllowedListHeight = containerHeight - minMapHeight - dividerHeight;
    
    if (dockTopHeight > maxAllowedListHeight) {
      dockTopHeight = Math.max(maxListHeight, maxAllowedListHeight);
    }
    
    container.style.setProperty('--list-dock-top-height', dockTopHeight + 'px');
  }
  
  // Apply min row width
  var minRowWidth = Config.MapPointsList.MinRowWidth || 300;
  container.style.setProperty('--list-min-row-width', minRowWidth + 'px');
  
  // Re-setup divider after layout change to ensure handlers work correctly
  // Only re-setup if layout actually changed
  if (currentLayout !== targetLayout) {
    // Clear inline styles from previous layout mode
    var listDiv = $("mapPointsList");
    if (listDiv) {
      listDiv.style.width = '';
      listDiv.style.height = '';
    }
    
    setTimeout(function() {
      setupMapPointsDivider();
      
      // Refresh the table to recalculate its height for the new layout
      if (State.pointsTable && State.pointsTable.initialized) {
        var tableFilters = State.pointsTable.getHeaderFilters();
        State.pointsTable.destroy();
        State.pointsTable = null;
        State.pointsTableFilters = tableFilters;
        refreshMapPointsTable();
      }
      
      // Also invalidate map after layout change
      if (State.leafletMap && State.mapPointsView.showMap) {
        State.leafletMap.invalidateSize();
      }
    }, 150);
  }
}

export function initializeLeafletMap() {
  var mapDiv = $("mapPointsMap");
  if (!mapDiv) return;
  
  // Check if DOM element already has a Leaflet map instance
  if (mapDiv._leaflet_id !== undefined) {
    // Map already exists in DOM, just refresh it
    if (State.leafletMap) {
      State.leafletMap.invalidateSize();
      if (!State.skipMapRefresh) {
        refreshMapMarkers();
      }
    }
    return;
  }
  
  // If map is already initialized, just refresh it
  if (State.leafletMap) {
    State.leafletMap.invalidateSize();
    if (!State.skipMapRefresh) {
      refreshMapMarkers();
    }
    return;
  }
  
  // Initialize map only if not already done
  try {
    // Default center - can be updated based on points
    State.leafletMap = L.map('mapPointsMap').setView([51.5, -0.09], 13);
    
    // Add tile layer
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=9Ul437Kx3uMsy4w6lOQN', {
      attribution: '<a href="https://www.maptiler.com/license/maps/" target="_blank">В© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">В© OpenStreetMap contributors</a>',
    }).addTo(State.leafletMap);
    
    // Install long-press handler
    installMapLongPressHandler();
    
    // Add markers for existing points
    if (!State.skipMapRefresh) {
      refreshMapMarkers();
    }
  } catch (error) {
    console.error("Failed to initialize Leaflet map:", error);
  }
}

function installMapLongPressHandler() {
  if (!State.leafletMap) return;
  
  var pressTimer = null;
  var pressEvent = null;
  
  function clearPress() {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
      pressEvent = null;
    }
  }
  
  function onLongPress(e) {
    // e has latlng for Leaflet mouse/touch events
    var latlng = e.latlng;
    if (!latlng) return;
    
    // Store default coords for Add mode
    Config.MapPointDetails.defaultCoords = { lat: latlng.lat, lng: latlng.lng };
    
    // Remove previous temp marker
    if (State.tempPlacemark) {
      State.leafletMap.removeLayer(State.tempPlacemark);
      State.tempPlacemark = null;
    }
    
    // Add a temporary marker (styling optional)
    State.tempPlacemark = L.marker(latlng, { 
      draggable: true, 
      title: 'Default new point',
      opacity: 0.6
    }).addTo(State.leafletMap);
    
    // Open popup with coordinates
    State.tempPlacemark.bindPopup(createTempMarkerPopupContent(latlng.lat, latlng.lng, 'Default coordinates for new point')).openPopup();
    
    // If marker is dragged, update default coords
    State.tempPlacemark.on('dragend', function(ev) {
      var p = ev.target.getLatLng();
      Config.MapPointDetails.defaultCoords = { lat: p.lat, lng: p.lng };
      State.tempPlacemark.setPopupContent(createTempMarkerPopupContent(p.lat, p.lng, 'Default coordinates for new point'));
    });
  }
  
  // Mouse events
  State.leafletMap.on('mousedown', function(e) {
    clearPress();
    pressEvent = e;
    pressTimer = setTimeout(function() { onLongPress(pressEvent); }, Config.Map.longPressMs);
  });
  State.leafletMap.on('mouseup', clearPress);
  State.leafletMap.on('mousemove', clearPress);
  
  // Touch events for mobile
  State.leafletMap.on('touchstart', function(e) {
    clearPress();
    pressEvent = e;
    pressTimer = setTimeout(function() { onLongPress(pressEvent); }, Config.Map.longPressMs);
  });
  State.leafletMap.on('touchend', clearPress);
  State.leafletMap.on('touchmove', clearPress);
}

function getMarkerIconForStatus(status) {
  // Get marker configuration from Config
  var markerConfig = Config.Map.markers;
  var statusStyle = markerConfig.statusStyles[status] || markerConfig.statusStyles.default;
  
  return new L.Icon({
    iconUrl: statusStyle.iconUrl,
    shadowUrl: markerConfig.shadowUrl,
    iconSize: markerConfig.iconSize,
    iconAnchor: markerConfig.iconAnchor,
    popupAnchor: markerConfig.popupAnchor,
    shadowSize: markerConfig.shadowSize
  });
}

function getStatusBadgeHTML(status) {
  // Get badge configuration from Config
  var markerConfig = Config.Map.markers;
  var statusStyle = markerConfig.statusStyles[status] || markerConfig.statusStyles.default;
  
  return '<span style="display:inline-block;padding:2px 6px;border-radius:3px;font-size:11px;font-weight:bold;margin-left:4px;background-color:' +
         statusStyle.badgeColor + ';color:' + statusStyle.badgeTextColor + ';">' + statusStyle.badgeText + '</span>';
}

export function refreshMapMarkers() {
  if (!State.leafletMap) return;
  
  // Clear existing markers but preserve the temporary placeholder
  State.leafletMap.eachLayer(function(layer) {
    if (layer instanceof L.Marker && layer !== State.tempPlacemark) {
      State.leafletMap.removeLayer(layer);
    }
  });
  
  // Fetch points from DB and render markers
  DB.getAllPoints().then(function(result) {
    if (!result.success) return;
    
    // Clear existing markers from State
    State.markers = {};
    
    var points = result.data || [];
    var bounds = [];
    
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      if (point.lat && point.lng) {
        // Get appropriate icon based on status
        var status = point.status || 'pending';
        var icon = getMarkerIconForStatus(status);
        
        // Create marker with custom icon
        var marker = L.marker([point.lat, point.lng], { icon: icon }).addTo(State.leafletMap);
        
        // Store marker in State for later access
        State.markers[point.id] = marker;
        
        // Build popup content with status badge
        var statusBadge = getStatusBadgeHTML(status);
        
        // Check if current user can enter code (seeker/admin, not owner, not found yet, not pending)
        var isOwner = State.currentUser && point.username === getCurrentUsername();
        var canEnterCode = canCurrentUserSeekPoints() && !isOwner && point.status !== 'found' && point.status !== 'pending';
        var canEdit = canCurrentUserEditPoint(point);
        
        var popupContent = '<b>' + (point.title || 'Untitled') + '</b>' + statusBadge + '<br>' +
                          'User: ' + (point.username || 'Unknown') + '<br>' +
                          (point.foundBy ? 'Found by: ' + point.foundBy + '<br>' : '') +
                          (point.description || '') + '<br>';
        
        // Add Navigate button for all users
        var googleMapsUrl = 'https://www.google.com/maps?q=' + point.lat + ',' + point.lng;
        popupContent += '<button onclick="window.open(\'' + googleMapsUrl + '\', \'_blank\')" style="margin-top:5px;">Navigate</button> ';
        
        // Add Enter Code button for seekers/admins on unfound, non-pending points they don't own
        if (canEnterCode) {
          popupContent += '<button onclick="window.appEnterPointCode(' + point.id + ')" style="margin-top:5px;">Enter Code</button> ';
        }
        
        // Only show Delete button if user has permission
        if (canEdit) {
          popupContent += '<button onclick="window.appDeleteMapPoint(' + point.id + ')" style="margin-top:5px;">Delete</button>';
        }
        
        marker.bindPopup(popupContent);
        bounds.push([point.lat, point.lng]);
      }
    }
    
    // Add temp marker location to bounds if it exists
    if (State.tempPlacemark) {
      var tempLatLng = State.tempPlacemark.getLatLng();
      bounds.push([tempLatLng.lat, tempLatLng.lng]);
    }
    
    // Fit map to show all markers if there are any
    if (bounds.length > 0) {
      State.leafletMap.fitBounds(bounds, { padding: [50, 50] });
    }
  });
}

/* ===== Settings ===== */
export function applyThemeFont() {
  document.body.setAttribute(Config.Constants.Attribute.DataTheme, State.settings.theme || Config.Constants.Theme.Light);
  document.body.setAttribute(Config.Constants.Attribute.DataFont, State.settings.font || Config.Constants.FontSize.Medium);
}

function hasUnsavedSettingsChanges() {
  // Compare current form values with saved Config values
  var themeChanged = getVal("set-theme") !== (State.settings.theme || Config.Constants.Theme.Light);
  var fontChanged = getVal("set-font") !== (State.settings.font || Config.Constants.FontSize.Medium);
  var autoHideChanged = $("set-autoHideTopMenu") && $("set-autoHideTopMenu").checked !== (State.settings.autoHideTopMenu !== false);
  
  // Check admin-only settings
  var currentUser = State.currentUser;
  var isAdmin = currentUser && hasRole(currentUser, 'admin');
  
  var errorHandlerChanged = false;
  var saveGuiStateChanged = false;
  var remoteLoggingChanged = false;
  
  if (isAdmin) {
    var errorHandlerCheckbox = $('set-errorHandler');
    if (errorHandlerCheckbox) {
      errorHandlerChanged = errorHandlerCheckbox.checked !== Config.Errors_GlobalHandlerEnabled;
    }
    
    var saveGuiStateCheckbox = $('set-saveGuiState');
    if (saveGuiStateCheckbox) {
      saveGuiStateChanged = saveGuiStateCheckbox.checked !== Config.SaveGuiState;
    }
    
    var remoteLoggingCheckbox = $('set-remoteLogging');
    if (remoteLoggingCheckbox) {
      remoteLoggingChanged = remoteLoggingCheckbox.checked !== Config.RemoteLogging;
    }
  }
  
  return themeChanged || fontChanged || autoHideChanged || errorHandlerChanged || saveGuiStateChanged || remoteLoggingChanged;
}

export function openSettings() {
  showContent(Config.Constants.ContentSection.Settings);
  setVal("set-theme", State.settings.theme || Config.Constants.Theme.Light);
  setVal("set-font", State.settings.font || Config.Constants.FontSize.Medium);
  
  $("set-autoHideTopMenu").checked = State.settings.autoHideTopMenu !== false; // Default to true
  
  // Get current user and check if admin
  // State.currentUser is already the full user object
  var currentUser = State.currentUser;
  var isAdmin = currentUser && hasRole(currentUser, 'admin');
  
  // Error handler checkbox (admin only)
  var errorHandlerCheckbox = $('set-errorHandler');
  if (errorHandlerCheckbox) {
    var errorHandlerLabel = errorHandlerCheckbox.closest('label');
    if (errorHandlerLabel) {
      errorHandlerLabel.style.display = isAdmin ? 'flex' : 'none';
    }
    errorHandlerCheckbox.checked = Config.Errors_GlobalHandlerEnabled;
  }
  
  // SaveGuiState checkbox (admin only)
  var saveGuiStateCheckbox = $('set-saveGuiState');
  if (saveGuiStateCheckbox) {
    var saveGuiStateLabel = saveGuiStateCheckbox.closest('label');
    if (saveGuiStateLabel) {
      saveGuiStateLabel.style.display = isAdmin ? 'flex' : 'none';
    }
    saveGuiStateCheckbox.checked = Config.SaveGuiState;
  }
  
  // RemoteLogging checkbox (admin only)
  var remoteLoggingCheckbox = $('set-remoteLogging');
  if (remoteLoggingCheckbox) {
    var remoteLoggingLabel = remoteLoggingCheckbox.closest('label');
    if (remoteLoggingLabel) {
      remoteLoggingLabel.style.display = isAdmin ? 'flex' : 'none';
    }
    
    // Always reset to Config value when opening Settings (not saved until Apply is clicked)
    remoteLoggingCheckbox.checked = Config.RemoteLogging;
  }
  
  // Initialize controls once (event listeners, test button, etc.)
  initializeSettingsControls();
  
  // Mark settings as initialized
  State._settingsInitialized = true;
}

// Initialize settings controls (remote logging test button, event handlers, etc.)
// This should only be called once to avoid duplicate event listeners
function initializeSettingsControls() {
  if (State._settingsControlsInitialized) {
    return; // Already initialized
  }
  
  var currentUser = State.currentUser;
  var isAdmin = currentUser && hasRole(currentUser, 'admin');
  
  var remoteLoggingCheckbox = $('set-remoteLogging');
  var testSection = $('remoteLoggingTest');
  var testButton = $('testRemoteLogging');
  
  if (!remoteLoggingCheckbox) return;
  
  // Show/hide test section based on admin status
  if (testSection && isAdmin) {
    testSection.style.display = 'block';
  }
  
  // Update test button visibility based on checkbox state
  var updateTestButtonVisibility = function() {
    if (testButton && isAdmin) {
      testButton.style.display = remoteLoggingCheckbox.checked ? 'inline-block' : 'none';
    }
  };
  
  // Set initial visibility
  updateTestButtonVisibility();
  
  // Add change event listener (only once)
  remoteLoggingCheckbox.addEventListener('change', updateTestButtonVisibility);
  
  // Add test button click handler (only once)
  if (testButton) {
    testButton.addEventListener('click', async function() {
      var statusEl = $('remoteLoggingStatus');
      
      var checkbox = $('set-remoteLogging');
      if (checkbox && checkbox.checked) {
        var previousValue = Config.RemoteLogging;
        Config.RemoteLogging = true;
        setRemoteLoggerConfig(Config);
        
        if (statusEl) statusEl.textContent = 'Sending test messages...';
        
        try {
          await rlog.info('Remote logging test: INFO level message');
          await rlog.warn('Remote logging test: WARN level message');
          await rlog.error('Remote logging test: ERROR level message');
          
          if (statusEl) {
            statusEl.textContent = '✓ Test messages sent successfully!';
            statusEl.style.color = '#28a745';
          }
          
          setTimeout(() => {
            if (statusEl) statusEl.textContent = '';
          }, 5000);
        } catch (error) {
          if (statusEl) {
            statusEl.textContent = '✗ Failed to send test messages';
            statusEl.style.color = '#dc3545';
          }
          console.error('Test logging failed:', error);
        }
        
        Config.RemoteLogging = previousValue;
        setRemoteLoggerConfig(Config);
      } else {
        if (statusEl) {
          statusEl.textContent = '⚠ Enable remote logging first';
          statusEl.style.color = '#ffc107';
        }
      }
    });
  }
  
  State._settingsControlsInitialized = true;
}

export async function applySettings() {
  // Get current user and check if admin
  // State.currentUser is already the full user object, no need to look it up
  var currentUser = State.currentUser;
  var isAdmin = currentUser && hasRole(currentUser, 'admin');
  
  
  // Build basic settings object (non-admin settings)
  State.settings = {
    theme: getVal("set-theme"),
    font: getVal("set-font") || Config.Constants.FontSize.Medium,
    autoHideTopMenu: $("set-autoHideTopMenu").checked, // Use actual checkbox value (boolean)
    saveGuiState: State.settings.saveGuiState !== undefined ? State.settings.saveGuiState : true, // Will be overwritten by admin check below
    errorsGlobalHandlerEnabled: State.settings.errorsGlobalHandlerEnabled !== undefined 
      ? State.settings.errorsGlobalHandlerEnabled 
      : true, // Will be overwritten by admin check below
    remoteLogging: State.settings.remoteLogging !== undefined ? State.settings.remoteLogging : false // Will be overwritten by admin check below
  };
  
  
  // Save error handler setting (admin only)
  var errorHandlerCheckbox = $('set-errorHandler');
  if (errorHandlerCheckbox && isAdmin) {
    State.settings.errorsGlobalHandlerEnabled = errorHandlerCheckbox.checked;
    Config.Errors_GlobalHandlerEnabled = errorHandlerCheckbox.checked;
    // Reinitialize error handlers
    var errorHandlerModule = await import('./errorHandler.js');
    errorHandlerModule.initializeErrorHandlers();
  }
  
  // Save GUI state setting (admin only)
  var saveGuiStateCheckbox = $('set-saveGuiState');
  if (saveGuiStateCheckbox) {
  }
  
  if (saveGuiStateCheckbox && isAdmin) {
    var previousValue = Config.SaveGuiState;
    State.settings.saveGuiState = saveGuiStateCheckbox.checked;
    Config.SaveGuiState = saveGuiStateCheckbox.checked;
    
    
    // If SaveGuiState was just enabled, capture current state
    if (Config.SaveGuiState && !previousValue) {
      captureGuiState();
    }
    
    // If SaveGuiState was just disabled, clear the cookie
    if (!Config.SaveGuiState && previousValue) {
      deleteCookie('guiState');
    }
  } else if (!isAdmin) {
  }
  
  // Save Remote Logging setting (admin only)
  var remoteLoggingCheckbox = $('set-remoteLogging');
  if (remoteLoggingCheckbox && isAdmin) {
    State.settings.remoteLogging = remoteLoggingCheckbox.checked;
    Config.RemoteLogging = remoteLoggingCheckbox.checked;
    // Update remote logger configuration
    setRemoteLoggerConfig(Config);
    // Update remoteLogger with new config
    setRemoteLoggerConfig(Config);
    console.log(`Remote logging ${Config.RemoteLogging ? 'enabled' : 'disabled'}`);
  }
  
  var result = await DB.saveSettings(State.settings);
  if (result.success) {
    applyThemeFont();
    // Show brief message in status bar instead of full message section
    await showStatusBarMessage('✓ Settings applied', 3000);
  } else {
    console.error('❌ Failed to save settings:', result.error);
    // For errors, show full message
    showMessage("Failed to save settings: " + result.error, Config.Constants.ContentSection.Settings);
  }
}
export async function resetAll() {
  var result = await DB.resetAllData();
  if (result.success) {
    location.reload();
  } else {
    console.error("Failed to reset data:", result.error);
    // Fallback to localStorage clear
    localStorage.clear();
    location.reload();
  }
}

/* ===== Developer Tools ===== */
function initializeJsonEditor() {
  if (State.jsonEditor) return; // Already initialized
  
  var container = $("jsoneditor");
  if (!container) return;
  
  var options = {
    mode: 'code',
    modes: ['code', 'tree', 'view'],
    onError: function (err) {
      showMessage("JSON Editor Error: " + err.toString(), "developerTools");
    }
  };
  
  State.jsonEditor = new JSONEditor(container, options);
  applyEditorFontSize(); // Apply initial font size
}

export function adjustEditorFontSize(delta) {
  State.jsonEditorFontSize += delta;
  
  // Keep font size within reasonable bounds
  if (State.jsonEditorFontSize < 8) State.jsonEditorFontSize = 8;
  if (State.jsonEditorFontSize > 32) State.jsonEditorFontSize = 32;
  
  applyEditorFontSize();
}

function applyEditorFontSize() {
  var container = $("jsoneditor");
  if (!container) return;
  
  // Apply font size to the editor container
  container.style.fontSize = State.jsonEditorFontSize + "px";
  
  // Also apply to ACE editor if it exists (code mode)
  var aceEditor = container.querySelector('.ace_editor');
  if (aceEditor) {
    aceEditor.style.fontSize = State.jsonEditorFontSize + "px";
  }
  
  // Apply to textarea in code mode
  var textarea = container.querySelector('.jsoneditor-text');
  if (textarea) {
    textarea.style.fontSize = State.jsonEditorFontSize + "px";
  }
}

export async function showDbInEditor() {
  // Initialize editor if needed
  initializeJsonEditor();
  
  // Fetch data from DB
  var usersResult = await DB.getAllUsers();
  var pointsResult = await DB.getAllPoints();
  
  // Prepare database data
  var dbData = {
    users: usersResult.success ? (usersResult.data || []) : [],
    points: pointsResult.success ? (pointsResult.data || []) : []
  };
  
  // Set the data in the editor
  if (State.jsonEditor) {
    State.jsonEditor.set(dbData);
  }
}

export async function saveDbFromEditor() {
  if (!State.jsonEditor) {
    showMessage("JSON Editor not initialized.", "developerTools");
    return;
  }
  
  try {
    // Get the data from the editor
    var dbData = State.jsonEditor.get();
    
    // Validate structure
    if (!dbData || typeof dbData !== 'object') {
      showMessage("Invalid data format. Expected an object with 'users' and 'points' properties.", "developerTools");
      return;
    }
    
    if (!Array.isArray(dbData.users)) {
      showMessage("Invalid data: 'users' must be an array.", "developerTools");
      return;
    }
    
    if (!Array.isArray(dbData.points)) {
      showMessage("Invalid data: 'points' must be an array.", "developerTools");
      return;
    }
    
    // Clear localStorage directly to avoid default SAMPLE data being loaded
    localStorage.removeItem(Config.LS.users);
    localStorage.removeItem(Config.LS.points);
    
    // Now save the new data directly to localStorage
    localStorage.setItem(Config.LS.users, JSON.stringify(dbData.users));
    localStorage.setItem(Config.LS.points, JSON.stringify(dbData.points));
    
    // Clear caches
    State._userCache = {};
    State._pointCache = {};
    
    // Refresh UI
    refreshUsersTable();
    refreshMapPointsTable();
    
    // Show success message
    showMessage("Database saved successfully! (" + dbData.users.length + " users, " + dbData.points.length + " points)", "developerTools");
    
  } catch (error) {
    showMessage("Error parsing JSON: " + error.toString(), "developerTools");
  }
}

/* ===== Command rendering ===== */
function on_before_command_added(target_menu, cmd) {
  // This function is called before adding a command to a menu
  // It can modify visibility/enabled state based on current State
  // Returns the HTML element if it should be added, or null to skip it
  
  if (!cmd) return null;
  
  // Check visibility - can be boolean or function
  var isVisible = true;
  if (typeof cmd.visible === 'function') {
    isVisible = cmd.visible();
  } else if (cmd.visible === false) {
    isVisible = false;
  }
  
  if (!isVisible) return null;
  
  // If no user is logged in, only show specific commands
  if (!State.currentUser) {
    // Allow: Show Login, Show Register, Show About, Show Points (view-only), and all login/userDetails (register mode) page commands, plus message OK
    var allowedCommands = [
      Config.Constants.CommandName.ShowLogin,
      Config.Constants.CommandName.ShowRegister,
      Config.Constants.CommandName.ShowAbout,
      Config.Constants.CommandName.ShowPoints,
      Config.Constants.CommandName.LoginOk,
      Config.Constants.CommandName.LoginCancel,
      Config.Constants.CommandName.LoginRegister,
      Config.Constants.CommandName.UserSave,
      Config.Constants.CommandName.UserCancel,
      Config.Constants.CommandName.MessageOk,
      // Allow map points view-only commands when not logged in
      Config.Constants.CommandName.PointsRefresh,
      Config.Constants.CommandName.PointsViewDetails,
      Config.Constants.CommandName.PointsViewCompact,
      Config.Constants.CommandName.PointsShowList,
      Config.Constants.CommandName.PointsShowMap,
      Config.Constants.CommandName.PointsShowBoth,
      Config.Constants.CommandName.PointsFullScreen,
      Config.Constants.CommandName.PointsCancel,
      Config.Constants.CommandName.PointsLogin,
      Config.Constants.CommandName.PointsMyLoc  // Allow My Location button even when not logged in
    ];
    
    if (allowedCommands.indexOf(cmd.name) === -1) {
      return null; // Skip all other commands when not logged in
    }
  }
  
  // If user is logged in, hide Login and Register buttons from top menu
  if (State.currentUser) {
    if (cmd.name === Config.Constants.CommandName.ShowLogin || 
        cmd.name === Config.Constants.CommandName.ShowRegister) {
      return null; // Skip Login and Register buttons when logged in
    }
  } else {
    // When not logged in, show Login button in map points view for easy access
    // Hide Register button from top menu when viewing map points (can still access via login page)
    if (State.currentContentId === Constants.ContentSection.MapPoints && 
        cmd.name === Config.Constants.CommandName.ShowRegister) {
      return null; // Hide Register button in map points view-only mode
    }
  }
  
  // Handle MapPoints view toggle buttons visibility
  // Only apply these rules when we're actually in the MapPoints section
  if (State.currentContentId === Constants.ContentSection.MapPoints) {
    var bothVisible = State.mapPointsView.showList && State.mapPointsView.showMap;
    var onlyListVisible = State.mapPointsView.showList && !State.mapPointsView.showMap;
    var onlyMapVisible = !State.mapPointsView.showList && State.mapPointsView.showMap;
    
    if (cmd.name === Config.Constants.CommandName.PointsShowList) {
      // Show "List" button when we want to switch to list-only view
      // Hide it when already showing only list
      if (onlyListVisible) {
        return null;
      }
    }
    if (cmd.name === Config.Constants.CommandName.PointsShowMap) {
      // Show "Map" button when we want to switch to map-only view
      // Hide it when already showing only map
      if (onlyMapVisible) {
        return null;
      }
    }
    if (cmd.name === Config.Constants.CommandName.PointsShowBoth) {
      // Show "L+M" button when we want to show both views
      // Hide it when already showing both
      if (bothVisible) {
        return null;
      }
    }
  }
  
  // Determine enabled state (can be modified based on State)
  var enabled = cmd.enabled !== false;
  // Apply any state-based modifications here
  // enabled = enabled && State.currentUser !== null;
  
  // Create the HTML button element
  var btn = document.createElement(Config.Constants.HtmlElement.Button);
  btn.className = Config.Constants.ClassName.CmdBtn;
  btn.textContent = cmd.caption || cmd.name || "(cmd)";
  btn.setAttribute('data-cmd', cmd.name); // Store command name for identification
  if (!enabled) btn.disabled = true;
  btn.addEventListener("click", function (e) {
    if (!enabled) return;
    // Stop event from bubbling up to header (prevents chevron toggle on mobile)
    e.stopPropagation();
    cmd.action();
  });
  
  return btn;
}
function clearMenuBars() {
  var ids = [
    Config.Constants.ElementId.MenuTopTitleCommands,
    Config.Constants.ElementId.MenuTopTopCommands,
    Config.Constants.ElementId.MenuTopBottomCommands,
    Config.Constants.ElementId.MenuBottomTitleCommands,
    Config.Constants.ElementId.MenuBottomTopCommands,
    Config.Constants.ElementId.MenuBottomBottomCommands,
    Config.Constants.ElementId.MapPointsTitleCommands,
  ];
  for (var i = 0; i < ids.length; i++) {
    var el = $(ids[i]);
    if (el) el.innerHTML = "";
  }
  
  // Also remove any expand buttons that might exist
  var expandButtons = document.querySelectorAll('.menu-expand-btn');
  expandButtons.forEach(function(btn) {
    if (btn && btn.parentNode) {
      btn.parentNode.removeChild(btn);
    }
  });
}
function hasAnyChild(id) {
  var el = $(id);
  return el && el.children && el.children.length > 0;
}
function setMenusVisibility() {
  var topHas =
    hasAnyChild(Config.Constants.ElementId.MenuTopTitleCommands) ||
    hasAnyChild(Config.Constants.ElementId.MenuTopTopCommands) ||
    hasAnyChild(Config.Constants.ElementId.MenuTopBottomCommands);
  var bottomHas =
    hasAnyChild(Config.Constants.ElementId.MenuBottomTitleCommands) ||
    hasAnyChild(Config.Constants.ElementId.MenuBottomTopCommands) ||
    hasAnyChild(Config.Constants.ElementId.MenuBottomBottomCommands);
  
  // Hide top menu if autoHideTopMenu is enabled and we're showing content
  var hideTopMenu = State.settings.autoHideTopMenu && State.currentContentId;
  setSectionVisible(Config.Constants.ElementId.MenuTop, topHas && !hideTopMenu);
  setSectionVisible(Config.Constants.ElementId.MenuBottom, bottomHas);
  
  // Auto-collapse top menu if it only has title buttons (no top/bottom submenu buttons)
  var topHasOnlyTitle = 
    hasAnyChild(Config.Constants.ElementId.MenuTopTitleCommands) &&
    !hasAnyChild(Config.Constants.ElementId.MenuTopTopCommands) &&
    !hasAnyChild(Config.Constants.ElementId.MenuTopBottomCommands);
  setCollapsed(Config.Constants.ElementId.MenuTop, topHasOnlyTitle);
  
  // Auto-collapse bottom menu if it only has title buttons (no top/bottom submenu buttons)
  var bottomHasOnlyTitle = 
    hasAnyChild(Config.Constants.ElementId.MenuBottomTitleCommands) &&
    !hasAnyChild(Config.Constants.ElementId.MenuBottomTopCommands) &&
    !hasAnyChild(Config.Constants.ElementId.MenuBottomBottomCommands);
  setCollapsed(Config.Constants.ElementId.MenuBottom, bottomHasOnlyTitle);
}

function renderMenusFor(contentId) {
  clearMenuBars();
  
  // Always show top menu when user is logged in
  if (State.currentUser) {
    for (var j = 0; j < Config.Commands.DEFAULT_MENU_TOP.length; j++) {
      var cmd = Config.Commands.DEFAULT_MENU_TOP[j];
      var host = $(Config.Constants.ElementId.MenuTopTopCommands);
      if (host) {
        // Call on_before_command_added to get the HTML element
        var btnElement = on_before_command_added(Config.Constants.ElementId.MenuTopTopCommands, cmd);
        if (btnElement) {
          host.appendChild(btnElement);
        }
      }
    }
  }
  
  if (contentId && Config.Commands.LIST[contentId]) {
    var cmds = Config.Commands.LIST[contentId];
    var viewToggleButtons = ["points.showList", "points.showMap", "points.showBoth"];
    var lastWasViewToggle = false;
    var lastWasNonViewToggle = false;
    
    for (var i = 0; i < cmds.length; i++) {
      var c = cmds[i];
      var loc =
        c.menu && c.menu.location ? c.menu.location : Config.Constants.MenuLocation.BottomTitle;
      var hostId =
        loc === Config.Constants.MenuLocation.TopTitle
          ? Config.Constants.ElementId.MenuTopTitleCommands
          : loc === Config.Constants.MenuLocation.TopTop
          ? Config.Constants.ElementId.MenuTopTopCommands
          : loc === Config.Constants.MenuLocation.TopBottom
          ? Config.Constants.ElementId.MenuTopBottomCommands
          : loc === Config.Constants.MenuLocation.BottomTitle
          ? Config.Constants.ElementId.MenuBottomTitleCommands
          : loc === Config.Constants.MenuLocation.BottomTop
          ? Config.Constants.ElementId.MenuBottomTopCommands
          : loc === Config.Constants.MenuLocation.BottomBottom
          ? Config.Constants.ElementId.MenuBottomBottomCommands
          : loc === Config.Constants.MenuLocation.MapPointsTitle
          ? Config.Constants.ElementId.MapPointsTitleCommands
          : null;
      if (hostId) {
        var host = $(hostId);
        if (host) {
          var isViewToggle = viewToggleButtons.indexOf(c.name) >= 0;
          
          // Call on_before_command_added to get the HTML element
          var btnElement = on_before_command_added(hostId, c);
          if (btnElement) {
            // Add special styling to Login button
            if (c.name === "points.login") {
              btnElement.classList.add("login-btn");
              
              // Check if this is the first time we're seeing this button (animation not yet triggered)
              var isFirstLoad = !btnElement.hasAttribute('data-animation-triggered');
              
              if (isFirstLoad) {
                btnElement.setAttribute('data-animation-triggered', 'pending');
                
                // Trigger entrance animation with delay
                setTimeout(function() {
                  // Find the login button (it might have been re-rendered)
                  var loginBtn = document.querySelector('button.login-btn[data-animation-triggered="pending"]');
                  if (loginBtn && !State.currentUser) {
                    loginBtn.setAttribute('data-animation-triggered', 'done');
                    loginBtn.classList.add("animate-entrance");
                    
                    // Remove entrance class after animation completes
                    setTimeout(function() {
                      if (loginBtn) {
                        loginBtn.classList.remove("animate-entrance");
                      }
                    }, 1200);
                    
                    // Follow up with pulse animation
                    setTimeout(function() {
                      if (loginBtn && !State.currentUser) {
                        loginBtn.classList.add("animate-pulse");
                        setTimeout(function() {
                          if (loginBtn) {
                            loginBtn.classList.remove("animate-pulse");
                          }
                        }, 2400);
                      }
                    }, 1400);
                  }
                }, 1500);
              }
            }
            
            var needsSeparator = false;
            
            // Add separator after Login button (when not logged in)
            if (c.name === "points.login" && !State.currentUser && hostId === Config.Constants.ElementId.MenuBottomTitleCommands) {
              needsSeparator = "after";
            }
            
            // Add separator before first view toggle button (after non-view-toggle buttons)
            if (isViewToggle && lastWasNonViewToggle && hostId === Config.Constants.ElementId.MenuBottomTitleCommands) {
              needsSeparator = "before";
            }
            
            // Add separator after last view toggle button (before non-view-toggle buttons)
            if (!isViewToggle && lastWasViewToggle && hostId === Config.Constants.ElementId.MenuBottomTitleCommands) {
              needsSeparator = "before";
            }
            
            if (needsSeparator === "before") {
              var separator = document.createElement("span");
              separator.className = "cmd-separator";
              separator.textContent = "|";
              host.appendChild(separator);
            }
            
            host.appendChild(btnElement);
            
            if (needsSeparator === "after") {
              var separator = document.createElement("span");
              separator.className = "cmd-separator";
              separator.textContent = "|";
              host.appendChild(separator);
            }
            lastWasViewToggle = isViewToggle;
            lastWasNonViewToggle = !isViewToggle;
          }
        }
      }
    }
  } else if (!State.currentUser) {
    // No content visible and no user logged in -> render default top menu commands
    // (Visibility of individual commands controlled by their visible functions)
    for (var j = 0; j < Config.Commands.DEFAULT_MENU_TOP.length; j++) {
      var cmd = Config.Commands.DEFAULT_MENU_TOP[j];
      var host = $(Config.Constants.ElementId.MenuTopTopCommands);
      if (host) {
        // Call on_before_command_added to get the HTML element
        var btnElement = on_before_command_added(Config.Constants.ElementId.MenuTopTopCommands, cmd);
        if (btnElement) {
          host.appendChild(btnElement);
        }
      }
    }
  }
  setMenusVisibility();
  
  // Apply button sizes and handle overflow after rendering
  setTimeout(function() {
    ensureButtonSizes();
    applyMainMenuLayout();
    handleMenuOverflow(Config.Constants.ElementId.MenuTop);
    handleMenuOverflow(Config.Constants.ElementId.MenuBottom);
    handleMenuOverflow('mapPoints');
    
    // Update chevrons after overflow handling
    updateChevron(Config.Constants.ElementId.MenuTop);
    updateChevron(Config.Constants.ElementId.MenuBottom);
  }, 0);
}

/* ===== list.row HTML + execution ===== */
function renderCommandHTML(ctx, cmdName) {
  var label = "(cmd)";
  var cmd = findCommandByName(cmdName);
  if (cmd && cmd.caption) label = cmd.caption;
  var payload = ctx && ctx.payload != null ? String(ctx.payload) : "";
  return `<button class="${Config.Constants.ClassName.Cmd}" ${Config.Constants.Attribute.DataCmd}="${cmdName}" ${Config.Constants.Attribute.DataPayload}="${payload}">${label}</button>`;
}
function findCommandByName(name) {
  var keys = Object.keys(Config.Commands.LIST);
  for (var i = 0; i < keys.length; i++) {
    var arr = Config.Commands.LIST[keys[i]];
    for (var j = 0; j < arr.length; j++) {
      if (arr[j].name === name) return arr[j];
    }
  }
  return null;
}
function executeCommandByName(name, payload) {
  var cmd = findCommandByName(name);
  if (!cmd || cmd.enabled === false) return;
  if (name.indexOf(Config.Constants.CommandPrefix.Users) === 0) {
    cmd.action(payload);
    return;
  }
  if (name.indexOf(Config.Constants.CommandPrefix.Points) === 0) {
    cmd.action(payload);
    return;
  }
  cmd.action();
}

/* ===== Delegates, headers ===== */
function bindListDelegates() {
  var uTable = $(Config.Constants.ElementId.UsersTable);
  if (uTable) {
    uTable.addEventListener("click", async function (e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains(Config.Constants.ClassName.LinkBtn)) {
        var userId = t.getAttribute(Config.Constants.Attribute.DataOpenUser);
        await openUserDetails(userId);
        return;
      }
      if (t && t.classList && t.classList.contains(Config.Constants.ClassName.Cmd)) {
        executeCommandByName(
          t.getAttribute(Config.Constants.Attribute.DataCmd),
          t.getAttribute(Config.Constants.Attribute.DataPayload)
        );
      }
    });
  }
  var pTable = $(Config.Constants.ElementId.MpsTable);
  if (pTable) {
    pTable.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains(Config.Constants.ClassName.LinkBtn)) {
        var id = t.getAttribute(Config.Constants.Attribute.DataOpenPoint);
        openMapPointDetails(Number(id));
        return;
      }
      if (t && t.classList && t.classList.contains(Config.Constants.ClassName.Cmd)) {
        executeCommandByName(
          t.getAttribute(Config.Constants.Attribute.DataCmd),
          t.getAttribute(Config.Constants.Attribute.DataPayload)
        );
      }
    });
  }
}

/* ===== Draggable Divider for MapPoints ===== */
// Store handler references to allow cleanup
var dividerHandlers = {
  mouseDown: null,
  mouseMove: null,
  mouseUp: null,
  touchStart: null,
  touchMove: null,
  touchEnd: null,
  isDragging: false,
  startX: 0,
  startY: 0,
  startWidth: 0,
  startHeight: 0
};

export function setupMapPointsDivider() {
  var divider = $("mapPointsDivider");
  var container = $("mapPoints-container");
  var listDiv = $("mapPointsList");
  var mapDiv = $("mapPointsGeoView");
  
  if (!divider || !container || !listDiv || !mapDiv) {
    return;
  }
  
  // Remove old listeners if they exist
  if (dividerHandlers.mouseDown) {
    divider.removeEventListener("mousedown", dividerHandlers.mouseDown);
    document.removeEventListener("mousemove", dividerHandlers.mouseMove);
    document.removeEventListener("mouseup", dividerHandlers.mouseUp);
    divider.removeEventListener("touchstart", dividerHandlers.touchStart);
    document.removeEventListener("touchmove", dividerHandlers.touchMove);
    document.removeEventListener("touchend", dividerHandlers.touchEnd);
  }
  
  dividerHandlers.mouseDown = function(e) {
    // Only allow dragging when both views are visible
    if (!State.mapPointsView.showList || !State.mapPointsView.showMap) {
      return;
    }
    
    dividerHandlers.isDragging = true;
    divider.classList.add("dragging");
    
    var isHorizontal = container.classList.contains("layout-horizontal");
    
    if (isHorizontal) {
      dividerHandlers.startX = e.clientX;
      dividerHandlers.startWidth = listDiv.getBoundingClientRect().width;
    } else {
      dividerHandlers.startY = e.clientY;
      dividerHandlers.startHeight = listDiv.getBoundingClientRect().height;
    }
    
    // Prevent text selection and default behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Add body styles to prevent selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = isHorizontal ? 'ew-resize' : 'ns-resize';
  };
  
  dividerHandlers.mouseMove = function(e) {
    if (!dividerHandlers.isDragging) return;
    
    var isHorizontal = container.classList.contains("layout-horizontal");
    
    if (isHorizontal) {
      var deltaX = e.clientX - dividerHandlers.startX;
      
      // Only apply changes if delta is significant (avoid micro-jumps)
      if (Math.abs(deltaX) < 1) return;
      
      var newWidth = dividerHandlers.startWidth + deltaX;
      
      // Apply constraints
      var minWidth = parseInt(getComputedStyle(container).getPropertyValue('--list-min-row-width')) || 300;
      var containerWidth = container.getBoundingClientRect().width;
      var maxWidth = containerWidth - 200; // Leave at least 200px for map
      
      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      
      // Update the CSS variable
      container.style.setProperty('--list-dock-left-width', newWidth + 'px');
      listDiv.style.width = newWidth + 'px';
    } else {
      var deltaY = e.clientY - dividerHandlers.startY;
      
      // Only apply changes if delta is significant (avoid micro-jumps)
      if (Math.abs(deltaY) < 1) return;
      
      var newHeight = dividerHandlers.startHeight + deltaY;
      
      // Apply constraints
      var minHeight = 200; // Minimum height for list
      var containerHeight = container.getBoundingClientRect().height;
      var maxHeight = containerHeight - 200; // Leave at least 200px for map
      
      newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
      
      // Update the CSS variable and inline style
      container.style.setProperty('--list-dock-top-height', newHeight + 'px');
      listDiv.style.height = newHeight + 'px';
      
      // Immediately update the table height to match the container's content area
      if (State.pointsTable && State.pointsTable.initialized) {
        var listPadding = 20; // 10px top + 10px bottom
        var tableHeight = listDiv.clientHeight - listPadding;
        State.pointsTable.setHeight(tableHeight);
        State.pointsTable.element.style.height = tableHeight + 'px';
        
        // Also ensure tableholder gets the right height
        var tableholder = State.pointsTable.element.querySelector('.tabulator-tableholder');
        if (tableholder) {
        }
        
        // Force redraw to update visible rows
        State.pointsTable.redraw(true);
      }
    }
    
    // Don't invalidate map during drag - only at the end (performance optimization)
    
    e.preventDefault();
  };
  
  dividerHandlers.mouseUp = function(e) {
    if (!dividerHandlers.isDragging) return;
    
    dividerHandlers.isDragging = false;
    divider.classList.remove("dragging");
    
    // Restore body styles
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    
    // Final map invalidation - no need to destroy/recreate table
    setTimeout(function() {
      if (State.leafletMap) {
        State.leafletMap.invalidateSize();
      }
      // Just ensure table height is correct (already handled during drag)
      if (State.pointsTable && State.pointsTable.initialized) {
        try {
          var listDiv = $("mapPointsList");
          if (listDiv) {
            var listPadding = 20;
            var tableHeight = listDiv.clientHeight - listPadding;
            State.pointsTable.setHeight(tableHeight);
          }
        } catch (e) {
          console.warn('Table resize error:', e);
        }
      }
    }, 50);
  };
  
  dividerHandlers.touchStart = function(e) {
    if (e.touches.length === 1) {
      var touch = e.touches[0];
      dividerHandlers.mouseDown({ 
        clientX: touch.clientX, 
        clientY: touch.clientY, 
        preventDefault: function() { e.preventDefault(); },
        stopPropagation: function() { e.stopPropagation(); }
      });
    }
  };
  
  dividerHandlers.touchMove = function(e) {
    if (dividerHandlers.isDragging && e.touches.length === 1) {
      var touch = e.touches[0];
      dividerHandlers.mouseMove({ 
        clientX: touch.clientX, 
        clientY: touch.clientY, 
        preventDefault: function() { e.preventDefault(); },
        stopPropagation: function() { e.stopPropagation(); }
      });
    }
  };
  
  dividerHandlers.touchEnd = function(e) {
    if (dividerHandlers.isDragging) {
      dividerHandlers.mouseUp({ 
        preventDefault: function() { e.preventDefault(); },
        stopPropagation: function() { e.stopPropagation(); }
      });
    }
  };
  
  // Attach new listeners
  divider.addEventListener("mousedown", dividerHandlers.mouseDown);
  document.addEventListener("mousemove", dividerHandlers.mouseMove);
  document.addEventListener("mouseup", dividerHandlers.mouseUp);
  
  // Touch events for mobile
  divider.addEventListener("touchstart", dividerHandlers.touchStart);
  document.addEventListener("touchmove", dividerHandlers.touchMove);
  document.addEventListener("touchend", dividerHandlers.touchEnd);
}

/* ===== Event Listener Tracking (Debug Utility) ===== */
// Global registry to track event listener assignments
window._eventListenerRegistry = window._eventListenerRegistry || new Map();

/**
 * Wrapper for addEventListener that tracks and detects duplicate listener assignments
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Replace standard addEventListener:
 *    OLD: element.addEventListener('click', handler);
 *    NEW: safeAddEventListener(element, 'click', handler, 'myUniqueHandlerId');
 * 
 * 2. Use with existing flag pattern (recommended for compatibility):
 *    if (!element._handlerAttached) {
 *      element._handlerAttached = true;
 *      safeAddEventListener(element, 'click', handler, 'myHandler');
 *    }
 * 
 * 3. Check all registered listeners in console:
 *    getEventListenerReport();
 * 
 * 4. Check if specific listener exists:
 *    if (hasEventListener(element, 'click', 'myHandler')) { ... }
 * 
 * Benefits:
 * - Automatically prevents duplicate listener registration
 * - Logs warnings when duplicates are detected
 * - Shows visual warning in debug mode
 * - Provides stack trace for debugging
 * - Can generate report of all listeners
 */
function safeAddEventListener(element, eventType, handler, handlerId) {
  if (!element || !eventType || !handler) {
    console.error('safeAddEventListener: Invalid parameters', { element, eventType, handler, handlerId });
    return;
  }
  
  // Create a unique key for this listener
  const elementId = element.id || element.tagName || 'unknown';
  const key = `${elementId}:${eventType}:${handlerId || 'anonymous'}`;
  
  // Check if this listener is already registered
  if (window._eventListenerRegistry.has(key)) {
    const existingInfo = window._eventListenerRegistry.get(key);
    const errorMsg = `⚠️ DUPLICATE EVENT LISTENER DETECTED!\nKey: ${key}\nFirst added: ${existingInfo.timestamp}\nAttempted again: ${new Date().toISOString()}\nStack: ${new Error().stack}`;
    
    console.error(errorMsg);
    
    // Show visual warning when duplicate detected
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #ffc107; color: #000; padding: 15px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 99998; max-width: 400px; font-size: 12px; font-family: monospace;';
    warningDiv.innerHTML = `<strong>⚠️ Duplicate Listener:</strong><br>${key}`;
    document.body.appendChild(warningDiv);
    setTimeout(() => warningDiv.remove(), 5000);
    
    return; // Don't add duplicate listener
  }
  
  // Register this listener
  window._eventListenerRegistry.set(key, {
    element: elementId,
    eventType: eventType,
    handlerId: handlerId,
    timestamp: new Date().toISOString(),
    stack: new Error().stack
  });
  
  // Add the event listener
  element.addEventListener(eventType, handler);
  
  console.log(`✓ Event listener added: ${key}`);
}

/**
 * Check if a specific event listener is already registered
 */
function hasEventListener(element, eventType, handlerId) {
  const elementId = element.id || element.tagName || 'unknown';
  const key = `${elementId}:${eventType}:${handlerId || 'anonymous'}`;
  return window._eventListenerRegistry.has(key);
}

/**
 * Get all registered event listeners (for debugging)
 */
function getEventListenerReport() {
  const report = [];
  window._eventListenerRegistry.forEach((value, key) => {
    report.push({ key, ...value });
  });
  console.table(report);
  return report;
}

/* ===== Init ===== */
async function loadAll() {
  // Prevent duplicate calls to loadAll
  if (window._loadAllCalled) {
    const errorMsg = '❌ CRITICAL ERROR: loadAll() called multiple times! This indicates a serious initialization problem.';
    console.error(errorMsg);
    
    // Display error on the page
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #dc3545; color: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 99999; max-width: 500px; text-align: center; font-size: 16px; font-family: Arial, sans-serif;';
    errorDiv.innerHTML = `
      <h2 style="margin: 0 0 15px 0;">⚠️ Initialization Error</h2>
      <p style="margin: 0 0 15px 0;">${errorMsg}</p>
      <p style="margin: 0; font-size: 14px; opacity: 0.9;">Please refresh the page. If the problem persists, check the browser console for details.</p>
    `;
    document.body.appendChild(errorDiv);
    
    // Throw error to stop execution
    throw new Error('loadAll() called multiple times - aborting to prevent duplicate initialization');
  }
  
  // Mark that loadAll has been called
  window._loadAllCalled = true;
  
  // Initialize remote logger with Config
  setRemoteLoggerConfig(Config);
  
  // Initialize the database with configuration
  DB.initDB(Config.Database);
  // Database initialized in mode: DB.getDBMode()
  
  // Initialize connection manager for remote mode
  if (Config.Database.mode === "REMOTE") {
    const { initConnectionManager } = await import("./db_remote/index.js");
    initConnectionManager();
  }
  
  // Check if we have a connection issue during initialization
  var hasConnectionIssue = false;
  
  // Server mode: Don't load users/points into State.users/State.mapPoints
  // They will be fetched on-demand through DB APIs
  // Just verify DB is accessible
  var usersResult = await DB.getAllUsers();
  if (!usersResult.success) {
    console.error("Failed to access users:", usersResult.error);
    if (usersResult.error && (usersResult.error.includes("fetch") || usersResult.error.includes("Network"))) {
      hasConnectionIssue = true;
    }
  }

  var pointsResult = await DB.getAllPoints();
  if (!pointsResult.success) {
    console.error("Failed to access points:", pointsResult.error);
    if (pointsResult.error && (pointsResult.error.includes("fetch") || pointsResult.error.includes("Network"))) {
      hasConnectionIssue = true;
    }
  }

  // If we detected a connection issue during initialization, show the connection dialog
  if (hasConnectionIssue && Config.Database.mode === "REMOTE") {
    // Show a user-friendly message that the app will wait for connection
    const messageEl = document.getElementById('connectionLossMessage');
    if (messageEl) {
      messageEl.textContent = 'Waiting for server connection to initialize app...';
    }
    
    // Import and use the connection handler
    const { handleConnectionLoss } = await import("./db_remote/index.js");
    
    try {
      // Wait for connection to be restored by attempting a simple operation
      await handleConnectionLoss(async () => {
        return await DB.getAllUsers();
      });
      
      // Connection restored, reload the data
      usersResult = await DB.getAllUsers();
      pointsResult = await DB.getAllPoints();
    } catch (error) {
      // User cancelled or connection failed
      console.error("❌ Failed to establish initial connection:", error.message);
      // Continue anyway with empty data
    }
  }

  // Load settings from DB first (needed to check SaveGuiState)
  var settingsResult = await DB.getSettings();
  
  if (settingsResult.success) {
    State.settings = settingsResult.data || { 
      theme: Config.Constants.Theme.Light, 
      font: Config.Constants.FontSize.Medium,
      autoHideTopMenu: true,
      saveGuiState: true,
      errorsGlobalHandlerEnabled: true,
      remoteLogging: false
    };
    
    // Ensure default values if undefined
    if (State.settings.autoHideTopMenu === undefined) {
      State.settings.autoHideTopMenu = true;
    }
    if (State.settings.saveGuiState === undefined) {
      State.settings.saveGuiState = true;
    }
    if (State.settings.errorsGlobalHandlerEnabled === undefined) {
      State.settings.errorsGlobalHandlerEnabled = true;
    }
    if (State.settings.remoteLogging === undefined) {
      State.settings.remoteLogging = false;
    }
  } else {
    State.settings = { 
      theme: Config.Constants.Theme.Light, 
      font: Config.Constants.FontSize.Medium,
      autoHideTopMenu: true,
      saveGuiState: true,
      errorsGlobalHandlerEnabled: true,
      remoteLogging: false
    };
  }
  
  // Apply persisted settings to Config (before loading user)
  Config.SaveGuiState = State.settings.saveGuiState !== undefined ? State.settings.saveGuiState : true;
  Config.Errors_GlobalHandlerEnabled = State.settings.errorsGlobalHandlerEnabled !== undefined 
    ? State.settings.errorsGlobalHandlerEnabled 
    : true;
  Config.RemoteLogging = State.settings.remoteLogging !== undefined ? State.settings.remoteLogging : false;
  
  // Update remote logger with loaded config
  setRemoteLoggerConfig(Config);

  // Load current user from DB
  // Load user if either AutoLoadCachedUser is enabled OR SaveGuiState is enabled
  var currentUserResult = await DB.getCurrentUser();
  
  if (currentUserResult.success && currentUserResult.data && (Config.AutoLoadCachedUser || Config.SaveGuiState)) {
    var cachedData = currentUserResult.data;
    
    // Check if we got a full user object or just a username string
    if (typeof cachedData === 'string') {
      // It's a username string, fetch the full user object
      var fullUserResult = await DB.getUserByUsername(cachedData);
      
      if (fullUserResult.success && fullUserResult.data) {
        State.currentUser = fullUserResult.data;
        // Pre-cache the current user for menu rendering
        State._userCache[cachedData] = State.currentUser;
      } else {
        State.currentUser = null;
      }
    } else if (typeof cachedData === 'object' && cachedData.username) {
      // It's a full user object (legacy format) - migrate to new format
      
      // Save just the username to migrate to new format
      await DB.setCurrentUser(cachedData.username);
      
      // Fetch the full user object from the users database
      var fullUserResult = await DB.getUserByUsername(cachedData.username);
      if (fullUserResult.success && fullUserResult.data) {
        State.currentUser = fullUserResult.data;
        State._userCache[cachedData.username] = State.currentUser;
      } else {
        // If we can't find the user in the database, use the cached object
        State.currentUser = cachedData;
        State._userCache[cachedData.username] = State.currentUser;
      }
    } else {
      State.currentUser = null;
    }
  } else {
    State.currentUser = null;
  }

  // Apply theme and font from loaded settings
  applyThemeFont();

  // Set document title
  document.title = Config.AppTitle;

  // Initialize status bar
  await updateStatusBar();

  // Initially, hide all content sections (including Help) - showContent will make them visible
  for (var i = 0; i < Config.CONTENT_SECTIONS.length; i++) {
    setSectionVisible(Config.CONTENT_SECTIONS[i], false);
  }
  
  // Check if we're in reconnect mode
  var reconnectBtn = document.getElementById('statusBar-reconnect');
  var isReconnectMode = reconnectBtn && reconnectBtn.style.display !== 'none';
  
  // Render menus for current user (or null if not logged in)
  // Skip this if in reconnect mode
  if (!isReconnectMode) {
    renderMenusFor(State.currentUser);
  }

  // Update status bar to reflect current user (if logged in from cache)
  await updateStatusBar();
  
  if (!isReconnectMode) {
    if (State.currentUser) {
      // User logged in from cache
      if (!Config.SaveGuiState) {
        // SaveGuiState disabled - show default content
        showContent(null);
      }
      // If SaveGuiState enabled, restoreGuiState() will handle it later
    } else {
      // No user logged in - always show map points in view-only mode
      // (even if SaveGuiState is enabled, since there's no GUI state to restore)
      showContent("mapPoints");
    }
  }
  
  // Scroll to top to ensure we start at the top of the page
  window.scrollTo(0, 0);

  // Update view toggle button locations after Config is initialized
  const configLocation = Config.MapPointsList.ViewToggleButtonsLocation;
  const commandNames = ["points.showList", "points.showMap", "points.showBoth"];
  const mapPointsCommands = Config.Commands.LIST[Config.Constants.ContentSection.MapPoints];
  commandNames.forEach(cmdName => {
    const cmd = mapPointsCommands.find(c => c.name === cmdName);
    if (cmd) {
      cmd.menu.location = configLocation;
    }
  });

  // Collapse toggles - add both click and touch events for mobile
  var menuTopHeaderEl = $(Config.Constants.ElementId.MenuTopHeader);
  
  var menuTopHandler = function(e) {
    // Only toggle if the event target is actually inside the header (not bubbled from content area)
    var headerEl = e.currentTarget;
    if (!headerEl.contains(e.target)) {
      // Event came from outside this header element - ignore it
      e.stopPropagation();
      return;
    }
    
    // Additional safety: check if target is in section-content (should never happen, but just in case)
    var contentSection = e.target.closest('.section-content');
    if (contentSection) {
      e.stopPropagation();
      return;
    }
    
    // Don't toggle if clicking on a button inside the header
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      e.stopPropagation();
      return;
    }
    // Don't toggle if clicking in the command bar area (buttons container)
    if (e.target.classList.contains('cmd-bar') || e.target.closest('.cmd-bar')) {
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    toggleCollapse(Config.Constants.ElementId.MenuTop);
  };
  
  if (menuTopHeaderEl) {
    // Only use click event - avoid touchstart which can interfere with swipe gestures
    menuTopHeaderEl.addEventListener("click", menuTopHandler);
    
    // Also add handlers to the section-content to prevent event bubbling
    var menuTopContent = menuTopHeaderEl.nextElementSibling;
    if (menuTopContent && menuTopContent.classList.contains('section-content')) {
      menuTopContent.addEventListener("click", function(e) { e.stopPropagation(); });
    }
  }
  
  var menuBottomHeaderEl = $(Config.Constants.ElementId.MenuBottomHeader);
  
  var menuBottomHandler = function(e) {
    // Only toggle if the event target is actually inside the header (not bubbled from content area)
    var headerEl = e.currentTarget;
    if (!headerEl.contains(e.target)) {
      e.stopPropagation();
      return;
    }
    
    // Additional safety: check if target is in section-content (should never happen, but just in case)
    var contentSection = e.target.closest('.section-content');
    if (contentSection) {
      e.stopPropagation();
      return;
    }
    
    // Don't toggle if clicking on a button inside the header
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      e.stopPropagation();
      return;
    }
    // Don't toggle if clicking in the command bar area (buttons container)  
    if (e.target.classList.contains('cmd-bar') || e.target.closest('.cmd-bar')) {
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    toggleCollapse(Config.Constants.ElementId.MenuBottom);
  };
  
  if (menuBottomHeaderEl) {
    // Only use click event - avoid touchstart which can interfere with swipe gestures
    menuBottomHeaderEl.addEventListener("click", menuBottomHandler);
    
    // Prevent event bubbling from section-content (especially important for mobile)
    var menuBottomContent = menuBottomHeaderEl.nextElementSibling;
    if (menuBottomContent && menuBottomContent.classList.contains('section-content')) {
      // Track touch state to distinguish between tap and scroll
      var touchState = { startY: 0, hasMoved: false, target: null };
      
      // Prevent clicks from bubbling to header (bubble phase, not capture)
      menuBottomContent.addEventListener("click", function(e) { 
        e.stopPropagation();
        // If this was after a scroll gesture, also prevent the click
        if (touchState.hasMoved) {
          e.preventDefault();
        }
      }, false); // Bubble phase - let buttons handle their clicks first
      
      menuBottomContent.addEventListener("touchstart", function(e) { 
        // Record start position and target
        touchState.startY = e.touches[0].clientY;
        touchState.hasMoved = false;
        touchState.target = e.target;
      }, false);
      
      menuBottomContent.addEventListener("touchmove", function(e) { 
        // Check if user has moved significantly (scrolling)
        var moveDistance = Math.abs(e.touches[0].clientY - touchState.startY);
        if (moveDistance > 10) {
          touchState.hasMoved = true;
        }
      }, false);
    }
  }
  
  $(Config.Constants.ElementId.LoginHeader).addEventListener("click", function (e) {
    // Don't toggle if clicking on a button inside the header
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    toggleCollapse(Config.Constants.ContentSection.Login);
  });
  
  // Login form: Enter key handler (desktop mode)
  var loginUsernameInput = $("login-username");
  var loginPasswordInput = $("login-password");
  if (loginUsernameInput) {
    loginUsernameInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleLogin();
      }
    });
  }
  if (loginPasswordInput) {
    loginPasswordInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleLogin();
      }
    });
  }
  $(Config.Constants.ElementId.UsersListHeader).addEventListener("click", function (e) {
    // Don't toggle if clicking on a button inside the header
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    toggleCollapse(Config.Constants.ContentSection.UsersList);
  });
  $(Config.Constants.ElementId.UserDetailsHeader).addEventListener("click", function (e) {
    // Don't toggle if clicking on a button inside the header
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    toggleCollapse(Config.Constants.ContentSection.UserDetails);
  });
  $(Config.Constants.ElementId.MessageHeader).addEventListener("click", function (e) {
    // Don't toggle if clicking on a button inside the header
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    toggleCollapse(Config.Constants.ContentSection.Message);
  });
  var mapPointsHeaderEl = $(Config.Constants.ElementId.MapPointsHeader);
  
  if (mapPointsHeaderEl && !mapPointsHeaderEl._mapPointsHandlerAttached) {
    mapPointsHeaderEl._mapPointsHandlerAttached = true;
    
    var mapPointsHandler = function(e) {
      // Only toggle if the event target is actually inside the header (not bubbled from content area)
      var headerEl = e.currentTarget;
      if (!headerEl.contains(e.target)) {
        // Event came from outside this header element - ignore it
        e.stopPropagation();
        return;
      }
      
      // Additional safety: check if target is in section-content (should never happen, but just in case)
      var contentSection = e.target.closest('.section-content');
      if (contentSection) {
        e.stopPropagation();
        return;
      }
      
      // Don't toggle if clicking on a button inside the header
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        e.stopPropagation();
        return;
      }
      // Don't toggle if clicking in the command bar area (buttons container)
      if (e.target.classList.contains('cmd-bar') || e.target.closest('.cmd-bar')) {
        e.stopPropagation();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      toggleCollapse(Config.Constants.ContentSection.MapPoints);
    };
    
    // Only use click event - avoid touchstart which can interfere with swipe gestures
    mapPointsHeaderEl.addEventListener("click", mapPointsHandler);
  }
  
  var mapPointDetailsHandler = function(e) {
    // Don't toggle if clicking on a button inside the header
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    e.preventDefault();
    toggleCollapse(Config.Constants.ContentSection.MapPointDetails);
  };
  // Only use click event - avoid touchstart which can interfere with swipe gestures
  $(Config.Constants.ElementId.MapPointDetailsHeader).addEventListener("click", mapPointDetailsHandler);
  $(Config.Constants.ElementId.SettingsHeader).addEventListener("click", function (e) {
    // Don't toggle if clicking on a button inside the header
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    console.log('[DEBUG] Settings header CLICKED!', e);
    // When Settings header is clicked, call openSettings() to initialize form values
    openSettings();
  });
  $(Config.Constants.ElementId.AboutHeader).addEventListener("click", function (e) {
    // Don't toggle if clicking on a button inside the header
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    toggleCollapse(Config.Constants.ContentSection.About);
  });
  $(Config.Constants.ElementId.DeveloperToolsHeader).addEventListener("click", function (e) {
    // Don't toggle if clicking on a button inside the header
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    toggleCollapse(Config.Constants.ContentSection.DeveloperTools);
  });
  var helpHeaderEl = $(Config.Constants.ElementId.HelpHeader);
  if (helpHeaderEl && !helpHeaderEl._helpHandlerAttached) {
    helpHeaderEl._helpHandlerAttached = true;
    helpHeaderEl.addEventListener("click", function(e) {
      // Don't toggle if clicking on a button inside the header
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
      }
      var helpSection = $(Config.Constants.ContentSection.Help);
      var wasCollapsed = helpSection ? helpSection.classList.contains(Config.Constants.ClassName.Collapsed) : true;
      
      toggleCollapse(Config.Constants.ContentSection.Help);
      
      // If help is being expanded (was collapsed before), sync with current content
      if (wasCollapsed && State.currentContentId) {
        syncHelpSection(State.currentContentId);
      }
    });
  }
  $(Config.Constants.ElementId.ErrorsHeader).addEventListener("click", function (e) {
    // Don't toggle if clicking on a button inside the header
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    toggleCollapse(Config.Constants.ContentSection.Errors);
  });

  // Status bar errors button click handler
  var errorsButton = $('statusBar-errors');
  if (errorsButton) {
    errorsButton.addEventListener('click', function() {
      showErrorsInEditor();
      showContent(Config.Constants.ContentSection.Errors);
    });
  }

  // Delegates for list row actions
  bindListDelegates();

  // Initialize chevrons for always-visible sections
  updateChevron(Config.Constants.ContentSection.Help);

  // First render of tables
  refreshUsersTable();
  refreshMapPointsTable();
  
  // Set up draggable divider for MapPoints
  setupMapPointsDivider();
  
  // Set up ResizeObserver for MapPoints container to handle dynamic layout
  var mapPointsContainer = $("mapPoints-container");
  if (mapPointsContainer && window.ResizeObserver) {
    var resizeObserver = new ResizeObserver(function(entries) {
      for (var i = 0; i < entries.length; i++) {
        if (State.currentContentId === Constants.ContentSection.MapPoints) {
          updateMapPointsLayout();
          // Invalidate map size after layout change
          if (State.leafletMap && State.mapPointsView.showMap) {
            setTimeout(function() {
              State.leafletMap.invalidateSize();
            }, 50);
          }
        }
      }
    });
    resizeObserver.observe(mapPointsContainer);
  }
  
  // Set up ResizeObserver for mapPointsList (what the splitter actually resizes)
  var mapPointsListDiv = $("mapPointsList");
  if (mapPointsListDiv && window.ResizeObserver) {
    var resizeTimeout;
    var listResizeObserver = new ResizeObserver(function(entries) {
      if (State.pointsTable && State.pointsTable.initialized && State.currentContentId === Constants.ContentSection.MapPoints) {
        // Debounce to avoid excessive updates
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          try {
            // Just update the height directly, no need to destroy/recreate
            var listPadding = 20;
            var newHeight = mapPointsListDiv.clientHeight - listPadding;
            State.pointsTable.setHeight(newHeight);
            
            // Also directly set the height on the DOM element as a fallback
            var tabulatorEl = State.pointsTable.element;
            if (tabulatorEl) {
              tabulatorEl.style.height = newHeight + 'px';
            }
          } catch (e) {
            console.warn('Table resize error:', e);
          }
        }, 100);
      }
    });
    listResizeObserver.observe(mapPointsListDiv);
  }
  
  // Also handle window resize for viewport fitting
  window.addEventListener('resize', function() {
    if (State.currentContentId) {
      // Apply viewport fitting for the current content section
      fitContentToViewport(State.currentContentId);
      
      // Special handling for MapPoints
      if (State.currentContentId === Constants.ContentSection.MapPoints) {
        updateMapPointsLayout();
        if (State.leafletMap && State.mapPointsView.showMap) {
          setTimeout(function() {
            State.leafletMap.invalidateSize();
          }, 50);
        }
      }
    }
    
    // Recalculate menu button overflow on resize
    setTimeout(function() {
      handleMenuOverflow(Config.Constants.ElementId.MenuTop);
      handleMenuOverflow(Config.Constants.ElementId.MenuBottom);
      handleMenuOverflow('mapPoints');
    }, 100);
  });
  
  // Handle fullscreen changes (e.g., user presses ESC key to exit fullscreen)
  document.addEventListener('fullscreenchange', function() {
    // Check if we exited fullscreen but State still thinks we're in fullscreen
    if (!document.fullscreenElement && State.fullScreen.active) {
      exitMapPointsFullScreen();
    }
  });
  
  // Safari uses a different event name
  document.addEventListener('webkitfullscreenchange', function() {
    if (!document.webkitFullscreenElement && State.fullScreen.active) {
      exitMapPointsFullScreen();
    }
  });
  
  // IE11 uses a different event name
  document.addEventListener('MSFullscreenChange', function() {
    if (!document.msFullscreenElement && State.fullScreen.active) {
      exitMapPointsFullScreen();
    }
  });
  
  // Initialize error handlers
  var errorHandlerModule = await import('./errorHandler.js');
  errorHandlerModule.initializeErrorHandlers();
  
  // Set up input change listeners to capture GUI state (debounced)
  document.addEventListener('input', function(e) {
    // Don't capture settings inputs until Apply is clicked
    var isSettingsInput = e.target.id && e.target.id.startsWith('set-');
    // Also check if inside settings section
    var settingsSection = e.target.closest('#settings');
    
    if (isSettingsInput || settingsSection) {
      return;
    }
    
    if (Config.SaveGuiState && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
      clearTimeout(window._guiStateSaveTimer);
      window._guiStateSaveTimer = setTimeout(captureGuiState, 1000);
    }
  });
  
  // Also capture state on checkbox/radio changes
  document.addEventListener('change', function(e) {
    // Don't capture settings inputs until Apply is clicked
    var isSettingsInput = e.target.id && e.target.id.startsWith('set-');
    // Also check if inside settings section
    var settingsSection = e.target.closest('#settings');
    
    if (isSettingsInput || settingsSection) {
      return;
    }
    
    if (Config.SaveGuiState && (e.target.type === 'checkbox' || e.target.type === 'radio')) {
      clearTimeout(window._guiStateSaveTimer);
      window._guiStateSaveTimer = setTimeout(captureGuiState, 500);
    }
  });
  
  // Restore GUI state if SaveGuiState is enabled (after settings are loaded)
  // This is called at the end of loadAll(), after Config.SaveGuiState has been properly set
  restoreGuiState();
  
  // Initialize Settings checkboxes with default values AFTER restoreGuiState
  // This ensures they have correct values even if Settings section is visible on load
  // and overrides any potentially stale values from restored GUI state
  initializeSettingsCheckboxes();
}

/* ===== Initialize Settings Checkboxes ===== */
function initializeSettingsCheckboxes() {
 // console.log('[DEBUG] initializeSettingsCheckboxes - Initializing checkboxes');
  
  // Initialize autoHideTopMenu checkbox
  var autoHideCheckbox = $("set-autoHideTopMenu");
  if (autoHideCheckbox) {
    autoHideCheckbox.checked = State.settings.autoHideTopMenu !== false;
  //  console.log('[DEBUG] initializeSettingsCheckboxes - autoHideTopMenu set to:', autoHideCheckbox.checked);
  }
  
  // Initialize admin-only checkboxes (they may be hidden, but set values anyway)
  var errorHandlerCheckbox = $('set-errorHandler');
  if (errorHandlerCheckbox) {
    errorHandlerCheckbox.checked = Config.Errors_GlobalHandlerEnabled;
  //  console.log('[DEBUG] initializeSettingsCheckboxes - errorHandler set to:', errorHandlerCheckbox.checked);
  }
  
  var saveGuiStateCheckbox = $('set-saveGuiState');
  if (saveGuiStateCheckbox) {
    saveGuiStateCheckbox.checked = Config.SaveGuiState;
  //  console.log('[DEBUG] initializeSettingsCheckboxes - saveGuiState set to:', saveGuiStateCheckbox.checked);
  }
}

/* ===== Global functions for popup buttons ===== */
// Add new map point from popup
window.appAddMapPoint = function() {
  openMapPointDetailsForAdd();
};

// Delete temporary new point marker
window.appDeleteTempMarker = function() {
  if (State.tempPlacemark) {
    State.leafletMap.removeLayer(State.tempPlacemark);
    State.tempPlacemark = null;
  }
};

// Delete existing map point from popup
window.appDeleteMapPoint = async function(pointId) {
  // Fetch the point first to check permissions
  var point = await findPointById(pointId);
  
  if (!point) {
    await customAlert('Error', 'Point not found');
    return;
  }
  
  // Check if user has permission to delete
  if (!canCurrentUserEditPoint(point)) {
    await customAlert('Permission Denied', 'You do not have permission to delete this point');
    return;
  }
  
  if (!confirm('Delete this map point?')) {
    return;
  }
  
  var result = await DB.deletePoint(pointId);
  if (result.success) {
    // Invalidate cache
    invalidatePointCache(pointId);
    refreshMapPointsTable();
    refreshMapMarkers();
    // Update status bar to reflect changes
    await updateStatusBar();
  } else {
    await customAlert('Error', 'Failed to delete point: ' + result.error);
  }
};

// Enter code to find a point
window.appEnterPointCode = async function(pointId) {
  // Fetch the point
  var point = await findPointById(pointId);
  
  if (!point) {
    await customAlert('Error', 'Point not found');
    return;
  }
  
  // Check if point is already found
  if (point.status === 'found') {
    await customAlert('Already Found', 'This point has already been found by ' + (point.foundBy || 'someone'));
    return;
  }
  
  // Prompt for code using custom modal
  var enteredCode = await customPrompt(
    Config.AppTitle,
    'Enter the code for this point:',
    ''
  );
  
  if (!enteredCode) {
    return; // User cancelled
  }
  
  // Trim the entered code
  enteredCode = enteredCode.trim();
  
  // Check if code matches
  if (enteredCode === point.code) {
    // Code is correct - mark as found
    point.status = 'found';
    point.foundBy = State.currentUser;
    
    // Update in database
    var result = await DB.updatePoint(point.id, point);
    if (result.success) {
      // Invalidate cache
      invalidatePointCache(point.id);
      
      // Refresh UI
      refreshMapPointsTable();
      refreshMapMarkers();
      // Update status bar to reflect the new found coin
      await updateStatusBar();
      await customAlert('Congratulations!', 'You found the point!');
    } else {
      await customAlert('Error', 'Failed to update point: ' + result.error);
    }
  } else {
    await customAlert('Incorrect Code', 'Incorrect code. Try again!');
  }
};

/* ===== Mobile Device Detection ===== */
/**
 * Detects if the app is being viewed on a mobile device
 * @returns {boolean} True if mobile device is detected
 */
function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUserAgent = mobileRegex.test(userAgent);
  const isMobileScreenSize = window.innerWidth < 768;
  
  return isMobileUserAgent || isMobileScreenSize;
}

/**
 * Applies mobile-specific styling (darker blue theme)
 * Adds 'mobile-device' class to body for CSS targeting
 */
function applyMobileStyling() {
  if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
    
    // Log for debugging
    console.log('Mobile device detected - applying darker blue theme via CSS class');
  }
}

/* ===== Start ===== */
window.addEventListener("load", () => {
  applyMobileStyling();
  loadAll();
});
