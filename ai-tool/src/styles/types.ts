export interface StyleConfig {
  id: string;
  label: string;
  /** fal storage URL to the style reference photo */
  referenceImageUrl: string;
  /** Single Kontext pass: clutter removal, fence repainting, full ground redesign */
  // v1→v2: replaced atmosphericPrompt (atmosphere-only) + tilePrompt (Flux Fill material) with single designPrompt
  designPrompt: string;
  /** Kontext guidance scale — higher values anchor output to input scene */
  guidanceScale: number;
  /** Kontext fence repaint colour, templated into designPrompt via {{fenceColor}} */
  fenceColor: string;
}
