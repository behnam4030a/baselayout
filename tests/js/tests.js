'use strict';

/* global Modal */

/**
 * PreviewModal — مودال پیش‌نمایش آزمون
 */
const PreviewModal = (() => {
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    Modal.onOpen('preview-modal', () => {
      _setVersion('full');
      document.querySelectorAll('.js-preview-version').forEach(btn => {
        btn.addEventListener('click', () => _setVersion(btn.dataset.version));
      });
    });
  }

  function _setVersion(version) {
    const fullBtn    = document.querySelector('.preview-version-full');
    const radioBtn   = document.querySelector('.preview-version-radio');
    const imgFull    = document.getElementById('previewImgFull');
    const imgLimited = document.getElementById('previewImgLimited');
    if (!fullBtn || !radioBtn) return;

    if (version === 'full') {
      fullBtn.classList.remove('preview-version-full--inactive');
      radioBtn.classList.remove('preview-version-radio--active');
      if (imgFull)    imgFull.classList.remove('preview-image-wrap--hidden');
      if (imgLimited) imgLimited.classList.add('preview-image-wrap--hidden');
    } else {
      fullBtn.classList.add('preview-version-full--inactive');
      radioBtn.classList.add('preview-version-radio--active');
      if (imgFull)    imgFull.classList.add('preview-image-wrap--hidden');
      if (imgLimited) imgLimited.classList.remove('preview-image-wrap--hidden');
    }
  }

  function open(testName) {
    _init();
    const subtitle = document.getElementById('previewModalSubtitle');
    if (subtitle && testName) subtitle.textContent = testName;
    Modal.open('preview-modal');
  }

  function close() {
    Modal.close('preview-modal');
  }

  return { open, close };
})();

/**
 * FilterModal — مودال فیلتر آزمون‌ها
 */
const FilterModal = (() => {
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    const resetBtn = document.getElementById('filterResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', _reset);
    }

    const applyBtn = document.getElementById('filterApplyBtn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => close());
    }
  }

  function _reset() {
    document.querySelectorAll('#filter-modal .switch__input').forEach(sw => {
      sw.checked = false;
    });
  }

  function open() {
    _init();
    Modal.open('filter-modal');
  }

  function close() {
    Modal.close('filter-modal');
  }

  return { open, close };
})();

// Wire up preview buttons
document.querySelectorAll('.js-preview-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.test-card');
    const testName = card ? (card.querySelector('.test-card__name') || {}).textContent || '' : '';
    PreviewModal.open(testName);
  });
});

// Wire up filter button
const _filterBtn = document.getElementById('testsFilterBtn');
if (_filterBtn) {
  _filterBtn.addEventListener('click', () => FilterModal.open());
}

/**
 * TestsSearch — جستجو در کارت‌های آزمون
 */
const TestsSearch = (() => {
  const input     = document.getElementById('testsSearchInput');
  const clearBtn  = input && input.closest('.input__container')
                      ? input.closest('.input__container').querySelector('.input__icon--after')
                      : null;
  const cards     = document.querySelectorAll('.test-card');
  let _emptyEl    = null;

  function _getEmptyEl() {
    if (!_emptyEl) {
      _emptyEl = document.createElement('div');
      _emptyEl.className = 'tests-page__empty-state';
      _emptyEl.textContent = 'آزمونی با این عنوان یافت نشد.';
      _emptyEl.style.cssText = 'display:none;text-align:center;padding:2rem 1rem;color:var(--text-2);font-size:.9rem;grid-column:1/-1;';
      const container = cards.length ? cards[0].closest('.tests-page') : null;
      if (container) container.appendChild(_emptyEl);
    }
    return _emptyEl;
  }

  function _filter(query) {
    const q = query.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      const name = (card.querySelector('.test-card__name') || {}).textContent || '';
      const tags = Array.from(card.querySelectorAll('.test-card__tag')).map(t => t.textContent).join(' ');
      const haystack = (name + ' ' + tags).toLowerCase();
      const match = !q || haystack.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    const emptyEl = _getEmptyEl();
    if (emptyEl) emptyEl.style.display = (q && visibleCount === 0) ? '' : 'none';

    if (clearBtn) clearBtn.style.visibility = q ? 'visible' : 'hidden';
  }

  function _init() {
    if (!input) return;
    if (clearBtn) clearBtn.style.visibility = 'hidden';

    input.addEventListener('input', () => _filter(input.value));

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        _filter('');
        input.focus();
      });
    }
  }

  _init();
})();

/* ===================================================
   Result Tests Page JS
   =================================================== */
  /* === Results Test Page JS === */
  const ResultsListPage = (() => {
    const TABLE_ID = 'results-table';

    function _checkEmptyState() {
      const container = document.querySelector('[data-table="' + TABLE_ID + '"]');
      if (!container) return;
      const tbody = container.querySelector('.table__tbody');
      const hasRows = tbody && tbody.querySelectorAll('tr.table__row').length > 0;
      container.classList.toggle('table-container--empty', !hasRows);
    }

    function _initRowClick() {
      document.addEventListener('click', function(e) {
        if (e.target.closest('.table__row-action')) return;
        if (e.target.closest('.table__cell--checkbox')) return;
        const row = e.target.closest('.table__tbody .table__row');
        if (!row) return;
        ResultViewModal.open(row);
      });
    }

    function _initRowAction() {
      Table.onRowAction('results-table', function(data) {
        if (data.action !== 'upgrade' || !data.row) return;
        const cells = data.row.querySelectorAll('td.table__cell:not(.table__cell--checkbox):not(.table__cell--action)');
        const userCode = cells[0] ? cells[0].textContent.trim() : '—';
        const examName = cells[1] ? cells[1].textContent.trim() : '—';
        UpgradeModal.open(examName, userCode);
      });
    }

    function init() {
      _checkEmptyState();
      _initRowClick();
      _initRowAction();
    }

    return { init };
  })();

  /* === Result View Modal === */
  const ResultViewModal = (() => {
    let _currentData = {};

    function open(rowEl) {
      const cells = rowEl.querySelectorAll('td.table__cell:not(.table__cell--checkbox):not(.table__cell--action)');
      _currentData = {
        userCode: cells[0] ? cells[0].textContent.trim() : '—',
        examName: cells[1] ? cells[1].textContent.trim() : '—',
        version:  cells[2] ? cells[2].textContent.trim() : '—'
      };
      document.getElementById('rvmSubtitle').textContent = _currentData.examName + ' - ' + _currentData.version;
      document.getElementById('rvmProSection').classList.remove('rvm__pro--purchased');
      Modal.open('result-view-modal');
    }

    function close() { Modal.close('result-view-modal'); }

    function openUpgrade() {
      UpgradeModal.open(_currentData.examName, _currentData.userCode);
    }

    function setPurchased() {
      document.getElementById('rvmProSection').classList.add('rvm__pro--purchased');
    }

    return { open, close, openUpgrade, setPurchased };
  })();

  /* === Upgrade Modal === */
  const UpgradeModal = (() => {
    function open(examName, userCode) {
      document.getElementById('upmExamName').textContent = examName || '—';
      document.getElementById('upmSubtitle').textContent = 'کاربر ' + (userCode || '—');
      Modal.close('result-view-modal');
      Modal.open('upgrade-modal');
    }

    function close() { Modal.close('upgrade-modal'); }

    function confirmPayment() {
      Modal.close('upgrade-modal');
      ResultViewModal.setPurchased();
      setTimeout(function() { Modal.open('result-view-modal'); }, 320);
    }

    function toggleDiscount() {
      var discountWrap  = document.getElementById('upmDiscountWrap');
      var discountInput = document.getElementById('upmDiscountInput');
      if (!discountWrap) return;
      var isOpen = !discountWrap.hidden;
      discountWrap.hidden = isOpen;
      if (!isOpen && discountInput) discountInput.focus();
    }

    return { open, close, confirmPayment, toggleDiscount };
  })();

  document.addEventListener('DOMContentLoaded', ResultsListPage.init);
