#!/usr/bin/env python3
"""
Boost faded cutouts: rembg sometimes returns mid-range alpha for whole body
regions, which renders as a washed-out ghost. Apply a gamma curve to the
alpha channel so anything >= 30 gets pushed toward 255 while preserving the
sub-30 fringe for smooth edges.

Scans all cutouts, ranks by % of mid-alpha pixels (16..200) relative to the
visible area, fixes anything above THRESH_MID_PCT.
"""

import sys
from pathlib import Path
from PIL import Image, ImageMath

ROOT = Path(__file__).resolve().parents[2] / "public/images/photo"
THRESH_MID_PCT = 3.0   # % of visible-area pixels with mid-alpha that triggers a fix
GAMMA = 0.4             # < 1 brightens; lower = more aggressive


def mid_alpha_pct(img: Image.Image) -> float:
    if "A" not in img.getbands():
        return 0.0
    a = img.split()[-1]
    h = a.histogram()
    total = sum(h)
    transparent = h[0]
    visible = total - transparent
    if visible < 1000:
        return 0.0
    mid = sum(h[16:201])
    return mid / visible * 100


def fix_alpha(img: Image.Image) -> Image.Image:
    """Apply gamma to alpha channel; sub-30 stays sub-30 for soft fringe."""
    r, g, b, a = img.split()
    # ImageMath expects ints; compute the curve via lookup table on the alpha.
    lut = bytearray(256)
    for v in range(256):
        if v < 30:
            lut[v] = v
        else:
            # gamma in [30..255] -> [30..255]
            normalized = (v - 30) / (255 - 30)
            boosted = int(255 * (normalized ** GAMMA))
            lut[v] = max(30, min(255, boosted))
    new_a = a.point(lut)
    return Image.merge("RGBA", (r, g, b, new_a))


def main():
    only = sys.argv[1:]
    files = sorted(ROOT.rglob("*.png"))
    if only:
        files = [f for f in files if any(o in str(f) for o in only)]
    fixed = skipped = errored = 0
    for p in files:
        try:
            with Image.open(p) as im:
                pct = mid_alpha_pct(im)
                if pct < THRESH_MID_PCT:
                    skipped += 1
                    continue
                rgba = im.convert("RGBA")
            fixed_img = fix_alpha(rgba)
            fixed_img.save(p, "PNG", optimize=True)
            print(f"[fix ] mid={pct:5.1f}% -> {p.relative_to(ROOT)}")
            fixed += 1
        except Exception as e:
            print(f"[err ] {p.relative_to(ROOT)}: {e}")
            errored += 1
    print(f"\n{fixed} fixed · {skipped} skipped · {errored} errored")


if __name__ == "__main__":
    main()
