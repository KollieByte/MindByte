// Simple name entry modal
//
// Provides a utility for prompting the user to enter a short text value.
// The caller supplies a title and a callback to invoke when the user
// confirms.  This helper relies on the existing modal infrastructure in
// ui/modal.js.

import { openModal, closeModal } from '../ui/modal.js';

/**
 * Display a modal with a single text input field.  When the user
 * confirms, the provided callback is called with the trimmed value and
 * the modal is dismissed.  Blank input values are ignored.
 *
 * @param {string} title The heading to display at the top of the modal
 * @param {Function} onConfirm Called with the entered value on success
 */
export function createNameModal(title, onConfirm) {
  const wrap = document.createElement('div');

  const h = document.createElement('h3');
  h.textContent = title;

  const input = document.createElement('input');
  input.placeholder = 'Name';

  const ok = document.createElement('button');
  ok.textContent = 'Erstellen';
  ok.onclick = () => {
    if (!input.value.trim()) return;
    onConfirm(input.value.trim());
    closeModal();
  };

  wrap.append(h, input, ok);
  openModal(wrap);
}