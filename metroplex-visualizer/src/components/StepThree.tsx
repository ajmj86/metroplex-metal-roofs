'use client';

import { useState, useRef, useEffect } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse and touch drag
  const handlePointerDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging || !containerRef.current) return;

    const handlePointerMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let clientX: number;

      if (e instanceof TouchEvent) {
        clientX = e.touches[0]?.clientX ?? 0;
      } else {
        clientX = (e as PointerEvent | MouseEvent).clientX;
      }

      const newX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (newX / rect.width) * 100));
      setSliderPosition(percentage);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('touchmove', handlePointerMove);
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchend', handlePointerUp);

    return () => {
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging]);

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

      {/* Side-by-Side Split Slider */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
            🛰️ Aerial View — Your New Roof
          </h3>
          <p className="text-muted text-sm">
            High-quality aerial perspective of your roof with {roofType.toLowerCase()} in {color.toLowerCase()}
          </p>
        </div>

        {/* Split Slider Container */}
        <div
          ref={containerRef}
          className="relative w-full bg-gray-200 rounded-lg overflow-hidden aspect-square cursor-col-resize select-none"
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
          style={{ userSelect: 'none' }}
        >
          {/* Left half: Before (Original Satellite) */}
          <div className="absolute inset-0">
            <img
              src={satelliteOriginalUrl}
              alt="Before - Original Satellite"
              className="w-full h-full object-cover pointer-events-none"
              draggable="false"
            />
            {/* "Before" label - pinned to top-left */}
            <div className="absolute top-4 left-4 bg-black/60 text-white text-sm font-semibold px-3 py-2 rounded pointer-events-none">
              Before
            </div>
          </div>

          {/* Right half: After (Rendered) - clipped from divider to right edge */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              left: `${sliderPosition}%`,
              right: 0,
            }}
          >
            <img
              src={satelliteRenderUrl}
              alt="After - Rendered Roof"
              className="w-full h-full object-cover pointer-events-none"
              draggable="false"
              style={{
                marginLeft: `-${sliderPosition}%`,
              }}
            />
            {/* "After" label - pinned to top-right */}
            <div className="absolute top-4 right-4 bg-black/60 text-white text-sm font-semibold px-3 py-2 rounded pointer-events-none">
              After
            </div>
          </div>

          {/* Vertical divider handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-opacity"
            style={{
              left: `${sliderPosition}%`,
              transform: 'translateX(-50%)',
              opacity: isDragging ? 1 : 0.7,
            }}
          />

          {/* Draggable thumb indicator */}
          <div
            className="absolute top-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-none"
            style={{
              left: `${sliderPosition}%`,
              transform: 'translate(-50%, -50%)',
              opacity: isDragging ? 1 : 0.8,
            }}
          >
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              {/* Left arrow */}
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* Right arrow */}
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '-12px' }} />
            </svg>
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
