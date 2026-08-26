/**
 * The names of the places on this page a link can point at.
 *
 * ## Why they are not in `offer-selection.tsx`
 *
 * `SUMMARY_ANCHOR` used to live beside the selection context, which was
 * convenient rather than true: an anchor is a fact about the page's structure,
 * not about what the reader has switched on. The distinction became load-bearing
 * the moment the hero needed one. `offer-selection.tsx` is a `'use client'`
 * module, and a Server Component importing a constant out of one receives a
 * client reference rather than the string — so `<header id={HERO_ANCHOR}>` in
 * the hero would have rendered an object. A plain module can be read from both
 * sides, which is what a shared name has to be.
 *
 * The three offer parts are absent on purpose. Their anchors are their
 * `OfferPartId`s, passed straight through `OfferPartSection` to `Section`, and
 * writing them out again here would be a second list to keep in step with
 * `offer.ts`.
 */

/**
 * The top of the document.
 *
 * The hero is a `<header>` rather than a `<Section>`, so unlike the three parts
 * it has no id of its own. It gets one because it is the rail's upper bookend.
 */
export const HERO_ANCHOR = 'vrh'

/** Stable scroll target for the "see the whole offer" links. */
export const SUMMARY_ANCHOR = 'ponudba'
