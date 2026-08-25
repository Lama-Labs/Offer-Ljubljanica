# Alpaca Booking — what it does for a boat tour operator

**Purpose of this document.** It is the source material for an offer proposal
landing page addressed to a boat tour operator running trips on the Ljubljanica.
Everything below is written from the operator's side of the desk: what they get,
what changes in their day, what it costs them to adopt. Every claim here is
backed by working software — the section *Do not claim any of this* at the end
lists what must stay out of the page.

The reader is not a software buyer. They are somebody who runs boats, sells
tickets at a jetty in Krakovo, answers the phone in the middle of a departure,
and writes bookings in a notebook or a spreadsheet. Write to them.

---

## 1. The one-sentence version

Alpaca Booking is the operations system for a tour operator: it holds the
schedule, takes the bookings — at the desk, on the phone and on the operator's
own website — collects the money, and puts the passenger list in the hands of
whoever is standing at the boat.

Alternative framings, all accurate, pick by the page's tone:

- *"Your season, your departures, your passenger list — in one place, on your own website."*
- *"Stop counting seats in a notebook."*
- *"The booking form on your website and the clipboard at the jetty are the same list."*

---

## 2. The problem, in their words

These are the failures the product removes. Each one maps to a feature below.

| What goes wrong today | What it costs |
| --- | --- |
| Two people sell the last two seats on the same boat within a minute of each other | An apology at the jetty, a refund, a bad review |
| The schedule lives in a spreadsheet, the bookings in a notebook, the payments in a cash box | Nobody knows the real number until the boat is loading |
| Somebody has to be reachable by phone to take a booking | Every booking that comes in at 23:00 is a booking lost |
| A tourist wants to pay by card, the operator takes cash only | Turned away, or paid late, or not at all |
| A departure with two passengers still sails | The trip runs at a loss, or gets cancelled too late to fill |
| The person at the boat has a printed list from this morning | Anyone who booked since is not on it |
| Guests arrive speaking German, Italian, English | The booking form and the confirmation are in a language they don't read |

---

## 3. What the operator actually gets

### 3.1 A schedule they set once for the whole season

The operator describes a **tour** once — its name, description, how long it
lasts, how many places a boat holds, how far ahead booking opens, how late it
closes before departure, and the last moment a guest may cancel.

Then they schedule **departures**. Not one at a time: they draw their week —
Tuesdays and Thursdays at 09:00, Saturdays at 10:00 and 14:00 — pick a date
range like *April to October*, and the system tells them exactly how many
departures that produces before it creates any of them. Up to 500 in one go.

Individual departures can then be adjusted: a different boat with a different
capacity, a private charter that shouldn't open for public booking until later,
a note for the crew ("meet at the Cobblers' Bridge steps, not the usual jetty").

*Benefit line for the page:* **Set your season in one sitting. Change any single
departure without touching the rest.**

### 3.2 Prices that match how tickets are actually sold

Each tour has its own **passenger types** — Adult, Child, Student, Family,
Infant — with their own prices and their own age ranges. And the part most
booking tools get wrong: each type says how much room it takes on the boat.
An infant on a lap can have a price of €0 and take up no seat at all. A group
ticket can be one line that takes four.

Prices are stored in the operator's own currency, and they're **snapshotted onto
every booking at the moment it's taken** — raising prices for next season never
rewrites what last month's guests agreed to pay.

*Benefit line:* **Price the way you sell: adults, children, infants on laps — and
the boat counts correctly either way.**

### 3.3 Bookings from everywhere, in one list

A booking can arrive from the website, over the phone, from a walk-up at the
jetty, from a partner hotel, or be typed in by staff — and the system records
which. Every booking gets a short reference (BK-10342) that a guest can read out
over the phone.

Staff can do everything the website can't:

- Take a booking on a departure the website has already closed or filled — the desk is allowed to overrule, the website is not.
- Add a guest with no email address at all.
- Change the passenger mix on an existing booking.
- Move a booking to a different departure of the same tour — the system locks both departures while it checks, so two moves can never both land on the last free seat.
- Cancel a booking, which puts the places straight back on sale.
- Attach notes: what the guest said, and a separate note only staff ever see.

The bookings list has one search box that matches name, email, phone and
reference at once, plus filters for status, payment, source, tour and date range.

*Benefit line:* **Phone, jetty, website, hotel partner — one list, one search box.**

### 3.4 Money, recorded honestly

Payment isn't a checkbox. Every payment is a line — amount, method (cash, card,
bank transfer, online), a till or reference number, a note, and who took it.
Part-payments are normal: a €60 deposit on a €200 charter shows as *partially
paid, €140 outstanding*.

The dashboard tells the desk what's still owed on **today's** departures, so the
person at the jetty knows who to collect from before anyone steps on the boat.

*Benefit line:* **Know exactly what's still owed on today's boats, before they leave.**

### 3.5 The booking form on the operator's own website

This is the part that changes the revenue, and it deserves the most space on the
landing page.

**Installation is two lines pasted into their website.** One script tag, one
`<alpaca-booking>` element. No plugin, no developer, no separate booking page,
no redirect to a third-party site with somebody else's logo on it.

What the guest sees: pick a tour, pick a date, pick how many adults and children,
enter their details, pay. Availability, prices, currency, times and languages all
come live from the operator's own setup — nothing is configured twice.

**It looks like their website, not like ours.** The console has a live styler:
colours, corner radius and font on the left, the real booking form on the right,
re-drawing as they drag. When it looks right, they copy the snippet and it
arrives on their site already styled. Anyone who wants finer control has CSS
custom properties and named parts for every element.

**The guest never leaves the operator's website.** Even paying by card: the
customer goes to a secure payment page and comes straight back to the operator's
own page, where the form confirms the booking in front of them. There is no
"powered by" landing page in the middle.

It's a small, fast, self-contained script — under 25 KB — that won't slow their
site down, and it can be pinned to a single tour if they want a *Book this trip*
form sitting on that trip's page.

*Benefit lines:* **Paste two lines into your website and start taking bookings
tonight.** / **Your colours, your fonts, your site — the guest never leaves it.**

### 3.6 Card payments that go straight to the operator's bank

Card payments run through **Stripe, on the operator's own Stripe account**. The
money goes from the guest to the operator directly. It never sits in a platform
balance, and no commission is taken from it — the platform fee is a flat monthly
amount, billed separately.

Per tour, the operator chooses how it may be paid for:

- **Card only** — the standard for a trip with real costs behind it. No payment, no seat.
- **Pay on arrival** — the booking is confirmed and the money is collected at the jetty.
- **Both** — the guest chooses.

The payment page appears in the guest's own language and their own currency
formatting.

**Seats are held, not lost.** When a guest goes to pay, their places are held for
35 minutes. If they wander off, the places go back on sale automatically — no
job to run, no seat stuck in limbo. And the hold deliberately outlives the
payment window, so a payment can never arrive for a seat that has already been
resold.

*Benefit lines:* **Card payments land in your account, not ours. No commission
per booking.** / **A guest who abandons checkout doesn't cost you the seat.**

### 3.7 Check-in at the jetty, on a phone

A separate screen built for someone standing up, in the sun, with one hand free.
Pick the day, pick the departure, and there's the passenger list — alphabetical
by surname, with phone numbers, the amount still owed, and any notes.

Check people in by passenger type, so *"the family of four — three arrived, the
grandmother didn't"* is a real thing the system can record. The list never
re-sorts itself as you tap, so the next name doesn't jump under your finger.

Someone who turns up holding a booking they cancelled still appears on the list,
marked as cancelled — because *"I can't find you"* and *"you cancelled this"* are
very different conversations.

**The crew member doing check-in can be given an account that reaches nothing
else.** No prices, no other bookings, no settings — just today's boats.

*Benefit lines:* **The passenger list is live, on the phone in your hand.** /
**Give the crew check-in without giving them the books.**

### 3.8 A screen that says what needs deciding today

Opening the console shows:

- Today's departures, with how many are booked and how many have checked in
- How much money is still outstanding on today's boats
- How many bookings came in today — and **how many of those the website took by itself**, which is the number that tells them the form is still working before a guest rings to say it isn't
- **Departures in the next week that won't reach their minimum** — while there's still time to promote them or call them off
- **Departures holding more people than they have room for**, which happens after someone swaps to a smaller boat

Every departure can carry a minimum: *this trip doesn't run under 6 people*. The
system watches that minimum for a week ahead and says so.

*Benefit line:* **See the boats that won't fill while you can still do something
about it.**

### 3.9 Guests get written to, in their own language

When a booking is confirmed, the guest gets a confirmation email — the reference,
the tour, the date and time in the **operator's** timezone (a departure is at
10:00 Ljubljana time no matter where the guest is reading), the passengers, the
total, and what's still to pay.

Replies go to the operator's own address, not into a void. If an email ever fails
to send, the booking screen says so and offers to send it again — rather than the
operator finding out from an annoyed guest.

### 3.10 Two languages, kept separate on purpose

The operator reads the console in **their** language. Their guests read the
booking form and the confirmation in **theirs**. Those are different people and
the product treats them as such — a Slovenian operator selling to foreign
tourists doesn't have to pick one.

The operator picks which languages they offer guests, translates their own tour
names and descriptions into them, and — if a word of ours reads stiffly, or says
*tickets* where they say *places* — can rewrite any individual line of the
booking form themselves, without waiting for us.

Console and guest-facing text currently ship in **English and Slovenian**.

### 3.11 Staff, with the right amount of access

Three roles:

| Role | What they can reach |
| --- | --- |
| **Admin** | Everything — tours, prices, staff, payments, the website form |
| **Staff** | The daily work: departures, bookings, check-in. Not prices, not settings, not keys |
| **Check-in** | Today's departures and the passenger list. Nothing else |

Staff are invited by email and set their own password. Someone who leaves is
deactivated, not deleted — their bookings keep their history intact.

### 3.12 Quiet things that matter

Worth one line each, low on the page:

- **Nothing is ever deleted.** Tours, prices and staff are retired, and old bookings keep pointing at exactly what they were sold as.
- **Every time is in the operator's timezone**, never the reader's browser.
- **Bot protection on the booking form**, so nobody fills a boat for fun.
- **The price is always recomputed on our side** from the operator's own price list. A tampered booking form cannot buy a €90 cruise for €9.
- **Their data is theirs alone.** Separation between operators is enforced by the database itself, not by careful application code.

---

## 4. Why this and not the alternatives

Position against what a Ljubljanica operator would otherwise be looking at:

**vs. a spreadsheet and a phone.** Everything above. The nearest comparison is
that the spreadsheet doesn't take money at 23:00 and doesn't stop two people
selling the same seat.

**vs. the big international booking platforms.** Those charge a percentage of
every booking — typically double digits on OTA channels, and a per-booking cut
even on direct sales. Alpaca Booking takes a **flat monthly fee** and **no cut of
any booking**. Card money goes straight from the guest to the operator's own
Stripe account. On a season's turnover, that difference is the entire pitch.

**vs. a website plugin.** A plugin is a booking calendar. This is the whole
operation — the jetty, the crew, the money owed, the boats that won't fill.

**vs. having something built for them.** It exists now, it's a monthly fee rather
than a project, and it's already been built for exactly this shape of business:
scheduled departures, fixed capacity, mixed passenger types, a summer season and
a jetty.

---

## 5. What adoption actually costs them

Useful for an objection-handling section:

- **No new hardware.** It runs in a browser, on the office computer and on the crew's phone.
- **No developer.** Two pasted lines is the whole website install, and the snippet is generated for them with their key already in it.
- **No migration project.** They set up their tours and their season, and start taking bookings. Old bookings can stay wherever they are; nothing has to be imported for the system to be useful on day one.
- **A Stripe account** — free to open — if they want card payments. If they only take cash, they can skip it entirely and the system still runs their whole operation.
- **Onboarding is a conversation, not a course.** Realistically: an afternoon to set up the tours and the season, ten minutes to put the form on their site.

---

## 6. Suggested shape for the landing page

An order that follows how the operator thinks, not how the software is built:

1. **Hero** — the one-sentence version, plus a picture of the booking form on a boat-tour website
2. **The day it replaces** — the problem table, cut to three rows
3. **Take bookings while you sleep** — the website form (§3.5), the biggest section on the page
4. **The money is yours** — direct card payments, no commission (§3.6), contrasted with OTA percentages
5. **Your season, set once** — schedule and prices (§3.1, §3.2)
6. **At the jetty** — check-in on a phone (§3.7)
7. **What needs deciding today** — the dashboard (§3.8)
8. **Your guests, in their language** — languages and confirmations (§3.9, §3.10)
9. **Your crew, the right access** — roles (§3.11)
10. **What it costs you to start** — §5
11. **The offer** — pricing and next step

### Numbers and specifics safe to put on the page

- Two lines of HTML to install
- Under 25 KB — won't slow their site
- Up to 500 departures created in one batch
- Five steps from landing on the form to a confirmed booking
- 35-minute seat hold during checkout
- Booking references in the form BK-10342
- Three staff roles
- Payment methods recorded: cash, card, bank transfer, online, other
- Booking sources tracked: website, phone, walk-in, staff, partner, API
- Console and guest text in English and Slovenian

---

## 7. Do not claim any of this

The page must not promise these. They are genuinely not built, and a landing page
that implies them creates a bad first meeting.

| Do not say | Reality |
| --- | --- |
| Refunds are processed in the system | Refunds are visible on a booking but are not issued from the console. A cancellation releases the seat, records nothing financial and notifies nobody — the operator refunds through Stripe or in cash and records it themselves |
| Guests can cancel or change their own booking online | They cannot. The cancellation deadline is recorded as the operator's policy, but any change goes through the operator |
| Automatic reminder emails, SMS, or marketing | Only the booking confirmation is sent. No reminders, no SMS, no mailing list |
| Discount codes, vouchers, gift cards, promotions | None exist |
| Waiting lists for full departures | Not built |
| Reports, exports, CSV, accounting integration | The dashboard is a working screen for today, not a reporting suite. There is no export |
| Sync with Viator / GetYourGuide / Airbnb Experiences / TripAdvisor | No channel manager, no OTA integration of any kind |
| A customer database, guest profiles, repeat-guest history | Guest details are held per booking. There is no customer record joining them |
| Assigning specific boats, skippers or guides to a departure | A departure has a capacity and a note. It does not have resources or staff assigned |
| Multiple currencies | One currency per operator |
| Any guest-facing language beyond English and Slovenian | Other languages get English text with correct local date, time and money formatting. More can be added — but only as a commitment, not as an existing feature |
| Named live customers, case studies, uptime figures, review scores | There are none yet. Do not invent them |

### Also handle carefully

- **Availability and support terms** are commercial commitments, not product facts. Whatever the page promises there has to come from the person making the offer.
- **The price** — flat monthly fee, no commission — is the model. The actual figure isn't decided in this document.
- **"Add a language for you"** and similar are real, cheap and worth offering — as part of the deal, phrased as something we'll do, not as a switch that already exists.

---

## 8. Tone notes for whoever writes the page

- Say *departures*, *places*, *passengers*, *the jetty*, *the crew*. Not *inventory*, *SKUs*, *resources*, *capacity units*, *end users*.
- Prefer the concrete: *"three of the family of four turned up"* beats *"granular check-in"*.
- The operator's scepticism is the honest kind — they've been sold software before. Specifics beat adjectives everywhere: *"the money goes to your Stripe account, we take none of it"* is worth more than *"transparent pricing"*.
- The single strongest argument on the page is **flat fee, no commission, money direct to them**. Everything else supports it.
- Slovenian or English for the page itself is the offer-maker's call — the product speaks both.
