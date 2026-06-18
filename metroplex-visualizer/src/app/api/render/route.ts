import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { getRoofTypeLabel, resolveSelection } from '@/lib/roofProducts';

// Allow time for one gpt-image-1.5 call plus image fetches
export const maxDuration = 90;

// Lazy-initialize so the module loads cleanly at build time without a key
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

async function fetchAsFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${filename}: status ${res.status}`);
  const buffer = await res.arrayBuffer();
  const mimeType = res.headers.get('content-type') ?? 'image/jpeg';
  return new File([buffer], filename, { type: mimeType });
}

async function checkStreetViewAvailable(address: string, apiKey: string): Promise<boolean> {
  try {
    const url = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${encodeURIComponent(address)}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.status === 'OK';
  } catch (err) {
    console.error('[render] Street View metadata check failed:', err);
    return false;
  }
}

// ============================================================================
// Helper: Build Render Prompt
// ============================================================================

function buildRenderPrompt(
  useStreetView: boolean,
  roofTypeLabel: string,
  productLabel: string | null,
  color: string | null
): string {
  // Format the color and product label for the prompt
  const colorAndProductLabel = productLabel && color ? `${color} ${productLabel}` : `${roofTypeLabel} metal roofing`;

  if (useStreetView) {
    return (
      `I'm giving you 3 reference images in order:
1. Aerial/satellite view of the house — use this as the primary reference for the home's true shape, structure, and layout
2. Street-level view of the house — use this to preserve the facade, windows, doorway, color, and architectural details exactly as shown
3. Close-up reference of the new roof material and color: ${colorAndProductLabel} — match this roof color and texture exactly

Using all three, render a single photorealistic image of this home with a new roof in the color and material shown in image 3. The result should look like a real estate listing photograph: natural daylight, true-to-life color, sharp architectural photography detail, accurate shadows, and realistic texture — not an illustration, painting, or stylized rendering. Use an elevated, drone-like perspective that gives a clear view of the roof. Limit all changes to the roof only — do not change the windows, siding color, doorway, landscaping, fence, or any other detail from images 1 and 2. Stay as true to the actual shape, structure, and details of this specific house as possible. The final image must be photorealistic, not cartoonish or artificial-looking.`
    );
  }

  return (
    `I'm giving you 2 reference images in order:
1. Aerial/satellite view of the house — use this as the reference for the home's true shape, structure, layout, and surroundings
2. Close-up reference of the new roof material and color: ${colorAndProductLabel} — match this roof color and texture exactly

Using both, render a single photorealistic image of this home with a new roof in the color and material shown in image 2. The result should look like a real estate listing photograph: natural daylight, true-to-life color, sharp architectural photography detail, accurate shadows, and realistic texture — not an illustration, painting, or stylized rendering. Use a slightly elevated, photogenic angle that gives a clear view of the roof. Limit all changes to the roof only — do not change the structure, landscaping, or yard details. Stay as true to the actual shape, structure, and details of this specific house as possible. The final image must be photorealistic, not cartoonish or artificial-looking.`
  );
}

// ============================================================================
// Helper: Expand Render Prompt (adds photographic detail via Claude)
// ============================================================================

const PROMPT_EXPANSION_SYSTEM_PROMPT = `You are a minimal prompt editor for an image-editing pipeline. Your ONLY job is to add a single short sentence about photographic technical quality (camera sharpness, natural lighting, realistic detail) to the END of the given prompt.

CRITICAL RULES:
- Do not add atmospheric, mood, or time-of-day language (no "golden hour," no "dramatic lighting," no "cinematic," no sunset/sunrise references)
- Do not add, remove, or reword ANY existing sentence in the original prompt
- Do not change the numbered image instructions
- Do not change any preservation/constraint language (anything about "do not change," "limit changes to," "stay true to")
- Your addition must be ONE sentence, no more than 20 words
- Acceptable additions look like: "Render with natural, even daylight and sharp, true-to-life photographic detail."
- Unacceptable additions look like: anything mentioning specific times of day, weather drama, artistic style, or mood

Output the original prompt with your one sentence appended at the very end. Output ONLY the final prompt text, nothing else — no preamble, no explanation.`;

async function expandRenderPrompt(basePrompt: string): Promise<string> {
  try {
    const anthropic = getAnthropic();

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: PROMPT_EXPANSION_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: basePrompt,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text' || !textBlock.text.trim()) {
      console.error('[render] Prompt expansion returned no text block, falling back to base prompt');
      return basePrompt;
    }

    console.log(
      '[render] Prompt expansion token usage — input:',
      message.usage.input_tokens,
      'output:',
      message.usage.output_tokens
    );

    return textBlock.text.trim();
  } catch (err) {
    console.error('[render] Prompt expansion failed, falling back to base prompt:', err);
    return basePrompt;
  }
}

// ============================================================================
// Helper: Generate AI Render
// ============================================================================

async function generateImage(images: File[], prompt: string): Promise<string | null> {
  try {
    const openai = getOpenAI();
    const renderModel = process.env.RENDER_MODEL ?? 'gpt-image-1.5';

    console.log('[render] Generating combined render with model:', renderModel);

    const editParams: Record<string, unknown> = {
      model: renderModel,
      image: images.length === 1 ? images[0] : images,
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'high',
      output_format: 'png',
    };

    // input_fidelity is only supported by gpt-image-1.5; gpt-image-2 always uses maximum fidelity
    if (renderModel !== 'gpt-image-2') {
      editParams.input_fidelity = 'high';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (openai.images as any).edit(editParams);

    const b64 = response.data?.[0]?.b64_json as string | undefined;
    if (!b64) {
      console.error('[render] No b64_json in OpenAI response');
      return null;
    }

    return `data:image/png;base64,${b64}`;
  } catch (err) {
    console.error('[render] Render generation failed:', err);
    return null;
  }
}

// ============================================================================
// Main Handler
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('[render] OPENAI_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    const mapsKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!mapsKey) {
      console.error('[render] GOOGLE_MAPS_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await req.json();
    const { address, satelliteImageUrl, roofType, style, product, color } = body as {
      address: string;
      satelliteImageUrl: string;
      roofType: string;
      style: string | null;
      product: string | null;
      color: string | null;
    };

    if (!address || !satelliteImageUrl || !roofType) {
      return NextResponse.json(
        { error: 'Missing required fields: address, satelliteImageUrl, roofType' },
        { status: 400 }
      );
    }

    // Resolve productLabel/colorImagePath server-side from the shared config —
    // never trust client-supplied file paths.
    const selection = resolveSelection(roofType, style ?? null, product ?? null, color ?? null);
    const roofTypeLabel = getRoofTypeLabel(roofType);

    console.log('[render] Render Request:', { roofType, style, product, color: selection.color });

    // ========================================================================
    // Fetch Satellite Image (Required)
    // ========================================================================

    let satelliteFile: File;
    try {
      satelliteFile = await fetchAsFile(satelliteImageUrl, 'satellite.jpg');
      console.log('[render] Satellite image fetched');
    } catch (err) {
      console.error('[render] Failed to fetch satellite image:', err);
      return NextResponse.json({ error: 'Could not fetch satellite image' }, { status: 400 });
    }

    // Color reference photo (angle 1), if a color was selected
    let colorRefFile: File | null = null;
    if (selection.colorImagePath) {
      try {
        const colorRefUrl = new URL(selection.colorImagePath, req.nextUrl.origin).toString();
        colorRefFile = await fetchAsFile(colorRefUrl, 'color-reference.jpg');
      } catch (err) {
        console.error('[render] Failed to fetch color reference photo:', err);
      }
    }

    // ========================================================================
    // Street View Availability Check (unchanged) — determines prompt template
    // ========================================================================

    const streetViewAvailable = await checkStreetViewAvailable(address, mapsKey);
    console.log('[render] Street View available:', streetViewAvailable);

    let streetViewFile: File | null = null;
    if (streetViewAvailable) {
      try {
        const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${encodeURIComponent(address)}&key=${mapsKey}`;
        streetViewFile = await fetchAsFile(streetViewUrl, 'streetview.jpg');
      } catch (err) {
        console.error('[render] Failed to fetch Street View image, falling back to satellite-only render:', err);
      }
    }

    // ========================================================================
    // Single Combined Render
    // ========================================================================

    const inputs = [satelliteFile, ...(streetViewFile ? [streetViewFile] : []), ...(colorRefFile ? [colorRefFile] : [])];
    const prompt = buildRenderPrompt(!!streetViewFile, roofTypeLabel, selection.productLabel, selection.color);

    console.log('[render] Original prompt:', prompt);
    const expandedPrompt = await expandRenderPrompt(prompt);
    console.log('[render] Expanded prompt:', expandedPrompt);

    const image = await generateImage(inputs, expandedPrompt);

    if (!image) {
      return NextResponse.json({ error: 'Render failed' }, { status: 500 });
    }

    console.log('[render] Render complete');

    return NextResponse.json({
      success: true,
      streetViewAvailable,
      image,
      selection: {
        roofType,
        productLabel: selection.productLabel,
        color: selection.color,
      },
    });
  } catch (err) {
    console.error('[render]', err);
    const message = err instanceof Error ? err.message : 'Render failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
