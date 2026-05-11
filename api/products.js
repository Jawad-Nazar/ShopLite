import { products } from "../lib/products.js";

export default function handler(req, res) {
  const {
    category = "all",
    search = "",
    sort = "default",
    inStock = "false",
  } = req.query || {};

  let result = products.slice();

  if (category !== "all") {
    result = result.filter((p) => p.category === category);
  }

  if (inStock === "true") {
    result = result.filter((p) => p.stock > 0);
  }

  const q = String(search).trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  res.status(200).json({ count: result.length, products: result });
}
