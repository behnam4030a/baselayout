/**
 * finance.js — منطق صفحه مدیریت مالی
 */
(function () {

  /** فیلتر جدول صورتحساب‌ها بر اساس وضعیت */
  function initInvoiceFilter() {
    var tabs = document.querySelectorAll('.finance-filter-btn');
    var tbody = document.querySelector('[data-table="invoices"] .table__tbody');
    if (!tabs.length || !tbody) return;

    function toPersian(n) {
      return String(n).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
    }

    function updateCounts() {
      var rows = Array.prototype.slice.call(tbody.querySelectorAll('.table__row'));
      var total = rows.length;

      var counts = {};
      rows.forEach(function (row) {
        var tag = row.querySelector('[data-label="وضعیت"] .table__tag');
        var status = tag ? tag.textContent.trim() : '';
        if (status) counts[status] = (counts[status] || 0) + 1;
      });

      tabs.forEach(function (tab) {
        var filter = tab.dataset.filter;
        var label  = filter === 'all' ? 'همه' : filter;
        var count  = filter === 'all' ? total : (counts[filter] || 0);
        tab.innerHTML = '<span class="finance-filter-label">' + label + '</span>'
          + '<span class="finance-filter-count"> (' + toPersian(count) + ')</span>';
      });
    }

    function filterRows(filter) {
      var rows = tbody.querySelectorAll('.table__row');
      rows.forEach(function (row) {
        if (filter === 'all') { row.style.display = ''; return; }
        var tag = row.querySelector('[data-label="وضعیت"] .table__tag');
        var tagText = tag ? tag.textContent.trim() : '';
        row.style.display = tagText === filter ? '' : 'none';
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('finance-filter-btn--active'); });
        tab.classList.add('finance-filter-btn--active');
        filterRows(tab.dataset.filter);
      });
    });

    // شمارش اولیه
    updateCounts();

    // به‌روزرسانی خودکار هنگام حذف/اضافه ردیف
    var observer = new MutationObserver(updateCounts);
    observer.observe(tbody, { childList: true });
  }

  /** نمایش حالت خالی یا جدول */
  function initInvoiceView() {
    var tableTile = document.getElementById('financeTableTile');
    var emptyTile = document.getElementById('financeEmptyTile');
    if (!tableTile || !emptyTile) return;

    var tbody = tableTile.querySelector('.table__tbody');
    var hasRows = tbody && tbody.querySelectorAll('.table__row').length > 0;

    tableTile.style.display = hasRows ? '' : 'none';
    emptyTile.style.display = hasRows ? 'none' : '';
  }

  document.addEventListener('DOMContentLoaded', function () {
    initInvoiceView();
    initInvoiceFilter();
  });

})();

/* ===================================================
   PHYSICAL INVOICE MODAL — مودال فاکتور فیزیکی
   =================================================== */
var PhysicalInvoiceModal = (function () {
  var _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    var changeBtn = document.getElementById('changeAddressBtn');
    var addressView = document.getElementById('invoiceAddressView');
    var addressForm = document.getElementById('invoiceAddressForm');

    if (changeBtn) {
      changeBtn.onclick = function () {
        addressView.style.display = 'none';
        addressForm.style.display = '';
      };
    }

    Modal.onOpen('physical-invoice-modal', function () {
      // Reset to default state each time modal opens
      if (addressView) addressView.style.display = '';
      if (addressForm) addressForm.style.display = 'none';
    });
  }

  function open() {
    _init();
    Modal.open('physical-invoice-modal');
  }

  function close() {
    Modal.close('physical-invoice-modal');
  }

  return { open: open, close: close };
})();

window.PhysicalInvoiceModal = PhysicalInvoiceModal;

/* ===================================================
   ADD CREDIT MODAL — مودال افزایش اعتبار
   =================================================== */
var AddCreditModal = (function () {
  var _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    var input = document.getElementById('addCreditAmount');
    var presets = document.querySelectorAll('.ac-modal__preset-btn');

    function _toPersian(n) {
      return String(n).replace(/\d/g, function (d) {
        return '۰۱۲۳۴۵۶۷۸۹'[d];
      });
    }

    function _formatNumber(n) {
      return _toPersian(n.toLocaleString('en-US').replace(/,/g, '،'));
    }

    presets.forEach(function (btn) {
      btn.addEventListener('click', function () {
        presets.forEach(function (b) { b.classList.remove('ac-modal__preset-btn--active'); });
        btn.classList.add('ac-modal__preset-btn--active');
        if (input) input.value = _formatNumber(parseInt(btn.dataset.amount, 10));
      });
    });

    Modal.onOpen('add-credit-modal', function () {
      if (input) input.value = '';
      presets.forEach(function (b) { b.classList.remove('ac-modal__preset-btn--active'); });
    });
  }

  function open() {
    _init();
    Modal.open('add-credit-modal');
  }

  function close() {
    Modal.close('add-credit-modal');
  }

  return { open: open, close: close };
})();

window.AddCreditModal = AddCreditModal;

/* ===================================================
   GIFT CARD MODAL — مودال استفاده از کارت هدیه
   =================================================== */
var GiftCardModal = (function () {
  var _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    var input = document.getElementById('giftCardCode');

    Modal.onOpen('gift-card-modal', function () {
      if (input) input.value = '';
    });
  }

  function open() {
    _init();
    Modal.open('gift-card-modal');
  }

  function close() {
    Modal.close('gift-card-modal');
  }

  return { open: open, close: close };
})();

window.GiftCardModal = GiftCardModal;
