'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

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
 * ## The URL is the state, not a copy of it
 *
 * The person reading this is not the only person who decides. The page gets
 * forwarded — to a partner, to an accountant, to whoever actually signs — and a
 * proposal that forgets what was chosen the moment it is shared has quietly
 * lost the argument it just made. So the selection lives in the query string.
 *
 * It lives there *only*. The obvious build — React state, an effect to read the
 * URL on mount, another effect to write it back — keeps the same fact in two
 * places and then spends both effects apologising for it: a render with the
 * wrong selection before the first effect corrects it, and a write on every
 * change that has to be careful not to fire before the read. Treating the URL
 * as what it is — an external store this component subscribes to — removes both
 * effects and the class of bug they exist to manage. There is one selection, in
 * one place, and the back button and a pasted link are the same code path.
 *
 * ## Why the first paint still shows the recommendation
 *
 * The page is a static export: its markup is built long before any URL exists.
 * `getServerSnapshot` therefore reports "no parameter", which resolves to the
 * recommended selection — the right thing to show anybody arriving cold — and
 * React swaps in the real URL's answer immediately after hydration. That is the
 * documented purpose of the third argument, and it is why this is not a
 * hydration mismatch waiting to happen.
 */
const PARAM = 'paket'
const SEPARATOR = ','

/*
  `replaceState` does not fire `popstate`, so the writes below have to announce
  themselves. Module scope rather than a ref: every consumer on the page is
  looking at one URL, and a per-provider list would only matter if there were
  two providers, in which case they would disagree about the same address bar.
*/
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  // The back button, for a reader who arrived here from their own history.
  window.addEventListener('popstate', onChange)

  return () => {
    listeners.delete(onChange)
    window.removeEventListener('popstate', onChange)
  }
}

/**
 * The raw parameter, or `null` when it is absent.
 *
 * Absent and empty are different answers and the difference is load-bearing: no
 * parameter means the reader arrived cold and should see what we recommend; an
 * empty one means somebody deliberately cleared the offer and shared that, and
 * re-selecting parts for them would misrepresent what they sent.
 *
 * Returns a string so that `Object.is` can compare snapshots. Returning the
 * parsed array here would hand React a new object every call and re-render the
 * page forever.
 */
function getParamSnapshot(): string | null {
  return new URLSearchParams(window.location.search).get(PARAM)
}

function getHrefSnapshot(): string {
  return window.location.href
}

/** No address bar exists at build time. */
function getEmptyParamSnapshot(): string | null {
  return null
}

function getEmptyHrefSnapshot(): string {
  return ''
}

type OfferSelectionValue = {
  selection: Selection
  quote: Quote
  isSelected: (id: OfferPartId) => boolean
  toggle: (id: OfferPartId) => void
  /** Back to what we recommend — the way out of an empty offer. */
  reset: () => void
  /** The current page URL with the selection in it. `null` until mounted. */
  shareUrl: string | null
}

const OfferSelectionContext = createContext<OfferSelectionValue | null>(null)

export function OfferSelectionProvider({ children }: { children: ReactNode }) {
  const param = useSyncExternalStore(subscribe, getParamSnapshot, getEmptyParamSnapshot)
  const href = useSyncExternalStore(subscribe, getHrefSnapshot, getEmptyHrefSnapshot)

  const selection = useMemo<Selection>(
    () =>
      param === null
        ? defaultSelection
        : normalizeSelection(param.split(SEPARATOR).filter(Boolean)),
    [param],
  )

  const write = useCallback((next: Selection) => {
    const url = new URL(window.location.href)
    url.searchParams.set(PARAM, next.join(SEPARATOR))

    // `replaceState`, not `pushState`: ticking three checkboxes should not cost
    // the reader three presses of the back button to leave the page.
    window.history.replaceState(null, '', url)
    emit()
  }, [])

  const value = useMemo<OfferSelectionValue>(() => {
    const selected = new Set(selection)

    return {
      selection,
      quote: buildQuote(selection),
      /*
        Built from the live href rather than from `document.location` at click
        time, so the link offered for copying is the one the reader can see.
      */
      shareUrl: href
        ? (() => {
            const url = new URL(href)
            url.searchParams.set(PARAM, selection.join(SEPARATOR))
            return url.toString()
          })()
        : null,
      isSelected: (id) => selected.has(id),
      toggle: (id) =>
        write(
          normalizeSelection(
            selected.has(id)
              ? selection.filter((each) => each !== id)
              : [...selection, id],
          ),
        ),
      reset: () => write(defaultSelection),
    }
  }, [selection, href, write])

  return <OfferSelectionContext value={value}>{children}</OfferSelectionContext>
}

export function useOfferSelection(): OfferSelectionValue {
  const value = useContext(OfferSelectionContext)

  if (!value) {
    throw new Error('useOfferSelection must be used within an OfferSelectionProvider')
  }

  return value
}

/** Stable scroll target for the "see the whole offer" links. */
export const SUMMARY_ANCHOR = 'ponudba'
