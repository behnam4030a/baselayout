# Label Component — کامپوننت لیبل

**فایل CSS:** `components/label/label.css`

```html
<link rel="stylesheet" href="/components/label/label.css">
```

---

## استفاده سریع

```html
<label class="label label--{size}">
  <span class="label__text">برچسب</span>
</label>
```

---

## خصوصیت‌ها (Properties)

| خصوصیت | نوع | مقادیر | توضیح |
|---|---|---|---|
| type | modifier class | Regular (پیش‌فرض), Semibold | وزن فونت برچسب |
| size | modifier class | `label--large`, `label--medium`, `label--small` | اندازه تایپوگرافی |
| disabled | modifier class | `label--disabled` | حالت غیرفعال |
| required | modifier class + element | `label--required` + `label__required` | نمایش ستاره اجباری |

---

## سایزها (Sizes)

### Regular (پیش‌فرض)

| سایز | کلاس | فونت | وزن | ارتفاع خط |
|---|---|---|---|---|
| Large | `label--large` | 16px | 400 | 1.5 |
| Medium | `label--medium` | 14px | 400 | 1.5 |
| Small | `label--small` | 12px | 400 | 1.5 |

### Semibold

| سایز | کلاس | فونت | وزن | ارتفاع خط |
|---|---|---|---|---|
| Large | `label--large label--semibold` | 16px | 500 | 1.5 |
| Medium | `label--medium label--semibold` | 12px | 500 | 1.5 |
| Small | `label--small label--semibold` | 12px | 500 | 1.5 |

> **نکته:** در سایز Small، ستاره required از استایل Caption (13px / line-height 1.3) استفاده می‌کند.

---

## حالت‌ها (States)

| حالت | نحوه استفاده | توضیح |
|---|---|---|
| Normal | بدون کلاس اضافی | حالت پیش‌فرض — متن #222323 |
| Disabled | کلاس `label--disabled` | غیرفعال — متن و ستاره #bbbcbe |

### نکات مهم State
- Label **state تعاملی ندارد** (بدون hover/focus)
- رنگ Label نباید با hover یا focus فیلد مرتبط تغییر کند
- Disabled فقط تغییر بصری دارد و تعامل‌پذیری مستقل ندارد

---

## نمونه‌ها

**ساده (بدون Required):**
```html
<label class="label label--medium">
  <span class="label__text">برچسب</span>
</label>
```

**با Required:**
```html
<label class="label label--medium label--required">
  <span class="label__text">برچسب</span>
  <span class="label__required">*</span>
</label>
```

**Semibold:**
```html
<label class="label label--large label--semibold">
  <span class="label__text">برچسب</span>
</label>
```

**Semibold + Required:**
```html
<label class="label label--large label--semibold label--required">
  <span class="label__text">برچسب</span>
  <span class="label__required">*</span>
</label>
```

**Disabled:**
```html
<label class="label label--medium label--disabled">
  <span class="label__text">برچسب</span>
</label>
```

**Disabled + Required:**
```html
<label class="label label--medium label--required label--disabled">
  <span class="label__text">برچسب</span>
  <span class="label__required">*</span>
</label>
```

**مرتبط کردن با فیلد (for/id):**
```html
<label class="label label--medium label--required" for="email-input">
  <span class="label__text">ایمیل</span>
  <span class="label__required">*</span>
</label>
<input id="email-input" type="email" />
```

---

## ساختار HTML

```
label.label.label--{size}
├── span.label__text                ← متن برچسب
└── span.label__required            ← ستاره اجباری (اختیاری، بعد از متن)
```

---

## کلاس‌های CSS

| کلاس | توضیح |
|---|---|
| `label` | کلاس پایه (روی `<label>`) |
| `label--large` | سایز بزرگ (16px Regular / 16px Semibold) |
| `label--medium` | سایز متوسط (14px Regular / 12px Semibold) |
| `label--small` | سایز کوچک (12px) |
| `label--semibold` | وزن فونت Semibold (500) |
| `label--required` | نشانگر semantic فیلد اجباری |
| `label--disabled` | حالت غیرفعال |
| `label__text` | متن برچسب |
| `label__required` | ستاره اجباری (*) |

---

## رنگ‌ها

| عنصر | حالت عادی | حالت Disabled |
|---|---|---|
| متن برچسب | `#222323` | `#bbbcbe` |
| ستاره required | `#c50f1f` | `#bbbcbe` |

---

## مدیریت Disabled State با JavaScript

```javascript
// فعال کردن حالت disabled
document.querySelector('.label').classList.add('label--disabled');

// غیرفعال کردن حالت disabled
document.querySelector('.label').classList.remove('label--disabled');
```

---

## نکات مهم

- **type فقط font-weight:** تغییر type نباید باعث تغییر رنگ، اندازه یا فاصله‌ها شود.
- **size فقط font-size و line-height:** size باید فقط روی تایپوگرافی تأثیر بگذارد.
- **Label نمایشی است:** هیچ منطق تعاملی یا state مستقل ندارد.
- **Required فقط بصری:** منطق اعتبارسنجی فرم در Label پیاده‌سازی نمی‌شود.
- **ارتباط با فیلد:** از `for`/`id` یا `aria-labelledby` در لایه پیاده‌سازی استفاده کنید.
- **RTL/LTR:** جایگاه ستاره به صورت خودکار با flexbox سازگار می‌شود — در RTL سمت چپ (end)، در LTR سمت راست (end).
- **Accessibility:** از `<label>` بومی استفاده کنید. کنتراست رنگ حداقل 4.5:1 رعایت شده.
