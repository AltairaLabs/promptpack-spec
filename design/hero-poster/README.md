# Hero video — poster

`hero.jpg` is **frame 0 of the current hero video**, exported as JPEG.
1124×720, ~107 KB. It is installed at
`promptpack-docs/static/img/hero.jpg`; this directory is the source of record.

## Why the first frame, not a designed still

The video is `autoplay muted loop`, so the poster is only on screen while it
loads. Anything that differs from the first frame flashes the moment playback
starts. Using the true first frame means the poster is invisible as a
transition.

This only holds while the poster and the video agree. **Re-export this whenever
the video is re-cut**, or the seam will show.

## Regenerating

```bash
ffmpeg -ss 0 -i promptpack-docs/static/img/hero.webm -frames:v 1 /tmp/frame0.png -y
python3 -c "from PIL import Image; Image.open('/tmp/frame0.png').convert('RGB').save('design/hero-poster/hero.jpg', quality=90, optimize=True, progressive=True)"
cp design/hero-poster/hero.jpg promptpack-docs/static/img/hero.jpg
```

## History

An earlier version of this poster was composited by hand: the browser window
was cropped out of the old video and re-matted onto the Atlas ground, because
that video's matte was purple. The re-cut fixed the matte at source, so the
scaffolding for that (`poster.html`, `window.png`) is gone — a straight frame
export is now both simpler and exact.
