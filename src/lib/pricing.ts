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
 * as a lump sum, `−100 €` sits in the totals panel beside three rows
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
 * alone — no rule can reach it, which is the point: the discount appears when
 * the combination is selected and not before.
 */
export type QuoteLine = {
  part: OfferPart
  selected: boolean
  /** What the part lists at, before a discount of either kind. */
  listOneOff: number
  /** Off the list price whatever else is selected — the booking setup at half. */
  partOneOffDiscount: number
  /** Off it again, by the rules in force. Always zero while the part is out. */
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
 * ## Why the two kinds of one-off discount are still counted apart
 *
 * The panel adds them together and prints one `Popust`, because a reader
 * deciding between three parts wants the price, not a ledger to audit before
 * they can find it. They are kept apart here anyway, because they remain
 * different commercial objects — a standing concession on this client's setup
 * fee, which no combination grants and none can take away, and a reward for a
 * combination that appears and disappears with the selection. Their sum is one
 * addition; recovering the halves from a total is not.
 */
export type Quote = {
  /** Every part, in page order, priced against this selection. */
  lines: QuoteLine[]
  parts: OfferPart[]
  /**
   * Sum of every part's list price, before any discount at all.
   *
   * The panel strikes this through beside the savings chip, so it is the only
   * place the reader is shown what they would have paid. It equals
   * `oneOffTotal + oneOffDiscount` by construction and is returned anyway: a
   * figure the page prints should come from the same pass that priced the
   * lines, not be re-derived at the point of display.
   */
  oneOffBeforeDiscount: number
  /** Concessions carried by the parts themselves, whatever else is selected. */
  partOneOffDiscount: number
  /** Taken off the one-off fees by matched rules, never more than was left to take. */
  ruleOneOffDiscount: number
  /** Both of the above. What the reader is not paying up front — the panel's `Popust`. */
  oneOffDiscount: number
  oneOffTotal: number
  /** Sum of every part's recurring fee, before any rule applies. */
  monthlyBeforeDiscount: number
  /**
   * Taken off the recurring bill by matched rules — the shared maintenance fee.
   *
   * Stated beside `oneOffDiscount` in the panel rather than added to it. A
   * permanently smaller monthly bill has no total until a period is named, and
   * the panel names none: it prints both figures and leaves the horizon alone.
   */
  monthlyDiscount: number
  /** What is actually billed each month. */
  monthly: number
  /** The rules that matched, in the order they are declared. */
  appliedRules: BundleRule[]
  isEmpty: boolean
}

/** The selection the page loads with: everything marked recommended. */
export const defaultSelection: Selection = offerParts
  .filter((part) => part.recommended)
  .map((part) => part.id)

/**
 * Put a selection back into page order and drop anything unrecognised.
 *
 * Order is imposed rather than preserved so that a selection reads the same way
 * however it was built: the summary rows, the totals and the e-mail all list the
 * parts in the order the page argues for them, whether the reader ticked `03`
 * first or last.
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
    Rule discounts, gathered against the part each one names. Only rules in
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
    isEmpty: taken.length === 0,
  }
}
