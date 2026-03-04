/**
 * TC MARKET SHOP - App Initialization
 * Navbar, mobile menu, global event listeners
 */

'use strict';

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Init demo data (no-op if already seeded)
  TCUtils.initDemoData();

  // 2. Navbar
  updateNavbar();

  // 3. Mobile menu
  initMobileMenu();

  // 4. Search bar
  initNavbarSearch();

  // 5. Animations
  TCUtils.initRipples();
  TCUtils.initReveal();

  // 6. Page enter animation
  document.body.classList.add('page-enter');
});

/* ── Update Navbar ──────────────────────────────────────────── */
function updateNavbar() {
  const user = TCAuth.getCurrentUser();
  const count = TCCart.getCartCount();

  // Cart badge
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });

  // User section
  const guestNav  = document.getElementById('nav-guest');
  const userNav   = document.getElementById('nav-user');
  const userNameEl = document.getElementById('nav-user-name');
  const avatarEl  = document.getElementById('nav-avatar');

  if (user) {
    if (guestNav)  guestNav.style.display  = 'none';
    if (userNav)   userNav.style.display   = 'flex';
    if (userNameEl) userNameEl.textContent = user.name.split(' ')[0];
    if (avatarEl) {
      if (user.avatar) {
        avatarEl.innerHTML = `<img src="${user.avatar}" alt="${user.name}">`;
      } else {
        avatarEl.textContent = TCAuth.getUserInitials(user);
      }
    }

    // Show seller link if user has a store
    const sellerLink = document.getElementById('nav-seller-link');
    if (sellerLink) {
      const stores = TCStore.getStoresByUser(user.id);
      sellerLink.style.display = stores.length > 0 ? 'flex' : 'none';
    }
  } else {
    if (guestNav) guestNav.style.display  = 'flex';
    if (userNav)  userNav.style.display   = 'none';
  }
}

/* ── Mobile menu ────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const overlay   = document.getElementById('mobile-overlay');

  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    const open = mobileNav && mobileNav.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }
}

function closeMobileMenu() {
  const mobileNav = document.getElementById('mobile-nav');
  const overlay   = document.getElementById('mobile-overlay');
  const hamburger = document.getElementById('hamburger');
  if (mobileNav) mobileNav.classList.remove('open');
  if (overlay)   overlay.classList.remove('open');
  if (hamburger) hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Navbar search ──────────────────────────────────────────── */
function initNavbarSearch() {
  const searchInput  = document.getElementById('navbar-search');
  const searchToggle = document.getElementById('search-toggle');

  if (searchInput) {
    searchInput.addEventListener('keypress', e => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        TCSearch.searchRedirect(searchInput.value.trim());
      }
    });
  }

  // Mobile search toggle
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      const wrap = document.getElementById('navbar-search-wrap');
      if (wrap) wrap.classList.toggle('mobile-open');
    });
  }
}

/* ── User dropdown toggle ───────────────────────────────────── */
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('[data-dropdown-toggle]');
  if (toggle) {
    const targetId = toggle.dataset.dropdownToggle;
    const menu = document.getElementById(targetId);
    if (menu) {
      menu.classList.toggle('open');
      e.stopPropagation();
      return;
    }
  }

  // Close all dropdowns on outside click
  document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
});

/* ── Logout handler ─────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-action="logout"]')) {
    TCAuth.logout();
  }
});

/* ── Accordion init ─────────────────────────────────────────── */
document.addEventListener('click', e => {
  const header = e.target.closest('.accordion-header');
  if (header) {
    const item = header.closest('.accordion-item');
    if (item) item.classList.toggle('open');
  }
});

/* ── Tabs init ──────────────────────────────────────────────── */
document.addEventListener('click', e => {
  const tabBtn = e.target.closest('.tab-btn');
  if (tabBtn) {
    const tabsEl = tabBtn.closest('.tabs');
    const panelsWrap = tabsEl ? tabsEl.nextElementSibling : null;
    if (!tabsEl) return;

    const target = tabBtn.dataset.tab;
    tabsEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    tabBtn.classList.add('active');

    // Find panels in the parent container
    const parent = tabsEl.parentElement;
    if (parent) {
      parent.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.panel === target);
      });
    }
  }
});

/* ── Modal helpers ──────────────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

document.addEventListener('click', e => {
  // Open modal
  const opener = e.target.closest('[data-modal-open]');
  if (opener) { openModal(opener.dataset.modalOpen); return; }

  // Close modal via button
  const closer = e.target.closest('[data-modal-close]');
  if (closer) { closeModal(closer.dataset.modalClose || closer.closest('.modal-overlay').id); return; }

  // Close on overlay click
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

window.TCApp = { updateNavbar, openModal, closeModal };
