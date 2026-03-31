/**
 * modules-setting.js — منطق صفحه تنظیمات ماژول
 */

(function () {

  /** وضعیت ماژول را در تایل اول به‌روز می‌کند */
  function initModuleToggle() {
    var toggle = document.querySelector('.js-module-toggle');
    var statusText = document.querySelector('.js-module-status-text');
    if (!toggle || !statusText) return;

    function update() {
      statusText.textContent = toggle.checked ? 'ماژول فعال است' : 'ماژول غیرفعال است';
    }

    toggle.addEventListener('change', update);
    update();
  }

  /** اعداد را به فارسی تبدیل می‌کند */
  function toFarsi(n) {
    return String(n).replace(/\d/g, function (d) {
      return '۰۱۲۳۴۵۶۷۸۹'[d];
    });
  }

  /** مودال ویرایش متن پیامک */
  var EditSmsModal = (function () {
    var _initialized = false;
    var _defaultText = 'با آرزوی سلامتی، {نام کاربر} عزیز؛ ورود شما به پیشخوان ای‌سنج در {تاریخ} ساعت {ساعت} ثبت شد. شماره همراه: {شماره همراه کاربر}';

    /** escape HTML special chars */
    function _esc(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    /** تبدیل متن خام به HTML با هایلایت متغیرها */
    function _highlight(text) {
      return _esc(text).replace(/(\{[^{}]+\})/g, '<span class="ms-sms-var">$1</span>');
    }

    /** دریافت آفست کاراکتری مکان‌نما در contenteditable */
    function _getCaretOffset(el) {
      var sel = window.getSelection();
      if (!sel || !sel.rangeCount) return 0;
      var range = sel.getRangeAt(0);
      var pre = range.cloneRange();
      pre.selectNodeContents(el);
      pre.setEnd(range.endContainer, range.endOffset);
      return pre.toString().length;
    }

    /** بازگرداندن مکان‌نما به آفست کاراکتری مشخص */
    function _setCaretOffset(el, offset) {
      var range = document.createRange();
      var stack = Array.prototype.slice.call(el.childNodes);
      var node, charCount = 0, found = false;

      while (!found && stack.length) {
        node = stack.shift();
        if (node.nodeType === 3) { // text node
          var end = charCount + node.length;
          if (offset <= end) {
            range.setStart(node, offset - charCount);
            range.collapse(true);
            found = true;
          }
          charCount = end;
        } else {
          // push children to front of stack (DFS order)
          Array.prototype.unshift.apply(stack, Array.prototype.slice.call(node.childNodes));
        }
      }

      if (!found) {
        range.selectNodeContents(el);
        range.collapse(false);
      }

      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }

    /** اعمال هایلایت با حفظ موقعیت مکان‌نما */
    function _applyHighlight(field) {
      var offset = _getCaretOffset(field);
      var rawText = field.innerText || '';
      // حذف newline انتهایی که مرورگرها اضافه می‌کنند
      rawText = rawText.replace(/\n$/, '');
      var html = _highlight(rawText);
      field.innerHTML = html;
      _setCaretOffset(field, Math.min(offset, (field.innerText || '').replace(/\n$/, '').length));
    }

    /** به‌روزرسانی شمارنده کاراکتر */
    function _updateCount(field, countEl) {
      if (!countEl) return;
      var len = (field.innerText || '').replace(/\n$/, '').length;
      countEl.textContent = toFarsi(len);
    }

    /** تنظیم محتوای پیشفرض و فوکوس */
    function _setDefault(field, countEl) {
      field.innerHTML = _highlight(_defaultText);
      _updateCount(field, countEl);
    }

    function _init() {
      if (_initialized) return;
      _initialized = true;

      var field = document.querySelector('.js-edit-sms-text');
      var charCount = document.querySelector('.js-edit-sms-charcount');
      var resetBtn = document.querySelector('.ms-sms-reset-btn');

      if (!field) return;

      // محتوای اولیه
      _setDefault(field, charCount);

      // هایلایت پویا هنگام تایپ
      field.addEventListener('input', function () {
        _applyHighlight(field);
        _updateCount(field, charCount);
      });

      // جلوگیری از paste فرمت‌دار — فقط متن ساده
      field.addEventListener('paste', function (e) {
        e.preventDefault();
        var text = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertText', false, text);
      });

      // دکمه ذخیره تغییرات — بستن مودال
      var saveBtn = document.querySelector('.js-save-sms-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', function () {
          Modal.close('edit-sms-modal');
        });
      }

      // دکمه بازنشانی
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          _setDefault(field, charCount);
          field.focus();
          var range = document.createRange();
          range.selectNodeContents(field);
          range.collapse(false);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        });
      }
    }

    function open(rowName) {
      _init();
      var subtitle = document.querySelector('.js-edit-sms-subtitle');
      if (subtitle && rowName) subtitle.textContent = 'رویداد ' + rowName;
      Modal.open('edit-sms-modal');
    }

    return { open: open };
  })();

  window.EditSmsModal = EditSmsModal;

  function init() {
    initModuleToggle();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
