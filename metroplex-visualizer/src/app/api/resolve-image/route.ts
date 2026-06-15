import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

const KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!KEY) {
      console.error('[resolve-image] GOOGLE_MAPS_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await req.json();
    const address: string = body?.address?.trim();

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const enc = encodeURIComponent(address);

    // Fetch satellite image only
    // Optimized parameters:
    // - zoom=20: Optimal zoom level for detailed roof visibility and framing
    // - size=400x400: Balanced size for faster loading while maintaining quality with scale=2
    // - scale=2: Doubles pixel density for sharper image (returns 800x800 effectively)
    // - maptype=satellite: Aerial view
    const satelliteUrl =
      `https://maps.googleapis.com/maps/api/staticmap` +
      `?center=${enc}&zoom=20&size=400x400&scale=2&maptype=satellite&key=${KEY}`;

    console.log('[resolve-image] Satellite URL:', satelliteUrl);

    const result: { 
      address: string;
      satellite: { imageUrl: string };
    } = {
      address,
      satellite: {
        imageUrl: satelliteUrl,
      },
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('[resolve-image]', err);
    return NextResponse.json({ error: 'Failed to resolve image' }, { status: 500 });
  }
}
