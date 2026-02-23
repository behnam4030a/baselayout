## 1. Desktop - SideNavigation

- [x] 1.1 ساخت کامپوننت `SideNavigation` با props: `mode: 'full' | 'mini'`
- [x] 1.2 پیاده‌سازی دکمه Toggle و مدیریت state حالت Full/Mini
- [x] 1.3 پیاده‌سازی بخش برندینگ (Logo + Platform Name)
- [x] 1.4 ساخت کامپوننت `NavItem` با props: `icon`, `text`, `hasSubmenu`, `isActive`
- [x] 1.5 پیاده‌سازی حالت Active برای NavItem (پس‌زمینه رنگی + border-right)
- [x] 1.6 ساخت کامپوننت `NavBadgeItem` برای آیتم‌های دارای Badge (پشتیبانی، درخواست‌ها)
- [x] 1.7 ساخت کامپوننت `SubscriptionCard` در پایین سایدبار
- [x] 1.8 پنهان کردن SubscriptionCard و متن NavItem‌ها در حالت Mini
- [x] 1.9 اضافه کردن BG Pattern (تصویر توپوگرافیک با opacity=6%)

## 2. Desktop - SubDrawer (زیرمنو)

- [x] 2.1 ساخت کامپوننت `SubDrawer` با props: `isOpen`, `items`, `onClose`
- [x] 2.2 پیاده‌سازی انیمیشن ease-in-out 300ms برای ورود/خروج از راست به چپ
- [x] 2.3 پیاده‌سازی Backdrop نیمه‌شفاف روی محتوای صفحه (z-index مناسب)
- [x] 2.4 پیاده‌سازی منطق Toggle (کلیک مجدد روی همان NavItem = بسته شدن)
- [x] 2.5 پیاده‌سازی بستن با کلیک روی Backdrop
- [x] 2.6 پیاده‌سازی دکمه X در بالای SubDrawer
- [x] 2.7 پیاده‌سازی بستن خودکار هنگام کلیک روی گزینه زیرمنو + routing

## 3. Desktop - TopHeader

- [x] 3.1 ساخت کامپوننت `TopHeader` با props: `pageTitle`, `breadcrumbs`, `user`, `wallet`
- [x] 3.2 پیاده‌سازی بخش Title (SemiBold 24px) + نوار برند عمودی سمت راست
- [x] 3.3 پیاده‌سازی کامپوننت `Breadcrumb` با آیتم‌های قابل کلیک
- [x] 3.4 پیاده‌سازی بخش Wallet (موجودی + دکمه + شارژ)
- [x] 3.5 پیاده‌سازی بخش اعلان‌ها با Badge عددی
- [x] 3.6 پیاده‌سازی آیکون جستجو
- [x] 3.7 پیاده‌سازی بخش اطلاعات کاربر (Avatar Verified + نام + نقش + Dropdown)

## 4. Mobile - BottomNav

- [x] 4.1 ساخت کامپوننت `BottomNav` با position: fixed bottom-0
- [x] 4.2 پیاده‌سازی ۵ آیتم: پیشخوان، اعلان‌ها (Badge)، منو، جستجو، پروفایل
- [x] 4.3 پیاده‌سازی حالت Active برای آیتم فعال (رنگ سفید)
- [x] 4.4 اطمینان از نمایش ثابت در هنگام اسکرول صفحه
- [x] 4.5 اضافه کردن BG Pattern به BottomNav

## 5. Mobile - MobileDrawer

- [x] 5.1 ساخت کامپوننت `MobileDrawer` با انیمیشن RTL (ease-in-out 300ms)
- [x] 5.2 پیاده‌سازی Toggle از طریق BottomNav (باز/بستن)
- [x] 5.3 پیاده‌سازی Backdrop در سمت چپ + بستن با کلیک روی آن
- [x] 5.4 پیاده‌سازی بستن با Back button
- [x] 5.5 لیست تمام آیتم‌ها به صورت عمودی (بدون تفکیک)
- [x] 5.6 پیاده‌سازی اسکرول داخلی برای تعداد زیاد آیتم
- [ ] 5.7 قرار دادن Wallet (موجودی + شارژ) داخل منوی موبایل
- [ ] 5.8 قرار دادن اطلاعات پروفایل کاربر داخل منوی موبایل
- [ ] 5.9 قرار دادن کارت اشتراک داخل منوی موبایل

## 6. Mobile - MobileSubDrawer

- [x] 6.1 ساخت کامپوننت `MobileSubDrawer` با ورود از راست + offset از چپ
- [ ] 6.2 پیاده‌سازی header با دکمه «بازگشت» + Chevron + عنوان + دکمه X
- [x] 6.3 بستن تنها MobileSubDrawer (MobileDrawer باز می‌ماند)
- [x] 6.4 بستن هر دو پنل هنگام انتخاب گزینه + routing

## 7. AdminLayout Wrapper

- [x] 7.1 ساخت کامپوننت `AdminLayout` که همه موارد را ترکیب می‌کند
- [x] 7.2 پیاده‌سازی responsive breakpoint (Desktop >= 1024px / Mobile < 1024px)
- [x] 7.3 مدیریت global state: حالت سایدبار (full/mini)، آیتم فعال Drawer، وضعیت MobileDrawer
- [x] 7.4 قفل scroll صفحه هنگام باز بودن Drawer (mobile)
- [x] 7.5 پشتیبانی از RTL در تمام انیمیشن‌ها و جهت‌ها

## 8. تست و کیفیت

- [ ] 8.1 تست انیمیشن‌ها روی مرورگرهای اصلی
- [ ] 8.2 تست تمام روش‌های بستن Drawer (4 روش Desktop، 3 روش Mobile)
- [ ] 8.3 تست حالت Mini/Full سایدبار
- [ ] 8.4 تست responsive transition بین Desktop و Mobile
- [ ] 8.5 بررسی z-index لایه‌بندی (Backdrop < Drawer < SubDrawer)
