# Modal Component — کامپوننت مودال

کامپوننت Modal برای نمایش فرم‌ها و محتوایی که نیاز به تمرکز کاربر دارند استفاده می‌شود.
در دسکتاپ از سمت راست و در موبایل از پایین صفحه وارد می‌شود.

## نصب

فایل‌های CSS و JS را به صفحه اضافه کنید:

```html
<link rel="stylesheet" href="components/modal/modal.css">
<script src="components/modal/modal.js" defer></script>
```

## ساختار HTML پایه

```html
<div class="modal" id="my-modal">
  <div class="modal__overlay"></div>
  <div class="modal__container">
    <div class="modal__header">
      <div class="modal__title-block">
        <div class="modal__icon-holder">
          <svg><!-- آیکن هدر --></svg>
        </div>
        <h2 class="modal__title">عنوان مودال</h2>
      </div>
      <button class="modal__close" type="button" aria-label="بستن">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5.25 5.25L18.75 18.75M18.75 5.25L5.25 18.75"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="modal__body">
      <div class="modal__content">
        <!-- محتوای مودال -->
      </div>
      <div class="modal__actions">
        <button class="btn btn--primary btn--large" style="width:100%">
          تایید
        </button>
      </div>
    </div>
  </div>
</div>
```

> آیکن‌هولدر اختیاری است — اگر نیاز ندارید `modal__icon-holder` را حذف کنید.

## باز و بسته کردن

```html
<!-- دکمه باز کردن -->
<button onclick="Modal.open('my-modal')">باز کردن مودال</button>

<!-- بستن از داخل مودال -->
<button onclick="Modal.close('my-modal')">بستن</button>
```

## سایزها

سه سایز پشتیبانی می‌شود. کلاس modifier را روی `div.modal` اضافه کنید:

| کلاس | عرض دسکتاپ | توضیح |
|-------|------------|-------|
| (پیش‌فرض) | 500px | سایز متوسط |
| `modal--sm` | 400px | سایز کوچک |
| `modal--lg` | 600px | سایز بزرگ |

```html
<div class="modal modal--sm" id="small-modal">...</div>
<div class="modal modal--lg" id="large-modal">...</div>
```

در موبایل (کمتر از 768px) هر سه سایز تمام عرض صفحه را می‌گیرند.

## مودال وسط صفحه (Centered)

با افزودن کلاس `modal--centered` مودال به جای slide-in از راست، در وسط صفحه نمایش داده می‌شود.
ارتفاع بر اساس حجم محتوا تعیین می‌شود.

```html
<div class="modal modal--centered" id="centered-modal">
  <div class="modal__overlay"></div>
  <div class="modal__container">
    <div class="modal__header">
      <div class="modal__title-block">
        <div class="modal__icon-holder">
          <svg><!-- آیکن --></svg>
        </div>
        <div class="modal__title-wrap">
          <h2 class="modal__title">عنوان</h2>
          <p class="modal__subtitle">زیرعنوان</p>
        </div>
      </div>
      <button class="modal__close" type="button" aria-label="بستن">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5.25 5.25L18.75 18.75M18.75 5.25L5.25 18.75"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="modal__body">
      <div class="modal__content"><!-- محتوا --></div>
      <div class="modal__actions">
        <button class="btn btn--primary btn--large" style="width:100%">تایید</button>
      </div>
    </div>
  </div>
</div>
```

تفاوت‌ها با مودال پیش‌فرض:

| ویژگی | پیش‌فرض (Slide-in) | وسط صفحه (Centered) |
|-------|-------------------|---------------------|
| موقعیت | سمت راست صفحه | وسط صفحه |
| ارتفاع | تمام viewport | بر اساس محتوا |
| انیمیشن | slide-in/out | scale + fade |
| overlay | گرادیانت چپ→راست | گرادیانت بالا→پایین |

### زیرعنوان (Subtitle)

برای نمایش متن اضافی زیر عنوان هدر (مثلا "۳ کاربر انتخاب شده")،
عنوان و زیرعنوان را در `modal__title-wrap` قرار دهید:

```html
<div class="modal__title-wrap">
  <h2 class="modal__title">تغییر وضعیت کاربران</h2>
  <p class="modal__subtitle">۳ کاربر انتخاب شده</p>
</div>
```

> زیرعنوان هم در مودال centered و هم در مودال slide-in قابل استفاده است.

## پنل جانبی (Expanded Panel)

برای نمایش لیست انتخابی کنار مودال اصلی (مثلا انتخاب آزمون یا گروه)
از پنل جانبی استفاده کنید. پنل باید داخل همان `div.modal` و **قبل از** `modal__container` قرار بگیرد:

```html
<div class="modal" id="my-modal">
  <div class="modal__overlay"></div>

  <!-- پنل جانبی -->
  <div class="modal__expanded" id="my-panel">
    <div class="modal__expanded-inner">
      <div class="modal__expanded-header">
        <h3 class="modal__expanded-title">عنوان پنل</h3>
        <!-- مثلا یک input جستجو -->
      </div>
      <div class="modal__expanded-content">
        <!-- لیست آیتم‌ها (اسکرول می‌شود) -->
      </div>
      <div class="modal__expanded-footer">
        <button class="btn btn--outline btn--large" style="width:100%"
                onclick="Modal.closePanel('my-panel')">
          ذخیره و بازگشت
        </button>
      </div>
    </div>
  </div>

  <div class="modal__container">
    <!-- هدر و بدنه مودال اصلی -->
  </div>
</div>
```

باز و بسته کردن پنل:

```js
Modal.openPanel('my-panel');
Modal.closePanel('my-panel');
```

> هنگام بسته شدن مودال اصلی، تمام پنل‌های جانبی باز به صورت خودکار بسته می‌شوند.

### اتصال پنل به input دو آیکن

برای اینکه کلیک روی یک input پنل جانبی را باز کند:

```html
<div class="input input--large input--full-width"
     onclick="Modal.openPanel('my-panel')" style="cursor: pointer;">
  <div class="input__container">
    <span class="input__icon input__icon--before">
      <svg><!-- آیکن قبل --></svg>
    </span>
    <span class="input__divider"></span>
    <input type="text" class="input__field" placeholder="انتخاب کنید" readonly />
    <span class="input__icon input__icon--after">
      <svg viewBox="0 0 20 20" fill="none">
        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </div>
  <span class="input__indicator"></span>
</div>
```

## JavaScript API

| متد | توضیح |
|-----|-------|
| `Modal.open(id)` | باز کردن مودال |
| `Modal.close(id)` | بستن مودال |
| `Modal.closeAll()` | بستن همه مودال‌های باز |
| `Modal.openPanel(panelId)` | باز کردن پنل جانبی |
| `Modal.closePanel(panelId)` | بستن پنل جانبی |
| `Modal.init(element)` | فعال‌سازی یک مودال جدید |
| `Modal.initAll()` | فعال‌سازی همه مودال‌ها |
| `Modal.onOpen(id, fn)` | تنظیم callback باز شدن |
| `Modal.onClose(id, fn)` | تنظیم callback بسته شدن |

### Callbacks

```js
Modal.onOpen('my-modal', function() {
  console.log('مودال باز شد');
});

Modal.onClose('my-modal', function() {
  console.log('مودال بسته شد');
});
```

## ویژگی‌ها

- **انیمیشن**: دسکتاپ slide-in از راست، موبایل slide-up از پایین
- **Overlay**: کلیک روی overlay مودال را می‌بندد
- **Escape**: کلید Escape مودال را می‌بندد
- **Focus Trap**: فوکوس کیبورد در مودال باز محدود می‌شود
- **Body Scroll Lock**: اسکرول صفحه هنگام باز بودن مودال قفل می‌شود
- **RTL**: پشتیبانی کامل از راست‌به‌چپ
- **Responsive**: تغییر خودکار بین نسخه دسکتاپ و موبایل در 768px
- **Accessibility**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`

## CSS Custom Properties

متغیرهای اصلی قابل تغییر در `:root`:

```css
--modal-width: 500px;
--modal-header-bg: #222323;
--modal-body-bg: #ffffff;
--modal-radius-container: 8px;
--modal-animation-duration: 300ms;
--modal-shadow: -3px 0px 5px 0px rgba(0, 0, 0, 0.1);
```
