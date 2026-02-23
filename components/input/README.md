# Input Component — کامپوننت اینپوت

**فایل CSS:** `components/input/input.css`

```html
<link rel="stylesheet" href="/components/input/input.css">
```

---

## استفاده سریع

```html
<div class="input input--{size}">
  <div class="input__container">
    <input type="text" class="input__field" placeholder="متن نگهدارنده" />
  </div>
  <span class="input__indicator"></span>
</div>
```

---

## سایزها (Sizes)

| سایز | کلاس | ارتفاع | فونت | آیکن Before | آیکن After | Divider |
|---|---|---|---|---|---|---|
| Large | `input--large` | 45px | 14px | 20px | 16px | 16px |
| Medium | `input--medium` | 37px | 14px | 20px | 16px | 12px |
| Small | `input--small` | 24px | 12px | 16px | 16px | 8px |

## حالت‌ها (States)

| حالت | نحوه استفاده | توضیح |
|---|---|---|
| Rest | بدون کلاس اضافی | حالت پیش‌فرض |
| Hover | خودکار با `:hover` | نشانگر روی input |
| Focused | خودکار با `:focus-within` | cursor داخل فیلد |
| Error | کلاس `input--error` روی wrapper | ورودی نامعتبر |
| Disabled | اتریبیوت `disabled` روی input | غیرفعال، بدون تعامل |
| ReadOnly | اتریبیوت `readonly` روی input | قابل انتخاب، غیرقابل ویرایش |

### اولویت State ها

در صورت همپوشانی: **disabled > error > focused > hover > rest**

---

## نمونه‌ها

**ساده (بدون آیکن):**
```html
<div class="input input--large">
  <div class="input__container">
    <input type="text" class="input__field" placeholder="متن نگهدارنده" />
  </div>
  <span class="input__indicator"></span>
</div>
```

**با آیکن قبل از متن (Before):**
```html
<div class="input input--large">
  <div class="input__container">
    <span class="input__icon input__icon--before">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5"/>
        <path d="M16.5 16.5L20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
    <span class="input__divider"></span>
    <input type="text" class="input__field" placeholder="جستجو..." />
  </div>
  <span class="input__indicator"></span>
</div>
```

**با آیکن بعد از متن (After):**
```html
<div class="input input--large">
  <div class="input__container">
    <input type="text" class="input__field" placeholder="انتخاب کنید" />
    <span class="input__icon input__icon--after">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </div>
  <span class="input__indicator"></span>
</div>
```

**با هر دو آیکن:**
```html
<div class="input input--medium">
  <div class="input__container">
    <span class="input__icon input__icon--before">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5"/>
        <path d="M16.5 16.5L20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
    <span class="input__divider"></span>
    <input type="text" class="input__field" placeholder="متن نگهدارنده" />
    <span class="input__icon input__icon--after">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </div>
  <span class="input__indicator"></span>
</div>
```

**Error (خطا):**
```html
<div class="input input--large input--error">
  <div class="input__container">
    <input type="text" class="input__field" placeholder="متن نگهدارنده" aria-invalid="true" />
  </div>
  <span class="input__indicator"></span>
</div>
```

**Disabled (غیرفعال):**
```html
<div class="input input--large">
  <div class="input__container">
    <input type="text" class="input__field" placeholder="متن نگهدارنده" disabled />
  </div>
  <span class="input__indicator"></span>
</div>
```

**ReadOnly (فقط‌خواندنی):**
```html
<div class="input input--large">
  <div class="input__container">
    <input type="text" class="input__field" value="متن فقط‌خواندنی" readonly />
  </div>
  <span class="input__indicator"></span>
</div>
```

**عرض کامل:**
```html
<div class="input input--large input--full-width">
  <div class="input__container">
    <input type="text" class="input__field" placeholder="متن نگهدارنده" />
  </div>
  <span class="input__indicator"></span>
</div>
```

---

## ساختار HTML

```
div.input.input--{size}
├── div.input__container                ← کانتینر داخلی (flex)
│   ├── span.input__icon--before        ← آیکن قبل از متن (اختیاری)
│   ├── span.input__divider             ← خط جداکننده عمودی (اختیاری، فقط با before icon)
│   ├── input.input__field              ← فیلد ورودی بومی
│   └── span.input__icon--after         ← آیکن بعد از متن (اختیاری)
└── span.input__indicator               ← خط پایینی (Accessible Indicator)
```

## کلاس‌های CSS

| کلاس | توضیح |
|---|---|
| `input` | کلاس پایه (روی `<div>` wrapper) |
| `input--large` | سایز بزرگ (45px) |
| `input--medium` | سایز متوسط (37px) |
| `input--small` | سایز کوچک (24px) |
| `input--error` | حالت خطا |
| `input--disabled` | حالت غیرفعال (fallback برای مرورگرهای بدون `:has()`) |
| `input--readonly` | حالت فقط‌خواندنی (fallback برای مرورگرهای بدون `:has()`) |
| `input--full-width` | عرض کامل (100%) |
| `input__container` | کانتینر داخلی |
| `input__field` | فیلد ورودی بومی |
| `input__icon` | آیکن wrapper |
| `input__icon--before` | آیکن قبل از متن (سمت start) |
| `input__icon--after` | آیکن بعد از متن (سمت end) |
| `input__divider` | خط جداکننده عمودی |
| `input__indicator` | خط پایینی (Accessible Indicator) |

---

## Accessible Indicator (خط پایینی)

| State | وضعیت | رنگ |
|---|---|---|
| Rest | مخفی | — |
| Hover | قابل مشاهده | `#c0c1c3` |
| Focused | قابل مشاهده | `#2abb9c` |
| Error | مخفی | — |
| Disabled | مخفی | — |
| ReadOnly | مخفی | — |

---

## مدیریت Error State با JavaScript

```javascript
// فعال کردن حالت خطا
document.querySelector('.input').classList.add('input--error');
document.querySelector('.input__field').setAttribute('aria-invalid', 'true');

// غیرفعال کردن حالت خطا
document.querySelector('.input').classList.remove('input--error');
document.querySelector('.input__field').setAttribute('aria-invalid', 'false');
```

---

## آیکن‌ها

- آیکن‌ها باید با **Icon Component** یا **inline SVG** درون `<span class="input__icon">` قرار بگیرند.
- رنگ آیکن از `currentColor` ارث‌بری می‌کند و مطابق state تغییر می‌کند.
- `input__divider` فقط زمانی استفاده شود که `input__icon--before` وجود دارد.
- جایگاه آیکن‌ها بر اساس direction (RTL/LTR) خودکار تنظیم می‌شود:
  - **RTL:** before = راست، after = چپ
  - **LTR:** before = چپ، after = راست

---

## نکات مهم

- **Input vs Textarea:** برای متن کوتاه تک‌خطی از Input، برای متن چندخطی از Textarea استفاده کنید.
- **Disabled vs ReadOnly:** Disabled هیچ تعاملی ندارد. ReadOnly قابل focus و انتخاب متن است اما قابل ویرایش نیست.
- **Error State:** یک state منطقی است و باید توسط اعتبارسنجی فرم فعال/غیرفعال شود.
- **`:has()` Fallback:** برای مرورگرهای قدیمی‌تر، از کلاس‌های `input--disabled` و `input--readonly` روی wrapper استفاده کنید.
- **Accessibility:** در حالت Error حتماً `aria-invalid="true"` روی input قرار دهید. در صورت نبود label خارجی، `aria-label` الزامی است.
