// js/modules/settingsModal.js

import { openModal, closeModal } from '../ui/modal.js';
import { uiState } from './state/index.js';
import { setTheme, setAccent } from '../ui/theme.js';

const DEFAULT_SETTINGS = {
  theme: 'dark',
  accent: '#4f46e5',
  editModeDefault: false,
  confirmDelete: true,
};


export function loadSettings() {
  try {
    const raw = localStorage.getItem('settings');
    return raw
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
      : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  localStorage.setItem('settings', JSON.stringify(settings));
}

export function openSettingsModal() {
  const settings = loadSettings();

  const wrap = document.createElement('div');
  wrap.className = 'settings-modal';

  const title = document.createElement('h3');
  title.textContent = 'Einstellungen';

  /* =========================
     TABS
     ========================= */
  const tabs = document.createElement('div');
  tabs.className = 'settings-tabs';

  const content = document.createElement('div');
  content.className = 'settings-content';

  const tabDefs = [
    { id: 'appearance', label: 'Darstellung', render: () => appearanceTab(settings) },
    { id: 'files', label: 'Dateien', render: () => filesTab() },
    { id: 'update', label: 'Update', render: () => updateTab() },
  ];

  let activeTab = 'appearance';

  function renderTabs() {
    tabs.innerHTML = '';
    content.innerHTML = '';

    tabDefs.forEach(t => {
      const btn = document.createElement('button');
      btn.textContent = t.label;
      btn.className = activeTab === t.id ? 'active' : '';
      btn.onclick = () => {
        activeTab = t.id;
        renderTabs();
      };
      tabs.appendChild(btn);
    });

    content.appendChild(tabDefs.find(t => t.id === activeTab).render());
  }

  /* =========================
     ACTIONS
     ========================= */
  const actions = document.createElement('div');
  actions.className = 'modal-actions';

  const cancel = document.createElement('button');
  cancel.textContent = 'Schließen';
  cancel.onclick = closeModal;

  const save = document.createElement('button');
  save.textContent = 'Speichern';
  save.onclick = () => {
  saveSettings(settings);

  setTheme(settings.theme);
  setAccent(settings.accent);

  uiState.editMode = settings.editModeDefault;
  document.body.classList.toggle('edit-mode', uiState.editMode);

  closeModal();
};


  actions.append(cancel, save);

  wrap.append(title, tabs, content, actions);

  renderTabs();
  openModal(wrap);
}

/* =========================
   TAB: DARSTELLUNG
   ========================= */
function appearanceTab(settings) {
  const wrap = document.createElement('div');

  /* ---------- THEME ---------- */
  const themeRow = selectRow(
    'Theme',
    ['dark', 'light'],
    settings.theme,
    v => {
      settings.theme = v;
      setTheme(v); // 🔴 LIVE anwenden
    }
  );

  /* ---------- ACCENT COLOR ---------- */
  const accentRow = colorRow(
    'Akzentfarbe',
    settings.accent || '#4f46e5',
    v => {
      settings.accent = v;
      setAccent(v); // 🔴 LIVE anwenden
    }
  );

  /* ---------- EDIT MODE ---------- */
  const editRow = checkboxRow(
    'Edit-Mode beim Start aktiv',
    settings.editModeDefault,
    v => (settings.editModeDefault = v)
  );

  /* ---------- CONFIRM DELETE ---------- */
  const confirmRow = checkboxRow(
    'Löschen bestätigen',
    settings.confirmDelete,
    v => (settings.confirmDelete = v)
  );

  wrap.append(themeRow, accentRow, editRow, confirmRow);
  return wrap;
}


/* =========================
   TAB: DATEIEN
   ========================= */
function filesTab() {
  const wrap = document.createElement('div');

  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Daten exportieren';
  exportBtn.onclick = () => {
    const data = localStorage.getItem('app_state');
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'collection.json';
    a.click();
  };

  const importBtn = document.createElement('button');
  importBtn.textContent = 'Daten importieren';
  importBtn.onclick = () => {
    const f = document.createElement('input');
    f.type = 'file';
    f.accept = '.json';
    f.onchange = e => {
      const r = new FileReader();
      r.onload = () => {
        localStorage.setItem('app_state', r.result);
        location.reload();
      };
      r.readAsText(e.target.files[0]);
    };
    f.click();
  };

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Alle Daten löschen';
  resetBtn.onclick = () => {
    if (!confirm('Wirklich ALLE Daten löschen?')) return;
    localStorage.clear();
    location.reload();
  };

  wrap.append(exportBtn, importBtn, resetBtn);
  return wrap;
}

function updateTab() {
  const wrap = document.createElement('div');

  /* ---------- VERSION ---------- */
  const versionEl = document.createElement('div');
  versionEl.textContent = 'Version: …';

  window.appInfo.version().then(v => {
    versionEl.textContent = `Version: ${v}`;
  });

  /* ---------- STATUS ---------- */
  const status = document.createElement('div');
  status.textContent = 'Status: bereit';

  /* ---------- CURRENT CHANGELOG ---------- */
  const currentBox = document.createElement('div');
  currentBox.className = 'changelog';

  const currentTitle = document.createElement('h4');
  currentTitle.textContent = 'Änderungen (aktuelle Version)';

  const currentContent = document.createElement('div');
  currentContent.innerHTML = '<em>Kein Changelog vorhanden</em>';

  window.appInfo.changelog().then(md => {
  if (md) {
    currentContent.innerHTML = renderMarkdown(
      typeof md === 'string' ? md : md[0]?.note || ''
    );
  }
});


  currentBox.append(currentTitle, currentContent);

  /* ---------- UPDATE CHANGELOG ---------- */
  const updateBox = document.createElement('div');
  updateBox.className = 'changelog';
  updateBox.style.display = 'none';

  const updateTitle = document.createElement('h4');
  updateTitle.textContent = 'Neues Update';

  const updateContent = document.createElement('div');

  updateBox.append(updateTitle, updateContent);

  /* ---------- BUTTONS ---------- */
  const checkBtn = document.createElement('button');
  checkBtn.textContent = '🔍 Update prüfen';
  checkBtn.onclick = async () => {
    status.textContent = 'Suche nach Updates…';
    await window.updater.check();
  };

  const installBtn = document.createElement('button');
  installBtn.textContent = '⬇️ Update installieren';
  installBtn.disabled = true;
  installBtn.onclick = () => window.updater.install();

  /* ---------- UPDATE EVENTS ---------- */
  window.updater.onAvailable(async info => {
    status.textContent = 'Update verfügbar';

    const notes =
      info?.releaseNotes ||
      (await window.updater.getChangelog());

    if (notes) {
      updateContent.innerHTML = renderMarkdown(
        typeof notes === 'string'
          ? notes
          : notes.map(n => n.note).join('\n')
      );
      updateBox.style.display = 'block';
    }
  });

  window.updater.onNone(() => {
    status.textContent = 'Kein Update verfügbar';
  });

  window.updater.onDownloaded(() => {
    status.textContent = 'Update bereit zur Installation';
    installBtn.disabled = false;
  });

  window.updater.onError(msg => {
    status.textContent = 'Update-Fehler: ' + msg;
  });

  wrap.append(
    versionEl,
    status,
    currentBox,
    updateBox,
    checkBtn,
    installBtn
  );

  return wrap;
}





/* =========================
   UI HELPERS
   ========================= */
function checkboxRow(label, value, onChange) {
  const row = document.createElement('div');
  row.className = 'settings-row';

  const l = document.createElement('label');
  l.textContent = label;

  const c = document.createElement('input');
  c.type = 'checkbox';
  c.checked = value;
  c.onchange = e => onChange(e.target.checked);

  row.append(l, c);
  return row;
}

function selectRow(label, options, value, onChange) {
  const row = document.createElement('div');
  row.className = 'settings-row';

  const l = document.createElement('label');
  l.textContent = label;

  const s = document.createElement('select');
  options.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o;
    opt.textContent = o;
    s.appendChild(opt);
  });
  s.value = value;
  s.onchange = e => onChange(e.target.value);

  row.append(l, s);
  return row;
}

function colorRow(label, value, onChange) {
  const row = document.createElement('div');
  row.className = 'settings-row';

  const l = document.createElement('label');
  l.textContent = label;

  const c = document.createElement('input');
  c.type = 'color';
  c.value = value;
  c.oninput = e => onChange(e.target.value);

  row.append(l, c);
  return row;
}

function renderMarkdown(md = '') {
  let html = md;

  // Überschriften
  html = html.replace(/^### (.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^## (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^# (.*)$/gm, '<h2>$1</h2>');

  // Fett / Kursiv
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Listen
  html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

  // Zeilenumbrüche
  html = html.replace(/\n{2,}/g, '<br><br>');

  return html;
}

