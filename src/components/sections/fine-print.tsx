import { CheckIcon, MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { fineprint } from '@/content/copy'
import { guarantee } from '@/content/offer'
import { Copy } from '@/components/ui/copy'

/**
 * The terms of the offer, as four clauses of one table, shut until asked for.
 *
 * ## What this replaces
 *
 * `Garancija in obseg` and `Pogosta vprašanja in pomisleki`, which ran back to
 * back as two full bands and were the same conversation held twice — see the
 * note over `fineprint` in `copy.ts` for why the copy is now one export. This
 * file is the other half of that: one grammar for all four registers, so they
 * read as clauses of a single answer rather than as a section and its appendix.
 *
 * ## Why it is a drawer inside the price section
 *
 * Because of who opens it and when. The scope, the exclusions and the guarantee
 * are read by somebody checking a figure they have just seen — nobody arrives
 * at *what is not included* except through *what does it cost* — so the drawer
 * belongs under the panel that produced the figure, not two bands further on
 * where it read as a fresh topic.
 *
 * Shut by default, and that is a real trade rather than a tidy-up. Twenty-six
 * lines of scope open on the page were the strongest evidence on it that the
 * offer had been thought through; closed, they are evidence only to a reader
 * who asks. What decides it is that the same reader is being asked to compare
 * three prices directly above, and a page that answers a question nobody has
 * asked yet, at that length, in that position, is answering it instead of the
 * one being asked.
 *
 * Two consequences worth knowing rather than discovering. A shut drawer does
 * not print, so a reader who prints the offer prints the prices and not the
 * scope. And a shut drawer is a click, which is why the line under the heading
 * names all four clauses: `<summary>` is the only part of this a reader is
 * guaranteed to see.
 *
 * It is `<details>` and not state, so it costs no JavaScript, works before
 * hydration and is opened by the keyboard for free.
 *
 * ## The grammar inside
 *
 * A ruled table with the label in the left gutter and the answer in the right
 * column. Every clause is built the same way, including the guarantee — which
 * used to be a bordered panel, and a panel is exactly the device that says
 * *this part is the one we want you to read*. Sitting in the same gutter as the
 * exclusions it is a term of the offer like the others.
 *
 * The gutter is the page's index voice doing the job it was made for: on a
 * ticket or a timetable, tracked mono capitals label a column, and here they
 * label a row of one. It is set in `{ink}` rather than the `{faint}` the old
 * column headings used, because these four labels are the only way through a
 * long table.
 */
export function FinePrint() {
  return (
    <details className="group border-hairline bg-paper mt-4 rounded-xl border">
      {/*
        `list-none` and the WebKit rule together drop the browser's own
        triangle, which points the wrong way, sits on the text baseline and is
        the one element in this block nothing else on the page could have drawn.
      */}
      <summary className="flex cursor-pointer list-none items-start gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
        <span className="flex-1">
          <h3 className="type-subhead text-ink">{fineprint.heading}</h3>
          <p className="type-body-sm text-mute mt-1">{fineprint.lead}</p>
        </span>

        {/*
          A plus that becomes a minus, rather than a chevron that turns over.
          Both are conventions, and this is the one that says what the control
          does to the *content* rather than which way the drawer swings: there
          is more of this document than you are being shown, and this adds it.

          Set at the heading's own size and in `{ink}`, because it is half of
          the heading — the line and the mark together are what a reader reads
          as *this opens*. Grey and small, it was a decoration beside a title
          that then had to be guessed at as clickable.

          Two icons swapped by `group-open` rather than one rotated: a plus
          turned 45° is a cross, and a cross means discard.
        */}
        <PlusIcon
          className="text-ink mt-0.5 size-7 shrink-0 group-open:hidden"
          strokeWidth={1.75}
          aria-hidden
        />
        <MinusIcon
          className="text-ink mt-0.5 hidden size-7 shrink-0 group-open:block"
          strokeWidth={1.75}
          aria-hidden
        />
      </summary>

      <div className="border-hairline divide-hairline divide-y border-t px-5 sm:px-6">
        {/*
          The guarantee opens the table, and the term is part of its label
          rather than a line under it — a guarantee whose length is not on the
          same line as its name is a guarantee of unstated length.

          It is first because it is the one clause here that is a promise rather
          than a boundary, and because of what that does to the three boundaries
          under it: a reader who has been told they can stop reads a list of
          exclusions as information, and a reader who has not reads it as a
          list of things they will be stuck with. It is also the shortest, so
          opening the drawer produces a paragraph rather than a wall of ticks.
        */}
        <Clause label={`${fineprint.guaranteeLabel} · ${guarantee.days} dni`}>
          <p className="type-subtitle text-ink max-w-3xl">{guarantee.headline}</p>
          <p className="type-body-sm text-mute mt-3 max-w-3xl">{guarantee.body}</p>
          <p className="type-caption text-faint mt-3">{guarantee.supportNote}</p>
        </Clause>

        <Clause label={fineprint.includedLabel}>
          <Ledger items={fineprint.included} mark="check" />
        </Clause>

        <Clause label={fineprint.excludedLabel}>
          <Ledger items={fineprint.excluded} mark="cross" />
        </Clause>

        <Clause label={fineprint.requiresLabel}>
          <ul className="grid gap-x-10 gap-y-6 lg:grid-cols-2">
            {fineprint.requires.map((item) => (
              <li key={item.title}>
                <h5 className="type-item text-ink">{item.title}</h5>
                <Copy text={item.body} className="type-body-sm text-mute mt-1.5" />
              </li>
            ))}
          </ul>
        </Clause>
      </div>
    </details>
  )
}

/**
 * One row: what this clause is called, and the answer.
 *
 * The label is an `h4` — under the drawer's own `h3`, under the price
 * section's `h2` — so the four clauses are a real level of the document's
 * outline, and a reader listing the headings of this page gets the same table
 * of contents the gutter draws.
 */
function Clause({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-x-10 gap-y-4 py-7 md:grid-cols-[10.5rem_minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
      {/* Two points of padding once the gutter is beside the answer rather
          than over it: mono capitals sit higher in their line box than the
          15px body text opposite, and the two first lines have to start on the
          same optical line or the table looks sheared. */}
      <h4 className="label-mono text-ink md:pt-0.5">{label}</h4>

      <div>{children}</div>
    </div>
  )
}

/**
 * The two lists, which differ only in their mark.
 *
 * ## Why only one mark is coloured
 *
 * The tick is green — `{savings}`, the page's second accent, which everywhere
 * else marks money the reader is not spending and here marks work they are not
 * paying extra for. The cross stays a grey outline. Colouring both would make
 * the clause a two-tone chart and invite the reader to weigh one list against
 * the other, which is the opposite of the point — these are two plain lists,
 * and the second one is not a warning. Red is deliberately not in either: on
 * this page it reports what is *in the offer*, and a red tick beside a line of
 * scope would be reporting something the reader can switch.
 *
 * ## Why the marks are decorative
 *
 * Each repeats what the clause label already says, so both are `aria-hidden`
 * and the label carries the meaning. A screen reader gets "Vključeno v ceno"
 * followed by a list, rather than the word "check" nine times.
 */
function Ledger({ items, mark }: { items: readonly string[]; mark: 'check' | 'cross' }) {
  return (
    /*
      Columns, not a two-column grid. A grid aligns the two halves row by row,
      so one line that wraps opens a gap opposite it in the other column and the
      list acquires a ragged vertical rhythm it has no reason to have — these
      items are not pairs and nothing is being compared across the gutter. Flowed
      as columns they simply run down one side and continue on the other, evenly
      spaced, which is also the order somebody reads a list in.
    */
    <ul className="gap-x-10 lg:columns-2">
      {items.map((item) => (
        <li key={item} className="mb-3 flex break-inside-avoid gap-3">
          {mark === 'check' ? (
            <span
              className="bg-savings-wash text-savings mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm"
              aria-hidden
            >
              <CheckIcon className="size-3" strokeWidth={2.5} />
            </span>
          ) : (
            <span
              className="border-hairline-strong text-mute mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border"
              aria-hidden
            >
              <XIcon className="size-2.5" strokeWidth={2.5} />
            </span>
          )}

          <span className={mark === 'check' ? 'type-body-sm text-body' : 'type-body-sm text-mute'}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  )
}
