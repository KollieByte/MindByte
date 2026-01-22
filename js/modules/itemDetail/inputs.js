import { state, saveState } from "../state.js";

export function input(obj, key, placeholder, editable) {
  const i = document.createElement("input");
  i.placeholder = placeholder;
  i.value = obj[key] || "";
  i.disabled = !editable;
  i.oninput = () => {
    obj[key] = i.value;
    saveState(state);
  };
  return i;
}

export function textarea(obj, key, placeholder, editable) {
  const t = document.createElement("textarea");
  t.placeholder = placeholder;
  t.value = obj[key] || "";
  t.disabled = !editable;
  t.oninput = () => {
    obj[key] = t.value;
    saveState(state);
  };
  return t;
}

export function select(obj, key, options, editable) {
  const s = document.createElement("select");
  s.disabled = !editable;

  options.forEach(o => {
    const opt = document.createElement("option");
    opt.value = o;
    opt.textContent = o;
    s.appendChild(opt);
  });

  s.value = obj[key] || "";
  s.onchange = () => {
    obj[key] = s.value;
    saveState(state);
  };

  return s;
}

