import { state } from "../core/state.js";
import { save } from "../core/storage.js";
import { openModal, closeModal } from "../core/modal.js";
import { COIN_FIELDS } from "../data/coinFields.js";

/* =========================
   RENDER COLLECTIONS
========================= */
export function renderCollections() {
  const container = document.getElementById("collections");
  if (!container) return;

  container.innerHTML = "";

  if (!Array.isArray(state.collections) || state.collections.length === 0) {
    container.innerHTML = "<p>Noch keine Sammlungen</p>";
    return;
  }

  state.collections.forEach((col) => {
    const card = document.createElement("div");
    card.className = "card collection-card";

    const title = document.createElement("div");
    title.className = "collection-title";
    title.textContent = col.name || "Unbenannte Sammlung";

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.textContent = "✏️";
    editBtn.title = "Bearbeiten";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      openEditCollection(col);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn danger";
    deleteBtn.textContent = "🗑";
    deleteBtn.title = "Löschen";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (!confirm("Sammlung wirklich löschen?")) return;
      state.collections = state.collections.filter((c) => c !== col);
      save();
      renderCollections();
    };

    actions.append(editBtn, deleteBtn);
    card.append(title, actions);

    card.onclick = () => {
      state.activeCollection = col;
      if (typeof window.showItemsView === "function") {
        window.showItemsView();
      }
    };

    container.appendChild(card);
  });
}

/* =========================
   PUBLIC: NEW COLLECTION
========================= */
export function openNewCollection() {
  openCollectionForm(null);
}

/* =========================
   INTERNAL: EDIT COLLECTION
========================= */
function openEditCollection(col) {
  openCollectionForm(col);
}

/* =========================
   COLLECTION FORM (NEW / EDIT)
========================= */
function openCollectionForm(col) {
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const saveBtn = document.getElementById("modalSave");
  const deleteBtn = document.getElementById("modalDelete");

  if (!modalTitle || !modalContent || !saveBtn) return;

  modalTitle.textContent = col ? "Sammlung bearbeiten" : "Neue Sammlung";
  modalContent.innerHTML = "";
  saveBtn.classList.remove("hidden");

  if (deleteBtn) {
    deleteBtn.classList.toggle("hidden", !col);
    deleteBtn.onclick = () => {
      if (!confirm("Sammlung wirklich löschen?")) return;
      state.collections = state.collections.filter((c) => c !== col);
      save();
      closeModal();
      renderCollections();
    };
  }

  /* ===== NAME ===== */
  const nameInput = document.createElement("input");
  nameInput.placeholder = "Name der Sammlung";
  nameInput.value = col?.name || "";
  modalContent.appendChild(nameInput);

  /* =========================
     SCHEMA AUSWAHL
  ========================= */
  const schemaContainer = document.createElement("div");
  schemaContainer.className = "schema-container";

  const schemaDraft = col
    ? JSON.parse(JSON.stringify(col.schema || {}))
    : {};

  Object.keys(COIN_FIELDS).forEach((catKey) => {
    const cat = COIN_FIELDS[catKey];

    const catWrapper = document.createElement("div");
    catWrapper.className = "schema-category";

    /* --- Kategorie Checkbox --- */
    const catLabel = document.createElement("label");
    catLabel.className = "schema-category-label";

    const catCheckbox = document.createElement("input");
    catCheckbox.type = "checkbox";

    const catActive =
      schemaDraft[catKey] === true ||
      Array.isArray(schemaDraft[catKey]);

    catCheckbox.checked = catActive;

    catLabel.append(catCheckbox, document.createTextNode(cat.label));
    catWrapper.appendChild(catLabel);

    /* --- Felder --- */
    const fieldsContainer = document.createElement("div");
    fieldsContainer.className = "schema-fields";

    Object.keys(cat.fields).forEach((fieldKey) => {
      const fieldDef = cat.fields[fieldKey];

      const fieldLabel = document.createElement("label");
      fieldLabel.className = "schema-field";

      const fieldCheckbox = document.createElement("input");
      fieldCheckbox.type = "checkbox";

      const fieldActive =
        schemaDraft[catKey] === true ||
        schemaDraft[catKey]?.includes(fieldKey);

      fieldCheckbox.checked = fieldActive;

      fieldLabel.append(
        fieldCheckbox,
        document.createTextNode(fieldDef.label)
      );

      fieldCheckbox.onchange = () => {
        if (!Array.isArray(schemaDraft[catKey])) {
          schemaDraft[catKey] = [];
        }

        if (fieldCheckbox.checked) {
          if (!schemaDraft[catKey].includes(fieldKey)) {
            schemaDraft[catKey].push(fieldKey);
          }
        } else {
          schemaDraft[catKey] = schemaDraft[catKey].filter(
            (k) => k !== fieldKey
          );
        }

        if (schemaDraft[catKey].length === 0) {
          delete schemaDraft[catKey];
          catCheckbox.checked = false;
        }
      };

      fieldsContainer.appendChild(fieldLabel);
    });

    /* --- Kategorie Toggle --- */
    catCheckbox.onchange = () => {
      if (catCheckbox.checked) {
        schemaDraft[catKey] = true;
        fieldsContainer
          .querySelectorAll("input[type=checkbox]")
          .forEach((cb) => (cb.checked = true));
      } else {
        delete schemaDraft[catKey];
        fieldsContainer
          .querySelectorAll("input[type=checkbox]")
          .forEach((cb) => (cb.checked = false));
      }
    };

    catWrapper.appendChild(fieldsContainer);
    schemaContainer.appendChild(catWrapper);
  });

  modalContent.appendChild(schemaContainer);

  /* =========================
     SAVE
  ========================= */
  saveBtn.onclick = () => {
    const name = nameInput.value.trim() || "Unbenannte Sammlung";

    if (col) {
      col.name = name;
      col.schema = schemaDraft;
    } else {
      state.collections.push({
        id: Date.now(),
        name,
        schema: schemaDraft,
        items: []
      });
    }

    save();
    closeModal();
    renderCollections();
  };

  openModal();
}
