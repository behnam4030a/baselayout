/**
 * Table Demo Script
 * کد مختص به دموی کامپوننت جدول — نه بخشی از کتابخانه
 */

(function () {
  'use strict';

  /* ==========================================
     Modal delegation (data-modal-open / data-modal-close)
     ========================================== */

  document.addEventListener('click', function (e) {
    var openEl = e.target.closest('[data-modal-open]');
    if (openEl && window.Modal) {
      Modal.open(openEl.getAttribute('data-modal-open'));
      return;
    }
    var closeEl = e.target.closest('[data-modal-close]');
    if (closeEl && window.Modal) {
      Modal.close(closeEl.getAttribute('data-modal-close'));
    }
  });

  /* ==========================================
     Server-Side Demo — داده‌ها از demo-data.json
     ========================================== */

  var allUsers = [];
  var serverQuery = '';
  var serverPageSize = 10;
  var serverCurrentPage = 1;

  function toPersian(n) {
    return String(n).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
  }

  function buildUserRow(u) {
    var pct = Math.round(u.done / u.total * 100);
    return '<tr class="table__row" data-id="' + u.id + '">' +
      '<td class="table__cell table__cell--checkbox">' +
        '<label class="table__checkbox-wrapper">' +
          '<input type="checkbox" class="table__checkbox-input">' +
          '<span class="table__checkbox-box">' +
            '<svg class="table__icon--check" viewBox="0 0 10 10" fill="none"><path d="M2 5.2L4 7.5L8 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</span>' +
        '</label>' +
      '</td>' +
      '<td class="table__cell" data-label="نام و نام خانوادگی">' + u.name + '</td>' +
      '<td class="table__cell table__cell--code" data-label="کد اختصاصی">' + toPersian(u.code) + '</td>' +
      '<td class="table__cell" data-label="شماره تماس">' + toPersian(u.phone) + '</td>' +
      '<td class="table__cell" data-label="وضعیت آزمون">' +
        '<div class="table__progress">' +
          '<span class="table__progress-text">' + toPersian(u.done) + ' از ' + toPersian(u.total) + ' انجام شده</span>' +
          '<div class="table__progress-bar"><div class="table__progress-fill" style="width:' + pct + '%"></div></div>' +
        '</div>' +
      '</td>' +
      '<td class="table__cell" data-label="وضعیت"><span class="table__tag table__tag--' + u.status + '">' + (u.status === 'success' ? 'فعال' : 'غیرفعال') + '</span></td>' +
      '<td class="table__cell table__cell--action"><button class="table__row-action">&#8942;</button></td>' +
    '</tr>';
  }

  function fetchUsers(page, pageSize, query) {
    serverCurrentPage = page || 1;
    var q = (query || '').trim().toLowerCase();
    setTimeout(function () {
      var filtered = allUsers.filter(function (u) {
        return q === '' || u.name.indexOf(q) !== -1 || u.code.indexOf(q) !== -1;
      });
      var total = filtered.length;
      var maxPage = Math.max(1, Math.ceil(total / pageSize));
      if (serverCurrentPage > maxPage) serverCurrentPage = maxPage;
      var start = (serverCurrentPage - 1) * pageSize;
      var pageData = filtered.slice(start, start + pageSize);
      Table.setTotal('server-table', total);
      Table.setRows('server-table', pageData.map(buildUserRow).join(''));
      var countEl = document.getElementById('server-table-count');
      if (countEl) countEl.textContent = 'تعداد: ' + toPersian(total) + ' نفر';
    }, 400);
  }

  document.addEventListener('DOMContentLoaded', function () {
    Table.onPageChange('server-table', function (data) {
      serverPageSize = data.pageSize;
      serverCurrentPage = data.page;
      fetchUsers(data.page, data.pageSize, serverQuery);
    });

    Table.onSearch('server-table', function (data) {
      serverQuery = data.query;
      fetchUsers(1, serverPageSize, data.query);
    });

    Table.onBulkAction('server-table', function (data) {
      if (data.action === 'delete') {
        var ids = data.rows.map(function (row) { return row.getAttribute('data-id'); });
        allUsers = allUsers.filter(function (u) { return ids.indexOf(String(u.id)) === -1; });
        fetchUsers(serverCurrentPage, serverPageSize, serverQuery);
      }
    });

    Table.onRowAction('server-table', function (data) {
      if (data.action === 'delete' && data.row) {
        var rowId = data.row.getAttribute('data-id');
        allUsers = allUsers.filter(function (u) { return String(u.id) !== rowId; });
        fetchUsers(serverCurrentPage, serverPageSize, serverQuery);
      }
    });

    fetch('demo-data.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        allUsers = data;
        fetchUsers(1, 10, '');
      })
      .catch(function () {
        Table.setRows('server-table', '');
        Table.setTotal('server-table', 0);
      });
  });

})();
