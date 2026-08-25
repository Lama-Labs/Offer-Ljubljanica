import {
  bundleRules,
  offerParts,
  type BundleRule,
  type OfferPart,
  type OfferPartId,
} from '@/content/offer'

/** What the reader has switched on, in page order. */
export type Selection = readonly OfferPartId[]

/**
 * One part, priced against the current selection.
 *
 * ## Why the arithmetic is per part before it is per offer
 *
 * A discount the reader cannot find is a discount they do not believe. Held only
 * as a lump sum, `Paket Zagon −100 €` sits in the totals panel beside three rows
 * whose prices never move, and somebody who has just ticked the second box has
 * no reason to think the first one changed. Pricing each part separately lets
 * the row carry it: `500 €` struck through, `400 €` charged, on the line that
 * actually got cheaper.
 *
 * Every figure in `Quote` is a sum of these lines, so the row and the panel are
 * one calculation arriving twice rather than two that have to be kept in step by
 * hand.
 *
 * ## Why parts that are switched off get a line too
 *
 * The summary draws all three rows whatever is selected, and a row that is out
 * still has to say what it would cost. Its line is priced as if the part stood
 * alone — no package can reach it, which is the point: the discount appears when
 * the combination is selected and not before.
 */
export type QuoteLine = {
  part: OfferPart
  selected: boolean
  /** What the part lists at, before a discount of either kind. */
  listOneOff: number
  /** Off the list price whatever else is selected — the booking setup at half. */
  partOneOffDiscount: number
  /** Off it again, by the packages in force. Always zero while the part is out. */
  bundleOneOffDiscount: number
  /** What this part actually costs now, and adds to the one-off total. */
  oneOff: number
  listMonthly: number
  bundleMonthlyDiscount: number
  monthly: number
}

/**
 * What a selection costs.
 *
 * ## Why the discounts are still counted in two groups
 *
 * They are explained in different places. A part discount is a concession on one
 * line item and belongs on that part's row, next to the number it halves. A
 * package discount is the reward for a combination, so it belongs on the row
 * *and* in the panel, beside the name of the package that granted it — the row
 * says which price moved, the panel says why.
 *
 * Summing them into one figure before they reach the page would leave the panel
 * showing a gap between the list total and the total that the listed packages do
 * not account for — which reads as arithmetic the reader cannot check.
 */
export type Quote = {
  /** Every part, in page order, priced against this selection. */
  lines: QuoteLine[]
  parts: OfferPart[]
  /** Sum of every part's list price, before any discount at all. */
  oneOffBeforeDiscount: number
  /** Concessions carried by the parts themselves, whatever else is selected. */
  partOneOffDiscount: number
  /** Taken off the one-off fees by matched rules, never more than was left to take. */
  ruleOneOffDiscount: number
  /** Both of the above. What the reader is not paying, up front. */
  oneOffDiscount: number
  oneOffTotal: number
  /** Sum of every part's recurring fee, before any rule applies. */
  monthlyBeforeDiscount: number
  /** Taken off the recurring total by matched rules — the shared maintenance fee. */
  monthlyDiscount: number
  /** What is actually billed each month. */
  monthly: number
  /** The rules that matched, in the order they are declared. */
  appliedRules: BundleRule[]
  /**
   * What the first year costs less than it lists at — the one-off concessions
   * plus twelve months of the recurring one.
   *
   * A horizon is unavoidable once a discount is recurring: the saving on a
   * permanently smaller monthly bill has no total until a period is named. The
   * label is the only thing that names it — `summary.savingsLabel` — so the two
   * have to change together.
   */
  savings: number
  isEmpty: boolean
}

const partsById = new Map(offerParts.map((part) => [part.id, part]))

/**
 * The packages, as shapes the hero can draw.
 *
 * Each bundle rule becomes a bracket spanning the cards it requires. The
 * geometry is derived from the rule table rather than written down beside it, so
 * adding a package to `offer.ts` draws itself and removing one leaves nothing
 * behind.
 *
 * Rules whose parts are not adjacent in page order are dropped: a bracket that
 * skips the card in the middle would claim that card is included. Such a rule
 * still applies to the total — it just has no shape in the index.
 *
 * Sorted narrowest first, so that where one package contains another the wider
 * bracket sits below it, the way a reader expects a grouping notation to nest —
 * `celota` closes under the two pairs it contains. The sort is stable, so
 * packages of equal width, which overlap rather than nest, stay in the order
 * they are declared and are drawn on rows in that order.
 */
export type PackageBracket = {
  rule: BundleRule
  /** Parts the rule covers, in page order. */
  parts: OfferPart[]
  /** 1-based CSS grid column the bracket starts at. */
  start: number
  /** How many columns it spans. */
  span: number
}

export const packageBrackets: PackageBracket[] = bundleRules
  .map((rule) => {
    const covered = offerParts
      .map((part, index) => ({ part, index }))
      .filter(({ part }) => rule.requires.includes(part.id))

    return { rule, covered }
  })
  .filter(({ covered, rule }) => {
    if (covered.length !== rule.requires.length || covered.length < 2) return false

    const first = covered[0].index
    const last = covered[covered.length - 1].index
    return last - first + 1 === covered.length
  })
  .map(({ rule, covered }) => ({
    rule,
    parts: covered.map(({ part }) => part),
    start: covered[0].index + 1,
    span: covered.length,
  }))
  .sort((a, b) => a.span - b.span)

/** The selection the page loads with: everything marked recommended. */
export const defaultSelection: Selection = offerParts
  .filter((part) => part.recommended)
  .map((part) => part.id)

/**
 * Put a selection back into page order and drop anything unrecognised.
 *
 * Selections arrive from the URL, which anybody can edit and which will still
 * be around after a part has been renamed or dropped from the offer. Order is
 * imposed rather than preserved so that two readers who picked the same parts
 * in a different order see the same summary and share the same link.
 */
export function normalizeSelection(ids: readonly string[]): Selection {
  const wanted = new Set(ids)
  return offerParts.filter((part) => wanted.has(part.id)).map((part) => part.id)
}

export function quote(selection: Selection): Quote {
  const selected = new Set(selection)

  const appliedRules = bundleRules.filter((rule) =>
    rule.requires.every((required) => selected.has(required)),
  )

  /*
    Package discounts, gathered against the part each one names. Only rules in
    force contribute, and a rule is in force only when every part it requires is
    selected — so with `appliesTo` inside `requires`, as the type demands, a
    discount can never be aimed at a row that is switched off.
  */
  const bundleOneOff = new Map<OfferPartId, number>()
  const bundleMonthly = new Map<OfferPartId, number>()

  for (const rule of appliedRules) {
    const { appliesTo } = rule
    bundleOneOff.set(appliesTo, (bundleOneOff.get(appliesTo) ?? 0) + rule.oneOffDiscount)
    bundleMonthly.set(appliesTo, (bundleMonthly.get(appliesTo) ?? 0) + rule.monthlyDiscount)
  }

  const lines: QuoteLine[] = offerParts.map((part) => {
    const isIn = selected.has(part.id)
    const charged = part.oneOff ?? 0
    const listOneOff = part.listOneOff ?? charged
    const listMonthly = part.monthly ?? 0

    /*
      Clamped at what the part still costs, and withheld entirely from a part
      that is out — the second is belt to the first's braces, so that a rule
      pointed at something outside its own `requires` cannot print a discount on
      a row nothing is paying for.

      The rules are written against the price list they were written with, and a
      later edit that lowers a fee below a discount aimed at it would otherwise
      put a negative price on that row and an invoice that pays the client.
      Clamping per line rather than per total is also what keeps the row and the
      panel agreeing: every figure below is a sum of these lines, so editing
      `offer.ts` can produce a smaller saving but never an incoherent one.
    */
    const bundleOneOffDiscount = isIn ? Math.min(bundleOneOff.get(part.id) ?? 0, charged) : 0
    const bundleMonthlyDiscount = isIn ? Math.min(bundleMonthly.get(part.id) ?? 0, listMonthly) : 0

    return {
      part,
      selected: isIn,
      listOneOff,
      partOneOffDiscount: listOneOff - charged,
      bundleOneOffDiscount,
      oneOff: charged - bundleOneOffDiscount,
      listMonthly,
      bundleMonthlyDiscount,
      monthly: listMonthly - bundleMonthlyDiscount,
    }
  })

  const taken = lines.filter((line) => line.selected)
  const sum = (of: (line: QuoteLine) => number) =>
    taken.reduce((total, line) => total + of(line), 0)

  const partOneOffDiscount = sum((line) => line.partOneOffDiscount)
  const ruleOneOffDiscount = sum((line) => line.bundleOneOffDiscount)
  const monthlyDiscount = sum((line) => line.bundleMonthlyDiscount)

  return {
    lines,
    parts: taken.map((line) => line.part),
    oneOffBeforeDiscount: sum((line) => line.listOneOff),
    partOneOffDiscount,
    ruleOneOffDiscount,
    oneOffDiscount: partOneOffDiscount + ruleOneOffDiscount,
    oneOffTotal: sum((line) => line.oneOff),
    monthlyBeforeDiscount: sum((line) => line.listMonthly),
    monthlyDiscount,
    monthly: sum((line) => line.monthly),
    appliedRules,
    savings: partOneOffDiscount + ruleOneOffDiscount + monthlyDiscount * 12,
    isEmpty: taken.length === 0,
  }
}

/** One more part, and everything switching it on would unlock. */
export type Nudge = {
  /** The single part that is missing. */
  part: OfferPart
  /** Every rule adding it would satisfy, in declaration order. */
  rules: BundleRule[]
  /** What those rules grant between them. */
  oneOffDiscount: number
  monthlyDiscount: number
}

/**
 * What adding one more part would unlock, grouped by the part that would do it.
 *
 * This is the page's one piece of genuine persuasion, so it is computed rather
 * than written: it can only ever offer a saving that the rule table really
 * grants, and it disappears by itself once the rule is satisfied.
 *
 * ## Why it is grouped by part rather than listed by rule
 *
 * The packages overlap, so one missing part can be the last thing standing
 * between the reader and two of them at once — `01` and `03` selected leaves
 * `02` blocking both. Listed per rule that renders as two prompts side by side,
 * each naming a different saving and each carrying the same button, which is a
 * page asking twice for one thing. Grouped, it is a single ask that has got
 * stronger rather than more frequent: add this, and both packages apply.
 */
export function nudges(selection: Selection): Nudge[] {
  const selected = new Set(selection)
  const byPart = new Map<OfferPartId, Nudge>()

  for (const rule of bundleRules) {
    if (rule.requires.every((required) => selected.has(required))) continue

    /*
      A rule that grants nothing has nothing to nudge with, and the sentence it
      would produce — "add this and 0 € comes off" — argues against the offer.
      Rules exist for their brackets as well as their discounts, so this is a
      shape the table is allowed to hold; it just does not belong here.
    */
    if (rule.oneOffDiscount <= 0 && rule.monthlyDiscount <= 0) continue

    /*
      Only rules that are one part away. A rule needing two more things is not a
      nudge, it is an upsell for a different offer, and showing it next to the
      one real nudge is what makes a page feel like it is haggling.
    */
    const missing = rule.requires.filter((required) => !selected.has(required))
    if (missing.length !== 1) continue

    const part = partsById.get(missing[0])
    if (!part) continue

    const found = byPart.get(part.id)

    if (found) {
      found.rules.push(rule)
      found.oneOffDiscount += rule.oneOffDiscount
      found.monthlyDiscount += rule.monthlyDiscount
    } else {
      byPart.set(part.id, {
        part,
        rules: [rule],
        oneOffDiscount: rule.oneOffDiscount,
        monthlyDiscount: rule.monthlyDiscount,
      })
    }
  }

  // Page order, so a prompt about `02` sits above one about `03`.
  return offerParts
    .map((part) => byPart.get(part.id))
    .filter((nudge): nudge is Nudge => nudge !== undefined)
}
