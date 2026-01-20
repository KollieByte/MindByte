import { state } from "../core/state.js";
import { save } from "../core/storage.js";
import { openModal, closeModal } from "../core/modal.js";

export function openSchemaEditor() {
  const col = state.activeCollection;
  if (!col) return;

  col.schema ||= [];

  const title = document.getElementById("modalTitle");
  const content = document.getElementById("modalContent");
  const saveBtn = document.getElementById("modalSave");
  const delBtn = document.getElementById("modalDelete");

  title.textContent = "Schema bearbeiten";
  delBtn.classList.add("hidden");

  render();

  function render() {
    content.innerHTML = "";

    col.schema.forEach((f, i) => {
      const row = document.createElement("div");
      row.innerHTML = `
        <input placeholder="Key" value="${f.key}">
        <input placeholder="Label" value="${f.label}">
        <select>
          ${["text","number","date","image"]
            .map(t => `<option ${t===f.type?"selected":""}>${t}</option>`)
            .join("")}
        </select>
        <button data-i="${i}">✖</button>
      `;

      const [key, label, type] = row.querySelectorAll("input, select");

      key.oninput = () => f.key = key.value;
      label.oninput = () => f.label = label.value;
      type.onchange = () => f.type = type.value;

      row.querySelector("button").onclick = () => {
        col.schema.splice(i, 1);
        render();
      };

      content.appendChild(row);
    });

    const add = document.createElement("button");
    add.textContent = "+ Feld";
    add.onclick = () => {
      col.schema.push({ key: "", label: "", type: "text" });
      render();
    };
    content.appendChild(add);
  }

  saveBtn.onclick = () => {
    save();
    closeModal();
  };

  openModal();
}
