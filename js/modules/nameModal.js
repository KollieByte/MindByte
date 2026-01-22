// js/modules/nameModal.js
import { openModal, closeModal } from "../ui/modal.js";

export function createNameModal(title, onConfirm) {
  const wrap = document.createElement("div");

  const h = document.createElement("h3");
  h.textContent = title;

  const input = document.createElement("input");
  input.placeholder = "Name";

  const ok = document.createElement("button");
  ok.textContent = "Erstellen";
  ok.onclick = () => {
    if (!input.value.trim()) return;
    onConfirm(input.value.trim());
    closeModal();
  };

  wrap.append(h, input, ok);
  openModal(wrap);
}

