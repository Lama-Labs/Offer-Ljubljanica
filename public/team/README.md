# Headshots

Portraits for the `Ekipa in sodelavci` section.

## The path

`public/` **is** the web root, so its name is not part of the URL. The file at
`public/team/lan-sovinc.webp` is served at `/team/lan-sovinc.webp`, and that
second form is what goes in the `avatar` field in `src/content/offer.ts`.
Writing `/public/team/...` is the mistake this invites: it builds cleanly and
then renders four broken images.

## What is here

| File                   | Person        | `avatar` value            |
| ---------------------- | ------------- | ------------------------- |
| `lan-sovinc.webp`      | Lan Sovinc    | `/team/lan-sovinc.webp`   |
| `matej-horvat.webp`    | Matej Horvat  | `/team/matej-horvat.webp` |
| `luka-kopajtic.webp`   | Luka Kopajtič | `/team/luka-kopajtic.webp`|
| `tilen-tkalec.webp`    | Tilen Tkalec  | `/team/tilen-tkalec.webp` |

Filenames are lowercase ASCII with hyphens, and that is not tidiness. A space
has to be percent-encoded to survive a URL, and `luka-kopajtič.webp` works on
the machine it was saved on and then 404s on a Linux host — both fail after the
offer has been sent, which is the worst moment to find out.

## Replacing one

- **Square, cropped to the face.** The card renders a 112px circle, so a portrait
  with room around the head arrives as a distant figure in a bubble.
- **256×256, `.webp`.** Not a suggestion — see below.
- Consistent with the other three. Four portraits shot four different ways is
  the one thing a reader notices about this section instead of the names.

Then set the path in `src/content/offer.ts`. That is the whole change; the
section reads `avatar` and switches from monogram to portrait on its own.

## Why the files must be small before they get here

`next.config.ts` sets `output: 'export'` and therefore `images: { unoptimized:
true }`. There is no server in front of this page, so **`next/image` does no
resizing at all** — whatever is in this folder is exactly what the phone
downloads. The four originals were 640² to 2048² and came to 1.19 MB between
them, for four circles. At 256² — the 112px the card draws, doubled for a
retina screen — they come to 26 KB.

Resizing on the way in, with Pillow:

```python
from PIL import Image
Image.open('portrait.png').convert('RGB').resize((256, 256), Image.LANCZOS) \
     .save('public/team/ime-priimek.webp', 'WEBP', quality=86, method=6)
```

## Until a photo exists

`avatar: null` renders a monogram — the person's initials in a grey circle.
Leave it null rather than pointing at a file that is not here yet: a missing
avatar looks considered, a broken one looks like nobody opened the page before
sending it.
