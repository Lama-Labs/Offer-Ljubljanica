'use client'

import { ArrowRightIcon, CheckIcon } from 'lucide-react'

import { hero as heroCopy, parts as partCopy, summary as summaryCopy } from '@/content/copy'
import { offerParts, type OfferPart, type OfferPartId } from '@/content/offer'
import { useOfferSelection } from '@/components/offer-selection'
import { Icon } from '@/components/ui/icon'
import { packageBrackets } from '@/lib/pricing'
import { cn } from '@/lib/utils'

/**
 * The part index — the one device this page is built around, and now also the
 * control that builds the offer.
 *
 * ## What it is
 *
 * Three numerals, `01` `02` `03`, one per part. They appear on the hero cards,
 * beside every section heading and on every row of the summary, and they always point at the same three things. Red means the part is
 * in the offer; grey means it is not. Once a reader has met that in the hero
 * they can read the state of the offer from any screenful without scrolling to
 * the total.
 *
 * ## Why selection lives here rather than at the foot of each section
 *
 * The earlier build put a price card with a toggle under every part. Three of
 * them, each repeating a name and a price the reader had already seen, and each
 * one a fresh decision at the exact moment the section was trying to explain
 * something. Moving selection into the index means the offer is configured in
 * one place, from a control the reader meets before they have read a word of
 * argument — and the sections get to be what they are, which is prose.
 *
 * ## Two targets, one card
 *
 * The circle selects. The rest of the card opens the part. They are separate
 * elements rather than one button doing both, because a control that toggles on
 * some pixels and navigates on others is a control nobody trusts twice.
 *
 * ## The brackets
 *
 * Under the cards sit the two packages, each drawn as a bracket spanning the
 * parts it covers: `Paket Zagon` under `01` and `02`, `Paket Celota` under all
 * three. They nest, narrowest first, the way a grouping notation does — so the
 * two ways of buying are a shape rather than a sentence, and a reader sees that
 * the second contains the first without being told.
 *
 * Each goes red only while every part it needs is switched on. That is the whole
 * persuasion: leave `03` out and the wider bracket sits there in grey, saying
 * there is another way to do this without asking for anything.
 *
 * No money on them. What a package is worth belongs with the totals, where the
 * figure can be compared against the alternative rather than read alone.
 */

/** The numeral. `01`, never `1` — a two-digit index reads as a system. */
export function PartNumber({
  number,
  active,
  className,
}: {
  number: number
  active: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'num-sm tabular-nums transition-colors duration-150',
        active ? 'text-signal' : 'text-faint',
        className,
      )}
    >
      {String(number).padStart(2, '0')}
    </span>
  )
}

/**
 * The circle.
 *
 * A ring rather than a square, and filled rather than ticked-in-place, so that
 * the answer to "is this in?" survives being seen out of the corner of an eye at
 * arm's length. `aria-pressed` and a spoken label do the work the shape cannot:
 * on its own it is a circle, and a screen reader would have nothing to say about
 * it.
 */
export function SelectCircle({
  id,
  name,
  className,
}: {
  id: OfferPartId
  name: string
  className?: string
}) {
  const { isSelected, toggle } = useOfferSelection()
  const selected = isSelected(id)

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={selected}
      aria-label={`${name} — ${selected ? heroCopy.cardRemove : heroCopy.cardAdd}`}
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-150',
        selected
          ? 'border-signal bg-signal text-on-signal'
          : 'border-hairline-strong text-transparent hover:border-ink hover:text-hairline-strong',
        className,
      )}
    >
      <CheckIcon className="size-4" strokeWidth={2.5} aria-hidden />
    </button>
  )
}

function PartCard({ part }: { part: OfferPart }) {
  const { isSelected } = useOfferSelection()
  const selected = isSelected(part.id)

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg border p-5 transition-colors duration-150',
        selected ? 'border-signal/45 bg-paper' : 'border-hairline bg-paper',
      )}
    >
      <SelectCircle id={part.id} name={part.name} className="absolute top-4 right-4" />

      <a href={`#${part.id}`} className="group flex flex-1 flex-col">
        <span className="flex items-center gap-2.5">
          {/* Always accent: the mark says *which part*, and the numeral and the
              circle beside it say whether it is in. Fading it too would leave
              the card with three things all reporting the same fact. */}
          <Icon name={part.icon} className="text-signal" />
          <PartNumber number={part.number} active={selected} />
        </span>

        <span className="type-item text-ink mt-4 block">{part.name}</span>
        <span className="type-caption text-mute mt-1 block flex-1">{part.summary}</span>

        <span
          className={cn(
            'label-mono mt-5 flex items-center gap-1.5 transition-colors duration-150',
            'text-faint group-hover:text-ink',
          )}
        >
          {heroCopy.cardCta}
          <ArrowRightIcon
            className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        </span>
      </a>
    </div>
  )
}

export function PartIndexCards() {
  const { isSelected } = useOfferSelection()

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {offerParts.map((part) => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>

      {packageBrackets.length > 0 ? (
        <>
          {/*
            The brackets proper: a rule under the cards each package covers, ends
            turned up towards them. Column and row are set inline rather than as
            classes because both come from the price file — a package added to
            `offer.ts` has to draw itself, and Tailwind cannot generate a class
            for a span it has never seen.

            Drawn only where there are columns to span: below `sm` the cards are
            stacked and a bracket would be pointing at one card.
          */}
          <div className="mt-2 hidden gap-x-3 gap-y-2 sm:grid sm:grid-cols-3">
            {packageBrackets.map(({ rule, start, span }, index) => {
              const active = rule.requires.every((id) => isSelected(id))

              return (
                <div
                  key={rule.id}
                  style={{ gridColumn: `${start} / span ${span}`, gridRow: index + 1 }}
                >
                  <div
                    className={cn(
                      'h-3 rounded-b-md border-x border-b transition-colors duration-150',
                      active ? 'border-signal/45' : 'border-hairline-strong',
                    )}
                    aria-hidden
                  />
                  <p
                    className={cn(
                      'label-mono mt-2 text-center transition-colors duration-150',
                      active ? 'text-signal' : 'text-mute',
                    )}
                  >
                    {rule.label}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Stacked: the same two facts, without the geometry. */}
          <ul className="mt-4 space-y-2 sm:hidden">
            {packageBrackets.map(({ rule, parts }) => {
              const active = rule.requires.every((id) => isSelected(id))

              return (
                <li
                  key={rule.id}
                  className={cn(
                    'label-mono rounded-md border px-4 py-3',
                    active ? 'border-signal/45 text-signal' : 'border-hairline-strong text-mute',
                  )}
                >
                  {parts.map((part) => String(part.number).padStart(2, '0')).join(' + ')} —{' '}
                  {rule.label}
                </li>
              )
            })}
          </ul>
        </>
      ) : null}
    </div>
  )
}

/**
 * What leaving a part out actually means, at the foot of that part's section.
 *
 * The selector that used to sit here is gone, and this is the half of it worth
 * keeping: a proposal that only ever describes the upside of saying yes reads as
 * a brochure, and naming the consequence of no is what makes the rest of the
 * page believable. It appears only while the part is out, because that is the
 * only time the sentence is about anything.
 *
 * It carries no control on purpose. The reader has just finished reading the
 * argument; the two places to act on it are the cards at the top of the page and
 * the summary at the bottom, and a third control here would be a third place to
 * change your mind about the same three things.
 */
export function PartAbsenceNote({ id }: { id: OfferPartId }) {
  const { isSelected } = useOfferSelection()

  const without = partCopy[id].without
  if (!without || isSelected(id)) return null

  return (
    <div className="border-hairline-strong mt-12 rounded-lg border border-dashed p-5 sm:p-6">
      <p className="label-mono text-faint">{summaryCopy.absenceLabel}</p>
      <p className="type-body-sm text-mute measure mt-2">{without}</p>
    </div>
  )
}
