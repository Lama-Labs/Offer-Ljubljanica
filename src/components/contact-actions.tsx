'use client'

import { MailIcon, PhoneIcon } from 'lucide-react'

import { close } from '@/content/copy'
import { agency } from '@/content/offer'
import { useOfferSelection } from '@/components/offer-selection'
import { buttonClasses } from '@/components/ui/button'
import { eur } from '@/lib/format'
import { type Quote } from '@/lib/pricing'
import { cn } from '@/lib/utils'

/**
 * The e-mail behind the second button: the reader's own selection, already
 * written into a message they have only to send.
 *
 * ## Why the message is composed for them
 *
 * The gap between "this looks reasonable" and a reply is a blank compose window
 * and the small effort of restating what they just read. Prefilling it removes
 * the restating — and, more usefully, removes the ambiguity: the message that
 * arrives names the exact combination they were looking at, so the conversation
 * starts from the same page on both ends rather than from "I think they wanted
 * the website one".
 *
 * It carries the parts in words rather than a link that reproduces them. The
 * link used to do the work, back when the selection lived in the query string,
 * and it was the weaker half of the message even then: a URL says what was
 * chosen only to whoever opens it, and it says nothing at all once it has been
 * pasted into a reply chain and stripped. A list of parts with their prices is
 * legible in the inbox, quotable in the answer, and still true next week.
 *
 * It stays a `mailto:` rather than a form on purpose. Nothing is captured
 * without the reader pressing send in their own mail client, where they can see
 * and edit every word first — which is the right power balance for a document
 * that is asking them to trust us with their bookings.
 */
function composeBody(quote: Quote): string {
  const lines = [
    'Pozdravljeni,',
    '',
    quote.isEmpty
      ? 'ponudbo sem pregledal in bi se rad pogovoril o njej.'
      : 'ponudbo sem pregledal. Zanima me:',
  ]

  if (!quote.isEmpty) {
    lines.push('')

    for (const line of quote.lines.filter((each) => each.selected)) {
      const { part } = line
      /*
        The prices as the reader was looking at them, discounts already applied —
        `line`, not `part`. A reply quoting list prices the page never showed is
        a reply that has to be reconciled before it can be answered.

        Both fees are labelled for the same reason they are labelled in the
        summary: this message is read next to the offer by somebody deciding
        which of two monthly charges is which, and `40 € / mesec` twice over with
        nothing to separate them is the line that gets queried on the phone.
      */
      const monthly =
        part.monthly !== null
          ? `${eur(line.monthly)} / mesec${part.monthlyLabel ? ` — ${part.monthlyLabel}` : ''}`
          : null
      const oneOff = part.oneOff ? `${eur(line.oneOff)} ${part.oneOffLabel}` : null

      /* Headline fee first, the same way round as the row the reader was
         looking at when they pressed the button. */
      const price = (part.leadWith === 'monthly' ? [monthly, oneOff] : [oneOff, monthly])
        .filter(Boolean)
        .join(' + ')

      lines.push(
        `${String(part.number).padStart(2, '0')} ${part.name}${price ? ` (${price})` : ''}`,
      )
    }

    lines.push('')
    lines.push(`Enkratno skupaj: ${eur(quote.oneOffTotal)}`)
    lines.push(`Mesečno skupaj: ${eur(quote.monthly)}`)
  }

  lines.push('', 'Lep pozdrav,')

  return lines.join('\n')
}

function mailtoFor(quote: Quote): string {
  return `mailto:${agency.email}?subject=${encodeURIComponent(
    close.mailSubject,
  )}&body=${encodeURIComponent(composeBody(quote))}`
}

/**
 * ## Why the phone leads, and why it is the red one
 *
 * The two actions are not equally easy to take back. An e-mail is drafted, read
 * over and sent when the reader is ready; a call is answered by a person in the
 * next few seconds. Putting the call first, in the one colour this page saves
 * for what matters, says which of the two we would rather have — and leaves the
 * e-mail exactly where somebody who wants the slower door will look for it.
 *
 * So the e-mail is a hairline on paper and not a second filled block. Two solid
 * buttons side by side are two things shouting the same volume, and the reader
 * has to read both before learning which one was the suggestion; drawn this way
 * the pair says which door is which before either label is read.
 *
 * ## Why the panel offers only the call
 *
 * `stack` is the totals panel, and the totals panel is not the end of the page.
 * A reader still adding and removing parts has not finished deciding, and giving
 * them two ways out at that moment asks a second question — *which of these* —
 * on top of the one they are already answering. So the panel makes the single
 * strongest offer and nothing else. The e-mail is a screen further down in the
 * close, where somebody who has finished reading will find both.
 *
 * The number takes its own line there for a plain reason: it does not fit beside
 * the label in a 380px column. Given the line, it stops being an appendage to a
 * verb and becomes the thing on the button — which is what a telephone number on
 * a proposal ought to be anyway.
 */
export function ContactActions({
  layout = 'row',
  className,
}: {
  layout?: 'row' | 'stack'
  className?: string
}) {
  const { quote } = useOfferSelection()

  const stacked = layout === 'stack'

  /* Two lines of label, so the button gives up its fixed 44px height and keeps
     it as a floor instead. */
  const shape = stacked ? 'h-auto min-h-11 w-full py-2.5 text-center' : undefined

  return (
    <div className={cn(stacked ? 'grid' : 'flex flex-wrap items-center gap-3', className)}>
      <a href={`tel:${agency.phone.replace(/\s/g, '')}`} className={buttonClasses('signal', shape)}>
        <PhoneIcon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
        {/* A number broken across two lines is a number that gets misdialled, so
            it never wraps of its own accord. Stacked it is given a line; inline
            it takes none. */}
        <span className={stacked ? 'grid' : undefined}>
          <span>{close.callCta}</span> <span className="whitespace-nowrap">{agency.phone}</span>
        </span>
      </a>

      {stacked ? null : (
        <a href={mailtoFor(quote)} className={buttonClasses('outline')}>
          <MailIcon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
          {close.emailCta}
        </a>
      )}
    </div>
  )
}
