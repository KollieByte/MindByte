import { state } from "../core/state.js";
import { renderCollections, newCollection } from "../features/collections.js";
import { openNewItem } from "../features/items.js";
import { openSettings } from "./settings.js";

console.log("NAVBAR IMPORT", openSettings);

const settingsBtn = document.getElementById("navSettings");
if (settingsBtn) {
  settingsBtn.onclick = openSettings;
}

export function setupNavbar() {
  const navBack = document.getElementById("navBack");
  const navAddCollection = document.getElementById("navAddCollection");
  const navAddItem = document.getElementById("navAddItem");

  if (navBack) {
    navBack.onclick = () => {
      state.activeCollection = null;
      renderCollections();
      updateNavbar();
    };
  }

  if (navAddCollection) {
    navAddCollection.onclick = newCollection;
  }

  if (navAddItem) {
    navAddItem.onclick = openNewItem;
  }
}

export function updateNavbar() {
  const navBack = document.getElementById("navBack");
  const navAddCollection = document.getElementById("navAddCollection");
  const navAddItem = document.getElementById("navAddItem");

  const hasCollection = !!state.activeCollection;

  if (navBack) {
    navBack.classList.toggle("hidden", !hasCollection);
  }

  if (navAddItem) {
    navAddItem.classList.toggle("hidden", !hasCollection);
  }

  if (navAddCollection) {
    navAddCollection.classList.toggle("hidden", hasCollection);
  }
}
