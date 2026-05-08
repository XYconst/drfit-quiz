#!/usr/bin/env python3
"""
Background-remove all character photos using rembg.

Reads /public/images/photo/**/*.png, writes alpha-channel cutouts in place.
Skips files that have already been processed (detected via alpha channel).
"""

import sys
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

ROOT = Path.home() / "drfit-quiz/public/images/photo"
session = new_session("isnet-general-use")  # better edge fidelity than u2net for fitness models

def has_alpha(p: Path) -> bool:
    with Image.open(p) as im:
        return im.mode in ("RGBA", "LA") and "A" in im.getbands()

def process(src: Path) -> bool:
    if has_alpha(src):
        return False  # already cut out
    with Image.open(src) as im:
        im_rgb = im.convert("RGB")
    cutout = remove(im_rgb, session=session)
    cutout.save(src, "PNG", optimize=True)
    return True

if __name__ == "__main__":
    files = sorted(ROOT.rglob("*.png"))
    only = sys.argv[1:]
    if only:
        files = [f for f in files if any(o in str(f) for o in only)]
    print(f"{len(files)} files to consider.")
    n_done = n_skip = 0
    for f in files:
        try:
            if process(f):
                print(f"[ok  ] {f.relative_to(ROOT)}")
                n_done += 1
            else:
                print(f"[skip] {f.relative_to(ROOT)} (already alpha)")
                n_skip += 1
        except Exception as e:
            print(f"[fail] {f.relative_to(ROOT)}: {e}")
    print(f"\nProcessed: {n_done}, skipped: {n_skip}")
