/* =========================================================
   Access Levels Page — Interaction Logic
   manageAdmins/js/access.js
   ========================================================= */

/* ----------------------------------------------------------
   Access Modal — Add / Edit
   ---------------------------------------------------------- */

const AccessModal = (() => {
  'use strict';

  let _initialized = false;
  let _editingCard  = null;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    Modal.onOpen('access-modal', function () {
      var first = document.querySelector('#access-modal .input__field');
      if (first) setTimeout(function () { first.focus(); }, 50);
    });

    Modal.onClose('access-modal', function () {
      _resetForm();
      _editingCard = null;
    });

    var submitBtn = document.getElementById('accessSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        _handleSubmit();
      });
    }

    _initPermGroupSwitch();
  }

  /* ---- Open for Add ---- */
  function open() {
    _init();
    _editingCard = null;
    var title = document.getElementById('accessModalTitle');
    if (title) title.textContent = 'افزودن سطح دسترسی جدید';
    var btn = document.getElementById('accessSubmitBtn');
    if (btn) btn.textContent = 'تایید و افزودن سطح دسترسی';
    Modal.open('access-modal');
  }

  /* ---- Open for Edit ---- */
  function openEdit(card) {
    _init();
    _editingCard = card;
    var title = document.getElementById('accessModalTitle');
    if (title) title.textContent = 'ویرایش سطح دسترسی';
    var btn = document.getElementById('accessSubmitBtn');
    if (btn) btn.textContent = 'ذخیره تغییرات';

    /* Pre-fill name */
    var nameInput = document.getElementById('accessNameInput');
    var cardName  = card.querySelector('.access-card__name');
    if (nameInput && cardName) nameInput.value = cardName.textContent.trim();

    /* Load saved permissions if available */
    var permData = card.dataset.permissions;
    if (permData) {
      try { _loadPermState(JSON.parse(permData)); } catch (e) {}
    }

    Modal.open('access-modal');
  }

  /* ---- Close ---- */
  function close() {
    Modal.close('access-modal');
  }

  /* ---- Submit ---- */
  function _handleSubmit() {
    var nameInput = document.getElementById('accessNameInput');
    if (!nameInput || !nameInput.value.trim()) {
      if (nameInput) nameInput.focus();
      return;
    }

    var name      = nameInput.value.trim();
    var permState = _getPermState();

    if (_editingCard) {
      /* Edit: update name on existing card */
      var nameEl = _editingCard.querySelector('.access-card__name');
      if (nameEl) nameEl.textContent = name;

      var editBtn = _editingCard.querySelector('[data-edit]');
      if (editBtn) editBtn.setAttribute('aria-label', 'ویرایش سطح دسترسی ' + name);

      var delBtn = _editingCard.querySelector('[data-delete]');
      if (delBtn) delBtn.setAttribute('aria-label', 'حذف سطح دسترسی ' + name);

      _editingCard.dataset.permissions = JSON.stringify(permState);

    } else {
      /* Add: create new card and append to list */
      var id   = 'card-' + Date.now();
      var card = _createCard(id, name, '۰');
      card.dataset.permissions = JSON.stringify(permState);

      var list = document.getElementById('accessList');
      if (list) list.appendChild(card);

      AccessPage.updateCount();
      AccessPage.updateView();
    }

    Modal.close('access-modal');
  }

  /* ---- Build a new card element ---- */
  function _createCard(id, name, count) {
    var card = document.createElement('div');
    card.className = 'access-card';
    card.setAttribute('data-id', id);

    var safeName = _esc(name);

    card.innerHTML =
      '<ul class="access-card__name-list">' +
        '<li class="access-card__name">' + safeName + '</li>' +
      '</ul>' +
      '<div class="access-card__user-count">' +
        '<span class="access-card__count-num">' + count + '</span>' +
        '<span class="access-card__count-label">کاربران متصل</span>' +
      '</div>' +
      '<div class="access-card__btns">' +
        '<div class="access-card__vdivider" aria-hidden="true"></div>' +
        '<button class="btn btn--outline btn--large" type="button"' +
          ' aria-label="ویرایش سطح دسترسی ' + safeName + '" data-edit="' + id + '">' +
          '<span class="btn__text">ویرایش سطح دسترسی</span>' +
        '</button>' +
        '<button class="btn btn--outline btn--large btn--icon-only" type="button"' +
          ' aria-label="حذف سطح دسترسی ' + safeName + '" data-delete="' + id + '">' +
          '<span class="btn__icon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" width="18" height="18">' +
              '<polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
              '<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
              '<path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
              '<path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
          '</span>' +
        '</button>' +
      '</div>';

    return card;
  }

  /* ---- Collect current modal permission selections ---- */
  function _getPermState() {
    var state   = {};
    var switches = document.querySelectorAll('#access-modal .perm-group__switch');

    Array.prototype.forEach.call(switches, function (sw) {
      var group     = sw.getAttribute('data-group');
      var activeBtn = sw.querySelector('.perm-group__switch-btn--active');
      var mode      = activeBtn ? activeBtn.getAttribute('data-mode') : 'custom';
      var checked   = [];

      var items = document.querySelectorAll('[data-group-item="' + group + '"]');
      Array.prototype.forEach.call(items, function (cb) {
        if (cb.checked) checked.push(cb.value);
      });

      state[group] = { mode: mode, checked: checked };
    });

    return state;
  }

  /* ---- Load permission state into modal ---- */
  function _loadPermState(state) {
    if (!state) return;

    var switches = document.querySelectorAll('#access-modal .perm-group__switch');
    Array.prototype.forEach.call(switches, function (sw) {
      var group = sw.getAttribute('data-group');
      var gs    = state[group];
      if (!gs) return;

      /* Update switch buttons */
      var btns = sw.querySelectorAll('.perm-group__switch-btn');
      Array.prototype.forEach.call(btns, function (btn) {
        btn.classList.toggle('perm-group__switch-btn--active', btn.getAttribute('data-mode') === gs.mode);
      });

      /* Update checkboxes */
      var items = document.querySelectorAll('[data-group-item="' + group + '"]');
      Array.prototype.forEach.call(items, function (cb) {
        cb.checked = gs.checked.indexOf(cb.value) !== -1;
      });

      /* Show/hide items section */
      var pg      = sw.closest('.perm-group');
      var itemsEl = pg ? pg.querySelector('.perm-group__items') : null;

      if (gs.mode === 'full') {
        if (itemsEl) itemsEl.style.display = 'none';
        if (pg) pg.classList.add('perm-group--collapsed');
      } else {
        if (itemsEl) itemsEl.style.display = '';
        if (pg) pg.classList.remove('perm-group--collapsed');
      }
    });
  }

  /* ---- Reset form to defaults ---- */
  function _resetForm() {
    var nameInput = document.getElementById('accessNameInput');
    if (nameInput) nameInput.value = '';

    var checkboxes = document.querySelectorAll('#access-modal input[type="checkbox"]');
    Array.prototype.forEach.call(checkboxes, function (cb) {
      cb.checked = false;
      cb.indeterminate = false;
    });

    /* Reset all switches to 'سفارشی' mode and show items */
    var switches = document.querySelectorAll('#access-modal .perm-group__switch');
    Array.prototype.forEach.call(switches, function (switchEl) {
      var btns = switchEl.querySelectorAll('.perm-group__switch-btn');
      Array.prototype.forEach.call(btns, function (btn) {
        btn.classList.toggle('perm-group__switch-btn--active', btn.getAttribute('data-mode') === 'custom');
      });
      var group   = switchEl.closest('.perm-group');
      var itemsEl = group ? group.querySelector('.perm-group__items') : null;
      if (itemsEl) itemsEl.style.display = '';
      if (group) group.classList.remove('perm-group--collapsed');
    });
  }

  /* ---- Access mode switch toggle per group ---- */
  function _initPermGroupSwitch() {
    var switches = document.querySelectorAll('.perm-group__switch');
    Array.prototype.forEach.call(switches, function (switchEl) {
      var group = switchEl.getAttribute('data-group');

      switchEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.perm-group__switch-btn');
        if (!btn) return;

        var mode = btn.getAttribute('data-mode');

        /* Update active button */
        var btns = switchEl.querySelectorAll('.perm-group__switch-btn');
        Array.prototype.forEach.call(btns, function (b) {
          b.classList.remove('perm-group__switch-btn--active');
        });
        btn.classList.add('perm-group__switch-btn--active');

        var items   = document.querySelectorAll('[data-group-item="' + group + '"]');
        var itemsEl = switchEl.closest('.perm-group').querySelector('.perm-group__items');

        if (mode === 'full') {
          /* Select all + hide individual checkboxes */
          Array.prototype.forEach.call(items, function (item) { item.checked = true; });
          if (itemsEl) itemsEl.style.display = 'none';
          var pg = switchEl.closest('.perm-group');
          if (pg) pg.classList.add('perm-group--collapsed');
        } else {
          /* Show individual checkboxes for custom selection — uncheck all first */
          Array.prototype.forEach.call(items, function (item) { item.checked = false; });
          if (itemsEl) itemsEl.style.display = '';
          var pg = switchEl.closest('.perm-group');
          if (pg) pg.classList.remove('perm-group--collapsed');
        }
      });
    });
  }

  /* ---- HTML escape helper ---- */
  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return { open, openEdit, close };
})();

/* ----------------------------------------------------------
   Access Page Init
   ---------------------------------------------------------- */

const AccessPage = (() => {
  'use strict';

  /* ---- Update count badge ---- */
  function updateCount() {
    var countEl = document.getElementById('accessCount');
    if (!countEl) return;
    var cards = document.querySelectorAll('#accessList .access-card:not([style*="display: none"])');
    countEl.textContent = 'تعداد: ' + cards.length;
  }

  /* ---- Toggle empty / list ---- */
  function updateView() {
    var cards = document.querySelectorAll('#accessList .access-card');
    var empty = document.getElementById('accessEmpty');
    var list  = document.getElementById('accessList');
    if (!empty) return;

    if (cards.length > 0) {
      empty.classList.add('hidden');
      if (list) list.style.display = '';
    } else {
      empty.classList.remove('hidden');
      if (list) list.style.display = 'none';
    }
  }

  /* ---- Search ---- */
  function _initSearch() {
    var input = document.getElementById('accessSearchInput');
    if (!input) return;

    input.addEventListener('input', function () {
      var q     = this.value.trim().toLowerCase();
      var cards = document.querySelectorAll('#accessList .access-card');

      Array.prototype.forEach.call(cards, function (card) {
        var text  = card.textContent.toLowerCase();
        var match = !q || text.includes(q);
        card.style.display = match ? '' : 'none';
      });

      updateCount();
    });
  }

  /* ---- Add button ---- */
  function _initAddBtn() {
    var btn = document.getElementById('addAccessBtn');
    if (btn) {
      btn.addEventListener('click', function () {
        AccessModal.open();
      });
    }
  }

  /* ---- Edit + Delete buttons (event delegation) ---- */
  function _initCardActions() {
    var list = document.getElementById('accessList');
    if (!list) return;

    list.addEventListener('click', function (e) {
      /* Edit */
      var editBtn = e.target.closest('[data-edit]');
      if (editBtn) {
        var card = editBtn.closest('.access-card');
        if (card) AccessModal.openEdit(card);
        return;
      }

      /* Delete */
      var deleteBtn = e.target.closest('[data-delete]');
      if (deleteBtn) {
        var card = deleteBtn.closest('.access-card');
        if (!card) return;
        var name  = card.querySelector('.access-card__name');
        var label = name ? name.textContent.trim() : 'این سطح دسترسی';
        if (window.confirm('آیا از حذف «' + label + '» اطمینان دارید؟')) {
          card.remove();
          updateCount();
          updateView();
        }
      }
    });
  }

  /* ---- Boot ---- */
  function _boot() {
    updateCount();
    updateView();
    _initSearch();
    _initAddBtn();
    _initCardActions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot);
  } else {
    _boot();
  }

  return { updateCount, updateView };
})();
