# Switch Component — کامپوننت سوئیچ

**فایل CSS:** `components/switch/switch.css`

```html
<link rel="stylesheet" href="/components/switch/switch.css">
```

---

## استفاده سریع

```html
<label class="switch">
  <input type="checkbox" class="switch__input" role="switch" />
  <span class="switch__track">
    <span class="switch__thumb">
      <svg class="switch__icon switch__icon--check" viewBox="0 0 14 14" fill="none">
        <path d="M3.75 7.5L5.75 9.75L10.25 4.25" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg class="switch__icon switch__icon--close" viewBox="0 0 14 14" fill="none">
        <path d="M4.25 4.25L9.75 9.75M9.75 4.25L4.25 9.75" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
  </span>
</label>
```

---

## خصوصیت‌ها (Properties)

| خصوصیت | نوع | مقادیر | توضیح |
|---|---|---|---|
| state | خودکار (CSS) | Rest, Hover, Pressed, Focus, Disabled | وضعیت تعاملی — با CSS pseudo-classes مدیریت می‌شود |
| checked | attribute | `checked` روی `<input>` | آیا Switch روشن است |

---

## حالت‌ها (States)

### وضعیت‌های تعاملی

| حالت | شرط | توضیح |
|---|---|---|
| Rest | بدون تعامل | حالت پیش‌فرض |
| Hover | نشانگر روی Switch | تغییر رنگ Track |
| Pressed | کلیک/فشردن | تغییر رنگ Track — موقتی |
| Focus | فوکوس کیبورد | نمایش focus ring روی wrapper (غیر انحصاری) |
| Disabled | `disabled` روی `<input>` | غیرفعال — بدون تعامل |

### اولویت حالت‌ها
```
disabled > pressed > focus > hover > rest
```

### رفتار فوکوس (Non-Exclusive)
فوکوس یک لایه بصری مستقل است و همزمان با سایر حالت‌ها نمایش داده می‌شود:
- rest + focus
- hover + focus
- pressed + focus

فوکوس در حالت disabled نمایش داده نمی‌شود.

---

## رنگ‌ها

### Track — حالت Checked (روشن)

| حالت | Background | Border |
|---|---|---|
| Rest | `#26a88c` | `#eaf8f5` |
| Hover | `#22967d` | `#eaf8f5` |
| Pressed | `#19705e` | `#eaf8f5` |
| Disabled | `#f6f8fa` | `#dddfe1` |

### Track — حالت Unchecked (خاموش)

| حالت | Background | Border |
|---|---|---|
| Rest | `#ffffff` | `#e2e4e6` |
| Hover | `#f6f8fa` | `#e2e4e6` |
| Pressed | `#dddfe1` | `#e2e4e6` |
| Disabled | `#f6f8fa` | `#dddfe1` |

### Thumb (دایره متحرک)

| وضعیت | Background | Border |
|---|---|---|
| Checked | `#ffffff` | `#26a88c` |
| Unchecked | `#ffffff` | `#e2e4e6` |
| Disabled | `#e7e9eb` | `#dddfe1` |

### آیکن داخل Thumb

| وضعیت | آیکن | رنگ |
|---|---|---|
| Checked | checkmark | `#26a88c` |
| Unchecked | X | `#59595a` |
| Disabled | checkmark یا X | `#bbbcbe` |

### سایر رنگ‌ها

| عنصر | رنگ |
|---|---|
| Focus Ring | `#222323` |

---

## نمونه‌ها

**Switch ساده (خاموش):**
```html
<label class="switch">
  <input type="checkbox" class="switch__input" role="switch" />
  <span class="switch__track">
    <span class="switch__thumb">
      <svg class="switch__icon switch__icon--check" viewBox="0 0 14 14" fill="none">
        <path d="M3.75 7.5L5.75 9.75L10.25 4.25" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg class="switch__icon switch__icon--close" viewBox="0 0 14 14" fill="none">
        <path d="M4.25 4.25L9.75 9.75M9.75 4.25L4.25 9.75" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
  </span>
</label>
```

**Switch روشن (Checked):**
```html
<label class="switch">
  <input type="checkbox" class="switch__input" role="switch" checked />
  <span class="switch__track">
    <span class="switch__thumb">
      <svg class="switch__icon switch__icon--check" viewBox="0 0 14 14" fill="none">
        <path d="M3.75 7.5L5.75 9.75L10.25 4.25" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg class="switch__icon switch__icon--close" viewBox="0 0 14 14" fill="none">
        <path d="M4.25 4.25L9.75 9.75M9.75 4.25L4.25 9.75" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
  </span>
</label>
```

**Switch غیرفعال (Disabled):**
```html
<label class="switch">
  <input type="checkbox" class="switch__input" role="switch" disabled />
  <span class="switch__track">
    <span class="switch__thumb">
      <svg class="switch__icon switch__icon--check" viewBox="0 0 14 14" fill="none">
        <path d="M3.75 7.5L5.75 9.75L10.25 4.25" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg class="switch__icon switch__icon--close" viewBox="0 0 14 14" fill="none">
        <path d="M4.25 4.25L9.75 9.75M9.75 4.25L4.25 9.75" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
  </span>
</label>
```

**Switch غیرفعال + روشن:**
```html
<label class="switch">
  <input type="checkbox" class="switch__input" role="switch" checked disabled />
  <span class="switch__track">
    <span class="switch__thumb">
      <svg class="switch__icon switch__icon--check" viewBox="0 0 14 14" fill="none">
        <path d="M3.75 7.5L5.75 9.75L10.25 4.25" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg class="switch__icon switch__icon--close" viewBox="0 0 14 14" fill="none">
        <path d="M4.25 4.25L9.75 9.75M9.75 4.25L4.25 9.75" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
  </span>
</label>
```

**Switch با Label جداگانه:**
```html
<div style="display: inline-flex; align-items: center; gap: 8px;">
  <span>حالت شب</span>
  <label class="switch">
    <input type="checkbox" class="switch__input" role="switch" />
    <span class="switch__track">
      <span class="switch__thumb">
        <svg class="switch__icon switch__icon--check" viewBox="0 0 14 14" fill="none">
          <path d="M3.75 7.5L5.75 9.75L10.25 4.25" stroke="currentColor"
            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg class="switch__icon switch__icon--close" viewBox="0 0 14 14" fill="none">
          <path d="M4.25 4.25L9.75 9.75M9.75 4.25L4.25 9.75" stroke="currentColor"
            stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </span>
    </span>
  </label>
</div>
```

---

## ساختار HTML

```
label.switch
├── input.switch__input          ← input بومی مخفی (type="checkbox" role="switch")
└── span.switch__track           ← نوار پس‌زمینه (40px × 20px)
    └── span.switch__thumb       ← دایره متحرک (22px × 22px)
        ├── svg.switch__icon--check  ← آیکن checkmark (حالت روشن)
        └── svg.switch__icon--close  ← آیکن X (حالت خاموش)
```

---

## کلاس‌های CSS

| کلاس | توضیح |
|---|---|
| `switch` | کلاس پایه (روی `<label>` wrapper) |
| `switch__input` | input بومی مخفی (`<input type="checkbox" role="switch">`) |
| `switch__track` | نوار پس‌زمینه — رنگ بر اساس state و checked |
| `switch__thumb` | دایره متحرک — موقعیت بر اساس checked |
| `switch__icon` | کلاس پایه آیکن داخل Thumb (14px) |
| `switch__icon--check` | آیکن checkmark (نمایش در حالت checked) |
| `switch__icon--close` | آیکن X (نمایش در حالت unchecked) |
| `switch--disabled` | حالت غیرفعال (fallback برای مرورگرهای بدون `:has()`) |

---

## اندازه‌ها

| عنصر | اندازه |
|---|---|
| Wrapper (کل کامپوننت) | 56px × 36px |
| Track (نوار پس‌زمینه) | 40px × 20px |
| Thumb (دایره متحرک) | 22px × 22px |
| Icon (آیکن) | 14px × 14px |
| Border (Track و Thumb) | 1px solid |
| Focus Ring border | 1px solid |
| Focus Ring border-radius | 4px |
| Track border-radius | 360px (full) |
| Thumb border-radius | 360px (full) |

---

## فاصله‌گذاری

| فاصله | مقدار |
|---|---|
| Wrapper padding | 8px (7px + 1px border) |
| Track padding | 4px |

---

## مدیریت با JavaScript

```javascript
// روشن کردن Switch
document.querySelector('.switch__input').checked = true;

// خاموش کردن Switch
document.querySelector('.switch__input').checked = false;

// غیرفعال کردن
document.querySelector('.switch__input').disabled = true;

// فعال کردن
document.querySelector('.switch__input').disabled = false;

// شنود تغییر
document.querySelector('.switch__input').addEventListener('change', (e) => {
  console.log('Switch is:', e.target.checked ? 'ON' : 'OFF');
});
```

> **نکته:** برای مرورگرهای بدون `:has()`، هنگام disabled کردن با JS کلاس `switch--disabled` را نیز روی `<label>` اضافه کنید.

---

## نکات مهم

- **بدون Label داخلی:** Switch یک کامپوننت مستقل بدون Label داخلی است. در صورت نیاز به Label، از یک المان متنی جداگانه کنار Switch استفاده کنید.
- **تفاوت با Checkbox:** از Switch زمانی استفاده کنید که تغییر فوری باشد. اگر قبل از اعمال تغییر به مرحله ارسال نیاز است، از Checkbox استفاده کنید.
- **`role="switch"`:** حتما attribute مربوط به `role="switch"` را روی input قرار دهید تا screen readers تفاوت Switch و Checkbox را تشخیص دهند.
- **آیکن‌های SVG:** هر دو آیکن (checkmark و X) باید همیشه در HTML وجود داشته باشند. نمایش/مخفی‌سازی با CSS مدیریت می‌شود.
- **Focus Ring:** فقط با ناوبری کیبورد نمایش داده می‌شود (`:focus-visible`). Focus ring غیر انحصاری است و همزمان با hover و pressed نمایش داده می‌شود.
- **RTL/LTR:** در RTL، Thumb در حالت خاموش سمت راست (start) و در حالت روشن سمت چپ (end) قرار دارد. در LTR معکوس است.
- **Accessibility:** از `<input type="checkbox" role="switch">` بومی استفاده شده. ناوبری با Tab و toggle با Space پشتیبانی می‌شود.
- **Theming:** تمام رنگ‌ها و اندازه‌ها با CSS custom properties با پیشوند `--switch-` قابل بازنویسی هستند.
