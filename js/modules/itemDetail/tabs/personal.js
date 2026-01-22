import { input } from "../inputs.js";

export function personalTab(item, editable) {
  const d = document.createElement("div");

  d.append(
    input(item.coin.acquisition, "date", "Kaufdatum", editable),
    input(item.coin.acquisition, "price", "Preis", editable),
    input(item.coin.storage, "location", "Lagerort", editable)
  );

  return d;
}

