#!/usr/bin/env python3
"""
Generate the 3 in-between (building) screen visuals for the quiz funnel.
Top-down editorial flat-lays, no people. Output:
public/images/photo/interstitials/building-{1,2,3}.png
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
OUT = HOME / "drfit-quiz/public/images/photo/interstitials"


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

JOBS = [
    {
        "out": OUT / "building-1.png",
        "prompt": (
            "Top-down editorial fitness magazine flat-lay on a warm cream linen "
            "surface: a deep ceramic bowl of cooked white rice topped with sliced "
            "roasted sweet potato, a small bowl of golden oatmeal sprinkled with "
            "cinnamon, two ripe bananas, four medjool dates, a small wooden spoon. "
            "Soft natural daylight from upper left. Painterly food photography, "
            "premium magazine quality, no text, no logos. Wide horizontal framing, "
            "16:9 aspect, 2K resolution."
        ),
    },
    {
        "out": OUT / "building-2.png",
        "prompt": (
            "Top-down editorial fitness magazine flat-lay on a warm cream linen "
            "surface: a matte-black kettlebell on the left, an open glass "
            "meal-prep container in the center with grilled chicken breast, brown "
            "rice, steamed broccoli, and roasted carrots, a small analog "
            "wristwatch on the right, a fresh apple. Soft natural daylight. "
            "Painterly editorial food and equipment photography, premium magazine "
            "quality, no text, no logos. Wide horizontal framing, 16:9 aspect, "
            "2K resolution."
        ),
    },
    {
        "out": OUT / "building-3.png",
        "prompt": (
            "Top-down editorial fitness magazine split-frame flat-lay: LEFT half "
            "on a darker matte-black surface — three greasy pizza slices, an open "
            "bag of potato chips, a glass of cola with ice; RIGHT half on a warm "
            "cream linen surface — a balanced healthy plate with grilled chicken "
            "breast, fluffy quinoa, steamed green beans, sliced avocado, and a "
            "tall glass of water with a slice of lemon. Soft natural daylight, "
            "painterly food photography, premium magazine quality, clear "
            "before/after split, no text, no logos. Wide horizontal framing, "
            "16:9 aspect, 2K resolution."
        ),
    },
]


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


def submit(prompt):
    h = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
    p = {
        "model": "nano-banana-pro",
        "input": {
            "prompt": prompt,
            "aspect_ratio": "16:9",
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
        tid = submit(j["prompt"])
        url = poll(tid)
        http_dl(url, out)
        sz = out.stat().st_size // 1024
        return (out.name, f"ok ({sz}KB)", True)
    except Exception as e:
        return (out.name, f"FAIL: {e}", False)


if __name__ == "__main__":
    print(f"Total: {len(JOBS)}")
    failures = []
    with ThreadPoolExecutor(max_workers=3) as ex:
        for f in as_completed([ex.submit(process, j) for j in JOBS]):
            n, m, ok = f.result()
            print(f"[{'ok' if ok and 'skip' not in m else 'skip' if 'skip' in m else 'FAIL'}] {n}: {m}")
            if not ok:
                failures.append(n)
    print(f"\n{len(JOBS) - len(failures)}/{len(JOBS)} succeeded.")
    sys.exit(1 if failures else 0)
