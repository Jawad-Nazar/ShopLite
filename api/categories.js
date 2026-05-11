import { products, categoryMeta } from "../lib/products.js";

export default function handler(req, res) {
  const counts = {};
  for (const p of products) {
    counts[p.category] = (counts[p.category] || 0) + 1;
  }

  const categories = Object.entries(categoryMeta).map(([id, meta]) => ({
    id,
    label: meta.label,
    icon: meta.icon,
    count: counts[id] || 0,
  }));

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
  res.status(200).json({
    count: categories.length,
    total: products.length,
    categories,
  });
}
