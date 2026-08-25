import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'

import { agency, client } from '@/content/offer'

import './globals.css'

/*
  `latin-ext` is not optional on any of the three. Without it the page loses
  č, š and ž — the operator's own language, in a document arguing that we pay
  attention.

  Three faces, each with a job that the other two cannot do:

  - Archivo carries the headlines. A sturdy, slightly narrow grotesque that
    holds a long Slovenian sentence at display size in two lines rather than
    four, and tightens well under negative tracking.
  - IBM Plex Sans carries everything that is read rather than scanned. Humanist,
    slightly mechanical, and unfussy at 15–17px, which is where most of this
    page lives.
  - IBM Plex Mono carries every number. See the note in `globals.css`: prices,
    the part index and the seat-hold minutes are the page's tabular material and
    they are set as such.

  Weights are pinned to the ones the scale actually uses, so a stray
  `font-medium` cannot quietly pull in a fourth file.
*/
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700'],
  display: 'swap',
})

const plex = IBM_Plex_Sans({
  variable: '--font-plex',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: `Ponudba za ${client.businessName}`,
  description: `Rezervacijski sistem in nova spletna stran za ladjice na Ljubljanici. Pripravil ${agency.name}.`,
  /*
    A proposal addressed to one business, carrying its prices. The link is meant
    to be forwarded by the people who received it and found by nobody else.
  */
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="sl"
      className={`${archivo.variable} ${plex.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
