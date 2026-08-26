import { close } from '@/content/copy'
import { terms } from '@/content/offer'
import { ContactActions } from '@/components/contact-actions'
import { Section, SectionHeader } from '@/components/ui/section'

/**
 * The close: the last thing said, and the two ways to answer it.
 *
 * The buttons and the message behind them are `ContactActions`, shared with the
 * totals panel — see that file for why the e-mail arrives already written. This
 * section is a server component as a result: the heading, the lead and the
 * validity note are static markup, and only the pair of controls needs to know
 * what the reader selected.
 */
export function Close() {
  return (
    <Section>
      <div className="border-hairline-strong rounded-lg border p-6 sm:p-10">
        <SectionHeader heading={close.heading} lead={close.lead} />

        <ContactActions className="mt-8" />

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
