import { cn } from '@/lib/utils'

/**
 * The page's controls.
 *
 * ## Why the primary action is ink and not red
 *
 * Red on this page is a statement about the offer — *this part is in* — and the
 * moment it also means "press here", it means nothing. So every action that
 * merely navigates or opens a mail client is ink, and the one control allowed to
 * turn red is the part toggle, in its selected state, where the colour is
 * reporting the same thing it reports everywhere else.
 *
 * That is also why `signal` has no hover lift and no shadow: it is not trying to
 * look pressable, it is showing a state that happens to be clickable.
 *
 * ## Why a function and not a component
 *
 * Half the things needing these styles are anchors — a mail link, a jump to the
 * summary — and wrapping an anchor in a button component to borrow its padding
 * is how a page ends up with a div a keyboard cannot reach.
 */
export type ButtonVariant =
  /** Solid ink. The page's default action. */
  | 'primary'
  /** Hairline outline on paper. Secondary, paired with `primary`. */
  | 'outline'
  /** Mist fill, no border. Tertiary — the way out of a state, never a way in. */
  | 'soft'
  /** Solid red. Reserved for a part that is currently in the offer. */
  | 'signal'

export function buttonClasses(variant: ButtonVariant = 'primary', className?: string) {
  return cn(
    'label-btn inline-flex h-11 items-center justify-center gap-2 rounded-md px-5',
    'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
    variant === 'primary' && 'bg-ink text-on-ink hover:bg-body',
    variant === 'outline' && 'border-hairline-strong text-ink hover:bg-mist border bg-transparent',
    variant === 'soft' && 'bg-mist text-ink hover:bg-mist-deep',
    variant === 'signal' && 'bg-signal text-on-signal hover:bg-signal-deep',
    className,
  )
}

/** The small control — sticky-bar links, in-card actions. 36px. */
export function pillClasses(className?: string) {
  return cn(
    'label-btn inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3.5',
    'text-ink hover:bg-mist transition-colors duration-150',
    className,
  )
}
