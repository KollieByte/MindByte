// js/ui/navbar.js

import {
  navigate,
  goBack,
  state,
  uiState,
} from '../app.js';

import { openSettingsModal } from '../modules/settingsModal.js';

export function renderNavbar() {
  const nav = document.getElementById('navbar');
  nav.innerHTML = '';

  const left = document.createElement('div');
  const right = document.createElement('div');

  /* =========================
     LEFT SIDE – NAVIGATION
     ========================= */
  const home = document.createElement('button');
  home.textContent = 'Home';
  home.onclick = () => navigate('home');

  const back = document.createElement('button');
  back.textContent = '←';
  back.onclick = goBack;
  back.style.display = state.screen !== 'home' ? 'inline-block' : 'none';

  left.append(home, back);

  /* =========================
     RIGHT SIDE – ACTIONS
     ========================= */

  // ✏️ Edit-Mode Toggle
  const editBtn = document.createElement('button');
  editBtn.className = 'nav-edit-btn';
  editBtn.innerHTML = '✏️ Edit';
  editBtn.classList.toggle('active', uiState.editMode);

  editBtn.onclick = () => {
    uiState.editMode = !uiState.editMode;
    editBtn.classList.toggle('active', uiState.editMode);
    document.body.classList.toggle('edit-mode', uiState.editMode);
  };

  // ⚙️ Settings
  const settingsBtn = document.createElement('button');
  settingsBtn.textContent = '⚙️';
  settingsBtn.title = 'Einstellungen';
  settingsBtn.onclick = openSettingsModal;

  right.append(editBtn, settingsBtn);

  nav.append(left, right);
}
