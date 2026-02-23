/* ===================================================
   COMPONENT: CreditModal
   Usage:  CreditModal.open()            — open the modal
           CreditModal.close()           — close the modal
           CreditModal.openFromDrawer()  — close mobile drawer then open

   HTML lives in index.html; this file handles events only.
   =================================================== */

'use strict';

const CreditModal = (() => {

  /* -------------------------------------------------------
     Internal state
  ------------------------------------------------------- */
  let _isOpen       = false;
  let _initialized  = false;

  /* -------------------------------------------------------
     Bind events (runs only once)
  ------------------------------------------------------- */
  function _init() {
    if (_initialized) return;
    _initialized = true;

    const $modal   = document.getElementById('creditModal');
    const $overlay = document.getElementById('creditOverlay');
    const $close   = document.getElementById('creditClose');
    const $input   = document.getElementById('creditAmount');
    const $submit  = document.getElementById('creditSubmit');

    // Close button
    $close.addEventListener('click', close);

    // Overlay click → close
    $overlay.addEventListener('click', close);

    // Preset buttons: fill input + activate button
    $modal.querySelectorAll('.credit-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $input.value = btn.dataset.label;
        $modal.querySelectorAll('.credit-preset-btn')
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $input.focus();
      });
    });

    // Manual typing: sync active state with preset values
    $input.addEventListener('input', () => {
      const val = $input.value.trim();
      $modal.querySelectorAll('.credit-preset-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.label === val);
      });
    });

    // Submit: validate → trigger payment flow
    $submit.addEventListener('click', () => {
      const amount = $input.value.trim();
      if (!amount) {
        $input.focus();
        $input.classList.add('credit-input--error');
        $input.addEventListener('input',
          () => $input.classList.remove('credit-input--error'),
          { once: true }
        );
        return;
      }
      // TODO: wire to actual payment API
      console.log('[CreditModal] Payment initiated for:', amount);
      close();
    });

    // Escape key: close this modal before any other handler runs
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && _isOpen) {
        e.stopImmediatePropagation();
        close();
      }
    }, { capture: true });
  }

  /* -------------------------------------------------------
     Public API
  ------------------------------------------------------- */
  function open() {
    _init();
    _isOpen = true;
    document.getElementById('creditModal').classList.add('open');
    document.getElementById('creditOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
    // Focus input after CSS transition ends
    setTimeout(() => {
      const $input = document.getElementById('creditAmount');
      if ($input) $input.focus();
    }, 310);
  }

  function close() {
    if (!_initialized) return;
    _isOpen = false;
    document.getElementById('creditModal').classList.remove('open');
    document.getElementById('creditOverlay').classList.remove('show');
    document.body.style.overflow = '';
    // Reset form state
    const $input = document.getElementById('creditAmount');
    if ($input) $input.value = '';
    document.querySelectorAll('.credit-preset-btn')
      .forEach(b => b.classList.remove('active'));
  }

  // Close the mobile drawer first, then open the modal after its animation
  function openFromDrawer() {
    if (typeof closeMobileDrawer === 'function') closeMobileDrawer();
    setTimeout(open, 320);
  }

  return { open, close, openFromDrawer };

})();
