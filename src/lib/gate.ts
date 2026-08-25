/**
 * The lock on the front door.
 *
 * One shared password, held in `OFFER_PASSWORD` and never shipped to the
 * browser. This module is the only place that knows how a password becomes a
 * cookie, so the proxy and the form handler cannot drift apart on it.
 *
 * ## Why the cookie is a hash and not the password
 *
 * The cookie is `httpOnly`, but it is still a value sitting in somebody's
 * browser profile, in their sync, and in whatever backup that machine makes.
 * Storing the digest instead means the worst a leaked cookie gives up is access
 * to this one document — not the password itself, which is the sort of string
 * that gets reused. It also means changing `OFFER_PASSWORD` invalidates every
 * cookie already issued, which is what "revoke the link" has to mean.
 *
 * ## Why everything is compared as a digest
 *
 * `verify` hashes the candidate before comparing, so the two sides are always
 * 64 hex characters and the comparison can run in constant time without a
 * special case for length. A raw `===` on a secret leaks its prefix through
 * timing; the attack is impractical over the public internet, but the fix is
 * six lines and this is the only thing standing between a stranger and the
 * client's prices.
 */

/** The cookie the gate issues. Named for what it is, not for the framework. */
export const GATE_COOKIE = 'offer_key'

/**
 * A month. Long enough that the recipient and whoever they forward the link to
 * type the password once, short enough that the document does not stay open on
 * a borrowed laptop for the rest of the year.
 */
const MAX_AGE = 60 * 60 * 24 * 30

/**
 * Domain-separates the digest, so the value in the cookie is recognisably this
 * page's and not a bare SHA-256 that could be checked against a rainbow table
 * of common passwords.
 */
const SALT = 'offer-ljubljanica/gate/v1'

export const GATE_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  // `secure` on localhost would mean the cookie is set and never sent back, so
  // the gate would appear to reject a correct password all through development.
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE,
} as const

/** What a correct password is worth: the value the cookie has to carry. */
export async function gateToken(secret: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${SALT}:${secret}`),
  )

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/** Whether something a visitor supplied is the password. */
export async function verify(candidate: string, secret: string): Promise<boolean> {
  return equal(await gateToken(candidate), await gateToken(secret))
}

/** Whether a cookie a visitor is holding is one this password would have issued. */
export function holds(cookie: string | undefined, token: string): boolean {
  return cookie !== undefined && equal(cookie, token)
}

function equal(a: string, b: string): boolean {
  // Both sides are digests here, so a length mismatch only ever means the
  // cookie was hand-written. Nothing secret is revealed by leaving early.
  if (a.length !== b.length) return false

  let difference = 0
  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index)
  }

  return difference === 0
}
