'use client'

import { MailIcon, PhoneIcon } from 'lucide-react'

import { close } from '@/content/copy'
import { agency, terms } from '@/content/offer'
import { useOfferSelection } from '@/components/offer-selection'
import { buttonClasses } from '@/components/ui/button'
import { Section, SectionHeader } from '@/components/ui/section'
import { eur } from '@/lib/format'

/**
 * The close, with the reader's own selection already written into the e-mail.
 *
 * ## Why the message is composed for them
 *
 * The gap between "this looks reasonable" and a reply is a blank compose window
 * and the small effort of restating what they just read. Prefilling it removes
 * the restating — and, more usefully, removes the ambiguity: the message that
 * arrives names the exact combination they were looking at and carries the link
 * that reproduces it, so the conversation starts from the same page on both
 * ends rather than from "I think they wanted the website one".
 *
 * It stays a `mailto:` rather than a form on purpose. Nothing is captured
 * without the reader pressing send in their own mail client, where they can see
 * and edit every word first — which is the right power balance for a document
 * that is asking them to trust us with their bookings.
 */
export function Close() {
  const { quote, shareUrl } = useOfferSelection()

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
        The prices as the reader was looking at them, packages already applied —
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

    /* Named packages rather than a bare discount figure: the reply should say
       which terms were being looked at, not just what they came to. */
    for (const rule of quote.appliedRules) {
      lines.push(`Upoštevano: ${rule.label}`)
    }
  }

  if (shareUrl) {
    lines.push('')
    lines.push(`Moja izbira: ${shareUrl}`)
  }

  lines.push('', 'Lep pozdrav,')

  const mailto = `mailto:${agency.email}?subject=${encodeURIComponent(
    close.mailSubject,
  )}&body=${encodeURIComponent(lines.join('\n'))}`

  return (
    <Section>
      <div className="border-hairline-strong rounded-lg border p-6 sm:p-10">
        <SectionHeader eyebrow={close.eyebrow} heading={close.heading} lead={close.lead} />

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={mailto} className={buttonClasses('primary')}>
            <MailIcon className="size-4" strokeWidth={1.5} aria-hidden />
            {close.emailCta}
          </a>

          <a href={`tel:${agency.phone.replace(/\s/g, '')}`} className={buttonClasses('outline')}>
            <PhoneIcon className="size-4" strokeWidth={1.5} aria-hidden />
            {close.callCta} {agency.phone}
          </a>
        </div>

        {/*
          How long the offer stands, printed where it is being acted on rather
          than in the hero. At the top it was a deadline attached to something
          the reader had not read yet; here it is the last fact before they
          decide, which is the only place it changes anybody's behaviour.
        */}
        <p className="type-caption text-faint border-hairline mt-8 border-t pt-5">
          {terms.validityNote}
        </p>
      </div>
    </Section>
  )
}
