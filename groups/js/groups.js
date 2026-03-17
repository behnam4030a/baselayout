/* ===========================================
   Groups Pages Logic
   groups/js/groups.js
   =========================================== */

/* ---------------------------------------------------------------
   GroupsPage — list-groups.html
   Handles: search filtering, add/edit/delete group modals
   --------------------------------------------------------------- */
const GroupsPage = (() => {
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    const searchInput = document.getElementById('groupsSearchInput');
    const groupsList = document.getElementById('groupsList');
    const groupsEmpty = document.getElementById('groupsEmpty');
    const groupsNoResults = document.getElementById('groupsNoResults');
    const openAddGroupBtn = document.getElementById('openAddGroupBtn');
    const addGroupSubmit = document.getElementById('addGroupSubmit');
    const addGroupName = document.getElementById('addGroupName');
    const addAnotherGroupBtn = document.getElementById('addAnotherGroupBtn');
    const editGroupSubmit = document.getElementById('editGroupSubmit');
    const editGroupName = document.getElementById('editGroupName');
    const editGroupModalSubtitle = document.getElementById('editGroupModalSubtitle');
    const groupSuccessName = document.getElementById('groupSuccessName');

    if (!groupsList) return; // not on this page

    // ----------- Search -----------
    if (searchInput) {
      searchInput.addEventListener('input', _handleSearch);
    }

    // ----------- Add Group -----------
    const _openAddGroup = () => {
      if (addGroupName) addGroupName.value = '';
      Modal.open('add-group-modal');
    };

    if (openAddGroupBtn) {
      openAddGroupBtn.addEventListener('click', _openAddGroup);
    }

    const openAddGroupBtnEmpty = document.getElementById('openAddGroupBtnEmpty');
    if (openAddGroupBtnEmpty) {
      openAddGroupBtnEmpty.addEventListener('click', _openAddGroup);
    }

    if (addGroupSubmit) {
      addGroupSubmit.addEventListener('click', () => {
        const name = addGroupName ? addGroupName.value.trim() : '';
        if (!name) {
          if (addGroupName) addGroupName.focus();
          return;
        }
        _addGroupCard(name);
        _updateCount();
        _handleSearch();
        if (groupSuccessName) groupSuccessName.textContent = name;
        Modal.close('add-group-modal');
        Modal.open('group-success-modal');
      });
    }

    if (addAnotherGroupBtn) {
      addAnotherGroupBtn.addEventListener('click', () => {
        Modal.close('group-success-modal');
        if (addGroupName) addGroupName.value = '';
        Modal.open('add-group-modal');
      });
    }

    // ----------- Edit Group (event delegation) -----------
    document.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-open-edit-group]');
      if (!editBtn) return;
      const groupName = editBtn.dataset.groupName || '';
      if (editGroupName) editGroupName.value = groupName;
      if (editGroupModalSubtitle) editGroupModalSubtitle.textContent = groupName;
      Modal.open('edit-group-modal');
    });

    if (editGroupSubmit) {
      editGroupSubmit.addEventListener('click', () => {
        Modal.close('edit-group-modal');
      });
    }

    // ----------- State: check if empty -----------
    _checkEmpty();
  }

  function _handleSearch() {
    const searchInput = document.getElementById('groupsSearchInput');
    const groupsList = document.getElementById('groupsList');
    const groupsNoResults = document.getElementById('groupsNoResults');
    if (!searchInput || !groupsList) return;

    const q = searchInput.value.trim().toLowerCase();
    const cards = groupsList.querySelectorAll('.group-card');
    let visibleCount = 0;

    cards.forEach((card) => {
      const name = (card.dataset.groupName || '').toLowerCase();
      if (!q || name.includes(q)) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (groupsNoResults) {
      if (q && visibleCount === 0) {
        groupsNoResults.classList.remove('hidden');
      } else {
        groupsNoResults.classList.add('hidden');
      }
    }
  }

  function _addGroupCard(name) {
    const groupsList = document.getElementById('groupsList');
    if (!groupsList) return;
    const id = Date.now();
    const safe = _escapeHtml(name);
    const article = document.createElement('article');
    article.className = 'group-card';
    article.dataset.groupId = id;
    article.dataset.groupName = name;
    article.innerHTML =
      '<a href="list-groups-user.html" class="group-card__name">' + safe + '</a>' +
      '<span class="group-card__h-divider"></span>' +
      '<div class="group-card__stats">' +
        '<div class="group-card__stat">' +
          '<span class="group-card__stat-num">۰</span>' +
          '<span class="group-card__stat-label">تعداد کاربران</span>' +
        '</div>' +
        '<span class="group-card__v-divider"></span>' +
        '<div class="group-card__stat">' +
          '<span class="group-card__stat-num">۰</span>' +
          '<span class="group-card__stat-label">آزمون‌های متصل</span>' +
        '</div>' +
      '</div>' +
      '<span class="group-card__divider"></span>' +
      '<div class="group-card__btns">' +
        '<a href="list-groups-user.html" class="btn btn--outline btn--large group-card__members-btn">اعضای گروه</a>' +
        '<button class="btn btn--outline btn--large group-card__edit-btn" type="button" data-open-edit-group="' + id + '" data-group-name="' + safe + '">ویرایش گروه</button>' +
        '<button class="group-card__delete-btn" type="button" aria-label="حذف گروه ' + safe + '">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.99877 4.13867C9.72743 4.13867 9.48103 4.29679 9.36801 4.54341L8.61796 6.17947C8.50595 6.42381 8.2618 6.58047 7.99301 6.58047H5.57354C5.20932 6.58047 4.91406 6.87573 4.91406 7.23994V8.23745C4.91406 8.36638 5.01858 8.47089 5.1475 8.47089H17.7698C17.8987 8.47089 18.0032 8.36638 18.0032 8.23745V7.23994C18.0032 6.87573 17.7079 6.58047 17.3437 6.58047H14.9243C14.6554 6.58047 14.4113 6.42381 14.2993 6.17947L13.5493 4.54341C13.4362 4.29679 13.1898 4.13867 12.9185 4.13867H9.99877ZM8.11807 3.97041C8.45516 3.2351 9.1899 2.76367 9.99877 2.76367H12.9185C13.7274 2.76367 14.4621 3.2351 14.7992 3.97041L15.3654 5.20547H17.3437C18.4673 5.20547 19.3782 6.11633 19.3782 7.23994V8.23745C19.3782 9.12577 18.6581 9.84591 17.7698 9.84591H5.1475C4.25919 9.84591 3.53906 9.12577 3.53906 8.23745V7.23994C3.53906 6.11633 4.44993 5.20547 5.57354 5.20547H7.55188L8.11807 3.97041Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.63672 8.54102C6.01641 8.54102 6.32422 8.84881 6.32422 9.22851V17.1904C6.32422 18.3447 7.24608 19.2657 8.36524 19.2657H14.5498C15.669 19.2657 16.5909 18.3447 16.5909 17.1904V9.22851C16.5909 8.84881 16.8987 8.54102 17.2784 8.54102C17.6581 8.54102 17.9659 8.84881 17.9659 9.22851V17.1904C17.9659 19.0878 16.4446 20.6407 14.5498 20.6407H8.36524C6.47055 20.6407 4.94922 19.0878 4.94922 17.1904V9.22851C4.94922 8.84881 5.25703 8.54102 5.63672 8.54102Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.91016 11.7617C10.2898 11.7617 10.5977 12.0695 10.5977 12.4492V16.5819C10.5977 16.9616 10.2898 17.2694 9.91016 17.2694C9.53047 17.2694 9.22266 16.9616 9.22266 16.5819V12.4492C9.22266 12.0695 9.53047 11.7617 9.91016 11.7617ZM13.0089 11.7617C13.3885 11.7617 13.6964 12.0695 13.6964 12.4492V16.5819C13.6964 16.9616 13.3885 17.2694 13.0089 17.2694C12.6292 17.2694 12.3214 16.9616 12.3214 16.5819V12.4492C12.3214 12.0695 12.6292 11.7617 13.0089 11.7617Z" fill="#222323"/></svg>' +
        '</button>' +
      '</div>';
    groupsList.appendChild(article);
    _checkEmpty();
  }

  function _updateCount() {
    const groupsList = document.getElementById('groupsList');
    const groupsCount = document.getElementById('groupsCount');
    if (!groupsList || !groupsCount) return;
    const count = groupsList.querySelectorAll('.group-card').length;
    groupsCount.textContent = 'تعداد: ' + count + ' عدد';
  }

  function _escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function _checkEmpty() {
    const groupsList = document.getElementById('groupsList');
    const groupsEmpty = document.getElementById('groupsEmpty');
    if (!groupsList || !groupsEmpty) return;
    const hasCards = groupsList.querySelectorAll('.group-card').length > 0;

    groupsList.classList.toggle('hidden', !hasCards);
    groupsEmpty.classList.toggle('hidden', hasCards);

    // Hide search + count when empty
    const search = document.querySelector('.groups-search');
    const dot    = document.querySelector('.groups-head__dot');
    const count  = document.getElementById('groupsCount');
    if (search) search.classList.toggle('hidden', !hasCards);
    if (dot)    dot.classList.toggle('hidden', !hasCards);
    if (count)  count.classList.toggle('hidden', !hasCards);
  }

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  return { init: _init };
})();


/* ---------------------------------------------------------------
   GroupUsersPage — list-groups-user.html
   Handles: add-user modal, add-exam modal, exam plan selection
   --------------------------------------------------------------- */
const GroupUsersPage = (() => {
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    _initialized = true;

    const openAddUserBtn = document.getElementById('openAddGroupUserBtn');
    const addUserBtnTable = document.getElementById('addGroupUserBtnTable');
    const addGroupUserSearch = document.getElementById('addGroupUserSearch');

    const openAddExamBtn = document.getElementById('openGroupAddExamBtn');
    const groupAddExamSubmit = document.getElementById('groupAddExamSubmit');
    const groupExamBulkSearch = document.getElementById('groupExamBulkSearch');
    const groupExamBulkList = document.getElementById('groupExamBulkList');
    const groupExamBulkPriceVal = document.getElementById('groupExamBulkPriceVal');
    const groupExamBulkCountVal = document.getElementById('groupExamBulkCountVal');

    // ----------- Empty state check -----------
    _checkGroupUsersEmpty();

    if (!addUserBtnTable) return; // not on this page

    // ----------- Add User to Group -----------
    const _openAddUserModal = () => Modal.open('add-group-user-modal');

    if (openAddUserBtn) {
      openAddUserBtn.addEventListener('click', _openAddUserModal);
    }

    if (addUserBtnTable) {
      addUserBtnTable.addEventListener('click', _openAddUserModal);
    }

    const openAddGroupUserBtnEmpty = document.getElementById('openAddGroupUserBtnEmpty');
    if (openAddGroupUserBtnEmpty) {
      openAddGroupUserBtnEmpty.addEventListener('click', _openAddUserModal);
    }

    // Form submit — collect selected users and close modal
    const addGroupUserForm = document.getElementById('addGroupUserForm');
    if (addGroupUserForm) {
      addGroupUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        Modal.close('add-group-user-modal');
      });
    }

    // User search filter inside modal
    if (addGroupUserSearch) {
      addGroupUserSearch.addEventListener('input', () => {
        const q = addGroupUserSearch.value.trim().toLowerCase();
        const items = document.querySelectorAll('#addGroupUserList .group-user-select-item');
        items.forEach((item) => {
          const name = (item.querySelector('.group-user-select-item__name') || {}).textContent || '';
          const code = (item.querySelector('.group-user-select-item__code') || {}).textContent || '';
          item.classList.toggle('hidden', q && !name.toLowerCase().includes(q) && !code.includes(q));
        });
      });
    }

    // Reset form when modal opens
    Modal.onOpen('add-group-user-modal', () => {
      if (addGroupUserForm) addGroupUserForm.reset();
      if (addGroupUserSearch) addGroupUserSearch.value = '';
    });

    // ----------- Add Exam to Group -----------
    if (openAddExamBtn) {
      openAddExamBtn.addEventListener('click', () => Modal.open('group-add-exam-modal'));
    }

    const addGroupExamBtnTable = document.getElementById('addGroupExamBtnTable');
    if (addGroupExamBtnTable) {
      addGroupExamBtnTable.addEventListener('click', () => Modal.open('group-add-exam-modal'));
    }

    if (groupAddExamSubmit) {
      groupAddExamSubmit.addEventListener('click', () => Modal.close('group-add-exam-modal'));
    }

    // Exam plan selection (event delegation)
    if (groupExamBulkList) {
      groupExamBulkList.addEventListener('click', (e) => {
        const planBtn = e.target.closest('.exam-bulk__plan');
        if (!planBtn) return;
        const item = planBtn.closest('.exam-bulk__item');
        if (!item) return;

        // Toggle plan within this item
        const allPlans = item.querySelectorAll('.exam-bulk__plan');
        const isActive = planBtn.classList.contains('exam-bulk__plan--active');

        allPlans.forEach((p) => {
          p.classList.remove('exam-bulk__plan--active');
          p.setAttribute('aria-pressed', 'false');
        });

        if (!isActive) {
          planBtn.classList.add('exam-bulk__plan--active');
          planBtn.setAttribute('aria-pressed', 'true');
          item.classList.add('exam-bulk__item--has-plan');
        } else {
          item.classList.remove('exam-bulk__item--has-plan');
        }

        _updateExamSummary();
      });
    }

    // Exam search filter
    if (groupExamBulkSearch && groupExamBulkList) {
      groupExamBulkSearch.addEventListener('input', () => {
        const q = groupExamBulkSearch.value.trim().toLowerCase();
        const items = groupExamBulkList.querySelectorAll('.exam-bulk__item');
        items.forEach((item) => {
          const name = (item.querySelector('.exam-bulk__item-name') || {}).textContent || '';
          if (q && !name.toLowerCase().includes(q)) {
            item.setAttribute('hidden', '');
          } else {
            item.removeAttribute('hidden');
          }
        });
      });
    }
  }

  function _updateExamSummary() {
    const groupExamBulkList = document.getElementById('groupExamBulkList');
    const groupExamBulkPriceVal = document.getElementById('groupExamBulkPriceVal');
    const groupExamBulkCountVal = document.getElementById('groupExamBulkCountVal');
    if (!groupExamBulkList) return;

    let totalPrice = 0;
    let count = 0;

    groupExamBulkList.querySelectorAll('.exam-bulk__item--has-plan').forEach((item) => {
      const activePlan = item.querySelector('.exam-bulk__plan--active');
      if (activePlan) {
        totalPrice += parseInt(activePlan.dataset.price || '0', 10);
        count++;
      }
    });

    if (groupExamBulkPriceVal) {
      groupExamBulkPriceVal.textContent = count > 0 ? _formatPrice(totalPrice) : '—';
    }
    if (groupExamBulkCountVal) {
      groupExamBulkCountVal.textContent = count > 0 ? count + ' آزمون' : '۰ آزمون';
    }
  }

  function _checkGroupUsersEmpty() {
    const list = document.getElementById('groupUsersList');
    if (!list) return;
    const hasRows = list.querySelectorAll('.table__tbody .table__row').length > 0;

    // Table-only sections: visible only when there are rows
    ['.table__search', '.table__select-all', '.table__scroll-wrapper', '.table__action-bar', '.table__pagination'].forEach(sel => {
      const el = list.querySelector(sel);
      if (el) el.classList.toggle('hidden', !hasRows);
    });

    // Count + dot: visible only when there are rows
    const countDot = document.getElementById('groupUsersCountDot');
    const count    = document.getElementById('groupUsersCount');
    if (countDot) countDot.classList.toggle('hidden', !hasRows);
    if (count)    count.classList.toggle('hidden', !hasRows);

    // Filter + exam buttons: hidden when empty
    const examBtn   = document.getElementById('addGroupExamBtnTable');
    if (examBtn)   examBtn.classList.toggle('hidden', !hasRows);

    // group-stats cards: hidden when empty
    const groupStats = document.querySelector('.group-stats');
    if (groupStats) groupStats.classList.toggle('hidden', !hasRows);

    // Empty body: visible only when no rows
    const emptyBody = document.getElementById('groupUsersEmptyBody');
    if (emptyBody) emptyBody.classList.toggle('hidden', hasRows);
  }

  function _formatPrice(num) {
    return num.toLocaleString('fa-IR');
  }

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  return { init: _init };
})();
