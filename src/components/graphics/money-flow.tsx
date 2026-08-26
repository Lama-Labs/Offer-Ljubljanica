import type { ReactNode } from 'react'

import { moneyFlow } from '@/content/copy'
import { GraphicSection } from '@/components/sections/graphic-section'
import { eur, eurExact, group } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * Where the money goes, drawn.
 *
 * The source brief is unambiguous that *flat fee, no commission, money straight
 * to the operator* is the entire pitch and that everything else supports it. As
 * the third bullet in a list of nine it competes with eight other sentences; as
 * one ticket split two ways, it is the one thing in this section a reader takes
 * in without reading.
 *
 * ## Why it is one table and not three blocks
 *
 * It used to be a season panel, a column heading, and two cards side by side.
 * Three objects, and the reader had to hold a figure from the first one in their
 * head while reading the third — which is the one thing a comparison is supposed
 * to spare them. The two things being compared were also drawn differently: ours
 * on `{paper}` inside a strong hairline, theirs flat on the band, so the cards
 * differed before their contents did.
 *
 * Now there is one table. The same two columns run the whole height of it, every
 * figure sits on the row of the thing it answers, and the two numbers that
 * differ are the only two that do not line up. `Gost plača` and
 * `Banka za kartico` print the same figure twice on purpose: a reader can see
 * that the comparison is not being helped along before they reach the row where
 * it stops matching.
 *
 * ## Why the season row is last and carries the subscription
 *
 * The table runs in the order the argument is earned — one ticket, split; then
 * what that split becomes over six thousand of them. See the note on `moneyFlow`
 * in `copy.ts` for why round that way and not the other.
 *
 * Both season figures are prefixed `Mesečna naročnina +`, in the same grey, at
 * the same size, because both columns charge one. Without it the row reads as
 * `0 €` against `5.520 €`, which overstates a case that does not need
 * overstating; with it the row reads as *a subscription* against *a subscription
 * and €5.520*, which is what is actually being compared. The prefix is the one
 * thing in the section that says the same words in both columns, and it is the
 * reason the fine print no longer has to.
 *
 * ## Why green, and why only here
 *
 * The accent on this page is red and it means *this is the offer*. Painting the
 * kept column red would have said the right thing in the wrong vocabulary — the
 * claim in this section is not that Alpaca is the marked option, it is that one
 * column costs less than the other, and less is the argument.
 *
 * So the column is `{savings}`, the page's one green, which already carries
 * exactly that meaning on the struck-through totals in the price panel: *money
 * you are not spending*. A reader arrives here having seen it there. It is spent
 * as a tint down the whole Alpaca column rather than on the figures alone,
 * because what is cheaper is the column, not any one number in it.
 *
 * The comparison does not depend on the colour. Ours reads `0 €` where theirs
 * reads four figures, which is correct in greyscale, on a projector, and to
 * anyone who cannot separate the two hues.
 *
 * ## Why the figures are shown to the cent
 *
 * Because the argument only exists at that precision. Rounded to euros, ninety-
 * two cents against nothing is `1 €` against `0 €`, which reads as a rounding
 * artefact rather than as seven and a half percent of the fare.
 */

/**
 * The two money columns, styled once.
 *
 * `ours` is the green band; `theirs` is bare. Everything else about them is
 * identical, which is the point — the columns must not differ anywhere the
 * figures do not.
 */
const cell = {
  ours: 'bg-savings-tint',
  theirs: '',
} as const

/**
 * Cell padding is `px-2` before `sm` for one reason: the two money columns are
 * sized by their widest figure and the row heading gets what is left, which on a
 * 360px screen is under a hundred pixels. Every pixel of horizontal padding
 * comes out of the words.
 */
const numeric = 'px-2 py-3 text-right align-baseline whitespace-nowrap sm:px-4'

/** The `Mesečna naročnina +` line, drawn the same on both sides of the row. */
function Prefix({ text }: { text: string }) {
  return (
    <span className="type-caption text-mute mb-1 block font-normal whitespace-normal">{text}</span>
  )
}

function Row({
  label,
  sub,
  ours,
  theirs,
  size = 'sm',
  rule = 'hairline',
  win = false,
  prefix,
  last = false,
}: {
  label: string
  /** The qualifier that belongs to the row rather than to either figure. */
  sub?: string
  ours: ReactNode
  theirs: ReactNode
  /** `xl` is the season row — the only figures in the section set as a total. */
  size?: 'sm' | 'md' | 'xl'
  /** `strong` closes the breakdown, so the subtotal under it needs no rule. */
  rule?: 'hairline' | 'strong'
  /**
   * Whether our figure on this row is actually the better one.
   *
   * Only those are set in `{savings}`. `Gost plača` and `Banka za kartico` print
   * the same figure in both columns, and colouring ours green on those rows
   * would have claimed an advantage on two rows where there is none — the green
   * would be saying *ours* when the rest of the page has it saying *money you
   * are not spending*. The tint identifies the column; the ink says who won.
   */
  win?: boolean
  /**
   * A line set over both figures, identical in the two columns. It wraps where
   * the figures may not, so a long prefix costs the row heading no width.
   */
  prefix?: string
  last?: boolean
}) {
  const border = last
    ? ''
    : rule === 'strong'
      ? 'border-hairline-strong border-b'
      : 'border-hairline border-b'

  /*
    Both totals step down a size before `sm`, which is the one responsive thing
    in this table and is not a nicety. A table column is as wide as its widest
    line, and its widest line here is a number that cannot wrap: `5.520 €` set
    at `num-xl` is 150px, which on a 360px screen is taken directly out of the
    row heading next to it. Small enough to leave the words their room, and full
    size the moment there is room for both.
  */
  const figure =
    size === 'xl' ? 'num-md sm:num-xl' : size === 'md' ? 'num-sm sm:num-lg' : 'num-sm'

  const pad = size === 'xl' ? 'py-5' : size === 'md' ? 'py-4' : 'py-3'

  return (
    <tr>
      <th scope="row" className={cn('py-3 pr-3 text-left align-baseline', border, pad)}>
        <span className={cn('block', size === 'sm' ? 'type-caption text-mute' : 'type-body-sm text-ink font-semibold')}>
          {label}
        </span>
        {sub ? <span className="type-caption text-faint mt-0.5 block">{sub}</span> : null}
      </th>

      <td
        className={cn(
          numeric,
          cell.ours,
          border,
          pad,
          figure,
          win ? 'text-savings' : size === 'sm' ? 'text-body' : 'text-ink',
          last && 'rounded-b-md',
        )}
      >
        {prefix ? <Prefix text={prefix} /> : null}
        {ours}
      </td>

      <td
        className={cn(
          numeric,
          cell.theirs,
          border,
          pad,
          figure,
          size === 'sm' ? 'text-body' : 'text-ink',
        )}
      >
        {prefix ? <Prefix text={prefix} /> : null}
        {theirs}
      </td>
    </tr>
  )
}

export function MoneyFlow() {
  const { ticket, bankFee, ours, theirs, season } = moneyFlow

  const keptOurs = ticket - bankFee - ours.cut
  const keptTheirs = ticket - bankFee - theirs.cut

  return (
    <GraphicSection part="booking" heading={moneyFlow.heading} lead={moneyFlow.lead}>
      <div className="border-hairline bg-paper rounded-lg border p-4 sm:p-6">
        <table className="w-full border-separate border-spacing-0">
          {/*
            The two money columns are held equal and wide from `sm` up. Left to
            size themselves they take exactly as much as their widest figure and
            no more, which on a 1120px band parks them against the right edge
            with half a card of white between the row heading and the first
            number — a comparison the eye has to travel to make. Below `sm` the
            widths come off again and the columns shrink to their contents,
            because there the scarce thing is the heading column, not the gap.
          */}
          <colgroup>
            <col />
            <col className="sm:w-[32%]" />
            <col className="sm:w-[32%]" />
          </colgroup>

          <caption className="sr-only">
            {moneyFlow.heading} {ours.title} in {theirs.title}, na isto vstopnico in isto sezono.
          </caption>

          <thead>
            <tr>
              <td />

              {/* The one green edge in the section. It caps the column rather
                  than underlining a heading, so it reads as *this column* and
                  not as *this word*. */}
              <th
                scope="col"
                className={cn(
                  'label-mono text-savings border-savings rounded-t-md border-t-2 px-2 py-3 text-right align-bottom sm:px-4',
                  cell.ours,
                )}
              >
                {ours.title}
              </th>

              <th
                scope="col"
                className="label-mono text-mute border-t-2 border-transparent px-2 py-3 text-right align-bottom sm:px-4"
              >
                {theirs.column}
              </th>
            </tr>
          </thead>

          <tbody>
            {/*
              One ticket, split. This is the row set a reader can check against a
              price list they already know, which is why the section opens on it
              rather than on the season total it multiplies into.
            */}
            <Row label={moneyFlow.paysLabel} ours={eurExact(ticket)} theirs={eurExact(ticket)} />

            <Row
              label={moneyFlow.bankLabel}
              ours={`−${eurExact(bankFee)}`}
              theirs={`−${eurExact(bankFee)}`}
            />

            {/* The one row the whole section exists to print. */}
            <Row
              label={theirs.cutLabel}
              ours={eurExact(ours.cut)}
              theirs={
                <>
                  −{eurExact(theirs.cut)}
                  <span className="type-caption text-faint mt-0.5 block font-normal">
                    {theirs.cutShare}
                  </span>
                </>
              }
              win
            />

            <Row
              label={moneyFlow.keptLabel}
              ours={eurExact(keptOurs)}
              theirs={eurExact(keptTheirs)}
              size="md"
              rule="strong"
              win
            />

            {/*
              And what that becomes. A per-booking price is not a small number
              that stays small — it is a share of the business that grows exactly
              as fast as the business does, and the only honest way to show that
              is to run one season out and set the two totals side by side.
            */}
            <Row
              label={season.label}
              sub={`${group(season.tickets)} ${season.sub}`}
              prefix={season.prefix}
              ours={eur(0)}
              theirs={eur(season.tickets * theirs.cut)}
              size="xl"
              win
              last
            />
          </tbody>
        </table>

        {/*
          One note per column, sitting under the column it belongs to and marked
          in that column's colour. Each names its side again rather than relying
          on the alignment, because below `sm` the two stack and the alignment is
          gone.
        */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="border-savings border-l-2 pl-3">
            <p className="label-mono text-savings">{ours.title}</p>
            <p className="type-caption text-mute mt-1.5">{ours.note}</p>
          </div>

          <div className="border-hairline-strong border-l-2 pl-3">
            <p className="label-mono text-faint">{theirs.title}</p>
            <p className="type-caption text-mute mt-1.5">{theirs.note}</p>
          </div>
        </div>
      </div>

      <p className="type-caption text-faint measure mt-4">{moneyFlow.footnote}</p>
    </GraphicSection>
  )
}
