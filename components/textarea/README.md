# Textarea Component — کامپوننت ناحیه متنی

**فایل CSS:** `components/textarea/textarea.css`

```html
<link rel="stylesheet" href="/components/textarea/textarea.css">
```

---

## استفاده سریع

```html
<div class="textarea textarea--{size}">
  <div class="textarea__container">
    <textarea class="textarea__field" placeholder="متن نگهدارنده"></textarea>
  </div>

</div>
```

---

## سایزها (Sizes)

| سایز | کلاس | ارتفاع | فونت | line-height | padding افقی |
|---|---|---|---|---|---|
| Large | `textarea--large` | 72px | 14px | 2 | 16px |
| Medium | `textarea--medium` | 64px | 14px | 2 | 12px |
| Small | `textarea--small` | 36px | 12px | 1.5 | 8px |

## حالت‌ها (States)

| حالت | نحوه استفاده | توضیح |
|---|---|---|
| Rest | بدون کلاس اضافی | حالت پیش‌فرض |
| Hover | خودکار با `:hover` | نشانگر روی textarea |
| Focused | خودکار با `:focus-within` | cursor داخل فیلد |
| Error | کلاس `textarea--error` روی wrapper | ورودی نامعتبر |
| Disabled | اتریبیوت `disabled` روی textarea | غیرفعال، بدون تعامل |
| ReadOnly | اتریبیوت `readonly` روی textarea | قابل انتخاب، غیرقابل ویرایش |

### اولویت State ها

در صورت همپوشانی: **disabled > error > focused > hover > rest**

---

## نمونه‌ها

**ساده:**
```html
<div class="textarea textarea--large">
  <div class="textarea__container">
    <textarea class="textarea__field" placeholder="متن نگهدارنده"></textarea>
  </div>

</div>
```

**با قابلیت Resize:**
```html
<div class="textarea textarea--large textarea--resizable">
  <div class="textarea__container">
    <textarea class="textarea__field" placeholder="متن نگهدارنده"></textarea>
  </div>

</div>
```

**Error (خطا):**
```html
<div class="textarea textarea--large textarea--error">
  <div class="textarea__container">
    <textarea class="textarea__field" placeholder="متن نگهدارنده" aria-invalid="true"></textarea>
  </div>

</div>
```

**Disabled (غیرفعال):**
```html
<div class="textarea textarea--large">
  <div class="textarea__container">
    <textarea class="textarea__field" placeholder="متن نگهدارنده" disabled></textarea>
  </div>

</div>
```

**ReadOnly (فقط‌خواندنی):**
```html
<div class="textarea textarea--large">
  <div class="textarea__container">
    <textarea class="textarea__field" readonly>متن فقط‌خواندنی</textarea>
  </div>

</div>
```

**عرض کامل:**
```html
<div class="textarea textarea--large textarea--full-width">
  <div class="textarea__container">
    <textarea class="textarea__field" placeholder="متن نگهدارنده"></textarea>
  </div>

</div>
```

---

## ساختار HTML

```
div.textarea.textarea--{size}
└── div.textarea__container                ← کانتینر داخلی (border, background, indicator via box-shadow)
    └── textarea.textarea__field           ← فیلد ورودی بومی (multi-line)
```

## کلاس‌های CSS

| کلاس | توضیح |
|---|---|
| `textarea` | کلاس پایه (روی `<div>` wrapper) |
| `textarea--large` | سایز بزرگ (72px) |
| `textarea--medium` | سایز متوسط (64px) |
| `textarea--small` | سایز کوچک (36px) |
| `textarea--error` | حالت خطا |
| `textarea--disabled` | حالت غیرفعال (fallback برای مرورگرهای بدون `:has()`) |
| `textarea--readonly` | حالت فقط‌خواندنی (fallback برای مرورگرهای بدون `:has()`) |
| `textarea--resizable` | فعال‌سازی resize عمودی |
| `textarea--full-width` | عرض کامل (100%) |
| `textarea__container` | کانتینر داخلی |
| `textarea__field` | فیلد ورودی بومی (`<textarea>`) |

---

## Resize Handler (تغییر اندازه)

| حالت | کلاس | رفتار |
|---|---|---|
| غیرفعال (پیش‌فرض) | بدون کلاس اضافی | `resize: none` — اندازه ثابت |
| فعال | `textarea--resizable` | `resize: vertical` — فقط تغییر ارتفاع |
| Disabled + Resizable | `textarea--resizable` + `disabled` | `resize: none` — غیرفعال حتی با کلاس resizable |

---

## Accessible Indicator (خط پایینی)

| State | وضعیت | رنگ |
|---|---|---|
| Rest | مخفی | — |
| Hover | قابل مشاهده | `#59595a` |
| Focused | قابل مشاهده | `#2abb9c` |
| Error | مخفی | — |
| Disabled | مخفی | — |
| ReadOnly | مخفی | — |

---

## مدیریت Error State با JavaScript

```javascript
// فعال کردن حالت خطا
document.querySelector('.textarea').classList.add('textarea--error');
document.querySelector('.textarea__field').setAttribute('aria-invalid', 'true');

// غیرفعال کردن حالت خطا
document.querySelector('.textarea').classList.remove('textarea--error');
document.querySelector('.textarea__field').setAttribute('aria-invalid', 'false');
```

---

## نکات مهم

- **Input vs Textarea:** برای متن کوتاه تک‌خطی از Input، برای متن چندخطی از Textarea استفاده کنید.
- **Disabled vs ReadOnly:** Disabled هیچ تعاملی ندارد. ReadOnly قابل focus و انتخاب متن است اما قابل ویرایش نیست.
- **Error State:** یک state منطقی است و باید توسط اعتبارسنجی فرم فعال/غیرفعال شود. در حالت Error، wrapper بیرونی border قرمز (`#c50f1f`) و container داخلی border عادی (`#e2e4e6`) دارد.
- **Resize:** با کلاس `textarea--resizable` فعال می‌شود. در حالت disabled، resize خودکار غیرفعال است.
- **`:has()` Fallback:** برای مرورگرهای قدیمی‌تر، از کلاس‌های `textarea--disabled` و `textarea--readonly` روی wrapper استفاده کنید.
- **RTL/LTR:** به صورت پیش‌فرض RTL است. برای LTR از `dir="ltr"` روی wrapper یا والد استفاده کنید.
- **Accessibility:** در حالت Error حتماً `aria-invalid="true"` روی textarea قرار دهید. در صورت نبود label خارجی، `aria-label` الزامی است.
