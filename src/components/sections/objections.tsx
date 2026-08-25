import { objections } from '@/content/copy'
import { Copy } from '@/components/ui/copy'
import { Section, SectionHeader } from '@/components/ui/section'

/**
 * The cost of saying yes, listed before anybody has to ask.
 *
 * Every item here is an objection this reader will raise anyway — with their
 * accountant, with their partner, in the week after the meeting when nobody is
 * in the room to answer it. Answering them on the page is worth more than
 * answering them well in person, because the page is what gets forwarded.
 */
export function Objections() {
  return (
    <Section tone="mist">
      <SectionHeader eyebrow={objections.eyebrow} heading={objections.heading} />

      <ul className="mt-8 grid gap-x-12 sm:grid-cols-2">
        {objections.items.map((item) => (
          <li key={item.title} className="border-hairline-strong/60 border-t py-5">
            <h3 className="type-item text-ink">{item.title}</h3>
            <Copy text={item.body} className="type-body-sm text-mute mt-1.5" />
          </li>
        ))}
      </ul>
    </Section>
  )
}
