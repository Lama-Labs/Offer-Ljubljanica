/**
 * Money, formatted the Slovenian way.
 *
 * ## Why this is not `Intl.NumberFormat`
 *
 * The totals on this page are computed in the browser as the reader changes
 * their selection, but the page itself is pre-rendered at build time — so the
 * same number is formatted once by Node and again by the browser, and React
 * compares the two. `Intl` is the classic way for those two to disagree: the
 * separator it puts between thousands and the space it puts before the symbol
 * are non-breaking characters whose exact code point has moved between ICU
 * versions. The mismatch is invisible to read and shows up as a hydration
 * error over a price, which is the worst place on this page to have one.
 *
 * Slovenian convention, applied literally: a period groups thousands, a comma
 * separates decimals, and the symbol trails after a space. Every figure in the
 * offer is a whole euro, so the decimals are dropped rather than padded to
 * `,00` — `89 €` is how the number would be written in a quote.
 */
export function eur(amount: number): string {
  const rounded = Math.round(amount)
  return `${rounded < 0 ? '−' : ''}${group(Math.abs(rounded))} €`
}

/**
 * The same, to the cent — `0,92 €`.
 *
 * Every figure in the offer proper is a whole euro, which is why `eur` drops
 * decimals. The money graphic is the one place that cannot: its entire argument
 * is that a fixed charge per booking is heavy against a €12 fare, and that
 * argument rounded to euros reads as `1 €` against `0 €` — both wrong and, at
 * that precision, unbelievable.
 */
export function eurExact(amount: number): string {
  const cents = Math.round(Math.abs(amount) * 100)
  const decimals = (cents % 100).toString().padStart(2, '0')

  return `${amount < 0 ? '−' : ''}${group(Math.floor(cents / 100))},${decimals} €`
}

/** Slovenian thousands, grouped from the right with a period. `6000` → `6.000`. */
export function group(whole: number): string {
  const digits = whole.toString()
  let grouped = ''

  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) grouped += '.'
    grouped += digits[i]
  }

  return grouped
}

/**
 * "Izbran 1 del" / "Izbrana 2 dela" / "Izbrani 3 deli" / "Izbranih 5 delov".
 *
 * A table rather than a rule, because the participle and the noun both inflect
 * and the dual makes two a case of its own rather than the start of the plural.
 * Composing that from parts would take more code than the four cases it
 * generates, and would be read by the one audience guaranteed to notice it
 * being wrong.
 */
export function selectedPartsLabel(count: number): string {
  switch (count) {
    case 0:
      return 'Nič izbranega'
    case 1:
      return 'Izbran 1 del'
    case 2:
      return 'Izbrana 2 dela'
    case 3:
      return 'Izbrani 3 deli'
    default:
      return `Izbranih ${count} delov`
  }
}
