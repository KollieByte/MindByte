// js/modules/rendering/index.js

import { state, uiState, save } from '../state/index.js';
import { navigate } from '../navigation.js';
import { createNameModal } from '../nameModal.js';
import { openItemDetail } from '../itemDetail.js';

export function render() {
  const root = document.getElementById('app');
  root.innerHTML = '';

  /* =========================
     HOME – APPS
     ========================= */
  if (state.screen === 'home') {
    const add = document.createElement('button');
    add.textContent = '➕ App';
    add.onclick = () =>
      createNameModal('Neue App', name => {
        const id = Date.now();
        state.apps.push({ id, name });
        state.groups[id] = [];
        save();
        navigate('apps', id);
      });

    const grid = document.createElement('div');
    grid.className = 'tile-grid app-grid';

    state.apps.forEach(app => {
      const tile = document.createElement('div');
      tile.className = 'tile app-tile editable';
      tile.dataset.id = app.id;

      const title = document.createElement('div');
      title.className = 'tile-title';
      title.textContent = app.name;
      title.draggable = false;

      tile.appendChild(title);

      tile.onclick = () => {
        if (uiState.editMode) return;
        navigate('apps', app.id);
      };

      grid.appendChild(tile);
    });

    root.append(add, grid);
    return;
  }

  /* =========================
     APPS – GROUPS
     ========================= */
  if (state.screen === 'apps') {
    const add = document.createElement('button');
    add.textContent = '➕ Gruppe';
    add.onclick = () =>
      createNameModal('Neue Gruppe', name => {
        const id = Date.now();
        state.groups[state.activeApp].push({ id, name });
        state.items[id] = [];
        save();
        render();
      });

    const grid = document.createElement('div');
    grid.className = 'tile-grid group-grid';

    state.groups[state.activeApp].forEach(g => {
      const tile = document.createElement('div');
      tile.className = 'tile group-tile editable';
      tile.dataset.id = g.id;

      const title = document.createElement('div');
      title.className = 'tile-title';
      title.textContent = g.name;
      title.draggable = false;

      tile.appendChild(title);

      tile.onclick = () => {
        if (uiState.editMode) return;
        navigate('groups', g.id);
      };

      grid.appendChild(tile);
    });

    root.append(add, grid);
    return;
  }

  /* =========================
     GROUPS – ITEMS / SECTIONS
     ========================= */
  if (state.screen === 'groups') {
    if (!Array.isArray(state.items[state.activeGroup])) {
      state.items[state.activeGroup] = [];
      save();
    }

    const addItem = document.createElement('button');
    addItem.textContent = '➕ Item';
    addItem.onclick = () =>
      createNameModal('Neues Item', name => {
        state.items[state.activeGroup].push({
          id: crypto.randomUUID(),
          type: 'item',
          name,
          images: { obverse: null, reverse: null, rounded: false },
        });
        save();
        render();
      });

    const addSection = document.createElement('button');
    addSection.textContent = '➕ Abschnitt';
    addSection.onclick = () =>
      createNameModal('Neuer Abschnitt', title => {
        state.items[state.activeGroup].push({
          id: crypto.randomUUID(),
          type: 'section',
          name: title,
        });
        save();
        render();
      });

    const grid = document.createElement('div');
    grid.className = 'tile-grid item-grid';

    state.items[state.activeGroup].forEach(entry => {
      /* ---------- SECTION ---------- */
      if (entry.type === 'section') {
        const s = document.createElement('div');
        s.className = 'tile-section editable';
        s.dataset.id = entry.id;

        const title = document.createElement('div');
        title.className = 'tile-title';
        title.textContent = entry.name;
        title.draggable = false;

        s.appendChild(title);

        if (!uiState.editMode) {
          enableDnD(s, entry.id);
        }

        grid.appendChild(s);
        return;
      }

      /* ---------- ITEM ---------- */
      if (entry.type === 'item') {
        const tile = document.createElement('div');
        tile.className = 'tile item-tile editable';
        tile.dataset.id = entry.id;

        const media = document.createElement('div');
        media.className = 'tile-media';

        if (entry.images?.obverse) {
          const obv = document.createElement('img');
          obv.src = entry.images.obverse;
          obv.className = 'coin-bottom';
          media.appendChild(obv);
        }

        if (entry.images?.reverse) {
          const rev = document.createElement('img');
          rev.src = entry.images.reverse;
          rev.className = 'coin-top';
          media.appendChild(rev);
        }

        const title = document.createElement('div');
        title.className = 'tile-title';
        title.textContent = entry.name;
        title.draggable = false;

        tile.append(media, title);

        tile.onclick = () => {
          if (uiState.editMode) return;
          openItemDetail(entry);
        };

        if (!uiState.editMode) {
          enableDnD(tile, entry.id);
        }

        grid.appendChild(tile);
      }
    });

    root.append(addItem, addSection, grid);
  }
}

/* =========================
   DRAG & DROP (ITEMS + SECTIONS)
   ========================= */
function enableDnD(el, id) {
  el.draggable = true;

  el.addEventListener('dragstart', e => {
    if (uiState.editMode) {
      e.preventDefault();
      return;
    }

    el.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  });

  el.addEventListener('dragend', () => {
    el.classList.remove('dragging');
  });

  el.addEventListener('dragover', e => {
    e.preventDefault();
    el.classList.add('drag-over');
  });

  el.addEventListener('dragleave', () => {
    el.classList.remove('drag-over');
  });

  el.addEventListener('drop', e => {
    e.preventDefault();
    el.classList.remove('drag-over');

    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === id) return;

    const list = state.items[state.activeGroup];
    if (!Array.isArray(list)) return;

    const from = list.findIndex(x => String(x.id) === String(draggedId));
    const to = list.findIndex(x => String(x.id) === String(id));

    if (from < 0 || to < 0) return;

    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);

    save();
    render();
  });
}
