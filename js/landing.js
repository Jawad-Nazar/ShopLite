import { fetchProducts, fetchCategories } from "./api.js";
import { renderProducts } from "./ui.js";
import { initTheme } from "./theme.js";
import { setupHeader } from "./header.js";

initTheme();
const header = setupHeader();

const featuredEl = document.getElementById("featured-grid");
const categoryEl = document.getElementById("category-cards");
const searchEl = document.getElementById("search");
const statProductsEl = document.getElementById("stat-products");
const statCategoriesEl = document.getElementById("stat-categories");
const statAvgEl = document.getElementById("stat-avg");

searchEl?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const q = searchEl.value.trim();
    location.href = q
      ? `/shop.html?search=${encodeURIComponent(q)}`
      : "/shop.html";
  }
});

document.addEventListener("keydown", (e) => {
  if (
    e.key === "/" &&
    e.target.tagName !== "INPUT" &&
    e.target.tagName !== "TEXTAREA"
  ) {
    e.preventDefault();
    searchEl?.focus();
    searchEl?.select();
  }
});

function renderCategoryCards(categories) {
  categoryEl.innerHTML = "";
  for (const c of categories) {
    const a = document.createElement("a");
    a.className = "category-card";
    a.href = `/shop.html?category=${encodeURIComponent(c.id)}`;
    a.innerHTML = `
      <div class="category-card-icon" aria-hidden="true">${c.icon}</div>
      <div class="category-card-label">${c.label}</div>
      <div class="category-card-count">${c.count} item${c.count === 1 ? "" : "s"}</div>
    `;
    categoryEl.appendChild(a);
  }
}

async function init() {
  const [catsResult, prodsResult] = await Promise.allSettled([
    fetchCategories(),
    fetchProducts({ sort: "rating" }),
  ]);

  const cats = catsResult.status === "fulfilled" ? catsResult.value : null;
  const prods = prodsResult.status === "fulfilled" ? prodsResult.value : null;

  if (cats) {
    statProductsEl.textContent = String(cats.total);
    statCategoriesEl.textContent = String(cats.count);
    renderCategoryCards(cats.categories);
  } else {
    categoryEl.innerHTML = "<p class='empty'>Could not load categories.</p>";
  }

  if (prods) {
    if (!cats) statProductsEl.textContent = String(prods.count);
    const avg = prods.products.reduce((s, p) => s + p.rating, 0) / prods.count;
    statAvgEl.textContent = avg.toFixed(1) + "★";

    const top = prods.products.slice(0, 4);
    renderProducts(featuredEl, top, {
      onAdd: (p) => header.addToCart(p, 1),
      onView: header.openProductDetail,
    });
  } else {
    featuredEl.innerHTML =
      "<p class='empty'>Could not load featured products.</p>";
  }
}

init();
