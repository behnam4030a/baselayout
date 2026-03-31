/**
 * modules.js — منطق صفحه مدیریت ماژول‌ها
 */

(function () {

  /** تعداد ماژول‌های فعال را محاسبه و در هدر نمایش می‌دهد */
  function updateActiveCount() {
    var active  = document.querySelectorAll('.js-module-switch:checked').length;
    var countEl = document.querySelector('.modules-head-card__count');
    if (countEl) {
      countEl.textContent = toFarsiDigits(active) + ' ماژول فعال است';
    }
  }

  /** اعداد را به فارسی تبدیل می‌کند */
  function toFarsiDigits(n) {
    return String(n).replace(/\d/g, function (d) {
      return '۰۱۲۳۴۵۶۷۸۹'[d];
    });
  }

  /** متن وضعیت یک کارت را بر اساس حالت سوییچ به‌روز می‌کند */
  function updateCard(switchEl) {
    var status = switchEl.closest('.module-card').querySelector('.module-status');
    if (!status) return;
    status.textContent = switchEl.checked ? 'ماژول فعال است' : 'ماژول غیرفعال است';
  }

  /** راه‌اندازی اولیه */
  function init() {
    updateActiveCount();

    document.querySelectorAll('.js-module-switch').forEach(function (sw) {
      sw.addEventListener('change', function () {
        updateCard(this);
        updateActiveCount();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);

})();
