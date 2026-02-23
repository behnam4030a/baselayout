/**
 * Tag Component — JavaScript
 *
 * رفتارها:
 * - کلیک روی .tag__dismiss: حذف نزدیک‌ترین .tag از DOM
 */

(function () {
  'use strict';

  function init() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.tag__dismiss');
      if (!btn) return;
      var tag = btn.closest('.tag');
      if (tag) tag.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Tag = { init: init };
})();
