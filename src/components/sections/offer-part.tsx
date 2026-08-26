import type { ReactNode } from 'react'

import { parts as partCopy, type FeatureItem } from '@/content/copy'
import { offerParts, type OfferPartId } from '@/content/offer'
import { PartMark, PartOfferToggle } from '@/components/part-index'
import { Copy } from '@/components/ui/copy'
import { IconTile } from '@/components/ui/icon'
import { Section } from '@/components/ui/section'
import { cn } from '@/lib/utils'

/**
 * One part of the offer: the argument, and nothing else.
 *
 * ## Why the kicker is the title
 *
 * The header used to open with `01 — SISTEM ZA REZERVACIJE IN SPLETNA PLAČILA`
 * set as tracked mono capitals at 12px, and give the display size to
 * `heading` — *Mesečna naročnina na Alpaca Booking*. That put the part's own
 * name in the smallest type in the block and the terms it is sold on in the
 * largest, which is the wrong way round for the three things this whole page is
 * about: a reader scrolling past a section should be able to tell which part
 * they are in from the one line they actually read.
 *
 * So `kicker` is the `<h2>` now, at `type-display` — the same step the hero's
 * headline uses. Not larger: three sections shouting over the document's own
 * title would make the proposal read as three proposals. It is held to
 * `max-w-2xl` against the hero's `max-w-3xl`, so at equal size the hero is still
 * the wider line.
 *
 * `heading` survives directly under it as a `type-subtitle` in `{mute}`. It is
 * the commercial framing — what you are subscribing to, who the page is for —
 * and it belongs in the header; it just does not belong at the top of it.
 *
 * ## Why there is no selector at the foot
 *
 * There used to be one — a price card with a toggle, under each of the three
 * sections. It repeated a name and a price the reader had already met on the
 * hero cards, and it asked for a decision in the middle of an explanation.
 * Selection lives in the summary at the bottom, which is the moment a reader is
 * actually choosing rather than reading. What is left here is the argument and,
 * when the part is out, one sentence saying what leaving it out costs.
 *
 * ## Why the features are grouped, and why 01's groups are not named
 *
 * The booking system has thirty things worth saying about it, and the earlier
 * draft said all of them as ten paragraphs in a row. Nobody read the tenth. They
 * are now nine lines in three groups, one per screen the system actually has:
 * the booking form on the operator's site, the console in the office, the crew's
 * phone at the jetty. The grouping is what makes the section legible at a glance
 * and precise on a second pass, and it still does that work when nothing prints
 * it — three blocks with visible space between them are three blocks.
 *
 * The groups were titled twice, first for the places the operator's day happens
 * — *na vaši strani*, *v pisarni*, *na pomolu* — and then for who each one
 * serves: *Kaj omogoča turistu*, *vam*, *posadki*. Both readings were true and
 * neither earned its line, because every group under 01 opens on its exhibit and
 * an exhibit already carries a heading naming exactly what is in it. The group
 * title sat directly on top of that, and it was always the vaguer of the two:
 * *Kaj omogoča turistu* over *Kako turist rezervira plovbo*. A heading
 * introducing a heading tells a reader the writer could not decide which one was
 * the title.
 *
 * So `title` is optional in the copy file, and 01's three groups go without. The
 * hairline goes with it: it existed to keep one titled block off the next, and
 * with no titles it was furniture doing what the whitespace already did.
 *
 * Where a group keeps a title — 02's *Zakaj ločena stran za turiste*, 03's *Kaj
 * bi naredili* — it is carrying a block that has no figure at the head of it, or
 * one whose figure is illustration rather than the claim. It is set at
 * `type-subhead` in `{ink}`: a clear step above the `type-item` feature titles
 * under it, and well short of the part's own `type-display`. It was an eyebrow
 * once, tracked mono capitals in `{faint}`, which is the page's index voice —
 * fine for naming a thing, useless for making a claim, and these titles are
 * claims.
 *
 * The limit is enforced by the copy file, not here: a title of a few words and
 * a single sentence. Anything needing more than that is a graphic, and graphics
 * are no longer part of this section at all — they have their own bands after
 * it. See `GraphicSection`.
 *
 * ## Why a group title sits above its lines and not beside them
 *
 * It used to hold a 160px column of its own on the left, with the feature lines
 * in a `1fr` column beside it. That reads well in a specification, where every
 * row is a term and its definition, and badly here: the label is three words, so
 * nine tenths of its column was empty, and the empty part sat directly over
 * whatever the previous group had ended on. Where a group ended in an exhibit
 * the gap was a hand's width of nothing, and the eye crossing it lost the thread
 * between the label and the sentence that was supposed to follow from it.
 *
 * Above is where a heading goes in a document, and this page is a document. The
 * feature list gets the whole width back with it, so three columns of lines sit
 * under three columns of lines rather than shifting right by 160px.
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
  exhibits,
}: {
  id: OfferPartId
  /**
   * A figure per group, keyed by `group.id`, rendered at the head of that group,
   * above its feature lines.
   *
   * They go inside the group rather than at the foot of the section because a
   * screenshot is evidence for particular sentences, and evidence three
   * paragraphs away from its claim is read as a general illustration. The jetty
   * capture belongs with the jetty lines or nowhere.
   *
   * ## Why the figure comes first
   *
   * It used to sit under the nine feature lines, which made it a proof offered
   * after the argument had already been made — and by then the reader has either
   * accepted the sentences or stopped reading them. Leading with the capture
   * inverts that: the group opens on the actual screen, and the lines beneath
   * read as annotations of something the reader is already looking at rather
   * than as claims about something they are being asked to imagine.
   *
   * It also puts the exhibit's own heading — *Kako turist rezervira plovbo*,
   * *Nadzorna plošča sistema* — directly under the group's, where the two read
   * as one opening rather than as a title at the top of a block and an unrelated
   * one buried in the middle of it.
   *
   * It costs nothing structurally: the exhibit runs the same full measure as the
   * feature list, so both start on the same left edge — and under 01, where the
   * groups print no heading of their own, the exhibit's heading is what names
   * the block.
   */
  exhibits?: Partial<Record<string, ReactNode>>
}) {
  const copy = partCopy[id]
  const part = offerParts.find((each) => each.id === id)

  return (
    <Section id={id}>
      {/*
        `display: contents` so the scope costs no layout: it exists only to hand
        every icon tile, exhibit chip and border under it this part's hue. See
        the `--accent` note in `globals.css`.
      */}
      <div data-part={id} className="contents">
        <header>
          {/* The same tile-and-numeral cluster the hero card opens with, at the
              same size. On its own line above the title rather than tucked into
              it: the numeral used to be a grey `0.8em` prefix inside the
              heading, which made it a piece of typography. With the mark beside
              it, it is the part's letterhead, and a letterhead goes above. */}
          {part ? <PartMark part={part} className="mb-5" /> : null}

          {/*
            The switch rides the title line, at the far edge of the section.

            Beside the title it reads as a property of the part — *this one is
            in* — rather than as a verdict the section has just argued its way
            to, and it is in the first screenful of every part instead of behind
            however much of one the reader has scrolled. Whether they act on it
            now or after reading is then their decision rather than the layout's.

            `items-start` so it holds the first line of the title while a title
            that wraps to two grows downwards past it. The title keeps its own
            measure; only this row spans the full width, so the prose below still
            breaks where it always did.
          */}
          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
            <h2 className="type-display text-ink max-w-2xl min-w-0 text-balance">{copy.kicker}</h2>
            <PartOfferToggle id={id} />
          </div>

          <p className="type-subtitle text-mute mt-3 max-w-2xl">{copy.heading}</p>
          <Copy text={copy.lead} className="type-body text-mute measure mt-5" />
        </header>

        {/*
          One rule per boundary, and only ever at a boundary.

          It used to be conditional on the group having a title, so when the
          titles came out of `01` and `02` their groups lost every marker they
          had and the section became six evenly spaced blocks. Meanwhile the
          figure carried a rule of its own at its foot — which, once the
          screenshot moved to the top of the group, drew a line straight between
          the screen and the sentences about it. A reader met a divider in the
          middle of a claim and none at the end of one.

          So the rule lives here, on every group but the first, and `Exhibit`
          no longer draws one at all. 64px above it, 48px below: the space is
          asymmetric on purpose, so the rule reads as belonging to the group it
          opens rather than as floating between two.

          Both figures grew — 32px under the rule was not enough for what
          follows it. Every group opens on a screenshot or a heading, and both
          are heavy objects: a hairline that close reads as the top edge of the
          picture rather than as the seam between two groups. The gap above grew
          with it to keep the asymmetry legible, because 64:56 is not a
          relationship a reader can see and 64:48 is.
        */}
        <div className="mt-12 space-y-16">
          {copy.groups.map((group, index) => (
            <div key={group.id} className={cn(index > 0 && 'border-hairline border-t pt-12')}>
              {group.title ? <h3 className="type-subhead text-ink mb-7">{group.title}</h3> : null}

              <div className="space-y-10">
                {exhibits?.[group.id]}
                <FeatureList items={group.items} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
