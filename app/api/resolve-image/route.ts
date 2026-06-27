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

    const satelliteUrl =
      `https://maps.googleapis.com/maps/api/staticmap` +
      `?center=${enc}&zoom=20&size=400x400&scale=2&maptype=satellite&key=${KEY}`;

    return NextResponse.json({
      address,
      satellite: { imageUrl: satelliteUrl },
    });
  } catch (err) {
    console.error('[resolve-image]', err);
    return NextResponse.json({ error: 'Failed to resolve image' }, { status: 500 });
  }
}
