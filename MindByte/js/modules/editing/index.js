// js/modules/editing/index.js

import { uiState, state, save } from '../state/index.js';
import { render } from '../rendering/index.js';

export function addEditingHandlers() {
  document.addEventListener(
    'click',
    e => {
      if (!uiState.editMode) return;

      const editable = e.target.closest('.editable');
      if (!editable) return;

      e.preventDefault();
      e.stopPropagation();

      // Titel-Element bestimmen
      const titleEl =
        editable.querySelector('.tile-title') ||
        editable.querySelector('.item-title') ||
        editable;

      // Schon im Edit? Dann nichts tun
      if (titleEl.isContentEditable) return;

      const oldName = titleEl.textContent.trim();
      const id = editable.dataset.id;
      if (!id) return;

      // Inline-Edit aktivieren
      titleEl.contentEditable = 'true';
      titleEl.focus();

      // Cursor ans Ende
      document.getSelection().collapse(titleEl, 1);

      function finish(saveChange) {
        titleEl.contentEditable = 'false';

        const newName = titleEl.textContent.trim();

        if (saveChange && newName && newName !== oldName) {
          updateStateName(id, newName);
          save();
        } else {
          titleEl.textContent = oldName;
        }

        render();
        cleanup();
      }

      function onKey(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          finish(true);
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          finish(false);
        }
      }

      function onBlur() {
        finish(true);
      }

      function cleanup() {
        titleEl.removeEventListener('keydown', onKey);
        titleEl.removeEventListener('blur', onBlur);
      }

      titleEl.addEventListener('keydown', onKey);
      titleEl.addEventListener('blur', onBlur);
    },
    true
  );

  /* =========================
     DELETE (RIGHT CLICK)
     ========================= */
  document.addEventListener('contextmenu', e => {
    if (!uiState.editMode) return;

    const editable = e.target.closest('.editable');
    if (!editable) return;

    e.preventDefault();

    if (!confirm('Element wirklich löschen?')) return;

    const id = editable.dataset.id;
    if (!id) return;

    state.apps = state.apps.filter(a => String(a.id) !== String(id));

    for (const key in state.groups) {
      state.groups[key] = state.groups[key].filter(
        g => String(g.id) !== String(id)
      );
    }

    for (const key in state.items) {
      state.items[key] = state.items[key].filter(
        it => String(it.id) !== String(id)
      );
    }

    save();
    render();
  });
}

/* =========================
   STATE UPDATE HELPER
   ========================= */
function updateStateName(id, name) {
  for (const app of state.apps) {
    if (String(app.id) === String(id)) app.name = name;
  }

  for (const groups of Object.values(state.groups)) {
    for (const g of groups) {
      if (String(g.id) === String(id)) g.name = name;
    }
  }

  for (const items of Object.values(state.items)) {
    for (const it of items) {
      if (String(it.id) === String(id)) it.name = name;
    }
  }
}
