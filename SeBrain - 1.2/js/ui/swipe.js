export function enableSwipeDelete(card, onDelete) {
  let startX = 0;

  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  card.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -80) {
      onDelete();
    }
  });
}
