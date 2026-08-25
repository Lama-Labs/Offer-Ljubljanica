import { route } from '@/content/copy'
import { IconTile } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

/**
 * The guest's path, from the search box to the jetty.
 *
 * ## Why this one is drawn as a sequence
 *
 * It is the only genuinely ordered thing on the page. Everything else — the
 * three claims, the six objections, the nine features of the booking system —
 * is a set, and drawing a set as a sequence tells the reader something untrue
 * about it.
 *
 * ## Why the stops are not numbered
 *
 * Numerals here would collide with the part index, which is the one numbering
 * system this page maintains. A rail with four stops already reads left to
 * right; counting them adds nothing and costs the `01` `02` `03` their meaning.
 *
 * ## The tear
 *
 * A squiggle runs down between the first stop and the second, marking where the
 * guest's path ends today. It is the whole case for a second website in one
 * mark: everything to the right of it is what does not currently happen.
 *
 * It is a torn edge rather than a dashed rule or a red bar, because a tear is
 * what this is — the path is not optional after that point, it is severed — and
 * because a wavy line is the one thing in this graphic that could not be
 * mistaken for part of the route. The rail behind it stays solid: it is drawing
 * the path the new site creates, and breaking the drawing in the section that
 * argues for the fix would be arguing against it.
 *
 * The mark is grey, not `{signal}`. Red on this page reports what is in the
 * offer, and a red tear would be the accent's second meaning inside one figure.
 */

/**
 * A torn edge, stretched along its long axis.
 *
 * `preserveAspectRatio="none"` lets one path fill any height, and
 * `vector-effect="non-scaling-stroke"` stops the line thinning out as it does —
 * without it, a squiggle stretched over 160px draws at a fraction of a pixel and
 * disappears on a non-retina screen.
 */
function Squiggle({
  direction,
  className,
}: {
  direction: 'vertical' | 'horizontal'
  className?: string
}) {
  const vertical = direction === 'vertical'

  return (
    <svg
      viewBox={vertical ? '0 0 12 100' : '0 0 100 12'}
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      className={cn('overflow-visible', className)}
      aria-hidden
    >
      <path
        d={
          vertical
            ? 'M6 0 Q12 5 6 10 T6 20 T6 30 T6 40 T6 50 T6 60 T6 70 T6 80 T6 90 T6 100'
            : 'M0 6 Q5 0 10 6 T20 6 T30 6 T40 6 T50 6 T60 6 T70 6 T80 6 T90 6 T100 6'
        }
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function GuestRoute() {
  return (
    <figure className="mt-14">
      <figcaption>
        <p className="label-mono text-faint flex items-center gap-2.5">
          <span className="bg-hairline-strong inline-block h-px w-6" aria-hidden />
          {route.label}
        </p>
        <p className="type-subtitle text-ink mt-3">{route.heading}</p>
      </figcaption>

      <div className="relative mt-6">
        {/*
          A 2rem gutter between the columns, which the connector then bridges
          with a negative margin. The rail used to run column-to-column with no
          gutter at all, and there was nowhere to put the tear that was not on
          top of a tile or through a line of text.
        */}
        <ol className="grid gap-y-6 sm:grid-cols-4 sm:gap-x-8">
          {route.steps.map((step, index) => (
            <li key={step.title}>
              <div className="flex items-center gap-3">
                <IconTile name={step.icon} />
                {index < route.steps.length - 1 ? (
                  <span className="bg-hairline hidden h-px flex-1 sm:-mr-8 sm:block" aria-hidden />
                ) : null}
              </div>

              <p className="type-item text-ink mt-4">{step.title}</p>
              <p className="type-caption text-mute mt-1">{step.body}</p>

              {/* Stacked, the tear runs across rather than down, and there is
                  only one place it can go — under the step the guest reaches. */}
              {index === 0 ? (
                <span className="text-faint mt-5 block h-3 w-full sm:hidden">
                  <Squiggle direction="horizontal" className="h-full w-full" />
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        {/*
          Laid over the columns rather than inserted between them — a list item
          would be counted as a fifth step by anything reading the list.

          The offset is the centre of the first gutter, computed rather than
          guessed: four columns and three 2rem gaps put it at
          `(100% - 6rem) / 4 + 1rem`. A flat `25%` is only correct when the
          gutters are zero, and lands on the second tile as soon as they are not.
        */}
        <span
          className="text-faint pointer-events-none absolute inset-y-0 left-[calc((100%-6rem)/4+1rem)] hidden w-3 -translate-x-1/2 sm:block"
          aria-hidden
        >
          <Squiggle direction="vertical" className="h-full w-full" />
        </span>
      </div>

      <p className="type-caption text-mute border-hairline mt-6 flex items-center gap-2.5 border-t pt-4">
        {/* The same mark at legend size, so the sentence is visibly about the
            line above rather than a general remark. */}
        <span className="text-faint inline-block h-2.5 w-4 shrink-0">
          <Squiggle direction="horizontal" className="h-full w-full" />
        </span>
        {route.today}
      </p>
    </figure>
  )
}
