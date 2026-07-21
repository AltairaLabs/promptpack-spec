# Hero video — end card

Replacement end card for the homepage hero video, in the Atlas scheme.

The existing video (`promptpack-docs/static/img/hero.webm` / `.mp4`) is
1124×720, 30fps, 51.2s. Its current end card runs from **~46.8s to 51.23s**,
preceded by a ~0.5s fade starting at **~46.3s** — that's the segment to replace.

## Files

| File | Use |
|---|---|
| `endcard.png` | 1124×720 — drop-in at the video's native size |
| `endcard@2x.png` | 2248×1440 — headroom if CapCut scales or pushes in |
| `endcard-dark.png` | 1124×720, dark ramp |
| `endcard.html` / `endcard-dark.html` | source |

## Why light by default

The ground is `#E9EEF6` — Atlas `--ink-void` on the light ramp, which is exactly
the surface the video frame sits on in the page. The card reads as part of the
panel rather than a slide pasted over it. The site defaults to light mode.

Use `endcard-dark.png` only if the video is re-cut for the dark ramp; a dark
card against the light page will letterbox visibly.

## Regenerating

Rendered through headless Chrome rather than an SVG rasteriser, because Space
Grotesk and Spline Sans Mono are **not installed system-wide** — `rsvg-convert`
would silently substitute a fallback. Chrome loads them via `@font-face` from
the vendored woff2 files.

```bash
cd design/hero-endcard
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1124,720 \
  --screenshot=endcard.png "$PWD/endcard.html"
```

Use `--force-device-scale-factor=2` for the `@2x` export.

Fonts are read from `promptpack-docs/src/css/atlas/assets/fonts/`. If that path
moves, the `@font-face` rules here must follow or the render silently loses the
typography — check the output byte size changed as expected.

## Not addressed here

This is the end card only. The rest of the video is still off-scheme:

- the **purple gradient matte** behind the browser window
- the **purple caption bubbles** ("A PromptPack is your entire agent…",
  "Versioned. Tested. Shipped as an immutable artifact.")
- **`hero.jpg`**, the poster — a frame of the old video, complete with purple
  matte and caption. It is what everyone sees before the video plays, and all
  they see if it fails to load.

There is no source project for the video in any repo, so those need re-cutting
or re-recording.
