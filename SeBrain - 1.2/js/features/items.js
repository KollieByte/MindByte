import { state } from "../core/state.js";
import { save } from "../core/storage.js";
import { openModal, closeModal } from "../core/modal.js";
import { COIN_FIELDS, COIN_FIELD_ORDER } from "../data/coinFields.js";

/* =========================
   HELPER
========================= */
function normalizeItem(item) {
  if (!item.data) {
    item.data = {};
    Object.keys(item).forEach((k) => {
      if (k !== "id" && k !== "data") {
        item.data[k] = item[k];
        delete item[k];
      }
    });
  }
  return item;
}

function selectedFieldKeys(col, catKey) {
  const sel = col?.schema?.[catKey];
  if (!sel) return [];
  if (sel === true) return Object.keys(COIN_FIELDS[catKey]?.fields || {});
  if (Array.isArray(sel)) return sel;
  return [];
}

/* =========================
   ITEMS LIST
========================= */
export function renderItems() {
  const container = document.getElementById("items");
  if (!container) return;

  container.innerHTML = "";

  const col = state.activeCollection;
  if (!col || !Array.isArray(col.items) || col.items.length === 0) {
    container.innerHTML = "<p>Noch keine Münzen</p>";
    return;
  }

  col.items.forEach((raw) => {
    const item = normalizeItem(raw);

    const card = document.createElement("div");
    card.className = "card item-card";

    const title = document.createElement("div");
    title.className = "item-title";
    title.textContent = item.data.inventoryNumber || "Unbenannte Münze";

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.title = "Bearbeiten";
    editBtn.textContent = "✏️";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      openItemForm(item);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn danger";
    deleteBtn.title = "Löschen";
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (!confirm("Münze wirklich löschen?")) return;
      col.items = col.items.filter((i) => i !== raw);
      save();
      closeItemDetail();
      renderItems();
    };

    actions.append(editBtn, deleteBtn);
    card.append(title, actions);

    // Klick auf Tile => Detail-Modal
    card.onclick = () => openItemDetail(item);

    container.appendChild(card);
  });
}

/* =========================
   ITEM FORM (EDIT / NEW)
========================= */
export function openItemForm(item = null) {
  const col = state.activeCollection;
  if (!col || !col.schema) {
    alert("Keine aktive Sammlung oder kein Schema");
    return;
  }

  const title = document.getElementById("modalTitle");
  const content = document.getElementById("modalContent");
  const saveBtn = document.getElementById("modalSave");
  const deleteBtn = document.getElementById("modalDelete");

  if (!title || !content || !saveBtn) return;

  title.textContent = item ? "Münze bearbeiten" : "Neue Münze";
  content.innerHTML = "";
  saveBtn.classList.remove("hidden");
  if (deleteBtn) deleteBtn.classList.add("hidden");

  const data = item ? { ...normalizeItem(item).data } : {};

  COIN_FIELD_ORDER.forEach((catKey) => {
    const cat = COIN_FIELDS[catKey];
    if (!cat) return;

    const keys = selectedFieldKeys(col, catKey);
    if (keys.length === 0) return;

    const section = document.createElement("section");
    section.className = "item-section grid";

    const heading = document.createElement("h4");
    heading.textContent = cat.label;
    section.appendChild(heading);

    keys.forEach((fieldKey) => {
      const def = cat.fields[fieldKey];
      if (!def) return;

      const wrapper = document.createElement("div");
      wrapper.className = "form-field";

      const label = document.createElement("label");
      label.textContent = def.label;

      let input;
      let preview;

      // select
      if (def.type === "select") {
        input = document.createElement("select");
        (def.options || []).forEach((opt) => {
          const o = document.createElement("option");
          o.value = opt;
          o.textContent = opt;
          input.appendChild(o);
        });
        input.value = data[fieldKey] || "";
        input.onchange = () => (data[fieldKey] = input.value);
      }

      // boolean
      else if (def.type === "boolean") {
        input = document.createElement("input");
        input.type = "checkbox";
        input.checked = !!data[fieldKey];
        input.onchange = () => (data[fieldKey] = input.checked);
      }

      // date
      else if (def.type === "date") {
        input = document.createElement("input");
        input.type = "date";
        input.value = data[fieldKey] || "";
        input.onchange = () => (data[fieldKey] = input.value);
      }

      // image
      else if (def.type === "image") {
        input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        preview = document.createElement("img");
        preview.className = "image-preview";

        if (data[fieldKey]) {
          preview.src = data[fieldKey];
        } else {
          preview.style.display = "none";
        }

        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) return;

          const r = new FileReader();
          r.onload = () => {
            data[fieldKey] = r.result;
            preview.src = r.result;
            preview.style.display = "block";
          };
          r.readAsDataURL(file);
        };
      }

      // number / text fallback
      else {
        input = document.createElement("input");
        input.type = def.type === "number" ? "number" : "text";
        input.value = data[fieldKey] || "";
        input.oninput = () => (data[fieldKey] = input.value);
      }

      wrapper.append(label, input);
      if (preview) wrapper.appendChild(preview);
      section.appendChild(wrapper);
    });

    content.appendChild(section);
  });

  saveBtn.onclick = () => {
    if (item) {
      item.data = data;
    } else {
      col.items.push({ id: Date.now(), data });
    }
    save();
    closeModal();
    renderItems();
  };

  openModal();
}

/* =========================
   DETAIL MODAL
========================= */
export function openItemDetail(rawItem) {
  const item = normalizeItem(rawItem);
  const col = state.activeCollection;
  if (!col) return;

  const modal = document.getElementById("detailModal");
  const overlay = document.getElementById("detailOverlay");
  const title = document.getElementById("detailTitle");
  const content = document.getElementById("detailContent");
  const editBtn = document.getElementById("detailEditBtn");
  const deleteBtn = document.getElementById("detailDeleteBtn");
  const closeBtn = document.getElementById("detailCloseBtn");

  if (!modal || !overlay || !title || !content) return;

  title.textContent = item.data.inventoryNumber || "Münz-Details";
  content.innerHTML = "";

  COIN_FIELD_ORDER.forEach((catKey) => {
    const cat = COIN_FIELDS[catKey];
    if (!cat) return;

    const keys = selectedFieldKeys(col, catKey);
    if (keys.length === 0) return;

    const section = document.createElement("section");
    section.className = "detail-section";

    const h = document.createElement("h3");
    h.textContent = cat.label;
    section.appendChild(h);

    keys.forEach((fieldKey) => {
      const def = cat.fields[fieldKey];
      if (!def) return;

      const val = item.data[fieldKey];
      if (val == null || val === "") return;

      if (def.type === "image") {
        const img = document.createElement("img");
        img.src = val;
        img.className = "detail-image";
        section.appendChild(img);
        return;
      }

      const row = document.createElement("div");
      row.className = "detail-row";
      row.innerHTML = `
        <span class="detail-label">${def.label}</span>
        <span class="detail-value">${val}</span>
      `;
      section.appendChild(row);
    });

    if (section.children.length > 1) content.appendChild(section);
  });

  if (editBtn) {
    editBtn.onclick = () => {
      closeItemDetail();
      openItemForm(item);
    };
  }

  if (deleteBtn) {
    deleteBtn.onclick = () => {
      if (!confirm("Münze wirklich löschen?")) return;
      col.items = col.items.filter((i) => i !== rawItem);
      save();
      closeItemDetail();
      renderItems();
    };
  }

  if (closeBtn) closeBtn.onclick = () => closeItemDetail();
  overlay.onclick = () => closeItemDetail();

  overlay.classList.remove("hidden");
  modal.classList.remove("hidden");
}

export function closeItemDetail() {
  const modal = document.getElementById("detailModal");
  const overlay = document.getElementById("detailOverlay");
  if (modal) modal.classList.add("hidden");
  if (overlay) overlay.classList.add("hidden");
}

/* =========================
   COMPATIBILITY EXPORTS ✅
========================= */
export function openNewItem() {
  openItemForm(null);
}

export function openNewForm() {
  openItemForm(null);
}
