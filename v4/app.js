import { SAMPLE_USERS, SAMPLE_POINTS } from "./data.js";
import { syncArrayWithTemplate } from "./dataUtils.js";
import DB from "./db.js";

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
  },
  CommandName: {
    // Login commands
    LoginOk: "login.ok",
    LoginCancel: "login.cancel",
    LoginRegister: "login.register",
    // Users commands
    UsersAdd: "users.add",
    UsersRefresh: "users.refresh",
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
    PointsDeleteRow: "points.deleteRow",
    PointsEditRow: "points.editRow",
    PointsCancel: "points.cancel",
    PointsShowList: "points.showList",
    PointsShowMap: "points.showMap",
    PointsShowBoth: "points.showBoth",
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
  },
  MenuLocation: {
    TopTitle: "menu.top.title",
    TopTop: "menu.top.top",
    TopBottom: "menu.top.bottom",
    BottomTitle: "menu.bottom.title",
    BottomTop: "menu.bottom.top",
    BottomBottom: "menu.bottom.bottom",
    ListRow: "list.row",
  },
  ElementId: {
    MenuTopTitleCommands: "menuTop-title-commands",
    MenuTopTopCommands: "menuTop-top-commands",
    MenuTopBottomCommands: "menuTop-bottom-commands",
    MenuBottomTitleCommands: "menuBottom-title-commands",
    MenuBottomTopCommands: "menuBottom-top-commands",
    MenuBottomBottomCommands: "menuBottom-bottom-commands",
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
  AppTitle: "Dani-Geo-Coins v4",
  Debug: {
    UseDefaultCredentials: true,
    DefaultUser: "alice",
    DefaultPassword: "1234"
  },
  AutoLoadCachedUser: false, // Set to true to auto-login with previously logged-in user
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
    ViewToggleButtonsLocation: "menu.bottom.title"  // Where to place List/Map/L+M buttons: "menu.bottom.title", "menu.bottom.top", or "menu.bottom.bottom"
  },
  Map: {
    longPressMs: 1000  // Duration in milliseconds to trigger long-press on map
  },
  MapPointDetails: {
    mode: "view",  // "view", "edit", or "add" - controls whether fields are editable and which actions are available
    defaultCoords: null  // {lat, lng} set by long-press on map
  },
  UserDetails: {
    mode: "view"  // "view", "edit", "add", or "register" - controls whether fields are editable and which actions are available
  },
  Database: {
    mode: "LOCAL", // "LOCAL" or "REMOTE"
    remote: {
      baseUrl: "http://localhost:3000/api",
      endpoints: {
        users: "/users",
        points: "/points",
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
  ],

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
        action: function (username) {
          openUserDetails(username);
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
        name: "points.add",
        caption: "Add map point",
        menu: { location: "menu.bottom.title" },
        action: function () {
          openMapPointDetailsForAdd();
        },
        visible: true,
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
          // Only show when map view is visible
          return State.mapPointsView.showMap;
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
        name: "points.deleteRow",
        caption: "Delete",
        menu: { location: "list.row" },
        action: async function (id) {
          var result = await DB.deletePoint(Number(id));
          if (result.success) {
            State.mapPoints = State.mapPoints.filter(function (p) {
              return Number(p.id) !== Number(id);
            });
            refreshMapPointsTable();
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
          showContent(null);
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
        action: function () {
          showContent(null);
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
      visible: true,
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
        showContent("settings");
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
      name: "show.developerTools",
      caption: "Developer Tools",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("developerTools");
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
  users: [],
  mapPoints: [],
  currentUser: null,
  settings: { 
    theme: Config.Constants.Theme.Light, 
    font: Config.Constants.FontSize.Medium,
    autoHideTopMenu: true 
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
};


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

/* ===== Status Bar ===== */
export function setStatusBarTitle(title) {
  setText(Config.Constants.ElementId.StatusBarTitle, title);
}
export function setStatusBarUser(username) {
  var userText = username ? "User: " + username : "Not logged in";
  
  // Add roles if user is logged in
  if (username) {
    var user = findUser(username);
    if (user) {
      var rolesDisplay = getRolesDisplay(user);
      if (rolesDisplay) {
        userText += " [" + rolesDisplay + "]";
      }
    }
  }
  
  setText(Config.Constants.ElementId.StatusBarUser, userText);
}
export function updateStatusBar() {
  setStatusBarTitle(Config.AppTitle);
  setStatusBarUser(State.currentUser);
}

/* ===== Visibility / Collapse ===== */
export function setSectionVisible(id, visible) {
  var el = $(id);
  if (!el) return;
  el.style.display = visible ? "block" : "none";
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
export function updateChevron(id) {
  var chev = $("chev-" + id),
    el = $(id);
  if (!chev || !el) return;
  chev.textContent =
    el.style.display !== "none"
      ? el.classList.contains(Config.Constants.ClassName.Collapsed)
        ? "►"
        : "▼"
      : "";
}

/* ===== Show one content at a time ===== */
function hideAllContent() {
  for (var i = 0; i < Config.CONTENT_SECTIONS.length; i++)
    setSectionVisible(Config.CONTENT_SECTIONS[i], false);
}
export function showContent(id) {
  State.currentContentId = id || null;
  hideAllContent();
  if (State.currentContentId) {
    setSectionVisible(State.currentContentId, true);
    setCollapsed(State.currentContentId, false);
    
    // Auto-hide top menu if enabled and showing content
    if (State.settings.autoHideTopMenu) {
      setSectionVisible(Config.Constants.ElementId.MenuTop, false);
    }
    
    // Auto-fill login credentials for debugging
    if (State.currentContentId === Constants.ContentSection.Login && 
        Config.Debug.UseDefaultCredentials) {
      setVal("login-username", Config.Debug.DefaultUser);
      setVal("login-password", Config.Debug.DefaultPassword);
    }
    
    // Initialize map when MapPoints section is shown
    if (State.currentContentId === Constants.ContentSection.MapPoints) {
      // Apply initial view state from config
      State.mapPointsView.showList = Config.MapPointsList.InitialView.showList;
      State.mapPointsView.showMap = Config.MapPointsList.InitialView.showMap;
      
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
    // No content shown, ensure top menu is visible
    var topHas =
      hasAnyChild(Config.Constants.ElementId.MenuTopTitleCommands) ||
      hasAnyChild(Config.Constants.ElementId.MenuTopTopCommands) ||
      hasAnyChild(Config.Constants.ElementId.MenuTopBottomCommands);
    if (topHas) {
      setSectionVisible(Config.Constants.ElementId.MenuTop, true);
    }
  }
  renderMenusFor(State.currentContentId);
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

  // If a target was specified → navigate there.
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

/* ===== Users ===== */
export async function addUser(u) {
  var result = await DB.addUser(u);
  if (result.success) {
    State.users.push(u);
  }
  return result;
}
export async function removeUserByUsername(username) {
  var result = await DB.deleteUser(username);
  if (result.success) {
    State.users = State.users.filter(function (u) {
      return u.username !== username;
    });
  }
  return result;
}
export function findUser(username) {
  for (var i = 0; i < State.users.length; i++) {
    if (State.users[i].username === username) return State.users[i];
  }
  return null;
}

function renderUsersRow(u, i) {
  var actionsHTML = [
    renderCommandHTML({ payload: u.username }, Config.Constants.CommandName.UsersDeleteRow),
    renderCommandHTML({ payload: u.username }, Config.Constants.CommandName.UsersEditRow),
  ].join(" ");
  var rolesDisplay = getRolesDisplay(u);
  var html = `
    <tr>
      <td>${i + 1}</td>
      <td><button class="${Config.Constants.ClassName.LinkBtn}" ${Config.Constants.Attribute.DataOpenUser}="${u.username}">${
    u.username
  }</button></td>
      <td>${u.name || ""}</td>
      <td>${rolesDisplay}</td>
      <td>${actionsHTML}</td>
    </tr>`;

  return html;
}
export function refreshUsersTable() {
  var tbody = $(Config.Constants.ElementId.UsersTbody),
    table = $(Config.Constants.ElementId.UsersTable),
    empty = $(Config.Constants.ElementId.UsersEmpty);
  tbody.innerHTML = "";
  if (State.users.length === 0) {
    table.style.display = "none";
    empty.style.display = "block";
    return;
  }
  table.style.display = "table";
  empty.style.display = "none";
  var rows = [];
  for (var i = 0; i < State.users.length; i++) {
    rows.push(renderUsersRow(State.users[i], i));
  }
  tbody.innerHTML = rows.join(""); // delegate events below
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
  $("ud-role-admin").checked = roles.indexOf("admin") !== -1;
  $("ud-role-seeker").checked = roles.indexOf("seeker") !== -1;
  $("ud-role-hider").checked = roles.indexOf("hider") !== -1;
  
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
export function openUserDetails(username) {
  var u = findUser(username);
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
  
  if (!newU) return showMessage("Username cannot be empty.", "userDetails");

  if (newU.length > 20) {
    showMessage("Username must be maximum 20 characters.", "userDetails");
    return;
  }
  
  // Check if username already exists (skip check if editing the same user)
  if (mode !== "edit" || oldU !== newU) {
    if (findUser(newU)) {
      return showMessage("Username already exists.", "userDetails");
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
      // Update local state
      for (var i = 0; i < State.users.length; i++) {
        if (State.users[i].username === oldU) {
          State.users[i] = { ...State.users[i], ...userData };
        }
      }
      
      // Update current user if needed
      if (State.currentUser === oldU) {
        State.currentUser = newU;
        await DB.setCurrentUser(newU);
      }
      
      refreshUsersTable();
      showContent("usersList");
    } else {
      showMessage("Failed to save user: " + result.error, "userDetails");
    }
  } else if (mode === "add" || mode === "register") {
    // Add new user
    if (!newPassword) {
      return showMessage("Please enter a password.", "userDetails");
    }
    
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
        // Auto-login after registration
        State.currentUser = newU;
        await DB.setCurrentUser(State.currentUser);
        updateStatusBar();
        showMessage("Registration successful. Welcome, " + State.currentUser + "!", null);
      } else {
        // mode === "add" - admin adding a user
        showMessage("User added successfully.", "usersList");
      }
    } else {
      showMessage("Failed to add user: " + result.error, "userDetails");
    }
  }
}
export async function deleteUser() {
  var username = getVal("ud-username-old");
  if (!username) return;
  
  var result = await removeUserByUsername(username);
  if (result.success) {
    if (State.currentUser === username) {
      State.currentUser = null;
      await DB.clearCurrentUser();
    }
    refreshUsersTable();
    showContent("usersList");
  } else {
    showMessage("Failed to delete user: " + result.error, "userDetails");
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

/* ===== Auth ===== §kamen_20251010_180801 */
export async function handleLogin() {
  var user = getVal("login-username"),
    pass = $("login-password").value;
  
  var result = await DB.authenticateUser(user, pass);
  if (result.success && result.data) {
    State.currentUser = result.data.username;
    await DB.setCurrentUser(State.currentUser);
    updateStatusBar();
    showMessage("Login successful. Welcome, " + State.currentUser + "!", null);
  } else {
    showMessage("Login failed. Wrong username or password.", "login");
  }
}
export async function logout() {
  State.currentUser = null;
  await DB.clearCurrentUser();
  updateStatusBar();
  showMessage("You have been logged out.", null);
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
  var tbody = $(Config.Constants.ElementId.MpsTbody),
    table = $(Config.Constants.ElementId.MpsTable),
    empty = $(Config.Constants.ElementId.MpsEmpty);
  tbody.innerHTML = "";
  if (State.mapPoints.length === 0) {
    table.style.display = "none";
    empty.style.display = "block";
  } else {
    table.style.display = "table";
    empty.style.display = "none";
    var rows = [];
    for (var i = 0; i < State.mapPoints.length; i++) {
      rows.push(renderPointsRow(State.mapPoints[i], i));
    }
    tbody.innerHTML = rows.join("");
  }
  
  // Also refresh map markers if map is initialized
  if (State.leafletMap) {
    refreshMapMarkers();
  }
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
    return showMessage("Latitude and Longitude must be numbers.", "mapPoints");
  
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
      showMessage("Failed to update point: " + result.error, "mapPoints");
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
      showMessage("Map point added.", "mapPoints");
    } else {
      showMessage("Failed to add point: " + result.error, "mapPoints");
    }
  }
}
export function openMapPointDetails(id) {
  var p = null;
  for (var i = 0; i < State.mapPoints.length; i++) {
    if (Number(State.mapPoints[i].id) === Number(id)) p = State.mapPoints[i];
  }
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
  
  // Find and open the marker's popup for this point
  State.leafletMap.eachLayer(function(layer) {
    if (layer instanceof L.Marker) {
      var latlng = layer.getLatLng();
      if (latlng.lat === point.lat && latlng.lng === point.lng) {
        layer.openPopup();
      }
    }
  });
}

export function openMapPointDetailsForAdd() {
  Config.MapPointDetails.mode = "add";
  setText("mpd-mode-indicator", "(Add New)");
  setVal("mpd-id", "");
  
  // State.currentUser is the username string, not an object
  var currentUsername = State.currentUser || "";
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
  
  // Remove the temp placemark (coords are already stored)
  if (State.tempPlacemark && State.leafletMap) {
    State.leafletMap.removeLayer(State.tempPlacemark);
    State.tempPlacemark = null;
  }
  
  showContent("mapPointDetails");
}

export function openMapPointDetailsForEdit(id) {
  var p = null;
  for (var i = 0; i < State.mapPoints.length; i++) {
    if (Number(State.mapPoints[i].id) === Number(id)) p = State.mapPoints[i];
  }
  if (!p) return;
  
  Config.MapPointDetails.mode = "edit";
  setText("mpd-mode-indicator", "(Edit)");
  setVal("mpd-id", p.id);
  setVal("mpd-username", p.username || "");
  setVal("mpd-title", p.title || "");
  setVal("mpd-lat", "" + p.lat);
  setVal("mpd-lng", "" + p.lng);
  setVal("mpd-desc", p.desc || "");
  showContent("mapPointDetails");
}

export async function saveMapPointFromDetails() {
  var idStr = getVal("mpd-id");
  var username = getVal("mpd-username") || State.currentUser || "";
  var title = getVal("mpd-title").trim();
  var lat = Number(getVal("mpd-lat"));
  var lng = Number(getVal("mpd-lng"));
  var desc = getVal("mpd-desc");
  
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
  
  // Check title uniqueness
  var currentId = Config.MapPointDetails.mode === "edit" ? Number(idStr) : null;
  for (var i = 0; i < State.mapPoints.length; i++) {
    var point = State.mapPoints[i];
    // Skip the current point when editing
    if (currentId !== null && Number(point.id) === currentId) {
      continue;
    }
    // Check if another point has the same title
    if (point.title && point.title.trim().toLowerCase() === title.toLowerCase()) {
      return showMessage("A map point with this title already exists. Please use a unique title.", "mapPointDetails");
    }
  }
  
  if (Config.MapPointDetails.mode === "add") {
    // Add new point
    var newPointData = {
      username: username,
      title: title,
      lat: lat,
      lng: lng,
      desc: desc
    };
    
    var result = await DB.addPoint(newPointData);
    if (result.success) {
      State.mapPoints.push(result.data);
      refreshMapPointsTable();
      showContent("mapPoints");
    } else {
      showMessage("Failed to add point: " + result.error, "mapPointDetails");
    }
  } else if (Config.MapPointDetails.mode === "edit") {
    // Update existing point
    var id = Number(idStr);
    var pointData = {
      username: username,
      title: title,
      lat: lat,
      lng: lng,
      desc: desc
    };
    
    var result = await DB.updatePoint(id, pointData);
    if (result.success) {
      for (var i = 0; i < State.mapPoints.length; i++) {
        if (Number(State.mapPoints[i].id) === id) {
          State.mapPoints[i] = result.data;
          break;
        }
      }
      refreshMapPointsTable();
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
  setVal("mp-desc", p.desc || "");
  showContent("mapPoints");
}
export async function deleteMapPointFromDetails() {
  var id = Number(getVal("mpd-id"));
  
  var result = await DB.deletePoint(id);
  if (result.success) {
    State.mapPoints = State.mapPoints.filter(function (x) {
      return Number(x.id) !== id;
    });
    refreshMapPointsTable();
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
    content += '<br><small>Accuracy: ±' + Math.round(accuracy) + 'm</small>';
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

export function updateMapPointsLayout() {
  var container = $("mapPoints-container");
  if (!container) return;
  
  // Set container height based on configuration
  var containerHeight = Config.MapPointsList.ContainerHeight;
  if (containerHeight <= 0) {
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
  } else {
    // Use fixed height from config
    container.style.height = containerHeight + 'px';
  }
  
  var rect = container.getBoundingClientRect();
  var width = rect.width;
  var height = rect.height;
  
  // Determine layout based on aspect ratio
  if (width > height) {
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
    container.style.setProperty('--list-dock-top-height', dockTopHeight + 'px');
  }
  
  // Apply min row width
  var minRowWidth = Config.MapPointsList.MinRowWidth || 300;
  container.style.setProperty('--list-min-row-width', minRowWidth + 'px');
}

export function initializeLeafletMap() {
  var mapDiv = $("mapPointsMap");
  if (!mapDiv) return;
  
  // Initialize map if not already done
  if (!State.leafletMap) {
    try {
      // Default center - can be updated based on points
      State.leafletMap = L.map('mapPointsMap').setView([51.5, -0.09], 13);
      
      // Add tile layer
      L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=9Ul437Kx3uMsy4w6lOQN', {
        attribution: '<a href="https://www.maptiler.com/license/maps/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
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
  } else {
    // Map already exists, just refresh its size and markers
    State.leafletMap.invalidateSize();
    if (!State.skipMapRefresh) {
      refreshMapMarkers();
    }
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

export function refreshMapMarkers() {
  if (!State.leafletMap) return;
  
  // Clear existing markers but preserve the temporary placeholder
  State.leafletMap.eachLayer(function(layer) {
    if (layer instanceof L.Marker && layer !== State.tempPlacemark) {
      State.leafletMap.removeLayer(layer);
    }
  });
  
  // Add markers for all points
  var bounds = [];
  for (var i = 0; i < State.mapPoints.length; i++) {
    var point = State.mapPoints[i];
    if (point.lat && point.lng) {
      var marker = L.marker([point.lat, point.lng]).addTo(State.leafletMap);
      var popupContent = '<b>' + (point.title || 'Untitled') + '</b><br>' +
                        'User: ' + (point.username || 'Unknown') + '<br>' +
                        (point.desc || '') + '<br>' +
                        '<button onclick="window.appDeleteMapPoint(' + point.id + ')" style="margin-top:5px;">Delete</button>';
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
}

/* ===== Settings ===== */
export function applyThemeFont() {
  document.body.setAttribute(Config.Constants.Attribute.DataTheme, State.settings.theme || Config.Constants.Theme.Light);
  document.body.setAttribute(Config.Constants.Attribute.DataFont, State.settings.font || Config.Constants.FontSize.Medium);
}
export function openSettings() {
  showContent(Config.Constants.ContentSection.Settings);
  setVal("set-theme", State.settings.theme || Config.Constants.Theme.Light);
  setVal("set-font", State.settings.font || Config.Constants.FontSize.Medium);
  $("set-autoHideTopMenu").checked = State.settings.autoHideTopMenu || false;
}
export async function applySettings() {
  State.settings = {
    theme: getVal("set-theme"),
    font: getVal("set-font") || Config.Constants.FontSize.Medium,
    autoHideTopMenu: $("set-autoHideTopMenu").checked || false,
  };
  
  var result = await DB.saveSettings(State.settings);
  if (result.success) {
    applyThemeFont();
    showMessage("Settings applied.", Config.Constants.ContentSection.Settings);
  } else {
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

export function showDbInEditor() {
  // Initialize editor if needed
  initializeJsonEditor();
  
  // Prepare database data
  var dbData = {
    users: State.users,
    points: State.mapPoints
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
    
    // Clear existing data
    await DB.resetAllData();
    
    // Save users
    var userErrors = [];
    for (var i = 0; i < dbData.users.length; i++) {
      var user = dbData.users[i];
      var result = await DB.addUser(user);
      if (!result.success) {
        userErrors.push("User '" + (user.username || 'unknown') + "': " + result.error);
      }
    }
    
    // Save points
    var pointErrors = [];
    for (var j = 0; j < dbData.points.length; j++) {
      var point = dbData.points[j];
      var result = await DB.addPoint(point);
      if (!result.success) {
        pointErrors.push("Point ID " + (point.id || 'unknown') + ": " + result.error);
      }
    }
    
    // Reload data from DB
    var usersResult = await DB.getAllUsers();
    var pointsResult = await DB.getAllPoints();
    
    if (usersResult.success) {
      State.users = usersResult.data;
    }
    if (pointsResult.success) {
      State.mapPoints = pointsResult.data;
    }
    
    // Refresh UI
    refreshUsersTable();
    refreshMapPointsTable();
    
    // Show result message
    var errorMsg = "";
    if (userErrors.length > 0) {
      errorMsg += "User errors:\n" + userErrors.join("\n") + "\n\n";
    }
    if (pointErrors.length > 0) {
      errorMsg += "Point errors:\n" + pointErrors.join("\n");
    }
    
    if (errorMsg) {
      showMessage("Database partially saved with errors:\n\n" + errorMsg, "developerTools");
    } else {
      showMessage("Database saved successfully!", "developerTools");
    }
    
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
    // Allow: Show Login, Show Register, Show About, and all login/userDetails (register mode) page commands, plus message OK
    var allowedCommands = [
      Config.Constants.CommandName.ShowLogin,
      Config.Constants.CommandName.ShowRegister,
      Config.Constants.CommandName.ShowAbout,
      Config.Constants.CommandName.LoginOk,
      Config.Constants.CommandName.LoginCancel,
      Config.Constants.CommandName.LoginRegister,
      Config.Constants.CommandName.UserSave,
      Config.Constants.CommandName.UserCancel,
      Config.Constants.CommandName.MessageOk
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
    
    // Only show Users List button if user is admin
    if (cmd.name === Config.Constants.CommandName.ShowUsers) {
      var currentUser = findUser(State.currentUser);
      if (!currentUser || !hasRole(currentUser, "admin")) {
        return null; // Skip Users List button if not admin
      }
    }
    
    // Only show Developer Tools button if user is admin
    if (cmd.name === Config.Constants.CommandName.ShowDeveloperTools) {
      var currentUser = findUser(State.currentUser);
      if (!currentUser || !hasRole(currentUser, "admin")) {
        return null; // Skip Developer Tools button if not admin
      }
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
  if (!enabled) btn.disabled = true;
  btn.addEventListener("click", function () {
    if (!enabled) return;
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
  ];
  for (var i = 0; i < ids.length; i++) {
    var el = $(ids[i]);
    if (el) el.innerHTML = "";
  }
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
  setCollapsed(Config.Constants.ElementId.MenuTop, false);
  setCollapsed(Config.Constants.ElementId.MenuBottom, false);
}
function renderMenusFor(contentId) {
  clearMenuBars();
  
  // Don't show top menu when displaying a message
  if (contentId !== Config.Constants.ContentSection.Message && State.currentUser) {
    // Always show top menu when user is logged in (except when showing message)
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
          : null;
      if (hostId) {
        var host = $(hostId);
        if (host) {
          var isViewToggle = viewToggleButtons.indexOf(c.name) >= 0;
          
          // Call on_before_command_added to get the HTML element
          var btnElement = on_before_command_added(hostId, c);
          if (btnElement) {
            var needsSeparator = false;
            
            // Add separator before first view toggle button (after non-view-toggle buttons)
            if (isViewToggle && lastWasNonViewToggle && hostId === Config.Constants.ElementId.MenuBottomTitleCommands) {
              needsSeparator = true;
            }
            
            // Add separator after last view toggle button (before non-view-toggle buttons)
            if (!isViewToggle && lastWasViewToggle && hostId === Config.Constants.ElementId.MenuBottomTitleCommands) {
              needsSeparator = true;
            }
            
            if (needsSeparator) {
              var separator = document.createElement("span");
              separator.className = "cmd-separator";
              separator.textContent = "|";
              host.appendChild(separator);
            }
            
            host.appendChild(btnElement);
            lastWasViewToggle = isViewToggle;
            lastWasNonViewToggle = !isViewToggle;
          }
        }
      }
    }
  } else if (!State.currentUser) {
    // No content visible and no user logged in -> default top menu commands
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
  var uBody = $(Config.Constants.ElementId.UsersTbody);
  if (uBody) {
    uBody.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains(Config.Constants.ClassName.LinkBtn)) {
        var username = t.getAttribute(Config.Constants.Attribute.DataOpenUser);
        openUserDetails(username);
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
  var pBody = $(Config.Constants.ElementId.MpsTbody);
  if (pBody) {
    pBody.addEventListener("click", function (e) {
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
export function setupMapPointsDivider() {
  var divider = $("mapPointsDivider");
  var container = $("mapPoints-container");
  var listDiv = $("mapPointsList");
  var mapDiv = $("mapPointsGeoView");
  
  if (!divider || !container || !listDiv || !mapDiv) return;
  
  var isDragging = false;
  var startX = 0;
  var startY = 0;
  var startWidth = 0;
  var startHeight = 0;
  
  function onMouseDown(e) {
    // Only allow dragging when both views are visible
    if (!State.mapPointsView.showList || !State.mapPointsView.showMap) {
      return;
    }
    
    isDragging = true;
    divider.classList.add("dragging");
    
    var isHorizontal = container.classList.contains("layout-horizontal");
    
    if (isHorizontal) {
      startX = e.clientX;
      startWidth = listDiv.getBoundingClientRect().width;
    } else {
      startY = e.clientY;
      startHeight = listDiv.getBoundingClientRect().height;
    }
    
    e.preventDefault();
  }
  
  function onMouseMove(e) {
    if (!isDragging) return;
    
    var isHorizontal = container.classList.contains("layout-horizontal");
    
    if (isHorizontal) {
      var deltaX = e.clientX - startX;
      var newWidth = startWidth + deltaX;
      
      // Apply constraints
      var minWidth = parseInt(getComputedStyle(container).getPropertyValue('--list-min-row-width')) || 300;
      var containerWidth = container.getBoundingClientRect().width;
      var maxWidth = containerWidth - 200; // Leave at least 200px for map
      
      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      
      // Update the CSS variable
      container.style.setProperty('--list-dock-left-width', newWidth + 'px');
      listDiv.style.width = newWidth + 'px';
    } else {
      var deltaY = e.clientY - startY;
      var newHeight = startHeight + deltaY;
      
      // Apply constraints
      var minHeight = 200; // Minimum height for list
      var containerHeight = container.getBoundingClientRect().height;
      var maxHeight = containerHeight - 200; // Leave at least 200px for map
      
      newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
      
      // Update the CSS variable
      container.style.setProperty('--list-dock-top-height', newHeight + 'px');
      listDiv.style.height = newHeight + 'px';
    }
    
    // Invalidate map size
    if (State.leafletMap) {
      State.leafletMap.invalidateSize();
    }
    
    e.preventDefault();
  }
  
  function onMouseUp(e) {
    if (!isDragging) return;
    
    isDragging = false;
    divider.classList.remove("dragging");
    
    // Final map invalidation
    if (State.leafletMap) {
      setTimeout(function() {
        State.leafletMap.invalidateSize();
      }, 50);
    }
  }
  
  // Mouse events
  divider.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  
  // Touch events for mobile
  divider.addEventListener("touchstart", function(e) {
    if (e.touches.length === 1) {
      var touch = e.touches[0];
      onMouseDown({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: function() { e.preventDefault(); } });
    }
  });
  
  document.addEventListener("touchmove", function(e) {
    if (isDragging && e.touches.length === 1) {
      var touch = e.touches[0];
      onMouseMove({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: function() { e.preventDefault(); } });
    }
  });
  
  document.addEventListener("touchend", function(e) {
    if (isDragging) {
      onMouseUp({ preventDefault: function() { e.preventDefault(); } });
    }
  });
}

/* ===== Init ===== */
async function loadAll() {
  // Initialize the database with configuration
  DB.initDB(Config.Database);
  console.log("Database initialized in mode:", DB.getDBMode());
  
  // Load users from DB
  var usersResult = await DB.getAllUsers();
  if (usersResult.success) {
    State.users = usersResult.data || [];
  } else {
    console.error("Failed to load users:", usersResult.error);
    State.users = [];
  }

  // Load map points from DB
  var pointsResult = await DB.getAllPoints();
  if (pointsResult.success) {
    State.mapPoints = pointsResult.data || [];
  } else {
    console.error("Failed to load points:", pointsResult.error);
    State.mapPoints = [];
  }

  // Load current user from DB
  var currentUserResult = await DB.getCurrentUser();
  if (currentUserResult.success && Config.AutoLoadCachedUser) {
    State.currentUser = currentUserResult.data;
  } else {
    State.currentUser = null;
  }

  // Load settings from DB
  var settingsResult = await DB.getSettings();
  if (settingsResult.success) {
    State.settings = settingsResult.data || { 
      theme: Config.Constants.Theme.Light, 
      font: Config.Constants.FontSize.Medium,
      autoHideTopMenu: true 
    };
  } else {
    State.settings = { 
      theme: Config.Constants.Theme.Light, 
      font: Config.Constants.FontSize.Medium,
      autoHideTopMenu: true 
    };
  }
  applyThemeFont();

  // Initialize status bar
  updateStatusBar();

  // Initially, no content -> default menu commands
  for (var i = 0; i < Config.CONTENT_SECTIONS.length; i++)
    setSectionVisible(Config.CONTENT_SECTIONS[i], false);
  renderMenusFor(null);

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

  // Collapse toggles
  $(Config.Constants.ElementId.MenuTopHeader).addEventListener("click", function () {
    toggleCollapse(Config.Constants.ElementId.MenuTop);
  });
  $(Config.Constants.ElementId.MenuBottomHeader).addEventListener("click", function () {
    toggleCollapse(Config.Constants.ElementId.MenuBottom);
  });
  $(Config.Constants.ElementId.LoginHeader).addEventListener("click", function () {
    toggleCollapse(Config.Constants.ContentSection.Login);
  });
  $(Config.Constants.ElementId.UsersListHeader).addEventListener("click", function () {
    toggleCollapse(Config.Constants.ContentSection.UsersList);
  });
  $(Config.Constants.ElementId.UserDetailsHeader).addEventListener("click", function () {
    toggleCollapse(Config.Constants.ContentSection.UserDetails);
  });
  $(Config.Constants.ElementId.MessageHeader).addEventListener("click", function () {
    toggleCollapse(Config.Constants.ContentSection.Message);
  });
  $(Config.Constants.ElementId.MapPointsHeader).addEventListener("click", function () {
    toggleCollapse(Config.Constants.ContentSection.MapPoints);
  });
  $(Config.Constants.ElementId.MapPointDetailsHeader).addEventListener("click", function () {
    toggleCollapse(Config.Constants.ContentSection.MapPointDetails);
  });
  $(Config.Constants.ElementId.SettingsHeader).addEventListener("click", function () {
    toggleCollapse(Config.Constants.ContentSection.Settings);
  });
  $(Config.Constants.ElementId.AboutHeader).addEventListener("click", function () {
    toggleCollapse(Config.Constants.ContentSection.About);
  });

  // Delegates for list row actions
  bindListDelegates();

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
  
  // Also handle window resize for good measure
  window.addEventListener('resize', function() {
    if (State.currentContentId === Constants.ContentSection.MapPoints) {
      updateMapPointsLayout();
      if (State.leafletMap && State.mapPointsView.showMap) {
        setTimeout(function() {
          State.leafletMap.invalidateSize();
        }, 50);
      }
    }
  });
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
  if (!confirm('Delete this map point?')) {
    return;
  }
  
  var result = await DB.deletePoint(pointId);
  if (result.success) {
    State.mapPoints = State.mapPoints.filter(function (x) {
      return Number(x.id) !== Number(pointId);
    });
    refreshMapPointsTable();
    refreshMapMarkers();
  } else {
    alert('Failed to delete point: ' + result.error);
  }
};

/* ===== Start ===== */
window.addEventListener("load", loadAll);
