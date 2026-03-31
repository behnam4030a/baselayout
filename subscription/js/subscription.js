/* =================================================================
   Subscription Page — JS
   ================================================================= */

/* =================================================================
   Custom Plan Modal — 3-step wizard
   ================================================================= */

const CustomPlanModal = (() => {
  'use strict';

  /* ---- State ---- */
  var _duration = 1;      // months
  var _discount  = 25;    // percent
  var _currentStep = 1;
  var _expandedModule = null; // id of currently expanded module card

  /* Duration display labels */
  var _durationLabels = ['1 ماه', '2 ماه', '3 ماه', '6 ماه', '12 ماه'];
  var _durationIdx = 0;

  /* Module descriptions (for expanded panel) */
  var _moduleData = {
    marketing:  { name: 'ماژول بازاریابی', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد.' },
    finance:    { name: 'ماژول مالی',      desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می‌طلبد تا با نرم افزارها شناخت بیشتری برای طراحان رایانه‌ای علی‌الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.' },
    inventory:  { name: 'ماژول انبارداری', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. در این صورت می‌توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد.' },
    sales:      { name: 'ماژول فروش',      desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جواب‌گویی سوالات پیوسته دنیای موجود طراحی اساساً مورد استفاده قرار گیرد.' }
  };

  /* ---- Helpers ---- */
  function _el(id) {
    return document.getElementById(id);
  }

  function _updateDurationDisplay() {
    var el = _el('cpm-duration-val');
    if (el) el.textContent = _durationLabels[_durationIdx] || _durationLabels[0];
  }

  function _updateDiscountDisplay() {
    var el = _el('cpm-discount-val');
    if (el) el.textContent = _discount + '%';
  }

  function _updateSummary() {
    var sumDur = _el('cpm-sum-duration');
    var sumDisc = _el('cpm-sum-discount');
    var sumFeat = _el('cpm-sum-features');

    if (sumDur) sumDur.textContent = 'هر ' + (_durationLabels[_durationIdx] || '1 ماه');
    if (sumDisc) sumDisc.textContent = _discount + '% به ازای هر آزمون';

    if (sumFeat) {
      var checked = document.querySelectorAll('#cpm-step-2 .checkbox__input:checked');
      if (checked.length === 0) {
        sumFeat.innerHTML = '<span>—</span>';
      } else {
        var names = [];
        checked.forEach(function (inp) {
          var key = inp.getAttribute('data-module');
          if (key && _moduleData[key]) names.push(_moduleData[key].name);
        });
        var parts = names.map(function (n) { return '<span>' + n + '</span>'; });
        sumFeat.innerHTML = parts.join('<span class="cpm-feat-sep">|</span>');
      }
    }
  }

  /* ---- Public: open/close ---- */
  function open() {
    // Reset to step 1 on every open
    _goToStep(1, true);
    Modal.open('custom-plan-modal');
  }

  function close() {
    Modal.close('custom-plan-modal');
  }

  /* ---- Public: step navigation ---- */
  function goToStep(n) {
    _goToStep(n, false);
  }

  function _goToStep(n, reset) {
    // Hide all steps
    [1, 2, 3].forEach(function (i) {
      var step = _el('cpm-step-' + i);
      if (step) {
        step.classList.remove('cpm-step--active');
      }
    });

    // Close expanded panel if switching from step 2
    if (_currentStep === 2 && n !== 2) {
      closeModulePanel();
    }

    _currentStep = n;

    var target = _el('cpm-step-' + n);
    if (target) target.classList.add('cpm-step--active');

    // Update summary when entering step 3
    if (n === 3) _updateSummary();

    // Scroll to top of scroll area
    var scroll = target && target.querySelector('.cpm-scroll');
    if (scroll) scroll.scrollTop = 0;
  }

  /* ---- Public: stepper ---- */
  function stepperChange(field, delta) {
    if (field === 'duration') {
      _durationIdx = Math.max(0, Math.min(_durationLabels.length - 1, _durationIdx + delta));
      _updateDurationDisplay();
    } else if (field === 'discount') {
      _discount = Math.max(0, Math.min(100, _discount + delta * 5));
      _updateDiscountDisplay();
    }
  }

  /* ---- Public: module checkbox ---- */
  function toggleModule(inputEl) {
    // Nothing extra needed — checkbox handles its own state
    // Uncheck is handled naturally
  }

  /* ---- Public: discount code wrap toggle ---- */
  function toggleDiscountWrap() {
    var wrap = _el('cpmDiscountWrap');
    var btn  = _el('cpmDiscountBtn');
    if (!wrap) return;
    if (wrap.hasAttribute('hidden')) {
      wrap.removeAttribute('hidden');
      if (btn) btn.textContent = 'بستن';
    } else {
      wrap.setAttribute('hidden', '');
      if (btn) btn.textContent = 'وارد کنید';
      var input = _el('cpmDiscountInput');
      if (input) input.value = '';
    }
  }

  function _resetDiscountWrap() {
    var wrap = _el('cpmDiscountWrap');
    var btn  = _el('cpmDiscountBtn');
    if (wrap) wrap.setAttribute('hidden', '');
    if (btn) btn.textContent = 'وارد کنید';
    var input = _el('cpmDiscountInput');
    if (input) input.value = '';
  }

  /* ---- Public: module panel (expanded) ---- */
  function toggleModulePanel(btnEl) {
    var moduleKey = btnEl.getAttribute('data-module');
    var moduleName = btnEl.getAttribute('data-module-name');

    if (_expandedModule === moduleKey) {
      // Close if same module clicked again
      closeModulePanel();
      return;
    }

    // Close previous
    if (_expandedModule) {
      var prevCard = _el('cpm-mod-' + _expandedModule);
      if (prevCard) {
        prevCard.classList.remove('cpm-module-card--expanded');
        var prevBtn = prevCard.querySelector('.cpm-module-intro-btn');
        if (prevBtn) prevBtn.innerHTML = 'معرفی ماژول <svg class="cpm-intro-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.4029 7.76386C10.6713 8.03234 10.6713 8.46765 10.4029 8.73613L8.13905 11L10.4029 13.2639C10.6713 13.5324 10.6713 13.9676 10.4029 14.2361C10.1344 14.5046 9.69913 14.5046 9.43064 14.2361L6.68061 11.4861C6.41213 11.2176 6.41213 10.7824 6.68061 10.5139L9.43064 7.76386C9.69913 7.49538 10.1344 7.49538 10.4029 7.76386Z" fill="#22967D"></path></svg>';
      }
    }

    _expandedModule = moduleKey;

    // Mark card as expanded
    var card = _el('cpm-mod-' + moduleKey);
    if (card) {
      card.classList.add('cpm-module-card--expanded');
      btnEl.innerHTML = 'بستن <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.59712 7.76386C7.86561 7.49538 8.30085 7.49538 8.56934 7.76386L11.3193 10.5139C11.5878 10.7824 11.5878 11.2176 11.3193 11.4861L8.56934 14.2361C8.30085 14.5046 7.86561 14.5046 7.59712 14.2361C7.32863 13.9676 7.32863 13.5324 7.59712 13.2639L9.86092 11L7.59712 8.73613C7.32863 8.46765 7.32863 8.03234 7.59712 7.76386Z" fill="#22967D"/></svg>';
    }

    // Populate expanded panel
    var data = _moduleData[moduleKey];
    if (data) {
      var titleEl = _el('cpm-module-panel-title');
      var bodyEl  = _el('cpm-module-body');
      if (titleEl) titleEl.textContent = 'معرفی ' + data.name;
      if (bodyEl)  bodyEl.textContent  = data.desc;
    }

    // Open panel
    Modal.openPanel('cpm-module-panel');
  }

  function closeModulePanel() {
    Modal.closePanel('cpm-module-panel');

    // Reset expanded card state
    if (_expandedModule) {
      var card = _el('cpm-mod-' + _expandedModule);
      if (card) {
        card.classList.remove('cpm-module-card--expanded');
        var btn = card.querySelector('.cpm-module-intro-btn');
        if (btn) btn.innerHTML = `معرفی ماژول <svg class="cpm-intro-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.4029 7.76386C10.6713 8.03234 10.6713 8.46765 10.4029 8.73613L8.13905 11L10.4029 13.2639C10.6713 13.5324 10.6713 13.9676 10.4029 14.2361C10.1344 14.5046 9.69913 14.5046 9.43064 14.2361L6.68061 11.4861C6.41213 11.2176 6.41213 10.7824 6.68061 10.5139L9.43064 7.76386C9.69913 7.49538 10.1344 7.49538 10.4029 7.76386Z" fill="#22967D"></path></svg>`;
      }
      _expandedModule = null;
    }
  }

  /* ---- Init: close panel when modal closes ---- */
  function _init() {
    Modal.onClose('custom-plan-modal', function () {
      closeModulePanel();
      _resetDiscountWrap();
    });
  }

  document.addEventListener('DOMContentLoaded', _init);

  return {
    open: open,
    close: close,
    goToStep: goToStep,
    stepperChange: stepperChange,
    toggleModule: toggleModule,
    toggleModulePanel: toggleModulePanel,
    closeModulePanel: closeModulePanel,
    toggleDiscountWrap: toggleDiscountWrap
  };
})();

const SubscriptionPage = (() => {
  'use strict';

  /* Price data per period */
  const _prices = {
    0: { advanced: '۱۲۷،۰۰۰', diamond: '۱۳۷،۰۰۰', plus: '۱۱۷،۰۰۰' },
    1: { advanced: '۳۵۰،۰۰۰', diamond: '۳۸۰،۰۰۰', plus: '۳۲۰،۰۰۰' },
    2: { advanced: '۱،۲۰۰،۰۰۰', diamond: '۱،۳۵۰،۰۰۰', plus: '۱،۱۰۰،۰۰۰' }
  };

  const _priceEls = {
    advanced: null,
    diamond: null,
    plus: null
  };

  function _updatePrices(index) {
    const data = _prices[index];
    if (!data) return;
    if (_priceEls.advanced) _priceEls.advanced.textContent = data.advanced;
    if (_priceEls.diamond)  _priceEls.diamond.textContent  = data.diamond;
    if (_priceEls.plus)     _priceEls.plus.textContent      = data.plus;
  }

  function _setCompareCol(index) {
    document.querySelectorAll('.subs-compare-cell[data-col]').forEach(function (el) {
      el.classList.toggle('subs-compare-col--active', parseInt(el.getAttribute('data-col')) === index);
    });
  }

  function _init() {
    /* Cache price elements */
    const nums = document.querySelectorAll('.subs-plan-price-num');
    if (nums.length >= 3) {
      _priceEls.advanced = nums[0];
      _priceEls.diamond  = nums[1];
      _priceEls.plus     = nums[2];
    }

    if (typeof Tab !== 'undefined') {
      /* Period tab → update prices */
      Tab.onChange('subscription-period', function (index) {
        _updatePrices(index);
      });

      /* Compare plan tab → switch visible column (mobile) */
      Tab.onChange('compare-plan', function (index) {
        _setCompareCol(index);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', _init);

  return {};
})();
