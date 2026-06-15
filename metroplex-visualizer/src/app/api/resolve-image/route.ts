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

    // 1. Check Street View metadata — avoids billing for a grey placeholder image
    const metaRes = await fetch(
      `https://maps.googleapis.com/maps/api/streetview/metadata?location=${enc}&key=${KEY}`
    );
    const meta = await metaRes.json();

    const result: { 
      address: string;
      streetview?: { imageUrl: string; available: boolean };
      satellite: { imageUrl: string };
    } = {
      address,
      satellite: {
        imageUrl:
          `https://maps.googleapis.com/maps/api/staticmap` +
          `?center=${enc}&zoom=21&size=800x500&maptype=satellite&key=${KEY}`,
      },
    };

    // 2. Try Street View
    if (meta.status === 'OK') {
      result.streetview = {
        imageUrl:
          `https://maps.googleapis.com/maps/api/streetview` +
          `?size=800x500&location=${enc}&fov=80&pitch=0&key=${KEY}`,
        available: true,
      };
    } else {
      result.streetview = {
        imageUrl: '',
        available: false,
      };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('[resolve-image]', err);
    return NextResponse.json({ error: 'Failed to resolve image' }, { status: 500 });
  }
}
