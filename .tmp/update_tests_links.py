"""
1. Update sidebar exam submenu links in all HTML files
2. Move inline <script> from result-tests.html to tests/js/tests.js
"""
import re, os

ROOT = r'C:\WorkProject\FrontLayer_Portal_V.3'

# Each file → (list-tests href, result-tests href) relative to that file
FILES = {
    'index.html':                           ('tests/list-tests.html',    'tests/result-tests.html'),
    'tests/list-tests.html':                ('list-tests.html',           'result-tests.html'),
    'tests/result-tests.html':              ('list-tests.html',           'result-tests.html'),
    'users/users.html':                     ('../tests/list-tests.html',  '../tests/result-tests.html'),
    'groups/list-groups.html':              ('../tests/list-tests.html',  '../tests/result-tests.html'),
    'groups/list-groups-user.html':         ('../tests/list-tests.html',  '../tests/result-tests.html'),
    'labels/labels.html':                   ('../tests/list-tests.html',  '../tests/result-tests.html'),
    'profile/profile.html':                 ('../tests/list-tests.html',  '../tests/result-tests.html'),
    'manageAdmins/list-admins.html':        ('../tests/list-tests.html',  '../tests/result-tests.html'),
    'manageAdmins/profile-admins.html':     ('../tests/list-tests.html',  '../tests/result-tests.html'),
    'manageAdmins/access.html':             ('../tests/list-tests.html',  '../tests/result-tests.html'),
}

TEMPLATE_RE = re.compile(
    r'(<template id="submenu-desktop-exams">)(.*?)(</template>)',
    re.DOTALL
)

def update_submenu(inner, list_href, result_href):
    # Replace href for لیست آزمون‌ها
    inner = re.sub(
        r'(<a class="sub-drawer-item" href=")[^"]*(">\s*<div class="sub-drawer-item-info">\s*<span class="sub-drawer-item-name">لیست آزمون)',
        r'\g<1>' + list_href + r'\g<2>',
        inner
    )
    # Replace href for نتایج
    inner = re.sub(
        r'(<a class="sub-drawer-item" href=")[^"]*(">\s*<div class="sub-drawer-item-info">\s*<span class="sub-drawer-item-name">نتایج)',
        r'\g<1>' + result_href + r'\g<2>',
        inner
    )
    return inner

# ── 1. Update sidebar links ──────────────────────────────────────────────────
for rel, (lhref, rhref) in FILES.items():
    path = os.path.join(ROOT, rel.replace('/', os.sep))
    if not os.path.exists(path):
        print(f'SKIP (missing): {rel}')
        continue
    with open(path, encoding='utf-8') as f:
        content = f.read()
    def _replacer(m, lh=lhref, rh=rhref):
        return m.group(1) + update_submenu(m.group(2), lh, rh) + m.group(3)
    new = TEMPLATE_RE.sub(_replacer, content)
    if new != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new)
        print(f'UPDATED links: {rel}')
    else:
        print(f'no change:     {rel}')

# ── 2. Move inline <script> from result-tests.html to tests/js/tests.js ─────
result_html_path = os.path.join(ROOT, 'tests', 'result-tests.html')
tests_js_path    = os.path.join(ROOT, 'tests', 'js', 'tests.js')

with open(result_html_path, encoding='utf-8') as f:
    html = f.read()

INLINE_SCRIPT_RE = re.compile(
    r'\n?<script>\s*\n(.*?)\n</script>',
    re.DOTALL
)

m = INLINE_SCRIPT_RE.search(html)
if m:
    js_body = m.group(1).rstrip()
    # Append to tests.js
    with open(tests_js_path, encoding='utf-8') as f:
        existing_js = f.read()
    separator = '\n\n/* ===================================================\n   Result Tests Page JS\n   =================================================== */\n'
    with open(tests_js_path, 'w', encoding='utf-8') as f:
        f.write(existing_js.rstrip() + separator + js_body + '\n')
    # Remove inline script block + add src reference
    new_html = html[:m.start()] + '\n<script src="js/tests.js"></script>' + html[m.end():]
    with open(result_html_path, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print('MOVED JS: result-tests.html → tests/js/tests.js')
else:
    print('no inline script found in result-tests.html')

print('\nAll done.')
