import { input, select } from "../inputs.js";

export function specialTab(item, editable) {
  const d = document.createElement("div");

  d.append(
    select(item.coin.special, "error", [
      "","Fehlprägung","Stempelbruch","Dezentrierung"
    ], editable),
    input(item.coin.special, "certificate", "Zertifikat", editable)
  );

  return d;
}

