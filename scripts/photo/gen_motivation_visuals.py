#!/usr/bin/env python3
"""
Generate 12 motivation-themed plan visuals (6 motivations x 2 genders).
Output: public/images/photo/motivations/{slot}-{gender}.png
"""
import json, os, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

HOME = Path.home()
ENV_PATH = HOME / "Desktop/23/ai-team/.env"
OUT = HOME / "drfit-quiz/public/images/photo/motivations"


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

STYLE = (
    "Photoreal documentary editorial lifestyle magazine photography, "
    "soft warm natural light, painterly, no text, no logos, premium quality. "
    "Wide horizontal framing, 16:9 aspect, 2K resolution."
)

# slot -> { male, female } prompts
PROMPTS = {
    "health": {
        "male": (
            "Eastern European fit man in his late 30s, hiking on a forested "
            "mountain trail in warm late-afternoon golden hour, comfortable "
            "activewear, calm vibrant smile, looking towards the horizon, "
            "vital and energised."
        ),
        "female": (
            "Eastern European fit woman in her late 30s, hiking on a forested "
            "mountain trail in warm late-afternoon golden hour, comfortable "
            "activewear, calm vibrant smile, looking towards the horizon, "
            "vital and energised."
        ),
    },
    "partner": {
        "male": (
            "Eastern European couple in their 30s, the man tenderly hugging "
            "his partner from behind on a quiet sun-drenched balcony with "
            "morning coffee, candid intimate moment, soft natural light."
        ),
        "female": (
            "Eastern European couple in their 30s, the woman tenderly hugging "
            "her partner from behind on a quiet sun-drenched balcony with "
            "morning coffee, candid intimate moment, soft natural light."
        ),
    },
    "photos": {
        "male": (
            "Editorial portrait of an Eastern European man in his 30s in a "
            "well-tailored navy suit, confident relaxed posture, soft warm "
            "studio lighting on a plain warm cream backdrop, looking "
            "confidently at the camera, premium lifestyle magazine."
        ),
        "female": (
            "Editorial portrait of an Eastern European woman in her 30s in an "
            "elegant matte-black evening dress, confident relaxed posture, "
            "soft warm studio lighting on a plain warm cream backdrop, "
            "looking confidently at the camera, premium lifestyle magazine."
        ),
    },
    "kids": {
        "male": (
            "Eastern European fit father in his late 30s, energetic and "
            "playful, lifting his small son in the air in a sunlit park, "
            "candid joyful moment, both laughing, lifestyle photography."
        ),
        "female": (
            "Eastern European fit mother in her late 30s, energetic and "
            "playful, lifting her small daughter in the air in a sunlit park, "
            "candid joyful moment, both laughing, lifestyle photography."
        ),
    },
    "event": {
        "male": (
            "Eastern European groom in his 30s in a sharp dark tuxedo, "
            "warm outdoor late-afternoon wedding ceremony setting, candid "
            "joyful expression, holding the hand of his partner just out of "
            "frame, premium wedding magazine."
        ),
        "female": (
            "Eastern European bride in her 30s in a flowing white wedding "
            "dress, holding a bouquet of soft cream and blush flowers, warm "
            "outdoor late-afternoon wedding ceremony setting, candid joyful "
            "expression, premium wedding magazine."
        ),
    },
    "prove": {
        "male": (
            "Eastern European fit man in his 30s in fitted matte-black "
            "activewear, calm focused defiant pose, mirror selfie in a clean "
            "modern apartment with morning light streaming through tall "
            "windows, holding the phone subtly, no visible logos."
        ),
        "female": (
            "Eastern European fit woman in her 30s in fitted matte-black "
            "activewear, calm focused defiant pose, mirror selfie in a clean "
            "modern apartment with morning light streaming through tall "
            "windows, holding the phone subtly, no visible logos."
        ),
    },
}

JOBS = []
for slot, by_gender in PROMPTS.items():
    for gender, body in by_gender.items():
        JOBS.append({
            "out": OUT / f"{slot}-{gender}.png",
            "prompt": f"{body} {STYLE}",
        })


def http_post(url, h, p, timeout=60):
    req = urllib.request.Request(url, data=json.dumps(p).encode(), headers=h, method="POST")
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
    with ThreadPoolExecutor(max_workers=4) as ex:
        for f in as_completed([ex.submit(process, j) for j in JOBS]):
            n, m, ok = f.result()
            print(f"[{'ok' if ok and 'skip' not in m else 'skip' if 'skip' in m else 'FAIL'}] {n}: {m}")
            if not ok:
                failures.append(n)
    print(f"\n{len(JOBS) - len(failures)}/{len(JOBS)} succeeded.")
    sys.exit(1 if failures else 0)
