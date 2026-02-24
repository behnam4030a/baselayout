/* =================================================================
   Users List Page — JS
   ================================================================= */

const UsersListPage = (() => {
  const TABLE_ID = 'users-table';

  /* ---------------------------------------------------------------
     Empty State
     --------------------------------------------------------------- */

  function _checkEmptyState() {
    const container = document.querySelector(`[data-table="${TABLE_ID}"]`);
    if (!container) return;

    const tbody = container.querySelector('.table__tbody');
    const hasRows = tbody && tbody.querySelectorAll('tr.table__row').length > 0;

    container.classList.toggle('table-container--empty', !hasRows);
  }

  /* ---------------------------------------------------------------
     Modal subtitle — selection count
     --------------------------------------------------------------- */

  function _toPersianDigits(n) {
    return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  function _updateModalSubtitles(count) {
    const text = `${_toPersianDigits(count)} کاربر انتخاب شده`;
    ['usersStatusModalSubtitle', 'usersAccessModalSubtitle', 'usersAddGroupModalSubtitle', 'usersAddExamModalSubtitle'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    });
  }

  /* ---------------------------------------------------------------
     افزودن به گروه — group list toggle
     --------------------------------------------------------------- */

  const SVG_CHECK = `<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><circle cx="10" cy="10" r="9" fill="var(--brand)" stroke="var(--brand)"/><path d="M6 10l3 3 5-5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const SVG_PLUS  = `<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><circle cx="10" cy="10" r="9" stroke="var(--stroke)" stroke-width="1.5"/><path d="M10 7v6M7 10h6" stroke="var(--text-2)" stroke-width="1.5" stroke-linecap="round"/></svg>`;

  function _initGroupList() {
    const list = document.querySelector('.users-add-group-modal__list');
    if (!list) return;

    list.addEventListener('click', function (e) {
      const item = e.target.closest('.users-add-group-modal__item');
      if (!item) return;

      const isSelected = item.classList.toggle('users-add-group-modal__item--selected');
      const actionEl = item.querySelector('.users-add-group-modal__item-action');
      if (actionEl) actionEl.innerHTML = isSelected ? SVG_CHECK : SVG_PLUS;
    });
  }

  /* ---------------------------------------------------------------
     Init
     --------------------------------------------------------------- */

  function _init() {
    const container = document.querySelector(`[data-table="${TABLE_ID}"]`);
    if (!container) return;

    _checkEmptyState();

    const tbody = container.querySelector('.table__tbody');
    if (tbody) {
      new MutationObserver(_checkEmptyState).observe(tbody, { childList: true });
    }

    // Update modal subtitles when row selection changes
    if (typeof Table !== 'undefined') {
      Table.onSelect(TABLE_ID, function (data) {
        _updateModalSubtitles(data.selected.length);
      });
    }

    _initGroupList();
  }

  document.addEventListener('DOMContentLoaded', _init);

  return { checkEmptyState: _checkEmptyState };
})();

/* =================================================================
   Exam Bulk Modal — افزودن آزمون به کاربران
   ================================================================= */

const UsersExamBulkModal = (() => {
  const SVG_MINUS = '<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const SVG_PLUS  = '<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  function _toPersian(n) {
    return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  function _formatPrice(n) {
    // e.g. 196000 → ۱۹۶،۰۰۰
    return _toPersian(n.toLocaleString('en-US').replace(/,/g, '،'));
  }

  function _updateSummary() {
    const list = document.getElementById('examBulkList');
    if (!list) return;

    let total = 0;
    const selectedItems = list.querySelectorAll('.exam-bulk__item--has-plan');
    selectedItems.forEach(function (item) {
      const activeBtn = item.querySelector('.exam-bulk__plan--active');
      if (activeBtn) total += parseInt(activeBtn.dataset.price || '0', 10);
    });

    const priceEl = document.getElementById('examBulkPriceVal');
    const countEl = document.getElementById('examBulkCountVal');
    if (priceEl) priceEl.textContent = _formatPrice(total);
    if (countEl) countEl.textContent = _toPersian(selectedItems.length) + ' آزمون';
  }

  function _handlePlanClick(e) {
    const btn = e.target.closest('.exam-bulk__plan');
    if (!btn) return;

    const item = btn.closest('.exam-bulk__item');
    if (!item) return;

    const wasActive = btn.classList.contains('exam-bulk__plan--active');

    // Deactivate all plans in this item
    item.querySelectorAll('.exam-bulk__plan').forEach(function (p) {
      p.classList.remove('exam-bulk__plan--active');
      p.setAttribute('aria-pressed', 'false');
      const iconEl = p.querySelector('.exam-bulk__plan-icon');
      if (iconEl) iconEl.innerHTML = SVG_PLUS;
    });

    if (!wasActive) {
      // Activate clicked plan
      btn.classList.add('exam-bulk__plan--active');
      btn.setAttribute('aria-pressed', 'true');
      const iconEl = btn.querySelector('.exam-bulk__plan-icon');
      if (iconEl) iconEl.innerHTML = SVG_MINUS;
    }

    item.classList.toggle('exam-bulk__item--has-plan', !!item.querySelector('.exam-bulk__plan--active'));
    _updateSummary();
  }

  function _handleSearch(e) {
    const q = e.target.value.trim();
    const list = document.getElementById('examBulkList');
    if (!list) return;

    list.querySelectorAll('.exam-bulk__item').forEach(function (item) {
      const name = item.querySelector('.exam-bulk__item-name');
      item.hidden = q ? !name.textContent.includes(q) : false;
    });
  }

  function _init() {
    const list = document.getElementById('examBulkList');
    if (list) list.addEventListener('click', _handlePlanClick);

    const search = document.getElementById('examBulkSearch');
    if (search) search.addEventListener('input', _handleSearch);

    _updateSummary();
  }

  document.addEventListener('DOMContentLoaded', _init);

  return {};
})();

/* =================================================================
   Add User Modal
   ================================================================= */

const AddUserModal = (() => {
  'use strict';

  let _initialized = false;

  /* ---- State ---- */
  const _selectedTests = new Map(); // testId → { name, tier, price }
  const _selectedGroups = new Set(); // groupId
  let _allTests = [];
  let _allGroups = [];
  let _createFormVisible = false;

  /* ---- Sample data (replace with API call) ---- */
  const _TESTS_DATA = [
    { id: 't1', name: 'آزمون زبان انگلیسی', prices: { advanced: 98000, limited: 67000 } },
    { id: 't2', name: 'آزمون ریاضیات پیشرفته', prices: { advanced: 120000, limited: 85000 } },
    { id: 't3', name: 'آزمون علوم پایه', prices: { advanced: 75000, limited: 50000 } },
    { id: 't4', name: 'آزمون برنامه‌نویسی', prices: { advanced: 150000, limited: 100000 } },
    { id: 't5', name: 'آزمون اصول مدیریت پروژه', prices: { advanced: 110000, limited: 75000 } },
  ];

  const _GROUPS_DATA = [
    { id: 'g1', name: 'گروه کارمندان جدید' },
    { id: 'g2', name: 'گروه مدیران ارشد' },
    { id: 'g3', name: 'گروه پشتیبانی فنی' },
    { id: 'g4', name: 'گروه فروش' },
  ];

  /* ---- SVG icons ---- */
  const _SVG_CHECK = '<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><circle cx="10" cy="10" r="9" fill="var(--brand)" stroke="var(--brand)"/><path d="M6 10l3 3 5-5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const _SVG_CIRCLE_EMPTY = '<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><circle cx="10" cy="10" r="9" stroke="var(--stroke)" stroke-width="1.5"/></svg>';
  const _SVG_PLUS_CIRCLE = '<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><circle cx="10" cy="10" r="9" stroke="var(--stroke)" stroke-width="1.5"/><path d="M10 7v6M7 10h6" stroke="var(--text-2)" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const _SVG_MINUS = '<svg viewBox="0 0 14 14" fill="none" width="14" height="14"><path d="M3 7h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const _SVG_PLUS_SM = '<svg viewBox="0 0 14 14" fill="none" width="14" height="14"><path d="M7 3v8M3 7h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  /* ---- Helpers ---- */
  function _toPersian(n) {
    return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  function _formatPrice(n) {
    return _toPersian(n.toLocaleString()) + ' تومان';
  }

  /* ---- Test list ---- */
  function _renderTests(query) {
    const list = document.getElementById('add-user-test-list');
    if (!list) return;

    const q = (query || '').trim();
    const tests = q ? _allTests.filter(t => t.name.includes(q)) : _allTests;

    list.innerHTML = tests.map(test => {
      const sel = _selectedTests.get(test.id);
      return `
        <li class="add-user-test-item" data-test-id="${test.id}" role="listitem">
          <div class="add-user-test-item__info">
            <span class="add-user-test-item__check">${sel ? _SVG_CHECK : _SVG_CIRCLE_EMPTY}</span>
            <span class="add-user-test-item__name">${test.name}</span>
          </div>
          <div class="add-user-test-item__tiers">
            <button class="add-user-test-item__tier${sel && sel.tier === 'advanced' ? ' add-user-test-item__tier--selected' : ''}" data-tier="advanced" type="button" aria-pressed="${sel && sel.tier === 'advanced' ? 'true' : 'false'}">
              <span class="add-user-test-item__tier-icon">${sel && sel.tier === 'advanced' ? _SVG_MINUS : _SVG_PLUS_SM}</span>
              <span class="add-user-test-item__tier-label">پیشرفته</span>
              <span class="add-user-test-item__tier-price">${_formatPrice(test.prices.advanced)}</span>
            </button>
            <button class="add-user-test-item__tier${sel && sel.tier === 'limited' ? ' add-user-test-item__tier--selected' : ''}" data-tier="limited" type="button" aria-pressed="${sel && sel.tier === 'limited' ? 'true' : 'false'}">
              <span class="add-user-test-item__tier-icon">${sel && sel.tier === 'limited' ? _SVG_MINUS : _SVG_PLUS_SM}</span>
              <span class="add-user-test-item__tier-label">محدود</span>
              <span class="add-user-test-item__tier-price">${_formatPrice(test.prices.limited)}</span>
            </button>
          </div>
        </li>`;
    }).join('');
  }

  function _updateTestFooter() {
    const summary = document.getElementById('add-user-test-summary');
    const priceEl = document.getElementById('add-user-test-price');
    const count = _selectedTests.size;

    if (summary) {
      summary.textContent = count > 0 ? _toPersian(count) + ' آزمون انتخاب شده' : 'آزمونی انتخاب نشده';
    }
    if (priceEl) {
      let total = 0;
      _selectedTests.forEach(s => { total += s.price; });
      priceEl.textContent = total > 0 ? 'جمع: ' + _formatPrice(total) : '';
    }
  }

  function _updateTestTrigger() {
    const textEl = document.getElementById('add-user-test-trigger-text');
    const metaEl = document.getElementById('add-user-test-trigger-meta');
    const count = _selectedTests.size;

    if (textEl) {
      textEl.textContent = count > 0 ? _toPersian(count) + ' آزمون انتخاب شده' : 'آزمون اضافه کنید..';
      textEl.classList.toggle('add-user-trigger__text--selected', count > 0);
    }
    if (metaEl) {
      let total = 0;
      _selectedTests.forEach(s => { total += s.price; });
      metaEl.hidden = total === 0;
      metaEl.innerHTML = total > 0 ? `<span class="add-user-trigger__price-badge">${_formatPrice(total)}</span>` : '';
    }
  }

  function _onTestListClick(e) {
    const tierBtn = e.target.closest('.add-user-test-item__tier');
    if (!tierBtn) return;

    const item = tierBtn.closest('.add-user-test-item');
    if (!item) return;

    const testId = item.dataset.testId;
    const tier = tierBtn.dataset.tier;
    const test = _allTests.find(t => t.id === testId);
    if (!test) return;

    const existing = _selectedTests.get(testId);
    if (existing && existing.tier === tier) {
      _selectedTests.delete(testId);
    } else {
      _selectedTests.set(testId, { name: test.name, tier, price: test.prices[tier] });
    }

    _renderTests(document.getElementById('add-user-test-search')?.value || '');
    _updateTestFooter();
  }

  /* ---- Group list ---- */
  function _renderGroups(query) {
    const list = document.getElementById('add-user-group-list');
    if (!list) return;

    const q = (query || '').trim();
    const groups = q ? _allGroups.filter(g => g.name.includes(q)) : _allGroups;

    list.innerHTML = groups.map(group => {
      const selected = _selectedGroups.has(group.id);
      return `
        <li class="add-user-group-item${selected ? ' add-user-group-item--selected' : ''}" data-group-id="${group.id}" role="listitem">
          <span class="add-user-group-item__name">${group.name}</span>
          <span class="add-user-group-item__action">${selected ? _SVG_CHECK : _SVG_PLUS_CIRCLE}</span>
        </li>`;
    }).join('');
  }

  function _updateGroupTrigger() {
    const textEl = document.getElementById('add-user-group-trigger-text');
    const count = _selectedGroups.size;

    if (textEl) {
      textEl.textContent = count > 0 ? _toPersian(count) + ' گروه انتخاب شده' : 'گروه اضافه کنید..';
      textEl.classList.toggle('add-user-trigger__text--selected', count > 0);
    }
  }

  function _onGroupListClick(e) {
    const item = e.target.closest('.add-user-group-item');
    if (!item) return;

    const groupId = item.dataset.groupId;
    if (_selectedGroups.has(groupId)) {
      _selectedGroups.delete(groupId);
    } else {
      _selectedGroups.add(groupId);
    }

    _renderGroups(document.getElementById('add-user-group-search')?.value || '');
  }

  /* ---- Create group form ---- */
  function _toggleCreateForm() {
    _createFormVisible = !_createFormVisible;
    const form = document.getElementById('add-user-group-create-form');
    const btn = document.getElementById('add-user-group-create-btn');
    if (form) form.hidden = !_createFormVisible;
    if (btn) btn.classList.toggle('input--active', _createFormVisible);
  }

  function _addNewGroup() {
    const input = document.getElementById('add-user-new-group-input');
    if (!input) return;
    const name = input.value.trim();
    if (!name) { input.focus(); return; }

    const newId = 'new_' + Date.now();
    _allGroups.unshift({ id: newId, name });
    _selectedGroups.add(newId);
    input.value = '';
    _toggleCreateForm();
    _renderGroups('');
  }

  /* ---- Reset on modal close ---- */
  function _reset() {
    _selectedTests.clear();
    _selectedGroups.clear();
    _createFormVisible = false;
    _allTests = _TESTS_DATA.map(t => Object.assign({}, t));
    _allGroups = _GROUPS_DATA.map(g => Object.assign({}, g));

    const form = document.getElementById('add-user-group-create-form');
    if (form) form.hidden = true;
    const btn = document.getElementById('add-user-group-create-btn');
    if (btn) btn.classList.remove('input--active');

    ['add-user-code', 'add-user-name', 'add-user-phone', 'add-user-new-group-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    _updateTestTrigger();
    _updateGroupTrigger();
  }

  /* ---- Init ---- */
  function _init() {
    if (_initialized) return;
    _initialized = true;

    _allTests = _TESTS_DATA.map(t => Object.assign({}, t));
    _allGroups = _GROUPS_DATA.map(g => Object.assign({}, g));

    /* Test panel */
    const testList = document.getElementById('add-user-test-list');
    if (testList) testList.addEventListener('click', _onTestListClick);

    const testSearch = document.getElementById('add-user-test-search');
    if (testSearch) testSearch.addEventListener('input', function () { _renderTests(this.value); });

    const testSaveBtn = document.getElementById('add-user-test-save');
    if (testSaveBtn) testSaveBtn.addEventListener('click', function () {
      _updateTestTrigger();
      Modal.closePanel('add-user-test-panel');
    });

    /* Group panel */
    const groupList = document.getElementById('add-user-group-list');
    if (groupList) groupList.addEventListener('click', _onGroupListClick);

    const groupSearch = document.getElementById('add-user-group-search');
    if (groupSearch) groupSearch.addEventListener('input', function () { _renderGroups(this.value); });

    const createBtn = document.getElementById('add-user-group-create-btn');
    if (createBtn) createBtn.addEventListener('click', _toggleCreateForm);

    const createSubmit = document.getElementById('add-user-group-create-submit');
    if (createSubmit) createSubmit.addEventListener('click', function (e) {
      e.stopPropagation();
      _addNewGroup();
    });

    const groupSaveBtn = document.getElementById('add-user-group-save');
    if (groupSaveBtn) groupSaveBtn.addEventListener('click', function () {
      _updateGroupTrigger();
      Modal.closePanel('add-user-group-panel');
    });

    /* Main form trigger buttons */
    const testTrigger = document.getElementById('add-user-test-trigger');
    if (testTrigger) testTrigger.addEventListener('click', function () {
      _renderTests('');
      _updateTestFooter();
      Modal.closePanel('add-user-group-panel');
      Modal.openPanel('add-user-test-panel');
      this.setAttribute('aria-expanded', 'true');
    });

    const groupTrigger = document.getElementById('add-user-group-trigger');
    if (groupTrigger) groupTrigger.addEventListener('click', function () {
      _renderGroups('');
      Modal.closePanel('add-user-test-panel');
      Modal.openPanel('add-user-group-panel');
      this.setAttribute('aria-expanded', 'true');
    });

    /* Submit */
    const submitBtn = document.getElementById('add-user-submit');
    if (submitBtn) submitBtn.addEventListener('click', function () {
      const code = document.getElementById('add-user-code')?.value?.trim();
      if (!code) {
        document.getElementById('add-user-code')?.focus();
        return;
      }
      // TODO: POST to API
      Modal.close('add-user-modal');
    });

    /* Re-render lists and reset search when modal opens */
    Modal.onOpen('add-user-modal', function () {
      const testSearch = document.getElementById('add-user-test-search');
      if (testSearch) testSearch.value = '';
      const groupSearch = document.getElementById('add-user-group-search');
      if (groupSearch) groupSearch.value = '';
    });

    /* Reset state when modal closes */
    Modal.onClose('add-user-modal', _reset);
  }

  function open() {
    Modal.open('add-user-modal');
  }

  function close() {
    Modal.close('add-user-modal');
  }

  /* Init on DOMContentLoaded so listeners are ready regardless of how the modal is opened */
  document.addEventListener('DOMContentLoaded', _init);

  return { open, close };
})();

/* =================================================================
   Bulk Import Wizard — افزودن گروهی کاربران
   ================================================================= */

const BulkImport = (() => {
  const MODAL_ID = 'bulk-import-modal';

  const SVG_CHECK = `<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><circle cx="10" cy="10" r="9" fill="var(--brand)" stroke="var(--brand)"/><path d="M6 10l3 3 5-5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const SVG_PLUS  = `<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><circle cx="10" cy="10" r="9" stroke="var(--stroke)" stroke-width="1.5"/><path d="M10 7v6M7 10h6" stroke="var(--text-2)" stroke-width="1.5" stroke-linecap="round"/></svg>`;

  function _toPersianDigits(n) {
    return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  /* ---------------------------------------------------------------
     Step navigation
     --------------------------------------------------------------- */

  function _goToStep(step) {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;

    modal.querySelectorAll('[data-step-item]').forEach(el => {
      const s = parseInt(el.dataset.stepItem, 10);
      el.classList.remove('bulk-import__step-item--active', 'bulk-import__step-item--done');
      if (s < step) el.classList.add('bulk-import__step-item--done');
      else if (s === step) el.classList.add('bulk-import__step-item--active');
    });

    modal.querySelectorAll('[data-panel]').forEach(el => {
      el.hidden = (parseInt(el.dataset.panel, 10) !== step);
    });

    modal.querySelectorAll('[data-step-actions]').forEach(el => {
      el.hidden = (parseInt(el.dataset.stepActions, 10) !== step);
    });

    const stepper = document.getElementById('bulkImportStepper');
    if (stepper) stepper.hidden = (step === 3);

    // Close assign panel when leaving step 2
    if (step !== 2) _closeAssignPanel();
  }

  /* ---------------------------------------------------------------
     Expanded assign panel
     --------------------------------------------------------------- */

  function _openAssignPanel(type) {
    const modal = document.getElementById(MODAL_ID);
    const panel = document.getElementById('bulkImportPanel');
    if (!modal || !panel) return;

    modal.querySelectorAll('[data-assign-panel]').forEach(el => {
      el.hidden = (el.dataset.assignPanel !== type);
    });

    panel.classList.add('modal__expanded--open');
  }

  function _closeAssignPanel() {
    const panel = document.getElementById('bulkImportPanel');
    if (panel) panel.classList.remove('modal__expanded--open');
  }

  /* ---------------------------------------------------------------
     Update trigger text after selection
     --------------------------------------------------------------- */

  function _updateTrigger(type, count) {
    if (type === 'test') {
      const el = document.getElementById('bulkImportTestValue');
      const trigger = document.getElementById('bulkImportTestTrigger');
      if (el) el.textContent = count > 0 ? `${_toPersianDigits(count)} آزمون انتخاب شده` : 'انتخاب آزمون';
      if (trigger) trigger.classList.toggle('bulk-import__field-trigger--active', count > 0);
    } else {
      const el = document.getElementById('bulkImportGroupValue');
      const trigger = document.getElementById('bulkImportGroupTrigger');
      if (el) el.textContent = count > 0 ? `${_toPersianDigits(count)} گروه انتخاب شده` : 'انتخاب گروه';
      if (trigger) trigger.classList.toggle('bulk-import__field-trigger--active', count > 0);
    }
  }

  /* ---------------------------------------------------------------
     Dropzone
     --------------------------------------------------------------- */

  function _initDropzone() {
    const zone    = document.getElementById('bulkImportDropzone');
    const input   = document.getElementById('bulkImportFileInput');
    const preview = document.getElementById('bulkImportFilePreview');
    const nameEl  = document.getElementById('bulkImportFileName');
    const sizeEl  = document.getElementById('bulkImportFileSize');
    const removeBtn  = document.getElementById('bulkImportFileRemove');
    const nextBtn = document.getElementById('bulkImportUploadNextBtn');
    if (!zone || !input) return;

    function _applyFile(file) {
      if (!file) return;
      if (nameEl) nameEl.textContent = file.name;
      if (sizeEl) {
        const kb = file.size / 1024;
        sizeEl.textContent = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
      }
      if (preview) preview.hidden = false;
      if (zone)    zone.style.display = 'none';
      if (nextBtn) nextBtn.disabled = false;
    }

    function _clearFile() {
      input.value = '';
      if (preview) preview.hidden = true;
      if (zone)    zone.style.display = '';
      if (nextBtn) nextBtn.disabled = true;
    }

    input.addEventListener('change', function () {
      if (this.files && this.files[0]) _applyFile(this.files[0]);
    });

    zone.addEventListener('dragover', function (e) {
      e.preventDefault();
      zone.classList.add('bulk-import__dropzone--dragover');
    });

    zone.addEventListener('dragleave', function () {
      zone.classList.remove('bulk-import__dropzone--dragover');
    });

    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      zone.classList.remove('bulk-import__dropzone--dragover');
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) _applyFile(file);
    });

    if (removeBtn) removeBtn.addEventListener('click', _clearFile);
  }

  /* ---------------------------------------------------------------
     Assign list toggles (test + group)
     --------------------------------------------------------------- */

  function _initAssignLists() {
    const testList = document.getElementById('bulkImportTestList');
    if (testList) {
      testList.addEventListener('click', function (e) {
        const tierBtn  = e.target.closest('.bulk-import-assign__tier');
        const actionBtn = e.target.closest('.bulk-import-assign__item-action');
        const item     = e.target.closest('.bulk-import-assign__item');

        if (tierBtn) {
          const tiers = tierBtn.closest('.bulk-import-assign__item-tiers');
          if (tiers) {
            tiers.querySelectorAll('.bulk-import-assign__tier').forEach(t => t.classList.remove('bulk-import-assign__tier--active'));
            tierBtn.classList.add('bulk-import-assign__tier--active');
          }
          return;
        }

        if (actionBtn && item) {
          const isSelected = item.classList.toggle('bulk-import-assign__item--selected');
          actionBtn.innerHTML = isSelected ? SVG_CHECK : SVG_PLUS;
          actionBtn.setAttribute('aria-pressed', String(isSelected));
          const count = testList.querySelectorAll('.bulk-import-assign__item--selected').length;
          _updateTrigger('test', count);
        }
      });
    }

    const groupList = document.getElementById('bulkImportGroupList');
    if (groupList) {
      groupList.addEventListener('click', function (e) {
        const actionBtn = e.target.closest('.bulk-import-assign__item-action');
        const item      = e.target.closest('.bulk-import-assign__item');
        if (!actionBtn || !item) return;

        const isSelected = item.classList.toggle('bulk-import-assign__item--selected');
        actionBtn.innerHTML = isSelected ? SVG_CHECK : SVG_PLUS;
        actionBtn.setAttribute('aria-pressed', String(isSelected));
        const count = groupList.querySelectorAll('.bulk-import-assign__item--selected').length;
        _updateTrigger('group', count);
      });
    }
  }

  /* ---------------------------------------------------------------
     Init
     --------------------------------------------------------------- */

  function _init() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;

    // Reset to step 0 whenever the modal opens
    Modal.onOpen(MODAL_ID, function () {
      _goToStep(0);
    });

    // Step 0 → 1
    const startBtn = document.getElementById('bulkImportStartBtn');
    if (startBtn) startBtn.addEventListener('click', () => _goToStep(1));

    // Step 1 → 0
    const backBtn = document.getElementById('bulkImportBackToStep0');
    if (backBtn) backBtn.addEventListener('click', () => _goToStep(0));

    // Step 1 → 2
    const uploadNextBtn = document.getElementById('bulkImportUploadNextBtn');
    if (uploadNextBtn) uploadNextBtn.addEventListener('click', () => _goToStep(2));

    // Step 2 → 1 (re-upload)
    const reuploadBtn = document.getElementById('bulkImportReuploadBtn');
    if (reuploadBtn) reuploadBtn.addEventListener('click', () => _goToStep(1));

    // Step 2 → 3 (confirm)
    const confirmBtn = document.getElementById('bulkImportConfirmBtn');
    if (confirmBtn) confirmBtn.addEventListener('click', function () {
      _goToStep(3);
    });

    // Open test assign panel
    const testTrigger = document.getElementById('bulkImportTestTrigger');
    if (testTrigger) {
      testTrigger.addEventListener('click', () => _openAssignPanel('test'));
      testTrigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _openAssignPanel('test'); }
      });
    }

    // Open group assign panel
    const groupTrigger = document.getElementById('bulkImportGroupTrigger');
    if (groupTrigger) {
      groupTrigger.addEventListener('click', () => _openAssignPanel('group'));
      groupTrigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _openAssignPanel('group'); }
      });
    }

    // Close assign panel buttons
    modal.querySelectorAll('.bulk-import-assign__close').forEach(btn => {
      btn.addEventListener('click', _closeAssignPanel);
    });

    const testSave = document.getElementById('bulkImportTestSave');
    if (testSave) testSave.addEventListener('click', _closeAssignPanel);

    const groupSave = document.getElementById('bulkImportGroupSave');
    if (groupSave) groupSave.addEventListener('click', _closeAssignPanel);

    _initDropzone();
    _initAssignLists();
  }

  document.addEventListener('DOMContentLoaded', _init);

  function open()  { Modal.open(MODAL_ID);  }
  function close() { Modal.close(MODAL_ID); }

  return { open, close };
})();
