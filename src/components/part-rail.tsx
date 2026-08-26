'use client'

import { useEffect, useState } from 'react'

import { rail as railCopy } from '@/content/copy'
import { offerParts, type OfferPartId } from '@/content/offer'
import { useOfferSelection } from '@/components/offer-selection'
import { HERO_ANCHOR, SUMMARY_ANCHOR } from '@/lib/anchors'
import { cn } from '@/lib/utils'

/**
 * The part index again, across the top of the viewport, for the length of the
 * page.
 *
 * ## What it is for
 *
 * The hero carries the index as three columns and then scrolls away, and from
 * there the reader has eight sections and no way back to a part except the
 * scrollbar. The bar keeps the same five destinations — the offer, the three
 * parts, the price — within reach of every screenful, using the numerals the
 * page has already taught. It navigates and nothing else; the place to *change*
 * the offer is still the summary, for the reason set out in `offer-part.tsx`.
 *
 * ## Why it is a bar and no longer a rail
 *
 * It spent a while as a column of tokens in the margin, first on the right and
 * then on the left. A margin is the one place on the page with no room for
 * words, so each stop had to compress to a mark — `01`, `€`, an arrow — and a
 * mark is only an index entry to somebody who has already learnt it. A reader
 * who lands on this page from a forwarded link has learnt nothing yet.
 *
 * Across the top there is room to print the names, so the index stops being a
 * mnemonic and starts being a table of contents: *Ponudba · 01 Alpaca Booking ·
 * 02 ljubljanicatours.com · 03 Prenova ljubljanica.eu · Cenik* is the whole
 * document in one line, legible before anything has been taught.
 *
 * It is `sticky` rather than `fixed`, so it occupies its own strip at the top
 * of the document and the hero starts underneath it. A fixed bar would need the
 * page to reserve a matching band of padding, in a second file, kept in step by
 * hand.
 *
 * ## Two facts, and how they stay apart while sharing a colour
 *
 * The bar reports where the reader is and, for the three parts, whether that
 * part is in the offer. Both use the accent, so the shapes have to do the
 * separating that colour no longer does.
 *
 * Selection is the **fill of the numeral**: accent glyph, grey glyph, the same
 * fact in the same form as on the cards and in the summary. Position is a
 * **ring around the whole stop** — a stroke on a barely-tinted ground, so it
 * reads as a highlight passing along the bar rather than as another thing
 * switched on.
 *
 * They never collide because they are never the same mark: a part that is
 * selected and current is an accent numeral inside a pill, a part that is
 * current but out is a grey numeral inside the same pill, and the pill is the
 * only element on the bar that moves as the reader scrolls. Nothing filled
 * reports position, and nothing stroked reports state.
 *
 * ## Why it starts at `lg`
 *
 * Five stops with their names run to roughly 750px of type before padding. Below
 * about 1024px they would either wrap into a second row — a two-line index is no
 * longer one line of document — or have to drop back to bare tokens, which is
 * the thing this stopped being. Narrow screens get no index, which is what they
 * got before.
 */

type RailStop = {
  /** The fragment, which is also the id of the element being watched. */
  id: string
  /** The numeral, for the stops that have one. The bookends do not. */
  token: string | null
  /** What is printed, and — since it is printed — what is spoken. */
  name: string
  /** The part this stop is, when it is one — the only stops carrying state. */
  partId: OfferPartId | null
}

/*
  Built from `offerParts` rather than written out, so a fourth part added to
  `offer.ts` appears in the bar without anybody having to remember the bar
  exists. The bookends are the only literals, because they are the only two
  stops that are not parts.
*/
const stops: readonly RailStop[] = [
  {
    id: HERO_ANCHOR,
    token: null,
    name: railCopy.top.name,
    partId: null,
  },
  ...offerParts.map((part) => ({
    id: part.id,
    token: String(part.number).padStart(2, '0'),
    name: part.name,
    partId: part.id,
  })),
  {
    id: SUMMARY_ANCHOR,
    token: null,
    name: railCopy.summary.name,
    partId: null,
  },
]

/**
 * Which stop the reader is at.
 *
 * The band is a slice near the top of the viewport rather than the whole of it:
 * with a full-height root, a tall section and the short one after it are both
 * "visible" for most of a screenful and the answer flickers between them. A
 * section is current when its body crosses the line the eye is actually reading
 * at.
 *
 * The last answer is kept when nothing crosses the band, which is deliberate.
 * Four sections sit below the summary that the bar does not address, and holding
 * *Cenik* down there says *the last place you reached* — true, and more use than
 * an index that empties whenever the reader is between two of its own
 * destinations.
 *
 * `null` until the observer has run, so the first paint marks nothing rather
 * than guessing at the top. A page rendered on the server has no scroll
 * position to report, and claiming one would be a hydration mismatch.
 */
function useCurrentStop(): string | null {
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    const targets = stops
      .map((stop) => document.getElementById(stop.id))
      .filter((element): element is HTMLElement => element !== null)

    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id)
        }
      },
      { rootMargin: '-25% 0px -65% 0px' },
    )

    for (const target of targets) observer.observe(target)

    return () => observer.disconnect()
  }, [])

  return current
}

function RailStopLink({ stop, current }: { stop: RailStop; current: boolean }) {
  const { isSelected } = useOfferSelection()
  const selected = stop.partId !== null && isSelected(stop.partId)

  return (
    <li>
      {/*
        No `aria-label`. It used to carry one because the visible token was `01`
        or `€` and neither is a destination said aloud. Now that the name is
        printed beside the numeral, the link's own text is already the better
        label — and an `aria-label` would replace the visible words with a
        subset of themselves, which is the one thing a label must not do.
      */}
      <a
        href={`#${stop.id}`}
        data-part={stop.partId ?? undefined}
        aria-current={current ? 'true' : undefined}
        className={cn(
          'group flex items-center gap-2 rounded-full border px-3 py-1.5',
          'transition-colors duration-150',
          current ? 'border-accent-soft bg-accent-tint' : 'hover:bg-mist border-transparent',
        )}
      >
        {stop.token ? (
          <span
            className={cn(
              'num-sm tabular-nums transition-colors duration-150',
              selected ? 'text-accent' : 'text-faint',
            )}
          >
            {stop.token}
          </span>
        ) : null}

        <span
          className={cn(
            'type-caption whitespace-nowrap transition-colors duration-150',
            current ? 'text-ink' : 'text-mute group-hover:text-ink',
          )}
        >
          {stop.name}
        </span>
      </a>
    </li>
  )
}

export function PartRail() {
  const current = useCurrentStop()

  return (
    /*
      Translucent rather than solid, because the bar sits over eight sections
      that alternate `paper` and `mist` and a solid `paper` strip would show a
      hard edge against every second one. The blur is what lets a hairline do
      the separating on its own.
    */
    <nav
      aria-label={railCopy.label}
      className="bg-paper/85 border-hairline sticky top-0 z-40 hidden border-b backdrop-blur-sm lg:block"
    >
      {/*
        The same 1120px container and gutters every section uses, so the two
        bookends line up with the page's own left and right text edges rather
        than with the window.

        `justify-between` rather than a gap: the five stops are the whole
        document, and spreading them the width of the text says so. A cluster at
        one end would read as a menu that happens to be about this page.
      */}
      <ul className="mx-auto flex h-14 w-full max-w-[1120px] items-center justify-between px-5 sm:px-8">
        {stops.map((stop) => (
          <RailStopLink key={stop.id} stop={stop} current={stop.id === current} />
        ))}
      </ul>
    </nav>
  )
}
