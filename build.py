#!/usr/bin/env python3
"""Build office-hub/index.html as one self-contained file.

The sources in src/ stay separate so they are readable and editable. The
shipped page has to be a single file: GitHub Pages, file:// and preview
panes all serve it without resolving sibling <script src> requests, and a
missing sibling fails silently as a blank page.

    python3 build.py          rebuild index.html
    python3 build.py --check  verify index.html is up to date
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
OUT = ROOT / "index.html"
ORDER = ["data.js", "core.js", "screens.js"]

TAG = re.compile(r'[ \t]*<script src="(?P<f>[^"]+)"></script>\n')


def build() -> str:
    html = (SRC / "shell.html").read_text(encoding="utf-8")

    seen = []

    def inline(m):
        name = m.group("f")
        seen.append(name)
        body = (SRC / name).read_text(encoding="utf-8").rstrip()
        # A literal </script> inside a string would close the block early.
        if "</script" in body.lower():
            raise SystemExit(f"{name} contains a literal </script>; escape it first")
        return f'<script>\n/* ---- {name} ---- */\n{body}\n</script>\n'

    html = TAG.sub(inline, html)

    if seen != ORDER:
        raise SystemExit(f"shell.html loads {seen}, expected {ORDER}")
    return html


if __name__ == "__main__":
    out = build()
    if "--check" in sys.argv:
        current = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
        if current != out:
            raise SystemExit("index.html is stale - run: python3 build.py")
        print("index.html is up to date")
    else:
        OUT.write_text(out, encoding="utf-8")
        print(f"wrote {OUT.relative_to(ROOT.parent)}  ({len(out):,} bytes)")
