import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { gate } from '@/content/copy'
import { agency } from '@/content/offer'
import { buttonClasses } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { Copy } from '@/components/ui/copy'
import { GATE_COOKIE, gateToken, holds } from '@/lib/gate'

/**
 * The unlock screen.
 *
 * Reached by a rewrite from wherever the reader actually asked for, so it has
 * to stand alone: no header, no navigation, nothing that implies there is a
 * page around it.
 *
 * ## The one design decision here
 *
 * The password is set in mono, tracked out, under a mono capital label — the
 * page's own treatment for a figure on a ticket. Everything else on this screen
 * is deliberately quiet and the input is the only object on it, so it is worth
 * the one gesture: what the reader is doing is presenting a code at a gangway,
 * and the field says so before the copy does.
 *
 * `signal` behaves exactly as it does on the offer itself. It is not spent on
 * the submit button, which merely navigates and is therefore ink; the only red
 * on the screen is the tinted panel a wrong password puts up, which is the
 * `signal-tint` nudge the system provisions for.
 */
export default async function UnlockPage({ searchParams }: PageProps<'/unlock'>) {
  const password = process.env.OFFER_PASSWORD

  // Someone who is already in and typed the address by hand. Nothing to ask.
  if (password && holds((await cookies()).get(GATE_COOKIE)?.value, await gateToken(password))) {
    redirect('/')
  }

  const params = await searchParams
  const failed = params.e === '1'
  // The selection the link was forwarded with, handed back to the form so that
  // unlocking returns the reader to the offer they were actually sent.
  const carried = carry(params)

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        {/* Named rather than decorative here: this is the only screen where
            `Alpaca Labs` appears nowhere in text, and a reader being asked for
            a password is owed the sender's identity. */}
        <Logo label={agency.name} className="mb-7" />

        <p className="label-mono text-faint">{gate.eyebrow}</p>
        <h1 className="type-title text-ink mt-3">{gate.heading}</h1>
        <Copy text={gate.lead} className="type-body-sm text-mute mt-3" />

        {failed && (
          <div id="password-error" className="bg-signal-tint mt-6 rounded-md px-4 py-3">
            <Copy text={gate.error} className="type-caption text-ink" />
          </div>
        )}

        <form action="/api/unlock" method="post" className={failed ? 'mt-4' : 'mt-8'}>
          <label htmlFor="password" className="label-mono text-mute block">
            {gate.label}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            aria-invalid={failed}
            aria-describedby={failed ? 'password-error' : undefined}
            // 16px is the floor: anything smaller and iOS zooms the page in on
            // focus and leaves the reader on a screen they have to pinch back.
            className="border-hairline-strong bg-paper text-ink focus:border-ink mt-2 h-11 w-full rounded-md border px-3.5 font-mono text-base tracking-[0.12em] transition-colors duration-150"
          />
          {carried && <input type="hidden" name="next" value={carried} />}
          <button type="submit" className={buttonClasses('primary', 'mt-3 w-full')}>
            {gate.submit}
          </button>
        </form>

        <p className="type-caption text-faint border-hairline mt-10 border-t pt-4">
          {gate.help}{' '}
          <a
            href={`mailto:${agency.email}`}
            className="text-mute hover:text-ink underline underline-offset-2 transition-colors duration-150"
          >
            {agency.email}
          </a>
        </p>
      </div>
    </main>
  )
}

/** Everything the reader arrived with except the gate's own bookkeeping. */
function carry(params: Record<string, string | string[] | undefined>): string {
  const carried = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (key === 'e' || key === 'k') continue
    for (const one of Array.isArray(value) ? value : value === undefined ? [] : [value]) {
      carried.append(key, one)
    }
  }

  return carried.toString()
}
