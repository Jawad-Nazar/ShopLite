function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function stockBadge(stock) {
  if (stock === 0) return `<span class="stock stock-out">Out of stock</span>`;
  if (stock <= 5) return `<span class="stock stock-low">Only ${stock} left</span>`;
  return `<span class="stock stock-in">In stock</span>`;
}

export function renderSkeletons(grid, count = 8) {
  grid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const sk = document.createElement("div");
    sk.className = "skeleton-card";
    sk.innerHTML = `
      <div class="skeleton skeleton-icon"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line skeleton-short"></div>
      <div class="skeleton skeleton-button"></div>
    `;
    grid.appendChild(sk);
  }
}

export function renderProducts(grid, products, { onAdd, onView }) {
  grid.innerHTML = "";
  if (!products.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No products match your filters.";
    grid.appendChild(empty);
    return;
  }

  for (const p of products) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View details for ${p.name}`);

    const outOfStock = p.stock === 0;

    card.innerHTML = `
      <div class="product-icon" aria-hidden="true">${p.icon}</div>
      ${stockBadge(p.stock)}
      <h3 class="product-name">${escapeHtml(p.name)}</h3>
      <p class="product-desc">${escapeHtml(p.description)}</p>
      <div class="product-meta">
        <span class="rating" aria-label="Rated ${p.rating} out of 5">★ ${p.rating.toFixed(1)}</span>
        <span class="price">$${p.price.toFixed(2)}</span>
      </div>
      <button class="btn btn-primary add-btn" type="button" ${outOfStock ? "disabled" : ""}>
        ${outOfStock ? "Out of stock" : "Add to cart"}
      </button>
    `;

    const onActivate = (e) => {
      if (e.target.closest(".add-btn")) return;
      onView(p);
    };
    card.addEventListener("click", onActivate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (e.target.closest(".add-btn")) return;
        e.preventDefault();
        onView(p);
      }
    });

    if (!outOfStock) {
      card.querySelector(".add-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        onAdd(p);
      });
    }

    grid.appendChild(card);
  }
}

export function renderCart(list, totalEl, items, handlers) {
  list.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.className = "cart-empty";
    li.textContent = "Your cart is empty.";
    list.appendChild(li);
    totalEl.textContent = "$0.00";
    return;
  }

  for (const i of items) {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span class="cart-icon" aria-hidden="true">${i.icon}</span>
      <div class="cart-info">
        <strong>${escapeHtml(i.name)}</strong>
        <span class="cart-line">$${i.price.toFixed(2)} × ${i.qty} = $${(i.price * i.qty).toFixed(2)}</span>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" type="button" data-action="dec" aria-label="Decrease quantity">−</button>
        <span class="qty-value">${i.qty}</span>
        <button class="qty-btn" type="button" data-action="inc" aria-label="Increase quantity">+</button>
      </div>
      <button class="icon-btn" type="button" data-action="remove" aria-label="Remove ${escapeHtml(i.name)}">✕</button>
    `;
    li.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === "inc") handlers.onIncrement(i.id);
      else if (action === "dec") handlers.onDecrement(i.id);
      else if (action === "remove") handlers.onRemove(i.id);
    });
    list.appendChild(li);
  }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = `$${total.toFixed(2)}`;
}

export function renderCategoryFilters(container, categories, currentCategory, totalCount, onSelect) {
  container.innerHTML = "";
  const buttons = [
    { id: "all", icon: "🛍️", label: "All categories", count: totalCount },
    ...categories.map((c) => ({ id: c.id, icon: c.icon, label: c.label, count: c.count })),
  ];
  for (const c of buttons) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-btn" + (currentCategory === c.id ? " active" : "");
    btn.dataset.category = c.id;
    btn.innerHTML = `<span class="cat-icon" aria-hidden="true">${c.icon}</span>${escapeHtml(c.label)}<span class="cat-count">${c.count}</span>`;
    btn.addEventListener("click", () => onSelect(c.id));
    container.appendChild(btn);
  }
}

export function renderProductDetail(modalBody, product, handlers) {
  const outOfStock = product.stock === 0;
  const maxQty = Math.max(1, product.stock || 1);

  modalBody.innerHTML = `
    <div class="modal-product">
      <div class="modal-icon" aria-hidden="true">${product.icon}</div>
      <div class="modal-info">
        <p class="modal-category">${escapeHtml(product.category)}</p>
        <h2 id="modal-title" class="modal-title">${escapeHtml(product.name)}</h2>
        <div class="modal-meta">
          <span class="rating">★ ${product.rating.toFixed(1)}</span>
          <span class="price">$${product.price.toFixed(2)}</span>
        </div>
        ${stockBadge(product.stock)}
        <p class="modal-desc">${escapeHtml(product.description)}</p>
        <div class="modal-actions">
          <div class="qty-controls" ${outOfStock ? "hidden" : ""}>
            <button class="qty-btn" type="button" data-qty="dec" aria-label="Decrease">−</button>
            <span class="qty-value" id="modal-qty">1</span>
            <button class="qty-btn" type="button" data-qty="inc" aria-label="Increase">+</button>
          </div>
          <button class="btn btn-primary modal-add" type="button" ${outOfStock ? "disabled" : ""}>
            ${outOfStock ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  `;

  if (outOfStock) return;

  const qtyEl = modalBody.querySelector("#modal-qty");
  const addBtn = modalBody.querySelector(".modal-add");
  let currentQty = 1;

  const updateLabel = () => {
    addBtn.textContent = currentQty > 1
      ? `Add ${currentQty} to cart`
      : "Add to cart";
    qtyEl.textContent = String(currentQty);
  };

  modalBody.querySelectorAll("[data-qty]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dir = btn.dataset.qty === "inc" ? 1 : -1;
      currentQty = Math.max(1, Math.min(maxQty, currentQty + dir));
      updateLabel();
    });
  });

  addBtn.addEventListener("click", () => handlers.onAdd(product, currentQty));
}

export function renderCheckoutSuccess(modalBody, total, itemCount) {
  const orderId = "SLT-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  modalBody.innerHTML = `
    <div class="checkout-success">
      <div class="success-icon" aria-hidden="true">🎉</div>
      <h2 id="modal-title">Order placed!</h2>
      <p class="checkout-line">Order ID: <strong>${orderId}</strong></p>
      <p class="checkout-line">${itemCount} item${itemCount === 1 ? "" : "s"} — Total <strong>$${total.toFixed(2)}</strong></p>
      <p class="checkout-note">This is a demo project — no real order was placed.</p>
      <button class="btn btn-primary" data-close type="button">Continue shopping</button>
    </div>
  `;
  return orderId;
}

export function setStatus(el, message, kind = "info") {
  el.textContent = message;
  if (message) el.dataset.kind = kind;
  else delete el.dataset.kind;
}
