/**
 * Modal Component Scripts
 * کامپوننت مودال (Modal) - اسکریپت‌ها
 *
 * این فایل شامل منطق JavaScript کامپوننت Modal است:
 * - Open/Close: باز و بسته کردن مودال با انیمیشن
 * - Overlay click: بستن با کلیک روی overlay
 * - Close button: بستن با دکمه ×
 * - Keyboard: بستن با کلید Escape
 * - Focus trap: محدود کردن فوکوس در مودال باز
 * - Body lock: قفل اسکرول صفحه هنگام باز بودن مودال
 *
 * نحوه استفاده:
 * <link rel="stylesheet" href="modal.css">
 * <script src="modal.js" defer></script>
 *
 * باز کردن مودال:
 * Modal.open('my-modal');
 *
 * بستن مودال:
 * Modal.close('my-modal');
 */

(function () {
  'use strict';

  /* --- آیکن بستن --- */
  var CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M5.25 5.25L18.75 18.75M18.75 5.25L5.25 18.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  /* --- مدت انیمیشن (هم‌گام با CSS) --- */
  var ANIMATION_DURATION = 300;

  /* --- Focusable selectors --- */
  var FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* --- State --- */
  var openModals = [];
  var previousActiveElement = null;

  /* ==========================================
     Helpers
     ========================================== */

  function getModal(id) {
    return document.getElementById(id);
  }

  function getFocusableElements(container) {
    return Array.prototype.slice.call(container.querySelectorAll(FOCUSABLE));
  }

  /* ==========================================
     Body Scroll Lock
     ========================================== */

  function lockBody() {
    if (openModals.length === 1) {
      var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';

      document.body.classList.add('modal-body-locked');
    }
  }

  function unlockBody() {
    if (openModals.length === 0) {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-body-locked');
    }
  }

  /* ==========================================
     Focus Trap
     ========================================== */

  function trapFocus(e) {
    var modal = openModals[openModals.length - 1];
    if (!modal) return;

    var container = modal.querySelector('.modal__container');
    if (!container) return;

    var focusable = getFocusableElements(container);
    if (focusable.length === 0) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* ==========================================
     Keyboard Handler
     ========================================== */

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      if (openModals.length > 0) {
        e.preventDefault();
        close(openModals[openModals.length - 1].id);
      }
    }

    if (e.key === 'Tab') {
      trapFocus(e);
    }
  }

  /* ==========================================
     Open
     ========================================== */

  function open(id) {
    var modal = getModal(id);
    if (!modal) return;
    if (modal.classList.contains('modal--open')) return;

    /* ذخیره المان فوکوس‌شده قبلی */
    previousActiveElement = document.activeElement;

    /* باز کردن مودال */
    modal.classList.remove('modal--closing');
    modal.classList.add('modal--open');
    openModals.push(modal);

    /* قفل اسکرول */
    lockBody();

    /* ARIA attributes */
    var container = modal.querySelector('.modal__container');
    if (container) {
      container.setAttribute('role', 'dialog');
      container.setAttribute('aria-modal', 'true');

      var title = modal.querySelector('.modal__title');
      if (title) {
        if (!title.id) title.id = 'modal-title-' + id;
        container.setAttribute('aria-labelledby', title.id);
      }
    }

    /* فوکوس اولین المان */
    setTimeout(function () {
      var target = container || modal;
      var focusable = getFocusableElements(target);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, 50);

    /* اضافه کردن keyboard listener */
    if (openModals.length === 1) {
      document.addEventListener('keydown', onKeyDown);
    }

    /* callback */
    if (modal._modalOnOpen) modal._modalOnOpen();
  }

  /* ==========================================
     Close
     ========================================== */

  function close(id) {
    var modal = getModal(id);
    if (!modal) return;
    if (!modal.classList.contains('modal--open')) return;
    if (modal.classList.contains('modal--closing')) return;

    /* بستن فوری پنل‌های باز */
    closePanelsImmediate(modal);

    /* شروع انیمیشن بسته شدن */
    modal.classList.add('modal--closing');

    /* صبر برای اتمام انیمیشن */
    setTimeout(function () {
      modal.classList.remove('modal--open', 'modal--closing');

      /* حذف از لیست مودال‌های باز */
      var idx = openModals.indexOf(modal);
      if (idx > -1) openModals.splice(idx, 1);

      /* آزاد کردن اسکرول */
      unlockBody();

      /* حذف keyboard listener */
      if (openModals.length === 0) {
        document.removeEventListener('keydown', onKeyDown);
      }

      /* بازگشت فوکوس */
      if (previousActiveElement && openModals.length === 0) {
        previousActiveElement.focus();
        previousActiveElement = null;
      }

      /* callback */
      if (modal._modalOnClose) modal._modalOnClose();
    }, ANIMATION_DURATION);
  }

  /* ==========================================
     Close All
     ========================================== */

  function closeAll() {
    var modals = openModals.slice();
    for (var i = modals.length - 1; i >= 0; i--) {
      close(modals[i].id);
    }
  }

  /* ==========================================
     Expanded Panel — Open
     ========================================== */

  function openPanel(panelId) {
    var panel = document.getElementById(panelId);
    if (!panel) return;
    if (panel.classList.contains('modal__expanded--open')) return;

    panel.classList.remove('modal__expanded--closing');
    panel.classList.add('modal__expanded--open');
  }

  /* ==========================================
     Expanded Panel — Close
     ========================================== */

  function closePanel(panelId) {
    var panel = document.getElementById(panelId);
    if (!panel) return;
    if (!panel.classList.contains('modal__expanded--open')) return;
    if (panel.classList.contains('modal__expanded--closing')) return;

    panel.classList.add('modal__expanded--closing');

    setTimeout(function () {
      panel.classList.remove('modal__expanded--open', 'modal__expanded--closing');
    }, ANIMATION_DURATION);
  }

  /* ==========================================
     Expanded Panel — Close (immediate, no animation)
     ========================================== */

  function closePanelsImmediate(modalEl) {
    var panels = modalEl.querySelectorAll('.modal__expanded--open');
    for (var i = 0; i < panels.length; i++) {
      panels[i].classList.remove('modal__expanded--open', 'modal__expanded--closing');
    }
  }

  /* ==========================================
     Setup (اتصال event listeners)
     ========================================== */

  function setupModal(modal) {
    if (modal._modalSetup) return;
    modal._modalSetup = true;

    /* Overlay click → close */
    var overlay = modal.querySelector('.modal__overlay');
    if (overlay) {
      overlay.addEventListener('click', function () {
        close(modal.id);
      });
    }

    /* Close button click → close */
    var closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        close(modal.id);
      });
    }

    /* data-modal-close buttons inside modal → close target modal */
    var closeDataBtns = modal.querySelectorAll('[data-modal-close]');
    for (var j = 0; j < closeDataBtns.length; j++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          close(btn.getAttribute('data-modal-close'));
        });
      })(closeDataBtns[j]);
    }

    /* جلوگیری از بسته شدن هنگام کلیک داخل container */
    var container = modal.querySelector('.modal__container');
    if (container) {
      container.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    /* جلوگیری از بسته شدن هنگام کلیک داخل expanded panel */
    var panels = modal.querySelectorAll('.modal__expanded');
    for (var i = 0; i < panels.length; i++) {
      panels[i].addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
  }

  /* ==========================================
     Data Attribute Delegation
     (data-modal-open روی هر المانی در صفحه کار می‌کند)
     ========================================== */

  document.addEventListener('click', function (e) {
    var openEl = e.target.closest('[data-modal-open]');
    if (openEl) {
      open(openEl.getAttribute('data-modal-open'));
    }
  });

  /* ==========================================
     Auto-init
     ========================================== */

  function initAll() {
    var modals = document.querySelectorAll('.modal');
    for (var i = 0; i < modals.length; i++) {
      setupModal(modals[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* ==========================================
     API عمومی
     ========================================== */

  window.Modal = {
    /**
     * باز کردن مودال
     * @param {string} id — شناسه مودال
     */
    open: open,

    /**
     * بستن مودال
     * @param {string} id — شناسه مودال
     */
    close: close,

    /**
     * بستن همه مودال‌ها
     */
    closeAll: closeAll,

    /**
     * فعال‌سازی یک مودال
     * @param {HTMLElement} el
     */
    init: function (el) {
      setupModal(el);
    },

    /**
     * فعال‌سازی همه مودال‌ها
     */
    initAll: initAll,

    /**
     * باز کردن پنل جانبی
     * @param {string} panelId — شناسه پنل
     */
    openPanel: openPanel,

    /**
     * بستن پنل جانبی
     * @param {string} panelId — شناسه پنل
     */
    closePanel: closePanel,

    /**
     * تنظیم callback برای باز شدن
     * @param {string} id
     * @param {Function} fn
     */
    onOpen: function (id, fn) {
      var modal = getModal(id);
      if (modal) modal._modalOnOpen = fn;
    },

    /**
     * تنظیم callback برای بسته شدن
     * @param {string} id
     * @param {Function} fn
     */
    onClose: function (id, fn) {
      var modal = getModal(id);
      if (modal) modal._modalOnClose = fn;
    }
  };
})();
