import { hero } from '@/content/copy'
import { agency, client, terms } from '@/content/offer'
import { PartIndexColumns } from '@/components/part-index'
import { HERO_ANCHOR } from '@/lib/anchors'
import { Logo } from '@/components/ui/logo'
import { Copy } from '@/components/ui/copy'

/**
 * The hero, which is the whole offer.
 *
 * ## Why the whole argument is up here
 *
 * The reader's first question is not "what is your thesis". It is *what are you
 * proposing*, and a page that withholds that until the eighth section is
 * asking them to read on trust they have not been given any reason to extend. So
 * the three parts and their one-line summaries are all above the fold. The cards
 * only state them — there is nothing to press and nowhere to jump — because
 * choosing comes later, in the summary, once the case for each part has been
 * made.
 *
 * Above each card is the problem that part answers. That is the other half of
 * the same argument, and it used to be two sections further down: nine
 * observations, read before any of the three parts had been named, and then left
 * to the reader to match up. Three problems, each with its answer directly
 * beneath it and an arrow between, is the same case made in a quarter of the
 * words — and made in the one place on this page a reader is certain to be.
 *
 * It also means the page can be understood by somebody who reads nothing else —
 * which, for a document that gets forwarded to a partner and an accountant, is
 * most of the people who will open it.
 *
 * ## One screenful, and exactly one
 *
 * The section claims to be everything a reader needs above the fold, so it is
 * held to a viewport: `min-h-svh`, less the 3.5rem the sticky rail takes out of
 * the first screen from `lg` up. Without the subtraction the hero would be a
 * rail's height too tall and the last row of cards would sit just under the
 * bottom edge — the one place a card must never be on a page arguing that
 * nothing is being hidden.
 *
 * `svh` rather than `vh` because a phone's `vh` is measured with the browser
 * chrome retracted, which is not the height the reader actually has when they
 * open the link. The small unit is the honest one for a block that has to fit.
 *
 * What fills the extra height is space rather than content. The masthead and the
 * heading sit at the top where a document's do; the three columns take the
 * leftover with an auto margin above and below, so they ride down the middle of
 * whatever is spare on a tall screen and close back up on a laptop. Nothing
 * stretches and nothing is centred as a group — the page still starts at the top
 * of the page.
 *
 * ## Why there is nothing to click
 *
 * There were two buttons: one down to the summary, one down to the section that
 * set out the problem. Both were asking the reader to go somewhere else at the
 * exact moment the thing worth looking at had appeared underneath them — and the
 * second one has since had its destination folded into this screenful, which is
 * the more thorough version of the same fix. The cards inherited the jump for a
 * while and it was the same mistake in smaller type. A hero whose primary action
 * is *scroll* does not need anything that says so.
 *
 * ## The masthead
 *
 * Who it is for, which draft this is, and who wrote it — set as a mono rule
 * across the top. A pill would be wrong here: every other pill-shaped thing on
 * this page can be pressed. This is a document header and it is set like the top
 * of a document.
 *
 * The version earns its place because this link gets forwarded and then
 * superseded. Without it, "the one you sent me" is not a checkable statement.
 */
export function Hero() {
  return (
    <header
      id={HERO_ANCHOR}
      className="bg-paper flex min-h-svh flex-col lg:min-h-[calc(100svh-3.5rem)]"
    >
      <div className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col px-5 pt-8 pb-16 sm:px-8 sm:pt-10 sm:pb-24">
        <div className="border-hairline label-mono text-faint flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b pb-4">
          <p className="text-ink">
            {hero.eyebrow} — {client.businessName}
          </p>
          {/* The mark trails the sender's name rather than leading the row:
              at the head of the line it would sit beside the client's name on
              the left half of the rule and read as theirs. */}
          <p className="flex items-center gap-2.5">
            različica {terms.version} · {agency.name}
            <Logo />
          </p>
        </div>

        <div className="mt-12 sm:mt-16">
          <h1 className="type-display text-ink max-w-3xl text-balance">{hero.heading}</h1>

          <Copy text={hero.lead} className="type-body text-mute measure mt-6" />
        </div>

        {/* No label over the columns: the paragraph above already says there
            are three parts, and a heading announcing three things directly
            above three things is a caption on a photograph of itself. The
            problems need one less still — a row reading "Težava" three times
            would be labelling a block that is already three sentences about
            what is wrong.

            `my-auto` rather than a margin: in a flex column an auto block
            margin takes whatever height is left over and splits it, so the
            columns sit in the middle of the gap under the lead on a tall
            screen and collapse back against the padding on a short one. The
            `pt` is the floor — the least space this block is ever allowed,
            which is what stops it riding up into the lead when there is
            nothing spare to share out. */}
        <div className="my-auto pt-12 sm:pt-14">
          <PartIndexColumns />
        </div>
      </div>
    </header>
  )
}
