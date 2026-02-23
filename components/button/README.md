# Button Component — کامپوننت دکمه

**فایل CSS:** `components/button/button.css`

```html
<link rel="stylesheet" href="/components/button/button.css">
```

---

## استفاده سریع

```html
<button class="btn btn--{type} btn--{size}">متن</button>
```

---

## انواع (Types)

| نوع | کلاس | رنگ پس‌زمینه | رنگ متن |
|---|---|---|---|
| Primary | `btn--primary` | `#26a88c` سبز | سفید |
| AI | `btn--ai` | `#7160e8` بنفش | سفید |
| Secondary | `btn--secondary` | `#ffffff` سفید | مشکی |
| Subtle | `btn--subtle` | سفید، بدون border | مشکی |
| Outline | `btn--outline` | شفاف | مشکی |
| Transparent | `btn--transparent` | شفاف، بدون border | سبز |

## سایزها (Sizes)

| سایز | کلاس | ارتفاع | فونت |
|---|---|---|---|
| Large | `btn--large` | 45px | 14px |
| Medium | `btn--medium` | 37px | 14px |
| Small | `btn--small` | 24px | 12px |

## حالت‌ها (States)

| حالت | نحوه استفاده |
|---|---|
| Rest | بدون کلاس اضافی |
| Hover | خودکار با `:hover` |
| Pressed | خودکار با `:active` |
| Disabled | اتریبیوت `disabled` |
| Selected | کلاس `btn--selected` |

---

## نمونه‌ها

**ساده:**
```html
<button class="btn btn--primary btn--large">ذخیره</button>
```

**غیرفعال:**
```html
<button class="btn btn--primary btn--medium" disabled>ارسال</button>
```

**عرض کامل:**
```html
<button class="btn btn--primary btn--large btn--full-width">ثبت‌نام</button>
```

**با آیکن قبل از متن:**
```html
<button class="btn btn--primary btn--medium">
  <span class="btn__inner">
    <span class="btn__icon">
      <svg viewBox="0 0 10.125 10.125" fill="none"><path d="M5.0625 0C5.37307 0 5.625 0.251865 5.625 0.5625V4.5H9.5625C9.87307 4.5 10.125 4.75185 10.125 5.0625C10.125 5.23245 10.0495 5.38477 9.93052 5.48782C9.83205 5.57325 9.70312 5.625 9.5625 5.625H5.625V9.5625C5.625 9.87315 5.37307 10.125 5.0625 10.125C4.75193 10.125 4.5 9.87315 4.5 9.5625V5.625H0.5625C0.251955 5.625 0 5.37315 0 5.0625C0 4.75185 0.251955 4.5 0.5625 4.5H4.5V0.5625C4.5 0.251865 4.75193 0 5.0625 0Z" fill="currentColor"/></svg>
    </span>
    <span class="btn__text">ذخیره</span>
  </span>
</button>
```

**با آیکن بعد از متن:**
```html
<button class="btn btn--primary btn--medium">
  <span class="btn__inner">
    <span class="btn__text">ادامه</span>
    <span class="btn__icon">
      <svg viewBox="0 0 10.125 10.125" fill="none"><path d="M5.0625 0C5.37307 0 5.625 0.251865 5.625 0.5625V4.5H9.5625C9.87307 4.5 10.125 4.75185 10.125 5.0625C10.125 5.23245 10.0495 5.38477 9.93052 5.48782C9.83205 5.57325 9.70312 5.625 9.5625 5.625H5.625V9.5625C5.625 9.87315 5.37307 10.125 5.0625 10.125C4.75193 10.125 4.5 9.87315 4.5 9.5625V5.625H0.5625C0.251955 5.625 0 5.37315 0 5.0625C0 4.75185 0.251955 4.5 0.5625 4.5H4.5V0.5625C4.5 0.251865 4.75193 0 5.0625 0Z" fill="currentColor"/></svg>
    </span>
  </span>
</button>
```

**فقط آیکن:**
```html
<button class="btn btn--primary btn--medium btn--icon-only" aria-label="افزودن">
  <span class="btn__icon">
    <svg viewBox="0 0 10.125 10.125" fill="none"><path d="M5.0625 0C5.37307 0 5.625 0.251865 5.625 0.5625V4.5H9.5625C9.87307 4.5 10.125 4.75185 10.125 5.0625C10.125 5.23245 10.0495 5.38477 9.93052 5.48782C9.83205 5.57325 9.70312 5.625 9.5625 5.625H5.625V9.5625C5.625 9.87315 5.37307 10.125 5.0625 10.125C4.75193 10.125 4.5 9.87315 4.5 9.5625V5.625H0.5625C0.251955 5.625 0 5.37315 0 5.0625C0 4.75185 0.251955 4.5 0.5625 4.5H4.5V0.5625C4.5 0.251865 4.75193 0 5.0625 0Z" fill="currentColor"/></svg>
  </span>
</button>
```

**لینک با ظاهر دکمه:**
```html
<a href="#" class="btn btn--primary btn--large">رفتن به صفحه</a>
```
