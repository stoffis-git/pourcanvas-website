import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";
import { getStyle } from "../../../styles/configs";

// PIPELINE v2 — single Kontext pass (2026-03-28)
// Replaces the previous two-pass approach:
//   v1: Kontext (atmosphere only, DO NOT CHANGE ground) → EVF-SAM ground mask → Flux Pro Fill (tile prompt)
//   v2: Kontext (full redesign — atmosphere + open-ended ground creative pass, reference-image-guided)
//
// Rationale: Flux Fill with a tile prompt destroyed creative value — it forced full tile coverage.
// The Kontext model now has full creative latitude over ALL ground (grass, paving, soil, beds, etc.)
// guided by the reference image aesthetic, not a prescriptive material prompt.
// To revert to v1, restore runGroundMask, runFluxFill, and the two-step POST handler.

export const maxDuration = 180;

fal.config({ credentials: process.env.FAL_KEY });

type KontextOutput = { images: { url: string }[] };
type ImageOutput = { image: { url: string } };

async function runKontext(params: {
  inputUrl: string;
  referenceUrl: string;
  prompt: string;
  guidanceScale: number;
  imageWidth: number;
  imageHeight: number;
}): Promise<string> {
  const result = await fal.subscribe("fal-ai/flux-pro/kontext/multi", {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: {
      image_urls: [params.inputUrl, params.referenceUrl],
      prompt: params.prompt,
      guidance_scale: params.guidanceScale,
      num_images: 1,
      output_format: "jpeg",
      image_size: { width: params.imageWidth, height: params.imageHeight },
    } as any,
    logs: false,
  });
  const url = (result.data as KontextOutput).images?.[0]?.url;
  if (!url) throw new Error("No output image from Kontext");
  return url;
}

async function runSurfaceMask(imageUrl: string): Promise<string> {
  const result = await fal.subscribe("fal-ai/evf-sam", {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: {
      image_url: imageUrl,
      prompt: "fence panel, fence boards, boundary fence, colorbond fence, vertical fence surface, garden wall, lower wall, rendered wall base, wall plinth, wall base",
      mask_only: true,
      fill_holes: true,
    } as any,
    logs: false,
  });
  const url = (result.data as ImageOutput).image?.url;
  if (!url) throw new Error("No output from EVF-SAM surface mask");
  return url;
}


export async function POST(req: NextRequest) {
  let step = "parse";
  try {
    const { imageBase64, mimeType, imageWidth, imageHeight, styleId } =
      await req.json() as {
        imageBase64: string;
        mimeType: string;
        imageWidth: number;
        imageHeight: number;
        styleId: string;
      };

    if (!imageBase64 || !mimeType || !imageWidth || !imageHeight || !styleId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const style = getStyle(styleId);
    if (!style) {
      return NextResponse.json({ error: `Unknown style: ${styleId}` }, { status: 400 });
    }

    step = "upload";
    const buffer = Buffer.from(imageBase64, "base64");
    const blob = new Blob([buffer], { type: mimeType });
    const file = new File([blob], "input.jpg", { type: mimeType });
    const inputUrl = await fal.storage.upload(file);

    // Step 2: Kontext — full redesign (atmosphere + ground creative pass)
    step = "kontext";
    const designPrompt = style.designPrompt.replace("{{fenceColor}}", style.fenceColor);
    const finalUrl = await runKontext({
      inputUrl,
      referenceUrl: style.referenceImageUrl,
      prompt: designPrompt,
      guidanceScale: style.guidanceScale,
      imageWidth,
      imageHeight,
    });

    // Step 3: Surface mask — visualization only, non-blocking
    step = "masks";
    const surfaceMaskUrl = await runSurfaceMask(finalUrl).catch(() => null);

    return NextResponse.json({ url: finalUrl, surfaceMaskUrl });
  } catch (err) {
    console.error(`[/api/redesign] step=${step ?? "unknown"}`, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
