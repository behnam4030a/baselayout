/**
 * Tab Component JavaScript
 * کامپوننت تب (Tab) - جاوااسکریپت
 *
 * API:
 *   Tab.activate(groupId, index)  — فعال کردن تب با index
 *   Tab.onChange(groupId, fn)     — callback تغییر تب
 *   Tab.init(element)             — فعال‌سازی یک تب جدید
 *   Tab.initAll()                 — فعال‌سازی همه تب‌ها
 */
(function () {
  'use strict';

  var groups = {};
  var callbacks = {};

  function getGroup(groupId) {
    return groups[groupId] || null;
  }

  function setupGroup(el) {
    var groupId = el.getAttribute('data-tab-group');
    if (!groupId || groups[groupId]) return;

    var list = el.querySelector('.tab__list');
    if (!list) return;

    var items = Array.prototype.slice.call(list.querySelectorAll('.tab__item'));
    if (items.length === 0) return;

    // Find panels: siblings after the tab element with class tab__panel
    var panels = [];
    var sibling = el.nextElementSibling;
    while (sibling && sibling.classList.contains('tab__panel')) {
      panels.push(sibling);
      sibling = sibling.nextElementSibling;
    }

    // Setup ARIA on list
    if (!list.getAttribute('role')) {
      list.setAttribute('role', 'tablist');
    }

    // Setup each tab item
    items.forEach(function (item, i) {
      var isActive = item.classList.contains('tab__item--active');

      // Set id if not present
      if (!item.id) {
        item.id = groupId + '-tab-' + i;
      }

      item.setAttribute('role', 'tab');
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      item.setAttribute('tabindex', isActive ? '0' : '-1');

      // Link to panel
      if (panels[i]) {
        if (!panels[i].id) {
          panels[i].id = groupId + '-panel-' + i;
        }
        item.setAttribute('aria-controls', panels[i].id);
        panels[i].setAttribute('role', 'tabpanel');
        panels[i].setAttribute('aria-labelledby', item.id);

        if (isActive) {
          panels[i].classList.add('tab__panel--active');
        } else {
          panels[i].classList.remove('tab__panel--active');
        }
      }

      // Click handler
      item.addEventListener('click', function () {
        activateByIndex(groupId, i);
      });
    });

    // Keyboard handler on the list
    list.addEventListener('keydown', function (e) {
      var currentIndex = items.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      var newIndex = currentIndex;

      // In RTL, ArrowRight goes to previous, ArrowLeft goes to next
      var isRtl = getComputedStyle(list).direction === 'rtl';

      switch (e.key) {
        case 'ArrowRight':
          newIndex = isRtl ? currentIndex - 1 : currentIndex + 1;
          break;
        case 'ArrowLeft':
          newIndex = isRtl ? currentIndex + 1 : currentIndex - 1;
          break;
        case 'Home':
          newIndex = 0;
          break;
        case 'End':
          newIndex = items.length - 1;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          activateByIndex(groupId, currentIndex);
          return;
        default:
          return;
      }

      e.preventDefault();

      // Wrap around
      if (newIndex < 0) newIndex = items.length - 1;
      if (newIndex >= items.length) newIndex = 0;

      items[newIndex].focus();
    });

    groups[groupId] = {
      el: el,
      list: list,
      items: items,
      panels: panels
    };
  }

  function activateByIndex(groupId, index) {
    var group = getGroup(groupId);
    if (!group) return;
    if (index < 0 || index >= group.items.length) return;

    // Deactivate all
    group.items.forEach(function (item, i) {
      item.classList.remove('tab__item--active');
      item.setAttribute('aria-selected', 'false');
      item.setAttribute('tabindex', '-1');

      if (group.panels[i]) {
        group.panels[i].classList.remove('tab__panel--active');
      }
    });

    // Activate target
    var target = group.items[index];
    target.classList.add('tab__item--active');
    target.setAttribute('aria-selected', 'true');
    target.setAttribute('tabindex', '0');
    target.focus();

    if (group.panels[index]) {
      group.panels[index].classList.add('tab__panel--active');
    }

    // Fire callback
    if (callbacks[groupId]) {
      callbacks[groupId](index);
    }
  }

  function init(el) {
    setupGroup(el);
  }

  function initAll() {
    var tabElements = document.querySelectorAll('[data-tab-group]');
    tabElements.forEach(function (el) {
      setupGroup(el);
    });
  }

  // Public API
  window.Tab = {
    activate: function (groupId, index) {
      activateByIndex(groupId, index);
    },
    onChange: function (groupId, fn) {
      callbacks[groupId] = fn;
    },
    init: function (element) {
      init(element);
    },
    initAll: function () {
      initAll();
    }
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
