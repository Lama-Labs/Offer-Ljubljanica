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
 * What a selection costs.
 *
 * ## Why the discounts are split in two
 *
 * They are explained in different places, so they have to be counted
 * separately. A part discount is a concession on one line item — the booking
 * setup at half price — and belongs on that part's row, next to the number it
 * halves. A rule discount is the reward for a combination and belongs in the
 * totals panel, beside the name of the package that granted it.
 *
 * Summing them into one figure before they reach the page would leave the panel
 * showing a gap between the list total and the total that the listed packages do
 * not account for — which reads as arithmetic the reader cannot check.
 */
export type Quote = {
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
  const parts = offerParts.filter((part) => selected.has(part.id))

  /* The list price of a part is what it lists at when that differs, and simply
     its price when it does not. */
  const listOneOff = (part: OfferPart) => part.listOneOff ?? part.oneOff ?? 0

  const oneOffBeforeDiscount = parts.reduce((sum, part) => sum + listOneOff(part), 0)
  const partOneOffDiscount = parts.reduce(
    (sum, part) => sum + (listOneOff(part) - (part.oneOff ?? 0)),
    0,
  )

  const monthlyBeforeDiscount = parts.reduce((sum, part) => sum + (part.monthly ?? 0), 0)

  const appliedRules = bundleRules.filter((rule) =>
    rule.requires.every((required) => selected.has(required)),
  )

  /*
    Both clamped. The rules are written against the price list they were written
    with, and a later edit that lowers a fee below its own discount would
    otherwise turn a total negative — an invoice that pays the client. The
    one-off is clamped at what the part concessions have already left, so the two
    layers cannot between them discount more than there was to discount.
    Clamping here means editing `offer.ts` can produce a smaller saving but never
    an impossible one.
  */
  const ruleOneOffDiscount = Math.min(
    appliedRules.reduce((sum, rule) => sum + rule.oneOffDiscount, 0),
    oneOffBeforeDiscount - partOneOffDiscount,
  )

  const monthlyDiscount = Math.min(
    appliedRules.reduce((sum, rule) => sum + rule.monthlyDiscount, 0),
    monthlyBeforeDiscount,
  )

  const oneOffDiscount = partOneOffDiscount + ruleOneOffDiscount
  const oneOffTotal = oneOffBeforeDiscount - oneOffDiscount
  const monthly = monthlyBeforeDiscount - monthlyDiscount

  return {
    parts,
    oneOffBeforeDiscount,
    partOneOffDiscount,
    ruleOneOffDiscount,
    oneOffDiscount,
    oneOffTotal,
    monthlyBeforeDiscount,
    monthlyDiscount,
    monthly,
    appliedRules,
    savings: oneOffDiscount + monthlyDiscount * 12,
    isEmpty: parts.length === 0,
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
