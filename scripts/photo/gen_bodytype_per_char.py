#!/usr/bin/env python3
"""
Generate per-character body-type photos. Same face / identity as the base
portrait, different body composition (overweight / skinny-fat / skinny).

Output: public/images/photo/body-type/{character}-{type}.png
- 4 male × 3 types = 12 photos
- 4 female × 2 types = 8 photos
- 20 total
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

# Per-type prompts. We KEEP the face from the reference (same person, same hair),
# but adjust the body composition + neutral everyday wardrobe (no DR.FIT branding,
# this is the 'current you' state, not the post-transformation cast).

TYPE_PROMPTS_M = {
    "overweight": (
        "Same person, same face, same hair as the reference image. Now visibly "
        "overweight build: rounder face from added body fat, fuller cheeks, "
        "softer jawline, broader torso with significant midsection roundness, "
        "hips and thighs heavier. Wearing a plain dark grey casual T-shirt and "
        "loose sweatpants. Three-quarter body framing chest to thighs. Friendly "
        "approachable expression, hands at sides."
    ),
    "skinny-fat": (
        "Same person, same face, same hair as the reference image. Skinny-fat "
        "body composition: face still recognizable, slim shoulders and limbs, "
        "but a soft midsection with mild belly bulge, no defined muscle. "
        "Wearing a plain dark grey casual T-shirt (slightly fitted) and "
        "sweatpants. Three-quarter body framing chest to thighs. Neutral "
        "expression, hands at sides."
    ),
    "skinny": (
        "Same person, same face, same hair as the reference image. Slim slight "
        "build: narrow shoulders, lean limbs, no muscle definition, flat or "
        "slightly concave torso. Wearing a plain dark grey casual T-shirt and "
        "sweatpants that hang slightly loose. Three-quarter body framing chest "
        "to thighs. Neutral expression, hands at sides."
    ),
}

TYPE_PROMPTS_F = {
    "overweight": (
        "Same person, same face, same hair as the reference image. Now visibly "
        "overweight: rounder face from added body fat, fuller cheeks and "
        "shoulders, fuller silhouette throughout the torso and hips, heavier "
        "thighs. Wearing a plain dark grey casual top (loose fit) and casual "
        "leggings. Three-quarter body framing chest to thighs. Friendly "
        "approachable expression, hands at sides."
    ),
    "skinny-fat": (
        "Same person, same face, same hair as the reference image. Skinny-fat "
        "body composition: face still recognizable, slim arms but soft "
        "midsection with mild belly softness, less-defined waist. Wearing a "
        "plain dark grey casual top (slightly fitted) and casual leggings. "
        "Three-quarter body framing chest to thighs. Neutral expression, "
        "hands at sides."
    ),
}

STYLE_M = (
    "Photoreal documentary editorial fitness magazine style, plain warm grey "
    "neutral backdrop #3a3f44, soft even daylight, no logos visible on the "
    "clothing, no text overlays, no DR.FIT branding. 4:5 portrait, 2K resolution."
)
STYLE_F = (
    "Photoreal documentary editorial fitness magazine style, plain warm cream "
    "neutral backdrop #ECE5DA, soft even daylight, no logos visible on the "
    "clothing, no text overlays, no DR.FIT branding. 4:5 portrait, 2K resolution."
)


JOBS = []
for code in ("m1", "m2", "m3", "m4"):
    for typ, prompt in TYPE_PROMPTS_M.items():
        JOBS.append({
            "out": OUT / f"{code}-{typ}.png",
            "ref": f"{RAW_BASE}/{code}.png",
            "prompt": f"{prompt} {STYLE_M}",
            "aspect": "4:5",
        })

for code in ("f1", "f2", "f3", "f4"):
    for typ, prompt in TYPE_PROMPTS_F.items():
        JOBS.append({
            "out": OUT / f"{code}-{typ}.png",
            "ref": f"{RAW_BASE}/{code}.png",
            "prompt": f"{prompt} {STYLE_F}",
            "aspect": "4:5",
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
