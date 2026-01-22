import { state, saveState } from "../state.js";
import { navigate } from "../navigation.js";
import { closeModal } from "../../ui/modal.js";
import { createItem } from "./createItem.js";

export function buildActions(item) {
  const actions = document.createElement("div");
  actions.className = "item-actions";

  const duplicate = document.createElement("button");
  duplicate.textContent = "Duplizieren";
  duplicate.onclick = () => {
    const copy = structuredClone(item);
    copy.id = crypto.randomUUID();
    copy.name += " (Kopie)";
    state.items[state.activeGroup].push(copy);
    saveState(state);
    closeModal();
    navigate("groups", state.activeGroup);
  };

  const del = document.createElement("button");
  del.textContent = "Löschen";
  del.className = "danger";
  del.onclick = () => {
    if (!confirm("Item wirklich löschen?")) return;
    state.items[state.activeGroup] =
      state.items[state.activeGroup].filter(i => i.id !== item.id);
    saveState(state);
    closeModal();
    navigate("groups", state.activeGroup);
  };

  actions.append(duplicate, del);
  return actions;
}
