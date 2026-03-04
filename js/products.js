/**
 * TC MARKET SHOP - Products Management
 */

'use strict';

const PRODUCTS_KEY = 'tc_products';

function getProducts() { return TCUtils.lsGet(PRODUCTS_KEY, []); }
function saveProducts(products) { TCUtils.lsSet(PRODUCTS_KEY, products); }

function getAllProducts() { return getProducts().filter(p => p.active); }

function getProductById(id) { return getProducts().find(p => p.id === id) || null; }

function getProductsByStore(storeId) {
  return getProducts().filter(p => p.storeId === storeId && p.active);
}

function getFeaturedProducts(limit = 8) {
  return getProducts().filter(p => p.active && p.featured).slice(0, limit);
}

function getProductsByCategory(category) {
  return getProducts().filter(p => p.active && p.category === category);
}

function addProduct(data) {
  const user = TCAuth.getCurrentUser();
  if (!user) return { success: false, message: 'Debes iniciar sesión.' };

  if (!data.name || data.name.trim().length < 2) {
    return { success: false, message: 'El nombre del producto debe tener al menos 2 caracteres.' };
  }
  if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
    return { success: false, message: 'El precio debe ser mayor que 0.' };
  }

  const store = TCStore.getStoresByUser(user.id)[0];
  if (!store) return { success: false, message: 'Primero debes crear una tienda.' };

  const products = getProducts();
  const product = {
    id: TCUtils.generateId('prod'),
    storeId: store.id,
    userId: user.id,
    name: data.name.trim(),
    description: data.description || '',
    price: parseFloat(data.price),
    salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
    category: data.category || 'General',
    stock: parseInt(data.stock) || 0,
    image: data.image || 'https://picsum.photos/seed/' + TCUtils.generateId() + '/500/500',
    images: data.images || [],
    tags: data.tags || [],
    rating: 0,
    reviews: 0,
    featured: data.featured || false,
    active: true,
    createdAt: new Date().toISOString(),
  };

  products.push(product);
  saveProducts(products);
  TCStore.syncStoreProductCount(store.id);
  return { success: true, product };
}

function updateProduct(productId, updates) {
  const user = TCAuth.getCurrentUser();
  if (!user) return { success: false, message: 'No autorizado.' };

  const products = getProducts();
  const idx = products.findIndex(p => p.id === productId);
  if (idx === -1) return { success: false, message: 'Producto no encontrado.' };
  if (products[idx].userId !== user.id) return { success: false, message: 'Sin permiso.' };

  if (updates.price) updates.price = parseFloat(updates.price);
  if (updates.salePrice) updates.salePrice = parseFloat(updates.salePrice);
  if (updates.stock) updates.stock = parseInt(updates.stock);

  products[idx] = { ...products[idx], ...updates };
  saveProducts(products);
  return { success: true, product: products[idx] };
}

function deleteProduct(productId) {
  const user = TCAuth.getCurrentUser();
  if (!user) return { success: false, message: 'No autorizado.' };

  const products = getProducts();
  const idx = products.findIndex(p => p.id === productId && p.userId === user.id);
  if (idx === -1) return { success: false, message: 'Producto no encontrado.' };

  const storeId = products[idx].storeId;
  products[idx].active = false; // soft delete
  saveProducts(products);
  TCStore.syncStoreProductCount(storeId);
  return { success: true };
}

/* Get effective price (sale or normal) */
function getEffectivePrice(product) {
  return product.salePrice && product.salePrice < product.price
    ? product.salePrice
    : product.price;
}

/* Get discount percentage */
function getDiscount(product) {
  if (!product.salePrice || product.salePrice >= product.price) return 0;
  return Math.round((1 - product.salePrice / product.price) * 100);
}

/* Search products */
function searchProducts(query, filters = {}) {
  let results = getAllProducts();

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }
  if (filters.category) results = results.filter(p => p.category === filters.category);
  if (filters.minPrice !== undefined) results = results.filter(p => getEffectivePrice(p) >= filters.minPrice);
  if (filters.maxPrice !== undefined) results = results.filter(p => getEffectivePrice(p) <= filters.maxPrice);
  if (filters.minRating) results = results.filter(p => p.rating >= filters.minRating);
  if (filters.storeId)  results = results.filter(p => p.storeId === filters.storeId);

  // Sort
  const sort = filters.sort || 'relevance';
  if (sort === 'price_asc')  results.sort((a,b) => getEffectivePrice(a) - getEffectivePrice(b));
  if (sort === 'price_desc') results.sort((a,b) => getEffectivePrice(b) - getEffectivePrice(a));
  if (sort === 'rating')     results.sort((a,b) => b.rating - a.rating);
  if (sort === 'newest')     results.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  return results;
}

window.TCProducts = {
  getAllProducts, getProductById, getProductsByStore, getFeaturedProducts,
  getProductsByCategory, addProduct, updateProduct, deleteProduct,
  getEffectivePrice, getDiscount, searchProducts,
};
