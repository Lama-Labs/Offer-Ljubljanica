# Ponudba — Ladjica Emona in Emonca

An interactive offer proposal for a boat tour operator on the Ljubljanica. One
page, in Slovenian, with three parts the reader can switch on and off:

1. **Alpaca Booking** — monthly subscription to the booking system
2. **ljubljanicatours.com** — a new tourist-facing landing page with the booking
   widget in its hero
3. **Prenova ljubljanica.eu** — optional redesign of the existing site

Three combinations are worth more than their parts: `01 + 02` takes €100 off the
new site, `02 + 03` puts both websites under one maintenance contract instead of
two, and all three takes a further €100 off the redesign. They stack. The
selection is carried in the URL, so a forwarded link reproduces exactly what the
reader configured, and the closing e-mail is prefilled with it.

## The prices

All of them live in one file, [`src/content/offer.ts`](src/content/offer.ts).

| | one-off | monthly |
|---|---|---|
| **01** Alpaca Booking | ~~300~~ **150** (`postavitev`) | 75 (`naročnina`) |
| **02** ljubljanicatours.com | 500 (`izdelava`) | 40 (`vzdrževanje`) |
| **03** Prenova ljubljanica.eu | 1.000 (`izdelava`) | 40 (`vzdrževanje`) |
| *Paket Zagon* — 01 + 02 | −100 | — |
| *Paket Splet* — 02 + 03 | — | −40 |
| *Paket Celota* — 01 + 02 + 03 | −100 | — |

The packages stack, so all three comes to **1.450 €** one-off (150 + 400 + 900)
and **115 €**/month. Work outside maintenance is `terms.hourlyRate`, currently
50 €/h.

The booking setup discount is unconditional — it is a decision about this client,
not a reward for buying more — which is why it lives on the part as `listOneOff`
rather than in `bundleRules`. It is shown struck through on that part's row.

## The password

The offer carries prices and is addressed to one business, so the whole page is
behind one shared password. It is enforced in [`src/proxy.ts`](src/proxy.ts),
which runs before anything is served — a reader without the cookie never
receives the HTML, so nothing on the page has to be careful about what it says.

Set `OFFER_PASSWORD` in Vercel under **Settings → Environment Variables**, for
Production and Preview both. See [`.env.example`](.env.example). Leave it unset
and the gate is off and the offer is public; that is the right default for
`next dev`, and the first thing to check before sending the link. To exercise
the gate locally, copy `.env.example` to `.env.local` and fill it in.

**Send one link, not a link and a password.** `?k=` trades the key for the
cookie and strips itself from the address:

```
https://ponudba.example.com/?k=<OFFER_PASSWORD>
```

The reader clicks once and is in, and the URL left in their history and their
reply no longer carries the key. Anyone who reaches the page without it gets
[`/unlock`](src/app/unlock/page.tsx) at the address they asked for, so a
forwarded link never looks expired. The `?paket=` selection survives the gate —
unlocking returns the reader to the offer they were actually sent, not to the
default one.

Because the password rides in a URL on that path, `OFFER_PASSWORD` must not be
a password used for anything else. To revoke a link that has travelled further
than intended, change it: every cookie already issued stops working.

This is also why [`next.config.ts`](next.config.ts) is no longer
`output: 'export'`. A static export has nothing running in front of the files,
so any lock on top of one is decoration over a bundle that already contains
every figure.

## Before sending this to anybody

```bash
grep -n PLACEHOLDER src/content/offer.ts
```

What is still marked, and what to check:

- `guarantee` — **read this one properly.** It is a commercial commitment that
  nothing in the software makes true; whoever signs the offer has to honour it
- `agency` — name, e-mail, phone. These appear in the masthead, the footer and
  the prefilled e-mail
- `terms.version` — printed in the masthead, currently `1.2`. Bump it whenever a
  price or a scope line changes, so a forwarded link can be told apart from the
  one that replaced it
- `team` — four people: name, role, website, bio

### Team photographs

Each member has `avatar: null`, which renders a monogram of their initials. To
use a real photograph, drop the file in `public/team/` and point at it:

```ts
avatar: '/team/ana.jpg',
```

Square images, 192px or larger. They are cropped to a circle.

### The included / not-included lists

`warranty.included` and `warranty.excluded` in
[`src/content/copy.ts`](src/content/copy.ts). The exclusions are deliberately as
long as the inclusions and several come straight from the brief's "do not claim"
list — they are honest and they build trust. Check them against what you are
actually willing to commit to before sending, particularly the domain, hosting
and support lines.

All prose is in [`src/content/copy.ts`](src/content/copy.ts). `**like this**`
renders bold; nothing else is interpreted.

## Running it

```bash
pnpm install
pnpm dev        # http://localhost:3005
pnpm build
pnpm start      # http://localhost:3000, the built page with the gate in front
pnpm lint
pnpm typecheck
```

The page itself is still prerendered at build time — nothing on it is computed
per request. What needs a runtime is the gate in front of it: the proxy, the
unlock screen and the form handler. So the build is a Next application rather
than a folder of files, and it wants a host that can run one. Vercel, which is
where this is going, is exactly that.

`pnpm dev` runs without `OFFER_PASSWORD` and is therefore open, which is the
point — see [The password](#the-password) for how to exercise the gate locally.

## The design system

Tokens live in [`src/app/globals.css`](src/app/globals.css) and the file explains
itself. Three rules are worth knowing before editing anything:

**Red does two jobs, split by shape.** `--color-signal` (`#c8102e`) is the only
accent, and it carries *state* as a **fill** — a filled selection circle, a red
index numeral, an active package bracket, the totals panel — and *marks* as a **stroke**: every feature icon, drawn in `signal` on
`signal-wash` where it sits in a tile. Nothing filled is decorative and nothing
stroked reports a state, which is why the two never get read for each other. Red
still never highlights prose, a heading or a rule, and every action that merely
navigates is ink.

Two tints, and they are not interchangeable: `signal-tint` (`#fcf0f2`) for whole
surfaces — a selected card, a nudge — where black text has to stay readable over
a large area; `signal-wash` (`#f9e5e9`) for 36px icon tiles, which need to read
as deliberate on both `paper` and `mist` and carry the mark at 5.6:1.

**Three packages, drawn rather than written.** `bundleRules` in
[`offer.ts`](src/content/offer.ts) is the whole definition: `zagon` covers parts
01 and 02, `splet` covers 02 and 03, `celota` covers all three. The hero derives
a bracket for each, spanning the cards it requires, and each goes red only while
every part it needs is on. They are drawn narrowest first, one per row, so the
two pairs sit as a staircase over the card they share and the full-width one
closes underneath them:

```
[ 01 ]  [ 02 ]  [ 03 ]
└──────────┘             Paket Zagon
        └──────────┘     Paket Splet
└──────────────────┘     Paket Celota
```

The summary draws the same three from the same `packageBrackets` geometry, turned
a quarter turn: the rows there are a stack rather than a row, so the brackets are
vertical and sit in lanes to their left, narrowest nearest the rows, labels
reading bottom-to-top. The lanes are `auto` columns holding nothing else, so
below `sm` — where the brackets are hidden, as they are in the hero — they
collapse to zero and the rows take the full width.

No prices in either place: what a package is worth belongs with the totals, where
the figure can be compared against the alternative. Add a rule to that table and
both brackets draw themselves, as long as the parts it requires are adjacent in
page order; a rule that skips the middle card is left out of the graphic (it
still applies to the total).

**A rule can discount either fee.** `oneOffDiscount` comes off the up-front
total; `monthlyDiscount` comes off the bill permanently, which is how the shared
maintenance contract is expressed. The nudges under the summary are grouped by
the part that would unlock them, so one missing part standing between the reader
and two or three packages produces one prompt rather than several identical ones.

**Every part has two fees, and they are not equally important.** `leadWith` on
each part says which one is the headline on its summary row and which is the
footnote under it: the booking system leads with `75 € / mes.` and prints its
setup small, the two websites lead with what they cost to build and print
maintenance small. It is a per-part fact rather than a rule about which fee
exists, because the two kinds of part are genuinely bought differently — and
leading every row with the recurring figure would put `40 €` at the top of a
€1.000 redesign.

**The offer is configured in two places.** The three cards in the hero and the
three rows in the summary, both using the same circle: filled red means the part
is in. The part sections carry no control at all — they are the argument, plus
one sentence at the foot naming what leaving that part out costs. If you want an
inline "add" action back inside a section, it belongs in
[`part-index.tsx`](src/components/part-index.tsx) as part of `PartAbsenceNote`.

**Only the parts are numbered.** `01` `02` `03` identify the three parts of the
offer and appear on the hero cards, the section headers and the summary rows.
Nothing else on the page carries a numeral — not the three claims, not the four
steps of the guest's route — because an index that is also used for decoration
stops being an index.

**Numbers are set in mono.** Prices, the part index, `35 minutah`, `25 KB`. The
operator's own materials are timetables and passenger lists; the page borrows
that voice for its figures. Prose is IBM Plex Sans, headlines are Archivo.

There is no dark band and no light/dark alternation. Sections sit on `paper` and
step to `mist` where two would otherwise run together.

[`docs/DESIGN-revolut.md`](docs/DESIGN-revolut.md) is where this started and is
kept for reference only. The page no longer follows it.

## Editing the feature lists

Each part's features live in `parts` in
[`src/content/copy.ts`](src/content/copy.ts), grouped by where the operator's
work happens rather than by software module. Each item is an `icon`, a title of
four or five words, and **one sentence**. The limit is the design — a feature
that needs a paragraph is either a graphic (`moneyFlow`, `route`) or belongs in
`warranty`.

`icon` must be a key from [`src/content/icons.ts`](src/content/icons.ts); an
unknown one is a type error rather than a missing drawing at runtime.

## What the page must not claim

The source material is [`docs/client-offer-brief.md`](docs/client-offer-brief.md).
Its section 7 lists features that do **not** exist — refunds from the console,
guest self-service cancellation, reminder e-mails, discount codes, waiting lists,
exports, OTA sync, customer profiles, multiple currencies. The current copy stays
inside those limits. Anything added later has to as well.

There are also no live customers, case studies or uptime figures yet. Do not
invent them.
