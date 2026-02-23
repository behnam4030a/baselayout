# Dialog Component

کامپوننت Dialog برای نمایش پیام‌های تأیید و هشدار استفاده می‌شود. در دسکتاپ به صورت یک جعبه مرکزی و در موبایل به صورت Bottom Sheet نمایش داده می‌شود.

---

## فایل‌ها

```
components/dialog/
├── dialog.css      — استایل‌ها
├── dialog.js       — منطق JavaScript
├── tokens.json     — توکن‌های طراحی از Figma
└── index.html      — صفحه نمایش
```

---

## اتصال فایل‌ها

```html
<link rel="stylesheet" href="components/colors/colors.css">
<link rel="stylesheet" href="components/dialog/dialog.css">
<script src="components/dialog/dialog.js" defer></script>
```

> **توجه:** حتماً `colors.css` قبل از `dialog.css` لینک شود.

---

## ساختار HTML

```html
<div class="dialog" id="my-dialog">
  <div class="dialog__overlay"></div>
  <div class="dialog__panel">
    <div class="dialog__card">

      <!-- هدر: عنوان + دکمه بستن -->
      <div class="dialog__content">
        <div class="dialog__header">
          <h3 class="dialog__title">حذف کاربر؟</h3>
          <button class="dialog__close" type="button" aria-label="بستن">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5.25 5.25L18.75 18.75M18.75 5.25L5.25 18.75"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <p class="dialog__description">
          آیا مطمئن هستید می‌خواهید این کاربر را حذف کنید؟ این عملیات قابل بازگشت نیست.
        </p>
      </div>

      <!-- دکمه‌های عملیات -->
      <div class="dialog__actions">
        <button class="dialog__btn dialog__btn--danger" data-action="delete">حذف</button>
        <button class="dialog__btn dialog__btn--primary" data-action="cancel">انصراف</button>
      </div>

    </div>
  </div>
</div>
```

### نکات ساختار

| عنصر | توضیح |
|---|---|
| `dialog` | root المان — باید `id` یکتا داشته باشد |
| `dialog__overlay` | پس‌زمینه تاریک — کلیک روی آن dialog را می‌بندد |
| `dialog__panel` | دسکتاپ: wrapper انیمیشن — موبایل: bottom sheet |
| `dialog__card` | کارت سفید حاوی محتوا |
| `dialog__content` | گروه هدر + توضیحات |
| `dialog__header` | ردیف عنوان و دکمه بستن |
| `dialog__title` | عنوان dialog |
| `dialog__close` | دکمه × بستن (در موبایل مخفی می‌شود) |
| `dialog__description` | متن توضیحات |
| `dialog__actions` | ردیف دکمه‌های عملیات |

---

## دکمه‌ها

سه نوع دکمه وجود دارد که همه می‌توانند `data-action` داشته باشند:

### دکمه خطر (Danger)
برای عملیات برگشت‌ناپذیر مانند حذف:

```html
<button class="dialog__btn dialog__btn--danger" data-action="delete">
  حذف
</button>
```

- پس‌زمینه قرمز (`#c50f1f`)
- عرض ثابت ۱۸۶ پیکسل در دسکتاپ، تمام عرض در موبایل
- اول در DOM قرار می‌گیرد → در RTL سمت راست، در موبایل بالا

### دکمه اصلی (Primary)
برای انصراف یا تأیید ثانویه:

```html
<button class="dialog__btn dialog__btn--primary" data-action="cancel">
  انصراف
</button>
```

- پس‌زمینه سفید با border خاکستری
- متن تیره
- عرض انعطاف‌پذیر (flex: 1) در دسکتاپ، تمام عرض در موبایل
- دوم در DOM → در RTL سمت چپ، در موبایل پایین

### دکمه تأیید (Confirm)
برای تأیید مثبت یا اعلام متوجه شدن:

```html
<button class="dialog__btn dialog__btn--confirm" data-action="confirm">
  متوجه شدم
</button>
```

- پس‌زمینه سبز برند (`#26a88c`)
- متن سفید
- عرض انعطاف‌پذیر (flex: 1)

---

## حالت تک‌دکمه (Single Action)

وقتی فقط یک دکمه تأیید کافی است، از `dialog__actions--single` استفاده کنید:

```html
<div class="dialog__actions dialog__actions--single">
  <button class="dialog__btn dialog__btn--confirm" data-action="confirm">متوجه شدم</button>
</div>
```

- دکمه به‌صورت خودکار تمام عرض را می‌گیرد
- با هر نوع دکمه‌ای کار می‌کند (confirm، danger، primary)
- در موبایل رفتار یکسانی دارد

---

## JavaScript API

### باز کردن dialog

```js
Dialog.open('my-dialog');
```

### بستن dialog

```js
Dialog.close('my-dialog');
```

### بستن همه dialog‌ها

```js
Dialog.closeAll();
```

### Callback هنگام کلیک دکمه

مقدار `data-action` دکمه‌ای که کلیک شده به تابع ارسال می‌شود:

```js
Dialog.onAction('my-dialog', function(action) {
  if (action === 'delete') {
    // اجرای عملیات حذف
    console.log('حذف تأیید شد');
  }
});
```

### Callback هنگام بسته شدن

```js
Dialog.onClose('my-dialog', function() {
  console.log('dialog بسته شد');
});
```

### Callback هنگام باز شدن

```js
Dialog.onOpen('my-dialog', function() {
  console.log('dialog باز شد');
});
```

---

## روش‌های بستن dialog

| روش | توضیح |
|---|---|
| کلیک روی overlay | بدون اجرای callback عملیات |
| دکمه × (close) | بدون اجرای callback عملیات — فقط دسکتاپ |
| کلیک دکمه عملیات | callback عملیات اجرا می‌شود، سپس بسته می‌شود |
| کلید Escape | بدون اجرای callback عملیات |

---

## رفتار Responsive

| حالت | توضیح |
|---|---|
| **دسکتاپ** (> 768px) | جعبه مرکزی، ۴۳۴px عرض، slide-up از پایین به مرکز |
| **موبایل** (≤ 768px) | Bottom Sheet، تمام عرض، slide-up از پایین صفحه |

در حالت موبایل:
- دکمه بستن (×) پنهان می‌شود
- دکمه‌ها به صورت ستونی (عمودی) نمایش داده می‌شوند
- رنگ توضیحات کمی روشن‌تر می‌شود

---

## مثال کامل — دو دکمه

```html
<!-- trigger -->
<button onclick="Dialog.open('confirm-delete')">حذف کاربر</button>

<!-- dialog -->
<div class="dialog" id="confirm-delete">
  <div class="dialog__overlay"></div>
  <div class="dialog__panel">
    <div class="dialog__card">
      <div class="dialog__content">
        <div class="dialog__header">
          <h3 class="dialog__title">حذف کاربر؟</h3>
          <button class="dialog__close" type="button" aria-label="بستن">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5.25 5.25L18.75 18.75M18.75 5.25L5.25 18.75"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <p class="dialog__description">
          این عملیات قابل بازگشت نیست.
        </p>
      </div>
      <div class="dialog__actions">
        <button class="dialog__btn dialog__btn--danger" data-action="delete">حذف</button>
        <button class="dialog__btn dialog__btn--primary" data-action="cancel">انصراف</button>
      </div>
    </div>
  </div>
</div>

<script>
  Dialog.onAction('confirm-delete', function(action) {
    if (action === 'delete') {
      // اجرای عملیات حذف
    }
  });
</script>
```

## مثال — تک دکمه (Single Action)

```html
<!-- trigger -->
<button onclick="Dialog.open('info-dialog')">نمایش اطلاعیه</button>

<!-- dialog -->
<div class="dialog" id="info-dialog">
  <div class="dialog__overlay"></div>
  <div class="dialog__panel">
    <div class="dialog__card">
      <div class="dialog__content">
        <div class="dialog__header">
          <h3 class="dialog__title">اطلاعات ثبت شد</h3>
          <button class="dialog__close" type="button" aria-label="بستن">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5.25 5.25L18.75 18.75M18.75 5.25L5.25 18.75"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <p class="dialog__description">تغییرات شما با موفقیت ذخیره شد.</p>
      </div>
      <div class="dialog__actions dialog__actions--single">
        <button class="dialog__btn dialog__btn--confirm" data-action="confirm">متوجه شدم</button>
      </div>
    </div>
  </div>
</div>
```
