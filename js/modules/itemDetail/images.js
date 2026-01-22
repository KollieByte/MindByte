import { state, saveState } from "../state.js";

export function buildImages(item, editable, rerender) {
  const images = document.createElement("div");
  images.className = "item-detail-images";

  ["obverse", "reverse"].forEach(side => {
    const wrap = document.createElement("div");
    wrap.className = "item-detail-image";

    if (item.images[side]) {
      const img = document.createElement("img");
      img.src = item.images[side];
      wrap.appendChild(img);
    } else {
      wrap.textContent = side === "obverse" ? "Vorderseite" : "Rückseite";
    }

    if (editable) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.style.display = "none";
      input.onchange = () => {
        const r = new FileReader();
        r.onload = () => {
          item.images[side] = r.result;
          saveState(state);
          rerender();
        };
        r.readAsDataURL(input.files[0]);
      };
      wrap.onclick = () => input.click();
      wrap.appendChild(input);
    }

    images.appendChild(wrap);
  });

  return images;
}

