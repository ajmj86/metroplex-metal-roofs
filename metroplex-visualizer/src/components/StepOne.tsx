'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { loadGoogleMapsScript } from '@/lib/loadGoogleMaps';
import type { ImageSource } from '@/types';

interface StepOneProps {
  onComplete: (address: string, satelliteUrl: string) => void;
}

// Bounding box that covers all of Texas (biases autocomplete, not a hard clip)
const TEXAS_SW = [25.837164, -106.645646] as const;
const TEXAS_NE = [36.500704, -93.508292] as const;

export function StepOne({ onComplete }: StepOneProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [images, setImages] = useState<{
    satellite?: { imageUrl: string };
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const acRef = useRef<{
    getPlace: () => { formatted_address?: string };
    addListener: (event: string, handler: () => void) => { remove: () => void };
  } | null>(null);
  const listenerRef = useRef<{ remove: () => void } | null>(null);

  // Initialize Google Places Autocomplete once the component mounts
  useEffect(() => {
    console.log('useEffect running');
    let mounted = true;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    console.log('apiKey truthy:', !!apiKey);
    console.log('inputRef.current exists:', !!inputRef.current);
    if (!apiKey || !inputRef.current) {
      console.log('Early return: missing apiKey or inputRef');
      return;
    }

    console.log('loading script');
    loadGoogleMapsScript(apiKey)
      .then(() => {
        console.log('script loaded');
        try {
          // Guard: component may have unmounted while the script was fetching
          if (!mounted) {
            console.log('Guard check failed: component unmounted');
            return;
          }
          console.log('Mounted check passed');
          
          console.log('Checking window.google.maps.places...');
          console.log('  window.google:', !!window.google);
          console.log('  window.google.maps:', !!window.google?.maps);
          console.log('  window.google.maps.places:', !!window.google?.maps?.places);
          
          if (!window.google?.maps?.places) {
            console.log('Guard check failed: missing Google Maps Places API');
            return;
          }
          
          // Re-check ref immediately before attaching — catches the Strict Mode
          // double-invoke case where the first mount's ref is null on remount
          if (!inputRef.current) {
            console.log('Guard check failed: inputRef.current is null on second check');
            return;
          }

          console.log('All guards passed, creating Autocomplete...');
          const sw = new window.google.maps.LatLng(TEXAS_SW[0], TEXAS_SW[1]);
          const ne = new window.google.maps.LatLng(TEXAS_NE[0], TEXAS_NE[1]);
          const texasBounds = new window.google.maps.LatLngBounds(sw, ne);

          const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
            componentRestrictions: { country: 'us' },
            bounds: texasBounds,
            strictBounds: false,
            fields: ['formatted_address'],
          });
          console.log('Autocomplete widget created');

          listenerRef.current = ac.addListener('place_changed', () => {
            console.log('place_changed fired');
            const place = ac.getPlace();
            if (place.formatted_address) {
              setAddress(place.formatted_address);
              setError('');
              setShowUpload(false);
              setImages(null);
            }
          });

          acRef.current = ac;
          console.log('Autocomplete initialized');
        } catch (err) {
          console.error('Autocomplete construction failed:', err);
          if (err instanceof Error) console.error(err.stack);
        }
      })
      .catch((err: unknown) => {
        console.log('Google Maps load error:', err);
      });

    return () => {
      mounted = false;
      listenerRef.current?.remove();
      listenerRef.current = null;
      acRef.current = null;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = address.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setImages(null);

    try {
      const res = await fetch('/api/resolve-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not find your address.');
      }

      const data = await res.json();
      setImages({
        satellite: data.satellite,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setShowUpload(true);
    } finally {
      setLoading(false);
    }
  };

  // When satellite image is fetched, proceed immediately (no view selection)
  const handleImageResolved = () => {
    if (!images) return;

    const satelliteUrl = images.satellite?.imageUrl || '';

    if (!satelliteUrl) {
      setError('Could not fetch satellite image.');
      return;
    }

    // Proceed with satellite only
    onComplete(address, satelliteUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10 MB.');
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Please upload a JPG or PNG file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onComplete(address.trim() || 'Uploaded photo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
      <h2 className="font-heading text-2xl font-semibold text-foreground mb-1">
        Enter Your Address
      </h2>
      <p className="text-muted text-sm mb-6">
        We'll pull a photo of your home to get started.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={inputRef}
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setError('');
            setShowUpload(false);
            setImages(null);
          }}
          placeholder="123 Main St, Dallas, TX 75201"
          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-sm"
          disabled={loading || !!images}
          autoComplete="off"
        />

        {error && !showUpload && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {!images && (
          <button
            type="submit"
            disabled={loading || !address.trim()}
            className="w-full bg-accent text-background font-semibold py-3 rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Finding your home…
              </span>
            ) : (
              'Visualize My Roof →'
            )}
          </button>
        )}
      </form>

      {/* Auto-proceed with satellite image */}
      {images && (
        <div className="mt-8 pt-6 border-t border-border space-y-4">
          <p className="text-foreground text-sm font-medium">🛰️ Fetched satellite view</p>

          {/* Preview Image */}
          <div className="relative bg-background rounded-lg overflow-hidden border border-border aspect-video">
            <img
              src={images.satellite?.imageUrl || ''}
              alt="Satellite Aerial View"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Auto-proceed Button */}
          <button
            onClick={handleImageResolved}
            className="w-full bg-accent text-background font-semibold py-3 rounded-xl hover:bg-accent/90 transition-colors text-sm"
          >
            See My Roof →
          </button>
        </div>
      )}

      {showUpload && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-foreground text-sm font-medium mb-1">Upload a photo instead</p>
          <p className="text-muted text-xs mb-4">{error}</p>
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/60 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted mb-2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-muted text-sm">JPG or PNG, max 10 MB</p>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
