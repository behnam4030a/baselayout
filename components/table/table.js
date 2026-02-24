/**
 * Table Component Scripts
 * کامپوننت جدول (Table) - اسکریپت‌ها
 *
 * امکانات:
 * - Row selection / Select all
 * - Pagination با page-size selector (5/10/15/20)
 * - Search (client-side)
 * - Action bar (حذف و ادیت دسته‌ای)
 * - Edit modal
 * - Responsive scroll wrapper
 * - Auto-init
 */

(function () {
  'use strict';

  var tables = {};
  var callbacks = {};

  /* ==========================================
     Mobile Detection
     ========================================== */

  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  /* ==========================================
     Helpers
     ========================================== */

  function getAllBodyRows(container) {
    var tbody = container.querySelector('.table__tbody');
    if (!tbody) return [];
    return Array.prototype.slice.call(tbody.querySelectorAll('.table__row'));
  }

  function getVisibleRows(state) {
    return state.filteredRows || state.allRows;
  }

  function toPersianNum(num) {
    var d = ['\u06F0','\u06F1','\u06F2','\u06F3','\u06F4','\u06F5','\u06F6','\u06F7','\u06F8','\u06F9'];
    return String(num).replace(/\d/g, function (c) { return d[parseInt(c, 10)]; });
  }

  function closeAllMenus() {
    var openMenus = document.querySelectorAll('.table__page-size-dropdown--open');
    Array.prototype.forEach.call(openMenus, function (m) {
      m.classList.remove('table__page-size-dropdown--open');
    });
    closeRowMenu();
  }

  /* ==========================================
     Row Action Menu (Desktop Dropdown + Mobile Bottom Sheet)
     منو یک بار در HTML نوشته میشه، JS آن را جابجا/کپی میکند
     ========================================== */

  var activeRowMenu = null;
  var activeBottomSheet = null;

  function closeRowMenu() {
    if (!activeRowMenu) return;
    if (activeRowMenu.btn) activeRowMenu.btn.classList.remove('table__row-action--active');
    // Return menu to its original parent (hidden)
    var menu = activeRowMenu.el;
    var home = activeRowMenu.home;
    if (menu && home) {
      menu.classList.remove('table__row-menu--open');
      home.appendChild(menu);
    }
    activeRowMenu = null;
  }

  function closeBottomSheet() {
    if (!activeBottomSheet) return;
    var sheet = activeBottomSheet.sheet;
    var overlay = activeBottomSheet.overlay;
    sheet.classList.remove('table__bottom-sheet--open');
    overlay.classList.remove('table__bottom-sheet-overlay--open');
    var ref = activeBottomSheet;
    activeBottomSheet = null;
    setTimeout(function () {
      if (ref.overlay && ref.overlay.parentNode) ref.overlay.remove();
      if (ref.sheet && ref.sheet.parentNode) ref.sheet.remove();
    }, 300);
  }

  /* ==========================================
     Action Bar Mobile Overlay
     ========================================== */

  function showActionBarOverlay(container, state) {
    if (document.querySelector('.table__action-bar-overlay')) return;
    var overlay = document.createElement('div');
    overlay.className = 'table__action-bar-overlay';
    document.body.appendChild(overlay);
    overlay.offsetHeight; // force reflow
    overlay.classList.add('table__action-bar-overlay--visible');
    overlay.addEventListener('click', function () {
      var actionBar = container.querySelector('.table__action-bar');
      if (actionBar) actionBar.classList.remove('table__action-bar--visible');
      hideActionBarOverlay();
      state.actionBarDismissed = true;
    });
  }

  function hideActionBarOverlay() {
    var overlay = document.querySelector('.table__action-bar-overlay');
    if (!overlay) return;
    overlay.classList.remove('table__action-bar-overlay--visible');
    setTimeout(function () {
      if (overlay.parentNode) overlay.remove();
    }, 300);
  }

  function showRowMenu(container, state, row, btn) {
    var menu = container.querySelector('.table__row-menu');
    if (!menu) return;

    // Toggle: clicking the same button closes menu
    if (activeRowMenu && activeRowMenu.btn === btn) {
      closeRowMenu();
      return;
    }
    closeRowMenu();

    var tableId = container.getAttribute('data-table');

    // Move menu into the action cell and show it
    var actionCell = btn.closest('.table__cell--action');
    if (!actionCell) return;

    var home = menu.parentNode; // remember original parent
    actionCell.appendChild(menu);
    menu.classList.add('table__row-menu--open');
    btn.classList.add('table__row-action--active');

    activeRowMenu = { el: menu, btn: btn, home: home, row: row };
  }

  function showBottomSheet(container, state, row) {
    closeBottomSheet();

    var menu = container.querySelector('.table__row-menu');
    if (!menu) return;

    var tableId = container.getAttribute('data-table');
    var items = menu.querySelectorAll('.table__row-menu-item');
    if (items.length === 0) return;

    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'table__bottom-sheet-overlay';

    // Create sheet
    var sheet = document.createElement('div');
    sheet.className = 'table__bottom-sheet';

    // Handle
    var handle = document.createElement('div');
    handle.className = 'table__bottom-sheet-handle';
    sheet.appendChild(handle);

    // Body — clone menu items as bottom-sheet items
    var body = document.createElement('div');
    body.className = 'table__bottom-sheet-body';

    Array.prototype.forEach.call(items, function (srcItem) {
      var item = document.createElement('button');
      item.className = 'table__bottom-sheet-item';
      item.type = 'button';
      item.textContent = srcItem.textContent;
      var actionKey = srcItem.getAttribute('data-action');
      item.addEventListener('click', function () {
        closeBottomSheet();
        fireCallback(callbacks, tableId, 'rowAction', { action: actionKey, row: row });
      });
      body.appendChild(item);
    });

    sheet.appendChild(body);

    overlay.addEventListener('click', function () {
      closeBottomSheet();
    });

    document.body.appendChild(overlay);
    document.body.appendChild(sheet);

    // Trigger animation
    overlay.offsetHeight;
    overlay.classList.add('table__bottom-sheet-overlay--open');
    requestAnimationFrame(function () {
      sheet.classList.add('table__bottom-sheet--open');
    });

    activeBottomSheet = { sheet: sheet, overlay: overlay };
  }

  function bindRowMenuItems(container, state) {
    var menu = container.querySelector('.table__row-menu');
    if (!menu || menu._bound) return;
    menu._bound = true;

    var tableId = container.getAttribute('data-table');
    var items = menu.querySelectorAll('.table__row-menu-item');
    Array.prototype.forEach.call(items, function (item) {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        var actionKey = item.getAttribute('data-action');
        var row = activeRowMenu ? activeRowMenu.row : null;
        closeRowMenu();

        // Default client-side row delete
        if (actionKey === 'delete' && state.mode !== 'server' && row) {
          row.remove();
          var idx = state.allRows.indexOf(row);
          if (idx !== -1) state.allRows.splice(idx, 1);
          if (state.filteredRows) {
            var fi = state.filteredRows.indexOf(row);
            if (fi !== -1) state.filteredRows.splice(fi, 1);
          }
          var total = getTotalPages(state);
          if (state.currentPage > total) state.currentPage = total;
          showPage(container, state);
          updateActionBar(container, state);
          updateCount(container, state);
        }

        fireCallback(callbacks, tableId, 'rowAction', { action: actionKey, row: row });
      });
    });
  }

  function initRowActions(container, state) {
    var menu = container.querySelector('.table__row-menu');
    if (!menu) return;

    // Bind click handlers on the menu items once
    bindRowMenuItems(container, state);

    var buttons = container.querySelectorAll('.table__row-action');
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var row = btn.closest('.table__row');
        if (!row) return;

        if (isMobile()) {
          showBottomSheet(container, state, row);
        } else {
          showRowMenu(container, state, row, btn);
        }
      });
    });
  }

  /* ==========================================
     Checkbox & Action Bar
     ========================================== */

  function updateHeaderCheckbox(container, state) {
    var headerCb = container.querySelector('.table__thead .table__checkbox-input');
    if (!headerCb) return;
    var box = headerCb.parentElement.querySelector('.table__checkbox-box');
    if (!box) return;

    var pageRows = getPageRows(state);
    var checkedCount = 0;
    pageRows.forEach(function (row) {
      var cb = row.querySelector('.table__checkbox-input');
      if (cb && cb.checked) checkedCount++;
    });

    box.classList.remove('table__checkbox-box--indeterminate');
    if (checkedCount === 0) {
      headerCb.checked = false;
    } else if (checkedCount === pageRows.length) {
      headerCb.checked = true;
    } else {
      headerCb.checked = false;
      box.classList.add('table__checkbox-box--indeterminate');
    }
  }

  function updateActionBar(container, state) {
    var selected = [];
    state.allRows.forEach(function (row) {
      var cb = row.querySelector('.table__checkbox-input');
      if (cb && cb.checked) selected.push(row);
    });
    state.selectedRows = selected;

    // Update bulk button disabled state (mobile)
    var bulkBtn = container.querySelector('.table__select-all-bulk');
    if (bulkBtn) {
      bulkBtn.disabled = selected.length === 0;
    }

    var actionBar = container.querySelector('.table__action-bar');
    if (!actionBar) return;

    if (selected.length > 0) {
      // Update count text (always, even if dismissed)
      var countEl = actionBar.querySelector('.table__action-count-text');
      if (countEl) countEl.textContent = toPersianNum(selected.length) + ' \u0631\u062F\u06CC\u0641 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647';

      if (!isMobile()) {
        // Desktop: نمایش خودکار action bar
        actionBar.classList.add('table__action-bar--visible');
      }
      // Mobile: action bar فقط با کلیک دکمه فعالیت گروهی نمایش داده می‌شود
    } else {
      actionBar.classList.remove('table__action-bar--visible');
      state.actionBarDismissed = false;
      if (isMobile()) hideActionBarOverlay();
    }
  }

  /* ==========================================
     Pagination
     ========================================== */

  function getPageRows(state) {
    var rows = getVisibleRows(state);
    var start = (state.currentPage - 1) * state.pageSize;
    return rows.slice(start, start + state.pageSize);
  }

  function getTotalPages(state) {
    if (state.mode === 'server') {
      return Math.max(1, Math.ceil(state.totalRows / state.pageSize));
    }
    return Math.max(1, Math.ceil(getVisibleRows(state).length / state.pageSize));
  }

  function showPage(container, state) {
    var allRows = state.allRows;
    var visibleRows = getVisibleRows(state);
    var start = (state.currentPage - 1) * state.pageSize;
    var end = start + state.pageSize;

    allRows.forEach(function (r) { r.style.display = 'none'; });
    visibleRows.forEach(function (r, i) {
      if (i >= start && i < end) r.style.display = '';
    });

    renderPagination(container, state);
    updateHeaderCheckbox(container, state);
    updateSelectAllCheckbox(container, state);
  }

  function renderPagination(container, state) {
    var wrap = container.querySelector('.table__page-numbers');
    if (!wrap) return;

    var total = getTotalPages(state);
    var cur = state.currentPage;
    var tableId = container.getAttribute('data-table');
    var pages = [];

    pages.push({ t:'nav', l:'\u00AB', p:1, d:cur===1 });
    pages.push({ t:'nav', l:'\u2039', p:cur-1, d:cur===1 });

    if (total <= 7) {
      for (var i=1; i<=total; i++) pages.push({ t:'p', l:toPersianNum(i), p:i, a:i===cur });
    } else {
      pages.push({ t:'p', l:toPersianNum(1), p:1, a:cur===1 });
      if (cur > 3) pages.push({ t:'e' });
      for (var j=Math.max(2,cur-1); j<=Math.min(total-1,cur+1); j++)
        pages.push({ t:'p', l:toPersianNum(j), p:j, a:j===cur });
      if (cur < total-2) pages.push({ t:'e' });
      pages.push({ t:'p', l:toPersianNum(total), p:total, a:cur===total });
    }

    pages.push({ t:'nav', l:'\u203A', p:cur+1, d:cur===total });
    pages.push({ t:'nav', l:'\u00BB', p:total, d:cur===total });

    wrap.innerHTML = '';
    pages.forEach(function (item) {
      if (item.t === 'e') {
        var sp = document.createElement('span');
        sp.className = 'table__page-ellipsis';
        sp.textContent = '...';
        wrap.appendChild(sp);
      } else {
        var btn = document.createElement('button');
        btn.className = 'table__page-btn';
        if (item.t === 'nav') btn.classList.add('table__page-btn--nav');
        btn.textContent = item.l;
        if (item.a) btn.classList.add('table__page-btn--active');
        if (item.d) btn.classList.add('table__page-btn--disabled');
        if (!item.d && !item.a) {
          btn.setAttribute('data-page', item.p);
          btn.addEventListener('click', function () {
            state.currentPage = parseInt(this.getAttribute('data-page'), 10);
            if (state.mode === 'server') {
              showLoading(container);
              renderPagination(container, state);
              fireCallback(callbacks, tableId, 'pageChange', { page: state.currentPage, pageSize: state.pageSize });
            } else {
              showPage(container, state);
              fireCallback(callbacks, tableId, 'pageChange', state.currentPage);
            }
          });
        }
        wrap.appendChild(btn);
      }
    });

    // Update page-size button text
    var psText = container.querySelector('.table__page-size-text');
    if (psText) psText.textContent = toPersianNum(state.pageSize) + ' \u0631\u062F\u06CC\u0641 \u062F\u0631 \u0647\u0631 \u0635\u0641\u062D\u0647';
  }

  /* ==========================================
     Page Size Selector
     ========================================== */

  function showPageSizeBottomSheet(container, state) {
    closeBottomSheet();

    var dropdown = container.querySelector('.table__page-size-dropdown');
    if (!dropdown) return;

    var options = dropdown.querySelectorAll('.table__page-size-option');
    if (options.length === 0) return;

    var tableId = container.getAttribute('data-table');

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'table__bottom-sheet-overlay';

    // Sheet
    var sheet = document.createElement('div');
    sheet.className = 'table__bottom-sheet';

    // Handle
    var handle = document.createElement('div');
    handle.className = 'table__bottom-sheet-handle';
    sheet.appendChild(handle);

    // Title
    var title = document.createElement('div');
    title.className = 'table__bottom-sheet-title';
    title.textContent = '\u062A\u0639\u062F\u0627\u062F \u0631\u062F\u06CC\u0641 \u062F\u0631 \u0647\u0631 \u0635\u0641\u062D\u0647';
    sheet.appendChild(title);

    // Body
    var body = document.createElement('div');
    body.className = 'table__bottom-sheet-body';
    body.style.gap = '16px';

    Array.prototype.forEach.call(options, function (srcOpt) {
      var size = parseInt(srcOpt.getAttribute('data-size'), 10);
      var item = document.createElement('button');
      item.className = 'table__bottom-sheet-item';
      item.type = 'button';
      item.style.justifyContent = 'space-between';

      // Text first (RIGHT in RTL)
      var textSpan = document.createElement('span');
      textSpan.textContent = srcOpt.textContent;
      item.appendChild(textSpan);

      // Check icon second (LEFT in RTL) — only for selected
      if (size === state.pageSize) {
        item.classList.add('table__bottom-sheet-item--active');
        var check = document.createElement('span');
        check.className = 'table__bottom-sheet-check';
        check.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="currentColor"/><path d="M7 12.5L10.5 16L17 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        item.appendChild(check);
      }

      item.addEventListener('click', function () {
        state.pageSize = size;
        state.currentPage = 1;

        // Update active class in dropdown
        Array.prototype.forEach.call(options, function (o) {
          o.classList.remove('table__page-size-option--active');
        });
        srcOpt.classList.add('table__page-size-option--active');

        closeBottomSheet();
        if (state.mode === 'server') {
          showLoading(container);
          renderPagination(container, state);
          fireCallback(callbacks, tableId, 'pageChange', { page: 1, pageSize: size });
        } else {
          showPage(container, state);
          fireCallback(callbacks, tableId, 'pageChange', state.currentPage);
        }
      });

      body.appendChild(item);
    });

    sheet.appendChild(body);

    overlay.addEventListener('click', function () {
      closeBottomSheet();
    });

    document.body.appendChild(overlay);
    document.body.appendChild(sheet);

    // Trigger animation
    overlay.offsetHeight;
    overlay.classList.add('table__bottom-sheet-overlay--open');
    requestAnimationFrame(function () {
      sheet.classList.add('table__bottom-sheet--open');
    });

    activeBottomSheet = { sheet: sheet, overlay: overlay };
  }

  function showActionBottomSheet(container, state) {
    closeBottomSheet();

    var actionBar = container.querySelector('.table__action-bar');
    if (!actionBar) return;

    var buttons = actionBar.querySelectorAll('.table__action-btn');
    if (buttons.length === 0) return;

    var tableId = container.getAttribute('data-table');

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'table__bottom-sheet-overlay';

    // Sheet
    var sheet = document.createElement('div');
    sheet.className = 'table__bottom-sheet';

    // Handle
    var handle = document.createElement('div');
    handle.className = 'table__bottom-sheet-handle';
    sheet.appendChild(handle);

    // Header (title + subtitle)
    var header = document.createElement('div');
    header.className = 'table__bottom-sheet-header';

    var title = document.createElement('div');
    title.className = 'table__bottom-sheet-title';
    title.textContent = '\u0641\u0639\u0627\u0644\u06CC\u062A\u200C\u0647\u0627\u06CC \u06AF\u0631\u0648\u0647\u06CC';
    header.appendChild(title);

    var subtitle = document.createElement('div');
    subtitle.className = 'table__bottom-sheet-subtitle';
    subtitle.textContent = toPersianNum(state.selectedRows.length) + ' \u0631\u062F\u06CC\u0641 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647';
    header.appendChild(subtitle);

    sheet.appendChild(header);

    // Body
    var body = document.createElement('div');
    body.className = 'table__bottom-sheet-body';

    var chevronSvg = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    Array.prototype.forEach.call(buttons, function (srcBtn) {
      var item = document.createElement('button');
      item.className = 'table__bottom-sheet-item';
      item.type = 'button';
      item.style.justifyContent = 'space-between';

      // Icon + text group (RIGHT in RTL)
      var group = document.createElement('span');
      group.style.display = 'flex';
      group.style.alignItems = 'center';
      group.style.gap = '8px';

      var iconEl = srcBtn.querySelector('.table__action-btn-icon');
      if (iconEl) {
        var iconClone = document.createElement('span');
        iconClone.className = 'table__bottom-sheet-item-icon';
        iconClone.innerHTML = iconEl.innerHTML;
        group.appendChild(iconClone);
      }

      var textSpans = srcBtn.querySelectorAll('span:not(.table__action-btn-icon)');
      if (textSpans.length > 0) {
        var textSpan = document.createElement('span');
        textSpan.textContent = textSpans[textSpans.length - 1].textContent;
        group.appendChild(textSpan);
      }

      item.appendChild(group);

      // Chevron (LEFT in RTL)
      var chevron = document.createElement('span');
      chevron.className = 'table__bottom-sheet-item-chevron';
      chevron.innerHTML = chevronSvg;
      item.appendChild(chevron);

      item.addEventListener('click', function () {
        closeBottomSheet();
        srcBtn.click();
      });

      body.appendChild(item);
    });

    sheet.appendChild(body);

    overlay.addEventListener('click', function () {
      closeBottomSheet();
    });

    document.body.appendChild(overlay);
    document.body.appendChild(sheet);

    // Trigger animation
    overlay.offsetHeight;
    overlay.classList.add('table__bottom-sheet-overlay--open');
    requestAnimationFrame(function () {
      sheet.classList.add('table__bottom-sheet--open');
    });

    activeBottomSheet = { sheet: sheet, overlay: overlay };
  }

  function initPageSize(container, state) {
    var pageSizeBtn = container.querySelector('.table__page-size-btn');
    var dropdown = container.querySelector('.table__page-size-dropdown');
    if (!pageSizeBtn || !dropdown) return;
    var tableId = container.getAttribute('data-table');

    pageSizeBtn.addEventListener('click', function (e) {
      e.stopPropagation();

      // Mobile: open bottom sheet
      if (window.innerWidth < 768) {
        showPageSizeBottomSheet(container, state);
        return;
      }

      // Desktop: open dropdown
      var isOpen = dropdown.classList.contains('table__page-size-dropdown--open');
      closeAllMenus();
      if (!isOpen) dropdown.classList.add('table__page-size-dropdown--open');
    });

    var options = dropdown.querySelectorAll('.table__page-size-option');
    Array.prototype.forEach.call(options, function (opt) {
      opt.addEventListener('click', function () {
        var size = parseInt(this.getAttribute('data-size'), 10);
        state.pageSize = size;
        state.currentPage = 1;

        // Update active class
        Array.prototype.forEach.call(options, function (o) {
          o.classList.remove('table__page-size-option--active');
        });
        this.classList.add('table__page-size-option--active');

        dropdown.classList.remove('table__page-size-dropdown--open');
        if (state.mode === 'server') {
          showLoading(container);
          renderPagination(container, state);
          fireCallback(callbacks, tableId, 'pageChange', { page: 1, pageSize: size });
        } else {
          showPage(container, state);
        }
      });
    });
  }

  /* ==========================================
     Search
     ========================================== */

  function filterRows(container, state, query) {
    query = query.trim().toLowerCase();
    var noResults = container.querySelector('.table__no-results');

    if (!query) {
      state.filteredRows = null;
      if (noResults) noResults.classList.remove('table__no-results--visible');
    } else {
      state.filteredRows = state.allRows.filter(function (row) {
        return row.textContent.toLowerCase().indexOf(query) !== -1;
      });
      // Show/hide no-results message
      if (noResults) {
        if (state.filteredRows.length === 0) {
          noResults.classList.add('table__no-results--visible');
        } else {
          noResults.classList.remove('table__no-results--visible');
        }
      }
    }
    state.currentPage = 1;
    showPage(container, state);
    updateCount(container, state);
  }

  function initSearchUI(container, state) {
    var searchBox = container.querySelector('.table__search');
    var searchInput = container.querySelector('.table__search-input');
    var clearBtn = container.querySelector('.table__search-clear');
    if (!searchBox || !searchInput) return;

    // Focus/blur → green bottom border
    searchInput.addEventListener('focus', function () {
      searchBox.classList.add('table__search--focused');
      // Mobile: also add to inner wrapper
      var inner = searchBox.querySelector('.table__search-inner');
      if (inner) inner.classList.add('table__search-inner--focused');
    });

    searchInput.addEventListener('blur', function () {
      searchBox.classList.remove('table__search--focused');
      var inner = searchBox.querySelector('.table__search-inner');
      if (inner) inner.classList.remove('table__search-inner--focused');
    });

    // Clear button visibility on input
    if (clearBtn) {
      searchInput.addEventListener('input', function () {
        if (this.value.length > 0) {
          clearBtn.classList.add('table__search-clear--visible');
        } else {
          clearBtn.classList.remove('table__search-clear--visible');
        }
      });

      clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        clearBtn.classList.remove('table__search-clear--visible');
        if (state.mode === 'server') {
          var tableId = container.getAttribute('data-table');
          showLoading(container);
          fireCallback(callbacks, tableId, 'search', { query: '' });
        } else {
          filterRows(container, state, '');
        }
        searchInput.focus();
      });
    }
  }

  /* ==========================================
     Bulk Delete
     ========================================== */

  function deleteSelectedRows(container, state) {
    var toDelete = [];
    state.allRows.forEach(function (row) {
      var cb = row.querySelector('.table__checkbox-input');
      if (cb && cb.checked) toDelete.push(row);
    });
    toDelete.forEach(function (row) {
      row.remove();
      var idx = state.allRows.indexOf(row);
      if (idx !== -1) state.allRows.splice(idx, 1);
      if (state.filteredRows) {
        var fi = state.filteredRows.indexOf(row);
        if (fi !== -1) state.filteredRows.splice(fi, 1);
      }
    });
    var total = getTotalPages(state);
    if (state.currentPage > total) state.currentPage = total;
    showPage(container, state);
    updateActionBar(container, state);
    updateCount(container, state);
  }

  function updateCount(container, state) {
    var countEl = container.querySelector('.table__count');
    if (countEl) {
      countEl.textContent = '\u062A\u0639\u062F\u0627\u062F: ' + toPersianNum(getVisibleRows(state).length) + ' \u0646\u0641\u0631';
    }
  }

  /* ==========================================
     Edit Modal
     ========================================== */

  function openEditModal(container, state, row) {
    var cells = row.querySelectorAll('.table__cell');
    var editableCells = [];
    var headers = container.querySelectorAll('.table__thead .table__cell');
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      if (cell.classList.contains('table__cell--checkbox') || cell.classList.contains('table__cell--action')) continue;
      if (cell.querySelector('.table__progress') || cell.querySelector('.table__tag')) continue;
      var headerText = '';
      if (headers[i]) {
        var ht = headers[i].querySelector('.table__cell-text');
        headerText = ht ? ht.textContent : headers[i].textContent;
      }
      editableCells.push({ cell: cell, header: headerText.trim(), value: cell.textContent.trim() });
    }

    if (editableCells.length === 0) return;

    var overlay = document.createElement('div');
    overlay.className = 'table__edit-overlay table__edit-overlay--open';

    var modal = document.createElement('div');
    modal.className = 'table__edit-modal';

    var title = document.createElement('h3');
    title.textContent = '\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0631\u062F\u06CC\u0641';
    modal.appendChild(title);

    var inputs = [];
    editableCells.forEach(function (ec) {
      var field = document.createElement('div');
      field.className = 'table__edit-field';
      var label = document.createElement('label');
      label.textContent = ec.header || '\u0641\u06CC\u0644\u062F';
      var input = document.createElement('input');
      input.type = 'text';
      input.value = ec.value;
      field.appendChild(label);
      field.appendChild(input);
      modal.appendChild(field);
      inputs.push({ input: input, cell: ec.cell });
    });

    var actions = document.createElement('div');
    actions.className = 'table__edit-actions';

    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'table__edit-cancel';
    cancelBtn.textContent = '\u0627\u0646\u0635\u0631\u0627\u0641';
    cancelBtn.addEventListener('click', function () { overlay.remove(); });

    var saveBtn = document.createElement('button');
    saveBtn.className = 'table__edit-save';
    saveBtn.textContent = '\u0630\u062E\u06CC\u0631\u0647';
    saveBtn.addEventListener('click', function () {
      inputs.forEach(function (item) {
        item.cell.textContent = item.input.value;
      });
      overlay.remove();
    });

    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
    modal.appendChild(actions);
    overlay.appendChild(modal);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);

    if (inputs.length) inputs[0].input.focus();
  }

  /* ==========================================
     Bulk Action Bar Buttons
     ========================================== */

  function initActionBarButtons(container, state) {
    var actionBar = container.querySelector('.table__action-bar');
    if (!actionBar) return;

    var deleteBtn = actionBar.querySelector('[data-bulk-action="delete"]');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function () {
        if (state.mode === 'server') {
          var tableId = container.getAttribute('data-table');
          fireCallback(callbacks, tableId, 'bulkAction', { action: 'delete', rows: state.selectedRows.slice() });
        } else {
          deleteSelectedRows(container, state);
        }
      });
    }

    var editBtn = actionBar.querySelector('[data-bulk-action="edit"]');
    if (editBtn) {
      editBtn.addEventListener('click', function () {
        var selectedRow = null;
        state.allRows.forEach(function (row) {
          if (!selectedRow) {
            var cb = row.querySelector('.table__checkbox-input');
            if (cb && cb.checked) selectedRow = row;
          }
        });
        if (selectedRow) openEditModal(container, state, selectedRow);
      });
    }

    // Mobile: close bottom sheet on any action button click
    var allBtns = actionBar.querySelectorAll('.table__action-btn');
    Array.prototype.forEach.call(allBtns, function (btn) {
      btn.addEventListener('click', function () {
        if (isMobile()) {
          actionBar.classList.remove('table__action-bar--visible');
          hideActionBarOverlay();
          state.actionBarDismissed = true;
        }
      });
    });
  }

  /* ==========================================
     Server-Side Loading Helpers
     ========================================== */

  function showLoading(container) {
    container.classList.add('table--loading');
    var overlay = container.querySelector('.table__search-processing-overlay');
    if (overlay) overlay.classList.add('table__search-processing-overlay--visible');
  }

  function hideLoading(container) {
    container.classList.remove('table--loading');
    var overlay = container.querySelector('.table__search-processing-overlay');
    if (overlay) overlay.classList.remove('table__search-processing-overlay--visible');
  }

  /* ==========================================
     Callbacks
     ========================================== */

  function fireCallback(cbs, tableId, type, data) {
    var key = tableId + ':' + type;
    if (cbs[key]) cbs[key].forEach(function (fn) { try { fn(data); } catch(e) {} });
  }

  function registerCallback(cbs, tableId, type, fn) {
    var key = tableId + ':' + type;
    if (!cbs[key]) cbs[key] = [];
    cbs[key].push(fn);
  }

  /* ==========================================
     Mobile Header Restructure
     ========================================== */

  function setupMobileHeader(container) {
    if (!isMobile()) return;

    var filterBtn = container.querySelector('.table__btn--filter');
    var searchBox = container.querySelector('.table__search');
    if (!searchBox) return;

    // Already set up?
    if (searchBox.querySelector('.table__search-inner')) return;

    // Store original parent of filter btn
    if (filterBtn) {
      filterBtn._originalParent = filterBtn.parentElement;
      filterBtn._originalNext = filterBtn.nextElementSibling;
    }

    // Wrap search-icon + divider + search-input + clear in .table__search-inner
    var icon = searchBox.querySelector('.table__search-icon');
    var divider = searchBox.querySelector('.table__search-divider');
    var input = searchBox.querySelector('.table__search-input');
    var clearBtn = searchBox.querySelector('.table__search-clear');
    var inner = document.createElement('div');
    inner.className = 'table__search-inner';
    if (icon) inner.appendChild(icon);
    if (divider) inner.appendChild(divider);
    if (input) inner.appendChild(input);
    if (clearBtn) inner.appendChild(clearBtn);
    searchBox.appendChild(inner);

    // Move filter button into search row (as first child, sibling of inner)
    if (filterBtn) {
      searchBox.insertBefore(filterBtn, inner);
    }
  }

  function restoreDesktopHeader(container) {
    var searchBox = container.querySelector('.table__search');
    if (!searchBox) return;

    // Unwrap search-inner
    var inner = searchBox.querySelector('.table__search-inner');
    if (inner) {
      while (inner.firstChild) {
        searchBox.insertBefore(inner.firstChild, inner);
      }
      inner.remove();
    }

    // Restore filter button to original position
    var filterBtn = container.querySelector('.table__btn--filter');
    if (filterBtn && filterBtn._originalParent) {
      if (filterBtn._originalParent === filterBtn.parentElement) return;
      if (filterBtn._originalNext) {
        filterBtn._originalParent.insertBefore(filterBtn, filterBtn._originalNext);
      } else {
        filterBtn._originalParent.appendChild(filterBtn);
      }
    }
  }

  /* ==========================================
     Mobile Card Header (code value injection)
     ========================================== */

  function setupMobileCards(container, state) {
    state.allRows.forEach(function (row) {
      // Find the code cell and checkbox cell
      var codeCell = row.querySelector('.table__cell--code');
      var checkboxCell = row.querySelector('.table__cell--checkbox');
      if (!codeCell || !checkboxCell) return;

      // Check if code info already injected
      if (checkboxCell.querySelector('.table__card-code')) return;

      var codeLabel = codeCell.getAttribute('data-label') || '';
      var codeValue = codeCell.textContent.trim();

      var codeSpan = document.createElement('span');
      codeSpan.className = 'table__card-code';
      codeSpan.innerHTML =
        '<span class="table__card-code-label">' + codeLabel + '</span>' +
        '<span class="table__card-code-value">' + codeValue + '</span>';

      // Insert code span after checkbox wrapper
      var wrapper = checkboxCell.querySelector('.table__checkbox-wrapper');
      if (wrapper && wrapper.nextSibling) {
        checkboxCell.insertBefore(codeSpan, wrapper.nextSibling);
      } else {
        checkboxCell.appendChild(codeSpan);
      }
    });
  }

  /* ==========================================
     Mobile Select All Row
     ========================================== */

  function initSelectAllRow(container, state) {
    var selectAllCb = container.querySelector('.table__select-all-checkbox');
    if (!selectAllCb) return;

    selectAllCb.addEventListener('change', function () {
      var checked = this.checked;
      var box = this.parentElement.querySelector('.table__checkbox-box');
      if (box) box.classList.remove('table__checkbox-box--indeterminate');

      state.allRows.forEach(function (row) {
        var cb = row.querySelector('.table__checkbox-input');
        if (cb) {
          cb.checked = checked;
          row.classList.toggle('table__row--selected', checked);
        }
      });

      updateHeaderCheckbox(container, state);
      updateActionBar(container, state);
      updateSelectAllCheckbox(container, state);
    });

    // Bulk activity button → re-show action bar bottom sheet (mobile)
    var bulkBtn = container.querySelector('.table__select-all-bulk');
    if (bulkBtn) {
      bulkBtn.addEventListener('click', function () {
        if (state.selectedRows && state.selectedRows.length > 0) {
          state.actionBarDismissed = false;
          var actionBar = container.querySelector('.table__action-bar');
          if (actionBar) actionBar.classList.add('table__action-bar--visible');
          if (isMobile()) showActionBarOverlay(container, state);
        }
      });
    }
  }

  function updateSelectAllCheckbox(container, state) {
    var selectAllCb = container.querySelector('.table__select-all-checkbox');
    if (!selectAllCb) return;
    var box = selectAllCb.parentElement.querySelector('.table__checkbox-box');
    if (!box) return;

    var totalCount = state.allRows.length;
    var checkedCount = 0;
    state.allRows.forEach(function (row) {
      var cb = row.querySelector('.table__checkbox-input');
      if (cb && cb.checked) checkedCount++;
    });

    box.classList.remove('table__checkbox-box--indeterminate');
    if (checkedCount === 0) {
      selectAllCb.checked = false;
    } else if (checkedCount === totalCount) {
      selectAllCb.checked = true;
    } else {
      selectAllCb.checked = false;
      box.classList.add('table__checkbox-box--indeterminate');
    }
  }

  /* ==========================================
     Init
     ========================================== */

  function initTable(container) {
    var tableId = container.getAttribute('data-table');
    if (!tableId || tables[tableId]) return;

    var allRows = getAllBodyRows(container);
    var pageSize = parseInt(container.getAttribute('data-page-size'), 10) || 10;
    var mode = container.getAttribute('data-mode') === 'server' ? 'server' : 'client';

    var state = {
      allRows: allRows,
      filteredRows: null,
      selectedRows: [],
      currentPage: 1,
      pageSize: pageSize,
      actionBarDismissed: false,
      mode: mode,
      totalRows: 0
    };

    tables[tableId] = { container: container, state: state };

    // Row checkboxes
    allRows.forEach(function (row) {
      var cb = row.querySelector('.table__checkbox-input');
      if (!cb) return;
      cb.addEventListener('change', function () {
        row.classList.toggle('table__row--selected', this.checked);
        updateHeaderCheckbox(container, state);
        updateActionBar(container, state);
        updateSelectAllCheckbox(container, state);
        fireCallback(callbacks, tableId, 'select', { row: row, checked: this.checked, selected: getSelectedIndices(state) });
      });
    });

    // Header checkbox
    var headerCb = container.querySelector('.table__thead .table__checkbox-input');
    if (headerCb) {
      headerCb.addEventListener('change', function () {
        var checked = this.checked;
        var box = this.parentElement.querySelector('.table__checkbox-box');
        if (box) box.classList.remove('table__checkbox-box--indeterminate');
        getPageRows(state).forEach(function (row) {
          var cb = row.querySelector('.table__checkbox-input');
          if (cb) { cb.checked = checked; row.classList.toggle('table__row--selected', checked); }
        });
        updateActionBar(container, state);
        fireCallback(callbacks, tableId, 'select', { row: null, checked: checked, selected: getSelectedIndices(state) });
      });
    }

    // Search UI (focus/blur, clear button)
    initSearchUI(container, state);

    // Search filtering (debounced)
    var searchInput = container.querySelector('.table__search-input');
    if (searchInput) {
      var timer;
      searchInput.addEventListener('input', function () {
        var v = this.value;
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (state.mode === 'server') {
            showLoading(container);
            fireCallback(callbacks, tableId, 'search', { query: v });
          } else {
            filterRows(container, state, v);
          }
        }, 250);
      });
    }

    // Page size selector
    initPageSize(container, state);

    // Bulk action bar buttons
    initActionBarButtons(container, state);

    // Row action menu (desktop dropdown + mobile bottom sheet)
    initRowActions(container, state);

    // Mobile select-all row
    initSelectAllRow(container, state);

    // Mobile card headers
    setupMobileCards(container, state);

    // Mobile header restructure (filter into search row)
    setupMobileHeader(container);

    // Handle resize: restructure header on breakpoint change
    window.addEventListener('resize', function () {
      if (isMobile()) {
        setupMobileHeader(container);
        // Show overlay if action bar is visible
        var actionBar = container.querySelector('.table__action-bar');
        if (actionBar && actionBar.classList.contains('table__action-bar--visible') && !state.actionBarDismissed) {
          showActionBarOverlay(container, state);
        }
      } else {
        restoreDesktopHeader(container);
        // Remove mobile overlay on desktop
        hideActionBarOverlay();
        state.actionBarDismissed = false;
      }
    });

    // Initial render
    if (state.mode === 'server') {
      showLoading(container);
      renderPagination(container, state);
    } else {
      showPage(container, state);
    }
  }

  function getSelectedIndices(state) {
    var idx = [];
    state.allRows.forEach(function (r, i) {
      var cb = r.querySelector('.table__checkbox-input');
      if (cb && cb.checked) idx.push(i);
    });
    return idx;
  }

  function initAll() {
    var els = document.querySelectorAll('[data-table]');
    Array.prototype.forEach.call(els, function (el) { initTable(el); });
  }

  // Close menus on outside click
  document.addEventListener('click', function () { closeAllMenus(); });

  // Close menus on scroll (desktop dropdown only, not bottom sheet)
  window.addEventListener('scroll', function () { closeAllMenus(); }, true);

  document.addEventListener('DOMContentLoaded', initAll);

  /* ==========================================
     Server-Side API: setRows / setTotal
     ========================================== */

  function setRows(tableId, rows) {
    var t = tables[tableId];
    if (!t) return;
    var container = t.container;
    var state = t.state;

    var tbody = container.querySelector('.table__tbody');
    if (!tbody) return;

    // Clear existing rows
    tbody.innerHTML = '';

    var newRows = [];
    if (typeof rows === 'string') {
      // HTML string — parse and extract TR elements
      var tmp = document.createElement('tbody');
      tmp.innerHTML = rows;
      newRows = Array.prototype.slice.call(tmp.querySelectorAll('.table__row'));
      newRows.forEach(function (row) { tbody.appendChild(row); });
    } else if (rows && typeof rows.length === 'number') {
      // Array / NodeList of TR elements
      Array.prototype.forEach.call(rows, function (row) {
        tbody.appendChild(row);
        newRows.push(row);
      });
    }

    // Update state
    state.allRows = newRows;
    state.filteredRows = null;
    state.selectedRows = [];

    // Re-attach row checkbox listeners
    newRows.forEach(function (row) {
      var cb = row.querySelector('.table__checkbox-input');
      if (!cb) return;
      cb.addEventListener('change', function () {
        row.classList.toggle('table__row--selected', this.checked);
        updateHeaderCheckbox(container, state);
        updateActionBar(container, state);
        updateSelectAllCheckbox(container, state);
        fireCallback(callbacks, tableId, 'select', { row: row, checked: this.checked, selected: getSelectedIndices(state) });
      });
    });

    // Re-attach row action buttons
    initRowActions(container, state);

    // Setup mobile cards if needed
    if (isMobile()) setupMobileCards(container, state);

    // Remove loading state
    hideLoading(container);

    // Sync header checkbox and action bar
    updateHeaderCheckbox(container, state);
    updateActionBar(container, state);

    // Show/hide no-results message
    var noResults = container.querySelector('.table__no-results');
    if (noResults) {
      if (newRows.length === 0) {
        noResults.classList.add('table__no-results--visible');
      } else {
        noResults.classList.remove('table__no-results--visible');
      }
    }
  }

  function setTotal(tableId, total) {
    var t = tables[tableId];
    if (!t) return;
    t.state.totalRows = parseInt(total, 10) || 0;
    renderPagination(t.container, t.state);
  }

  /* ==========================================
     Public API
     ========================================== */

  window.Table = {
    init: function (el) {
      if (typeof el === 'string') {
        var container = document.querySelector('[data-table="' + el + '"]');
        if (container) initTable(container);
      } else if (el && el.nodeType) {
        initTable(el);
      }
    },
    initAll: initAll,
    selectAll: function (tableId) {
      var t = tables[tableId];
      if (!t) return;
      var container = t.container;
      var state = t.state;
      getPageRows(state).forEach(function (row) {
        var cb = row.querySelector('.table__checkbox-input');
        if (cb) { cb.checked = true; row.classList.add('table__row--selected'); }
      });
      updateHeaderCheckbox(container, state);
      updateActionBar(container, state);
    },
    deselectAll: function (tableId) {
      var t = tables[tableId];
      if (!t) return;
      var container = t.container;
      var state = t.state;
      state.allRows.forEach(function (row) {
        var cb = row.querySelector('.table__checkbox-input');
        if (cb) { cb.checked = false; row.classList.remove('table__row--selected'); }
      });
      updateHeaderCheckbox(container, state);
      updateActionBar(container, state);
    },
    goToPage: function (tableId, page) {
      var t = tables[tableId];
      if (!t) return;
      t.state.currentPage = page;
      if (t.state.mode === 'server') {
        t.showLoading(container);
        renderPagination(t.container, t.state);
        fireCallback(callbacks, tableId, 'pageChange', { page: page, pageSize: t.state.pageSize });
      } else {
        showPage(t.container, t.state);
      }
    },
    getSelected: function (tableId) {
      var t = tables[tableId];
      if (!t) return [];
      return t.state.selectedRows.slice();
    },
    onSelect: function (tableId, fn) { registerCallback(callbacks, tableId, 'select', fn); },
    onPageChange: function (tableId, fn) { registerCallback(callbacks, tableId, 'pageChange', fn); },
    onSearch: function (tableId, fn) { registerCallback(callbacks, tableId, 'search', fn); },
    onBulkAction: function (tableId, fn) { registerCallback(callbacks, tableId, 'bulkAction', fn); },
    onRowAction: function (tableId, fn) { registerCallback(callbacks, tableId, 'rowAction', fn); },
    setRows: setRows,
    setTotal: setTotal
  };

})();
