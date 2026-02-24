/**
 * Toast Component Scripts
 * کامپوننت اعلان (Toast) - اسکریپت‌ها
 *
 * این فایل شامل منطق JavaScript کامپوننت Toast است:
 * - Dismiss button: بستن دستی Toast
 * - Timer indicator: حذف خودکار پس از اتمام تایمر
 * - مدت زمان قابل تنظیم با data-toast-duration (میلی‌ثانیه)
 * - Toast.show(): ایجاد و نمایش Toast به صورت دینامیک
 * - پشتیبانی از 6 موقعیت نمایش (position)
 *
 * نحوه استفاده:
 * <link rel="stylesheet" href="toast.css">
 * <script src="toast.js" defer></script>
 *
 * نمایش Toast با JavaScript:
 * Toast.show({ variant: 'success', title: 'عملیات موفق بود', position: 'top-left' });
 */

(function () {
  'use strict';

  /* --- آیکن‌های پیش‌فرض هر واریانت --- */
  var ICONS = {
    success: '<svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="26 3.3"/><path d="M11.5 18.5L16 23L25 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    danger: '<svg viewBox="0 0 36 36" fill="none"><rect x="5" y="5" width="26" height="26" rx="5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="20 3.85" fill="none"/><path d="M13 13L23 23M23 13L13 23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    warning: '<svg viewBox="0 0 36 36" fill="none"><path d="M18 5L31 30H5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="22 4" fill="none"/><path d="M18 15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="18" cy="26" r="1.2" fill="currentColor"/></svg>',
    neutral: '<svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="26 3.3"/><path d="M18 17V25" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/></svg>'
  };

  var CLOSE_ICON = '<svg viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  /* --- نقش‌های دسترسی‌پذیری هر واریانت --- */
  var ROLES = {
    success: 'status',
    danger: 'alert',
    warning: 'alert',
    neutral: 'status'
  };

  /* --- موقعیت‌های معتبر container (استایل‌ها در toast.css تعریف شده‌اند) --- */
  var VALID_POSITIONS = {
    'top-left': true,
    'top-center': true,
    'top-right': true,
    'bottom-left': true,
    'bottom-center': true,
    'bottom-right': true
  };

  var DEFAULT_POSITION = 'top-left';

  /**
   * یافتن یا ساخت container برای یک موقعیت مشخص
   * @param {string} position
   * @returns {HTMLElement}
   */
  function getContainer(position) {
    var pos = VALID_POSITIONS[position] ? position : DEFAULT_POSITION;
    var id = 'toast-container--' + pos;
    var container = document.getElementById(id);

    if (!container) {
      container = document.createElement('div');
      container.id = id;
      container.className = 'toast-container toast-container--' + pos;
      document.body.appendChild(container);
    }

    return container;
  }

  /**
   * حذف یک Toast از DOM
   * @param {HTMLElement} toast
   */
  function dismissToast(toast) {
    if (!toast || !toast.parentNode) return;

    var progressBar = toast.querySelector('.toast__progress-bar');
    if (progressBar) {
      progressBar.style.animationPlayState = 'paused';
    }

    toast.remove();
  }

  /**
   * راه‌اندازی یک Toast
   * - تنظیم مدت زمان تایمر
   * - اتصال dismiss button
   * - اتصال animationend برای حذف خودکار
   * @param {HTMLElement} toast
   */
  function setupToast(toast) {
    var dismissBtn = toast.querySelector('.toast__dismiss');
    var progressBar = toast.querySelector('.toast__progress-bar');

    /* --- مدت زمان تایمر --- */
    var durationAttr = toast.getAttribute('data-toast-duration');
    if (durationAttr) {
      var durationMs = parseInt(durationAttr, 10);
      if (!isNaN(durationMs) && durationMs > 0) {
        toast.style.setProperty('--toast-duration', durationMs + 'ms');
      }
    }

    /* --- Dismiss button --- */
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function () {
        dismissToast(toast);
      });
    }

    /* --- Auto dismiss (animationend) --- */
    if (progressBar) {
      progressBar.addEventListener('animationend', function () {
        dismissToast(toast);
      });
    }
  }

  /**
   * ساخت HTML داخلی Toast
   * @param {string} variant - نوع واریانت (success, danger, warning, neutral)
   * @param {string} title - عنوان
   * @param {string} [description] - توضیحات (اختیاری)
   * @param {string} [icon] - آیکن SVG سفارشی (اختیاری)
   * @returns {string}
   */
  function buildHTML(variant, title, description, icon) {
    var statusIcon = icon || ICONS[variant] || ICONS.success;
    var descHTML = description
      ? '<p class="toast__description">' + description + '</p>'
      : '';

    return (
      '<div class="toast__icon">' + statusIcon + '</div>' +
      '<div class="toast__content">' +
        '<p class="toast__title">' + title + '</p>' +
        descHTML +
      '</div>' +
      '<button class="toast__dismiss" aria-label="بستن">' +
        CLOSE_ICON +
      '</button>' +
      '<div class="toast__progress">' +
        '<div class="toast__progress-bar"></div>' +
      '</div>'
    );
  }

  /**
   * مقداردهی اولیه — تمام Toastهای موجود در DOM را راه‌اندازی می‌کند
   */
  function init() {
    var toasts = document.querySelectorAll('.toast');
    for (var i = 0; i < toasts.length; i++) {
      setupToast(toasts[i]);
    }
  }

  /* --- اجرا --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* --- API عمومی --- */
  window.Toast = {
    /**
     * ایجاد و نمایش یک Toast جدید
     * @param {Object} options
     * @param {string} options.variant - نوع واریانت: 'success' | 'danger' | 'warning' | 'neutral'
     * @param {string} options.title - عنوان Toast
     * @param {string} [options.description] - توضیحات (اختیاری)
     * @param {number} [options.duration] - مدت زمان به میلی‌ثانیه (پیش‌فرض: 5000)
     * @param {string} [options.position] - موقعیت: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' (پیش‌فرض: 'top-left')
     * @param {string} [options.icon] - آیکن SVG سفارشی (اختیاری)
     * @param {HTMLElement} [options.container] - المان container (پیش‌فرض: ساخت خودکار بر اساس position)
     * @returns {HTMLElement} المان Toast ساخته شده
     */
    show: function (options) {
      var variant = options.variant || 'success';
      var title = options.title || '';
      var description = options.description || '';
      var duration = options.duration;
      var position = options.position || DEFAULT_POSITION;
      var icon = options.icon;
      var container = options.container;

      /* --- ساخت یا یافتن container بر اساس position --- */
      if (!container) {
        container = getContainer(position);
      }

      /* --- ساخت المان Toast --- */
      var toast = document.createElement('div');
      toast.className = 'toast toast--' + variant;
      toast.setAttribute('role', ROLES[variant] || 'status');

      if (duration) {
        toast.setAttribute('data-toast-duration', duration);
      }

      toast.innerHTML = buildHTML(variant, title, description, icon);

      /* --- افزودن به DOM و راه‌اندازی --- */
      container.appendChild(toast);
      setupToast(toast);

      return toast;
    },

    /**
     * راه‌اندازی یک Toast جدید که به صورت دینامیک به DOM اضافه شده
     * @param {HTMLElement} toastEl
     */
    init: function (toastEl) {
      setupToast(toastEl);
    },

    /**
     * حذف یک Toast
     * @param {HTMLElement} toastEl
     */
    dismiss: function (toastEl) {
      dismissToast(toastEl);
    }
  };
})();
