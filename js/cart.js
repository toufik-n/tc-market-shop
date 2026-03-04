/**
 * TC MARKET SHOP - Cart Management
 */

'use strict';

const CART_KEY = 'tc_cart';

function getCart() { return TCUtils.lsGet(CART_KEY, []); }
function saveCart(items) { TCUtils.lsSet(CART_KEY, items); }

function getCartItems() { return getCart(); }

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(productId, qty = 1) {
  const product = TCProducts.getProductById(productId);
  if (!product) return { success: false, message: 'Producto no encontrado.' };
  if (product.stock < qty) return { success: false, message: 'Stock insuficiente.' };

  const cart = getCart();
  const existing = cart.find(i => i.productId === productId);

  if (existing) {
    const newQty = existing.qty + qty;
    if (newQty > product.stock) return { success: false, message: 'No hay suficiente stock.' };
    existing.qty = newQty;
  } else {
    cart.push({
      productId,
      name: product.name,
      image: product.image,
      price: TCProducts.getEffectivePrice(product),
      originalPrice: product.price,
      storeId: product.storeId,
      storeName: (() => { const s = TCStore.getStoreById(product.storeId); return s ? s.name : ''; })(),
      qty,
      maxStock: product.stock,
    });
  }

  saveCart(cart);
  updateCartBadge();
  return { success: true, count: getCartCount() };
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.productId !== productId);
  saveCart(cart);
  updateCartBadge();
  return { success: true };
}

function updateQty(productId, qty) {
  if (qty < 1) return removeFromCart(productId);
  const product = TCProducts.getProductById(productId);
  if (product && qty > product.stock) {
    TCUtils.showToast('No hay suficiente stock disponible.', 'warning');
    return { success: false };
  }
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if (item) { item.qty = qty; saveCart(cart); updateCartBadge(); }
  return { success: true };
}

function clearCart() { saveCart([]); updateCartBadge(); }

/* ── Totals ─────────────────────────────────────────────────── */
function calculateTotals(discountCode = '') {
  const items = getCart();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  let discountAmount = 0;
  const validCodes = { 'BIENVENIDO10': 0.10, 'VERANO20': 0.20, 'TECH15': 0.15 };
  if (discountCode && validCodes[discountCode.toUpperCase()]) {
    discountAmount = subtotal * validCodes[discountCode.toUpperCase()];
  }

  const afterDiscount = subtotal - discountAmount;
  const shipping = afterDiscount === 0 ? 0 : (afterDiscount >= 50 ? 0 : 4.95);
  const tax = afterDiscount * 0.21;
  const total = afterDiscount + shipping + tax;

  return { subtotal, discountAmount, afterDiscount, shipping, tax, total, discountCode: discountCode.toUpperCase() };
}

/* ── Update navbar cart badge ───────────────────────────────── */
function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

window.TCCart = {
  getCartItems, getCartCount, addToCart, removeFromCart,
  updateQty, clearCart, calculateTotals, updateCartBadge,
};
