# Hero Video Config

The homepage hero background video is configured in [hero-video.json](hero-video.json).

## File Format

```json
{
  "src": "/videos/hba_filip1.mp4",
  "objectPosition": "50% 28%"
}
```

## Fields

- `src`
  The public path to the video file used in the hero section.
  Example: `/videos/hba_filip1.mp4`

- `objectPosition`
  Controls which part of the video stays visible when the video is cropped by `object-cover`.
  Format: `"horizontal vertical"`
  Example: `"50% 28%"`

## How To Tune `objectPosition`

The first value controls horizontal alignment.

- `0%` = left
- `50%` = center
- `100%` = right

The second value controls vertical alignment.

- `0%` = top
- `50%` = center
- `100%` = bottom

If the rider's head is cut off, lower the vertical crop target toward the top of the frame.

Examples:

- `"50% 20%"` shows more of the upper part of the video
- `"50% 35%"` shifts the visible area lower
- `"45% 25%"` shifts slightly left and upward

## Workflow

1. Edit [hero-video.json](hero-video.json).
2. Save the file.
3. Run `npm run dev` or refresh the running dev server.
4. Reload the homepage and check the hero section at the screen sizes you care about.

## Notes

- Keep the `src` value as a public path starting with `/videos/`.
- Files in `public/videos/` are generated from `content/videos/` by the asset copy script.
- Do not edit generated files in `public/` directly.