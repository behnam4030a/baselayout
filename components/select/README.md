# Select Component — کامپوننت انتخاب

**فایل CSS:** `components/select/select.css`
**فایل JS:** `components/select/select.js`

```html
<link rel="stylesheet" href="/components/select/select.css">
<script src="/components/select/select.js" defer></script>
```

---

## استفاده سریع

```html
<div class="select select--basic" data-type="basic" data-placeholder="انتخاب کنید">
  <button class="select__trigger" type="button">
    <span class="select__value">انتخاب کنید</span>
  </button>
  <div class="select__dropdown">
    <div class="select__search">
      <input type="text" class="select__search-input" placeholder="جستجو..." />
    </div>
    <ul class="select__list" role="listbox">
      <li class="select__item" data-value="opt1">گزینه اول</li>
      <li class="select__item" data-value="opt2">گزینه دوم</li>
      <li class="select__item" data-value="opt3">گزینه سوم</li>
    </ul>
  </div>
</div>
```

---

## انواع (Types)

| نوع | کلاس | نحوه نمایش انتخاب | چند انتخابی | جستجو |
|---|---|---|---|---|
| Basic | `select--basic` | متن ساده + دکمه پاک کردن | خیر | بله |
| Primary | `select--primary` | تگ بنفش تکی | خیر | خیر |
| Multiple | `select--multiple` | تگ‌های بنفش | بله | خیر |
| Tagify | `select--tagify` | تگ‌های خاکستری (آیکن مربعی) | بله | خیر |
| Tagify + Free Input | `select--tagify` + `data-free-input="true"` | تگ‌های خاکستری + inline input | بله | خیر |
| Icon | `select--icon` | آیکن + خط جداکننده + متن در trigger | خیر | خیر |

---

## اندازه‌ها (Sizes)

| اندازه | کلاس | ارتفاع trigger |
|---|---|---|
| کوچک | `select--sm` | 36px |
| متوسط (پیش‌فرض) | — | 45px |
| بزرگ | `select--lg` | 52px |

---

## وضعیت‌ها (States)

| وضعیت | کلاس / رفتار | توضیح |
|---|---|---|
| Rest | پیش‌فرض | border خاکستری |
| Active | `select--active` (خودکار توسط JS) | border بنفش `#8a38f5` + shadow — حتی پس از بستن dropdown تا زمانی که مقدار انتخاب شده باشد |
| Open | `select--open` (خودکار توسط JS) | dropdown نمایش داده می‌شود، trigger فقط گوشه‌های بالا گرد می‌شود، dropdown فقط گوشه‌های پایین گرد می‌شود |
| Disabled | `select--disabled` | پس‌زمینه خاکستری، غیرقابل تعامل |

---

## نمونه‌ها

**Basic (ساده):**
```html
<div class="select select--basic" data-type="basic" data-placeholder="شهر خود را انتخاب کنید">
  <button class="select__trigger" type="button">
    <span class="select__value">شهر خود را انتخاب کنید</span>
  </button>
  <div class="select__dropdown">
    <div class="select__search">
      <input type="text" class="select__search-input" placeholder="جستجو..." />
    </div>
    <ul class="select__list" role="listbox">
      <li class="select__item" data-value="tehran">تهران</li>
      <li class="select__item" data-value="isfahan">اصفهان</li>
      <li class="select__item" data-value="shiraz">شیراز</li>
    </ul>
  </div>
</div>
```

**Primary (تگ تکی بنفش):**
```html
<div class="select select--primary" data-type="primary" data-placeholder="دپارتمان">
  <button class="select__trigger" type="button">
    <span class="select__value">دپارتمان</span>
  </button>
  <div class="select__dropdown">
    <ul class="select__list" role="listbox">
      <li class="select__item" data-value="design">طراحی</li>
      <li class="select__item" data-value="dev">توسعه</li>
      <li class="select__item" data-value="marketing">بازاریابی</li>
    </ul>
  </div>
</div>
```

**Multiple (چند انتخابی — با گروه‌بندی):**
```html
<div class="select select--multiple" data-type="multiple" data-placeholder="مهارت‌ها">
  <button class="select__trigger" type="button">
    <span class="select__value">مهارت‌ها</span>
  </button>
  <div class="select__dropdown">
    <ul class="select__list" role="listbox" aria-multiselectable="true">
      <li class="select__item select__item--group">پایه</li>
      <li class="select__item" data-value="html">HTML</li>
      <li class="select__item" data-value="css">CSS</li>
      <li class="select__item select__item--group">فریم‌ورک</li>
      <li class="select__item" data-value="react">React</li>
      <li class="select__item" data-value="vue">Vue</li>
    </ul>
  </div>
</div>
```

**Tagify (تگ‌ها با آیکن مربعی):**
```html
<div class="select select--tagify" data-type="tagify" data-placeholder="برچسب‌ها">
  <button class="select__trigger" type="button">
    <span class="select__value">برچسب‌ها</span>
  </button>
  <div class="select__dropdown">
    <ul class="select__list" role="listbox" aria-multiselectable="true">
      <li class="select__item" data-value="urgent">فوری</li>
      <li class="select__item" data-value="review">بررسی</li>
    </ul>
  </div>
</div>
```

**Tagify Free Input (ورود آزاد با تایپ):**
```html
<div class="select select--tagify" data-type="tagify" data-placeholder="تایپ کنید و Enter بزنید..." data-free-input="true">
  <input type="hidden" name="tags" />
  <button class="select__trigger" type="button"></button>
</div>
```

**Icon (آیکن‌دار):**
```html
<div class="select select--icon" data-type="icon" data-placeholder="وضعیت">
  <input type="hidden" name="status" />
  <button class="select__trigger" type="button">
    <span class="select__value">وضعیت</span>
  </button>
  <div class="select__dropdown">
    <ul class="select__list" role="listbox">
      <li class="select__item" data-value="active">
        <span class="select__item-icon">
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 10L9 12L13 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        فعال
      </li>
      <li class="select__item" data-value="inactive">
        <span class="select__item-icon">
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        غیرفعال
      </li>
    </ul>
  </div>
</div>
```

**آیتم از قبل انتخاب شده:**
```html
<li class="select__item select__item--selected" data-value="isfahan">اصفهان</li>
```

**غیرفعال (Disabled):**
```html
<div class="select select--basic select--disabled" data-type="basic">
  <button class="select__trigger" type="button" disabled>
    <span class="select__value">غیرفعال</span>
  </button>
  ...
</div>
```

**اندازه کوچک:**
```html
<div class="select select--basic select--sm" data-type="basic">...</div>
```

**اندازه بزرگ:**
```html
<div class="select select--basic select--lg" data-type="basic">...</div>
```

**LTR:**
```html
<div class="select select--basic" dir="ltr" data-type="basic">...</div>
```

---

## ساختار HTML

```
div.select.select--{type}
├── button.select__trigger              ← ناحیه کلیک‌پذیر
│   ├── span.select__value              ← متن مقدار / placeholder (Basic)
│   ├── button.select__clear            ← دکمه پاک کردن مقدار (Basic — فقط وقتی انتخاب شده)
│   │   — یا —
│   ├── div.select__tags                ← کانتینر تگ‌ها (Primary/Multiple/Tagify)
│   │   └── span.select__tag            ← تگ انتخاب شده
│   │       ├── span.select__tag-text   ← متن تگ
│   │       └── button.select__tag-close← دکمه حذف تگ
│   │   — یا —
│   ├── span.select__trigger-icon       ← آیکن آیتم انتخاب شده (Icon — فقط وقتی انتخاب شده)
│   ├── span.select__trigger-divider    ← خط جداکننده عمودی (Icon — فقط وقتی انتخاب شده)
│   ├── span.select__value              ← متن مقدار / placeholder (Icon)
│   └── svg.select__chevron             ← آیکن فلش (▼)
└── div.select__dropdown                ← پنل باز شونده
    ├── div.select__search              ← فیلد جستجو (فقط Basic)
    │   └── input.select__search-input  ← ورودی جستجو
    └── ul.select__list                 ← لیست آیتم‌ها
        ├── li.select__item--group      ← عنوان گروه (غیرقابل انتخاب)
        └── li.select__item             ← آیتم قابل انتخاب
            └── span.select__item-icon  ← آیکن آیتم (Icon type)
```

---

## کلاس‌های CSS

### Block و Elements

| کلاس | توضیح |
|---|---|
| `select` | کلاس پایه (روی `<div>` wrapper) |
| `select__trigger` | ناحیه کلیک‌پذیر (trigger) |
| `select__value` | متن مقدار انتخاب شده یا placeholder |
| `select__tags` | کانتینر تگ‌ها |
| `select__tag` | تگ تکی |
| `select__tag-text` | متن داخل تگ |
| `select__tag-close` | دکمه حذف تگ |
| `select__chevron` | آیکن فلش |
| `select__dropdown` | پنل dropdown |
| `select__search` | کانتینر جستجو |
| `select__search-input` | ورودی جستجو |
| `select__list` | لیست آیتم‌ها |
| `select__item` | آیتم تکی |

### Modifiers

| کلاس | توضیح |
|---|---|
| `select--basic` | نوع Basic (متن ساده + جستجو) |
| `select--primary` | نوع Primary (تگ بنفش تکی) |
| `select--multiple` | نوع Multiple (تگ‌های خاکستری) |
| `select--tagify` | نوع Tagify (تگ‌ها با آیکن مربعی) |
| `select--icon` | نوع Icon (آیکن + خط جداکننده + متن) |
| `select--sm` | اندازه کوچک |
| `select--lg` | اندازه بزرگ |
| `select--active` | حالت فعال / فوکوس |
| `select--open` | dropdown باز |
| `select--disabled` | غیرفعال |
| `select__value--selected` | مقدار انتخاب شده (نه placeholder) |
| `select__tag--single` | تگ بنفش (Primary و Multiple) |
| `select__tag--multiple` | تگ خاکستری (Tagify) |
| `select__item--selected` | آیتم انتخاب شده |
| `select__item--highlighted` | آیتم highlight شده با کیبورد |
| `select__item--hidden` | آیتم فیلتر شده (مخفی) |
| `select__item--group` | عنوان گروه (غیرقابل انتخاب، bold) |
| `select__item-icon` | آیکن آیتم (Icon type) — باید داخل `li.select__item` باشد |
| `select__trigger-icon` | آیکن آیتم انتخاب شده در trigger (ایجاد خودکار توسط JS) |
| `select__trigger-divider` | خط جداکننده عمودی در trigger (ایجاد خودکار توسط JS) |

---

## Data Attributes

| اتریبیوت | روی | توضیح |
|---|---|---|
| `data-type` | `div.select` | نوع select: `basic` \| `primary` \| `multiple` \| `tagify` \| `icon` |
| `data-placeholder` | `div.select` | متن placeholder |
| `data-value` | `li.select__item` | مقدار آیتم (اگر نباشد از `textContent` استفاده می‌شود) |
| `data-free-input` | `div.select` | فقط برای tagify — `"true"` برای فعال‌سازی ورود آزاد با تایپ |

---

## JavaScript API

Select‌هایی که هنگام بارگذاری صفحه در DOM هستند به صورت خودکار راه‌اندازی می‌شوند (به جز `select--disabled`).

### `Select.init(element)` — فعال‌سازی یک select

```javascript
var el = document.querySelector('.select');
var instance = Select.init(el);
```

### `Select.initAll()` — فعال‌سازی همه selectها

```javascript
Select.initAll();
```

### Instance Methods

پس از `init`، به instance از طریق `el._selectInstance` دسترسی دارید:

```javascript
var instance = el._selectInstance;
```

| متد | توضیح | مقدار بازگشتی |
|---|---|---|
| `instance.getValue()` | دریافت مقدار انتخاب شده | `string` (single) یا `string[]` (multi) |
| `instance.setValue(val)` | تنظیم مقدار | — |
| `instance.open()` | باز کردن dropdown | — |
| `instance.close()` | بستن dropdown | — |
| `instance.destroy()` | حذف event listeners و cleanup | — |
| `instance.onChange(fn)` | تنظیم callback تغییر مقدار | — |
| `instance.onOpen(fn)` | تنظیم callback باز شدن | — |
| `instance.onClose(fn)` | تنظیم callback بسته شدن | — |

**مثال getValue / setValue:**
```javascript
var el = document.querySelector('#my-select');
var instance = el._selectInstance;

// دریافت مقدار
var val = instance.getValue();
console.log(val); // 'option1' یا ['opt1', 'opt2']

// تنظیم مقدار
instance.setValue('option2');           // single select
instance.setValue(['opt1', 'opt3']);    // multiple select
```

**مثال onChange:**
```javascript
instance.onChange(function (value) {
  console.log('مقدار جدید:', value);
});
```

---

## Keyboard Navigation

| کلید | عملکرد |
|---|---|
| `Enter` / `Space` / `ArrowDown` / `ArrowUp` | باز کردن dropdown (وقتی بسته است) |
| `ArrowDown` | حرکت به آیتم بعدی |
| `ArrowUp` | حرکت به آیتم قبلی |
| `Enter` | انتخاب آیتم highlight شده |
| `Escape` | بستن dropdown و بازگشت فوکوس به trigger |
| `Tab` | بستن dropdown و خروج از کامپوننت |

---

## دسترسی‌پذیری (Accessibility)

| اتریبیوت | المان | توضیح |
|---|---|---|
| `aria-haspopup="listbox"` | trigger | نشان‌دهنده وجود listbox |
| `aria-expanded` | trigger | `true` وقتی dropdown باز است |
| `aria-activedescendant` | trigger | ID آیتم highlight شده با کیبورد |
| `role="listbox"` | لیست | نقش لیست انتخاب |
| `role="option"` | هر آیتم | نقش آیتم قابل انتخاب |
| `aria-selected` | هر آیتم | `true` برای آیتم انتخاب شده |
| `aria-multiselectable` | لیست | `true` در Multiple و Tagify |
| `aria-label="حذف ..."` | دکمه حذف تگ | برچسب دسترسی‌پذیری |

---

## نکات مهم

- **`data-type` الزامی است:** نوع select را مشخص می‌کند و رفتار JS را تعیین می‌کند. مقادیر: `basic`، `primary`، `multiple`، `tagify`، `icon`.
- **جستجو فقط در Basic:** فیلد `select__search` فقط در نوع Basic نمایش داده می‌شود. در سایر انواع به صورت خودکار مخفی می‌شود.
- **گروه‌بندی:** برای افزودن عنوان گروه به dropdown، `select__item--group` را به آیتم اضافه کنید. این آیتم‌ها قابل انتخاب نیستند و در جستجو مخفی نمی‌شوند.
- **دکمه پاک کردن (Basic):** وقتی مقداری در Basic انتخاب شده باشد، یک دکمه × کنار chevron نمایش داده می‌شود که با کلیک روی آن مقدار پاک می‌شود.
- **حالت Active:** border بنفش تا زمانی که مقدار انتخاب شده باشد حفظ می‌شود، حتی پس از بستن dropdown.
- **آیتم از قبل انتخاب شده:** کلاس `select__item--selected` را به آیتم اضافه کنید تا هنگام init انتخاب شود.
- **`data-value`:** اگر `data-value` روی آیتم نباشد، از `textContent` آیتم به عنوان مقدار استفاده می‌شود.
- **Disabled:** کلاس `select--disabled` را اضافه و `disabled` را روی trigger تنظیم کنید. Select‌های disabled به صورت خودکار init نمی‌شوند.
- **RTL/LTR:** به صورت پیش‌فرض RTL است. برای LTR از `dir="ltr"` استفاده کنید.
- **Chevron خودکار:** اگر chevron SVG در trigger نباشد، JS آن را به صورت خودکار اضافه می‌کند.
- **Dropdown positioning:** dropdown با `position: absolute` زیر trigger قرار می‌گیرد. مطمئن شوید والد `overflow: hidden` ندارد.
- **Icon type:** در نوع Icon، آیکن هر آیتم باید داخل `<span class="select__item-icon">` با inline SVG یا `<img>` قرار گیرد. پس از انتخاب، آیکن به همراه یک خط جداکننده عمودی در trigger نمایش داده می‌شود. آیکن‌ها از `currentColor` استفاده می‌کنند و با state های select (hover، selected، disabled) هماهنگ می‌شوند.
- **Free Input (Tagify):** با افزودن `data-free-input="true"` به tagify، یک inline input در trigger نمایش داده می‌شود. کاربر می‌تواند تایپ کند و با **Enter** یا **کاما** (`,`) تگ جدید اضافه کند. **Backspace** روی input خالی آخرین تگ را حذف می‌کند. مقادیر تکراری پذیرفته نمی‌شوند.
