"""
apply_panel_mode.py
Pass 2: Injects sub-drawer static groups into subDrawerItems and cleans leftover template comments.
(Chips, cat buttons, search results, notif panels, template blocks already handled in pass 1.)
"""

import re
import os

BASE = "C:/WorkProject/FrontLayer_Portal_V.3"

FILES = [
    ("index.html",                          ""),
    ("finance/finance.html",                "../"),
    ("groups/list-groups-user.html",        "../"),
    ("groups/list-groups.html",             "../"),
    ("labels/labels.html",                  "../"),
    ("manageAdmins/access.html",            "../"),
    ("manageAdmins/list-admins.html",       "../"),
    ("manageAdmins/profile-admins.html",    "../"),
    ("modules/modules-setting.html",        "../"),
    ("modules/modules.html",                "../"),
    ("profile/profile.html",                "../"),
    ("subscription/subscription.html",      "../"),
    ("tests/list-tests.html",               "../"),
    ("tests/result-tests.html",             "../"),
    ("users/users.html",                    "../"),
]

# ── sub-drawer item icons ────────────────────────────────────────────────────

USERS_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.04272 15.9478C4.26686 16.6508 3.95667 17.5452 3.95667 18.3329C3.95667 18.7127 3.64886 19.0204 3.26917 19.0204C2.88946 19.0204 2.58167 18.7127 2.58167 18.3329C2.58167 17.1877 3.03397 15.9124 4.11949 14.9289C5.20671 13.9437 6.86679 13.3059 9.18972 13.3059C11.5109 13.3059 13.1704 13.9387 14.2579 14.9191C15.3442 15.8984 15.7969 17.1702 15.7969 18.3163C15.7969 18.696 15.4891 19.0038 15.1094 19.0038C14.7297 19.0038 14.4219 18.696 14.4219 18.3163C14.4219 17.5285 14.112 16.6389 13.3372 15.9403C12.5634 15.2427 11.2631 14.6809 9.18972 14.6809C7.11708 14.6809 5.81688 15.2464 5.04272 15.9478Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.18967 4.35425C7.48158 4.35425 6.09619 5.73942 6.09619 7.44861C6.09619 9.1578 7.48158 10.5429 9.18967 10.5429C10.8988 10.5429 12.2841 9.1577 12.2841 7.44861C12.2841 5.73953 10.8988 4.35425 9.18967 4.35425ZM4.72119 7.44861C4.72119 4.98024 6.72198 2.97925 9.18967 2.97925C11.6582 2.97925 13.6591 4.98014 13.6591 7.44861C13.6591 9.91713 11.6582 11.9179 9.18967 11.9179C6.72198 11.9179 4.72119 9.91695 4.72119 7.44861Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.5528 13.5581C15.6291 13.1862 15.9926 12.9466 16.3645 13.023C17.7588 13.3092 18.7233 13.9729 19.332 14.8077C19.9319 15.6305 20.1529 16.573 20.1529 17.3811C20.1529 17.7608 19.845 18.0686 19.4654 18.0686C19.0857 18.0686 18.7779 17.7608 18.7779 17.3811C18.7779 16.8104 18.6202 16.1653 18.221 15.6178C17.8306 15.0824 17.1755 14.5931 16.088 14.3698C15.716 14.2935 15.4764 13.9301 15.5528 13.5581Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.7135 5.05195C14.7909 4.68024 15.1551 4.44175 15.5268 4.51925C17.1165 4.85071 18.3075 6.26061 18.302 7.94774C18.2965 9.44101 17.3548 10.7118 16.0343 11.2053C15.6786 11.3382 15.2825 11.1577 15.1496 10.802C15.0166 10.4463 15.1972 10.0502 15.5529 9.91732C16.3544 9.61775 16.9236 8.84682 16.927 7.94329M14.7135 5.05195C14.6359 5.42365 14.8744 5.78781 15.2462 5.8653L14.7135 5.05195ZM15.2462 5.8653C16.2092 6.0661 16.9302 6.92195 16.927 7.94329L15.2462 5.8653Z" fill="#222323"/></svg>'

GROUPS_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5142 13.5637C12.7751 13.577 13.9288 13.7284 14.788 14.1552C15.2284 14.374 15.6137 14.6759 15.8859 15.0881C16.1609 15.5045 16.292 15.99 16.2892 16.5249L16.2891 16.5396L16.2883 16.5543C16.2626 17.0905 16.0858 17.6086 15.724 18.0014C15.3534 18.4039 14.8369 18.6211 14.2504 18.6211H8.76339C8.17689 18.6211 7.65921 18.4044 7.2879 18.0019C6.92505 17.6084 6.74822 17.089 6.72523 16.5506L6.72461 16.5359V16.5213C6.72461 15.9859 6.85711 15.5004 7.13235 15.0842C7.40506 14.6718 7.79001 14.3694 8.23053 14.1505C9.08989 13.7233 10.2421 13.5737 11.5014 13.5638L11.5142 13.5637ZM8.09966 16.5064C8.11411 16.782 8.20138 16.9642 8.2986 17.0696C8.38906 17.1676 8.52945 17.2461 8.76339 17.2461H14.2504C14.4829 17.2461 14.6222 17.1681 14.7126 17.07C14.8102 16.964 14.8982 16.7805 14.9142 16.5027C14.9134 16.2121 14.8436 16.0048 14.7386 15.8459C14.6293 15.6804 14.4526 15.5238 14.1763 15.3867C13.6034 15.1021 12.7075 14.9519 11.506 14.9388C10.3073 14.9488 9.41426 15.0976 8.84253 15.3817C8.56701 15.5187 8.38974 15.6755 8.27925 15.8426C8.17308 16.0032 8.10199 16.2129 8.09966 16.5064Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5076 8.53638C10.7052 8.53638 10.0547 9.18684 10.0547 9.98929C10.0547 10.7917 10.7052 11.4421 11.5076 11.4421C12.31 11.4421 12.9605 10.7917 12.9605 9.98929C12.9605 9.18684 12.31 8.53638 11.5076 8.53638ZM8.67969 9.98929C8.67969 8.42746 9.94574 7.16138 11.5076 7.16138C13.0694 7.16138 14.3355 8.42746 14.3355 9.98929C14.3355 11.551 13.0694 12.8171 11.5076 12.8171C9.94574 12.8171 8.67969 11.551 8.67969 9.98929Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.2046 9.97044C7.2076 10.3501 6.90224 10.6603 6.52256 10.6634C5.52945 10.6712 4.80794 10.7947 4.35672 11.0189C4.14194 11.1257 4.01236 11.2436 3.93438 11.3616C3.86057 11.4731 3.80695 11.6237 3.80465 11.8458C3.81605 12.051 3.8805 12.1736 3.93889 12.2369C3.99018 12.2925 4.07475 12.3459 4.23908 12.3459H6.88566C7.26535 12.3459 7.57316 12.6537 7.57316 13.0334C7.57316 13.4131 7.26535 13.7209 6.88566 13.7209H4.23908C3.72219 13.7209 3.26032 13.5292 2.92819 13.1692C2.60451 12.8183 2.4502 12.3587 2.43019 11.89C2.42978 11.8803 2.42957 11.8705 2.42957 11.8607C2.42957 11.3963 2.54475 10.9702 2.78749 10.6031C3.02768 10.2399 3.36494 9.9764 3.74471 9.78766C4.4826 9.4209 5.46112 9.29669 6.51168 9.28835C6.89137 9.28542 7.20159 9.59076 7.2046 9.97044Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.5295 9.97044C15.5265 10.3501 15.8318 10.6603 16.2115 10.6634C17.2046 10.6712 17.9261 10.7947 18.3773 11.0189C18.5921 11.1257 18.7217 11.2436 18.7997 11.3616C18.8735 11.4731 18.9271 11.6237 18.9294 11.8458C18.918 12.051 18.8535 12.1736 18.7951 12.2369C18.7439 12.2925 18.6593 12.3459 18.495 12.3459H15.8484C15.4687 12.3459 15.1609 12.6537 15.1609 13.0334C15.1609 13.4131 15.4687 13.7209 15.8484 13.7209H18.495C19.0119 13.7209 19.4737 13.5292 19.8058 13.1692C20.1295 12.8183 20.2839 12.3587 20.3038 11.89C20.3043 11.8803 20.3045 11.8705 20.3045 11.8607C20.3045 11.3963 20.1893 10.9702 19.9465 10.6031C19.7064 10.2399 19.3691 9.9764 18.9893 9.78766C18.2514 9.4209 17.2729 9.29669 16.2224 9.28835C15.8427 9.28542 15.5324 9.59076 15.5295 9.97044Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.27468 4.75513C5.67283 4.75513 5.18494 5.24302 5.18494 5.84487C5.18494 6.44672 5.67283 6.9346 6.27468 6.9346C6.87653 6.9346 7.36441 6.44672 7.36441 5.84487C7.36441 5.24302 6.87653 4.75513 6.27468 4.75513ZM3.80994 5.84487C3.80994 4.48363 4.91344 3.38013 6.27468 3.38013C7.63591 3.38013 8.73941 4.48363 8.73941 5.84487C8.73941 7.2061 7.63591 8.3096 6.27468 8.3096C4.91344 8.3096 3.80994 7.2061 3.80994 5.84487Z" fill="#222323"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.4594 4.75513C17.0612 4.75513 17.5491 5.24302 17.5491 5.84487C17.5491 6.44672 17.0612 6.9346 16.4594 6.9346C15.8576 6.9346 15.3696 6.44672 15.3696 5.84487C15.3696 5.24302 15.8576 4.75513 16.4594 4.75513ZM18.9241 5.84487C18.9241 4.48363 17.8206 3.38013 16.4594 3.38013C15.0981 3.38013 13.9946 4.48363 13.9946 5.84487C13.9946 7.2061 15.0981 8.3096 16.4594 8.3096C17.8206 8.3096 18.9241 7.2061 18.9241 5.84487Z" fill="#222323"/></svg>'

LABELS_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M3 3h8l9.5 9.5a2 2 0 010 2.83l-5.17 5.17a2 2 0 01-2.83 0L3 11V3z"/></svg>'
ADMINS_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><rect x="3" y="11" width="18" height="11" rx="2"/><path stroke-linecap="round" d="M7 11V7a5 5 0 0110 0v4"/></svg>'
ACCESS_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path stroke-linecap="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>'
EXAMS_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path stroke-linecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>'
QUESTIONS_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
RESULTS_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
TRANS_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>'
INVOICE_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path stroke-linecap="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline stroke-linecap="round" points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
WALLET_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path stroke-linecap="round" d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path stroke-linecap="round" d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path stroke-linecap="round" d="M18 12a2 2 0 00-2 2 2 2 0 002 2h4v-4h-4z"/></svg>'


def make_sub_drawer_item(href, name, desc, icon_svg):
    return (
        f'    <a class="sub-drawer-item" href="{href}">\n'
        f'      <div class="sub-drawer-item-info">\n'
        f'        <span class="sub-drawer-item-name">{name}</span>\n'
        f'        <span class="sub-drawer-item-desc">{desc}</span>\n'
        f'      </div>\n'
        f'      <div class="sub-drawer-item-icon">{icon_svg}</div>\n'
        f'    </a>'
    )


def make_sub_drawer_groups(prefix):
    p = prefix
    users_items = '\n'.join([
        make_sub_drawer_item(f'{p}users/users.html', 'لیست کاربران', 'مدیریت کاربران، افزودن، پروفایل و ...', USERS_ICON_SVG),
        make_sub_drawer_item(f'{p}groups/list-groups.html', 'گروه‌ها', 'لیست گروه‌ها، مدیریت گروهی', GROUPS_ICON_SVG),
        make_sub_drawer_item(f'{p}labels/labels.html', 'برچسب‌ها', 'لیست برچسب‌ها، دسته‌بندی و ویرایش', LABELS_ICON_SVG),
    ])
    admins_items = '\n'.join([
        make_sub_drawer_item(f'{p}manageAdmins/list-admins.html', 'لیست مدیران', 'مشاهده و مدیریت مدیران سیستم', ADMINS_ICON_SVG),
        make_sub_drawer_item(f'{p}manageAdmins/access.html', 'نقش‌ها و دسترسی', 'مدیریت سطوح دسترسی و مجوزها', ACCESS_ICON_SVG),
    ])
    exams_items = '\n'.join([
        make_sub_drawer_item(f'{p}tests/list-tests.html', 'لیست آزمون‌ها', 'ایجاد و مدیریت آزمون‌ها', EXAMS_ICON_SVG),
        make_sub_drawer_item('#', 'بانک سوالات', 'مدیریت و دسته‌بندی سوالات', QUESTIONS_ICON_SVG),
        make_sub_drawer_item(f'{p}tests/result-tests.html', 'نتایج', 'مشاهده و تحلیل نتایج آزمون‌ها', RESULTS_ICON_SVG),
    ])
    finance_items = '\n'.join([
        make_sub_drawer_item('#', 'تراکنش‌ها', 'لیست و تاریخچه کلیه تراکنش‌ها', TRANS_ICON_SVG),
        make_sub_drawer_item('#', 'فاکتورها', 'مدیریت و صدور فاکتور', INVOICE_ICON_SVG),
        make_sub_drawer_item('#', 'کیف پول', 'شارژ و مدیریت موجودی', WALLET_ICON_SVG),
    ])
    return (
        f'  <div class="sub-drawer-group" data-menu="users" hidden>\n{users_items}\n  </div>\n'
        f'  <div class="sub-drawer-group" data-menu="admins" hidden>\n{admins_items}\n  </div>\n'
        f'  <div class="sub-drawer-group" data-menu="exams" hidden>\n{exams_items}\n  </div>\n'
        f'  <div class="sub-drawer-group" data-menu="finance" hidden>\n{finance_items}\n  </div>'
    )


# Leftover orphan comment blocks to remove
ORPHAN_COMMENTS = [
    # Block 1: search modal templates header comment
    (
        r'\n<!-- ===================================================\n'
        r'     SEARCH MODAL — HTML TEMPLATES\n'
        r'     Cloned by SearchModal JS; never rendered directly\.\n'
        r'     =================================================== -->'
    ),
    # Block 2: chip comment
    r'\n<!-- Chip \(recent / popular search term\) -->',
    # Block 3: category filter button templates comment (multiline)
    (
        r'\n<!-- Category filter button templates \(one per category\)\n'
        r'     (?:.*\n)*?.*-->'
    ),
    # Block 4: result item comment
    r'\n<!-- Search result item -->',
    # Block 5: group header comment
    r'\n<!-- Search result group header -->',
    # Block 6: submenu templates block comment
    (
        r'\n<!-- ===================================================\n'
        r'     SUBMENU TEMPLATES.*?\n'
        r'     =================================================== -->'
    ),
    # Block 7: notification detail templates block comment
    (
        r'\n<!-- ===================================================\n'
        r'     NOTIFICATION DETAIL TEMPLATES.*?\n'
        r'     =================================================== -->'
    ),
    # Inline comment for result icon templates
    r'\n<!-- Result item icon templates \(24px, one per category\) -->',
    # dropdown items comment
    r'[ \t]*<!-- dropdown items cloned from template and inserted by JS -->\n',
    # Category filter button templates (another variant)
    (
        r'<!-- Category filter button templates \(one per category\)\n'
        r'     (?:.*\n)*?.*-->\n'
    ),
]


def process_file(rel_path, prefix):
    full_path = os.path.join(BASE, rel_path).replace('\\', '/')
    if not os.path.exists(full_path):
        print(f"  SKIP (not found): {rel_path}")
        return False

    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # ── Inject sub-drawer groups if not already present ──────────────────────
    if 'sub-drawer-group' not in content:
        sub_groups = make_sub_drawer_groups(prefix)
        # Match subDrawerItems container (may have comment or whitespace inside)
        old_sub_pattern = r'(<div class="sub-drawer-items" id="subDrawerItems">)[\s\S]*?(</div>)'
        new_sub = r'\1\n' + sub_groups + r'\n  \2'
        content_new = re.sub(old_sub_pattern, new_sub, content, count=1)
        if content_new == content:
            print(f"  WARNING: subDrawerItems pattern not found in {rel_path}")
        else:
            content = content_new
    else:
        print(f"  (sub-drawer-groups already present in {rel_path})")

    # ── Remove leftover orphan comments ──────────────────────────────────────
    for pat in ORPHAN_COMMENTS:
        content = re.sub(pat, '', content, flags=re.DOTALL)

    # Clean up multiple consecutive blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)

    if content == original:
        print(f"  NO CHANGES: {rel_path}")
    else:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  OK: {rel_path}")
    return True


def main():
    processed = 0
    errors = 0
    for rel_path, prefix in FILES:
        print(f"Processing: {rel_path}")
        try:
            ok = process_file(rel_path, prefix)
            if ok:
                processed += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            import traceback
            traceback.print_exc()
            errors += 1

    print(f"\nDone. Processed: {processed}, Errors: {errors}")


if __name__ == '__main__':
    main()
