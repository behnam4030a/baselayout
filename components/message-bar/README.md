# Message Bar

کامپوننت Message Bar از سه حالت Dismissible و Actionable و Detailed تشکیل شده است.
موقعیت نمایش پیام‌ها به صورت پیشفرض در حالت دسکتاپ در پایین صفحه سمت راست می‌باشد و در حالت موبایل در پایین صفحه و هر عرض صفحه موبایل قرار می‌گیرد. موقعیت نمایش به صورت آپشن قابل تنظیم است و می‌توان آن را در هرکجای صفحه به نمایش در آورد.

رنگ message barها کاملا نسبت به موضوع پیام قابل تغییر می‌باشد.
امکان بسته شدن خودکار پیام پس از طی زمان مشخص فراهم شده و این ویژگی به صورت آپشنال قابل تنظیم است.

## نصب

فایل‌های CSS و JS را به صفحه اضافه کنید:

```html
<link rel="stylesheet" href="components/message-bar/message-bar.css">
<script src="components/message-bar/message-bar.js" defer></script>
```

## سه نوع Message Bar

### Dismissible (قابل بستن)
در این حالت فقط یک پیام نمایش داده می‌شود و امکان بستن پیام با زدن ضربدر وجود دارد.

```html
<div class="message-bar message-bar--success" data-message-bar role="status">
  <div class="message-bar__content">
    <span class="message-bar__icon">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <p class="message-bar__text">
      موفقیت آمیز بود. در صورت نیاز، جزئیات بیشتری در اینجا آمده است.
    </p>
  </div>
  <button class="message-bar__close" aria-label="بستن">
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round"/>
    </svg>
  </button>
</div>
```

### Actionable (قابل عمل)
در این حالت پیام نمایش داده می‌شود و امکان لینک شدن به یک صفحه دیگر فراهم می‌شود. متن پیشفرض «بیشتر بدانید» قابل تغییر است.

```html
<div class="message-bar message-bar--info" data-message-bar role="status">
  <div class="message-bar__content">
    <span class="message-bar__icon">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 8V8.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 11V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
    <p class="message-bar__text">
      این یک پیام اطلاع رسانی است. در صورت نیاز، جزئیات بیشتری در اینجا آمده است.
    </p>
  </div>
  <a href="#" class="message-bar__link">
    <span class="message-bar__link-text">بیشتر بدانید</span>
    <span class="message-bar__link-icon">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </a>
</div>
```

### Detailed (جزئیات)
در این حالت توضیحات کامل‌تری در متن پیام نمایش داده می‌شود — یک عنوان و یک متن توضیحات. برای بستن از دکمه ضربدر استفاده می‌کنیم.

```html
<div class="message-bar message-bar--danger message-bar--detailed" data-message-bar role="status">
  <div class="message-bar__content">
    <span class="message-bar__icon">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 8V8.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 11V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
    <div class="message-bar__text-wrap">
      <p class="message-bar__text">خطا. اتصال به دیتابیس امکان پذیر نیست.</p>
      <p class="message-bar__description">توضیحات مرتبط با خطای بالا در اینجا آورده می شود.</p>
    </div>
  </div>
  <button class="message-bar__close" aria-label="بستن">
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round"/>
    </svg>
  </button>
</div>
```

## واریانت‌های رنگی

| واریانت | پس‌زمینه | بوردر | آیکن |
|---------|----------|-------|------|
| Info (آبی) | `#f3f9fd` | `#0078d4` | Info circle |
| Success (سبز) | `#f1faf1` | `#107c10` | Check circle |
| Warning (نارنجی) | `#fff9f5` | `#f7630c` | Danger triangle |
| Danger (قرمز) | `#fdf3f4` | `#c50f1f` | Info circle |

## بسته شدن خودکار (Auto-Dismiss)

با attribute `data-auto-dismiss` و مقدار زمان (میلی‌ثانیه) می‌توان message bar را به صورت خودکار بست:

```html
<!-- بسته شدن خودکار پس از 5 ثانیه -->
<div class="message-bar message-bar--success"
     data-message-bar data-auto-dismiss="5000" role="status">
  ...
</div>
```

## موقعیت نمایش (Positioning)

موقعیت نمایش پیام‌ها به صورت پیشفرض در حالت دسکتاپ **پایین صفحه سمت راست** و در حالت موبایل **پایین صفحه با تمام عرض و مارجین مشخص از طرفین** قرار می‌گیرد.
این ویژگی به صورت آپشن قابل تنظیم است و می‌توان آن را در هرکجای صفحه به نمایش در آورد.

### موقعیت‌های موجود (`position`)

| مقدار | موقعیت |
|-------|--------|
| `'bottom-right'` | پایین-راست (پیش‌فرض) |
| `'bottom-left'` | پایین-چپ |
| `'top-right'` | بالا-راست |
| `'top-left'` | بالا-چپ |
| `'bottom-center'` | پایین-وسط |
| `'top-center'` | بالا-وسط |

## JavaScript API

اسکریپت به صورت خودکار هنگام بارگذاری صفحه، تمام عناصر دارای `data-message-bar` را فعال می‌کند.

### `MessageBar.init([element])`

فعال‌سازی همه message barها یا یک message bar خاص.

### `MessageBar.show(element)`

نمایش یک message bar مخفی شده.

### `MessageBar.hide(element)`

مخفی کردن یک message bar.

### `MessageBar.onClose(element, callback)`

ثبت callback برای رویداد بستن.

### `MessageBar.create(options)`

ساخت message bar از طریق JavaScript:

```js
// Dismissible
MessageBar.create({ type: 'success', title: 'ذخیره شد' });

// با auto-dismiss
MessageBar.create({ type: 'warning', title: 'هشدار', autoDismiss: 5000 });

// Detailed
MessageBar.create({ type: 'danger', title: 'خطا', description: 'توضیحات تکمیلی...' });

// Actionable
MessageBar.create({ type: 'info', title: 'اطلاع‌رسانی', link: { text: 'بیشتر بدانید', href: '/details' } });

// تنظیم موقعیت نمایش
MessageBar.create({ type: 'success', title: 'ذخیره شد', position: 'top-right' });

// نمایش inline در المان خاص
MessageBar.create({ type: 'success', title: 'ذخیره شد', container: 'my-container' });
```

**پارامترهای options:**

| پارامتر | نوع | توضیح |
|---------|-----|--------|
| `type` | `string` | نوع واریانت: `'info'`, `'success'`, `'warning'`, `'danger'` |
| `title` | `string` | عنوان پیام |
| `description` | `string` | توضیحات — فعال‌سازی نوع Detailed (اختیاری) |
| `autoDismiss` | `number` | زمان بسته شدن خودکار به میلی‌ثانیه (اختیاری) |
| `link` | `object` | آبجکت `{text, href}` — فعال‌سازی نوع Actionable (اختیاری) |
| `position` | `string` | موقعیت نمایش (اختیاری، پیش‌فرض: `'bottom-right'`) |
| `container` | `string\|HTMLElement` | id یا المان — نمایش inline (اختیاری) |

## فایل‌ها

```
components/message-bar/
├── message-bar.css     <- استایل‌ها
├── message-bar.js      <- اسکریپت‌ها
├── tokens.json         <- توکن‌های طراحی (از Figma)
├── index.html          <- صفحه دمو
└── README.md           <- مستندات
```
