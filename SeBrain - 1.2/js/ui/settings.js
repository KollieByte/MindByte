import { exportBackup, importBackup } from "../features/backup.js";
import { uploadToWebDAV, downloadFromWebDAV } from "../features/sync.js";
import { openModal, closeModal } from "../core/modal.js";
import { showToast } from "./toast.js";
import { renderCollections } from "../features/collections.js";

export function openSettings() {
  const title = document.getElementById("modalTitle");
  const content = document.getElementById("modalContent");
  const saveBtn = document.getElementById("modalSave");
  const deleteBtn = document.getElementById("modalDelete");

  title.textContent = "Einstellungen";
  saveBtn.classList.add("hidden");
  deleteBtn.classList.add("hidden");

  content.innerHTML = `
    <section>
      <h3>Backup</h3>
      <button id="backupExport">Backup herunterladen</button>
      <button id="backupImport">Backup importieren</button>
    </section>

    <section style="margin-top:1rem">
      <h3>Cloud Sync (WebDAV)</h3>

      <input id="syncUrl" placeholder="https://cloud.example.com/sebrain.json">
      <input id="syncUser" placeholder="Benutzername">
      <input id="syncPass" type="password" placeholder="Passwort">

      <div style="margin-top:.5rem">
        <button id="syncUpload">⬆ Hochladen</button>
        <button id="syncDownload">⬇ Herunterladen</button>
      </div>
    </section>
  `;

  // BACKUP EXPORT
  content.querySelector("#backupExport").onclick = () => {
    exportBackup();
    showToast("Backup erstellt");
  };

  // BACKUP IMPORT
  content.querySelector("#backupImport").onclick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = async e => {
      const file = e.target.files[0];
      if (!file) return;

      if (!confirm("Lokale Daten werden überschrieben. Fortfahren?")) return;

      await importBackup(file);
      renderCollections();
      showToast("Backup importiert");
      closeModal();
    };

    input.click();
  };

  // SYNC
  const url = content.querySelector("#syncUrl");
  const user = content.querySelector("#syncUser");
  const pass = content.querySelector("#syncPass");

  content.querySelector("#syncUpload").onclick = async () => {
    try {
      await uploadToWebDAV(url.value, user.value, pass.value);
      showToast("Upload erfolgreich");
    } catch (err) {
      alert(err.message);
    }
  };

  content.querySelector("#syncDownload").onclick = async () => {
    if (!confirm("Lokale Daten werden überschrieben. Fortfahren?")) return;

    try {
      await downloadFromWebDAV(url.value, user.value, pass.value);
      renderCollections();
      showToast("Download abgeschlossen");
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };

  openModal();
}
