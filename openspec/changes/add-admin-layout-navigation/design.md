# Design: Layout اصلی داشبورد ادمین

## Context

این طراحی مبتنی بر فایل Figma با ID `w9YIC2lcukSl2dQMuwEKVT` است.
Node‌های کلیدی: `12348:21574` (مستندات)، `12168:31873` (Desktop Base)، `12177:35443` (Desktop با Submenu)، `12173:30787` (Mobile Base)، `12343:21993` (Mobile Open)، `12350:74360` (Mobile Submenu).

زبان: فارسی (RTL)، فونت: Peyda(FaNum)
برند: رنگ اصلی `#26a88c`، بک‌گراند سایدبار `#222323`

---

## Goals / Non-Goals

- **Goals:**
  - یک Layout یکپارچه برای تمام صفحات داشبورد
  - پشتیبانی کامل از RTL
  - انیمیشن روان (ease-in-out ~300ms) برای باز/بستن Drawer‌ها
  - نمایش Badge عددی روی آیتم‌های پشتیبانی و درخواست‌ها
  - responsive کامل (Desktop + Mobile)

- **Non-Goals:**
  - پیاده‌سازی محتوای داخل هر صفحه (فقط Layout)
  - سیستم Authentication (خارج از این تغییر)
  - تنظیمات پروفایل (صفحه مستقل)

---

## Decisions

### ۱. ساختار کلی Desktop

```
┌──────────────────────────────────────────────────────┐
│   SideNavigation (280px)  │   TopHeader + Content    │
│   (Fixed Right, RTL)      │   (Flexible Width)       │
│                           │                          │
│  ┌─────────────────────┐  │  ┌───────────────────┐   │
│  │ Logo + Toggle       │  │  │ TopHeader (92px)  │   │
│  │─────────────────────│  │  │ Title | Wallet    │   │
│  │ Nav Items (Menu 1)  │  │  │ Notif | User      │   │
│  │ • پیشخوان [Active]  │  │  └───────────────────┘   │
│  │ • کاربران [Arrow]   │  │                          │
│  │ • مدیران [Arrow]    │  │       Page Content        │
│  │ ...                 │  │                          │
│  │─────────────────────│  │                          │
│  │ پشتیبانی [Badge:4]  │  │                          │
│  │ درخواست‌ها [Badge:4]│  │                          │
│  │─────────────────────│  │                          │
│  │ Subscription Card   │  │                          │
│  └─────────────────────┘  │                          │
└──────────────────────────────────────────────────────┘
```

### ۲. حالت‌های سایدبار Desktop

| حالت | عرض | محتوا |
|------|-----|-------|
| Full | 280px | Logo + Text + Icons |
| Mini | ~72px | Icons only (Tooltip on hover) |

دکمه Toggle: آیکون `Menu open right` در بالای سایدبار - با کلیک حالت عوض می‌شود.

### ۳. SubDrawer (زیرمنو) Desktop

- وقتی یک NavItem دارای Arrow کلیک شود:
  - یک Panel سفید (`bg-white`) از زیر سایدبار از راست به چپ خارج می‌شود
  - Backdrop نیمه‌شفاف (`rgba(0,0,0,0.4)`) روی کل صفحه (به‌جز سایدبار) ظاهر می‌شود
  - انیمیشن: `ease-in-out 300ms`
- روش‌های بستن:
  1. کلیک مجدد روی همان NavItem (Toggle)
  2. کلیک روی Backdrop
  3. کلیک دکمه X در بالای Panel
  4. کلیک روی هر گزینه زیرمنو (و redirect)

### ۴. Mobile Layout

```
┌─────────────────────┐
│   TopHeader (Mobile)│  ← فقط: Title + Search Icon + Notif Icon
│─────────────────────│
│                     │
│   Page Content      │
│                     │
│─────────────────────│
│ BottomNav (Fixed)   │  ← پیشخوان | اعلان | منو | جستجو | پروفایل
└─────────────────────┘
```

### ۵. MobileDrawer

- با کلیک «منو» در BottomNav، پنل از راست وارد صفحه می‌شود (RTL)
- عرض: ~280px (با فاصله از سمت چپ)
- ساختار:
  ```
  ┌─────────────────────────────────────┐
  │ [Logo]        [X - بستن]            │
  │─────────────────────────────────────│
  │ پیشخوان                             │
  │ کاربران              [Arrow]        │
  │ مدیران               [Arrow]        │
  │ آزمون‌ها              [Arrow]        │
  │ اشتراک من                           │
  │ دستیار هوشمند                       │
  │ ماژول‌ها                             │
  │ مدیریت مالی          [Arrow]        │
  │ پیکربندی سیستم                      │
  │ پشتیبانی             [Badge:4]      │
  │ درخواست‌ها            [Badge:4]      │
  │─────────────────────────────────────│
  │ [Wallet Info + Charge Button]       │
  │─────────────────────────────────────│
  │ [User Avatar + Name + Role]         │
  └─────────────────────────────────────┘
  ```
- **توجه مهم:** در موبایل همه منوها زیر هم هستند (بدون تفکیک Menu 1 / Menu 2)
- پشتیبانی، درخواست‌ها و کارت اشتراک با بقیه منوها در یک لیست هستند

### ۶. MobileSubDrawer

- با کلیک روی NavItem دارای Arrow در MobileDrawer
- پنل جدید از راست وارد می‌شود و روی MobileDrawer قرار می‌گیرد (با مقداری فاصله از سمت چپ)
- در بالا: دکمه «بازگشت» + آیکون Chevron + عنوان زیرمنو
- دکمه بستن (X) نیز در بالا موجود است

### ۷. TopHeader - Desktop vs Mobile

| المان | Desktop | Mobile |
|-------|---------|--------|
| عنوان صفحه | ✅ (SemiBold 24px) | ✅ (کوچکتر) |
| Breadcrumb | ✅ | ❌ |
| نام و نقش کاربر | ✅ | ❌ |
| Wallet | ✅ | ❌ (در Mobile Drawer) |
| جستجو | ✅ (در Header) | ✅ (در BottomNav) |
| اعلان‌ها | ✅ (در Header با Badge) | ✅ (در BottomNav) |
| پروفایل Avatar | ✅ (در Header) | ✅ (در BottomNav) |

---

## Design Tokens

```
colors/neutral/background/inverted/1/rest: #222323  (سایدبار BG)
colors/neutral/background/inverted/2/rest: #2c2d2d  (Toggle Button BG)
colors/neutral/foreground/inverted/1/rest: white
colors/neutral/foreground/inverted/2/rest: #cfd0d2  (متن منو)
colors/brand/background/1/rest: #26a88c  (برند سبز - Active, Badge)
colors/brand/stroke/1/rest: #26a88c
colors/neutral/background/1/rest: #f6f8fa  (بک‌گراند کلی صفحه)
colors/neutral/background/2/rest: white   (کارت‌ها و Panel)
colors/neutral/foreground/1/rest: #222323
colors/neutral/foreground/-2/rest: #59595a

border-radius/card-corner: 8px
border-radius/button-corner: 8px
border-radius/full: 360px

spacing/spacing-01: 8px
spacing/spacing-03: 24px
spacing/spacing-105: 12px

animation: ease-in-out 300ms (Drawer open/close)
```

---

## Risks / Trade-offs

- **RTL + Drawer:** باید مطمئن شوند z-index سایدبار، Drawer و Backdrop به درستی لایه‌بندی شده‌اند
- **Scroll Lock:** هنگام باز بودن MobileDrawer یا SubDrawer، اسکرول صفحه باید قفل شود
- **Toggle State:** State مدیریت باز/بسته بودن Drawer باید در سطح Layout نگهداری شود

## Open Questions

- آیا حالت Mini سایدبار (Desktop) نیاز به Tooltip روی hover دارد؟
- آیا اعلان‌ها یک پنل popup جداگانه دارند یا redirect به صفحه اعلان‌ها می‌کنند؟
