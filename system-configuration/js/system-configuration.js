/* ============================================
   System Configuration — page JS
   ============================================ */

/* ---- PermalinkSetupModal ---- */
const PermalinkSetupModal = (() => {
  'use strict';
  var _initialized = false;

  function _populateCard() {
    var slug  = document.getElementById('permalinkSlug');
    var title = document.getElementById('permalinkTitle');
    var cardPermalink = document.getElementById('sysconfigPermalink');
    var cardTitle     = document.getElementById('sysconfigTitle');

    if (cardPermalink && slug && slug.value.trim()) {
      cardPermalink.value = 'www.esanj.ir/' + slug.value.trim();
    }
    if (cardTitle && title && title.value.trim()) {
      cardTitle.value = title.value.trim();
    }
  }

  function _init() {
    if (_initialized) return;
    _initialized = true;

    var form = document.getElementById('permalinkSetupForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        _populateCard();
        close();
      });
    }

    // Also wire the save button (type=submit with form attr covers it, but keep as fallback)
    var saveBtn = document.getElementById('permalinkSaveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        _populateCard();
        close();
      });
    }
  }

  function open() {
    _init();
    Modal.open('permalink-setup-modal');
  }

  function close() {
    Modal.close('permalink-setup-modal');
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Open on every page load
    setTimeout(open, 350);

    // Copy permalink to clipboard
    var copyBtn = document.getElementById('copyPermalinkBtn');
    if (copyBtn) {
      function _doCopy() {
        var field = document.getElementById('sysconfigPermalink');
        var text = field && field.value.trim();
        if (!text) return;
        navigator.clipboard.writeText(text).then(function () {
          Toast.show({ variant: 'success', title: 'لینک کپی شد', duration: 3000 });
        }).catch(function () {
          // fallback for older browsers
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          Toast.show({ variant: 'success', title: 'لینک کپی شد', duration: 3000 });
        });
      }
      copyBtn.addEventListener('click', _doCopy);
      copyBtn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _doCopy(); }
      });
    }

    // Switch: update access status text
    var interpretSwitch = document.getElementById('interpretAccessSwitch');
    var statusText      = document.getElementById('interpretAccessStatus');
    if (interpretSwitch && statusText) {
      interpretSwitch.addEventListener('change', function () {
        if (this.checked) {
          statusText.textContent = 'دسترسی دارند';
          statusText.className   = 'sysconfig-access-on';
        } else {
          statusText.textContent = 'دسترسی ندارند';
          statusText.className   = 'sysconfig-access-off';
        }
      });
    }
  });

  return { open: open, close: close };
})();


/* ---- AddCustomDataModal ---- */
const AddCustomDataModal = (() => {
  'use strict';
  var _initialized = false;
  var _choicesOpen = false;
  var _dataTypeOpen = false;
  var _displayPosOpen = false;

  // ── Expanded-list helper ──────────────────────────────
  function _wireSelectList(listId, triggerId, closeFn) {
    var list = document.getElementById(listId);
    var trigger = document.getElementById(triggerId);
    if (!list || !trigger) return;
    list.addEventListener('click', function (e) {
      var item = e.target.closest('.expanded-item');
      if (!item) return;
      var items = list.querySelectorAll('.expanded-item');
      for (var i = 0; i < items.length; i++) items[i].classList.remove('expanded-item--selected');
      item.classList.add('expanded-item--selected');
      var textEl = trigger.querySelector('.sysconfig-field-trigger__text');
      if (textEl) textEl.textContent = item.querySelector('.expanded-item__name').textContent;
      trigger.classList.add('sysconfig-field-trigger--selected');
      closeFn();
    });
  }

  function _init() {
    if (_initialized) return;
    _initialized = true;

    _wireSelectList('dataTypeList',   'dataTypeTrigger',   _closeDataType);
    _wireSelectList('displayPosList', 'displayPosTrigger', _closeDisplayPos);

    // Delegated delete buttons
    var choicesList = document.getElementById('choicesList');
    if (choicesList) {
      choicesList.addEventListener('click', function (e) {
        var del = e.target.closest('.sysconfig-choices-row__delete');
        if (del) {
          var row = del.closest('.sysconfig-choices-row');
          if (row) row.remove();
        }
      });
    }

    // Add new choice row
    var addChoiceBtn = document.getElementById('addChoiceBtn');
    if (addChoiceBtn) {
      addChoiceBtn.addEventListener('click', function () {
        var list = document.getElementById('choicesList');
        if (list) list.appendChild(_buildChoiceRow());
      });
    }

    document.getElementById('saveChoicesBtn')  && document.getElementById('saveChoicesBtn').addEventListener('click', _closeChoices);
    document.getElementById('saveDataTypeBtn') && document.getElementById('saveDataTypeBtn').addEventListener('click', _closeDataType);
    document.getElementById('saveDisplayPosBtn') && document.getElementById('saveDisplayPosBtn').addEventListener('click', _closeDisplayPos);
  }

  function _buildChoiceRow() {
    var row = document.createElement('div');
    row.className = 'sysconfig-choices-row';
    row.innerHTML =
      '<button class="sysconfig-choices-row__drag" type="button" aria-label="جابه‌جایی">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">' +
          '<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M4 8h16M4 12h16M4 16h16"/>' +
        '</svg>' +
      '</button>' +
      '<input type="text" class="sysconfig-choices-row__input" placeholder="عنوان گزینه را وارد کنید" />' +
      '<button class="sysconfig-choices-row__delete" type="button" aria-label="حذف گزینه">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">' +
          '<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>' +
        '</svg>' +
      '</button>';
    return row;
  }

  // ── Choices panel ─────────────────────────────────────
  function _openChoices() {
    _choicesOpen = true;
    _closeDataType(); _closeDisplayPos();
    Modal.openPanel('addCustomDataExpanded');
    var t = document.getElementById('choicesTrigger');
    if (t) t.classList.add('sysconfig-field-trigger--open');
  }
  function _closeChoices() {
    if (!_choicesOpen) return;
    _choicesOpen = false;
    Modal.closePanel('addCustomDataExpanded');
    var t = document.getElementById('choicesTrigger');
    if (t) t.classList.remove('sysconfig-field-trigger--open');
  }
  function toggleChoices() { _choicesOpen ? _closeChoices() : _openChoices(); }

  // ── Data Type panel ───────────────────────────────────
  function _openDataType() {
    _dataTypeOpen = true;
    _closeChoices(); _closeDisplayPos();
    Modal.openPanel('dataTypeExpanded');
    var t = document.getElementById('dataTypeTrigger');
    if (t) t.classList.add('sysconfig-field-trigger--open');
  }
  function _closeDataType() {
    if (!_dataTypeOpen) return;
    _dataTypeOpen = false;
    Modal.closePanel('dataTypeExpanded');
    var t = document.getElementById('dataTypeTrigger');
    if (t) t.classList.remove('sysconfig-field-trigger--open');
  }
  function toggleDataType() { _dataTypeOpen ? _closeDataType() : _openDataType(); }

  // ── Display Position panel ────────────────────────────
  function _openDisplayPos() {
    _displayPosOpen = true;
    _closeChoices(); _closeDataType();
    Modal.openPanel('displayPosExpanded');
    var t = document.getElementById('displayPosTrigger');
    if (t) t.classList.add('sysconfig-field-trigger--open');
  }
  function _closeDisplayPos() {
    if (!_displayPosOpen) return;
    _displayPosOpen = false;
    Modal.closePanel('displayPosExpanded');
    var t = document.getElementById('displayPosTrigger');
    if (t) t.classList.remove('sysconfig-field-trigger--open');
  }
  function toggleDisplayPos() { _displayPosOpen ? _closeDisplayPos() : _openDisplayPos(); }

  // ── Public ────────────────────────────────────────────
  function open() { _init(); Modal.open('add-custom-data-modal'); }
  function close() {
    _closeChoices(); _closeDataType(); _closeDisplayPos();
    Modal.close('add-custom-data-modal');
  }
  function submit(e) {
    e.preventDefault();
    close();
  }

  return { open, close, submit, toggleChoices, toggleDataType, toggleDisplayPos };
})();


/* ---- DefaultInputsModal ---- */
const DefaultInputsModal = (() => {
  'use strict';
  function open()  { Modal.open('default-inputs-modal');  }
  function close() { Modal.close('default-inputs-modal'); }
  return { open: open, close: close };
})();


/* ---- PermalinkEditModal ---- */
const PermalinkEditModal = (() => {
  'use strict';
  var _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    // Logo drop zone — click to open file picker
    var dropZone  = document.getElementById('editLogoDropZone');
    var fileInput = document.getElementById('editLogoInput');
    var removeBtn = document.getElementById('editLogoRemoveBtn');
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', function (e) {
        // Don't open picker if clicking the remove button
        if (removeBtn && removeBtn.contains(e.target)) return;
        // Don't open picker if image already set (click remove to change)
        if (dropZone.classList.contains('sysconfig-logo-drop--has-image')) return;
        fileInput.click();
      });
      dropZone.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
      });
      fileInput.addEventListener('change', function () {
        var file = this.files && this.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          _setLogoPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
      });

      // Drag-and-drop
      dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropZone.classList.add('sysconfig-logo-drop--drag');
      });
      dropZone.addEventListener('dragleave', function () {
        dropZone.classList.remove('sysconfig-logo-drop--drag');
      });
      dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropZone.classList.remove('sysconfig-logo-drop--drag');
        var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          _setLogoPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
      });
    }

    // Remove logo button
    if (removeBtn) {
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        _clearLogoPreview();
      });
    }

    // Save button
    var saveBtn = document.getElementById('permalinkEditSaveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        _applyEdits();
        close();
      });
    }
  }

  function _setLogoPreview(src) {
    var dropZone = document.getElementById('editLogoDropZone');
    var removeBtn = document.getElementById('editLogoRemoveBtn');
    if (!dropZone) return;
    // Remove existing preview img if any
    var existing = dropZone.querySelector('.sysconfig-logo-drop__img');
    if (existing) existing.remove();
    // Create img
    var img = document.createElement('img');
    img.src = src;
    img.className = 'sysconfig-logo-drop__img';
    img.alt = 'لوگو';
    dropZone.appendChild(img);
    dropZone.classList.add('sysconfig-logo-drop--has-image');
    if (removeBtn) removeBtn.style.display = 'flex';
  }

  function _clearLogoPreview() {
    var dropZone = document.getElementById('editLogoDropZone');
    var removeBtn = document.getElementById('editLogoRemoveBtn');
    var fileInput = document.getElementById('editLogoInput');
    if (!dropZone) return;
    var existing = dropZone.querySelector('.sysconfig-logo-drop__img');
    if (existing) existing.remove();
    dropZone.classList.remove('sysconfig-logo-drop--has-image');
    if (removeBtn) removeBtn.style.display = 'none';
    if (fileInput) fileInput.value = '';
  }

  function _applyEdits() {
    // Update description in card
    var editDesc  = document.getElementById('editDesc');
    var cardDesc  = document.getElementById('sysconfigDesc');
    if (editDesc && cardDesc) {
      cardDesc.value = editDesc.value.trim();
    }

    // Update logo preview in card
    var dropZone    = document.getElementById('editLogoDropZone');
    var cardPreview = document.getElementById('sysconfigLogoPreview');
    if (dropZone && cardPreview) {
      var img = dropZone.querySelector('.sysconfig-logo-drop__img');
      if (img) {
        // Replace card logo placeholder with the uploaded image
        cardPreview.innerHTML = '<img src="' + img.src + '" alt="لوگو" style="width:100%;height:100%;object-fit:contain;border-radius:var(--radius-card)">';
      }
    }
  }

  function open() {
    _init();
    Modal.open('permalink-edit-modal');
  }

  function close() {
    Modal.close('permalink-edit-modal');
  }

  return { open: open, close: close };
})();
