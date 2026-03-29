/* ===================================================
   ADMIN LAYOUT - FrontLayer Portal V.3
   Vanilla JavaScript - All interaction logic
   =================================================== */

'use strict';


/* ===================================================
   STATE
   =================================================== */
const state = {
  sidebarMini: false,
  activeNavId: 'dashboard',
  openDrawerId: null,        // which sub-drawer is open (desktop and mobile)
  mobileDrawerOpen: false,
  mobileProfileOpen: false,
  userDropdownOpen: false,
};

/* ===================================================
   DOM REFERENCES (set after DOMContentLoaded)
   =================================================== */
let $sidebar, $sidebarToggle, $sidebarSlot;
let $subDrawer, $subDrawerTitle, $subDrawerItems, $subDrawerClose;
let $backdrop;
let $bottomNav, $mobileMenuBtn;
let $mobileDrawer, $mobileDrawerBack;
let $mobileBackdrop;
let $headerUser;
let $mobileProfileSheet;
let $userDropdownPopup;

/* ===================================================
   SIDEBAR + MOBILE MENU EVENT DELEGATION
   =================================================== */
function initSidebarNav() {
  ['sidebar-menu-1', 'sidebar-menu-2'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => {
      const el = e.target.closest('.nav-item');
      if (el) handleDesktopNavClick(el);
    });
  });
}

function initMobileMenuNav() {
  const $mobileMenu = document.getElementById('mobile-menu-list');

  // Clone sidebar menu groups — single source of truth for nav items
  ['sidebar-menu-1', 'sidebar-menu-2'].forEach(id => {
    const group = document.getElementById(id);
    if (!group) return;
    const clone = group.cloneNode(true);
    clone.removeAttribute('id'); // avoid duplicate IDs in DOM
    // Dashboard is already in bottom-nav — remove it from mobile drawer
    clone.querySelectorAll('.nav-item[data-id="dashboard"]').forEach(el => el.remove());
    $mobileMenu.appendChild(clone);
  });

  // Delegate clicks on .nav-item (same structure as sidebar)
  $mobileMenu.addEventListener('click', e => {
    const el = e.target.closest('.nav-item');
    if (el) handleMobileNavClick(el);
  });
}

/* ===================================================
   DESKTOP SIDEBAR TOGGLE
   =================================================== */
function initSidebarToggle() {
  $sidebarToggle.addEventListener('click', () => {
    const isPeek = $sidebar.classList.contains('peek');

    if (isPeek) {
      // Clicking toggle in peek state → pin sidebar back to full open
      state.sidebarMini = false;
      $sidebar.classList.remove('mini', 'peek');
      $sidebarSlot.classList.remove('mini');
      document.documentElement.style.setProperty('--current-sidebar-w', '280px');
    } else {
      state.sidebarMini = !state.sidebarMini;
      $sidebar.classList.toggle('mini', state.sidebarMini);
      $sidebarSlot.classList.toggle('mini', state.sidebarMini);
      document.documentElement.style.setProperty(
        '--current-sidebar-w',
        state.sidebarMini ? '72px' : '280px'
      );
      // Close any open drawer when going mini
      if (state.openDrawerId && state.sidebarMini) {
        closeSubDrawer();
      }
    }
  });

  function _closePeek() {
    $sidebar.classList.remove('peek');
    document.documentElement.style.setProperty('--current-sidebar-w', '72px');
    $subDrawer.style.zIndex = '';
    if (state.openDrawerId) closeSubDrawer();
  }

  // Hover: expand sidebar as overlay when in mini mode (peek)
  $sidebar.addEventListener('mouseenter', () => {
    if (state.sidebarMini) {
      $sidebar.classList.add('peek');
      // Reposition sub-drawer to the left of the full-width peek sidebar
      document.documentElement.style.setProperty('--current-sidebar-w', '280px');
      // Raise sub-drawer above peek sidebar (z-index 500)
      $subDrawer.style.zIndex = '600';
    }
  });

  $sidebar.addEventListener('mouseleave', (e) => {
    if (!state.sidebarMini) return;
    // Don't close peek if mouse is moving to sub-drawer
    if ($subDrawer.contains(e.relatedTarget)) return;
    _closePeek();
  });

  // Close peek when mouse leaves sub-drawer (unless returning to sidebar)
  $subDrawer.addEventListener('mouseleave', (e) => {
    if (!state.sidebarMini || !$sidebar.classList.contains('peek')) return;
    if ($sidebar.contains(e.relatedTarget)) return;
    _closePeek();
  });
}

/* ===================================================
   DESKTOP NAV CLICK → SubDrawer
   =================================================== */
function handleDesktopNavClick(el) {
  const id         = el.dataset.id;
  const title      = el.querySelector('.nav-text').textContent;
  const hasSubmenu = el.dataset.submenu === 'true';

  setActiveNavItem(id);

  if (!hasSubmenu) {
    closeSubDrawer();
    updatePageTitle(title);
    return;
  }

  if (state.openDrawerId === id) {
    closeSubDrawer();
    return;
  }

  openSubDrawer(id, title);
}

function setActiveNavItem(id) {
  // Update all .nav-item elements — covers both sidebar and mobile drawer clones
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
  state.activeNavId = id;
}

function openSubDrawer(id, title) {
  state.openDrawerId = id;
  $subDrawerTitle.textContent = title;
  $subDrawerItems.querySelectorAll('.sub-drawer-group').forEach(g => {
    g.hidden = g.dataset.menu !== id;
  });
  $subDrawer.classList.add('open');
  if (window.innerWidth >= 1024) {
    $backdrop.classList.add('show');
  }
}

function closeSubDrawer() {
  state.openDrawerId = null;
  $subDrawer.classList.remove('open');
  $backdrop.classList.remove('show');
}

/* ===================================================
   MOBILE DRAWER
   =================================================== */
function openMobileDrawer() {
  state.mobileDrawerOpen = true;
  $mobileDrawer.classList.add('open');
  $mobileBackdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
  // Set menu icon as active
  document.querySelectorAll('.bottom-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === 'menu');
  });
}

function closeMobileDrawer() {
  state.mobileDrawerOpen = false;
  $mobileDrawer.classList.remove('open');
  $mobileBackdrop.classList.remove('show');
  document.body.style.overflow = '';
  closeSubDrawer();
  // Restore active
  document.querySelectorAll('.bottom-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === state.activeNavId);
  });
}

function handleMobileNavClick(el) {
  const id         = el.dataset.id;
  const title      = el.querySelector('.nav-text').textContent;
  const hasSubmenu = el.dataset.submenu === 'true';

  if (!hasSubmenu) {
    closeMobileDrawer();
    setActiveNavItem(id);
    updatePageTitle(title);
    return;
  }
  openSubDrawer(id, title);
}



/* ===================================================
   PROFILE PANEL (unified: desktop dropdown + mobile sheet)
   =================================================== */
function openMobileProfile() {
  state.mobileProfileOpen = true;
  $mobileProfileSheet.classList.add('open');
  $mobileProfileSheet.setAttribute('aria-hidden', 'false');
  // Lock scroll only on mobile (full-screen sheet)
  if (window.innerWidth < 1024) {
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileProfile() {
  state.mobileProfileOpen = false;
  $mobileProfileSheet.classList.remove('open');
  $mobileProfileSheet.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function openUserDropdown() {
  state.userDropdownOpen = true;
  $userDropdownPopup.classList.add('open');
  $userDropdownPopup.setAttribute('aria-hidden', 'false');
}

function closeUserDropdown() {
  state.userDropdownOpen = false;
  $userDropdownPopup.classList.remove('open');
  $userDropdownPopup.setAttribute('aria-hidden', 'true');
}

function initUserDropdown() {
  $headerUser.addEventListener('click', e => {
    e.stopPropagation();
    if (window.innerWidth >= 1024) {
      // Desktop: toggle compact dropdown popup
      if (state.userDropdownOpen) {
        closeUserDropdown();
      } else {
        closeSubDrawer();
        openUserDropdown();
      }
    } else {
      // Mobile: toggle full-screen sheet
      if (state.mobileProfileOpen) {
        closeMobileProfile();
      } else {
        closeSubDrawer();
        openMobileProfile();
      }
    }
  });

  // Stop clicks inside panels from closing them
  $userDropdownPopup.addEventListener('click', e => { e.stopPropagation(); });
  $mobileProfileSheet.addEventListener('click', e => { e.stopPropagation(); });

  // Click outside → close
  document.addEventListener('click', () => {
    if (state.userDropdownOpen) closeUserDropdown();
    if (state.mobileProfileOpen && window.innerWidth >= 1024) closeMobileProfile();
  });
}

/* ===================================================
   BOTTOM NAV — helpers
   =================================================== */
function closeAllMobilePanels() {
  if (state.mobileDrawerOpen)  closeMobileDrawer();
  if (state.mobileProfileOpen) closeMobileProfile();
  if (state.userDropdownOpen)  closeUserDropdown();
  Modal.closeAll();
}

function setBottomNavActive(nav) {
  document.querySelectorAll('.bottom-nav-item').forEach(b =>
    b.classList.toggle('active', b.dataset.nav === nav)
  );
}

/* ===================================================
   BOTTOM NAV
   =================================================== */
function initBottomNav() {
  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const nav      = btn.dataset.nav;
      const wasActive = btn.classList.contains('active');

      // Close every open panel first
      closeAllMobilePanels();
      document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));

      // Toggle-off: if the same panel was already open, just close it
      if (wasActive && (nav === 'menu' || nav === 'profile' || nav === 'notifications' || nav === 'search')) return;

      // Open the relevant panel and mark its button active
      btn.classList.add('active');

      if (nav === 'menu') {
        openMobileDrawer();
        return;
      }
      if (nav === 'notifications') {
        NotificationPanel.open();
        return;
      }
      if (nav === 'profile') {
        openMobileProfile();
        return;
      }
      if (nav === 'search') {
        SearchModal.open();
        return;
      }
      // dashboard: only active state change, no panel
    });
  });
}

/* ===================================================
   PAGE TITLE UPDATE
   =================================================== */
function updatePageTitle(title) {
  document.querySelectorAll('.page-title').forEach(el => el.textContent = title);
  // Update breadcrumb last item
  const currentCrumb = document.querySelector('.breadcrumb-current');
  if (currentCrumb) currentCrumb.textContent = title;
}

/* ===================================================
   BACKDROP CLICK HANDLERS
   =================================================== */
function initBackdrops() {
  // Desktop backdrop
  $backdrop.addEventListener('click', () => {
    closeSubDrawer();
  });

  // Mobile backdrop
  $mobileBackdrop.addEventListener('click', () => {
    closeMobileDrawer();
  });

  // Sub drawer close btn
  $subDrawerClose.addEventListener('click', () => closeSubDrawer());

  // Mobile drawer back btn
  $mobileDrawerBack.addEventListener('click', () => closeMobileDrawer());
}

/* ===================================================
   KEYBOARD: Escape key
   =================================================== */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (state.userDropdownOpen)  { closeUserDropdown(); return; }
      if (state.mobileProfileOpen) { closeMobileProfile(); return; }
      if (state.openDrawerId)      { closeSubDrawer(); return; }
      if (state.mobileDrawerOpen)  { closeMobileDrawer(); return; }
    }
  });
}

/* ===================================================
   SEARCH MODAL
   Uses the base Modal component (modal.css / modal.js).
   Content styles are in css/style.css.
   HTML structure and templates live in index.html.
   =================================================== */
const SearchModal = (() => {
  let _initialized  = false;
  let _query        = '';
  let _activeFilter = 'all';
  let _debounceTimer = null;

  let _input, _filterBar, _catBtns, _filterMore, _moreDropdown;
  let _stateRecent, _stateSkeleton, _stateResults, _stateEmpty;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    _input         = document.getElementById('searchInput');
    _filterBar     = document.getElementById('searchFilters');
    _catBtns       = document.getElementById('searchCatBtns');
    _filterMore    = document.getElementById('searchFilterMore');
    _moreDropdown  = document.getElementById('searchMoreDropdown');
    _stateRecent   = document.getElementById('searchStateRecent');
    _stateSkeleton = document.getElementById('searchStateSkeleton');
    _stateResults  = document.getElementById('searchStateResults');
    _stateEmpty    = document.getElementById('searchStateEmpty');

    _input.addEventListener('input', _onInput);
    _filterBar.addEventListener('click', _onFilterClick);
    _stateRecent.addEventListener('click', _onRecentClick);

    document.getElementById('searchMoreToggle').addEventListener('click', e => {
      e.stopPropagation();
      _moreDropdown.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.search-filter-more')) _moreDropdown.classList.remove('open');
    });

    Modal.onOpen('search-modal', _onModalOpen);
    Modal.onClose('search-modal', () => {
      clearTimeout(_debounceTimer);
      if (!document.querySelector('.modal.modal--open') && !state.mobileDrawerOpen && !state.mobileProfileOpen) {
        setBottomNavActive(state.activeNavId);
      }
    });
  }

  function _onModalOpen() {
    _input.value = ''; _query = ''; _activeFilter = 'all';
    clearTimeout(_debounceTimer);
    if (_stateResults) {
      _stateResults.querySelectorAll('.search-result-item').forEach(el => {
        el.hidden = false;
        const nameEl = el.querySelector('.search-result-name');
        if (nameEl) nameEl.textContent = el.dataset.name || '';
      });
      _stateResults.querySelectorAll('.search-group').forEach(g => g.hidden = false);
      _stateResults.querySelectorAll('.search-group-header').forEach(h => h.hidden = true);
    }
    _showState('recent');
    _filterBar.classList.add('hidden');
    setTimeout(() => _input.focus(), 80);
  }

  function _onInput() {
    _query = _input.value.trim();
    clearTimeout(_debounceTimer);
    if (!_query) { _showState('recent'); _filterBar.classList.add('hidden'); return; }
    _showState('skeleton'); _filterBar.classList.add('hidden');
    _debounceTimer = setTimeout(() => _doSearch(_query), 350);
  }

  function _onFilterClick(e) {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    _activeFilter = btn.dataset.filter;
    _moreDropdown.classList.remove('open');
    _doSearch(_query);
  }

  function _onRecentClick(e) {
    const chip = e.target.closest('.search-chip[data-query]');
    if (chip) { _input.value = chip.dataset.query; _query = chip.dataset.query; _onInput(); }
  }

  function _showState(s) {
    _stateRecent.classList.toggle('hidden',   s !== 'recent');
    _stateSkeleton.classList.toggle('hidden', s !== 'skeleton');
    _stateResults.classList.toggle('hidden',  s !== 'results');
    _stateEmpty.classList.toggle('hidden',    s !== 'empty');
  }

  function _getCatLabel(k) {
    const btn = _catBtns ? _catBtns.querySelector('.search-cat-btn[data-filter="' + k + '"]') : null;
    return btn ? btn.querySelector('.search-cat-btn-text').textContent.trim() : k;
  }

  function _highlight(text, q) {
    if (!q) return text;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp('(' + esc + ')', 'gi'), '<mark>$1</mark>');
  }

  function _doSearch(q) {
    const items = _stateResults.querySelectorAll('.search-result-item');
    const catCounts = {};

    items.forEach(item => {
      const name = item.dataset.name || '';
      const meta = item.dataset.meta || '';
      const cat  = item.dataset.category;
      const matchesQuery = name.includes(q) || meta.includes(q);
      const matchesFilter = _activeFilter === 'all' || _activeFilter === cat;
      item.hidden = !(matchesQuery && matchesFilter);
      const nameEl = item.querySelector('.search-result-name');
      if (nameEl) nameEl.innerHTML = matchesQuery ? _highlight(name, q) : name;
      if (matchesQuery) catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    const allMatchCats = Object.keys(catCounts);
    const hasVisible = Array.from(items).some(i => !i.hidden);
    if (!hasVisible) { _filterBar.classList.add('hidden'); _showState('empty'); return; }

    _stateResults.querySelectorAll('.search-group').forEach(group => {
      const cat = group.dataset.category;
      const inFilter = _activeFilter === 'all' || _activeFilter === cat;
      group.hidden = !catCounts[cat] || !inFilter;
      const countEl = group.querySelector('.search-group-count');
      if (countEl) countEl.textContent = catCounts[cat] || '';
    });

    const showHeaders = allMatchCats.length > 1 && _activeFilter === 'all';
    _stateResults.querySelectorAll('.search-group-header').forEach(h => h.hidden = !showHeaders);

    if (allMatchCats.length <= 1) {
      _filterBar.classList.add('hidden');
    } else {
      _updateFilterBtns(allMatchCats);
      _filterBar.classList.remove('hidden');
    }

    _showState('results');
  }

  function _updateFilterBtns(visibleCats) {
    const allKeys  = ['all', ...visibleCats];
    const isMobile = window.innerWidth < 768;
    const MAX      = 3;
    const visible  = isMobile ? allKeys : allKeys.slice(0, MAX);
    const overflow = isMobile ? []      : allKeys.slice(MAX);

    Array.from(_catBtns.querySelectorAll('.search-cat-btn[data-filter]')).forEach(btn => {
      const f = btn.dataset.filter;
      btn.hidden = !visible.includes(f);
      btn.classList.toggle('active', f === _activeFilter);
    });

    _moreDropdown.innerHTML = '';
    _filterMore.hidden = overflow.length === 0;
    overflow.forEach(k => {
      const srcBtn = _catBtns.querySelector('.search-cat-btn[data-filter="' + k + '"]');
      if (!srcBtn) return;
      const clone = srcBtn.cloneNode(true);
      clone.className = 'search-more-item' + (_activeFilter === k ? ' active' : '');
      clone.hidden = false;
      _moreDropdown.appendChild(clone);
    });
  }

  function open()  { _init(); Modal.open('search-modal'); }
  function close() { Modal.close('search-modal'); }
  return { open, close };
})();

/* ===================================================
   NOTIFICATION MODAL
   Uses the base Modal component (modal.css / modal.js).
   Content styles are in css/style.css.
   =================================================== */
const NotificationPanel = (() => {
  let _initialized = false;
  let _activeId    = null;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    _updateBadge();

    // Show/hide views
    const hasItems = document.querySelectorAll('#notifList .notif-item').length > 0;
    document.getElementById('notifViewList').style.display  = hasItems ? '' : 'none';
    document.getElementById('notifViewEmpty').style.display = hasItems ? 'none' : 'flex';

    // List item click (anywhere on row) → show/close detail
    document.getElementById('notifList').addEventListener('click', e => {
      const item = e.target.closest('.notif-item');
      if (!item) return;
      const id = parseInt(item.dataset.id, 10);
      if (_activeId === id) { _resetItemBtn(_activeId); Modal.closePanel('notif-detail'); _activeId = null; }
      else { _showDetail(id); }
    });

    // Back button → close detail panel only
    document.getElementById('notifBackBtn').addEventListener('click', () => {
      if (_activeId !== null) _resetItemBtn(_activeId);
      Modal.closePanel('notif-detail'); _activeId = null;
    });

    // Mobile detail close button → close entire modal
    document.getElementById('notifDetailClose').addEventListener('click', () => {
      Modal.close('notif-modal');
    });

    // Container header close button (setupModal() wires the first .modal__close = notifDetailClose)
    const containerClose = document.querySelector('#notif-modal .modal__container .modal__close');
    if (containerClose) containerClose.addEventListener('click', () => Modal.close('notif-modal'));

    // Tab switching
    const $notifViewList  = document.getElementById('notifViewList');
    const $notifViewEmpty = document.getElementById('notifViewEmpty');
    const $emptyText = $notifViewEmpty && $notifViewEmpty.querySelector('.notif-empty-text');
    const $emptySub  = $notifViewEmpty && $notifViewEmpty.querySelector('.notif-empty-sub');

    document.querySelectorAll('#notifTabs .notif-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#notifTabs .notif-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (tab.dataset.tab === 'notifications') {
          if ($notifViewList)  $notifViewList.style.display  = 'none';
          if ($emptyText)      $emptyText.textContent        = 'هیچ اعلانی وجود ندارد';
          if ($emptySub)       $emptySub.textContent         = 'در حال حاضر اعلان جدیدی برای شما وجود ندارد';
          if ($notifViewEmpty) $notifViewEmpty.style.display = '';
        } else {
          if ($notifViewEmpty) $notifViewEmpty.style.display = 'none';
          if ($notifViewList)  $notifViewList.style.display  = '';
        }
      });
    });

    Modal.onClose('notif-modal', () => {
      if (_activeId !== null) _resetItemBtn(_activeId);
      _activeId = null;
      if (!document.querySelector('.modal.modal--open') && !state.mobileDrawerOpen && !state.mobileProfileOpen) {
        setBottomNavActive(state.activeNavId);
      }
    });
  }

  function _updateBadge() {
    const badge = document.getElementById('notifUnreadBadge');
    if (!badge) return;
    const count = document.querySelectorAll('#notifList .notif-item[data-unread="true"]').length;
    badge.textContent = count;
    badge.style.display = count > 0 ? '' : 'none';
  }

  function _showDetail(id) {
    const $item = document.querySelector(`.notif-item[data-id="${id}"]`);
    if (!$item) return;

    document.getElementById('notifDetailTitle').textContent = $item.dataset.subject;

    const content = document.getElementById('notifDetailContent');
    content.querySelectorAll('.notif-detail-panel').forEach(p => {
      p.hidden = p.dataset.notifId !== String(id);
    });

    if (_activeId !== null) _resetItemBtn(_activeId);

    $item.dataset.unread = 'false';
    const dot = $item.querySelector('.notif-item-dot');
    if (dot) dot.remove();
    const btn = $item.querySelector('[data-show]');
    if (btn) { btn.querySelector('.notif-btn-text').textContent = 'بستن'; btn.classList.add('is-open'); }

    _updateBadge();
    _activeId = id;
    Modal.openPanel('notif-detail');
  }

  function _resetItemBtn(id) {
    const $item = document.querySelector(`.notif-item[data-id="${id}"]`);
    if (!$item) return;
    const btn = $item.querySelector('[data-show]');
    if (btn) { btn.querySelector('.notif-btn-text').textContent = 'نمایش'; btn.classList.remove('is-open'); }
  }

  function open() {
    _init();
    Modal.open('notif-modal');
  }

  function close() { Modal.close('notif-modal'); }
  return { open, close };
})();

/* ===================================================
   INIT
   =================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  $sidebar         = document.getElementById('sidebar');
  $sidebarSlot     = document.getElementById('sidebarSlot');
  $sidebarToggle   = document.getElementById('sidebarToggle');
  $subDrawer       = document.getElementById('subDrawer');
  $subDrawerTitle  = document.getElementById('subDrawerTitle');
  $subDrawerItems  = document.getElementById('subDrawerItems');
  $subDrawerClose  = document.getElementById('subDrawerClose');

  $subDrawerItems.addEventListener('click', e => {
    const item = e.target.closest('.sub-drawer-item');
    if (!item) return;
    const itemTitle = item.querySelector('.sub-drawer-item-name').textContent;
    if (state.mobileDrawerOpen) {
      closeMobileDrawer();
    } else {
      closeSubDrawer();
    }
    updatePageTitle(itemTitle);
  });

  $backdrop        = document.getElementById('backdrop');
  $bottomNav       = document.getElementById('bottomNav');
  $mobileMenuBtn   = document.getElementById('mobileMenuBtn');
  $mobileDrawer    = document.getElementById('mobileDrawer');
  $mobileDrawerBack = document.getElementById('mobileDrawerBack');
  $mobileBackdrop  = document.getElementById('mobileBackdrop');
  $headerUser         = document.querySelector('.header-user');
  $mobileProfileSheet = document.getElementById('mobileProfileSheet');
  $userDropdownPopup  = document.getElementById('userDropdownPopup');

  // Wire nav interactions
  initSidebarNav();
  initMobileMenuNav();

  // Init interactions
  initSidebarToggle();
  initBottomNav();
  initBackdrops();
  initKeyboard();
  initUserDropdown();
});

