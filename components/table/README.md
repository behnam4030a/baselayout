# Table Component — کامپوننت جدول

کامپوننت جدول برای نمایش داده‌های ساخت‌یافته در قالب ردیف و ستون، با امکانات انتخاب، جستجو، فیلتر، صفحه‌بندی و عملیات دسته‌ای.

## فایل‌ها

```
components/table/
├── table.css       # استایل‌ها و design tokens
├── table.js        # منطق و API عمومی
├── tokens.json     # توکن‌های طراحی (استخراج از Figma)
├── index.html      # صفحه دمو
└── README.md
```

## شروع سریع

### ۱. اضافه کردن CSS و JS

```html
<link rel="stylesheet" href="components/table/table.css">
<script src="components/table/table.js" defer></script>
```

### ۲. ساختار HTML پایه

```html
<div data-table="my-table" data-page-size="10">

    <!-- نوار عنوان -->
    <div class="table__header">
        <div class="table__title-section">
            <h2 class="table__title">عنوان جدول</h2>
            <span class="table__dot"></span>
            <span class="table__count">تعداد: ۱۰ نفر</span>
        </div>
        <div class="table__actions">
            <!-- دکمه فیلتر -->
            <div class="table__filter-wrapper">
                <button class="table__btn table__btn--filter">
                    <span class="table__btn-icon"><!-- SVG --></span>
                    <span class="table__btn-text">فیلتر</span>
                </button>
                <div class="table__filter-dropdown">
                    <button class="table__filter-item table__filter-item--active" data-filter="all">همه</button>
                    <button class="table__filter-item" data-filter="فعال">فعال</button>
                    <button class="table__filter-item" data-filter="غیرفعال">غیرفعال</button>
                </div>
            </div>
            <span class="table__divider"></span>
            <button class="table__btn table__btn--secondary">
                <span class="table__btn-icon"><!-- SVG --></span>
                <span class="table__btn-text">بارگذاری گروهی</span>
            </button>
            <button class="table__btn table__btn--primary">
                <span class="table__btn-icon"><!-- SVG --></span>
                <span class="table__btn-text">افزودن</span>
            </button>
        </div>
    </div>

    <!-- جستجو -->
    <div class="table__search">
        <span class="table__search-icon"><!-- SVG --></span>
        <input type="text" class="table__search-input" placeholder="جستجو...">
    </div>

    <!-- جدول (داخل scroll wrapper برای رسپانسیو) -->
    <div class="table__scroll-wrapper">
        <table class="table__grid">
            <thead class="table__thead">
                <tr class="table__row">
                    <th class="table__cell table__cell--checkbox">
                        <label class="table__checkbox-wrapper">
                            <input type="checkbox" class="table__checkbox-input">
                            <span class="table__checkbox-box">
                                <svg class="table__icon--check" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5.2L4 7.5L8 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <svg class="table__icon--indeterminate" viewBox="0 0 10 10" fill="none" style="display:none">
                                    <path d="M2.5 5H7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                            </span>
                        </label>
                    </th>
                    <th class="table__cell">
                        <div class="table__cell-inner">
                            <span class="table__cell-icon"><!-- SVG --></span>
                            <span class="table__cell-text">نام ستون</span>
                        </div>
                    </th>
                    <!-- ستون‌های دیگر -->
                    <th class="table__cell table__cell--action"></th>
                </tr>
            </thead>
            <tbody class="table__tbody">
                <tr class="table__row">
                    <td class="table__cell table__cell--checkbox">
                        <label class="table__checkbox-wrapper">
                            <input type="checkbox" class="table__checkbox-input">
                            <span class="table__checkbox-box">
                                <svg class="table__icon--check" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5.2L4 7.5L8 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                        </label>
                    </td>
                    <td class="table__cell">مقدار</td>
                    <!-- سلول‌های دیگر -->
                    <td class="table__cell table__cell--action">
                        <button class="table__row-action">&#8942;</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- صفحه‌بندی -->
    <div class="table__pagination">
        <div class="table__page-size">
            <button class="table__page-size-btn">
                <span class="table__page-size-text">۱۰ ردیف در هر صفحه</span>
                <span class="table__page-size-arrow">&#x25B4;</span>
            </button>
            <div class="table__page-size-dropdown">
                <button class="table__page-size-option" data-size="5">۵</button>
                <button class="table__page-size-option table__page-size-option--active" data-size="10">۱۰</button>
                <button class="table__page-size-option" data-size="15">۱۵</button>
                <button class="table__page-size-option" data-size="20">۲۰</button>
            </div>
        </div>
        <div class="table__page-numbers">
            <!-- JS دکمه‌های صفحه را رندر می‌کند -->
        </div>
    </div>

    <!-- نوار عملیات دسته‌ای -->
    <div class="table__action-bar">
        <div class="table__action-count">
            <span class="table__action-count-icon">
                <svg viewBox="0 0 10 10" fill="none">
                    <path d="M2 5.2L4 7.5L8 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span class="table__action-count-text">۰ ردیف انتخاب شده</span>
        </div>
        <div class="table__action-buttons">
            <button class="table__action-btn" data-bulk-action="edit">
                <span class="table__action-btn-icon"><!-- SVG --></span>
                <span>ویرایش</span>
            </button>
            <button class="table__action-btn" data-bulk-action="delete">
                <span class="table__action-btn-icon"><!-- SVG --></span>
                <span>حذف</span>
            </button>
        </div>
    </div>

</div>
```

## اتریبیوت‌های HTML

| اتریبیوت | المان | توضیح |
|---|---|---|
| `data-table` | کانتینر اصلی | شناسه یکتای جدول (الزامی) |
| `data-page-size` | کانتینر اصلی | تعداد ردیف در هر صفحه (پیش‌فرض: `10`) |
| `data-mode` | کانتینر اصلی | حالت جدول: `client` (پیش‌فرض) یا `server` |
| `data-filter` | `.table__filter-item` | مقدار فیلتر (`all` برای نمایش همه) |
| `data-size` | `.table__page-size-option` | تعداد ردیف در صفحه |
| `data-bulk-action` | `.table__action-btn` | عملیات دسته‌ای (`edit` یا `delete`) |

## کلاس‌های CSS

### ساختار اصلی

| کلاس | توضیح |
|---|---|
| `table__header` | نوار عنوان بالای جدول |
| `table__search` | کادر جستجو |
| `table__scroll-wrapper` | wrapper رسپانسیو با اسکرول افقی |
| `table__grid` | المان `<table>` |
| `table__thead` / `table__tbody` | سرستون و بدنه |
| `table__row` | ردیف |
| `table__cell` | سلول |
| `table__pagination` | نوار صفحه‌بندی |
| `table__action-bar` | نوار عملیات دسته‌ای |

### Modifierها

| کلاس | توضیح |
|---|---|
| `table__cell--checkbox` | سلول چک‌باکس |
| `table__cell--action` | سلول دکمه سه‌نقطه |
| `table__row--selected` | ردیف انتخاب شده |
| `table__btn--primary` | دکمه سبز اصلی |
| `table__btn--secondary` | دکمه ثانویه (حاشیه‌دار) |
| `table__btn--filter` | دکمه فیلتر |
| `table__tag--success` | تگ وضعیت فعال (سبز) |
| `table__tag--danger` | تگ وضعیت غیرفعال (قرمز) |
| `table__page-btn--active` | دکمه صفحه فعال |

### تگ وضعیت (Status Tag)

```html
<!-- فعال — متن سبز، پس‌زمینه سبز روشن -->
<span class="table__tag table__tag--success">فعال</span>

<!-- غیرفعال — متن قرمز، پس‌زمینه قرمز روشن -->
<span class="table__tag table__tag--danger">غیرفعال</span>
```

### نوار پیشرفت (Progress Bar)

```html
<div class="table__progress">
    <span class="table__progress-text">۳ از ۴ انجام شده</span>
    <div class="table__progress-bar">
        <div class="table__progress-fill" style="width:75%"></div>
    </div>
</div>
```

## JavaScript API

جدول به‌صورت خودکار هنگام `DOMContentLoaded` مقداردهی اولیه می‌شود. همچنین API عمومی زیر روی `window.Table` در دسترس است:

### متدها

```js
// مقداردهی دستی یک جدول
Table.init('my-table');        // با شناسه
Table.init(domElement);        // با المان DOM

// مقداردهی همه جدول‌ها
Table.initAll();

// انتخاب همه ردیف‌های صفحه فعلی
Table.selectAll('my-table');

// لغو انتخاب همه ردیف‌ها
Table.deselectAll('my-table');

// رفتن به صفحه مشخص
Table.goToPage('my-table', 2);

// دریافت ایندکس ردیف‌های انتخاب شده
var selected = Table.getSelected('my-table');
// → [0, 2, 5]
```

### Callbackها

```js
// هنگام تغییر انتخاب ردیف
Table.onSelect('my-table', function(data) {
    console.log(data.row);      // المان ردیف (null اگر header checkbox)
    console.log(data.checked);  // وضعیت چک‌باکس
    console.log(data.selected); // آرایه ایندکس‌های انتخاب شده
});

// هنگام تغییر صفحه
// client mode: fn(page)  —  server mode: fn({ page, pageSize })
Table.onPageChange('my-table', function(data) {
    console.log('صفحه فعلی:', data);
});

// جستجو (فقط server mode)
Table.onSearch('my-table', function(data) {
    console.log('query:', data.query);
    // داده را از API بگیرید و Table.setRows / Table.setTotal را صدا بزنید
});

// عملیات دسته‌ای (فقط server mode)
Table.onBulkAction('my-table', function(data) {
    console.log('action:', data.action);   // 'delete'
    console.log('rows:', data.rows);       // آرایه المان‌های انتخاب شده
});
```

## حالت Server-Side

با افزودن `data-mode="server"` به container، جدول در حالت server-side فعال می‌شود:

```html
<div class="table-container" data-table="my-table" data-page-size="10" data-mode="server">
    ...
</div>
```

در این حالت:
- جستجو، تغییر صفحه/page-size و حذف دسته‌ای فقط **callback** می‌زنند
- شما داده صفحه فعلی را از API می‌گیرید و با `setRows` و `setTotal` به جدول می‌دهید

```js
// تنظیم ردیف‌های صفحه فعلی (HTML string یا آرایه TR)
Table.setRows('my-table', '<tr>...</tr><tr>...</tr>');

// تنظیم تعداد کل ردیف‌ها (برای صفحه‌بندی)
Table.setTotal('my-table', 250);

// نمونه کامل integration
Table.onPageChange('my-table', function(data) {
    fetch('/api/items?page=' + data.page + '&size=' + data.pageSize)
        .then(function(r) { return r.json(); })
        .then(function(res) {
            Table.setTotal('my-table', res.total);
            Table.setRows('my-table', res.rows.map(buildRowHTML).join(''));
        });
});

Table.onSearch('my-table', function(data) {
    fetch('/api/items?q=' + encodeURIComponent(data.query) + '&page=1&size=10')
        .then(function(r) { return r.json(); })
        .then(function(res) {
            Table.setTotal('my-table', res.total);
            Table.setRows('my-table', res.rows.map(buildRowHTML).join(''));
        });
});
```

> **نکته:** در server mode، جدول با کلاس `table--loading` شروع می‌کند (tbody با opacity کم). پس از صدا زدن `setRows`، این کلاس برداشته می‌شود.

## امکانات

| امکان | توضیح |
|---|---|
| انتخاب ردیف | چک‌باکس تکی + انتخاب همه + حالت indeterminate |
| جستجو | client-side (فیلتر DOM) یا server-side (callback) |
| فیلتر | فیلتر بر اساس مقدار تگ وضعیت |
| صفحه‌بندی | دکمه‌های شماره + ناوبری + ellipsis |
| تعداد ردیف | انتخاب ۵/۱۰/۱۵/۲۰ ردیف در هر صفحه |
| عملیات دسته‌ای | نوار عملیات با حذف و ویرایش (نمایش هنگام انتخاب) |
| منوی ردیف | دکمه سه‌نقطه با ویرایش و حذف تکی |
| ویرایش | مودال ویرایش فیلدهای متنی ردیف |
| Server-Side | callback برای جستجو/صفحه/حذف + `setRows` / `setTotal` |
| رسپانسیو | اسکرول افقی + چینش عمودی در موبایل (۷۶۸px) |
| RTL | کامل راست‌به‌چپ، `border-inline-start` برای خط هاور |

## Design Tokens

تمام مقادیر طراحی از طریق CSS custom properties قابل سفارشی‌سازی هستند:

```css
:root {
    /* رنگ‌ها */
    --table-brand: #26a88c;
    --table-primary-text: #222323;
    --table-secondary-text: #59595a;
    --table-stroke: #e2e4e6;
    --table-status-success-fg: #107c10;
    --table-status-success-bg: #f1faf1;
    --table-status-danger-fg: #c50f1f;
    --table-status-danger-bg: #fdf3f4;

    /* اندازه‌ها */
    --table-row-height: 60px;
    --table-head-height: 55px;
    --table-checkbox-size: 28px;
    --table-page-btn-size: 37px;

    /* گردی */
    --table-radius: 8px;
    --table-btn-radius: 8px;
    --table-tag-radius: 8px;
}
```

## حالت‌های ردیف

| حالت | توضیح |
|---|---|
| Default | پس‌زمینه سفید |
| Hover | پس‌زمینه `#f6f8fa` + خط سبز عمودی سمت راست + نمایش دکمه سه‌نقطه |
| Selected | چک‌باکس فعال + کلاس `table__row--selected` |
| Action Bar | هنگام انتخاب ردیف‌ها، نوار مشکی عملیات نمایش داده می‌شود |
