/* ============================================================
   Profile Page — Specific Logic
   profile/js/profile.js
   ============================================================ */

const ProfileOverview = (() => {
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;
    _initTabs();
    _initShowMore();
  }

  /* ---- مدیریت تب‌ها ---- */
  function _initTabs() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[role="tab"][data-tab]');
      if (!btn) return;

      const tabNav = btn.closest('.profile-tab-nav');
      if (!tabNav) return;

      // غیرفعال کردن تب فعلی
      tabNav.querySelectorAll('[role="tab"]').forEach(t => {
        t.classList.remove('profile-tab-item--active');
        t.setAttribute('aria-selected', 'false');
      });

      // فعال کردن تب کلیک‌شده
      btn.classList.add('profile-tab-item--active');
      btn.setAttribute('aria-selected', 'true');

      // مخفی کردن همه پنل‌ها
      document.querySelectorAll('.profile-tab-panel').forEach(p => {
        p.hidden = true;
        p.classList.remove('profile-tab-panel--active');
      });

      // نمایش پنل متناظر
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) {
        panel.hidden = false;
        panel.classList.add('profile-tab-panel--active');
      }
    });
  }

  /* ---- نمایش / مخفی کردن متن کامل ---- */
  function _initShowMore() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.timeline-card__show-more');
      if (!btn) return;

      const wrap = btn.closest('.timeline-card__body-wrap');
      if (!wrap) return;

      const isExpanded = wrap.classList.toggle('is-expanded');
      btn.setAttribute('aria-expanded', String(isExpanded));
      btn.querySelector('span') && (btn.querySelector('span').textContent =
        isExpanded ? 'بستن متن' : 'نمایش کامل متن');
    });
  }

  /* ---- API: تغییر حالت نمای کلی ----
   *  ProfileOverview.setState(true)  → نمایش تایم‌لاین
   *  ProfileOverview.setState(false) → نمایش حالت خالی
   */
  function setState(hasData) {
    const empty    = document.getElementById('overviewEmpty');
    const timeline = document.getElementById('overviewTimeline');
    if (!empty || !timeline) return;

    if (hasData) {
      empty.classList.add('hidden');
      timeline.classList.remove('hidden');
    } else {
      empty.classList.remove('hidden');
      timeline.classList.add('hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', _init);

  return { setState };
})();


/* ============================================================
   ProfileInfo — مدیریت تب اطلاعات کاربری
   ============================================================ */
const ProfileInfo = (() => {
  let _initialized = false;
  let _originalValues = {};   /* { fieldId: value | selectId: value } */

  function _init() {
    if (_initialized) return;
    _initialized = true;

    const editBtn         = document.getElementById('profileEditBtn');
    const form            = document.getElementById('profileInfoForm');
    const cancelBtn       = document.getElementById('profileCancelBtn');
    const cancelBtnMobile = document.getElementById('profileCancelBtnMobile');

    if (editBtn)         editBtn.addEventListener('click',         _enterEdit);
    if (form)            form.addEventListener('submit',           (e) => { e.preventDefault(); _save(); });
    if (cancelBtn)       cancelBtn.addEventListener('click',       _cancelEdit);
    if (cancelBtnMobile) cancelBtnMobile.addEventListener('click', _cancelEdit);
  }

  /* ذخیره مقادیر فعلی برای بازگشت در صورت انصراف */
  function _captureValues() {
    const tile = document.getElementById('profileInfoTile');
    if (!tile) return;
    _originalValues = {};

    tile.querySelectorAll('.input__field').forEach(el => {
      _originalValues[el.id] = el.value;
    });

    tile.querySelectorAll('.info-field__select').forEach(el => {
      const inst = el._selectInstance;
      if (inst) _originalValues[el.id] = inst.getValue();
    });
  }

  /* به‌روزرسانی متن chip‌ها پس از ذخیره */
  function _updateChips() {
    const tile = document.getElementById('profileInfoTile');
    if (!tile) return;

    /* input fields */
    tile.querySelectorAll('.input__field').forEach(el => {
      const chip = document.getElementById('chip-' + el.id);
      if (chip) chip.textContent = el.value;
    });

    /* single selects */
    tile.querySelectorAll('.info-field__select:not(.select--multiple)').forEach(el => {
      const chip = document.getElementById('chip-' + el.id);
      if (!chip) return;
      const valEl = el.querySelector('.select__value');
      chip.textContent = valEl ? valEl.textContent.trim() : '';
      /* وضعیت: toggle کلاس active بر اساس مقدار انتخاب‌شده */
      if (el.id === 'selectStatus') {
        const inst = el._selectInstance;
        const val = inst ? inst.getValue() : null;
        chip.classList.toggle('info-chip__tag--active', val === 'active');
      }
    });

    /* multi selects — بازسازی chip tag ها */
    tile.querySelectorAll('.select--multiple').forEach(el => {
      const container = document.getElementById('chip-multi-' + el.id);
      if (!container) return;
      const inst = el._selectInstance;
      if (!inst) return;
      const values = inst.getValue();
      const labels = {};
      el.querySelectorAll('.select__item').forEach(item => {
        labels[item.dataset.value] = item.textContent.trim();
      });
      container.innerHTML = '';
      const list = Array.isArray(values) ? values : (values ? [values] : []);
      if (list.length === 0) {
        const empty = document.createElement('span');
        empty.className = 'info-chip__tag';
        empty.textContent = '—';
        container.appendChild(empty);
      } else {
        list.forEach(v => {
          const tag = document.createElement('span');
          tag.className = 'info-chip__tag';
          tag.textContent = labels[v] || v;
          container.appendChild(tag);
        });
      }
    });
  }

  /* فعال‌سازی حالت ویرایش */
  function _enterEdit() {
    _captureValues();
    const tile   = document.getElementById('profileInfoTile');
    const footer = document.getElementById('profileInfoFooter');
    if (!tile || !footer) return;

    tile.classList.add('info-tile--editing');
    footer.hidden = false;
  }

  /* خروج از حالت ویرایش */
  function _exitEdit(restore) {
    const tile   = document.getElementById('profileInfoTile');
    const footer = document.getElementById('profileInfoFooter');
    if (!tile || !footer) return;

    if (restore) {
      tile.querySelectorAll('.input__field').forEach(el => {
        if (_originalValues[el.id] !== undefined) el.value = _originalValues[el.id];
      });

      tile.querySelectorAll('.info-field__select').forEach(el => {
        const inst = el._selectInstance;
        if (inst && _originalValues[el.id] !== undefined) {
          inst.setValue(_originalValues[el.id]);
        }
      });
    } else {
      _updateChips();
    }

    tile.classList.remove('info-tile--editing');
    footer.hidden = true;
  }

  /* ذخیره — اینجا می‌توان API call را اضافه کرد */
  function _save() {
    _exitEdit(false);
  }

  /* انصراف — بازگشت به مقادیر اصلی */
  function _cancelEdit() {
    _exitEdit(true);
  }

  document.addEventListener('DOMContentLoaded', _init);

  return { enterEdit: _enterEdit, save: _save, cancelEdit: _cancelEdit };
})();


/* ============================================================
   ProfileExamsTab — مدیریت تب آزمون‌های پروفایل
   ============================================================ */
const ProfileExamsTab = (() => {
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;
    _initAddExamBtn();
    _initMoreMenus();
    _initResultsButtons();
    _initUpgradeFromResults();
    _initUpgradeModal();
    _initExamsListSearch();
    _initExamBulkSearch();
    _initExamBulkPlans();
    _syncBulkPlanIcons();
    _updateHeadCaption();
  }

  function _updateHeadCaption() {
    const el = document.getElementById('examsHeadCaption');
    if (!el) return;
    const total = document.querySelectorAll('#profileExamsList .exam-card').length;
    const done  = document.querySelectorAll('#profileExamsList .exam-card[data-status="completed"]').length;
    const toPersian = n => n.toLocaleString('fa-IR');
    el.textContent = toPersian(done) + ' از ' + toPersian(total) + ' انجام شده';
  }

  /* ---- دکمه افزودن آزمون جدید ---- */
  function _initAddExamBtn() {
    const btn = document.getElementById('profileAddExamBtn');
    if (btn) btn.addEventListener('click', () => Modal.open('profile-add-exam-modal'));
  }

  /* ---- ⋮ منوهای بیشتر (event delegation) ---- */
  function _initMoreMenus() {
    document.addEventListener('click', (e) => {

      /* کلیک روی دکمه ⋮ */
      const moreBtn = e.target.closest('.exam-more-btn');
      if (moreBtn && moreBtn.closest('#tab-exams')) {
        if (window.innerWidth <= 767) {
          _openBottomSheet(moreBtn);
        } else {
          const wrapper = moreBtn.closest('.exam-more-wrapper');
          const menu = wrapper && wrapper.querySelector('.exam-more-menu');
          if (!menu) return;
          const isOpen = !menu.hidden;
          _closeAllMoreMenus();
          if (!isOpen) {
            menu.hidden = false;
            moreBtn.setAttribute('aria-expanded', 'true');
          }
        }
        e.stopPropagation();
        return;
      }

      /* کلیک روی آیتم منو (desktop) */
      const menuBtn = e.target.closest('.exam-more-menu__btn');
      if (menuBtn && menuBtn.closest('#tab-exams')) {
        const action = menuBtn.dataset.action;
        const examId = menuBtn.dataset.examId;
        _closeAllMoreMenus();
        if (action === 'upgrade') _openUpgradeModal(examId);
        else if (action === 'delete') _confirmDeleteExam(examId);
        return;
      }

      /* کلیک بیرون از منو */
      if (!e.target.closest('.exam-more-wrapper')) {
        _closeAllMoreMenus();
      }
    });

    /* کلیک روی آیتم‌های bottom sheet موبایل */
    document.addEventListener('click', (e) => {
      const sheetBtn = e.target.closest('.exam-bottom-sheet__action');
      if (!sheetBtn) return;
      const action = sheetBtn.dataset.action;
      const examId = sheetBtn.dataset.examId;
      _closeBottomSheet();
      if (action === 'upgrade') _openUpgradeModal(examId);
      else if (action === 'delete') _confirmDeleteExam(examId);
      else if (action === 'results') _openResultsModal(examId);
      else if (action === 'ai-assess') { /* TODO */ }
    });

    /* کلیک روی overlay bottom sheet برای بستن */
    const overlay = document.getElementById('examMoreBottomSheet');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) _closeBottomSheet();
      });
    }
  }

  function _closeAllMoreMenus() {
    document.querySelectorAll('#tab-exams .exam-more-menu').forEach(m => {
      m.hidden = true;
      const btn = m.closest('.exam-more-wrapper')?.querySelector('.exam-more-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function _openBottomSheet(moreBtn) {
    const overlay = document.getElementById('examMoreBottomSheet');
    const actionsEl = document.getElementById('examMoreBottomSheetActions');
    if (!overlay || !actionsEl) return;

    const wrapper = moreBtn.closest('.exam-more-wrapper');
    const menu = wrapper && wrapper.querySelector('.exam-more-menu');
    if (!menu) return;

    actionsEl.innerHTML = '';
    menu.querySelectorAll('.exam-more-menu__item').forEach(item => {
      const originalBtn = item.querySelector('.exam-more-menu__btn');
      if (!originalBtn) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'exam-bottom-sheet__action' +
        (item.classList.contains('exam-more-menu__item--danger') ? ' exam-bottom-sheet__action--danger' : '');
      btn.dataset.action = originalBtn.dataset.action || '';
      btn.dataset.examId = originalBtn.dataset.examId || '';

      /* inner: icon + text (right side in RTL) */
      const inner = document.createElement('span');
      inner.className = 'exam-bottom-sheet__action-inner';
      const svgClone = originalBtn.querySelector('svg')?.cloneNode(true);
      if (svgClone) inner.appendChild(svgClone);
      inner.append(document.createTextNode(originalBtn.textContent.trim()));
      btn.appendChild(inner);

      /* caret: chevron left (left side in RTL = navigation indicator) */
      const caret = document.createElement('span');
      caret.className = 'exam-bottom-sheet__action-caret';
      caret.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M10.5 13.5L6 9L10.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      btn.appendChild(caret);

      actionsEl.appendChild(btn);
    });

    overlay.hidden = false;
  }

  function _closeBottomSheet() {
    const overlay = document.getElementById('examMoreBottomSheet');
    if (!overlay) return;
    overlay.classList.add('is-closing');
    setTimeout(() => {
      overlay.hidden = true;
      overlay.classList.remove('is-closing');
    }, 300);
  }

  /* ---- دکمه نتیجه آزمون ---- */
  function _initResultsButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="results"]');
      if (!btn || !btn.closest('#tab-exams')) return;
      _openResultsModal(btn.dataset.examId);
    });
  }

  function _openResultsModal(examId) {
    /* TODO: بارگذاری داده‌های آزمون از API */
    Modal.open('profile-exam-results-modal');
  }

  /* ---- دکمه ارتقاع از مودال نتایج ---- */
  function _initUpgradeFromResults() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#profileExamUpgradeFromResultsBtn')) return;
      Modal.close('profile-exam-results-modal');
      setTimeout(() => _openUpgradeModal(), 320);
    });
  }

  /* ---- مودال ارتقاع (custom overlay centered) ---- */
  function _initUpgradeModal() {
    const closeBtn = document.getElementById('profileUpgradeCloseBtn');
    const overlay  = document.getElementById('profileUpgradeOverlay');
    if (!overlay) return;

    if (closeBtn) closeBtn.addEventListener('click', _closeUpgradeModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) _closeUpgradeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay && !overlay.hidden) _closeUpgradeModal();
    });

    /* ---- باز/بسته کردن فرم کد تخفیف ---- */
    const discountBtn  = document.getElementById('profileUpgradeDiscountBtn');
    const discountWrap = document.getElementById('profileUpgradeDiscountWrap');
    const discountInput = document.getElementById('profileUpgradeDiscountInput');

    if (discountBtn && discountWrap) {
      discountBtn.addEventListener('click', () => {
        const isOpen = !discountWrap.hidden;
        discountWrap.hidden = isOpen;
        if (!isOpen && discountInput) discountInput.focus();
      });
    }
  }

  function _openUpgradeModal(examId) {
    const overlay = document.getElementById('profileUpgradeOverlay');
    if (overlay) overlay.hidden = false;
  }

  function _closeUpgradeModal() {
    const overlay = document.getElementById('profileUpgradeOverlay');
    if (!overlay) return;
    overlay.classList.add('is-closing');
    setTimeout(() => {
      overlay.hidden = true;
      overlay.classList.remove('is-closing');
    }, 300);
  }

  /* ---- جستجو در لیست آزمون‌های کاربر ---- */
  function _initExamsListSearch() {
    const input = document.getElementById('profileExamsSearch');
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll('#profileExamsList .exam-card').forEach(card => {
        const name = card.querySelector('.exam-card__name')?.textContent.toLowerCase() || '';
        card.style.display = (q.length === 0 || name.includes(q)) ? '' : 'none';
      });
    });
  }

  /* ---- جستجو در لیست آزمون‌های افزودنی ---- */
  function _initExamBulkSearch() {
    const input = document.getElementById('profileExamBulkSearch');
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll('#profileExamBulkList .exam-bulk__item').forEach(item => {
        const name = item.querySelector('.exam-bulk__item-name')?.textContent.toLowerCase() || '';
        item.hidden = q.length > 0 && !name.includes(q);
      });
    });
  }

  /* ---- آیکون‌های پلن ---- */
  const _SVG_PLUS  = '<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const _SVG_MINUS = '<svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  /* ---- همگام‌سازی آیکون پلن‌های از پیش فعال هنگام بارگذاری ---- */
  function _syncBulkPlanIcons() {
    document.querySelectorAll('#profileExamBulkList .exam-bulk__plan').forEach(b => {
      const iconEl = b.querySelector('.exam-bulk__plan-icon');
      if (!iconEl) return;
      iconEl.innerHTML = b.classList.contains('exam-bulk__plan--active') ? _SVG_MINUS : _SVG_PLUS;
    });
  }

  /* ---- انتخاب پلن و به‌روزرسانی جمع هزینه ---- */
  function _initExamBulkPlans() {
    const list = document.getElementById('profileExamBulkList');
    if (!list) return;

    list.addEventListener('click', (e) => {
      const planBtn = e.target.closest('.exam-bulk__plan');
      if (!planBtn) return;
      const item = planBtn.closest('.exam-bulk__item');
      if (!item) return;

      const wasThisActive = planBtn.classList.contains('exam-bulk__plan--active');

      item.querySelectorAll('.exam-bulk__plan').forEach(b => {
        b.classList.remove('exam-bulk__plan--active');
        b.setAttribute('aria-pressed', 'false');
        const iconEl = b.querySelector('.exam-bulk__plan-icon');
        if (iconEl) iconEl.innerHTML = _SVG_PLUS;
      });

      if (!wasThisActive) {
        planBtn.classList.add('exam-bulk__plan--active');
        planBtn.setAttribute('aria-pressed', 'true');
        item.classList.add('exam-bulk__item--has-plan');
        const iconEl = planBtn.querySelector('.exam-bulk__plan-icon');
        if (iconEl) iconEl.innerHTML = _SVG_MINUS;
      } else {
        item.classList.remove('exam-bulk__item--has-plan');
      }

      _updateBulkSummary();
    });
  }

  function _updateBulkSummary() {
    let total = 0;
    let count = 0;
    document.querySelectorAll('#profileExamBulkList .exam-bulk__plan--active').forEach(btn => {
      total += parseInt(btn.dataset.price || '0', 10);
      count++;
    });
    const priceEl = document.getElementById('profileExamBulkPriceVal');
    const countEl = document.getElementById('profileExamBulkCountVal');
    if (priceEl) priceEl.textContent = total.toLocaleString('fa-IR');
    if (countEl) countEl.textContent = count + ' آزمون';
  }

  /* ---- حذف آزمون ---- */
  function _confirmDeleteExam(examId) {
    const list = document.getElementById('profileExamsList');
    if (!list) return;
    const card = list.querySelector(`[data-exam-id="${examId}"]`);
    if (!card) return;
    card.remove();
    _updateHeadCaption();
    if (list.querySelectorAll('.exam-card').length === 0) {
      setState(false);
    }
  }

  /* ---- API: تغییر حالت نمایش (داده / خالی) ---- */
  function setState(hasData) {
    const empty = document.getElementById('profileExamsEmpty');
    const list  = document.getElementById('profileExamsList');
    if (!empty || !list) return;
    if (hasData) {
      empty.classList.add('hidden');
      list.classList.remove('hidden');
    } else {
      empty.classList.remove('hidden');
      list.classList.add('hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', _init);

  return { setState };
})();


/* ============================================================
   DocumentsTab — مدیریت تب مستندات پروفایل
   ============================================================ */
const DocumentsTab = (() => {
  let _initialized = false;

  let _currentDocId  = null;
  let _currentTags   = [];
  let _currentExams  = [];

  let _attachments     = [];
  let _isRecording     = false;
  let _recognition     = null;
  let _editorPageOpen  = false;  // true = full-page editor is visible
  let _expandingToPage = false;  // flag to skip _resetModal when expanding

  /* ──────────────────────────────────────────
     init
  ─────────────────────────────────────────── */
  function _init() {
    if (_initialized) return;
    _initialized = true;

    const addBtn = document.getElementById('profileDocsAddBtn');
    if (addBtn) addBtn.addEventListener('click', () => _openModal(null));

    document.addEventListener('click', (e) => {
      if (!document.getElementById('tab-docs')?.offsetParent) return;

      const showBtn = e.target.closest('.doc-card__show-btn');
      if (showBtn) {
        const card = showBtn.closest('.doc-card');
        if (card) _openFullView(card.dataset.docId);
        return;
      }

      const editBtn = e.target.closest('.doc-card__edit-btn');
      if (editBtn) {
        const card = editBtn.closest('.doc-card');
        if (card) _openModal(card.dataset.docId);
        return;
      }

      const deleteBtn = e.target.closest('.doc-card__delete-btn');
      if (deleteBtn) {
        const card = deleteBtn.closest('.doc-card');
        if (card) {
          card.remove();
          setState(document.querySelectorAll('#docsList .doc-card').length > 0);
        }
        return;
      }

      if (e.target.closest('#docsBackBtn')) {
        _closeFullView();
        return;
      }

      if (e.target.closest('#docsEditBtn')) {
        _openModal(_currentDocId);
        return;
      }
    });

    const searchInput = document.getElementById('docsSearchInput');
    if (searchInput) searchInput.addEventListener('input', _filterDocs);

    const saveBtn = document.getElementById('docModalSaveBtn');
    if (saveBtn) saveBtn.addEventListener('click', _saveDoc);


    // ── Modal-body delegation ──────────────────────────────
    // modal.js calls e.stopPropagation() on .modal__container, so clicks inside
    // the modal never reach `document`. We listen on .modal__body (a child of
    // .modal__container) which receives events BEFORE the stopPropagation fires.
    const _docModalBody = document.querySelector('#profile-doc-modal .modal__body');
    if (_docModalBody) {
      _docModalBody.addEventListener('click', (e) => {
        // — Close tag/exam dropdowns when clicking outside them —
        ['docTagsDropdown', 'docExamsDropdown'].forEach((ddId) => {
          const ddEl = document.getElementById(ddId);
          if (ddEl && !ddEl.closest('.doc-tags-wrap')?.contains(e.target)) {
            ddEl.style.display = 'none';
          }
        });

        // — Close font-size dropdown —
        const fsDd  = document.getElementById('docFontSizeDd');
        const fsBtn = document.getElementById('docFontSizeBtn');
        if (fsDd && !fsDd.hidden && !e.target.closest('.doc-modal__font-size-wrap')) {
          fsDd.hidden = true; if (fsBtn) fsBtn.setAttribute('aria-expanded', 'false');
        }

        // — Close save dropdown —
        const saveDd = document.getElementById('docSaveDd');
        if (saveDd && !saveDd.hidden && !e.target.closest('.doc-modal__save-group')) {
          saveDd.hidden = true;
          const smb = document.getElementById('docSaveMoreBtn');
          if (smb) smb.setAttribute('aria-expanded', 'false');
        }

        // — Remove attachment —
        const rmAtt = e.target.closest('.doc-attachment-item__remove');
        if (rmAtt) {
          const idx = parseInt(rmAtt.dataset.idx, 10);
          if (!isNaN(idx)) { _attachments.splice(idx, 1); _renderAttachments(); }
          return;
        }
      });
    }

    // ── Toolbar helper ────────────────────────────────────
    _wireToolbar(document.querySelector('#profile-doc-modal .doc-modal__toolbar'), 'docFieldBody');
    _wireToolbar(document.getElementById('docsEditorPageToolbar'), 'docPageFieldBody');

    // ── Expand → toggle fullpage CSS class روی مودال ────────
    const expandBtn = document.getElementById('docExpandBtn');
    if (expandBtn) expandBtn.addEventListener('click', () => {
      const modal = document.getElementById('profile-doc-modal');
      if (!modal) return;
      const isFullpage = modal.classList.toggle('modal--fullpage');
      if (isFullpage) {
        const slot = document.getElementById('sidebarSlot');
        modal.style.setProperty('--_sidebar-actual-w', (slot ? slot.offsetWidth : 0) + 'px');
      } else {
        modal.style.removeProperty('--_sidebar-actual-w');
      }
      expandBtn.setAttribute('aria-label', isFullpage ? 'کوچک کردن' : 'نمایش تمام صفحه');
      const expandIcon   = expandBtn.querySelector('.doc-expand-icon');
      const compressIcon = expandBtn.querySelector('.doc-compress-icon');
      if (expandIcon)   expandIcon.hidden   = isFullpage;
      if (compressIcon) compressIcon.hidden = !isFullpage;
    });

    // ── Back button (fullpage modal header) ───────────────
    const docBackBtn = document.getElementById('docBackBtn');
    if (docBackBtn) docBackBtn.addEventListener('click', () => {
      const modal = document.getElementById('profile-doc-modal');
      if (!modal) return;
      modal.classList.remove('modal--fullpage');
      modal.style.removeProperty('--_sidebar-actual-w');
      const eb = document.getElementById('docExpandBtn');
      if (eb) {
        eb.setAttribute('aria-label', 'نمایش تمام صفحه');
        const ei = eb.querySelector('.doc-expand-icon');
        const ci = eb.querySelector('.doc-compress-icon');
        if (ei) ei.hidden = false;
        if (ci) ci.hidden = true;
      }
    });

    // ── Back button (full-page editor) ────────────────────
    const editorBackBtn = document.getElementById('docsEditorBackBtn');
    if (editorBackBtn) editorBackBtn.addEventListener('click', _closeEditorPage);

    // ── Clear formatting ──────────────────────────────────
    const clearFmtBtn = document.getElementById('docClearFmtBtn');
    if (clearFmtBtn) {
      clearFmtBtn.addEventListener('click', () => {
        const editor = document.getElementById('docFieldBody');
        if (editor) { editor.focus(); document.execCommand('removeFormat', false, null); }
      });
    }

    // ── Save dropdown ─────────────────────────────────────
    const saveMoreBtn = document.getElementById('docSaveMoreBtn');
    if (saveMoreBtn) {
      saveMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dd = document.getElementById('docSaveDd');
        if (!dd) return;
        const opening = dd.hidden;
        dd.hidden = !opening;
        saveMoreBtn.setAttribute('aria-expanded', String(opening));
      });
    }

    const saveDraftBtn = document.getElementById('docSaveDraftBtn');
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', () => {
        const dd = document.getElementById('docSaveDd');
        if (dd) { dd.hidden = true; const smb = document.getElementById('docSaveMoreBtn'); if (smb) smb.setAttribute('aria-expanded', 'false'); }
        _saveDoc();
      });
    }

    document.addEventListener('click', (e) => {
      const dd = document.getElementById('docSaveDd');
      if (dd && !dd.hidden && !e.target.closest('.doc-modal__save-group')) {
        dd.hidden = true;
        const smb = document.getElementById('docSaveMoreBtn');
        if (smb) smb.setAttribute('aria-expanded', 'false');
      }
    });

    // ── File attachment ───────────────────────────────────
    const fileInput = document.getElementById('docFileInput');
    if (fileInput) {
      fileInput.addEventListener('change', () => {
        Array.from(fileInput.files).forEach(file => _addAttachment(file));
        fileInput.value = '';
      });
    }

    const attachBtn = document.getElementById('docAttachBtn');
    if (attachBtn) attachBtn.addEventListener('click', () => document.getElementById('docFileInput')?.click());

    document.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.doc-attachment-item__remove');
      if (!removeBtn) return;
      const idx = parseInt(removeBtn.dataset.idx, 10);
      if (!isNaN(idx)) { _attachments.splice(idx, 1); _renderAttachments(); }
    });

    // ── Voice input (modal + page) ────────────────────────
    const voiceBtn = document.getElementById('docVoiceBtn');
    if (voiceBtn) voiceBtn.addEventListener('click', _toggleVoice);

    // ── Voice modal ────────────────────────────────────────
    const docVoiceCloseBtn = document.getElementById('docVoiceCloseBtn');
    if (docVoiceCloseBtn) docVoiceCloseBtn.addEventListener('click', _closeVoiceModal);

    const docVoiceOverlay = document.getElementById('docVoiceModal');
    if (docVoiceOverlay) docVoiceOverlay.addEventListener('click', (e) => {
      if (e.target === docVoiceOverlay) _closeVoiceModal();
    });

    const docVoiceConvertBtn = document.getElementById('docVoiceConvertBtn');
    if (docVoiceConvertBtn) docVoiceConvertBtn.addEventListener('click', () => {
      _stopVoiceRecording();
      _closeVoiceModal();
    });

    const docVoiceRetryBtn = document.getElementById('docVoiceRetryBtn');
    if (docVoiceRetryBtn) docVoiceRetryBtn.addEventListener('click', () => {
      _stopVoiceRecording(); // full reset: بارها + تایمر — بدون شروع خودکار
    });

    const docVoiceStopRecordBtn = document.getElementById('docVoiceStopRecordBtn');
    if (docVoiceStopRecordBtn) docVoiceStopRecordBtn.addEventListener('click', () => {
      if (_isRecording) {
        _pauseVoiceRecording(); // pause — state بارها و تایمر حفظ می‌شود
      } else {
        _startVoiceRecording(); // resume از همان جایی که بود
      }
    });

    // ── Page: Save ────────────────────────────────────────
    const docPageSaveBtn = document.getElementById('docPageSaveBtn');
    if (docPageSaveBtn) docPageSaveBtn.addEventListener('click', _saveFromPage);

    // ── Page: Save dropdown ───────────────────────────────
    const docPageSaveMoreBtn = document.getElementById('docPageSaveMoreBtn');
    if (docPageSaveMoreBtn) {
      docPageSaveMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dd = document.getElementById('docPageSaveDd');
        if (!dd) return;
        const opening = dd.hidden;
        dd.hidden = !opening;
        docPageSaveMoreBtn.setAttribute('aria-expanded', String(opening));
      });
    }

    const docPageSaveDraftBtn = document.getElementById('docPageSaveDraftBtn');
    if (docPageSaveDraftBtn) {
      docPageSaveDraftBtn.addEventListener('click', () => {
        const dd = document.getElementById('docPageSaveDd');
        if (dd) { dd.hidden = true; const smb = document.getElementById('docPageSaveMoreBtn'); if (smb) smb.setAttribute('aria-expanded', 'false'); }
        _saveFromPage();
      });
    }

    document.addEventListener('click', (e) => {
      const dd = document.getElementById('docPageSaveDd');
      if (dd && !dd.hidden && !e.target.closest('.doc-modal__save-group')) {
        dd.hidden = true;
        const smb = document.getElementById('docPageSaveMoreBtn');
        if (smb) smb.setAttribute('aria-expanded', 'false');
      }
    });

    // ── Page: Attach button ───────────────────────────────
    const docPageAttachBtn = document.getElementById('docPageAttachBtn');
    if (docPageAttachBtn) docPageAttachBtn.addEventListener('click', () => document.getElementById('docPageFileInput')?.click());

    const docPageFileInput = document.getElementById('docPageFileInput');
    if (docPageFileInput) {
      docPageFileInput.addEventListener('change', () => {
        Array.from(docPageFileInput.files).forEach(file => _addAttachment(file));
        docPageFileInput.value = '';
      });
    }

    // ── Page: Voice button ────────────────────────────────
    const docPageVoiceBtn = document.getElementById('docPageVoiceBtn');
    if (docPageVoiceBtn) docPageVoiceBtn.addEventListener('click', _toggleVoice);

    // ── Font size picker ──────────────────────────────────
    _wireFontSizePicker('docFontSizeBtn', 'docFontSizeDd', 'docFontSizeLabel', 'docFieldBody');
    _wireFontSizePicker('docPageFontSizeBtn', 'docPageFontSizeDd', 'docPageFontSizeLabel', 'docPageFieldBody');

    // close font size dropdowns on outside click
    document.addEventListener('click', (e) => {
      ['docFontSizeDd', 'docPageFontSizeDd'].forEach(ddId => {
        const dd = document.getElementById(ddId);
        const btn = document.getElementById(ddId === 'docFontSizeDd' ? 'docFontSizeBtn' : 'docPageFontSizeBtn');
        if (dd && !dd.hidden && !e.target.closest('.doc-modal__font-size-wrap')) {
          dd.hidden = true;
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // ── Tags & Exams: custom tag-chip inputs ─────────────

    // Tags — custom tag-chip input
    (function() {
      var wrap     = document.getElementById('docTagsWrap');
      var input    = document.getElementById('docTagsInput');
      var field    = document.getElementById('docTagsField');
      var chips    = document.getElementById('docTagsChips');
      var dropdown = document.getElementById('docTagsDropdown');
      if (!wrap || !field || !chips || !dropdown) return;

      var CLOSE_SVG = '<svg viewBox="0 0 12 12" fill="none" width="12" height="12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
      var allItems  = Array.prototype.slice.call(dropdown.querySelectorAll('.doc-tags-dropdown__item'));

      /* --- درج chip --- */
      function _addTag(val) {
        val = val.trim();
        if (!val) return;
        // جلوگیری از تکرار
        var existing = chips.querySelectorAll('.doc-tag-chip');
        for (var i = 0; i < existing.length; i++) {
          if (existing[i].dataset.value === val) return;
        }
        var chip = document.createElement('span');
        chip.className = 'doc-tag-chip';
        chip.dataset.value = val;
        chip.innerHTML = '<button class="doc-tag-chip__remove" type="button" aria-label="حذف برچسب ' + val + '">' + CLOSE_SVG + '</button>' + val;
        chip.querySelector('.doc-tag-chip__remove').addEventListener('click', function() {
          chip.remove();
          _currentTags = _getTagValues();
          _syncDropdown();
        });
        chips.appendChild(chip);
        _currentTags = _getTagValues();
        _syncDropdown();
      }

      /* --- دریافت مقادیر انتخاب‌شده --- */
      function _getTagValues() {
        return Array.prototype.slice.call(chips.querySelectorAll('.doc-tag-chip')).map(function(c) { return c.dataset.value; });
      }

      /* --- مخفی کردن آیتم‌های انتخاب‌شده در dropdown --- */
      function _syncDropdown() {
        var selected = _getTagValues();
        allItems.forEach(function(item) {
          var v = item.dataset.value;
          item.style.display = selected.indexOf(v) !== -1 ? 'none' : '';
        });
      }

      /* --- فیلتر dropdown بر اساس متن --- */
      function _filterDropdown(q) {
        var selected = _getTagValues();
        var hasVisible = false;
        allItems.forEach(function(item) {
          var v = item.dataset.value;
          if (selected.indexOf(v) !== -1) { item.style.display = 'none'; return; }
          var match = !q || v.indexOf(q) !== -1;
          item.style.display = match ? '' : 'none';
          if (match) hasVisible = true;
        });
        return hasVisible;
      }

      /* --- نمایش/مخفی dropdown --- */
      function _openDropdown() {
        var hasVisible = _filterDropdown(field.value.trim());
        dropdown.style.display = hasVisible ? '' : 'none';
      }
      function _closeDropdown() { dropdown.style.display = 'none'; }

      /* --- کلیک روی container: فوکوس به input + نمایش dropdown --- */
      input.addEventListener('click', function() { field.focus(); _openDropdown(); });

      /* --- تایپ --- */
      field.addEventListener('input', function() { _openDropdown(); });
      field.addEventListener('focus', function() { _openDropdown(); });

      /* --- Enter برای افزودن free-text tag --- */
      field.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && field.value.trim()) {
          e.preventDefault();
          _addTag(field.value);
          field.value = '';
          _closeDropdown();
        } else if (e.key === 'Backspace' && !field.value) {
          var allChips = chips.querySelectorAll('.doc-tag-chip');
          if (allChips.length) { allChips[allChips.length - 1].remove(); _currentTags = _getTagValues(); _syncDropdown(); }
        }
      });

      /* --- کلیک روی آیتم dropdown --- */
      dropdown.addEventListener('mousedown', function(e) {
        var item = e.target.closest('.doc-tags-dropdown__item');
        if (!item) return;
        e.preventDefault(); // جلوگیری از blur شدن input
        _addTag(item.dataset.value);
        field.value = '';
        _closeDropdown();
        field.focus();
      });

      /* --- بستن با کلیک خارج --- */
      document.addEventListener('mousedown', function(e) {
        if (!wrap.contains(e.target)) _closeDropdown();
      });
    })();

    // Exams — custom tag-chip input (همانند برچسب‌ها)
    (function() {
      var wrap     = document.getElementById('docExamsWrap');
      var input    = document.getElementById('docExamsInput');
      var field    = document.getElementById('docExamsField');
      var chips    = document.getElementById('docExamsChips');
      var dropdown = document.getElementById('docExamsDropdown');
      if (!wrap || !field || !chips || !dropdown) return;

      var CLOSE_SVG = '<svg viewBox="0 0 12 12" fill="none" width="12" height="12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
      var allItems  = Array.prototype.slice.call(dropdown.querySelectorAll('.doc-tags-dropdown__item'));

      function _addExam(val) {
        val = val.trim();
        if (!val) return;
        var existing = chips.querySelectorAll('.doc-tag-chip');
        for (var i = 0; i < existing.length; i++) {
          if (existing[i].dataset.value === val) return;
        }
        var chip = document.createElement('span');
        chip.className = 'doc-tag-chip';
        chip.dataset.value = val;
        chip.innerHTML = '<button class="doc-tag-chip__remove" type="button" aria-label="حذف آزمون ' + val + '">' + CLOSE_SVG + '</button>' + val;
        chip.querySelector('.doc-tag-chip__remove').addEventListener('click', function() {
          chip.remove();
          _currentExams = _getExamValues();
          _syncExamDropdown();
        });
        chips.appendChild(chip);
        _currentExams = _getExamValues();
        _syncExamDropdown();
      }

      function _getExamValues() {
        return Array.prototype.slice.call(chips.querySelectorAll('.doc-tag-chip')).map(function(c) { return c.dataset.value; });
      }

      function _syncExamDropdown() {
        var selected = _getExamValues();
        allItems.forEach(function(item) {
          item.style.display = selected.indexOf(item.dataset.value) !== -1 ? 'none' : '';
        });
      }

      function _filterExamDropdown(q) {
        var selected = _getExamValues();
        var hasVisible = false;
        allItems.forEach(function(item) {
          var v = item.dataset.value;
          if (selected.indexOf(v) !== -1) { item.style.display = 'none'; return; }
          var match = !q || v.indexOf(q) !== -1;
          item.style.display = match ? '' : 'none';
          if (match) hasVisible = true;
        });
        return hasVisible;
      }

      function _openExamDropdown() {
        var hasVisible = _filterExamDropdown(field.value.trim());
        dropdown.style.display = hasVisible ? '' : 'none';
      }
      function _closeExamDropdown() { dropdown.style.display = 'none'; }

      input.addEventListener('click', function() { field.focus(); _openExamDropdown(); });
      field.addEventListener('input', function() { _openExamDropdown(); });
      field.addEventListener('focus', function() { _openExamDropdown(); });

      field.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && field.value.trim()) {
          e.preventDefault();
          _addExam(field.value);
          field.value = '';
          _closeExamDropdown();
        } else if (e.key === 'Backspace' && !field.value) {
          var allChips = chips.querySelectorAll('.doc-tag-chip');
          if (allChips.length) { allChips[allChips.length - 1].remove(); _currentExams = _getExamValues(); _syncExamDropdown(); }
        }
      });

      dropdown.addEventListener('mousedown', function(e) {
        var item = e.target.closest('.doc-tags-dropdown__item');
        if (!item) return;
        e.preventDefault();
        _addExam(item.dataset.value);
        field.value = '';
        _closeExamDropdown();
        field.focus();
      });

      document.addEventListener('mousedown', function(e) {
        if (!wrap.contains(e.target)) _closeExamDropdown();
      });
    })();

    Modal.onClose('profile-doc-modal', _resetModal);

    setState(document.querySelectorAll('#docsList .doc-card').length > 0);
  }

  /* ──────────────────────────────────────────
     State: empty / list / full-view
  ─────────────────────────────────────────── */
  function setState(hasData) {
    const empty    = document.getElementById('docsEmpty');
    const list     = document.getElementById('docsList');
    const fullView = document.getElementById('docsFullView');
    if (!empty || !list) return;

    if (fullView) fullView.hidden = true;

    if (hasData) {
      empty.hidden = true;
      list.hidden  = false;
    } else {
      empty.hidden = false;
      list.hidden  = true;
    }
    _updateCount();
  }

  function _updateCount() {
    const countEl = document.getElementById('docsCount');
    if (!countEl) return;
    const n = document.querySelectorAll('#docsList .doc-card').length;
    countEl.textContent = `تعداد: ${n} عدد`;
  }

  /* ──────────────────────────────────────────
     Full-view
  ─────────────────────────────────────────── */
  function _openFullView(docId) {
    const card = document.querySelector(`#docsList [data-doc-id="${docId}"]`);
    if (!card) return;
    _currentDocId = docId;

    const title = card.querySelector('.doc-card__title')?.textContent || '';
    const date  = card.querySelector('.doc-card__date')?.textContent || '';
    const body  = card.dataset.body || '';
    const tags  = JSON.parse(card.dataset.tags  || '[]');
    const exams = JSON.parse(card.dataset.exams || '[]');

    const titleEl = document.getElementById('docsFullViewTitle');
    const dateEl  = document.getElementById('docsFullViewDate');
    const textEl  = document.getElementById('docsFullViewText');
    const tagsEl  = document.getElementById('docsFullViewTags');
    const examsEl = document.getElementById('docsFullViewExams');

    if (titleEl) titleEl.textContent = title;
    if (dateEl)  dateEl.textContent  = date;
    if (textEl)  textEl.innerHTML    = body;

    if (tagsEl) {
      tagsEl.innerHTML = tags.length
        ? tags.map(t => `<span class="docs-meta__tag">${t}</span>`).join('')
        : '<span style="color:var(--text-2);font-size:13px">—</span>';
    }
    if (examsEl) {
      examsEl.innerHTML = exams.length
        ? exams.map(ex => `<span class="docs-meta__tag">${ex}</span>`).join('')
        : '<span style="color:var(--text-2);font-size:13px">—</span>';
    }

    const headCard    = document.getElementById('docsHeadCard');
    const contentCard = document.getElementById('docsContentCard');
    const fv          = document.getElementById('docsFullView');
    if (headCard)    headCard.hidden    = true;
    if (contentCard) contentCard.hidden = true;
    if (fv)          fv.hidden          = false;
  }

  function _closeFullView() {
    const headCard    = document.getElementById('docsHeadCard');
    const contentCard = document.getElementById('docsContentCard');
    const fv          = document.getElementById('docsFullView');
    if (fv)          fv.hidden          = true;
    if (headCard)    headCard.hidden    = false;
    if (contentCard) contentCard.hidden = false;
    _currentDocId = null;
    setState(document.querySelectorAll('#docsList .doc-card').length > 0);
  }

  /* ──────────────────────────────────────────
     مودال افزودن / ویرایش
  ─────────────────────────────────────────── */
  function _openModal(docId) {
    _currentDocId  = docId;
    _currentTags   = [];
    _currentExams  = [];

    const titleEl    = document.getElementById('docModalTitle');
    const fieldTitle = document.getElementById('docFieldTitle');
    const fieldBody  = document.getElementById('docFieldBody');

    if (docId) {
      const card = document.querySelector(`#docsList [data-doc-id="${docId}"]`);
      if (!card) return;
      if (titleEl)    titleEl.textContent = 'ویرایش مستند';
      if (fieldTitle) fieldTitle.value    = card.querySelector('.doc-card__title')?.textContent || '';
      if (fieldBody)  fieldBody.innerHTML = card.dataset.body || '';
      _currentTags  = JSON.parse(card.dataset.tags  || '[]');
      _currentExams = JSON.parse(card.dataset.exams || '[]');
      _attachments  = JSON.parse(card.dataset.files || '[]').map(f => ({ name: f.name, size: f.size, file: null }));
    } else {
      if (titleEl)    titleEl.textContent = 'افزودن مستند جدید';
      if (fieldTitle) fieldTitle.value    = '';
      if (fieldBody)  fieldBody.innerHTML = '';
      _attachments = [];
    }
    _renderAttachments();

    // sync fullpage header title
    const fpTitle = document.getElementById('docFullpageTitle');
    if (fpTitle) fpTitle.textContent = titleEl?.textContent || 'افزودن مستند جدید';

    _renderTagChips();
    _renderExamChips();
    Modal.open('profile-doc-modal');
  }

  function _resetModal() {
    if (_expandingToPage) { _expandingToPage = false; return; } // در حین expand رد می‌شود
    // حذف حالت بزرگنمایی
    const _docModal = document.getElementById('profile-doc-modal');
    if (_docModal) {
      _docModal.classList.remove('modal--fullpage');
      _docModal.style.removeProperty('--_sidebar-actual-w');
      const eb = document.getElementById('docExpandBtn');
      if (eb) {
        eb.setAttribute('aria-label', 'نمایش تمام صفحه');
        const ei = eb.querySelector('.doc-expand-icon');
        const ci = eb.querySelector('.doc-compress-icon');
        if (ei) ei.hidden = false;
        if (ci) ci.hidden = true;
      }
    }
    _currentDocId = null;
    _currentTags  = [];
    _currentExams = [];
    _attachments  = [];
    const f = document.getElementById('docFieldTitle');
    const b = document.getElementById('docFieldBody');
    if (f) f.value = '';
    if (b) b.innerHTML = '';
    _renderTagChips();
    _renderExamChips();
    _renderAttachments();
    // stop recording if active
    if (_isRecording && _recognition) { _recognition.stop(); _setRecording(false); }
    // close save dropdown
    const dd = document.getElementById('docSaveDd');
    if (dd) { dd.hidden = true; const smb = document.getElementById('docSaveMoreBtn'); if (smb) smb.setAttribute('aria-expanded', 'false'); }
    // close full-page editor if still open
    const editorPage  = document.getElementById('docsEditorPage');
    if (editorPage && !editorPage.hidden) {
      editorPage.hidden = true;
      _editorPageOpen   = false;
      const headCard    = document.getElementById('docsHeadCard');
      const contentCard = document.getElementById('docsContentCard');
      if (headCard)    headCard.hidden    = false;
      if (contentCard) contentCard.hidden = false;
    }
    // if full-view is showing, close it and go back to list
    const fv = document.getElementById('docsFullView');
    if (fv && !fv.hidden) _closeFullView();
  }

  function _saveDoc() {
    const titleEl = document.getElementById('docFieldTitle');
    const bodyEl  = document.getElementById('docFieldBody');
    const title   = titleEl ? titleEl.value.trim() : '';
    const body    = bodyEl  ? (bodyEl.innerHTML === '<br>' ? '' : bodyEl.innerHTML) : '';
    const filesMeta = _attachments.map(a => ({ name: a.name, size: a.size }));

    if (!title) {
      if (titleEl) titleEl.focus();
      return;
    }

    if (_currentDocId) {
      const card = document.querySelector(`#docsList [data-doc-id="${_currentDocId}"]`);
      if (card) {
        card.dataset.body  = body;
        card.dataset.tags  = JSON.stringify(_currentTags);
        card.dataset.exams = JSON.stringify(_currentExams);
        card.dataset.files = JSON.stringify(filesMeta);
        const t      = card.querySelector('.doc-card__title');
        const text   = card.querySelector('.doc-card__text');
        const tagsEl = card.querySelector('.doc-card__tags');
        if (t)      t.textContent = title;
        if (text)   text.innerHTML = body;
        if (tagsEl) tagsEl.innerHTML = _currentTags
          .map(tag => `<span class="doc-card__tag">${tag}</span>`).join('');
        _updateCardAttachments(card, filesMeta);
      }
    } else {
      _appendCardDOM({ id: String(Date.now()), title, date: _formatDate(new Date()), body, tags: [..._currentTags], exams: [..._currentExams], files: filesMeta });
      setState(true);
    }

    Modal.close('profile-doc-modal');
  }

  /* ──────────────────────────────────────────
     DOM helpers
  ─────────────────────────────────────────── */
  function _appendCardDOM(doc) {
    const list = document.getElementById('docsList');
    if (!list) return;
    const li = document.createElement('li');
    li.className     = 'doc-card';
    li.dataset.docId = doc.id;
    li.dataset.body  = doc.body;
    li.dataset.tags  = JSON.stringify(doc.tags);
    li.dataset.exams = JSON.stringify(doc.exams || []);
    li.dataset.files = JSON.stringify(doc.files || []);
    li.setAttribute('role', 'listitem');
    const trashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.17974 3.38672C7.95774 3.38672 7.75614 3.51609 7.66367 3.71787L7.05 5.05646C6.95835 5.25638 6.75859 5.38455 6.53867 5.38455H4.5591C4.26111 5.38455 4.01953 5.62613 4.01953 5.92412V6.74027C4.01953 6.84576 4.10505 6.93126 4.21053 6.93126H14.5379C14.6433 6.93126 14.7288 6.84576 14.7288 6.74027V5.92412C14.7288 5.62613 14.4872 5.38455 14.1893 5.38455H12.2097C11.9897 5.38455 11.79 5.25638 11.6984 5.05646L11.0847 3.71787C10.9922 3.51609 10.7906 3.38672 10.5686 3.38672H8.17974ZM6.64099 3.24905C6.91679 2.64743 7.51794 2.26172 8.17974 2.26172H10.5686C11.2304 2.26172 11.8316 2.64743 12.1073 3.24905L12.5706 4.25955H14.1893C15.1085 4.25955 15.8538 5.0048 15.8538 5.92412V6.74027C15.8538 7.46707 15.2646 8.05628 14.5379 8.05628H4.21053C3.48372 8.05628 2.89453 7.46707 2.89453 6.74027V5.92412C2.89453 5.00481 3.63978 4.25955 4.5591 4.25955H6.17775L6.64099 3.24905Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.61328 6.9873C4.92394 6.9873 5.17578 7.23914 5.17578 7.5498V14.0641C5.17578 15.0085 5.93003 15.7621 6.84571 15.7621H11.9058C12.8215 15.7621 13.5758 15.0085 13.5758 14.0641V7.5498C13.5758 7.23914 13.8276 6.9873 14.1383 6.9873C14.4489 6.9873 14.7008 7.23914 14.7008 7.5498V14.0641C14.7008 15.6165 13.4561 16.8871 11.9058 16.8871H6.84571C5.29551 16.8871 4.05078 15.6165 4.05078 14.0641V7.5498C4.05078 7.23914 4.30262 6.9873 4.61328 6.9873Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.10547 9.62402C8.41612 9.62402 8.66797 9.87587 8.66797 10.1865V13.5678C8.66797 13.8785 8.41612 14.1303 8.10547 14.1303C7.79482 14.1303 7.54297 13.8785 7.54297 13.5678V10.1865C7.54297 9.87587 7.79482 9.62402 8.10547 9.62402ZM10.6408 9.62402C10.9514 9.62402 11.2033 9.87587 11.2033 10.1865V13.5678C11.2033 13.8785 10.9514 14.1303 10.6408 14.1303C10.3301 14.1303 10.0783 13.8785 10.0783 13.5678V10.1865C10.0783 9.87587 10.3301 9.62402 10.6408 9.62402Z" fill="#222323"/></svg>`;
    li.innerHTML = `
      <div class="doc-card__head">
        <div class="doc-card__header">
          <h3 class="doc-card__title">${doc.title}</h3>
          <div class="doc-card__author">
            <img class="doc-card__avatar" src="../assets/images/imageuser.jpg" alt="" aria-hidden="true" width="20" height="20">
            <span class="doc-card__author-name">علی میرهادی</span>
            <span class="doc-card__author-dot" aria-hidden="true"></span>
            <time class="doc-card__date">نوشته شده در: ${doc.date}</time>
          </div>
        </div>
        <div class="doc-card__tags">
          ${doc.tags.map(tag => `<span class="doc-card__tag">${tag}</span>`).join('')}
        </div>
      </div>
      <p class="doc-card__text">${doc.body}</p>
      <div class="doc-card__divider" aria-hidden="true"></div>
      <div class="doc-card__actions">
        <div class="doc-card__btn-holder">
          <button class="btn btn--outline btn--large doc-card__delete-btn" type="button" data-doc-id="${doc.id}" aria-label="حذف مستند">${trashSvg}</button>
          <button class="btn btn--outline btn--large doc-card__show-btn" type="button" data-doc-id="${doc.id}">نمایش کامل</button>
          <button class="btn btn--outline btn--large doc-card__edit-btn" type="button" data-doc-id="${doc.id}">ویرایش</button>
        </div>
        <div class="doc-card__attachments"></div>
      </div>
    `;
    list.appendChild(li);
    _updateCardAttachments(li, doc.files || []);
  }

  /* ──────────────────────────────────────────
     جستجو
  ─────────────────────────────────────────── */
  function _filterDocs() {
    const q = (document.getElementById('docsSearchInput')?.value || '').trim().toLowerCase();
    document.querySelectorAll('#docsList .doc-card').forEach(card => {
      const title = card.querySelector('.doc-card__title')?.textContent.toLowerCase() || '';
      const text  = card.querySelector('.doc-card__text')?.textContent.toLowerCase()  || '';
      card.hidden = q.length > 0 && !title.includes(q) && !text.includes(q);
    });
  }

  /* ──────────────────────────────────────────
     sync select instances → hidden input
  ─────────────────────────────────────────── */
  function _renderTagChips() {
    // custom tag-chip input
    var chipsEl  = document.getElementById('docTagsChips');
    if (chipsEl) {
      chipsEl.innerHTML = '';
      var CLOSE_SVG = '<svg viewBox="0 0 12 12" fill="none" width="12" height="12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
      _currentTags.forEach(function(val) {
        var chip = document.createElement('span');
        chip.className = 'doc-tag-chip';
        chip.dataset.value = val;
        chip.innerHTML = '<button class="doc-tag-chip__remove" type="button" aria-label="حذف برچسب ' + val + '">' + CLOSE_SVG + '</button>' + val;
        chip.querySelector('.doc-tag-chip__remove').addEventListener('click', function() {
          chip.remove();
          _currentTags = Array.prototype.slice.call(chipsEl.querySelectorAll('.doc-tag-chip')).map(function(c) { return c.dataset.value; });
        });
        chipsEl.appendChild(chip);
      });
    }
    var hidden = document.getElementById('docFieldTagsHidden');
    if (hidden) hidden.value = _currentTags.join(',');
  }

  function _renderExamChips() {
    var chipsEl = document.getElementById('docExamsChips');
    if (chipsEl) {
      chipsEl.innerHTML = '';
      var CLOSE_SVG = '<svg viewBox="0 0 12 12" fill="none" width="12" height="12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
      _currentExams.forEach(function(val) {
        var chip = document.createElement('span');
        chip.className = 'doc-tag-chip';
        chip.dataset.value = val;
        chip.innerHTML = '<button class="doc-tag-chip__remove" type="button" aria-label="حذف آزمون ' + val + '">' + CLOSE_SVG + '</button>' + val;
        chip.querySelector('.doc-tag-chip__remove').addEventListener('click', function() {
          chip.remove();
          _currentExams = Array.prototype.slice.call(chipsEl.querySelectorAll('.doc-tag-chip')).map(function(c) { return c.dataset.value; });
        });
        chipsEl.appendChild(chip);
      });
    }
  }

  const _closeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>`;

  /* ──────────────────────────────────────────
     Font size picker
  ─────────────────────────────────────────── */
  function _wireFontSizePicker(btnId, ddId, labelId, editorId) {
    const btn   = document.getElementById(btnId);
    const dd    = document.getElementById(ddId);
    const label = document.getElementById(labelId);
    if (!btn || !dd) return;

    btn.addEventListener('mousedown', (e) => {
      e.preventDefault(); // keep editor selection
      const opening = dd.hidden;
      dd.hidden = !opening;
      btn.setAttribute('aria-expanded', String(opening));
    });

    dd.addEventListener('mousedown', (e) => {
      const item = e.target.closest('.doc-modal__font-size-item');
      if (!item) return;
      e.preventDefault();
      const px = item.dataset.size;
      _applyFontSize(px, editorId);

      // update label & active state
      if (label) label.textContent = px;
      dd.querySelectorAll('.doc-modal__font-size-item').forEach(el => {
        el.classList.toggle('doc-modal__font-size-item--active', el.dataset.size === px);
      });
      dd.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  function _applyFontSize(px, editorId) {
    const editor = document.getElementById(editorId);
    if (!editor) return;
    // Do NOT call editor.focus() — e.preventDefault() in the caller keeps editor focused.

    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    const isCollapsed = sel.getRangeAt(0).collapsed;

    // Snapshot existing markers before execCommand touches the DOM
    const beforeFonts = new Set(editor.querySelectorAll('font[size="7"]'));
    const beforeXXX   = new Set(editor.querySelectorAll('[style*="xxx-large"]'));

    document.execCommand('fontSize', false, '7');

    // Replace newly created marker elements with <span style="font-size: Xpx">.
    // insideSpan=true  → place cursor at the END of the span content (inside it),
    //                    so subsequent typed characters also land inside the span.
    // insideSpan=false → place cursor right AFTER the span (selection case, done editing).
    function replaceAndPosition(insideSpan) {
      let lastEl = null;

      editor.querySelectorAll('font[size="7"]').forEach(el => {
        if (beforeFonts.has(el)) return;
        const span = document.createElement('span');
        span.style.fontSize = px + 'px';
        while (el.firstChild) span.appendChild(el.firstChild);
        el.parentNode.replaceChild(span, el);
        lastEl = span;
      });

      // Newer Chrome may produce <span style="font-size: xxx-large"> instead of <font>
      editor.querySelectorAll('[style*="xxx-large"]').forEach(el => {
        if (beforeXXX.has(el)) return;
        el.style.fontSize = px + 'px';
        lastEl = el;
      });

      if (!lastEl) return;

      const r = document.createRange();
      if (insideSpan) {
        // cursor at end of span content — in RTL this is the visual LEFT,
        // and subsequent chars typed at this position stay inside the span.
        r.selectNodeContents(lastEl);
        r.collapse(false);
      } else {
        // cursor after the span — correct position after applying to a selection
        r.setStartAfter(lastEl);
        r.collapse(true);
      }
      sel.removeAllRanges();
      sel.addRange(r);
    }

    if (!isCollapsed) {
      // Non-collapsed: execCommand already wrapped the selection; replace immediately
      replaceAndPosition(false);
    } else {
      // Collapsed: execCommand set a pending format — the font element appears on first input
      editor.addEventListener('input', function once() {
        replaceAndPosition(true); // cursor inside span → all following chars get same size
        editor.removeEventListener('input', once);
      });
    }
  }

  /* ──────────────────────────────────────────
     Toolbar helper
  ─────────────────────────────────────────── */
  function _wireToolbar(toolbarEl, editorId) {
    if (!toolbarEl) return;
    toolbarEl.addEventListener('mousedown', (e) => {
      const btn = e.target.closest('[data-cmd]');
      if (!btn) return;
      e.preventDefault();
      const editor = document.getElementById(editorId);
      if (editor) editor.focus();
      document.execCommand(btn.dataset.cmd, false, null);
    });
  }

  /* ──────────────────────────────────────────
     Full-page editor
  ─────────────────────────────────────────── */
  function _openEditorPage() {
    // 1. Capture current modal values
    const modalTitle = document.getElementById('docFieldTitle')?.value || '';
    const modalBody  = document.getElementById('docFieldBody')?.innerHTML || '';

    // 2. Set full-page fields
    const pageTitle = document.getElementById('docPageFieldTitle');
    const pageBody  = document.getElementById('docPageFieldBody');
    if (pageTitle) pageTitle.value    = modalTitle;
    if (pageBody)  pageBody.innerHTML = modalBody;

    // 3. Sync page heading
    const pageTitleH  = document.getElementById('docsEditorPageTitle');
    const modalTitleH = document.getElementById('docModalTitle');
    if (pageTitleH && modalTitleH) pageTitleH.textContent = modalTitleH.textContent;

    // 4. Mark as page-open (chips/attachments already synced — render fns update both containers)
    _editorPageOpen = true;

    // 5. Show editor page
    const headCard    = document.getElementById('docsHeadCard');
    const contentCard = document.getElementById('docsContentCard');
    const fullView    = document.getElementById('docsFullView');
    const editorPage  = document.getElementById('docsEditorPage');
    if (headCard)    headCard.hidden    = true;
    if (contentCard) contentCard.hidden = true;
    if (fullView)    fullView.hidden    = true;
    if (editorPage)  editorPage.hidden  = false;

    // 6. Close modal — skip _resetModal via flag
    _expandingToPage = true;
    Modal.close('profile-doc-modal');
  }

  function _closeEditorPage() {
    // 1. Transfer data back to modal fields
    const pageTitle  = document.getElementById('docPageFieldTitle');
    const pageBody   = document.getElementById('docPageFieldBody');
    const modalTitle = document.getElementById('docFieldTitle');
    const modalBody  = document.getElementById('docFieldBody');
    if (modalTitle && pageTitle) modalTitle.value    = pageTitle.value;
    if (modalBody  && pageBody)  modalBody.innerHTML = pageBody.innerHTML;

    // 2. Sync modal heading label
    const pageTitleH  = document.getElementById('docsEditorPageTitle');
    const modalTitleH = document.getElementById('docModalTitle');
    if (modalTitleH && pageTitleH) modalTitleH.textContent = pageTitleH.textContent;

    // 3. Cleanup page
    _editorPageOpen = false;
    if (_isRecording && _recognition) { _recognition.stop(); _setRecording(false); }
    const dd = document.getElementById('docPageSaveDd');
    if (dd) { dd.hidden = true; const smb = document.getElementById('docPageSaveMoreBtn'); if (smb) smb.setAttribute('aria-expanded', 'false'); }

    // 4. Hide editor page, restore head/content cards
    const editorPage  = document.getElementById('docsEditorPage');
    const headCard    = document.getElementById('docsHeadCard');
    const contentCard = document.getElementById('docsContentCard');
    if (editorPage)  editorPage.hidden  = true;
    if (headCard)    headCard.hidden    = false;
    if (contentCard) contentCard.hidden = false;

    // 5. Reopen modal — chips/attachments already synced (render functions update both containers)
    Modal.open('profile-doc-modal');
  }

  function _saveFromPage() {
    const titleEl   = document.getElementById('docPageFieldTitle');
    const bodyEl    = document.getElementById('docPageFieldBody');
    const title     = titleEl ? titleEl.value.trim() : '';
    const body      = bodyEl  ? (bodyEl.innerHTML === '<br>' ? '' : bodyEl.innerHTML) : '';
    const filesMeta = _attachments.map(a => ({ name: a.name, size: a.size }));

    if (!title) { if (titleEl) titleEl.focus(); return; }

    if (_currentDocId) {
      const card = document.querySelector(`#docsList [data-doc-id="${_currentDocId}"]`);
      if (card) {
        card.dataset.body  = body;
        card.dataset.tags  = JSON.stringify(_currentTags);
        card.dataset.exams = JSON.stringify(_currentExams);
        card.dataset.files = JSON.stringify(filesMeta);
        const t      = card.querySelector('.doc-card__title');
        const text   = card.querySelector('.doc-card__text');
        const tagsEl = card.querySelector('.doc-card__tags');
        if (t)      t.textContent  = title;
        if (text)   text.innerHTML = body;
        if (tagsEl) tagsEl.innerHTML = _currentTags.map(tag => `<span class="doc-card__tag">${tag}</span>`).join('');
        _updateCardAttachments(card, filesMeta);
      }
    } else {
      _appendCardDOM({ id: String(Date.now()), title, date: _formatDate(new Date()), body, tags: [..._currentTags], exams: [..._currentExams], files: filesMeta });
    }
    // After save: go to docs list (NOT back to modal)
    _dismissEditorPage();
  }

  function _dismissEditorPage() {
    _editorPageOpen = false;
    _currentDocId   = null;
    _currentTags    = [];
    _currentExams   = [];
    _attachments    = [];
    _renderTagChips();
    _renderExamChips();
    _renderAttachments();
    if (_isRecording && _recognition) { _recognition.stop(); _setRecording(false); }
    const dd = document.getElementById('docPageSaveDd');
    if (dd) { dd.hidden = true; const smb = document.getElementById('docPageSaveMoreBtn'); if (smb) smb.setAttribute('aria-expanded', 'false'); }
    const editorPage  = document.getElementById('docsEditorPage');
    const headCard    = document.getElementById('docsHeadCard');
    const contentCard = document.getElementById('docsContentCard');
    if (editorPage)  editorPage.hidden  = true;
    if (headCard)    headCard.hidden    = false;
    if (contentCard) contentCard.hidden = false;
    setState(document.querySelectorAll('#docsList .doc-card').length > 0);
  }

  /* ──────────────────────────────────────────
     پیوست فایل
  ─────────────────────────────────────────── */
  function _addAttachment(file) {
    _attachments.push({ name: file.name, size: file.size, file });
    _renderAttachments();
  }

  function _renderAttachments() {
    const fileIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6C4 4.89543 4.89543 4 6 4H14L20 10V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 4V9C14 9.55228 14.4477 10 15 10H20" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
    const html = _attachments.map((att, idx) => `
      <div class="doc-attachment-item">
        <div class="doc-attachment-item__icon">${fileIconSvg}</div>
        <div class="doc-attachment-item__content">
          <span class="doc-attachment-item__name" title="${att.name}">${att.name}</span>
          <span class="doc-attachment-item__size">${_formatFileSize(att.size)}</span>
        </div>
        <button class="doc-attachment-item__remove" type="button" data-idx="${idx}" aria-label="حذف پیوست">${_closeSvg}</button>
      </div>
    `).join('');
    // Render to BOTH containers to keep them always in sync
    ['docAttachmentsArea', 'docPageAttachmentsArea'].forEach(id => {
      const area = document.getElementById(id);
      if (area) area.innerHTML = html;
    });
  }

  function _formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function _updateCardAttachments(card, filesMeta) {
    const attEl = card.querySelector('.doc-card__attachments');
    if (!attEl) return;
    const clipSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6C4 4.89543 4.89543 4 6 4H14L20 10V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 4V9C14 9.55228 14.4477 10 15 10H20" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
    attEl.innerHTML = filesMeta.map(f =>
      `<span class="doc-card__file-tag">${clipSvg}${f.name}</span>`
    ).join('');
  }

  /* ──────────────────────────────────────────
     ورودی صوتی
  ─────────────────────────────────────────── */
  let _voiceTimer = null;
  let _voiceSeconds = 0;

  function _toggleVoice() {
    const overlay = document.getElementById('docVoiceModal');
    if (!overlay) return;
    _voiceSeconds = 0;
    const timeEl = document.getElementById('docVoiceTime');
    if (timeEl) timeEl.textContent = '۰:۰۰:۰۰';
    _resetSpectrumBars();
    overlay.hidden = false;
  }

  function _startVoiceRecording() {
    // UI همیشه اول آپدیت می‌شود — مستقل از SR
    _setRecording(true);
    clearInterval(_voiceTimer);
    _voiceTimer = setInterval(_tickVoiceTimer, 1000);

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return; // بدون SR — UI کار می‌کند ولی صدا ضبط نمی‌شود

    const editorId = _editorPageOpen ? 'docPageFieldBody' : 'docFieldBody';

    // inner function — هر بار instance جدید می‌سازد
    function _startSR() {
      if (!_isRecording) return; // اگر pause شده بود، restart نکن
      _recognition = new SR();
      _recognition.lang = 'fa-IR';
      _recognition.continuous = true;
      _recognition.interimResults = false;
      _recognition.onresult = (e) => {
        const editor = document.getElementById(editorId);
        if (!editor) return;
        const transcript = Array.from(e.results)
          .slice(e.resultIndex)
          .map(r => r[0].transcript)
          .join('');
        editor.focus();
        document.execCommand('insertText', false, transcript);
      };
      // onend همیشه بعد از onerror فایر می‌شود — اینجا restart می‌کنیم
      _recognition.onend = _startSR;
      // onerror هیچ کاری نمی‌کند — onend بعد از آن فایر می‌شود و handle می‌کند
      _recognition.onerror = () => {};
      try { _recognition.start(); } catch (e) {}
    }

    _startSR();
  }

  /* توقف موقت — state بارها و تایمر حفظ می‌شود */
  function _pauseVoiceRecording() {
    _setRecording(false);    // اول false کن تا _startSR در onend برنگردد
    if (_recognition) {
      _recognition.onend   = null;
      _recognition.onerror = null;
      try { _recognition.stop(); } catch (e) {}
      _recognition = null;
    }
    clearInterval(_voiceTimer);
    _voiceTimer = null;
  }

  /* توقف کامل — همه state ریست می‌شود (close / convert / retry) */
  function _stopVoiceRecording() {
    _pauseVoiceRecording();
    _voiceSeconds = 0;
    _resetSpectrumBars();
    const timeEl = document.getElementById('docVoiceTime');
    if (timeEl) timeEl.textContent = '۰:۰۰:۰۰';
  }

  /* پاک کردن حالت فعال همه بارها */
  function _resetSpectrumBars() {
    document.querySelectorAll('.doc-voice-spectrum span.is-active').forEach(bar => {
      bar.classList.remove('is-active');
    });
  }

  function _closeVoiceModal() {
    const overlay = document.getElementById('docVoiceModal');
    if (!overlay) return;
    _stopVoiceRecording();
    overlay.classList.add('is-closing');
    setTimeout(() => {
      overlay.hidden = true;
      overlay.classList.remove('is-closing');
    }, 300);
  }

  function _tickVoiceTimer() {
    _voiceSeconds++;
    const h = Math.floor(_voiceSeconds / 3600);
    const m = Math.floor((_voiceSeconds % 3600) / 60);
    const s = _voiceSeconds % 60;
    const pad = n => String(n).padStart(2, '0');
    const el = document.getElementById('docVoiceTime');
    if (el) el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    // هر ثانیه یک بار — از چپ به راست فعال می‌شود
    const bars = [...document.querySelectorAll('.doc-voice-spectrum span:not(.doc-voice-spectrum__progress)')];
    const barIdx = bars.length - _voiceSeconds;
    if (barIdx >= 0) bars[barIdx].classList.add('is-active');
  }

  function _setRecording(recording) {
    _isRecording = recording;
    ['docVoiceBtn', 'docPageVoiceBtn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.toggle('doc-modal__extra-btn--recording', recording);
    });
    const playStopBtn = document.getElementById('docVoiceStopRecordBtn');
    if (playStopBtn) {
      playStopBtn.classList.toggle('is-recording', recording);
      playStopBtn.setAttribute('aria-label', recording ? 'توقف ضبط' : 'شروع ضبط');
    }
  }

  function _formatDate(date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} - ساعت ${h}:${m}`;
  }

  document.addEventListener('DOMContentLoaded', _init);

  return { setState, openModal: _openModal };
})();


/* ============================================================
   ProfileAccess — تب دسترسی مدیران
   ============================================================ */
const ProfileAccess = (() => {
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    // تاگل switch دسترسی به نتیجه تفسیر
    const interpSwitch = document.getElementById('interpAccessSwitch');
    if (interpSwitch) {
      interpSwitch.addEventListener('change', _updateInterpStatus);
    }

    // سرچ — فیلتر ردیف‌ها بر اساس نام
    const searchInput = document.getElementById('profileAccessSearch');
    if (searchInput) {
      searchInput.addEventListener('input', _onSearch);
    }

    // حذف ردیف مدیر (event delegation روی list)
    const list = document.getElementById('profileAccessList');
    if (list) {
      list.addEventListener('click', _onDeleteClick);
    }
  }

  function _onSearch(e) {
    const q = e.target.value.trim().toLowerCase();
    const list = document.getElementById('profileAccessList');
    const empty = document.getElementById('profileAccessEmpty');
    if (!list) return;

    let visible = 0;
    list.querySelectorAll('.profile-access-modal__row').forEach(function(row) {
      const nameEl = row.querySelector('.profile-access-modal__user-name');
      const text = nameEl ? nameEl.textContent.toLowerCase() : '';
      const match = !q || text.includes(q);
      row.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (empty) empty.style.display = visible === 0 ? '' : 'none';
  }

  function _onDeleteClick(e) {
    const btn = e.target.closest('.profile-access-modal__delete-btn');
    if (!btn) return;
    const row = btn.closest('.profile-access-modal__row');
    if (!row) return;
    row.remove();

    const list = document.getElementById('profileAccessList');
    const empty = document.getElementById('profileAccessEmpty');
    if (list && empty) {
      const remaining = list.querySelectorAll('.profile-access-modal__row');
      empty.style.display = remaining.length === 0 ? '' : 'none';
    }
  }

  function _updateInterpStatus() {
    const statusEl  = document.getElementById('interpStatusLine2');
    const switchEl  = document.getElementById('interpAccessSwitch');
    if (!statusEl || !switchEl) return;
    if (switchEl.checked) {
      statusEl.textContent = 'دسترسی دارد';
      statusEl.classList.add('access-interp-status__line2--on');
    } else {
      statusEl.textContent = 'دسترسی ندارد';
      statusEl.classList.remove('access-interp-status__line2--on');
    }
  }

  document.addEventListener('DOMContentLoaded', _init);

  return {};
})();
