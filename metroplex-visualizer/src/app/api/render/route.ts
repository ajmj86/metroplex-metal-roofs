import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ROOF_TYPES } from '@/types';

// Allow up to 60s for satellite render only
export const maxDuration = 60;

// Lazy-initialize so the module loads cleanly at build time without a key
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

function getRoofDetail(roofType: string): string {
  const match = ROOF_TYPES.find(
    (rt) => rt.label.toLowerCase() === roofType.toLowerCase()
  );
  return match?.detail ?? 'clean, modern metal panels';
}

// ============================================================================
// Helper: Build Render Prompt
// ============================================================================

function buildRoofRenderPrompt(roofType: string, color: string, colorHex: string, detail: string): string {
  return (
    `This is an aerial satellite view of a residential home. Replace ONLY the roof surface with ${roofType} metal roofing in ${color} (${colorHex}). ${detail}.\\n` +
    `Keep all other elements — yard, driveway, pool, surrounding houses, trees — completely unchanged.\\n` +
    `CRITICAL: Preserve EXACTLY: grass, landscaping, shadows, lighting, camera angle, perspective, all proportions. Do NOT generate a fake house or alter the ground/surroundings.`
  );
}

// ============================================================================
// Helper: Generate AI Render
// ============================================================================

async function generateRoofRender(
  imageFile: File,
  prompt: string
): Promise<string | null> {
  try {
    const openai = getOpenAI();
    
    console.log('[render] Generating satellite render...');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (openai.images as any).edit({
      model: 'gpt-image-1',
      image: imageFile,
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'high',
    });

    const b64 = response.data?.[0]?.b64_json as string | undefined;
    if (!b64) {
      console.error('[render] No b64_json in OpenAI response');
      return null;
    }

    return `data:image/png;base64,${b64}`;
  } catch (err) {
    console.error('[render] Satellite generation failed:', err);
    return null;
  }
}

// ============================================================================
// Main Handler — Satellite Only
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('[render] OPENAI_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await req.json();
    const {
      satelliteImageUrl,
      roofType,
      color,
      colorHex,
    } = body as {
      satelliteImageUrl: string;
      roofType: string;
      color: string;
      colorHex: string;
    };

    if (!satelliteImageUrl || !roofType || !color || !colorHex) {
      return NextResponse.json(
        { error: 'Missing required fields: satelliteImageUrl, roofType, color, colorHex' },
        { status: 400 }
      );
    }

    const roofDetail = getRoofDetail(roofType);
    const prompt = buildRoofRenderPrompt(roofType, color, colorHex, roofDetail);

    console.log('[render] Render Request');
    console.log('[render] Roof Type:', roofType);
    console.log('[render] Color:', color, colorHex);
    console.log('[render] Prompt:');
    console.log(prompt);

    // ========================================================================
    // Fetch Satellite Image (Required)
    // ========================================================================

    let satelliteBuffer: ArrayBuffer | null = null;
    let satelliteMimeType = 'image/jpeg';

    try {
      const satRes = await fetch(satelliteImageUrl);
      if (!satRes.ok) throw new Error(`Status ${satRes.status}`);
      satelliteBuffer = await satRes.arrayBuffer();
      satelliteMimeType = satRes.headers.get('content-type') ?? 'image/jpeg';
      console.log('[render] Satellite image fetched:', satelliteBuffer.byteLength, 'bytes');
    } catch (err) {
      console.error('[render] Failed to fetch satellite image:', err);
      return NextResponse.json({ error: 'Could not fetch satellite image' }, { status: 400 });
    }

    // ========================================================================
    // Render Satellite (Primary - Only Render)
    // ========================================================================

    console.log('[render] === SATELLITE RENDER ===');

    const satelliteFile = new File([satelliteBuffer], 'satellite.jpg', { type: satelliteMimeType });
    const satelliteRenderUrl = await generateRoofRender(satelliteFile, prompt);

    if (!satelliteRenderUrl) {
      return NextResponse.json({ error: 'Satellite render failed' }, { status: 500 });
    }

    console.log('[render] Satellite render successful');

    // ========================================================================
    // Build Response (Satellite Only)
    // ========================================================================

    const response = {
      satellite: {
        original: satelliteImageUrl,
        render: satelliteRenderUrl,
      },
    };

    console.log('[render] Response prepared');
    return NextResponse.json(response);
  } catch (err) {
    console.error('[render]', err);
    const message = err instanceof Error ? err.message : 'Render failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
