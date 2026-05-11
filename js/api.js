const BASE = "/api";

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export async function fetchProducts({ category, search, sort } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (search) params.set("search", search);
  if (sort && sort !== "default") params.set("sort", sort);
  const url = `${BASE}/products${params.toString() ? "?" + params : ""}`;
  return getJson(url);
}

export async function fetchCategories() {
  return getJson(`${BASE}/categories`);
}
