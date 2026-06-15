import { useState } from "react";

const brand = {
  colors: {
    primary: "#0A0A0A",
    surface: "#111111",
    card: "#1A1A1A",
    border: "#2A2A2A",
    accent: "#B8935A",
    accentLight: "#D4AE7A",
    accentDark: "#8C6A38",
    white: "#F5F2EC",
    muted: "#888880",
    text: "#E8E4DC",
  },
};

const Logo = ({ size = 1, dark = false }) => {
  const bg = dark ? "#F5F2EC" : "#0A0A0A";
  const fg = dark ? "#0A0A0A" : "#F5F2EC";
  const gold = "#B8935A";
  const w = 320 * size;
  const h = 90 * size;
  return (
    <svg width={w} height={h} viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Roof mark — angular M with ridge line */}
      <g>
        {/* Roof panel left */}
        <path d="M10 62 L38 20 L54 42 L38 42 Z" fill={gold} />
        {/* Roof panel right */}
        <path d="M54 42 L70 20 L82 62 L54 62 Z" fill={gold} opacity="0.75" />
        {/* Ridge cap line */}
        <line x1="38" y1="20" x2="70" y2="20" stroke={gold} strokeWidth="3" strokeLinecap="round"/>
        {/* Base line */}
        <line x1="10" y1="62" x2="82" y2="62" stroke={gold} strokeWidth="2" strokeLinecap="round"/>
        {/* Standing seam lines on left panel */}
        <line x1="28" y1="62" x2="44" y2="31" stroke={bg} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        <line x1="20" y1="62" x2="41" y2="26" stroke={bg} strokeWidth="1" strokeLinecap="round" opacity="0.2"/>
        {/* Standing seam lines on right panel */}
        <line x1="64" y1="62" x2="58" y2="31" stroke={bg} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        <line x1="74" y1="62" x2="61" y2="26" stroke={bg} strokeWidth="1" strokeLinecap="round" opacity="0.2"/>
      </g>
      {/* Wordmark */}
      <text x="98" y="40" fontFamily="'Georgia', 'Times New Roman', serif" fontSize="22" fontWeight="700" letterSpacing="3" fill={fg} style={{fontVariant: "small-caps"}}>METROPLEX</text>
      <text x="98" y="62" fontFamily="'Georgia', 'Times New Roman', serif" fontSize="15" fontWeight="400" letterSpacing="6" fill={gold}>METAL ROOFS</text>
      {/* Thin rule between name and tagline */}
      <line x1="98" y1="67" x2="310" y2="67" stroke={gold} strokeWidth="0.5" opacity="0.5"/>
      <text x="98" y="78" fontFamily="'Georgia', serif" fontSize="8" letterSpacing="2.5" fill={fg} opacity="0.5">DALLAS · FORT WORTH</text>
    </svg>
  );
};

const ColorSwatch = ({ hex, name, role }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <div style={{
      width: "100%", height: 80, background: hex,
      border: `1px solid ${brand.colors.border}`,
      borderRadius: 4,
    }} />
    <div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: brand.colors.text, fontWeight: 600 }}>{name}</div>
      <div style={{ fontSize: 11, color: brand.colors.muted, fontFamily: "monospace", letterSpacing: 1 }}>{hex}</div>
      <div style={{ fontSize: 11, color: brand.colors.muted, marginTop: 2 }}>{role}</div>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 64 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
      <div style={{ width: 3, height: 28, background: brand.colors.accent, borderRadius: 2 }} />
      <h2 style={{
        margin: 0, fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 22, fontWeight: 700, letterSpacing: 2,
        color: brand.colors.white, textTransform: "uppercase",
      }}>{title}</h2>
    </div>
    {children}
  </div>
);

const Card = ({ children, style }) => (
  <div style={{
    background: brand.colors.card,
    border: `1px solid ${brand.colors.border}`,
    borderRadius: 8, padding: 32,
    ...style,
  }}>
    {children}
  </div>
);

export default function BrandGuidelines() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "logo", label: "Logo" },
    { id: "colors", label: "Colors" },
    { id: "typography", label: "Typography" },
    { id: "voice", label: "Voice & Tone" },
    { id: "usage", label: "Usage" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: brand.colors.primary,
      color: brand.colors.text,
      fontFamily: "'Georgia', 'Times New Roman', serif",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${brand.colors.border}`,
        padding: "24px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky", top: 0,
        background: brand.colors.primary,
        zIndex: 10,
      }}>
        <Logo size={0.75} />
        <div style={{ fontSize: 11, color: brand.colors.muted, letterSpacing: 2, textTransform: "uppercase" }}>
          Brand Guidelines · 2026
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{
        borderBottom: `1px solid ${brand.colors.border}`,
        padding: "0 48px",
        display: "flex", gap: 0,
        overflowX: "auto",
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: "none", border: "none",
            padding: "16px 24px",
            cursor: "pointer",
            fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
            color: activeTab === t.id ? brand.colors.accent : brand.colors.muted,
            borderBottom: activeTab === t.id ? `2px solid ${brand.colors.accent}` : "2px solid transparent",
            fontFamily: "Georgia, serif",
            whiteSpace: "nowrap",
            transition: "color 0.2s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "48px", maxWidth: 1000, margin: "0 auto" }}>

        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: 64 }}>
              <div style={{ fontSize: 11, color: brand.colors.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>Brand Identity</div>
              <h1 style={{
                fontSize: 48, fontWeight: 700, margin: "0 0 24px",
                color: brand.colors.white, lineHeight: 1.1,
                fontFamily: "Georgia, serif",
              }}>The Standard for Metal<br />Roofing in DFW</h1>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: brand.colors.muted, maxWidth: 600, margin: 0 }}>
                Metroplex Metal Roofs is a premium metal roofing company serving the Dallas–Fort Worth metroplex. 
                The brand communicates architectural authority, permanence, and trust — positioned for affluent homeowners 
                who expect the best and know the difference.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 48 }}>
              {[
                { label: "Brand Archetype", value: "The Craftsman", sub: "Quality, mastery, precision" },
                { label: "Positioning", value: "Premium Authority", sub: "Not a vendor — an expert" },
                { label: "Tone", value: "Confident & Direct", sub: "Never boastful, always assured" },
              ].map(item => (
                <Card key={item.label}>
                  <div style={{ fontSize: 10, color: brand.colors.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 20, color: brand.colors.white, fontWeight: 700, marginBottom: 4 }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: brand.colors.muted }}>{item.sub}</div>
                </Card>
              ))}
            </div>

            <Card>
              <div style={{ fontSize: 10, color: brand.colors.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Brand Promise</div>
              <p style={{ fontSize: 20, color: brand.colors.white, fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>
                "A metal roof is a 50-year decision. We treat it like one."
              </p>
            </Card>
          </div>
        )}

        {activeTab === "logo" && (
          <div>
            <Section title="Primary Logo">
              <Card style={{ marginBottom: 24, display: "flex", justifyContent: "center", padding: "64px 48px" }}>
                <Logo size={1.1} />
              </Card>
              <p style={{ fontSize: 14, color: brand.colors.muted, lineHeight: 1.8, marginBottom: 32 }}>
                The Metroplex Metal Roofs logomark combines an angular roof glyph — built from the geometry of standing seam metal panels — with a refined serif wordmark. 
                The roof symbol references the ridge line and panel structure of the product itself. Never stretch, recolor, or separate the mark from the wordmark without explicit approval.
              </p>
            </Section>

            <Section title="Reversed (Light Background)">
              <Card style={{ background: brand.colors.white, marginBottom: 24, display: "flex", justifyContent: "center", padding: "64px 48px" }}>
                <Logo size={1.1} dark />
              </Card>
            </Section>

            <Section title="Clear Space & Minimum Size">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <Card>
                  <div style={{ fontSize: 12, color: brand.colors.accent, letterSpacing: 1, marginBottom: 12 }}>CLEAR SPACE RULE</div>
                  <p style={{ fontSize: 13, color: brand.colors.muted, lineHeight: 1.8, margin: 0 }}>
                    Always maintain clear space equal to the height of the "M" in METROPLEX on all four sides of the logo. 
                    No other graphic elements, text, or photography should enter this zone.
                  </p>
                </Card>
                <Card>
                  <div style={{ fontSize: 12, color: brand.colors.accent, letterSpacing: 1, marginBottom: 12 }}>MINIMUM SIZE</div>
                  <p style={{ fontSize: 13, color: brand.colors.muted, lineHeight: 1.8, margin: 0 }}>
                    Digital: 200px wide minimum<br />
                    Print: 1.5 inches wide minimum<br />
                    Icon-only mark: 32px minimum
                  </p>
                </Card>
              </div>
            </Section>

            <Section title="Logo Don'ts">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  "Don't stretch or distort",
                  "Don't use on busy backgrounds",
                  "Don't change the gold accent color",
                  "Don't use drop shadows",
                  "Don't rearrange elements",
                  "Don't use unapproved color variants",
                ].map(rule => (
                  <div key={rule} style={{
                    padding: "16px 20px",
                    border: `1px solid #3A2020`,
                    borderRadius: 6,
                    background: "#1A1010",
                    fontSize: 12, color: "#CC6666", lineHeight: 1.6,
                  }}>
                    <span style={{ marginRight: 8 }}>✕</span>{rule}
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {activeTab === "colors" && (
          <div>
            <Section title="Primary Palette">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 48 }}>
                <ColorSwatch hex="#0A0A0A" name="Forge Black" role="Primary background" />
                <ColorSwatch hex="#111111" name="Carbon" role="Surface / card bg" />
                <ColorSwatch hex="#B8935A" name="Aged Bronze" role="Primary accent" />
                <ColorSwatch hex="#F5F2EC" name="Parchment" role="Primary text / reversed bg" />
              </div>
            </Section>

            <Section title="Secondary Palette">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 48 }}>
                <ColorSwatch hex="#D4AE7A" name="Gold Light" role="Hover states, highlights" />
                <ColorSwatch hex="#8C6A38" name="Dark Bronze" role="Pressed states" />
                <ColorSwatch hex="#2A2A2A" name="Steel" role="Borders, dividers" />
                <ColorSwatch hex="#888880" name="Slate" role="Muted text, captions" />
              </div>
            </Section>

            <Section title="Color Usage Rules">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {[
                  { rule: "Aged Bronze on Black", use: "Primary CTAs, key headlines, logo accents. Never use more than 20% of any composition." },
                  { rule: "Parchment on Black", use: "Body text, headlines on dark backgrounds. The default text color for all dark-mode surfaces." },
                  { rule: "Black on Parchment", use: "Reversed logo, print materials, light-mode web contexts like estimate PDFs." },
                  { rule: "Never use pure white (#FFF)", use: "Use Parchment (#F5F2EC) instead. Pure white feels harsh and cheap against our palette." },
                ].map(item => (
                  <Card key={item.rule}>
                    <div style={{ fontSize: 13, color: brand.colors.accent, fontWeight: 700, marginBottom: 8 }}>{item.rule}</div>
                    <div style={{ fontSize: 13, color: brand.colors.muted, lineHeight: 1.7 }}>{item.use}</div>
                  </Card>
                ))}
              </div>
            </Section>
          </div>
        )}

        {activeTab === "typography" && (
          <div>
            <Section title="Primary Typeface — Display">
              <Card style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, color: brand.colors.accent, letterSpacing: 2, marginBottom: 24 }}>DISPLAY / HEADLINES</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 52, fontWeight: 700, color: brand.colors.white, lineHeight: 1.1, marginBottom: 16 }}>
                  Georgia Serif
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: brand.colors.accent, fontStyle: "italic", marginBottom: 24 }}>
                  The Last Roof You'll Ever Need
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {["H1 — 48–64px / 700", "H2 — 32–40px / 700", "H3 — 22–28px / 600"].map(s => (
                    <div key={s} style={{ fontSize: 12, color: brand.colors.muted }}>{s}</div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: "16px 20px", background: "#0F0F0F", borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: brand.colors.muted, marginBottom: 6 }}>WordPress / Web fallback stack:</div>
                  <div style={{ fontSize: 12, color: brand.colors.text, fontFamily: "monospace" }}>
                    font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
                  </div>
                </div>
              </Card>
            </Section>

            <Section title="Secondary Typeface — Body">
              <Card style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, color: brand.colors.accent, letterSpacing: 2, marginBottom: 24 }}>BODY / UI / LABELS</div>
                <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 28, fontWeight: 300, letterSpacing: 3, color: brand.colors.white, textTransform: "uppercase", marginBottom: 16 }}>
                  Futura / Jost / Outfit
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, color: brand.colors.muted, lineHeight: 1.8, maxWidth: 560, marginBottom: 20 }}>
                  Metal roofing is a lifetime investment. Our installation partners are vetted for metal-specific experience, 
                  licensed in Texas, and carry full liability coverage. Your home is protected from day one.
                </div>
                <div style={{ marginTop: 8, padding: "16px 20px", background: "#0F0F0F", borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: brand.colors.muted, marginBottom: 6 }}>Google Fonts recommendation:</div>
                  <div style={{ fontSize: 12, color: brand.colors.text, fontFamily: "monospace" }}>
                    font-family: 'Outfit', 'Jost', system-ui, sans-serif;
                  </div>
                </div>
              </Card>
            </Section>

            <Section title="Type Hierarchy">
              <Card>
                {[
                  { label: "Page Title / Hero", spec: "Cormorant Garamond · 60px · 700 · Tracking 2px", example: "Premium Metal Roofing" },
                  { label: "Section Headline", spec: "Cormorant Garamond · 36px · 700 · Tracking 1px", example: "Why Metal?" },
                  { label: "Subheadline", spec: "Outfit · 18px · 600 · Uppercase · Tracking 3px", example: "50-YEAR PERFORMANCE WARRANTY" },
                  { label: "Body Text", spec: "Outfit · 15–16px · 400 · Line-height 1.8", example: "Paragraph copy for website and marketing" },
                  { label: "Caption / Label", spec: "Outfit · 11px · 400 · Uppercase · Tracking 2px", example: "DALLAS · FORT WORTH" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", gap: 24, alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${brand.colors.border}` }}>
                    <div style={{ minWidth: 160, fontSize: 11, color: brand.colors.accent, letterSpacing: 1 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: brand.colors.muted, flex: 1 }}>{item.spec}</div>
                  </div>
                ))}
              </Card>
            </Section>
          </div>
        )}

        {activeTab === "voice" && (
          <div>
            <Section title="Brand Voice Principles">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
                {[
                  {
                    trait: "Authoritative, Not Arrogant",
                    desc: "We speak from expertise, not ego. We educate homeowners so they can make confident decisions — we don't talk down to them.",
                    do: "Standing seam metal roofs outperform asphalt in every DFW climate category.",
                    dont: "We're the best roofers in Dallas. Don't settle for less.",
                  },
                  {
                    trait: "Direct, Not Pushy",
                    desc: "We don't beg for the sale. We present the facts and let the product sell itself. Urgency comes from truth, not pressure.",
                    do: "Most DFW homeowners replace asphalt roofs every 15–20 years. A metal roof ends that cycle.",
                    dont: "Call NOW! Limited slots available! Don't miss out!",
                  },
                  {
                    trait: "Specific, Not Vague",
                    desc: "We use numbers, locations, and concrete details. Generalities erode trust with sophisticated buyers.",
                    do: "Metal roofing reduces cooling costs by 7–15% in Dallas summers due to thermal emissivity.",
                    dont: "Save money on energy bills with a new metal roof!",
                  },
                  {
                    trait: "Local, Not Generic",
                    desc: "We are a DFW company. We understand hail seasons, summer heat, Southlake HOAs, and Fort Worth neighborhoods.",
                    do: "After March hail in Frisco, we helped 12 homeowners upgrade from asphalt to standing seam.",
                    dont: "Serving homeowners across Texas and beyond.",
                  },
                ].map(item => (
                  <Card key={item.trait}>
                    <div style={{ fontSize: 15, color: brand.colors.white, fontWeight: 700, marginBottom: 8 }}>{item.trait}</div>
                    <div style={{ fontSize: 13, color: brand.colors.muted, lineHeight: 1.7, marginBottom: 20 }}>{item.desc}</div>
                    <div style={{ fontSize: 12, color: "#6A9A6A", background: "#0F1A0F", padding: "12px 16px", borderRadius: 6, marginBottom: 8, lineHeight: 1.6 }}>
                      <span style={{ opacity: 0.6, marginRight: 8 }}>✓ DO:</span>{item.do}
                    </div>
                    <div style={{ fontSize: 12, color: "#CC6666", background: "#1A0F0F", padding: "12px 16px", borderRadius: 6, lineHeight: 1.6 }}>
                      <span style={{ opacity: 0.6, marginRight: 8 }}>✕ DON'T:</span>{item.dont}
                    </div>
                  </Card>
                ))}
              </div>
            </Section>

            <Section title="Key Messaging Pillars">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                {[
                  { pillar: "Permanence", message: "The last roof you'll ever put on your home.", proof: "50+ year lifespan vs. 15–20 for asphalt" },
                  { pillar: "Financial Logic", message: "Insurance savings often offset the cost difference.", proof: "Up to 35% homeowner insurance discount" },
                  { pillar: "DFW Weather", message: "Built for hail, heat, and North Texas storms.", proof: "Class 4 impact resistance rating" },
                  { pillar: "Craftsmanship", message: "Every installer is vetted. Every job is inspected.", proof: "Metal-specific experience required" },
                  { pillar: "Visual Transformation", message: "See your home with a metal roof before you commit.", proof: "AI visualizer — no imagination required" },
                  { pillar: "Transparency", message: "You know exactly what you're paying for and why.", proof: "Itemized EagleView-based estimates" },
                ].map(item => (
                  <Card key={item.pillar}>
                    <div style={{ fontSize: 10, color: brand.colors.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{item.pillar}</div>
                    <div style={{ fontSize: 14, color: brand.colors.white, fontStyle: "italic", lineHeight: 1.5, marginBottom: 12 }}>"{item.message}"</div>
                    <div style={{ fontSize: 11, color: brand.colors.muted }}>{item.proof}</div>
                  </Card>
                ))}
              </div>
            </Section>
          </div>
        )}

        {activeTab === "usage" && (
          <div>
            <Section title="Digital Applications">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
                {[
                  { context: "Website Hero CTA", guidance: "Single primary CTA: 'See Your Home With a Metal Roof →' in Aged Bronze. Secondary CTA: 'Get a Free Estimate' in outline style. Never two filled CTAs side by side." },
                  { context: "Social Media", guidance: "Dark backgrounds only on all platforms. Logo mark (icon only) as profile photo. Gold accent on post graphics. Avoid white or light backgrounds — they dilute brand equity." },
                  { context: "Google Business Profile", guidance: "Cover photo: a completed DFW roof in our style. Profile name exactly: Metroplex Metal Roofs. Tagline: 'Premium Metal Roofing · DFW'" },
                  { context: "Email / GHL Sequences", guidance: "Plain-text style for personal touch in follow-up sequences. HTML emails for estimates and proposals use brand colors. Subject lines: specific, no emojis, no ALL CAPS." },
                ].map(item => (
                  <Card key={item.context}>
                    <div style={{ fontSize: 12, color: brand.colors.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>{item.context}</div>
                    <div style={{ fontSize: 13, color: brand.colors.muted, lineHeight: 1.8 }}>{item.guidance}</div>
                  </Card>
                ))}
              </div>
            </Section>

            <Section title="Print & Physical Materials">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                {[
                  { item: "Postcards", spec: "4×6 or 6×9. Dark background. One image (satellite aerial). One CTA with QR code to visualizer. No phone number on front — drive to digital first." },
                  { item: "Estimate PDF", spec: "Light background (Parchment). Logo top-left. Itemized table, clear totals. Bronze rule lines. No clip art or stock photos." },
                  { item: "Business Card", spec: "Matte black stock. Foil or spot UV on logo in gold. Name, phone, email, metroplexmetalroofs.com. Nothing else." },
                ].map(item => (
                  <Card key={item.item}>
                    <div style={{ fontSize: 12, color: brand.colors.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>{item.item}</div>
                    <div style={{ fontSize: 13, color: brand.colors.muted, lineHeight: 1.8 }}>{item.spec}</div>
                  </Card>
                ))}
              </div>
            </Section>

            <Section title="Photography Style">
              <Card>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#6A9A6A", letterSpacing: 1, marginBottom: 12 }}>✓ USE</div>
                    {[
                      "Aerial/drone shots of completed roofs on luxury homes",
                      "Detail shots: panel seams, ridge caps, copper flashing",
                      "Before/after aerial comparisons",
                      "Golden hour light on standing seam panels",
                      "DFW neighborhood context — recognizable architecture",
                    ].map(s => (
                      <div key={s} style={{ fontSize: 13, color: brand.colors.muted, padding: "6px 0", borderBottom: `1px solid ${brand.colors.border}`, lineHeight: 1.6 }}>{s}</div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#CC6666", letterSpacing: 1, marginBottom: 12 }}>✕ AVOID</div>
                    {[
                      "Stock photos of generic roofers or random trucks",
                      "Photos with visible competitor branding",
                      "Overexposed or low-quality phone photos",
                      "Crew shots without release forms",
                      "Images with visible safety violations",
                    ].map(s => (
                      <div key={s} style={{ fontSize: 13, color: brand.colors.muted, padding: "6px 0", borderBottom: `1px solid ${brand.colors.border}`, lineHeight: 1.6 }}>{s}</div>
                    ))}
                  </div>
                </div>
              </Card>
            </Section>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${brand.colors.border}`,
        padding: "24px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontSize: 11, color: brand.colors.muted, letterSpacing: 1 }}>© 2026 Metroplex Metal Roofs · All Rights Reserved</div>
        <div style={{ fontSize: 11, color: brand.colors.muted, letterSpacing: 1 }}>Brand Guidelines v1.0</div>
      </div>
    </div>
  );
}
