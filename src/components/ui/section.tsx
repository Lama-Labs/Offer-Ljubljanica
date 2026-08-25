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
 * A section's opening: the label, the heading, and at most one sentence.
 *
 * The eyebrow is `label-mono` — tracked mono capitals, the page's index voice —
 * rather than the pill the reference system uses. A pill is a small container
 * and containers imply something can be done with them; every other pill-shaped
 * thing here is a control. This is a column heading, and it is set like one.
 */
export function SectionHeader({
  eyebrow,
  heading,
  lead,
  className,
  size = 'title',
}: {
  eyebrow?: string
  heading: string
  lead?: string
  className?: string
  size?: 'title' | 'display'
}) {
  return (
    <header className={cn('max-w-2xl', className)}>
      {eyebrow ? (
        <p className="label-mono text-faint mb-3 flex items-center gap-2.5">
          <span className="bg-hairline-strong inline-block h-px w-6" aria-hidden />
          {eyebrow}
        </p>
      ) : null}

      <h2 className={cn(size === 'display' ? 'type-display' : 'type-title', 'text-ink')}>
        {heading}
      </h2>

      {lead ? <Copy text={lead} className="type-body text-mute measure mt-4" /> : null}
    </header>
  )
}
