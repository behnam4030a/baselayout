# Change: افزودن Layout اصلی داشبورد ادمین (ناوبری دسکتاپ و موبایل)

## Why

پروتال ادمین نیاز به یک چارچوب ناوبری پایدار و واکنش‌گرا دارد که تجربه کاربری یکپارچه‌ای را در دو بستر دسکتاپ و موبایل فراهم کند. این لایه Layout به عنوان پوسته دائمی تمام صفحات داشبورد عمل می‌کند و شامل سایدبار، هدر، زیرمنوی کشویی (Desktop Drawer) و ناوبری پایین ثابت (Mobile Bottom Nav) است.

## What Changes

- **افزودن** کامپوننت `SideNavigation` (سایدبار) با دو حالت Full/Mini
- **افزودن** کامپوننت `TopHeader` (هدر) با عنوان صفحه، Breadcrumb، Wallet، اعلان‌ها، جستجو و پروفایل کاربر
- **افزودن** کامپوننت `SubDrawer` (پنل زیرمنوی کشویی) با Backdrop و منطق Toggle/Dismissal
- **افزودن** کامپوننت `BottomNav` (نوار ناوبری پایین ثابت برای موبایل)
- **افزودن** کامپوننت `MobileDrawer` (منوی اصلی موبایل) با انیمیشن RTL
- **افزودن** کامپوننت `MobileSubDrawer` (زیرمنوی موبایل) که روی منوی اصلی لایه‌بندی می‌شود
- **افزودن** Wrapper کلی `AdminLayout` که همه موارد فوق را ترکیب می‌کند

## Impact

- Affected specs: `admin-layout`
- Affected code:
  - `src/layouts/AdminLayout` (جدید)
  - `src/components/navigation/SideNavigation` (جدید)
  - `src/components/navigation/TopHeader` (جدید)
  - `src/components/navigation/SubDrawer` (جدید)
  - `src/components/navigation/BottomNav` (جدید)
  - `src/components/navigation/MobileDrawer` (جدید)
  - `src/components/navigation/MobileSubDrawer` (جدید)
