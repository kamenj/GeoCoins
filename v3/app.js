import { SAMPLE_USERS, SAMPLE_POINTS } from "./data.js";
import { syncArrayWithTemplate } from "./dataUtils.js";

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
    Register: "register",
    UsersList: "usersList",
    UserDetails: "userDetails",
    Message: "message",
    MapPoints: "mapPoints",
    MapPointDetails: "mapPointDetails",
    Settings: "settings",
    About: "about",
  },
  CommandName: {
    // Login commands
    LoginOk: "login.ok",
    LoginCancel: "login.cancel",
    LoginRegister: "login.register",
    // Register commands
    RegisterOk: "register.ok",
    RegisterCancel: "register.cancel",
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
    PointsRefresh: "points.refresh",
    PointsDeleteRow: "points.deleteRow",
    PointsEditRow: "points.editRow",
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
    // Show commands
    ShowLogin: "show.login",
    ShowRegister: "show.register",
    ShowUsers: "show.users",
    ShowPoints: "show.points",
    ShowSettings: "show.settings",
    ShowAbout: "show.about",
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
    RegisterHeader: "register-header",
    UsersListHeader: "usersList-header",
    UserDetailsHeader: "userDetails-header",
    MessageHeader: "message-header",
    MapPointsHeader: "mapPoints-header",
    MapPointDetailsHeader: "mapPointDetails-header",
    SettingsHeader: "settings-header",
    AboutHeader: "about-header",
    UsersTbody: "users-tbody",
    UsersTable: "users-table",
    UsersEmpty: "users-empty",
    MpsTbody: "mps-tbody",
    MpsTable: "mps-table",
    MpsEmpty: "mps-empty",
    MessageText: "message-text",
    Message: "message",
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
  CONTENT_SECTIONS: [
    Constants.ContentSection.Login,
    Constants.ContentSection.Register,
    Constants.ContentSection.UsersList,
    Constants.ContentSection.UserDetails,
    Constants.ContentSection.Message,
    Constants.ContentSection.MapPoints,
    Constants.ContentSection.MapPointDetails,
    Constants.ContentSection.Settings,
    Constants.ContentSection.About,
  ],

  Commands: {
    LIST: {
      [Constants.ContentSection.Login]: [
      {
        name: "login.ok",
        caption: "OK",
        menu: { location: "menu.bottom.title" },
        action: function () {
          handleLogin();
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
          showContent("register");
        },
        visible: true,
        enabled: true,
      },
    ],
    [Constants.ContentSection.Register]: [
      {
        name: "register.ok",
        caption: "OK",
        menu: { location: "menu.bottom.title" },
        action: function () {
          registerUser();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "register.cancel",
        caption: "Cancel",
        menu: { location: "menu.bottom.title" },
        action: function () {
          showContent("login");
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
          showContent("register");
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
        action: function (username) {
          removeUserByUsername(username);
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
        action: function () {
          saveUserDetails();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "user.delete",
        caption: "Delete",
        menu: { location: "menu.bottom.title" },
        action: function () {
          deleteUser();
        },
        visible: true,
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
          clearMapPointForm();
        },
        visible: true,
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
        name: "points.deleteRow",
        caption: "Delete",
        menu: { location: "list.row" },
        action: function (id) {
          State.mapPoints = State.mapPoints.filter(function (p) {
            return Number(p.id) !== Number(id);
          });
          savePoints();
          refreshMapPointsTable();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "points.editRow",
        caption: "Edit",
        menu: { location: "list.row" },
        action: function (id) {
          openMapPointDetails(id);
          editMapPointFromDetails();
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
        action: function () {
          saveMapPoint();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "mpd.delete",
        caption: "Delete",
        menu: { location: "menu.bottom.title" },
        action: function () {
          deleteMapPointFromDetails();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "mpd.cancel",
        caption: "Cancel",
        menu: { location: "menu.bottom.title" },
        action: function () {
          showContent("mapPoints");
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
        action: function () {
          applySettings();
        },
        visible: true,
        enabled: true,
      },
      {
        name: "settings.reset",
        caption: "Reset",
        menu: { location: "menu.bottom.title" },
        action: function () {
          resetAll();
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
  },
  DEFAULT_MENU_TOP: [
    {
      name: "show.login",
      caption: "Show Login",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("login");
      },
      visible: true,
      enabled: true,
    },
    {
      name: "show.register",
      caption: "Show Register",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("register");
      },
      visible: true,
      enabled: true,
    },
    {
      name: "show.users",
      caption: "Show Users List",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("usersList");
      },
      visible: true,
      enabled: true,
    },
    {
      name: "show.points",
      caption: "Show Map Points",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("mapPoints");
      },
      visible: true,
      enabled: true,
    },
    {
      name: "show.settings",
      caption: "Show Settings",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("settings");
      },
      visible: true,
      enabled: true,
    },
    {
      name: "show.about",
      caption: "Show About",
      menu: { location: "menu.top.top" },
      action: function () {
        showContent("about");
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
  settings: { theme: Config.Constants.Theme.Light, font: Config.Constants.FontSize.Medium },
  afterMessageShowId: null, // target section to show after closing the message
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
  if (el) el.value = v;
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
  if (collapsed) el.classList.add(Config.Constants.ClassName.Collapsed);
  else el.classList.remove(Config.Constants.ClassName.Collapsed);
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
    if (State.message_BefireDisplayContentID) {
      showContent(State.message_BefireDisplayContentID);
    }
  }

  // Reset intent
  State.afterMessageShowId = null;
  State.message_BefireDisplayContentID = null;
}

/* ===== Users ===== */
export function addUser(u) {
  State.users.push(u);
  save(Config.LS.users, State.users);
}
export function removeUserByUsername(username) {
  State.users = State.users.filter(function (u) {
    return u.username !== username;
  });
  save(Config.LS.users, State.users);
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
  var html = `
    <tr>
      <td>${i + 1}</td>
      <td><button class="${Config.Constants.ClassName.LinkBtn}" ${Config.Constants.Attribute.DataOpenUser}="${u.username}">${
    u.username
  }</button></td>
      <td>${u.name || ""}</td>
      <td>${u.role || ""}</td>
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

function fillUserDetails(u) {
  setVal("ud-username-old", u.username);
  setVal("ud-username", u.username);
  setVal("ud-name", u.name || "");
  // setVal("ud-surname", u.surname || "");§kamen_20251010_175213
  setVal("ud-password", u.password || "");
}
export function openUserDetails(username) {
  var u = findUser(username);
  if (!u) return;
  fillUserDetails(u);
  showContent("userDetails");
}
export function saveUserDetails() {
  var oldU = getVal("ud-username-old"),
    newU = getVal("ud-username"),
    newName = getVal("ud-name"),
    // newSurname = getVal("ud-surname");
    newPassword = getVal("ud-password");
  if (!newU) return showMessage("Username cannot be empty.", "userDetails");

  // console.log(`newU.length = ${newU.length}`);
  if (newU.length > 20) {
    //§kamen_20251010_175547
    showMessage("Username must be maximum 20 characters.", "userDetails");
    return;
  }
  if (oldU !== newU && findUser(newU))
    return showMessage("Username already exists.", "userDetails");
  for (var i = 0; i < State.users.length; i++) {
    if (State.users[i].username === oldU) {
      State.users[i].username = newU;
      State.users[i].name = newName;
      State.users[i].password = newPassword;
    }
  }
  save(Config.LS.users, State.users);
  if (State.currentUser === oldU) State.currentUser = newU;
  refreshUsersTable();
  showContent("usersList");
}
export function deleteUser() {
  var username = getVal("ud-username-old");
  if (!username) return;
  removeUserByUsername(username);
  if (State.currentUser === username) State.currentUser = null;
  refreshUsersTable();
  showContent("usersList");
}
export function cancelUserDetails() {
  showContent("usersList");
}

/* ===== Auth ===== §kamen_20251010_180801 */
export function handleLogin() {
  var user = getVal("login-username"),
    pass = $("login-password").value;
  var found = findUser(user);
  if (found && found.password === pass) {
    State.currentUser = found.username;
    save(Config.LS.currentUser, State.currentUser);
    showMessage("Login successful. Welcome, " + State.currentUser + "!", "usersList");
  } else {
    showMessage("Login failed. Wrong username or password.", "login");
  }
}
export function logout() {
  State.currentUser = null;
  save(Config.LS.currentUser, null);
  showMessage("You have been logged out.", null);
}

/* ===== Registration ===== */
export function clearRegisterForm() {
  setVal("reg-username", ""),
  setVal("reg-password", ""),
  setVal("reg-name", ""),
  setVal("reg-surname", ""),
  setVal("reg-gender", "");
}
export function registerUser() {
  var username = getVal("reg-username"),
    password = $("reg-password").value,
    name = getVal("reg-name"),
    surname = getVal("reg-surname"),
    gender = getVal("reg-gender");
  if (!username || !password)
    return showMessage("Please enter username and password.", "register");
  if (findUser(username))
    return showMessage("This username already exists.", "register");
  addUser({
    username: username,
    password: password,
    name: name,
    surname: surname,
    gender: gender,
  });
  refreshUsersTable();
  clearRegisterForm();
  showMessage("Registration successful for: " + username, "login");
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
function savePoints() {
  save(Config.LS.points, State.mapPoints);
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
    return;
  }
  table.style.display = "table";
  empty.style.display = "none";
  var rows = [];
  for (var i = 0; i < State.mapPoints.length; i++) {
    rows.push(renderPointsRow(State.mapPoints[i], i));
  }
  tbody.innerHTML = rows.join("");
}

export function clearMapPointForm() {
  setVal("mp-id", ""),
    setVal("mp-username", ""),
    setVal("mp-title", ""),
    setVal("mp-lat", ""),
    setVal("mp-lng", ""),
    setVal("mp-desc", "");
}
export function saveMapPoint() {
  var idStr = getVal("mp-id"),
    username = getVal("mp-username"),
    title = getVal("mp-title"),
    lat = Number(getVal("mp-lat")),
    lng = Number(getVal("mp-lng")),
    desc = getVal("mp-desc");
  if (!isFinite(lat) || !isFinite(lng))
    return showMessage("Latitude and Longitude must be numbers.", "mapPoints");
  if (idStr) {
    var id = Number(idStr);
    for (var i = 0; i < State.mapPoints.length; i++) {
      if (State.mapPoints[i].id === id) {
        State.mapPoints[i] = {
          id: id,
          username: username,
          title: title,
          lat: lat,
          lng: lng,
          desc: desc,
        };
      }
    }
    savePoints();
    refreshMapPointsTable();
    showContent("mapPoints");
  } else {
    var nid = nextPointId();
    State.mapPoints.push({
      id: nid,
      username: username,
      title: title,
      lat: lat,
      lng: lng,
      desc: desc,
    });
    savePoints();
    refreshMapPointsTable();
    clearMapPointForm();
    showMessage("Map point added.", "mapPoints");
  }
}
export function openMapPointDetails(id) {
  var p = null;
  for (var i = 0; i < State.mapPoints.length; i++) {
    if (Number(State.mapPoints[i].id) === Number(id)) p = State.mapPoints[i];
  }
  if (!p) return;
  setVal("mpd-id", p.id);
  setText("mpd-title", p.title || "");
  setText("mpd-username", p.username || "");
  setText("mpd-lat", "" + p.lat);
  setText("mpd-lng", "" + p.lng);
  setText("mpd-desc", p.desc || "");
  showContent("mapPointDetails");
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
export function deleteMapPointFromDetails() {
  var id = Number(getVal("mpd-id"));
  State.mapPoints = State.mapPoints.filter(function (x) {
    return Number(x.id) !== id;
  });
  savePoints();
  refreshMapPointsTable();
  showContent("mapPoints");
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
}
export function applySettings() {
  State.settings = {
    theme: getVal("set-theme"),
    font: getVal("set-font") || Config.Constants.FontSize.Medium,
  };
  save(Config.LS.settings, State.settings);
  applyThemeFont();
  showMessage("Settings applied.", Config.Constants.ContentSection.Settings);
}
export function resetAll() {
  localStorage.clear();
  location.reload();
}

/* ===== Command rendering ===== */
function on_before_command_added(target_menu, cmd) {
  // This function is called before adding a command to a menu
  // It can modify visibility/enabled state based on current State
  // Returns the HTML element if it should be added, or null to skip it
  
  if (!cmd || cmd.visible === false) return null;
  
  // If no user is logged in, only show specific commands
  if (!State.currentUser) {
    // Allow: Show Login, Show About, and all login page bottom commands
    var allowedCommands = [
      Config.Constants.CommandName.ShowLogin,
      Config.Constants.CommandName.ShowAbout,
      Config.Constants.CommandName.LoginOk,
      Config.Constants.CommandName.LoginCancel
    ];
    
    if (allowedCommands.indexOf(cmd.name) === -1) {
      return null; // Skip all other commands when not logged in
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
  setSectionVisible(Config.Constants.ElementId.MenuTop, topHas);
  setSectionVisible(Config.Constants.ElementId.MenuBottom, bottomHas);
  setCollapsed(Config.Constants.ElementId.MenuTop, false);
  setCollapsed(Config.Constants.ElementId.MenuBottom, false);
}
function renderMenusFor(contentId) {
  clearMenuBars();
  if (contentId && Config.Commands.LIST[contentId]) {
    var cmds = Config.Commands.LIST[contentId];
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
          // Call on_before_command_added to get the HTML element
          var btnElement = on_before_command_added(hostId, c);
          if (btnElement) {
            host.appendChild(btnElement);
          }
        }
      }
    }
  } else {
    // No content visible -> default top menu commands
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

/* ===== Init ===== */
function loadAll() {
  // users = load(Config.LS.users, null);
  // if (!users || users.length === 0) {
  //   users = typeof SAMPLE_USERS !== "undefined" ? SAMPLE_USERS.slice() : [];
  //   save(Config.LS.users, users);
  // }

  State.users = syncArrayWithTemplate(
    Config.LS.users,
    typeof SAMPLE_USERS !== "undefined" ? SAMPLE_USERS : []
  );

  // State.mapPoints = load(Config.LS.points, null);
  // if (!State.mapPoints || State.mapPoints.length === 0) {
  //   State.mapPoints =
  //     typeof SAMPLE_POINTS !== "undefined" ? SAMPLE_POINTS.slice() : [];
  //   save(Config.LS.points, State.mapPoints);
  // }
  State.mapPoints = syncArrayWithTemplate(
    Config.LS.points,
    typeof SAMPLE_POINTS !== "undefined" ? SAMPLE_POINTS : []
  );

  State.currentUser = load(Config.LS.currentUser, null);
  State.settings = load(Config.LS.settings, { theme: Config.Constants.Theme.Light, font: Config.Constants.FontSize.Medium });
  applyThemeFont();

  // Initially, no content -> default menu commands
  for (var i = 0; i < Config.CONTENT_SECTIONS.length; i++)
    setSectionVisible(Config.CONTENT_SECTIONS[i], false);
  renderMenusFor(null);

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
  $(Config.Constants.ElementId.RegisterHeader).addEventListener("click", function () {
    toggleCollapse(Config.Constants.ContentSection.Register);
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
}

/* ===== Start ===== */
window.addEventListener("load", loadAll);
