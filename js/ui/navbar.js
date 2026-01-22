import {
  navigate,
  goBack,
  state,
  exportData,
  importData,
  uiState
} from "../app.js";
import { setTheme, setAccent } from "./theme.js";

export function renderNavbar() {
  const nav = document.getElementById("navbar");
  nav.innerHTML = "";

  const left = document.createElement("div");
  const right = document.createElement("div");

  const home = document.createElement("button");
  home.textContent = "Home";
  home.onclick = () => navigate("home");

  const back = document.createElement("button");
  back.textContent = "←";
  back.onclick = goBack;
  back.style.display = state.screen !== "home" ? "inline-block" : "none";

  left.append(home, back);

  const theme = document.createElement("select");
  ["dark", "light"].forEach(t => {
    const o = document.createElement("option");
    o.value = t;
    o.textContent = t;
    theme.appendChild(o);
  });
  theme.value = localStorage.getItem("theme") || "dark";
  theme.onchange = e => setTheme(e.target.value);

  const accent = document.createElement("input");
  accent.type = "color";
  accent.oninput = e => setAccent(e.target.value);

  const edit = document.createElement("button");
  edit.textContent = "✏️ Edit";
  edit.onclick = () => {
    uiState.editMode = !uiState.editMode;
    document.body.classList.toggle("edit-mode", uiState.editMode);
    edit.classList.toggle("active", uiState.editMode);
  };

  const exp = document.createElement("button");
  exp.textContent = "Export";
  exp.onclick = exportData;

  const imp = document.createElement("button");
  imp.textContent = "Import";
  imp.onclick = () => {
    const f = document.createElement("input");
    f.type = "file";
    f.accept = ".json";
    f.onchange = e => {
      const r = new FileReader();
      r.onload = () => importData(r.result);
      r.readAsText(e.target.files[0]);
    };
    f.click();
  };

  right.append(theme, accent, edit, exp, imp);
  nav.append(left, right);
}

