import { state, saveState } from "../state.js";
import { navigate } from "../navigation.js";
import { createNameModal } from "../nameModal.js";

export function renderHome(root) {
  const add = document.createElement("button");
  add.textContent = "➕ App";
  add.onclick = () =>
    createNameModal("Neue App", name => {
      const id = Date.now();
      state.apps.push({ id, name });
      state.groups[id] = [];
      saveState(state);
      navigate("apps", id);
    });

  const grid = document.createElement("div");
  grid.className = "tile-grid app-grid";

  state.apps.forEach(app => {
    const tile = document.createElement("div");
    tile.className = "tile app-tile";
    tile.textContent = app.name;
    tile.onclick = () => navigate("apps", app.id);
    grid.appendChild(tile);
  });

  root.append(add, grid);
}

