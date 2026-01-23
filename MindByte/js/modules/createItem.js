// Placeholder module for creating new items.
//
// In previous iterations of the application, the front‑end attempted to
// dynamically import `./modules/createItem.js`.  When that file was not
// present, Electron/Chromium reported a `net::ERR_FILE_NOT_FOUND` error.
// To maintain forward compatibility and avoid runtime 404 errors, this
// module exports a no-op function.  Real create-item functionality can be
// implemented here in the future.

export default function createItem() {
  console.warn('createItem() called, but no implementation is available.');
}