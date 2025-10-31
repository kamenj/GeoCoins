/* ===== Keys & Globals ===== */
var LS = {
  users: "app.users",
  points: "app.mapPoints",
  currentUser: "app.currentUser",
  uiVisible: "app.ui.visible",
  uiCollapsed: "app.ui.collapsed",
  settings: "app.settings",
  messagePrev: "app.message.prev",
};

var SECTIONS = [
  "menu",
  "login",
  "register",
  "usersList",
  "userDetails",
  "message",
  "mapPoints",
  "mapPointDetails",
  "settings",
  "about",
];

var users = [];
var mapPoints = [];
var currentUser = null;
var uiVisible = [];
var uiCollapsed = {};
var settings = { theme: "light", font: "medium" };
var afterMessageShowId = [];

/* ===== DOM Helpers ===== */
function $(id) {
  return document.getElementById(id);
}
function setText(id, txt) {
  var el = $(id);
  if (el) el.textContent = txt;
}
function setVal(id, val) {
  var el = $(id);
  if (el) el.value = val;
}
function getVal(id) {
  var el = $(id);
  return el ? el.value.trim() : "";
}

/* ===== Storage Helpers ===== */
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function load(key, def) {
  try {
    var v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch (e) {
    return def;
  }
}

/* ===== Visibility & Collapse ===== */
function setSectionVisible(id, visible) {
  var el = $(id);
  if (!el) return;
  el.style.display = visible ? "block" : "none";

  if (visible && uiVisible.indexOf(id) === -1) uiVisible.push(id);
  if (!visible)
    uiVisible = uiVisible.filter(function (x) {
      return x !== id;
    });
  save(LS.uiVisible, uiVisible);

  updateChevron(id);
}
function showOnly(id) {
  SECTIONS.forEach(function (s) {
    setSectionVisible(s, s === id);
  });
}
function toggleVisibility(id) {
  var el = $(id);
  var nowVisible = el && el.style.display !== "none";
  setSectionVisible(id, !nowVisible);
}
function setCollapsed(id, collapsed) {
  var el = $(id);
  if (!el) return;
  if (collapsed) el.classList.add("collapsed");
  else el.classList.remove("collapsed");
  uiCollapsed[id] = !!collapsed;
  save(LS.uiCollapsed, uiCollapsed);
  updateChevron(id);
}
function toggleCollapse(id) {
  var el = $(id);
  if (!el) return;
  var isCollapsed = el.classList.contains("collapsed");
  setCollapsed(id, !isCollapsed);
}
function updateChevron(id) {
  var chev = $("chev-" + id);
  var el = $(id);
  if (!chev || !el) return;
  var isCollapsed = el.classList.contains("collapsed");
  var isVisible = el.style.display !== "none";
  chev.textContent = isVisible ? (isCollapsed ? "►" : "▼") : "";
}

/* ===== Message Overlay ===== */
function showMessage(text, showAfterId) {
  if (showAfterId) {
    if (Array.isArray(showAfterId)) {
      afterMessageShowId = showAfterId;
    } else {
      afterMessageShowId = [showAfterId];
    }
  } else {
    afterMessageShowId = [];
  }
  save(LS.messagePrev, uiVisible);
  setText("message-text", text);

  SECTIONS.forEach(function (id) {
    setSectionVisible(id, false);
  });
  setSectionVisible("message", true);
}

function closeMessage() {
  setSectionVisible("message", false);
  var prev = load(LS.messagePrev, ["menu", "login"]);
  if (afterMessageShowId && afterMessageShowId.length > 0) {
    SECTIONS.forEach(function (id) {
      setSectionVisible(id, afterMessageShowId.indexOf(id) !== -1);
    });
  } else {
    SECTIONS.forEach(function (id) {
      setSectionVisible(id, prev.indexOf(id) !== -1);
    });
  }
  afterMessageShowId = [];
}

/* ===== Users ===== */
function addUser(u) {
  users.push(u);
  save(LS.users, users);
}
function removeUserByUsername(username) {
  users = users.filter(function (u) {
    return u.username !== username;
  });
  save(LS.users, users);
}
function findUser(username) {
  return (
    users.find(function (u) {
      return u.username === username;
    }) || null
  );
}
function updateWelcome() {
  setText("welcome", currentUser ? "Welcome, " + currentUser : "Not logged in");
}
function renderUsersRow(u, i, selectUsername) {
  var tr = document.createElement("tr");

  // # column
  var tdIndex = document.createElement("td");
  tdIndex.textContent = i + 1;
  tr.appendChild(tdIndex);

  // username column with button
  var tdUser = document.createElement("td");
  var btn = document.createElement("button");
  btn.textContent = u.username;
  btn.addEventListener("click", function () {
    openUserDetails(u.username);
  });
  tdUser.appendChild(btn);
  tr.appendChild(tdUser);

  // name column
  var tdName = document.createElement("td");
  tdName.textContent = u.name || "";
  tr.appendChild(tdName);

  // surname column
  var tdSurname = document.createElement("td");
  tdSurname.textContent = u.surname || "";
  tr.appendChild(tdSurname);

  // highlight selected row
  if (selectUsername && u.username === selectUsername) {
    tr.classList.add("selected");
    setTimeout(function () { tr.scrollIntoView({ block: "center" }); }, 0);
  }

  return tr;
}
function refreshUsersTable(selectUsername) {
  var tbody = $("users-tbody");
  var table = $("users-table");
  var empty = $("users-empty");
  tbody.innerHTML = "";
  if (users.length === 0) {
    table.style.display = "none";
    empty.style.display = "block";
    return;
  }
  table.style.display = "table";
  empty.style.display = "none";
  users.forEach(function (u, i) {
    tbody.appendChild(renderUsersRow(u, i, selectUsername));
  });
}

/* ===== Auth ===== */
function handleLogin() {
  var user = getVal("login-username");
  var pass = $("login-password").value;
  var found = findUser(user);
  if (found && found.password === pass) {
    currentUser = found.username;
    save(LS.currentUser, currentUser);
    updateWelcome();
    showMessage("Login successful. Welcome, " + currentUser + "!",["usersList","menu"]);
  } else {
    showMessage("Login failed. Wrong username or password.");//, ["login","menu"]);
  }
}
function logout() {
  if (!currentUser)
    return showMessage("No user is currently logged in.", "menu");
  currentUser = null;
  save(LS.currentUser, null);
  updateWelcome();
  showMessage("You have been logged out.", "login");
}
function gotoRegister() {
  showOnly("register");
}

/* ===== Registration & User Details ===== */
function clearRegisterForm() {
  ["reg-username", "reg-password", "reg-name", "reg-surname"].forEach(function (
    id
  ) {
    setVal(id, "");
  });
  setVal("reg-gender", "");
}
function registerUser() {
  var username = getVal("reg-username");
  var password = $("reg-password").value;
  var name = getVal("reg-name");
  var surname = getVal("reg-surname");
  var gender = getVal("reg-gender");
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
  refreshUsersTable(username);
  clearRegisterForm();
  showMessage("Registration successful for: " + username, "login");
}
function cancelRegister() {
  showOnly("login");
}
function fillUserDetails(u) {
  setVal("ud-username-old", u.username);
  setVal("ud-username", u.username);
  setVal("ud-name", u.name || "");
  setVal("ud-surname", u.surname || "");
}
function openUserDetails(username) {
  var u = findUser(username);
  if (!u) return;
  fillUserDetails(u);
  setSectionVisible("usersList", false);
  setSectionVisible("userDetails", true);
}
function applyUserEdit(oldU, newU, newName, newSurname) {
  users = users.map(function (u) {
    return u.username === oldU
      ? {
          username: newU,
          password: u.password,
          name: newName,
          surname: newSurname,
          gender: u.gender,
        }
      : u;
  });
  save(LS.users, users);
}
function handleCurrentUserRename(oldU, newU) {
  if (currentUser === oldU) {
    currentUser = newU;
    save(LS.currentUser, currentUser);
    updateWelcome();
  }
}
function saveUserDetails() {
  var oldU = getVal("ud-username-old");
  var newU = getVal("ud-username");
  var newName = getVal("ud-name");
  var newSurname = getVal("ud-surname");
  if (!newU) return showMessage("Username cannot be empty.", "userDetails");
  if (oldU !== newU && findUser(newU))
    return showMessage("Username already exists.", "userDetails");
  applyUserEdit(oldU, newU, newName, newSurname);
  handleCurrentUserRename(oldU, newU);
  refreshUsersTable(newU);
  setSectionVisible("userDetails", false);
  setSectionVisible("usersList", true);
}
function deleteUser() {
  var username = getVal("ud-username-old");
  if (!username) return;
  removeUserByUsername(username);
  refreshUsersTable();
  if (currentUser === username) {
    currentUser = null;
    save(LS.currentUser, null);
    updateWelcome();
    showOnly("login");
  } else {
    setSectionVisible("userDetails", false);
    setSectionVisible("usersList", true);
  }
}

/* ===== Map Points ===== */
function nextPointId() {
  var max = -1;
  for (var i = 0; i < mapPoints.length; i++) {
    var n = Number(mapPoints[i].id);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max + 1;
}
function savePoints() {
  save(LS.points, mapPoints);
}
function clearMapPointForm() {
  ["mp-id", "mp-user-id", "mp-title", "mp-lat", "mp-lng", "mp-desc"].forEach(
    function (id) {
      setVal(id, "");
    }
  );
}
function getPointFormData() {
  return {
    idStr: getVal("mp-id"),
    user_id: getVal("mp-user-id"),
    title: getVal("mp-title"),
    lat: getVal("mp-lat"),
    lng: getVal("mp-lng"),
    desc: getVal("mp-desc"),
  };
}
function validLatLng(lat, lng) {
  return Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
}
function renderPointsRow(p, i, selectId) {
  var tr = document.createElement("tr");
  var btn = document.createElement("button");
  btn.textContent = p.title || "(no title)";
  btn.addEventListener("click", function () {
    openMapPointDetails(p.id);
  });
  var tdTitle = document.createElement("td");
  tdTitle.appendChild(btn);
  tr.innerHTML = "<td>" + (i + 1) + "</td>";
  tr.appendChild(tdTitle);
  // Lookup username from user_id
  var username = "";
  if (p.user_id) {
    var user = users.find(function(u) { return u.id === p.user_id; });
    username = user ? user.username : "User#" + p.user_id;
  }
  tr.innerHTML +=
    "<td>" +
    username +
    "</td><td>" +
    (p.lat || "") +
    "</td><td>" +
    (p.lng || "") +
    "</td>";
  if (selectId != null && Number(p.id) === Number(selectId)) {
    tr.classList.add("selected");
    setTimeout(function () {
      tr.scrollIntoView({ block: "center" });
    }, 0);
  }
  return tr;
}
function refreshMapPointsTable(selectId) {
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
  mapPoints.forEach(function (p, i) {
    tbody.appendChild(renderPointsRow(p, i, selectId));
  });
}
function clearAllMapPoints() {
  mapPoints = [];
  savePoints();
  refreshMapPointsTable();
}
function saveMapPoint() {
  var f = getPointFormData();
  if (!validLatLng(f.lat, f.lng))
    return showMessage("Latitude and Longitude must be numbers.", "mapPoints");
  var lat = Number(f.lat),
    lng = Number(f.lng);
  if (f.idStr) {
    var id = Number(f.idStr);
    mapPoints = mapPoints.map(function (p) {
      return p.id === id
        ? {
            id: id,
            user_id: Number(f.user_id) || null,
            title: f.title,
            lat: lat,
            lng: lng,
            desc: f.desc,
          }
        : p;
    });
    savePoints();
    refreshMapPointsTable(id);
    showOnly("mapPoints");
  } else {
    var nid = nextPointId();
    mapPoints.push({
      id: nid,
      user_id: Number(f.user_id) || null,
      title: f.title,
      lat: lat,
      lng: lng,
      desc: f.desc,
    });
    savePoints();
    refreshMapPointsTable(nid);
    clearMapPointForm();
    showMessage("Map point added.", "mapPoints");
  }
}
function openMapPointDetails(id) {
  var p = mapPoints.find(function (x) {
    return Number(x.id) === Number(id);
  });
  if (!p) return;
  setVal("mpd-id", p.id);
  setText("mpd-title", p.title || "");
  // Lookup username from user_id for display
  var username = "";
  if (p.user_id) {
    var user = users.find(function(u) { return u.id === p.user_id; });
    username = user ? user.username : "User#" + p.user_id;
  }
  setText("mpd-username", username);
  setVal("mpd-user-id", p.user_id || "");
  setText("mpd-user-id-display", p.user_id || "");
  setText("mpd-lat", String(p.lat));
  setText("mpd-lng", String(p.lng));
  setText("mpd-desc", p.desc || "");
  setSectionVisible("mapPointDetails", true);
}
function editMapPointFromDetails() {
  var id = Number(getVal("mpd-id"));
  var p = mapPoints.find(function (x) {
    return Number(x.id) === id;
  });
  if (!p) return;
  setVal("mp-id", p.id);
  setVal("mp-user-id", p.user_id || "");
  setVal("mp-title", p.title || "");
  setVal("mp-lat", String(p.lat));
  setVal("mp-lng", String(p.lng));
  setVal("mp-desc", p.desc || "");
  setSectionVisible("mapPoints", true);
  setSectionVisible("mapPointDetails", false);
}
function deleteMapPointFromDetails() {
  var id = Number(getVal("mpd-id"));
  mapPoints = mapPoints.filter(function (p) {
    return Number(p.id) !== id;
  });
  savePoints();
  refreshMapPointsTable();
  setSectionVisible("mapPointDetails", false);
  setSectionVisible("mapPoints", true);
}

/* ===== Settings ===== */
function applyThemeFont() {
  document.body.setAttribute("data-theme", settings.theme || "light");
  document.body.setAttribute("data-font", settings.font || "medium");
}
function openSettings() {
  showOnly("settings");
  setVal("set-theme", settings.theme || "light");
  setVal("set-font", settings.font || "medium");
}
function applySettings() {
  settings = {
    theme: getVal("set-theme"),
    font: getVal("set-font") || "medium",
  };
  save(LS.settings, settings);
  applyThemeFont();
  showMessage("Settings applied.", "menu");
}
function resetAll() {
  localStorage.clear();
  location.reload();
}

/* ===== About ===== */
function openAbout() {
  showMessage("Simple Users & Map Points app.\nAuthor: You.", "menu");
}

/* ===== Load & Init ===== */
function loadAll() {
  // load users and points from localStorage or from SAMPLE data
  users = load(LS.users, null);
  if (!users || users.length === 0) {
    users = typeof SAMPLE_USERS !== "undefined" ? SAMPLE_USERS.slice() : [];
    save(LS.users, users);
  }

  mapPoints = load(LS.points, null);
  if (!mapPoints || mapPoints.length === 0) {
    mapPoints =
      typeof SAMPLE_POINTS !== "undefined" ? SAMPLE_POINTS.slice() : [];
    save(LS.points, mapPoints);
  }

  currentUser = load(LS.currentUser, null);
  uiVisible = load(LS.uiVisible, ["menu", "login"]);
  uiCollapsed = load(LS.uiCollapsed, {});
  settings = load(LS.settings, { theme: "light", font: "medium" });

  applyThemeFont();
  SECTIONS.forEach(function (id) {
    setSectionVisible(id, uiVisible.indexOf(id) !== -1);
  });
  setSectionVisible("message", false);
  SECTIONS.forEach(function (id) {
    setCollapsed(id, !!uiCollapsed[id]);
  });
  refreshUsersTable();
  refreshMapPointsTable();
  updateWelcome();

  /* === Attach events === */
  $("menu-header").addEventListener("click", function () {
    toggleCollapse("menu");
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

  $("btn-settings").addEventListener("click", openSettings);
  $("btn-about").addEventListener("click", openAbout);
  $("btn-logout").addEventListener("click", logout);

  $("btn-login").addEventListener("click", handleLogin);
  $("btn-goto-register").addEventListener("click", gotoRegister);

  $("btn-register").addEventListener("click", registerUser);
  $("btn-cancel-register").addEventListener("click", cancelRegister);

  $("btn-save-user").addEventListener("click", saveUserDetails);
  $("btn-delete-user").addEventListener("click", deleteUser);

  $("btn-close-message").addEventListener("click", closeMessage);

  $("btn-save-point").addEventListener("click", saveMapPoint);
  $("btn-clear-point").addEventListener("click", clearMapPointForm);
  $("btn-clear-all-points").addEventListener("click", clearAllMapPoints);

  $("btn-edit-point").addEventListener("click", editMapPointFromDetails);
  $("btn-delete-point").addEventListener("click", deleteMapPointFromDetails);

  $("btn-apply-settings").addEventListener("click", applySettings);
  $("btn-reset-all").addEventListener("click", resetAll);
}

/* ===== Start ===== */
window.addEventListener("load", loadAll);
