import { state, saveState } from "../state.js";
import { createNameModal } from "../nameModal.js";
import { createItem } from "../itemDetail/createItem.js";
import { openItemDetail } from "../itemDetail/index.js";
import { enableDnD } from "./enableDnD.js";
import { navigate } from "../navigation.js";

export function renderGroups(root) {
  const addItem = document.createElement("button");
  addItem.textContent = "➕ Item";
  addItem.onclick = () =>
  createNameModal("Neues Item", name => {
    state.items[state.activeGroup].push(createItem(name));
    saveState(state);
    navigate("groups", state.activeGroup);
  });

      

  const addSection = document.createElement("button");
  addSection.textContent = "➕ Abschnitt";
  addSection.onclick = () =>
    createNameModal("Neuer Abschnitt", name => {
      state.items[state.activeGroup].push({
        id: crypto.randomUUID(),
        type: "section",
        name
      });
      saveState(state);
      navigate("groups", state.activeGroup);
    });

  const grid = document.createElement("div");
  grid.className = "tile-grid item-grid";

  state.items[state.activeGroup].forEach(entry => {
    if (entry.type === "section") {
      const s = document.createElement("div");
      s.className = "tile-section";
      s.textContent = entry.name;
      enableDnD(s, entry.id);
      grid.appendChild(s);
      return;
    }

    const tile = document.createElement("div");
tile.className = "tile item-tile editable";
tile.dataset.type = "item";

const media = document.createElement("div");
media.className = "tile-media";

if (entry.images?.obverse) {
  const obv = document.createElement("img");
  obv.src = entry.images.obverse;
  obv.className = "coin-bottom";
  media.appendChild(obv);
}

if (entry.images?.reverse) {
  const rev = document.createElement("img");
  rev.src = entry.images.reverse;
  rev.className = "coin-top";
  media.appendChild(rev);
}

const title = document.createElement("div");
title.className = "tile-title item-title";
title.textContent = entry.name;

tile.append(media, title);
tile.onclick = () => openItemDetail(entry);

enableDnD(tile, entry.id);
grid.appendChild(tile);

  });

  root.append(addItem, addSection, grid);
}



