import { state } from "../core/state.js";

let overlay;

export function initDebugOverlay() {
  overlay = document.createElement("div");
  overlay.id = "debugOverlay";
  overlay.innerHTML = `
    <div class="debug-header">
      <strong>SeBrain Debug</strong>
      <button id="debugClose">✖</button>
    </div>
    <pre id="debugContent"></pre>
  `;

  Object.assign(overlay.style, {
    position: "fixed",
    right: "1rem",
    bottom: "1rem",
    width: "320px",
    maxHeight: "50vh",
    background: "rgba(20,20,20,.95)",
    color: "#0f0",
    fontSize: "12px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,.4)",
    zIndex: 9999,
    overflow: "hidden"
  });

  document.body.appendChild(overlay);

  document.getElementById("debugClose").onclick = () => overlay.remove();

  const pre = document.getElementById("debugContent");

  setInterval(() => {
    pre.textContent = JSON.stringify(state, null, 2);
  }, 500);
}
