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
  }

  document.addEventListener('DOMContentLoaded', _init);

  return { checkEmptyState: _checkEmptyState };
})();

/* =================================================================
   UsersAddGroupModal — مودال افزودن کاربران به گروه (bulk)
   همان منطق add-user-group-panel با IDهای مستقل
   ================================================================= */

const UsersAddGroupModal = (() => {
  const SVG_CHECK = '<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><circle cx="10" cy="10" r="9" fill="var(--brand)" stroke="var(--brand)"/><path d="M6 10l3 3 5-5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const SVG_PLUS  = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5C12.4141 5 12.75 5.33582 12.75 5.75V11H18C18.4141 11 18.75 11.3358 18.75 11.75C18.75 11.9766 18.6494 12.1797 18.4907 12.3171C18.3594 12.431 18.1875 12.5 18 12.5H12.75V17.75C12.75 18.1642 12.4141 18.5 12 18.5C11.5859 18.5 11.25 18.1642 11.25 17.75V12.5H6C5.58594 12.5 5.25 12.1642 5.25 11.75C5.25 11.3358 5.58594 11 6 11H11.25V5.75C11.25 5.33582 11.5859 5 12 5Z" fill="#59595A"/></svg>';

  const _GROUPS_INIT = [
    { id: 'g1', name: 'گروه کارمندان جدید' },
    { id: 'g2', name: 'گروه توسعه نرم‌افزار' },
    { id: 'g3', name: 'گروه طراحی تجربه کاربری' },
    { id: 'g4', name: 'گروه بازاریابی دیجیتال' },
    { id: 'g5', name: 'گروه پشتیبانی فنی' },
  ];

  let _groups   = [];
  let _selected = new Set();

  function _toPersian(n) {
    return String(n).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
  }

  function _render(query) {
    const list = document.getElementById('bag-list');
    if (!list) return;
    const q = (query || '').trim();
    list.innerHTML = _groups
      .filter(function (g) { return !q || g.name.includes(q); })
      .map(function (g) {
        const sel = _selected.has(g.id);
        return '<li class="users-add-group-modal__item' + (sel ? ' users-add-group-modal__item--selected' : '') + '" role="listitem" data-group-id="' + g.id + '">' +
          '<span class="users-add-group-modal__item-name">' + g.name + '</span>' +
          '<span class="users-add-group-modal__item-action">' + (sel ? SVG_CHECK : SVG_PLUS) + '</span>' +
          '</li>';
      }).join('');
  }

  function _onListClick(e) {
    const item = e.target.closest('.users-add-group-modal__item');
    if (!item || !item.closest('#bag-list')) return;
    const id = item.dataset.groupId;
    if (!id) return;
    if (_selected.has(id)) { _selected.delete(id); } else { _selected.add(id); }
    const q = document.getElementById('bag-search');
    _render(q ? q.value : '');
  }

  function _toggleCreateForm() {
    const form = document.getElementById('bag-create-form');
    const btn  = document.getElementById('bag-create-btn');
    if (!form) return;
    const isOpen = form.classList.toggle('is-open');
    if (btn) btn.classList.toggle('add-user-group-toolbar__create-btn--open', isOpen);
  }

  function _addGroup() {
    const input = document.getElementById('bag-name-input');
    if (!input) return;
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    _groups.push({ id: 'bg_' + Date.now(), name: name });
    input.value = '';
    const q = document.getElementById('bag-search');
    _render(q ? q.value : '');
  }

  function _reset() {
    _groups   = _GROUPS_INIT.slice();
    _selected = new Set();
    _render('');
    var searchEl = document.getElementById('bag-search');
    if (searchEl) searchEl.value = '';
    var form = document.getElementById('bag-create-form');
    if (form) form.classList.remove('is-open');
    var btn = document.getElementById('bag-create-btn');
    if (btn) btn.classList.remove('add-user-group-toolbar__create-btn--open');
  }

  function _init() {
    _groups = _GROUPS_INIT.slice();
    _render('');

    var list = document.getElementById('bag-list');
    if (list) list.addEventListener('click', _onListClick);

    var search = document.getElementById('bag-search');
    if (search) search.addEventListener('input', function () { _render(this.value); });

    var createBtn = document.getElementById('bag-create-btn');
    if (createBtn) createBtn.addEventListener('click', _toggleCreateForm);

    var createSubmit = document.getElementById('bag-create-submit');
    if (createSubmit) createSubmit.addEventListener('click', _addGroup);

    var nameInput = document.getElementById('bag-name-input');
    if (nameInput) {
      nameInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') _addGroup();
      });
    }

    Modal.onOpen('users-add-group-modal', _reset);
  }

  document.addEventListener('DOMContentLoaded', _init);
  return {};
})();

/* =================================================================
   Exam Bulk Modal — افزودن آزمون به کاربران
   ================================================================= */

const UsersExamBulkModal = (() => {
  const SVG_MINUS = '<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const SVG_PLUS  = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5C12.4141 5 12.75 5.33582 12.75 5.75V11H18C18.4141 11 18.75 11.3358 18.75 11.75C18.75 11.9766 18.6494 12.1797 18.4907 12.3171C18.3594 12.431 18.1875 12.5 18 12.5H12.75V17.75C12.75 18.1642 12.4141 18.5 12 18.5C11.5859 18.5 11.25 18.1642 11.25 17.75V12.5H6C5.58594 12.5 5.25 12.1642 5.25 11.75C5.25 11.3358 5.58594 11 6 11H11.25V5.75C11.25 5.33582 11.5859 5 12 5Z" fill="#59595A"/></svg>';

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
  const _selectedTests = new Map(); // id → { plan, price }
  const _selectedGroups = new Set(); // id
  let _groups = [];

  const _TESTS = [
    { id: 't1', name: 'تست آسیب‌های روانی مرتبط با جنگ (WPT)', prices: { advanced: 98000, limited: 67000 } },
    { id: 't2', name: 'تست اختلال دوقطبی (BDSQ)', prices: { advanced: 98000, limited: 67000 } },
    { id: 't3', name: 'تست استعدادیابی کلیفتون (CSTA)', prices: { advanced: 98000, limited: 67000 } },
    { id: 't4', name: 'تست رغبت سنج شغلی و تحصیلی هالند (HII)', prices: { advanced: 98000, limited: 67000 } },
    { id: 't5', name: 'تست عزت نفس کوپر اسمیت (CSEI-AD)', prices: { advanced: 98000, limited: 67000 } },
  ];

  const _GROUPS_INIT = [
    { id: 'g1', name: 'گروه کارمندان جدید' },
    { id: 'g2', name: 'گروه توسعه نرم‌افزار' },
    { id: 'g3', name: 'گروه طراحی تجربه کاربری' },
    { id: 'g4', name: 'گروه بازاریابی دیجیتال' },
    { id: 'g5', name: 'گروه پشتیبانی فنی' },
  ];

  const SVG_TOMAN     = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"> <path d="M9.17157 16.167C11.5206 15.7815 11.9578 14.391 11.9758 14.3295L12.0471 14.0895H11.7958C10.1608 14.0895 9.14832 13.8007 9.14832 12.3645C9.14832 10.5675 10.4233 9.82199 11.1058 9.82199C13.0371 9.82199 13.1158 12.7432 13.1158 12.7725L13.1196 12.9562H14.5633C15.0231 12.9562 15.5758 12.9112 15.7708 12.5602C16.1638 11.8657 15.8503 10.4602 15.7168 9.95324L16.7218 9.68249C16.8711 10.2247 17.2753 11.9265 16.7938 12.936C16.3948 13.776 15.6793 14.088 14.1516 14.088C13.8606 14.088 13.5456 14.0767 13.2081 14.0595L13.0228 14.0497L13.0108 14.235C13.0048 14.3295 12.8278 16.5135 9.56532 17.1465L9.17157 16.167ZM11.0466 10.977C10.5778 10.977 10.2058 11.457 10.1616 12.1192C10.1464 12.2273 10.1544 12.3373 10.1849 12.442C10.2154 12.5467 10.2678 12.6438 10.3386 12.7267C10.427 12.8117 10.5322 12.8772 10.6474 12.9193C10.7625 12.9614 10.8852 12.9791 11.0076 12.9712H12.1101V12.7837C12.1108 11.7195 11.6728 10.9762 11.0458 10.9762L11.0466 10.977ZM6.83082 14.1937C6.45498 14.207 6.0806 14.1404 5.73234 13.9985C5.38408 13.8565 5.06984 13.6424 4.81032 13.3702L4.64832 13.2277L4.52832 13.4085C4.35007 13.6384 4.11924 13.8222 3.85521 13.9443C3.59119 14.0665 3.3017 14.1235 3.01107 14.1105C2.78654 14.1088 2.563 14.0806 2.34507 14.0265C0.77832 13.6455 0.77832 12.3045 0.77832 11.5837V7.41749L1.82082 8.46524V11.718C1.79487 11.8585 1.79738 12.0027 1.82821 12.1422C1.85904 12.2817 1.91756 12.4136 2.0003 12.53C2.08304 12.6465 2.18832 12.7452 2.3099 12.8202C2.43148 12.8952 2.56687 12.945 2.70807 12.9667C2.77826 12.9803 2.84959 12.987 2.92107 12.987C3.22912 12.9548 3.52174 12.8359 3.76504 12.6443C4.00834 12.4526 4.19237 12.1959 4.29582 11.904C4.86582 10.5555 5.49432 9.95474 6.33582 9.95474C6.62622 9.939 6.91652 9.9875 7.18603 10.0968C7.45555 10.2061 7.69764 10.3734 7.89507 10.587C8.12498 10.8849 8.29221 11.2263 8.38669 11.5905C8.48117 11.9548 8.50094 12.3344 8.44482 12.7065C8.44014 12.9113 8.39424 13.113 8.30985 13.2996C8.22546 13.4862 8.10432 13.6539 7.95366 13.7927C7.80301 13.9314 7.62593 14.0384 7.43301 14.1072C7.24008 14.1759 7.03528 14.2059 6.83082 14.1937ZM6.51582 11.0962C5.60532 11.0962 5.29107 12.1462 5.27832 12.1912L5.24832 12.294L5.32107 12.3712C5.47578 12.5821 5.67246 12.7586 5.89873 12.8898C6.125 13.0209 6.37596 13.1038 6.63582 13.1332C6.77266 13.132 6.9085 13.1098 7.03857 13.0672C7.35882 12.9577 7.51182 12.5767 7.43157 12.0967C7.35132 11.6152 7.03107 11.0962 6.51657 11.0962H6.51582ZM17.1433 8.06474L16.4158 8.79224L15.6883 8.06474L16.4158 7.33724L17.1433 8.06474ZM15.2376 8.06474L14.5101 8.79224L13.7826 8.06474L14.5101 7.33724L15.2376 8.06474ZM5.46432 1.63424L4.73682 2.36174L4.00857 1.63424L4.73607 0.906738L5.46432 1.63424Z" fill="#59595A"></path> <path d="M4.69761 8.22448C2.63511 8.22448 1.39461 7.24573 1.20486 5.46898C1.11956 4.3929 1.2977 3.31224 1.72386 2.32048L2.66361 2.71573C2.45661 3.27973 1.89411 5.05948 2.57811 6.18598C2.76323 6.46773 3.01511 6.69938 3.31134 6.86032C3.60757 7.02126 3.93899 7.10651 4.27611 7.10848C4.77261 7.14973 4.98336 7.15198 5.03211 7.15198C5.46583 7.17509 5.89698 7.07226 6.27357 6.85588C6.65017 6.6395 6.95615 6.31881 7.15461 5.93248C7.70061 4.76173 7.18686 3.09073 6.86586 2.44123L7.94661 2.06998C8.20011 2.61898 8.89911 4.91698 8.13036 6.51748C7.61586 7.58998 6.54111 8.16223 4.93686 8.21998C4.8574 8.22292 4.77713 8.22442 4.69761 8.22448Z" fill="#59595A"></path></svg>`;
  const SVG_MINUS     = '<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const SVG_PLUS_PLAN = '<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const SVG_CHECK_24  = '<svg viewBox="0 0 24 24" fill="none" width="24" height="24"><circle cx="12" cy="12" r="10" fill="var(--brand)" stroke="var(--brand)"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const SVG_CHECK_20  = '<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><circle cx="10" cy="10" r="9" fill="var(--brand)" stroke="var(--brand)"/><path d="M6 10l3 3 5-5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const SVG_PLUS_20   = '<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><circle cx="10" cy="10" r="9" stroke="var(--stroke)" stroke-width="1.5"/><path d="M10 7v6M7 10h6" stroke="var(--text-2)" stroke-width="1.5" stroke-linecap="round"/></svg>';

  /* ---- Helpers ---- */
  function _toPersian(n) {
    return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  function _formatPrice(n) {
    return _toPersian(n.toLocaleString('en-US').replace(/,/g, '،'));
  }

  /* ---- Exam panel ---- */
  function _renderExams(query) {
    const list = document.getElementById('add-user-exam-list');
    if (!list) return;
    const q = (query || '').trim();
    list.querySelectorAll('.exam-bulk__item').forEach(function (item) {
      const name = item.querySelector('.exam-bulk__item-name');
      item.hidden = q ? !(name && name.textContent.includes(q)) : false;
    });
  }

  function _updateExamFooter() {
    const summaryEl = document.getElementById('add-user-exam-summary');
    const priceEl   = document.getElementById('add-user-exam-price-val');
    const countEl   = document.getElementById('add-user-exam-count-val');
    if (!summaryEl) return;
    let total = 0;
    _selectedTests.forEach(v => { total += v.price; });
    const count = _selectedTests.size;
    summaryEl.hidden = count === 0;
    if (priceEl) priceEl.textContent = _formatPrice(total);
    if (countEl) countEl.textContent = _toPersian(count) + ' آزمون';
  }

  function _updateExamTrigger() {
    const textEl     = document.getElementById('add-user-test-trigger-text');
    const labelMeta  = document.getElementById('add-user-exam-label-meta');
    const labelPrice = document.getElementById('add-user-exam-label-price');
    let total = 0;
    _selectedTests.forEach(v => { total += v.price; });
    const count = _selectedTests.size;
    if (textEl) {
      textEl.textContent = count > 0 ? _toPersian(count) + ' آزمون انتخاب شده' : 'آزمون اضافه کنید..';
      textEl.classList.toggle('add-user-trigger__text--selected', count > 0);
    }
    if (labelMeta)  labelMeta.hidden = total === 0;
    if (labelPrice) labelPrice.textContent = _formatPrice(total);
  }

  function _updateHiddenInputs() {
    const examsEl  = document.getElementById('add-user-exams-data');
    const groupsEl = document.getElementById('add-user-groups-data');
    if (examsEl) {
      const data = [];
      _selectedTests.forEach((v, id) => data.push({ id, plan: v.plan, price: v.price }));
      examsEl.value = JSON.stringify(data);
    }
    if (groupsEl) {
      groupsEl.value = JSON.stringify(Array.from(_selectedGroups));
    }
  }

  function _onExamListClick(e) {
    const btn = e.target.closest('.exam-bulk__plan');
    if (!btn) return;
    const item = btn.closest('.exam-bulk__item');
    if (!item) return;
    const examId = item.dataset.examId;
    const plan   = btn.dataset.plan;
    const price  = parseInt(btn.dataset.price || '0', 10);
    const wasActive = btn.classList.contains('exam-bulk__plan--active');
    item.querySelectorAll('.exam-bulk__plan').forEach(function (p) {
      p.classList.remove('exam-bulk__plan--active');
      p.setAttribute('aria-pressed', 'false');
      const iconEl = p.querySelector('.exam-bulk__plan-icon');
      if (iconEl) iconEl.innerHTML = SVG_PLUS_PLAN;
    });
    if (!wasActive) {
      btn.classList.add('exam-bulk__plan--active');
      btn.setAttribute('aria-pressed', 'true');
      const iconEl = btn.querySelector('.exam-bulk__plan-icon');
      if (iconEl) iconEl.innerHTML = SVG_MINUS;
      _selectedTests.set(examId, { plan, price });
    } else {
      _selectedTests.delete(examId);
    }
    item.classList.toggle('exam-bulk__item--has-plan', !!item.querySelector('.exam-bulk__plan--active'));
    _updateExamFooter();
    _updateHiddenInputs();
  }

  /* ---- Group panel ---- */
  function _renderGroups(query) {
    const list = document.getElementById('add-user-group-list');
    if (!list) return;
    const q = (query || '').trim();
    list.querySelectorAll('.users-add-group-modal__item').forEach(function (item) {
      const name = item.querySelector('.users-add-group-modal__item-name');
      item.hidden = q ? !(name && name.textContent.includes(q)) : false;
    });
  }

  function _updateGroupTrigger() {
    const textEl = document.getElementById('add-user-group-trigger-text');
    const count  = _selectedGroups.size;
    if (textEl) {
      textEl.textContent = count > 0 ? _toPersian(count) + ' گروه انتخاب شده' : 'گروه اضافه کنید..';
      textEl.classList.toggle('add-user-trigger__text--selected', count > 0);
    }
  }

  function _onGroupListClick(e) {
    const item = e.target.closest('.users-add-group-modal__item');
    if (!item) return;
    const groupId = item.dataset.groupId;
    if (!groupId) return;
    if (_selectedGroups.has(groupId)) {
      _selectedGroups.delete(groupId);
      item.classList.remove('users-add-group-modal__item--selected');
      const actionEl = item.querySelector('.users-add-group-modal__item-action');
      if (actionEl) actionEl.innerHTML = SVG_PLUS_20;
    } else {
      _selectedGroups.add(groupId);
      item.classList.add('users-add-group-modal__item--selected');
      const actionEl = item.querySelector('.users-add-group-modal__item-action');
      if (actionEl) actionEl.innerHTML = SVG_CHECK_20;
    }
    _updateHiddenInputs();
  }

  function _toggleCreateForm() {
    const form = document.getElementById('add-user-group-create-form');
    const btn  = document.getElementById('add-user-group-create-btn');
    if (!form) return;
    const isOpen = form.classList.toggle('is-open');
    if (btn) btn.classList.toggle('add-user-group-toolbar__create-btn--open', isOpen);
  }

  function _addNewGroup() {
    const input = document.getElementById('add-user-new-group-input');
    if (!input) return;
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    const id = 'g_' + Date.now();
    input.value = '';
    const list = document.getElementById('add-user-group-list');
    if (list) {
      const li = document.createElement('li');
      li.className = 'users-add-group-modal__item';
      li.setAttribute('role', 'listitem');
      li.dataset.groupId = id;
      li.innerHTML = `<span class="users-add-group-modal__item-name">${name}</span><span class="users-add-group-modal__item-action">${SVG_PLUS_20}</span>`;
      list.appendChild(li);
    }
  }

  /* ---- Reset all state ---- */
  function _reset() {
    _selectedTests.clear();
    _selectedGroups.clear();
    _groups = _GROUPS_INIT.slice();
    const examList = document.getElementById('add-user-exam-list');
    if (examList) {
      examList.querySelectorAll('.exam-bulk__item').forEach(function (item) {
        item.hidden = false;
        item.classList.remove('exam-bulk__item--has-plan');
        item.querySelectorAll('.exam-bulk__plan').forEach(function (p) {
          p.classList.remove('exam-bulk__plan--active');
          p.setAttribute('aria-pressed', 'false');
          const iconEl = p.querySelector('.exam-bulk__plan-icon');
          if (iconEl) iconEl.innerHTML = SVG_PLUS_PLAN;
        });
      });
    }
    const groupList = document.getElementById('add-user-group-list');
    if (groupList) {
      groupList.querySelectorAll('.users-add-group-modal__item[data-group-id^="g_"]').forEach(function (el) { el.remove(); });
      groupList.querySelectorAll('.users-add-group-modal__item').forEach(function (item) {
        item.hidden = false;
        item.classList.remove('users-add-group-modal__item--selected');
        const actionEl = item.querySelector('.users-add-group-modal__item-action');
        if (actionEl) actionEl.innerHTML = SVG_PLUS_20;
      });
    }
    const testText = document.getElementById('add-user-test-trigger-text');
    if (testText) { testText.textContent = 'آزمون اضافه کنید..'; testText.classList.remove('add-user-trigger__text--selected'); }
    const labelMeta  = document.getElementById('add-user-exam-label-meta');
    if (labelMeta) labelMeta.hidden = true;
    const labelPrice = document.getElementById('add-user-exam-label-price');
    if (labelPrice) labelPrice.textContent = '۰';
    const groupText = document.getElementById('add-user-group-trigger-text');
    if (groupText) { groupText.textContent = 'گروه اضافه کنید..'; groupText.classList.remove('add-user-trigger__text--selected'); }
    ['add-user-code', 'add-user-name', 'add-user-phone'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    _updateHiddenInputs();
  }

  /* ---- Init ---- */
  function _init() {
    if (_initialized) return;
    _initialized = true;

    _groups = _GROUPS_INIT.slice();

    /* Exam trigger → open exam panel */
    const testTrigger = document.getElementById('add-user-test-trigger');
    if (testTrigger) {
      testTrigger.addEventListener('click', function () {
        _renderExams('');
        Modal.openPanel('add-user-test-panel');
        testTrigger.setAttribute('aria-expanded', 'true');
      });
    }

    /* Group trigger → open group panel */
    const groupTrigger = document.getElementById('add-user-group-trigger');
    if (groupTrigger) {
      groupTrigger.addEventListener('click', function () {
        _renderGroups('');
        Modal.openPanel('add-user-group-panel');
        groupTrigger.setAttribute('aria-expanded', 'true');
      });
    }

    /* Exam list: plan click (event delegation) */
    const examList = document.getElementById('add-user-exam-list');
    if (examList) examList.addEventListener('click', _onExamListClick);

    /* Exam search */
    const examSearch = document.getElementById('add-user-exam-search');
    if (examSearch) examSearch.addEventListener('input', function () { _renderExams(this.value); });

    /* Exam save & return */
    const examSave = document.getElementById('add-user-exam-save');
    if (examSave) {
      examSave.addEventListener('click', function () {
        _updateExamTrigger();
        Modal.closePanel('add-user-test-panel');
        if (testTrigger) testTrigger.setAttribute('aria-expanded', 'false');
      });
    }

    /* Group list: item click (event delegation) */
    const groupList = document.getElementById('add-user-group-list');
    if (groupList) groupList.addEventListener('click', _onGroupListClick);

    /* Group search */
    const groupSearch = document.getElementById('add-user-group-search-panel');
    if (groupSearch) groupSearch.addEventListener('input', function () { _renderGroups(this.value); });

    /* Group create form toggle */
    const createBtn = document.getElementById('add-user-group-create-btn');
    if (createBtn) createBtn.addEventListener('click', _toggleCreateForm);

    /* Group create submit */
    const createSubmit = document.getElementById('add-user-group-create-submit');
    if (createSubmit) createSubmit.addEventListener('click', _addNewGroup);

    /* Group save & return */
    const groupSave = document.getElementById('add-user-group-save');
    if (groupSave) {
      groupSave.addEventListener('click', function () {
        _updateGroupTrigger();
        Modal.closePanel('add-user-group-panel');
        if (groupTrigger) groupTrigger.setAttribute('aria-expanded', 'false');
      });
    }

    /* Submit add-user form */
    const submitBtn = document.getElementById('add-user-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        const code = document.getElementById('add-user-code')?.value?.trim();
        if (!code) { document.getElementById('add-user-code')?.focus(); return; }

        /* Populate confirmation modal title with user name */
        const nameVal = document.getElementById('add-user-name')?.value?.trim();
        const confirmTitle = document.getElementById('confirm-user-title');
        if (confirmTitle) confirmTitle.textContent = nameVal ? '"' + nameVal + '"' : '"' + code + '"';

        /* Close add-user modal, then open confirmation */
        Modal.close('add-user-modal');
        setTimeout(function () { Modal.open('add-user-confirm-modal'); }, 310);
      });
    }

    /* Confirmation modal: "خروج" — just close */
    const confirmExit = document.getElementById('add-user-confirm-exit');
    if (confirmExit) {
      confirmExit.addEventListener('click', function () {
        Modal.close('add-user-confirm-modal');
      });
    }

    /* Confirmation modal: "افزودن مجدد کاربر جدید" — close confirm, reset, reopen add-user */
    const confirmAnother = document.getElementById('add-user-confirm-another');
    if (confirmAnother) {
      confirmAnother.addEventListener('click', function () {
        Modal.close('add-user-confirm-modal');
        setTimeout(function () {
          _reset();
          Modal.open('add-user-modal');
        }, 310);
      });
    }

    /* When add-user modal closes: close panels and reset everything */
    Modal.onClose('add-user-modal', function () {
      Modal.closePanel('add-user-test-panel');
      Modal.closePanel('add-user-group-panel');
      _reset();
    });
  }

  function open()  { Modal.open('add-user-modal');  }
  function close() { Modal.close('add-user-modal'); }

  document.addEventListener('DOMContentLoaded', _init);

  return { open, close };
})();

/* =================================================================
   Bulk Import Wizard — افزودن گروهی کاربران
   ================================================================= */

const BulkImport = (() => {
  const MODAL_ID = 'bulk-import-modal';

  /* State */
  const _biSelectedTests  = new Map(); // id → { plan, price }
  const _biSelectedGroups = new Set(); // id
  let _biGroups = [];

  /* Data */
  const _TESTS = [
    { id: 't1', name: 'تست آسیب‌های روانی مرتبط با جنگ (WPT)', prices: { advanced: 98000, limited: 67000 } },
    { id: 't2', name: 'تست اختلال دوقطبی (BDSQ)', prices: { advanced: 98000, limited: 67000 } },
    { id: 't3', name: 'تست استعدادیابی کلیفتون (CSTA)', prices: { advanced: 98000, limited: 67000 } },
    { id: 't4', name: 'تست رغبت سنج شغلی و تحصیلی هالند (HII)', prices: { advanced: 98000, limited: 67000 } },
    { id: 't5', name: 'تست عزت نفس کوپر اسمیت (CSEI-AD)', prices: { advanced: 98000, limited: 67000 } },
  ];

  const _GROUPS_INIT = [
    { id: 'g1', name: 'گروه کارمندان جدید' },
    { id: 'g2', name: 'گروه توسعه نرم‌افزار' },
    { id: 'g3', name: 'گروه طراحی تجربه کاربری' },
    { id: 'g4', name: 'گروه بازاریابی دیجیتال' },
    { id: 'g5', name: 'گروه پشتیبانی فنی' },
  ];

  /* SVGs */
  const SVG_TOMAN     = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"> <path d="M9.17157 16.167C11.5206 15.7815 11.9578 14.391 11.9758 14.3295L12.0471 14.0895H11.7958C10.1608 14.0895 9.14832 13.8007 9.14832 12.3645C9.14832 10.5675 10.4233 9.82199 11.1058 9.82199C13.0371 9.82199 13.1158 12.7432 13.1158 12.7725L13.1196 12.9562H14.5633C15.0231 12.9562 15.5758 12.9112 15.7708 12.5602C16.1638 11.8657 15.8503 10.4602 15.7168 9.95324L16.7218 9.68249C16.8711 10.2247 17.2753 11.9265 16.7938 12.936C16.3948 13.776 15.6793 14.088 14.1516 14.088C13.8606 14.088 13.5456 14.0767 13.2081 14.0595L13.0228 14.0497L13.0108 14.235C13.0048 14.3295 12.8278 16.5135 9.56532 17.1465L9.17157 16.167ZM11.0466 10.977C10.5778 10.977 10.2058 11.457 10.1616 12.1192C10.1464 12.2273 10.1544 12.3373 10.1849 12.442C10.2154 12.5467 10.2678 12.6438 10.3386 12.7267C10.427 12.8117 10.5322 12.8772 10.6474 12.9193C10.7625 12.9614 10.8852 12.9791 11.0076 12.9712H12.1101V12.7837C12.1108 11.7195 11.6728 10.9762 11.0458 10.9762L11.0466 10.977ZM6.83082 14.1937C6.45498 14.207 6.0806 14.1404 5.73234 13.9985C5.38408 13.8565 5.06984 13.6424 4.81032 13.3702L4.64832 13.2277L4.52832 13.4085C4.35007 13.6384 4.11924 13.8222 3.85521 13.9443C3.59119 14.0665 3.3017 14.1235 3.01107 14.1105C2.78654 14.1088 2.563 14.0806 2.34507 14.0265C0.77832 13.6455 0.77832 12.3045 0.77832 11.5837V7.41749L1.82082 8.46524V11.718C1.79487 11.8585 1.79738 12.0027 1.82821 12.1422C1.85904 12.2817 1.91756 12.4136 2.0003 12.53C2.08304 12.6465 2.18832 12.7452 2.3099 12.8202C2.43148 12.8952 2.56687 12.945 2.70807 12.9667C2.77826 12.9803 2.84959 12.987 2.92107 12.987C3.22912 12.9548 3.52174 12.8359 3.76504 12.6443C4.00834 12.4526 4.19237 12.1959 4.29582 11.904C4.86582 10.5555 5.49432 9.95474 6.33582 9.95474C6.62622 9.939 6.91652 9.9875 7.18603 10.0968C7.45555 10.2061 7.69764 10.3734 7.89507 10.587C8.12498 10.8849 8.29221 11.2263 8.38669 11.5905C8.48117 11.9548 8.50094 12.3344 8.44482 12.7065C8.44014 12.9113 8.39424 13.113 8.30985 13.2996C8.22546 13.4862 8.10432 13.6539 7.95366 13.7927C7.80301 13.9314 7.62593 14.0384 7.43301 14.1072C7.24008 14.1759 7.03528 14.2059 6.83082 14.1937ZM6.51582 11.0962C5.60532 11.0962 5.29107 12.1462 5.27832 12.1912L5.24832 12.294L5.32107 12.3712C5.47578 12.5821 5.67246 12.7586 5.89873 12.8898C6.125 13.0209 6.37596 13.1038 6.63582 13.1332C6.77266 13.132 6.9085 13.1098 7.03857 13.0672C7.35882 12.9577 7.51182 12.5767 7.43157 12.0967C7.35132 11.6152 7.03107 11.0962 6.51657 11.0962H6.51582ZM17.1433 8.06474L16.4158 8.79224L15.6883 8.06474L16.4158 7.33724L17.1433 8.06474ZM15.2376 8.06474L14.5101 8.79224L13.7826 8.06474L14.5101 7.33724L15.2376 8.06474ZM5.46432 1.63424L4.73682 2.36174L4.00857 1.63424L4.73607 0.906738L5.46432 1.63424Z" fill="#59595A"></path> <path d="M4.69761 8.22448C2.63511 8.22448 1.39461 7.24573 1.20486 5.46898C1.11956 4.3929 1.2977 3.31224 1.72386 2.32048L2.66361 2.71573C2.45661 3.27973 1.89411 5.05948 2.57811 6.18598C2.76323 6.46773 3.01511 6.69938 3.31134 6.86032C3.60757 7.02126 3.93899 7.10651 4.27611 7.10848C4.77261 7.14973 4.98336 7.15198 5.03211 7.15198C5.46583 7.17509 5.89698 7.07226 6.27357 6.85588C6.65017 6.6395 6.95615 6.31881 7.15461 5.93248C7.70061 4.76173 7.18686 3.09073 6.86586 2.44123L7.94661 2.06998C8.20011 2.61898 8.89911 4.91698 8.13036 6.51748C7.61586 7.58998 6.54111 8.16223 4.93686 8.21998C4.8574 8.22292 4.77713 8.22442 4.69761 8.22448Z" fill="#59595A"></path></svg>`;
  const SVG_MINUS     = '<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const SVG_PLUS_PLAN = '<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const SVG_CHECK_24  = '<svg viewBox="0 0 24 24" fill="none" width="24" height="24"><circle cx="12" cy="12" r="10" fill="var(--brand)" stroke="var(--brand)"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const SVG_CHECK_20  = '<svg viewBox="0 0 20 20" fill="none" width="20" height="20"><circle cx="10" cy="10" r="9" fill="var(--brand)" stroke="var(--brand)"/><path d="M6 10l3 3 5-5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const SVG_PLUS_20   = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5C12.4141 5 12.75 5.33582 12.75 5.75V11H18C18.4141 11 18.75 11.3358 18.75 11.75C18.75 11.9766 18.6494 12.1797 18.4907 12.3171C18.3594 12.431 18.1875 12.5 18 12.5H12.75V17.75C12.75 18.1642 12.4141 18.5 12 18.5C11.5859 18.5 11.25 18.1642 11.25 17.75V12.5H6C5.58594 12.5 5.25 12.1642 5.25 11.75C5.25 11.3358 5.58594 11 6 11H11.25V5.75C11.25 5.33582 11.5859 5 12 5Z" fill="#59595A"></path></svg>';

  /* Helpers */
  function _toPersian(n) {
    return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  function _formatPrice(n) {
    return _toPersian(n.toLocaleString('en-US').replace(/,/g, '،'));
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

    // Close expanded panels when leaving step 2
    if (step !== 2) {
      Modal.closePanel('bi-test-panel');
      Modal.closePanel('bi-group-panel');
    }
  }

  /* ---------------------------------------------------------------
     Exam panel (bi-test-panel)
     --------------------------------------------------------------- */

  function _renderBiExams(query) {
    const list = document.getElementById('bi-exam-list');
    if (!list) return;
    const q = (query || '').trim();
    list.querySelectorAll('.exam-bulk__item').forEach(function (item) {
      const name = item.querySelector('.exam-bulk__item-name');
      item.hidden = q ? !(name && name.textContent.includes(q)) : false;
    });
  }

  function _updateBiExamFooter() {
    const summaryEl = document.getElementById('bi-exam-summary');
    const priceEl   = document.getElementById('bi-exam-price-val');
    const countEl   = document.getElementById('bi-exam-count-val');
    if (!summaryEl) return;
    let total = 0;
    _biSelectedTests.forEach(v => { total += v.price; });
    const count = _biSelectedTests.size;
    summaryEl.hidden = count === 0;
    if (priceEl) priceEl.textContent = _formatPrice(total);
    if (countEl) countEl.textContent = _toPersian(count) + ' آزمون';
  }

  function _updateBiExamTrigger() {
    const textEl  = document.getElementById('bulkImportTestValue');
    const priceEl = document.getElementById('bulkImportTotalPrice');
    let total = 0;
    _biSelectedTests.forEach(v => { total += v.price; });
    const count = _biSelectedTests.size;
    if (textEl) {
      textEl.textContent = count > 0 ? _toPersian(count) + ' آزمون انتخاب شده' : 'آزمون اضافه کنید..';
      textEl.classList.toggle('add-user-trigger__text--selected', count > 0);
    }
    if (priceEl) {
      priceEl.textContent = total > 0 ? 'جمع هزینه: ' + _formatPrice(total) : 'جمع هزینه: ۰';
    }
  }

  function _onBiExamListClick(e) {
    const btn = e.target.closest('.exam-bulk__plan');
    if (!btn) return;
    const item = btn.closest('.exam-bulk__item');
    if (!item) return;
    const examId = item.dataset.examId;
    const plan   = btn.dataset.plan;
    const price  = parseInt(btn.dataset.price || '0', 10);
    const wasActive = btn.classList.contains('exam-bulk__plan--active');
    item.querySelectorAll('.exam-bulk__plan').forEach(function (p) {
      p.classList.remove('exam-bulk__plan--active');
      p.setAttribute('aria-pressed', 'false');
      const iconEl = p.querySelector('.exam-bulk__plan-icon');
      if (iconEl) iconEl.innerHTML = SVG_PLUS_PLAN;
    });
    if (!wasActive) {
      btn.classList.add('exam-bulk__plan--active');
      btn.setAttribute('aria-pressed', 'true');
      const iconEl = btn.querySelector('.exam-bulk__plan-icon');
      if (iconEl) iconEl.innerHTML = SVG_MINUS;
      _biSelectedTests.set(examId, { plan, price });
    } else {
      _biSelectedTests.delete(examId);
    }
    item.classList.toggle('exam-bulk__item--has-plan', !!item.querySelector('.exam-bulk__plan--active'));
    _updateBiExamFooter();
  }

  /* ---------------------------------------------------------------
     Group panel (bi-group-panel)
     --------------------------------------------------------------- */

  function _renderBiGroups(query) {
    const list = document.getElementById('bi-group-list');
    if (!list) return;
    const q = (query || '').trim();
    list.querySelectorAll('.users-add-group-modal__item').forEach(function (item) {
      const name = item.querySelector('.users-add-group-modal__item-name');
      item.hidden = q ? !(name && name.textContent.includes(q)) : false;
    });
  }

  function _updateBiGroupTrigger() {
    const textEl = document.getElementById('bulkImportGroupValue');
    const count  = _biSelectedGroups.size;
    if (textEl) {
      textEl.textContent = count > 0 ? _toPersian(count) + ' گروه انتخاب شده' : 'گروه اضافه کنید..';
      textEl.classList.toggle('add-user-trigger__text--selected', count > 0);
    }
  }

  function _onBiGroupListClick(e) {
    const item = e.target.closest('.users-add-group-modal__item');
    if (!item) return;
    const groupId = item.dataset.groupId;
    if (!groupId) return;
    if (_biSelectedGroups.has(groupId)) {
      _biSelectedGroups.delete(groupId);
      item.classList.remove('users-add-group-modal__item--selected');
      const actionEl = item.querySelector('.users-add-group-modal__item-action');
      if (actionEl) actionEl.innerHTML = SVG_PLUS_20;
    } else {
      _biSelectedGroups.add(groupId);
      item.classList.add('users-add-group-modal__item--selected');
      const actionEl = item.querySelector('.users-add-group-modal__item-action');
      if (actionEl) actionEl.innerHTML = SVG_CHECK_20;
    }
  }

  function _biToggleCreateForm() {
    const form = document.getElementById('bi-group-create-form');
    const btn  = document.getElementById('bi-group-create-btn');
    if (!form) return;
    const isOpen = form.classList.toggle('is-open');
    if (btn) btn.classList.toggle('add-user-group-toolbar__create-btn--open', isOpen);
  }

  function _biAddNewGroup() {
    const input = document.getElementById('bi-new-group-input');
    if (!input) return;
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    const id = 'bg_' + Date.now();
    input.value = '';
    const list = document.getElementById('bi-group-list');
    if (list) {
      const li = document.createElement('li');
      li.className = 'users-add-group-modal__item';
      li.setAttribute('role', 'listitem');
      li.dataset.groupId = id;
      li.innerHTML = `<span class="users-add-group-modal__item-name">${name}</span><span class="users-add-group-modal__item-action">${SVG_PLUS_20}</span>`;
      list.appendChild(li);
    }
  }

  function _biReset() {
    _biSelectedTests.clear();
    _biSelectedGroups.clear();
    _biGroups = _GROUPS_INIT.slice();
    const biExamList = document.getElementById('bi-exam-list');
    if (biExamList) {
      biExamList.querySelectorAll('.exam-bulk__item').forEach(function (item) {
        item.hidden = false;
        item.classList.remove('exam-bulk__item--has-plan');
        item.querySelectorAll('.exam-bulk__plan').forEach(function (p) {
          p.classList.remove('exam-bulk__plan--active');
          p.setAttribute('aria-pressed', 'false');
          const iconEl = p.querySelector('.exam-bulk__plan-icon');
          if (iconEl) iconEl.innerHTML = SVG_PLUS_PLAN;
        });
      });
    }
    const biGroupList = document.getElementById('bi-group-list');
    if (biGroupList) {
      biGroupList.querySelectorAll('.users-add-group-modal__item[data-group-id^="bg_"]').forEach(function (el) { el.remove(); });
      biGroupList.querySelectorAll('.users-add-group-modal__item').forEach(function (item) {
        item.hidden = false;
        item.classList.remove('users-add-group-modal__item--selected');
        const actionEl = item.querySelector('.users-add-group-modal__item-action');
        if (actionEl) actionEl.innerHTML = SVG_PLUS_20;
      });
    }
    const testText = document.getElementById('bulkImportTestValue');
    if (testText) { testText.textContent = 'آزمون اضافه کنید..'; testText.classList.remove('add-user-trigger__text--selected'); }
    const groupText = document.getElementById('bulkImportGroupValue');
    if (groupText) { groupText.textContent = 'گروه اضافه کنید..'; groupText.classList.remove('add-user-trigger__text--selected'); }
    const priceEl = document.getElementById('bulkImportTotalPrice');
    if (priceEl) priceEl.textContent = 'جمع هزینه: ۰';

    // Reset file upload (dropzone) to initial empty state
    const fileInput = document.getElementById('bulkImportFileInput');
    if (fileInput) fileInput.value = '';
    const preview = document.getElementById('bulkImportFilePreview');
    if (preview) preview.hidden = true;
    const emptyBody = document.getElementById('bulkImportDropzoneBody');
    if (emptyBody) emptyBody.hidden = false;
    const nextBtn = document.getElementById('bulkImportUploadNextBtn');
    if (nextBtn) nextBtn.disabled = true;
  }

  /* ---------------------------------------------------------------
     Dropzone
     --------------------------------------------------------------- */

  function _initDropzone() {
    const zone      = document.getElementById('bulkImportDropzone');
    const input     = document.getElementById('bulkImportFileInput');
    const emptyBody = document.getElementById('bulkImportDropzoneBody');
    const preview   = document.getElementById('bulkImportFilePreview');
    const nameEl    = document.getElementById('bulkImportFileName');
    const sizeEl    = document.getElementById('bulkImportFileSize');
    const removeBtn = document.getElementById('bulkImportFileRemove');
    const nextBtn   = document.getElementById('bulkImportUploadNextBtn');
    if (!zone || !input) return;

    function _applyFile(file) {
      if (!file) return;
      if (nameEl) nameEl.textContent = file.name;
      if (sizeEl) {
        const kb = file.size / 1024;
        sizeEl.textContent = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
      }
      if (emptyBody) emptyBody.hidden = true;
      if (preview)   preview.hidden = false;
      if (nextBtn)   nextBtn.disabled = false;
    }

    function _clearFile() {
      input.value = '';
      if (preview)   preview.hidden = true;
      if (emptyBody) emptyBody.hidden = false;
      if (nextBtn)   nextBtn.disabled = true;
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
     Init
     --------------------------------------------------------------- */

  function _init() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;

    _biGroups = _GROUPS_INIT.slice();

    // Reset on open
    Modal.onOpen(MODAL_ID, function () {
      _biReset();
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

    // Step 2 → success (close bulk-import, open separate success modal)
    const confirmBtn = document.getElementById('bulkImportConfirmBtn');
    if (confirmBtn) confirmBtn.addEventListener('click', function () {
      Modal.close(MODAL_ID);
      Modal.open('bulk-import-success-modal');
    });

    // Test trigger → open exam panel
    const testTrigger = document.getElementById('bulkImportTestTrigger');
    if (testTrigger) {
      testTrigger.addEventListener('click', function () {
        _renderBiExams('');
        Modal.openPanel('bi-test-panel');
        testTrigger.setAttribute('aria-expanded', 'true');
      });
    }

    // Group trigger → open group panel
    const groupTrigger = document.getElementById('bulkImportGroupTrigger');
    if (groupTrigger) {
      groupTrigger.addEventListener('click', function () {
        _renderBiGroups('');
        Modal.openPanel('bi-group-panel');
        groupTrigger.setAttribute('aria-expanded', 'true');
      });
    }

    // Exam list click (event delegation)
    const examList = document.getElementById('bi-exam-list');
    if (examList) examList.addEventListener('click', _onBiExamListClick);

    // Exam search
    const examSearch = document.getElementById('bi-exam-search');
    if (examSearch) examSearch.addEventListener('input', function () { _renderBiExams(this.value); });

    // Exam save & return
    const examSave = document.getElementById('bi-exam-save');
    if (examSave) {
      examSave.addEventListener('click', function () {
        _updateBiExamTrigger();
        Modal.closePanel('bi-test-panel');
        if (testTrigger) testTrigger.setAttribute('aria-expanded', 'false');
      });
    }

    // Group list click (event delegation)
    const groupList = document.getElementById('bi-group-list');
    if (groupList) groupList.addEventListener('click', _onBiGroupListClick);

    // Group search
    const groupSearch = document.getElementById('bi-group-search');
    if (groupSearch) groupSearch.addEventListener('input', function () { _renderBiGroups(this.value); });

    // Group create form toggle
    const createBtn = document.getElementById('bi-group-create-btn');
    if (createBtn) createBtn.addEventListener('click', _biToggleCreateForm);

    // Group create submit
    const createSubmit = document.getElementById('bi-group-create-submit');
    if (createSubmit) createSubmit.addEventListener('click', _biAddNewGroup);

    // Group save & return
    const groupSave = document.getElementById('bi-group-save');
    if (groupSave) {
      groupSave.addEventListener('click', function () {
        _updateBiGroupTrigger();
        Modal.closePanel('bi-group-panel');
        if (groupTrigger) groupTrigger.setAttribute('aria-expanded', 'false');
      });
    }

    // Exam header back btn (mobile)
    const examBackHeader = document.getElementById('bi-exam-back-header');
    if (examBackHeader) {
      examBackHeader.addEventListener('click', function () {
        _updateBiExamTrigger();
        Modal.closePanel('bi-test-panel');
        if (testTrigger) testTrigger.setAttribute('aria-expanded', 'false');
      });
    }

    // Group header back btn (mobile)
    const groupBackHeader = document.getElementById('bi-group-back-header');
    if (groupBackHeader) {
      groupBackHeader.addEventListener('click', function () {
        _updateBiGroupTrigger();
        Modal.closePanel('bi-group-panel');
        if (groupTrigger) groupTrigger.setAttribute('aria-expanded', 'false');
      });
    }

    // Close panels when modal closes
    Modal.onClose(MODAL_ID, function () {
      Modal.closePanel('bi-test-panel');
      Modal.closePanel('bi-group-panel');
      _biReset();
    });

    _initDropzone();
  }

  document.addEventListener('DOMContentLoaded', _init);

  function open()  { Modal.open(MODAL_ID);  }
  function close() { Modal.close(MODAL_ID); }

  return { open, close };
})();

/* =================================================================
   Filter Modal
   ================================================================= */
const FilterModal = (() => {
  const MODAL_ID   = 'users-table-filter';
  const PANEL_ID   = 'filter-exams-done-panel';
  let _initialized = false;

  /* --- Persian digit helper --- */
  function _toPersian(n) {
    return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  /* --- Config for all generic checkbox-list panels --- */
  const _PANELS = {
    'not-done-exam': {
      panelId:        'filter-exams-not-done-panel',
      rowId:          'filter-row-not-done-exam',
      listId:         'filterExamsNotDoneList',
      countId:        'filterExamsNotDoneCount',
      selectAllId:    'filterExamsNotDoneSelectAll',
      selectAllBoxId: 'filterExamsNotDoneSelectAllBox',
      backId:         'filterExamsNotDoneBack',
      searchId:       'filterExamsNotDoneSearch',
      rowCountId:     'filterNotDoneCount',
      panelCountLabel: n => _toPersian(n) + ' آزمون انتخاب شده',
      chipLabel:      n => _toPersian(n) + '+ آزمون انجام نشده',
    },
    'group': {
      panelId:        'filter-group-panel',
      rowId:          'filter-row-group',
      listId:         'filterGroupList',
      countId:        'filterGroupCount',
      selectAllId:    'filterGroupSelectAll',
      selectAllBoxId: 'filterGroupSelectAllBox',
      backId:         'filterGroupBack',
      searchId:       'filterGroupSearch',
      rowCountId:     'filterGroupRowCount',
      panelCountLabel: n => _toPersian(n) + ' گروه انتخاب شده',
      chipLabel:      n => _toPersian(n) + '+ گروه',
    },
    'status': {
      panelId:        'filter-status-panel',
      rowId:          'filter-row-status',
      listId:         'filterStatusList',
      countId:        'filterStatusCount',
      selectAllId:    'filterStatusSelectAll',
      selectAllBoxId: 'filterStatusSelectAllBox',
      backId:         'filterStatusBack',
      searchId:       null,
      rowCountId:     'filterStatusRowCount',
      panelCountLabel: n => _toPersian(n) + ' وضعیت انتخاب شده',
      chipLabel:      n => _toPersian(n) + '+ وضعیت',
    },
    'access': {
      panelId:        'filter-access-panel',
      rowId:          'filter-row-access',
      listId:         'filterAccessList',
      countId:        'filterAccessCount',
      selectAllId:    'filterAccessSelectAll',
      selectAllBoxId: 'filterAccessSelectAllBox',
      backId:         'filterAccessBack',
      searchId:       null,
      rowCountId:     'filterAccessRowCount',
      panelCountLabel: n => _toPersian(n) + ' دسترسی انتخاب شده',
      chipLabel:      n => _toPersian(n) + '+ دسترسی',
    },
  };

  /* --- Toggle CSS state classes on a filter row --- */
  function _setRowActive(rowId, on) {
    document.getElementById(rowId)?.classList.toggle('table__filter-row--active', on);
  }

  function _setRowFocused(rowId, on) {
    const row = document.getElementById(rowId);
    if (!row) return;
    row.classList.toggle('table__filter-row--focused', on);
    row.setAttribute('aria-expanded', on ? 'true' : 'false');
  }

  /* --- Update exam selection count + select-all visual --- */
  function _updateExamPanel() {
    const items = document.querySelectorAll('#filterExamsDoneList .filter-exam-item');
    const countEl = document.getElementById('filterExamsDoneCount');
    const selectAllBox = document.getElementById('filterExamsSelectAllBox');
    const selectAllEl  = document.getElementById('filterExamsSelectAll');

    let checked = 0;
    items.forEach(item => { if (item.classList.contains('filter-exam-item--checked')) checked++; });

    if (countEl) countEl.textContent = _toPersian(checked) + ' آزمون انتخاب شده';

    if (selectAllBox && items.length > 0) {
      const isAll = checked === items.length;
      const isSome = checked > 0 && !isAll;
      selectAllBox.classList.toggle('filter-panel__checkbox-box--checked', isAll);
      selectAllBox.classList.toggle('filter-panel__checkbox-box--indeterminate', isSome);
      selectAllEl?.setAttribute('aria-checked', isAll ? 'true' : isSome ? 'mixed' : 'false');
    }
  }

  /* --- Generic panel: update count + select-all state --- */
  function _updatePanel(cfg) {
    const items = document.querySelectorAll(`#${cfg.listId} .filter-exam-item`);
    const countEl = document.getElementById(cfg.countId);
    const box = document.getElementById(cfg.selectAllBoxId);
    const allEl = document.getElementById(cfg.selectAllId);
    let checked = 0;
    items.forEach(i => { if (i.classList.contains('filter-exam-item--checked')) checked++; });
    if (countEl) countEl.textContent = cfg.panelCountLabel(checked);
    if (box && items.length > 0) {
      const isAll = checked === items.length;
      const isSome = checked > 0 && !isAll;
      box.classList.toggle('filter-panel__checkbox-box--checked', isAll);
      box.classList.toggle('filter-panel__checkbox-box--indeterminate', isSome);
      allEl?.setAttribute('aria-checked', isAll ? 'true' : isSome ? 'mixed' : 'false');
    }
    return checked;
  }

  /* --- Generic panel: save and close --- */
  function _savePanelGeneric(cfg) {
    const count = _updatePanel(cfg);
    Modal.closePanel(cfg.panelId);
    _setRowFocused(cfg.rowId, false);
    _setRowActive(cfg.rowId, count > 0);
    const rowCountEl = cfg.rowCountId ? document.getElementById(cfg.rowCountId) : null;
    if (rowCountEl) {
      rowCountEl.textContent = _toPersian(count) + '+ گزینه انتخاب شده';
      rowCountEl.hidden = count === 0;
    }
  }

  /* --- Generic panel: wire all events --- */
  function _wirePanel(cfg) {
    document.getElementById(cfg.rowId)?.addEventListener('click', function () {
      const isOpen = this.classList.contains('table__filter-row--focused');
      if (isOpen) {
        Modal.closePanel(cfg.panelId);
        _setRowFocused(cfg.rowId, false);
      } else {
        Modal.openPanel(cfg.panelId);
        _setRowFocused(cfg.rowId, true);
      }
    });

    document.getElementById(cfg.listId)?.addEventListener('click', function (e) {
      const item = e.target.closest('.filter-exam-item');
      if (!item) return;
      item.classList.toggle('filter-exam-item--checked');
      _updatePanel(cfg);
    });

    if (cfg.selectAllId) {
      const allEl = document.getElementById(cfg.selectAllId);
      allEl?.addEventListener('click', function () {
        const items = document.querySelectorAll(`#${cfg.listId} .filter-exam-item`);
        const allChecked = [...items].every(i => i.classList.contains('filter-exam-item--checked'));
        items.forEach(i => i.classList.toggle('filter-exam-item--checked', !allChecked));
        _updatePanel(cfg);
      });
      allEl?.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.click(); }
      });
    }

    document.getElementById(cfg.backId)?.addEventListener('click', function () { _savePanelGeneric(cfg); });

    if (cfg.searchId) {
      document.getElementById(cfg.searchId)?.addEventListener('input', function () {
        const q = this.value.trim();
        document.querySelectorAll(`#${cfg.listId} .filter-exam-item`).forEach(item => {
          const name = item.querySelector('.filter-exam-item__name')?.textContent || '';
          item.hidden = q ? !name.includes(q) : false;
        });
      });
    }
  }

  /* --- "ذخیره و بازگشت" from exam expanded panel --- */
  function _saveExamPanel() {
    const items = document.querySelectorAll('#filterExamsDoneList .filter-exam-item');
    let count = 0;
    items.forEach(item => { if (item.classList.contains('filter-exam-item--checked')) count++; });

    Modal.closePanel(PANEL_ID);
    _setRowFocused('filter-row-done-exam', false);
    _setRowActive('filter-row-done-exam', count > 0);

    const rowCountEl = document.getElementById('filterDoneExamRowCount');
    if (rowCountEl) {
      rowCountEl.textContent = _toPersian(count) + '+ گزینه انتخاب شده';
      rowCountEl.hidden = count === 0;
    }
  }

  /* --- Build active filters bar chips --- */
  function _buildChips() {
    const chipsEl = document.getElementById('activeFilterChips');
    const bar = document.getElementById('activeFiltersBar');
    if (!chipsEl || !bar) return;

    const chips = [];

    if (document.getElementById('filterHasExam')?.checked)  chips.push({ key: 'has-exam',  label: 'دارای آزمون' });
    if (document.getElementById('filterNoExam')?.checked)   chips.push({ key: 'no-exam',   label: 'بدون آزمون' });

    const doneRow = document.getElementById('filter-row-done-exam');
    if (doneRow?.classList.contains('table__filter-row--active')) {
      const items = document.querySelectorAll('#filterExamsDoneList .filter-exam-item');
      let count = 0;
      items.forEach(item => { if (item.classList.contains('filter-exam-item--checked')) count++; });
      if (count > 0) chips.push({ key: 'done-exam', label: _toPersian(count) + '+ آزمون انجام شده' });
    }

    Object.entries(_PANELS).forEach(([key, cfg]) => {
      const row = document.getElementById(cfg.rowId);
      if (row?.classList.contains('table__filter-row--active')) {
        const items = document.querySelectorAll(`#${cfg.listId} .filter-exam-item`);
        let count = 0;
        items.forEach(i => { if (i.classList.contains('filter-exam-item--checked')) count++; });
        if (count > 0) chips.push({ key, label: cfg.chipLabel(count) });
      }
    });

    if (chips.length === 0) {
      bar.classList.remove('table__active-filters--visible');
      chipsEl.innerHTML = '';
      return;
    }

    chipsEl.innerHTML = chips.map(chip =>
      `<span class="table__active-filter-tag">${chip.label}<button type="button" class="table__active-filter-close filter-chip-dismiss" data-filter-key="${chip.key}" aria-label="حذف فیلتر ${chip.label}"><svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></span>`
    ).join('');

    bar.classList.add('table__active-filters--visible');
  }

  /* --- Remove a single filter by key and rebuild chips --- */
  function _removeFilter(key) {
    if (key === 'has-exam') {
      const el = document.getElementById('filterHasExam');
      if (el) el.checked = false;
      _setRowActive('filter-row-has-exam', false);
    } else if (key === 'no-exam') {
      const el = document.getElementById('filterNoExam');
      if (el) el.checked = false;
      _setRowActive('filter-row-no-exam', false);
    } else if (key === 'done-exam') {
      document.querySelectorAll('#filterExamsDoneList .filter-exam-item').forEach(item => {
        item.classList.remove('filter-exam-item--checked');
      });
      _updateExamPanel();
      _setRowActive('filter-row-done-exam', false);
      const doneRowCount = document.getElementById('filterDoneExamRowCount');
      if (doneRowCount) doneRowCount.hidden = true;
    } else if (_PANELS[key]) {
      const cfg = _PANELS[key];
      document.querySelectorAll(`#${cfg.listId} .filter-exam-item`).forEach(i => {
        i.classList.remove('filter-exam-item--checked');
      });
      _updatePanel(cfg);
      _setRowActive(cfg.rowId, false);
      const rowCountEl = cfg.rowCountId ? document.getElementById(cfg.rowCountId) : null;
      if (rowCountEl) rowCountEl.hidden = true;
    }
    _buildChips();
  }

  /* --- Reset all filter states --- */
  function _resetAll() {
    ['filterHasExam', 'filterNoExam'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });
    _setRowActive('filter-row-has-exam', false);
    _setRowActive('filter-row-no-exam', false);

    document.querySelectorAll('#filterExamsDoneList .filter-exam-item').forEach(item => {
      item.classList.remove('filter-exam-item--checked');
    });
    _updateExamPanel();
    _setRowActive('filter-row-done-exam', false);
    _setRowFocused('filter-row-done-exam', false);
    Modal.closePanel(PANEL_ID);
    const doneRowCount = document.getElementById('filterDoneExamRowCount');
    if (doneRowCount) doneRowCount.hidden = true;

    Object.values(_PANELS).forEach(cfg => {
      document.querySelectorAll(`#${cfg.listId} .filter-exam-item`).forEach(i => {
        i.classList.remove('filter-exam-item--checked');
      });
      _updatePanel(cfg);
      _setRowActive(cfg.rowId, false);
      _setRowFocused(cfg.rowId, false);
      Modal.closePanel(cfg.panelId);
      const rowCountEl = cfg.rowCountId ? document.getElementById(cfg.rowCountId) : null;
      if (rowCountEl) rowCountEl.hidden = true;
    });
  }

  /* --- Wire up all events --- */
  function _init() {
    if (_initialized) return;
    _initialized = true;

    /* Switch toggle → row active state */
    document.getElementById(MODAL_ID)?.addEventListener('change', function (e) {
      if (!e.target.classList.contains('filter-switch')) return;
      const rowId = e.target.getAttribute('data-filter-row');
      if (rowId) _setRowActive(rowId, e.target.checked);
    });

    /* "آزمون انجام شده" expandable row → open/close panel */
    document.getElementById('filter-row-done-exam')?.addEventListener('click', function () {
      const isOpen = this.classList.contains('table__filter-row--focused');
      if (isOpen) {
        Modal.closePanel(PANEL_ID);
        _setRowFocused('filter-row-done-exam', false);
      } else {
        Modal.openPanel(PANEL_ID);
        _setRowFocused('filter-row-done-exam', true);
      }
    });

    /* Exam list item click → toggle checked */
    document.getElementById('filterExamsDoneList')?.addEventListener('click', function (e) {
      const item = e.target.closest('.filter-exam-item');
      if (!item) return;
      item.classList.toggle('filter-exam-item--checked');
      _updateExamPanel();
    });

    /* Select-all click */
    document.getElementById('filterExamsSelectAll')?.addEventListener('click', function () {
      const items = document.querySelectorAll('#filterExamsDoneList .filter-exam-item');
      const allChecked = [...items].every(item => item.classList.contains('filter-exam-item--checked'));
      items.forEach(item => item.classList.toggle('filter-exam-item--checked', !allChecked));
      _updateExamPanel();
    });

    /* Keyboard: space/enter on select-all */
    document.getElementById('filterExamsSelectAll')?.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.click(); }
    });

    /* "ذخیره و بازگشت" */
    document.getElementById('filterExamsDoneBack')?.addEventListener('click', _saveExamPanel);

    /* Search in expanded panel */
    document.getElementById('filterExamsSearch')?.addEventListener('input', function () {
      const q = this.value.trim();
      document.querySelectorAll('#filterExamsDoneList .filter-exam-item').forEach(item => {
        const name = item.querySelector('.filter-exam-item__name')?.textContent || '';
        item.hidden = q ? !name.includes(q) : false;
      });
    });

    /* "اعمال فیلتر" → build chips, show bar, close modal */
    document.getElementById('filterApplyBtn')?.addEventListener('click', function () {
      _buildChips();
      Modal.close(MODAL_ID);
    });

    /* "بازنشانی همه" (inside modal) */
    document.getElementById('filterResetBtn')?.addEventListener('click', _resetAll);

    /* Active filters bar: dismiss individual chip */
    document.getElementById('activeFilterChips')?.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter-chip-dismiss');
      if (!btn) return;
      _removeFilter(btn.getAttribute('data-filter-key'));
      /* _buildChips() is called inside _removeFilter, bar hides automatically when empty */
      return; // prevent fall-through
    });

    /* Active filters bar: reset all */
    document.getElementById('activeFiltersResetBtn')?.addEventListener('click', function () {
      _resetAll();
      const bar = document.getElementById('activeFiltersBar');
      if (bar) bar.classList.remove('table__active-filters--visible');
    });

    /* Wire up all generic checkbox-list panels */
    Object.values(_PANELS).forEach(_wirePanel);
  }

  document.addEventListener('DOMContentLoaded', _init);

  function open()  { _init(); Modal.open(MODAL_ID); }
  function close() { Modal.close(MODAL_ID); }

  return { open, close };
})();

/* ============================================================
   UsersRowSheet — Mobile row-action bottom sheet
   Intercepts .table__row-action click on mobile (capture phase)
   and shows a custom sheet matching Figma node 11003:65220
   ============================================================ */
const UsersRowSheet = (() => {
  let _initialized = false;
  let _currentRow = null;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    const sheet = document.getElementById('users-row-sheet');
    if (!sheet) return;

    sheet.querySelector('.users-mobile-sheet__overlay')
      .addEventListener('click', close);

    sheet.querySelectorAll('[data-row-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const action = btn.dataset.rowAction;
        close();
        _handleAction(action);
      });
    });

    // Intercept .table__row-action clicks on mobile (capture phase fires before table.js)
    document.addEventListener('click', _intercept, true);
  }

  function _intercept(e) {
    if (window.innerWidth >= 768) return;
    const btn = e.target.closest('.table__row-action');
    if (!btn) return;
    _currentRow = btn.closest('.table__row');
    e.stopPropagation();
    _updateSubtitle();
    open();
  }

  function _updateSubtitle() {
    const el = document.getElementById('users-row-sheet-subtitle');
    if (!el || !_currentRow) return;
    const nameCell = _currentRow.querySelector('td[data-label="نام و نام خانوادگی"]');
    el.textContent = nameCell ? nameCell.textContent.trim() : '';
  }

  function _handleAction(action) {
    const map = {
      'add-exam':  function () { Modal.open('users-add-exam-modal'); },
      'add-group': function () { UsersAddGroupModal.open(); },
      'access':    function () { Modal.open('users-access-modal'); },
      'status':    function () { Modal.open('users-status-modal'); },
      'delete':    function () { /* TODO: confirm delete */ },
    };
    const fn = map[action];
    if (fn) fn();
  }

  function open() {
    _init();
    const sheet = document.getElementById('users-row-sheet');
    if (sheet) sheet.classList.add('users-mobile-sheet--open');
  }

  function close() {
    const sheet = document.getElementById('users-row-sheet');
    if (sheet) sheet.classList.remove('users-mobile-sheet--open');
    _currentRow = null;
  }

  return { open, close };
})();

/* ============================================================
   UsersPageSizeSheet — Mobile page-size bottom sheet
   Intercepts .table__page-size-btn click on mobile (capture phase)
   and shows a custom sheet matching Figma node 10982:19793
   ============================================================ */
const UsersPageSizeSheet = (() => {
  let _initialized = false;

  const CHECK_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="var(--brand)"/><path d="M7 12.5L10.5 16L17 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CIRCLE_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11.5" stroke="#e2e4e6"/></svg>';

  function _init() {
    if (_initialized) return;
    _initialized = true;

    const sheet = document.getElementById('users-page-size-sheet');
    if (!sheet) return;

    sheet.querySelector('.users-mobile-sheet__overlay')
      .addEventListener('click', close);

    sheet.querySelectorAll('[data-size]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const size = parseInt(btn.dataset.size, 10);
        close();
        _applySize(size);
      });
    });

    // Intercept .table__page-size-btn clicks on mobile (capture phase)
    document.addEventListener('click', _intercept, true);
  }

  function _intercept(e) {
    if (window.innerWidth >= 768) return;
    const btn = e.target.closest('.table__page-size-btn');
    if (!btn) return;
    e.stopPropagation();
    _updateActive();
    open();
  }

  function _currentSize() {
    const active = document.querySelector('.table__page-size-option--active');
    return active ? parseInt(active.dataset.size, 10) : 10;
  }

  function _updateActive() {
    const sheet = document.getElementById('users-page-size-sheet');
    if (!sheet) return;
    const cur = _currentSize();
    sheet.querySelectorAll('[data-size]').forEach(function (btn) {
      const size = parseInt(btn.dataset.size, 10);
      const isActive = size === cur;
      btn.classList.toggle('users-mobile-sheet__size-item--active', isActive);
      const check = btn.querySelector('.users-mobile-sheet__size-check');
      if (check) check.innerHTML = isActive ? CHECK_SVG : CIRCLE_SVG;
    });
  }

  function _applySize(size) {
    const opt = document.querySelector('.table__page-size-option[data-size="' + size + '"]');
    if (opt) opt.click();
  }

  function open() {
    _init();
    _updateActive();
    const sheet = document.getElementById('users-page-size-sheet');
    if (sheet) sheet.classList.add('users-mobile-sheet--open');
  }

  function close() {
    const sheet = document.getElementById('users-page-size-sheet');
    if (sheet) sheet.classList.remove('users-mobile-sheet--open');
  }

  return { open, close };
})();
