/**
 * Checkbox Component Scripts
 * کامپوننت چک‌باکس - اسکریپت‌ها
 *
 * این فایل شامل منطق JavaScript کامپوننت Checkbox است:
 * - تنظیم وضعیت Indeterminate از طریق data attribute
 * - منطق Select All برای گروه چک‌باکس‌ها
 *
 * نحوه استفاده:
 * <link rel="stylesheet" href="checkbox.css">
 * <script src="checkbox.js"></script>
 */

(function () {
  'use strict';

  /**
   * تنظیم وضعیت Indeterminate
   * هر input با attribute [data-indeterminate] به حالت indeterminate تنظیم می‌شود.
   * دلیل: HTML attribute برای indeterminate وجود ندارد — فقط JavaScript property.
   */
  function initIndeterminate() {
    var inputs = document.querySelectorAll('.checkbox__input[data-indeterminate]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].indeterminate = true;
    }
  }

  /**
   * منطق Select All
   * یک checkbox والد (select-all) را به مجموعه‌ای از checkbox‌های فرزند متصل می‌کند.
   *
   * نحوه استفاده در HTML:
   * <input data-checkbox-group="group-name" data-checkbox-role="parent" />
   * <input data-checkbox-group="group-name" data-checkbox-role="child" />
   *
   * رفتار:
   * - اگر همه فرزندان checked باشند → والد checked
   * - اگر هیچ فرزندی checked نباشد → والد unchecked
   * - اگر برخی فرزندان checked باشند → والد indeterminate
   * - کلیک روی والد: همه فرزندان checked/unchecked می‌شوند
   */
  function initSelectAllGroups() {
    var parents = document.querySelectorAll('[data-checkbox-group][data-checkbox-role="parent"]');

    for (var i = 0; i < parents.length; i++) {
      setupGroup(parents[i]);
    }
  }

  function setupGroup(parent) {
    var groupName = parent.getAttribute('data-checkbox-group');
    var children = document.querySelectorAll(
      '[data-checkbox-group="' + groupName + '"][data-checkbox-role="child"]'
    );

    if (children.length === 0) return;

    function updateParent() {
      var checkedCount = 0;
      for (var j = 0; j < children.length; j++) {
        if (children[j].checked) checkedCount++;
      }

      if (checkedCount === 0) {
        parent.checked = false;
        parent.indeterminate = false;
      } else if (checkedCount === children.length) {
        parent.checked = true;
        parent.indeterminate = false;
      } else {
        parent.checked = false;
        parent.indeterminate = true;
      }
    }

    parent.addEventListener('change', function () {
      for (var j = 0; j < children.length; j++) {
        children[j].checked = parent.checked;
      }
    });

    for (var j = 0; j < children.length; j++) {
      children[j].addEventListener('change', updateParent);
    }

    updateParent();
  }

  /**
   * مقداردهی اولیه
   */
  function init() {
    initIndeterminate();
    initSelectAllGroups();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
