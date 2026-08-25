import { NextResponse, type NextRequest } from 'next/server'

import { GATE_COOKIE, GATE_COOKIE_OPTIONS, gateToken, verify } from '@/lib/gate'

/**
 * Where the unlock form posts.
 *
 * ## Why a route handler and a plain form, not a server action
 *
 * The unlock screen is reached by a rewrite, so the browser believes it is on
 * `/` — a server action would post back to `/` and straight into the proxy that
 * put the gate there. A form with its own `action` has no such ambiguity, and
 * it submits with no JavaScript at all, which is the property worth having on
 * the one screen where a failed bundle means the reader cannot get in.
 *
 * ## Why the query survives
 *
 * A forwarded link carries the sender's selection in `?paket=`, and that is the
 * whole point of forwarding it — "here is the version I configured". Dropping
 * it on the way through the gate would mean the second reader unlocks the
 * document and lands on a different offer from the one they were shown.
 *
 * `next` is a query string and never a URL: the destination path is written
 * here, so nothing a visitor can put in that field redirects them off the site.
 *
 * ## Why 303
 *
 * A redirect after POST has to say "now go and GET this", or the browser
 * re-submits the password on every refresh and back button.
 */
export async function POST(request: NextRequest) {
  const password = process.env.OFFER_PASSWORD

  const destination = request.nextUrl.clone()
  destination.pathname = '/'
  destination.search = ''

  if (!password) return NextResponse.redirect(destination, 303)

  const form = await request.formData()
  const submitted = form.get('password')
  const carried = carry(form.get('next'))

  if (typeof submitted !== 'string' || !(await verify(submitted, password))) {
    /*
      A shared password on a public address is guessable by a script that does
      not get tired, and there is no session here to lock out. Half a second per
      attempt is invisible to somebody typing and turns an overnight dictionary
      run into a multi-year one, which is all this document needs.
    */
    await new Promise((resolve) => setTimeout(resolve, 500))

    destination.search = carried.toString()
    destination.searchParams.set('e', '1')
    return NextResponse.redirect(destination, 303)
  }

  destination.search = carried.toString()

  const response = NextResponse.redirect(destination, 303)
  response.cookies.set(GATE_COOKIE, await gateToken(password), GATE_COOKIE_OPTIONS)
  return response
}

/**
 * The query the reader arrived with, minus the gate's own bookkeeping. Re-parsed
 * rather than passed through, so whatever the field contains leaves here as a
 * well-formed query string or as nothing.
 */
function carry(value: FormDataEntryValue | null): URLSearchParams {
  // Longer than any selection this page can produce, and short enough that the
  // field is not a place to post a payload.
  if (typeof value !== 'string' || value.length > 512) return new URLSearchParams()

  const carried = new URLSearchParams(value)
  for (const key of ['e', 'k', 'next', 'password']) carried.delete(key)

  // A field that was not a query string at all parses into one valueless key,
  // which would otherwise be pasted onto the address the reader ends up at.
  for (const [key, entry] of [...carried]) if (entry === '') carried.delete(key)

  return carried
}
