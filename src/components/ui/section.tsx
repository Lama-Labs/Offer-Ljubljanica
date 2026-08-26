import type { ReactNode } from 'react'

import { Copy } from '@/components/ui/copy'
import { cn } from '@/lib/utils'

/**
 * One band of the page.
 *
 * ## Why there is no dark tone any more
 *
 * The reference system alternates true black and white in full-bleed bands, and
 * on a marketing site that rhythm is the brand. Here it was doing something
 * else: eleven sections slamming between black and white turned a quote into a
 * slideshow, and made every section feel like a fresh pitch rather than the next
 * paragraph of one argument. A proposal is a document. It reads top to bottom on
 * one sheet of paper.
 *
 * What replaces it is much quieter: `paper` by default, `mist` for the sections
 * that would otherwise run into their neighbours. The contrast between them is
 * about 3% — enough to separate, not enough to interrupt.
 */
export type BandTone = 'paper' | 'mist'

export function Section({
  id,
  children,
  className,
  tone = 'paper',
  size = 'default',
}: {
  id?: string
  children: ReactNode
  className?: string
  tone?: BandTone
  /** `tight` for the short connective sections that only carry a heading. */
  size?: 'default' | 'tight'
}) {
  return (
    <section
      id={id}
      className={cn(tone === 'mist' ? 'bg-mist' : 'bg-paper', 'text-body', className)}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-[1120px] px-5 sm:px-8',
          size === 'tight' ? 'py-10 sm:py-14' : 'py-14 sm:py-20',
        )}
      >
        {children}
      </div>
    </section>
  )
}

/**
 * A section's opening: the heading, and at most one sentence.
 *
 * ## Why there is no eyebrow any more
 *
 * Every section opened with one — *Preden vprašate*, *Vaša izbira*, *Kdo bo
 * delal na tem* — set as tracked mono capitals over the heading. Read one at a
 * time they are fine. Read as a page they are a second table of contents,
 * announcing each section a beat before the section announces itself, and in
 * every case the heading underneath said the same thing better: *Vaša izbira*
 * over a heading that is already the chooser, *Kdo bo delal na tem* over four
 * photographs of the people who will.
 *
 * The mono voice is the page's index voice, and it still carries the things
 * that are genuinely index: the masthead rule at the top of the hero, the part
 * rail, the numerals on the three parts. Spent on a label above every heading it
 * stopped indexing anything, because a mark that appears everywhere marks
 * nothing.
 */
export function SectionHeader({
  heading,
  lead,
  className,
  size = 'title',
}: {
  heading: string
  lead?: string
  className?: string
  size?: 'title' | 'display'
}) {
  return (
    <header className={cn('max-w-2xl', className)}>
      <h2 className={cn(size === 'display' ? 'type-display' : 'type-title', 'text-ink')}>
        {heading}
      </h2>

      {lead ? <Copy text={lead} className="type-body text-mute measure mt-4" /> : null}
    </header>
  )
}
