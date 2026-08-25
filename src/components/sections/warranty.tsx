import { CheckIcon, XIcon } from 'lucide-react'

import { warranty } from '@/content/copy'
import { guarantee } from '@/content/offer'
import { Section, SectionHeader } from '@/components/ui/section'

/**
 * The guarantee, then the edges of the offer.
 *
 * ## Why the two lists are given equal weight
 *
 * The instinct is to make "included" the long, prominent column and tuck the
 * exclusions underneath in small grey type. That reads as something being
 * hidden, to an audience whose scepticism is the earned kind. Both columns get
 * the same width, the same type and the same spacing, and the exclusions are
 * written as plain statements rather than apologies — several of them are
 * simply true of the software and are better read here than discovered in
 * month two.
 *
 * ## Why only one column's mark is red
 *
 * The ticks are marks in the page's icon language and take the accent; the
 * crosses stay a grey outline. Colouring both would make the section a two-tone
 * chart and invite the reader to weigh the columns against each other, which is
 * the opposite of the point — these are two plain lists, and the right-hand one
 * is not a warning.
 *
 * ## Why the marks are decorative
 *
 * The tick and the cross repeat what the column heading already says, so they
 * are `aria-hidden` and the headings carry the meaning. A screen reader gets
 * "Vključeno v ceno" followed by a list, rather than the word "check" eight
 * times.
 */
export function Warranty() {
  return (
    <Section id="garancija">
      <SectionHeader eyebrow={warranty.eyebrow} heading={warranty.heading} />

      <div className="border-hairline-strong mt-10 rounded-lg border p-5 sm:p-7">
        {/* Not red. The guarantee is not a part of the offer that can be
            switched on, and red on this page reports exactly that state. */}
        <p className="label-mono text-ink">
          {warranty.guaranteeLabel} · {guarantee.days} dni
        </p>
        <p className="type-subtitle text-ink mt-4 max-w-3xl">{guarantee.headline}</p>
        <p className="type-body-sm text-mute mt-3 max-w-3xl">{guarantee.body}</p>
        <p className="type-caption text-faint border-hairline mt-4 border-t pt-4">
          {guarantee.supportNote}
        </p>
      </div>

      <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
        <div>
          <h3 className="label-mono text-faint">{warranty.includedLabel}</h3>
          <ul className="mt-4 space-y-3">
            {warranty.included.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="bg-signal-wash text-signal mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm"
                  aria-hidden
                >
                  <CheckIcon className="size-3" strokeWidth={2.5} />
                </span>
                <span className="type-body-sm text-body">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label-mono text-faint">{warranty.excludedLabel}</h3>
          <ul className="mt-4 space-y-3">
            {warranty.excluded.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="border-hairline-strong text-mute mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border"
                  aria-hidden
                >
                  <XIcon className="size-2.5" strokeWidth={2.5} />
                </span>
                <span className="type-body-sm text-mute">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
