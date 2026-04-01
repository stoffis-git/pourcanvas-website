import type { StyleConfig } from "./types";

export const STYLES: StyleConfig[] = [
  {
    id: "modern-concrete",
    label: "Modern Concrete",
    referenceImageUrl: "https://v3b.fal.media/files/b/0a93d667/GtPhPVobSjVZdofeexg7i_modern-concrete.jpg",
    guidanceScale: 9,

    // v1→v2: replaced atmosphericPrompt ("DO NOT change ground") + tilePrompt (tile material prescription)
    // with designPrompt (open creative ground redesign, reference-image-guided)
    designPrompt: `The first image is the outdoor space to redesign. The second image is a style reference — use its aesthetic, materiality, and ground treatment as creative direction. Do not copy its layout, viewpoint, or specific object placement.

PRESERVE exactly: all walls, windows, door frames, roof, soffit, eaves, sky, neighboring structures. Keep the exact camera angle and framing. Do not alter the facade or architectural style.

REMOVE: all loose objects, garden hoses, tools, equipment, nursery pots, temporary items leaning against walls.

REPAINT all fence panels {{fenceColor}} — back fence and all side boundary fences.

REDESIGN the entire ground zone — everything at or near ground level, including any existing paving, grass, soil, bark mulch, garden beds, and gaps between surfaces. Use the reference image as your guide for material choices, planting, and spatial composition. The ground may include any combination of hard surfaces, planted areas, ornamental grasses, ground cover, bark beds, or potted features. Do not default to full tile coverage — let the reference image and the space's character guide a considered, natural-looking result.`,

    fenceColor: "dark charcoal grey",
  },
];

export function getStyle(id: string): StyleConfig | undefined {
  return STYLES.find((s) => s.id === id);
}
