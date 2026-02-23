# Toast Component — کامپوننت اعلان

**فایل CSS:** `components/toast/toast.css`
**فایل JS:** `components/toast/toast.js`

```html
<link rel="stylesheet" href="/components/toast/toast.css">
<script src="/components/toast/toast.js" defer></script>
```

---

## استفاده سریع

```html
<div class="toast toast--{variant}" role="status">
  <button class="toast__dismiss" aria-label="بستن">
    <svg viewBox="0 0 14 14" fill="none">
      <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
            stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round"/>
    </svg>
  </button>
  <div class="toast__inner">
    <div class="toast__content">
      <p class="toast__title">عنوان اعلان</p>
      <p class="toast__description">متن توضیحی اختیاری</p>
    </div>
    <div class="toast__icon">
      <svg><!-- آیکن وضعیت --></svg>
    </div>
  </div>
  <div class="toast__progress">
    <div class="toast__progress-bar"></div>
  </div>
</div>
```

---

## واریانت‌ها (Variants)

| واریانت | کلاس | رنگ آیکن | رنگ نوار تایمر | shadow |
|---|---|---|---|---|
| Success | `toast--success` | `#107c10` (سبز) | `#107c10` | سبز |
| Danger | `toast--danger` | `#c50f1f` (قرمز) | `#c50f1f` | قرمز |
| Warning | `toast--warning` | `#f7630c` (نارنجی) | `#f7630c` | نارنجی |
| Neutral | `toast--neutral` | `#454546` (خاکستری) | `#454546` | خاکستری |

---

## رفتارها (Behaviors)

| رفتار | توضیح |
|---|---|
| Auto Dismiss | پس از اتمام تایمر (پیش‌فرض 5 ثانیه) Toast خودکار حذف می‌شود |
| Manual Dismiss | کلیک روی دکمه بستن، تایمر را متوقف و Toast را حذف می‌کند |
| Timer Indicator | نوار پایینی با انیمیشن linear از 100% به 0% کاهش می‌یابد |
| Non-blocking | Toast فوکوس کاربر را نمی‌گیرد و مانع تعامل نمی‌شود |

---

## نمونه‌ها

**Success (موفقیت):**
```html
<div class="toast toast--success" role="status">
  <button class="toast__dismiss" aria-label="بستن">
    <svg viewBox="0 0 14 14" fill="none">
      <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
  <div class="toast__inner">
    <div class="toast__content">
      <p class="toast__title">عملیات با موفقیت انجام شد</p>
      <p class="toast__description">تغییرات شما ذخیره شد.</p>
    </div>
    <div class="toast__icon">
      <svg viewBox="0 0 36 36" fill="none"><!-- آیکن success --></svg>
    </div>
  </div>
  <div class="toast__progress">
    <div class="toast__progress-bar"></div>
  </div>
</div>
```

**Danger (اخطار):**
```html
<div class="toast toast--danger" role="alert">
  <button class="toast__dismiss" aria-label="بستن">
    <svg viewBox="0 0 14 14" fill="none">
      <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
  <div class="toast__inner">
    <div class="toast__content">
      <p class="toast__title">خطا در انجام عملیات</p>
      <p class="toast__description">لطفا دوباره تلاش کنید.</p>
    </div>
    <div class="toast__icon">
      <svg viewBox="0 0 36 36" fill="none"><!-- آیکن danger --></svg>
    </div>
  </div>
  <div class="toast__progress">
    <div class="toast__progress-bar"></div>
  </div>
</div>
```

**بدون Description:**
```html
<div class="toast toast--success" role="status">
  <button class="toast__dismiss" aria-label="بستن">
    <svg viewBox="0 0 14 14" fill="none">
      <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
  <div class="toast__inner">
    <div class="toast__content">
      <p class="toast__title">عملیات با موفقیت انجام شد</p>
    </div>
    <div class="toast__icon">
      <svg viewBox="0 0 36 36" fill="none"><!-- آیکن success --></svg>
    </div>
  </div>
  <div class="toast__progress">
    <div class="toast__progress-bar"></div>
  </div>
</div>
```

**تایمر سفارشی (3 ثانیه):**
```html
<div class="toast toast--warning" role="alert" data-toast-duration="3000">
  ...
</div>
```

**LTR:**
```html
<div class="toast toast--success" dir="ltr" role="status">
  ...
</div>
```

---

## ساختار HTML

```
div.toast.toast--{variant}
├── button.toast__dismiss              ← دکمه بستن (آیکن ✕)
├── div.toast__inner                   ← کانتینر داخلی
│   ├── div.toast__content             ← محتوای متنی
│   │   ├── p.toast__title             ← عنوان (الزامی)
│   │   └── p.toast__description       ← توضیحات (اختیاری)
│   └── div.toast__icon                ← آیکن وضعیت
│       └── svg                        ← آیکن SVG
└── div.toast__progress                ← کانتینر نوار تایمر
    └── div.toast__progress-bar        ← نوار پیشرفت
```

---

## کلاس‌های CSS

| کلاس | توضیح |
|---|---|
| `toast` | کلاس پایه (روی `<div>` wrapper) |
| `toast--success` | واریانت موفقیت (سبز) |
| `toast--danger` | واریانت اخطار (قرمز) |
| `toast--warning` | واریانت هشدار (نارنجی) |
| `toast--neutral` | واریانت خنثی (خاکستری) |
| `toast__dismiss` | دکمه بستن |
| `toast__inner` | کانتینر داخلی (محتوا + آیکن) |
| `toast__content` | محتوای متنی (عنوان + توضیحات) |
| `toast__title` | عنوان Toast |
| `toast__description` | توضیحات (اختیاری) |
| `toast__icon` | آیکن وضعیت |
| `toast__progress` | کانتینر نوار تایمر |
| `toast__progress-bar` | نوار پیشرفت تایمر |

---

## Data Attributes

| اتریبیوت | روی | توضیح |
|---|---|---|
| `data-toast-duration` | `div.toast` | مدت زمان تایمر به میلی‌ثانیه (پیش‌فرض: `5000`) |

---

## JavaScript API

Toast‌هایی که هنگام بارگذاری صفحه در DOM هستند به صورت خودکار راه‌اندازی می‌شوند.

### `Toast.show(options)` — ایجاد و نمایش Toast

ساده‌ترین راه نمایش Toast. تمام HTML، آیکن، role و تایمر به صورت خودکار تنظیم می‌شود:

```javascript
// ساده‌ترین حالت
Toast.show({ variant: 'success', title: 'عملیات موفق بود' });

// با توضیحات
Toast.show({
  variant: 'danger',
  title: 'خطا در ذخیره‌سازی',
  description: 'لطفا دوباره تلاش کنید.'
});

// با تایمر سفارشی (3 ثانیه)
Toast.show({
  variant: 'warning',
  title: 'اتصال ضعیف است',
  duration: 3000
});

// با container سفارشی
Toast.show({
  variant: 'neutral',
  title: 'پیام جدید',
  container: document.getElementById('myContainer')
});
```

| پارامتر | نوع | الزامی | توضیح |
|---|---|---|---|
| `variant` | `string` | بله | `'success'` \| `'danger'` \| `'warning'` \| `'neutral'` |
| `title` | `string` | بله | عنوان Toast |
| `description` | `string` | خیر | متن توضیحی |
| `duration` | `number` | خیر | مدت زمان به ms (پیش‌فرض: `5000`) |
| `icon` | `string` | خیر | آیکن SVG سفارشی (پیش‌فرض: آیکن متناسب با variant) |
| `container` | `HTMLElement` | خیر | المان container (پیش‌فرض: ساخت خودکار با `id="toast-container"`) |

**مقدار بازگشتی:** `HTMLElement` — المان Toast ساخته شده.

### `Toast.init(toastEl)` — راه‌اندازی Toast موجود

برای Toast‌هایی که HTML آن‌ها دستی ساخته شده:

```javascript
var toastEl = document.querySelector('.toast');
Toast.init(toastEl);
```

### `Toast.dismiss(toastEl)` — حذف دستی Toast

```javascript
Toast.dismiss(toastEl);
```

---

## دسترسی‌پذیری (Accessibility)

| واریانت | role | توضیح |
|---|---|---|
| Success | `role="status"` | اعلام polite — اطلاع‌رسانی غیرفوری |
| Danger | `role="alert"` | اعلام assertive — پیام مهم |
| Warning | `role="alert"` | اعلام assertive — پیام مهم |
| Neutral | `role="status"` | اعلام polite — اطلاع‌رسانی غیرفوری |

- دکمه بستن با `aria-label="بستن"` مشخص شده و با Tab و Enter/Space قابل دسترس است.
- Toast فوکوس المان فعلی را نمی‌گیرد.

---

## نکات مهم

- **Description اختیاری است:** اگر `toast__description` را حذف کنید، layout بدون فضای خالی اضافی تنظیم می‌شود.
- **تایمر سفارشی:** با `data-toast-duration` مدت زمان را به میلی‌ثانیه تنظیم کنید. بدون آن پیش‌فرض 5 ثانیه اعمال می‌شود.
- **Stacking:** مدیریت موقعیت و ترتیب چند Toast همزمان خارج از scope این کامپوننت است و باید توسط سیستم بالادستی انجام شود.
- **آیکن وضعیت:** آیکن SVG باید متناسب با واریانت انتخاب شود. رنگ آیکن با `currentColor` از CSS تامین می‌شود.
- **RTL/LTR:** به صورت پیش‌فرض RTL است. برای LTR از `dir="ltr"` روی wrapper یا والد استفاده کنید.
- **role صحیح:** برای Success و Neutral از `role="status"` و برای Danger و Warning از `role="alert"` استفاده کنید.
