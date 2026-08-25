import { Fragment, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Renders the one piece of markup the copy file is allowed to contain.
 *
 * `**so**` becomes `{typography.body-md-bold}` and everything else is text. The
 * split keeps the delimiters in the result so the pieces can be told apart
 * without a second pass, and an unmatched `**` simply stays on the page as
 * characters — the right failure for a typo in a sentence: visible to whoever
 * is proofing, harmless to whoever is reading.
 *
 * Emphasis carries weight only, never colour. The same sentence is rendered on
 * white bands and on black ones, and a bold run that pinned itself to `ink`
 * would go invisible on half of them. `font-semibold` is weight 600 — the
 * emphatic body weight the system allows; 500 is ruled out for body text.
 */
export function emphasize(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, index) => {
    if (chunk.startsWith('**') && chunk.endsWith('**') && chunk.length > 4) {
      return (
        <strong key={index} className="font-semibold">
          {chunk.slice(2, -2)}
        </strong>
      )
    }

    return <Fragment key={index}>{chunk}</Fragment>
  })
}

/**
 * `className` carries the size token *and* the colour, and neither has a
 * default on purpose.
 *
 * A default size would have to be merged away by every caller that wants a
 * different one, and `tailwind-merge` cannot help: `type-body` and
 * `type-body-sm` are project utilities it has never heard of, so both would
 * survive and the winner would be decided by stylesheet order. Requiring the
 * caller to say which one it wants is one word of duty and no ambiguity.
 */
export function Copy({ text, className }: { text: string; className?: string }) {
  return <p className={cn(className)}>{emphasize(text)}</p>
}
