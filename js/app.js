import { fetchProducts, fetchCategories } from "./api.js";
import {
  renderProducts,
  renderSkeletons,
  renderCategoryFilters,
  setStatus,
} from "./ui.js";
import { initTheme } from "./theme.js";
import { readState, writeState } from "./url-state.js";
import { setupHeader } from "./header.js";

initTheme();
const header = setupHeader();

const els = {
  grid: document.getElementById("product-grid"),
  status: document.getElementById("status"),
  count: document.getElementById("result-count"),
  search: document.getElementById("search"),
  categoryList: document.getElementById("category-list"),
  sort: document.getElementById("sort"),
  reset: document.getElementById("reset"),
};

const state = readState();
const cache = { categories: null, totalProducts: 0 };

els.search.value = state.search;
els.sort.value = state.sort;

function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function refreshCategoryFilters() {
  if (!cache.categories) return;
  renderCategoryFilters(
    els.categoryList,
    cache.categories,
    state.category,
    cache.totalProducts,
    handleCategorySelect
  );
}

async function loadCategories() {
  try {
    const data = await fetchCategories();
    cache.categories = data.categories;
    cache.totalProducts = data.total;
    refreshCategoryFilters();
  } catch (err) {
    console.error("Could not load categories:", err);
  }
}

async function loadCatalog() {
  setStatus(els.status, "");
  els.count.textContent = "Loading…";
  renderSkeletons(els.grid, 8);
  try {
    const data = await fetchProducts(state);
    renderProducts(els.grid, data.products, {
      onAdd: (p) => header.addToCart(p, 1),
      onView: header.openProductDetail,
    });
    els.count.textContent =
      data.count === 1 ? "1 product" : `${data.count} products`;
  } catch (err) {
    els.grid.innerHTML = "";
    els.count.textContent = "";
    setStatus(
      els.status,
      "Could not load products. Check your connection and try again.",
      "error"
    );
    console.error(err);
  }
}

function handleCategorySelect(categoryId) {
  state.category = categoryId;
  writeState(state);
  refreshCategoryFilters();
  loadCatalog();
}

els.search.addEventListener(
  "input",
  debounce((e) => {
    state.search = e.target.value;
    writeState(state);
    loadCatalog();
  }, 300)
);

els.sort.addEventListener("change", (e) => {
  state.sort = e.target.value;
  writeState(state);
  loadCatalog();
});

els.reset.addEventListener("click", () => {
  state.category = "all";
  state.search = "";
  state.sort = "default";
  els.search.value = "";
  els.sort.value = "default";
  writeState(state);
  refreshCategoryFilters();
  loadCatalog();
});

document.addEventListener("keydown", (e) => {
  if (
    e.key === "/" &&
    e.target.tagName !== "INPUT" &&
    e.target.tagName !== "TEXTAREA"
  ) {
    e.preventDefault();
    els.search.focus();
    els.search.select();
  }
});

loadCategories();
loadCatalog();
