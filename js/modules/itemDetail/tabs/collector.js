import { input, select } from "../inputs.js";

export function collectorTab(item, editable) {
  const d = document.createElement("div");

  d.append(
    select(item.coin.rarity, "level",
      ["Häufig","Selten","Sehr selten","Rarität"], editable),
    input(item.coin.rarity, "mintage", "Auflage", editable)
  );

  return d;
}

