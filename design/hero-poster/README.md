# Hero video — poster

Replacement for `promptpack-docs/static/img/hero.jpg`, in the Atlas scheme.

| File | Use |
|---|---|
| `hero.jpg` | 1124×720, 100 KB — drop-in replacement for the live poster |
| `poster.png` | lossless render |
| `poster.html` + `window.png` | source |

## What it is

The **real opening frame of the existing video, re-matted** — not a designed
illustration. The browser window was cropped out of frame 0 (measured bounds
1012×644 at 56,37, with a 2px inset so the rounded-corner antialiasing against
the old purple matte came away with it) and re-composited onto `#E9EEF6` —
Atlas `--ink-void` on the light ramp, the same surface the video frame sits on
in the page.

The window keeps the Atlas card treatment: 1px hairline, 11px radius (which
also clips the last of the old matte caught in the corner arcs), and the soft
ink-navy shadow.

## Why a true frame rather than a designed still

The video is `autoplay muted loop`, so the poster is only on screen while it
loads. Anything that differs from the first frame flashes the moment playback
starts. A re-matted true frame flows straight into the video instead.

That property only holds if the video's matte is re-cut to `#E9EEF6`. If the
matte ends up a different colour, change `background` in `poster.html` to match
and re-render, or the seam will show.

## Not wired in yet — on purpose

`promptpack-docs/static/img/hero.jpg` is **unchanged**. Dropping this in while
the video is still purple would be worse than leaving it: the page would show a
light Atlas poster and then jump to a purple video the instant it plays. The
current poster at least matches the current video.

Swap both together when the re-cut lands:

```bash
cp design/hero-poster/hero.jpg promptpack-docs/static/img/hero.jpg
# alongside the new hero.webm / hero.mp4
```

## Regenerating

```bash
cd design/hero-poster
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1124,720 --screenshot=poster.png "$PWD/poster.html"
python3 -c "from PIL import Image; Image.open('poster.png').convert('RGB').save('hero.jpg', quality=90, optimize=True, progressive=True)"
```

To re-cut from a different source frame, extract it and re-crop with the same
bounds:

```bash
ffmpeg -ss 0 -i promptpack-docs/static/img/hero.webm -frames:v 1 frame.png
python3 -c "from PIL import Image; Image.open('frame.png').crop((58,39,1066,679)).save('window.png')"
```
