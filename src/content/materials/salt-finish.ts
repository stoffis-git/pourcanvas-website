import type { MaterialPage } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { moneyRange, perSqftRange } from "@/lib/format";
import { INSTALLED, type Range } from "@/lib/tools/data/paving";

const CN_SALT = `<a href="https://www.concretenetwork.com/rock-salt-finish/" rel="nofollow noopener">Concrete Network</a>`;
const NRMCA = `<a href="https://www.nrmca.org/wp-content/uploads/2021/01/02pr.pdf" rel="nofollow noopener">NRMCA</a>`;
const LBNL = `<a href="https://heatisland.lbl.gov/coolscience/cool-pavements" rel="nofollow noopener">Lawrence Berkeley National Laboratory</a>`;
const SOLOMON = `<a href="https://www.solomoncolors.com/tech-docs/pdf/solomon/Integral-Color-SRI-Values.pdf" rel="nofollow noopener">Solomon Colors test data</a>`;
const CD_FREEZE = `<a href="https://www.concretedecor.net/departments/concrete-sealers/carltons-corner-using-sealers-to-fight-freeze-thaw/" rel="nofollow noopener">Concrete Decor</a>`;
const CD_SLIP = `<a href="https://www.concretedecor.net/departments/safety/get-a-grip-on-concrete-slip-resistance/" rel="nofollow noopener">Concrete Decor's slip resistance guide</a>`;
const CCAA = `<a href="https://cdn2.hubspot.net/hub/94143/file-17569159-pdf/docs/slipresistanceofpolishedconcretesurfaces.pdf" rel="nofollow noopener">Cement Concrete &amp; Aggregates Australia</a>`;
const CN_BROOM = `<a href="https://www.concretenetwork.com/slip-resistant-coatings/broom-finish.html" rel="nofollow noopener">Concrete Network</a>`;
const CD_AGG = `<a href="https://www.concretedecor.net/departments/concrete-sealers/seal-exposed-aggregate-concrete-for-best-results/" rel="nofollow noopener">Concrete Decor</a>`;

const plain = INSTALLED["plain-concrete"];
const aggregate = INSTALLED["exposed-aggregate"];
/** Salt finish ≈ plain concrete + about $1/sq ft (Concrete Network, rock salt finish). */
const salt: Range = { low: plain.low + 1, typical: plain.typical + 1, high: plain.high + 1 };
const area = (r: Range, a: number): Range => ({ low: r.low * a, typical: r.typical * a, high: r.high * a });

export const saltFinishPage: MaterialPage = {
  slug: "salt-finish",
  title: "Salt Finish Concrete: Look, Cost, Climate Limits",
  headline: "Salt Finish Concrete",
  summary:
    "A rock salt finish presses coarse salt into fresh concrete and washes it out, leaving a field of small pits. It is a low-cost, non-skid texture that suits warm-climate patios and pool decks, but it is a poor choice where slabs freeze.",
  metaDescription: `Salt finish concrete adds about $1 per sq ft over a plain slab (${perSqftRange(salt)} installed). See the look, slip, sealing and why it struggles in freeze-thaw climates.`,
  targetKeywords: [
    "salt finish concrete",
    "rock salt finish",
    "salt finish pool deck",
    "rock salt concrete finish",
    "salt finish concrete patio",
    "salt finish vs broom finish",
  ],
  ogImage: "https://images.pourcanvas.com/inspiration-salt-finish-concrete-walkway.jpg",
  images: [
    { url: "https://images.pourcanvas.com/inspiration-salt-finish-concrete-walkway.jpg", alt: "Salt finish concrete walkway with fine pitted texture leading to a craftsman home entry" },
    { url: "https://images.pourcanvas.com/inspiration-salt-finish-concrete-patio.jpg", alt: "Buff salt finish concrete patio with a field of small, shallow pits" },
    { url: "https://images.pourcanvas.com/inspiration-charcoal-salt-finish-patio.jpg", alt: "Charcoal salt finish concrete patio with subtle pitted texture and modern outdoor furniture" },
    { url: "https://images.pourcanvas.com/inspiration-salt-finish-driveway-tan.jpg", alt: "Tan salt finish concrete driveway with warm buff tone and subtle pitting" },
  ],
  publishedAt: "2026-10-10",
  intro: `Salt finish concrete is plain or colored concrete with coarse rock salt pressed into the surface and washed out after it sets, leaving shallow pits that give non-skid grip. It costs about $1 per sq ft more than a plain slab, or roughly ${perSqftRange(salt)} installed. It suits patios and pool decks in warm climates. Where slabs freeze, water sits in the pits and can spall the surface.`,
  sections: [
    {
      heading: "What Is Salt Finish Concrete?",
      body: `<p>A rock salt finish is a texture, not a coating. According to ${CN_SALT}, the crew uses coarse rock salt, the kind sold for water softeners or as a deicer, with crystals 1/8 to 3/8 inch across. The salt is scattered over the slab when the concrete is just beginning to set, about when a finger leaves a 1/4 inch imprint. A steel roller presses each crystal in to about half its diameter. After the slab hardens, usually around 24 hours, the salt is power-washed away. Every crystal leaves a small hole behind.</p><p>Every trace of salt has to come out, or the surface can discolor. The only extra tool is the roller, which Concrete Network puts at around $100, so most flatwork contractors can offer the finish. The texture goes over a normal floated slab, so it works with plain gray concrete, integral color, or a <a href="/materials/colored-concrete">colored concrete</a> mix.</p>`,
    },
    {
      heading: "What a Rock Salt Finish Looks Like",
      body: `<p>${CN_SALT} describes the look as a speckled pattern of shallow indentations, similar to slightly pitted, weathered rock. From a few steps away the slab reads as a fine, even grain. Up close you see real surface depth. Unlike a <a href="/materials/broom-finish">broom finish</a>, the texture has no direction, so it doesn't fight curved edges or odd-shaped patios.</p><p>Color changes the effect a lot. In buff or sand tones the pits soften into a stone-like surface. In charcoal they catch shadow and look more graphic. Contractors also use salt texture as a border around broom or stamped fields, or in large scored panels. Compare real examples: a <a href="/inspiration/salt-finish-concrete-walkway">salt finish walkway</a>, a <a href="/inspiration/salt-finish-concrete-patio">salt finish patio</a> and a <a href="/inspiration/charcoal-salt-finish-patio">charcoal salt finish patio</a>.</p>`,
      inspirationSlugs: ["salt-finish-concrete-walkway", "charcoal-salt-finish-patio"],
    },
    {
      heading: "Is Salt Finish Concrete Slippery?",
      body: `<p>No. A salt finish is used because it grips. ${CN_SALT} says it adds skid resistance to plain or colored concrete, and that it is still popular with pool contractors because of its non-skid texture. No published wet slip test isolates salt finish from other textures, so treat it as a grippy finish rather than a rated one.</p><p>Two details decide how it performs in practice. First, pigment doesn't change grip: ${CCAA} found color has no effect on slip resistance. Second, the sealer does. The same research measured much higher wet readings with penetrating sealers than with film-forming coatings, and ${CD_SLIP} notes that film sealers reduce a surface's built-in grip. On a pool deck or a sloped walk, use a penetrating sealer, or add a grit additive if you want a film sealer.</p>`,
    },
    {
      heading: "Salt Finish in Freeze-Thaw Climates",
      body: `<p>Climate is the main limit of this finish. ${CN_SALT} warns that in areas with freezing weather, water collects in the indentations and freezes, which can cause spalling. That is why salt finish is common in the warm West and South. The same source adds that good-quality concrete with a waterproofing sealer should hold up in any climate. That is a best-case condition, not a guarantee.</p><p>If you live where slabs freeze, the general rules for exterior concrete from ${NRMCA} still apply. Use air-entrained concrete, about 6% air for typical 3/4 to 1 inch aggregate. Use no deicers in the first winter. Never use ammonium- or magnesium-based deicers. Seal with a breathable silane or siloxane.</p><table><thead><tr><th>Climate</th><th>Patio</th><th>Walkway</th><th>Driveway</th><th>Pool deck</th></tr></thead><tbody><tr><td>Warm, no hard freeze</td><td>Good fit</td><td>Good fit</td><td>Possible</td><td>Good fit</td></tr><tr><td>Occasional freeze</td><td>Seal well</td><td>Seal well, no deicers</td><td>Choose broom</td><td>Seal well</td></tr><tr><td>Regular freeze-thaw with deicers</td><td>Only sealed, no deicers</td><td>Avoid</td><td>Avoid</td><td>Avoid</td></tr></tbody></table><p>Not sure where your project falls? The <a href="/tools/concrete-finish-selector">concrete finish selector</a> flags salt finish automatically when you choose a freeze-thaw climate.</p>`,
    },
    {
      heading: "Sealing a Salt Finish",
      body: `<p>Sealing matters more on a salt finish than on broom concrete, because every pit can hold water and dirt. ${CN_SALT} gives the key timing rule: don't seal until the surface and the small recesses left by the salt have dried completely. Sealer trapped over damp pits can cloud.</p><p>Choose the sealer type for your climate and use:</p><ul><li><strong>Cold climates:</strong> a breathable penetrating silane or siloxane, applied in late summer, as ${NRMCA} recommends for freeze-thaw slabs. ${CD_FREEZE} warns that too much surface water breaks down film sealers and turns colored concrete white.</li><li><strong>Pool decks:</strong> a penetrating sealer keeps the most grip. A film sealer needs a grit additive.</li><li><strong>Colored or charcoal slabs:</strong> a sealer with UV protection helps keep the tone even.</li></ul><p>Expect the pits to collect some grit. A hose and a stiff brush are usually enough, and pressure washing at moderate settings clears what settles in. For product types and schedules, see our <a href="/blog/patio/concrete-patio-sealing">concrete patio sealing guide</a>.</p>`,
    },
    {
      heading: "Salt Finish Concrete Cost",
      body: `<p>As of ${CURRENT_YEAR}, plain poured concrete runs about ${perSqftRange(plain)} per sq ft installed for patios and walks. ${CN_SALT} puts a basic salt finish at as little as $1 more per square foot, so a salt finish lands around ${perSqftRange(salt)} per sq ft. Integral color or added decorative work raises the price further.</p><table><thead><tr><th>Project</th><th>Plain concrete</th><th>Salt finish (about +$1/sq ft)</th><th>Exposed aggregate</th></tr></thead><tbody><tr><td>200 sq ft walkway</td><td>${moneyRange(area(plain, 200))}</td><td>${moneyRange(area(salt, 200))}</td><td>${moneyRange(area(aggregate, 200))}</td></tr><tr><td>400 sq ft patio</td><td>${moneyRange(area(plain, 400))}</td><td>${moneyRange(area(salt, 400))}</td><td>${moneyRange(area(aggregate, 400))}</td></tr><tr><td>600 sq ft pool deck</td><td>${moneyRange(area(plain, 600))}</td><td>${moneyRange(area(salt, 600))}</td><td>${moneyRange(area(aggregate, 600))}</td></tr></tbody></table><p>That makes salt one of the cheapest decorative upgrades. Exposed aggregate runs ${perSqftRange(aggregate)} per sq ft. Budget for sealing too, and for resealing over time. To price your own size and compare it with pavers or stamped concrete, use the <a href="/tools/patio-cost-calculator">patio cost calculator</a>.</p>`,
    },
    {
      heading: "Salt Finish Pool Decks in Warm Climates",
      body: `<p>A pool deck is where salt finish makes the most sense. The pits give wet grip, and the texture is smoother underfoot than a medium broom, which ${CN_BROOM} says can be harsh on bare feet. In the Sun Belt, freeze-thaw risk is low.</p><p>Heat depends on color, not on the salt texture. ${LBNL} reports that new cement concrete reflects about 30–50% of sunlight (solar reflectance 0.30–0.50), falling to 0.20–0.35 as it ages. Integral color moves that a lot. In ${SOLOMON}, white-pigmented concrete measured 0.52–0.59, buff and sand tones 0.37–0.42, and dark tones such as slate and bark 0.15–0.22. Dark integral color reflects roughly half as much sun as light tones. A charcoal salt finish looks sharp on a patio, but around a pool in full sun, pick a light buff, sand or white mix.</p><p>For decks that are already poured, a textured coating may be the better route. Read <a href="/blog/patio/cool-deck-vs-kool-deck">cool deck vs Kool Deck</a> for how those coatings compare. To rank every finish for your deck, try the <a href="/tools/pool-deck-finish-selector">pool deck finish selector</a>.</p>`,
    },
    {
      heading: "Salt Finish vs Broom vs Exposed Aggregate",
      body: `<p>These three are the common textured options for flat concrete. They differ most on climate tolerance, comfort barefoot and price.</p><table><thead><tr><th>Factor</th><th>Salt finish</th><th>Broom finish</th><th>Exposed aggregate</th></tr></thead><tbody><tr><td>Installed cost/sq ft</td><td>${perSqftRange(salt)} (about +$1)</td><td>${perSqftRange(plain)}</td><td>${perSqftRange(aggregate)}</td></tr><tr><td>Look</td><td>Fine, random pits</td><td>Parallel lines</td><td>Exposed stones</td></tr><tr><td>Wet grip</td><td>Non-skid (no rated data)</td><td>High</td><td>Very high</td></tr><tr><td>Barefoot feel</td><td>Fairly smooth</td><td>Can be harsh at medium texture</td><td>Rough unless small or polished stone</td></tr><tr><td>Freeze-thaw</td><td>Weak: pits hold water</td><td>Standard exterior finish</td><td>Good when sealed</td></tr><tr><td>Sealing</td><td>Needed, after pits dry</td><td>Optional; advised in cold areas</td><td>Penetrating sealer lasts about 7–10 years</td></tr></tbody></table><p>Sources: ${CN_SALT} for salt finish, ${NRMCA} and ${CN_BROOM} for broom, ${CD_AGG} for exposed-aggregate sealing. For the head-to-head between the other two, see <a href="/blog/patio/exposed-aggregate-vs-broom-finish">exposed aggregate vs broom finish</a>, or read the full <a href="/materials/exposed-aggregate">exposed aggregate</a> guide.</p>`,
    },
    {
      heading: "When to Choose a Salt Finish",
      body: `<p>Choose salt finish when you want more texture than broom, you're on a budget, and your slab won't see hard freezes. That covers most patios, pool decks and garden paths in warm regions. It also works as a border around a broom or stamped field.</p><p>Skip it for driveways and walks in snow country, where deicers and freeze-thaw cycles work on the pits, and for areas you want to keep spotless, since the pits collect grit. If you're torn between finishes, the <a href="/tools/concrete-finish-selector">concrete finish selector</a> ranks salt, broom, exposed aggregate, stamped and sandblasted concrete for your surface, climate and priorities. For pool surrounds, see the <a href="/blog/patio/best-concrete-finish-pool-deck">best concrete finish for pool decks</a>.</p>`,
    },
  ],
  prosAndCons: {
    pros: [
      "About $1 per sq ft more than plain concrete",
      "Non-skid texture favored by pool contractors",
      "Smoother underfoot than a medium broom finish",
      "Works with plain gray or integrally colored concrete",
      "Non-directional texture suits curved and irregular slabs",
    ],
    cons: [
      "Pits hold water that can freeze and spall in cold climates",
      "Needs a sealer, applied only after the pits dry fully",
      "Pits collect dirt and grit",
      "Not a usual choice for driveways or heavy traffic",
      "Dark colors run hot around pools",
    ],
  },
  relatedPillars: ["patio", "walkway"],
  relatedArticles: [
    { pillar: "patio", slug: "best-concrete-finish-pool-deck" },
    { pillar: "patio", slug: "pool-deck-ideas-concrete" },
    { pillar: "patio", slug: "cool-deck-vs-kool-deck" },
    { pillar: "patio", slug: "exposed-aggregate-vs-broom-finish" },
    { pillar: "patio", slug: "concrete-patio-sealing" },
  ],
  faqs: [
    {
      question: "What is a salt finish on concrete?",
      answer:
        "A salt finish is a texture made by pressing coarse rock salt (crystals 1/8 to 3/8 inch) into concrete as it begins to set, then power-washing the salt away after the slab hardens, usually about 24 hours later. Each crystal leaves a shallow pit, giving a speckled, weathered-stone look with non-skid grip.",
    },
    {
      question: "How much does salt finish concrete cost?",
      answer: `According to PourCanvas, a salt finish costs about ${perSqftRange(salt)} per sq ft installed. That is the ${perSqftRange(plain)} plain-concrete range plus about $1 per sq ft for the salt texture. A 400 sq ft patio runs roughly ${moneyRange(area(salt, 400))}. Integral color or decorative borders add to that.`,
    },
    {
      question: "Is salt finish concrete good in cold climates?",
      answer:
        "It is the weakest common finish in freeze-thaw climates. Water collects in the small pits, freezes and can spall the surface, which is why salt finish is mostly used in the warm West and South. If you use it where slabs freeze, use air-entrained concrete, seal it with a breathable penetrating sealer, avoid deicers, and keep it to patios rather than driveways or walks.",
    },
    {
      question: "Is salt finish good for a pool deck?",
      answer: `According to PourCanvas, salt finish is one of the best-value pool deck textures in warm climates. It grips when wet, feels smoother barefoot than a medium broom, and costs only about $1 per sq ft more than plain concrete. Pick a light color: in Solomon Colors test data, dark integral colors reflected roughly half as much sunlight as light ones.`,
    },
    {
      question: "Do you need to seal salt finish concrete?",
      answer:
        "Yes. Wait until the surface and every pit have dried completely, then apply the sealer. In freeze-thaw areas use a breathable silane or siloxane penetrating sealer. On pool decks a penetrating sealer keeps the most grip; a glossy film sealer needs a grit additive.",
    },
    {
      question: "Salt finish vs broom finish: which is better?",
      answer:
        "Broom finish is the safer default for driveways and anywhere it freezes, and it costs a little less. Salt finish looks more refined, has no directional lines and is gentler on bare feet, so it wins for warm-climate patios and pool decks. Both grip well when wet.",
    },
  ],
  toolWidget: {
    tool: "concrete-finish-selector",
    variant: "finish",
    heading: "Is salt finish right for your project?",
    focusFinish: "salt",
    finishDefaults: { surface: "patio" },
  },
  relatedTools: ["concrete-finish-selector", "pool-deck-finish-selector"],
};
