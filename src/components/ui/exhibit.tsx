import type { CSSProperties } from 'react'
import Image from 'next/image'

import { Copy } from '@/components/ui/copy'
import { cn } from '@/lib/utils'

/**
 * A screenshot, cited rather than displayed.
 *
 * ## Why a screenshot needed its own treatment at all
 *
 * Everything else on this page is drawn by the page: its hairlines, its type,
 * its one red. A screenshot is a rectangle of somebody else's pixels — other
 * greys, other radii, internal rules that line up with nothing here. Four of
 * them dropped in as cards with shadows is how a document turns into a deck.
 *
 * So they are not displayed, they are cited. The frame is the same `<figure>`
 * the two drawings already use — a `type-subhead` heading, a caption in
 * `{faint}` at the foot — because a reader should meet the same kind of object
 * each time, whether what is inside it was drawn here or captured elsewhere.
 * What is new is only what happens *on* the image.
 *
 * ## Why the caption no longer sits on a rule
 *
 * It used to, and the rule was right while the figure was the last thing in its
 * group: a hairline under the caption closed the figure off from whatever came
 * next. The figure leads the group now, so that same hairline fell between the
 * screenshot and the nine sentences explaining it — a divider in the middle of
 * one claim, while the boundary between two claims had none. The rule moved to
 * where the subject actually changes, which is `OfferPartSection`; the caption
 * keeps its distance from the plate and nothing else.
 *
 * ## Why it carries no margin of its own
 *
 * It used to open with `mt-10`, from when it was always the last thing in a
 * group. Now that it leads one, the gap belongs to whichever side of it the
 * caller wants — `OfferPartSection` spaces the group with `space-y-10`, which
 * puts the same forty pixels between the figure and the lines under it and none
 * above, where the group's own heading has already set the distance.
 *
 * ## Why there is no mono label over the heading
 *
 * Every figure carried one: `Obrazec za rezervacijo`, `Nadzorna plošča`,
 * `Prijava na pomolu`, `Skica postavitve`. Each named the thing the heading
 * directly beneath it was already about, one size smaller and in a quieter
 * voice, and the two lines together read as a caption apologising for a
 * caption. What a figure is called is its heading. The eyebrow was a label on a
 * label, and the prop that rendered it is gone with the words.
 *
 * ## The callouts are the whole point
 *
 * A console screenshot is dense, and a reader given one under a caption saying
 * "the dashboard" takes nothing from it — they learn that software exists,
 * which they already assumed. A marker sitting on the figure `224 €` beside a
 * line saying *this is what today's boats still owe you* is the specific the
 * brief asks for.
 *
 * It is also the admission test. If there is nothing on a capture worth
 * pointing at, the capture is decoration and does not go on the page. That rule
 * is why two of the five captures taken for this offer are not here.
 *
 * ## Letters, not numerals
 *
 * `01` `02` `03` belong to the three parts and to nothing else — the route
 * graphic gives up numbering its own steps for the same reason. Letters are a
 * second index that can never be read as the first.
 *
 * ## Why the marker is a wash and not a fill
 *
 * The accent filled reports state on this page: a selected card, a live
 * numeral, the totals panel. The accent stroked on its wash is a mark — it says
 * *which thing this is*. A callout is a mark, so it takes the mark's shape,
 * which is `IconTile`'s exactly: the same wash, the same radius, one step
 * smaller. Nothing here is a new colour — inside a part section the accent is
 * that part's hue, which is how a callout ends up teal under `01`.
 */

/**
 * One thing worth pointing at, and where it is.
 *
 * `x` and `y` are percentages of the *plate*, not of the file — so they survive
 * the crop and every breakpoint, and a marker nudged by two points moves two
 * points on every screen. They are meant to be tuned by eye against the running
 * page; that is a five-second edit and there is no better way to place them.
 *
 * A marker sits at the top-left corner of what it names rather than over its
 * centre, because what it names is usually a number and covering the number
 * defeats the exercise.
 */
export type Callout = {
  /** `A`, `B`, `C` — unique within one exhibit, in reading order. */
  letter: string
  /** Percentage across the plate, 0–100. */
  x: number
  /** Percentage down the plate, 0–100. */
  y: number
  /** What is true at that spot. One sentence, in the reader's terms. */
  text: string
}

/**
 * The badge, in both places it appears: on the plate, and in the key.
 *
 * `ps-[0.09em]` cancels `label-mono`'s tracking, which on a single character is
 * pure trailing space and would otherwise sit the letter left of centre.
 */
const marker =
  'label-mono bg-accent-wash text-accent flex size-6 shrink-0 items-center justify-center rounded-md ps-[0.09em]'

export function Exhibit({
  heading,
  lead,
  src,
  alt,
  width,
  height,
  aspect,
  anchor = 'top',
  provisional = false,
  callouts = [],
  caption,
  on = 'paper',
  plateWidth,
  className,
}: {
  heading: string
  lead?: string
  src: string
  /**
   * What the capture shows, for a reader who cannot see it. The key below
   * carries the callout letters as real text but cannot say where they sit, so
   * this has to describe the screen rather than name it.
   */
  alt: string
  /** Intrinsic size of the file. */
  width: number
  height: number
  /**
   * Crop the plate to this ratio, written `w/h`. The capture is cover-fitted
   * and held against `anchor`, so the trim comes off the far edge.
   *
   * Every console capture here needed one. A screen grabbed at 1344×875 carries
   * three hundred pixels of empty workspace under the content, and printed
   * whole it argues that the product is mostly empty.
   */
  aspect?: string
  /**
   * Which edge the crop keeps. `right` drops the console's left nav — used on
   * the jetty shot, where the claim is that the crew never gets to see it.
   */
  anchor?: 'top' | 'right'
  /** Dashes the mount. For a sketch of something that is not built yet. */
  provisional?: boolean
  callouts?: readonly Callout[]
  /** The last word on the figure. Where a caveat goes, when it has one. */
  caption?: string
  /** The band this sits in, so the mount stays visible against it. */
  on?: 'paper' | 'mist'
  /**
   * Caps the plate in px, for a capture whose native size is small — upscaling
   * a 461px-wide widget to the full column softens every edge in it and makes a
   * crisp product look blurry.
   *
   * Setting it also moves the key alongside the plate rather than under it: a
   * narrow figure with a full-width key beneath reads as two unrelated objects.
   */
  plateWidth?: number
  className?: string
}) {
  const beside = plateWidth !== undefined

  return (
    <figure className={className}>
      <figcaption>
        <p className="type-subhead text-ink">{heading}</p>
        {lead ? <Copy text={lead} className="type-body-sm text-mute measure mt-3" /> : null}
      </figcaption>

      <div
        className={cn(
          'mt-6',
          /* Centred, not top-aligned: a narrow plate beside a two-line key
             hangs a column of dead space under the words. */
          beside && 'grid gap-x-8 gap-y-6 sm:grid-cols-[minmax(0,var(--plate))_1fr] sm:items-center',
        )}
        style={beside ? ({ '--plate': `${plateWidth}px` } as CSSProperties) : undefined}
      >
        {/*
          A mat, not a card. One step of ground darker than the band it sits on,
          a hairline round it, and 6px of margin — which is what gives a capture
          whose own background is white an edge to end on. A shadow would lift it
          off the page, and nothing on this page is lifted off the page.
        */}
        <div
          className={cn(
            on === 'mist' ? 'bg-mist-deep' : 'bg-mist',
            'border-hairline-strong rounded-md border p-1.5',
            provisional && 'border-dashed',
          )}
        >
          <div
            className="bg-paper relative overflow-hidden rounded-sm"
            style={aspect ? { aspectRatio: aspect } : undefined}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="(min-width: 1024px) 900px, 100vw"
              className={cn(
                'block w-full',
                aspect ? 'absolute inset-0 h-full object-cover' : 'h-auto',
                anchor === 'right' ? 'object-right-top' : 'object-top',
              )}
            />

            {callouts.map((callout) => (
              <span
                key={callout.letter}
                /* `ring-paper` rather than a border: the badge lands on whatever
                   pixel happens to be under it and has to separate from that
                   without growing a second frame. */
                className={cn(
                  marker,
                  'ring-paper absolute -translate-x-1/2 -translate-y-1/2 ring-2',
                )}
                style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
                aria-hidden
              >
                {callout.letter}
              </span>
            ))}
          </div>
        </div>

        {callouts.length > 0 ? (
          <dl className={cn('grid gap-x-8 gap-y-3.5', beside ? '' : 'mt-5 sm:grid-cols-2')}>
            {callouts.map((callout) => (
              <div key={callout.letter} className="flex gap-3">
                <dt className={marker}>{callout.letter}</dt>
                <dd className="type-caption text-mute pt-0.5">{callout.text}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {caption ? (
        <p className="type-caption text-faint mt-4">{caption}</p>
      ) : null}
    </figure>
  )
}
