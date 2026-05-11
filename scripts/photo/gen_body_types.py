#!/usr/bin/env python3
"""
Generate body-type variants for a given character via kie.ai Nano Banana Pro.

Companion to gen_base_portraits.py. Uses the existing ref/{code}.png as an
image_input reference so the face stays consistent across body-composition
variants. Output goes to public/images/photo/body-type/{code}-{type}.png.

Re-run safe: skips outputs that already exist.

Usage:
    python3 scripts/photo/gen_body_types.py m2          # just m2
    python3 scripts/photo/gen_body_types.py m2 f2       # m2 + f2
    python3 scripts/photo/gen_body_types.py             # all 8

Dancho's review #4: existing body-type photos all look near-identical
because they used pure-prompt generation with the same character. This pass
keeps the face but pushes body composition explicitly per variant.
"""

import json
import os
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

HOME = Path.home()
ENV_PATH = HOME / "Desktop/23/ai-team/.env"
REF_DIR = HOME / "drfit-quiz/public/images/photo/ref"
OUT_DIR = HOME / "drfit-quiz/public/images/photo/body-type"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Public URL base for serving the reference images to kie.ai. kie.ai requires
# image_input to be a hosted URL; data URIs return "image_input file type not
# supported". The Vercel staging deploy mirrors public/ as static, so this works.
REF_URL_BASE = "https://drfit-quiz.vercel.app/images/photo/ref"


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
    print(f"ERROR: KIE_API_KEY not found in {ENV_PATH}", file=sys.stderr)
    sys.exit(1)


# Per-variant body-composition descriptors. Identity is anchored by the
# reference image; these only push composition, not face.
VARIANTS_MALE = {
    "overweight": (
        "Visibly overweight build: round soft midsection with a clear belly, "
        "fuller face and neck, soft chest, no muscle definition. "
        "Wearing a fitted grey t-shirt that drapes over the belly. "
        "Approximately +25 kg above lean weight."
    ),
    "overweight-shirtless": (
        "Visibly overweight build, shirtless: round soft midsection with a clear "
        "protruding belly, fuller face and neck, soft chest with no definition. "
        "Approximately +25 kg above lean weight. Same matte-black athletic shorts."
    ),
    "skinny-fat": (
        "Skinny-fat build: thin arms and shoulders, no muscle definition, but "
        "soft midsection with a small belly. Slight slump in posture. "
        "Wearing a slightly oversized grey t-shirt that hangs straight."
    ),
    "underweight": (
        "Visibly underweight build: very thin frame, narrow shoulders, hollow cheeks, "
        "visible collarbones, no muscle. Wearing a loose grey t-shirt that drapes "
        "off the body. Approximately -8 kg below normal weight."
    ),
    "perfect": (
        "Lean athletic build: defined shoulders, flat stomach, visible muscle "
        "definition without bulk, healthy proportions. Wearing a fitted grey t-shirt "
        "that shows the V-taper. Confident posture."
    ),
}

VARIANTS_FEMALE = {
    "overweight": (
        "Visibly overweight build: round soft midsection, fuller face and neck, "
        "wider waist, no muscle definition. Wearing a fitted grey t-shirt that "
        "drapes over the belly and a pair of black leggings. "
        "Approximately +20 kg above lean weight."
    ),
    "overweight-shirtless": (
        "Visibly overweight build, sports bra only: round soft midsection with a "
        "clear belly, fuller face and neck, wider waist. Same matte-black sports "
        "bra and black leggings."
    ),
    "skinny-fat": (
        "Skinny-fat build: thin limbs, no muscle definition, soft midsection with "
        "a small belly, slight slump in posture. Wearing a slightly oversized grey "
        "t-shirt that hangs straight."
    ),
    "underweight": (
        "Visibly underweight build: very thin frame, narrow shoulders, hollow "
        "cheeks, visible collarbones, no muscle. Wearing a loose grey t-shirt "
        "and black leggings. Approximately -8 kg below normal weight."
    ),
    "perfect": (
        "Lean toned build: defined arms and shoulders, flat stomach, healthy "
        "athletic proportions without bulk. Wearing a fitted grey t-shirt and "
        "black leggings. Confident posture."
    ),
}


STYLE = (
    "Same Bulgarian Eastern European person as the reference image, same face, "
    "same hair, same eye color, same age. Same backdrop tone. "
    "Photographic, editorial fitness-magazine grade, photoreal sharp. "
    "Lighting: soft natural daylight from camera-front-left with mild rim from "
    "camera-back-right. Color grade: warm neutral, slight contrast lift. "
    "Composition: subject sharp, background plain, no clutter, no props. "
    "No text overlays, no watermarks, no third-party logos. Output 4:5 portrait."
)


CREATE_URL = "https://api.kie.ai/api/v1/jobs/createTask"
INFO_URL = "https://api.kie.ai/api/v1/jobs/recordInfo"


def http_post_json(url: str, headers: dict, payload: dict, timeout: float = 90.0) -> dict:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_get_json(url: str, headers: dict, timeout: float = 30.0) -> dict:
    req = urllib.request.Request(url, headers=headers, method="GET")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_download(url: str, out_path: Path, timeout: float = 180.0) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "drfit-bodytype-fetcher/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        out_path.write_bytes(resp.read())


def downscale(out_path: Path, target_width: int = 800) -> None:
    """Resize PNG in-place to keep repo size sane. Nano Banana Pro outputs ~6 MB
    at 2K; the page renders the photo at ~360 px wide, so 800 px is plenty."""
    import subprocess
    try:
        subprocess.run(
            ["sips", "--resampleWidth", str(target_width), str(out_path), "--out", str(out_path)],
            check=True,
            capture_output=True,
        )
    except (FileNotFoundError, subprocess.CalledProcessError):
        # sips is macOS-only; if missing, leave the file at full resolution.
        pass


def submit(prompt: str, ref_image: str) -> str:
    headers = {
        "Authorization": f"Bearer {KIE_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "nano-banana-pro",
        "input": {
            "prompt": f"{prompt} {STYLE}",
            "image_input": [ref_image],
            "aspect_ratio": "4:5",
            "resolution": "2K",
            "output_format": "png",
        },
    }
    result = http_post_json(CREATE_URL, headers, payload)
    if result.get("code") != 200 or not result.get("data", {}).get("taskId"):
        raise RuntimeError(f"createTask failed: {json.dumps(result)[:300]}")
    return result["data"]["taskId"]


def poll(task_id: str, timeout_s: float = 300.0, interval_s: float = 4.0) -> str:
    headers = {"Authorization": f"Bearer {KIE_API_KEY}"}
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        time.sleep(interval_s)
        result = http_get_json(f"{INFO_URL}?taskId={urllib.parse.quote(task_id)}", headers)
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
            raise RuntimeError(f"task {task_id} failed: {json.dumps(data)[:300]}")
    raise TimeoutError(f"task {task_id} did not finish in {timeout_s}s")


def gen_one(char_code: str, variant: str, variant_prompt: str, ref_image: str) -> tuple[str, str]:
    out_name = f"{char_code}-{variant}.png"
    out_path = OUT_DIR / out_name
    if out_path.exists():
        return ("skip", str(out_path))
    full_prompt = (
        f"{variant_prompt} Identity must match the reference image precisely. "
        f"Three-quarter framing, chest up."
    )
    print(f"[gen ] {char_code}/{variant}: submitting...")
    task_id = submit(full_prompt, ref_image)
    print(f"       taskId={task_id}, polling...")
    url = poll(task_id)
    print(f"       got: {url[:80]}")
    http_download(url, out_path)
    downscale(out_path)
    size_kb = out_path.stat().st_size // 1024
    print(f"[ok  ] {char_code}/{variant}: {out_name} ({size_kb} KB)")
    return ("ok", str(out_path))


def main() -> int:
    only = set(sys.argv[1:])
    all_codes = ["m1", "m2", "m3", "m4", "f1", "f2", "f3", "f4"]
    codes = [c for c in all_codes if not only or c in only]
    failed: list[str] = []

    for code in codes:
        ref_path = REF_DIR / f"{code}.png"
        if not ref_path.exists():
            print(f"[skip] {code}: ref image missing at {ref_path}")
            continue
        ref_uri = f"{REF_URL_BASE}/{code}.png"
        variants = VARIANTS_MALE if code.startswith("m") else VARIANTS_FEMALE
        for variant, prompt in variants.items():
            try:
                status, target = gen_one(code, variant, prompt, ref_uri)
                if status == "skip":
                    print(f"[skip] {code}/{variant}: already exists")
            except Exception as e:
                print(f"[fail] {code}/{variant}: {e}")
                failed.append(f"{code}/{variant}")

    if failed:
        print(f"\nfailed: {failed}")
        return 1
    print("\nall done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
