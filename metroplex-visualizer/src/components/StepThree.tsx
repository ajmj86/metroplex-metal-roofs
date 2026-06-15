'use client';

import { useState } from 'react';

interface StepThreeProps {
  satelliteBeforeUrl: string;
  satelliteAfterUrl: string;
  streetviewBeforeUrl: string;
  streetviewAfterUrl: string | null;
  streetviewMaskValidation: any;
  address: string;
  roofType: string;
  color: string;
}

export function StepThree({
  satelliteBeforeUrl,
  satelliteAfterUrl,
  streetviewBeforeUrl,
  streetviewAfterUrl,
  streetviewMaskValidation,
  address,
  roofType,
  color,
}: StepThreeProps) {
  const [showSatelliteAfter, setShowSatelliteAfter] = useState(true);
  const [showStreetviewAfter, setShowStreetviewAfter] = useState(true);

  const streetviewRendered = !!streetviewAfterUrl;
  const streetviewSkipped = !streetviewRendered && streetviewMaskValidation?.maskFound === false;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-heading text-3xl font-semibold text-foreground mb-2">
          Your New Roof
        </h2>
        <p className="text-muted">
          <span className="font-medium">{roofType}</span>
          <span> in </span>
          <span className="font-medium">{color}</span>
        </p>
        <p className="text-muted text-sm mt-2">{address}</p>
      </div>

      {/* Satellite (Primary) */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
            🛰️ Aerial View — Your New Roof
          </h3>
          <p className="text-muted text-sm">
            High-quality aerial perspective of your roof with {roofType.toLowerCase()} in {color.toLowerCase()}
          </p>
        </div>

        {/* Before/After Slider for Satellite */}
        <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden aspect-square">
          {/* After image (always visible in background) */}
          <img
            src={satelliteAfterUrl}
            alt="Satellite Render After"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Before image with slider */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${showSatelliteAfter ? 50 : 0}%` }}
          >
            <img
              src={satelliteBeforeUrl}
              alt="Satellite Before"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: '200%' }}
            />
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize transition-all"
            style={{ left: `${showSatelliteAfter ? 50 : 0}%` }}
            onMouseDown={(e) => {
              const startX = e.clientX;
              const container = e.currentTarget.parentElement;
              if (!container) return;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const rect = container.getBoundingClientRect();
                const newX = moveEvent.clientX - rect.left;
                const percentage = (newX / rect.width) * 100;
                setShowSatelliteAfter(percentage < 50);
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            {/* Labels */}
            <div className="absolute inset-0 flex items-center justify-center">
              {showSatelliteAfter && (
                <div className="absolute left-2 top-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  Before
                </div>
              )}
              {!showSatelliteAfter && (
                <div className="absolute right-2 top-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  After
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-muted text-sm mt-4">Drag the slider to compare before and after</p>
      </div>

      {/* Street View (Secondary) */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          {streetviewRendered ? (
            <>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                📸 Street View (Experimental)
              </h3>
              <p className="text-muted text-sm">
                This is an experimental render — aerial view is our recommended primary view
              </p>
            </>
          ) : (
            <>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                📸 Your Home
              </h3>
              <p className="text-muted text-sm">
                {streetviewSkipped
                  ? 'Street View render was skipped due to image complexity. Aerial view is our best recommendation.'
                  : 'Original Street View photo of your home'}
              </p>
            </>
          )}
        </div>

        {streetviewRendered ? (
          // Before/After Slider for Street View
          <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden aspect-square">
            {/* After image */}
            <img
              src={streetviewAfterUrl}
              alt="Street View Render After"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Before image with slider */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${showStreetviewAfter ? 50 : 0}%` }}
            >
              <img
                src={streetviewBeforeUrl}
                alt="Street View Before"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: '200%' }}
              />
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize transition-all"
              style={{ left: `${showStreetviewAfter ? 50 : 0}%` }}
              onMouseDown={(e) => {
                const startX = e.clientX;
                const container = e.currentTarget.parentElement;
                if (!container) return;

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const rect = container.getBoundingClientRect();
                  const newX = moveEvent.clientX - rect.left;
                  const percentage = (newX / rect.width) * 100;
                  setShowStreetviewAfter(percentage < 50);
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              {/* Labels */}
              <div className="absolute inset-0 flex items-center justify-center">
                {showStreetviewAfter && (
                  <div className="absolute left-2 top-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    Before
                  </div>
                )}
                {!showStreetviewAfter && (
                  <div className="absolute right-2 top-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    After
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Just show the original photo
          <div className="w-full rounded-lg overflow-hidden">
            <img
              src={streetviewBeforeUrl}
              alt="Street View Original"
              className="w-full h-auto"
            />
          </div>
        )}

        {streetviewRendered && (
          <p className="text-muted text-sm mt-4">Drag the slider to compare before and after</p>
        )}
      </div>

      {/* Next Steps CTA */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 text-center">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          Love your new roof?
        </h3>
        <p className="text-muted text-sm mb-4">
          Contact Metroplex Metal Roofs to discuss your project and get a free estimate.
        </p>
        <a
          href="https://metroplexmetalroofs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
        >
          Get Your Free Estimate
        </a>
      </div>
    </div>
  );
}
