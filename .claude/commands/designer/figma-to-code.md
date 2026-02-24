---
name: Designer: Figma to Code
description: تبدیل یک یا چند لینک فیگما به HTML/CSS/JS وانیلا طبق قوانین پروژه FrontLayer Portal V.3
category: Designer
tags: [figma, html, css, js, vanilla, rtl, design]
---

تو داری طراحی‌های فیگما را برای پروژه **FrontLayer Portal V.3** به HTML/CSS/JS وانیلا تبدیل می‌کنی.

## مرحله ۱ — دریافت و پردازش لینک‌های فیگما

کاربر یک یا چند لینک فیگما را در `$ARGUMENTS` می‌دهد.
از هر URL مقادیر `fileKey` و `nodeId` را استخراج کن (در nodeId خط تیره `-` را به دونقطه `:` تبدیل کن).
اگر آرگومانی داده نشد، از کاربر بخواه لینک(ها) را بفرستد.

## مرحله ۲ — دریافت طراحی از فیگما (به صورت موازی)

برای **تمام** URLها به طور همزمان `get_design_context` را صدا بزن.
اگر یک node فقط metadata برگرداند (حجم زیاد است)، دوباره با `forceCode: true` صدا بزن.
## چک کردن طراحی و سرچ در کامپوننت ها
در صورتی که طرح موجود در فیگما کامپوننتش در پروژه وجود دارداز آن کامپوننت در پروژه استفاده کن
## مرحله ۳ — تبدیل به HTML/CSS/JS وانیلا

برای **هر** طراحی، سه بلوک کد با برچسب مشخص تولید کن:

### قوانین HTML
- از تگ‌های معنایی استفاده کن: `<section>`، `<article>`، `<header>`، `<nav>`، `<button>`، `<a>`، `<ul>/<li>` — از `<div>` خالی برای المان‌های تعاملی یا landmark پرهیز کن.
- نام‌گذاری کلاس با BEM: بلوک → `kebab-case`، المان → `block__element`، مودیفایر → `block--modifier`.
- RTL: روی المان ریشه `dir="rtl"` بگذار اگر snippet مستقل است؛ اگر کامپوننت داخل پورتال جاسازی می‌شود به `direction: rtl` سراسری تکیه کن.
- دسترس‌پذیری: `aria-label`، `role`، و `tabindex` را جایی که لازم است اضافه کن.
- بدون inline style — تمام جزئیات بصری باید در بلوک CSS باشند.
- همان حالت دسکتاپ باید به موبایل تبدیل شود و جدا جدا زده نشود
### قوانین CSS
- **همیشه از design token های پروژه** در `:root` به جای مقادیر خام استفاده کن:
  - رنگ‌ها: `--brand`، `--brand-light`، `--page-bg`، `--card-bg`، `--text-1`، `--text-2`، `--stroke`
  - شعاع: `--radius-card`، `--radius-btn`، `--radius-full`
  - سایدبار: `--sidebar-bg`، `--sidebar-bg-2`، `--sidebar-text`، `--sidebar-w`، `--sidebar-mini-w`
  - انیمیشن: `--transition`
- قوانین RTL flex را دقیقاً رعایت کن:
  - اولین فرزند DOM = سمت راست فیزیکی (شروع RTL)
  - آخرین فرزند DOM = سمت چپ فیزیکی (پایان RTL)
  - `justify-content: flex-start` ← آیتم‌ها از راست چیده می‌شوند
  - `justify-content: space-between` ← اولین فرزند راست، آخرین فرزند چپ
- از `gap`، `padding`، `margin` با مقادیر منطقی یا متقارن استفاده کن؛ از `margin-left`/`margin-right` خام پرهیز کن (ترجیحاً `margin-inline-*`).
- ریسپانسیو: mobile-first، breakpointها `768px` (تبلت) و `1024px` (دسکتاپ).
- اگر کامپوننت modal است، از الگوی override مدال پیروی کن:
  ```css
  .modal--xxx { --modal-width: Npx; }
  .modal--xxx .modal__body { justify-content: flex-start; overflow: hidden; }
  @media (max-width: 1023px) {
    .modal--xxx .modal__container { bottom: calc(var(--bottom-nav-h) + 8px); }
  }
  ```
- فونت Vazirmatn به صورت سراسری لود شده؛ دوباره آن را ایمپورت نکن.

### قوانین JS
- وانیلا ES6+، **بدون framework، بدون npm package**.
- هر کامپوننت تعاملی باید یک **IIFE module** باشد که به یک `const` اختصاص دارد:
  ```js
  const MyComponent = (() => {
    let _initialized = false;
    function _init() {
      if (_initialized) return;
      _initialized = true;
      // اتصال رویدادهای DOM اینجا
    }
    function open()  { _init(); /* ... */ }
    function close() { /* ... */ }
    return { open, close };
  })();
  ```
- اگر کامپوننت modal است، از API سراسری `window.Modal` استفاده کن:
  `Modal.open(id)`، `Modal.close(id)`، `Modal.onOpen(id, fn)`، `Modal.onClose(id, fn)`.
- تا جای ممکن از event delegation استفاده کن؛ از اتصال listener داخل حلقه پرهیز کن.
- هیچ `console.log` در خروجی نهایی نمانَد.

## مرحله ۴ — فرمت خروجی

برای هر node فیگما، خروجی را این‌گونه شروع کن:

```
### [نام node از فیگما] — <figma-url>
```

سپس سه بلوک کد:

```html
<!-- markup کامپوننت -->
```

```css
/* استایل‌های کامپوننت */
```

```js
// رفتار کامپوننت
```

در ادامه یک **یادداشت یکپارچه‌سازی** کوتاه (۲ تا ۴ گلوله) بنویس که توضیح دهد:
- این HTML snippet کجا باید در پروژه قرار گیرد (مثلاً داخل `index.html`، یک پوشه جدید `components/xxx/` و غیره).
- کدام فایل‌های CSS/JS موجود باید تکمیل شوند (مثلاً CSS را به `css/style.css` اضافه کن؛ JS را به `js/app.js`).
- مسیرهای asset که باید به‌روز شوند (`assets/images/...`).
- هر تغییری که نسبت به طراحی فیگما برای رعایت قوانین پروژه اعمال شده.

## مرحله ۵ — پردازش تمام nodeها

مراحل ۳ و ۴ را برای هر URL داده‌شده تکرار کن. وقتی همه تمام شدند، یک جدول خلاصه چاپ کن:

| # | نام Node | پیشنهاد فایل | یادداشت |
|---|----------|-------------|---------|
| ۱ | ... | ... | ... |
