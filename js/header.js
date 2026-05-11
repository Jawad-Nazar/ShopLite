import { renderCart, renderCheckoutSuccess, renderProductDetail } from "./ui.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  incrementQty,
  decrementQty,
  cartCount,
  cartTotal,
} from "./cart.js";
import { toggleTheme } from "./theme.js";
import { showToast } from "./toast.js";

export function setupHeader() {
  const els = {
    cartToggle: document.getElementById("cart-toggle"),
    cartClose: document.getElementById("cart-close"),
    cartDrawer: document.getElementById("cart-drawer"),
    cartItems: document.getElementById("cart-items"),
    cartTotal: document.getElementById("cart-total"),
    cartCount: document.getElementById("cart-count"),
    cartClear: document.getElementById("cart-clear"),
    cartCheckout: document.getElementById("cart-checkout"),
    themeToggle: document.getElementById("theme-toggle"),
    modal: document.getElementById("modal"),
    modalBody: document.getElementById("modal-body"),
  };

  function refreshCartUI() {
    const items = getCart();
    if (els.cartCount) els.cartCount.textContent = String(cartCount(items));
    if (els.cartItems && els.cartTotal) {
      renderCart(els.cartItems, els.cartTotal, items, {
        onIncrement: (id) => { incrementQty(id); refreshCartUI(); },
        onDecrement: (id) => { decrementQty(id); refreshCartUI(); },
        onRemove: (id) => { removeFromCart(id); refreshCartUI(); },
      });
    }
  }

  function bounceCart() {
    if (!els.cartToggle) return;
    els.cartToggle.classList.remove("bounce");
    void els.cartToggle.offsetWidth;
    els.cartToggle.classList.add("bounce");
  }

  function setCartOpen(open) {
    if (!els.cartDrawer) return;
    els.cartDrawer.hidden = !open;
    els.cartToggle?.setAttribute("aria-expanded", String(open));
  }

  function openModal() {
    if (!els.modal) return;
    els.modal.hidden = false;
    document.body.style.overflow = "hidden";
    const focusable = els.modal.querySelector(
      "button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    if (focusable) focusable.focus();
  }

  function closeModal() {
    if (!els.modal) return;
    els.modal.hidden = true;
    if (els.modalBody) els.modalBody.innerHTML = "";
    document.body.style.overflow = "";
  }

  function addWithFeedback(product, qty = 1) {
    addToCart(product, qty);
    refreshCartUI();
    bounceCart();
    showToast(`Added ${qty > 1 ? qty + "× " : ""}${product.name} to cart`, "success");
  }

  function openProductDetail(product) {
    if (!els.modalBody) return;
    renderProductDetail(els.modalBody, product, {
      onAdd: (p, qty) => {
        addWithFeedback(p, qty);
        closeModal();
      },
    });
    openModal();
  }

  function openCheckout() {
    const items = getCart();
    if (!items.length) {
      showToast("Cart is empty", "error");
      return;
    }
    if (els.modalBody) {
      renderCheckoutSuccess(els.modalBody, cartTotal(items), cartCount(items));
    }
    openModal();
    setCartOpen(false);
    clearCart();
    refreshCartUI();
  }

  els.cartToggle?.addEventListener("click", () =>
    setCartOpen(els.cartDrawer.hidden)
  );
  els.cartClose?.addEventListener("click", () => setCartOpen(false));
  els.cartClear?.addEventListener("click", () => {
    if (!getCart().length) return;
    clearCart();
    refreshCartUI();
    showToast("Cart cleared", "success");
  });
  els.cartCheckout?.addEventListener("click", openCheckout);
  els.themeToggle?.addEventListener("click", toggleTheme);

  els.modal?.addEventListener("click", (e) => {
    if (
      e.target.closest("[data-close]") ||
      e.target.classList.contains("modal-backdrop")
    ) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (els.modal && !els.modal.hidden) { closeModal(); return; }
      if (els.cartDrawer && !els.cartDrawer.hidden) { setCartOpen(false); return; }
      return;
    }
    const tag = e.target.tagName;
    const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    if (isInput) return;
    if (e.key === "c" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      setCartOpen(els.cartDrawer?.hidden ?? false);
    }
  });

  refreshCartUI();

  return {
    addToCart: addWithFeedback,
    openProductDetail,
    openCheckout,
    setCartOpen,
    refreshCartUI,
  };
}
