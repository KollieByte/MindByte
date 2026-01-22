// Tabs-System: kümmert sich nur um UI-Logik
export function createTabs() {
  const tabs = document.createElement("div");
  tabs.className = "item-tabs";

  const content = document.createElement("div");
  content.className = "item-tab-content";

  const buttons = [];
  const panels = [];

  function addTab(label, panelBuilder) {
    const btn = document.createElement("button");
    btn.textContent = label;

    const panel = panelBuilder();
    panel.style.display = "none";

    btn.onclick = () => {
      panels.forEach(p => (p.style.display = "none"));
      buttons.forEach(b => b.classList.remove("active"));
      panel.style.display = "block";
      btn.classList.add("active");
    };

    buttons.push(btn);
    panels.push(panel);
    tabs.appendChild(btn);
    content.appendChild(panel);
  }

  function activateFirst() {
    buttons[0]?.click();
  }

  return { tabs, content, addTab, activateFirst };
}
