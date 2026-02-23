# Checkbox Component — کامپوننت چک‌باکس

**فایل CSS:** `components/checkbox/checkbox.css`
**فایل JS:** `components/checkbox/checkbox.js`

```html
<link rel="stylesheet" href="/components/checkbox/checkbox.css">
<script src="/components/checkbox/checkbox.js" defer></script>
```

---

## استفاده سریع

```html
<label class="checkbox checkbox--{size}">
  <input type="checkbox" class="checkbox__input" />
  <span class="checkbox__label">برچسب</span>
  <span class="checkbox__box">
    <span class="checkbox__inner">
      <svg class="checkbox__icon checkbox__icon--check" viewBox="0 0 10 10" fill="none">
        <path d="M2 5.2L4 7.5L8 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg class="checkbox__icon checkbox__icon--indeterminate" viewBox="0 0 10 10" fill="none">
        <path d="M2.5 5H7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
  </span>
</label>
```

---

## وضعیت‌ها (Status)

| وضعیت | نحوه استفاده | توضیح |
|---|---|---|
| Unchecked | بدون اتریبیوت اضافی | انتخاب نشده |
| Checked | اتریبیوت `checked` روی input | انتخاب شده |
| Indeterminate | اتریبیوت `data-indeterminate` روی input | انتخاب جزئی (Select All) |

## سایزها (Sizes)

| سایز | کلاس | ابعاد باکس | فونت برچسب |
|---|---|---|---|
| Large | `checkbox--large` | 28px | 14px |
| Medium | `checkbox--medium` | 24px | 12px |

## حالت‌ها (States)

| حالت | نحوه استفاده |
|---|---|
| Rest | بدون کلاس اضافی |
| Hover | خودکار با `:hover` |
| Pressed | خودکار با `:active` |
| Focused | خودکار با `:focus-visible` (ناوبری کیبورد) |
| Disabled | اتریبیوت `disabled` روی input + کلاس `checkbox--disabled` روی label |

---

## نمونه‌ها

**ساده:**
```html
<label class="checkbox checkbox--large">
  <input type="checkbox" class="checkbox__input" />
  <span class="checkbox__label">موافقم</span>
  <span class="checkbox__box">
    <span class="checkbox__inner">
      <svg class="checkbox__icon checkbox__icon--check" viewBox="0 0 10 10" fill="none"><path d="M2 5.2L4 7.5L8 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <svg class="checkbox__icon checkbox__icon--indeterminate" viewBox="0 0 10 10" fill="none"><path d="M2.5 5H7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </span>
  </span>
</label>
```

**انتخاب شده:**
```html
<label class="checkbox checkbox--large">
  <input type="checkbox" class="checkbox__input" checked />
  <span class="checkbox__label">انتخاب شده</span>
  <span class="checkbox__box">...</span>
</label>
```

**غیرفعال:**
```html
<label class="checkbox checkbox--large checkbox--disabled">
  <input type="checkbox" class="checkbox__input" disabled />
  <span class="checkbox__label">غیرفعال</span>
  <span class="checkbox__box">...</span>
</label>
```

**غیرفعال + انتخاب شده:**
```html
<label class="checkbox checkbox--large checkbox--disabled">
  <input type="checkbox" class="checkbox__input" checked disabled />
  <span class="checkbox__label">غیرفعال انتخاب شده</span>
  <span class="checkbox__box">...</span>
</label>
```

**نامعین (Indeterminate):**
```html
<label class="checkbox checkbox--large">
  <input type="checkbox" class="checkbox__input" data-indeterminate />
  <span class="checkbox__label">انتخاب همه</span>
  <span class="checkbox__box">...</span>
</label>
```

**بدون برچسب:**
```html
<label class="checkbox checkbox--large">
  <input type="checkbox" class="checkbox__input" aria-label="انتخاب آیتم" />
  <span class="checkbox__box">
    <span class="checkbox__inner">
      <svg class="checkbox__icon checkbox__icon--check" viewBox="0 0 10 10" fill="none"><path d="M2 5.2L4 7.5L8 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <svg class="checkbox__icon checkbox__icon--indeterminate" viewBox="0 0 10 10" fill="none"><path d="M2.5 5H7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </span>
  </span>
</label>
```

**Select All (انتخاب همه):**
```html
<!-- والد -->
<label class="checkbox checkbox--large">
  <input type="checkbox" class="checkbox__input"
    data-checkbox-group="items"
    data-checkbox-role="parent" />
  <span class="checkbox__label">انتخاب همه</span>
  <span class="checkbox__box">...</span>
</label>

<!-- فرزندان -->
<label class="checkbox checkbox--medium">
  <input type="checkbox" class="checkbox__input"
    data-checkbox-group="items"
    data-checkbox-role="child" />
  <span class="checkbox__label">آیتم اول</span>
  <span class="checkbox__box">...</span>
</label>

<label class="checkbox checkbox--medium">
  <input type="checkbox" class="checkbox__input"
    data-checkbox-group="items"
    data-checkbox-role="child" />
  <span class="checkbox__label">آیتم دوم</span>
  <span class="checkbox__box">...</span>
</label>
```

---

## ساختار HTML

```
label.checkbox.checkbox--{size}
├── input.checkbox__input          ← input بومی (مخفی)
├── span.checkbox__label           ← برچسب (اختیاری)
└── span.checkbox__box             ← باکس خارجی
    └── span.checkbox__inner       ← باکس داخلی (border/background)
        ├── svg.checkbox__icon--check         ← آیکون تیک
        └── svg.checkbox__icon--indeterminate  ← آیکون خط
```

## کلاس‌های CSS

| کلاس | توضیح |
|---|---|
| `checkbox` | کلاس پایه (روی `<label>`) |
| `checkbox--large` | سایز بزرگ (28px) |
| `checkbox--medium` | سایز متوسط (24px) |
| `checkbox--disabled` | حالت غیرفعال |
| `checkbox__input` | input بومی مخفی |
| `checkbox__label` | متن برچسب |
| `checkbox__box` | باکس خارجی |
| `checkbox__inner` | باکس داخلی |
| `checkbox__icon--check` | آیکون تیک |
| `checkbox__icon--indeterminate` | آیکون خط |

## Data Attributes

| اتریبیوت | روی | توضیح |
|---|---|---|
| `data-indeterminate` | input | تنظیم خودکار حالت indeterminate توسط JS |
| `data-checkbox-group` | input | نام گروه برای منطق Select All |
| `data-checkbox-role` | input | نقش: `parent` یا `child` |

---

## نکات مهم

- **Checkbox vs Radio:** برای انتخاب چندگانه از Checkbox، برای انتخاب تکی از Radio استفاده کنید.
- **Checkbox vs Switch:** Checkbox نیاز به مرحله ارسال دارد. برای تغییر فوری از Switch استفاده کنید.
- **بدون برچسب:** حتماً `aria-label` روی input قرار دهید.
- **Indeterminate:** این وضعیت فقط بصری است و مقدار نهایی داده نیست.
