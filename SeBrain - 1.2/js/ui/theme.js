const KEY = "sebrain_theme";

export function initTheme() {
  const saved = localStorage.getItem(KEY) || "light";
  setTheme(saved);

  const btn = document.getElementById("toggleTheme");
  if (btn) {
    btn.onclick = () => {
      const next =
        document.documentElement.dataset.theme === "light"
          ? "dark"
          : "light";
      setTheme(next);
    };
  }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(KEY, theme);

  const btn = document.getElementById("toggleTheme");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}
