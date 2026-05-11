let container;

function ensureContainer() {
  if (container && document.body.contains(container)) return container;
  container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(message, kind = "success") {
  const c = ensureContainer();
  const el = document.createElement("div");
  el.className = `toast toast-${kind}`;
  el.textContent = message;
  c.appendChild(el);
  requestAnimationFrame(() => el.classList.add("toast-visible"));
  setTimeout(() => {
    el.classList.remove("toast-visible");
    setTimeout(() => el.remove(), 250);
  }, 2200);
}
