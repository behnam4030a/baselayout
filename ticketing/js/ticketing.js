/* ============================================
   Ticketing Page — JS
   ============================================ */

/* ── New Ticket Modal ──────────────────────────── */
const NewTicketModal = (() => {
  'use strict';
  var _initialized = false;
  var _pendingFiles = [];

  /* ── File helpers ──────────────────────────── */

  function _fileIconSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">' +
      '<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' +
      '<polyline stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" points="14 2 14 8 20 8"/>' +
      '</svg>';
  }

  function _escapeHtml(text) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(text));
    return d.innerHTML;
  }

  function _addFileTag(file) {
    var tagsContainer = document.getElementById('newTicketFileTags');
    var defaultHint   = document.getElementById('newTicketDropHint');
    if (!tagsContainer) return;

    // Hide default hint when first file added
    if (defaultHint) defaultHint.style.display = 'none';

    var tag = document.createElement('span');
    tag.className = 'new-ticket-file-tag';
    tag.dataset.filename = file.name;
    tag.innerHTML =
      '<span class="new-ticket-file-tag__icon">' + _fileIconSvg() + '</span>' +
      '<span class="new-ticket-file-tag__name">' + _escapeHtml(file.name) + '</span>' +
      '<button class="new-ticket-file-tag__remove" type="button" aria-label="حذف فایل">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none">' +
          '<path stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M18 6 6 18M6 6l12 12"/>' +
        '</svg>' +
      '</button>';

    tag.querySelector('.new-ticket-file-tag__remove').addEventListener('click', function (e) {
      e.stopPropagation();
      _pendingFiles = _pendingFiles.filter(function (f) { return f.name !== file.name; });
      tag.remove();
      // Show default hint again if no files left
      if (_pendingFiles.length === 0 && defaultHint) defaultHint.style.display = '';
    });

    tagsContainer.appendChild(tag);
  }

  function _clearFiles() {
    _pendingFiles = [];
    var tagsContainer = document.getElementById('newTicketFileTags');
    var defaultHint   = document.getElementById('newTicketDropHint');
    if (tagsContainer) tagsContainer.innerHTML = '';
    if (defaultHint)   defaultHint.style.display = '';
    var fileInput = document.getElementById('newTicketFileInput');
    if (fileInput) fileInput.value = '';
  }

  /* ── Init ──────────────────────────────────── */

  function _init() {
    if (_initialized) return;
    _initialized = true;

    // Init select when modal opens
    Modal.onOpen('new-ticket-modal', function () {
      var selectEl = document.getElementById('ticketDeptSelect');
      if (selectEl && !selectEl._selectInstance && typeof Select !== 'undefined') {
        Select.init(selectEl);
      }
    });

    // File drop zone
    var dropZone  = document.getElementById('newTicketDropZone');
    var fileInput = document.getElementById('newTicketFileInput');
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', function (e) {
        // Don't open picker if clicking a remove button
        if (e.target.closest('.new-ticket-file-tag__remove')) return;
        fileInput.click();
      });
      dropZone.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
      });
      dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropZone.classList.add('new-ticket-drop-zone--drag');
      });
      dropZone.addEventListener('dragleave', function () {
        dropZone.classList.remove('new-ticket-drop-zone--drag');
      });
      dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropZone.classList.remove('new-ticket-drop-zone--drag');
        var files = e.dataTransfer && e.dataTransfer.files;
        if (!files) return;
        for (var i = 0; i < files.length; i++) {
          _pendingFiles.push(files[i]);
          _addFileTag(files[i]);
        }
      });
      fileInput.addEventListener('change', function () {
        var files = this.files;
        if (!files || !files.length) return;
        for (var i = 0; i < files.length; i++) {
          _pendingFiles.push(files[i]);
          _addFileTag(files[i]);
        }
        this.value = '';
      });
    }
  }

  function open() {
    _init();
    Modal.open('new-ticket-modal');
  }

  function close() {
    Modal.close('new-ticket-modal');
  }

  function submit(e) {
    e.preventDefault();
    _clearFiles();
    close();
    if (typeof Toast !== 'undefined') {
      Toast.show({ variant: 'success', title: 'تیکت با موفقیت ارسال شد', duration: 3000 });
    }
  }

  return { open: open, close: close, submit: submit };
})();


const TicketingPage = (() => {
  'use strict';

  /* ── Ticket data ─────────────────────────────────── */
  var _tickets = {
    '1': {
      title:    'مشکل در تغییر طرح',
      ticketId: '#341568',
      dept:     'دپارتمان فنی',
      messages: [
        {
          type: 'support',
          text: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز می‌باشد.',
          meta: '۱۵ دقیقه پیش | پشتیبان شماره ۲۲',
          file: { name: 'WordExampleFile.Doc' }
        },
        {
          type: 'user',
          text: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است و برای شرایط فعلی نیاز می‌باشد.',
          meta: 'پشتیبان شماره ۲۲ | ۵ دقیقه پیش'
        }
      ]
    },
    '2': {
      title:    'خرید سازمانی',
      ticketId: '#341567',
      dept:     'دپارتمان مالی',
      messages: [
        {
          type: 'user',
          text: 'سلام، میخواستم ببینم برای خرید تعداد زیاد آیا تخفیف خاصی در نظر گرفته می‌شود؟',
          meta: '۱ ساعت پیش'
        }
      ]
    }
  };

  var _currentTicketId = '1';

  /* _pendingFiles: array of File objects waiting to be sent */
  var _pendingFiles = [];

  /* ── Helpers ─────────────────────────────────────── */

  function _escapeHtml(text) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(text));
    return d.innerHTML;
  }

  function _fileIconSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">' +
      '<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' +
      '<polyline stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" points="14 2 14 8 20 8"/>' +
      '</svg>';
  }

  function _scrollToBottom() {
    var el = document.getElementById('ticketingMessages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  /* ── Bubble builders ─────────────────────────────── */

  function _buildBubble(msg) {
    var bubble = document.createElement('div');
    bubble.className = 'ticketing-bubble ticketing-bubble--' + msg.type;

    var bodyInner = '';

    if (msg.text) {
      bodyInner += '<p class="ticketing-bubble__text">' + _escapeHtml(msg.text) + '</p>';
    }

    if (msg.file) {
      if (msg.text) bodyInner += '<div class="ticketing-bubble__divider"></div>';
      bodyInner +=
        '<span class="tag tag--outline tag--gray tag--medium tag--rounded ticketing-bubble__file">' +
          '<span class="tag__icon">' + _fileIconSvg() + '</span>' +
          '<span class="tag__text">' + _escapeHtml(msg.file.name) + '</span>' +
        '</span>';
    }

    if (msg.files && msg.files.length) {
      if (msg.text) bodyInner += '<div class="ticketing-bubble__divider"></div>';
      for (var i = 0; i < msg.files.length; i++) {
        if (i > 0) bodyInner += '<div style="height:6px"></div>';
        bodyInner +=
          '<span class="tag tag--outline tag--gray tag--medium tag--rounded ticketing-bubble__file">' +
            '<span class="tag__icon">' + _fileIconSvg() + '</span>' +
            '<span class="tag__text">' + _escapeHtml(msg.files[i]) + '</span>' +
          '</span>';
      }
    }

    bubble.innerHTML =
      '<div class="ticketing-bubble__body">' + bodyInner + '</div>' +
      '<div class="ticketing-bubble__meta">' + msg.meta + '</div>';

    return bubble;
  }

  /* ── Render messages ─────────────────────────────── */

  function _renderMessages(messages) {
    var el = document.getElementById('ticketingMessages');
    if (!el) return;
    el.innerHTML = '';
    for (var i = 0; i < messages.length; i++) {
      el.appendChild(_buildBubble(messages[i]));
    }
    _scrollToBottom();
  }

  /* ── Ticket selection ────────────────────────────── */

  function _selectTicket(ticketId) {
    var ticket = _tickets[ticketId];
    if (!ticket) return;
    _currentTicketId = ticketId;

    var items = document.querySelectorAll('.ticketing-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle(
        'ticketing-item--active',
        items[i].getAttribute('data-ticket-id') === ticketId
      );
    }

    // Update desktop chat header
    var titleEl = document.querySelector('.ticketing-chat__ticket-title');
    var idEl    = document.querySelector('.ticketing-chat__ticket-id');
    var deptEl  = document.querySelector('.ticketing-chat__dept');
    if (titleEl) titleEl.textContent = ticket.title;
    if (idEl)    idEl.textContent    = ticket.ticketId;
    if (deptEl)  deptEl.textContent  = ticket.dept;

    // Update mobile info card
    var mobileInfoTitle = document.getElementById('ticketingMobileInfoTitle');
    var mobileInfoDept  = document.getElementById('ticketingMobileInfoDept');
    var mobileInfoId    = document.getElementById('ticketingMobileInfoId');
    if (mobileInfoTitle) mobileInfoTitle.textContent = ticket.title;
    if (mobileInfoDept)  mobileInfoDept.textContent  = ticket.dept;
    if (mobileInfoId)    mobileInfoId.textContent    = ticket.ticketId;

    _renderMessages(ticket.messages);

    // On mobile: switch to chat view and update header title
    if (window.innerWidth <= 768) {
      var root = document.querySelector('.ticketing');
      if (root) root.classList.add('ticketing--chat');
      var pageTitle = document.querySelector('.page-title');
      if (pageTitle) pageTitle.textContent = 'تیکت «' + ticket.title + '»';
      var backBtn = document.getElementById('ticketingMobileBackBtn');
      if (backBtn) backBtn.style.display = 'flex';
    }
  }

  /* ── Mobile navigation ───────────────────────── */

  function _initMobileNav() {
    var backBtn = document.getElementById('ticketingMobileBackBtn');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        var root = document.querySelector('.ticketing');
        if (root) root.classList.remove('ticketing--chat');
        var pageTitle = document.querySelector('.page-title');
        if (pageTitle) pageTitle.textContent = 'پشتیبانی';
        backBtn.style.display = 'none';
      });
    }
  }

  /* ── Attachment preview ──────────────────────────── */

  function _addAttachmentPreview(file) {
    var container = document.getElementById('ticketingAttachments');
    if (!container) return;

    var tag = document.createElement('span');
    tag.className = 'ticketing-attach-tag';
    tag.dataset.filename = file.name;
    tag.innerHTML =
      '<span class="ticketing-attach-tag__icon">' + _fileIconSvg() + '</span>' +
      '<span class="ticketing-attach-tag__name">' + _escapeHtml(file.name) + '</span>' +
      '<button class="ticketing-attach-tag__remove" type="button" aria-label="حذف پیوست">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none">' +
          '<path stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M18 6 6 18M6 6l12 12"/>' +
        '</svg>' +
      '</button>';

    tag.querySelector('.ticketing-attach-tag__remove').addEventListener('click', function () {
      _removePendingFile(file.name);
      tag.remove();
    });

    container.appendChild(tag);
  }

  function _removePendingFile(name) {
    _pendingFiles = _pendingFiles.filter(function (f) { return f.name !== name; });
  }

  function _clearAttachments() {
    _pendingFiles = [];
    var container = document.getElementById('ticketingAttachments');
    if (container) container.innerHTML = '';
  }

  /* ── Send message ────────────────────────────────── */

  function _sendMessage() {
    var inputEl = document.getElementById('ticketingMessageInput');
    var text = inputEl ? inputEl.value.trim() : '';
    var hasFiles = _pendingFiles.length > 0;

    if (!text && !hasFiles) return;

    var newMsg = {
      type:  'support',
      text:  text,
      meta:  'همین الان | پشتیبان شماره ۲۲',
      files: hasFiles ? _pendingFiles.map(function (f) { return f.name; }) : null
    };

    if (_tickets[_currentTicketId]) {
      _tickets[_currentTicketId].messages.push(newMsg);
    }

    var messagesEl = document.getElementById('ticketingMessages');
    if (messagesEl) {
      messagesEl.appendChild(_buildBubble(newMsg));
    }

    // Reset input
    if (inputEl) {
      inputEl.value = '';
      inputEl.style.height = 'auto';
    }
    _clearAttachments();
    _scrollToBottom();

    if (typeof Toast !== 'undefined') {
      Toast.show({ variant: 'success', title: 'پیام ارسال شد', duration: 2500 });
    }
  }

  /* ── Init ────────────────────────────────────────── */

  function _checkEmptyState() {
    var body  = document.getElementById('ticketingBody');
    var items = document.querySelectorAll('.ticketing-item');
    if (!body) return;
    body.classList.toggle('ticketing-body--empty', items.length === 0);
  }

  function _initTicketList() {
    var list = document.getElementById('ticketingList');
    if (!list) return;
    list.addEventListener('click', function (e) {
      var item = e.target.closest('.ticketing-item');
      if (!item) return;
      var ticketId = item.getAttribute('data-ticket-id');
      if (!ticketId) return;
      // On desktop skip if same ticket; on mobile always navigate to chat view
      var isMobile = window.innerWidth <= 768;
      if (ticketId === _currentTicketId && !isMobile) return;
      _selectTicket(ticketId);
    });
  }

  function _initInputBar() {
    var sendBtn   = document.getElementById('ticketingSendBtn');
    var inputEl   = document.getElementById('ticketingMessageInput');
    var attachBtn = document.getElementById('ticketingAttachBtn');
    var fileInput = document.getElementById('ticketingFileInput');

    if (sendBtn) {
      sendBtn.addEventListener('click', _sendMessage);
    }

    if (inputEl) {
      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          _sendMessage();
        }
      });
      inputEl.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
      });
    }

    if (attachBtn && fileInput) {
      attachBtn.addEventListener('click', function () {
        fileInput.click();
      });

      fileInput.addEventListener('change', function () {
        var files = this.files;
        if (!files || !files.length) return;

        for (var i = 0; i < files.length; i++) {
          _pendingFiles.push(files[i]);
          _addAttachmentPreview(files[i]);
        }

        this.value = ''; // reset so same file can be re-selected
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    _checkEmptyState();
    _initTicketList();
    _initInputBar();
    _initMobileNav();
    _scrollToBottom();
  });

  return {};
})();
