// Item detail modal
//
// Presents a tabbed modal interface for viewing and editing the details
// of a single collection item.  Most of the UI generation logic is
// unchanged from the original implementation in app.js, but it has
// been encapsulated into its own module for clarity.  The function
// receives an item object by reference and mutates it in response to
// user input.  Changes are persisted immediately via the save() helper
// and the list view is refreshed when appropriate.

import { state, save } from './state/index.js';
import { render } from './rendering/index.js';
import { openModal, closeModal } from '../ui/modal.js';

/**
 * Open a detailed modal for the supplied item.  Users can view and edit
 * all aspects of the item across multiple tabs.  Editing is toggled via
 * the "Bearbeiten" button; when enabled, form controls are writable and
 * images can be uploaded.  Duplicating and deleting items is also
 * supported from within the modal.
 *
 * @param {object} item The item from the current group to display
 */
export function openItemDetail(item) {
  let editMode = false;

  // Ensure the item contains all expected nested structures
  if (!item.images) item.images = { obverse: null, reverse: null, rounded: false };
  if (!item.coin) item.coin = {};

  const ensure = key => (item.coin[key] ||= {});
  [
    'origin',
    'period',
    'type',
    'nominal',
    'material',
    'mint',
    'condition',
    'rarity',
    'context',
    'design',
    'acquisition',
    'value',
    'storage',
    'special',
  ].forEach(ensure);

  // Helpers for generating form elements tied to the item's data
  function input(obj, key, placeholder) {
    const i = document.createElement('input');
    i.placeholder = placeholder;
    i.value = obj[key] || '';
    i.disabled = !editMode;
    i.oninput = () => {
      obj[key] = i.value;
      save();
    };
    return i;
  }

  function textarea(obj, key, placeholder) {
    const t = document.createElement('textarea');
    t.placeholder = placeholder;
    t.value = obj[key] || '';
    t.disabled = !editMode;
    t.oninput = () => {
      obj[key] = t.value;
      save();
    };
    return t;
  }

  function select(obj, key, options) {
    const s = document.createElement('select');
    s.disabled = !editMode;

    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = '— auswählen —';
    s.appendChild(empty);

    options.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o;
      opt.textContent = o;
      s.appendChild(opt);
    });

    s.value = obj[key] || '';
    s.onchange = () => {
      obj[key] = s.value;
      save();
    };

    return s;
  }

  function buildDetail() {
    const wrap = document.createElement('div');

    /* ---------- HEADER ---------- */

    const header = document.createElement('div');
    header.className = 'item-detail-header';

    const title = document.createElement('h3');
    title.textContent = item.name;

    const editBtn = document.createElement('button');
    editBtn.textContent = editMode ? 'Fertig' : 'Bearbeiten';
    editBtn.onclick = () => {
      editMode = !editMode;
      openModal(buildDetail());
    };

    header.append(title, editBtn);

    /* ---------- IMAGES ---------- */

    const images = document.createElement('div');
    images.className = 'item-detail-images';

    function makeImage(side, label) {
      const wrap = document.createElement('div');
      wrap.className = 'item-detail-image';

      const hasImage = !!item.images[side];

      if (hasImage) {
        const img = document.createElement('img');
        img.src = item.images[side];

        // 🔵 ECHT RUND vs ECKIG
        if (item.images.rounded) {
          wrap.style.borderRadius = '50%';
          wrap.style.borderStyle = 'solid';
          img.style.borderRadius = '50%';
        } else {
          wrap.style.borderRadius = '12px';
          wrap.style.borderStyle = 'dashed';
          img.style.borderRadius = '12px';
        }

        wrap.appendChild(img);
      } else {
        // Platzhalter NUR wenn kein Bild existiert
        wrap.textContent = label;
      }

      // 📸 Upload NUR im Edit-Modus
      if (editMode) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        input.onchange = () => {
          const file = input.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
            item.images[side] = reader.result;
            save();
            openModal(buildDetail());
          };
          reader.readAsDataURL(file);
        };

        wrap.onclick = () => input.click();
        wrap.appendChild(input);
      }

      return wrap;
    }

    // Ensure an images object exists in case it was stripped
    if (!item.images) {
      item.images = {
        obverse: null,
        reverse: null,
        rounded: false,
      };
    }

    images.append(
      makeImage('obverse', 'Vorderseite'),
      makeImage('reverse', 'Rückseite'),
    );

    if (editMode) {
      const shape = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = item.images.rounded;
      cb.onchange = () => {
        item.images.rounded = cb.checked;
        save();
        openModal(buildDetail());
      };
      shape.append(cb, document.createTextNode(' Runde Bilder'));
      images.append(shape);
    }

    /* ---------- TABS ---------- */

    const tabs = document.createElement('div');
    tabs.className = 'item-tabs';
    const content = document.createElement('div');
    content.className = 'item-tab-content';

    const buttons = [];
    const panels = [];

    function addTab(label, builder) {
      const b = document.createElement('button');
      b.textContent = label;

      const p = builder();
      p.style.display = 'none';

      b.onclick = () => {
        panels.forEach(x => (x.style.display = 'none'));
        buttons.forEach(x => x.classList.remove('active'));
        p.style.display = 'block';
        b.classList.add('active');
      };

      buttons.push(b);
      panels.push(p);
      tabs.appendChild(b);
      content.appendChild(p);
    }

    addTab('Übersicht', () => {
      const d = document.createElement('div');
      const row = (l, v) => {
        const r = document.createElement('div');
        r.className = 'overview-row';
        r.innerHTML = `<strong>${l}</strong><span>${v || '—'}</span>`;
        return r;
      };
      d.append(
        row('Land', item.coin.origin.country),
        row('Epoche', item.coin.period.era),
        row('Material', item.coin.material.main),
        row('Nennwert', item.coin.nominal.value),
        row('Seltenheit', item.coin.rarity.level),
      );
      return d;
    });

    addTab('Grundkategorien', () => {
      const d = document.createElement('div');

      // Herkunft
      d.append(
        input(item.coin.origin, 'country', 'Land / Staat'),
        input(item.coin.origin, 'region', 'Region (z. B. Europa)'),
        input(item.coin.origin, 'historical', 'Historischer Staat'),
      );

      // Zeitraum
      d.append(
        select(item.coin.period, 'era', [
          'Antike',
          'Mittelalter',
          'Neuzeit',
          'Moderne',
          'Sonstige Epoche',
        ]),
        input(item.coin.period, 'ruler', 'Herrscher / Zeitabschnitt'),
      );

      // Münztyp
      d.append(
        select(item.coin.type, 'category', [
          'Umlaufmünze',
          'Gedenkmünze',
          'Kursmünze',
          'Sonderprägung',
          'Medaille',
        ]),
      );

      return d;
    });

    addTab('Details', () => {
      const d = document.createElement('div');

      // Nominal / Wert
      d.append(
        input(item.coin.nominal, 'value', 'Nennwert'),
        input(item.coin.nominal, 'currency', 'Währung'),
        textarea(item.coin.nominal, 'purchasingPower', 'Historische Kaufkraft'),
      );

      // Material
      d.append(
        select(item.coin.material, 'main', [
          'Gold',
          'Silber',
          'Kupfer / Bronze',
          'Nickel',
          'Bimetall',
          'Legierung',
        ]),
      );

      // Prägung
      d.append(
        input(item.coin.mint, 'year', 'Prägejahr / Zeitraum'),
        input(item.coin.mint, 'place', 'Münzstätte'),
        input(item.coin.mint, 'mark', 'Münzzeichen'),
      );

      // Erhaltungsgrad
      d.append(
        select(item.coin.condition, 'grade', [
          'Prägefrisch (PP)',
          'Stempelglanz',
          'Sehr schön',
          'Schön',
          'Gering erhalten',
          'Beschädigt',
        ]),
        textarea(item.coin.condition, 'damage', 'Beschädigungen / Hinweise'),
      );

      return d;
    });

    addTab('Sammler', () => {
      const d = document.createElement('div');

      // Seltenheit
      d.append(
        select(item.coin.rarity, 'level', [
          'Häufig',
          'Selten',
          'Sehr selten',
          'Rarität',
        ]),
        input(item.coin.rarity, 'mintage', 'Auflage / Stückzahl'),
      );

      // Historischer Kontext
      d.append(
        input(item.coin.context, 'occasion', 'Anlass der Prägung'),
        input(item.coin.context, 'ruler', 'Herrscher / Regierung'),
        textarea(item.coin.context, 'meaning', 'Politische / kulturelle Bedeutung'),
      );

      // Gestaltung
      d.append(
        input(item.coin.design, 'obverse', 'Motiv Vorderseite (Avers)'),
        input(item.coin.design, 'reverse', 'Motiv Rückseite (Revers)'),
        input(item.coin.design, 'inscription', 'Inschrift'),
        input(item.coin.design, 'artist', 'Künstler / Designer'),
      );

      return d;
    });

    addTab('Persönlich', () => {
      const d = document.createElement('div');

      // Erwerb
      d.append(
        input(item.coin.acquisition, 'date', 'Kaufdatum'),
        input(item.coin.acquisition, 'price', 'Kaufpreis'),
        input(item.coin.acquisition, 'source', 'Händler / Quelle'),
        input(item.coin.acquisition, 'method', 'Kauf / Tausch / Geschenk'),
      );

      // Aktueller Wert
      d.append(
        input(item.coin.value, 'estimate', 'Geschätzter Marktwert'),
        input(item.coin.value, 'date', 'Bewertungsdatum'),
        input(item.coin.value, 'source', 'Quelle der Bewertung'),
      );

      // Lagerung
      d.append(
        input(item.coin.storage, 'container', 'Album / Kapsel / Box'),
        input(item.coin.storage, 'location', 'Lagerort'),
        textarea(item.coin.storage, 'condition', 'Zustand der Aufbewahrung'),
      );

      return d;
    });

    addTab('Spezial', () => {
      const d = document.createElement('div');

      d.append(
        select(item.coin.special, 'error', [
          '',
          'Fehlprägung',
          'Stempelbruch',
          'Dezentrierung',
          'Sonstige Abweichung',
        ]),
        input(item.coin.special, 'theme', 'Motivsammlung'),
        input(item.coin.special, 'yearSet', 'Jahrgangssammlung'),
        input(item.coin.special, 'fineWeight', 'Edelmetallgewicht (Feingewicht)'),
        input(item.coin.special, 'certificate', 'Zertifikat / Provenienz'),
      );

      return d;
    });

    // Automatically select the first tab on open
    buttons[0].click();

    /* ---------- ACTIONS ---------- */

    if (editMode) {
      const actions = document.createElement('div');
      actions.className = 'item-actions';

      const dup = document.createElement('button');
      dup.textContent = 'Duplizieren';
      dup.onclick = () => {
        const copy = structuredClone(item);
        copy.id = crypto.randomUUID();
        copy.name += ' (Kopie)';

        state.items[state.activeGroup].push(copy);
        save();
        closeModal();
        render();
      };

      const del = document.createElement('button');
      del.textContent = 'Löschen';
      del.className = 'danger';
      del.onclick = () => {
        if (!confirm('Item wirklich löschen?')) return;
        state.items[state.activeGroup] = state.items[state.activeGroup].filter(
          i => i.id !== item.id,
        );
        save();
        closeModal();
        render();
      };

      actions.append(dup, del);
      wrap.append(actions);
    }

    wrap.append(header, images, tabs, content);
    return wrap;
  }

  openModal(buildDetail());
}