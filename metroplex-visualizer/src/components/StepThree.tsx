'use client';

import { useState } from 'react';

interface StepThreeProps {
  satelliteOriginalUrl: string;
  satelliteRenderUrl: string;
  address: string;
  roofType: string;
  color: string;
}

export function StepThree({
  satelliteOriginalUrl,
  satelliteRenderUrl,
  address,
  roofType,
  color,
}: StepThreeProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget.parentElement;
    if (!container) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const newX = moveEvent.clientX - rect.left;
      const percentage = (newX / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

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

      {/* Satellite Before/After Slider */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
            🛰️ Aerial View — Your New Roof
          </h3>
          <p className="text-muted text-sm">
            High-quality aerial perspective of your roof with {roofType.toLowerCase()} in {color.toLowerCase()}
          </p>
        </div>

        {/* Before/After Slider Container */}
        <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden aspect-square group">
          {/* Original (Before) - always in background on LEFT */}
          <img
            src={satelliteOriginalUrl}
            alt="Satellite Before"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Render (After) - visible from divider to RIGHT */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              left: `${sliderPosition}%`,
              right: 0,
            }}
          >
            <img
              src={satelliteRenderUrl}
              alt="Satellite After"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                left: `-${sliderPosition}%`,
              }}
            />
          </div>

          {/* Slider divider handle - single source of truth for position */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize hover:w-1.5 transition-all"
            style={{
              left: `${sliderPosition}%`,
              transform: 'translateX(-50%)',
            }}
            onMouseDown={handleMouseDown}
          />

          {/* "Before" label - always on LEFT */}
          <div className="absolute left-2 top-2 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none">
            Before
          </div>

          {/* "After" label - always on RIGHT */}
          <div className="absolute right-2 top-2 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none">
            After
          </div>
        </div>

        <p className="text-muted text-sm mt-4">Drag the slider to compare before and after</p>
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
          Get Your Free Estimate →
        </a>
      </div>
    </div>
  );
}
