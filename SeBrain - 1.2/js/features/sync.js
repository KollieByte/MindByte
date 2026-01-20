import { exportBackup, importBackup } from "./backup.js";

/**
 * Upload Backup zu WebDAV
 */
export async function uploadToWebDAV(url, username, password) {
  const payload = exportBackup(true);

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": "Basic " + btoa(username + ":" + password),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("Upload fehlgeschlagen (" + res.status + ")");
  }
}

/**
 * Download Backup von WebDAV
 */
export async function downloadFromWebDAV(url, username, password) {
  const res = await fetch(url, {
    headers: {
      "Authorization": "Basic " + btoa(username + ":" + password)
    }
  });

  if (!res.ok) {
    throw new Error("Download fehlgeschlagen (" + res.status + ")");
  }

  const data = await res.json();

  await importBackup(
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
}
