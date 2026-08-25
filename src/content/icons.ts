/**
 * The icon vocabulary the copy file is allowed to draw from.
 *
 * The keys live here rather than in the component so that `copy.ts` stays free
 * of imports from `components/` — the prose file is edited by whoever is making
 * the offer, and it should not be possible to break the build by renaming a
 * sentence. A key that has no drawing is a type error at the point it is
 * written, which is the right place to find out.
 *
 * The set is deliberately small. Every feature line on this page gets an icon,
 * and an icon set large enough to be literal about each one would turn the
 * section into a sticker sheet — a dozen marks that all mean roughly "a thing".
 * These twenty are the categories the offer actually has.
 */
export type IconKey =
  | 'anchor'
  | 'banknote'
  | 'brush'
  | 'calendar'
  | 'camera'
  | 'clipboard'
  | 'code'
  | 'crew'
  | 'dashboard'
  | 'globe'
  | 'languages'
  | 'message'
  | 'moon'
  | 'pointer'
  | 'search'
  | 'speed'
  | 'sparkle'
  | 'tags'
  | 'target'
  | 'ticket'
