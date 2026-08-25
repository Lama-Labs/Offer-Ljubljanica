import { exhibits, proposal } from '@/content/copy'
import { OfferSelectionProvider } from '@/components/offer-selection'
import { MoneyFlow } from '@/components/graphics/money-flow'
import { GuestRoute } from '@/components/graphics/route'
import { Close } from '@/components/sections/close'
import { Diagnosis } from '@/components/sections/diagnosis'
import { Hero } from '@/components/sections/hero'
import { Objections } from '@/components/sections/objections'
import { OfferPartSection } from '@/components/sections/offer-part'
import { OfferSummary } from '@/components/sections/offer-summary'
import { PageFooter } from '@/components/sections/page-footer'
import { Takeaways } from '@/components/sections/takeaways'
import { Team } from '@/components/sections/team'
import { Warranty } from '@/components/sections/warranty'
import { Exhibit } from '@/components/ui/exhibit'
import { Section, SectionHeader } from '@/components/ui/section'

/**
 * The proposal, in the order the argument has to be made.
 *
 * ## The argument
 *
 * The hero shows the whole offer — three parts, three prices, and the bracket
 * saying which two go together — so that nobody has to read eleven sections to
 * find out what is being proposed. Everything below justifies that card.
 *
 * Then: diagnosis before proposal, because nobody buys a solution to a problem
 * they have not agreed they have. The two necessary parts before the optional
 * one, so the optional one reads as an extra rather than as the third of three
 * things being asked for. The summary after all three, because it is the only
 * point at which the reader can compare them. And the cost of adopting after the
 * price, because "what does this cost me" is the question the price provokes
 * rather than the one it answers.
 *
 * ## The rhythm
 *
 * There is no band alternation any more — no black, no slam. Sections sit on
 * `paper` and step to `mist` only where two would otherwise run together, which
 * is roughly every second one. The page reads as a document rather than as a
 * sequence of slides, which is what it is.
 *
 * ## Where the graphics go
 *
 * One per part, at most, and each carries the claim that part cannot afford to
 * leave as a sentence: the money rails under `01` because *no commission, money
 * direct to you* is the entire pitch, and the guest's route under `02` because
 * the whole case for a second website is that today's path breaks at the first
 * step. `03` gets none — it is the optional part, and giving it a diagram would
 * argue for it harder than the offer does.
 *
 * `01` used to carry a second one: the two lines of HTML, printed verbatim as
 * evidence for "namestitev sta dve vrstici". It was evidence for a reader who
 * was never going to be the one pasting it. The claim stays, in a feature line
 * where it belongs; the proof of it is a conversation for whoever does the
 * install.
 */
export default function ProposalPage() {
  return (
    <OfferSelectionProvider>
      <Hero />

      <main>
        <Takeaways />

        <Diagnosis />

        <Section tone="mist" size="tight">
          <SectionHeader
            eyebrow={proposal.eyebrow}
            heading={proposal.heading}
            lead={proposal.lead}
            size="display"
          />
        </Section>

        <OfferPartSection
          id="booking"
          exhibits={{
            /* Native size, so nothing in it is upscaled — and the key sits
               beside it rather than under, because a 461px plate with a
               full-width caption block below reads as two objects. */
            site: (
              <Exhibit
                {...exhibits.widget}
                src="/images/widget.png"
                width={461}
                height={380}
                plateWidth={461}
              />
            ),
            /* Cropped to where the content stops. The capture carries three
               hundred pixels of empty workspace below the last row, and a
               figure that is one third empty argues the product is. */
            office: (
              <Exhibit
                {...exhibits.dashboard}
                src="/images/dashboard.png"
                width={1344}
                height={875}
                aspect="1344/580"
              />
            ),
            /* Anchored right, which drops the console's left nav. The claim in
               this group is that the crew never reaches the rest of the system;
               printing the settings menu beside it contradicts the sentence. */
            jetty: (
              <Exhibit
                {...exhibits.checkin}
                src="/images/checkin.png"
                width={1377}
                height={873}
                aspect="1125/873"
                anchor="right"
              />
            ),
          }}
        >
          <MoneyFlow />
        </OfferPartSection>

        <OfferPartSection
          id="landing"
          tone="mist"
          exhibits={{
            /* The one provisional figure on the page: dashed mount, and a
               caption that says in words what the dashes say in the margin. */
            contents: (
              <Exhibit
                {...exhibits.landing}
                src="/images/landing-wireframe.png"
                width={936}
                height={1681}
                aspect="936/730"
                anchor="top"
                provisional
                on="mist"
              />
            ),
          }}
        >
          <GuestRoute />
        </OfferPartSection>

        <OfferPartSection id="redesign" />

        <OfferSummary />

        <Warranty />

        <Objections />

        <Team />

        <Close />
      </main>

      <PageFooter />
    </OfferSelectionProvider>
  )
}
