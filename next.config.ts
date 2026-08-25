import type { NextConfig } from 'next'

/**
 * The proposal is still a single pre-rendered page — nothing on it is computed
 * per request, and the one interactive part, choosing which parts of the offer
 * to take, runs in the browser and is carried in the URL.
 *
 * ## Why this is no longer `output: 'export'`
 *
 * The offer carries prices and is addressed to one business, so it is behind a
 * password (`src/proxy.ts`). A gate is only a gate if it runs before the
 * page is served: a static export has nothing in front of the files, so any
 * lock built on top of one is decoration over a bundle that already contains
 * every figure. Next refuses the combination outright, which is the correct
 * refusal.
 *
 * What that costs is the ability to drop the built files on any host. What it
 * does not cost is speed: the page is still pre-rendered at build time and
 * still served from the CDN, with one edge check ahead of it. It is as fast on
 * a phone at a jetty as it was.
 */
const nextConfig: NextConfig = {
  // The exhibits are already exported at the size they are printed at, so the
  // optimiser has nothing to do but add a round trip in front of each one.
  images: { unoptimized: true },
}

export default nextConfig
