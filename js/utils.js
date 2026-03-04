/**
 * TC MARKET SHOP - Utility Functions
 * Helpers, formatters, validators, and demo data initializer
 */

'use strict';

/* ── Currency formatter ────────────────────────────────────── */
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/* ── Date formatter ────────────────────────────────────────── */
function formatDate(dateStr, options = {}) {
  const defaults = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('es-ES', { ...defaults, ...options }).format(new Date(dateStr));
}

function formatDateTime(dateStr) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)   return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400)return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} días`;
}

/* ── Unique ID generator ───────────────────────────────────── */
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/* ── Validators ────────────────────────────────────────────── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPassword(password) {
  return password && password.length >= 6;
}

function isValidUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}

/* ── Debounce ──────────────────────────────────────────────── */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ── Toast Notifications ───────────────────────────────────── */
function showToast(message, type = 'info', title = '', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: 'fa-check', error: 'fa-times', warning: 'fa-exclamation', info: 'fa-info' };
  const titles = { success: title || 'Éxito', error: title || 'Error', warning: title || 'Advertencia', info: title || 'Info' };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.position = 'relative';
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
    <div class="toast-body">
      <div class="toast-title">${titles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Cerrar"><i class="fas fa-times"></i></button>
    <div class="toast-progress" style="animation-duration:${duration}ms"></div>
  `;

  container.appendChild(toast);

  const close = () => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  toast.querySelector('.toast-close').addEventListener('click', close);
  setTimeout(close, duration);
}

/* ── LocalStorage helpers ──────────────────────────────────── */
function lsGet(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}

function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

function lsRemove(key) { localStorage.removeItem(key); }

/* ── Truncate text ─────────────────────────────────────────── */
function truncate(str, len = 60) {
  return str && str.length > len ? str.slice(0, len) + '…' : str;
}

/* ── Star rating HTML ──────────────────────────────────────── */
function renderStars(rating, maxStars = 5) {
  let html = '<span class="stars">';
  for (let i = 1; i <= maxStars; i++) {
    if (i <= Math.floor(rating)) html += '<i class="fas fa-star"></i>';
    else if (i - 0.5 <= rating) html += '<i class="fas fa-star-half-alt"></i>';
    else html += '<i class="far fa-star"></i>';
  }
  return html + '</span>';
}

/* ── Scroll to element ─────────────────────────────────────── */
function scrollToEl(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Ripple effect on button click ────────────────────────── */
function addRipple(btn) {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';
    const rect = this.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

/* ── Initialize ripple on all buttons ─────────────────────── */
function initRipples() {
  document.querySelectorAll('.btn').forEach(addRipple);
}

/* ── Scroll reveal (IntersectionObserver) ─────────────────── */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   DEMO DATA INITIALIZER
   ───────────────────────────────────────────────────────────── */
function initDemoData() {
  // Only seed if data doesn't exist
  if (lsGet('tc_demo_seeded')) return;

  /* ── Demo user ──────────────────────────────────────────── */
  const users = [
    {
      id: 'user_demo',
      name: 'Demo Usuario',
      email: 'demo@tcmarket.com',
      password: 'demo123',
      type: 'seller',
      avatar: '',
      address: 'Calle Gran Vía 28, Madrid',
      phone: '+34 600 000 001',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'user_buyer',
      name: 'Ana García',
      email: 'ana@tcmarket.com',
      password: 'demo123',
      type: 'buyer',
      avatar: '',
      address: 'Av. Diagonal 456, Barcelona',
      phone: '+34 611 222 333',
      createdAt: '2024-02-01T09:00:00Z',
    },
  ];
  lsSet('tc_users', users);

  /* ── Stores ─────────────────────────────────────────────── */
  const stores = [
    {
      id: 'store_1',
      userId: 'user_demo',
      name: 'TechZone',
      slug: 'techzone',
      description: 'Tu tienda de tecnología y electrónica de última generación. Encuentra los mejores gadgets, smartphones y accesorios.',
      category: 'Electrónica',
      logo: 'https://ui-avatars.com/api/?name=TZ&background=6C63FF&color=fff&size=128&bold=true',
      banner: 'https://picsum.photos/seed/techzone/1200/300',
      color: '#6C63FF',
      rating: 4.8,
      totalSales: 1243,
      totalProducts: 6,
      createdAt: '2024-01-16T10:00:00Z',
    },
    {
      id: 'store_2',
      userId: 'user_buyer',
      name: 'ModaStyle',
      slug: 'modastyle',
      description: 'Moda contemporánea para hombres y mujeres. Ropa, calzado y accesorios con las últimas tendencias.',
      category: 'Moda',
      logo: 'https://ui-avatars.com/api/?name=MS&background=FF6584&color=fff&size=128&bold=true',
      banner: 'https://picsum.photos/seed/modastyle/1200/300',
      color: '#FF6584',
      rating: 4.5,
      totalSales: 892,
      totalProducts: 5,
      createdAt: '2024-01-20T10:00:00Z',
    },
    {
      id: 'store_3',
      userId: 'user_buyer',
      name: 'HomeDecor',
      slug: 'homedecor',
      description: 'Decoración del hogar y artículos de diseño interior. Convierte tu casa en el hogar de tus sueños.',
      category: 'Hogar',
      logo: 'https://ui-avatars.com/api/?name=HD&background=00C9A7&color=fff&size=128&bold=true',
      banner: 'https://picsum.photos/seed/homedecor/1200/300',
      color: '#00C9A7',
      rating: 4.6,
      totalSales: 567,
      totalProducts: 4,
      createdAt: '2024-02-05T10:00:00Z',
    },
  ];
  lsSet('tc_stores', stores);

  /* ── Products ───────────────────────────────────────────── */
  const products = [
    // TechZone products
    {
      id: 'prod_1',
      storeId: 'store_1',
      userId: 'user_demo',
      name: 'Smartphone ProMax X15',
      description: 'El smartphone más avanzado del mercado. Pantalla AMOLED 6.7", procesador Snapdragon 8 Gen 3, cámara 200MP, batería 5000mAh con carga rápida 100W.',
      price: 899.99,
      salePrice: 749.99,
      category: 'Electrónica',
      stock: 25,
      image: 'https://picsum.photos/seed/phone1/500/500',
      images: ['https://picsum.photos/seed/phone1/500/500','https://picsum.photos/seed/phone2/500/500'],
      tags: ['smartphone', '5G', 'AMOLED'],
      rating: 4.9,
      reviews: 312,
      featured: true,
      active: true,
      createdAt: '2024-01-17T09:00:00Z',
    },
    {
      id: 'prod_2',
      storeId: 'store_1',
      userId: 'user_demo',
      name: 'Auriculares Inalámbricos SoundMax',
      description: 'Auriculares Over-Ear con cancelación de ruido activa. Sonido Hi-Fi, 40 horas de batería, conectividad Bluetooth 5.3 y micrófono integrado.',
      price: 249.99,
      salePrice: 189.99,
      category: 'Electrónica',
      stock: 45,
      image: 'https://picsum.photos/seed/headphones/500/500',
      images: ['https://picsum.photos/seed/headphones/500/500'],
      tags: ['auriculares', 'bluetooth', 'cancelación ruido'],
      rating: 4.7,
      reviews: 189,
      featured: true,
      active: true,
      createdAt: '2024-01-18T10:00:00Z',
    },
    {
      id: 'prod_3',
      storeId: 'store_1',
      userId: 'user_demo',
      name: 'Laptop UltraBook Pro 14',
      description: 'Portátil ultradelgado con Intel Core i9, 32GB RAM, SSD NVMe 1TB, pantalla 4K OLED 14". Perfecto para profesionales y creativos.',
      price: 1499.99,
      salePrice: null,
      category: 'Electrónica',
      stock: 12,
      image: 'https://picsum.photos/seed/laptop/500/500',
      images: ['https://picsum.photos/seed/laptop/500/500'],
      tags: ['laptop', 'ultrabook', 'i9'],
      rating: 4.8,
      reviews: 97,
      featured: true,
      active: true,
      createdAt: '2024-01-19T11:00:00Z',
    },
    {
      id: 'prod_4',
      storeId: 'store_1',
      userId: 'user_demo',
      name: 'Smartwatch FitPro Series 8',
      description: 'Reloj inteligente con GPS, monitorización cardiaca 24/7, ECG, SpO2, impermeabilidad IP68. Compatible con iOS y Android.',
      price: 329.99,
      salePrice: 279.99,
      category: 'Electrónica',
      stock: 30,
      image: 'https://picsum.photos/seed/watch/500/500',
      images: ['https://picsum.photos/seed/watch/500/500'],
      tags: ['smartwatch', 'GPS', 'fitness'],
      rating: 4.6,
      reviews: 245,
      featured: false,
      active: true,
      createdAt: '2024-01-22T09:00:00Z',
    },
    {
      id: 'prod_5',
      storeId: 'store_1',
      userId: 'user_demo',
      name: 'Tablet CreaPad 12 Pro',
      description: 'Tablet de alta gama con pantalla 12" OLED, chip M3, 16GB RAM, 256GB almacenamiento. Ideal para diseño y productividad.',
      price: 799.99,
      salePrice: 699.99,
      category: 'Electrónica',
      stock: 18,
      image: 'https://picsum.photos/seed/tablet/500/500',
      images: ['https://picsum.photos/seed/tablet/500/500'],
      tags: ['tablet', 'diseño', 'productividad'],
      rating: 4.7,
      reviews: 156,
      featured: false,
      active: true,
      createdAt: '2024-01-25T09:00:00Z',
    },
    {
      id: 'prod_6',
      storeId: 'store_1',
      userId: 'user_demo',
      name: 'Cámara Mirrorless Alpha 7',
      description: 'Cámara sin espejo profesional de 61MP, video 8K, estabilización de imagen en 5 ejes. El equipo favorito de los fotógrafos profesionales.',
      price: 2199.99,
      salePrice: null,
      category: 'Electrónica',
      stock: 8,
      image: 'https://picsum.photos/seed/camera/500/500',
      images: ['https://picsum.photos/seed/camera/500/500'],
      tags: ['cámara', 'fotografía', 'profesional'],
      rating: 4.9,
      reviews: 88,
      featured: false,
      active: true,
      createdAt: '2024-02-01T09:00:00Z',
    },
    // ModaStyle products
    {
      id: 'prod_7',
      storeId: 'store_2',
      userId: 'user_buyer',
      name: 'Chaqueta Bomber Premium',
      description: 'Chaqueta bomber de calidad premium, confeccionada en nylon reciclado con forro de microfibra. Disponible en varios colores.',
      price: 129.99,
      salePrice: 89.99,
      category: 'Moda',
      stock: 40,
      image: 'https://picsum.photos/seed/jacket/500/500',
      images: ['https://picsum.photos/seed/jacket/500/500'],
      tags: ['chaqueta', 'bomber', 'moda'],
      rating: 4.5,
      reviews: 203,
      featured: true,
      active: true,
      createdAt: '2024-01-21T09:00:00Z',
    },
    {
      id: 'prod_8',
      storeId: 'store_2',
      userId: 'user_buyer',
      name: 'Zapatillas Urban Runner',
      description: 'Zapatillas deportivas de diseño urbano. Suela de goma EVA ultracómoda, materiales transpirables y estilo moderno.',
      price: 89.99,
      salePrice: 69.99,
      category: 'Moda',
      stock: 60,
      image: 'https://picsum.photos/seed/shoes/500/500',
      images: ['https://picsum.photos/seed/shoes/500/500'],
      tags: ['zapatillas', 'urbano', 'running'],
      rating: 4.4,
      reviews: 421,
      featured: true,
      active: true,
      createdAt: '2024-01-23T10:00:00Z',
    },
    {
      id: 'prod_9',
      storeId: 'store_2',
      userId: 'user_buyer',
      name: 'Bolso Tote Cuero Genuino',
      description: 'Bolso tote de cuero genuino artesanal. Espacioso, resistente y elegante. Con compartimento para portátil de 15".',
      price: 179.99,
      salePrice: null,
      category: 'Moda',
      stock: 20,
      image: 'https://picsum.photos/seed/bag/500/500',
      images: ['https://picsum.photos/seed/bag/500/500'],
      tags: ['bolso', 'cuero', 'artesanal'],
      rating: 4.7,
      reviews: 134,
      featured: false,
      active: true,
      createdAt: '2024-01-28T09:00:00Z',
    },
    {
      id: 'prod_10',
      storeId: 'store_2',
      userId: 'user_buyer',
      name: 'Vestido Floral Primavera',
      description: 'Vestido midi de estampado floral. Tejido 100% algodón ecológico, corte evasé, perfecto para primavera-verano.',
      price: 69.99,
      salePrice: 49.99,
      category: 'Moda',
      stock: 35,
      image: 'https://picsum.photos/seed/dress/500/500',
      images: ['https://picsum.photos/seed/dress/500/500'],
      tags: ['vestido', 'floral', 'primavera'],
      rating: 4.6,
      reviews: 287,
      featured: false,
      active: true,
      createdAt: '2024-02-03T09:00:00Z',
    },
    {
      id: 'prod_11',
      storeId: 'store_2',
      userId: 'user_buyer',
      name: 'Gafas de Sol Polarizadas',
      description: 'Gafas de sol unisex con lentes polarizadas UV400, montura de acetato ligero y funda protectora incluida.',
      price: 59.99,
      salePrice: null,
      category: 'Moda',
      stock: 55,
      image: 'https://picsum.photos/seed/sunglasses/500/500',
      images: ['https://picsum.photos/seed/sunglasses/500/500'],
      tags: ['gafas', 'sol', 'UV400'],
      rating: 4.3,
      reviews: 178,
      featured: false,
      active: true,
      createdAt: '2024-02-08T09:00:00Z',
    },
    // HomeDecor products
    {
      id: 'prod_12',
      storeId: 'store_3',
      userId: 'user_buyer',
      name: 'Lámpara de Pie Nórdica',
      description: 'Lámpara de pie estilo escandinavo con base de madera de roble y pantalla de lino natural. Luz cálida regulable.',
      price: 149.99,
      salePrice: 119.99,
      category: 'Hogar',
      stock: 22,
      image: 'https://picsum.photos/seed/lamp/500/500',
      images: ['https://picsum.photos/seed/lamp/500/500'],
      tags: ['lámpara', 'nórdico', 'madera'],
      rating: 4.8,
      reviews: 92,
      featured: true,
      active: true,
      createdAt: '2024-02-06T09:00:00Z',
    },
    {
      id: 'prod_13',
      storeId: 'store_3',
      userId: 'user_buyer',
      name: 'Set de Cojines Decorativos',
      description: 'Set de 4 cojines decorativos de terciopelo con insertos de relleno incluidos. Colores: gris, ocre, verde y azul marino.',
      price: 79.99,
      salePrice: 59.99,
      category: 'Hogar',
      stock: 50,
      image: 'https://picsum.photos/seed/cushions/500/500',
      images: ['https://picsum.photos/seed/cushions/500/500'],
      tags: ['cojines', 'terciopelo', 'decoración'],
      rating: 4.5,
      reviews: 215,
      featured: false,
      active: true,
      createdAt: '2024-02-10T09:00:00Z',
    },
    {
      id: 'prod_14',
      storeId: 'store_3',
      userId: 'user_buyer',
      name: 'Macetero Cerámico Artesanal',
      description: 'Macetero de cerámica hecho a mano con esmaltes naturales. Disponible en 3 tamaños. Ideal para plantas de interior.',
      price: 34.99,
      salePrice: null,
      category: 'Hogar',
      stock: 70,
      image: 'https://picsum.photos/seed/planter/500/500',
      images: ['https://picsum.photos/seed/planter/500/500'],
      tags: ['macetero', 'cerámica', 'plantas'],
      rating: 4.7,
      reviews: 309,
      featured: false,
      active: true,
      createdAt: '2024-02-12T09:00:00Z',
    },
    {
      id: 'prod_15',
      storeId: 'store_3',
      userId: 'user_buyer',
      name: 'Espejo Redondo Dorado',
      description: 'Espejo decorativo redondo con marco dorado de 80cm de diámetro. Efecto bronce envejecido, ideal para recibidores y salones.',
      price: 119.99,
      salePrice: 89.99,
      category: 'Hogar',
      stock: 15,
      image: 'https://picsum.photos/seed/mirror/500/500',
      images: ['https://picsum.photos/seed/mirror/500/500'],
      tags: ['espejo', 'dorado', 'decoración'],
      rating: 4.9,
      reviews: 143,
      featured: true,
      active: true,
      createdAt: '2024-02-15T09:00:00Z',
    },
  ];
  lsSet('tc_products', products);

  /* ── Demo orders ────────────────────────────────────────── */
  const now = new Date();
  const orders = [
    {
      id: 'order_1',
      buyerId: 'user_buyer',
      sellerId: 'user_demo',
      storeId: 'store_1',
      items: [
        { productId: 'prod_1', name: 'Smartphone ProMax X15', image: 'https://picsum.photos/seed/phone1/500/500', price: 749.99, qty: 1 },
        { productId: 'prod_2', name: 'Auriculares Inalámbricos SoundMax', image: 'https://picsum.photos/seed/headphones/500/500', price: 189.99, qty: 1 },
      ],
      subtotal: 939.98,
      shipping: 0,
      tax: 197.40,
      total: 1137.38,
      discount: 0,
      status: 'entregado',
      address: 'Av. Diagonal 456, Barcelona',
      shippingMethod: 'express',
      createdAt: new Date(now - 15 * 86400000).toISOString(),
      updatedAt: new Date(now - 10 * 86400000).toISOString(),
    },
    {
      id: 'order_2',
      buyerId: 'user_demo',
      sellerId: 'user_buyer',
      storeId: 'store_2',
      items: [
        { productId: 'prod_7', name: 'Chaqueta Bomber Premium', image: 'https://picsum.photos/seed/jacket/500/500', price: 89.99, qty: 1 },
      ],
      subtotal: 89.99,
      shipping: 4.95,
      tax: 18.90,
      total: 113.84,
      discount: 0,
      status: 'enviado',
      address: 'Calle Gran Vía 28, Madrid',
      shippingMethod: 'standard',
      createdAt: new Date(now - 5 * 86400000).toISOString(),
      updatedAt: new Date(now - 3 * 86400000).toISOString(),
    },
    {
      id: 'order_3',
      buyerId: 'user_demo',
      sellerId: 'user_buyer',
      storeId: 'store_3',
      items: [
        { productId: 'prod_12', name: 'Lámpara de Pie Nórdica', image: 'https://picsum.photos/seed/lamp/500/500', price: 119.99, qty: 1 },
        { productId: 'prod_13', name: 'Set de Cojines Decorativos', image: 'https://picsum.photos/seed/cushions/500/500', price: 59.99, qty: 2 },
      ],
      subtotal: 239.97,
      shipping: 0,
      tax: 50.39,
      total: 290.36,
      discount: 20,
      status: 'procesando',
      address: 'Calle Gran Vía 28, Madrid',
      shippingMethod: 'standard',
      createdAt: new Date(now - 2 * 86400000).toISOString(),
      updatedAt: new Date(now - 1 * 86400000).toISOString(),
    },
  ];
  lsSet('tc_orders', orders);

  /* Mark as seeded */
  lsSet('tc_demo_seeded', true);
}

/* ── Export globals ─────────────────────────────────────────── */
window.TCUtils = {
  formatCurrency, formatDate, formatDateTime, timeAgo,
  generateId, isValidEmail, isValidPassword, isValidUrl,
  debounce, showToast, lsGet, lsSet, lsRemove,
  truncate, renderStars, scrollToEl, initRipples, initReveal,
  initDemoData,
};
