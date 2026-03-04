/**
 * TC MARKET SHOP - Dashboard Logic
 */

'use strict';

function loadDashboard() {
  if (!TCAuth.requireAuth()) return;

  const user = TCAuth.getCurrentUser();
  const stores = TCStore.getStoresByUser(user.id);
  const store = stores[0] || null;

  // Stats
  if (store) {
    const stats = TCOrders.getSellerStats(user.id);
    const products = TCProducts.getProductsByStore(store.id);

    setEl('stat-revenue',   TCUtils.formatCurrency(stats.totalRevenue));
    setEl('stat-products',  products.length);
    setEl('stat-pending',   stats.pending + stats.processing);
    setEl('stat-monthly',   TCUtils.formatCurrency(stats.monthlyRevenue));

    // Render recent orders
    const orders = TCOrders.getOrdersBySeller(user.id).slice(0, 6);
    renderOrdersTable(orders);

    // Render top products
    renderTopProducts(products.slice(0, 5));

    // Render chart
    renderSalesChart(user.id);
  } else {
    // No store yet
    setEl('stat-revenue',  '€0,00');
    setEl('stat-products', '0');
    setEl('stat-pending',  '0');
    setEl('stat-monthly',  '€0,00');
    renderOrdersTable([]);
    renderTopProducts([]);
  }
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:2rem;color:var(--text-muted)">
      <i class="fas fa-inbox" style="font-size:1.5rem;margin-bottom:.5rem;display:block"></i>
      No hay pedidos todavía</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>#${o.id.slice(-6).toUpperCase()}</strong></td>
      <td>${TCUtils.formatDate(o.createdAt)}</td>
      <td>${o.items.length} producto${o.items.length !== 1 ? 's' : ''}</td>
      <td><strong>${TCUtils.formatCurrency(o.total)}</strong></td>
      <td><span class="status-badge status-${o.status}">${capitalize(o.status)}</span></td>
    </tr>
  `).join('');
}

function renderTopProducts(products) {
  const list = document.getElementById('top-products-list');
  if (!list) return;

  if (products.length === 0) {
    list.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:1rem">Sin productos todavía</p>`;
    return;
  }

  list.innerHTML = products.map((p, i) => `
    <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 0;border-bottom:1px solid var(--border-light)">
      <span style="font-weight:700;color:var(--text-muted);width:20px;text-align:center">${i + 1}</span>
      <img src="${p.image}" alt="${p.name}" style="width:44px;height:44px;border-radius:var(--radius-md);object-fit:cover">
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
        <div style="font-size:.75rem;color:var(--text-muted)">${p.category}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-weight:700;font-size:.875rem">${TCUtils.formatCurrency(TCProducts.getEffectivePrice(p))}</div>
        <div style="font-size:.7rem;color:var(--text-muted)">${p.reviews} reseñas</div>
      </div>
    </div>
  `).join('');
}

function renderSalesChart(userId) {
  const wrap = document.getElementById('sales-chart');
  if (!wrap) return;

  const orders = TCOrders.getOrdersBySeller(userId);
  const now = new Date();
  const months = [];

  // Last 7 months
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('es-ES', { month: 'short' });
    const revenue = orders
      .filter(o => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear() && o.status !== 'cancelado';
      })
      .reduce((sum, o) => sum + o.total, 0);
    months.push({ label, revenue });
  }

  const max = Math.max(...months.map(m => m.revenue), 1);
  wrap.innerHTML = `
    <div class="chart-bar-wrap" style="height:150px">
      ${months.map(m => `
        <div class="chart-bar-col" data-tooltip="${TCUtils.formatCurrency(m.revenue)}">
          <div class="chart-bar" style="height:${Math.max((m.revenue / max) * 100, 3)}%;background:var(--primary)"></div>
          <span class="chart-label">${m.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

window.TCDashboard = { loadDashboard };
