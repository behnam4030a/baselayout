/* ===========================================
   Labels Page JS
   labels/js/labels.js
   =========================================== */

/* ─── AddLabelModal ─────────────────────────────────────── */
const AddLabelModal = (() => {
  let _initialized = false;
  let _editId = null;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    const form         = document.getElementById('labelForm');
    const submitBtn    = document.getElementById('submitLabelBtn');
    const colorInput   = document.getElementById('labelColorInput');
    const colorPreview = document.getElementById('colorPreview');
    const palette      = document.getElementById('colorPalette');

    // باز/بسته شدن پالت با کلیک روی اینپوت
    if (colorInput) {
      colorInput.addEventListener('click', () => {
        const p = document.getElementById('colorPalette');
        if (!p) return;
        if (p.classList.contains('label-color-palette--open')) {
          _closePalette();
        } else {
          _openPalette();
        }
      });
    }

    // رنگ real-time preview (تایپ دستی)
    if (colorInput && colorPreview) {
      colorInput.addEventListener('input', () => {
        const val = colorInput.value.trim();
        const hex = val.startsWith('#') ? val : '#' + val;
        if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
          colorPreview.style.backgroundColor = hex;
          colorPreview.style.borderColor = hex;
          _syncPaletteSelection(hex);
        } else {
          colorPreview.style.backgroundColor = 'transparent';
          colorPreview.style.borderColor = 'var(--stroke)';
          _clearPaletteSelection();
        }
      });
    }

    // انتخاب رنگ از پالت
    if (palette) {
      palette.addEventListener('mousedown', e => e.preventDefault());
      palette.addEventListener('click', _onSwatchClick);
    }

    // ارسال فرم
    if (submitBtn) {
      submitBtn.addEventListener('click', _handleSubmit);
    }

    // reset وقتی modal بسته می‌شود
    Modal.onClose('add-label-modal', _reset);
  }

  function _reset() {
    const form         = document.getElementById('labelForm');
    const colorPreview = document.getElementById('colorPreview');
    const titleEl      = document.getElementById('addLabelModalTitle');
    const submitBtn    = document.getElementById('submitLabelBtn');

    _editId = null;
    if (form) form.reset();
    if (colorPreview) {
      colorPreview.style.backgroundColor = 'transparent';
      colorPreview.style.borderColor = 'var(--stroke)';
    }
    if (titleEl)   titleEl.textContent   = 'افزودن برچسب جدید';
    if (submitBtn) submitBtn.textContent = 'افزودن برچسب';
    _closePalette();
    _clearPaletteSelection();
  }

  function _prefill({ name, color }) {
    const nameInput    = document.getElementById('labelNameInput');
    const colorInput   = document.getElementById('labelColorInput');
    const colorPreview = document.getElementById('colorPreview');
    const titleEl      = document.getElementById('addLabelModalTitle');
    const submitBtn    = document.getElementById('submitLabelBtn');

    if (nameInput)  nameInput.value  = name;
    if (colorInput) colorInput.value = color.replace('#', '');
    if (colorPreview) {
      colorPreview.style.backgroundColor = color;
      colorPreview.style.borderColor = color;
    }
    _syncPaletteSelection(color);
    if (titleEl)   titleEl.textContent   = 'ویرایش برچسب';
    if (submitBtn) submitBtn.textContent = 'ذخیره تغییرات';
  }

  function _openPalette() {
    const palette = document.getElementById('colorPalette');
    if (!palette) return;
    palette.classList.add('label-color-palette--open');
    document.addEventListener('mousedown', _onDocMouseDown);
  }

  function _closePalette() {
    const palette = document.getElementById('colorPalette');
    if (!palette) return;
    palette.classList.remove('label-color-palette--open');
    document.removeEventListener('mousedown', _onDocMouseDown);
  }

  function _onDocMouseDown(e) {
    const wrap = document.querySelector('.label-form__color-wrap');
    if (wrap && !wrap.contains(e.target)) {
      _closePalette();
    }
  }

  function _onSwatchClick(e) {
    const swatch = e.target.closest('.label-color-swatch');
    if (!swatch) return;

    const color = swatch.dataset.color;
    const colorInput   = document.getElementById('labelColorInput');
    const colorPreview = document.getElementById('colorPreview');

    if (colorInput) colorInput.value = color.replace('#', '');
    if (colorPreview) {
      colorPreview.style.backgroundColor = color;
      colorPreview.style.borderColor = color;
    }
    _clearPaletteSelection();
    swatch.classList.add('label-color-swatch--selected');
    _closePalette();
  }

  function _clearPaletteSelection() {
    const palette = document.getElementById('colorPalette');
    if (!palette) return;
    palette.querySelectorAll('.label-color-swatch--selected').forEach(s => {
      s.classList.remove('label-color-swatch--selected');
    });
  }

  function _syncPaletteSelection(hex) {
    const palette = document.getElementById('colorPalette');
    if (!palette) return;
    _clearPaletteSelection();
    const normalized = hex.startsWith('#') ? hex : '#' + hex;
    const match = palette.querySelector(`.label-color-swatch[data-color="${normalized}"]`);
    if (match) match.classList.add('label-color-swatch--selected');
  }

  function _handleSubmit() {
    const nameInput  = document.getElementById('labelNameInput');
    const colorInput = document.getElementById('labelColorInput');

    const name  = nameInput  ? nameInput.value.trim()  : '';
    const color = colorInput ? colorInput.value.trim() : '';

    if (!name) {
      nameInput && nameInput.focus();
      return;
    }

    const hexRaw     = color.startsWith('#') ? color : '#' + color;
    const finalColor = /^#[0-9a-fA-F]{6}$/.test(hexRaw)
      ? hexRaw
      : '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    if (_editId) {
      LabelsPage.updateLabel({ id: _editId, name, color: finalColor });
    } else {
      LabelsPage.addLabel({ name, color: finalColor });
    }
    close();
  }

  function open(label) {
    _init();
    if (label) {
      _editId = label.id;
      Modal.open('add-label-modal');
      _prefill(label);
    } else {
      _editId = null;
      Modal.open('add-label-modal');
    }
  }

  function close() {
    Modal.close('add-label-modal');
  }

  return { open, close };
})();

/* ─── LabelsPage ─────────────────────────────────────────── */
const LabelsPage = (() => {
  let _initialized = false;
  let _labels = [];   // آرایه داده‌های برچسب‌ها
  let _nextId = 100;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    // خواندن برچسب‌های اولیه از DOM
    document.querySelectorAll('.label-card[data-id]').forEach(card => {
      const id    = card.dataset.id;
      const name  = card.querySelector('.label-card__name')  ? card.querySelector('.label-card__name').textContent.trim()  : '';
      const color = card.querySelector('.label-card__dot')   ? card.querySelector('.label-card__dot').style.backgroundColor : '';
      const count = card.querySelector('.label-card__count-num') ? card.querySelector('.label-card__count-num').textContent.trim() : '0';
      _labels.push({ id, name, color, count });
    });

    // تعیین state اولیه
    _updateState();

    // دکمه افزودن برچسب
    const addBtn = document.getElementById('addLabelBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => AddLabelModal.open());
    }

    // event delegation روی لیست (ویرایش + حذف)
    const list = document.getElementById('labelsList');
    if (list) {
      list.addEventListener('click', _onListClick);
    }

    // جستجو
    const searchInput = document.getElementById('labelsSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', _onSearch);
      searchInput.addEventListener('search', _onSearch);
    }
  }

  function _onListClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id     = btn.dataset.id;

    if (action === 'delete') _deleteLabel(id);
    if (action === 'edit')   _editLabel(id);
  }

  function _deleteLabel(id) {
    _labels = _labels.filter(l => l.id !== id);
    const card = document.querySelector(`.label-card[data-id="${id}"]`);
    if (card) card.remove();
    _updateState();
  }

  function _editLabel(id) {
    const label = _labels.find(l => l.id === id);
    if (!label) return;
    AddLabelModal.open(label);
  }

  function _onSearch(e) {
    const q = _normalizeText(e.target.value.trim());
    let visibleCount = 0;

    document.querySelectorAll('.label-card').forEach(card => {
      const nameEl = card.querySelector('.label-card__name');
      const text   = nameEl ? _normalizeText(nameEl.textContent.trim()) : '';
      const match  = q === '' || text.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    const noResultsEl = document.getElementById('labelsNoResults');
    if (noResultsEl) noResultsEl.classList.toggle('hidden', q === '' || visibleCount > 0);
  }

  // نرمال‌سازی متن فارسی: یکسان‌سازی حروف عربی/فارسی و حذف فاصله اضافی
  function _normalizeText(str) {
    return str
      .replace(/ي/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/\u200c/g, '')   // حذف نیم‌فاصله
      .toLowerCase();
  }

  function _updateState() {
    const emptyEl     = document.getElementById('labelsEmpty');
    const listEl      = document.getElementById('labelsList');
    const searchEl    = document.getElementById('labelsSearch');
    const countEl     = document.getElementById('labelsCount');
    const noResultsEl = document.getElementById('labelsNoResults');
    const searchInput = document.getElementById('labelsSearchInput');

    const hasLabels = _labels.length > 0;

    if (emptyEl)     emptyEl.classList.toggle('hidden', hasLabels);
    if (listEl)      listEl.classList.toggle('hidden', !hasLabels);
    if (searchEl)    searchEl.classList.toggle('hidden', !hasLabels);
    if (noResultsEl) noResultsEl.classList.add('hidden');

    // ریست کردن سرچ هنگام تغییر تعداد برچسب‌ها
    if (searchInput && searchInput.value) {
      searchInput.value = '';
      document.querySelectorAll('.label-card').forEach(c => { c.style.display = ''; });
    }

    if (countEl) {
      countEl.textContent = `تعداد: ${_labels.length} عدد`;
    }
  }

  function addLabel({ name, color }) {
    const id = String(++_nextId);
    _labels.push({ id, name, color, count: '0' });

    const listEl = document.getElementById('labelsList');
    if (listEl) {
      const card = _buildCard({ id, name, color, count: '0' });
      listEl.insertAdjacentHTML('beforeend', card);
    }

    _updateState();
  }

  function updateLabel({ id, name, color }) {
    const label = _labels.find(l => l.id === id);
    if (!label) return;

    label.name  = name;
    label.color = color;

    const card = document.querySelector(`.label-card[data-id="${id}"]`);
    if (card) {
      const dotEl  = card.querySelector('.label-card__dot');
      const nameEl = card.querySelector('.label-card__name');
      const delBtn = card.querySelector('[data-action="delete"]');
      if (dotEl)  dotEl.style.backgroundColor = color;
      if (nameEl) nameEl.textContent = name;
      if (delBtn) delBtn.setAttribute('aria-label', `حذف برچسب ${name}`);
    }
  }

  function _buildCard({ id, name, color, count }) {
    return `
    <article class="label-card" data-id="${id}">
      <div class="label-card__info">
        <span class="label-card__dot" style="background-color: ${color};" aria-hidden="true"></span>
        <span class="label-card__name">${_escHtml(name)}</span>
      </div>
      <div class="label-card__count-block">
        <span class="label-card__count-num">${_escHtml(count)}</span>
        <span class="label-card__count-label">کاربران متصل</span>
      </div>
      <div class="label-card__divider" aria-hidden="true"></div>
      <div class="label-card__btns">
        <button class="btn btn--outline label-card__edit-btn" type="button" data-action="edit" data-id="${id}">ویرایش برچسب</button>
        <button class="label-card__delete-btn" type="button" data-action="delete" data-id="${id}" aria-label="حذف برچسب ${_escHtml(name)}">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99877 4.13965C9.72743 4.13965 9.48103 4.29776 9.36801 4.54438L8.61796 6.18044C8.50595 6.42479 8.2618 6.58145 7.99301 6.58145H5.57354C5.20932 6.58145 4.91406 6.8767 4.91406 7.24091V8.23843C4.91406 8.36736 5.01858 8.47187 5.1475 8.47187H17.7698C17.8987 8.47187 18.0032 8.36736 18.0032 8.23843V7.24091C18.0032 6.8767 17.7079 6.58145 17.3437 6.58145H14.9243C14.6554 6.58145 14.4113 6.42479 14.2993 6.18044L13.5493 4.54438C13.4362 4.29776 13.1898 4.13965 12.9185 4.13965H9.99877ZM8.11807 3.97139C8.45516 3.23607 9.1899 2.76465 9.99877 2.76465H12.9185C13.7274 2.76465 14.4621 3.23607 14.7992 3.97139L15.3654 5.20645H17.3437C18.4673 5.20645 19.3782 6.1173 19.3782 7.24091V8.23843C19.3782 9.12675 18.6581 9.84689 17.7698 9.84689H5.1475C4.25919 9.84689 3.53906 9.12675 3.53906 8.23843V7.24091C3.53906 6.11731 4.44993 5.20645 5.57354 5.20645H7.55188L8.11807 3.97139Z" fill="#222323"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.63672 8.54004C6.01641 8.54004 6.32422 8.84784 6.32422 9.22753V17.1894C6.32422 18.3437 7.24608 19.2648 8.36524 19.2648H14.5498C15.669 19.2648 16.5909 18.3437 16.5909 17.1894V9.22753C16.5909 8.84784 16.8987 8.54004 17.2784 8.54004C17.6581 8.54004 17.9659 8.84784 17.9659 9.22753V17.1894C17.9659 19.0868 16.4446 20.6398 14.5498 20.6398H8.36524C6.47055 20.6398 4.94922 19.0868 4.94922 17.1894V9.22753C4.94922 8.84784 5.25703 8.54004 5.63672 8.54004Z" fill="#222323"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.91016 11.7627C10.2898 11.7627 10.5977 12.0705 10.5977 12.4502V16.5829C10.5977 16.9626 10.2898 17.2704 9.91016 17.2704C9.53047 17.2704 9.22266 16.9626 9.22266 16.5829V12.4502C9.22266 12.0705 9.53047 11.7627 9.91016 11.7627ZM13.0089 11.7627C13.3885 11.7627 13.6964 12.0705 13.6964 12.4502V16.5829C13.6964 16.9626 13.3885 17.2704 13.0089 17.2704C12.6292 17.2704 12.3214 16.9626 12.3214 16.5829V12.4502C12.3214 12.0705 12.6292 11.7627 13.0089 11.7627Z" fill="#222323"></path>
                </svg>
        </button>
      </div>
    </article>`;
  }

  function _escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // شروع
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  return { addLabel, updateLabel };
})();
