'use client'

import { useState } from 'react'
import { CheckIcon, LinkIcon, PlusIcon } from 'lucide-react'

import { summary } from '@/content/copy'
import { terms } from '@/content/offer'
import { SUMMARY_ANCHOR, useOfferSelection } from '@/components/offer-selection'
import { PartNumber } from '@/components/part-index'
import { buttonClasses } from '@/components/ui/button'
import { emphasize } from '@/components/ui/copy'
import { Section, SectionHeader } from '@/components/ui/section'
import { eur } from '@/lib/format'
import { nudges as computeNudges, packageBrackets, type QuoteLine } from '@/lib/pricing'
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
          twice over — a standing concession on its list price and a package on
          top — and striking each step in turn would put three figures on a row
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

/** Lanes the brackets occupy to the left of the rows. Zero when there are none. */
const LANES = packageBrackets.length

/**
 * The packages again, beside the summary rows — the hero's brackets turned a
 * quarter turn.
 *
 * ## Why they are repeated here at all
 *
 * The hero shows the ways of combining before the reader has read a word of
 * argument; this shows them at the moment they are actually choosing, which is a
 * different moment and the more decisive one. Without them the summary is three
 * independent switches and a total, and the reason the second row makes the
 * first cheaper lives only in a sentence under the panel.
 *
 * ## Why vertical
 *
 * A bracket has to run along the things it covers. In the hero those are three
 * cards in a row, so the rule is horizontal and sits under them; here they are
 * three rows in a stack, so it is vertical and sits beside them — the same
 * notation, the same `packageBrackets` geometry, read the other way. Each opens
 * rightwards, towards the rows it claims, exactly as the hero's open upwards
 * towards the cards.
 *
 * ## The lanes
 *
 * One column per package, narrowest nearest the rows, so a package that contains
 * another sits outside it and the nesting is legible without reading a label.
 * The columns are `auto`, and the brackets are the only things in them — so
 * below `sm`, where they are hidden, the lanes collapse to nothing and the rows
 * take the full width. That is also why the horizontal gap is a margin on each
 * bracket rather than a `gap-x` on the grid: a gap survives its column being
 * empty, and would leave the rows indented by a notation that is not there.
 */
function SummaryBrackets() {
  const { isSelected } = useOfferSelection()

  return (
    <>
      {packageBrackets.map(({ rule, start, span }, index) => {
        const active = rule.requires.every((id) => isSelected(id))

        return (
          <div
            key={rule.id}
            /*
              Column and row come from the price file, so they are set inline for
              the same reason the hero's are: Tailwind cannot generate a class
              for a span it has never seen. `LANES - index` puts the narrowest
              package — first in `packageBrackets` — in the lane closest to the
              rows.
            */
            style={{
              gridColumn: LANES - index,
              gridRow: `${start} / span ${span}`,
            }}
            className="mr-2 hidden sm:flex"
          >
            <p
              className={cn(
                /*
                  Bottom-to-top, the way a chart labels its vertical axis.
                  `vertical-rl` alone would set it top-to-bottom with the letters
                  turned the other way; the half turn is what makes it read
                  naturally with the head tilted left.
                */
                'label-mono self-center rotate-180 whitespace-nowrap [writing-mode:vertical-rl]',
                'transition-colors duration-150',
                active ? 'text-signal' : 'text-mute',
              )}
            >
              {rule.label}
            </p>

            {/* The bracket proper: top, bottom and left edges, open towards the
                rows. The hero's is the same three edges rotated. */}
            <div
              className={cn(
                'ml-1.5 w-3 rounded-l-md border-y border-l transition-colors duration-150',
                active ? 'border-signal/45' : 'border-hairline-strong',
              )}
              aria-hidden
            />
          </div>
        )
      })}
    </>
  )
}

/**
 * The offer as the reader has built it — the page's one saturated surface.
 *
 * ## Why the totals panel is red and nothing else is
 *
 * Red on this page means *in your offer*. This panel is the offer: it is the
 * only place where the three parts stop being arguments and become one number.
 * Filling it is the accent's largest and last use, and it is why every other
 * red on the page is a hairline or a numeral — a page with three red blocks has
 * no red block.
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
export function OfferSummary() {
  const { quote, selection, toggle, reset, shareUrl } = useOfferSelection()
  const [copied, setCopied] = useState(false)

  const nudges = computeNudges(selection)

  const share = async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      /*
        Clipboard access is refused often enough — an insecure origin, a
        locked-down browser, a permission the reader declined — that failing
        loudly would be worse than not offering it. The URL is in the address bar
        either way, which is where somebody who wanted to copy it will go.
      */
      setCopied(false)
    }
  }

  return (
    <Section id={SUMMARY_ANCHOR} tone="mist">
      <SectionHeader
        eyebrow={summary.eyebrow}
        heading={quote.isEmpty ? summary.emptyHeading : summary.heading}
        lead={quote.isEmpty ? summary.emptyBody : summary.lead}
      />

      <div className="mt-10 grid items-start gap-4 lg:grid-cols-[1fr_380px]">
        {/*
          The whole left column is one grid: the package lanes, the three rows,
          and everything that follows them.

          The lanes and the rows share it so that a bracket spanning two rows
          really is as tall as those two rows — including the gap between them —
          however the text inside has wrapped. The nudge and the package notes
          are in it for a plainer reason: they sit in the same content column as
          the rows, so their left edge lines up with the rows rather than with
          the outer edge of a notation they are not part of.
        */}
        <div
          className="grid gap-y-3"
          style={{
            gridTemplateColumns:
              LANES > 0 ? `repeat(${LANES}, auto) minmax(0, 1fr)` : 'minmax(0, 1fr)',
          }}
        >
          <SummaryBrackets />

          {quote.lines.map((line, index) => {
            const { part, selected } = line

            return (
              <button
                key={part.id}
                type="button"
                onClick={() => toggle(part.id)}
                aria-pressed={selected}
                style={{ gridColumn: LANES + 1, gridRow: index + 1 }}
                className={cn(
                  /*
                    Wrapping, not truncating. `PartPrice` keeps each figure
                    unbreakable — "1.000" split across two lines is worse than
                    any layout it could save — so at phone width the whole price
                    block drops onto its own line rather than pushing the row
                    wider than the screen and cutting the euro signs off.
                  */
                  'flex w-full flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border p-4 text-left transition-colors duration-150 sm:flex-nowrap sm:p-5',
                  selected
                    ? 'border-signal/45 bg-paper'
                    : 'border-hairline bg-paper/60 hover:border-hairline-strong',
                )}
              >
                <PartNumber number={part.number} active={selected} />

                <span className="min-w-[9rem] flex-1">
                  <span className="type-item text-ink block">{part.name}</span>
                  <span className="type-caption text-mute mt-0.5 block">{part.summary}</span>
                </span>

                <PartPrice line={line} />

                {/*
                  The same ring as the hero cards, so that "in the offer" looks
                  identical wherever the reader meets it. A span rather than the
                  `SelectCircle` button, because the whole row is already the
                  control and a button inside a button is not markup a browser
                  will keep.
                */}
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-150',
                    selected
                      ? 'border-signal bg-signal text-on-signal'
                      : 'border-hairline-strong text-transparent',
                  )}
                  aria-hidden
                >
                  <CheckIcon className="size-4" strokeWidth={2.5} />
                </span>
              </button>
            )
          })}

          {quote.isEmpty ? (
            <button
              type="button"
              onClick={reset}
              style={{ gridColumn: LANES + 1 }}
              className={buttonClasses('primary', 'w-full')}
            >
              {summary.restore}
            </button>
          ) : null}

          {nudges.map(({ part, rules, oneOffDiscount, monthlyDiscount }) => (
            <div
              key={part.id}
              style={{ gridColumn: LANES + 1 }}
              className="border-signal/40 bg-signal-tint rounded-lg border border-dashed p-4 sm:p-5"
            >
              {/* Every package this one part would unlock, on one line. Two
                  prompts asking for the same part would be the page haggling. */}
              <p className="label-mono text-signal">
                {rules.map((rule) => rule.label).join(' + ')}
              </p>
              <p className="type-body-sm text-ink mt-2">
                Dodajte še <strong className="font-semibold">{part.name}</strong> in{' '}
                {/*
                  Composed from whichever kinds of saving are actually on offer
                  rather than assuming a one-off one. The shared maintenance fee
                  lowers only the monthly bill, and would otherwise nudge the
                  reader with "in odpade 0 €".
                */}
                {[
                  oneOffDiscount > 0 ? `odpade ${eur(oneOffDiscount)}` : null,
                  monthlyDiscount > 0 ? `mesečno odpade ${eur(monthlyDiscount)}` : null,
                ]
                  .filter(Boolean)
                  .join(' ter ')}
                .
              </p>
              <button
                type="button"
                onClick={() => toggle(part.id)}
                className="label-btn text-signal mt-3 inline-flex items-center gap-1.5 underline underline-offset-4"
              >
                <PlusIcon className="size-4" strokeWidth={2} aria-hidden />
                Dodaj {part.name}
              </button>
            </div>
          ))}

          {quote.appliedRules.length > 0 ? (
            <div
              style={{ gridColumn: LANES + 1 }}
              className="border-hairline space-y-3 border-t pt-5"
            >
              {quote.appliedRules.map((rule) => (
                <p key={rule.id} className="type-body-sm text-mute">
                  <span className="text-ink font-semibold">{rule.label}. </span>
                  {emphasize(rule.reason)}
                </p>
              ))}
            </div>
          ) : null}
        </div>

        {/* The offer, as one number. The page's only filled accent surface. */}
        <div className="bg-signal text-on-signal rounded-lg p-6 sm:p-7">
          <dl className="space-y-4">
            {quote.oneOffDiscount > 0 ? (
              <div className="type-caption text-on-signal/70 flex items-baseline justify-between gap-4">
                <dt>{summary.beforeDiscountLabel}</dt>
                <dd className="num-sm line-through">{eur(quote.oneOffBeforeDiscount)}</dd>
              </div>
            ) : null}

            {/*
              The part concessions, before the packages. They are not a reward
              for a combination, so they carry no package name — but they have to
              be listed, or the struck total above is larger than the packages
              below can account for and the arithmetic stops being checkable.
            */}
            {quote.partOneOffDiscount > 0 ? (
              <div className="type-caption flex items-baseline justify-between gap-4">
                <dt>{summary.partDiscountLabel}</dt>
                <dd className="num-sm shrink-0 text-right">−{eur(quote.partOneOffDiscount)}</dd>
              </div>
            ) : null}

            {quote.appliedRules.map((rule) => (
              <div
                key={rule.id}
                className="type-caption flex items-baseline justify-between gap-4"
              >
                <dt>{rule.label}</dt>
                <dd className="num-sm shrink-0 text-right">
                  {rule.oneOffDiscount > 0 ? (
                    <span className="block">−{eur(rule.oneOffDiscount)}</span>
                  ) : null}
                  {rule.monthlyDiscount > 0 ? (
                    <span className="block">−{eur(rule.monthlyDiscount)} / mes.</span>
                  ) : null}
                </dd>
              </div>
            ))}

            <div className="border-on-signal/25 flex items-baseline justify-between gap-4 border-t pt-4">
              <dt className="type-body-sm text-on-signal/80">{summary.oneOffLabel}</dt>
              <dd className="num-xl">{eur(quote.oneOffTotal)}</dd>
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <dt className="type-body-sm text-on-signal/80">{summary.monthlyLabel}</dt>
              <dd className="num-xl flex items-baseline gap-1.5">
                {/* The same device as the struck one-off above, so that a
                    recurring saving is read the same way as an up-front one. */}
                {quote.monthlyDiscount > 0 ? (
                  <span className="num-sm text-on-signal/60 line-through">
                    {eur(quote.monthlyBeforeDiscount)}
                  </span>
                ) : null}
                {eur(quote.monthly)}
                <span className="type-caption text-on-signal/80">/ mesec</span>
              </dd>
            </div>

            {/* Carries the rule that used to sit above the first-year total, so
                the panel still closes on what the reader saves rather than
                running the two totals and the saving together as one block. */}
            {quote.savings > 0 ? (
              <div className="border-on-signal/25 flex items-baseline justify-between gap-4 border-t pt-4">
                <dt className="type-body-sm font-semibold">{summary.savingsLabel}</dt>
                <dd className="num-md font-semibold">{eur(quote.savings)}</dd>
              </div>
            ) : null}
          </dl>

          <p className="type-caption text-on-signal/70 mt-6">
            {terms.pricesIncludeVat ? null : `${summary.vatNote} `}
            {terms.commitmentNote}
          </p>

          <button
            type="button"
            onClick={share}
            disabled={!shareUrl}
            className={cn(
              'label-btn bg-on-signal text-signal mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-5',
              'transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {copied ? (
              <>
                <CheckIcon className="size-4" strokeWidth={2} aria-hidden />
                {summary.shareCopied}
              </>
            ) : (
              <>
                <LinkIcon className="size-4" strokeWidth={2} aria-hidden />
                {summary.shareLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </Section>
  )
}
