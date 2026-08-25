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
 * graphic (see `moneyFlow`, `route`) or it belongs in `warranty`.
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
  preceded by two buttons. The cards are the buttons now, and a label announcing
  three things directly above three things is a caption on a photograph of
  itself. So the shape of the offer moved up into the one paragraph the hero
  has, where it arrives as a sentence rather than as a heading — and the reader
  meets the structure before they meet the controls for it.
*/
export const hero = {
  eyebrow: 'Ponudba',
  heading: 'Modernizacija in optimizacija sistema za upravljanje rezervacij izletov z ladjico',
  lead: 'Predstavljamo ponudbo, sestavljeno iz 3 delov: **sistem za rezervacije in plačila**, nova **stran za tuje turiste** in **preoblikovanje obstoječe strani** za potrebe domačih gostov ter poslovnih partnerjev. Ponudba omogoča poljuben obseg izvedbe in dodatne popuste, glede na dogovorjeni obseg.',
  /** The card's own link, under the summary line. */
  cardCta: 'Podrobno',
  cardIn: 'V ponudbi',
  cardOut: 'Ni v ponudbi',
  /** Spoken by the circle control, which is otherwise just a shape. */
  cardAdd: 'Dodaj v ponudbo',
  cardRemove: 'Odstrani iz ponudbe',
} as const

/**
 * The offer in three claims, for the reader who never gets past the first
 * screenful — the partner, the accountant, whoever actually signs.
 *
 * ## Why all three are about money and not about software
 *
 * The reader this section is written for signs invoices; they do not install
 * anything, and “two lines of code” is an answer to a question they have not
 * asked. So each claim is a sentence about the takings: what stays whole, what
 * is being lost every night, and who never arrives to pay in the first place.
 * The mechanics — the snippet, the afternoon of setup, the monthly notice
 * period — keep their place further down, in `objections`, where a reader who
 * has already decided they want this goes looking for the catch.
 *
 * ## Why these are not numbered
 *
 * Numerals on this page mean one thing: *which part of the offer*. `01`, `02`
 * and `03` appear on the hero cards, on the section headers and on the rows of
 * the summary, and they always point at the same three
 * things. Numbering anything else — three claims, four steps, six objections —
 * would spend that meaning on decoration and leave the reader working out, each
 * time, which kind of `02` they are looking at.
 */
export const takeaways = {
  eyebrow: 'Motivacija',
  heading: 'Zakaj izboljšati sistem',
  items: [
    {
      icon: 'search',
      title: 'Turisti vas lažje najdejo',
      body: 'Tuji turist v iskalnik vpiše **“Ljubljana boat tour”**, ker želi enkratno doživetje na Ljubljanici. Nova stran govori samo o rednih plovbah, v njegovem jeziku, z rezervacijo na prvem zaslonu. Ne osredotoča se na piknike in zasebne najeme.',
    },
    {
      icon: 'moon',
      title: 'Prodajate tudi takrat, ko ne delate',
      body: 'Turist, ki si želi rezervacijo opraviti izven uradnih ur, ali iz tujine, danes izgubite. V sistem lahko še vedno ročno vnesete telefonske rezervacije, a sistem sprejema tudi tiste, ki pridejo ob polnoči.',
    },
    {
      icon: 'banknote',
      title: 'Od vstopnice ne vzamemo nič',
      body: 'Turist, ki plača s kartico, plača na **vaš** račun. Edini odbitek je bančna provizija, ki gre banki, mi ne vzamemo ne odstotka ne fiksnega zneska nakupa vstopnice.',
    },
  ] satisfies FeatureItem[],
} as const

export const diagnosis = {
  eyebrow: 'Stanje',
  heading: 'Kaj vidimo od zunaj',
  lead: 'Ko se osredotočamo na posel, včasih spregledamo malenkosti, ki bi nas v trenutku ločile od konkurence.',
  groups: [
    {
      title: 'Kar vidi gost',
      items: [
        {
          title: 'Ime, ki ga nihče ne išče',
          body: 'Tuji turist vtipka **“Ljubljana boat tour”**. Ne vtipka “Emona” in ne vtipka “ladjica”.',
        },
        {
          title: 'Dve ponudbi na eni strani',
          body: 'Dnevni izlet za turista in zasebni piknik za domačega gosta sta dva posla. Ena stran za oboje prepriča polovico obeh.',
        },
        {
          title: 'Preveč korakov do vkrcanja',
          body: 'Turist, ki mora poklicati, da izve, ali je še prostor, večinoma ne pokliče. Pogleda naslednji zadetek na spletu.',
        },
      ],
    },
    {
      title: 'Kar se dogaja v ozadju',
      items: [
        {
          title: 'Zadnji dve mesti, prodani dvakrat',
          body: 'Ena oseba prodaja na lokaciji, ena po telefonu. Če se ne uskladita sproti, se zgodi, da se proda preveč ali pa premalo mest.',
        },
        {
          title: 'Rezervacija ob 23. uri je izgubljena',
          body: 'Če mora za vsako rezervacijo nekdo dvigniti telefon, se prodaja konča takrat, ko greste spat.',
        },
        {
          title: 'Do vkrcanja nihče ne ve prave številke',
          body: 'Vozni red hranite v preglednici, rezervacije v zvezku, denar v skrinjici.',
        },
      ],
    },
  ],
} as const

export const proposal = {
  eyebrow: 'Predlog',
  heading: 'Naša rešitev je sestavljena iz treh delov',
  lead: 'Pripravili smo modularno ponudbo, ki jo lahko prilagodite svojim potrebam. Vsak del je podrobno opisan spodaj, vi pa izberete, kaj želite vključiti v svojo ponudbo. Skupna cena in popusti se sproti posodabljajo glede na vašo izbiro.',
} as const

type PartCopy = {
  /** Sits next to the part numeral: `01 — MESEČNA NAROČNINA`. */
  kicker: string
  heading: string
  lead: string
  /**
   * Features, grouped. The group titles are where the operator's work actually
   * happens — the website, the office, the jetty — rather than the software's
   * own module names, which is what turns a list of thirty capabilities into
   * three places the reader can already picture.
   */
  /**
   * `id` keys the group to its exhibit in `page.tsx`. It is not printed: the
   * screenshot belongs to one of the three places the operator's day happens,
   * and a figure of the jetty sitting under the office group is worse than no
   * figure at all.
   */
  groups: { id: string; title: string; items: FeatureItem[] }[]
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
        title: 'Na vaši strani',
        items: [
          {
            icon: 'moon',
            title: 'Rezervacije tudi ob polnoči',
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
        title: 'V pisarni',
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
            body: 'Kdo je vkrcan, kod mora plačati ob prihodu in kateri odhodi v prihodnjem tednu ne bodo polni.',
          },
        ],
      },
      {
        id: 'jetty',
        title: 'Na pomolu',
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
    kicker: 'Landing page za tujega gosta',
    heading: 'Stran, namenjena tujim gostom',
    lead: 'Nova stran (t.i. landing page) na svoji domeni, namenjena za turista, ki je v Ljubljani dva dni in išče, kaj bi počel danes popoldne.',
    groups: [
      {
        id: 'contents',
        title: 'Kaj je na njej',
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
          /*
            Where the reader first meets the monthly maintenance fee. Without a
            line here it appears for the first time as a number in the totals
            panel, attached to a site they have just been told is theirs — which
            is the point at which a recurring charge reads as a catch.
          */
          {
            icon: 'code',
            title: 'Za stranjo nekdo stoji',
            body: 'Gostovanje, popravki in potrebne posodobitve tečejo naprej v **mesečnem vzdrževanju**. Stran ni enkraten izdelek, ki nato leta sameva.',
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
    lead: 'Prva dva modula ponudbe delujeta neodvisno in sta namenjena tujim turistom. Zasebni najem s pogostitvijo je vaša največja posamična prodaja, gost zanj pride prav na ljubljanica.eu, ki bo ob novi strani **izpadla starejša**, kot je. Če obe strani nastaneta skupaj, plačate skupno ceno vzdrževanja.',
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
 * bank fee in both columns, and lets the difference be the only thing that
 * differs.
 *
 * ## Why the bank fee appears on our side too
 *
 * Because it does. Showing it is what makes the zero next to `Naš delež`
 * readable as a fact rather than as a sales line — a reader who finds the one
 * deduction we could have hidden, stated plainly, has less reason to go looking
 * for others. It is also the same figure in both columns, so drawing it twice
 * makes the comparison honest without costing the comparison anything.
 *
 * ## Why the season figure comes first
 *
 * Ninety-two cents is a number nobody flinches at, and a reader who meets it
 * first has already decided the whole question is small by the time the season
 * total arrives. So the order is inverted: the consequence leads — thousands of
 * euros a season, which is the number that actually decides this — and the
 * ticket breakdown follows as the working behind it, for the reader who wants to
 * see where the figure came from before believing it.
 *
 * It is also the one claim a percentage cannot answer, because it grows exactly
 * as fast as the business does. A good season makes it worse.
 *
 * Rates are stated as a typical price list rather than as any one vendor's,
 * because vendors change theirs and a proposal that quotes a competitor's
 * pricing ages badly the week they discount it.
 */
export const moneyFlow = {
  label: 'Kam gre denar',
  heading: 'Koliko plačam, če vstopnica stane 12 €?',
  lead: 'Alpaca Booking računa le mesečno naročnino. Rezervacijske platforme si od vsake vzamejo fiksen znesek in odstotek. Spodaj je prikazana primerjava med Alpaca Booking in konkurenčno platformo za rezervacije.',
  /** The fare the whole graphic is drawn from. PLACEHOLDER — a real ticket price. */
  ticket: 12,
  paysLabel: 'Gost plača',
  keptLabel: 'Ostane vam',
  /**
   * The card fee, identical in both columns. Stripe's European consumer rate on
   * a €12 fare: 1.5 % + 0.25 €. Non-European cards cost more; the footnote says
   * so rather than the rail, because the figure is the same on both sides and
   * changing it changes neither.
   */
  bankLabel: 'Banka za kartico',
  bankFee: 0.43,
  ours: {
    title: 'Alpaca Booking',
    cutLabel: 'Naš delež',
    cut: 0,
    note: 'Bančno provizijo plačate banki neposredno, nam pa mesečni znesek — enak pri tisoč vstopnicah in pri desetih tisoč.',
  },
  theirs: {
    title: 'Prek rezervacijske platforme',
    cutLabel: 'Delež platforme',
    cut: 0.92,
    /** The cut as a share of the fare, which is the figure that lands. */
    cutShare: '7,7 % vstopnice',
    note: 'Tipičen cenik je 0,50 € plus 3,5 % od vsake prodane vstopnice — in to poleg mesečne naročnine.',
  },
  season: {
    label: 'Čez sezono',
    /** PLACEHOLDER — tickets sold in a season. The multiplier, so it is marked. */
    tickets: 6000,
    lead: 'Primerjava provizije pri prodaji 6.000 vstopnic.',
    oursLabel: 'Alpaca Booking',
    theirsLabel: 'Platforme za rezervacije',
    note: 'Poleg tega platforme zaračunajo še mesečno naročnino.',
  },
  /** Heads the two rails, which are now the working behind the season figure. */
  breakdown: {
    label: 'Od kod ta razlika',
    lead: 'Ena vstopnica, razdeljena na oba načina.',
  },
  footnote:
    'Bančna provizija je v obeh stolpcih ista in gre banki, ne nam: 1,5 % + 0,25 € za evropske kartice in 3,15 % + 0,25 € za ostale — pri 12-evrski vstopnici 0,43 € oziroma 0,63 €. Deleži platform se razlikujejo po ponudniku in pogodbi; 0,92 € je izračun po tipičnem ceniku. Fiksno je le to, da mi svojega deleža nimamo.',
} as const

/**
 * The guest's path, for the section that argues for a new website.
 *
 * The only genuinely ordered thing on this page, which is why it is the only
 * thing drawn as a sequence — and why it still carries no numerals. The numbers
 * belong to the parts of the offer; a rail with four stops reads as an order
 * without needing to be counted.
 */
export const route = {
  label: 'Pot obiskovalca na vaši spletni strani',
  heading: 'Od iskalnika do vkrcanja',
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
    English on purpose, and the lead says so before the reader wonders. Two
    languages kept separate is a claim in the feature list above; the three
    captures on this page happen to prove it between them, which is worth more
    than the sentence.
  */
  widget: {
    label: 'Obrazec za rezervacijo',
    heading: 'Kar vidi gost na vaši strani',
    lead: 'Rezervacijski obrazec sistema Alpaca Booking:',
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
    caption:
      'Obrazec prevzame barve, pisavo in obliko strani, na katero je vgrajen.',
  },

  dashboard: {
    label: 'Nadzorna plošča',
    heading: 'Kaj vidite, ko zjutraj odprete sistem',
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
    label: 'Prijava na pomolu',
    heading: 'Seznam potnikov ob vkrcanju',
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
    caption:
      'Posnetek zaslona, ki ga vidi posadka pred vkrcanjem.',
  },

  /*
    The only figure on the page that draws something not yet built, and the
    only one whose mount is dashed. The distinction the offer has to keep
    hardest is between what exists and what we will make, and a sketch framed
    exactly like the three captures above it quietly erases that.
  */
  landing: {
    label: 'Skica postavitve',
    heading: 'Kaj je na prvem zaslonu nove strani',
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

export const objections = {
  eyebrow: 'Preden vprašate',
  heading: 'Pogosta vprašanja in pomisleki',
  items: [
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

export const summary = {
  eyebrow: 'Vaša izbira',
  heading: 'Ponudba, ki jo sestavite sami',
  lead: 'Zadnja priložnost, da kaj dodate ali odstranite. Vsota se preračuna sproti, izbira pa ostane v povezavi — pošljite jo naprej in prejemnik vidi točno to, kar vidite vi.',
  emptyHeading: 'Trenutno niste izbrali ničesar',
  emptyBody:
    'Obkljukajte dele spodaj ali na karticah na vrhu strani — ali si spodaj naložite priporočeno kombinacijo.',
  restore: 'Nastavi priporočeno',
  oneOffLabel: 'Enkratno',
  monthlyLabel: 'Mesečno',
  /*
    "V prvem letu", because one of the two savings in this offer is recurring
    and a recurring saving has no total until a period is named. The figure is
    exactly the line above it subtracted from what the same year would list at,
    which is a claim a reader can check — "Prihranek" alone was a number whose
    horizon they had to guess.
  */
  savingsLabel: 'Prihranek v prvem letu',
  /** The half-price setup, which no package grants and so no package can name. */
  partDiscountLabel: 'Popust na postavitev',
  beforeDiscountLabel: 'Pred popustom',
  vatNote: 'Vsi zneski so brez DDV.',
  shareLabel: 'Kopiraj povezavo na to izbiro',
  shareCopied: 'Povezava kopirana',
  inOffer: 'V ponudbi',
  addToOffer: 'Dodaj v ponudbo',
  removeFromOffer: 'Odstrani iz ponudbe',
  /** Heads the note at the foot of a part the reader has left out. */
  absenceLabel: 'Ni v ponudbi',
} as const

/**
 * The guarantee, and the edges of the offer.
 *
 * ## Why the "not included" column is as long as the other one
 *
 * The source brief keeps a list of things the software does not do — refunds
 * from the console, guest self-service, reminders, exports, OTA sync — and warns
 * that a page implying any of them creates a bad first meeting. This section is
 * where that list stops being a constraint and starts being useful: an operator
 * who has been sold software before is looking for what the offer quietly leaves
 * out, and finding it written down, unprompted, is worth more than another
 * paragraph of reassurance.
 */
export const warranty = {
  eyebrow: 'Kaj obljubimo (in česa ne)',
  heading: 'Garancija in obseg',
  guaranteeLabel: 'Garancija',
  includedLabel: 'Vključeno v ceno',
  excludedLabel: 'Ni vključeno',
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
  eyebrow: 'Kdo bo delal na tem',
  heading: 'Ekipa in sodelavci',
  lead: 'Za projektom stoji ekipa strokovnjakov z različnih področij. Razvoj, uporabniška izkušnja, oblikovanje in marketing niso ločeni svetovi. Zato jih pri delu povezujemo, da lahko vsak problem pogledamo iz več zornih kotov in poiščemo najboljšo rešitev. Vsak član ekipe prevzema odgovornost za svoje področje, skupaj pa skrbimo, da je končni rezultat izveden po najvišjih standardih.',
  /** Column headings over the cards; see the note above. */
  buildLabel: 'Izvedba',
  adviseLabel: 'Svetovanje',
  /** Overridden per person by `TeamMember.websiteLabel` where the link is not a portfolio. */
  websiteLabel: 'Njegovo delo',
} as const

export const close = {
  eyebrow: 'Če se vam zdi smiselno, se slišimo',
  heading: 'Naslednji korak',
  lead: 'Najhitrejša pot naprej je kratek sestanek: sistem pokažemo v živo, na vaših izletih in vaših cenah.',
  emailCta: 'Pošljite to izbiro po e-pošti',
  callCta: 'Pokličite',
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
