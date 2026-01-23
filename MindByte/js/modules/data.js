// Data import/export utilities
//
// This module exposes helpers for serialising the current application
// state into a downloadable JSON file and for importing an external
// collection.  By centralising these operations here the core logic
// remains decoupled from the UI layer.

import { state, ensureState } from './state/index.js';

/**
 * Trigger a download of the current state as a JSON file.  The file
 * will be named `collection.json` and pretty‑printed for readability.
 */
export function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: 'application/json',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'collection.json';
  a.click();
}

/**
 * Import an external collection from its JSON representation.  The
 * provided string is parsed and normalised before being saved to
 * localStorage; the page is then reloaded to apply the new data.
 *
 * @param {string} json The raw JSON string representing a collection
 */
export function importData(json) {
  try {
    const data = ensureState(JSON.parse(json));
    localStorage.setItem('app_state', JSON.stringify(data));
    location.reload();
  } catch {
    alert('Ungültige Datei');
  }
}