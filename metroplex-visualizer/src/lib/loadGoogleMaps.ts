// Minimal type shim — avoids requiring @types/google.maps as a dependency
declare global {
  interface Window {
    google: {
      maps: {
        LatLng: new (lat: number, lng: number) => unknown;
        LatLngBounds: new (sw: unknown, ne: unknown) => unknown;
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              types?: string[];
              componentRestrictions?: { country: string };
              bounds?: unknown;
              strictBounds?: boolean;
              fields?: string[];
            }
          ) => {
            getPlace: () => { formatted_address?: string };
            addListener: (event: string, handler: () => void) => { remove: () => void };
          };
        };
      };
    };
  }
}

let _promise: Promise<void> | null = null;

function waitForPlacesAPI(maxWaitMs = 5000): Promise<void> {
  const startTime = Date.now();
  
  return new Promise<void>((resolve, reject) => {
    const checkReady = () => {
      if (window.google?.maps?.places?.Autocomplete) {
        resolve();
      } else if (Date.now() - startTime > maxWaitMs) {
        reject(new Error('Google Maps Places API did not load within timeout'));
      } else {
        // Check again in 100ms
        setTimeout(checkReady, 100);
      }
    };
    
    checkReady();
  });
}

export function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.maps?.places?.Autocomplete) return Promise.resolve();
  if (_promise) return _promise;

  _promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    
    script.onload = () => {
      // The main script loaded, but places sublibraries might still be initializing
      // Wait for the Places API to be available
      waitForPlacesAPI()
        .then(() => resolve())
        .catch(reject);
    };
    
    script.onerror = () => {
      _promise = null;
      reject(new Error('Google Maps script failed to load'));
    };
    
    document.head.appendChild(script);
  });

  return _promise;
}
