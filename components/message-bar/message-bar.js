/**
 * Message Bar Component Scripts
 * کامپوننت نوار پیام (Message Bar) - اسکریپت‌ها
 *
 * این فایل شامل منطق JavaScript کامپوننت Message Bar است:
 * - Close button: بستن message bar با انیمیشن
 * - Auto-dismiss: بسته شدن خودکار پس از زمان مشخص
 * - Show/Hide: نمایش و مخفی‌سازی برنامه‌ای
 * - Create: ساخت message bar از طریق JS
 * - onClose callback: ثبت callback برای رویداد بستن
 *
 * نحوه استفاده:
 * <link rel="stylesheet" href="message-bar.css">
 * <script src="message-bar.js" defer></script>
 *
 * API:
 * MessageBar.init()
 * MessageBar.show(element)
 * MessageBar.hide(element)
 * MessageBar.onClose(element, fn)
 * MessageBar.create(options)
 */

(function () {
  'use strict';

  /** @type {WeakMap<HTMLElement, Function[]>} */
  var closeCallbacks = new WeakMap();

  /** @type {WeakMap<HTMLElement, number>} */
  var dismissTimers = new WeakMap();

  /* --- SVG Icons --- */
  var ICONS = {
    info: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V8.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 11V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 9V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 16V16.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    danger: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V8.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 11V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    caretLeft: '<svg viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /**
   * لغو تایمر auto-dismiss
   * @param {HTMLElement} bar
   */
  function clearDismissTimer(bar) {
    var timer = dismissTimers.get(bar);
    if (timer) {
      clearTimeout(timer);
      dismissTimers.delete(bar);
    }
  }

  /**
   * مخفی کردن یک message bar
   * @param {HTMLElement} bar
   */
  function hideBar(bar) {
    if (!bar) return;
    clearDismissTimer(bar);
    bar.classList.add('message-bar--hidden');

    var callbacks = closeCallbacks.get(bar);
    if (callbacks) {
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i](bar);
      }
    }
  }

  /**
   * نمایش یک message bar
   * @param {HTMLElement} bar
   */
  function showBar(bar) {
    if (!bar) return;
    bar.classList.remove('message-bar--hidden');
    setupAutoDismiss(bar);
  }

  /**
   * راه‌اندازی auto-dismiss
   * @param {HTMLElement} bar
   */
  function setupAutoDismiss(bar) {
    var timeout = bar.getAttribute('data-auto-dismiss');
    if (!timeout) return;

    var ms = parseInt(timeout, 10);
    if (isNaN(ms) || ms <= 0) return;

    clearDismissTimer(bar);

    var timer = setTimeout(function () {
      dismissTimers.delete(bar);
      hideBar(bar);
    }, ms);

    dismissTimers.set(bar, timer);
  }

  /**
   * راه‌اندازی یک message bar
   * @param {HTMLElement} bar
   */
  function setupBar(bar) {
    var closeBtn = bar.querySelector('.message-bar__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        hideBar(bar);
      });
    }

    setupAutoDismiss(bar);
  }

  /**
   * مقداردهی اولیه — تمام message barهای موجود در DOM
   */
  function init() {
    var bars = document.querySelectorAll('[data-message-bar]');
    for (var i = 0; i < bars.length; i++) {
      setupBar(bars[i]);
    }
  }

  /* --- Positioning containers cache (per position) --- */
  var positionContainers = {};
  var VALID_POSITIONS = ['bottom-right', 'bottom-left', 'top-right', 'top-left', 'bottom-center', 'top-center'];

  /**
   * ساخت یا دریافت container ثابت برای موقعیت مشخص
   * @param {string} position
   * @returns {HTMLElement}
   */
  function getFixedContainer(position) {
    if (positionContainers[position]) return positionContainers[position];

    var el = document.createElement('div');
    el.className = 'message-bar-container message-bar-container--' + position;
    document.body.appendChild(el);
    positionContainers[position] = el;
    return el;
  }

  /**
   * ساخت message bar از طریق JS
   * @param {Object} options
   * @param {string} options.type - 'info' | 'success' | 'warning' | 'danger'
   * @param {string} options.title - عنوان پیام
   * @param {string} [options.description] - توضیحات (فعال‌سازی Detailed)
   * @param {number} [options.autoDismiss] - زمان بسته شدن خودکار (ms)
   * @param {Object} [options.link] - لینک (فعال‌سازی Actionable)
   * @param {string} [options.link.text] - متن لینک
   * @param {string} [options.link.href] - آدرس لینک
   * @param {string|HTMLElement} [options.container] - المان container یا id (اگر ندهید → fixed پیش‌فرض)
   * @param {string} [options.position] - موقعیت نمایش: 'bottom-right'(پیش‌فرض) | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center' | 'top-center'
   * @returns {HTMLElement}
   */
  function createBar(options) {
    var type = options.type || 'info';
    var title = options.title || '';
    var description = options.description || '';
    var autoDismiss = options.autoDismiss;
    var link = options.link;
    var position = options.position || 'bottom-right';
    var container;

    if (options.container) {
      container = resolve(options.container);
    } else {
      container = getFixedContainer(position);
    }

    var isDetailed = !!description;
    var isActionable = !!link && !isDetailed;

    var bar = document.createElement('div');
    bar.className = 'message-bar message-bar--' + type;
    if (isDetailed) {
      bar.className += ' message-bar--detailed';
    }
    bar.setAttribute('data-message-bar', '');
    bar.setAttribute('role', 'status');

    if (autoDismiss) {
      bar.setAttribute('data-auto-dismiss', String(autoDismiss));
    }

    // Content wrapper
    var content = document.createElement('div');
    content.className = 'message-bar__content';

    // Icon
    var icon = document.createElement('span');
    icon.className = 'message-bar__icon';
    icon.innerHTML = ICONS[type] || ICONS.info;
    content.appendChild(icon);

    // Text
    if (isDetailed) {
      var textWrap = document.createElement('div');
      textWrap.className = 'message-bar__text-wrap';

      var textEl = document.createElement('p');
      textEl.className = 'message-bar__text';
      textEl.textContent = title;
      textWrap.appendChild(textEl);

      var descEl = document.createElement('p');
      descEl.className = 'message-bar__description';
      descEl.textContent = description;
      textWrap.appendChild(descEl);

      content.appendChild(textWrap);
    } else {
      var textEl2 = document.createElement('p');
      textEl2.className = 'message-bar__text';
      textEl2.innerHTML = '<strong class="message-bar__title">' + escapeHtml(title) + '</strong>';
      content.appendChild(textEl2);
    }

    bar.appendChild(content);

    // Action: link or close button
    if (isActionable) {
      var linkEl = document.createElement('a');
      linkEl.className = 'message-bar__link';
      linkEl.href = link.href || '#';

      var linkText = document.createElement('span');
      linkText.className = 'message-bar__link-text';
      linkText.textContent = link.text || 'بیشتر بدانید';
      linkEl.appendChild(linkText);

      var linkIcon = document.createElement('span');
      linkIcon.className = 'message-bar__link-icon';
      linkIcon.innerHTML = ICONS.caretLeft;
      linkEl.appendChild(linkIcon);

      bar.appendChild(linkEl);
    } else {
      var closeBtn = document.createElement('button');
      closeBtn.className = 'message-bar__close';
      closeBtn.setAttribute('aria-label', 'بستن');
      closeBtn.innerHTML = ICONS.close;
      bar.appendChild(closeBtn);
    }

    container.appendChild(bar);
    setupBar(bar);

    return bar;
  }

  /**
   * Escape HTML entities
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
   * تبدیل string id یا HTMLElement به HTMLElement
   * @param {string|HTMLElement} ref
   * @returns {HTMLElement|null}
   */
  function resolve(ref) {
    if (typeof ref === 'string') return document.getElementById(ref);
    return ref;
  }

  /* --- اجرا --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* --- API عمومی --- */
  window.MessageBar = {
    /**
     * فعال‌سازی همه message barها یا یک message bar خاص
     * @param {string|HTMLElement} [element]
     */
    init: function (element) {
      if (element) {
        setupBar(resolve(element));
      } else {
        init();
      }
    },

    /**
     * نمایش یک message bar
     * @param {string|HTMLElement} element — المان یا id
     */
    show: function (element) {
      showBar(resolve(element));
    },

    /**
     * مخفی کردن یک message bar
     * @param {string|HTMLElement} element — المان یا id
     */
    hide: function (element) {
      hideBar(resolve(element));
    },

    /**
     * ثبت callback برای رویداد بستن
     * @param {string|HTMLElement} element — المان یا id
     * @param {Function} fn
     */
    onClose: function (element, fn) {
      var el = resolve(element);
      if (!el || typeof fn !== 'function') return;
      var callbacks = closeCallbacks.get(el);
      if (!callbacks) {
        callbacks = [];
        closeCallbacks.set(el, callbacks);
      }
      callbacks.push(fn);
    },

    /**
     * ساخت message bar از طریق JS
     * بدون container → نمایش در موقعیت ثابت (پیش‌فرض: پایین-راست)
     * با container → نمایش inline در المان مشخص
     * @param {Object} options
     * @param {string} [options.position] — 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center' | 'top-center'
     * @param {string|HTMLElement} [options.container] — id یا المان (نمایش inline)
     * @returns {HTMLElement}
     */
    create: function (options) {
      return createBar(options || {});
    }
  };
})();
