// js/modules/data.js
import { state, ensureState } from "./state.js";

export function exportData() {
  const blob = new Blob(
    [JSON.stringify(state, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "collection.json";
  a.click();
}

export function importData(json) {
  try {
    const data = ensureState(JSON.parse(json));
    localStorage.setItem("app_state", JSON.stringify(data));
    location.reload();
  } catch {
    alert("Ungültige Datei");
  }
}

