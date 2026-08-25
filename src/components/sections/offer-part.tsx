import type { ReactNode } from 'react'

import { parts as partCopy, type FeatureItem } from '@/content/copy'
import { offerParts, type OfferPartId } from '@/content/offer'
import { PartAbsenceNote } from '@/components/part-index'
import { Copy } from '@/components/ui/copy'
import { IconTile } from '@/components/ui/icon'
import { Section, type BandTone } from '@/components/ui/section'

/**
 * One part of the offer: the argument, and nothing else.
 *
 * ## Why there is no selector at the foot
 *
 * There used to be one — a price card with a toggle, under each of the three
 * sections. It repeated a name and a price the reader had already met on the
 * hero cards, and it asked for a decision in the middle of an explanation.
 * Selection now lives in the index at the top of the page and in the summary at
 * the bottom, which are the two moments a reader is actually choosing rather
 * than reading. What is left here is the argument and, when the part is out, one
 * sentence saying what leaving it out costs.
 *
 * ## Why the features are grouped by place
 *
 * The booking system has thirty things worth saying about it, and the earlier
 * draft said all of them as ten paragraphs in a row. Nobody read the tenth. They
 * are now nine lines in three groups — **na vaši strani**, **v pisarni**, **na
 * pomolu** — which are not software modules but the three places this operator's
 * day actually happens. A reader recognises the places before they read the
 * lines, so the section is legible at a glance and precise on a second pass.
 *
 * The limit is enforced by the copy file, not here: a title of a few words and a
 * single sentence. Anything needing more is a graphic, and graphics come in
 * through `children`.
 *
 * ## Why all three parts share this shape
 *
 * They are being compared. Three sections built differently would have the
 * reader weighing the layouts as much as the offers — the optional one looking
 * flimsier for having fewer points rather than for being optional.
 */
function FeatureList({ items }: { items: FeatureItem[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.title}>
          <IconTile name={item.icon} />
          <h4 className="type-item text-ink mt-3">{item.title}</h4>
          <Copy text={item.body} className="type-body-sm text-mute mt-1.5" />
        </li>
      ))}
    </ul>
  )
}

export function OfferPartSection({
  id,
  children,
  exhibits,
  tone = 'paper',
}: {
  id: OfferPartId
  children?: ReactNode
  /**
   * A figure per group, keyed by `group.id`, rendered under that group's
   * feature lines.
   *
   * They go inside the group rather than at the foot of the section because a
   * screenshot is evidence for particular sentences, and evidence three
   * paragraphs away from its claim is read as a general illustration. The jetty
   * capture belongs under *na pomolu* or nowhere.
   *
   * It also costs nothing structurally: the exhibit inherits the group's own
   * `1fr` column, so it starts on the same left edge as the feature titles
   * above it and the group's mono heading keeps labelling everything under it.
   */
  exhibits?: Partial<Record<string, ReactNode>>
  tone?: BandTone
}) {
  const copy = partCopy[id]
  const part = offerParts.find((each) => each.id === id)

  return (
    <Section id={id} tone={tone}>
      <header className="max-w-2xl">
        <p className="label-mono text-faint flex items-center gap-2.5">
          {/* The part's numeral, at rest. The live one — the copy that turns red
              when the part is in the offer — is the toggle at the foot of the
              section and the card in the hero; a heading is not a state
              readout. */}
          <span className="num-sm text-ink">
            {String(part?.number ?? 0).padStart(2, '0')}
          </span>
          <span className="bg-hairline-strong inline-block h-px w-6" aria-hidden />
          {copy.kicker}
        </p>

        <h2 className="type-title text-ink mt-3">{copy.heading}</h2>
        <Copy text={copy.lead} className="type-body text-mute measure mt-4" />
      </header>

      <div className="mt-12 space-y-12">
        {copy.groups.map((group) => (
          <div key={group.id} className="grid gap-x-10 gap-y-5 lg:grid-cols-[160px_1fr]">
            <h3 className="label-mono text-faint lg:pt-2.5">{group.title}</h3>

            <div>
              <FeatureList items={group.items} />
              {exhibits?.[group.id]}
            </div>
          </div>
        ))}
      </div>

      {children}

      <PartAbsenceNote id={id} />
    </Section>
  )
}
