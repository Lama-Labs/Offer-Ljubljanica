'use client'

import { type ReactNode } from 'react'

import { summary } from '@/content/copy'
import { terms } from '@/content/offer'
import { useOfferSelection } from '@/components/offer-selection'
import { ContactActions } from '@/components/contact-actions'
import { SUMMARY_ANCHOR } from '@/lib/anchors'
import { OfferDot, PartMark } from '@/components/part-index'
import { buttonClasses } from '@/components/ui/button'
import { Section, SectionHeader } from '@/components/ui/section'
import { eur } from '@/lib/format'
import { type QuoteLine } from '@/lib/pricing'
import { cn } from '@/lib/utils'

/**
 * The two fees on a summary row: the headline one first and larger, the other
 * under it as a footnote.
 *
 * ## Why the order is not the same on every row
 *
 * Which fee leads is the part's own answer — `leadWith` in `offer.ts` — because
 * the two kinds of part are bought differently. A booking system is bought by
 * the month, and the afternoon of setup behind it is a detail; a website is
 * bought for what it costs to build, and the maintenance is what comes after.
 * Leading every row with the recurring figure, as this did while the booking
 * system was the only part that had one, would put `40 €` at the top of a
 * €1.000 redesign — the smallest number on the row standing in for the largest
 * commitment on it.
 *
 * A part with one fee leads with it and has no footnote, so nothing here has to
 * special-case the shape of the price list.
 */
type Fee = {
  key: string
  figure: string
  /** The list price, struck through, when this offer charges less. */
  before: string | null
  /** What the figure is, including the separator that precedes it. */
  label: string
}

function PartPrice({ line }: { line: QuoteLine }) {
  const { part } = line

  const monthly: Fee | null =
    part.monthly === null
      ? null
      : {
          key: 'monthly',
          figure: eur(line.monthly),
          before: line.monthly === line.listMonthly ? null : eur(line.listMonthly),
          /* Both fees are labelled now that both exist on every row: two lines
             reading `40 € / mes.` with nothing to tell them apart would read as
             one service billed twice. */
          label: ` / mes.${part.monthlyLabel ? ` ${part.monthlyLabel}` : ''}`,
        }

  const oneOff: Fee | null = !part.oneOff
    ? null
    : {
        key: 'oneOff',
        figure: eur(line.oneOff),
        /*
          One strikethrough, whatever moved the price. A part can be discounted
          twice over — a standing concession on its list price and a bundle rule
          on top — and striking each step in turn would put three figures on a row
          that has room to be read at a glance. So the struck figure is always
          what the part lists at and the plain one is always what it costs today,
          which is the comparison the reader is making.
        */
        before: line.oneOff === line.listOneOff ? null : eur(line.listOneOff),
        label: ` ${part.oneOffLabel}`,
      }

  const fees = (part.leadWith === 'monthly' ? [monthly, oneOff] : [oneOff, monthly]).filter(
    (fee): fee is Fee => fee !== null,
  )

  return (
    <span className="ml-auto shrink-0 text-right">
      {fees.map((fee, index) => (
        <span
          key={fee.key}
          className={cn('block', index === 0 ? 'num-md text-ink' : 'num-sm text-mute')}
        >
          {/* `+` on the second fee, so two figures on one row read as one
              price with two parts rather than as a choice between them. */}
          {index > 0 ? '+ ' : null}
          {/* The concession, on the line it applies to. Struck and one step
              fainter, so the figure actually charged stays the one being read. */}
          {fee.before ? (
            <span className="text-faint whitespace-nowrap line-through">{fee.before} </span>
          ) : null}
          {/* The figure never breaks; the label may. `1.000` split across two
              lines, or a row wide enough to scroll the page sideways, are the
              two ways this goes wrong at phone width. */}
          <span className="whitespace-nowrap">{fee.figure}</span>
          <span className="type-caption text-mute">{fee.label}</span>
        </span>
      ))}
    </span>
  )
}

/**
 * What the offer takes off one total, summed, above the figure it comes off.
 *
 * ## Why one figure and not a list
 *
 * Every discount landing on the monthly bill is one number to the reader, and
 * every discount landing on the one-off is another. Which rule granted which
 * share of it is a question the panel used to answer in five rows, and answering
 * it cost more attention than the answer was worth. The rows below still show
 * the concessions where they land — struck list price beside charged price, on
 * the line that moved — so the attribution survives one column to the left.
 *
 * ## Why green
 *
 * Because the figure directly under it is the opposite sign and two centimetres
 * away. `−250 €` in the same ink as `550 €` is a number the reader has to parse
 * before they know whether it is being added or taken off; in green they know
 * before they read it. It is the only green on the page and it means one thing.
 *
 * Renders nothing when there is no saving, so both totals can call it without
 * guarding their own case.
 */
function Saving({ off, per = '' }: { off: number; per?: string }) {
  if (off <= 0) return null

  return (
    <span className="num-sm text-savings mb-1.5 block">
      {/* Two characters and a number; what it is goes unsaid on screen and has
          to be said to a reader who is hearing the page. */}
      <span className="sr-only">{summary.discountLabel}: </span>−{eur(off)}
      {per}
    </span>
  )
}
/**
 * The offer as the reader has built it — three switchable rows and what they
 * come to.
 *
 * ## Why the panel is quiet
 *
 * It was the page's one saturated surface: a postcard of `signal` with white
 * figures on it, on the argument that the panel *is* the offer and red meant
 * money. It read as a warning. A block that loud is the last thing a reader
 * needs at the moment they are doing arithmetic, so the panel is paper inside a
 * hairline like every other card, its figures are ink, and the only colour in it
 * is the green on what the offer takes off. Red survives as the fill of the one
 * button, where it is a control rather than a surface.
 *
 * ## Why every part is switchable here too
 *
 * By the time somebody reaches this section they have read all three arguments
 * and are comparing them against each other rather than against nothing. That is
 * a different decision from the one they made in the section above, and making
 * them scroll back up to change their mind is friction applied at precisely the
 * wrong moment — the moment they are deciding.
 *
 * ## Why the rows carry the numerals
 *
 * So that a row here and a section up there are recognisably the same object. It
 * is the reason the index exists: a reader who unticks `02` knows exactly which
 * argument they just declined without reading its name.
 */
export function OfferSummary({ children }: { children?: ReactNode }) {
  const { quote, toggle, reset } = useOfferSelection()

  return (
    <Section id={SUMMARY_ANCHOR} tone="mist">
      <SectionHeader
        heading={quote.isEmpty ? summary.emptyHeading : summary.heading}
        lead={quote.isEmpty ? summary.emptyBody : summary.lead}
      />

      <div className="mt-10 grid items-start gap-4 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-y-3">
          {quote.lines.map((line) => {
            const { part, selected } = line

            return (
              <button
                key={part.id}
                type="button"
                data-part={part.id}
                onClick={() => toggle(part.id)}
                aria-pressed={selected}
                className={cn(
                  /*
                    Wrapping, not truncating. `PartPrice` keeps each figure
                    unbreakable — "1.000" split across two lines is worse than
                    any layout it could save — so at phone width the whole price
                    block drops onto its own line rather than pushing the row
                    wider than the screen and cutting the euro signs off.

                    In the offer is a filled card; out of it is an outline. That
                    is the same statement the selection circle makes, at the size
                    of the whole row — a reader glancing at the column sees which
                    parts they have taken without reading a word, and the ones
                    they have declined stay legible instead of greying out.

                    The border is always drawn and merely turns transparent when
                    the row is filled, so nothing shifts by a pixel as the reader
                    toggles rows on and off.

                    Hover previews the other state. An outlined row fills white;
                    a filled row half-empties towards the outline, so the reader
                    can see what dropping this part would do before they do it.

                    Half rather than all the way: at full transparency the card
                    was a transparent box inside a transparent border, and it did
                    not fade so much as vanish. Fifty per cent keeps it on the
                    page while making it plainly the weaker of the two states.
                  */
                  'flex w-full cursor-pointer flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border p-4 text-left',
                  'transition-colors duration-150 sm:flex-nowrap sm:p-5',
                  selected
                    ? 'bg-paper border-transparent hover:bg-paper/70 hover:border-accent-soft'
                    : 'border-accent-soft bg-transparent hover:bg-paper',
                )}
              >
                {/* The same mark the switch at the foot of each part's
                    section carries, leading the row rather than closing it: a
                    reader scanning the left edge reads all three states without
                    their eye leaving the column. */}
                <OfferDot selected={selected} />

                {/* The part's letterhead — the same tile and numeral that head
                    its card and its section, so the row is recognisably the
                    same object rather than a line item that shares its name. */}
                <PartMark part={part} layout="stacked" />

                <span className="min-w-[9rem] flex-1">
                  <span className="type-item text-ink block">{part.name}</span>
                  <span className="type-caption text-mute mt-0.5 block">{part.summary}</span>
                </span>

                <PartPrice line={line} />
              </button>
            )
          })}

          {quote.isEmpty ? (
            <button type="button" onClick={reset} className={buttonClasses('primary', 'w-full')}>
              {summary.restore}
            </button>
          ) : null}
        </div>

        {/* The offer, as the two things it will cost. */}
        <div className="border-hairline bg-paper rounded-xl border p-6 sm:p-7">
          <dl>
            {/*
              The recurring fee first, and smaller.

              It is the figure that outlives the project: the one-off is paid
              once and forgotten, this one arrives every month for as long as the
              offer runs. Leading with it puts the commitment above the invoice.
              The one-off gets the size instead, being the larger number and the
              one that decides whether the offer is affordable at all — order
              says which matters longer, scale says which is bigger.

              The savings sit above the figures they come off, one summed number
              each, so the panel reads as *this is what you are not paying, this
              is what you are*.
            */}
            <div className="border-hairline flex items-end justify-between gap-4 border-b pb-5">
              <dt className="type-body-sm text-mute">{summary.monthlyLabel}</dt>
              <dd className="text-right">
                <Saving off={quote.monthlyDiscount} per=" / mes." />
                <span className="num-lg text-ink block leading-none">
                  {eur(quote.monthly)}
                  <span className="type-caption text-mute"> / mesec</span>
                </span>
              </dd>
            </div>

            <div className="border-hairline flex items-end justify-between gap-4 border-b py-5">
              <dt className="type-body-sm text-mute">{summary.oneOffLabel}</dt>
              <dd className="text-right">
                <Saving off={quote.oneOffDiscount} />
                <span className="num-xl text-ink block leading-none">{eur(quote.oneOffTotal)}</span>
              </dd>
            </div>
          </dl>

          {/* The terms close the block rather than trailing off it — the rule
              above them is the same hairline that separates the two figures, so
              the panel reads as three bands and not as two figures with a
              paragraph loose underneath. */}
          <p className="type-caption text-mute mt-5">
            {terms.pricesIncludeVat ? null : `${summary.vatNote} `}
            {terms.commitmentNote}
          </p>

          {/* One door out of the panel and not two: the reader is still
              deciding here, and the way to answer a price they have only just
              arrived at is to say it out loud to somebody. The e-mail keeps its
              place in the close, once they have finished. See `ContactActions`.
              */}
          <ContactActions layout="stack" className="mt-5" />
        </div>
      </div>

      {/*
        The terms, shut — `FinePrint`, handed in from `page.tsx` rather than
        imported here. This file is a client component and that block is static
        markup with a copy file behind it; as `children` it stays on the server,
        and the browser is sent the scope of the offer as HTML rather than as
        another kilobyte of strings in the bundle.

        It sits under the whole grid rather than inside the right-hand column,
        because it qualifies both halves: the rows say what each part is, the
        panel says what they come to, and the drawer says what neither of them
        covers.
      */}
      {children}
    </Section>
  )
}
