import type { IconKey } from '@/content/icons'
import { terms, type OfferPartId } from '@/content/offer'
import { eur } from '@/lib/format'

/**
 * Every word the reader sees, in one file.
 *
 * ## Why the prose is not in the components
 *
 * This page will be re-read and re-worded far more often than it will be
 * re-built. The person doing that rewording is the person making the offer —
 * they are editing an argument, not a layout, and asking them to find the
 * sentence they want inside nine components is how a good sentence ends up
 * left alone because changing it looked risky.
 *
 * ## The one price in this file
 *
 * `terms.hourlyRate` is interpolated into the excluded list rather than typed
 * out as a number. Prices live in `offer.ts` and are checked there before the
 * offer goes out; a rate written into a sentence here is a price in a second
 * place, and the second place is the one nobody remembers to update.
 *
 * ## The `**` in the strings
 *
 * Copy needs emphasis and emphasis is not layout. `**like this**` is rendered
 * bold by `<Copy>`; nothing else is interpreted. It is deliberately the only
 * markup available — a copy file that grows a syntax grows a parser, and then
 * the wording lives somewhere nobody can edit safely after all.
 *
 * ## One sentence per feature
 *
 * The feature lines below are held to a title of four or five words and a body
 * of one sentence, and the limit is the point. The earlier draft ran three or
 * four sentences per feature and thirty features in a row, which is a document
 * the reader skims and then asks, on the phone, what it actually includes.
 * Anything that genuinely needs a paragraph is not a feature line — it is a
 * graphic (see `moneyFlow`, `route`) or it belongs in `fineprint`.
 */

export type FeatureItem = {
  icon: IconKey
  title: string
  body: string
}

/*
  The hero says one thing, and then hands over the controls.

  Above the fold: what we noticed, what we propose, the three parts by name, and
  which two go together. The cards are also where the reader switches parts on
  and off, so the first screenful is not only a summary of the offer but the
  place it gets configured. Prices are not here — they belong with the totals,
  where a figure can be compared against the other two rather than read alone.

  ## Why the lead names the three parts

  The cards used to be introduced by a label reading "Ponudba v treh delih" and
  preceded by two buttons. The cards are the way in now, and a label announcing
  three things directly above three things is a caption on a photograph of
  itself. So the shape of the offer moved up into the one paragraph the hero
  has, where it arrives as a sentence rather than as a heading.
*/
export const hero = {
  eyebrow: 'Ponudba',
  heading: 'Povečanjte število rezervacij plovb tujih in domačih gostov.',
  lead: 'Predstavljamo ponudbo, sestavljeno iz 3 delov: **sistem za rezervacije in plačila**, nova **stran za tuje turiste** in **preoblikovanje obstoječe strani** za potrebe domačih gostov ter poslovnih partnerjev. Ponudba omogoča poljuben obseg izvedbe in dodatne popuste, glede na dogovorjeni obseg.',
  cardIn: 'V ponudbi',
  cardOut: 'Ni v ponudbi',
} as const

/*
  The index bar across the top of the page, on wide screens only.

  ## Why these are words now

  The bar spent a while as a column in the margin, where there was room for one
  mark per stop and no more: `01`, a euro sign, an arrow standing in for *the
  top*. Marks work on the three parts, because the reader meets those numerals
  on the hero cards before they ever need them again. They never worked on the
  bookends — an arrow pointing up is a scroll control rather than an index
  entry, and `€` is a column heading in search of a column.

  Across the top there is room for language, so the bookends are simply what
  they point at. `Ponudba` is the offer itself, which is what the top of this
  document is; `Cenik` is the panel where the figures are added up, and naming
  it as a price list is more use to somebody scanning for the number than
  `Povzetek` would be.

  The three parts keep their numerals and gain their names from `offer.ts` —
  that is where a part is named, and naming it twice would be two things to keep
  in step.
*/
export const rail = {
  /** Names the landmark itself, for a reader listing the page's regions. */
  label: 'Deli ponudbe',
  top: {
    name: 'Ponudba',
  },
  summary: {
    name: 'Cenik',
  },
} as const

/**
 * The three problems, one per part of the offer.
 *
 * ## Why they are keyed by part
 *
 * The page used to open with two sections of observation: `Zakaj izboljšati
 * sistem`, three claims about the takings, and `Kaj vidimo od zunaj`, six things
 * wrong with how the season is run today. Both were true and neither was
 * answerable. Nine observations followed by three parts left the reader to work
 * out which of the nine each part was for, and for several of them the honest
 * answer was *none of these, directly*.
 *
 * So there are three now, keyed by the part that fixes each one, and the hero
 * sets each one directly above its part's card with an arrow between. A problem
 * no part answers has nowhere to live in this file, which is the point — it
 * stops the diagnosis from growing past what the offer can actually address.
 *
 * ## What was folded together, and what was dropped
 *
 * `booking` carries what were three separate observations — the call nobody
 * makes, the booking that arrives at eleven at night, the last two seats sold
 * twice. They are one failure with three symptoms, and a reader recognises the
 * failure faster than they read the list.
 *
 * *Do vkrcanja nihče ne ve prave številke* — the schedule in a spreadsheet, the
 * bookings in a notebook, the money in a tin — is dropped rather than folded in.
 * It is a consequence of the same cause, and adding it turned a problem into a
 * paragraph.
 *
 * The no-commission claim that opened the old `takeaways` was never a problem
 * statement at all. It is the money argument, and it is already made where it
 * belongs: drawn, in `moneyFlow`, under `01`.
 */
export type Problem = {
  /**
   * The failure, in the reader's own words. Under about thirty-five characters
   * — it is set over a card in a third of the page's width and wraps to three
   * lines beyond that.
   */
  title: string
  /**
   * Two sentences at most. This is the recognition, not the argument; the case
   * for the part that answers it is made in the part's own section.
   */
  body: string
}

export const problems: Record<OfferPartId, Problem> = {
  booking: {
    title: 'Rezervacija na spletu ni mogoča',
    body: 'Turist, ki mora poklicati, da izve, ali je še prostor, večinoma ne pokliče. Rezervacije ponoči ali iz tujine, so izgubljene. Plačati se da samo v živo.',
  },
  landing: {
    title: 'Tuji turist vas ne najde',
    body: 'V iskalnik vtipka **“Ljubljana boat tour”**. Ne vtipka “Emona” in ne “ladjica”. Če stran vseeno odpre, ta govori o ponudbi, ki ju ne išče.',
  },
  redesign: {
    title: 'Ena stran za dva različna gosta',
    body: 'Dnevni izlet za turista in zasebni najem s pogostitvijo sta dva posla. Ena stran za oboje prepriča polovico obeh, tudi tistega, ki pri vas naroči največ.',
  },
}

type PartCopy = {
  /**
   * What the part *is*, and the section's display-size title.
   *
   * A few words a reader can recognise the part by having read nothing else —
   * it is the largest line in the section, so it has to survive being the only
   * one that gets read. Keep it under about forty characters: at display size
   * it wraps to a third line beyond that.
   */
  kicker: string
  /**
   * The commercial framing, set as a subtitle under `kicker`: what is being
   * subscribed to, or who the thing is for. A short sentence, not a second
   * title.
   */
  heading: string
  lead: string
  /**
   * Features, grouped.
   *
   * `id` keys the group to its exhibit in `page.tsx` and is never printed. The
   * grouping still does its work unprinted: a screenshot belongs to one of the
   * three places the operator's day happens, and a figure of the jetty sitting
   * under the office lines is worse than no figure at all.
   *
   * `title` is optional, and part 01 does without it. Where a group opens on an
   * exhibit, the exhibit's own heading names the block, and a group title above
   * it was a heading introducing a heading — two lines of title in a row, the
   * upper one saying the vaguer of the two things. Where a group has no figure,
   * or where the figure is not the point of it, the title is what the reader
   * has to go on and it stays.
   */
  groups: { id: string; title?: string; items: FeatureItem[] }[]
  /**
   * Answers "and what if we don't take this one?" honestly, at the foot of the
   * section, and only while the part is out of the offer.
   *
   * The optional part needs this most, not least. It is the one a reader is
   * genuinely deciding about rather than reading about, and it is switched off
   * by default — so this sentence is the only thing standing where a toggle used
   * to. Leave it empty and the section simply stops, which reads as agreement
   * that the part does not matter.
   */
  without: string
}

export const parts: Record<OfferPartId, PartCopy> = {
  booking: {
    kicker: 'Sistem za rezervacije in spletna plačila',
    heading: 'Mesečna naročnina na Alpaca Booking',
    lead: 'Alpaca Booking je sistem za upravljanje rezervacij. Omogoča spremljanje voznega reda, sprejem rezervacij na pomolu, po telefonu in na vaši strani. Turistom omogoča, da svojo rezervacijo opravijo samostojno na vaši strani. Prav tako omogoča spletna plačila.',
    groups: [
      {
        id: 'site',
        items: [
          {
            icon: 'moon',
            title: 'Rezervacije in plačila izven uradnih ur',
            body: 'Turist izbere termin in plača neposredno na spletni strani. V primeru, da rezervacije ne dokonča, gredo mesta po **35 minutah** nazaj v prodajo.',
          },
          {
            icon: 'brush',
            title: 'Videti je kot vaša stran',
            body: 'Obrazec se enostavno prilagodi vašemu dizajnu in barvam.',
          },
          {
            icon: 'code',
            title: 'Enostavna integracija',
            body: 'Obrazec omogoča, da rezervacije in plačila vključite v vašo obstoječo spletno stran z enim klikom.',
          },
        ],
      },
      {
        id: 'office',
        items: [
          {
            icon: 'calendar',
            title: 'Nastavitve sezone in urnika',
            body: 'Za izbrano obdobje lahko nastvite ponavlajoči vozni red, ki se samodejno prenese v obrazec na vaši strani.',
          },
          {
            icon: 'tags',
            title: 'Prilagodljiv cenik',
            body: 'Vsaka vrsta vstopnice ima svojo ceno **in svoj prostor na ladji**; npr. dojenček v naročju je brezplačen in ne zasede sedeža.',
          },
          {
            icon: 'dashboard',
            title: 'Dnevni pregled rezervacij',
            body: 'Kdo je vkrcan, kdo mora plačati ob prihodu in kateri odhodi v prihodnjem tednu ne bodo polni.',
          },
        ],
      },
      {
        id: 'jetty',
        items: [
          {
            icon: 'clipboard',
            title: 'Seznam potnikov na telefonu',
            body: 'Urejen po priimkih, s številkami in odprtim zneskom.',
          },
          {
            icon: 'crew',
            title: 'Posadka dobi dostop, ne računovodskih knjig',
            body: 'Študent na pomolu vidi današnji razpored in nič drugega.',
          },
          {
            icon: 'languages',
            title: 'Vi slovensko, turist angleško',
            body: 'Sistem vodite v svojem jeziku, obrazec in potrdilo pa prideta do turista v njegovem.',
          },
        ],
      },
    ],
    without:
      'Brez tega ostane nova stran lepa vitrina, v kateri se ne da nič kupiti. Rezervacije še naprej tečejo po telefonu.',
  },
  landing: {
    kicker: 'Landing page za turiste',
    heading: 'Stran, namenjena tujim gostom',
    lead: 'Nova stran (t.i. landing page) na svoji domeni, namenjena za turista, ki je v Ljubljani dva dni in išče, kaj bi počel danes popoldne.',
    groups: [
      {
        id: 'contents',
        items: [
          {
            icon: 'globe',
            title: 'Domena, primerna za turiste',
            body: '**ljubljanicatours.com** vsebuje besedo, ki jo turist vtipka. Obstoječa stran ostane taka, kot je.',
          },
          {
            icon: 'pointer',
            title: 'Rezervacija na prvem zaslonu',
            body: 'Obrazec ni skrit v nogi spletne strani. Je prva stvar na strani, skupaj z uro naslednjega odhoda.',
          },
          {
            icon: 'target',
            title: 'Ena ponudba, ena zgodba',
            body: 'Samo dnevna krožna plovba: kaj se vidi, koliko traja, kje se vkrcate, koliko stane.',
          },
          {
            icon: 'sparkle',
            title: 'Berljiva tudi za ChatGPT',
            body: 'Strukturirani podatki o izletih, urnikih in cenah. Izboljša vidnost v spletnih brskalnikih in klepetih, ki jih poganja umetna inteligenca.',
          },
          {
            icon: 'speed',
            title: 'Hitra na slabem signalu',
            body: 'Turist jo odpre na pomolu, med hojo, med gostovanjem v tujem omrežju.',
          },
          {
            icon: 'languages',
            title: 'Slovensko in angleško',
            body: 'Angleščina je glavna, ker je glavni gost tuji turist.',
          },
        ],
      },
    ],
    without:
      'Brez tega gre rezervacijski sistem na obstoječo stran. Deluje — ostane pa problem, da tujec te strani ne najde in je ne razume.',
  },
  /*
    The optional part, and the one whose tone needed the most care.

    It has a real job in the offer: it is the extra that makes the first two
    read as the sensible core. But an extra that the page itself shrugs at is
    not an extra, it is a footnote — and the earlier draft shrugged hard. "In če
    ostane volja" told the reader we did not expect them to take it; "ponudba
    brez njega stoji povsem enako" told them it changes nothing; "tretji lahko
    mirno počaka", up in the hero, told them to decide later.

    What replaces that is not enthusiasm. It is the business reason, which is
    real: private hire with catering is the largest single sale this operator
    makes, the guest for it lands on ljubljanica.eu, and once the new site is up
    the old one is the one they will be looking at. The offer still says plainly
    that the first two stand without it — that sentence is what makes the rest
    believable — it just stops arguing the reader out of it afterwards.
  */
  redesign: {
    kicker: 'Spletna stran za zasebni najem',
    heading: 'Domači gost pristane na stari strani...',
    lead: 'Prva dva modula ponudbe delujeta neodvisno in sta namenjena tujim turistom. Zasebni najem s pogostitvijo je vaša največja posamična prodaja, gost zanj pride prav na ljubljanica.eu, ki bo ob novi strani **izpadla starejša**, kot je. Če obe strani nastaneta skupaj, plačate **skupno ceno vzdrževanja**.',
    groups: [
      {
        id: 'plan',
        title: 'Kaj bi naredili',
        items: [
          {
            icon: 'crew',
            title: 'Za domačega gosta, ne za tujca',
            body: 'Ko dnevne izlete prevzame nova stran, se ta posveti **zasebnemu najemu s pogostitvijo** (rojstnim dnevi, poslovna srečanja, poroke).',
          },
          {
            icon: 'camera',
            title: 'Ena podoba za obe strani',
            body: 'Logotip, barve, pisave in način fotografiranja postavimo enkrat in veljajo za obe strani.',
          },
          {
            icon: 'message',
            title: 'Povpraševanje, ne rezervacija',
            body: 'Piknik ni izdelek s fiksno ceno. Obrazec na strani omogoča pripravo prilagojene ponudbe.',
          },
          /* The `splet` rule, said as a benefit in the section rather than only
             as a line in the totals. */
          {
            icon: 'code',
            title: 'Eno vzdrževanje za obe strani',
            body: 'Strani gostujeta na istem mestu in ju posodabljamo z istim posegom, zato **vzdrževanje plačate enkrat**, ne dvakrat.',
          },
        ],
      },
    ],
    without:
      'Brez tega ostane ljubljanica.eu takšna, kot je — ena stran za dva različna gosta. Tisti, ki najame celo ladjico s pogostitvijo, pristane prav na njej.',
  },
}

/**
 * Where the money goes — the offer's single strongest argument, drawn rather
 * than written.
 *
 * ## Why one ticket and not one hundred euros
 *
 * The earlier version of this graphic sent €100 down two rails and kept all of
 * it on ours. Two things were wrong with that. The first is that it was not
 * true: card payments cost a bank fee whoever collects them, and the one reader
 * who already has a Stripe account is exactly the reader whose trust the rest of
 * the page depends on. The second is that €100 is not a unit anybody here sells.
 * A cruise ticket is about €12, and per-booking pricing was designed for €150
 * day tours — which is the whole argument in Slovenia, and it is invisible at
 * €100 and unmissable at €12. So the graphic draws one real ticket, names the
 * bank fee in every column, and lets the difference be the only thing that
 * differs.
 *
 * ## Why three named platforms and not one anonymous one
 *
 * This section used to run a single column headed `Platforma`, charging
 * `0,50 € + 3,5 %` and described as a `tipičen cenik`. The arithmetic was right
 * and the label was not: that is Regiondo's model and only Regiondo's. Neither
 * Bókun nor Rezdy charges a fixed amount per ticket at all, so the sentence
 * introducing the table — *a fixed amount and a percentage* — was false about
 * two of the three platforms it claimed to describe, and the largest number on
 * the page was attributed to nobody in particular.
 *
 * An operator checks that. They are being sold a booking system, so they have
 * looked at booking systems, and the first thing a competitor says when this
 * page is forwarded to them is *that is not our price*. One unattributable
 * €5.520 is worth less than three figures each of which survives being looked
 * up, which is why the three real platforms are named together with the plan the
 * rate belongs to. It costs the drama of a single number and buys the only thing
 * this section actually trades in.
 *
 * The spread is the argument now: the same ticket costs €0,18 on one platform
 * and around €0,90 on another, and nothing about the reader's business changed
 * between those two figures. Ours is €0 in all of them.
 *
 * ## Why Regiondo's figures are approximate and the others are not
 *
 * Bókun and Rezdy publish their rates against a named plan. Regiondo does not:
 * its pricing page headlines *zero commission* and says only that a small
 * per-booking fee applies. The `0,50 € + 3,5 %` that produced the old `0,92 €`
 * comes from operators reporting what they were charged, not from a price list,
 * and a figure quoted to the cent claims a source this page has not got. So that
 * column is rounded and marked approximate wherever it prints, and its note says
 * where the number came from. A reader who checks finds exactly what they were
 * told they would find.
 *
 * ## Why the bank fee appears on our side too
 *
 * Because it does. Showing it is what makes the zero on our side of
 * `Delež platforme` readable as a fact rather than as a sales line — a reader
 * who finds the one deduction we could have hidden, stated plainly, has less
 * reason to go looking for others. It is also the same figure in every column,
 * so drawing it four times makes the comparison honest without costing the
 * comparison anything.
 *
 * ## Why the ticket comes first and the season last
 *
 * Because that is the order in which the argument is earned. Eighteen cents off
 * a €12 fare is a figure nobody disputes — it is arithmetic, and the reader
 * checks it against a price list they already know. Six thousand tickets later
 * it is between €1.080 and €5.400, and a reader who has just watched the cents
 * come off one ticket meets those totals having done the multiplication
 * themselves.
 *
 * Led with, a season total is a sales figure and gets read as one. Arrived at,
 * it is the consequence of a deduction the reader has already accepted, which is
 * the one claim a percentage cannot answer: it grows exactly as fast as the
 * business does. A good season makes it worse.
 *
 * ## Why the labels are short
 *
 * Every one of them is a row heading in a table whose four money columns are
 * sized by their widest figure, so the heading column gets whatever is left.
 * Nothing here is written longer than the column it has to live in.
 */
export const moneyFlow = {
  heading: 'Koliko provizije računa Alpaca Booking?',
  lead: 'Alpaca Booking računa le **mesečno naročnino**. **Konkurenčne** platforme računajo odstotek od vsake spletne rezervacije, nekatere pa zraven še **fiksni znesek na vstopnico**. Spodaj so trije razširjeni ponudniki ob nas, na isti vstopnici in na isti sezoni.',
  /** The fare the whole graphic is drawn from. PLACEHOLDER — a real ticket price. */
  ticket: 12,
  paysLabel: 'Gost plača',
  keptLabel: 'Ostane vam',
  /** Heads the one row the whole section exists to print. */
  cutLabel: 'Delež platforme',
  /**
   * The card fee, identical in every column. Stripe's European consumer rate on
   * a €12 fare: 1,5 % + 0,25 €. Non-European cards cost more; the footnote says
   * so rather than the rail, because the figure is the same on every side and
   * changing it changes none of them.
   */
  bankLabel: 'Banka za kartico',
  bankFee: 0.43,
  /**
   * Set once over the phone cards. The first two rows of the table carry the
   * same figure in all four columns, and four cards repeating them is one fact
   * printed eight times on the screen that has room for none of it.
   */
  sharedLabel: 'Enako povsod',
  ours: {
    title: 'Alpaca Booking',
    column: 'Alpaca',
    cut: 0,
    note: 'Bančno provizijo plačate banki neposredno, nam pa mesečni znesek — enak pri tisoč vstopnicah in pri desetih tisoč.',
  },
  /**
   * The three platforms an operator in this market actually compares us against,
   * in the order their charge grows — which is also the order that makes the
   * point, because the reader watches the same ticket get more expensive down
   * the table without anything about their business changing.
   *
   * `column` heads the column and `title` heads its note: the heading is set in
   * tracked mono capitals and the column is sized by the widest thing in it, so
   * the plan name lives under the table where there is room for it. The rate
   * belongs to the plan rather than to the vendor, which is exactly why the plan
   * is named at all.
   */
  theirs: [
    {
      id: 'bokun',
      column: 'Bókun',
      title: 'Bókun START',
      /** 1,5 % of the fare, no fixed fee. */
      cut: 0.18,
      note: 'Paket START: 1,5 % od vsake spletne rezervacije, brez fiksnega zneska na vstopnico.',
    },
    {
      id: 'rezdy',
      column: 'Rezdy',
      title: 'Rezdy Foundation',
      /** 3 % of the fare, no fixed fee. */
      cut: 0.36,
      note: 'Paket Foundation: 3 % od vsake rezervacije, brez fiksnega zneska na vstopnico.',
    },
    {
      id: 'regiondo',
      column: 'Regiondo',
      title: 'Regiondo',
      /**
       * A fixed amount plus about 3,5 %, rounded to ten cents and marked
       * approximate everywhere it prints. See the note above the export: the
       * rate is reported by operators rather than published, and a figure given
       * to the cent would claim a source this page has not got.
       */
      cut: 0.9,
      approx: true,
      note: 'Regiondo provizije ne objavlja — navaja le majhen znesek na rezervacijo. Izračun je po vrednostih, ki jih poročajo uporabniki: fiksni znesek in približno 3,5 %.',
    },
  ],
  season: {
    /** The row heading. The ticket count is set under it, from `tickets`. */
    label: 'Čez sezono plačate',
    /** PLACEHOLDER — tickets sold in a season. The multiplier, so it is marked. */
    tickets: 6000,
    /** Reads as `6.000 vstopnic`, composed around `tickets`. */
    sub: 'vstopnic',
    /**
     * Set over every season figure, identical and in the same grey, because it
     * is true of all of them: everybody here sells a subscription. Stating it on
     * the row rather than in the small print is what makes the figures under it
     * comparable — one column is a subscription and nothing else, the other
     * three are a subscription and a commission, and that is the whole
     * difference.
     *
     * What each subscription costs is deliberately not here. Four monthly prices
     * on four plans of different scope is a second comparison, argued on a row
     * that exists to make a first one, and four numbers are not enough for the
     * reader to weigh it anyway. The footnote says the subscriptions differ.
     */
    prefix: 'Mesečna naročnina +',
  },
  footnote:
    'Bančna provizija je v vseh stolpcih ista in gre banki, ne nam: 1,5 % + 0,25 € za evropske kartice in 3,25 % + 0,25 € za ostale — pri 12-evrski vstopnici 0,43 € oziroma 0,64 €. Navedeni odstotki veljajo za imenovane pakete in za spletne rezervacije: Bókun rezervacij, sklenjenih na pomolu ali prek Viatorja, ne zaračuna, zato je pri prodaji na kraju samem njegov znesek nižji od izračunanega. Mesečno naročnino zaračuna vsak ponudnik posebej in se razlikuje po paketu. Fiksno je le to, da mi svojega deleža nimamo.',
} as const

/**
 * The guest's path, for the section that argues for a new website.
 *
 * The only genuinely ordered thing on this page, which is why it is the only
 * thing drawn as a sequence — and why it still carries no numerals. The numbers
 * belong to the parts of the offer; a rail with four stops reads as an order
 * without needing to be counted.
 *
 * ## One line over it, not two
 *
 * `Pot obiskovalca na vaši spletni strani` was the mono label and `Od iskalnika
 * do vkrcanja` the heading — which is one title too many for a four-stop rail
 * that spells out both of its ends in the stops themselves. The label was the
 * more useful of the two, because it says what the drawing *is* rather than
 * paraphrasing what it depicts, so it took the heading's place and the heading
 * went.
 */
export const route = {
  heading: 'Pot obiskovalca na vaši spletni strani',
  steps: [
    {
      icon: 'search',
      title: 'Vpiše v iskalnik',
      body: '“Ljubljana boat tour”, na telefonu, na ulici.',
    },
    {
      icon: 'globe',
      title: 'Najde vašo stran',
      body: 'Stran, ki govori o točno tem, kar išče.',
    },
    {
      icon: 'ticket',
      title: 'Rezervira',
      body: 'Obrazec v prvem zaslonu, ki poveča konverzijo.',
    },
    {
      icon: 'anchor',
      title: 'Se vkrca',
      body: 'Ime je na seznamu potnikov in rezervacija v sistemu.',
    },
  ] satisfies { icon: IconKey; title: string; body: string }[],
  today: 'Danes se ta pot konča pri prvem koraku.',
} as const

/**
 * The screenshots, and what each one is being shown to prove.
 *
 * ## Why the coordinates live with the words
 *
 * A callout is a sentence and a place, and they are useless apart: moving the
 * marker without moving the line points the reader at the wrong number, which
 * is worse than pointing at nothing. So `x` and `y` sit in the copy file beside
 * the text they carry, and both get edited in the one place.
 *
 * ## Two captures did not make it
 *
 * `bookings.png` and `sessions.png` are in `public/images/` and are not on the
 * page. Both are good captures of real screens — the whole booking list with
 * its filters, and the season laid out week by week — and neither survived the
 * test in `Exhibit`: what they show, the reader can already picture. A list of
 * bookings looks like a list of bookings. The three that are here show
 * something the operator cannot see today at all.
 */
export const exhibits = {
  /*
    English on purpose, and nothing on the page says so. There was a lead that
    was meant to — by the end it said only *Rezervacijski obrazec sistema Alpaca
    Booking*, which named the picture the heading had already named and excused
    nothing. Two languages kept separate is a claim in the feature list above,
    and the captures prove it between them: this one English, the console
    Slovene. A caption apologising for the language would point at the one thing
    the reader had not noticed.
  */
  widget: {
    heading: 'Rezervacijski obrazec za turista na vaši spletni strani',
    alt: 'Rezervacijski obrazec: vrstica dni od torka 25. do ponedeljka 31. avgusta z izbranim 25., pod njo trije termini izbranega dne, od katerih je prvi razprodan.',
    callouts: [
      {
        letter: 'A',
        x: 5,
        y: 33,
        text: 'Termini se avtomatsko prenesejo iz vašega urnika.',
      },
      {
        letter: 'B',
        x: 5,
        y: 65,
        text: 'Zasedenega termina turist ne more izbrati.',
      },
    ],
    caption: 'Obrazec prevzame barve, pisavo in obliko strani, na katero je vgrajen.',
  },

  dashboard: {
    heading: 'Nadzorna plošča sistema za vodenje rezervacij',
    alt: 'Nadzorna plošča: pet številk za današnji dan — 4 termini, 62 udeležencev, 11 od 62 prijavljenih, 224 € za pobrati, 18 sprejetih rezervacij, od tega 8 prek spletne strani. Pod njimi opozorilo o dveh odhodih v naslednjih sedmih dneh in seznam štirih današnjih terminov z zasedenostjo.',
    callouts: [
      {
        letter: 'A',
        x: 69,
        y: 19,
        text: 'Znesek plačil ob prihodu.',
      },
      {
        letter: 'B',
        x: 85,
        y: 19,
        text: 'Število telefonskih in spletnih rezervacij.',
      },
      {
        letter: 'C',
        x: 63,
        y: 61,
        text: 'Plovbe prihodnjega tedna, ki še ne dosegajo minimalnega števila udeležencev ali pa so čez zmogljivost.',
      },
    ],
  },

  checkin: {
    heading: 'Seznam potnikov ob vkrcanju za posadko',
    alt: 'Seznam potnikov za Classic Ljubljana Tour ob 10.00: štiri rezervacije z imenom, številom oseb, oznako plačila, telefonsko številko in gumbom za prijavo. Pri prvi piše neplačano in za pobrati 80 €, pri drugi 3 od 6 prijavljenih.',
    callouts: [
      {
        letter: 'A',
        x: 21,
        y: 36,
        text: 'Kdo še ni plačal in koliko dolguje.',
      },
      {
        letter: 'B',
        x: 88,
        y: 42,
        text: 'Družina šestih, prišli trije. Prijavljate osebe, ne rezervacije.',
      },
    ],
    caption: 'Posnetek zaslona, ki ga vidi posadka pred vkrcanjem.',
  },

  /*
    The only figure on the page that draws something not yet built, and the
    only one whose mount is dashed. The distinction the offer has to keep
    hardest is between what exists and what we will make, and a sketch framed
    exactly like the three captures above it quietly erases that.
  */
  landing: {
    heading: 'Izbira termina, takoj na prvem zaslonu',
    lead: 'Skica razporeditve z **resničnim obrazcem** na svojem mestu.',
    alt: 'Skica nove strani: v glavi levo risba Ljubljanice z gradom, mostom in ladjico, desno resničen rezervacijski obrazec z izbranim datumom in tremi termini. Pod glavo tri sive ikone s sivimi črtami namesto besedila.',
    callouts: [
      {
        letter: 'A',
        x: 46,
        y: 12,
        text: 'Dejanski obrazec iz prvega dela ponudbe, na prvem zaslonu.',
      },
      {
        letter: 'B',
        x: 13,
        y: 79,
        text: 'Vse sivo je vsebina. Kaj piše in katera fotografija stoji kje, se odloči v izdelavi.',
      },
    ],
    caption:
      'Postavitev potrdite pred izdelavo, izgled pa v kasnejši fazi. Skica ni dokončen videz strani.',
  },
} as const

export const summary = {
  heading: 'Ponudba, ki jo sestavite sami',
  lead: 'Zadnja priložnost, da kaj dodate ali odstranite. Vsota se preračuna sproti.',
  emptyHeading: 'Trenutno niste izbrali ničesar',
  emptyBody:
    'Obkljukajte dele spodaj ali na karticah na vrhu strani — ali si spodaj naložite priporočeno kombinacijo.',
  restore: 'Nastavi priporočeno',
  /*
    Nouns, not adverbs. `Enkratno` and `Mesečno` described a manner of paying,
    which worked while they were the only two totals in the panel; sitting under
    a `Popust` row they read as two more modifiers of the discount rather than as
    the two things being billed. `Strošek` says what they are.
  */
  oneOffLabel: 'Enkratni strošek',
  monthlyLabel: 'Mesečni strošek',
  /*
    Every concession on one line — the half-price setup and every rule alike.

    Itemising them put five rows in front of the two figures the reader came
    for, and each row had to name the rule that granted it, which meant naming
    three packages the offer does not otherwise have. The rules still move the
    money; nothing on the page says they exist.

    The row carries two figures rather than one sum, because the two savings are
    not the same kind of number — 350 € off today and 40 € off every month only
    add up once a year is assumed, and nothing here assumes one.
  */
  discountLabel: 'Popust',
  vatNote: 'Vsi zneski so brez DDV.',
  inOffer: 'V ponudbi',
  addToOffer: 'Dodaj v ponudbo',
  removeFromOffer: 'Odstrani iz ponudbe',
  /** Heads the note at the foot of a part the reader has left out. */
  absenceLabel: 'Ni v ponudbi',
} as const

/**
 * The fine print: every edge of the offer, in one place.
 *
 * ## Why the guarantee, the two lists and the objections are one thing
 *
 * They were two sections — `Garancija in obseg` and `Pogosta vprašanja in
 * pomisleki` — and the split was by mood rather than by subject. Both were
 * answering the same question, asked once by a reader who has just seen a
 * price: *what exactly am I agreeing to*. Answering it in two places let the
 * same fact be given twice in different words — the Stripe account is an
 * exclusion and an objection, the monthly fees are an inclusion and an
 * objection, the domain is promised by the guarantee and again by `Brez
 * vezave` — and a reader who finds the same thing said twice starts checking
 * whether it was said the same way.
 *
 * As one export it is four clauses of one answer: what we promise, what the
 * price covers, what it does not, and what is left on the reader's side.
 * Nothing here is commentary on the offer any more; it is the offer's own
 * terms.
 *
 * ## Why the "not included" list is as long as the other one
 *
 * The source brief keeps a list of things the software does not do — refunds
 * from the console, guest self-service, reminders, exports, OTA sync — and warns
 * that a page implying any of them creates a bad first meeting. This section is
 * where that list stops being a constraint and starts being useful: an operator
 * who has been sold software before is looking for what the offer quietly leaves
 * out, and finding it written down, unprompted, is worth more than another
 * paragraph of reassurance.
 */
export const fineprint = {
  heading: 'Podrobnosti ponudbe',
  /*
    Printed under the heading while the block is still shut, because that is the
    whole job of a line on a closed drawer: it has to say what opening it gets
    you, in the reader's own terms, before they spend a click finding out. Four
    clauses, named in the order they are printed.
  */
  lead: 'Garancija, kaj je v ceni, česa ni in kaj ostane na vas.',
  guaranteeLabel: 'Garancija',
  includedLabel: 'Vključeno v ceno',
  excludedLabel: 'Ni vključeno',
  /*
    These six were their own section under the heading "Pogosta vprašanja in
    pomisleki", which named the reader's state of mind rather than the content,
    and then spent a while as "Kaj zahteva od vas", which named it as a demand
    the offer makes. Both missed what the list actually is: the reader's side of
    the agreement — equipment, disruption, time, commitment — with the answer
    *nothing* under five of the six headings. `Vaše obveznosti` is the word a
    contract uses for that side, and it is the one the sceptical reader is
    looking for. Naming it plainly, and then having almost nothing to put under
    it, is a stronger sentence than any wording that softens the question.
  */
  requiresLabel: 'Vaše obveznosti',
  included: [
    'Postavitev izletov, sezone in cenika skupaj z vami',
    'Namestitev rezervacijskega obrazca in prilagoditev vašim barvam',
    'Nova stran v slovenščini in angleščini',
    'Uvajanje ekipe in kratka pisna navodila',
    'Odprava napak na tem, kar smo naredili',
    'Strukturirani podatki o izletih, urnikih in cenah za iskalnike',
    'Prilagoditev besedil rezervacijskega obrazca vašim izrazom',
    'Prenos strani na vašo domeno in predaja vseh dostopov',
    /*
      What the 40 €/mo actually buys. It has to be stated somewhere the reader
      goes looking, or a recurring fee attached to a site that is already built
      and paid for reads as rent on their own property.
    */
    'V mesečnem vzdrževanju: gostovanje strani, odprava napak in posodobitve, ki jih stran potrebuje, da deluje naprej',
  ],
  excluded: [
    'Nove fotografije in slikovno gradivo - naročite jih posebej, če želite',
    'Nov logotip ali prenova obstoječega — naročite ga posebej, če želite',
    'Odprtje Stripe računa in njegove provizije za posamezno transakcijo — račun odprete sami, brezplačno',
    /*
      Narrowed from "domene in gostovanja". Hosting is inside the maintenance
      fee now, and a page that excludes what it elsewhere includes is the kind of
      contradiction a reader finds right before they stop believing the rest.
    */
    'Letni strošek domene — registrirate jo sami in ostane vaša',
    `Nove strani, nove funkcionalnosti in preoblikovanja — to ni vzdrževanje, ampak delo po urni postavki ${eur(terms.hourlyRate)} na uro, vedno po predhodnem dogovoru`,
    'Povezava z Viator, GetYourGuide ali TripAdvisor — sistem je nima',
    'Vračila denarja iz sistema — odpoved sprosti mesta, denar vrnete prek Stripe ali v gotovini',
    'Samopostrežna odpoved ali sprememba s strani gosta — spremembe gredo prek vas',
    'Opomniki, SMS in e-poštne kampanje — sistem pošlje samo potrdilo o rezervaciji',
    'Izvozi, poročila in računovodske povezave',
    'Jeziki poleg slovenščine in angleščine — dodamo jih po dogovoru',
  ],
  requires: [
    {
      title: 'Nobene nove opreme',
      body: 'Teče v brskalniku, na računalniku v pisarni in na telefonu posadke.',
    },
    {
      title: 'Nobenega posega v obstoječo stran',
      body: 'Nova stran je na svoji domeni, obstoječa ostane taka, kot je, dokler se ne odločite za prenovo.',
    },
    {
      title: 'Nobenega prenosa podatkov',
      body: 'Nastavite izlete in sezono ter začnete. Stare rezervacije lahko ostanejo tam, kjer so.',
    },
    {
      title: 'Stripe račun, če želite kartice',
      body: 'Odprtje je brezplačno. Če pobirate samo gotovino, ga ne potrebujete in sistem vseeno vodi vse.',
    },
    {
      title: 'Uvajanje je pogovor, ne tečaj',
      body: 'V enem popoldnevu lahko nastavite celoten sistem in pričnete z uporabo.',
    },
    /*
      Two recurring fees now, and the honest answer differs between them. The
      subscription simply stops. Maintenance includes hosting, so stopping it
      means the site moves — which is a real consequence and belongs here, in the
      section a reader opens looking for the catch, rather than being discovered
      later. The guarantee already promises the files and the domain are theirs;
      this says the same thing where it is being doubted.
    */
    {
      title: 'Brez vezave',
      body: 'Naročnina in vzdrževanje sta mesečna. Če se ne obnese, ju ustavite. Stran, besedila in domena ostanejo vaši — ker vzdrževanje vključuje gostovanje, jo ob prekinitvi predamo vam ali vašemu novemu gostitelju.',
    },
  ],
} as const

/**
 * The four names.
 *
 * ## Why the two kinds are labelled
 *
 * Two of the four build the thing and two are consulted about it, and the
 * difference is the reader's to know: an operator being asked for a season's
 * bookings wants to see whose hands are actually on the software, and a brand
 * designer listed beside a developer with no label reads as a quarter of the
 * budget rather than as an advisor. The labels use `label-mono` because on a
 * four-across row that is exactly what they are — column headings — and the
 * role line under each name drops to `type-caption` so that one card does not
 * carry two lines of tracked-out capitals saying different kinds of thing.
 */
export const team = {
  heading: 'Ekipa in sodelavci',
  lead: 'Za projektom stoji ekipa strokovnjakov z različnih področij. Razvoj, uporabniška izkušnja, oblikovanje in marketing niso ločeni svetovi. Zato jih pri delu povezujemo, da lahko vsak problem pogledamo iz več zornih kotov in poiščemo najboljšo rešitev. Vsak član ekipe prevzema odgovornost za svoje področje, skupaj pa skrbimo, da je končni rezultat izveden po najvišjih standardih.',
  /** Column headings over the cards; see the note above. */
  buildLabel: 'Izvedba',
  adviseLabel: 'Svetovanje',
  /** Overridden per person by `TeamMember.websiteLabel` where the link is not a portfolio. */
  websiteLabel: 'Njegovo delo',
} as const

export const close = {
  heading: 'Naslednji korak',
  lead: 'Najhitrejša pot naprej je kratek sestanek: sistem pokažemo v živo, na vaših izletih in vaših cenah.',
  emailCta: 'Pišite nam',
  callCta: 'Potrdite in pokličite',
  mailSubject: 'Ponudba — Ladjica Emona in Emonca',
} as const

export const footer = {
  preparedBy: 'Ponudbo pripravil',
} as const

/*
  The unlock screen.

  It is the first thing the recipient reads, and it is read by somebody who has
  been handed a link and does not yet know what is behind it. So it says what
  the document is and why it is shut before it asks for anything — a bare
  password box on a white page is indistinguishable from a page that is broken.

  The heading does not name the business. The tab already does, and a locked
  door that announces who lives behind it to anybody who knocks is a strange
  kind of lock.

  The line at the foot is not filler. The one failure this screen actually has
  is a reader who no longer has the password, and it is the only screen on which
  they cannot reach the e-mail address at the bottom of the offer.
*/
export const gate = {
  eyebrow: 'Zasebna ponudba',
  heading: 'Ta ponudba je zaklenjena',
  lead: 'Dokument navaja cene in je namenjen samo prejemniku. Vpišite geslo, ki ste ga prejeli skupaj s povezavo.',
  label: 'Geslo',
  submit: 'Odprite ponudbo',
  error: 'Geslo ni pravilno. Preverite velike in male črke ter poskusite znova.',
  help: 'Gesla nimate pri roki? Pišite nam na',
} as const
