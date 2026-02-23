/**
 * Textarea Component Scripts
 * کامپوننت ناحیه متنی - اسکریپت‌ها
 *
 * این فایل شامل منطق JavaScript کامپوننت Textarea است:
 * - Counter: شمارنده کاراکتر با دو فرمت (عددی و متنی)
 * - تبدیل اعداد به فارسی (۰-۹)
 *
 * نحوه استفاده:
 * <link rel="stylesheet" href="textarea.css">
 * <script src="textarea.js" defer></script>
 *
 * API:
 * Textarea.init()
 * Textarea.updateCounter(el)
 */

(function () {
  'use strict';

  /* --- Persian digits --- */
  var PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  /**
   * تبدیل عدد به رقم فارسی
   * @param {number} num
   * @returns {string}
   */
  function toPersian(num) {
    return String(num).replace(/\d/g, function (d) {
      return PERSIAN_DIGITS[+d];
    });
  }

  /**
   * به‌روزرسانی متن شمارنده
   * @param {HTMLElement} counter — عنصر .textarea__counter
   */
  function updateCounter(counter) {
    var wrapper = counter.closest('.textarea');
    if (!wrapper) return;

    var field = wrapper.querySelector('.textarea__field');
    if (!field) return;

    var maxLen = field.getAttribute('maxlength');
    if (!maxLen) return;

    var current = field.value.length;
    var max = parseInt(maxLen, 10);
    var type = counter.getAttribute('data-counter');

    if (type === 'text') {
      counter.textContent = toPersian(current) + ' کاراکتر از ' + toPersian(max) + ' تا استفاده شده';
    } else {
      // default: number format
      counter.textContent = toPersian(current) + '/' + toPersian(max);
    }
  }

  /**
   * مقداردهی اولیه یک textarea با شمارنده
   * @param {HTMLElement} counter — عنصر .textarea__counter
   */
  function initCounter(counter) {
    var wrapper = counter.closest('.textarea');
    if (!wrapper) return;

    var field = wrapper.querySelector('.textarea__field');
    if (!field) return;

    // مقداردهی اولیه
    updateCounter(counter);

    // گوش دادن به رویداد input
    field.addEventListener('input', function () {
      updateCounter(counter);
    });
  }

  /**
   * مقداردهی اولیه تمام شمارنده‌ها
   */
  function init() {
    var counters = document.querySelectorAll('.textarea__counter');
    for (var i = 0; i < counters.length; i++) {
      initCounter(counters[i]);
    }
  }

  /* --- Auto-init --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* --- Public API --- */
  window.Textarea = {
    init: init,
    updateCounter: updateCounter
  };
})();
