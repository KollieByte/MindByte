import { state } from "../core/state.js";
import { save } from "../core/storage.js";

export function exportBackup() {
  const payload = {
    app: "sebrain",
    version: 2,
    exportedAt: new Date().toISOString(),
    data: {
      collections: state.collections || [],
      settings: {
        theme: localStorage.getItem("sebrain_theme") || "dark",
        accent: localStorage.getItem("sebrain_accent") || null
      }
    }
  };

  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `sebrain-backup-${Date.now()}.json`;
  a.click();

  URL.revokeObjectURL(a.href);
}

export function importBackup(file) {
  const reader = new FileReader();

  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);

      if (parsed.app !== "sebrain" || !parsed.data) {
        alert("❌ Ungültige Backup-Datei");
        return;
      }

      // 🔥 STATE WIEDERHERSTELLEN
      state.collections = parsed.data.collections || [];
      state.activeCollection = null;

      // THEME
      const theme = parsed.data.settings?.theme || "dark";
      document.body.classList.toggle("light", theme === "light");
      localStorage.setItem("sebrain_theme", theme);

      // ACCENT
      if (parsed.data.settings?.accent) {
        document.documentElement.style.setProperty(
          "--accent",
          parsed.data.settings.accent
        );
        localStorage.setItem("sebrain_accent", parsed.data.settings.accent);
      }

      // 💾 persistieren
      save();

      // 🔁 HARTE, SAUBERE REHYDRATION
      location.reload();

    } catch (err) {
      console.error(err);
      alert("❌ Fehler beim Import");
    }
  };

  reader.readAsText(file);
}

