import { load } from "./core/storage.js";
import { initModal } from "./core/modal.js";
import { renderCollections, openNewCollection } from "./features/collections.js";
import { renderItems, openNewItem } from "./features/items.js";
import { exportBackup, importBackup } from "./features/importExport.js";
import { state } from "./core/state.js";

document.addEventListener("DOMContentLoaded", () => {
  load();
  initModal();
  window.state = state;

  const collectionsView = document.getElementById("collectionsView");
  const itemsView = document.getElementById("itemsView");

  window.showCollectionsView = () => {
    collectionsView.classList.remove("hidden");
    itemsView.classList.add("hidden");
    renderCollections();
  };

  window.showItemsView = () => {
    collectionsView.classList.add("hidden");
    itemsView.classList.remove("hidden");
    renderItems();
  };

  /* =========================
     BUTTONS
  ========================= */

  const newCollectionBtn = document.getElementById("newCollectionBtn");
  const newItemBtn = document.getElementById("newItemBtn");
  const backBtn = document.getElementById("backToCollections");

  if (newCollectionBtn) newCollectionBtn.onclick = openNewCollection;

  // ✅ WICHTIG: Handler setzen, NICHT Funktion sofort ausführen
  if (newItemBtn) newItemBtn.onclick = () => openNewItem();

  if (backBtn) backBtn.onclick = window.showCollectionsView;

  /* =========================
     IMPORT / EXPORT
  ========================= */

  const exportBtn = document.getElementById("exportBtn");
  const importBtn = document.getElementById("importBtn");
  const importInput = document.getElementById("importInput");

  if (exportBtn) exportBtn.onclick = exportBackup;

  if (importBtn && importInput) {
    importBtn.onclick = () => importInput.click();
    importInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) importBackup(file);
    };
  }

  /* =========================
     THEME TOGGLE
  ========================= */

  const themeBtn = document.getElementById("navSettings");
  const savedTheme = localStorage.getItem("sebrain_theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  if (themeBtn) {
    themeBtn.onclick = () => {
      document.body.classList.toggle("light");
      localStorage.setItem(
        "sebrain_theme",
        document.body.classList.contains("light") ? "light" : "dark"
      );
    };
  }

  /* =========================
     ACCENT COLOR PICKER
  ========================= */

  const accentPicker = document.getElementById("accentPicker");
  const savedAccent = localStorage.getItem("sebrain_accent");

  if (savedAccent) {
    document.documentElement.style.setProperty("--accent", savedAccent);
    if (accentPicker) accentPicker.value = savedAccent;
  }

  if (accentPicker) {
    accentPicker.oninput = (e) => {
      const color = e.target.value;
      document.documentElement.style.setProperty("--accent", color);
      localStorage.setItem("sebrain_accent", color);
    };
  }

  /* =========================
     RESET STORAGE BUTTON
  ========================= */

  const resetBtn = document.getElementById("resetStorageBtn");

  if (resetBtn) {
    resetBtn.onclick = () => {
      if (!confirm("ACHTUNG!\nAlle Daten werden gelöscht.\nFortfahren?")) return;
      localStorage.clear();
      location.reload();
    };
  }

  window.showCollectionsView();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
