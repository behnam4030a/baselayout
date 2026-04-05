/* =============================================
   User Profile Page — JS
   ============================================= */

/* ==========================================
   Tab Switching
   ========================================== */
const UserProfileTabs = (() => {
  function _init() {
    const tabs = document.querySelectorAll('.up-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const panelId = 'tab-' + tab.dataset.tab;

        tabs.forEach(t => {
          t.classList.remove('up-tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.up-tab-panel').forEach(p => { p.hidden = true; });

        tab.classList.add('up-tab--active');
        tab.setAttribute('aria-selected', 'true');
        const panel = document.getElementById(panelId);
        if (panel) panel.hidden = false;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', _init);
})();

/* ==========================================
   UpgradeModal
   ========================================== */
const UpgradeModal = (() => {
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    const dropzone = document.getElementById('upgradeDropzone');
    const fileInput = document.getElementById('upgradeFileInput');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('is-dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
      _addFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => {
      _addFiles(fileInput.files);
      fileInput.value = '';
    });
  }

  // Zip document SVG icon (40×40)
  var _zipIconSvg =`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M15.4133 32.6684V34.9971M15.4133 25.7541V28.0827M15.4133 18.8382V21.1669M15.4133 11.9224V14.2511M15.4133 5.00659V7.33529" stroke="#59595A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22.9761 5.00006C23.9056 5.00006 24.7961 5.37801 25.4401 6.04958L31.7583 12.6322C32.3699 13.2681 32.7106 14.1165 32.7106 14.9989V28.6055C32.7349 32.0332 30.0389 34.8605 26.6161 35L13.407 34.9983C9.95182 34.9222 7.21363 32.0607 7.28988 28.6055V11.0944C7.37098 7.69606 10.1562 4.98546 13.5562 5.00006H22.9761Z" stroke="#59595A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M23.7825 5.10425V9.92526C23.781 12.2774 25.6853 14.1883 28.039 14.1931H32.6038" stroke="#59595A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  // Trash/delete SVG icon (20×20)
  var _trashIconSvg =`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.0895 3.76294C8.84283 3.76294 8.61883 3.90668 8.51608 4.13088L7.83422 5.61821C7.73239 5.84034 7.51044 5.98276 7.26608 5.98276H5.06657C4.73546 5.98276 4.46704 6.25117 4.46704 6.58227V7.48911C4.46704 7.60631 4.56206 7.70132 4.67926 7.70132H16.1541C16.2712 7.70132 16.3663 7.60631 16.3663 7.48911V6.58227C16.3663 6.25117 16.0978 5.98276 15.7667 5.98276H13.5672C13.3228 5.98276 13.1009 5.84034 12.9991 5.61821L12.3172 4.13088C12.2144 3.90668 11.9904 3.76294 11.7438 3.76294H9.0895ZM7.37977 3.60997C7.68622 2.94151 8.35417 2.51294 9.0895 2.51294H11.7438C12.4792 2.51294 13.1471 2.94151 13.4535 3.60997L13.9683 4.73276H15.7667C16.7882 4.73276 17.6163 5.56081 17.6163 6.58227V7.48911C17.6163 8.29666 16.9616 8.95134 16.1541 8.95134H4.67926C3.8717 8.95134 3.21704 8.29666 3.21704 7.48911V6.58227C3.21704 5.56081 4.0451 4.73276 5.06657 4.73276H6.86506L7.37977 3.60997Z" fill="#59595A"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.12524 7.76367C5.47042 7.76367 5.75024 8.04349 5.75024 8.38866V15.6267C5.75024 16.6761 6.5883 17.5134 7.60572 17.5134H13.2281C14.2455 17.5134 15.0836 16.6761 15.0836 15.6267V8.38866C15.0836 8.04349 15.3634 7.76367 15.7086 7.76367C16.0538 7.76367 16.3336 8.04349 16.3336 8.38866V15.6267C16.3336 17.3517 14.9506 18.7634 13.2281 18.7634H7.60572C5.88328 18.7634 4.50024 17.3517 4.50024 15.6267V8.38866C4.50024 8.04349 4.78007 7.76367 5.12524 7.76367Z" fill="#59595A"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.00806 10.6934C9.35322 10.6934 9.63306 10.9732 9.63306 11.3184V15.0754C9.63306 15.4205 9.35322 15.7004 9.00806 15.7004C8.66289 15.7004 8.38306 15.4205 8.38306 15.0754V11.3184C8.38306 10.9732 8.66289 10.6934 9.00806 10.6934ZM11.8251 10.6934C12.1702 10.6934 12.4501 10.9732 12.4501 11.3184V15.0754C12.4501 15.4205 12.1702 15.7004 11.8251 15.7004C11.4799 15.7004 11.2001 15.4205 11.2001 15.0754V11.3184C11.2001 10.9732 11.4799 10.6934 11.8251 10.6934Z" fill="#59595A"/>
    </svg>`;

  // Retry SVG icon (20×20)
  var _retryIconSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8.72092 6.91107L6.63745 4.82761L8.72092 2.74414" stroke="#59595A" stroke-width="1.5" stroke-linecap="square"/>
      <path d="M11.2793 13.0891L13.3627 15.1726L11.2793 17.2561" stroke="#59595A" stroke-width="1.5" stroke-linecap="square"/>
      <path d="M12.8885 15.174H8.70708C5.27851 15.174 2.5 12.3947 2.5 8.96693V8.70776" stroke="#59595A" stroke-width="1.5" stroke-linecap="square"/>
      <path d="M7.15234 4.82739H11.2926C14.7211 4.82739 17.4997 7.60673 17.4997 11.0344V11.2937" stroke="#59595A" stroke-width="1.5" stroke-linecap="square"/>
    </svg>`;

  function _formatSize(bytes) {
    if (bytes < 1024) return bytes + ' بایت';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' کیلوبایت';
    return (bytes / (1024 * 1024)).toFixed(1) + ' مگابایت';
  }

  var _MAX_SIZE = 20 * 1024 * 1024; // 20 MB

  function _isValidFile(file) {
    // Only .zip files are acceptable; anything else or oversized → error
    var ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'zip') return false;
    if (file.size > _MAX_SIZE) return false;
    return true;
  }

  function _buildNormalRow(file) {
    var row = document.createElement('div');
    row.className = 'up-file-row';

    // RTL DOM order: [zip-icon RIGHT] | [info MIDDLE] | [actions LEFT]
    row.innerHTML =
      '<div class="up-file-row__zip-icon">' + _zipIconSvg + '</div>' +
      '<div class="up-file-row__info">' +
        '<span class="up-file-row__name">' + _escapeHtml(file.name) + '</span>' +
        '<span class="up-file-row__size">' + _formatSize(file.size) + '</span>' +
      '</div>' +
      '<div class="up-file-row__actions">' +
        '<button class="up-file-row__btn up-file-row__btn--remove" type="button" aria-label="حذف فایل">' +
          _trashIconSvg +
        '</button>' +
      '</div>';

    row.querySelector('.up-file-row__btn--remove').addEventListener('click', function () {
      row.remove();
    });

    return row;
  }

  function _setRowError(row, file) {
    row.classList.add('up-file-row--error');

    // Replace size span with error div
    var sizeEl = row.querySelector('.up-file-row__size');
    if (sizeEl) {
      var sizeDiv = document.createElement('div');
      sizeDiv.className = 'up-file-row__size';
      sizeDiv.innerHTML =
        '<span class="up-file-row__size-val">' + _formatSize(file.size) + ' .</span>' +
        '<span class="up-file-row__error-text">فایل ناقص است</span>';
      sizeEl.parentNode.replaceChild(sizeDiv, sizeEl);
    }

    // Add retry button before trash
    var actions = row.querySelector('.up-file-row__actions');
    var retryBtn = document.createElement('button');
    retryBtn.className = 'up-file-row__btn up-file-row__btn--retry';
    retryBtn.type = 'button';
    retryBtn.setAttribute('aria-label', 'تلاش مجدد');
    retryBtn.innerHTML = _retryIconSvg;
    retryBtn.addEventListener('click', function () {
      _resetToNormal(row, file);
      _simulateLoad(row, file);
    });
    actions.insertBefore(retryBtn, actions.firstChild);
  }

  function _resetToNormal(row, file) {
    row.classList.remove('up-file-row--error');

    // Remove retry button
    var retryBtn = row.querySelector('.up-file-row__btn--retry');
    if (retryBtn) retryBtn.remove();

    // Replace error div with normal size span
    var sizeEl = row.querySelector('.up-file-row__size');
    if (sizeEl && sizeEl.tagName === 'DIV') {
      var sizeSpan = document.createElement('span');
      sizeSpan.className = 'up-file-row__size';
      sizeSpan.textContent = _formatSize(file.size);
      sizeEl.parentNode.replaceChild(sizeSpan, sizeEl);
    }
  }

  function _addFiles(files) {
    var list = document.getElementById('upgradeFileList');
    if (!list) return;

    Array.from(files).forEach(function (file) {
      list.appendChild(_buildNormalRow(file));
    });
  }

  function _escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function open() {
    _init();
    Modal.open('upgrade-modal');
  }

  function close() {
    Modal.close('upgrade-modal');
  }

  function submitDocs() {
    close();
    const defaultEl  = document.getElementById('upgradeStateDefault');
    const pendingEl  = document.getElementById('upgradeStatePending');
    if (defaultEl)  defaultEl.hidden  = true;
    if (pendingEl)  pendingEl.hidden  = false;
  }

  return { open, close, submitDocs };
})();

/* ==========================================
   EditProfileModal
   ========================================== */
const EditProfileModal = (() => {
  let _initialized = false;

  // فیلدهای حقوقی که بعد از احراز فعال می‌شوند
  const _HAQOUQI_LOCKABLE = [
    'epmCompanyName', 'epmRegNum', 'epmEconCode',
    'epmOfficePhone', 'epmMobilePhone', 'epmCompEmail', 'epmCompAddress'
  ];

  function _setHaqouqiVerified(verified) {
    const tag = document.getElementById('epmVerifiedTag');
    const nationalInput = document.getElementById('epmCompNationalId');

    if (tag) tag.hidden = !verified;

    if (nationalInput) {
      if (verified) {
        nationalInput.setAttribute('readonly', '');
        nationalInput.removeAttribute('disabled');
      } else {
        nationalInput.removeAttribute('readonly');
      }
    }

    _HAQOUQI_LOCKABLE.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const wrapper = el.closest('.input, .textarea');

      if (verified) {
        el.removeAttribute('disabled');
        if (wrapper) {
          wrapper.classList.remove('input--disabled', 'textarea--disabled');
        }
        // لیبل را هم فعال کن
        const field = el.closest('.epm-field');
        if (field) {
          field.querySelectorAll('.label').forEach(l => l.classList.remove('label--disabled'));
        }
      } else {
        el.setAttribute('disabled', '');
        if (wrapper) {
          wrapper.classList.add(
            wrapper.classList.contains('textarea') ? 'textarea--disabled' : 'input--disabled'
          );
        }
        const field = el.closest('.epm-field');
        if (field) {
          field.querySelectorAll('.label').forEach(l => l.classList.add('label--disabled'));
        }
      }
    });
  }

  function _init() {
    if (_initialized) return;
    _initialized = true;

    const cards       = document.querySelectorAll('.epm-radio-card');
    const fieldsHaqiqi  = document.getElementById('epmFieldsHaqiqi');
    const fieldsHaqouqi = document.getElementById('epmFieldsHaqouqi');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('epm-radio-card--active'));
        card.classList.add('epm-radio-card--active');

        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        if (card.id === 'epmCardHaqiqi') {
          fieldsHaqiqi.hidden  = false;
          fieldsHaqouqi.hidden = true;
        } else {
          fieldsHaqiqi.hidden  = true;
          fieldsHaqouqi.hidden = false;
        }
      });
    });

    // دکمه استعلام شناسه ملی
    const submitBtn = document.getElementById('epmSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const isHaqouqi = !fieldsHaqouqi.hidden;
        if (!isHaqouqi) return;
        _setHaqouqiVerified(true);
      });
    }
  }

  function open() {
    _init();
    Modal.open('edit-profile-modal');
  }

  function close() {
    Modal.close('edit-profile-modal');
  }

  return { open, close };
})();

/* ==========================================
   GaOtpModal (Google Authenticator)
   ========================================== */
const SecurityTab = (() => {
  // method: 'sms' | 'ga'
  function activate(method) {
    var other = method === 'sms' ? 'ga' : 'sms';

    // نمایش حالت فعال برای این روش
    var thisInactive = document.getElementById('up2fa' + _cap(method) + 'Inactive');
    var thisActive   = document.getElementById('up2fa' + _cap(method) + 'Active');
    if (thisInactive) thisInactive.hidden = true;
    if (thisActive)   thisActive.hidden   = false;

    // پنهان کردن کامل ردیف روش دیگر
    var otherRow = document.getElementById('up2faRow' + _cap(other));
    if (otherRow) otherRow.hidden = true;
  }

  function deactivate(method) {
    var other = method === 'sms' ? 'ga' : 'sms';

    // برگشت این ردیف به حالت غیرفعال
    var thisInactive = document.getElementById('up2fa' + _cap(method) + 'Inactive');
    var thisActive   = document.getElementById('up2fa' + _cap(method) + 'Active');
    if (thisActive)   thisActive.hidden   = true;
    if (thisInactive) thisInactive.hidden = false;

    // نمایش مجدد ردیف روش دیگر
    var otherRow = document.getElementById('up2faRow' + _cap(other));
    if (otherRow) otherRow.hidden = false;
  }

  function _cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return { activate, deactivate };
})();

const GaOtpModal = (() => {
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    var form = document.getElementById('gaOtpForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        SecurityTab.activate('ga');
        GaOtpModal.close();
      });
    }
  }

  function open() {
    _init();
    Modal.open('ga-otp-modal');
  }

  function close() {
    Modal.close('ga-otp-modal');
  }

  return { open, close };
})();

/* ==========================================
   SmsOtpModal
   ========================================== */
const SmsOtpModal = (() => {
  let _initialized = false;

  function _showStep(n) {
    var s1 = document.getElementById('smsOtpStep1');
    var s2 = document.getElementById('smsOtpStep2');
    if (!s1 || !s2) return;
    s1.hidden = (n !== 1);
    s2.hidden = (n !== 2);

    var subtitle = document.getElementById('smsOtpSubtitle');
    if (n === 2 && subtitle) {
      var phone = document.getElementById('smsOtpPhone');
      var num = phone ? phone.value.trim() : '';
      subtitle.textContent = 'کد یکبار مصرف به شماره ' + (num || '---') + ' ارسال شد';
    } else if (n === 1 && subtitle) {
      subtitle.textContent = 'شماره همراهی که مایل به دریافت کد با آن هستید را وارد کنید';
    }
  }

  function _getBoxes() {
    return Array.from(document.querySelectorAll('#smsOtpBoxes .sms-otp-box'));
  }

  function _clearOtp() {
    _getBoxes().forEach(function(box) { box.value = ''; });
  }

  function _initOtpBoxes() {
    var boxes = _getBoxes();
    boxes.forEach(function(box, i) {
      box.addEventListener('input', function() {
        box.value = box.value.replace(/[^0-9]/g, '').slice(0, 1);
        if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
      });
      box.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus();
      });
      box.addEventListener('paste', function(e) {
        e.preventDefault();
        var text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        boxes.forEach(function(b, j) { b.value = text[j] || ''; });
        var last = Math.min(text.length, boxes.length) - 1;
        if (last >= 0) boxes[last].focus();
      });
    });
  }

  function _init() {
    if (_initialized) return;
    _initialized = true;

    // Step 1 form submit → go to step 2
    var form1 = document.getElementById('smsOtpStep1');
    if (form1) {
      form1.addEventListener('submit', function(e) {
        e.preventDefault();
        _showStep(2);
        var first = document.querySelector('#smsOtpBoxes .sms-otp-box');
        if (first) setTimeout(function() { first.focus(); }, 50);
      });
    }

    // Step 2 form submit → activate + close modal
    var form2 = document.getElementById('smsOtpStep2');
    if (form2) {
      form2.addEventListener('submit', function(e) {
        e.preventDefault();
        SecurityTab.activate('sms');
        SmsOtpModal.close();
      });
    }

    // Change phone → back to step 1
    var changeBtn = document.getElementById('smsOtpChangePhone');
    if (changeBtn) {
      changeBtn.addEventListener('click', function() {
        _clearOtp();
        _showStep(1);
      });
    }

    // Resend code (placeholder)
    var resendBtn = document.getElementById('smsOtpResendBtn');
    if (resendBtn) {
      resendBtn.addEventListener('click', function() {
        _clearOtp();
        var first = document.querySelector('#smsOtpBoxes .sms-otp-box');
        if (first) first.focus();
      });
    }

    _initOtpBoxes();
  }

  function _reset() {
    var phone = document.getElementById('smsOtpPhone');
    if (phone) phone.value = '';
    _clearOtp();
    _showStep(1);
    var subtitle = document.getElementById('smsOtpSubtitle');
    if (subtitle) subtitle.textContent = 'شماره همراهی که مایل به دریافت کد با آن هستید را وارد کنید';
  }

  function open() {
    _init();
    _reset();
    Modal.open('sms-otp-modal');
  }

  function close() {
    Modal.close('sms-otp-modal');
  }

  return { open, close };
})();

/* ==========================================
   ChangePasswordModal
   ========================================== */
const ChangePasswordModal = (() => {
  let _initialized = false;

  // -------- password strength --------
  function _calcStrength(val) {
    if (!val) return 0;
    var score = 0;
    if (val.length >= 8)          score++;
    if (/[A-Z]/.test(val))        score++;
    if (/[a-z]/.test(val))        score++;
    if (/[0-9]/.test(val))        score++;
    return score; // 0-4
  }

  var _STRENGTH_LABELS = ['', 'ضعیف', 'متوسط', 'خوب', 'بسیار قوی'];
  var _STRENGTH_KEYS   = ['', 'weak', 'fair', 'good', 'strong'];

  function _updateStrength(val) {
    var status = document.getElementById('cpmStrengthStatus');
    if (!status) return;

    var score = _calcStrength(val);

    status.className = 'cpm-strength-status';
    status.textContent = '';

    if (score === 0) return;

    var key = _STRENGTH_KEYS[score];
    status.classList.add('cpm-strength-status--' + key);
    status.textContent = 'امنیت: ' + _STRENGTH_LABELS[score];
  }

  // -------- eye toggle --------
  function _toggleEye(btn) {
    var targetId = btn.dataset.target;
    var input = document.getElementById(targetId);
    if (!input) return;
    var visible = btn.classList.toggle('cpm-eye-btn--visible');
    input.type = visible ? 'text' : 'password';
  }

  function _init() {
    if (_initialized) return;
    _initialized = true;

    var modal = document.getElementById('change-password-modal');
    if (!modal) return;

    // eye toggle — direct listener on each button
    modal.querySelectorAll('.cpm-eye-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        _toggleEye(btn);
      });
      btn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          _toggleEye(btn);
        }
      });
    });

    // strength meter on new password input
    var newPass = document.getElementById('cpmNewPass');
    if (newPass) {
      newPass.addEventListener('input', function() {
        _updateStrength(newPass.value);
      });
    }

    // form submit → close modal
    var form = document.getElementById('cpmForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        ChangePasswordModal.close();
      });
    }
  }

  function _resetFields() {
    var modal = document.getElementById('change-password-modal');
    ['cpmCurrentPass', 'cpmNewPass', 'cpmConfirmPass'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) { el.value = ''; el.type = 'password'; }
    });
    if (modal) {
      modal.querySelectorAll('.cpm-eye-btn').forEach(function(btn) {
        btn.classList.remove('cpm-eye-btn--visible');
      });
    }
    _updateStrength('');
  }

  function open() {
    _init();
    _resetFields();
    Modal.open('change-password-modal');
  }

  function close() {
    Modal.close('change-password-modal');
  }

  return { open, close };
})();
