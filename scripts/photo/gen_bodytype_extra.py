#!/usr/bin/env python3
"""
Generate the two new body-type variants per character: 'underweight' and
'perfect'. Pairs cleanly with gen_bodytype_per_char.py (overweight / skinny-fat
/ skinny). Same wardrobe (plain dark grey casual T-shirt or top + sweatpants
or leggings, no DR.FIT branding — this is the 'current you' state).
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


TYPE_PROMPTS_M = {
    "underweight": (
        "Same person, same face, same hair as the reference image. Visibly "
        "underweight build: thin gaunt face, prominent collarbones, narrow "
        "shoulders, very lean limbs, slightly hollow cheeks, no muscle "
        "definition, flat or slightly concave torso, clothes hanging loose. "
        "Wearing a plain dark grey casual T-shirt that hangs loose and loose "
        "sweatpants. Three-quarter body framing chest to thighs. Neutral "
        "expression, hands at sides."
    ),
    "perfect": (
        "Same person, same face, same hair as the reference image. In peak "
        "athletic shape: lean muscular V-taper torso, broad defined shoulders, "
        "visible six-pack abs, low body fat around 10-12 percent, defined arms, "
        "confident posture. Wearing a plain dark grey fitted T-shirt and "
        "sweatpants. Three-quarter body framing chest to thighs. Confident "
        "relaxed expression, hands at sides."
    ),
}

TYPE_PROMPTS_F = {
    "underweight": (
        "Same person, same face, same hair as the reference image. Visibly "
        "underweight: thin gaunt face, prominent collarbones, very narrow "
        "shoulders, very lean limbs, slightly hollow cheeks, no muscle, flat "
        "concave abdomen, clothes hanging loose on the frame. Wearing a plain "
        "dark grey casual top (loose) and casual leggings. Three-quarter body "
        "framing chest to thighs. Neutral expression, hands at sides."
    ),
    "perfect": (
        "Same person, same face, same hair as the reference image. In peak "
        "athletic shape: toned defined arms and shoulders, visible toned "
        "abdomen with subtle abs, lean defined legs, low body fat around 18-20 "
        "percent, hourglass shape, confident posture. Wearing a plain dark "
        "grey fitted casual top (slightly cropped or fitted to show toned "
        "midsection) and matching leggings. Three-quarter body framing chest "
        "to thighs. Confident relaxed expression, hands at sides."
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
        })

for code in ("f1", "f2", "f3", "f4"):
    for typ, prompt in TYPE_PROMPTS_F.items():
        JOBS.append({
            "out": OUT / f"{code}-{typ}.png",
            "ref": f"{RAW_BASE}/{code}.png",
            "prompt": f"{prompt} {STYLE_F}",
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
