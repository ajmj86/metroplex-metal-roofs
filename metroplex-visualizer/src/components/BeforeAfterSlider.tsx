'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
}

export function BeforeAfterSlider({ beforeUrl, afterUrl }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const clamp = (v: number) => Math.max(2, Math.min(98, v));

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging.current) updatePosition(e.clientX); };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl select-none cursor-ew-resize"
      style={{ aspectRatio: '8 / 5' }}
      onMouseDown={(e) => { isDragging.current = true; updatePosition(e.clientX); }}
      onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
      onTouchMove={(e) => { e.preventDefault(); updatePosition(e.touches[0].clientX); }}
    >
      {/* After (AI render) — full width base layer */}
      <img
        src={afterUrl}
        alt="After"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before (original) — clipped to [0%, position%] (left side) */}
      <div className="absolute inset-0 overflow-hidden" style={{ left: 0, right: `${100 - position}%` }}>
        <img
          src={beforeUrl}
          alt="Before"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Divider line + handle */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/80 pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center">
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
            <path d="M1 5h16M1 5L4 2M1 5L4 8M17 5L14 2M17 5L14 8" stroke="#09090A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full pointer-events-none">
        Before
      </div>
      <div className="absolute bottom-3 right-3 bg-black/55 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full pointer-events-none">
        After
      </div>
    </div>
  );
}
