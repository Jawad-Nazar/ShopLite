const KEY = "shoplite.theme";

function apply(theme) {
  document.documentElement.dataset.theme = theme;
}

export function initTheme() {
  const saved = localStorage.getItem(KEY);
  const preferred =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  apply(saved || preferred);
}

export function toggleTheme() {
  const next =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  apply(next);
  localStorage.setItem(KEY, next);
  return next;
}
