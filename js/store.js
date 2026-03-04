/**
 * TC MARKET SHOP - Store Management
 */

'use strict';

const STORES_KEY = 'tc_stores';

function getStores() { return TCUtils.lsGet(STORES_KEY, []); }
function saveStores(stores) { TCUtils.lsSet(STORES_KEY, stores); }

function getAllStores() { return getStores(); }

function getStoreById(id) { return getStores().find(s => s.id === id) || null; }

function getStoreBySlug(slug) { return getStores().find(s => s.slug === slug) || null; }

function getStoresByUser(userId) { return getStores().filter(s => s.userId === userId); }

function createStore(data) {
  const user = TCAuth.getCurrentUser();
  if (!user) return { success: false, message: 'Debes iniciar sesión.' };

  const existing = getStoresByUser(user.id);
  if (existing.length > 0) return { success: false, message: 'Ya tienes una tienda creada.' };

  if (!data.name || data.name.trim().length < 2) {
    return { success: false, message: 'El nombre de la tienda debe tener al menos 2 caracteres.' };
  }

  const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const stores = getStores();
  if (stores.find(s => s.slug === slug)) {
    return { success: false, message: 'Ya existe una tienda con ese nombre.' };
  }

  const store = {
    id: TCUtils.generateId('store'),
    userId: user.id,
    name: data.name.trim(),
    slug,
    description: data.description || '',
    category: data.category || 'General',
    logo: data.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6C63FF&color=fff&size=128&bold=true`,
    banner: data.banner || '',
    color: data.color || '#6C63FF',
    rating: 0,
    totalSales: 0,
    totalProducts: 0,
    createdAt: new Date().toISOString(),
  };

  stores.push(store);
  saveStores(stores);
  return { success: true, store };
}

function updateStore(storeId, updates) {
  const user = TCAuth.getCurrentUser();
  if (!user) return { success: false, message: 'No autorizado.' };

  const stores = getStores();
  const idx = stores.findIndex(s => s.id === storeId);
  if (idx === -1) return { success: false, message: 'Tienda no encontrada.' };
  if (stores[idx].userId !== user.id) return { success: false, message: 'No tienes permiso.' };

  stores[idx] = { ...stores[idx], ...updates };
  saveStores(stores);
  return { success: true, store: stores[idx] };
}

function deleteStore(storeId) {
  const user = TCAuth.getCurrentUser();
  if (!user) return { success: false, message: 'No autorizado.' };

  const stores = getStores();
  const idx = stores.findIndex(s => s.id === storeId && s.userId === user.id);
  if (idx === -1) return { success: false, message: 'Tienda no encontrada.' };

  stores.splice(idx, 1);
  saveStores(stores);
  return { success: true };
}

/* Update product count on a store */
function syncStoreProductCount(storeId) {
  const products = TCUtils.lsGet('tc_products', []);
  const count = products.filter(p => p.storeId === storeId && p.active).length;
  const stores = getStores();
  const idx = stores.findIndex(s => s.id === storeId);
  if (idx !== -1) { stores[idx].totalProducts = count; saveStores(stores); }
}

window.TCStore = {
  getAllStores, getStoreById, getStoreBySlug, getStoresByUser,
  createStore, updateStore, deleteStore, syncStoreProductCount,
};
