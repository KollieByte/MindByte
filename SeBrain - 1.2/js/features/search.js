import { state } from "../core/state.js";
import { renderItems } from "./items.js";

let query = "";

export function setupSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.oninput = () => {
    query = input.value.toLowerCase();
    renderItemsFiltered();
  };
}

export function renderItemsFiltered() {
  const col = state.activeCollection;
  if (!col) return;

  if (!query) {
    renderItems();
    return;
  }

  const filtered = col.items.filter(item => {
    return Object.values(item).some(v =>
      String(v).toLowerCase().includes(query)
    );
  });

  renderItems(filtered);
}
