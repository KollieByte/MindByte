import { input, select } from "../inputs.js";

export function baseTab(item, editable) {
  const d = document.createElement("div");

  d.append(
    input(item.coin.origin, "country", "Land / Staat", editable),
    input(item.coin.origin, "region", "Region", editable),
    select(item.coin.period, "era", [
      "Antike","Mittelalter","Neuzeit","Moderne","Sonstige"
    ], editable)
  );

  return d;
}

