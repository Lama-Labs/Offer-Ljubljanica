import Image from 'next/image'

import { cn } from '@/lib/utils'

/**
 * The sender's mark.
 *
 * ## Where it goes, and why only there
 *
 * Three times: beside `Alpaca Labs` in the masthead, beside it again in the
 * colophon, and at the head of the unlock screen. The first two are the lines
 * on the offer that say who wrote the document, and a mark is an attribution —
 * it belongs next to the name it attributes, not floating at the top of a
 * column. The third is the screen that asks for a password before any of that
 * is visible, which is exactly when a reader needs to know who is asking.
 *
 * It deliberately does not go beside the client's name on the other half of the
 * masthead rule. A logo sitting next to *Ladjica Emona in Emonca* reads as
 * theirs, which is the one thing it must not say.
 *
 * ## Why it stays in colour
 *
 * It is the only full-colour object on a page built from one red, four greys
 * and white — and flattening it to `{ink}` was the first thing tried. It does
 * not survive: the drawing is legible because the fleece, the muzzle and the
 * eyes are different values, and a single-colour silhouette of it is a blob
 * with ears.
 *
 * So it keeps its colours and pays for them by staying small and appearing only
 * where it is attributing something. The page's rule about red — that the accent is never spent on decoration —
 * is not broken by this, because none of these colours are the accent. This is
 * a signature, and a signature is allowed to be in a different ink.
 */
export function Logo({ label, className }: { label?: string; className?: string }) {
  return (
    <Image
      src="/alpaca.svg"
      /* The file's own square. The rendered size comes from `className`; these
         are here so the layout reserves the right box before it loads. */
      width={64}
      height={64}
      /*
        Next's image optimiser refuses SVG unless the app opts into rendering
        arbitrary markup, which is a setting worth not having. This file is ours
        and checked in, and a vector mark has nothing to optimise anyway.
      */
      unoptimized
      /*
        Decorative by default: in the masthead and the colophon the words
        immediately beside it already read `Alpaca Labs`, and a described logo
        would announce the sender's name twice inside one line.

        `label` is for the one place that is not true — the unlock screen, where
        the agency is named nowhere in text and the mark is the only thing
        saying who is asking for a password.
      */
      alt={label ?? ''}
      aria-hidden={label === undefined}
      className={cn('size-10 shrink-0', className)}
    />
  )
}
