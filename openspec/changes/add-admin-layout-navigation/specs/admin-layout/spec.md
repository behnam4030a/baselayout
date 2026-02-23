## ADDED Requirements

### Requirement: AdminLayout Wrapper
The system SHALL provide an `AdminLayout` component that wraps all admin dashboard pages and renders the appropriate navigation structure (Desktop or Mobile) based on viewport width.

#### Scenario: نمایش Layout در Desktop
- **WHEN** کاربر در صفحه‌ای با عرض >= 1024px قرار دارد
- **THEN** سایدبار در سمت راست، هدر در بالا و محتوا در کنار سایدبار نمایش داده می‌شود

#### Scenario: نمایش Layout در Mobile
- **WHEN** کاربر در صفحه‌ای با عرض < 1024px قرار دارد
- **THEN** سایدبار حذف شده، هدر مختصر در بالا و BottomNav در پایین ثابت نمایش داده می‌شود

---

### Requirement: SideNavigation - حالت‌های نمایش
The `SideNavigation` component MUST support two display modes: Full (280px width) and Mini (~72px width), toggled by a button at the top of the sidebar.

#### Scenario: تغییر به حالت Mini
- **WHEN** کاربر دکمه Toggle را کلیک کند (در حالت Full)
- **THEN** سایدبار به عرض ~72px جمع می‌شود و فقط آیکون‌ها نمایش داده می‌شوند

#### Scenario: تغییر به حالت Full
- **WHEN** کاربر دکمه Toggle را کلیک کند (در حالت Mini)
- **THEN** سایدبار به عرض 280px گسترش می‌یابد و متن کنار آیکون‌ها نمایش داده می‌شود

---

### Requirement: SideNavigation - بخش برندینگ
The sidebar SHALL display a branding section at the top containing the platform logo and name in Full mode, and only the logo icon in Mini mode.

#### Scenario: نمایش لوگو در حالت Full
- **WHEN** سایدبار در حالت Full است
- **THEN** لوگو و نام پلتفرم در بالای سایدبار نمایش داده می‌شود

#### Scenario: نمایش لوگو در حالت Mini
- **WHEN** سایدبار در حالت Mini است
- **THEN** فقط آیکون لوگو (بدون نام) نمایش داده می‌شود

---

### Requirement: SideNavigation - NavItem
Each navigation item SHALL display an icon, text (in Full mode), and a Chevron arrow on the left side if the item has a submenu.

#### Scenario: آیتم فعال (Active)
- **WHEN** کاربر در صفحه‌ای قرار دارد که با یک NavItem مطابقت دارد
- **THEN** آن NavItem با پس‌زمینه رنگی (`rgba(63,194,166,0.15)`) و border-right به رنگ برند (`#26a88c`) نمایش داده می‌شود

#### Scenario: آیتم در حالت Rest
- **WHEN** NavItem فعال نیست
- **THEN** با متن رنگ `#cfd0d2` و بدون پس‌زمینه نمایش داده می‌شود

#### Scenario: آیتم دارای زیرمنو
- **WHEN** یک NavItem دارای زیرمنو باشد
- **THEN** آیکون Chevron در سمت چپ آن نمایش داده می‌شود

---

### Requirement: SideNavigation - Badge عددی
The items «پشتیبانی» and «درخواست‌ها» MUST display a numeric badge in brand color to indicate unread/pending counts without requiring a click.

#### Scenario: نمایش Badge
- **WHEN** تعداد تیکت‌های باز یا درخواست‌های بررسی نشده بیشتر از صفر باشد
- **THEN** یک Badge سبز رنگ (`#26a88c`) با عدد مربوطه کنار عنوان آیتم نمایش داده می‌شود

#### Scenario: Badge در حالت Mini
- **WHEN** سایدبار در حالت Mini است
- **THEN** Badge همچنان روی آیکون نمایش داده می‌شود

---

### Requirement: SideNavigation - Subscription Card
The sidebar SHALL display a subscription status card at the bottom showing the current plan name and remaining days in Full mode, and SHALL hide it in Mini mode.

#### Scenario: نمایش اشتراک فعال
- **WHEN** کاربر اشتراک فعال دارد
- **THEN** نام اشتراک (مثلاً «اشتراک نقره‌ای») و تعداد روزهای مانده نمایش داده می‌شود

#### Scenario: پنهان شدن کارت در حالت Mini
- **WHEN** سایدبار در حالت Mini است
- **THEN** کارت اشتراک پنهان می‌شود

---

### Requirement: SubDrawer Desktop - باز شدن
The system SHALL open a sliding side panel (SubDrawer) from underneath the sidebar in a right-to-left direction with ease-in-out 300ms animation when clicking a NavItem that has a submenu.

#### Scenario: باز شدن SubDrawer
- **WHEN** کاربر روی NavItem دارای Chevron کلیک کند
- **THEN** پنل سفید از راست به چپ با انیمیشن `ease-in-out 300ms` ظاهر می‌شود و Backdrop روی محتوا نمایش داده می‌شود

#### Scenario: تنها یک SubDrawer باز می‌شود
- **WHEN** SubDrawer برای یک آیتم باز است و کاربر روی آیتم دیگری کلیک کند
- **THEN** SubDrawer قبلی بسته شده و SubDrawer جدید باز می‌شود

---

### Requirement: SubDrawer Desktop - بسته شدن
The SubDrawer MUST support four dismissal methods: toggle click, backdrop click, X button, and submenu item selection.

#### Scenario: بستن با Toggle (کلیک مجدد)
- **WHEN** کاربر مجدداً روی همان NavItem که SubDrawer را باز کرده کلیک کند
- **THEN** پنل با انیمیشن ease-in-out 300ms به سمت راست جمع می‌شود

#### Scenario: بستن با Backdrop
- **WHEN** کاربر روی لایه خاکستری نیمه‌شفاف (Backdrop) کلیک کند
- **THEN** پنل با انیمیشن به سمت راست بسته می‌شود

#### Scenario: بستن با دکمه X
- **WHEN** کاربر دکمه X (ضربدر) در بالای پنل را کلیک کند
- **THEN** پنل بسته می‌شود

#### Scenario: بستن با انتخاب گزینه
- **WHEN** کاربر روی هر یک از آیتم‌های زیرمنو کلیک کند
- **THEN** پنل بسته شده و routing به صفحه مقصد انجام می‌شود

---

### Requirement: TopHeader Desktop
The `TopHeader` component SHALL display the page title, breadcrumb navigation, user account info, wallet balance, notification bell with badge, and a search icon.

#### Scenario: نمایش عنوان و Breadcrumb
- **WHEN** کاربر در هر صفحه‌ای از داشبورد باشد
- **THEN** عنوان صفحه (SemiBold 24px) در سمت راست هدر و مسیر Breadcrumb زیر آن نمایش داده می‌شود

#### Scenario: نمایش اطلاعات کاربر
- **WHEN** کاربر وارد شده باشد
- **THEN** نام کاربر، نقش و تصویر پروفایل در سمت چپ هدر نمایش داده می‌شود

#### Scenario: نمایش Wallet
- **WHEN** کاربر موجودی کیف پول دارد
- **THEN** مبلغ موجودی و دکمه (+) شارژ سریع در هدر نمایش داده می‌شود

#### Scenario: نمایش اعلان با Badge
- **WHEN** کاربر اعلان‌های خوانده‌نشده دارد
- **THEN** آیکون زنگوله با یک Badge عددی نمایش داده می‌شود

---

### Requirement: BottomNav Mobile
The system SHALL display a fixed bottom navigation bar in mobile view with 5 items that SHALL remain visible at all times even during page scroll.

#### Scenario: ثبات در هنگام اسکرول
- **WHEN** کاربر صفحه را اسکرول کند
- **THEN** BottomNav همیشه در پایین صفحه ثابت می‌ماند و پنهان نمی‌شود

#### Scenario: آیتم‌های BottomNav
- **WHEN** BottomNav نمایش داده می‌شود
- **THEN** پنج آیتم به ترتیب (راست به چپ): پیشخوان، اعلان‌ها (با Badge)، منو، جستجو، پروفایل نمایش داده می‌شوند

#### Scenario: آیتم فعال در BottomNav
- **WHEN** یک آیتم در حالت Active باشد
- **THEN** آیکون و متن آن به رنگ سفید نمایش داده می‌شود

---

### Requirement: MobileDrawer - باز و بستن
The `MobileDrawer` SHALL open with a right-to-left ease-in-out 300ms animation and MUST support three dismissal methods: toggle click on BottomNav menu item, backdrop click, and back button press.

#### Scenario: باز شدن با Toggle
- **WHEN** کاربر روی «منو» در BottomNav کلیک کند (در حالی که منو بسته است)
- **THEN** پنل منو از راست به چپ با انیمیشن ease-in-out 300ms وارد صفحه می‌شود و Backdrop در سمت چپ نمایش داده می‌شود

#### Scenario: بستن با Toggle
- **WHEN** کاربر مجدداً روی «منو» در BottomNav کلیک کند (در حالی که منو باز است)
- **THEN** پنل منو با انیمیشن از چپ به راست خارج می‌شود

#### Scenario: بستن با Backdrop
- **WHEN** کاربر روی فضای تیره سمت چپ (Backdrop) کلیک کند
- **THEN** پنل منو بسته می‌شود

#### Scenario: بستن با دکمه بازگشت
- **WHEN** کاربر دکمه «بازگشت» یا Back را فشار دهد
- **THEN** پنل منو بسته می‌شود

---

### Requirement: MobileDrawer - ساختار محتوا
The MobileDrawer SHALL display all navigation items in a single vertical list (without section separation), and SHALL include wallet info and user profile info inside the drawer.

#### Scenario: ساختار لیست
- **WHEN** MobileDrawer باز است
- **THEN** تمام آیتم‌های منو زیر هم قرار دارند (بدون تفکیک Menu 1 / Menu 2) و پشتیبانی و درخواست‌ها هم در همان لیست هستند

#### Scenario: اسکرول داخلی
- **WHEN** تعداد آیتم‌های منو از ارتفاع صفحه بیشتر باشد
- **THEN** محتوای منو به صورت داخلی اسکرول می‌شود در حالی که BottomNav ثابت باقی می‌ماند

#### Scenario: اطلاعات Wallet در منو
- **WHEN** MobileDrawer باز است
- **THEN** موجودی کیف پول و دکمه شارژ در داخل منوی موبایل نمایش داده می‌شود

#### Scenario: اطلاعات پروفایل در منو
- **WHEN** MobileDrawer باز است
- **THEN** تصویر، نام و نقش کاربر در داخل منوی موبایل نمایش داده می‌شود

---

### Requirement: MobileSubDrawer
The system SHALL display a `MobileSubDrawer` panel that slides in from the right and overlays the MobileDrawer with a small left offset when a submenu NavItem is tapped.

#### Scenario: باز شدن MobileSubDrawer
- **WHEN** کاربر روی NavItem دارای Chevron در MobileDrawer کلیک کند
- **THEN** پنل زیرمنو از راست وارد می‌شود و با مقداری فاصله از سمت چپ روی MobileDrawer قرار می‌گیرد

#### Scenario: بستن MobileSubDrawer
- **WHEN** کاربر دکمه X یا «بازگشت» را در بالای MobileSubDrawer کلیک کند
- **THEN** پنل زیرمنو بسته شده و MobileDrawer نمایان می‌ماند

#### Scenario: انتخاب گزینه از MobileSubDrawer
- **WHEN** کاربر روی یک گزینه در MobileSubDrawer کلیک کند
- **THEN** هر دو پنل (زیرمنو و منوی اصلی) بسته شده و routing انجام می‌شود
