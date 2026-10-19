# PourCanvas Customer & Competitor Brief (2026-10-19)

Sources: live site content (13 tools, 10 material pages, 40+ guides, 77 inspiration pages), GSC API pull `_data/gsc/2026-10-19/api/` (Mar 1 – Oct 18, 2026), competitor search 2026-10-19 (WebSearch, not a live SERP: positions approximate). Supersedes nothing; complements `_planning/refactor-2026-10/decisions.md` and `launch-2026-10/launch-kit.md`.

## 1. Search traffic snapshot

| Metric (Mar 1 – Oct 18) | Value |
|---|---|
| Web search | 239 clicks / 34.8k impr |
| Image search | 174 clicks / 40.9k impr (more impressions than web) |
| Last 28 days web (query-attributed) | 8 clicks / 4.8k impr (prev 28: 5 / 4.5k) |
| Country | USA 75% of impr, Canada 9%, Japan 5%, UK 3%, Australia 2% |
| Device (web impr) | Desktop 76%, mobile 24%; mobile wins more of the clicks (14 of 21) |
| /tools/* pages | 0 impressions so far (live since 2026-10-10, not yet indexed/ranking) |

**Where demand sits (web impressions by intent bucket, overlapping):** driveway 9.3k, finish type (stamped/exposed aggregate/broom) 8.5k, ideas/inspiration 5.0k, color (black/dark/charcoal/dye/stain) 2.8k, cost 2.1k, patio 1.8k, pavers/flagstone 1.4k, pool deck 1.0k, "X vs Y" 1.0k, calculator ~0.

**Where we win:** black/dark concrete driveway is the only page-1 cluster (`black concrete driveway` pos 2.3 last 28d, `black driveway` 2.7, `modern concrete driveway ideas` 9.5). Image search: `black concrete` 2.0k impr, `black concrete driveway` 625, `black driveway` 422, broom-finish and stamped-pattern images 100–250 each.

**Where we have demand but no rank (pos 45–85):** stamped concrete (1.9k impr), exposed aggregate (≈1.9k across variants), concrete driveway cost (slabcalc's lane), pool deck finishes (~750 across variants), concrete dye vs stain (139), concrete patio colors (150).

## 2. Customer profile

**Primary: the U.S. homeowner choosing the look of an outdoor surface (≈70% of demand).**
- Who: owner of a single-family home, US (secondary CA/UK/AU), planning a new or replacement driveway, patio, walkway or pool deck. Often a modern or newly built house.
- Stage: early-to-mid decision. Has decided to do the project, has not picked material/finish/color. Browses images first (image search > web), then validates.
- Questions they ask: "what will it look like" (black/dark/charcoal driveway, modern driveway ideas, patio colors), "which finish" (stamped vs exposed aggregate vs broom, best finish for a pool deck), "will it hold up" (does black concrete fade, heat, freeze-thaw, slip), "what will it cost" (stamped vs pavers cost, is flagstone cheaper than concrete).
- What they want from us: real photos of the look, a straight answer for their surface + climate, a price range, and confidence to brief a contractor.
- Not: a commercial buyer, not an interior-floor/epoxy/countertop shopper (≈0 demand), not a concrete volume/yardage shopper (slabcalc.co).

**Secondary: the DIY hardscaper (paver/flagstone projects).**
- Weekend DIYer laying a paver patio or flagstone path; needs counts, base gravel, sand, polymeric sand bags and a DIY vs contractor cost. Served by the 10 paving calculators. Demand validated in Keyword Planner (paver calculator 10K–100K; cost/base/sand calculators 1K–10K each), not yet in our GSC.

**Tertiary: small contractor / landscaper.** Uses calculators to sanity-check takeoffs and shares result links with clients. Small share; don't write for them.

**Voice to use:** plain, homeowner-facing, answer-first, numbers with year and source, neutral (no brand pushing). Avoid trade jargon unless explained.

## 3. Competitors

| Type | Domains | Wins | Gap for PourCanvas |
|---|---|---|---|
| Calculator sites | inchcalculator.com, omnicalculator.com, homewyse.com, + new niche sites (outdoorbrite.com, surfacemeasure.io, pavercalculator.net, constructlytools.com, remodelcalculators.com) | paver / base / polymeric sand / installation cost calculators | No design layer (look, finish, climate); generic UX |
| Cost publishers | homeguide.com, angi.com / homeadvisor.com, lawnstarter.com, lawnlove.com, forbes.com/home-improvement, bobvila.com, fixr.com | paver, flagstone, walkway, driveway cost | Static tables, often 2025 data, lead-gen calculators |
| Decorative concrete | concretenetwork.com (topic leader), concretedecor.net, color manufacturers (solomoncolors, directcolors) | finishes, pool deck, colors, stamped, exposed aggregate, dye vs stain | No tools, dated pages, product-biased color advice |
| Inspiration | houzz.com, pinterest.com, listicle blogs | black/modern driveway ideas, image queries | No costs, no "which one for me" |
| Manufacturers / retail | unilock (login-gated), alliancegator (own product), lowes.com | brand calculators | Single brand, gated |
| Sister site (not a competitor) | slabcalc.co | concrete volume/cost | Hand off cost/volume there |

**Top competitors for SEO tools:** inchcalculator.com, concretenetwork.com, homeguide.com, angi.com, homewyse.com, lawnstarter.com, houzz.com, omnicalculator.com.

## 4. Positioning and content rules

1. Only site combining "what should it look like" with "what will it cost / what to order" for outdoor surfaces. Finish selectors + paving calculators + photo-led guides.
2. Beachhead: black/dark/modern driveways. Expand to adjacent looks (charcoal, dark exposed aggregate, salt finish, modern broom) and the fade/heat/sealer questions.
3. Easiest tool wins: polymeric sand calculator, paver patio/installation cost calculators (2026-dated vs 2025 static tables), flagstone vs concrete vs pavers comparison.
4. Concrete volume/cost queries go to slabcalc.co, never compete.
5. Every page per `.claude/page-build-guide.md`; every number dated and sourced on /methodology.

## 5. Outrank.so seller (publisher) setup — notes

- Outrank's Backlink Marketplace "Publisher" places paid buyer links inside AI-written articles auto-published to the seller's site (Settings > General: Accept placements, Auto-publishing; publishing days, 2 articles/day max).
- **Risk:** hosting paid, followed links is a link scheme under Google's spam policies and can demote the whole site, including the black-concrete page-1 cluster. Auto-published AI articles also bypass the page-build guide (tool-first, sourced numbers). Decide deliberately before turning "Accept placements" on.
- **Integration:** pourcanvas is a prerendered Vite site with no CMS; Outrank's only fitting option is "API Webhook", which needs a receiving endpoint plus a publish/rebuild path (engineering task, not done).
- Audience and competitor fields filled from sections 2–3 above (2026-10-19).
- Onboarding done through Articles (2026-10-19): GSC connected; blog = /blog, examples = black-concrete-driveway, modern-driveway-ideas, flagstone-vs-concrete-walkway; publishing Mon/Wed/Fri, 1 article/day, brand #90D0C3, Realistic images, emojis and first-person off. Integration and Payouts open.
- **Integration (user decision 2026-10-19):** API Webhook → `api/outrank-webhook.ts` verifies `Bearer OUTRANK_WEBHOOK_TOKEN`, commits each article to `src/content/outrank/{slug}.json` via GitHub API (`OUTRANK_GITHUB_TOKEN`, contents:write), Vercel rebuild prerenders `/blog/guides/{slug}` (`OutrankArticlePage.tsx`). Buyer links published as delivered (followed), per user decision.
- **Eligibility:** paid placements start only at 100+ organic clicks/month and 3 months of GSC history (50+ and 1 month if the blog is hosted on Outrank). PourCanvas is at ~35 clicks/month (web + image), so it does not qualify yet under either path.
