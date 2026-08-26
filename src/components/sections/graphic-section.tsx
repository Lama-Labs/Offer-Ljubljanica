import type { ReactNode } from 'react'

import type { OfferPartId } from '@/content/offer'
import { Section, SectionHeader } from '@/components/ui/section'

/**
 * A drawing, given a band of its own.
 *
 * ## Why the two graphics came out of their parts
 *
 * `MoneyFlow` and `GuestRoute` used to be `children` of the part they argue
 * for — a figure at the foot of a section, under nine feature lines and a
 * screenshot or three. Each is the strongest thing its part has to say: *no
 * commission, the money is yours* and *today the guest's path breaks at the
 * first step*. Neither survived being the eleventh thing in a section.
 *
 * As their own bands they get a heading at the size the rest of the page gives
 * a heading, a paragraph of their own, and a change of ground on either side —
 * which is the whole apparatus this document has for saying *stop here, this
 * one matters*.
 *
 * ## Why they are grey and the three parts are white
 *
 * The bands used to alternate roughly every second section, which separated
 * neighbours and meant nothing else. They now sort the page into two kinds of
 * thing. `paper` is the offer: the hero and the three parts, the sections a
 * reader is deciding about. `mist` is everything that argues about the offer
 * without being part of it — these two drawings, and the price panel where the
 * figures are added up.
 *
 * A reader scrolling fast can tell the two apart without reading either, which
 * is worth more than the alternation ever was: three white sections in a row,
 * each opening with the same letterhead, read as one comparable set rather than
 * as one section, a different section, and a third that resembles the first.
 *
 * ## Why the scope is still a part's
 *
 * The band left the part; the argument did not. `data-part` keeps the graphic in
 * its part's hue, so the route's icon tiles stay the same blue as the tiles in
 * `02` directly above them, and a reader who has learnt that blue means *the
 * tourist site* is not made to learn it twice. It costs no layout — see the
 * `--accent` note in `globals.css`.
 *
 * `MoneyFlow` does not read `accent` at all; it names `{signal}` directly, for
 * the reason set out in its own file. The scope is declared for it anyway, so
 * that the two mini sections are the same object and nothing in either has to
 * know which of the two it is.
 *
 * ## Why there is no eyebrow
 *
 * Every figure on this page used to carry a mono label over its heading, and
 * every one of them named the thing the heading underneath was already about.
 * A section that is one drawing does not need to be told apart from the drawing.
 * What is left is the heading, the sentence under it, and the thing itself.
 */
export function GraphicSection({
  part,
  heading,
  lead,
  children,
}: {
  /** Whose argument this draws. Supplies the hue and nothing else. */
  part: OfferPartId
  heading: string
  /** One sentence. Omitted where the drawing's own stops explain it. */
  lead?: string
  children: ReactNode
}) {
  return (
    <Section tone="mist">
      <div data-part={part} className="contents">
        <SectionHeader heading={heading} lead={lead} />

        <div className="mt-10">{children}</div>
      </div>
    </Section>
  )
}
