// js/modules/itemDetail.js
import { state, saveState } from "./state.js";
import { render } from "./rendering.js";
import { openModal, closeModal } from "../ui/modal.js";

export function openItemDetail(item) {
  let editMode = false;

  if (!item.images) item.images = { obverse: null, reverse: null, rounded: false };
  if (!item.coin) item.coin = {};

  const ensure = key => (item.coin[key] ||= {});
  [
    "origin","period","type","nominal","material","mint",
    "condition","rarity","context","design",
    "acquisition","value","storage","special"
  ].forEach(ensure);

  function input(obj, key, placeholder) {
    const i = document.createElement("input");
    i.placeholder = placeholder;
    i.value = obj[key] || "";
    i.disabled = !editMode;
    i.oninput = () => {
      obj[key] = i.value;
      saveState(state);
    };
    return i;
  }

  function textarea(obj, key, placeholder) {
    const t = document.createElement("textarea");
    t.placeholder = placeholder;
    t.value = obj[key] || "";
    t.disabled = !editMode;
    t.oninput = () => {
      obj[key] = t.value;
      saveState(state);
    };
    return t;
  }

  function select(obj, key, options) {
    const s = document.createElement("select");
    s.disabled = !editMode;

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "— auswählen —";
    s.appendChild(empty);

    options.forEach(o => {
      const opt = document.createElement("option");
      opt.value = o;
      opt.textContent = o;
      s.appendChild(opt);
    });

    s.value = obj[key] || "";
    s.onchange = () => {
      obj[key] = s.value;
      saveState(state);
    };

    return s;
  }

  function buildDetail() {
    const wrap = document.createElement("div");

    const header = document.createElement("div");
    header.className = "item-detail-header";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const editBtn = document.createElement("button");
    editBtn.textContent = editMode ? "Fertig" : "Bearbeiten";
    editBtn.onclick = () => {
      editMode = !editMode;
      openModal(buildDetail());
    };

    header.append(title, editBtn);

    const images = document.createElement("div");
    images.className = "item-detail-images";

    function makeImage(side, label) {
      const wrap = document.createElement("div");
      wrap.className = "item-detail-image";

      if (item.images[side]) {
        const img = document.createElement("img");
        img.src = item.images[side];
        wrap.appendChild(img);
      } else {
        wrap.textContent = label;
      }

      if (editMode) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";

        input.onchange = () => {
          const file = input.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
            item.images[side] = reader.result;
            saveState(state);
            openModal(buildDetail());
          };
          reader.readAsDataURL(file);
        };

        wrap.onclick = () => input.click();
        wrap.appendChild(input);
      }

      return wrap;
    }

    images.append(
      makeImage("obverse", "Vorderseite"),
      makeImage("reverse", "Rückseite")
    );

    const tabs = document.createElement("div");
    tabs.className = "item-tabs";

    const content = document.createElement("div");
    content.className = "item-tab-content";

    const buttons = [];
    const panels = [];

    function addTab(label, builder) {
      const b = document.createElement("button");
      b.textContent = label;

      const p = builder();
      p.style.display = "none";

      b.onclick = () => {
        panels.forEach(x => x.style.display = "none");
        buttons.forEach(x => x.classList.remove("active"));
        p.style.display = "block";
        b.classList.add("active");
      };

      buttons.push(b);
      panels.push(p);
      tabs.appendChild(b);
      content.appendChild(p);
    }

    addTab("Übersicht", () => {
      const d = document.createElement("div");
      d.innerHTML = `
        <strong>Land:</strong> ${item.coin.origin.country || "—"}<br>
        <strong>Epoche:</strong> ${item.coin.period.era || "—"}
      `;
      return d;
    });

    buttons[0]?.click();

    if (editMode) {
      const del = document.createElement("button");
      del.textContent = "Löschen";
      del.className = "danger";
      del.onclick = () => {
        if (!confirm("Item wirklich löschen?")) return;
        state.items[state.activeGroup] =
          state.items[state.activeGroup].filter(i => i.id !== item.id);
        saveState(state);
        closeModal();
        render();
      };
      wrap.append(del);
    }

    wrap.append(header, images, tabs, content);
    return wrap;
  }

  openModal(buildDetail());
}
