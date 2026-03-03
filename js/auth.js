/**
 * TC MARKET SHOP - Authentication
 * Login, register, logout, session management
 */

'use strict';

const AUTH_KEY    = 'tc_session';
const USERS_KEY   = 'tc_users';

/* ── Get all users ──────────────────────────────────────────── */
function getUsers() {
  return TCUtils.lsGet(USERS_KEY, []);
}

/* ── Get current logged-in user ────────────────────────────── */
function getCurrentUser() {
  const session = TCUtils.lsGet(AUTH_KEY);
  if (!session) return null;
  const users = getUsers();
  return users.find(u => u.id === session.userId) || null;
}

/* ── Check if authenticated ─────────────────────────────────── */
function isLoggedIn() {
  return getCurrentUser() !== null;
}

/* ── Require auth - redirect if not logged in ──────────────── */
function requireAuth(redirectTo = 'login.html') {
  if (!isLoggedIn()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

/* ── Redirect if already logged in ─────────────────────────── */
function redirectIfLoggedIn(to = 'dashboard.html') {
  if (isLoggedIn()) {
    window.location.href = to;
  }
}

/* ── Login ──────────────────────────────────────────────────── */
function login(email, password, remember = false) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user) {
    return { success: false, message: 'No existe una cuenta con ese correo electrónico.' };
  }
  if (user.password !== password) {
    return { success: false, message: 'Contraseña incorrecta. Inténtalo de nuevo.' };
  }

  const session = { userId: user.id, email: user.email, remember, loginAt: new Date().toISOString() };
  TCUtils.lsSet(AUTH_KEY, session);

  return { success: true, user };
}

/* ── Register ───────────────────────────────────────────────── */
function register(name, email, password, type = 'buyer') {
  const users = getUsers();

  if (users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
    return { success: false, message: 'Ya existe una cuenta con ese correo electrónico.' };
  }

  if (!TCUtils.isValidEmail(email)) {
    return { success: false, message: 'El formato del correo electrónico no es válido.' };
  }
  if (!TCUtils.isValidPassword(password)) {
    return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
  }
  if (!name || name.trim().length < 2) {
    return { success: false, message: 'El nombre debe tener al menos 2 caracteres.' };
  }

  const newUser = {
    id: TCUtils.generateId('user'),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    type,
    avatar: '',
    address: '',
    phone: '',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  TCUtils.lsSet(USERS_KEY, users);

  // Auto-login after registration
  const session = { userId: newUser.id, email: newUser.email, loginAt: new Date().toISOString() };
  TCUtils.lsSet(AUTH_KEY, session);

  return { success: true, user: newUser };
}

/* ── Logout ─────────────────────────────────────────────────── */
function logout() {
  TCUtils.lsRemove(AUTH_KEY);
  window.location.href = 'index.html';
}

/* ── Update user profile ────────────────────────────────────── */
function updateUser(userId, updates) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return { success: false, message: 'Usuario no encontrado.' };

  // Don't allow changing email to an existing one
  if (updates.email && updates.email !== users[idx].email) {
    if (users.find(u => u.email === updates.email && u.id !== userId)) {
      return { success: false, message: 'Ese correo ya está en uso.' };
    }
  }

  users[idx] = { ...users[idx], ...updates };
  TCUtils.lsSet(USERS_KEY, users);
  return { success: true, user: users[idx] };
}

/* ── Get user initials for avatar ───────────────────────────── */
function getUserInitials(user) {
  if (!user) return '?';
  const parts = user.name.split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : user.name.slice(0, 2).toUpperCase();
}

/* ── Export ─────────────────────────────────────────────────── */
window.TCAuth = {
  getCurrentUser, isLoggedIn, requireAuth, redirectIfLoggedIn,
  login, register, logout, updateUser, getUserInitials, getUsers,
};
