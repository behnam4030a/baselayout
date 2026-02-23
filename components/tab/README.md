# Tab Component — کامپوننت تب

تب (Tab) یعنی سوئیچ بین چند نمای هم‌سطح داخل یک صفحه — بدون اینکه کاربر از صفحه خارج شود.

## نصب

فایل‌های CSS و JS را به صفحه اضافه کنید:

```html
<link rel="stylesheet" href="components/tab/tab.css">
<script src="components/tab/tab.js" defer></script>
```

## ساختار HTML پایه

```html
<div class="tab" data-tab-group="my-tabs">
  <div class="tab__list" role="tablist">
    <button class="tab__item tab__item--active" role="tab">تب اول</button>
    <button class="tab__item" role="tab">تب دوم</button>
    <button class="tab__item" role="tab">تب سوم</button>
  </div>
</div>

<!-- پنل‌های محتوا (بلافاصله بعد از div.tab) -->
<div class="tab__panel tab__panel--active" role="tabpanel">محتوای تب اول</div>
<div class="tab__panel" role="tabpanel">محتوای تب دوم</div>
<div class="tab__panel" role="tabpanel">محتوای تب سوم</div>
```

> پنل‌ها باید بلافاصله بعد از `div.tab` قرار بگیرند (sibling). ترتیب پنل‌ها با ترتیب تب‌ها مطابقت دارد.

## انواع (Variants)

### ۱. Underline — خط زیر (پیش‌فرض)

تب فعال با خط زیر سبز مشخص می‌شود. Container پس‌زمینه سفید دارد.

```html
<div class="tab" data-tab-group="my-tabs">
  <div class="tab__list" role="tablist">
    <button class="tab__item tab__item--active" role="tab">جزئیات حساب</button>
    <button class="tab__item" role="tab">اطلاع رسانی</button>
    <button class="tab__item" role="tab">امنیت</button>
  </div>
</div>
```

### ۲. Filled — پر شده (Pill)

با افزودن کلاس `tab--filled` تب فعال با پس‌زمینه سبز و متن سفید نمایش می‌یابد.
Container بدون پس‌زمینه سفید است.

```html
<div class="tab tab--filled" data-tab-group="my-tabs-2">
  <div class="tab__list" role="tablist">
    <button class="tab__item tab__item--active" role="tab">جزئیات حساب</button>
    <button class="tab__item" role="tab">اطلاع رسانی</button>
    <button class="tab__item" role="tab">امنیت</button>
  </div>
</div>
```

| ویژگی | Underline (پیش‌فرض) | Filled (Pill) |
|-------|---------------------|---------------|
| Container bg | سفید (#ffffff) | شفاف (بدون بک‌گراند) |
| تب فعال | خط زیر 2px سبز | بک‌گراند سبز، متن سفید |
| ارتفاع تب فعال | تمام ارتفاع container | 38px (pill) |
| border-radius فعال | — | 8px |

### ۳. با آیکن (Icon)

با افزودن کلاس `tab--icon` آیتم‌ها وسط‌چین می‌شوند.
آیکن **قبل از متن** در HTML قرار می‌گیرد (در RTL سمت راست متن نمایش می‌یابد).

```html
<div class="tab tab--icon" data-tab-group="my-tabs-3">
  <div class="tab__list" role="tablist">
    <button class="tab__item tab__item--active" role="tab">
      <span class="tab__icon">
        <svg viewBox="0 0 24 24" fill="none"><!-- آیکن --></svg>
      </span>
      <span class="tab__text">جزئیات حساب</span>
    </button>
    <button class="tab__item" role="tab">
      <span class="tab__icon">
        <svg viewBox="0 0 24 24" fill="none"><!-- آیکن --></svg>
      </span>
      <span class="tab__text">اطلاع رسانی</span>
    </button>
  </div>
</div>
```

> رنگ آیکن به صورت خودکار با رنگ متن تب (فعال/غیرفعال) تغییر می‌کند.

### ۴. با Badge (عدد)

برای نمایش عدد/شمارنده کنار متن تب.
Badge **بعد از متن** در HTML قرار می‌گیرد (در RTL سمت چپ متن نمایش می‌یابد).

```html
<div class="tab" data-tab-group="my-tabs-4">
  <div class="tab__list" role="tablist">
    <button class="tab__item tab__item--active" role="tab">
      <span class="tab__text">امنیت</span>
      <span class="tab__badge">۳</span>
    </button>
    <button class="tab__item" role="tab">اطلاع رسانی</button>
    <button class="tab__item" role="tab">جزئیات حساب</button>
  </div>
</div>
```

> Badge دایره‌ای با بک‌گراند سبز روشن (#eaf8f5) و عدد سبز (#26a88c) است.

## JavaScript API

| متد | توضیح |
|-----|-------|
| `Tab.activate(groupId, index)` | فعال کردن تب با index (شروع از 0) |
| `Tab.onChange(groupId, fn)` | تنظیم callback تغییر تب |
| `Tab.init(element)` | فعال‌سازی یک تب جدید |
| `Tab.initAll()` | فعال‌سازی همه تب‌ها |

### فعال کردن تب با کد

```js
// فعال کردن تب دوم (index 1)
Tab.activate('my-tabs', 1);
```

### Callback تغییر تب

```js
Tab.onChange('my-tabs', function(index) {
  console.log('تب فعال:', index);
});
```

## Keyboard Navigation

| کلید | عملکرد |
|------|--------|
| `Arrow Right/Left` | جابجایی بین تب‌ها (RTL-aware) |
| `Home` | رفتن به اولین تب |
| `End` | رفتن به آخرین تب |
| `Enter` / `Space` | فعال کردن تب |

## ویژگی‌ها

- **RTL**: پشتیبانی کامل — آیتم‌ها از راست به چپ
- **LTR**: پشتیبانی خودکار — آیتم‌ها از چپ به راست
- **Accessibility**: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`, `tabindex`
- **Auto-init**: فعال‌سازی خودکار هنگام بارگذاری صفحه
- **Keyboard**: پشتیبانی کامل از Arrow keys، Home/End، Enter/Space

## CSS Custom Properties

متغیرهای اصلی قابل تغییر در `:root`:

```css
/* Typography */
--tab-font-family: 'Peyda(FaNum)', sans-serif;
--tab-font-size: 13px;
--tab-font-weight-active: 500;
--tab-font-weight-inactive: 400;
--tab-line-height: 1.3;

/* Colors */
--tab-container-bg: #ffffff;
--tab-active-text: #222323;
--tab-inactive-text: #59595a;
--tab-brand: #26a88c;
--tab-brand-tint: #eaf8f5;
--tab-filled-active-bg: #26a88c;
--tab-filled-active-text: #ffffff;

/* Spacing */
--tab-container-padding-x: 24px;
--tab-container-gap: 12px;
--tab-item-padding-x: 12px;
--tab-item-padding-y: 16px;

/* Size */
--tab-container-height: 48px;
--tab-filled-active-height: 38px;
--tab-icon-size: 20px;
--tab-badge-size: 15px;

/* Radius */
--tab-container-radius: 8px;
--tab-filled-active-radius: 8px;
```

## BEM Elements

| کلاس | توضیح |
|-------|-------|
| `.tab` | wrapper اصلی — `data-tab-group` الزامی |
| `.tab__list` | نوار حاوی آیتم‌ها |
| `.tab__item` | هر آیتم تب |
| `.tab__item--active` | تب فعال |
| `.tab__text` | متن تب (وقتی آیکن یا badge دارد) |
| `.tab__icon` | آیکن تب (20px) |
| `.tab__badge` | badge عددی (15px، دایره سبز) |
| `.tab__panel` | پنل محتوا |
| `.tab__panel--active` | پنل فعال |
| `.tab--filled` | نوع Filled (Pill) |
| `.tab--icon` | نوع آیکن‌دار (وسط‌چین) |
