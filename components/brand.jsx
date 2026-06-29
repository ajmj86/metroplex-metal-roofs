export const C = {
  black:"#09090A", surface:"#111113", card:"#18181B",
  border:"#27272A", borderLight:"#3F3F46",
  accent:"#B8935A", accentLight:"#D4AE7A", accentDark:"#8C6A38",
  white:"#F4F1EB", muted:"#71717A", mutedLight:"#A1A1AA", text:"#E4E0D8",
};

export const LEGAL_ENTITY = "Allied Roofing Partners LLC";
export const DBA_NAME     = "Metroplex Metal Roofs";
export const LEGAL_FULL   = `${DBA_NAME}, a DBA of ${LEGAL_ENTITY}`;
export const PHONE        = "(817) 382-3338";
export const EMAIL        = "help@metroplexmetalroofs.com";
export const WEBSITE      = "www.metroplexmetalroofs.com";
export const YEAR         = "2026";
export const MONTH        = "June";

export const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');`;

export const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  input { font-family: inherit; }
  strong { font-weight: 600; }
  p { margin-bottom: 16px; }
  p:last-child { margin-bottom: 0; }

  /* ── Responsive helpers ── */
  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); }
  .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; }
  .grid-2a { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; }
  .flex-row { display: flex; flex-direction: row; }
  .section-pad { padding: 100px 64px; }
  .hero-pad { padding: 140px 64px 80px; }
  .inner { max-width: 1200px; margin: 0 auto; }

  @media (max-width: 1024px) {
    .grid-4 { grid-template-columns: repeat(2,1fr); }
    .grid-3 { grid-template-columns: repeat(2,1fr); }
    .grid-2 { grid-template-columns: 1fr; }
    .grid-2a { grid-template-columns: 1fr 1fr; }
    .section-pad { padding: 72px 32px; }
    .hero-pad { padding: 120px 32px 72px; }
  }
  @media (max-width: 640px) {
    .grid-4 { grid-template-columns: 1fr; }
    .grid-3 { grid-template-columns: 1fr; }
    .grid-2a { grid-template-columns: 1fr; }
    .section-pad { padding: 56px 24px; }
    .hero-pad { padding: 188px 24px 56px; }
    .hide-mobile { display: none !important; }
    .nav-links { display: none !important; }
    .stat-border { border-right: none !important; border-bottom: 1px solid #27272A; }
    .muted-body { color: #A1A1AA !important; }
    .cta-btn {
      width: 100% !important;
      min-height: 48px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .trust-bar {
      flex-direction: column !important;
      flex-wrap: nowrap !important;
      align-items: flex-start !important;
      gap: 14px !important;
    }
  }
  @media (min-width: 1440px) {
    .section-pad { padding: 120px 80px; }
    .hero-pad { padding: 160px 80px 100px; }
    .nav-logo svg { transform: scale(1.143); transform-origin: left center; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;

export const Logo = ({ size=1, light=false }) => {
  const fg = light ? C.black : C.white;
  const gold = C.accent;
  return (
    <svg width={240*size} height={66*size} viewBox="0 0 240 66" fill="none" style={{display:"block"}}>
      <path d="M6 48 L26 14 L40 32 L26 32 Z" fill={gold}/>
      <path d="M40 32 L54 14 L64 48 L40 48 Z" fill={gold} opacity="0.72"/>
      <line x1="26" y1="14" x2="54" y2="14" stroke={gold} strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="6"  y1="48" x2="64" y2="48" stroke={gold} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="19" y1="48" x2="33" y2="23" stroke={light?"#FFF":"#000"} strokeWidth="0.7" opacity="0.25" strokeLinecap="round"/>
      <line x1="52" y1="48" x2="46" y2="23" stroke={light?"#FFF":"#000"} strokeWidth="0.7" opacity="0.25" strokeLinecap="round"/>
      <text x="76" y="28" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="16" fontWeight="700" letterSpacing="3" fill={fg}>METROPLEX</text>
      <text x="76" y="44" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="11" fontWeight="400" letterSpacing="5" fill={gold}>METAL ROOFS</text>
      <line x1="76" y1="49" x2="233" y2="49" stroke={gold} strokeWidth="0.4" opacity="0.4"/>
      <text x="76" y="59" fontFamily="'Outfit',sans-serif" fontSize="7" letterSpacing="2.5" fill={fg} opacity="0.38">DALLAS · FORT WORTH</text>
    </svg>
  );
};
