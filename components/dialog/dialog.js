/**
 * Dialog Component Scripts
 *
 * API:
 * Dialog.open('my-dialog')    — open dialog by ID
 * Dialog.close('my-dialog')   — close dialog by ID
 * Dialog.closeAll()           — close all open dialogs
 * Dialog.onOpen(id, fn)       — callback when dialog opens
 * Dialog.onClose(id, fn)      — callback when dialog closes
 * Dialog.onAction(id, fn)     — callback when action button clicked (receives data-action value)
 */

(function () {
  'use strict';

  var ANIMATION_DURATION = 300;

  var openDialogs = [];
  var previousActiveElement = null;

  /* ==========================================
     Helpers
     ========================================== */

  function getDialog(id) {
    return document.getElementById(id);
  }

  /* ==========================================
     Body Scroll Lock
     ========================================== */

  function lockBody() {
    if (openDialogs.length === 1) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('dialog-body-locked');
    }
  }

  function unlockBody() {
    if (openDialogs.length === 0) {
      document.body.style.overflow = '';
      document.body.classList.remove('dialog-body-locked');
    }
  }

  /* ==========================================
     Keyboard Handler
     ========================================== */

  function onKeyDown(e) {
    if (e.key === 'Escape' && openDialogs.length > 0) {
      e.preventDefault();
      close(openDialogs[openDialogs.length - 1].id);
    }
  }

  /* ==========================================
     Open
     ========================================== */

  function open(id) {
    var dialog = getDialog(id);
    if (!dialog) return;
    if (dialog.classList.contains('dialog--open')) return;

    previousActiveElement = document.activeElement;

    dialog.classList.remove('dialog--closing');
    dialog.classList.add('dialog--open');
    openDialogs.push(dialog);

    lockBody();

    /* ARIA */
    var panel = dialog.querySelector('.dialog__panel');
    if (panel) {
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');

      var title = dialog.querySelector('.dialog__title');
      if (title) {
        if (!title.id) title.id = 'dialog-title-' + id;
        panel.setAttribute('aria-labelledby', title.id);
      }
    }

    /* Focus first button */
    setTimeout(function () {
      var firstBtn = dialog.querySelector('.dialog__btn');
      if (firstBtn) {
        firstBtn.focus();
      }
    }, 50);

    if (openDialogs.length === 1) {
      document.addEventListener('keydown', onKeyDown);
    }

    if (dialog._dialogOnOpen) dialog._dialogOnOpen();
  }

  /* ==========================================
     Close
     ========================================== */

  function close(id) {
    var dialog = getDialog(id);
    if (!dialog) return;
    if (!dialog.classList.contains('dialog--open')) return;
    if (dialog.classList.contains('dialog--closing')) return;

    dialog.classList.add('dialog--closing');

    setTimeout(function () {
      dialog.classList.remove('dialog--open', 'dialog--closing');

      var idx = openDialogs.indexOf(dialog);
      if (idx > -1) openDialogs.splice(idx, 1);

      unlockBody();

      if (openDialogs.length === 0) {
        document.removeEventListener('keydown', onKeyDown);
      }

      if (previousActiveElement && openDialogs.length === 0) {
        previousActiveElement.focus();
        previousActiveElement = null;
      }

      if (dialog._dialogOnClose) dialog._dialogOnClose();
    }, ANIMATION_DURATION);
  }

  /* ==========================================
     Close All
     ========================================== */

  function closeAll() {
    var dialogs = openDialogs.slice();
    for (var i = dialogs.length - 1; i >= 0; i--) {
      close(dialogs[i].id);
    }
  }

  /* ==========================================
     Setup
     ========================================== */

  function setupDialog(dialog) {
    if (dialog._dialogSetup) return;
    dialog._dialogSetup = true;

    /* Overlay click → close (cancel) */
    var overlay = dialog.querySelector('.dialog__overlay');
    if (overlay) {
      overlay.addEventListener('click', function () {
        close(dialog.id);
      });
    }

    /* Close button click → close */
    var closeBtn = dialog.querySelector('.dialog__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        close(dialog.id);
      });
    }

    /* Prevent close when clicking inside panel */
    var panel = dialog.querySelector('.dialog__panel');
    if (panel) {
      panel.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    /* Action buttons → fire callback + close */
    var actionBtns = dialog.querySelectorAll('.dialog__btn');
    for (var i = 0; i < actionBtns.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var action = btn.getAttribute('data-action');
          if (dialog._dialogOnAction) {
            dialog._dialogOnAction(action);
          }
          close(dialog.id);
        });
      })(actionBtns[i]);
    }
  }

  /* ==========================================
     Auto-init
     ========================================== */

  function initAll() {
    var dialogs = document.querySelectorAll('.dialog');
    for (var i = 0; i < dialogs.length; i++) {
      setupDialog(dialogs[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* ==========================================
     Public API
     ========================================== */

  window.Dialog = {
    open: open,
    close: close,
    closeAll: closeAll,
    init: function (el) { setupDialog(el); },
    initAll: initAll,
    onOpen: function (id, fn) {
      var dialog = getDialog(id);
      if (dialog) dialog._dialogOnOpen = fn;
    },
    onClose: function (id, fn) {
      var dialog = getDialog(id);
      if (dialog) dialog._dialogOnClose = fn;
    },
    onAction: function (id, fn) {
      var dialog = getDialog(id);
      if (dialog) dialog._dialogOnAction = fn;
    }
  };
})();
