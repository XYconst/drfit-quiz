#!/usr/bin/env python3
"""
Generate the 8 Dr.Fit base reference portraits via kie.ai Nano Banana Pro.

Reads KIE_API_KEY from ~/Desktop/23/ai-team/.env (the existing Cocosolis setup).
Saves outputs to ~/drfit-quiz/public/images/photo/ref/{m1..m4,f1..f4}.png.

Re-run safe: skips characters whose output file already exists. Delete a file
to regenerate it.
"""

import json
import os
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

HOME = Path.home()
ENV_PATH = HOME / "Desktop/23/ai-team/.env"
OUT_DIR = HOME / "drfit-quiz/public/images/photo/ref"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# --- Load KIE_API_KEY from .env -------------------------------------------------

def load_env_value(path: Path, key: str) -> str:
    if not path.exists():
        return os.environ.get(key, "")
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" in line:
            k, v = line.split("=", 1)
            if k.strip() == key:
                return v.strip().strip('"').strip("'")
    return os.environ.get(key, "")

KIE_API_KEY = load_env_value(ENV_PATH, "KIE_API_KEY")
if not KIE_API_KEY:
    print(f"ERROR: KIE_API_KEY not found in {ENV_PATH}", file=sys.stderr)
    sys.exit(1)

# --- Universal style anchor (appended to every prompt) -------------------------

STYLE = (
    "Photographic, editorial fitness-magazine grade, photoreal sharp. "
    "Lighting: soft natural daylight from camera-front-left with mild rim from camera-back-right. "
    "Color grade: warm neutral, slight contrast lift, no heavy filters. "
    "Composition: subject sharp, background plain, no clutter, no props. "
    "No text overlays, no watermarks, no third-party logos. "
    "Strictly Eastern European / Bulgarian features, no other ethnicities. "
    "Output 4:5 portrait."
)

# --- The 8 character prompts ---------------------------------------------------

CHARS = [
    {
        "code": "m1",
        "label": "M1 / 18-29 male",
        "prompt": (
            "Studio portrait of a Bulgarian Eastern European man, 23 years old. "
            "Lean athletic build, defined but not bulky, visible deltoids and chest, "
            "mid-tan skin. Short dark brown side-parted hair with slight texture, "
            "light stubble, clean jawline, brown eyes. Three-quarter framing, chest up. "
            "Wearing matte-black athletic shorts. CRITICAL WORDMARK SPEC: a small "
            "DR.FIT wordmark embroidered in brand red on the front-facing LEFT thigh "
            "of the shorts, positioned 3 cm below the waistband, centered horizontally "
            "on the thigh panel. The wordmark must read EXACTLY 'DR.FIT' in three "
            "characters with a period separator: capital D, capital R, period, capital "
            "F, capital I, capital T. No spaces, no slashes, no other characters. "
            "Clean geometric sans-serif typeface, all caps, no glyph or icon. "
            "Plus a plain black silicone wristband on the right wrist. "
            "Shirtless. Calm confident neutral expression, direct gaze to camera. "
            "Plain charcoal grey backdrop #2B3138."
        ),
    },
    {
        "code": "m2",
        "label": "M2 / 30-39 male",
        "prompt": (
            "Studio portrait of a Bulgarian Eastern European man, 34 years old. "
            "Recomp athletic build, visible abs, shoulder caps, balanced V-taper, "
            "neutral skin tone. Short dark brown neat fade, full short trimmed beard, "
            "brown eyes. Three-quarter framing, chest up. Wearing matte-black athletic "
            "shorts. CRITICAL WORDMARK SPEC: a small DR.FIT wordmark embroidered in "
            "brand red on the front-facing LEFT thigh of the shorts, positioned 3 cm "
            "below the waistband, centered horizontally on the thigh panel. The "
            "wordmark must read EXACTLY 'DR.FIT' in three characters with a period "
            "separator: capital D, capital R, period, capital F, capital I, capital T. "
            "No spaces, no slashes, no other characters. Clean geometric sans-serif "
            "typeface, all caps, no glyph or icon. Plus a plain black silicone "
            "wristband on the right wrist. Shirtless. Calm confident neutral "
            "expression, slight subtle smile. Plain charcoal grey backdrop #2B3138."
        ),
    },
    {
        "code": "m3",
        "label": "M3 / 40-49 male",
        "prompt": (
            "Studio portrait of a Bulgarian Eastern European man, 45 years old. "
            "Mature athletic build, broader shoulders, lean torso, slight forearm and "
            "chest definition, olive skin tone. Salt-and-pepper short crop, clean shave, "
            "hazel eyes, light grey at the temples. Three-quarter framing, chest up. "
            "Wearing matte-black athletic shorts. CRITICAL WORDMARK SPEC: a small "
            "DR.FIT wordmark embroidered in brand red on the front-facing LEFT thigh "
            "of the shorts, positioned 3 cm below the waistband, centered horizontally "
            "on the thigh panel. The wordmark must read EXACTLY 'DR.FIT' in three "
            "characters with a period separator: capital D, capital R, period, capital "
            "F, capital I, capital T. No spaces, no slashes, no other characters. "
            "Clean geometric sans-serif typeface, all caps, no glyph or icon. "
            "Plus a plain black silicone wristband on the right wrist. Shirtless. "
            "Composed steady expression, direct confident gaze. Plain charcoal grey "
            "backdrop #2B3138."
        ),
    },
    {
        "code": "m4",
        "label": "M4 / 50+ male",
        "prompt": (
            "Studio portrait of a Bulgarian Eastern European man, 56 years old. "
            "Lean wiry fit-for-age build, defined arms and chest, no excess weight, "
            "fair skin. Silver-grey short cropped hair slightly receded at the temples, "
            "trim grey beard, blue-grey eyes. Three-quarter framing, chest up. "
            "Wearing matte-black athletic shorts. CRITICAL WORDMARK SPEC: a small "
            "DR.FIT wordmark embroidered in brand red on the front-facing LEFT thigh "
            "of the shorts, positioned 3 cm below the waistband, centered horizontally "
            "on the thigh panel. The wordmark must read EXACTLY 'DR.FIT' in three "
            "characters with a period separator: capital D, capital R, period, capital "
            "F, capital I, capital T. No spaces, no slashes, no other characters. "
            "Clean geometric sans-serif typeface, all caps, no glyph or icon. "
            "Plus a plain black silicone wristband on the right wrist. Shirtless. "
            "Quietly confident expression, warm direct gaze. Plain charcoal grey "
            "backdrop #2B3138."
        ),
    },
    {
        "code": "f1",
        "label": "F1 / 18-29 female",
        "prompt": (
            "Studio portrait of a Bulgarian Eastern European woman, 24 years old. "
            "Toned athletic build, defined arms, soft core, olive skin. Long dark brown "
            "hair pulled back into a low ponytail, freckles across the bridge of her "
            "nose, brown eyes, natural light makeup. Three-quarter framing, chest up. "
            "Wearing a matte-black sports bra with a small DR.FIT wordmark stamp "
            "center-chest in brand red (clean geometric sans-serif, all caps, no glyph), "
            "plus matte-black athletic leggings (no shorts, leggings only). "
            "Calm confident neutral expression, subtle soft smile. "
            "Plain warm cream backdrop #F8F4EE."
        ),
    },
    {
        "code": "f2",
        "label": "F2 / 30-39 female",
        "prompt": (
            "Studio portrait of a Bulgarian Eastern European woman, 32 years old. "
            "Lean athletic build, defined arms and core, post-12kg-loss aesthetic, "
            "neutral skin tone. Clear unblemished skin, no moles, no facial marks. "
            "Shoulder-length dark brown hair in soft waves, brown eyes, minimal makeup. "
            "Three-quarter framing, chest up. Wearing a matte-black sports bra with a "
            "small DR.FIT wordmark stamp center-chest in brand red (clean geometric "
            "sans-serif, all caps, no glyph), plus matte-black athletic leggings (no "
            "shorts, leggings only). Subtle confident smile, direct warm gaze. "
            "Plain warm cream backdrop #F8F4EE."
        ),
    },
    {
        "code": "f3",
        "label": "F3 / 40-49 female",
        "prompt": (
            "Studio portrait of a Bulgarian Eastern European woman, 46 years old. "
            "Strong athletic build, toned legs and arms, healthy and lived-in midsection "
            "(not chiselled), mid-tan skin. Medium-length dark brown hair with caramel "
            "highlights in a half-up style, hazel eyes, light crow's feet at the corners "
            "(lived-in not aged). Three-quarter framing, chest up. Wearing a matte-black "
            "sports bra with a small DR.FIT wordmark stamp center-chest in brand red "
            "(clean geometric sans-serif, all caps, no glyph), plus matte-black athletic "
            "leggings (no shorts, leggings only). Composed warm expression, knowing "
            "confident smile. Plain warm cream backdrop #F8F4EE."
        ),
    },
    {
        "code": "f4",
        "label": "F4 / 50+ female",
        "prompt": (
            "Studio portrait of a Bulgarian Eastern European woman, 58 years old. "
            "Lean toned build, defined arms, healthy posture, looks 5-10 years younger "
            "than her age, fair skin. Silver-blonde sleek bob, no makeup, grey-blue eyes, "
            "no jewellery. Three-quarter framing, chest up. Wearing a matte-black sports "
            "bra with a small DR.FIT wordmark stamp center-chest in brand red (clean "
            "geometric sans-serif, all caps, no glyph), plus matte-black athletic "
            "leggings (no shorts, leggings only). Quietly confident expression, soft "
            "smile. Plain warm cream backdrop #F8F4EE."
        ),
    },
]

# --- kie.ai API helpers --------------------------------------------------------

CREATE_URL = "https://api.kie.ai/api/v1/jobs/createTask"
INFO_URL = "https://api.kie.ai/api/v1/jobs/recordInfo"

def http_post_json(url: str, headers: dict, payload: dict, timeout: float = 60.0) -> dict:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))

def http_get_json(url: str, headers: dict, timeout: float = 30.0) -> dict:
    req = urllib.request.Request(url, headers=headers, method="GET")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))

def http_download(url: str, out_path: Path, timeout: float = 120.0) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "drfit-portrait-fetcher/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        out_path.write_bytes(resp.read())

def submit(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {KIE_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "nano-banana-pro",
        "input": {
            "prompt": f"{prompt} {STYLE}",
            "image_input": [],
            "aspect_ratio": "4:5",
            "resolution": "2K",
            "output_format": "png",
        },
    }
    result = http_post_json(CREATE_URL, headers, payload)
    if result.get("code") != 200 or not result.get("data", {}).get("taskId"):
        raise RuntimeError(f"createTask failed: {json.dumps(result)[:300]}")
    return result["data"]["taskId"]

def poll(task_id: str, timeout_s: float = 300.0, interval_s: float = 4.0) -> str:
    headers = {"Authorization": f"Bearer {KIE_API_KEY}"}
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        time.sleep(interval_s)
        result = http_get_json(f"{INFO_URL}?taskId={urllib.parse.quote(task_id)}", headers)
        data = result.get("data", {})
        state = data.get("state", "unknown")
        if state == "success":
            try:
                rj = json.loads(data.get("resultJson", "{}"))
                urls = rj.get("resultUrls", [])
                if urls:
                    return urls[0]
            except json.JSONDecodeError:
                pass
            raise RuntimeError(f"success but no resultUrls: {json.dumps(data)[:300]}")
        if state in ("fail", "error", "failed"):
            raise RuntimeError(f"task {task_id} failed: {json.dumps(data)[:300]}")
        # else: keep polling
    raise TimeoutError(f"task {task_id} did not finish in {timeout_s}s")

# --- Main loop -----------------------------------------------------------------

def main() -> int:
    only = set(sys.argv[1:])  # optional codes to limit
    failed: list[str] = []
    for char in CHARS:
        if only and char["code"] not in only:
            continue
        out_path = OUT_DIR / f"{char['code']}.png"
        if out_path.exists():
            print(f"[skip] {char['label']}: {out_path.name} already exists")
            continue
        print(f"[gen ] {char['label']}: submitting...")
        try:
            task_id = submit(char["prompt"])
            print(f"       taskId={task_id}, polling...")
            url = poll(task_id)
            print(f"       got: {url[:80]}")
            http_download(url, out_path)
            size_kb = out_path.stat().st_size // 1024
            print(f"[ok  ] {char['label']}: {out_path} ({size_kb} KB)")
        except Exception as e:
            print(f"[fail] {char['label']}: {e}")
            failed.append(char["code"])

    if failed:
        print(f"\nfailed: {failed}")
        return 1
    print("\nall done.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
