import { moneyFlow } from '@/content/copy'
import { Copy } from '@/components/ui/copy'
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
 * ## Why the bar has three parts now
 *
 * It used to have one: how much of €100 survives. That drawing was flattering
 * and slightly false — card payments cost a bank fee whoever collects them, and
 * the reader most likely to notice is the one who already runs a Stripe account
 * and knows what he pays. So the bar now carries the fee explicitly, in the same
 * grey, at the same width, in both columns: a solid run for what the operator
 * keeps, a grey stripe for the bank, and open track for what the platform took.
 * Only the open part differs between the two rails, which is exactly the claim.
 *
 * ## Why the red is on our side and nowhere else
 *
 * The obvious move is to paint the platform's cut in the accent colour, and it
 * would be the wrong red: on this page `{signal}` means *this is the offer*, so
 * spending it on a competitor's commission would make the deduction the marked
 * thing. It goes on our side instead — the full bar the operator keeps, and the
 * zero they pay us across a season — where it says the same thing the accent
 * says everywhere else on the page.
 *
 * The comparison itself is still carried by weight, not by hue: our bar runs
 * solid to the bank stripe and theirs stops short, which reads correctly in
 * greyscale, on a projector, and to anyone who cannot separate the two colours.
 *
 * ## Why the figures are shown to the cent
 *
 * Because the argument only exists at that precision. Rounded to euros, ninety-
 * two cents against nothing is `1 €` against `0 €`, which reads as a rounding
 * artefact rather than as seven and a half percent of the fare.
 */
function Rail({
  title,
  cutLabel,
  cut,
  cutShare,
  note,
  emphasis,
}: {
  title: string
  cutLabel: string
  cut: number
  cutShare?: string
  note: string
  emphasis: boolean
}) {
  const { ticket, bankFee, paysLabel, keptLabel, bankLabel } = moneyFlow
  const kept = ticket - bankFee - cut

  const keptPercent = (kept / ticket) * 100
  const bankPercent = (bankFee / ticket) * 100

  return (
    <div
      className={cn(
        'rounded-lg border p-5 sm:p-6',
        emphasis ? 'border-hairline-strong bg-paper' : 'border-hairline bg-transparent',
      )}
    >
      <p className={cn('label-mono', emphasis ? 'text-ink' : 'text-faint')}>{title}</p>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="type-caption text-mute">{paysLabel}</p>
        <p className="num-sm text-body">{eurExact(ticket)}</p>
      </div>

      {/*
        The bar is the sentence. `aria-hidden` because the rows under it already
        say the same thing in words, and a progress role here would announce
        "eighty-six percent" without ever saying of what.
      */}
      <div className="bg-mist mt-2 flex h-3 overflow-hidden rounded-sm" aria-hidden>
        <div
          className={cn('h-full', emphasis ? 'bg-signal' : 'bg-faint')}
          style={{ width: `${keptPercent}%` }}
        />
        <div className="bg-hairline-strong h-full" style={{ width: `${bankPercent}%` }} />
      </div>

      {/*
        Both deductions, in the order the bar draws them. The bank line is
        identical in the two rails on purpose — it is the control against which
        the line under it reads.
      */}
      <dl className="mt-4 space-y-1.5">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="type-caption text-mute flex items-center gap-2">
            <span
              className="bg-hairline-strong inline-block size-2 shrink-0 rounded-xs"
              aria-hidden
            />
            {bankLabel}
          </dt>
          <dd className="num-sm text-mute">−{eurExact(bankFee)}</dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className="type-caption text-mute flex items-center gap-2">
            <span
              className={cn(
                'inline-block size-2 shrink-0 rounded-xs',
                cut > 0 ? 'bg-mist ring-hairline-strong ring-1' : 'bg-transparent',
              )}
              aria-hidden
            />
            {cutLabel}
            {cutShare ? <span className="text-faint">({cutShare})</span> : null}
          </dt>
          <dd className={cn('num-sm', cut > 0 ? 'text-body' : 'text-faint')}>
            {cut > 0 ? `−${eurExact(cut)}` : eurExact(0)}
          </dd>
        </div>
      </dl>

      <div className="border-hairline mt-4 flex items-baseline justify-between gap-4 border-t pt-4">
        <p className="type-caption text-mute">{keptLabel}</p>
        <p className={cn('num-lg', emphasis ? 'text-ink' : 'text-mute')}>{eurExact(kept)}</p>
      </div>

      <p className="type-caption text-mute mt-3">{note}</p>
    </div>
  )
}

/**
 * The same ninety-two cents, multiplied by a season — and the first thing the
 * figure says.
 *
 * This is where the graphic stops being an accounting diagram and becomes the
 * reason to choose one of the two, which is why it opens rather than closes.
 * Ninety-two cents read first makes the whole question look small; four figures
 * read first make the ticket breakdown underneath into evidence rather than
 * into an argument the reader has already dismissed.
 *
 * A per-booking price is not a small number that stays small — it is a share of
 * the business that grows precisely as fast as the business does, and the only
 * honest way to show that is to run it out over a season and put the two totals
 * next to each other.
 */
function Season() {
  const { season, theirs } = moneyFlow

  return (
    <div className="border-hairline-strong bg-paper mt-6 rounded-lg border p-5 sm:p-6">
      <p className="label-mono text-ink">
        {season.label} — {group(season.tickets)} vstopnic
      </p>

      <Copy text={season.lead} className="type-body-sm text-mute measure mt-3" />

      {/*
        The two totals, at the size the summary gives its own totals. They are
        the largest numerals in the section on purpose: everything below is the
        working that produces them.
      */}
      <div className="border-hairline mt-5 grid gap-5 border-t pt-5 sm:grid-cols-2 sm:gap-3">
        <div>
          <p className="type-caption text-mute">{season.oursLabel}</p>
          <p className="num-xl text-signal mt-1.5">{eur(0)}</p>
        </div>
        <div>
          <p className="type-caption text-mute">{season.theirsLabel}</p>
          <p className="num-xl text-mute mt-1.5">{eur(season.tickets * theirs.cut)}</p>
        </div>
      </div>

      <p className="type-caption text-faint mt-4">{season.note}</p>
    </div>
  )
}

export function MoneyFlow() {
  return (
    <figure className="mt-14">
      <figcaption>
        <p className="label-mono text-faint flex items-center gap-2.5">
          <span className="bg-hairline-strong inline-block h-px w-6" aria-hidden />
          {moneyFlow.label}
        </p>
        <p className="type-subtitle text-ink mt-3">{moneyFlow.heading}</p>
        <Copy text={moneyFlow.lead} className="type-body-sm text-mute measure mt-2" />
      </figcaption>

      <Season />

      {/*
        The breakdown is now subordinate: a column heading, then the rails. It
        answers "where did that figure come from", which is a question the
        reader only asks after the figure has landed.
      */}
      <div className="mt-8 flex items-baseline gap-3">
        <p className="label-mono text-faint">{moneyFlow.breakdown.label}</p>
        <span className="bg-hairline h-px flex-1" aria-hidden />
      </div>
      <p className="type-caption text-mute mt-2">{moneyFlow.breakdown.lead}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Rail
          title={moneyFlow.ours.title}
          cutLabel={moneyFlow.ours.cutLabel}
          cut={moneyFlow.ours.cut}
          note={moneyFlow.ours.note}
          emphasis
        />
        <Rail
          title={moneyFlow.theirs.title}
          cutLabel={moneyFlow.theirs.cutLabel}
          cut={moneyFlow.theirs.cut}
          cutShare={moneyFlow.theirs.cutShare}
          note={moneyFlow.theirs.note}
          emphasis={false}
        />
      </div>

      <p className="type-caption text-faint measure mt-4">{moneyFlow.footnote}</p>
    </figure>
  )
}
