import { renderHome } from "./renderHome.js";
import { renderApps } from "./renderApps.js";
import { renderGroups } from "./renderGroups.js";
import { state } from "../state.js";

export function render() {
  const root = document.getElementById("app");
  root.innerHTML = "";

  if (state.screen === "home") return renderHome(root);
  if (state.screen === "apps") return renderApps(root);
  if (state.screen === "groups") return renderGroups(root);
}

