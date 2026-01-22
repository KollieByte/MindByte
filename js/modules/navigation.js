// js/modules/navigation.js
import { state, saveState } from "./state.js";
// Import the render function from the correct module path.  The rendering
// entry point lives in the `rendering` folder under modules, and is
// exposed by `index.js`.  Using `./rendering.js` would resolve to a
// non‑existent module and break navigation.
import { render } from "./rendering/index.js";

export function navigate(screen, payload = null) {
  state.screen = screen;

  if (screen === "apps") {
    state.activeApp = payload;
    state.activeGroup = null;
    if (!state.groups[payload]) state.groups[payload] = [];
  }

  if (screen === "groups") {
    state.activeGroup = payload;
    if (!state.items[payload]) state.items[payload] = [];
  }

  saveState(state);
  render();
}

export function goBack() {
  if (state.screen === "groups") {
    state.screen = "apps";
    state.activeGroup = null;
  } else if (state.screen === "apps") {
    state.screen = "home";
    state.activeApp = null;
  }

  saveState(state);
  render();
}

