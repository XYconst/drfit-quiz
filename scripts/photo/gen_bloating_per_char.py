#!/usr/bin/env python3
"""32 per-character bloating photos. Each character × 4 bloating levels."""

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
OUT = HOME / "drfit-quiz/public/images/photo/bloating"
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
    print("no key", file=sys.stderr); sys.exit(1)

CREATE = "https://api.kie.ai/api/v1/jobs/createTask"
INFO = "https://api.kie.ai/api/v1/jobs/recordInfo"

# Bloating levels — clinical / medical framing, midsection focus
LEVELS_M = {
    "often": (
        "Same person, same face, same hair as the reference image. "
        "The midsection is significantly bloated and distended after a heavy meal: "
        "rounded protruding abdomen, visible stomach swelling, hands resting gently "
        "on the bloated stomach. Slightly uncomfortable expression. Same shorts, "
        "shirtless. Three-quarter framing chest to thighs."
    ),
    "sometimes": (
        "Same person, same face, same hair as the reference image. "
        "The midsection has moderate bloating: visible stomach distention, mild "
        "rounded bulge, one hand resting on the stomach. Neutral expression. "
        "Same shorts, shirtless. Three-quarter framing chest to thighs."
    ),
    "rarely": (
        "Same person, same face, same hair as the reference image. "
        "The midsection has very subtle bloating: barely visible distention, "
        "slightly fuller stomach. Neutral expression. Same shorts, shirtless. "
        "Three-quarter framing chest to thighs."
    ),
    "never": (
        "Same person, same face, same hair as the reference image. "
        "The midsection is completely flat and lean, no bloating whatsoever, "
        "abs visible. Confident relaxed posture, hands at sides. Same shorts, "
        "shirtless. Three-quarter framing chest to thighs."
    ),
}

LEVELS_F = {
    "often": (
        "Same person, same face, same hair as the reference image. "
        "The midsection is significantly bloated and distended after a heavy meal: "
        "rounded protruding abdomen, hands resting gently on the bloated stomach. "
        "Slightly uncomfortable expression. Same matte-black sports bra and "
        "leggings. Three-quarter framing chest to thighs."
    ),
    "sometimes": (
        "Same person, same face, same hair as the reference image. "
        "The midsection has moderate bloating: visible stomach distention, mild "
        "rounded bulge below the sports bra, one hand resting on the stomach. "
        "Neutral expression. Same matte-black sports bra and leggings. "
        "Three-quarter framing chest to thighs."
    ),
    "rarely": (
        "Same person, same face, same hair as the reference image. "
        "The midsection has very subtle bloating: barely visible distention, "
        "slightly fuller stomach. Neutral expression. Same matte-black sports "
        "bra and leggings. Three-quarter framing chest to thighs."
    ),
    "never": (
        "Same person, same face, same hair as the reference image. "
        "The midsection is completely flat and lean, no bloating whatsoever, "
        "toned abs visible below the sports bra. Confident relaxed posture, "
        "hands at sides. Same matte-black sports bra and leggings. "
        "Three-quarter framing chest to thighs."
    ),
}

STYLE_M = (
    "Photoreal documentary editorial fitness magazine style, plain charcoal grey "
    "backdrop #2B3138, soft natural daylight, no text, no logos other than DR.FIT. "
    "1:1 square aspect, 2K resolution."
)
STYLE_F = (
    "Photoreal documentary editorial fitness magazine style, plain warm cream "
    "backdrop #F8F4EE, soft natural daylight, no text, no logos other than DR.FIT. "
    "1:1 square aspect, 2K resolution."
)


JOBS = []
for code in ("m1", "m2", "m3", "m4"):
    for level, prompt in LEVELS_M.items():
        JOBS.append({
            "out": OUT / f"{code}-{level}.png",
            "ref": f"{RAW_BASE}/{code}.png",
            "prompt": f"{prompt} {STYLE_M}",
        })
for code in ("f1", "f2", "f3", "f4"):
    for level, prompt in LEVELS_F.items():
        JOBS.append({
            "out": OUT / f"{code}-{level}.png",
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
            "aspect_ratio": "1:1",
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
