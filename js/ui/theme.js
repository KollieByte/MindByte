// Switch the current colour theme by updating the link element's href.
// Each theme lives inside its own folder and exposes a `theme.css` file
// that imports the base styles for that theme.  By default the index.html
// loads the dark theme.  When the user picks another theme from the navbar
// we update the href to point at the corresponding `theme.css`.
export function setTheme(name) {
  const link = document.getElementById("theme-style");
  // ensure a valid path; e.g. css/themes/dark/theme.css
  link.href = `css/themes/${name}/theme.css`;
  localStorage.setItem("theme", name);
}
export function loadTheme(){
  setTheme(localStorage.getItem("theme")||"dark");
  setAccent(localStorage.getItem("accent")||"#6c5ce7");
}
export function setAccent(c){
  document.documentElement.style.setProperty("--accent",c);
  localStorage.setItem("accent",c);
}

