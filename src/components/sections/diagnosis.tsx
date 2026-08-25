import { diagnosis } from '@/content/copy'
import { Copy } from '@/components/ui/copy'
import { Section, SectionHeader } from '@/components/ui/section'

/*
  The anchor lives here now. It used to be declared in the hero, back when a
  "Najprej razlaga" button pointed at it; with that button gone the section is
  the only thing that still cares where it is.
*/
export const DIAGNOSIS_ANCHOR = 'stanje'

/**
 * What we noticed, before anything is proposed.
 *
 * ## Why these are rows and not cards
 *
 * Six cards in a grid read as six features — six things somebody is pleased
 * about. These are six failures, and the reader is being asked to recognise
 * them, not to shop for them. Set as hairline-divided rows under two headings
 * they read the way a list of observations reads: quietly, in order, with
 * nothing dressed up.
 *
 * It also leaves the card treatment to mean one thing on this page — something
 * that is part of the offer — rather than being the default container for any
 * paragraph.
 */
export function Diagnosis() {
  return (
    <Section id={DIAGNOSIS_ANCHOR}>
      <SectionHeader eyebrow={diagnosis.eyebrow} heading={diagnosis.heading} lead={diagnosis.lead} />

      <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {diagnosis.groups.map((group) => (
          <div key={group.title}>
            <h3 className="label-mono text-faint">{group.title}</h3>

            <ul className="mt-4">
              {group.items.map((item) => (
                <li key={item.title} className="border-hairline border-t py-5">
                  <h4 className="type-item text-ink">{item.title}</h4>
                  <Copy text={item.body} className="type-body-sm text-mute mt-1.5" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
