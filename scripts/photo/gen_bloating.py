#!/usr/bin/env python3
"""Generate 4 bloating-state illustrations for step 18."""

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

LEVELS = [
    ("often",     "Severely bloated stomach. The man is touching his bloated stomach with both hands, visibly distended midsection, slight wince of discomfort"),
    ("sometimes", "Moderately bloated stomach, visible bulge, a hand resting gently on the stomach, mildly uncomfortable expression"),
    ("rarely",    "Slightly bloated stomach, very subtle distention, neutral relaxed expression"),
    ("never",     "Flat lean stomach, no bloating at all, confident relaxed posture, hand at side"),
]

JOBS = []
for code, desc in LEVELS:
    JOBS.append({
        "out": OUT / f"{code}.png",
        "prompt": (
            f"Studio half-body portrait of a Bulgarian Eastern European man, late 20s, "
            f"shot from chest to hips, shirtless, neutral plain grey backdrop. {desc}. "
            f"Photoreal documentary fitness magazine grade. Soft natural daylight, no "
            f"text, no logos, no DR.FIT branding visible. 1:1 square aspect."
        ),
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

def submit(prompt):
    h = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
    p = {"model": "nano-banana-pro", "input": {"prompt": prompt, "image_input": [], "aspect_ratio": "1:1", "resolution": "2K", "output_format": "png"}}
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
    if j["out"].exists():
        return (j["out"].name, "skip", True)
    try:
        j["out"].parent.mkdir(parents=True, exist_ok=True)
        tid = submit(j["prompt"])
        url = poll(tid)
        http_dl(url, j["out"])
        sz = j["out"].stat().st_size // 1024
        return (j["out"].name, f"ok ({sz}KB)", True)
    except Exception as e:
        return (j["out"].name, f"FAIL: {e}", False)

if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=4) as ex:
        for f in as_completed([ex.submit(process, j) for j in JOBS]):
            n, m, ok = f.result()
            print(f"[{'ok' if ok else 'FAIL'}] {n}: {m}")
