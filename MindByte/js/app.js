// Entry point for the collection application
//
// This module wires together the various pieces of the application.  It
// initializes the UI, applies the active theme and sets up event
// listeners for inline editing.  Selected functions and state objects
// are re-exported so they remain accessible to other parts of the
// application or to inline scripts in index.html.

import { renderNavbar } from './ui/navbar.js';
import { loadTheme } from './ui/theme.js';
import { navigate, goBack } from './modules/navigation.js';
import { exportData, importData } from './modules/data.js';
import { render } from './modules/rendering/index.js';
import { addEditingHandlers } from './modules/editing/index.js';
import { state, uiState } from './modules/state/index.js';
import { loadSettings } from './modules/settingsModal.js';

const settings = loadSettings();
document.body.dataset.theme = settings.theme;
uiState.editMode = settings.editModeDefault;
document.body.classList.toggle('edit-mode', uiState.editMode);

// Kick off the application by rendering the navigation bar, applying the
// current theme and drawing the first screen.  Editing handlers are
// attached once during startup.
renderNavbar();
loadTheme();
render();
addEditingHandlers();

// Re-export key APIs so they remain usable from other modules or
// inline scripts.  Without these exports, navigation and data import
// operations would not be globally accessible.
export { navigate, goBack, exportData, importData, state, uiState };