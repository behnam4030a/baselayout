/**
 * ConfirmDeleteModal — مودال تایید حذف
 *
 * به‌صورت خودکار روی تمام دکمه‌های حذف در صفحات پروژه اعمال می‌شود.
 *
 * نحوه استفاده:
 * <link rel="stylesheet" href="../components/confirm-modal/confirm-modal.css">
 * <script src="../components/confirm-modal/confirm-modal.js"></script>  (بعد از modal.js)
 *
 * API دستی (اختیاری):
 * ConfirmDeleteModal.show({ title, message, onConfirm });
 */

(function () {
  'use strict';

  var MODAL_ID = 'confirm-delete-modal';
  var _initialized = false;
  var _onConfirm   = null;

  /* =====================================================
     دکمه‌هایی که نیاز به تایید قبل از حذف دارند
     ===================================================== */

  var DELETE_SELECTOR = [
    '[data-action="delete"]',
    '[data-bulk-action="delete"]',
    '[data-delete]',
    '.group-card__delete-btn',
    '.label-card__delete-btn',
    '.doc-card__delete-btn',
    '.profile-access-modal__delete-btn',
    '.sysconfig-choices-row__delete',
    '.sysconfig-icon-btn--danger',
  ].join(',');

  /* دکمه‌هایی که باید از فیلتر حذف شوند (عملیات غیرمخرب) */
  var EXCLUDE_IDS = ['editLogoRemoveBtn', 'bulkImportFileRemove'];

  /* =====================================================
     ساخت HTML مودال
     ===================================================== */

  function _buildModal() {
    var CLOSE_SVG = '<svg viewBox="0 0 24 24" fill="none"><path d="M5.25 5.25L18.75 18.75M18.75 5.25L5.25 18.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    var TRASH_SVG = '<svg viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/></svg>';

    var html = [
      '<div class="modal modal--centered modal--confirm" id="' + MODAL_ID + '">',
        '<div class="modal__overlay"></div>',
        '<div class="modal__container">',
          '<div class="modal__header">',
            '<div class="modal__title-block">',
              '<div class="modal__icon-holder" aria-hidden="true">' + TRASH_SVG + '</div>',
              '<div class="modal__title-wrap">',
                '<h2 class="modal__title" id="confirmDeleteTitle">حذف</h2>',
              '</div>',
            '</div>',
            '<button class="modal__close" type="button" aria-label="بستن">' + CLOSE_SVG + '</button>',
          '</div>',
          '<div class="modal__body">',
            '<div class="modal__content">',
              '<p class="confirm-modal__message" id="confirmDeleteMessage">آیا از حذف این آیتم اطمینان دارید؟ این عمل قابل بازگشت نیست.</p>',
              '<div class="confirm-modal__actions">',
                '<button class="btn btn--outline btn--large confirm-modal__cancel-btn" id="confirmDeleteCancelBtn" type="button">انصراف</button>',
                '<button class="btn btn--large confirm-modal__confirm-btn" id="confirmDeleteConfirmBtn" type="button">حذف</button>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>',
    ].join('');

    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild;
  }

  /* =====================================================
     راه‌اندازی مودال (یک‌بار)
     ===================================================== */

  function _init() {
    if (_initialized) return;
    _initialized = true;

    var modalEl = _buildModal();
    document.body.appendChild(modalEl);
    Modal.init(modalEl);

    document.getElementById('confirmDeleteConfirmBtn').addEventListener('click', function () {
      Modal.close(MODAL_ID);
      if (_onConfirm) { _onConfirm(); _onConfirm = null; }
    });

    document.getElementById('confirmDeleteCancelBtn').addEventListener('click', function () {
      Modal.close(MODAL_ID);
    });

    Modal.onClose(MODAL_ID, function () {
      _onConfirm = null;
    });
  }

  /* =====================================================
     تعیین عنصر هدف برای حذف
     ===================================================== */

  function _getDeleteTarget(btn) {
    /*
     * مهم: selector های مشخص‌تر (class-based) باید قبل از
     * selector های عمومی (data-action) بررسی شوند،
     * چون برخی دکمه‌ها هر دو را دارند (مثل label-card__delete-btn + data-action="delete").
     */

    /* حذف دسته‌ای (انتخاب چندتایی) */
    if (btn.matches('[data-bulk-action="delete"]')) {
      return Array.from(document.querySelectorAll('.table__tbody .table__row--selected'));
    }

    /* سطح دسترسی */
    if (btn.matches('[data-delete]')) return btn.closest('.access-card');

    /* گروه */
    if (btn.matches('.group-card__delete-btn')) return btn.closest('.group-card');

    /* برچسب */
    if (btn.matches('.label-card__delete-btn')) return btn.closest('.label-card');

    /* مستند */
    if (btn.matches('.doc-card__delete-btn')) return btn.closest('.doc-card');

    /* دسترسی پروفایل */
    if (btn.matches('.profile-access-modal__delete-btn')) return btn.closest('.profile-access-modal__row');

    /* گزینه‌های چندانتخابی در تنظیمات */
    if (btn.matches('.sysconfig-choices-row__delete')) return btn.closest('.sysconfig-choices-row');

    /* ردیف داده در تنظیمات سیستم */
    if (btn.matches('.sysconfig-icon-btn--danger')) return btn.closest('.sysconfig-data-row');

    /* حذف ردیف جدول یا آیتم با data-action="delete" — آخرین چک */
    if (btn.matches('[data-action="delete"]')) {
      var tableRow = btn.closest('.table__row');
      if (tableRow) return tableRow;
      /* حذف آزمون از کاربر — داخل exam-more-menu */
      var menuItem = btn.closest('.exam-more-menu__item');
      if (menuItem) return btn.closest('li:not(.exam-more-menu__item)');
      return btn.closest('li') || btn.parentElement;
    }

    return null;
  }

  /* =====================================================
     استخراج نام آیتم برای نمایش در پیام تایید
     ===================================================== */

  function _getItemName(btn, target) {
    /* حذف دسته‌ای */
    if (btn.matches('[data-bulk-action="delete"]')) {
      var count = Array.isArray(target) ? target.length : 0;
      return count ? count + ' مورد انتخابی' : 'موارد انتخاب‌شده';
    }

    if (!target || Array.isArray(target)) return '';

    /* ردیف جدول */
    if (btn.matches('[data-action="delete"]') && target.matches && target.matches('.table__row')) {
      var cells = target.querySelectorAll('td.table__cell:not(.table__cell--checkbox):not(.table__cell--action)');
      if (cells[0]) return cells[0].textContent.trim();
    }

    /* ردیف تنظیمات سیستم */
    var dataRowName = target.querySelector && target.querySelector('.sysconfig-data-row__name');
    if (dataRowName) return dataRowName.textContent.trim();

    /* نام گروه */
    var groupName = target.querySelector && target.querySelector('.group-card__name');
    if (groupName) return groupName.textContent.trim();

    /* نام برچسب */
    var labelName = target.querySelector && target.querySelector('.label-card__name');
    if (labelName) return labelName.textContent.trim();

    /* نام سطح دسترسی */
    var accessName = target.querySelector && target.querySelector('.access-card__name');
    if (accessName) return accessName.textContent.trim();

    /* نام کاربر در دسترسی پروفایل */
    var userName = target.querySelector && target.querySelector('.profile-access-modal__user-name');
    if (userName) return userName.textContent.trim();

    /* ورودی گزینه */
    var choiceInput = target.querySelector && target.querySelector('.sysconfig-choices-row__input');
    if (choiceInput && choiceInput.value) return choiceInput.value.trim();

    return '';
  }

  /* =====================================================
     بستن منوهای باز
     ===================================================== */

  function _closeOpenMenus() {
    /* exam-more-menu */
    document.querySelectorAll('.exam-more-menu:not([hidden])').forEach(function (m) {
      m.hidden = true;
    });
    /* table row menus با hidden=false */
    document.querySelectorAll('.table__row-menu--open').forEach(function (m) {
      m.classList.remove('table__row-menu--open');
    });
  }

  /* =====================================================
     نمایش مودال تایید (API دستی)
     ===================================================== */

  function show(opts) {
    _init();
    opts = opts || {};
    var titleEl   = document.getElementById('confirmDeleteTitle');
    var messageEl = document.getElementById('confirmDeleteMessage');
    if (titleEl   && opts.title)   titleEl.textContent   = opts.title;
    if (messageEl && opts.message) messageEl.textContent = opts.message;
    _onConfirm = opts.onConfirm || null;
    Modal.open(MODAL_ID);
  }

  /* =====================================================
     رهگیری خودکار کلیک روی دکمه‌های حذف (Capture Phase)
     ===================================================== */

  document.addEventListener('click', function (e) {
    var btn = e.target.closest(DELETE_SELECTOR);
    if (!btn) return;

    /* دکمه‌های مستثنی (حذف فایل موقت) */
    if (EXCLUDE_IDS.indexOf(btn.id) !== -1) return;

    /* جلوگیری از اجرای سایر handler‌ها */
    e.stopImmediatePropagation();
    e.preventDefault();

    _init();
    _closeOpenMenus();

    var target   = _getDeleteTarget(btn);
    var itemName = _getItemName(btn, target);

    var message;
    if (itemName) {
      message = 'آیا از حذف «' + itemName + '» اطمینان دارید؟ این عمل قابل بازگشت نیست.';
    } else {
      message = 'آیا از حذف این آیتم اطمینان دارید؟ این عمل قابل بازگشت نیست.';
    }

    document.getElementById('confirmDeleteTitle').textContent   = 'حذف';
    document.getElementById('confirmDeleteMessage').textContent = message;

    _onConfirm = function () {
      if (Array.isArray(target)) {
        target.forEach(function (el) { el.remove(); });
      } else if (target) {
        target.remove();
      }
    };

    Modal.open(MODAL_ID);
  }, true /* capture phase */);

  /* =====================================================
     API عمومی
     ===================================================== */

  window.ConfirmDeleteModal = { show: show };

})();
