#!/usr/bin/env python3
"""
Generate the high-BMI "before" set: same identity as the base portrait,
visibly overweight, shirtless (M) / sports-bra (F) so the body composition
actually reads.

Output: public/images/photo/body-type/{character}-overweight-shirtless.png
- 4 male + 4 female = 8 photos
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
OUT = HOME / "drfit-quiz/public/images/photo/body-type"
RAW_BASE = (
    "https://raw.githubusercontent.com/XYconst/drfit-quiz/feat/cards-redesign/"
    "public/images/photo/ref"
)


def load_env_value(path, key):
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


KEY = load_env_value(ENV_PATH, "KIE_API_KEY")
if not KEY:
    print("no key", file=sys.stderr)
    sys.exit(1)

CREATE = "https://api.kie.ai/api/v1/jobs/createTask"
INFO = "https://api.kie.ai/api/v1/jobs/recordInfo"

PROMPT_M = (
    "Same person, same face, same hair as the reference image. Visibly "
    "overweight build with a soft, rounded midsection and a pronounced belly, "
    "fuller chest with mild moobs, broader hips, fuller arms — clearly above "
    "a healthy BMI. SHIRTLESS, bare torso fully visible. Wearing only plain "
    "dark grey athletic shorts. Three-quarter body framing chest to mid-thigh, "
    "front view, both arms relaxed at sides. Friendly, confident, neutral "
    "expression — not embarrassed, not posing. No towel, no covering."
)

PROMPT_F = (
    "Same person, same face, same hair as the reference image. Visibly "
    "overweight build with fuller midsection, soft belly bulge, fuller "
    "shoulders, hips and thighs — clearly above a healthy BMI. Wearing a "
    "plain dark grey athletic sports bra (mid-coverage, like a fitness top) "
    "and matching dark grey high-waist leggings — but with the natural soft "
    "midsection clearly visible between the bra and the waistband. "
    "Three-quarter body framing chest to mid-thigh, front view, both arms "
    "relaxed at sides. Friendly, confident, neutral expression."
)

STYLE_M = (
    "Photoreal documentary editorial fitness magazine style, plain warm grey "
    "neutral backdrop #3a3f44, soft even daylight, no text overlays, no "
    "DR.FIT branding, no logos visible. 4:5 portrait, 2K resolution."
)
STYLE_F = (
    "Photoreal documentary editorial fitness magazine style, plain warm cream "
    "neutral backdrop #ECE5DA, soft even daylight, no text overlays, no "
    "DR.FIT branding, no logos visible. 4:5 portrait, 2K resolution."
)

JOBS = []
for code in ("m1", "m2", "m3", "m4"):
    JOBS.append({
        "out": OUT / f"{code}-overweight-shirtless.png",
        "ref": f"{RAW_BASE}/{code}.png",
        "prompt": f"{PROMPT_M} {STYLE_M}",
    })
for code in ("f1", "f2", "f3", "f4"):
    JOBS.append({
        "out": OUT / f"{code}-overweight-shirtless.png",
        "ref": f"{RAW_BASE}/{code}.png",
        "prompt": f"{PROMPT_F} {STYLE_F}",
    })


def http_post(url, h, p, timeout=60):
    body = json.dumps(p).encode()
    req = urllib.request.Request(url, data=body, headers=h, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def http_get(url, h, timeout=30):
    req = urllib.request.Request(url, headers=h, method="GET")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def http_dl(url, p, timeout=120):
    req = urllib.request.Request(url, headers={"User-Agent": "drfit/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        p.write_bytes(r.read())


def submit(prompt, ref):
    h = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
    p = {
        "model": "nano-banana-pro",
        "input": {
            "prompt": prompt,
            "image_input": [ref],
            "aspect_ratio": "4:5",
            "resolution": "2K",
            "output_format": "png",
        },
    }
    r = http_post(CREATE, h, p)
    if r.get("code") != 200 or not r.get("data", {}).get("taskId"):
        raise RuntimeError(json.dumps(r)[:200])
    return r["data"]["taskId"]


def poll(tid, timeout_s=300):
    h = {"Authorization": f"Bearer {KEY}"}
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        time.sleep(4)
        try:
            r = http_get(f"{INFO}?taskId={urllib.parse.quote(tid)}", h)
        except Exception:
            continue
        d = r.get("data", {})
        s = d.get("state", "?")
        if s == "success":
            try:
                rj = json.loads(d.get("resultJson", "{}"))
                urls = rj.get("resultUrls", [])
                if urls:
                    return urls[0]
            except Exception:
                pass
            raise RuntimeError("no urls")
        if s in ("fail", "error", "failed"):
            raise RuntimeError(f"{s}: {json.dumps(d)[:200]}")
    raise TimeoutError(tid)


def process(j):
    out = j["out"]
    if out.exists():
        return (out.name, "skip", True)
    out.parent.mkdir(parents=True, exist_ok=True)
    try:
        tid = submit(j["prompt"], j["ref"])
        url = poll(tid)
        http_dl(url, out)
        sz = out.stat().st_size // 1024
        return (out.name, f"ok ({sz}KB)", True)
    except Exception as e:
        return (out.name, f"FAIL: {e}", False)


if __name__ == "__main__":
    print(f"Total: {len(JOBS)}")
    failures = []
    with ThreadPoolExecutor(max_workers=6) as ex:
        for f in as_completed([ex.submit(process, j) for j in JOBS]):
            n, m, ok = f.result()
            print(f"[{'ok' if ok and 'skip' not in m else 'skip' if 'skip' in m else 'FAIL'}] {n}: {m}")
            if not ok:
                failures.append(n)
    print(f"\n{len(JOBS) - len(failures)}/{len(JOBS)} succeeded.")
    sys.exit(1 if failures else 0)
