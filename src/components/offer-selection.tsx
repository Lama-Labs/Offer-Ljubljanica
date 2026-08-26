'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import type { OfferPartId } from '@/content/offer'
import {
  defaultSelection,
  normalizeSelection,
  quote as buildQuote,
  type Quote,
  type Selection,
} from '@/lib/pricing'

/**
 * Which parts of the offer the reader has taken, and what that costs.
 *
 * ## Why the selection is not in the address bar
 *
 * It used to be. `?paket=` carried it, the panel offered a button to copy the
 * link, and the argument was that a proposal gets forwarded and should arrive
 * configured. What it produced was a document whose address changed while it was
 * being read: the reader who unticked a part and then passed "the offer" on
 * passed a different offer from the one they were sent, and neither end could
 * tell which version the other was looking at. Ticking a box is a reader's
 * working arithmetic, not a fact about what we have offered, and the query
 * string promoted it to one.
 *
 * So it lives here, in React state, for the length of one visit. The way to send
 * the offer on with a selection attached is now the one place where saying so is
 * unambiguous — an e-mail that lists the chosen parts and their prices in words.
 * See `ContactActions`.
 *
 * ## Why a context and not a prop
 *
 * The same selection is read by the rail at the top of the page, by every part's
 * own switch, and by the summary at the bottom, which are three places with no
 * common parent short of the page itself. Threading it through would hand the
 * quote to every section in between that has no interest in it.
 */
type OfferSelectionValue = {
  selection: Selection
  quote: Quote
  isSelected: (id: OfferPartId) => boolean
  toggle: (id: OfferPartId) => void
  /** Back to what we recommend — the way out of an empty offer. */
  reset: () => void
}

const OfferSelectionContext = createContext<OfferSelectionValue | null>(null)

export function OfferSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>(defaultSelection)

  /*
    Normalised on the way in rather than on the way out, so that everything
    downstream — the summary rows, the e-mail, the totals — reads one selection
    in page order. Two readers who picked the same parts in a different order are
    then looking at the same document.
  */
  const toggle = useCallback((id: OfferPartId) => {
    setSelection((current) =>
      normalizeSelection(
        current.includes(id) ? current.filter((each) => each !== id) : [...current, id],
      ),
    )
  }, [])

  const reset = useCallback(() => setSelection(defaultSelection), [])

  const value = useMemo<OfferSelectionValue>(() => {
    const selected = new Set(selection)

    return {
      selection,
      quote: buildQuote(selection),
      isSelected: (id) => selected.has(id),
      toggle,
      reset,
    }
  }, [selection, toggle, reset])

  return <OfferSelectionContext value={value}>{children}</OfferSelectionContext>
}

export function useOfferSelection(): OfferSelectionValue {
  const value = useContext(OfferSelectionContext)

  if (!value) {
    throw new Error('useOfferSelection must be used within an OfferSelectionProvider')
  }

  return value
}
