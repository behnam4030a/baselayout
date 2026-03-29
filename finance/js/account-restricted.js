const AccountRestricted = (() => {
  function init() {
    const payBtn = document.getElementById('accountRestrictedPayBtn');
    const supportBtn = document.getElementById('accountRestrictedSupportBtn');

    if (payBtn) {
      payBtn.addEventListener('click', () => {
        window.location.href = './finance.html';
      });
    }

    if (supportBtn) {
      supportBtn.addEventListener('click', () => {
        // TODO: open support channel
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return { init };
})();
