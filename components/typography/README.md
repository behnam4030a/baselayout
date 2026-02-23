# Typography

سیستم تایپوگرافی پروژه — شامل ۲۲ استایل متنی مطابق با Design Tokens استخراج شده از Figma.

## نصب

فایل CSS را در `<head>` صفحه لینک کنید:

```html
<link rel="stylesheet" href="./components/typography/typography.css">
```

> این فایل در تمام دمو صفحات کامپوننت‌ها از قبل لینک شده است.

## نحوه استفاده

کلاس پایه `.typo` را همراه با یک modifier روی عنصر HTML قرار دهید:

```html
<h1 class="typo typo--display">عنوان نمایشی</h1>
<p class="typo typo--body-medium-150">متن بدنه</p>
```

## استایل‌ها

### Display و Large Title

```html
<h1 class="typo typo--display">Display — ۵۸px Bold</h1>
<h1 class="typo typo--large-title">Large Title — ۴۰px SemiBold</h1>
```

### سرتیترها (Headings)

```html
<h1 class="typo typo--heading-1">Heading 1 — ۳۲px Bold</h1>
<h2 class="typo typo--heading-2">Heading 2 — ۲۸px SemiBold</h2>
<h3 class="typo typo--heading-3">Heading 3 — ۲۴px SemiBold</h3>
<h4 class="typo typo--heading-4">Heading 4 — ۲۰px SemiBold</h4>
<h5 class="typo typo--heading-5">Heading 5 — ۱۸px Medium</h5>
<h6 class="typo typo--heading-6">Heading 6 — ۱۶px Medium</h6>
```

### متن بدنه (Body)

هر سایز Body سه variant دارد:

| Variant | وزن | Line Height | کاربرد |
|---------|-----|-------------|--------|
| `200` | Regular (400) | 2 | پاراگراف‌های طولانی |
| `150` | Regular (400) | 1.5 | متن عادی |
| `emp` | Medium (500) | 1.5 | متن تأکیدی |

```html
<!-- Body Large — 16px -->
<p class="typo typo--body-large-200">فاصله خطوط زیاد برای پاراگراف‌های طولانی</p>
<p class="typo typo--body-large-150">متن عادی با فاصله خطوط معمولی</p>
<p class="typo typo--body-large-emp">متن تأکیدی</p>

<!-- Body Medium — 14px -->
<p class="typo typo--body-medium-200">فاصله خطوط زیاد</p>
<p class="typo typo--body-medium-150">متن عادی</p>
<p class="typo typo--body-medium-emp">متن تأکیدی</p>

<!-- Body Small — 12px -->
<p class="typo typo--body-small-200">فاصله خطوط زیاد</p>
<p class="typo typo--body-small-150">متن عادی</p>
<p class="typo typo--body-small-emp">متن تأکیدی</p>
```

### زیرنویس (Caption)

```html
<span class="typo typo--caption">زیرنویس — ۱۳px Regular</span>
<span class="typo typo--caption-emp">زیرنویس تأکیدی — ۱۳px Medium</span>
```

### دکمه (Button)

```html
<span class="typo typo--button-large">دکمه بزرگ — ۱۴px</span>
<span class="typo typo--button-medium">دکمه متوسط — ۱۴px</span>
<span class="typo typo--button-small">دکمه کوچک — ۱۲px</span>
```

## جدول مرجع

| استایل | کلاس | سایز | وزن | Line Height |
|--------|-------|------|-----|-------------|
| Display | `typo--display` | 58px | 700 | 75px |
| Large Title | `typo--large-title` | 40px | 600 | 52px |
| Heading 1 | `typo--heading-1` | 32px | 700 | 1.3 |
| Heading 2 | `typo--heading-2` | 28px | 600 | 1.3 |
| Heading 3 | `typo--heading-3` | 24px | 600 | 1.3 |
| Heading 4 | `typo--heading-4` | 20px | 600 | 1.3 |
| Heading 5 | `typo--heading-5` | 18px | 500 | 1.3 |
| Heading 6 | `typo--heading-6` | 16px | 500 | 1.3 |
| Body Large 200 | `typo--body-large-200` | 16px | 400 | 2 |
| Body Large 150 | `typo--body-large-150` | 16px | 400 | 1.5 |
| Body Large Emp | `typo--body-large-emp` | 16px | 500 | 1.5 |
| Body Medium 200 | `typo--body-medium-200` | 14px | 400 | 2 |
| Body Medium 150 | `typo--body-medium-150` | 14px | 400 | 1.5 |
| Body Medium Emp | `typo--body-medium-emp` | 14px | 500 | 1.5 |
| Body Small 200 | `typo--body-small-200` | 12px | 400 | 2 |
| Body Small 150 | `typo--body-small-150` | 12px | 400 | 1.5 |
| Body Small Emp | `typo--body-small-emp` | 12px | 500 | 1.5 |
| Caption | `typo--caption` | 13px | 400 | 1.3 |
| Caption Emp | `typo--caption-emp` | 13px | 500 | 1.3 |
| Button Large | `typo--button-large` | 14px | 500 | 1.4 |
| Button Medium | `typo--button-medium` | 14px | 500 | 1.4 |
| Button Small | `typo--button-small` | 12px | 500 | 1.4 |

## سفارشی‌سازی

تمام مقادیر از طریق CSS custom properties قابل override هستند:

```css
:root {
  --typo-heading-1-size: 36px;
  --typo-heading-1-weight: 800;
  --typo-font-family: 'IRANSans', sans-serif;
}
```

## پشتیبانی RTL/LTR

پیش‌فرض RTL است (`text-align: right`). برای LTR:

```html
<!-- روی والد -->
<div dir="ltr">
  <p class="typo typo--body-medium-150">Left-aligned text</p>
</div>

<!-- روی خود عنصر -->
<p class="typo typo--body-medium-150" dir="ltr">Left-aligned text</p>
```

## ساختار فایل‌ها

```
components/typography/
├── typography.css   — استایل‌ها و CSS custom properties
├── tokens.json      — Design tokens استخراج شده از Figma
├── index.html       — صفحه دمو
└── README.md        — مستندات
```
