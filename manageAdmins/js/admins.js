/* =========================================================
   Admins Page — Interaction Logic
   manageAdmins/js/admins.js
   ========================================================= */

/* ----------------------------------------------------------
   Admin Profile — View / Edit Toggle
   ---------------------------------------------------------- */

const AdminProfile = (() => {
  let _initialized = false;
  let _snapshot    = {};

  function _init() {
    if (_initialized) return;
    _initialized = true;

    const editBtn   = document.getElementById('editAdminProfileBtn');
    const saveBtn   = document.getElementById('saveAdminProfileBtn');
    const cancelBtn = document.getElementById('cancelAdminProfileBtn');

    if (editBtn)   editBtn.addEventListener('click', _enterEdit);
    if (saveBtn)   saveBtn.addEventListener('click', _save);
    if (cancelBtn) cancelBtn.addEventListener('click', _cancel);
  }

  /* ------ Edit ------ */
  function _enterEdit() {
    const card = document.querySelector('.profile-admin-card');
    if (!card) return;

    /* Snapshot text input values */
    _snapshot = {};
    card.querySelectorAll('.input__field').forEach(function (inp) {
      _snapshot[inp.id] = inp.value;
    });

    /* Snapshot status from hidden input inside the select */
    var statusSelect = document.getElementById('adminStatusEdit');
    var hiddenInput  = statusSelect && statusSelect.querySelector('input[type="hidden"]');
    _snapshot._status = hiddenInput ? hiddenInput.value : 'active';

    /* Make text inputs editable */
    card.querySelectorAll('.input__field').forEach(function (inp) {
      inp.removeAttribute('readonly');
    });

    /* Switch status: hide view → show select */
    var statusView = document.getElementById('adminStatusView');
    if (statusView) statusView.classList.add('hidden');
    if (statusSelect) {
      statusSelect.classList.remove('hidden');
      /* Init select if not already; select.js initAll() may have already done this */
      var instance = statusSelect._selectInstance ||
                     (window.Select && Select.init(statusSelect));
      if (instance) {
        /* Reflect current value in CSS data attribute for tag-color styling */
        statusSelect.dataset.status = instance.getValue() || 'active';
        instance.onChange(function (val) {
          statusSelect.dataset.status = val || 'active';
        });
      }
    }

    card.classList.add('is-editing');

    var actions = document.getElementById('adminProfileActions');
    if (actions) actions.classList.remove('hidden');

    var editBtn = document.getElementById('editAdminProfileBtn');
    if (editBtn) editBtn.classList.add('is-active');

    /* Focus first editable input */
    var first = card.querySelector('.input__field:not([readonly])');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }

  /* ------ Save ------ */
  function _save() {
    const card = document.querySelector('.profile-admin-card');
    if (!card) return;

    /* Validate non-empty */
    var valid = true;
    card.querySelectorAll('.input__field').forEach(function (inp) {
      if (!inp.value.trim()) { inp.focus(); valid = false; }
    });
    if (!valid) return;

    /* Update status tag from select component */
    var statusSelect = document.getElementById('adminStatusEdit');
    var instance     = statusSelect && statusSelect._selectInstance;
    var newStatus    = instance ? (instance.getValue() || 'active') : (_snapshot._status || 'active');
    _updateStatusTag(newStatus);

    _exitEdit();
  }

  /* ------ Cancel ------ */
  function _cancel() {
    const card = document.querySelector('.profile-admin-card');
    if (!card) return;

    /* Restore text input values */
    card.querySelectorAll('.input__field').forEach(function (inp) {
      if (_snapshot[inp.id] !== undefined) inp.value = _snapshot[inp.id];
    });

    /* Restore status */
    var restoredStatus = _snapshot._status || 'active';
    _updateStatusTag(restoredStatus);
    var statusSelect = document.getElementById('adminStatusEdit');
    var instance     = statusSelect && statusSelect._selectInstance;
    if (instance) instance.setValue(restoredStatus);

    _exitEdit();
  }

  /* ------ Helpers ------ */
  function _updateStatusTag(val) {
    var tag = document.getElementById('adminStatusTag');
    if (!tag) return;
    var label   = val === 'active' ? 'فعال' : 'غیرفعال';
    var modCls  = 'profile-admin-card__status-tag--' + val;
    tag.textContent = label;
    tag.className   = 'tag tag--filled tag--large tag--rounded profile-admin-card__status-tag ' + modCls;

    /* Keep hidden input in sync */
    var statusSelect = document.getElementById('adminStatusEdit');
    var hidden       = statusSelect && statusSelect.querySelector('input[type="hidden"]');
    if (hidden) hidden.value = val;
  }

  function _exitEdit() {
    const card = document.querySelector('.profile-admin-card');
    if (!card) return;

    /* Make text inputs readonly again */
    card.querySelectorAll('.input__field').forEach(function (inp) {
      inp.setAttribute('readonly', '');
    });

    /* Switch status: hide select → show view */
    var statusView   = document.getElementById('adminStatusView');
    var statusSelect = document.getElementById('adminStatusEdit');
    if (statusView)   statusView.classList.remove('hidden');
    if (statusSelect) statusSelect.classList.add('hidden');

    card.classList.remove('is-editing');

    var actions = document.getElementById('adminProfileActions');
    if (actions) actions.classList.add('hidden');

    var editBtn = document.getElementById('editAdminProfileBtn');
    if (editBtn) editBtn.classList.remove('is-active');
  }

  function init() { _init(); }

  return { init };
})();

/* ----------------------------------------------------------
   Add Admin Modal
   ---------------------------------------------------------- */

const AddAdminModal = (() => {
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    Modal.onOpen('add-admin-modal', function () {
      const firstInput = document.querySelector('#add-admin-modal .input__field');
      if (firstInput) firstInput.focus();
    });

    Modal.onClose('add-admin-modal', function () {
      _resetForm();
    });

    const form = document.getElementById('addAdminForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        _handleSubmit();
      });
    }

    const submitBtn = document.getElementById('addAdminSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        _handleSubmit();
      });
    }
  }

  function _handleSubmit() {
    const nameField = document.getElementById('adminNameInput');
    if (nameField && !nameField.value.trim()) {
      nameField.focus();
      return;
    }
    Modal.close('add-admin-modal');
  }

  function _resetForm() {
    const form = document.getElementById('addAdminForm');
    if (form) form.reset();
  }

  function open() {
    _init();
    Modal.open('add-admin-modal');
  }

  function close() {
    Modal.close('add-admin-modal');
  }

  return { open, close };
})();

/* ----------------------------------------------------------
   Admins Page Init
   ---------------------------------------------------------- */

(function () {
  'use strict';

  /* Toggle between empty state and table */
  function _updateView() {
    const rows = document.querySelectorAll('#adminsTableContainer .table__tbody .table__row');
    const empty = document.getElementById('adminsEmpty');
    if (!empty) return;

    const hasRows = rows.length > 0;
    const scrollWrap = document.querySelector('#adminsTableContainer .table__scroll-wrapper');
    const searchBox  = document.querySelector('#adminsTableContainer .table__search');
    const pagination = document.querySelector('#adminsTableContainer .table__pagination');

    if (hasRows) {
      empty.classList.add('hidden');
      if (scrollWrap) scrollWrap.style.display = '';
      if (searchBox)  searchBox.style.display  = '';
      if (pagination) pagination.style.display  = '';
    } else {
      empty.classList.remove('hidden');
      if (scrollWrap) scrollWrap.style.display = 'none';
      if (searchBox)  searchBox.style.display  = 'none';
      if (pagination) pagination.style.display  = 'none';
    }
  }

  /* Row click → navigate to profile page */
  function _initRowNavigation() {
    const tbody = document.querySelector('#adminsTableContainer .table__tbody');
    if (!tbody) return;

    tbody.addEventListener('click', function (e) {
      const row = e.target.closest('.table__row');
      if (!row) return;

      const checkbox = e.target.closest('.table__cell--checkbox, input[type="checkbox"]');
      if (checkbox) return;

      window.location.href = 'profile-admins.html';
    });
  }

  /* Search filter */
  function _initSearch() {
    const input = document.getElementById('adminsSearchInput');
    if (!input) return;

    input.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      const rows = document.querySelectorAll('#adminsTableContainer .table__tbody .table__row');
      let visibleCount = 0;

      rows.forEach(function (row) {
        const text = row.textContent.toLowerCase();
        const match = !q || text.includes(q);
        row.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      const noResults = document.querySelector('#adminsTableContainer .table__no-results');
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
      }
    });
  }

  /* Dynamic row count — keeps #adminsCount in sync */
  function _updateCount() {
    const countEl = document.getElementById('adminsCount');
    if (!countEl) return;
    const rows = document.querySelectorAll('#adminsTableContainer .table__tbody .table__row');
    countEl.textContent = 'تعداد: ' + rows.length + ' مورد';
  }

  /* Add button */
  function _initAddBtn() {
    const btn = document.getElementById('addAdminBtn');
    if (btn) {
      btn.addEventListener('click', function () {
        AddAdminModal.open();
      });
    }
  }

  /* Init select components inside modal */
  function _initModalSelects() {
    Modal.onOpen('add-admin-modal', function () {
      if (window.Select && typeof Select.initAll === 'function') {
        const modal = document.getElementById('add-admin-modal');
        if (modal) Select.initAll(modal);
      }
    });
  }

  /* Watch tbody for row removals → keep count in sync */
  function _initCountObserver() {
    const tbody = document.querySelector('#adminsTableContainer .table__tbody');
    if (!tbody || !window.MutationObserver) return;
    const observer = new MutationObserver(function () {
      _updateCount();
      _updateView();
    });
    observer.observe(tbody, { childList: true });
  }

  /* Boot */
  function _boot() {
    _updateCount();
    _updateView();
    _initRowNavigation();
    _initSearch();
    _initAddBtn();
    _initModalSelects();
    _initCountObserver();
    AdminProfile.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot);
  } else {
    _boot();
  }
})();
