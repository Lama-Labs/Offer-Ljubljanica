import { NextResponse, type NextRequest } from 'next/server'

import { GATE_COOKIE, GATE_COOKIE_OPTIONS, gateToken, holds, verify } from '@/lib/gate'

/**
 * Everything the offer says, behind one password.
 *
 * ## Why a rewrite and not a redirect
 *
 * A visitor without the cookie is shown the unlock screen *at the address they
 * asked for*. The URL in their bar stays the one they were sent, so signing in
 * lands them on the section the link pointed at — and, more to the point, a
 * forwarded link that bounces to `/unlock` looks like a link that has expired.
 *
 * ## Why `?k=` exists
 *
 * "Here is the link, and here is the password, in a second message" is two
 * things for the recipient to keep together, and the one that gets lost is
 * always the password. `?k=` lets the offer go out as a single clickable
 * address: the middleware trades the key for the cookie and strips it from the
 * URL immediately, so the address that ends up in their history, their reply
 * and their screenshot no longer carries it.
 *
 * That does mean the password rides in a URL, which is a weaker place for a
 * secret than a form field — it can sit in a server log. It is the right trade
 * for a document whose whole job is to be opened by somebody who is not going
 * to fight it, and it is exactly why `OFFER_PASSWORD` must not be a password
 * used for anything else.
 *
 * ## What is deliberately not behind the gate
 *
 * The files under `/images`. `next/image` fetches them back through the server
 * when it renders, so gating them is how every exhibit on the page turns into a
 * broken frame — and a screenshot of a booking calendar is not what this
 * document is protecting. The prices, the scope and the guarantee are, and they
 * are all in the HTML.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|unlock|api/unlock|favicon\.ico|images/|.*\.(?:png|jpg|jpeg|svg|webp|ico|woff2?)$).*)',
  ],
}

export default async function proxy(request: NextRequest) {
  const password = process.env.OFFER_PASSWORD

  // No password configured is an open document, not a locked one. That is the
  // right default for `next dev` and for a preview build, and it is why the
  // README says to set the variable rather than to remember to.
  if (!password) return NextResponse.next()

  const token = await gateToken(password)

  const key = request.nextUrl.searchParams.get('k')
  if (key !== null && (await verify(key, password))) {
    const clean = request.nextUrl.clone()
    clean.searchParams.delete('k')

    const response = NextResponse.redirect(clean)
    response.cookies.set(GATE_COOKIE, token, GATE_COOKIE_OPTIONS)
    return response
  }

  if (holds(request.cookies.get(GATE_COOKIE)?.value, token)) {
    return NextResponse.next()
  }

  // `clone` rather than `new URL('/unlock', …)`, which would drop the query —
  // and the query is how the form handler reports a wrong password back.
  const gate = request.nextUrl.clone()
  gate.pathname = '/unlock'
  return NextResponse.rewrite(gate)
}
