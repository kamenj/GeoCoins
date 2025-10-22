import { SAMPLE_USERS, SAMPLE_POINTS } from "./data.js";
import { syncArrayWithTemplate } from "./dataUtils.js";

const Config = {
  LS: {
  users: "app.users",
  points: "app.mapPoints",
  currentUser: "app.currentUser",
  settings: "app.settings",
},
  CONTENT_SECTIONS: [
  "login",
  "register",
  "usersList",
  "userDetails",
  "message",
  "mapPoints",
  "mapPointDetails",
  "settings",
  "about",
],
};

const State = {
  currentContentId: null,
  message_BefireDisplayContentID: null,
  users: [],
};


/* ===== Globals & Helpers ===== */


var mapPoints = [],
  currentUser = null,
  settings = { theme: "light", font: "medium" };

/* ===== v3: Message navigation intent (same as v1) ===== */
var afterMessageShowId = null; // target section to show after closing the message

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
  if (collapsed) el.classList.add("collapsed");
  else el.classList.remove("collapsed");
  updateChevron(id);
}
export function toggleCollapse(id) {
  var el = $(id);
  if (!el) return;
  setCollapsed(id, !el.classList.contains("collapsed"));
}
export function updateChevron(id) {
  var chev = $("chev-" + id),
    el = $(id);
  if (!chev || !el) return;
  chev.textContent =
    el.style.display !== "none"
      ? el.classList.contains("collapsed")
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
  afterMessageShowId = showAfterId || null;
  //save(Config.LS.messagePrev, uiVisible.slice(0));

  setText("message-text", text);
  hideAllContent();
  // Hide everything, show only the message section
  showContent("message"); //  setSectionVisible("message", true);
}

function closeMessage() {
  // Hide the message
  setSectionVisible("message", false);

  // If a target was specified → navigate there.
  // Otherwise restore the previously visible sections.
  // var prev = load(Config.LS.messagePrev, ["menu", "login"]);
  if (afterMessageShowId) {
    showContent(afterMessageShowId);
  } else {
    if (State.message_BefireDisplayContentID) {
      showContent(State.message_BefireDisplayContentID);
    }
  }

  // Reset intent
  afterMessageShowId = null;
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
    renderCommandHTML({ payload: u.username }, "users.deleteRow"),
    renderCommandHTML({ payload: u.username }, "users.editRow"),
  ].join(" ");
  var html = `
    <tr>
      <td>${i + 1}</td>
      <td><button class="link-btn" data-open-user="${u.username}">${
    u.username
  }</button></td>
      <td>${u.name || ""}</td>
      <td>${u.role || ""}</td>
      <td>${actionsHTML}</td>
    </tr>`;

  return html;
}
export function refreshUsersTable() {
  var tbody = $("users-tbody"),
    table = $("users-table"),
    empty = $("users-empty");
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
  if (currentUser === oldU) currentUser = newU;
  refreshUsersTable();
  showContent("usersList");
}
export function deleteUser() {
  var username = getVal("ud-username-old");
  if (!username) return;
  removeUserByUsername(username);
  if (currentUser === username) currentUser = null;
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
    currentUser = found.username;
    save(Config.LS.currentUser, currentUser);
    showMessage("Login successful. Welcome, " + currentUser + "!", "usersList");
  } else {
    showMessage("Login failed. Wrong username or password.", "login");
  }
}
export function logout() {
  currentUser = null;
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
  for (var i = 0; i < mapPoints.length; i++) {
    var n = Number(mapPoints[i].id);
    if (isFinite(n) && n > max) max = n;
  }
  return max + 1;
}
function savePoints() {
  save(Config.LS.points, mapPoints);
}
function renderPointsRow(p, i) {
  var actionsHTML = [
    renderCommandHTML({ payload: p.id }, "points.deleteRow"),
    renderCommandHTML({ payload: p.id }, "points.editRow"),
  ].join(" ");
  var html = `
    <tr>
      <td>${i + 1}</td>
      <td><button class="link-btn" data-open-point="${p.id}">${
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
  var tbody = $("mps-tbody"),
    table = $("mps-table"),
    empty = $("mps-empty");
  tbody.innerHTML = "";
  if (mapPoints.length === 0) {
    table.style.display = "none";
    empty.style.display = "block";
    return;
  }
  table.style.display = "table";
  empty.style.display = "none";
  var rows = [];
  for (var i = 0; i < mapPoints.length; i++) {
    rows.push(renderPointsRow(mapPoints[i], i));
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
    for (var i = 0; i < mapPoints.length; i++) {
      if (mapPoints[i].id === id) {
        mapPoints[i] = {
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
    mapPoints.push({
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
  for (var i = 0; i < mapPoints.length; i++) {
    if (Number(mapPoints[i].id) === Number(id)) p = mapPoints[i];
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
  for (var i = 0; i < mapPoints.length; i++) {
    if (Number(mapPoints[i].id) === id) p = mapPoints[i];
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
  mapPoints = mapPoints.filter(function (x) {
    return Number(x.id) !== id;
  });
  savePoints();
  refreshMapPointsTable();
  showContent("mapPoints");
}

/* ===== Settings ===== */
export function applyThemeFont() {
  document.body.setAttribute("data-theme", settings.theme || "light");
  document.body.setAttribute("data-font", settings.font || "medium");
}
export function openSettings() {
  showContent("settings");
  setVal("set-theme", settings.theme || "light");
  setVal("set-font", settings.font || "medium");
}
export function applySettings() {
  settings = {
    theme: getVal("set-theme"),
    font: getVal("set-font") || "medium",
  };
  save(Config.LS.settings, settings);
  applyThemeFont();
  showMessage("Settings applied.", "settings");
}
export function resetAll() {
  localStorage.clear();
  location.reload();
}

/* ===== Commands model ===== */
var COMMANDS = {
  login: [
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
  register: [
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
  usersList: [
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
  userDetails: [
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
  message: [
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
  mapPoints: [
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
        mapPoints = mapPoints.filter(function (p) {
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
  mapPointDetails: [
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
  settings: [
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
  about: [
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
};

var DEFAULT_MENU_TOP_COMMANDS = [
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
];

/* ===== Command rendering ===== */
function createMenuButton(cmd) {
  var btn = document.createElement("button");
  btn.className = "cmd-btn";
  btn.textContent = cmd.caption || cmd.name || "(cmd)";
  if (cmd.enabled === false) btn.disabled = true;
  btn.addEventListener("click", function () {
    if (cmd.enabled === false) return;
    cmd.action();
  });
  return btn;
}
function clearMenuBars() {
  var ids = [
    "menuTop-title-commands",
    "menuTop-top-commands",
    "menuTop-bottom-commands",
    "menuBottom-title-commands",
    "menuBottom-top-commands",
    "menuBottom-bottom-commands",
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
    hasAnyChild("menuTop-title-commands") ||
    hasAnyChild("menuTop-top-commands") ||
    hasAnyChild("menuTop-bottom-commands");
  var bottomHas =
    hasAnyChild("menuBottom-title-commands") ||
    hasAnyChild("menuBottom-top-commands") ||
    hasAnyChild("menuBottom-bottom-commands");
  setSectionVisible("menuTop", topHas);
  setSectionVisible("menuBottom", bottomHas);
  setCollapsed("menuTop", false);
  setCollapsed("menuBottom", false);
}
function renderMenusFor(contentId) {
  clearMenuBars();
  if (contentId && COMMANDS[contentId]) {
    var cmds = COMMANDS[contentId];
    for (var i = 0; i < cmds.length; i++) {
      var c = cmds[i];
      if (c.visible === false) continue;
      var loc =
        c.menu && c.menu.location ? c.menu.location : "menu.bottom.title";
      var hostId =
        loc === "menu.top.title"
          ? "menuTop-title-commands"
          : loc === "menu.top.top"
          ? "menuTop-top-commands"
          : loc === "menu.top.bottom"
          ? "menuTop-bottom-commands"
          : loc === "menu.bottom.title"
          ? "menuBottom-title-commands"
          : loc === "menu.bottom.top"
          ? "menuBottom-top-commands"
          : loc === "menu.bottom.bottom"
          ? "menuBottom-bottom-commands"
          : null;
      if (hostId) {
        var host = $(hostId);
        if (host) {
          host.appendChild(createMenuButton(c));
        }
      }
    }
  } else {
    // No content visible -> default top menu commands
    for (var j = 0; j < DEFAULT_MENU_TOP_COMMANDS.length; j++) {
      var cmd = DEFAULT_MENU_TOP_COMMANDS[j];
      var host = $("menuTop-top-commands");
      if (host) {
        host.appendChild(createMenuButton(cmd));
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
  return `<button class="cmd" data-cmd="${cmdName}" data-payload="${payload}">${label}</button>`;
}
function findCommandByName(name) {
  var keys = Object.keys(COMMANDS);
  for (var i = 0; i < keys.length; i++) {
    var arr = COMMANDS[keys[i]];
    for (var j = 0; j < arr.length; j++) {
      if (arr[j].name === name) return arr[j];
    }
  }
  return null;
}
function executeCommandByName(name, payload) {
  var cmd = findCommandByName(name);
  if (!cmd || cmd.enabled === false) return;
  if (name.indexOf("users.") === 0) {
    cmd.action(payload);
    return;
  }
  if (name.indexOf("points.") === 0) {
    cmd.action(payload);
    return;
  }
  cmd.action();
}

/* ===== Delegates, headers ===== */
function bindListDelegates() {
  var uBody = $("users-tbody");
  if (uBody) {
    uBody.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains("link-btn")) {
        var username = t.getAttribute("data-open-user");
        openUserDetails(username);
        return;
      }
      if (t && t.classList && t.classList.contains("cmd")) {
        executeCommandByName(
          t.getAttribute("data-cmd"),
          t.getAttribute("data-payload")
        );
      }
    });
  }
  var pBody = $("mps-tbody");
  if (pBody) {
    pBody.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains("link-btn")) {
        var id = t.getAttribute("data-open-point");
        openMapPointDetails(Number(id));
        return;
      }
      if (t && t.classList && t.classList.contains("cmd")) {
        executeCommandByName(
          t.getAttribute("data-cmd"),
          t.getAttribute("data-payload")
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

  // mapPoints = load(Config.LS.points, null);
  // if (!mapPoints || mapPoints.length === 0) {
  //   mapPoints =
  //     typeof SAMPLE_POINTS !== "undefined" ? SAMPLE_POINTS.slice() : [];
  //   save(Config.LS.points, mapPoints);
  // }
  mapPoints = syncArrayWithTemplate(
    Config.LS.points,
    typeof SAMPLE_POINTS !== "undefined" ? SAMPLE_POINTS : []
  );

  currentUser = load(Config.LS.currentUser, null);
  settings = load(Config.LS.settings, { theme: "light", font: "medium" });
  applyThemeFont();

  // Initially, no content -> default menu commands
  for (var i = 0; i < Config.CONTENT_SECTIONS.length; i++)
    setSectionVisible(Config.CONTENT_SECTIONS[i], false);
  renderMenusFor(null);

  // Collapse toggles
  $("menuTop-header").addEventListener("click", function () {
    toggleCollapse("menuTop");
  });
  $("menuBottom-header").addEventListener("click", function () {
    toggleCollapse("menuBottom");
  });
  $("login-header").addEventListener("click", function () {
    toggleCollapse("login");
  });
  $("register-header").addEventListener("click", function () {
    toggleCollapse("register");
  });
  $("usersList-header").addEventListener("click", function () {
    toggleCollapse("usersList");
  });
  $("userDetails-header").addEventListener("click", function () {
    toggleCollapse("userDetails");
  });
  $("message-header").addEventListener("click", function () {
    toggleCollapse("message");
  });
  $("mapPoints-header").addEventListener("click", function () {
    toggleCollapse("mapPoints");
  });
  $("mapPointDetails-header").addEventListener("click", function () {
    toggleCollapse("mapPointDetails");
  });
  $("settings-header").addEventListener("click", function () {
    toggleCollapse("settings");
  });
  $("about-header").addEventListener("click", function () {
    toggleCollapse("about");
  });

  // Delegates for list row actions
  bindListDelegates();

  // First render of tables
  refreshUsersTable();
  refreshMapPointsTable();
}

/* ===== Start ===== */
window.addEventListener("load", loadAll);
