import { openModal } from "../../ui/modal.js";
import { buildImages } from "./images.js";
import { buildActions } from "./actions.js";
import { createTabs } from "./tabs/index.js";

import { overviewTab } from "./tabs/overview.js";
import { baseTab } from "./tabs/base.js";
import { detailsTab } from "./tabs/details.js";
import { collectorTab } from "./tabs/collector.js";
import { personalTab } from "./tabs/personal.js";
import { specialTab } from "./tabs/special.js";

/**
 * Backward-compatible: stellt sicher, dass alte Items (oder neue ohne coin)
 * die erwartete Struktur haben, damit Tabs nicht crashen.
 */
function ensureItemShape(item) {
  item.images ||= { obverse: null, reverse: null, rounded: false };

  item.coin ||= {};
  const sections = [
    "origin","period","type","nominal","material","mint",
    "condition","rarity","context","design",
    "acquisition","value","storage","special"
  ];
  sections.forEach(k => (item.coin[k] ||= {}));
}

export function openItemDetail(item) {
  ensureItemShape(item);

  let editMode = false;

  function build() {
    const wrap = document.createElement("div");

    const header = document.createElement("h3");
    header.textContent = item.name;

    const edit = document.createElement("button");
    edit.textContent = editMode ? "Fertig" : "Bearbeiten";
    edit.onclick = () => {
      editMode = !editMode;
      openModal(build());
    };

    const { tabs, content, addTab, activateFirst } = createTabs();

    addTab("Übersicht", () => overviewTab(item));
    addTab("Grundlagen", () => baseTab(item, editMode));
    addTab("Details", () => detailsTab(item, editMode));
    addTab("Sammler", () => collectorTab(item, editMode));
    addTab("Persönlich", () => personalTab(item, editMode));
    addTab("Spezial", () => specialTab(item, editMode));

    activateFirst();

    wrap.append(
      header,
      edit,
      buildImages(item, editMode, () => openModal(build())),
      tabs,
      content
    );

    if (editMode) {
      wrap.append(buildActions(item));
    }

    return wrap;
  }

  openModal(build());
}
