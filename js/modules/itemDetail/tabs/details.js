import { input, textarea, select } from "../inputs.js";

export function detailsTab(item, editable) {
  const d = document.createElement("div");

  d.append(
    input(item.coin.nominal, "value", "Nennwert", editable),
    input(item.coin.nominal, "currency", "Währung", editable),
    select(item.coin.material, "main", [
      "Gold","Silber","Kupfer","Bimetall","Legierung"
    ], editable),
    textarea(item.coin.condition, "damage", "Beschädigungen", editable)
  );

  return d;
}

