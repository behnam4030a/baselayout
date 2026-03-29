/**
 * transactions.js — منطق صفحه تراکنش‌ها
 */
(function () {

  /** نمایش حالت خالی یا لیست */
  function initTransactionsView() {
    var listTile  = document.getElementById('trxListTile');
    var emptyTile = document.getElementById('trxEmptyTile');
    if (!listTile || !emptyTile) return;

    var tbody = listTile.querySelector('.table__tbody');
    if (!tbody) return;

    var hasRows = tbody.querySelectorAll('.table__row').length > 0;
    listTile.style.display  = hasRows ? '' : 'none';
    emptyTile.style.display = hasRows ? 'none' : '';
  }

  /** در موبایل: با تیک زدن هر چک‌باکس، مودال جزئیات همان ردیف باز می‌شود */
  function initMobileCheckboxOpen() {
    var listTile = document.getElementById('trxListTile');
    if (!listTile) return;

    listTile.addEventListener('change', function (e) {
      var input = e.target;
      if (!input.classList.contains('table__checkbox-input')) return;
      if (!window.matchMedia('(max-width: 768px)').matches) return;
      if (!input.checked) return;

      var row = input.closest('.table__row');
      TrxDetailModal._populateAndOpen(row);

      // چک‌باکس را بعد از باز شدن مودال برگردان به حالت خالی
      input.checked = false;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTransactionsView();
    initMobileCheckboxOpen();
  });

})();

/* ===================================================
   TRX DETAIL MODAL — مودال جزئیات تراکنش
   =================================================== */
var TrxDetailModal = (function () {

  function _populateAndOpen(row) {
    _populate(row);
    Modal.open('trx-detail-modal');
  }

  function _populate(row) {
    var trxNo = '—', date = '—', desc = '—';

    if (row) {
      var codeCell  = row.querySelector('[data-label="شماره تراکنش"]');
      var dateCell  = row.querySelector('[data-label="تاریخ تراکنش"]');
      var typeCell  = row.querySelector('[data-label="نوع"]');
      if (codeCell) trxNo = codeCell.textContent.trim();
      if (dateCell) date  = dateCell.textContent.trim();
      if (typeCell) desc  = typeCell.textContent.trim();
    }

    var subtitle = document.getElementById('trxDetailSubtitle');
    var dateEl   = document.getElementById('trxDetailDate');
    var descEl   = document.getElementById('trxDetailDesc');
    if (subtitle) subtitle.textContent = 'شماره تراکنش "' + trxNo + '"';
    if (dateEl)   dateEl.value         = date;
    if (descEl)   descEl.value         = desc;
  }

  function close() {
    Modal.close('trx-detail-modal');
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof Table !== 'undefined') {
      Table.onRowAction('transactions', function (data) {
        if (data.action !== 'view') return;
        _populate(data.row);
        Modal.open('trx-detail-modal');
      });
    }
  });

  return { close: close, _populateAndOpen: _populateAndOpen };
})();

/* ===================================================
   TRX FILTER MODAL — مودال فیلتر تراکنش‌ها
   =================================================== */
var TrxFilterModal = (function () {
  var _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    var modal = document.getElementById('trx-filter-modal');
    if (!modal) return;

    modal.querySelectorAll('.trx-filter-item').forEach(function (item) {
      item.addEventListener('click', function () {
        item.classList.toggle('trx-filter-item--open');
      });
    });
  }

  function open() {
    _init();
    Modal.open('trx-filter-modal');
  }

  function close() {
    Modal.close('trx-filter-modal');
  }

  function apply() {
    close();
  }

  return { open: open, close: close, apply: apply };
})();
