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
 * one ticket split four ways, it is the one thing in this section a reader takes
 * in without reading.
 *
 * ## Why it is one table and not a stack of blocks
 *
 * It used to be a season panel, a column heading, and two cards side by side.
 * Three objects, and the reader had to hold a figure from the first one in their
 * head while reading the third — which is the one thing a comparison is supposed
 * to spare them. The two things being compared were also drawn differently: ours
 * on `{paper}` inside a strong hairline, theirs flat on the band, so the cards
 * differed before their contents did.
 *
 * Now there is one table. The same four columns run its whole height, every
 * figure sits on the row of the thing it answers, and the figures that differ
 * are the only ones that do not line up. `Gost plača` and `Banka za kartico`
 * print the same figure four times on purpose: a reader can see that the
 * comparison is not being helped along before they reach the row where it stops
 * matching.
 *
 * ## Why the phone gets cards instead
 *
 * Four money columns do not fit on a phone, and the two ways of making them fit
 * both cost more than they save. Sideways scroll hides the column the reader has
 * not thought to look for — the argument is the spread between platforms, and a
 * spread with two of its four columns off-screen is not one. Shrinking the type
 * until it fits puts the section's decisive figures at a size chosen by the
 * narrowest device rather than by what they are.
 *
 * So below `md` the same numbers are dealt out as one card per platform, in the
 * same order, with each platform's note inside its own card. The two rows that
 * are identical everywhere are stated once above the stack instead of four times
 * inside it — see `sharedLabel`. Every figure comes from the same `columns`
 * array either way, so the two renderings cannot drift apart.
 *
 * ## Why the season row is last and carries the subscription
 *
 * The table runs in the order the argument is earned — one ticket, split; then
 * what that split becomes over six thousand of them. See the note on `moneyFlow`
 * in `copy.ts` for why round that way and not the other, and for why three
 * platforms are named rather than one composite invented for the occasion.
 *
 * Every season figure is prefixed `Mesečna naročnina +`, in the same grey, at
 * the same size, because all four columns charge one. Without it the row reads
 * as `0 €` against three four-figure sums, which overstates a case that does not
 * need overstating; with it the row reads as *a subscription* against *a
 * subscription and a commission*, which is what is actually being compared.
 *
 * ## Why green, and why only here
 *
 * The accent on this page is red and it means *this is the offer*. Painting the
 * kept column red would have said the right thing in the wrong vocabulary — the
 * claim in this section is not that Alpaca is the marked option, it is that one
 * column costs less than the other three, and less is the argument.
 *
 * So the column is `{savings}`, the page's one green, which already carries
 * exactly that meaning on the struck-through totals in the price panel: *money
 * you are not spending*. A reader arrives here having seen it there. It is spent
 * as a tint down the whole Alpaca column rather than on the figures alone,
 * because what is cheaper is the column, not any one number in it.
 *
 * The comparison does not depend on the colour. Ours reads `0 €` where the
 * others read four figures, which is correct in greyscale, on a projector, and
 * to anyone who cannot separate the two hues.
 *
 * ## Why the figures are shown to the cent
 *
 * Because the argument only exists at that precision. Rounded to euros, eighteen
 * cents against nothing is `0 €` against `0 €`, and the row that carries the
 * whole section says nothing at all.
 *
 * The one exception is Regiondo, whose rate is reported rather than published.
 * Its figures are rounded and carry `≈` wherever they print, so the column that
 * produces the largest number is also the one column visibly not claiming to be
 * exact.
 */

/** One platform, priced against the same ticket and the same season. */
type Column = {
  key: string
  /** What heads the column: one word, because the column is sized by it. */
  heading: string
  /** What heads its note, and its card on a phone — the plan, not just the name. */
  title: string
  /** Taken from a single ticket. Zero for us, which is the point. */
  cut: number
  /** Rounded and marked, for a rate nobody publishes. See `copy.ts`. */
  approx: boolean
  kept: number
  season: number
  note: string
  ours: boolean
}

/**
 * The money columns, styled once.
 *
 * Ours is the green band; the others are bare. Everything else about them is
 * identical, which is the point — the columns must not differ anywhere the
 * figures do not.
 */
const tint = 'bg-savings-tint'

/**
 * Cell padding is `px-2` below `lg` for one reason: the four money columns are
 * sized by their widest figure and the row heading gets what is left, which at
 * the width the table first appears is not much. Every pixel of horizontal
 * padding comes out of the words.
 */
const numeric = 'px-2 py-3 text-right align-baseline whitespace-nowrap lg:px-4'

/** `≈` on the figures of a column whose rate is reported rather than published. */
function about(text: string, approx: boolean): string {
  return approx ? `≈ ${text}` : text
}

/**
 * The cut as a share of the fare — the figure that lands, since a reader who
 * sells €12 tickets converts cents to percent before they finish the row.
 *
 * Derived rather than written down, so a rate and its percentage cannot
 * disagree. Slovenian decimal comma, and a trailing `,0` dropped: `3 %` is what
 * Rezdy charges and `3,0 %` is what a spreadsheet says.
 */
function share(cut: number, ticket: number, approx: boolean): string {
  const percent = ((cut / ticket) * 100).toFixed(1).replace('.', ',').replace(/,0$/, '')

  return about(`${percent} %`, approx)
}

/** The `Mesečna naročnina +` line, drawn the same in every column of the row. */
function Prefix({ text }: { text: string }) {
  return (
    <span className="type-caption text-mute mb-1 block font-normal whitespace-normal">{text}</span>
  )
}

function Row({
  label,
  sub,
  columns,
  cell,
  size = 'sm',
  rule = 'hairline',
  win = false,
  prefix,
  last = false,
}: {
  label: string
  /** The qualifier that belongs to the row rather than to any one figure. */
  sub?: string
  columns: Column[]
  /** What this row prints for a given column. */
  cell: (column: Column) => ReactNode
  /** `xl` is the season row — the only figures in the section set as a total. */
  size?: 'sm' | 'md' | 'xl'
  /** `strong` closes the breakdown, so the subtotal under it needs no rule. */
  rule?: 'hairline' | 'strong'
  /**
   * Whether our figure on this row is actually the better one.
   *
   * Only those are set in `{savings}`. `Gost plača` and `Banka za kartico` print
   * the same figure in every column, and colouring ours green on those rows
   * would have claimed an advantage on two rows where there is none — the green
   * would be saying *ours* when the rest of the page has it saying *money you
   * are not spending*. The tint identifies the column; the ink says who won.
   */
  win?: boolean
  /**
   * A line set over every figure on the row, identical in all four columns. It
   * wraps where the figures may not, so a long prefix costs the row heading no
   * width.
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
    Both totals step down a size below `lg`, which is the one responsive thing in
    this table and is not a nicety. A table column is as wide as its widest line,
    and its widest line here is a number that cannot wrap: `5.520 €` set at
    `num-xl` is 150px, and four of those plus a row heading is wider than the
    screen the table first appears on. Small enough to leave the words their
    room, and full size the moment there is room for both.
  */
  const figure = size === 'xl' ? 'num-md lg:num-xl' : size === 'md' ? 'num-sm lg:num-lg' : 'num-sm'

  const pad = size === 'xl' ? 'py-5' : size === 'md' ? 'py-4' : 'py-3'

  return (
    <tr>
      <th scope="row" className={cn('py-3 pr-3 text-left align-baseline', border, pad)}>
        <span
          className={cn(
            'block',
            size === 'sm' ? 'type-caption text-mute' : 'type-body-sm text-ink font-semibold',
          )}
        >
          {label}
        </span>
        {sub ? <span className="type-caption text-faint mt-0.5 block">{sub}</span> : null}
      </th>

      {columns.map((column) => (
        <td
          key={column.key}
          className={cn(
            numeric,
            column.ours && tint,
            border,
            pad,
            figure,
            win && column.ours ? 'text-savings' : size === 'sm' ? 'text-body' : 'text-ink',
            last && column.ours && 'rounded-b-md',
          )}
        >
          {prefix ? <Prefix text={prefix} /> : null}
          {cell(column)}
        </td>
      ))}
    </tr>
  )
}

/** One platform's figures, for the width where the table cannot go. */
function Card({ column, seasonSub }: { column: Column; seasonSub: string }) {
  const { cutLabel, keptLabel, season } = moneyFlow

  return (
    <div
      className={cn(
        'rounded-md border p-4',
        column.ours ? 'border-savings bg-savings-tint' : 'border-hairline',
      )}
    >
      <p className={cn('label-mono', column.ours ? 'text-savings' : 'text-mute')}>{column.title}</p>

      <dl className="mt-3 grid gap-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="type-caption text-mute">{cutLabel}</dt>
          <dd
            className={cn(
              'num-sm shrink-0 text-right whitespace-nowrap',
              column.ours ? 'text-savings' : 'text-body',
            )}
          >
            {column.cut === 0 ? eurExact(0) : about(`−${eurExact(column.cut)}`, column.approx)}
            {column.cut === 0 ? null : (
              <span className="type-caption text-faint mt-0.5 block font-normal">
                {share(column.cut, moneyFlow.ticket, column.approx)}
              </span>
            )}
          </dd>
        </div>

        <div className="border-hairline flex items-baseline justify-between gap-3 border-t pt-2.5">
          <dt className="type-body-sm text-ink font-semibold">{keptLabel}</dt>
          <dd
            className={cn(
              'num-lg shrink-0 whitespace-nowrap',
              column.ours ? 'text-savings' : 'text-ink',
            )}
          >
            {about(eurExact(column.kept), column.approx)}
          </dd>
        </div>

        <div className="border-hairline flex items-baseline justify-between gap-3 border-t pt-2.5">
          <div>
            <dt className="type-body-sm text-ink font-semibold">{season.label}</dt>
            <span className="type-caption text-faint mt-0.5 block">{seasonSub}</span>
          </div>
          <dd className="shrink-0 text-right">
            <Prefix text={season.prefix} />
            <span
              className={cn('num-lg whitespace-nowrap', column.ours ? 'text-savings' : 'text-ink')}
            >
              {about(eur(column.season), column.approx)}
            </span>
          </dd>
        </div>
      </dl>

      {/* The note lives in the card here rather than in the grid below, which is
          hidden at this width: a platform's rate and the sentence qualifying it
          should not be separated by three other platforms. */}
      <p className="type-caption text-mute border-hairline mt-3 border-t pt-3">{column.note}</p>
    </div>
  )
}

export function MoneyFlow() {
  const { ticket, bankFee, ours, theirs, season, cutLabel, paysLabel, bankLabel, keptLabel } =
    moneyFlow

  /*
    One array, two renderings. The table and the phone cards read the same
    figures out of it, so a rate corrected in `copy.ts` cannot land in one and
    not the other.
  */
  const columns: Column[] = [
    {
      key: 'ours',
      heading: ours.column,
      title: ours.title,
      cut: ours.cut,
      approx: false,
      note: ours.note,
      ours: true,
    },
    ...theirs.map((platform) => ({
      key: platform.id,
      heading: platform.column,
      title: platform.title,
      cut: platform.cut,
      approx: 'approx' in platform ? platform.approx : false,
      note: platform.note,
      ours: false,
    })),
  ].map((column) => ({
    ...column,
    kept: ticket - bankFee - column.cut,
    season: column.cut * season.tickets,
  }))

  const seasonSub = `${group(season.tickets)} ${season.sub}`

  return (
    <GraphicSection part="booking" heading={moneyFlow.heading} lead={moneyFlow.lead}>
      <div className="border-hairline bg-paper rounded-lg border p-4 sm:p-6">
        {/*
          The phone. One card per platform, and the two rows that are the same
          everywhere stated once above them rather than four times inside.
        */}
        <div className="md:hidden">
          <p className="type-caption text-mute border-hairline border-b pb-3">
            <span className="label-mono text-faint mr-2">{moneyFlow.sharedLabel}</span>
            {paysLabel} {eurExact(ticket)} · {bankLabel} −{eurExact(bankFee)}
          </p>

          <div className="mt-3 grid gap-3">
            {columns.map((column) => (
              <Card key={column.key} column={column} seasonSub={seasonSub} />
            ))}
          </div>
        </div>

        <table className="hidden w-full border-separate border-spacing-0 md:table">
          {/*
            The four money columns are held equal and wide. Left to size
            themselves they take exactly as much as their widest figure and no
            more, which on a 1120px band parks them against the right edge with
            half a card of white between the row heading and the first number — a
            comparison the eye has to travel to make.
          */}
          <colgroup>
            <col />
            {columns.map((column) => (
              <col key={column.key} className="w-[20%]" />
            ))}
          </colgroup>

          <caption className="sr-only">
            {moneyFlow.heading} {columns.map((column) => column.title).join(', ')} — na isto
            vstopnico in isto sezono.
          </caption>

          <thead>
            <tr>
              <td />

              {columns.map((column) => (
                /* The one green edge in the section caps our column rather than
                   underlining its heading, so it reads as *this column* and not
                   as *this word*. */
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'label-mono border-t-2 px-2 py-3 text-right align-bottom lg:px-4',
                    column.ours
                      ? cn('text-savings border-savings rounded-t-md', tint)
                      : 'text-mute border-transparent',
                  )}
                >
                  {column.heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/*
              One ticket, split. This is the row set a reader can check against a
              price list they already know, which is why the section opens on it
              rather than on the season total it multiplies into.
            */}
            <Row label={paysLabel} columns={columns} cell={() => eurExact(ticket)} />

            <Row label={bankLabel} columns={columns} cell={() => `−${eurExact(bankFee)}`} />

            {/* The one row the whole section exists to print. */}
            <Row
              label={cutLabel}
              columns={columns}
              win
              cell={(column) =>
                column.cut === 0 ? (
                  eurExact(0)
                ) : (
                  <>
                    {about(`−${eurExact(column.cut)}`, column.approx)}
                    {/* The share, under the euros. The row is already headed
                        `Delež platforme` and the row above says what the ticket
                        costs, so the percentage needs no words of its own. */}
                    <span className="type-caption text-faint mt-0.5 block font-normal">
                      {share(column.cut, ticket, column.approx)}
                    </span>
                  </>
                )
              }
            />

            <Row
              label={keptLabel}
              columns={columns}
              cell={(column) => about(eurExact(column.kept), column.approx)}
              size="md"
              rule="strong"
              win
            />

            {/*
              And what that becomes. A per-booking price is not a small number
              that stays small — it is a share of the business that grows exactly
              as fast as the business does, and the only honest way to show that
              is to run one season out and set the totals side by side.
            */}
            <Row
              label={season.label}
              sub={seasonSub}
              prefix={season.prefix}
              columns={columns}
              cell={(column) => about(eur(column.season), column.approx)}
              size="xl"
              win
              last
            />
          </tbody>
        </table>

        {/*
          One note per column, sitting under the column it belongs to and marked
          in that column's colour. Each names its platform again rather than
          relying on the alignment, because two of the four wrap to a second row
          at the width this grid first appears.
        */}
        <div className="mt-6 hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div
              key={column.key}
              className={cn(
                'border-l-2 pl-3',
                column.ours ? 'border-savings' : 'border-hairline-strong',
              )}
            >
              <p className={cn('label-mono', column.ours ? 'text-savings' : 'text-faint')}>
                {column.title}
              </p>
              <p className="type-caption text-mute mt-1.5">{column.note}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="type-caption text-faint measure mt-4">{moneyFlow.footnote}</p>
    </GraphicSection>
  )
}
