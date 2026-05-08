#!/usr/bin/env python3
"""
Generate pose variants for the 8-character Dr.Fit cast.

For each character (m1..m4, f1..f4), generate every pose listed in POSES, using
the character's base portrait at /public/images/photo/ref/{code}.png as the kie.ai
reference image. The portraits are pulled via raw.githubusercontent.com URLs
(committed at the latest push of feat/cards-redesign).

Outputs land at public/images/photo/{slot}/{code}.png.

Re-run safe: skips files that already exist. Delete to regenerate.

Submits all jobs in parallel (within reason) and polls concurrently. Total
time should be ~15-20 min for 104 generations.
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

# --- Load KIE_API_KEY ----------------------------------------------------------

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

# --- Universal style anchor ----------------------------------------------------

STYLE_M = (
    "Photographic, editorial fitness-magazine grade, photoreal sharp. "
    "Lighting: soft natural daylight from camera-front-left with mild rim "
    "from camera-back-right. Color grade: warm neutral. "
    "Plain charcoal grey backdrop #2B3138. "
    "No text overlays, no watermarks, no third-party logos. "
    "Strictly Eastern European / Bulgarian features, no other ethnicities."
)

STYLE_F = (
    "Photographic, editorial fitness-magazine grade, photoreal sharp. "
    "Lighting: soft natural daylight from camera-front-left with mild rim "
    "from camera-back-right. Color grade: warm neutral. "
    "Plain warm cream backdrop #F8F4EE. "
    "No text overlays, no watermarks, no third-party logos. "
    "Strictly Eastern European / Bulgarian features, no other ethnicities."
)

WARDROBE_M = (
    "Same person, same face, same hair as the reference image. Wearing "
    "matte-black athletic shorts with a small DR.FIT wordmark embroidered in "
    "brand red on the front-facing left thigh hem (3 cm below waistband, clean "
    "geometric sans-serif, all caps), plus black silicone wristband on right "
    "wrist. Shirtless."
)

WARDROBE_F = (
    "Same person, same face, same hair as the reference image. Wearing a "
    "matte-black sports bra with a small DR.FIT wordmark stamp center-chest "
    "in brand red (clean geometric sans-serif, all caps), plus matte-black "
    "athletic leggings (no shorts, leggings only)."
)

# --- Pose definitions ---------------------------------------------------------

POSES = [
    {
        "slot": "goal",
        "framing": "Three-quarter body framing, chest to thighs visible.",
        "pose": "Standing relaxed, hands on hips. Calm confident expression, direct gaze to camera.",
        "aspect": "9:16",
    },
    {
        "slot": "enc-1",
        "framing": "Side-three-quarter body framing.",
        "pose": "Holding a low-impact pushup or side-plank pose on a charcoal mat. Calm focused expression, not strained.",
        "aspect": "4:3",
    },
    {
        "slot": "enc-2",
        "framing": "Three-quarter framing, chest up.",
        "pose": "Standing with arms crossed across chest, subtle confident smile, direct gaze.",
        "aspect": "4:3",
    },
    {
        "slot": "split-relaxed",
        "framing": "Three-quarter body framing.",
        "pose": "Standing in a relaxed three-quarter stance, arms loose at sides, looking off-camera to the right. Calm neutral expression.",
        "aspect": "9:16",
    },
    {
        "slot": "split-stretch",
        "framing": "Three-quarter body framing.",
        "pose": "Mid-stretch dynamic warm-up: one arm raised overhead, other arm at side. Energetic but not strained expression.",
        "aspect": "9:16",
    },
    {
        "slot": "split-bench",
        "framing": "Three-quarter body framing.",
        "pose": "Seated on a low matte-black bench, towel draped across shoulders, hands resting on knees, confident steady gaze toward camera.",
        "aspect": "9:16",
    },
    {
        "slot": "split-walking",
        "framing": "Three-quarter body framing in motion.",
        "pose": "Mid-stride walking forward toward camera, one foot forward, arms swinging naturally. Calm focused expression.",
        "aspect": "9:16",
    },
    {
        "slot": "split-squat",
        "framing": "Three-quarter body framing.",
        "pose": "Holding a deep bodyweight squat, knees bent, hands clasped at chest. Energetic focused expression, looking forward.",
        "aspect": "9:16",
    },
    {
        "slot": "split-bottle",
        "framing": "Side profile, three-quarter body framing.",
        "pose": "Drinking from a matte-black water bottle that has a clear DR.FIT wordmark on its side in brand red, head slightly tilted back, free hand on hip. Calm confident expression.",
        "aspect": "9:16",
    },
    {
        "slot": "split-towel",
        "framing": "Three-quarter body framing.",
        "pose": "Standing post-workout, a towel hanging across both shoulders gripped by both hands at chest level, neutral steady gaze.",
        "aspect": "9:16",
    },
    {
        "slot": "split-front",
        "framing": "Front three-quarter body framing.",
        "pose": "Standing facing camera, hands relaxed at sides, balanced weight on both feet. Calm confident expression, direct gaze.",
        "aspect": "9:16",
    },
    {
        "slot": "split-lunge",
        "framing": "Three-quarter body framing.",
        "pose": "Holding a low forward lunge with one knee bent forward, back leg extended, arms balanced. Focused expression.",
        "aspect": "9:16",
    },
    {
        "slot": "split-seated",
        "framing": "Three-quarter body framing.",
        "pose": "Seated on the floor, knees drawn up, forearms resting on knees, contemplative confident gaze toward camera.",
        "aspect": "9:16",
    },
]

# --- Character map -------------------------------------------------------------

CHARS = [
    "m1", "m2", "m3", "m4",
    "f1", "f2", "f3", "f4",
]

def is_male(code: str) -> bool:
    return code.startswith("m")

def style_for(code: str) -> str:
    return STYLE_M if is_male(code) else STYLE_F

def wardrobe_for(code: str) -> str:
    return WARDROBE_M if is_male(code) else WARDROBE_F

def ref_url(code: str) -> str:
    return f"{RAW_BASE}/{code}.png"

def out_path(slot: str, code: str) -> Path:
    return OUT_ROOT / slot / f"{code}.png"

def build_prompt(code: str, pose: dict) -> str:
    return (
        f"{wardrobe_for(code)} {pose['pose']} {pose['framing']} {style_for(code)}"
    )

# --- HTTP helpers --------------------------------------------------------------

CREATE_URL = "https://api.kie.ai/api/v1/jobs/createTask"
INFO_URL = "https://api.kie.ai/api/v1/jobs/recordInfo"

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
    req = urllib.request.Request(url, headers={"User-Agent": "drfit-pose-fetcher/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        out_path.write_bytes(resp.read())

# --- Job lifecycle -------------------------------------------------------------

def submit_job(code: str, pose: dict) -> str:
    headers = {
        "Authorization": f"Bearer {KIE_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "nano-banana-pro",
        "input": {
            "prompt": build_prompt(code, pose),
            "image_input": [ref_url(code)],
            "aspect_ratio": pose["aspect"],
            "resolution": "2K",
            "output_format": "png",
        },
    }
    result = http_post(CREATE_URL, headers, payload)
    if result.get("code") != 200 or not result.get("data", {}).get("taskId"):
        raise RuntimeError(f"createTask failed: {json.dumps(result)[:300]}")
    return result["data"]["taskId"]

def poll_job(task_id: str, timeout_s: float = 300.0, interval_s: float = 4.0) -> str:
    headers = {"Authorization": f"Bearer {KIE_API_KEY}"}
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        time.sleep(interval_s)
        try:
            result = http_get(f"{INFO_URL}?taskId={urllib.parse.quote(task_id)}", headers)
        except Exception as e:
            print(f"  poll error for {task_id}: {e}")
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
            raise RuntimeError(f"success but no resultUrls: {json.dumps(data)[:300]}")
        if state in ("fail", "error", "failed"):
            raise RuntimeError(f"failed: {json.dumps(data)[:300]}")
    raise TimeoutError(f"task {task_id} timed out after {timeout_s}s")

def process_one(code: str, pose: dict) -> tuple[str, str, str, bool]:
    """Returns (slot, code, message, ok)."""
    out = out_path(pose["slot"], code)
    if out.exists():
        return (pose["slot"], code, "skip (exists)", True)
    try:
        out.parent.mkdir(parents=True, exist_ok=True)
        task_id = submit_job(code, pose)
        url = poll_job(task_id)
        http_download(url, out)
        sz = out.stat().st_size // 1024
        return (pose["slot"], code, f"ok ({sz}KB)", True)
    except Exception as e:
        return (pose["slot"], code, f"FAIL: {e}", False)

# --- Main ----------------------------------------------------------------------

def main() -> int:
    only_chars = set(arg for arg in sys.argv[1:] if arg in CHARS)
    only_slots = set(arg for arg in sys.argv[1:] if arg not in CHARS)

    jobs = []
    for code in CHARS:
        if only_chars and code not in only_chars:
            continue
        for pose in POSES:
            if only_slots and pose["slot"] not in only_slots:
                continue
            jobs.append((code, pose))

    print(f"Total jobs to process: {len(jobs)}")
    print(f"Chars: {sorted(set(c for c,_ in jobs))}")
    print(f"Slots: {sorted(set(p['slot'] for _,p in jobs))}")
    print()

    succeeded = 0
    failed: list[tuple[str, str, str]] = []
    # Limit concurrency to be polite to kie.ai (the createTask endpoint may rate-limit)
    with ThreadPoolExecutor(max_workers=6) as ex:
        futures = {ex.submit(process_one, code, pose): (code, pose) for code, pose in jobs}
        for fut in as_completed(futures):
            slot, code, msg, ok = fut.result()
            tag = "ok  " if ok and "skip" not in msg else "skip" if "skip" in msg else "fail"
            print(f"[{tag}] {slot:18s} {code}: {msg}")
            if ok:
                succeeded += 1
            else:
                failed.append((slot, code, msg))

    print()
    print(f"Done: {succeeded}/{len(jobs)} succeeded.")
    if failed:
        print("Failures:")
        for slot, code, msg in failed:
            print(f"  {slot}/{code}: {msg}")
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
