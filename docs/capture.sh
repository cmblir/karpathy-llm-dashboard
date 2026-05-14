#!/bin/bash
# Dashboard screenshot + GIF auto-capture.
# Requires: Chrome/Chromium. GIF: ffmpeg OR Pillow (auto-installed in docs/.venv).
# The dashboard server must be running at http://localhost:8090.

set -e
cd "$(dirname "$0")"

# Chrome auto-detect
if [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif command -v chromium >/dev/null 2>&1; then
  CHROME="chromium"
elif command -v google-chrome >/dev/null 2>&1; then
  CHROME="google-chrome"
else
  echo "Chrome not found. Install Chrome or Chromium."
  exit 1
fi

OUT=screenshots
mkdir -p "$OUT"
W=1600
H=1000

# Hard wall-clock timeout per shot — graph view has a force-directed sim
# that never settles, so we let Chrome run for 12s and then kill it.
shoot() {
  local name="$1" hash="$2" budget="$3" wall="$4"
  local url="http://localhost:8090/${hash}"
  echo "  → $name"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --window-size="${W},${H}" --virtual-time-budget="${budget}" \
    --screenshot="$OUT/$name.png" "$url" >/dev/null 2>&1 &
  local pid=$!
  ( sleep "$wall"; kill -9 "$pid" 2>/dev/null ) &
  local watchdog=$!
  wait "$pid" 2>/dev/null || true
  kill "$watchdog" 2>/dev/null || true
}

echo "Capturing dashboard views..."
shoot home       ""                3000  15
shoot ingest     "#view=ingest"    3000  15
shoot graph      "#view=graph"     2000  35
shoot history    "#view=history"   3000  15
shoot provenance "#view=provenance" 3000  15
shoot query      "#view=query"     3000  15

echo ""
echo "Building demo.gif..."

if command -v ffmpeg >/dev/null 2>&1; then
  echo "  using ffmpeg"
  TMP=$(mktemp)
  cat > "$TMP" << EOF
file '$(pwd)/$OUT/home.png'
duration 2.5
file '$(pwd)/$OUT/ingest.png'
duration 2.5
file '$(pwd)/$OUT/graph.png'
duration 2.5
file '$(pwd)/$OUT/history.png'
duration 2.5
file '$(pwd)/$OUT/provenance.png'
duration 2.5
file '$(pwd)/$OUT/query.png'
duration 2.5
file '$(pwd)/$OUT/home.png'
EOF
  ffmpeg -y -f concat -safe 0 -i "$TMP" \
    -vf "scale=1200:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer" \
    demo.gif 2>/dev/null
  rm -f "$TMP"
else
  echo "  ffmpeg not found — falling back to Pillow"
  if [ ! -x ".venv/bin/python" ]; then
    echo "  bootstrapping docs/.venv with Pillow..."
    python3 -m venv .venv
    .venv/bin/pip install --quiet --upgrade pip pillow
  fi
  .venv/bin/python - <<'PY'
from PIL import Image
import os
order = ["home", "ingest", "graph", "history", "provenance", "query", "home"]
target_w = 1200
frames = []
for name in order:
    img = Image.open(os.path.join("screenshots", f"{name}.png")).convert("RGB")
    w, h = img.size
    img = img.resize((target_w, int(h * target_w / w)), Image.LANCZOS)
    frames.append(img.convert("P", palette=Image.ADAPTIVE, colors=128))
frames[0].save(
    "demo.gif",
    save_all=True,
    append_images=frames[1:],
    duration=2500,
    loop=0,
    optimize=True,
    disposal=2,
)
print(f"  wrote demo.gif ({os.path.getsize('demo.gif')} bytes)")
PY
fi

echo ""
echo "Done."
ls -la "$OUT/" demo.gif
