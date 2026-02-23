# Radio Component — کامپوننت رادیو

**فایل CSS:** `components/radio/radio.css`

```html
<link rel="stylesheet" href="/components/radio/radio.css">
```

---

## استفاده سریع

```html
<label class="radio">
  <input type="radio" class="radio__input" name="group" />
  <span class="radio__box">
    <span class="radio__circle">
      <span class="radio__dot"></span>
    </span>
  </span>
  <span class="radio__label">برچسب</span>
</label>
```

---

## خصوصیت‌ها (Properties)

| خصوصیت | نوع | مقادیر | توضیح |
|---|---|---|---|
| state | خودکار (CSS) | Rest, Hover, Pressed, Focus, Disabled | وضعیت تعاملی — با CSS pseudo-classes مدیریت می‌شود |
| checked | attribute | `checked` روی `<input>` | آیا Radio انتخاب شده است |
| label | ساختار HTML | وجود/عدم وجود `radio__label` | نمایش متن برچسب (اختیاری) |

---

## حالت‌ها (States)

### وضعیت‌های تعاملی

| حالت | شرط | توضیح |
|---|---|---|
| Rest | بدون تعامل | حالت پیش‌فرض |
| Hover | نشانگر روی Radio/Label | تغییر رنگ border (و dot در checked) |
| Pressed | کلیک/فشردن | تغییر رنگ border (و dot در checked) — موقتی |
| Focus | فوکوس کیبورد | نمایش focus ring روی wrapper |
| Disabled | `disabled` روی `<input>` | غیرفعال — بدون تعامل |

### اولویت حالت‌ها
```
disabled > pressed > focus > hover > rest
```

---

## رنگ‌ها

### Unchecked (فقط border دایره)

| حالت | Border |
|---|---|
| Rest | `#626364` |
| Hover | `#59595a` |
| Pressed | `#4f4f50` |
| Disabled | `#bbbcbe` |

### Checked (border دایره + نقطه داخلی)

| حالت | Border + Dot |
|---|---|
| Rest | `#26a88c` |
| Hover | `#1d836d` |
| Pressed | `#155e4e` |
| Disabled | `#bbbcbe` |

### سایر رنگ‌ها

| عنصر | حالت عادی | حالت Disabled |
|---|---|---|
| متن Label | `#222323` | `#bbbcbe` |
| Focus Ring | `#222323` | — |

---

## نمونه‌ها

**Radio با Label:**
```html
<label class="radio">
  <input type="radio" class="radio__input" name="group" />
  <span class="radio__box">
    <span class="radio__circle">
      <span class="radio__dot"></span>
    </span>
  </span>
  <span class="radio__label">برچسب</span>
</label>
```

**Radio بدون Label:**
```html
<label class="radio">
  <input type="radio" class="radio__input" name="group" />
  <span class="radio__box">
    <span class="radio__circle">
      <span class="radio__dot"></span>
    </span>
  </span>
</label>
```

**Radio انتخاب‌شده (Checked):**
```html
<label class="radio">
  <input type="radio" class="radio__input" name="group" checked />
  <span class="radio__box">
    <span class="radio__circle">
      <span class="radio__dot"></span>
    </span>
  </span>
  <span class="radio__label">انتخاب شده</span>
</label>
```

**Radio غیرفعال (Disabled):**
```html
<label class="radio">
  <input type="radio" class="radio__input" name="group" disabled />
  <span class="radio__box">
    <span class="radio__circle">
      <span class="radio__dot"></span>
    </span>
  </span>
  <span class="radio__label">غیرفعال</span>
</label>
```

**Radio غیرفعال + انتخاب‌شده:**
```html
<label class="radio">
  <input type="radio" class="radio__input" name="group" checked disabled />
  <span class="radio__box">
    <span class="radio__circle">
      <span class="radio__dot"></span>
    </span>
  </span>
  <span class="radio__label">غیرفعال انتخاب‌شده</span>
</label>
```

**Radio Group (فقط یک انتخاب):**
```html
<label class="radio">
  <input type="radio" class="radio__input" name="options" value="a" checked />
  <span class="radio__box"><span class="radio__circle"><span class="radio__dot"></span></span></span>
  <span class="radio__label">گزینه اول</span>
</label>

<label class="radio">
  <input type="radio" class="radio__input" name="options" value="b" />
  <span class="radio__box"><span class="radio__circle"><span class="radio__dot"></span></span></span>
  <span class="radio__label">گزینه دوم</span>
</label>

<label class="radio">
  <input type="radio" class="radio__input" name="options" value="c" />
  <span class="radio__box"><span class="radio__circle"><span class="radio__dot"></span></span></span>
  <span class="radio__label">گزینه سوم</span>
</label>
```

> **نکته:** Radio Group با attribute مشترک `name` ساخته می‌شود. مرورگر به صورت خودکار فقط یک انتخاب را مجاز می‌کند.

---

## ساختار HTML

```
label.radio
├── input.radio__input              ← input بومی مخفی (type="radio")
├── span.radio__box                 ← کانتینر دایره (25px)
│   └── span.radio__circle          ← دایره بیرونی (17px)
│       └── span.radio__dot         ← نقطه داخلی (9px، فقط در checked)
└── span.radio__label               ← متن برچسب (اختیاری، بعد از کنترل)
```

---

## کلاس‌های CSS

| کلاس | توضیح |
|---|---|
| `radio` | کلاس پایه (روی `<label>` wrapper) |
| `radio__input` | input بومی مخفی (`<input type="radio">`) |
| `radio__box` | کانتینر دایره (25px × 25px) |
| `radio__circle` | دایره بیرونی (17px، border) |
| `radio__dot` | نقطه داخلی (9px، فقط در checked) |
| `radio__label` | متن برچسب (اختیاری) |
| `radio--disabled` | حالت غیرفعال (fallback برای مرورگرهای بدون `:has()`) |

---

## اندازه‌ها

| عنصر | اندازه |
|---|---|
| Box (کانتینر) | 25px × 25px |
| Circle (دایره بیرونی) | 17px × 17px |
| Dot (نقطه داخلی) | 9px × 9px |
| Border دایره | 1px solid |
| Focus Ring border | 1px solid |
| Focus Ring border-radius | 4px |

---

## فاصله‌گذاری

| فاصله | مقدار |
|---|---|
| Gap بین المان‌ها | 2px |
| Label padding-start | 8px |
| Box padding | 4px |

---

## تایپوگرافی Label

| خصوصیت | مقدار |
|---|---|
| فونت | Peyda(FaNum), sans-serif |
| سایز | 14px |
| وزن | 400 |
| ارتفاع خط | 1.5 |

---

## مدیریت با JavaScript

```javascript
// انتخاب Radio
document.querySelector('.radio__input').checked = true;

// غیرفعال کردن
document.querySelector('.radio__input').disabled = true;

// فعال کردن
document.querySelector('.radio__input').disabled = false;

// دریافت مقدار انتخاب‌شده در Radio Group
const selected = document.querySelector('input[name="options"]:checked');
console.log(selected?.value);

// شنود تغییر
document.querySelectorAll('input[name="options"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    console.log('Selected:', e.target.value);
  });
});
```

> **نکته:** برای مرورگرهای بدون `:has()`، هنگام disabled کردن با JS کلاس `radio--disabled` را نیز روی `<label>` اضافه کنید.

---

## نکات مهم

- **ترتیب المان‌ها:** ابتدا کنترل دایره‌ای، سپس متن برچسب.
- **Radio Group:** از `name` مشترک استفاده کنید. منطق "فقط یک انتخاب" توسط مرورگر مدیریت می‌شود.
- **Label اختیاری:** می‌توانید `radio__label` را حذف کنید. فقط کنترل دایره‌ای نمایش داده می‌شود.
- **Focus Ring:** فقط با ناوبری کیبورد نمایش داده می‌شود (`:focus-visible`).
- **RTL/LTR:** چیدمان به صورت خودکار با flexbox سازگار می‌شود — در RTL کنترل سمت راست (start)، در LTR کنترل سمت چپ (start).
- **Accessibility:** از `<input type="radio">` بومی استفاده شده. ناوبری با Tab و انتخاب با Space پشتیبانی می‌شود. Arrow keys در Radio Group کار می‌کند.
- **کنتراست رنگ:** حداقل 3:1 برای کنترل دایره‌ای رعایت شده (WCAG 2.1 Level AA).
