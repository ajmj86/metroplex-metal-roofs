import { NextRequest, NextResponse, after } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';
import { getRoofTypeLabel, resolveSelection } from '@/lib/roofProducts';

export const maxDuration = 120;

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

async function fireRenderEmailWebhook(payload: Record<string, unknown>): Promise<void> {
  const url = process.env.N8N_WEBHOOK_VISUALIZER;
  if (!url) { console.warn('[render] N8N_WEBHOOK_VISUALIZER not set'); return }
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[render] fireRenderEmailWebhook failed:', err);
  }
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

function buildRenderPrompt(useStreetView: boolean, roofTypeLabel: string, productLabel: string | null, color: string | null): string {
  const colorAndProductLabel = productLabel && color ? `${color} ${productLabel}` : `${roofTypeLabel} metal roofing`;

  if (useStreetView) {
    return `I'm giving you 3 reference images in order:
1. Aerial/satellite view of the house — use this as the primary reference for the home's true shape, structure, and layout
2. Street-level view of the house — use this to preserve the facade, windows, doorway, color, and architectural details exactly as shown
3. Close-up reference of the new roof material and color: ${colorAndProductLabel} — match this roof color and texture exactly

Using all three, render a single photorealistic image of this home with a new roof in the color and material shown in image 3. The result should look like a real estate listing photograph: natural daylight, true-to-life color, sharp architectural photography detail, accurate shadows, and realistic texture — not an illustration, painting, or stylized rendering. Use an elevated, drone-like perspective that gives a clear view of the roof. Limit all changes to the roof only — do not change the windows, siding color, doorway, landscaping, fence, or any other detail from images 1 and 2. Stay as true to the actual shape, structure, and details of this specific house as possible. The final image must be photorealistic, not cartoonish or artificial-looking.`;
  }

  return `I'm giving you 2 reference images in order:
1. Aerial/satellite view of the house — use this as the reference for the home's true shape, structure, layout, and surroundings
2. Close-up reference of the new roof material and color: ${colorAndProductLabel} — match this roof color and texture exactly

Using both, render a single photorealistic image of this home with a new roof in the color and material shown in image 2. The result should look like a real estate listing photograph: natural daylight, true-to-life color, sharp architectural photography detail, accurate shadows, and realistic texture — not an illustration, painting, or stylized rendering. Use a slightly elevated, photogenic angle that gives a clear view of the roof. Limit all changes to the roof only — do not change the structure, landscaping, or yard details. Stay as true to the actual shape, structure, and details of this specific house as possible. The final image must be photorealistic, not cartoonish or artificial-looking.`;
}

const PROMPT_EXPANSION_SYSTEM = `You are a minimal prompt editor for an image-editing pipeline. Your ONLY job is to add a single short sentence about photographic technical quality (camera sharpness, natural lighting, realistic detail) to the END of the given prompt.

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
      system: PROMPT_EXPANSION_SYSTEM,
      messages: [{ role: 'user', content: basePrompt }],
    });
    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text' || !textBlock.text.trim()) return basePrompt;
    return textBlock.text.trim();
  } catch (err) {
    console.error('[render] Prompt expansion failed, falling back to base prompt:', err);
    return basePrompt;
  }
}

async function generateImage(images: File[], prompt: string): Promise<string | null> {
  try {
    const openai = getOpenAI();
    const renderModel = process.env.RENDER_MODEL ?? 'gpt-image-1.5';

    const editParams: Record<string, unknown> = {
      model: renderModel,
      image: images.length === 1 ? images[0] : images,
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'high',
      output_format: 'png',
    };

    if (renderModel !== 'gpt-image-2') {
      editParams.input_fidelity = 'high';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (openai.images as any).edit(editParams);

    const b64 = response.data?.[0]?.b64_json as string | undefined;
    if (!b64) { console.error('[render] No b64_json in OpenAI response'); return null; }

    const buffer = Buffer.from(b64, 'base64');
    const filename = `renders/${Date.now()}-${randomUUID()}.png`;
    const blob = await put(filename, buffer, { access: 'public', contentType: 'image/png' });
    return blob.url;
  } catch (err) {
    console.error('[render] Render generation failed:', err);
    return null;
  }
}

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
    const { address, satelliteImageUrl, roofType, style, product, color, firstName, email, estimateRange } = body as {
      address: string;
      satelliteImageUrl: string;
      roofType: string;
      style: string | null;
      product: string | null;
      color: string | null;
      firstName?: string;
      email?: string;
      estimateRange?: string;
    };

    if (!address || !satelliteImageUrl || !roofType) {
      return NextResponse.json(
        { error: 'Missing required fields: address, satelliteImageUrl, roofType' },
        { status: 400 }
      );
    }

    const selection = resolveSelection(roofType, style ?? null, product ?? null, color ?? null);
    const roofTypeLabel = getRoofTypeLabel(roofType);

    let satelliteFile: File;
    try {
      satelliteFile = await fetchAsFile(satelliteImageUrl, 'satellite.jpg');
    } catch (err) {
      console.error('[render] Failed to fetch satellite image:', err);
      return NextResponse.json({ error: 'Could not fetch satellite image' }, { status: 400 });
    }

    let colorRefFile: File | null = null;
    if (selection.colorImagePath) {
      try {
        const colorRefUrl = new URL(selection.colorImagePath, req.nextUrl.origin).toString();
        colorRefFile = await fetchAsFile(colorRefUrl, 'color-reference.jpg');
      } catch (err) {
        console.error('[render] Failed to fetch color reference photo:', err);
      }
    }

    const streetViewAvailable = await checkStreetViewAvailable(address, mapsKey);
    let streetViewFile: File | null = null;
    if (streetViewAvailable) {
      try {
        const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${encodeURIComponent(address)}&key=${mapsKey}`;
        streetViewFile = await fetchAsFile(streetViewUrl, 'streetview.jpg');
      } catch (err) {
        console.error('[render] Failed to fetch Street View image:', err);
      }
    }

    const inputs = [satelliteFile, ...(streetViewFile ? [streetViewFile] : []), ...(colorRefFile ? [colorRefFile] : [])];
    const prompt = buildRenderPrompt(!!streetViewFile, roofTypeLabel, selection.productLabel, selection.color);
    const expandedPrompt = await expandRenderPrompt(prompt);
    const image = await generateImage(inputs, expandedPrompt);

    if (!image) {
      return NextResponse.json({ error: 'Render failed' }, { status: 500 });
    }

    // Fired via after() rather than awaited: the render-email webhook sits
    // behind WF1's ~45s GHL search-index wait chain, and the user shouldn't
    // have to watch that after their image is already done. after() keeps
    // this function instance alive until the callback settles (unlike a
    // bare unawaited promise, which can get killed the moment the response
    // is sent) — same reliability guarantee commit d5c7d4d2 wanted from
    // awaiting it, without blocking the response.
    after(() => fireRenderEmailWebhook({
      partial: true,
      leadOrigin: 'visualizer_render',
      email,
      firstName,
      renderUrl: image,
      estimateRange: estimateRange || '',
      roofType,
      roofColor: color || '',
    }));

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
