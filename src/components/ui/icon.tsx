import {
  AnchorIcon,
  BanknoteIcon,
  CalendarRangeIcon,
  CameraIcon,
  ClipboardCheckIcon,
  CodeIcon,
  GaugeIcon,
  GlobeIcon,
  LanguagesIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  MoonIcon,
  MousePointerClickIcon,
  PaintbrushIcon,
  SearchIcon,
  SparklesIcon,
  TagsIcon,
  TargetIcon,
  TicketIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react'

import type { IconKey } from '@/content/icons'
import { cn } from '@/lib/utils'

const drawings: Record<IconKey, LucideIcon> = {
  anchor: AnchorIcon,
  banknote: BanknoteIcon,
  brush: PaintbrushIcon,
  calendar: CalendarRangeIcon,
  camera: CameraIcon,
  clipboard: ClipboardCheckIcon,
  code: CodeIcon,
  crew: UsersIcon,
  dashboard: LayoutDashboardIcon,
  globe: GlobeIcon,
  languages: LanguagesIcon,
  message: MessageSquareIcon,
  moon: MoonIcon,
  pointer: MousePointerClickIcon,
  search: SearchIcon,
  speed: GaugeIcon,
  sparkle: SparklesIcon,
  tags: TagsIcon,
  target: TargetIcon,
  ticket: TicketIcon,
}

/**
 * A feature's mark.
 *
 * Always decorative: every icon on this page sits directly beside the words it
 * illustrates, so announcing it would read the same idea twice. The heading
 * next to it carries the meaning.
 *
 * Stroke is pinned at 1.5 rather than lucide's default 2. At 18px the default
 * weight sits heavier than IBM Plex Sans beside it and the row reads as a line
 * of buttons; 1.5 puts the mark at roughly the same colour as the text.
 */
export function Icon({ name, className }: { name: IconKey; className?: string }) {
  const Drawing = drawings[name]

  return <Drawing className={cn('size-[18px]', className)} strokeWidth={1.5} aria-hidden />
}

/**
 * The icon in its tile, used wherever icons appear in a list.
 *
 * The tile exists to give a column of feature lines a left edge to align on.
 * Without it the marks are different widths and the titles start at different
 * places, which is what makes an icon list look assembled rather than set.
 *
 * `{accent-wash}` behind `{accent}`, not the accent at full strength behind
 * white: nine of these in a section, each a solid square, would out-shout the
 * totals panel the whole page is walking towards. The wash is the accent with
 * the volume down — the mark still reads in colour, and the stroke sits on it
 * at 4.9:1.
 *
 * Which colour is not this component's business. `accent` is whatever part the
 * tile is standing in, so a feature list inside `01` comes out teal and the
 * same markup inside `03` comes out purple, with nothing passed down.
 */
export function IconTile({
  name,
  className,
  iconClassName,
}: {
  name: IconKey
  className?: string
  iconClassName?: string
}) {
  return (
    <span
      className={cn(
        'bg-accent-wash text-accent flex size-9 shrink-0 items-center justify-center rounded-md',
        className,
      )}
    >
      <Icon name={name} className={iconClassName} />
    </span>
  )
}
