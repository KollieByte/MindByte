// js/app.js
import { renderNavbar } from "./ui/navbar.js";
import { loadTheme } from "./ui/theme.js";
// Import editing utilities from the correct path.  The editing module lives
// directly under modules rather than inside the rendering folder.  Loading
// from the wrong location results in a blocked MIME type error in the
// browser because it attempts to fetch a non‑existent file, which falls
// back to an HTML 404 response.
import { initEditing } from "./modules/editing.js";
import { render } from "./modules/rendering/index.js";
import {navigate, goBack} from "./modules/navigation.js";
import {exportData, importData} from "./modules/data.js";
import {state, uiState, ensureState, loadState} from "./modules/state.js";

/* ========= INIT ========= */

window.addEventListener("beforeunload", () => {
  uiState.editMode = false;
});

renderNavbar();
loadTheme();
initEditing();
render();

/* ========= RE-EXPORTS ========= */
/* (für navbar & andere UI-Module) */

export {
  state,
  uiState,
  navigate,
  goBack,
  exportData,
  importData,
  ensureState
};

