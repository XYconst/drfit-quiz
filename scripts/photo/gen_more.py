#!/usr/bin/env python3
"""
Generate the additional photo assets needed after user feedback round 2.

- 2 gender silhouettes for step 1 (Мъж / Жена hero icons)
- 5 body-type photos for step 5 (overweight m, skinny-fat m, skinny m,
  overweight f, skinny-fat f) — actual people, no DR.FIT branding so the
  user feels they describe their CURRENT (pre-transformation) state
- 8 food-holding poses for step 15 (mealTiming) — one per character

All via kie.ai Nano Banana Pro. Output paths match the slot map.
"""

import json
import os
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

HOME = Path.home()
ENV_PATH = HOME / "Desktop/23/ai-team/.env"
OUT_ROOT = HOME / "drfit-quiz/public/images/photo"
RAW_BASE = (
    "https://raw.githubusercontent.com/XYconst/drfit-quiz/feat/cards-redesign/"
    "public/images/photo/ref"
)


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
    print("ERROR: KIE_API_KEY not found", file=sys.stderr)
    sys.exit(1)

CREATE_URL = "https://api.kie.ai/api/v1/jobs/createTask"
INFO_URL = "https://api.kie.ai/api/v1/jobs/recordInfo"

# --- Job definitions -----------------------------------------------------------
JOBS = []

# 1. Gender silhouettes for step 1
JOBS.append({
    "out": OUT_ROOT / "gender" / "male.png",
    "ref": None,
    "aspect": "4:5",
    "prompt": (
        "Editorial fitness magazine portrait of a Bulgarian Eastern European man, "
        "30 years old, fit athletic build, wearing matte-black athletic shorts and "
        "a fitted matte-black T-shirt. Standing relaxed, hands at sides, three-quarter "
        "body framing chest to thighs. Plain charcoal grey backdrop #2B3138. Calm "
        "confident expression. Soft natural daylight. Photoreal, sharp, no text, no "
        "logos. 4:5 portrait."
    ),
})
JOBS.append({
    "out": OUT_ROOT / "gender" / "female.png",
    "ref": None,
    "aspect": "4:5",
    "prompt": (
        "Editorial fitness magazine portrait of a Bulgarian Eastern European woman, "
        "28 years old, toned athletic build, wearing matte-black sports top and "
        "matte-black athletic leggings. Standing relaxed, hands at sides, three-quarter "
        "body framing chest to thighs. Plain warm cream backdrop #F8F4EE. Calm confident "
        "expression. Soft natural daylight. Photoreal, sharp, no text, no logos. 4:5."
    ),
})

# 2. Body-type photos for step 5. These are "current you" reference photos —
#    real-looking people in everyday clothing, NOT the polished cast.
BODY_TYPES_M = [
    ("overweight", "Bulgarian Eastern European man, late 30s, visibly overweight build, soft midsection, broader frame, wearing a plain dark grey T-shirt and sweatpants. Friendly approachable expression."),
    ("skinny-fat", "Bulgarian Eastern European man, early 30s, slim limbs but soft midsection (skinny-fat), wearing a plain dark grey T-shirt and sweatpants. Neutral expression."),
    ("skinny", "Bulgarian Eastern European man, mid-20s, slim slight build, narrow shoulders, wearing a plain dark grey T-shirt and sweatpants. Neutral expression."),
]
BODY_TYPES_F = [
    ("overweight", "Bulgarian Eastern European woman, mid-30s, visibly overweight build, fuller silhouette, wearing a plain dark grey casual top and leggings. Friendly approachable expression."),
    ("skinny-fat", "Bulgarian Eastern European woman, late 20s, slim build but soft midsection, wearing a plain dark grey casual top and leggings. Neutral expression."),
]

for code, desc in BODY_TYPES_M:
    JOBS.append({
        "out": OUT_ROOT / "body-type" / f"m-{code}.png",
        "ref": None,
        "aspect": "4:5",
        "prompt": (
            f"Studio portrait of a {desc} Three-quarter body framing, chest to "
            "thighs visible. Plain neutral grey backdrop, even lighting. "
            "Photoreal, editorial documentary style, no DR.FIT logos, no text. 4:5 portrait."
        ),
    })
for code, desc in BODY_TYPES_F:
    JOBS.append({
        "out": OUT_ROOT / "body-type" / f"f-{code}.png",
        "ref": None,
        "aspect": "4:5",
        "prompt": (
            f"Studio portrait of a {desc} Three-quarter body framing, chest to "
            "thighs visible. Plain neutral cream backdrop, even lighting. "
            "Photoreal, editorial documentary style, no DR.FIT logos, no text. 4:5 portrait."
        ),
    })

# 3. Food-holding poses for step 15 (mealTiming). One per character, character
#    reference image is the corresponding base portrait.
def chars():
    return ["m1", "m2", "m3", "m4", "f1", "f2", "f3", "f4"]

def style_for(code):
    if code.startswith("m"):
        return "Plain charcoal grey backdrop #2B3138."
    return "Plain warm cream backdrop #F8F4EE."

def wardrobe_for(code):
    if code.startswith("m"):
        return ("Wearing matte-black athletic shorts with a small DR.FIT wordmark "
                "embroidered in brand red on the front-facing left thigh hem, plus "
                "black silicone wristband on right wrist. Shirtless.")
    return ("Wearing a matte-black sports bra with a small DR.FIT wordmark stamp "
            "center-chest in brand red, plus matte-black athletic leggings.")

for code in chars():
    JOBS.append({
        "out": OUT_ROOT / "split-food" / f"{code}.png",
        "ref": f"{RAW_BASE}/{code}.png",
        "aspect": "9:16",
        "prompt": (
            f"Same person, same face, same hair as the reference image. "
            f"{wardrobe_for(code)} Holding a small white ceramic plate at chest "
            f"level with a piece of healthy food on it (e.g., grilled chicken with "
            f"vegetables, or a bowl of grain salad). Three-quarter body framing. "
            f"Calm focused expression looking down at the plate. {style_for(code)} "
            f"Photographic editorial fitness magazine grade, photoreal sharp. "
            f"Soft natural daylight. No text, no logos other than DR.FIT. 9:16."
        ),
    })

# --- HTTP helpers --------------------------------------------------------------

def http_post(url, headers, payload, timeout=60):
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))

def http_get(url, headers, timeout=30):
    req = urllib.request.Request(url, headers=headers, method="GET")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))

def http_download(url, out_path, timeout=120):
    req = urllib.request.Request(url, headers={"User-Agent": "drfit-photo/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        out_path.write_bytes(resp.read())

def submit(prompt, ref_url=None, aspect="4:5"):
    headers = {
        "Authorization": f"Bearer {KIE_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "nano-banana-pro",
        "input": {
            "prompt": prompt,
            "image_input": [ref_url] if ref_url else [],
            "aspect_ratio": aspect,
            "resolution": "2K",
            "output_format": "png",
        },
    }
    result = http_post(CREATE_URL, headers, payload)
    if result.get("code") != 200 or not result.get("data", {}).get("taskId"):
        raise RuntimeError(f"createTask failed: {json.dumps(result)[:300]}")
    return result["data"]["taskId"]

def poll(task_id, timeout_s=300, interval_s=4):
    headers = {"Authorization": f"Bearer {KIE_API_KEY}"}
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        time.sleep(interval_s)
        try:
            result = http_get(f"{INFO_URL}?taskId={urllib.parse.quote(task_id)}", headers)
        except Exception:
            continue
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
            raise RuntimeError("success but no resultUrls")
        if state in ("fail", "error", "failed"):
            raise RuntimeError(f"task failed: {json.dumps(data)[:200]}")
    raise TimeoutError(f"timeout {task_id}")

def process(job):
    out = job["out"]
    if out.exists():
        return (str(out.relative_to(OUT_ROOT)), "skip", True)
    out.parent.mkdir(parents=True, exist_ok=True)
    try:
        tid = submit(job["prompt"], job.get("ref"), job["aspect"])
        url = poll(tid)
        http_download(url, out)
        sz = out.stat().st_size // 1024
        return (str(out.relative_to(OUT_ROOT)), f"ok ({sz}KB)", True)
    except Exception as e:
        return (str(out.relative_to(OUT_ROOT)), f"FAIL: {e}", False)

if __name__ == "__main__":
    print(f"Total jobs: {len(JOBS)}")
    failures = []
    with ThreadPoolExecutor(max_workers=6) as ex:
        futures = [ex.submit(process, j) for j in JOBS]
        for f in as_completed(futures):
            label, msg, ok = f.result()
            print(f"[{'ok  ' if ok and 'skip' not in msg else 'skip' if 'skip' in msg else 'FAIL'}] {label}: {msg}")
            if not ok:
                failures.append((label, msg))
    print(f"\n{len(JOBS) - len(failures)}/{len(JOBS)} succeeded.")
    sys.exit(1 if failures else 0)
