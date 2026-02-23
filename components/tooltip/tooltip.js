/**
 * Tooltip Component Scripts
 * کامپوننت تولتیپ (Tooltip) - اسکریپت‌ها
 *
 * نحوه استفاده:
 * <span class="tooltip" data-tooltip="متن" data-tooltip-position="top">
 *   <button>trigger</button>
 * </span>
 *
 * یا با JavaScript:
 * Tooltip.init(element);
 */

(function () {
  'use strict';

  var idCounter = 0;

  /**
   * ساخت و مدیریت یک نمونه Tooltip
   * @param {HTMLElement} el — المان wrapper (.tooltip)
   */
  function createInstance(el) {
    if (el._tooltipInstance) return el._tooltipInstance;

    var text = el.getAttribute('data-tooltip') || '';
    var position = el.getAttribute('data-tooltip-position') || 'top';
    var variant = el.getAttribute('data-tooltip-variant') || '';
    var delayMs = parseInt(el.getAttribute('data-tooltip-delay') || '0', 10);

    var VALID_VARIANTS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];
    var showTimer = null;
    var bubble = null;
    var arrow = null;
    var tooltipId = 'tooltip-' + (++idCounter);

    /* --- ساخت bubble و arrow --- */
    function buildBubble() {
      bubble = document.createElement('span');
      bubble.className = 'tooltip__bubble';
      bubble.id = tooltipId;
      bubble.setAttribute('role', 'tooltip');
      bubble.textContent = text;

      arrow = document.createElement('span');
      arrow.className = 'tooltip__arrow';

      bubble.appendChild(arrow);
      el.appendChild(bubble);

      /* Position class */
      el.classList.add('tooltip--' + position);

      /* Variant class */
      if (variant && VALID_VARIANTS.indexOf(variant) !== -1) {
        el.classList.add('tooltip--' + variant);
      }

      /* ARIA */
      var trigger = el.querySelector('button, a, [tabindex], input, select, textarea') || el.firstElementChild;
      if (trigger) {
        trigger.setAttribute('aria-describedby', tooltipId);
      }
    }

    /* --- نمایش --- */
    function show() {
      if (showTimer) clearTimeout(showTimer);

      if (delayMs > 0) {
        showTimer = setTimeout(function () {
          el.classList.add('tooltip--visible');
        }, delayMs);
      } else {
        el.classList.add('tooltip--visible');
      }
    }

    /* --- مخفی --- */
    function hide() {
      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
      el.classList.remove('tooltip--visible');
    }

    /* --- Event Handlers --- */
    function onMouseEnter() { show(); }
    function onMouseLeave() { hide(); }
    function onFocusIn() { show(); }
    function onFocusOut() { hide(); }

    /* --- Init --- */
    function init() {
      buildBubble();
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
      el.addEventListener('focusin', onFocusIn);
      el.addEventListener('focusout', onFocusOut);
    }

    /* --- Destroy --- */
    function destroy() {
      hide();
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
      if (bubble && bubble.parentNode) bubble.remove();
      el.classList.remove('tooltip--' + position, 'tooltip--visible');
      if (variant) el.classList.remove('tooltip--' + variant);
      delete el._tooltipInstance;
    }

    init();

    var instance = {
      show: show,
      hide: hide,
      destroy: destroy,
      setText: function (newText) {
        text = newText;
        if (bubble) bubble.textContent = newText;
      },
      setVariant: function (newVariant) {
        if (variant) el.classList.remove('tooltip--' + variant);
        variant = (newVariant && VALID_VARIANTS.indexOf(newVariant) !== -1) ? newVariant : '';
        if (variant) el.classList.add('tooltip--' + variant);
      }
    };

    el._tooltipInstance = instance;
    return instance;
  }

  /* --- Auto-init --- */
  function initAll() {
    var els = document.querySelectorAll('.tooltip[data-tooltip]');
    for (var i = 0; i < els.length; i++) {
      createInstance(els[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* --- API عمومی --- */
  window.Tooltip = {
    init: function (el) { return createInstance(el); },
    initAll: initAll
  };
})();
