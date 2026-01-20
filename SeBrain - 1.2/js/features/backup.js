import { collections, replaceCollections } from "../core/storage.js";

const VERSION = 1;

export function exportBackup(raw = false) {
  const payload = {
    app: "SeBrain",
    version: VERSION,
    createdAt: new Date().toISOString(),
    collections
  };

  if (raw) return payload;

  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `sebrain-backup-${Date.now()}.json`;
  a.click();
}

export function importBackup(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);

        if (data.app !== "SeBrain" || !Array.isArray(data.collections)) {
          throw new Error("Ungültiges Backup-Format");
        }

        // 🔥 WICHTIG: State ersetzen, nicht nur localStorage
        replaceCollections(data.collections);
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () =>
      reject(new Error("Backup konnte nicht gelesen werden"));

    reader.readAsText(fileOrBlob);
  });
}
