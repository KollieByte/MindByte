// Navigation helpers
//
// This module centralises screen transitions within the application.  It
// updates the global `state` according to the requested destination and
// persists the result before re-rendering the UI.  Consumers should
// always call these functions instead of mutating `state.screen`
// directly so that all side effects (such as saving and rendering) are
// consistently applied.

import { state, save } from './state/index.js';
import { render } from './rendering/index.js';

/**
 * Navigate to a new screen.  Depending on the target screen the
 * accompanying payload is interpreted as the active application or
 * group identifier.  This function also creates missing collections on
 * demand to ensure the UI can render safely.
 *
 * @param {string} screen The logical screen to display (home, apps, groups)
 * @param {number|string|null} payload Optional identifier used by apps
 * and groups screens
 */
export function navigate(screen, payload = null) {
  state.screen = screen;

  if (screen === 'apps') {
    // Set the current app context and ensure its group list exists
    state.activeApp = payload;
    state.activeGroup = null;
    if (!state.groups[payload]) state.groups[payload] = [];
  }

  if (screen === 'groups') {
    // Set the current group context and ensure its item list exists
    state.activeGroup = payload;
    if (!state.items[payload]) state.items[payload] = [];
  }

  save();
  render();
}

/**
 * Navigate back one level in the hierarchy.  When invoked from the
 * groups screen it returns to the apps screen; when invoked from the
 * apps screen it returns to the home screen.
 */
export function goBack() {
  if (state.screen === 'groups') {
    state.screen = 'apps';
    state.activeGroup = null;
  } else if (state.screen === 'apps') {
    state.screen = 'home';
    state.activeApp = null;
  }
  save();
  render();
}