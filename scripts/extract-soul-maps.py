import re
import json
from pathlib import Path

html = Path("soul-maps/index.html").read_text(encoding="utf-8")
pattern = re.compile(
    r'<a href="([^"]+)" class="card[^"]*"[^>]*data-search="[^"]*">\s*'
    r'<div class="card-sub">([^<]+)</div>\s*'
    r'<div class="card-name">([^<]+)</div>\s*'
    r'<div class="card-desc">([^<]+)</div>',
    re.S,
)

maps = []
for href, sub, name, desc in pattern.findall(html):
    if href.startswith("http"):
        continue
    maps.append({
        "href": href,
        "sub": sub.strip(),
        "name": name.strip(),
        "desc": desc.strip(),
    })

out = Path("js/soul-map-rotation.js")
out.parent.mkdir(exist_ok=True)
out.write_text(
    "window.SOUL_MAP_ROTATION = " + json.dumps(maps, indent=2) + ";\n",
    encoding="utf-8",
)
print(f"Wrote {len(maps)} maps to {out}")