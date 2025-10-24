import { load, save } from "./app.js";

// https://chatgpt.com/share/68d81a52-34c4-8010-908d-2158d98fa6a3
// https://chatgpt.com/c/68d812a2-f870-832f-aaf8-2eebe121265d

function deepClone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    return obj;
  }
}

function buildTemplateDefaults(templateArray) {
  // For each key present in ANY template item, pick the first non-undefined value as default
  var defaults = {};
  if (!Array.isArray(templateArray)) return defaults;
  for (var i = 0; i < templateArray.length; i++) {
    var t = templateArray[i] || {};
    for (var k in t) {
      if (!Object.prototype.hasOwnProperty.call(defaults, k)) {
        defaults[k] = t[k];
      }
    }
  }
  return defaults;
}

export function syncArrayWithTemplate(storageKey, templateArray) {
  // Load what we have
  var stored = load(storageKey, null);

  // If nothing stored yet → seed from template
  if (!Array.isArray(stored) || stored.length === 0) {
    var seeded = deepClone(Array.isArray(templateArray) ? templateArray : []);
    save(storageKey, seeded);
    return seeded;
  }

  // If template is empty or invalid, keep stored as-is
  if (!Array.isArray(templateArray) || templateArray.length === 0) {
    return stored;
  }

  // Build defaults and allowed keys from template
  var defaults = buildTemplateDefaults(templateArray);
  var allowedKeys = Object.keys(defaults);

  // Rebuild each stored item so it:
  //  - includes only keys from template (removes old/unknown keys)
  //  - adds any missing new keys using template defaults
  var synced = [];
  for (var i = 0; i < stored.length; i++) {
    var src = stored[i] || {};
    var out = {};
    for (var j = 0; j < allowedKeys.length; j++) {
      var key = allowedKeys[j];
      if (Object.prototype.hasOwnProperty.call(src, key)) {
        out[key] = src[key];
      } else {
        out[key] = defaults[key]; // add new field with template default
      }
    }
    synced.push(out);
  }

  save(storageKey, synced);
  return synced;
}
