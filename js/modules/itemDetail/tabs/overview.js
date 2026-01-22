export function overviewTab(item) {
  const d = document.createElement("div");

  const row = (l, v) => {
    const r = document.createElement("div");
    r.className = "overview-row";
    r.innerHTML = `<strong>${l}</strong><span>${v || "—"}</span>`;
    return r;
  };

  d.append(
    row("Land", item.coin.origin.country),
    row("Epoche", item.coin.period.era),
    row("Material", item.coin.material.main),
    row("Nennwert", item.coin.nominal.value),
    row("Seltenheit", item.coin.rarity.level)
  );

  return d;
}

