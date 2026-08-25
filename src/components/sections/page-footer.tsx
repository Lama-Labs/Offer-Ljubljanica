import { footer } from '@/content/copy'
import { agency, client } from '@/content/offer'
import { Logo } from '@/components/ui/logo'

/**
 * The colophon. Mono, hairline, the same voice as the masthead at the top of
 * the page — a document closes the way it opens.
 */
export function PageFooter() {
  return (
    <footer className="bg-paper">
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-14 sm:px-8">
        {/* One line. The validity note used to sit on the right of this rule and
            now lives in the close, a screenful above — printing it twice inside
            one screen made it read as a warning rather than a term. */}
        <div className="border-hairline label-mono text-faint border-t pt-5">
          {/* Leading here, trailing in the masthead: the mark sits at the two
              far corners of the document, and both times it is the sender's
              name it is standing next to. */}
          <p className="flex items-center gap-2.5">
            <Logo />
            {footer.preparedBy} {agency.name} — {client.businessName}
          </p>
        </div>
      </div>
    </footer>
  )
}
