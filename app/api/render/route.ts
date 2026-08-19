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

// Same GHL contactId + conversations/messages SMS pattern as n8n Workflow 5
// ("New Lead Alert SMS"), called directly since this failure happens before
// any n8n workflow would ever get invoked.
const ANDREW_CONTACT_ID = 'cIvwP7gZ7JQX45gmU23Z';

async function alertAndrewOfRenderFailure(details: { firstName?: string; email?: string; address: string }): Promise<void> {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) { console.warn('[render] GHL_API_KEY not set — could not send failure alert'); return }
  const message = `⚠ Visualizer render failed for ${details.firstName || 'a lead'} (${details.email || 'no email'}) at ${details.address}. Check Vercel logs.`;
  try {
    const res = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contactId: ANDREW_CONTACT_ID, type: 'SMS', message }),
    });
    if (!res.ok) console.error('[render] alertAndrewOfRenderFailure got non-OK response:', res.status, await res.text());
  } catch (err) {
    console.error('[render] alertAndrewOfRenderFailure failed:', err);
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

// Real-world texture/silhouette per Brava profile -- these are composite
// tile/shake systems with a completely different visual silhouette than a
// flat metal panel, so reusing the generic metal-roofing prompt language
// for them would push the model toward rendering a metal-looking roof in
// the requested color instead of the actual product shape. Keyed by the
// roofProducts.json style key (spanish_barrel_tile/cedar_shake/slate).
const SYNTHETIC_SLATE_TEXTURE_BY_STYLE: Record<string, string> = {
  spanish_barrel_tile: 'a rounded, high-relief composite barrel tile roof with the distinctive curved, semi-cylindrical profile of Spanish/Mediterranean clay tile roofing — rows of individual barrel-shaped tiles, NOT flat panels and NOT metal standing seams',
  cedar_shake: 'a deeply textured, hand-split-look composite wood shake roof — an irregular, staggered wooden shingle profile with visible wood grain and organic, uneven tile edges — NOT flat panels and NOT uniform machine-cut shingles',
  slate: 'a crisp, dimensional composite slate tile roof made of individual rectangular slate tiles laid in courses, with visible butt-joint lines between tiles',
};

// premiumBlend/width kept as optional params (defaulting false/null) so
// callers that don't care about Synthetic Slate specifics don't need to
// pass them -- now wired to real values from RoofSelection now that
// lib/roofProducts.ts's width/premiumBlend support has shipped.
function buildMaterialDescription(
  roofType: string,
  style: string | null,
  productLabel: string | null,
  color: string | null,
  roofTypeLabel: string,
  premiumBlend: boolean = false,
  width: string | null = null
): string {
  if (roofType !== 'synthetic_slate') {
    return productLabel && color ? `${color} ${productLabel}` : `${roofTypeLabel} metal roofing`;
  }

  const texture = SYNTHETIC_SLATE_TEXTURE_BY_STYLE[style ?? ''] ?? 'a textured composite tile roof';
  let desc = `${color ? `${color} ` : ''}${productLabel ?? 'Brava synthetic slate'} — ${texture}`;

  // Independent flags -- a Slate color can be either, both, or neither.
  // Width only applies to Slate; the other two profiles never have a width
  // param at all (styleHasWidthVariants is false for them), so this branch
  // is simply skipped for Spanish Barrel Tile and Cedar Shake.
  //
  // Strengthened per real-render testing: the original "vary noticeably in
  // width... irregular, organic" phrasing was directionally correct but
  // rendered too subtly against Brava's own Multi-Width reference photos.
  // Replaced with a concrete, mechanical description of what the variation
  // actually looks like in-course (uneven joint-line spacing) rather than a
  // general adjective, and an explicit anti-uniformity instruction.
  if (style === 'slate') {
    desc += width === 'multi'
      ? `. This is Brava's Multi-Width Slate pattern: within each single horizontal course, individual tile widths vary noticeably and irregularly — some tiles noticeably narrow, others noticeably wide, mixed together in the same row with no repeating pattern — so the vertical joint lines between tiles fall at uneven, unpredictable intervals instead of lining up in a regular grid. This creates a visibly irregular, hand-laid rhythm across the roof, similar to authentic quarried slate where tile sizes are naturally inconsistent. The width variation must be clearly visible up close, not subtle — do not render this as a uniform-width tile pattern.`
      : `. This is Brava's Standard Slate pattern: the slate tiles are a consistent, uniform width across each course, with evenly spaced vertical joint lines forming a regular, orderly grid — a clean, uniform slate look, not the irregular varied-width pattern of Multi-Width Slate.`;
  }

  if (premiumBlend) {
    desc += ' This color is a genuine multi-tone blend — several distinct hues blended together across the tiles (not just lighter/darker shading within one color family), similar to natural stone with mixed mineral coloration. Render the color as multiple distinct blended tones, not a single flat or uniform color.';
  }

  return desc;
}

function buildRenderPrompt(
  useStreetView: boolean,
  roofTypeLabel: string,
  roofType: string,
  style: string | null,
  productLabel: string | null,
  color: string | null,
  premiumBlend: boolean = false,
  width: string | null = null
): string {
  const colorAndProductLabel = buildMaterialDescription(roofType, style, productLabel, color, roofTypeLabel, premiumBlend, width);

  // Fixed per real-render testing: camera framing (angle/zoom/crop) drifted
  // noticeably between independent calls of the same house. Root cause,
  // confirmed by re-reading this file rather than assumed: the old angle
  // instruction below ("elevated, drone-like perspective") was a vague,
  // abstractly-described TARGET look -- it is not, and was never meant to
  // be, copied from either reference image's own actual camera framing. The
  // satellite reference is a near-nadir straight-down shot (used only for
  // the home's shape/structure/layout, per the numbered instruction below)
  // and, when present, the Street View reference is ground-level (used only
  // for facade/color/detail, per its own numbered instruction) -- neither
  // matches the desired elevated 3/4 aerial look, and a flat top-down
  // nadir angle wouldn't showcase roof texture well anyway. So "lock the
  // framing" can't mean "match reference image N's camera" (there's no
  // single reference image with the target framing to anchor to); it has
  // to mean "describe one specific target vantage precisely enough that
  // independent renders converge on it," which is what AERIAL_FRAMING_TARGET
  // below does -- replacing the old vague phrase with a quantified
  // height/angle/distance/crop description, plus an explicit
  // don't-reinterpret-it-between-renders instruction.
  //
  // This also fixes a real contradiction that existed in the old
  // fidelityClause: it told the model camera angle/perspective must stay
  // "pixel-faithful to the reference images" while the separate angle
  // instruction told it to render from an elevated drone-like angle instead
  // -- directly conflicting whenever Street View (ground-level) was one of
  // the inputs. Camera framing is now governed solely by the aerial-target
  // instruction below; fidelityClause no longer claims camera angle should
  // match the references' own angles.
  // Added after a first round of live testing showed the height/tilt-angle
  // description above (still true, see AERIAL_FRAMING_TARGET) was not
  // enough on its own: two independent renders of the identical house and
  // material still drifted heavily because nothing constrained AZIMUTH --
  // which side/corner of the house the camera sits on. The vertical
  // angle/distance stayed roughly similar call to call, but the model was
  // free to orbit to a completely different side of the house each time,
  // which reads as far more dramatic framing drift than a zoom/tilt
  // difference alone. Fixed by anchoring azimuth to image 1 (the satellite
  // reference), which -- unlike the target elevation/tilt -- IS a real,
  // fixed, per-house reference the model can match: same relative
  // orientation of street/driveway/yard within the frame, same side of the
  // house facing the camera.
  const AERIAL_FRAMING_TARGET = `a fixed elevated aerial vantage: camera positioned as if hovering roughly 40-60 feet above ground level and off to one side of the house, looking down at approximately a 35-45 degree angle from horizontal (steep enough to clearly reveal the roof's material, texture, and dimensional profile — not a flat, straight-down satellite nadir view), framed so the entire home and roofline fill most of the image with a small, consistent margin of yard and surroundings visible on all sides`;
  // Reworded per regression found in live testing after daacadd6: the prior
  // wording ("keep the street/driveway/yard in the same relative position
  // within the frame ... as they appear in image 1", "orbiting ... just
  // tilted down ... instead of straight overhead") described image 1's own
  // nadir composition as the starting point and the elevated angle as a
  // minor adjustment to it, which pulled renders back toward a near-nadir
  // top-down look -- the exact "elevated 3/4 angle" regression this was
  // reported against. Azimuth (which side of the house the camera favors)
  // and elevation/tilt (the AERIAL_FRAMING_TARGET shot type, always
  // elevated, never nadir) are now stated as two independently-governed
  // properties rather than one derived from the other, with an explicit
  // "do not copy image 1's own angle" line.
  const framingLockClause = `Render from ${AERIAL_FRAMING_TARGET}. Use image 1, the satellite reference, ONLY to pick which side of the house the elevated camera favors: identify which side of the house faces the street/driveway in image 1, and position the elevated camera on that same side, looking toward that same side of the house, so the yard/street/driveway fall on the same relative side of the frame as in image 1. Do NOT copy image 1's own camera angle, height, tilt, or overall top-down composition — image 1 is a near-nadir straight-down shot and is explicitly not the target framing; it is a directional reference only, for choosing which side of the house to shoot from, never for how elevated or tilted the shot itself is. This exact camera vantage — the elevated height, tilt angle, and distance from AERIAL_FRAMING_TARGET above, this same side-of-house choice, and this same crop — must be used consistently every time this house is rendered: do not zoom in tighter, pull back wider, change the tilt angle, switch to a different side of the house, drift toward a flatter/more-overhead angle, or otherwise reinterpret the framing between renders.`;

  // Hardened per Phase 12 Step 4: enumerates every non-roof element
  // explicitly rather than a short catch-all clause, and separately forbids
  // adding/removing/repositioning elements and changing lighting/time-of-day.
  // Camera framing is intentionally NOT included in this "stay pixel-faithful
  // to the reference images" list (see note above) -- it's governed by
  // framingLockClause instead, since the target vantage is deliberately
  // different from either reference image's own camera angle. Still
  // prompt-only (no mask) -- see the route's own top-of-file note on why
  // masked editing isn't a drop-in replacement here.
  // Added after real-render testing initially flagged a render for
  // fabricating a red truck, a stop sign, and trampolines not in the
  // reference images. Re-checked by actually fetching the real satellite/
  // Street View photos for the test address (not done at the time of the
  // original flag): the trampolines and red-colored vehicles turned out to
  // be genuinely present in the real satellite reference -- not fabricated.
  // That test address's two reference photos simply disagree with each
  // other (captured at different times, different cars parked out front),
  // and the model resolved that disagreement inconsistently render to
  // render -- a real but different problem than invention-from-nothing (see
  // the vehicle-source note left for a future decision at the bottom of
  // this function). The stop sign specifically was never re-confirmed
  // either way. This clause is kept as a general safeguard regardless --
  // "Do not add... any architectural element" (below) only ever covered the
  // house itself, never the yard/driveway/street, so unconstrained
  // prop/signage/landscaping invention was a real, unguarded gap even
  // though the original trigger case turned out to be a false positive.
  const noHallucinationClause = `Do not add any object, vehicle, sign, structure, or landscaping element that is not clearly visible in the reference images — no new vehicles, no new signage, no new yard structures or furniture, no new plantings. If you are uncertain whether something exists in the reference images, omit it rather than invent it.`;

  // Added after the noHallucinationClause test round surfaced a different,
  // more serious problem in one render: the new roof material bled onto a
  // neighboring house's roof, partially visible at the edge of frame --
  // not just the subject house's own roof. Nothing above scoped "change
  // ONLY the roofing material" to a specific house, so this closes that gap
  // explicitly.
  const houseScopeClause = `The roof material, color, and texture change applies ONLY to the primary/subject house identified in the reference images (the house whose roof is being replaced) — never to any neighboring house, garage, shed, or other structure visible elsewhere in the frame, even if only partially visible at the edge. Any other roof or structure in the image must keep its original, unmodified appearance exactly as shown in the reference images.`;

  const fidelityClause = `Change ONLY the roofing material, color, and texture, and only on the primary/subject house. Every other element must remain exactly as shown in the reference images: windows, doors, garage doors, siding material and color, trim, gutters, chimneys, landscaping, trees, driveway, walkways, fences, sky, and lighting direction and color temperature must all stay pixel-faithful to the reference images. Do not add, remove, or reposition any architectural element. ${noHallucinationClause} ${houseScopeClause} Do not change the time of day, weather, or shadow direction. Camera framing follows the aerial vantage instruction, not the reference images' own camera angles. The only permitted differences between the reference images and the final render are the roof's material, color, and texture on the primary/subject house, and the camera vantage as specified.`;

  // 2-image (no Street View) path only -- deliberately separate from
  // AERIAL_FRAMING_TARGET/framingLockClause above, which target an elevated
  // 3/4 angle. Confirmed via real-render A/B testing (see the "ALSO NOT YET
  // FIXED" note below this function) that the 2-image path can't reach that
  // elevated look regardless of prompt wording -- without a ground-level
  // reference photo, the model has no oblique view to draw from and falls
  // back toward the satellite's own near-nadir composition. Since fighting
  // that is a separate, harder problem left for a future phase, this clause
  // works WITH the near-nadir tendency instead of against it: keep the
  // angle close to straight-down (just a slight tilt, not an elevation
  // fight) but fix the actual complaint, which was crop/zoom -- the
  // satellite reference is zoomed out to show multiple lots, and that wide
  // framing was bleeding into the render along with the nadir angle. This
  // clause targets angle and crop as separate asks: keep the angle near the
  // satellite's own (slight tilt only), but zoom in tighter than the
  // satellite reference so the subject house and immediate lot dominate the
  // frame instead of neighboring properties and excess yard.
  const NEAR_NADIR_TIGHT_FRAMING_TARGET = `a near-overhead aerial vantage: camera positioned almost straight down but tilted only about 10-15 degrees off pure vertical (just enough to hint at the roof's dimensional profile and texture — not a perfectly flat orthographic top-down view, and NOT an elevated drone-style 3/4 angle), framed TIGHT: zoomed in so the subject house and its immediate lot (roofline, driveway, entryway, and close yard) fill nearly the entire frame, with only a thin, consistent margin of yard around the house — neighboring houses, adjacent lots, and the street should be cropped out or reduced to a small sliver at the frame's edge rather than taking up significant space`;
  const nearNadirFramingClause = `Render from ${NEAR_NADIR_TIGHT_FRAMING_TARGET}. Image 1, the satellite reference, is typically zoomed out further than this and shows more of the surrounding yard, neighboring lots, and street — do NOT match image 1's zoom level or crop; the final render must be noticeably tighter/more zoomed-in on the subject house than image 1 is. This exact framing — the same near-vertical tilt and the same tight, house-filling crop — must be used consistently every time this house is rendered: do not pull back wider, zoom in even tighter, change the tilt toward a flatter or more elevated angle, or otherwise reinterpret the framing between renders.`;

  if (useStreetView) {
    return `I'm giving you 3 reference images in order:
1. Aerial/satellite view of the house — use this as the primary reference for the home's true shape, structure, and layout
2. Street-level view of the house — use this to preserve the facade, windows, doorway, color, and architectural details exactly as shown
3. Close-up reference of the new roof material and color: ${colorAndProductLabel} — match this roof color and texture exactly

Using all three, render a single photorealistic image of this home with a new roof in the color and material shown in image 3. The result should look like a real estate listing photograph: natural daylight, true-to-life color, sharp architectural photography detail, accurate shadows, and realistic texture — not an illustration, painting, or stylized rendering. ${framingLockClause} Note this vantage differs intentionally from image 2's ground-level street view — image 2 is for facade/color/detail reference only, not for camera framing. ${fidelityClause} Stay as true to the actual shape, structure, and details of this specific house as possible. The final image must be photorealistic, not cartoonish or artificial-looking.`;
  }

  return `I'm giving you 2 reference images in order:
1. Aerial/satellite view of the house — use this as the reference for the home's true shape, structure, layout, and surroundings
2. Close-up reference of the new roof material and color: ${colorAndProductLabel} — match this roof color and texture exactly

Using both, render a single photorealistic image of this home with a new roof in the color and material shown in image 2. The result should look like a real estate listing photograph: natural daylight, true-to-life color, sharp architectural photography detail, accurate shadows, and realistic texture — not an illustration, painting, or stylized rendering. ${nearNadirFramingClause} ${fidelityClause} Stay as true to the actual shape, structure, and details of this specific house as possible. The final image must be photorealistic, not cartoonish or artificial-looking.`;
}

// NOT YET DECIDED (flagged during Phase 12 hallucination testing, not
// blocking): when the satellite and Street View references disagree on a
// transient detail -- observed concretely with parked vehicles, where the
// two real photos for one test address were captured at different times
// with different cars out front -- nothing in this file says which source
// should win, so the model resolves it inconsistently render to render.
// Options for a future pass: pick one source as authoritative for
// transient/movable details (Street View is usually the more recent
// capture), or accept it as a known limitation and document it for
// customer-facing expectations. Framing drift (see framingLockClause above)
// remains a separate, also-unresolved issue from this one.
//
// PARTIALLY ADDRESSED (found via real-render A/B testing while diagnosing
// the framingLockClause nadir regression above, fixed in a later pass): the
// no-Street-View, 2-image path (useStreetView=false -- satellite + color
// reference only) reliably stayed near-nadir even with the fixed
// framingLockClause and regardless of input_fidelity ('high' vs 'low'),
// tested on multiple real addresses/houses. The SAME house, SAME prompt,
// with a real Street View photo added as a 3rd reference image reliably
// produces the correct elevated 3/4 angle. Conclusion: the model needs an
// actual oblique/ground-level photographic reference among the inputs to
// depart from the satellite's own near-nadir composition -- prompt text
// alone does not seem to be enough when the satellite image is the only
// quasi-photographic reference available. Fighting the angle itself is a
// distinct, likely harder problem (no known second image source for
// addresses without Street View coverage) and remains unsolved. What WAS
// fixed: the 2-image path now has its own nearNadirFramingClause (see
// above) that accepts the near-nadir angle and instead fixes the crop --
// the satellite reference's wide, multi-lot zoom level was also bleeding
// into renders, which is what "too much yard/neighboring lots" complaints
// were actually about; nearNadirFramingClause explicitly tells the model
// to zoom in tighter than image 1 rather than matching its crop.

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

/*
 * Fidelity preservation is prompt-only today -- no `mask` param. Checked
 * (not assumed, Phase 12 Step 4): the installed openai SDK's ImageEditParams
 * DOES support `mask` for gpt-image-1.5 edits, but two things stop it from
 * being a drop-in improvement here: (1) per the SDK's own docs, "if there
 * are multiple images provided, the mask will be applied on the first
 * image" -- that's the satellite photo in this pipeline, not street view or
 * the color reference; (2) there is no roof-boundary detection anywhere in
 * this codebase, so there's no way to generate a real per-address mask PNG
 * (has to match `image`'s exact dimensions) without building a new
 * segmentation step first. Flagged as a real, separate future phase rather
 * than attempted here.
 */
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
    const { address, satelliteImageUrl, roofType, style, product, color, width, firstName, email, estimateRange } = body as {
      address: string;
      satelliteImageUrl: string;
      roofType: string;
      style: string | null;
      product: string | null;
      color: string | null;
      width?: 'standard' | 'multi' | null;
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

    // Re-enabled now that lib/roofProducts.ts's width/premiumBlend support
    // is being committed in the same push as this Synthetic Slate launch --
    // the earlier 4-arg call was a deliberate, temporary scope-down (see
    // buildMaterialDescription's note above) so this route could build
    // standalone against the pre-launch lib/roofProducts.ts. Without this,
    // the frontend's Multi-Width Slate selector would silently render as
    // Standard every time -- the selection would reach this endpoint and be
    // dropped on the floor.
    const selection = resolveSelection(roofType, style ?? null, product ?? null, color ?? null, width ?? null);
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
    const prompt = buildRenderPrompt(
      !!streetViewFile,
      roofTypeLabel,
      roofType,
      selection.style,
      selection.productLabel,
      selection.color,
      selection.premiumBlend,
      selection.width
    );
    const expandedPrompt = await expandRenderPrompt(prompt);
    const image = await generateImage(inputs, expandedPrompt);

    if (!image) {
      console.error('[render] FAILURE — no image produced, lead notified but no email will follow', {
        address, email, firstName, roofType, color,
      });
      after(() => alertAndrewOfRenderFailure({ firstName, email, address }));
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
