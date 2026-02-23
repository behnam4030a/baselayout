# Tooltip Component — کامپوننت تولتیپ

**فایل CSS:** `components/tooltip/tooltip.css`
**فایل JS:** `components/tooltip/tooltip.js`

```html
<link rel="stylesheet" href="/components/tooltip/tooltip.css">
<script src="/components/tooltip/tooltip.js" defer></script>
```

---

## استفاده سریع

```html
<span class="tooltip" data-tooltip="متن تولتیپ" data-tooltip-position="top">
  <button>دکمه</button>
</span>
```

JavaScript به صورت خودکار bubble و arrow را می‌سازد. نیازی به markup اضافی نیست.

---

## جهت‌ها (Positions)

| جهت | مقدار `data-tooltip-position` | محل bubble | جهت فلش |
|---|---|---|---|
| بالا (پیش‌فرض) | `top` | بالای trigger | به سمت پایین |
| پایین | `bottom` | پایین trigger | به سمت بالا |
| راست | `right` | سمت راست trigger | به سمت چپ |
| چپ | `left` | سمت چپ trigger | به سمت راست |

---

## نمونه‌ها

**بالا (Top):**
```html
<span class="tooltip" data-tooltip="اطلاعات ساده" data-tooltip-position="top">
  <button>متن پیشفرض</button>
</span>
```

**پایین (Bottom):**
```html
<span class="tooltip" data-tooltip="اطلاعات ساده" data-tooltip-position="bottom">
  <button>متن پیشفرض</button>
</span>
```

**راست (Right):**
```html
<span class="tooltip" data-tooltip="اطلاعات ساده" data-tooltip-position="right">
  <button>متن پیشفرض</button>
</span>
```

**چپ (Left):**
```html
<span class="tooltip" data-tooltip="اطلاعات ساده" data-tooltip-position="left">
  <button>متن پیشفرض</button>
</span>
```

**روی آیکن:**
```html
<span class="tooltip" data-tooltip="راهنمای این بخش" data-tooltip-position="top">
  <span tabindex="0">
    <svg><!-- آیکن info --></svg>
  </span>
</span>
```

**با تأخیر نمایش:**
```html
<span class="tooltip" data-tooltip="با تأخیر نیم ثانیه" data-tooltip-position="top" data-tooltip-delay="500">
  <button>نیم ثانیه</button>
</span>
```

**LTR:**
```html
<span class="tooltip" data-tooltip="English tooltip" data-tooltip-position="right" dir="ltr">
  <button>Button</button>
</span>
```

---

## ساختار HTML

```
span.tooltip[data-tooltip][data-tooltip-position]
├── <trigger>                    ← عنصر trigger (دکمه، آیکن، ...)
└── span.tooltip__bubble         ← بدنه تولتیپ (ساخته شده توسط JS)
    └── span.tooltip__arrow      ← فلش/مثلث (چسبیده به bubble)
```

> عنصر `tooltip__bubble` (شامل `tooltip__arrow`) به صورت خودکار توسط JavaScript ساخته می‌شود. Arrow داخل bubble قرار دارد و همراه آن ظاهر می‌شود.

---

## کلاس‌های CSS

### Block و Elements

| کلاس | توضیح |
|---|---|
| `tooltip` | کلاس پایه (روی wrapper) |
| `tooltip__bubble` | بدنه تولتیپ (متن + پس‌زمینه تیره) |
| `tooltip__arrow` | فلش مثلثی به سمت trigger |

### Modifiers

| کلاس | توضیح |
|---|---|
| `tooltip--top` | جهت بالا (پیش‌فرض) |
| `tooltip--bottom` | جهت پایین |
| `tooltip--right` | جهت راست |
| `tooltip--left` | جهت چپ |
| `tooltip--visible` | حالت نمایش (opacity 1) |

---

## Data Attributes

| اتریبیوت | روی | توضیح |
|---|---|---|
| `data-tooltip` | `span.tooltip` | متن تولتیپ (الزامی) |
| `data-tooltip-position` | `span.tooltip` | جهت نمایش: `top` \| `bottom` \| `right` \| `left` (پیش‌فرض: `top`) |
| `data-tooltip-delay` | `span.tooltip` | تأخیر نمایش به میلی‌ثانیه (پیش‌فرض: `0`) |

---

## CSS Custom Properties

| متغیر | مقدار پیش‌فرض | توضیح |
|---|---|---|
| `--tooltip-color-bg` | `#364455` | رنگ پس‌زمینه |
| `--tooltip-color-text` | `#ffffff` | رنگ متن |
| `--tooltip-font-family` | `Peyda(FaNum), sans-serif` | فونت |
| `--tooltip-font-size` | `14px` | اندازه فونت |
| `--tooltip-font-weight` | `500` | وزن فونت |
| `--tooltip-line-height` | `1.4` | ارتفاع خط |
| `--tooltip-radius` | `4px` | شعاع گوشه‌ها |
| `--tooltip-padding-x` | `12px` | padding افقی |
| `--tooltip-padding-y` | `8px` | padding عمودی |
| `--tooltip-offset` | `9px` | فاصله bubble از trigger |
| `--tooltip-arrow-size` | `6px` | اندازه فلش |
| `--tooltip-max-width` | `240px` | حداکثر عرض |
| `--tooltip-transition` | `0.15s ease` | مدت transition |

برای override:
```css
:root {
  --tooltip-color-bg: #1a1a2e;
  --tooltip-radius: 8px;
}
```

---

## JavaScript API

تولتیپ‌هایی که هنگام بارگذاری صفحه در DOM هستند به صورت خودکار راه‌اندازی می‌شوند.

### `Tooltip.init(element)` — فعال‌سازی یک تولتیپ

```javascript
var el = document.querySelector('.tooltip');
var instance = Tooltip.init(el);
```

### `Tooltip.initAll()` — فعال‌سازی همه تولتیپ‌ها

```javascript
Tooltip.initAll();
```

### Instance Methods

پس از `init`، به instance از طریق `el._tooltipInstance` دسترسی دارید:

```javascript
var instance = el._tooltipInstance;
```

| متد | توضیح |
|---|---|
| `instance.show()` | نمایش تولتیپ |
| `instance.hide()` | مخفی کردن تولتیپ |
| `instance.setText(text)` | تغییر متن تولتیپ |
| `instance.destroy()` | حذف event listeners و cleanup |

**مثال تغییر متن:**
```javascript
var el = document.querySelector('.tooltip');
var instance = el._tooltipInstance;

instance.setText('متن جدید تولتیپ');
```

**مثال نمایش/مخفی دستی:**
```javascript
instance.show();

setTimeout(function () {
  instance.hide();
}, 3000);
```

---

## دسترسی‌پذیری (Accessibility)

| اتریبیوت | المان | توضیح |
|---|---|---|
| `role="tooltip"` | bubble | نقش تولتیپ برای screen reader |
| `id` (یکتا) | bubble | شناسه یکتا برای اتصال ARIA |
| `aria-describedby` | trigger | اشاره به id تولتیپ |

- تولتیپ هنگام **focus** روی trigger نمایش داده می‌شود (keyboard accessible)
- Screen reader محتوای تولتیپ را از طریق `aria-describedby` اعلام می‌کند
- عنصر trigger باید focusable باشد (`<button>`، `<a>`، یا `tabindex="0"`)

---

## نکات مهم

- **`data-tooltip` الزامی است:** متن تولتیپ را مشخص می‌کند. بدون آن تولتیپ ساخته نمی‌شود.
- **Bubble خودکار:** نیازی به نوشتن `tooltip__bubble` و `tooltip__arrow` در HTML نیست. JavaScript آنها را می‌سازد. Arrow داخل bubble قرار می‌گیرد و همراه آن ظاهر/مخفی می‌شود.
- **فقط متن ساده:** تولتیپ برای اطلاعات ساده و غیر تعاملی است. برای محتوای تعاملی از Popover استفاده کنید.
- **Trigger focusable:** عنصر داخل tooltip باید focusable باشد تا با کیبورد قابل دسترس باشد.
- **RTL/LTR:** به صورت پیش‌فرض RTL است. برای LTR از `dir="ltr"` استفاده کنید.
- **تأخیر نمایش:** از `data-tooltip-delay` برای جلوگیری از نمایش ناخواسته هنگام عبور سریع mouse استفاده کنید.
- **max-width:** تولتیپ حداکثر عرض 240px دارد. برای متن‌های طولانی‌تر، متن کوتاه‌تر انتخاب کنید.
- **بدون auto-positioning:** تولتیپ جهت خود را بر اساس viewport تنظیم نمی‌کند. جهت مناسب را انتخاب کنید تا از لبه صفحه خارج نشود.
