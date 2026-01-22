import { state, saveState } from "../state.js";
import { navigate } from "../navigation.js";
import { createNameModal } from "../nameModal.js";

export function renderApps(root) {
  const add = document.createElement("button");
  add.textContent = "➕ Gruppe";
  // When creating a new group we persist the change and then re-render
  // via the navigate helper.  Invoking navigate ensures that state is
  // saved and the correct screen is drawn without requiring a direct
  // dependency on the render function, which avoids circular imports.
  add.onclick = () =>
    createNameModal("Neue Gruppe", name => {
      const id = Date.now();
      state.groups[state.activeApp].push({ id, name });
      state.items[id] = [];
      saveState(state);
      // Re-render by navigating to the current screen
      navigate("apps", state.activeApp);
    });

  const grid = document.createElement("div");
  grid.className = "tile-grid group-grid";

  state.groups[state.activeApp].forEach(g => {
    const tile = document.createElement("div");
    tile.className = "tile group-tile";
    tile.textContent = g.name;
    tile.onclick = () => navigate("groups", g.id);
    grid.appendChild(tile);
  });

  root.append(add, grid);
}

