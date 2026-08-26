'use client'

import { CheckIcon } from 'lucide-react'

import { problems, summary as summaryCopy } from '@/content/copy'
import { offerParts, type OfferPart, type OfferPartId } from '@/content/offer'
import { useOfferSelection } from '@/components/offer-selection'
import { Copy } from '@/components/ui/copy'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

/**
 * The part index — the one device this page is built around.
 *
 * ## What it is
 *
 * Three numerals, `01` `02` `03`, one per part, each with the part's own mark
 * beside it. They appear on the hero cards, at the head of every part section
 * and on every row of the summary, and they always point at the same three
 * things. Colour means the part is in the offer; grey means it is not. Once a
 * reader has met that in the hero they can read the state of the offer from any
 * screenful without scrolling to the total.
 *
 * ## Three colours, one per part
 *
 * The mark is drawn in the part's own hue — teal for the booking system, blue
 * for the tourist site, purple for the redesign — and that hue is the accent
 * for the whole of that part's section: its feature icons, its exhibit chips,
 * its selected border. So the card at the top and the section eleven screens
 * down are recognisably the same object, and a reader who lands mid-page knows
 * which of the three they are in before reading a word.
 *
 * The card and the section open with the identical cluster — tile, then numeral
 * — for the same reason. It is the part's letterhead.
 *
 * ## The cards are not controls
 *
 * They were, briefly: a circle in the corner put the part in the offer, and the
 * card body jumped to its section. Both are gone. The hero is where the reader
 * is still working out *what is being proposed*, and every control there asks
 * for a decision — to buy, or to leave — at the one moment they have nothing to
 * base it on. So the cards state the offer and nothing else; the reader scrolls,
 * which is what they were going to do anyway, and configures at the bottom once
 * the case for each part has been made. The numeral still reports the state —
 * red for in, grey for out — because reading it back is worth doing anywhere on
 * the page.
 */

/** The numeral. `01`, never `1` — a two-digit index reads as a system. */
export function PartNumber({
  number,
  active,
  size = 'sm',
  className,
}: {
  number: number
  active: boolean
  /** `md` where the numeral leads a card or a section; `sm` in a list. */
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <span
      className={cn(
        size === 'md' ? 'num-md' : 'num-sm',
        'tabular-nums transition-colors duration-150',
        active ? 'text-accent' : 'text-faint',
        className,
      )}
    >
      {String(number).padStart(2, '0')}
    </span>
  )
}

/**
 * The part's letterhead: its mark in a tile, its numeral beside it.
 *
 * Used at the top of the hero card and again at the head of the part's own
 * section, at the same size both times. The repetition is the point — it is the
 * one thing that says the card and the section are the same object, and it does
 * it without either of them having to say so in words.
 *
 * The tile is always the part's hue, because it answers *which part*. The
 * numeral answers *is it in*, so it greys out when the part is not. Two
 * questions, two elements, neither one guessing at the other's answer.
 *
 * The caller supplies the `data-part` scope; this reads `accent` and does not
 * care which of the three it turns out to be.
 */
export function PartMark({
  part,
  layout = 'letterhead',
  className,
}: {
  part: OfferPart
  /**
   * Which of the mark's two forms this is.
   *
   * `letterhead` is the original: the drawing in a filled tile with the numeral
   * beside it, reading left to right. It opens the hero card and the part's own
   * section, where it has a whole block under it to head and the tile is what
   * gives it the weight to do that.
   *
   * `stacked` is the summary row: numeral over drawing, no tile, centred. Three
   * letterheads down a column put three filled rectangles beside three filled
   * selection circles, and the row stopped reading as *circle, then part*.
   * Stacking narrows the cluster to one column so the row is four things across
   * rather than five, and the numeral rides on top where it lines up with the
   * part's name rather than with its one-line summary.
   */
  layout?: 'letterhead' | 'stacked'
  className?: string
}) {
  const { isSelected } = useOfferSelection()
  const stacked = layout === 'stacked'

  const numeral = <PartNumber number={part.number} active={isSelected(part.id)} size="md" />

  const drawing = (
    <span
      className={cn(
        'text-accent flex shrink-0 items-center justify-center',
        !stacked && 'bg-accent-wash size-11 rounded-lg',
      )}
    >
      <Icon name={part.icon} className="size-[22px]" />
    </span>
  )

  /* Order is the difference, so the two forms are one component rather than two
     that would drift apart the next time the numeral changes. */
  return stacked ? (
    <span className={cn('flex flex-col items-center gap-1', className)}>
      {numeral}
      {drawing}
    </span>
  ) : (
    <span className={cn('flex items-center gap-3', className)}>
      {drawing}
      {numeral}
    </span>
  )
}

/**
 * The problem the part answers, set above it.
 *
 * ## Why it carries no mark
 *
 * Every other block on this page that has a title and a sentence gets one — an
 * icon tile, a numeral, a bordered card. This one gets none, because the card
 * directly beneath it already opens with the part's letterhead, and a second
 * head in the same column leaves the reader deciding which of the two the
 * column is actually about. The problem is the sentence before the offer, not a
 * fourth card.
 *
 * ## Why it greys when the part is out
 *
 * A problem whose answer has been declined is a problem nothing in the offer
 * currently addresses, and the hero should be readable as that from across the
 * room. So the title steps from `ink` to `mute` and the sentence from `mute` to
 * `faint` — one stop each, which is enough to tell three columns apart at a
 * glance and not enough to stop anybody reading the one that greyed.
 *
 * The card underneath does not move. It is still the thing being offered and it
 * still has to be legible enough to be reconsidered; what dims is the pair above
 * it — the problem and the line down to the answer — because that pair is the
 * claim that has come apart.
 *
 * ## Why the title is an `h2`
 *
 * It is the first heading under the page's `h1`, and it is the reader's own
 * words for what is wrong. Demoting it to `h3` to keep it visually junior to the
 * section headings further down would leave a level of the outline occupied by
 * nothing.
 */
function ProblemBlock({ id }: { id: OfferPartId }) {
  const { isSelected } = useOfferSelection()
  const addressed = isSelected(id)
  const problem = problems[id]

  return (
    <div>
      <h2
        className={cn(
          'type-item transition-colors duration-150',
          addressed ? 'text-ink' : 'text-mute',
        )}
      >
        {problem.title}
      </h2>

      <Copy
        text={problem.body}
        className={cn(
          'type-body-sm mt-2 transition-colors duration-150',
          addressed ? 'text-mute' : 'text-faint',
        )}
      />
    </div>
  )
}

/**
 * The line from the problem down to the part that answers it.
 *
 * Drawn in the part's own hue, at the strength `border-accent-soft` uses. Inside
 * the column's `data-part` scope it needs no argument for that: it asks for
 * `accent` and gets the right one of the three. At full strength three of these
 * would read as a diagram of the offer rather than as a connector between two
 * blocks that are already next to each other.
 *
 * Out of the offer it loses the hue for `hairline-strong` — lighter than the
 * greyed problem above it rather than darker. A dead line should be the quietest
 * thing in the column: its whole meaning was *this connects to that*, and there
 * is no longer anything at the far end of it worth pointing at.
 *
 * `aria-hidden`, because what it says is already said by the order: the problem
 * is read, then the part that answers it. An arrow announced in between is a
 * third thing to interpret rather than the relationship itself.
 */
function ProblemArrow({ id }: { id: OfferPartId }) {
  const { isSelected } = useOfferSelection()

  return (
    <span
      className={cn(
        'flex justify-center py-5 transition-colors duration-150',
        isSelected(id) ? 'text-accent-soft' : 'text-hairline-strong',
      )}
      aria-hidden
    >
      <svg
        width="12"
        height="24"
        viewBox="0 0 12 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 0.75V22" />
        <path d="M1.75 17.5L6 22.5L10.25 17.5" />
      </svg>
    </span>
  )
}

function PartCard({ part }: { part: OfferPart }) {
  const { isSelected } = useOfferSelection()
  const selected = isSelected(part.id)

  return (
    <div
      className={cn(
        'bg-paper flex flex-col rounded-lg border p-5 transition-colors duration-150',
        selected ? 'border-accent-soft' : 'border-hairline',
      )}
    >
      <PartMark part={part} />

      <span className="type-item text-ink mt-5 block">{part.name}</span>
      <span className="type-caption text-mute mt-1 block flex-1">{part.summary}</span>
    </div>
  )
}

/**
 * One column of the hero: a problem, an arrow, the part that answers it.
 *
 * ## Why the column is the unit and not the row
 *
 * Set as a row of three problems above a row of three cards, the arrows line up
 * with their targets only while the grid is three across. On a phone it
 * collapses to one column and the third problem lands directly above the first
 * card with an arrow between them — a layout making a claim that is false.
 *
 * So the unit is the column, and all three of its blocks are one element:
 * problem, arrow, card. Narrow, that stacks into three problem-and-answer pairs,
 * each one whole. Wide, `grid-rows-subgrid` hands the three columns a shared set
 * of row heights, so the arrows sit on one line and the cards start level
 * however far the longest problem wraps — which three independent flex columns
 * could not do without measuring something.
 *
 * `data-part` moves up here from the card, because the arrow needs the part's
 * hue as well and the scope is what supplies it. Everything inside asks for
 * `accent`; none of it names a part.
 */
function PartColumn({ part }: { part: OfferPart }) {
  return (
    <div data-part={part.id} className="grid sm:row-span-3 sm:grid-rows-subgrid">
      <ProblemBlock id={part.id} />
      <ProblemArrow id={part.id} />
      <PartCard part={part} />
    </div>
  )
}

export function PartIndexColumns() {
  return (
    /*
      No row gap once the grid is three across: with `subgrid` the gap belongs to
      this grid rather than to the column, and the arrow already carries its own
      padding above and below. A gap here as well would space the column twice.
      Narrow, the same property is doing a different job — it is the space
      between one problem-and-answer pair and the next.
    */
    <div className="grid gap-y-12 sm:grid-cols-3 sm:grid-rows-[auto_auto_1fr] sm:gap-x-3 sm:gap-y-0">
      {offerParts.map((part) => (
        <PartColumn key={part.id} part={part} />
      ))}
    </div>
  )
}

/**
 * The mark that says a part is in the offer: filled with a check, or an empty
 * ring waiting for one.
 *
 * Shared by the summary row and the switch at the foot of each part's section,
 * because they are the same statement made in two places and a reader who has
 * learnt to read one has learnt to read the other. Both states are the same
 * size — the check is present either way and merely transparent when the part
 * is out — so nothing beside it moves as the reader toggles.
 */
export function OfferDot({ selected, className }: { selected: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-full border-2',
        'transition-colors duration-150',
        selected ? 'border-accent bg-accent text-on-accent' : 'border-accent-soft text-transparent',
        className,
      )}
      aria-hidden
    >
      <CheckIcon className="size-4" strokeWidth={2.5} />
    </span>
  )
}

/**
 * The switch at the foot of a part's section.
 *
 * ## Where it sits
 *
 * On the title line, at the far edge of the section, beside the letterhead
 * rather than at the foot of the argument. A control the reader has to reach
 * the bottom of a section to find is one most of them never see; on the title
 * line it is in the first screenful of every part, and acting on it before or
 * after reading the case is then the reader's choice rather than the layout's.
 *
 * ## Why it is always drawn
 *
 * A dashed panel used to sit here and only while the part was *out*, carrying a
 * paragraph on what leaving it out would mean. Switching a part on made that
 * panel vanish, which shortened the page under the reader's cursor and threw
 * everything below it upwards — the reader pressed a button and the document
 * jumped. A control that is always present, changing only its fill and its
 * label, costs the same height in both states and moves nothing.
 *
 * ## Why the label states rather than instructs
 *
 * `V ponudbi` is what is true; `Dodaj v ponudbo` is what pressing it would do.
 * They are different kinds of sentence on purpose. There is nothing to do to a
 * part that is already in, so a button reading `Odstrani` would advertise an
 * action nobody came here for — but the same control still removes it, and
 * `aria-pressed` is what tells a screen reader that this is a toggle rather
 * than two buttons that happen to share a place.
 */
export function PartOfferToggle({ id }: { id: OfferPartId }) {
  const { isSelected, toggle } = useOfferSelection()
  const selected = isSelected(id)

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={selected}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center gap-3 rounded-xl border px-5 py-4',
        'transition-colors duration-150',
        /* Fill means in and outline means out, the same way round as the summary
           rows. `accent-tint` rather than paper, because a part section may be
           banded either paper or mist and a white fill disappears on one of
           them. */
        selected
          ? 'bg-accent-tint border-transparent hover:border-accent-soft'
          : 'border-accent-soft hover:bg-accent-tint',
      )}
    >
      <OfferDot selected={selected} />
      <span className="type-item text-ink">
        {selected ? summaryCopy.inOffer : summaryCopy.addToOffer}
      </span>
    </button>
  )
}
