import { state, saveState } from "../state.js";
import { render } from "./index.js";

export function enableDnD(el, id) {
  el.draggable = true;

  el.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", id);
  });

  el.addEventListener("dragover", e => e.preventDefault());

  el.addEventListener("drop", e => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("text/plain");
    const list = state.items[state.activeGroup];

    const from = list.findIndex(x => x.id === draggedId);
    const to = list.findIndex(x => x.id === id);
    if (from < 0 || to < 0 || from === to) return;

    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);

    saveState(state);
    render();
  });
}

