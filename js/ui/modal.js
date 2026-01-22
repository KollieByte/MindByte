export function openModal(content) {
  const backdrop = document.getElementById("modal-backdrop");
  const modal = document.getElementById("modal");

  modal.innerHTML = "";
  modal.appendChild(content);

  backdrop.classList.add("active");
  modal.classList.add("active");

  backdrop.onclick = closeModal;
}

export function closeModal() {
  document.getElementById("modal-backdrop").classList.remove("active");
  document.getElementById("modal").classList.remove("active");
}

