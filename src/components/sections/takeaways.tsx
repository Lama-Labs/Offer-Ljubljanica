import { takeaways } from '@/content/copy'
import { Copy } from '@/components/ui/copy'
import { IconTile } from '@/components/ui/icon'
import { Section, SectionHeader } from '@/components/ui/section'

/**
 * The three claims, for the reader who never gets past the first screenful.
 *
 * A proposal gets forwarded to people who will never read it end to end — the
 * partner, the accountant, whoever actually signs. This section is written for
 * them: three claims that stand on their own, so anybody who reads only this far
 * can still describe the offer accurately to somebody else.
 *
 * ## Why they are not numbered
 *
 * They were, in the earlier draft: `01 / 02 / 03` in a row of cards. But three
 * claims are a set, not a sequence — nothing about the second follows from the
 * first — and the page now spends its numerals on the one thing that genuinely
 * is indexed, which is the three parts of the offer. A reader who meets `02`
 * twice, meaning two different things, has to stop and work out which.
 */
export function Takeaways() {
  return (
    <Section tone="mist" size="tight">
      <SectionHeader eyebrow={takeaways.eyebrow} heading={takeaways.heading} />

      <ul className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-3">
        {takeaways.items.map((item) => (
          <li key={item.title}>
            <IconTile name={item.icon} />
            <h3 className="type-item text-ink mt-3">{item.title}</h3>
            <Copy text={item.body} className="type-body-sm text-mute mt-1.5" />
          </li>
        ))}
      </ul>
    </Section>
  )
}
