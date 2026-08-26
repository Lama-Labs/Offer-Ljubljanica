import { exhibits } from '@/content/copy'
import { OfferSelectionProvider } from '@/components/offer-selection'
import { PartRail } from '@/components/part-rail'
import { MoneyFlow } from '@/components/graphics/money-flow'
import { GuestRoute } from '@/components/graphics/route'
import { Close } from '@/components/sections/close'
import { FinePrint } from '@/components/sections/fine-print'
import { Hero } from '@/components/sections/hero'
import { OfferPartSection } from '@/components/sections/offer-part'
import { OfferSummary } from '@/components/sections/offer-summary'
import { PageFooter } from '@/components/sections/page-footer'
import { Team } from '@/components/sections/team'
import { Exhibit } from '@/components/ui/exhibit'

/**
 * The proposal, in the order the argument has to be made.
 *
 * ## The argument
 *
 * The hero is both halves of the opening argument now: three problems, and
 * directly under each one the part of the offer that answers it. Diagnosis
 * before proposal still holds — nobody buys a solution to a problem they have
 * not agreed they have — it just happens in one screenful instead of across two
 * sections, and every problem arrives already attached to its answer rather than
 * in a pile the reader has to sort through afterwards.
 *
 * That is what `Zakaj izboljšati sistem` and `Kaj vidimo od zunaj` used to do
 * between them, over nine observations. Three of those survive, one per part;
 * the rest were symptoms of the same three causes, and a symptom the offer does
 * not separately answer buys an agreement the page then has no use for.
 *
 * Everything below justifies those three cards. The two necessary parts before
 * the optional one, so the optional one reads as an extra rather than as the
 * third of three things being asked for. The summary after all three, because it
 * is the only point at which the reader can compare them. And the cost of
 * adopting after the price, because "what does this cost me" is the question the
 * price provokes rather than the one it answers.
 *
 * ## The rhythm
 *
 * There is no black and no slam, and the alternation is no longer arithmetic.
 * The two grounds sort the page into two kinds of thing: `paper` is the offer —
 * the hero and the three parts, the sections a reader is deciding about — and
 * `mist` is what argues about the offer without being part of it. That is the
 * two drawings and the price panel.
 *
 * There were two bands after the price — the guarantee with the scope, and the
 * objections — and they are one shut drawer inside the price panel's own band
 * now. Both were read by the same person at the same moment, somebody checking
 * a figure they had just been shown, and neither was read by anybody who had
 * not seen it. See `fine-print.tsx` for what that costs and why it is worth it.
 *
 * The three parts therefore run white, white, white, each opening with the same
 * letterhead, which is what makes them read as one comparable set. Under the old
 * rule `02` was grey for no reason except that it came second, and a reader
 * comparing three offers was quietly told the middle one was a different sort of
 * object.
 *
 * ## Where the graphics go
 *
 * One per part, at most, and each carries the claim that part cannot afford to
 * leave as a sentence: the money rails for `01` because *no commission, money
 * direct to you* is the entire pitch, and the guest's route for `02` because the
 * whole case for a second website is that today's path breaks at the first step.
 * `03` gets none — it is the optional part, and giving it a diagram would argue
 * for it harder than the offer does.
 *
 * Both used to be `children` of the section they belong to, which put each of
 * them eleventh in its own part, under nine feature lines and up to three
 * screenshots. They are their own bands now, directly after the part they
 * argue for, in that part's hue — see `GraphicSection`.
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
      {/* Outside `main`, and first: it is a landmark for the whole document
          rather than part of its content, and a reader tabbing in should reach
          the index before the argument. */}
      <PartRail />

      <Hero />

      <main>
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
        />

        <MoneyFlow />

        <OfferPartSection
          id="landing"
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
              />
            ),
          }}
        />

        <GuestRoute />

        <OfferPartSection id="redesign" />

        <OfferSummary>
          <FinePrint />
        </OfferSummary>

        <Team />

        <Close />
      </main>

      <PageFooter />
    </OfferSelectionProvider>
  )
}
