import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ROOF_TYPES } from '@/types';

// Allow up to 120s on Vercel Pro for dual-render pipeline
export const maxDuration = 120;

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
    `CRITICAL: Edit ONLY the ROOF MATERIAL. NOTHING ELSE.\n` +
    `Preserve EXACTLY: brick/siding colors and texture, window frames, glass, doors, entryway, stairs, landscaping, trees, driveway, pavement, sky, clouds, shadows, lighting, camera angle, perspective, all proportions, all non-roof colors.\n` +
    `ONLY change: Replace the existing roof with ${roofType} in ${color} (${colorHex}). ${detail}.\n` +
    `The house structure, walls, foundation, and all elements below the roofline must remain completely unchanged. This is a SURGICAL roof-only replacement.`
  );
}

// ============================================================================
// Helper: Generate AI Render
// ============================================================================

async function generateRoofRender(
  imageFile: File,
  prompt: string,
  source: 'satellite' | 'streetview'
): Promise<string | null> {
  try {
    const openai = getOpenAI();
    
    console.log(`[render] Generating ${source} render...`);
    
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
      console.error(`[render] No b64_json in OpenAI response for ${source}`);
      return null;
    }

    return `data:image/png;base64,${b64}`;
  } catch (err) {
    console.error(`[render] ${source} generation failed:`, err);
    return null;
  }
}

// ============================================================================
// Helper: SAM3 Roof Mask Validation (placeholder)
// ============================================================================

interface MaskValidation {
  maskFound: boolean;
  areaPct: number;
  shouldRender: boolean;
  notes: string[];
}

async function validateStreetViewMask(imageFile: File): Promise<MaskValidation> {
  /**
   * Placeholder for SAM3 segmentation.
   * In production, this would:
   * 1. Run SAM3 on the image
   * 2. Return mask area percentage
   * 3. Check if area < 20%
   * 4. Return shouldRender decision
   * 
   * For now, we log that validation was attempted and return conservative defaults.
   */
  console.log('[render] Validating Street View mask (SAM3)...');
  
  // Conservative: For now, don't attempt Street View renders
  // This can be updated once SAM3 integration is complete
  return {
    maskFound: false,
    areaPct: 0,
    shouldRender: false,
    notes: [
      'SAM3 integration pending',
      'Skipping Street View render for safety',
      'Will display original photo only'
    ],
  };
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

    const body = await req.json();
    const {
      streetviewImageUrl,
      satelliteImageUrl,
      roofType,
      color,
      colorHex,
    } = body as {
      streetviewImageUrl?: string;
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
    // Fetch Images
    // ========================================================================

    let satelliteBuffer: ArrayBuffer | null = null;
    let satelliteMimeType = 'image/jpeg';

    let streetviewBuffer: ArrayBuffer | null = null;
    let streetviewMimeType = 'image/jpeg';

    // Fetch Satellite (required)
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

    // Fetch Street View (optional)
    if (streetviewImageUrl) {
      try {
        const svRes = await fetch(streetviewImageUrl);
        if (svRes.ok) {
          streetviewBuffer = await svRes.arrayBuffer();
          streetviewMimeType = svRes.headers.get('content-type') ?? 'image/jpeg';
          console.log('[render] Street View image fetched:', streetviewBuffer.byteLength, 'bytes');
        }
      } catch (err) {
        console.warn('[render] Failed to fetch Street View image (optional):', err);
      }
    }

    // ========================================================================
    // Satellite Render (Primary - Always Run)
    // ========================================================================

    console.log('[render] === SATELLITE PIPELINE (PRIMARY) ===');

    const satelliteFile = new File([satelliteBuffer], 'satellite.jpg', { type: satelliteMimeType });
    const satelliteRenderUrl = await generateRoofRender(satelliteFile, prompt, 'satellite');

    if (!satelliteRenderUrl) {
      return NextResponse.json({ error: 'Satellite render failed' }, { status: 500 });
    }

    // ========================================================================
    // Street View Render (Secondary - Conditional)
    // ========================================================================

    let streetviewRenderUrl: string | null = null;
    let streetviewMaskValidation: MaskValidation | null = null;

    if (streetviewBuffer) {
      console.log('[render] === STREET VIEW PIPELINE (OPTIONAL) ===');

      // Validate mask before attempting render
      const streetviewFile = new File([streetviewBuffer], 'streetview.jpg', { type: streetviewMimeType });
      streetviewMaskValidation = await validateStreetViewMask(streetviewFile);

      console.log('[render] Street View mask validation:');
      console.log('  - Mask found:', streetviewMaskValidation.maskFound);
      console.log('  - Area %:', streetviewMaskValidation.areaPct);
      console.log('  - Should render:', streetviewMaskValidation.shouldRender);
      console.log('  - Notes:', streetviewMaskValidation.notes.join('; '));

      if (streetviewMaskValidation.shouldRender) {
        console.log('[render] Proceeding with Street View render');
        streetviewRenderUrl = await generateRoofRender(streetviewFile, prompt, 'streetview');
        if (streetviewRenderUrl) {
          console.log('[render] Street View render successful');
        } else {
          console.log('[render] Street View render failed, will show original only');
        }
      } else {
        console.log('[render] Street View render skipped (mask validation failed)');
      }
    }

    // ========================================================================
    // Build Response
    // ========================================================================

    const response = {
      satellite: {
        original: satelliteImageUrl,
        render: satelliteRenderUrl,
        label: 'Aerial View — Your New Roof',
      },
      streetview: streetviewBuffer
        ? {
            original: streetviewImageUrl,
            render: streetviewRenderUrl,
            label: streetviewRenderUrl ? 'Street View (Experimental)' : 'Your Home',
            maskValidation: streetviewMaskValidation,
          }
        : null,
    };

    console.log('[render] Response prepared');
    return NextResponse.json(response);
  } catch (err) {
    console.error('[render]', err);
    const message = err instanceof Error ? err.message : 'Render failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
