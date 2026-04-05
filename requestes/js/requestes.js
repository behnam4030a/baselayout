/* ============================================================
   REQUESTS PAGE — requestes.js
   ============================================================ */

/* ---- Data (source of truth for details modal & filter matching) ---- */
const _REQ_DATA = [
  { id: 1, type: 'دریافت گروهی خروجی PDF', date: '۱۴۰۲/۰۳/۱۵', status: 'pending', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم..', details: [
    { user: 'کاربر ۳۵۹۱۵۴۷', phone: '+989215863622', deliveryStatus: 'pending' },
    { user: 'کاربر ۳۵۹۱۵۴۸', phone: '+989215863623', deliveryStatus: 'pending' },
    { user: 'کاربر ۳۵۹۱۵۴۹', phone: '+989215863624', deliveryStatus: 'pending' },
  ]},
  { id: 2, type: 'ارسال گروهی پیامک', date: '۱۴۰۲/۰۲/۲۰', status: 'done', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم..', details: [
    { user: 'کاربر ۳۵۹۱۵۴۷', phone: '+989215863622', deliveryStatus: 'sent' },
    { user: 'کاربر ۳۵۹۱۵۴۸', phone: '+989215863623', deliveryStatus: 'done' },
    { user: 'کاربر ۳۵۹۱۵۴۹', phone: '+989215863624', deliveryStatus: 'done' },
  ]},
  { id: 3, type: 'ارسال گروهی پیامک', date: '۱۴۰۲/۰۴/۰۵', status: 'failed', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم..', details: [
    { user: 'کاربر ۳۵۹۱۵۴۷', phone: '+989215863622', deliveryStatus: 'failed' },
    { user: 'کاربر ۳۵۹۱۵۴۸', phone: '+989215863623', deliveryStatus: 'failed' },
  ]},
  { id: 4, type: 'دریافت گروهی خروجی PDF', date: '۱۴۰۲/۰۵/۱۰', status: 'done', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم..', details: [
    { user: 'کاربر ۳۵۹۱۵۴۷', phone: '+989215863622', deliveryStatus: 'done' },
    { user: 'کاربر ۳۵۹۱۵۵۰', phone: '+989215863625', deliveryStatus: 'sent' },
  ]},
  { id: 5, type: 'ارسال گروهی پیامک', date: '۱۴۰۲/۰۶/۰۱', status: 'pending', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم..', details: [
    { user: 'کاربر ۳۵۹۱۵۴۷', phone: '+989215863622', deliveryStatus: 'pending' },
    { user: 'کاربر ۳۵۹۱۵۴۸', phone: '+989215863623', deliveryStatus: 'sent' },
    { user: 'کاربر ۳۵۹۱۵۴۹', phone: '+989215863624', deliveryStatus: 'pending' },
  ]},
];

/* ---- Requests Page ---- */
const RequestsPage = (() => {
  let _activeFilters = { status: [], type: [] };

  const _STATUS_LABELS = {
    pending: 'در صف پردازش',
    done:    'تکمیل شده',
    failed:  'ناموفق',
  };

  function _applyVisibility() {
    var tbody = document.querySelector('[data-table="req-table"] .table__tbody');
    if (!tbody) return;

    var visibleCount = 0;

    _REQ_DATA.forEach(function(row) {
      var matchStatus = !_activeFilters.status.length || _activeFilters.status.includes(row.status);
      var matchType   = !_activeFilters.type.length   || _activeFilters.type.includes(
        row.type === 'دریافت گروهی خروجی PDF' ? 'pdf' : 'sms'
      );
      var tr = tbody.querySelector('[data-row-id="' + row.id + '"]');
      if (tr) {
        tr.style.display = (matchStatus && matchType) ? '' : 'none';
        if (matchStatus && matchType) visibleCount++;
      }
    });

    var countEl = document.getElementById('reqCount');
    if (countEl) countEl.textContent = 'تعداد: ' + visibleCount + ' عدد';

    var container = document.querySelector('[data-table="req-table"]');
    if (container) {
      if (visibleCount === 0) {
        container.classList.add('req--is-empty');
      } else {
        container.classList.remove('req--is-empty');
      }
    }
  }

  function _renderFilterTags() {
    var bar    = document.getElementById('reqFiltersBar');
    var tagsEl = document.getElementById('reqActiveTags');
    if (!bar || !tagsEl) return;

    var tags = [];
    _activeFilters.status.forEach(function(v) {
      tags.push({ label: _STATUS_LABELS[v] || v, key: 'status', val: v });
    });
    _activeFilters.type.forEach(function(v) {
      var label = v === 'pdf' ? 'دریافت گروهی خروجی PDF' : 'ارسال گروهی پیامک';
      tags.push({ label: label, key: 'type', val: v });
    });

    if (!tags.length) {
      bar.classList.remove('table__active-filters--visible');
      return;
    }

    bar.classList.add('table__active-filters--visible');
    tagsEl.innerHTML = tags.map(function(t) {
      return '<div class="table__active-filter-tag">'
        + '<button class="table__active-filter-close" data-key="' + t.key + '" data-val="' + t.val + '" title="حذف فیلتر">'
        +   '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
        +     '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
        +   '</svg>'
        + '</button>'
        + '<span>' + t.label + '</span>'
        + '</div>';
    }).join('');

    tagsEl.querySelectorAll('.table__active-filter-close').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = this.dataset.key;
        var val = this.dataset.val;
        _activeFilters[key] = _activeFilters[key].filter(function(v) { return v !== val; });
        _renderFilterTags();
        _applyVisibility();
      });
    });
  }

  function _resetFilters() {
    _activeFilters = { status: [], type: [] };
    _renderFilterTags();
    _applyVisibility();
    document.querySelectorAll('#req-filter-modal .checkbox__input').forEach(function(cb) { cb.checked = false; });
  }

  function applyFilters(filters) {
    _activeFilters = filters;
    _renderFilterTags();
    _applyVisibility();
  }

  function init() {
    _renderFilterTags();
    _applyVisibility();

    Table.onRowAction('req-table', function(data) {
      if (data.action === 'details') {
        var rowId = data.row && parseInt(data.row.dataset.rowId, 10);
        var rowData = _REQ_DATA.find(function(r) { return r.id === rowId; });
        if (rowData) RequestDetailsModal.open(rowData);
      }
    });

    var resetBtn = document.getElementById('reqResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', _resetFilters);
    }
  }

  return { init: init, applyFilters: applyFilters, resetFilters: _resetFilters };
})();

/* ---- Filter Modal ---- */
const RequestFilterModal = (() => {
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    var applyBtn = document.getElementById('reqFilterApply');
    if (applyBtn) {
      applyBtn.addEventListener('click', function() {
        var statusVals = Array.from(document.querySelectorAll('#req-filter-modal input[name="status"]:checked')).map(function(cb) { return cb.value; });
        var typeVals   = Array.from(document.querySelectorAll('#req-filter-modal input[name="type"]:checked')).map(function(cb) { return cb.value; });
        RequestsPage.applyFilters({ status: statusVals, type: typeVals });
        Modal.close('req-filter-modal');
      });
    }
  }

  function open() {
    _init();
    Modal.open('req-filter-modal');
  }

  function close() {
    Modal.close('req-filter-modal');
  }

  return { open: open, close: close };
})();

/* ---- Details Modal ---- */
const RequestDetailsModal = (() => {
  const _DELIVERY_LABELS = {
    pending: 'در حال پردازش',
    done:    'تحویل شده',
    failed:  'تحویل نشده',
    sent:    'ارسال شده',
  };
  const _DELIVERY_COLORS = {
    pending: '#f7630c',
    done:    '#107c10',
    failed:  '#c50f1f',
    sent:    '#107c10',
  };
  const _STATUS_DISPLAY = {
    pending: { text: 'در حال پردازش', color: '#f7630c' },
    done:    { text: 'تکمیل شده',      color: '#107c10' },
    failed:  { text: 'ناموفق',          color: '#c50f1f' },
  };

  function open(row) {
    var typeEl   = document.getElementById('detailType');
    var descEl   = document.getElementById('detailDesc');
    var statusEl = document.getElementById('detailStatusVal');
    var rowsEl   = document.getElementById('detailRows');

    if (typeEl)   typeEl.textContent = row.type;
    if (descEl)   descEl.textContent = row.desc;
    if (statusEl) {
      var s = _STATUS_DISPLAY[row.status] || { text: row.status, color: 'var(--text-1)' };
      var details = row.details || [];
      var total = details.length;
      var count;
      if (row.status === 'pending') {
        count = details.filter(function(d) { return d.deliveryStatus === 'pending'; }).length;
      } else if (row.status === 'done') {
        count = details.filter(function(d) { return d.deliveryStatus === 'done' || d.deliveryStatus === 'sent'; }).length;
      } else {
        count = details.filter(function(d) { return d.deliveryStatus === row.status; }).length;
      }
      statusEl.textContent = s.text + ' ' + count + ' از ' + total;
      statusEl.style.color = s.color;
    }
    if (rowsEl) {
      var details = row.details || [];
      rowsEl.innerHTML = details.map(function(d) {
        var color = _DELIVERY_COLORS[d.deliveryStatus] || 'var(--text-1)';
        var label = _DELIVERY_LABELS[d.deliveryStatus] || d.deliveryStatus;
        return '<div class="req-detail-item">'
          + '<span class="req-detail-item__span">'
          +   '<span>' + d.user + '</span>'
          +   '<span class="req-detail-item__sep">|</span>'
          +   '<span>' + d.phone + '</span>'
          + '</span>'
          + '<span class="req-detail-item__value" style="color:' + color + '">' + label + '</span>'
          + '</div>';
      }).join('');
    }
    Modal.open('req-detail-modal');
  }

  function close() {
    Modal.close('req-detail-modal');
  }

  function cancel() {
    Modal.close('req-detail-modal');
  }

  return { open: open, close: close, cancel: cancel };
})();

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', function() {
  RequestsPage.init();
});
