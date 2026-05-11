const KEY = "shoplite.cart.v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getCart() {
  return load();
}

export function addToCart(product, qty = 1) {
  const items = load();
  const existing = items.find((i) => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      icon: product.icon,
      qty,
    });
  }
  save(items);
  return items;
}

export function incrementQty(id) {
  const items = load();
  const item = items.find((i) => i.id === id);
  if (item) item.qty += 1;
  save(items);
  return items;
}

export function decrementQty(id) {
  const items = load();
  const item = items.find((i) => i.id === id);
  if (!item) return items;
  item.qty -= 1;
  if (item.qty <= 0) return removeFromCart(id);
  save(items);
  return items;
}

export function removeFromCart(id) {
  const items = load().filter((i) => i.id !== id);
  save(items);
  return items;
}

export function clearCart() {
  save([]);
  return [];
}

export function cartCount(items = load()) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function cartTotal(items = load()) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}
