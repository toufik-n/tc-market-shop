/**
 * TC MARKET SHOP - Orders Management
 *
 * ⚠️  DEMO ONLY: Card numbers are stored only as the last 4 digits for
 * display purposes; no real payment is processed here.  In a
 * production application all card data must be handled exclusively by
 * a PCI-DSS-compliant payment gateway (e.g. Stripe, PayPal) using
 * tokenisation — card numbers must never be stored or transmitted
 * through your own servers.
 */

'use strict';

const ORDERS_KEY = 'tc_orders';

function getOrders() { return TCUtils.lsGet(ORDERS_KEY, []); }
function saveOrders(orders) { TCUtils.lsSet(ORDERS_KEY, orders); }

function getOrderById(id) { return getOrders().find(o => o.id === id) || null; }

function getOrdersByUser(userId) {
  return getOrders()
    .filter(o => o.buyerId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getOrdersBySeller(sellerId) {
  return getOrders()
    .filter(o => o.sellerId === sellerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function createOrder(orderData) {
  const user = TCAuth.getCurrentUser();
  if (!user) return { success: false, message: 'Debes iniciar sesión.' };

  const items = TCCart.getCartItems();
  if (items.length === 0) return { success: false, message: 'El carrito está vacío.' };

  // Determine seller from first item's store
  const firstStore = TCStore.getStoreById(items[0].storeId);
  const sellerId = firstStore ? firstStore.userId : null;

  const totals = TCCart.calculateTotals(orderData.discountCode || '');

  const order = {
    id: TCUtils.generateId('order'),
    buyerId: user.id,
    sellerId,
    storeId: items[0].storeId,
    items: items.map(i => ({
      productId: i.productId,
      name: i.name,
      image: i.image,
      price: i.price,
      qty: i.qty,
    })),
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    tax: totals.tax,
    discount: totals.discountAmount,
    total: totals.total,
    address: orderData.address || user.address || '',
    shippingMethod: orderData.shippingMethod || 'standard',
    paymentLast4: orderData.cardNumber ? orderData.cardNumber.slice(-4) : '****',
    status: 'pendiente',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  // Reduce stock
  items.forEach(item => {
    const products = TCUtils.lsGet('tc_products', []);
    const idx = products.findIndex(p => p.id === item.productId);
    if (idx !== -1 && products[idx].stock >= item.qty) {
      products[idx].stock -= item.qty;
      TCUtils.lsSet('tc_products', products);
    }
  });

  TCCart.clearCart();
  return { success: true, order };
}

function updateOrderStatus(orderId, status) {
  const validStatuses = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
  if (!validStatuses.includes(status)) return { success: false, message: 'Estado inválido.' };

  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return { success: false, message: 'Pedido no encontrado.' };

  orders[idx].status = status;
  orders[idx].updatedAt = new Date().toISOString();
  saveOrders(orders);
  return { success: true, order: orders[idx] };
}

/* Seller dashboard stats */
function getSellerStats(sellerId) {
  const orders = getOrdersBySeller(sellerId);
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter(o => o.status === 'pendiente').length;
  const processing = orders.filter(o => o.status === 'procesando').length;
  const delivered = orders.filter(o => o.status === 'entregado').length;

  // Monthly revenue (current month)
  const now = new Date();
  const monthlyRevenue = orders
    .filter(o => {
      const d = new Date(o.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && o.status !== 'cancelado';
    })
    .reduce((sum, o) => sum + o.total, 0);

  return { totalRevenue, monthlyRevenue, pending, processing, delivered, totalOrders: orders.length };
}

window.TCOrders = {
  getOrderById, getOrdersByUser, getOrdersBySeller,
  createOrder, updateOrderStatus, getSellerStats,
};
