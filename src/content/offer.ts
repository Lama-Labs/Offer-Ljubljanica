/**
 * Every commercial fact the proposal states, in one file.
 *
 * ## Why it is separated from the copy
 *
 * The prose on this page argues; this file is what the argument is *about*. The
 * two change on completely different schedules — the wording gets edited once
 * while writing, the numbers get edited the morning the offer goes out, often
 * by somebody who is not going to open a component. Keeping them apart means a
 * price can be changed without reading a line of JSX, and means there is one
 * place to check before sending rather than nine.
 *
 * ## The prices below are decided
 *
 * `offerParts`, `bundleRules` and `terms.hourlyRate` carry the real figures.
 * What is still marked `PLACEHOLDER` is the guarantee — a commercial commitment
 * that nothing in the software makes true, and the most expensive thing on this
 * page to get wrong. Read it before sending.
 */

import type { IconKey } from '@/content/icons'

/** The three things being offered. Order is the order they appear on the page. */
export type OfferPartId = 'booking' | 'landing' | 'redesign'

export type OfferPart = {
  id: OfferPartId
  /**
   * The part's index, shown as `01`, `02`, `03` wherever the part appears —
   * the hero cards, the section headers, the rows of the
   * summary. It is the only thing on the page allowed to be numbered, which is
   * what makes a row in the summary and a section in the argument recognisable
   * as the same object.
   */
  number: number
  name: string
  /** The mark that travels with the part, next to its numeral. */
  icon: IconKey
  /** One line, used in the running summary where there is no room for more. */
  summary: string
  /** Recurring fee in EUR. `null` when the part is one-off work. */
  monthly: number | null
  /**
   * What the recurring fee is for, printed after it: `naročnina`, `vzdrževanje`.
   *
   * There are two recurring fees in this offer and they are different kinds of
   * thing — one rents software, the other keeps a website alive. Two rows in the
   * summary both reading `40 € / mes.` with nothing to tell them apart is the
   * kind of ambiguity a reader resolves by assuming they are being charged twice
   * for the same service.
   */
  monthlyLabel: string | null
  /** One-off fee in EUR, as actually charged. `null` when the part is purely a subscription. */
  oneOff: number | null
  /**
   * What the one-off would list at, when this offer is charging less than that.
   * `null` when there is no concession and the list price is the price.
   *
   * A discount nobody can see is a discount nobody was given. The summary row
   * prints this struck through beside what is actually charged, so the
   * concession is visible on the line it applies to rather than only as an
   * unexplained gap in the totals.
   *
   * Unlike a bundle rule, this does not depend on what else is selected: it is a
   * decision about this client, not a reward for buying more.
   */
  listOneOff: number | null
  /**
   * What the one-off fee buys, printed after it: `postavitev`, `izdelava`.
   *
   * Every part now carries both a one-off and a monthly figure, so the second
   * number in a row can no longer be identified by being the only one — and
   * calling a €1.000 website build a "setup fee" is a small inaccuracy that
   * makes the larger number look like padding.
   */
  oneOffLabel: string
  /**
   * Which of the two fees is the headline, and which is the footnote.
   *
   * Every part carries both now, and they are not equally important on every
   * row: a booking system is bought by the month and its setup is a one-time
   * detail; a website is bought for what it costs to build and its maintenance
   * is what follows. Printing both at the same weight, or always leading with
   * the recurring one, would put `40 €` at the top of a €1.000 redesign and
   * quietly misrepresent what the reader is being asked to buy.
   *
   * A part with only one fee leads with it whatever this says.
   */
  leadWith: 'monthly' | 'oneOff'
  /**
   * Whether declining it leaves a coherent offer. The redesign does; the other
   * two are the offer. This drives how the control is worded, not whether it
   * can be switched off — everything here can be switched off.
   */
  optional: boolean
  /** Pre-selected on first load, and badged. */
  recommended: boolean
}

export const offerParts: readonly OfferPart[] = [
  {
    id: 'booking',
    number: 1,
    name: 'Alpaca Booking',
    icon: 'ticket',
    summary: 'Mesečna naročnina na rezervacijski sistem',
    monthly: 75,
    monthlyLabel: 'naročnina',
    oneOff: 150,
    /* Half the list price, unconditionally. See `listOneOff` on the type. */
    listOneOff: 300,
    oneOffLabel: 'postavitev',
    leadWith: 'monthly',
    optional: false,
    recommended: true,
  },
  {
    id: 'landing',
    number: 2,
    name: 'ljubljanicatours.com',
    icon: 'globe',
    summary: 'Nova stran za tuje turiste z rezervacijo neposredno na strani',
    monthly: 40,
    monthlyLabel: 'vzdrževanje',
    oneOff: 500,
    listOneOff: null,
    oneOffLabel: 'izdelava',
    leadWith: 'oneOff',
    optional: false,
    recommended: true,
  },
  {
    id: 'redesign',
    number: 3,
    name: 'Prenova ljubljanica.eu',
    icon: 'brush',
    summary: 'Prenova obstoječe strani za domače goste in piknike',
    /*
      The second site's maintenance is charged at the same rate as the first —
      and then the `splet` rule below takes it straight back off when both are
      taken. Writing it as 40 here rather than as 0 is what makes the shared fee
      a visible concession instead of a silent asymmetry between two rows that
      look alike.
    */
    monthly: 40,
    monthlyLabel: 'vzdrževanje',
    oneOff: 1000,
    listOneOff: null,
    oneOffLabel: 'izdelava',
    leadWith: 'oneOff',
    optional: true,
    recommended: false,
  },
] as const

/**
 * The discount rules, and what satisfying one is worth.
 *
 * ## Three of them: two pairs and the whole
 *
 * `zagon` is the two parts the offer is actually pushing for; `splet` is the two
 * websites, which share one maintenance contract; `celota` is everything. The
 * first two overlap on `02` and the third contains both.
 *
 * They stack rather than replace each other: taking all three matches all three
 * rules and gets all three savings. Which is also the constraint on adding a
 * fourth — every rule here has to be worth granting *on top of* the ones it
 * overlaps, or it is a discount invented to make a total look smaller.
 *
 * ## Why the page never names them
 *
 * It used to. Each rule was drawn as a bracket under the hero cards and named in
 * the totals panel, so the reader met three products — `Paket Zagon`, `Paket
 * Splet`, `Paket Celota` — layered over the three they were actually choosing
 * between. Two vocabularies for one offer is one more than a reader will hold,
 * and the packages were the invented half.
 *
 * So the rules are arithmetic now and nothing else. They move the figures on the
 * rows and the single `Popust` line in the panel; no part of the page says a
 * package exists. `label` and `reason` below are kept for whoever edits this
 * file — neither is rendered anywhere.
 *
 * ## Why a rule table rather than tier prices
 *
 * The page lets the reader build their own combination, so a fixed set of
 * tiers would either forbid combinations they are allowed to have or list
 * prices for combinations nobody will pick. A rule is checked against whatever
 * they selected, and every rule that matches applies — so the saving grows as
 * the offer does, which is the whole mechanism by which this page argues for
 * taking the first two parts together.
 */
export type BundleRule = {
  id: string
  /** Every part that must be selected for the rule to apply. */
  requires: readonly OfferPartId[]
  /** Names the rule for whoever edits this file. Not rendered. */
  label: string
  /**
   * Whose price the discount comes off.
   *
   * ## Why a rule names a part
   *
   * A discount has to land somewhere the reader can see it. Held only against
   * the total it is a single figure beside three rows whose prices never move,
   * and a reader ticking the second box has no reason to believe the first one
   * got cheaper. Naming the part lets the row show it: `500 €` struck, `400 €`
   * charged, on the line that changed.
   *
   * This matters more now that the panel prints one `Popust` and no longer
   * itemises where it came from: the rows are the only place a discount is
   * attributable at all.
   *
   * **Must be one of `requires`.** A rule can only apply when all of its parts
   * are selected, so pointing this at a part outside that set would attribute a
   * live discount to a row that is switched off, where nothing would draw it.
   */
  appliesTo: OfferPartId
  /** Taken off that part's one-off fee, in EUR. */
  oneOffDiscount: number
  /**
   * Taken off the recurring total, in EUR per month, for as long as the offer
   * runs — not a number of free months but a permanently smaller bill.
   *
   * It exists because one of the two savings in this offer is of that kind: two
   * websites are maintained under one contract, so the second one's fee is never
   * charged rather than deferred.
   */
  monthlyDiscount: number
  /** Why this discount exists. Kept as a note to the price file, not rendered. */
  reason: string
}

export const bundleRules: readonly BundleRule[] = [
  {
    id: 'zagon',
    requires: ['booking', 'landing'],
    label: 'Paket Zagon',
    /* The site is what gets quicker to build; the booking system is unchanged
       by being sold alongside it. */
    appliesTo: 'landing',
    oneOffDiscount: 100,
    monthlyDiscount: 0,
    reason:
      'Rezervacijski obrazec je del strani in ne naknadna vgradnja: ko oboje nastane hkrati, je izdelava strani krajša, zato je tudi cenejša.',
  },
  {
    id: 'splet',
    requires: ['landing', 'redesign'],
    label: 'Paket Splet',
    /* The second site's maintenance is the one absorbed, so the redesign's row
       is where the fee goes to nothing and the landing page keeps charging the
       single contract. Pointing it at `landing` instead would zero the wrong
       row and leave the reader looking at a €1.000 redesign that appears to
       carry an extra fee the site above it does not. */
    appliesTo: 'redesign',
    oneOffDiscount: 0,
    monthlyDiscount: 40,
    reason:
      'Obe strani gostujeta na istem strežniku in ju posodabljamo z istim posegom, zato je vzdrževanje eno samo. Plačate ga za obe skupaj, ne za vsako posebej.',
  },
  /*
    Declared last: it is the rule that contains the other two, and matched
    rules are applied in the order they appear here.
  */
  {
    id: 'celota',
    requires: ['booking', 'landing', 'redesign'],
    label: 'Paket Celota',
    appliesTo: 'redesign',
    oneOffDiscount: 100,
    monthlyDiscount: 0,
    reason:
      'Logotip, barve in pisave postavimo enkrat in veljajo za obe strani, zato je prenova ob novi strani bistveno hitrejša od prve. Kot samostojen projekt čez leto dni tega prihranka ni.',
  },
] as const

/** Who the offer is addressed to. */
export const client = {
  businessName: 'Ladjica Emona in Emonca',
  currentSite: 'ljubljanica.eu',
  /** Free at the time of writing — verify again before this is sent. */
  proposedDomain: 'ljubljanicatours.com',
  /** Round trips per day, in season. Stated by the operator. */
  dailyDepartures: 10,
} as const

/** Who the offer is from. */
export const agency = {
  name: 'Alpaca Labs',
  email: 'info@alpacachat.ai',
  phone: '+386 41 565 515',
} as const

export const terms = {
  /**
   * Which draft of the offer this is.
   *
   * A proposal gets revised — a price moves, a part is dropped — and the old
   * link keeps working, so two people can end up discussing two different
   * documents that look identical. The version is printed in the masthead so
   * that "the one you sent me" is a checkable statement. Bump it whenever any
   * figure or any scope line below changes. A date works here too: the field is
   * a plain string and is printed verbatim.
   */
  version: '1.0',
  /** Slovenian business audience reads a price as net unless told otherwise. */
  pricesIncludeVat: false,
  /**
   * No lock-in is the position the whole offer rests on.
   *
   * Plural since there are two recurring fees. What happens to a hosted site
   * when maintenance stops is a longer sentence than this line has room for, and
   * it is answered where a reader goes looking for the catch — the *Brez vezave*
   * objection and the excluded list.
   */
  commitmentNote: 'Naročnina in vzdrževanje sta mesečna in ju lahko kadar koli prekinete.',
  /**
   * What work outside the maintenance fee costs, in EUR per hour.
   *
   * Maintenance covers hosting, fixes and the updates the site needs to keep
   * working. New pages, new features and redesigns are a different thing, and an
   * offer that leaves the difference unpriced is read as "unspecified, therefore
   * probably a lot".
   */
  hourlyRate: 50,
  /** Printed once, at the close — the moment it is actually being acted on. */
  validityNote: 'Ponudba velja 30 dni od prejema.',
} as const

/**
 * The guarantee.
 *
 * ## Why it lives here and not with the copy
 *
 * The source brief is explicit that availability and support terms are
 * *commercial commitments, not product facts* — nothing in the software makes
 * them true, and whoever signs the offer is the one who has to honour them. So
 * it sits with the prices, in the file that gets reviewed before sending, rather
 * than among the prose where it would read as another sentence to approve.
 *
 * Both figures below are placeholders. A guarantee is the most expensive
 * sentence on the page to get wrong.
 */
export const guarantee = {
  days: 30, // PLACEHOLDER
  /* Names which of the two monthly fees it refunds. With one recurring charge
     "naročnina" was unambiguous; with two it is a question. */
  headline:
    'Če v prvem mesecu ugotovite, da rezervacijski sistem ni za vas, vam naročnino za tisti mesec vrnemo.', // PLACEHOLDER
  body: 'Stran, ki jo do takrat postavimo, ostane vaša: datoteke, besedila in domena so vaši ne glede na to, kaj se zgodi z naročnino. Nič od tega ni vezano na to, da ostanete naša stranka.', // PLACEHOLDER
  /** Answered before it is asked; the brief warns that support terms get invented otherwise. */
  supportNote: 'Podpora poteka po e-pošti in telefonu ob delavnikih.', // PLACEHOLDER
} as const

/**
 * The people on the job.
 *
 * ## Why a person's whole record is one object
 *
 * Everything else on this page splits commercial facts from prose. A person does
 * not split usefully: their name, what they do, where their work lives and the
 * sentence describing it are one record, and separating the link from the bio
 * would mean editing two files to add one collaborator — the reliable way to end
 * up with four names and three biographies.
 *
 * `avatar` is `null` until a real photograph exists. The section renders a
 * monogram in the meantime, which is a deliberate placeholder rather than a
 * broken image, and swapping it is one path: drop the file in `public/team/` and
 * set `avatar: '/team/ime.jpg'`.
 */
export type TeamMember = {
  name: string
  /**
   * Which half of the section they are in: the two who build the thing, and the
   * two who are consulted about it. The distinction is the reader's, not ours —
   * an operator handing over their season wants to know whose hands are
   * actually on it, and a designer listed beside a developer with no label
   * reads as a fifth of the budget rather than as an advisor.
   */
  kind: 'build' | 'advise'
  /** Their expertise, in the reader's terms rather than a job title. */
  role: string
  /** Where their work lives. `null` hides the link rather than rendering a dead one. */
  website: string | null
  /**
   * Overrides `copy.team.websiteLabel` for this one person. Present because
   * three of the four links go to a portfolio and the fourth goes to LinkedIn,
   * and calling a LinkedIn profile "their work" is the kind of small
   * inaccuracy a reader notices right after clicking it.
   */
  websiteLabel?: string
  bio: string
  /**
   * URL path to the portrait, or `null` for the monogram placeholder.
   *
   * `public/` is the web root and is *not* part of the path: the file at
   * `public/team/lan-sovinc.webp` is served at `/team/lan-sovinc.webp`. Writing
   * the folder name into the URL is the one mistake this field invites, and it
   * fails as a broken image rather than as a build error.
   */
  avatar: string | null
}

export const team: readonly TeamMember[] = [
  {
    name: 'Lan Sovinc',
    kind: 'build',
    role: 'Vodenje projekta in razvoj',
    website: 'https://sovinc.com',
    bio: 'Vaša prva in glavna kontaktna oseba. Magister računalništva in informatike, spletne aplikacije gradi celostno. Čeprav tehničen po naravi, ga vedno zanima širši kontesk: kako lahko tehnologija omogoči uporabniku, da doseže svoj cilj v polni meri, enostavno in zanesljivo.',
    avatar: '/team/lan-sovinc.webp',
  },
  {
    name: 'Matej Horvat',
    kind: 'build',
    role: 'Razvoj in rezervacijski sistem',
    website: 'https://matej.horvat.si',
    bio: 'Magister računalništva in informatike z leti izkušenj na obeh straneh aplikacije: od uporabniškega vmesnika za gosta, do strežnika. Natančen do zadnje podrobnosti. Skrbi za pravilno in nemoteno delovanje platforme, da se lahko vi osredotočite na posel.',
    avatar: '/team/matej-horvat.webp',
  },
  {
    name: 'Luka Kopajtič',
    kind: 'advise',
    role: 'Blagovna znamka in oblikovanje',
    website: 'https://design.lukakopajtic.com',
    bio: 'Svetuje pri tem, po čem vas bo gost prepoznal: logotip, barve in pisave, ki potem veljajo za obe strani, za tiskane materiale in za vstopnice. Oblikuje od leta 2015, od 2024 vodi lasten studio, o znamkah pa piše mesečnik za več kot 2.500 bralcev.',
    avatar: '/team/luka-kopajtic.webp',
  },
  {
    name: 'Tilen Tkalec',
    kind: 'advise',
    role: 'Marketing in doseg',
    website: 'https://www.linkedin.com/in/tilentkalec/',
    websiteLabel: 'LinkedIn',
    bio: 'Svetuje pri tem, kako gost sploh pride do strani; kaj turist vtipka v iskalnik, s katerimi besedami in kje se oglaševanje izplača, kje pa ne. Direktor sistema e-Matura, slovenski platformi za pripravo na maturo.',
    avatar: '/team/tilen-tkalec.webp',
  },
] as const
