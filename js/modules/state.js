// js/modules/state.js

export const uiState = {
  editMode: false
};

export function loadState() {
  try {
    return JSON.parse(localStorage.getItem("app_state")) || {};
  } catch {
    return {};
  }
}

export function saveState(state) {
  localStorage.setItem("app_state", JSON.stringify(state));
}

export function ensureState(data) {
  if (!data || typeof data !== "object") data = {};

  if (!Array.isArray(data.apps)) data.apps = [];
  if (!data.groups) data.groups = {};
  if (!data.items) data.items = {};

  if (!data.screen) data.screen = "home";
  if (!("activeApp" in data)) data.activeApp = null;
  if (!("activeGroup" in data)) data.activeGroup = null;

  return data;
}

export const state = ensureState(loadState());

