/**
 * invoice-details.js — منطق صفحه جزئیات فاکتور
 */
(function () {

  /** دکمه پرینت */
  var printBtn = document.getElementById('printInvoiceBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }

})();
