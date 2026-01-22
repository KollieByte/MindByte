// js/modules/editing.js
import { uiState } from "./state.js";

export function initEditing() {
  document.addEventListener("click", e => {
    if (!uiState.editMode) return;

    const editable = e.target.closest(".editable");
    if (!editable) return;

    const titleEl = editable.querySelector(".item-title");
    if (!titleEl) return;

    e.preventDefault();
    const name = prompt("Neuer Name:", titleEl.textContent);
    if (name?.trim()) titleEl.textContent = name.trim();
  });

  document.addEventListener("contextmenu", e => {
    if (!uiState.editMode) return;

    const editable = e.target.closest(".editable");
    if (!editable) return;

    e.preventDefault();
    if (confirm("Element wirklich löschen?")) {
      editable.remove();
    }
  });
}

