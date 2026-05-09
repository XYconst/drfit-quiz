#!/usr/bin/env python3
"""Regenerate building-3 visual: a personal trainer with a client."""
import json, os, sys, time, urllib.parse, urllib.request
from pathlib import Path

HOME = Path.home()
ENV_PATH = HOME / "Desktop/23/ai-team/.env"
OUT = HOME / "drfit-quiz/public/images/photo/interstitials/building-3.png"

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
    sys.exit("no key")

CREATE = "https://api.kie.ai/api/v1/jobs/createTask"
INFO = "https://api.kie.ai/api/v1/jobs/recordInfo"

PROMPT = (
    "Photoreal documentary editorial fitness magazine: a male personal trainer "
    "in his 30s in a fitted dark grey training T-shirt, beard, focused but warm "
    "expression, coaching a client (Eastern European woman in her 30s in a "
    "matte-black sports bra and leggings) through a slow controlled bodyweight "
    "squat, his hand lightly steadying her shoulder, both mid-rep. Bright open "
    "studio space with warm cream walls, natural daylight from a tall window, "
    "no gym equipment visible, clean and aspirational, painterly. No text, no "
    "logos. Wide horizontal framing, 16:9 aspect, 2K resolution."
)

def http_post(url, h, p, t=60):
    body = json.dumps(p).encode()
    req = urllib.request.Request(url, data=body, headers=h, method="POST")
    with urllib.request.urlopen(req, timeout=t) as r:
        return json.loads(r.read().decode())

def http_get(url, h, t=30):
    req = urllib.request.Request(url, headers=h, method="GET")
    with urllib.request.urlopen(req, timeout=t) as r:
        return json.loads(r.read().decode())

def http_dl(url, p, t=120):
    req = urllib.request.Request(url, headers={"User-Agent": "drfit/1.0"})
    with urllib.request.urlopen(req, timeout=t) as r:
        p.write_bytes(r.read())

h = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
r = http_post(CREATE, h, {
    "model": "nano-banana-pro",
    "input": {"prompt": PROMPT, "aspect_ratio": "16:9", "resolution": "2K", "output_format": "png"},
})
if r.get("code") != 200 or not r.get("data", {}).get("taskId"):
    sys.exit(json.dumps(r)[:200])
tid = r["data"]["taskId"]
print(f"task: {tid}")

deadline = time.time() + 300
while time.time() < deadline:
    time.sleep(4)
    try:
        info = http_get(f"{INFO}?taskId={urllib.parse.quote(tid)}", {"Authorization": f"Bearer {KEY}"})
    except Exception:
        continue
    d = info.get("data", {})
    s = d.get("state", "?")
    if s == "success":
        rj = json.loads(d.get("resultJson", "{}"))
        urls = rj.get("resultUrls", [])
        if not urls:
            sys.exit("no urls")
        OUT.parent.mkdir(parents=True, exist_ok=True)
        http_dl(urls[0], OUT)
        print(f"ok: {OUT.stat().st_size//1024}KB")
        sys.exit(0)
    if s in ("fail", "error", "failed"):
        sys.exit(f"{s}: {json.dumps(d)[:200]}")
sys.exit("timeout")
