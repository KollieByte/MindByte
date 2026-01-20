export function initModal() {
  const close = document.getElementById("modalClose");
  const overlay = document.getElementById("modalOverlay");

  if (close) close.onclick = closeModal;
  if (overlay) overlay.onclick = closeModal;

  // 🔒 WICHTIG: Modal IMMER geschlossen initialisieren
  closeModal();
}

export function openModal() {
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("modalOverlay");

  if (!modal || !overlay) return;

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

export function closeModal() {
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("modalOverlay");

  if (!modal || !overlay) return;

  modal.classList.add("hidden");
  overlay.classList.add("hidden");

  // Cleanup
  const title = document.getElementById("modalTitle");
  const content = document.getElementById("modalContent");
  const saveBtn = document.getElementById("modalSave");
  const deleteBtn = document.getElementById("modalDelete");

  if (title) title.textContent = "";
  if (content) content.innerHTML = "";
  if (saveBtn) saveBtn.classList.add("hidden");
  if (deleteBtn) deleteBtn.classList.add("hidden");
}
