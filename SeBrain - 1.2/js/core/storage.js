import { state } from "./state.js";
import { COIN_FIELDS } from "../data/coinFields.js";

const KEY = "sebrain";

/* =========================
   DEFAULT SCHEMA (Fallback)
========================= */
function defaultSchemaAll() {
  const schema = {};
  for (const key of Object.keys(COIN_FIELDS)) {
    schema[key] = true;
  }
  return schema;
}

/* =========================
   NORMALIZE ITEM
========================= */
function normalizeItem(item) {
  if (!item || typeof item !== "object") {
    return { id: Date.now(), data: {} };
  }

  if (item.data && typeof item.data === "object") {
    return {
      id: Number(item.id) || Date.now(),
      data: item.data
    };
  }

  const data = {};
  Object.entries(item).forEach(([k, v]) => {
    if (k !== "id") data[k] = v;
  });

  return {
    id: Number(item.id) || Date.now(),
    data
  };
}

/* =========================
   NORMALIZE COLLECTION
========================= */
function normalizeCollection(col) {
  return {
    id: Number(col?.id) || Date.now(),
    name: col?.name || "Unbenannt",
    schema:
      col?.schema && typeof col.schema === "object"
        ? col.schema
        : defaultSchemaAll(),
    items: Array.isArray(col?.items)
      ? col.items.map(normalizeItem)
      : []
  };
}

/* =========================
   LOAD
========================= */
export function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    state.collections = [];
    state.activeCollection = null;
    return;
  }

  const parsed = JSON.parse(raw);

  state.collections = Array.isArray(parsed.collections)
    ? parsed.collections.map(normalizeCollection)
    : [];

  state.activeCollection = null;
}

/* =========================
   SAVE  ✅ HIER WAR DER FEHLENDE EXPORT
========================= */
export function save() {
  const data = {
    collections: state.collections.map(normalizeCollection)
  };

  localStorage.setItem(KEY, JSON.stringify(data));
}
