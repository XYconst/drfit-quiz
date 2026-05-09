#!/usr/bin/env python3
"""
Stitch per-character before/after transformation composites from the existing
body-type photos (overweight on the left, perfect on the right). Output:
public/images/photo/testimonials/{char}-transformation.jpg
"""
from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "public/images/photo/body-type"
OUT = ROOT / "public/images/photo/testimonials"
OUT.mkdir(parents=True, exist_ok=True)

CHARS = ("m1", "m2", "m3", "m4", "f1", "f2", "f3", "f4")
TARGET_W = 900   # final composite width
GAP = 12         # px between the two halves


BG_F = (236, 229, 218)   # warm cream for women — matches gen prompt backdrop
BG_M = (58, 63, 68)      # warm grey for men — matches gen prompt backdrop


def flatten(img: Image.Image, bg: tuple[int, int, int]) -> Image.Image:
    if img.mode in ("RGBA", "LA"):
        canvas = Image.new("RGB", img.size, bg)
        canvas.paste(img, (0, 0), img.split()[-1])
        return canvas
    return img.convert("RGB")


def composite(char: str) -> Path:
    bg = BG_F if char.startswith("f") else BG_M
    left = flatten(Image.open(SRC / f"{char}-overweight.png"), bg)
    right = flatten(Image.open(SRC / f"{char}-perfect.png"), bg)

    # Normalise to identical heights (use the smaller height to avoid upscaling).
    h = min(left.height, right.height)
    left = left.resize((round(left.width * h / left.height), h), Image.LANCZOS)
    right = right.resize((round(right.width * h / right.height), h), Image.LANCZOS)

    half = (TARGET_W - GAP) // 2
    left = left.resize((half, round(left.height * half / left.width)), Image.LANCZOS)
    right = right.resize((half, round(right.height * half / right.width)), Image.LANCZOS)
    h = max(left.height, right.height)

    canvas = Image.new("RGB", (TARGET_W, h), bg)
    canvas.paste(left, (0, h - left.height))
    canvas.paste(right, (half + GAP, h - right.height))

    out_path = OUT / f"{char}-transformation.jpg"
    canvas.save(out_path, "JPEG", quality=86, optimize=True)
    return out_path


if __name__ == "__main__":
    for c in CHARS:
        p = composite(c)
        kb = p.stat().st_size // 1024
        print(f"{p.name}: {kb}KB")
