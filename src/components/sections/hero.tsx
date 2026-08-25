import { hero } from '@/content/copy'
import { agency, client, terms } from '@/content/offer'
import { PartIndexCards } from '@/components/part-index'
import { Logo } from '@/components/ui/logo'
import { Copy } from '@/components/ui/copy'

/**
 * The hero, which is the whole offer.
 *
 * ## Why the three cards are up here
 *
 * The reader's first question is not "what is your thesis". It is *what are you
 * proposing*, and a page that withholds that until the eleventh section is
 * asking them to read on trust they have not been given any reason to extend. So
 * the three parts, their one-line summaries and the bracket tying two of them
 * together are all above the fold — and, since the cards carry the selection
 * circles, the offer is configured from the same screenful.
 *
 * It also means the page can be understood by somebody who reads nothing else —
 * which, for a document that gets forwarded to a partner and an accountant, is
 * most of the people who will open it.
 *
 * ## Why there are no buttons
 *
 * There were two: one down to the summary, one down to the diagnosis. Both were
 * asking the reader to go somewhere else at the exact moment the thing worth
 * looking at had appeared underneath them. The cards do the job better — each is
 * a link into its own section and a control that puts it in the offer. A hero
 * whose primary action is *scroll* does not need a button that says so.
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
    <header className="bg-paper">
      <div className="mx-auto w-full max-w-[1120px] px-5 pt-8 pb-16 sm:px-8 sm:pt-10 sm:pb-24">
        <div className="border-hairline label-mono text-faint flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b pb-4">
          <p className="text-ink">
            {hero.eyebrow} — {client.businessName}
          </p>
          {/* The mark trails the sender's name rather than leading the row:
              at the head of the line it would sit beside the client's name on
              the left half of the rule and read as theirs. */}
          <p className="flex items-center gap-2.5">
            različica {terms.version} · pripravil {agency.name}
            <Logo />
          </p>
        </div>

        <div className="mt-12 sm:mt-16">
          <h1 className="type-display text-ink max-w-3xl text-balance">{hero.heading}</h1>

          <Copy text={hero.lead} className="type-body text-mute measure mt-6" />
        </div>

        {/* No label over the cards: the paragraph above already says there are
            three parts, and a heading announcing three things directly above
            three things is a caption on a photograph of itself. */}
        <div className="mt-12 sm:mt-14">
          <PartIndexCards />
        </div>
      </div>
    </header>
  )
}
