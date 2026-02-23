# Tag Component — کامپوننت تگ

**فایل CSS:** `components/tag/tag.css`

```html
<link rel="stylesheet" href="/components/tag/tag.css">
```

---

## استفاده سریع

```html
<span class="tag tag--filled tag--gray tag--medium tag--rounded">
  <span class="tag__text">متن تگ</span>
</span>
```

---

## خصوصیت‌ها (Properties)

| خصوصیت | نوع | مقادیر | توضیح |
|---|---|---|---|
| state | خودکار (CSS) | Rest, Hover, Focus, Disabled | وضعیت تعاملی — Hover و Focus با CSS، Disabled با کلاس `tag--disabled` |
| style | CSS class | `tag--filled`, `tag--outline` | نوع نمایش بصری |
| color | CSS class | `tag--gray`, `tag--green`, `tag--orange`, `tag--red` | پالت رنگی |
| size | CSS class | `tag--small`, `tag--medium`, `tag--large` | ابعاد |
| radius | CSS class | `tag--rounded`, `tag--circular` | شکل گوشه‌ها |
| dismiss | ساختار HTML | وجود/عدم وجود `tag__dismiss` | دکمه حذف (اختیاری) |
| focus | attribute | `tabindex="0"` + کلاس `tag--focused` | فوکوس‌پذیری (اختیاری) |
| icon | ساختار HTML | وجود/عدم وجود `tag__icon` | آیکن کنار متن (اختیاری) |

---

## حالت‌ها (States)

### وضعیت‌های تعاملی

| حالت | شرط | توضیح |
|---|---|---|
| Rest | بدون تعامل | حالت پیش‌فرض |
| Hover | نشانگر روی Tag | تغییر رنگ پس‌زمینه (Filled) یا border و متن (Outline) |
| Focus | فوکوس کیبورد/کلیک | نمایش focus ring — overlay state |
| Disabled | کلاس `tag--disabled` | غیرفعال — بدون تعامل |

### اولویت حالت‌ها
```
disabled > focus > hover > rest
```

### رفتار فوکوس (Overlay State)
فوکوس یک لایه بصری مستقل است و همزمان با سایر حالت‌ها نمایش داده می‌شود:
- rest + focus
- hover + focus

فوکوس در حالت disabled نمایش داده نمی‌شود.

---

## استایل‌ها (Style)

### Filled
- پس‌زمینه رنگی + border 2px solid سفید
- در Hover: پس‌زمینه کمی تیره‌تر
- در Focus: border 1px solid #222323
- در Disabled: bg #e7e9eb، بدون border، متن #bbbcbe

### Outline
- بدون پس‌زمینه + border 1px solid رنگی
- در Hover: border و متن تیره‌تر (برای رنگ‌های غیر gray)
- در Focus: border 1px solid #222323
- در Disabled: border #e7e9eb، متن #bbbcbe

---

## رنگ‌ها

### Filled — پس‌زمینه و متن

| رنگ | Rest bg | Hover bg | متن |
|---|---|---|---|
| Gray | `#f6f8fa` | `#f1f3f5` | `#222323` |
| Green | `#f1faf1` | `#e7f2e7` | `#107c10` |
| Orange | `#fff9f5` | `#feefe7` | `#f7630c` |
| Red | `#fdf3f4` | `#f9e7e9` | `#c50f1f` |

### Outline — border و متن (Rest)

| رنگ | Border | متن |
|---|---|---|
| Gray | `#e2e4e6` | `#222323` |
| Green | `#9fd89f` | `#107c10` |
| Orange | `#fdcfb4` | `#f7630c` |
| Red | `#eeacb2` | `#c50f1f` |

### Outline — border و متن (Hover)

| رنگ | Border | متن |
|---|---|---|
| Gray | `#e2e4e6` | `#222323` |
| Green | `#107c10` | `#0c5e0c` |
| Orange | `#f7630c` | `#bc4b09` |
| Red | `#c50f1f` | `#960b18` |

### Disabled (همه رنگ‌ها یکسان)

| Style | Background | Border | متن |
|---|---|---|---|
| Filled | `#e7e9eb` | transparent | `#bbbcbe` |
| Outline | — | `#e7e9eb` | `#bbbcbe` |

### Focus (همه رنگ‌ها یکسان)

| عنصر | مقدار |
|---|---|
| Border | 1px solid `#222323` |

---

## نمونه‌ها

**تگ ساده:**
```html
<span class="tag tag--filled tag--gray tag--medium tag--rounded">
  <span class="tag__text">متن تگ</span>
</span>
```

**تگ Outline:**
```html
<span class="tag tag--outline tag--green tag--medium tag--rounded">
  <span class="tag__text">موفقیت</span>
</span>
```

**تگ با Dismiss (دکمه حذف):**
```html
<span class="tag tag--filled tag--orange tag--medium tag--rounded">
  <button class="tag__dismiss" aria-label="حذف تگ">
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M4.25 4.25L9.75 9.75M9.75 4.25L4.25 9.75"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
  <span class="tag__text">هشدار</span>
</span>
```

**تگ با Icon:**
```html
<span class="tag tag--filled tag--green tag--medium tag--rounded">
  <span class="tag__text">سند</span>
  <span class="tag__icon">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">...</svg>
  </span>
</span>
```

**تگ ترکیبی (Icon + Dismiss):**
```html
<span class="tag tag--filled tag--gray tag--large tag--rounded">
  <button class="tag__dismiss" aria-label="حذف تگ">
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M4.25 4.25L9.75 9.75M9.75 4.25L4.25 9.75"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
  <span class="tag__text">متن تگ</span>
  <span class="tag__icon">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">...</svg>
  </span>
</span>
```

**تگ با Focus:**
```html
<span class="tag tag--outline tag--red tag--medium tag--rounded tag--focused" tabindex="0">
  <span class="tag__text">خطا</span>
</span>
```

**تگ Disabled:**
```html
<span class="tag tag--filled tag--gray tag--medium tag--rounded tag--disabled">
  <span class="tag__text">غیرفعال</span>
</span>
```

**تگ Circular (pill):**
```html
<span class="tag tag--outline tag--green tag--small tag--circular">
  <span class="tag__text">فعال</span>
</span>
```

---

## ساختار HTML

```
span.tag
├── button.tag__dismiss     ← دکمه حذف (اختیاری، سمت end)
├── span.tag__text          ← متن تگ
└── span.tag__icon          ← آیکن (اختیاری، سمت start)
```

> **ترتیب المان‌ها در HTML:** dismiss → text → icon
> در RTL: آیکن سمت راست (start)، متن وسط، dismiss سمت چپ (end)

---

## کلاس‌های CSS

| کلاس | توضیح |
|---|---|
| `tag` | کلاس پایه (روی `<span>` container) |
| `tag__text` | متن تگ |
| `tag__icon` | آیکن کنار متن (اختیاری) |
| `tag__dismiss` | دکمه حذف `<button>` (اختیاری) |
| **Modifiers — Style** | |
| `tag--filled` | پس‌زمینه رنگی + border سفید |
| `tag--outline` | بدون پس‌زمینه + border رنگی |
| **Modifiers — Color** | |
| `tag--gray` | رنگ خنثی |
| `tag--green` | رنگ موفقیت |
| `tag--orange` | رنگ هشدار |
| `tag--red` | رنگ خطر |
| **Modifiers — Size** | |
| `tag--small` | ارتفاع 24px، فونت 13px |
| `tag--medium` | ارتفاع 32px، فونت 14px |
| `tag--large` | ارتفاع 37px، فونت 16px |
| **Modifiers — Radius** | |
| `tag--rounded` | گوشه نرم (8px) |
| `tag--circular` | گوشه کاملا گرد / pill (360px) |
| **Modifiers — State** | |
| `tag--focused` | نمایش focus ring |
| `tag--disabled` | حالت غیرفعال |

---

## اندازه‌ها

| سایز | ارتفاع | Padding افقی | Font Size | Line Height | Icon Wrapper |
|---|---|---|---|---|---|
| Small | 24px | 8px | 13px | 1.3 | 18px |
| Medium | 32px | 8px | 14px | 1.5 | 18px |
| Large | 37px | 12px | 16px | 1.5 | 22px |

---

## فاصله‌گذاری

| فاصله | مقدار |
|---|---|
| Gap بین عناصر | 4px |
| Dismiss icon اندازه | 24px × 24px |
| Filled border width | 2px |
| Outline border width | 1px |

---

## تایپوگرافی

| خصوصیت | مقدار |
|---|---|
| فونت | Peyda(FaNum), sans-serif |
| وزن | 400 |

---

## مدیریت با JavaScript

```javascript
// افزودن حالت focus
const tag = document.querySelector('.tag');
tag.classList.add('tag--focused');
tag.setAttribute('tabindex', '0');

// حذف حالت focus
tag.classList.remove('tag--focused');
tag.removeAttribute('tabindex');

// غیرفعال کردن
tag.classList.add('tag--disabled');

// فعال کردن
tag.classList.remove('tag--disabled');

// شنود کلیک dismiss
document.querySelectorAll('.tag__dismiss').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const tag = e.target.closest('.tag');
    tag.remove(); // یا هر منطق حذف دیگر
  });
});
```

---

## نکات مهم

- **ترکیب کلاس‌ها:** هر Tag حداقل ۴ کلاس modifier نیاز دارد: style + color + size + radius. مثال: `tag--filled tag--gray tag--medium tag--rounded`
- **Dismiss دکمه است:** از `<button>` برای dismiss استفاده کنید (نه `<span>`) تا با keyboard قابل دسترسی باشد. حتما `aria-label` اضافه کنید.
- **Icon رنگ‌پذیر:** آیکن‌ها از `currentColor` استفاده می‌کنند و رنگشان خودکار با رنگ متن Tag هماهنگ می‌شود.
- **Focus اختیاری:** Tag به صورت پیش‌فرض فوکوس‌پذیر نیست. برای فعال‌سازی فوکوس، `tabindex="0"` و کلاس `tag--focused` اضافه کنید.
- **Disabled یکسان:** در حالت disabled همه رنگ‌ها به نسخه خنثی تبدیل می‌شوند (بدون تفاوت بین gray, green, orange, red).
- **Radius مستقل:** تغییر شکل گوشه (rounded/circular) هیچ تاثیری روی سایز، رنگ یا رفتار ندارد.
- **RTL/LTR:** چیدمان به صورت خودکار با `flexbox` و `padding-inline` سازگار است.
- **بدون JavaScript:** تمام استایل‌ها Pure CSS هستند. JavaScript فقط برای منطق تعاملی (dismiss, focus toggle) لازم است.
- **Theming:** تمام رنگ‌ها و اندازه‌ها با CSS custom properties با پیشوند `--tag-` قابل بازنویسی هستند.
