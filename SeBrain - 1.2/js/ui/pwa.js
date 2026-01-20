let deferredPrompt;

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
});

export function promptInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt = null;
}
