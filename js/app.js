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
  openDrawerId: null,        // which desktop subdrawer is open
  mobileDrawerOpen: false,
  mobileSubOpen: false,
  mobileSubId: null,
  userDropdownOpen: false,
  mobileProfileOpen: false,
};

/* ===================================================
   DOM REFERENCES (set after DOMContentLoaded)
   =================================================== */
let $sidebar, $sidebarToggle, $sidebarSlot;
let $subDrawer, $subDrawerTitle, $subDrawerItems, $subDrawerClose;
let $backdrop;
let $bottomNav, $mobileMenuBtn;
let $mobileDrawer, $mobileDrawerBack;
let $mobileSubDrawer, $mobileSubTitle, $mobileSubItems, $mobileSubClose;
let $mobileBackdrop;
let $headerUser, $userDropdown;
let $mobileProfileSheet;

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
  document.getElementById('mobile-menu-list').addEventListener('click', e => {
    const el = e.target.closest('.mobile-nav-item');
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
      _showSubAfterOpen();
    } else {
      state.sidebarMini = !state.sidebarMini;
      $sidebar.classList.toggle('mini', state.sidebarMini);
      $sidebarSlot.classList.toggle('mini', state.sidebarMini);
      document.documentElement.style.setProperty(
        '--current-sidebar-w',
        state.sidebarMini ? '72px' : '280px'
      );
      if (state.sidebarMini) {
        // Going mini: hide text immediately
        $sidebar.classList.remove('sub-visible');
        if (state.openDrawerId) closeSubDrawer();
      } else {
        // Going open: show text only after sidebar width animation ends
        _showSubAfterOpen();
      }
    }
  });

  function _showSubAfterOpen() {
    $sidebar.addEventListener('transitionend', function handler(e) {
      if (e.target === $sidebar && e.propertyName === 'width') {
        if (!state.sidebarMini) $sidebar.classList.add('sub-visible');
        $sidebar.removeEventListener('transitionend', handler);
      }
    });
  }

  // Hover: expand sidebar as overlay when in mini mode (peek)
  $sidebar.addEventListener('mouseenter', () => {
    if (state.sidebarMini) {
      $sidebar.classList.add('peek');
    }
  });

  $sidebar.addEventListener('mouseleave', () => {
    if (state.sidebarMini) {
      $sidebar.classList.remove('peek');
    }
  });
}

/* ===================================================
   DESKTOP NAV CLICK → SubDrawer
   =================================================== */
function handleDesktopNavClick(el) {
  const id         = el.dataset.id;
  const title      = el.querySelector('.nav-text').textContent;
  const hasSubmenu = el.dataset.submenu === 'true';

  setDesktopActiveItem(id);

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

function setDesktopActiveItem(id) {
  document.querySelectorAll('#sidebar-menu-1 .nav-item, #sidebar-menu-2 .nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
  state.activeNavId = id;
}

function openSubDrawer(id, title) {
  state.openDrawerId = id;
  $subDrawerTitle.textContent = title;
  $subDrawerItems.innerHTML = '';

  const tpl = document.getElementById('submenu-desktop-' + id);
  if (tpl) {
    const clone = tpl.content.cloneNode(true);
    clone.querySelectorAll('.sub-drawer-item').forEach(item => {
      item.addEventListener('click', () => {
        closeSubDrawer();
        updatePageTitle(item.querySelector('.sub-drawer-item-name').textContent);
      });
    });
    $subDrawerItems.appendChild(clone);
  }

  $subDrawer.classList.add('open');
  $backdrop.classList.add('show');
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
  closeMobileSubDrawer();
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
    setMobileActiveItem(id);
    updatePageTitle(title);
    return;
  }
  openMobileSubDrawer(id, title);
}

function setMobileActiveItem(id) {
  document.querySelectorAll('#mobile-menu-list .mobile-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
  state.activeNavId = id;
}

/* ===================================================
   MOBILE SUB-DRAWER
   =================================================== */
function openMobileSubDrawer(id, title) {
  state.mobileSubOpen = true;
  state.mobileSubId = id;
  $mobileSubTitle.textContent = title;
  $mobileSubItems.innerHTML = '';

  const tpl = document.getElementById('submenu-mobile-' + id);
  if (tpl) {
    const clone = tpl.content.cloneNode(true);
    clone.querySelectorAll('.mobile-sub-item').forEach(item => {
      item.addEventListener('click', () => {
        closeMobileDrawer();
        updatePageTitle(item.querySelector('.mobile-sub-item-name').textContent);
      });
    });
    $mobileSubItems.appendChild(clone);
  }

  $mobileSubDrawer.classList.add('open');
}

function closeMobileSubDrawer() {
  state.mobileSubOpen = false;
  state.mobileSubId = null;
  $mobileSubDrawer.classList.remove('open');
}

/* ===================================================
   DESKTOP USER DROPDOWN
   =================================================== */
function openUserDropdown() {
  state.userDropdownOpen = true;
  $userDropdown.classList.add('open');
  $userDropdown.setAttribute('aria-hidden', 'false');
}

function closeUserDropdown() {
  state.userDropdownOpen = false;
  $userDropdown.classList.remove('open');
  $userDropdown.setAttribute('aria-hidden', 'true');
}

function initUserDropdown() {
  $headerUser.addEventListener('click', e => {
    e.stopPropagation();
    if (state.userDropdownOpen) {
      closeUserDropdown();
    } else {
      closeSubDrawer();
      openUserDropdown();
    }
  });

  $userDropdown.addEventListener('click', e => {
    e.stopPropagation();
  });

  document.addEventListener('click', () => {
    if (state.userDropdownOpen) closeUserDropdown();
  });
}

/* ===================================================
   MOBILE PROFILE SHEET
   =================================================== */
function openMobileProfile() {
  state.mobileProfileOpen = true;
  $mobileProfileSheet.classList.add('open');
  $mobileProfileSheet.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMobileProfile() {
  state.mobileProfileOpen = false;
  $mobileProfileSheet.classList.remove('open');
  $mobileProfileSheet.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ===================================================
   BOTTOM NAV — helpers
   =================================================== */
function closeAllMobilePanels() {
  if (state.mobileDrawerOpen)  closeMobileDrawer();
  if (state.mobileProfileOpen) closeMobileProfile();
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

  // Mobile sub drawer close btn
  $mobileSubClose.addEventListener('click', () => closeMobileSubDrawer());
}

/* ===================================================
   KEYBOARD: Escape key
   =================================================== */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (state.userDropdownOpen) { closeUserDropdown(); return; }
      if (state.mobileProfileOpen) { closeMobileProfile(); return; }
      if (state.mobileSubOpen) { closeMobileSubDrawer(); return; }
      if (state.mobileDrawerOpen) { closeMobileDrawer(); return; }
      if (state.openDrawerId) { closeSubDrawer(); return; }
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

  /* DOM references — set once in _init() */
  let _input, _filterBar, _catBtns, _filterMore, _moreDropdown;
  let _recentChips, _popularChips;
  let _stateRecent, _stateSkeleton, _stateResults, _stateEmpty;

  /* Template references — set once in _init() */
  let _tplChip, _tplResultItem, _tplGroupHeader;

  const _RECENT  = ['علی میرهادی', 'فاکتور ۱۴۰۴-۰۰۱۲', 'گروه مدیران ارشد'];
  const _POPULAR = ['علی پورسینا', 'بخش کاربران', '۹۸۷۷۷۶۵۵', '۸۶۹۷۴۳۶', 'آزمون ریاضی', 'نقش مدیران', '۹۷۲۱۶۲۰۲۸'];
  const _RESULTS = [
    { id: 1, category: 'users',   name: 'علی میرهادی',        meta: 'مدیر داخلی',          initials: 'ع' },
    { id: 2, category: 'users',   name: 'سارا احمدی',         meta: 'کارشناس آموزش',       initials: 'س' },
    { id: 3, category: 'users',   name: 'محمد رضایی',         meta: 'کارشناس فروش',        initials: 'م' },
    { id: 4, category: 'exams',   name: 'آزمون ریاضی پایه',   meta: 'فعال · ۴۵ سوال',      initials: 'آ' },
    { id: 5, category: 'exams',   name: 'آزمون زبان انگلیسی', meta: 'پیش‌نویس · ۳۰ سوال', initials: 'آ' },
    { id: 6, category: 'modules', name: 'ماژول بازاریابی',    meta: 'فعال',                initials: 'م' },
    { id: 7, category: 'modules', name: 'ماژول فروش',         meta: 'غیرفعال',             initials: 'م' },
    { id: 8, category: 'admins',  name: 'رضا محمدی',          meta: 'مدیر ارشد',           initials: 'ر' },
    { id: 9, category: 'admins',  name: 'نرگس کریمی',         meta: 'مدیر میانی',          initials: 'ن' },
  ];
  function _init() {
    if (_initialized) return;
    _initialized = true;

    /* DOM elements */
    _input         = document.getElementById('searchInput');
    _filterBar     = document.getElementById('searchFilters');
    _catBtns       = document.getElementById('searchCatBtns');
    _filterMore    = document.getElementById('searchFilterMore');
    _moreDropdown  = document.getElementById('searchMoreDropdown');
    _recentChips   = document.getElementById('searchRecentChips');
    _popularChips  = document.getElementById('searchPopularChips');
    _stateRecent   = document.getElementById('searchStateRecent');
    _stateSkeleton = document.getElementById('searchStateSkeleton');
    _stateResults  = document.getElementById('searchStateResults');
    _stateEmpty    = document.getElementById('searchStateEmpty');

    /* Templates */
    _tplChip        = document.getElementById('tpl-search-chip');
    _tplResultItem  = document.getElementById('tpl-search-result-item');
    _tplGroupHeader = document.getElementById('tpl-search-group-header');

    /* Events */
    _input.addEventListener('input', _onInput);
    _filterBar.addEventListener('click', _onFilterClick);
    _stateRecent.addEventListener('click', _onRecentClick);

    /* "بیشتر" toggle — wired once since button is static HTML */
    document.getElementById('searchMoreToggle').addEventListener('click', e => {
      e.stopPropagation();
      _moreDropdown.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.search-filter-more')) _moreDropdown.classList.remove('open');
    });

    Modal.onOpen('search-modal', _onModalOpen);
    Modal.onClose('search-modal', () => clearTimeout(_debounceTimer));

    /* Fill chips once — data never changes between opens */
    _RECENT.forEach(q  => _recentChips.appendChild(_makeChip(q)));
    _POPULAR.forEach(q => _popularChips.appendChild(_makeChip(q)));
  }

  function _onModalOpen() {
    _input.value = ''; _query = ''; _activeFilter = 'all';
    clearTimeout(_debounceTimer);
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

  /* Clone chip template and set its query text */
  function _makeChip(q) {
    const el = _tplChip.content.cloneNode(true).firstElementChild;
    el.dataset.query = q;
    el.title = q;
    el.querySelector('.search-chip-text').textContent = q;
    return el;
  }

  /* Read category label from its button template (label lives in HTML, not JS) */
  function _getCatLabel(k) {
    const tpl = document.getElementById('tpl-cat-btn-' + k);
    return tpl ? tpl.content.querySelector('.search-cat-btn-text').textContent : k;
  }

  function _highlight(text, q) {
    if (!q) return text;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${esc})`, 'gi'), '<mark>$1</mark>');
  }

  function _doSearch(q) {
    const matched = _RESULTS.filter(r => r.name.includes(q) || r.meta.includes(q));
    if (!matched.length) { _filterBar.classList.add('hidden'); _showState('empty'); return; }
    const cats = {};
    matched.forEach(r => { if (!cats[r.category]) cats[r.category] = []; cats[r.category].push(r); });
    const catKeys = Object.keys(cats);
    if (catKeys.length <= 1) { _filterBar.classList.add('hidden'); }
    else { _renderFilters(catKeys); _filterBar.classList.remove('hidden'); }
    _renderResults(matched, cats); _showState('results');
  }

  function _renderFilters(catKeys) {
    const isMobile = window.innerWidth < 768;
    const allKeys  = ['all', ...catKeys];
    const MAX      = 3;
    const visible  = isMobile ? allKeys : allKeys.slice(0, MAX);
    const overflow = isMobile ? []      : allKeys.slice(MAX);

    /* Remove previously injected cat buttons, keep _filterMore in place */
    Array.from(_catBtns.children).forEach(el => { if (el !== _filterMore) el.remove(); });

    /* Clone per-category template and insert before the "بیشتر" wrapper */
    visible.forEach(k => {
      const tpl = document.getElementById('tpl-cat-btn-' + k);
      if (!tpl) return;
      const el = tpl.content.cloneNode(true).firstElementChild;
      if (_activeFilter === k) el.classList.add('active');
      _catBtns.insertBefore(el, _filterMore);
    });

    /* Populate "بیشتر" dropdown — reuse same templates, change class for dropdown style */
    _moreDropdown.innerHTML = '';
    _filterMore.hidden = overflow.length === 0;
    overflow.forEach(k => {
      const tpl = document.getElementById('tpl-cat-btn-' + k);
      if (!tpl) return;
      const el = tpl.content.cloneNode(true).firstElementChild;
      el.className = 'search-more-item' + (_activeFilter === k ? ' active' : '');
      _moreDropdown.appendChild(el);
    });
  }

  function _renderResults(matched, cats) {
    const toRender = _activeFilter === 'all'
      ? cats
      : (_activeFilter in cats ? { [_activeFilter]: cats[_activeFilter] } : null);
    if (!toRender || !Object.keys(toRender).length) { _showState('empty'); return; }
    const showHeader = Object.keys(toRender).length > 1;

    _stateResults.innerHTML = '';
    Object.entries(toRender).forEach(([cat, items]) => {
      const group = document.createElement('div');
      group.className = 'search-group';

      if (showHeader) {
        const hdr = _tplGroupHeader.content.cloneNode(true).firstElementChild;
        hdr.querySelector('.search-group-name').textContent  = _getCatLabel(cat);
        hdr.querySelector('.search-group-count').textContent = items.length;
        group.appendChild(hdr);
      }

      items.forEach(item => {
        const el = _tplResultItem.content.cloneNode(true).firstElementChild;
        const iconTpl = document.getElementById('tpl-result-icon-' + cat);
        if (iconTpl) el.querySelector('.search-result-icon-holder').appendChild(iconTpl.content.cloneNode(true));
        el.querySelector('.search-result-name').innerHTML         = _highlight(item.name, _query);
        el.querySelector('.search-result-breadcrumb').textContent = `در بخش ${_getCatLabel(cat)}`;
        group.appendChild(el);
      });

      _stateResults.appendChild(group);
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
    document.querySelectorAll('#notifTabs .notif-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#notifTabs .notif-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    Modal.onClose('notif-modal', () => { if (_activeId !== null) _resetItemBtn(_activeId); _activeId = null; });
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

    const tpl     = document.getElementById('notif-detail-' + id);
    const content = document.getElementById('notifDetailContent');
    content.innerHTML = '';
    if (tpl) content.appendChild(tpl.content.cloneNode(true));

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
    const modal = document.getElementById('notif-modal');
    if (modal && modal.classList.contains('modal--open')) { Modal.close('notif-modal'); }
    else { Modal.open('notif-modal'); }
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
  $backdrop        = document.getElementById('backdrop');
  $bottomNav       = document.getElementById('bottomNav');
  $mobileMenuBtn   = document.getElementById('mobileMenuBtn');
  $mobileDrawer    = document.getElementById('mobileDrawer');
  $mobileDrawerBack = document.getElementById('mobileDrawerBack');
  $mobileSubDrawer = document.getElementById('mobileSubDrawer');
  $mobileSubTitle  = document.getElementById('mobileSubTitle');
  $mobileSubItems  = document.getElementById('mobileSubItems');
  $mobileSubClose  = document.getElementById('mobileSubClose');
  $mobileBackdrop  = document.getElementById('mobileBackdrop');
  $headerUser      = document.querySelector('.header-user');
  $userDropdown    = document.getElementById('userDropdown');
  $mobileProfileSheet = document.getElementById('mobileProfileSheet');

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

