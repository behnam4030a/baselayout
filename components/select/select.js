/**
 * Select Component Scripts
 * کامپوننت انتخاب (Select) - اسکریپت‌ها
 *
 * این فایل شامل منطق JavaScript کامپوننت Select است:
 * - Dropdown toggle: باز/بسته کردن
 * - Item selection: انتخاب تکی و چندگانه
 * - Tag management: ایجاد و حذف تگ‌ها
 * - Search: فیلتر آیتم‌ها (Basic)
 * - Keyboard navigation: Arrow, Enter, Escape, Tab
 *
 * نحوه استفاده:
 * <link rel="stylesheet" href="select.css">
 * <script src="select.js" defer></script>
 */

(function () {
  'use strict';

  /* --- آیکن‌ها --- */
  var CHEVRON_ICON = '<svg class="select__chevron" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var CLOSE_ICON = '<svg viewBox="0 0 12 12" fill="none"><path d="M3 3L9 9M9 3L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  var CLOSE_SQUARE_ICON = '<svg viewBox="0 0 12 12" fill="none"><rect x="1.5" y="1.5" width="9" height="9" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M4 4L8 8M8 4L4 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';

  var SEARCH_ICON = '<svg viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.3"/><path d="M10.5 10.5L13.5 13.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';

  /**
   * ساخت و مدیریت یک نمونه Select
   * @param {HTMLElement} el — المان root (.select)
   */
  function createInstance(el) {
    if (el._selectInstance) return el._selectInstance;

    var trigger = el.querySelector('.select__trigger');
    var dropdown = el.querySelector('.select__dropdown');
    var list = el.querySelector('.select__list');
    var searchInput = el.querySelector('.select__search-input');
    var items = list ? Array.prototype.slice.call(list.querySelectorAll('.select__item')) : [];

    var type = el.dataset.type || 'basic';   // basic | primary | multiple | tagify | icon

    /* آیکن‌دار بودن: تشخیص خودکار از DOM یا data-type="icon" */
    var hasIcons = !!(list && list.querySelector('.select__item-icon')) || type === 'icon';
    if (type === 'icon') type = 'basic';   /* icon alias → basic (بدون search) */

    var isMulti = type === 'multiple' || type === 'tagify';
    var isFreeInput = (type === 'tagify') && el.dataset.freeInput === 'true';
    var placeholder = el.dataset.placeholder || 'انتخاب کنید';
    var highlightIndex = -1;

    /* --- Hidden input موجود در HTML برای form submission --- */
    var hiddenInput = el.querySelector('input[type="hidden"]');

    /* --- State --- */
    var selectedValues = [];
    var isOpen = false;

    /* --- Callbacks --- */
    var onChange = null;
    var onOpen = null;
    var onClose = null;

    /* ==========================================
       Helpers
       ========================================== */

    function getItemValue(item) {
      return item.dataset.value || item.textContent.trim();
    }

    function getItemLabel(item) {
      return item.textContent.trim();
    }

    function getItemIcon(item) {
      if (!item) return null;
      var iconEl = item.querySelector('.select__item-icon');
      return iconEl ? iconEl.innerHTML : null;
    }

    function findItemByValue(val) {
      for (var i = 0; i < items.length; i++) {
        if (getItemValue(items[i]) === val) return items[i];
      }
      return null;
    }

    /* ==========================================
       Hidden Input (sync مقدار با input مخفی موجود در HTML)
       ========================================== */

    function syncHiddenInput() {
      if (!hiddenInput) return;
      hiddenInput.value = selectedValues.join(',');
    }

    /* ==========================================
       Active Class Helper
       ========================================== */

    function updateActiveClass() {
      if (isOpen || selectedValues.length > 0) {
        el.classList.add('select--active');
      } else {
        el.classList.remove('select--active');
      }
    }

    /* ==========================================
       Render Trigger
       ========================================== */

    function renderTrigger() {
      /* حذف محتوای قبلی (به جز chevron و آیکن ثابت) */
      var chevron = trigger.querySelector('.select__chevron');
      var staticIcon = trigger.querySelector('.select__trigger-icon--static');
      var staticDivider = trigger.querySelector('.select__trigger-divider--static');
      while (trigger.firstChild) trigger.removeChild(trigger.firstChild);

      /* آیکن ثابت — همیشه اول، مستقل از آیتم انتخاب‌شده */
      if (staticIcon) {
        trigger.appendChild(staticIcon);
        if (staticDivider) trigger.appendChild(staticDivider);
      }

      if (type === 'basic') {
        /* Basic: نمایش متن ساده (با پشتیبانی اختیاری از آیکن) */
        if (selectedValues.length > 0) {
          var item = findItemByValue(selectedValues[0]);

          /* آیکن پویا — فقط وقتی آیکن ثابت وجود ندارد */
          if (hasIcons && !staticIcon) {
            var iconHtml = getItemIcon(item);
            if (iconHtml) {
              var triggerIcon = document.createElement('span');
              triggerIcon.className = 'select__trigger-icon';
              triggerIcon.innerHTML = iconHtml;
              trigger.appendChild(triggerIcon);
              var divider = document.createElement('span');
              divider.className = 'select__trigger-divider';
              trigger.appendChild(divider);
            }
          }

          var span = document.createElement('span');
          span.className = 'select__value select__value--selected';
          span.textContent = item ? getItemLabel(item) : selectedValues[0];
          trigger.appendChild(span);

          /* دکمه پاک کردن */
          var clearBtn = document.createElement('button');
          clearBtn.className = 'select__clear';
          clearBtn.type = 'button';
          clearBtn.setAttribute('aria-label', 'پاک کردن');
          clearBtn.innerHTML = CLOSE_ICON;
          clearBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            selectedValues = [];
            syncItemStates();
            syncHiddenInput();
            updateActiveClass();
            renderTrigger();
            if (onChange) onChange(null);
          });
          trigger.appendChild(clearBtn);
        } else {
          var span = document.createElement('span');
          span.className = 'select__value';
          span.textContent = placeholder;
          trigger.appendChild(span);
        }
      } else {
        /* Primary / Multiple / Tagify: نمایش تگ‌ها */
        var tagsDiv = document.createElement('div');
        tagsDiv.className = 'select__tags';

        if (selectedValues.length === 0 && !isFreeInput) {
          var ph = document.createElement('span');
          ph.className = 'select__value';
          ph.textContent = placeholder;
          tagsDiv.appendChild(ph);
        } else {
          for (var i = 0; i < selectedValues.length; i++) {
            tagsDiv.appendChild(createTag(selectedValues[i]));
          }
        }

        if (isFreeInput) {
          var tagInput = document.createElement('input');
          tagInput.type = 'text';
          tagInput.className = 'select__tag-input';
          tagInput.placeholder = selectedValues.length === 0 ? placeholder : '';
          tagInput.addEventListener('keydown', onTagInputKeyDown);
          tagInput.addEventListener('input', function (e) {
            filterItems(e.target.value);
            highlightIndex = -1;
            clearHighlight();
            if (!isOpen) open();
          });
          tagInput.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!isOpen) open();
          });
          tagsDiv.appendChild(tagInput);
        }

        trigger.appendChild(tagsDiv);
      }

      /* اضافه کردن chevron */
      if (chevron) {
        trigger.appendChild(chevron);
      } else {
        var temp = document.createElement('div');
        temp.innerHTML = CHEVRON_ICON;
        trigger.appendChild(temp.firstChild);
      }

      /* aria */
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    /* ==========================================
       Tags
       ========================================== */

    function createTag(value) {
      var item = findItemByValue(value);
      var label = item ? getItemLabel(item) : value;
      var tagClass = (type === 'primary' || type === 'multiple') ? 'select__tag--single' : 'select__tag--multiple';
      var closeIcon = (type === 'tagify') ? CLOSE_SQUARE_ICON : CLOSE_ICON;

      var tag = document.createElement('span');
      tag.className = 'select__tag ' + tagClass;
      tag.dataset.value = value;

      /* آیکن آیتم در تگ — اگر hasIcons فعال باشد */
      if (hasIcons) {
        var iconHtml = getItemIcon(item);
        if (iconHtml) {
          var tagIcon = document.createElement('span');
          tagIcon.className = 'select__tag-icon';
          tagIcon.innerHTML = iconHtml;
          tag.appendChild(tagIcon);
        }
      }

      var textSpan = document.createElement('span');
      textSpan.className = 'select__tag-text';
      textSpan.textContent = label;
      tag.appendChild(textSpan);

      var btn = document.createElement('button');
      btn.className = 'select__tag-close';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'حذف ' + label);
      btn.innerHTML = closeIcon;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        deselectValue(value);
      });
      tag.appendChild(btn);

      return tag;
    }

    /* ==========================================
       Selection
       ========================================== */

    function selectValue(value) {
      if (isMulti) {
        if (selectedValues.indexOf(value) === -1) {
          selectedValues.push(value);
        }
      } else {
        selectedValues = [value];
      }
      syncItemStates();
      syncHiddenInput();
      renderTrigger();
      if (isFreeInput) {
        filterItems('');
        var inp = el.querySelector('.select__tag-input');
        if (inp) inp.focus();
      }
      if (onChange) onChange(isMulti ? selectedValues.slice() : selectedValues[0] || null);
    }

    function deselectValue(value) {
      var idx = selectedValues.indexOf(value);
      if (idx > -1) {
        selectedValues.splice(idx, 1);
        syncItemStates();
        syncHiddenInput();
        updateActiveClass();
        renderTrigger();
        if (isFreeInput) {
          filterItems('');
          var inp = el.querySelector('.select__tag-input');
          if (inp) inp.focus();
        }
        if (onChange) onChange(isMulti ? selectedValues.slice() : selectedValues[0] || null);
      }
    }

    function toggleValue(value) {
      if (selectedValues.indexOf(value) > -1) {
        deselectValue(value);
      } else {
        selectValue(value);
      }
    }

    function syncItemStates() {
      for (var i = 0; i < items.length; i++) {
        if (items[i].classList.contains('select__item--group')) continue;
        var val = getItemValue(items[i]);
        var isSel = selectedValues.indexOf(val) > -1;
        items[i].classList.toggle('select__item--selected', isSel);
        items[i].setAttribute('aria-selected', isSel ? 'true' : 'false');
      }
    }

    /* ==========================================
       Dropdown Open / Close
       ========================================== */

    function open() {
      if (el.classList.contains('select--disabled')) return;
      isOpen = true;
      el.classList.add('select--open', 'select--active');
      trigger.setAttribute('aria-expanded', 'true');
      highlightIndex = -1;
      clearHighlight();

      if (searchInput && type === 'basic') {
        searchInput.value = '';
        filterItems('');
        setTimeout(function () { searchInput.focus(); }, 0);
      }

      if (onOpen) onOpen();
    }

    function close() {
      isOpen = false;
      el.classList.remove('select--open');
      updateActiveClass();
      trigger.setAttribute('aria-expanded', 'false');
      highlightIndex = -1;
      clearHighlight();

      if (searchInput) {
        searchInput.value = '';
        filterItems('');
      }

      if (isFreeInput) {
        var tagInput = el.querySelector('.select__tag-input');
        if (tagInput) tagInput.value = '';
        filterItems('');
      }

      if (onClose) onClose();
    }

    function toggle() {
      if (isOpen) close(); else open();
    }

    /* ==========================================
       Search
       ========================================== */

    function filterItems(query) {
      var q = query.trim().toLowerCase();
      for (var i = 0; i < items.length; i++) {
        if (items[i].classList.contains('select__item--group')) continue;
        var text = getItemLabel(items[i]).toLowerCase();
        var visible = !q || text.indexOf(q) > -1;
        items[i].classList.toggle('select__item--hidden', !visible);
      }
    }

    /* ==========================================
       Keyboard Highlight
       ========================================== */

    function getVisibleItems() {
      var result = [];
      for (var i = 0; i < items.length; i++) {
        if (!items[i].classList.contains('select__item--hidden') &&
            !items[i].classList.contains('select__item--group')) {
          result.push(items[i]);
        }
      }
      return result;
    }

    function clearHighlight() {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('select__item--highlighted');
      }
    }

    function highlightItem(index) {
      var visible = getVisibleItems();
      if (visible.length === 0) return;
      clearHighlight();
      if (index < 0) index = visible.length - 1;
      if (index >= visible.length) index = 0;
      highlightIndex = index;
      visible[index].classList.add('select__item--highlighted');

      /* scroll into view */
      visible[index].scrollIntoView({ block: 'nearest' });

      /* aria-activedescendant */
      if (!visible[index].id) {
        visible[index].id = 'select-item-' + Math.random().toString(36).substr(2, 6);
      }
      trigger.setAttribute('aria-activedescendant', visible[index].id);
    }

    /* ==========================================
       Free Input (Tagify)
       ========================================== */

    function addFreeTag(text) {
      var val = text.trim();
      if (!val) return;
      if (selectedValues.indexOf(val) > -1) return;
      selectValue(val);
    }

    function onTagInputKeyDown(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var visible = getVisibleItems();
        if (isOpen && highlightIndex >= 0 && highlightIndex < visible.length) {
          /* انتخاب آیتم highlighted از dropdown */
          toggleValue(getItemValue(visible[highlightIndex]));
          e.target.value = '';
        } else {
          /* ایجاد تگ آزاد */
          addFreeTag(e.target.value);
          e.target.value = '';
        }
      } else if (e.key === ',') {
        e.preventDefault();
        addFreeTag(e.target.value);
        e.target.value = '';
      } else if (e.key === 'Backspace' && e.target.value === '') {
        if (selectedValues.length > 0) {
          deselectValue(selectedValues[selectedValues.length - 1]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) open();
        highlightItem(highlightIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightItem(highlightIndex - 1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    }

    /* ==========================================
       Event Handlers
       ========================================== */

    function onTriggerClick(e) {
      e.preventDefault();
      if (isFreeInput) {
        var tagInput = el.querySelector('.select__tag-input');
        if (tagInput) tagInput.focus();
        toggle();
        return;
      }
      toggle();
    }

    function onItemClick(e) {
      var item = e.target.closest('.select__item');
      if (!item) return;
      if (item.classList.contains('select__item--group')) return;
      var val = getItemValue(item);

      if (isMulti) {
        toggleValue(val);
      } else {
        selectValue(val);
        close();
      }
    }

    function onSearchInput(e) {
      filterItems(e.target.value);
      highlightIndex = -1;
      clearHighlight();
    }

    function onKeyDown(e) {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
        return;
      }

      var visible = getVisibleItems();

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          highlightItem(highlightIndex + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          highlightItem(highlightIndex - 1);
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightIndex >= 0 && highlightIndex < visible.length) {
            var val = getItemValue(visible[highlightIndex]);
            if (isMulti) {
              toggleValue(val);
            } else {
              selectValue(val);
              close();
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          close();
          trigger.focus();
          break;
        case 'Tab':
          close();
          break;
      }
    }

    function onOutsideClick(e) {
      if (!el.contains(e.target)) {
        close();
      }
    }

    /* ==========================================
       Init / Destroy
       ========================================== */

    function init() {
      /* ست کردن ARIA attributes */
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      if (!trigger.getAttribute('tabindex')) {
        trigger.setAttribute('tabindex', '0');
      }

      if (list) {
        list.setAttribute('role', 'listbox');
        if (isMulti) {
          list.setAttribute('aria-multiselectable', 'true');
        }
      }

      for (var i = 0; i < items.length; i++) {
        if (items[i].classList.contains('select__item--group')) {
          items[i].setAttribute('role', 'presentation');
          continue;
        }
        items[i].setAttribute('role', 'option');
        items[i].setAttribute('aria-selected', 'false');
      }

      /* پیدا کردن آیتم‌های از قبل انتخاب شده */
      for (var j = 0; j < items.length; j++) {
        if (items[j].classList.contains('select__item--group')) continue;
        if (items[j].classList.contains('select__item--selected')) {
          selectedValues.push(getItemValue(items[j]));
          items[j].setAttribute('aria-selected', 'true');
        }
      }

      /* sync مقدار اولیه با input مخفی */
      syncHiddenInput();
      updateActiveClass();

      renderTrigger();
      if (hasIcons) el.classList.add('select--has-icons');

      /* Event listeners */
      trigger.addEventListener('click', onTriggerClick);
      if (list) list.addEventListener('click', onItemClick);
      if (searchInput) searchInput.addEventListener('input', onSearchInput);
      el.addEventListener('keydown', onKeyDown);
      document.addEventListener('click', onOutsideClick);
    }

    function destroy() {
      trigger.removeEventListener('click', onTriggerClick);
      if (list) list.removeEventListener('click', onItemClick);
      if (searchInput) searchInput.removeEventListener('input', onSearchInput);
      el.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onOutsideClick);
      if (hiddenInput) hiddenInput.value = '';
      delete el._selectInstance;
    }

    init();

    /* --- Public instance API --- */
    var instance = {
      open: open,
      close: close,
      getValue: function () {
        return isMulti ? selectedValues.slice() : (selectedValues[0] || null);
      },
      setValue: function (val) {
        selectedValues = Array.isArray(val) ? val.slice() : (val ? [val] : []);
        syncItemStates();
        syncHiddenInput();
        updateActiveClass();
        renderTrigger();
      },
      onChange: function (fn) { onChange = fn; },
      onOpen: function (fn) { onOpen = fn; },
      onClose: function (fn) { onClose = fn; },
      destroy: destroy
    };

    el._selectInstance = instance;
    return instance;
  }

  /* ==========================================
     Auto-init: تمام select‌ها در DOM
     ========================================== */

  function initAll() {
    var selects = document.querySelectorAll('.select:not(.select--disabled)');
    for (var i = 0; i < selects.length; i++) {
      createInstance(selects[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* --- API عمومی --- */
  window.Select = {
    /**
     * فعال‌سازی یک select
     * @param {HTMLElement} el
     * @returns {Object} instance
     */
    init: function (el) {
      return createInstance(el);
    },

    /**
     * فعال‌سازی همه select‌ها
     */
    initAll: initAll
  };
})();
