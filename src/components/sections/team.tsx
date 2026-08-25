import Image from 'next/image'
import { ArrowUpRightIcon } from 'lucide-react'

import { team as teamCopy } from '@/content/copy'
import { team, type TeamMember } from '@/content/offer'
import { Section, SectionHeader } from '@/components/ui/section'

/**
 * Who is actually going to do the work.
 *
 * The operator is being asked to hand over their bookings, which is their
 * season. Four names with faces and links to their own work is a different
 * proposition from "our team" — and the link matters most: it is the one claim
 * on this page the reader can check without asking us anything.
 *
 * ## Why two across rather than four
 *
 * Four across gave each person a column narrow enough that the portrait had to
 * stay a 64px token beside the name. Two across is the same four people in two
 * rows, and it buys the thing the section is for: a face at 112px, large enough
 * to be a person rather than an avatar. It also makes the grouping fall out of
 * the layout — the first row is the two who build it, the second the two who
 * are consulted — so the mono label on each card now reads as the heading of
 * the row it sits in rather than as a tag repeated four times.
 *
 * ## Why the head is centred and the prose is not
 *
 * Portrait, name and role are the plate: symmetrical, centred, the part the
 * reader looks at. The bio is three or four sentences, and centred prose is
 * ragged on both edges — so it stays left-aligned inside a column narrower than
 * the card, centred as a block under the centred head. The card reads as
 * balanced; the paragraph still reads as a paragraph.
 */
const kindLabels: Record<TeamMember['kind'], string> = {
  build: teamCopy.buildLabel,
  advise: teamCopy.adviseLabel,
}

/**
 * Initials for the monogram placeholder.
 *
 * Written to survive the placeholder names it will spend most of its life
 * rendering: `[Ime Priimek]` has to come out as `IP`, not `[P`, so brackets and
 * punctuation are stripped before the first letter of each word is taken.
 * Capped at two, because three letters in a circle stops reading as a monogram.
 */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}]/gu, ''))
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export function Team() {
  return (
    <Section id="ekipa">
      <SectionHeader eyebrow={teamCopy.eyebrow} heading={teamCopy.heading} lead={teamCopy.lead} />

      <ul className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2">
        {team.map((member) => (
          <li key={member.name} className="border-hairline flex flex-col border-t pt-4">
            {/* Stays left, on the rule. It is a heading for the row, and a
                heading that drifts to the middle stops being attached to the
                line it labels. */}
            <p className="label-mono text-faint">{kindLabels[member.kind]}</p>

            <div className="mt-6 flex flex-col items-center text-center">
              {member.avatar ? (
                <Image
                  src={member.avatar}
                  /* The name is read out immediately below, so the portrait adds
                     nothing a screen reader needs to hear twice. */
                  alt=""
                  width={256}
                  height={256}
                  className="size-28 rounded-full object-cover"
                />
              ) : (
                <span
                  className="bg-mist text-ink num-lg flex size-28 items-center justify-center rounded-full"
                  aria-hidden
                >
                  {initials(member.name)}
                </span>
              )}

              <h3 className="type-item text-ink mt-5">{member.name}</h3>
              <p className="type-caption text-faint mt-1">{member.role}</p>
            </div>

            <div className="mx-auto mt-5 flex w-full max-w-[46ch] flex-1 flex-col">
              <p className="type-body-sm text-mute flex-1">{member.bio}</p>

              {member.website ? (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-btn text-ink mt-4 inline-flex items-center gap-1.5 self-start underline underline-offset-4"
                >
                  {member.websiteLabel ?? teamCopy.websiteLabel}
                  <ArrowUpRightIcon className="size-4" strokeWidth={1.5} aria-hidden />
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
