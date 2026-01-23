// js/modules/state/index.js

/*
 * Application state management module
 *
 * This module centralises the state used across the application and
 * exposes helper functions for loading, saving and initialising
 * that state.
 */

export const uiState = {
  editMode: false
};

function loadState() {
  try {
    const raw = localStorage.getItem("app_state");
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn("Failed to parse persisted state", err);
    return {};
  }
}

function ensureState(data) {
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

export function save() {
  try {
    localStorage.setItem("app_state", JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save application state", err);
  }
}

export { ensureState };
