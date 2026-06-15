'use client';

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

      {/* Side-by-Side Before/After Layout */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
            🛰️ Aerial View — Your New Roof
          </h3>
          <p className="text-muted text-sm">
            High-quality aerial perspective of your roof with {roofType.toLowerCase()} in {color.toLowerCase()}
          </p>
        </div>

        {/* Before and After Side-by-Side */}
        <div className="flex gap-px bg-border rounded-lg overflow-hidden aspect-video">
          {/* Left: Before (Original) */}
          <div className="relative flex-1">
            <img
              src={satelliteOriginalUrl}
              alt="Before - Original Satellite"
              className="w-full h-full object-cover"
            />
            {/* "Before" label - top-left */}
            <div className="absolute top-4 left-4 bg-black/60 text-white text-sm font-semibold px-3 py-2 rounded">
              Before
            </div>
          </div>

          {/* Right: After (Rendered) */}
          <div className="relative flex-1">
            <img
              src={satelliteRenderUrl}
              alt="After - Rendered Roof"
              className="w-full h-full object-cover"
            />
            {/* "After" label - top-right */}
            <div className="absolute top-4 right-4 bg-black/60 text-white text-sm font-semibold px-3 py-2 rounded">
              After
            </div>
          </div>
        </div>

        <p className="text-muted text-sm mt-4">Before and after your new metal roof</p>
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
