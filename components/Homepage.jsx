'use client'

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { C, LEGAL_ENTITY, DBA_NAME, PHONE, YEAR, fonts, globalStyles, Logo } from "./brand";
import { SiteFooter } from "./SiteFooter";
import Counter from '@/components/Counter'
import ProductGallery from '@/components/ProductGallery'
import {
  STANDING_SEAM_COLORS, R_PANEL_COLORS, STONE_COLORS, STONE_PROFILE_TILES, STONE_SHINGLE_TILES,
  COPPER_PATINA_CHIPS, COPPER_INSTALL_PHOTOS,
} from '@/lib/productColors'
import { ASSESSMENT_CATEGORIES } from '@/lib/assessment'

/* ── Image Placeholder ── */
const ImgPlaceholder = ({ label, tag, style={} }) => (
  <div style={{
    background:`linear-gradient(135deg,${C.card} 0%,#1F1A14 100%)`,
    border:`1.5px dashed ${C.accentDark}`,
    borderRadius:6,
    display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", gap:10,
    position:"relative", overflow:"hidden",
    minHeight:220,
    ...style,
  }}>
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.06}} preserveAspectRatio="none">
      <defs><pattern id="hatch" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="20" stroke={C.accent} strokeWidth="1"/>
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#hatch)"/>
    </svg>
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{opacity:0.45,flexShrink:0}}>
      <rect x="2" y="6" width="28" height="20" rx="2" stroke={C.accent} strokeWidth="1.5"/>
      <circle cx="11" cy="13" r="3" stroke={C.accent} strokeWidth="1.5"/>
      <path d="M2 22 L9 15 L15 21 L21 16 L30 24" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <div style={{fontSize:11,color:C.accentDark,letterSpacing:1.5,textTransform:"uppercase",textAlign:"center",padding:"0 20px",lineHeight:1.5,position:"relative"}}>{label}</div>
    {tag && <div style={{fontSize:9,color:C.muted,letterSpacing:1,textTransform:"uppercase",textAlign:"center",padding:"0 16px",position:"relative"}}>{tag}</div>}
  </div>
);

/* ── Reveal on scroll ── */
const Reveal = ({ children, delay=0 }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setVis(true); },{threshold:0.07});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);
  return (
    <div ref={ref} style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(22px)",transition:`opacity 0.65s ease ${delay}s,transform 0.65s ease ${delay}s`}}>
      {children}
    </div>
  );
};

/*
 * ── Product swatch chip / stone tile (circular thumbnail + persistent
 * name label, or "+N" overflow). size="tile" is used for the larger
 * stone profile/sub-tiles (only 4 or 2 at a time); size="chip" (default)
 * is used for the flat standing/copper/r-panel rows.
 * No native `title` tooltip — the label below the circle is always
 * visible, so there's nothing for a hover tooltip to add.
 */
const SwatchChip = ({ chip, label, onClick, size="chip", badge }) => {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const displayName = label ? null : chip?.name;
  const wrapClass   = size === "tile" ? "swatch-tile-wrap"   : "swatch-chip-wrap";
  const circleClass = size === "tile" ? "swatch-tile-circle" : "swatch-chip-circle";
  return (
    <button
      onClick={onClick}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>{setHover(false);setPress(false);}}
      onMouseDown={()=>setPress(true)}
      onMouseUp={()=>setPress(false)}
      aria-label={label ? `${label} more colors` : (displayName || undefined)}
      className={wrapClass}
      style={{
        flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:8,
        background:"none", border:"none", padding:0, cursor:"pointer",
      }}
    >
      <span className={circleClass} style={{
        flexShrink:0, borderRadius:"50%",
        overflow:"hidden", position:"relative",
        display:"flex", alignItems:"center", justifyContent:"center",
        border:`1.5px solid ${hover?C.accent:C.border}`,
        boxShadow: hover ? `0 0 0 2px ${C.accent}66, 0 8px 18px rgba(0,0,0,0.4)` : "none",
        background: chip?.hex || C.card,
        color:C.mutedLight, fontSize:12, fontWeight:600,
        transform: press ? "scale(0.97)" : hover ? "scale(1.05)" : "scale(1)",
        transition:"transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
      }}>
        {label ? label : chip?.src && (
          <img src={chip.src} alt="" loading="lazy" decoding="async" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
        )}
      </span>
      <span style={{
        width:"100%", minHeight:"2.7em",
        display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden",
        fontFamily:"'Outfit',sans-serif", fontSize:12, lineHeight:1.35, letterSpacing:0.2,
        color:C.muted, textAlign:"center",
      }}>{displayName || " "}</span>
      {badge && (
        <span style={{
          fontFamily:"'Outfit',sans-serif", fontSize:11, letterSpacing:1, textTransform:"uppercase",
          color:C.accent, border:`1px solid ${C.accentDark}`, borderRadius:20, padding:"2px 9px",
          whiteSpace:"nowrap", marginTop:-2,
        }}>{badge}</span>
      )}
    </button>
  );
};



const NAV_LINKS = [
  {label:"About Us",      href:"/about"},
  {label:"Why Metal",     href:"#why-metal"},
  {label:"Our Products",  href:"#products"},
  {label:"Gallery",       href:"#gallery"},
  {label:"Our Process",   href:"#process"},
  {label:"Why Us",        href:"#standard"},
  {label:"Service Areas", href:"#service-areas"},
];

/* ── Nav ── */
const Nav = ({ scrolled }) => {
  const [mOpen, setMOpen] = useState(false);
  return (
    <>
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        height:84,
        background:"rgba(9,9,10,0.97)",
        backdropFilter:"blur(14px)",
        borderBottom:`1px solid ${C.border}`,
        transition:"all 0.35s ease",
        padding:"0 32px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
      }}>
        <div className="nav-logo" onClick={()=>{setMOpen(false);setTimeout(()=>window.scrollTo({top:0,behavior:"instant"}),50);}} style={{padding:0,flexShrink:0,cursor:"pointer"}}>
          <Logo size={1.25}/>
        </div>
        {/* Desktop links */}
        <div className="nav-links" style={{display:"flex",gap:28,alignItems:"center"}}>
          {NAV_LINKS.map(l=>(
            <a key={l.label} href={l.href}
              style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:C.mutedLight,fontWeight:500,transition:"color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.accent}
              onMouseLeave={e=>e.currentTarget.style.color=C.mutedLight}
            >{l.label}</a>
          ))}
          <a href="/estimate" style={{padding:"9px 22px",background:C.accent,color:C.black,fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"background 0.2s",whiteSpace:"nowrap"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
            onMouseLeave={e=>e.currentTarget.style.background=C.accent}
          >Free Estimate</a>
        </div>
        {/* Mobile hamburger */}
        <button onClick={()=>setMOpen(o=>!o)} style={{display:"none",padding:"8px",color:C.white,fontSize:22,lineHeight:1}} className="hide-desktop"
          aria-label="Menu">
          {mOpen ? "✕" : "☰"}
        </button>
        <style>{`@media(max-width:640px){.hide-desktop{display:flex !important;}}`}</style>
      </nav>
      {/* Mobile drawer */}
      {mOpen && (
        <div style={{position:"fixed",top:84,left:0,right:0,bottom:0,zIndex:199,background:"rgba(9,9,10,0.98)",display:"flex",flexDirection:"column",padding:"32px 24px",gap:4,overflowY:"auto"}}>
          {NAV_LINKS.map(l=>(
            <a key={l.label} href={l.href} onClick={()=>setMOpen(false)}
              style={{padding:"16px 0",fontSize:18,letterSpacing:2,textTransform:"uppercase",color:C.mutedLight,fontFamily:"'Cormorant Garamond',serif",borderBottom:`1px solid ${C.border}`}}
            >{l.label}</a>
          ))}
          <a href="/estimate" onClick={()=>setMOpen(false)} className="cta-btn" style={{marginTop:24,padding:"16px",background:C.accent,color:C.black,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:700,borderRadius:4,textAlign:"center"}}>
            Free Estimate
          </a>
        </div>
      )}
    </>
  );
};

/* ── Footer ── */
const Footer = ({ setActiveTab }) => <SiteFooter setActiveTab={setActiveTab}/>;

/* ═══════════════════════════════
   VISUALIZER GATE
   Step 1: address entry (free)
   Step 2: rendering animation
   Step 3: blurred result + A2P lead capture
   Step 4: confirmation
═══════════════════════════════ */
const VisualizerGate = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [addrError, setAddrError] = useState("");
  const [form, setForm] = useState({name:"",phone:"",email:"",smsConsent:false,emailConsent:false});
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleVisualize = () => {
    if(!address.trim()){ setAddrError("Please enter your property address."); return; }
    setAddrError("");
    setStep(2);
    setTimeout(()=>setStep(3), 2400);
  };

  const validateForm = () => {
    const e = {};
    if(!form.name.trim())  e.name  = "Name is required.";
    if(!form.phone.trim()) e.phone = "Phone number is required.";
    else if(!/^\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/.test(form.phone.replace(/\s/g,""))) e.phone = "Enter a valid 10-digit number.";
    if(!form.email.trim()) e.email = "Email is required.";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    return e;
  };

  const handleSubmit = () => {
    const e = validateForm();
    if(Object.keys(e).length){ setFormErrors(e); return; }
    setSubmitting(true);
    setTimeout(()=>{ setSubmitting(false); setStep(4); }, 1000);
  };

  const iStyle = (err) => ({
    width:"100%", background:C.surface, border:`1px solid ${err?"#F87171":C.border}`,
    borderRadius:4, padding:"12px 14px", color:C.white, fontSize:14,
    outline:"none", fontFamily:"'Outfit',sans-serif",
  });
  const Lbl = ({c}) => <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.muted,marginBottom:6}}>{c}</div>;
  const FErr = ({m}) => m ? <div style={{fontSize:11,color:"#F87171",marginTop:5}}>{m}</div> : null;
  const Checkbox = ({checked, onChange}) => (
    <div onClick={onChange} style={{width:18,height:18,borderRadius:3,border:`1.5px solid ${checked?C.accent:C.borderLight}`,background:checked?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,cursor:"pointer",transition:"all 0.15s"}}>
      {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke={C.black} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );

  if(step===1) return (
    <div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:6,display:"flex",gap:6,alignItems:"center",maxWidth:520,margin:"0 auto 10px",flexWrap:"wrap"}}>
        <div style={{flex:1,display:"flex",alignItems:"center",gap:10,padding:"10px 14px",minWidth:180}}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}><path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.49-2.01-4.5-4.5-4.5zm0 6.1c-.94 0-1.7-.76-1.7-1.7S7.06 4.2 8 4.2s1.7.76 1.7 1.7S8.94 7.6 8 7.6z" fill={C.muted}/></svg>
          <input value={address} onChange={e=>{setAddress(e.target.value);setAddrError("");}}
            onKeyDown={e=>e.key==="Enter"&&handleVisualize()}
            placeholder="Enter your home address…"
            style={{flex:1,background:"none",border:"none",outline:"none",color:C.white,fontSize:14}}/>
        </div>
        <button onClick={handleVisualize} className="cta-btn"
          style={{padding:"13px 22px",background:C.accent,color:C.black,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600,borderRadius:6,transition:"background 0.2s",whiteSpace:"nowrap"}}
          onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
          onMouseLeave={e=>e.currentTarget.style.background=C.accent}
        >Visualize →</button>
      </div>
      {addrError && <div style={{fontSize:11,color:"#F87171",marginBottom:6,textAlign:"center"}}>{addrError}</div>}
      <p style={{fontSize:11,color:C.muted,letterSpacing:0.4}}>No photo upload · Under 30 seconds · No obligation</p>
    </div>
  );

  if(step===2) return (
    <div style={{maxWidth:520,margin:"0 auto"}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"48px 32px",textAlign:"center"}}>
        <svg width="44" height="44" viewBox="0 0 44 44" style={{animation:"vspin 1.1s linear infinite",display:"inline-block",marginBottom:20}}>
          <circle cx="22" cy="22" r="18" stroke={C.border} strokeWidth="3" fill="none"/>
          <path d="M22 4 A18 18 0 0 1 40 22" stroke={C.accent} strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
        <style>{`@keyframes vspin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.white,marginBottom:8}}>Rendering your roof…</div>
        <div style={{fontSize:12,color:C.muted}}>Locating <span style={{color:C.accentLight}}>{address}</span></div>
      </div>
    </div>
  );

  if(step===3) return (
    <div style={{maxWidth:600,margin:"0 auto",textAlign:"left"}}>
      {/* Blurred preview */}
      <div style={{position:"relative",borderRadius:8,overflow:"hidden",marginBottom:20}}>
        <ImgPlaceholder label="Your rendered roof" style={{minHeight:240,filter:"blur(7px)",transform:"scale(1.04)",borderRadius:0,border:"none"}}/>
        <div style={{position:"absolute",inset:0,background:"rgba(9,9,10,0.6)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:`${C.accentDark}55`,border:`1px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🔓</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.white,fontWeight:700}}>Your render is ready</div>
          <div style={{fontSize:13,color:C.mutedLight}}>Enter your details below to view it</div>
        </div>
      </div>

      {/* Gate form */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"clamp(22px,4vw,36px)"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:C.white,marginBottom:6}}>Unlock Your Visualization</div>
        <p className="muted-body" style={{fontSize:16,color:C.muted,marginBottom:22,lineHeight:1.7}}>Enter your details to view your render and receive a free estimate.</p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div><Lbl c="Full Name *"/><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Jane Smith" style={iStyle(formErrors.name)}/><FErr m={formErrors.name}/></div>
          <div><Lbl c="Phone Number *"/><input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="(214) 555-0000" type="tel" style={iStyle(formErrors.phone)}/><FErr m={formErrors.phone}/></div>
        </div>
        <div style={{marginBottom:22}}>
          <Lbl c="Email Address *"/>
          <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="jane@email.com" type="email" style={iStyle(formErrors.email)}/>
          <FErr m={formErrors.email}/>
        </div>

        {/* ── A2P CONSENT ── */}
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:18,marginBottom:18,display:"flex",flexDirection:"column",gap:14}}>

          {/* SMS */}
          <label style={{display:"flex",gap:12,alignItems:"flex-start",cursor:"pointer"}}>
            <Checkbox checked={form.smsConsent} onChange={()=>setForm(f=>({...f,smsConsent:!f.smsConsent}))}/>
            <div style={{fontSize:16,color:C.mutedLight,lineHeight:1.75}}>
              I agree to receive SMS text messages from <strong style={{color:C.white}}>Metroplex Metal Roofs</strong> (Allied Roofing Partners LLC) at the number above, including estimate updates, consultation reminders, and project follow-ups. Message frequency varies. Msg &amp; data rates may apply. Reply <strong style={{color:C.white}}>STOP</strong> to cancel, <strong style={{color:C.white}}>HELP</strong> for help.
            </div>
          </label>

          {/* Email */}
          <label style={{display:"flex",gap:12,alignItems:"flex-start",cursor:"pointer"}}>
            <Checkbox checked={form.emailConsent} onChange={()=>setForm(f=>({...f,emailConsent:!f.emailConsent}))}/>
            <div style={{fontSize:16,color:C.mutedLight,lineHeight:1.75}}>
              I agree to receive emails from <strong style={{color:C.white}}>Metroplex Metal Roofs</strong> (Allied Roofing Partners LLC) regarding my estimate, project updates, and relevant roofing information. Unsubscribe at any time.
            </div>
          </label>
        </div>

        {/* Required disclosure box */}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"13px 15px",marginBottom:20}}>
          <p className="muted-body" style={{fontSize:16,color:C.muted,lineHeight:1.8,margin:0}}>
            <strong style={{color:C.mutedLight}}>Consent to receive SMS or email messages is not required</strong> to obtain a quote or receive services from Metroplex Metal Roofs. Uncheck either box above to opt out. By submitting you agree to our{" "}
            <a href="#" style={{color:C.accent,textDecoration:"underline"}}>Privacy Policy</a> and{" "}
            <a href="#" style={{color:C.accent,textDecoration:"underline"}}>Terms of Service</a>.
          </p>
        </div>

        <button onClick={handleSubmit} disabled={submitting} className="cta-btn"
          style={{width:"100%",minHeight:48,padding:"15px",background:submitting?C.accentDark:C.accent,color:C.black,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:700,borderRadius:4,cursor:submitting?"not-allowed":"pointer",transition:"background 0.2s"}}
          onMouseEnter={e=>{if(!submitting)e.currentTarget.style.background=C.accentLight;}}
          onMouseLeave={e=>{if(!submitting)e.currentTarget.style.background=C.accent;}}
        >{submitting?"Submitting…":"View My Roof Rendering →"}</button>
      </div>
    </div>
  );

  return (
    <div style={{maxWidth:520,margin:"0 auto"}}>
      <div style={{background:C.card,border:`1px solid ${C.accentDark}`,borderRadius:8,padding:"44px 32px",textAlign:"center"}}>
        <div style={{width:48,height:48,borderRadius:"50%",background:`${C.accentDark}44`,border:`1px solid ${C.accentDark}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:20,color:C.accent}}>✓</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:C.white,fontWeight:700,marginBottom:12}}>You're all set.</div>
        <p style={{fontSize:16,color:C.mutedLight,lineHeight:1.8,marginBottom:24}}>
          Your visualization is being prepared. Our team will follow up with your full render and free estimate — typically within one business day.
        </p>
        <div style={{fontSize:12,color:C.muted}}>Questions? <a href="tel:+18173823338" style={{color:C.accent}}>{PHONE}</a></div>
      </div>
    </div>
  );
};

/* ── Static data (module scope — no props/state dependency) ── */
const roofTypes = [
  {id:"stone",   label:"Stone-Coated Steel",  desc:"The look of architectural shingles with the strength of steel. Class 4 hail rating — ideal for HOA-governed DFW communities that require traditional aesthetics."},
  {id:"copper",  label:"Copper",              desc:"The most premium material in residential roofing. Develops a natural patina over decades, lasts 100+ years, and signals enduring quality. Ideal for estate-level homes or architectural accents."},
  {id:"standing",label:"Standing Seam Steel", desc:"The gold standard in metal roofing. Hidden fasteners, clean architectural lines, and a 50+ year lifespan. Preferred by luxury homebuilders and architects across DFW."},
  {id:"rpanel",  label:"R-Panel",             desc:"A proven exposed-fastener metal panel system offering exceptional durability and longevity. A straightforward entry into metal roofing without sacrificing long-term performance."},
];
const specMap = {
  standing:[{k:"Lifespan",v:"50–70 yrs"},{k:"Hail Rating",v:"Class 4"},{k:"Wind",v:"160 mph"},{k:"Fastener",v:"Hidden"}],
  copper:  [{k:"Lifespan",v:"100+ yrs"}, {k:"Patina",v:"Natural"},{k:"Wind",v:"160 mph"},{k:"Maintenance",v:"Near zero"}],
  stone:   [{k:"Lifespan",v:"40–70 yrs"},{k:"Hail Rating",v:"Class 4"},{k:"Wind",v:"120 mph"},{k:"Profile",v:"Shingle-style"}],
  rpanel:  [{k:"Lifespan",v:"40–60 yrs"},{k:"Hail Rating",v:"Class 4"},{k:"Wind",v:"120 mph"},{k:"Fastener",v:"Exposed"}],
};
const badgeMap = {standing:"Most Popular",copper:"Ultra Premium",stone:"HOA Friendly",rpanel:"Best Value"};

/* Single hero shot per material — replaces the old 4-up collage image. */
const heroMap = {
  standing: "/Installation Pics/Standing-Seam-Steel-True-Black.PNG",
  copper:   "/Installation Pics/Standing-Seam-Copper.PNG",
  stone:    "/Installation Pics/Stone-Coated-Steel-Pacific-Tile-Timberwood.jpg",
  // No install photo exists for R-Panel — swatch stand-in until real photography is shot.
  rpanel:   "/products/r_panel/true-black.jpg",
};
const visualizerRoofTypeMap = {
  standing: "standing_seam",
  copper:   "copper_standing_seam",
  stone:    "stone_coated_steel",
  rpanel:   "r_panel",
};

/*
 * roofProducts.json style/product keys for the swatch modal CTA's
 * passthrough params — flat materials have a single style/product pair,
 * stone varies by which tile the modal was opened from.
 */
const flatMaterialVisualizerParams = {
  standing: { style: "standing_seam", product: "standing_seam" },
  rpanel:   { style: "r_panel",       product: "r_panel" },
};
const stoneTileVisualizerParams = {
  "high-barrel":            { style: "high_barrel", product: "barrel_vault_tile" },
  "low-barrel":             { style: "low_barrel",  product: "pacific_tile" },
  "shake":                  { style: "shake",       product: "pine_crest_shake" },
  "cottage-shingle":        { style: "shingle",     product: "cottage_shingle" },
  "granite-ridge-shingle":  { style: "shingle",     product: "granite_ridge_shingle" },
};

/* ── Swatch row / modal data (see lib/productColors.js) ── */
const SWATCH_ROW_LIMIT = 6;
const swatchDataByTab = {
  standing: { full: STANDING_SEAM_COLORS, rowOverride: null,      caption: n => `Available in ${n} colors — view all` },
  rpanel:   { full: R_PANEL_COLORS,       rowOverride: null,      caption: n => `Available in ${n} colors — view all` },
  copper:   { full: COPPER_PATINA_CHIPS,  rowOverride: null,      caption: () => "One material. A finish that evolves for generations." },
};

/*
 * Stone is a two-level drill-down (profile tiles → shingle sub-tiles →
 * colors), handled separately from the flat swatchDataByTab materials.
 * See openStoneColorModal / stoneTileLevel in HomePage.
 */
const findStoneColor = (product, name) => STONE_COLORS.find(c => c.product === product && c.name === name);
const stoneProfileChips = STONE_PROFILE_TILES.map(t => {
  const previewItem = findStoneColor(t.previewProduct ?? t.product, t.previewName);
  return { key: t.key, name: t.label, src: previewItem?.src, previewItem };
});
const stoneShingleChips = STONE_SHINGLE_TILES.map(t => {
  const previewItem = findStoneColor(t.product, t.previewName);
  return { key: t.key, name: t.label, src: previewItem?.src, previewItem };
});
const stoneTileProductByKey = Object.fromEntries(
  [...STONE_PROFILE_TILES, ...STONE_SHINGLE_TILES].filter(t => t.product).map(t => [t.key, t.product])
);
const stats = [
  {val:50,  suffix:"+ yrs", label:"Roof Lifespan"},
  {val:35,  suffix:"%",     label:"Insurance Savings"},
  {val:25,  suffix:"%",     label:"Energy Cost Reduction"},
  {val:137, suffix:"%",     label:"ROI vs. Asphalt", note:"Based on 20-yr cost comparison: avoided replacement, insurance, and energy savings vs. upfront investment"},
];
const steps = [
  {n:"01",title:"Visualize Your Roof",   time:"~60 seconds",           href:"/visualizer",body:"Enter your address. Our AI visualizer pulls a street-level image of your home and renders it with your chosen metal roof style and color — before you commit to anything."},
  {n:"02",title:"Brief Consultation",    time:"15 minutes, this week", href:"https://api.leadconnectorhq.com/widget/booking/gG1ruFfEWkUXO7eIB8NR",body:"A quick call with our team. We confirm your home's scope, timeline, and whether metal is the right fit. No pressure, no obligation."},
  {n:"03",title:"Precision Proposal",    time:"Days, not weeks",       href:undefined,body:"We use satellite imaging to generate exact measurements for your roof, then complete your free 40-Point Roof & Structure Assessment on-site. Your proposal is built from those findings — a firm number, not a guess from the driveway."},
  {n:"04",title:"Expert Installation",   time:"Warrantied from day one",body:"Your roof is installed to manufacturer spec by a credentialed metal roofing specialist — licensed in Texas and fully insured — and covered by our 10-year workmanship warranty from day one."},
];
/*
 * Placeholder testimonials (Michael T., Jennifer R., David K.) removed —
 * FTC 2024 fake-review rule + Texas DTPA exposure until real reviews exist
 * post-WF4. Swap `credentials` below for a `reviews` array once real
 * customer reviews are collected; keep the #reviews id and section shape.
 */
const credentials = [
  {eyebrow:"Impact Rating",   label:"Class 4 Hail Rated",           body:"The highest impact rating UL tests for — engineered for DFW's hail climate, not just rated for it."},
  {eyebrow:"Wind Rating",     label:"Up to 160 MPH Wind Rated",     body:"Standing seam and copper systems rated well above anything DFW's storm season throws at a roof."},
  {eyebrow:"Coverage",        label:"10-Year Workmanship, In Writing", body:"Backed by manufacturer material warranties on every system — registered in your name, not a verbal promise."},
];
const cities = [
  "Southlake","Frisco","Westlake","Prosper","Celina",
  "McKinney","Allen","Plano","Colleyville","Keller",
  "Trophy Club","Flower Mound","Mansfield","Forney","Rockwall",
  "Midlothian","Waxahachie","Burleson","Lewisville","Coppell",
  "Richardson","Highland Village","Argyle","Northlake","Roanoke",
  "Grapevine","Anna","Fate","Royse City",
];
const galleryItems = [
  { src: "/Installation Pics/Standing-Seam-Steel-True-Black.PNG",                 label: "Standing Seam Metal - True Black" },
  { src: "/Installation Pics/Standing-Seam-Copper.PNG",                           label: "Standing Seam Copper", objectPosition: "center 75%" },
  { src: "/Installation Pics/Stone-Coated-Steel-Pacific-Tile-Timberwood.jpg",     label: "Stone-Coated Steel - Pacific Tile, Timberwood" },
  { src: "/Installation Pics/Stone-Coated-Steel-Pine-Crest Shake-Timberwood.PNG", label: "Stone-Coated Steel - Pine-Crest Shake, Timberwood" },
  { src: "/Installation Pics/Standing-Seam-Steel-Natural-Metal.jpg",              label: "Standing Seam Metal - Natural Metal" },
  { src: "/Installation Pics/Stone-Coated-Steel-Barrel-Vault-Tile-Barclay.PNG",   label: "Stone-Coated Steel - Barrel-Vault Tile, Barclay" },
];

/* ═══════════════════════════════
   HOME
═══════════════════════════════ */
const HomePage = ({ activeTab, setActiveTab }) => {

  const activeType = roofTypes.find(t=>t.id===activeTab);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [swatchModal, setSwatchModal] = useState(null); // { material, tileKey?, items, index } | null
  // Independent of swatchModal so it survives modal close (Back/Escape/backdrop) — see openStoneColorModal.
  const [stoneTileLevel, setStoneTileLevel] = useState("profiles"); // "profiles" | "shingle"

  const swatchData = activeTab !== "stone" ? swatchDataByTab[activeTab] : null;
  const swatchChips = swatchData ? (swatchData.rowOverride ?? swatchData.full).slice(0, SWATCH_ROW_LIMIT) : [];
  const swatchOverflow = swatchData ? swatchData.full.length - swatchChips.length : 0;

  const openSwatchModal = (tab, item) => {
    if (tab === "copper") {
      setSwatchModal({ material: "copper", items: [{ name: "Copper Patina" }], index: 0 });
      return;
    }
    const full = swatchDataByTab[tab].full;
    const idx = item ? Math.max(full.indexOf(item), 0) : 0;
    setSwatchModal({ material: tab, items: full, index: idx });
  };

  const openStoneColorModal = (tileKey, item) => {
    const product = stoneTileProductByKey[tileKey];
    const items = STONE_COLORS.filter(c => c.product === product);
    const idx = item ? Math.max(items.indexOf(item), 0) : 0;
    setSwatchModal({ material: "stone", tileKey, items, index: idx });
  };
  const handleStoneProfileChipClick = (chip) => {
    if (chip.key === "shingle") { setStoneTileLevel("shingle"); return; }
    // Tiles represent a product line, not a single color — always open at
    // color 0, regardless of which color happens to be the tile's thumbnail.
    openStoneColorModal(chip.key);
  };
  const handleStoneShingleChipClick = (chip) => {
    openStoneColorModal(chip.key);
  };

  const modalItem = swatchModal?.items?.[swatchModal.index];
  const swatchModalIsCopper = swatchModal?.material === "copper";
  // Style/product params: flat for standing/r-panel, keyed by the clicked
  // stone tile otherwise — undefined (and thus omitted) for copper.
  const swatchModalParams = swatchModal && !swatchModalIsCopper
    ? (swatchModal.material === "stone" ? stoneTileVisualizerParams[swatchModal.tileKey] : flatMaterialVisualizerParams[swatchModal.material])
    : null;
  const swatchModalHref = swatchModal && (
    swatchModalIsCopper
      ? `/visualizer?roofType=${visualizerRoofTypeMap.copper}`
      : `/visualizer?${new URLSearchParams({
          roofType: visualizerRoofTypeMap[swatchModal.material],
          ...(swatchModalParams ? { style: swatchModalParams.style, product: swatchModalParams.product } : {}),
          ...(modalItem?.name ? { color: modalItem.name } : {}),
        }).toString()}`
  );
  const swatchModalFooter = swatchModal && (
    <div style={{marginTop:20,paddingTop:20,borderTop:`1px solid ${C.border}`,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
      {!swatchModalIsCopper && (
        <div style={{fontSize:13,letterSpacing:0.5}}>
          {swatchModal.material === "stone" && modalItem?.product && (
            <span style={{color:C.accent,textTransform:"uppercase",fontSize:11,letterSpacing:2,marginRight:10}}>{modalItem.product}</span>
          )}
          <span style={{color:C.white,fontWeight:600,fontSize:16}}>{modalItem?.name}</span>
        </div>
      )}
      <a href={swatchModalHref} className="cta-btn"
        style={{display:"inline-flex",alignItems:"center",gap:8,padding:"13px 26px",background:C.accent,color:C.black,fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"background 0.2s"}}
        onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
        onMouseLeave={e=>e.currentTarget.style.background=C.accent}
      >{swatchModalIsCopper ? "Configure your copper roof →" : "See this color on your home →"}</a>
    </div>
  );

  const copperRenderItem = () => (
    <div style={{width:"100%",padding:"8px 4px",display:"flex",flexDirection:"column",gap:26,alignItems:"center"}}>
      <div style={{maxWidth:480}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:C.white,marginBottom:8}}>A Living Finish</div>
        <p style={{fontSize:14,color:C.mutedLight,lineHeight:1.7,margin:0}}>Copper isn't chosen from a color chart — it's one material whose surface evolves for decades.</p>
      </div>
      <div style={{width:"100%",maxWidth:480,padding:"0 8px"}}>
        <div style={{height:20,borderRadius:10,background:`linear-gradient(90deg, ${COPPER_PATINA_CHIPS[0].hex}, ${COPPER_PATINA_CHIPS[1].hex}, ${COPPER_PATINA_CHIPS[2].hex})`}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
          <span style={{fontSize:11,color:C.muted,letterSpacing:1}}>Year 1</span>
          <span style={{fontSize:11,color:C.muted,letterSpacing:1}}>~Year 10</span>
          <span style={{fontSize:11,color:C.muted,letterSpacing:1}}>Year 30+</span>
        </div>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
        {COPPER_INSTALL_PHOTOS.map(p => (
          <div key={p.src} style={{width:88,height:88,borderRadius:6,overflow:"hidden",flexShrink:0,border:`1px solid ${C.border}`}}>
            <img src={p.src} alt={p.name} loading="lazy" decoding="async" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
          </div>
        ))}
      </div>
    </div>
  );

  /*
   * Back always just closes the modal — stoneTileLevel lives outside
   * swatchModal state, so whichever tile screen was visible underneath
   * (profiles or shingle sub-tiles) is exactly what reappears. Escape and
   * the backdrop click use the same onClose, so they get this for free.
   */
  const stoneModalBack = swatchModal?.material === "stone" && (
    <button
      onClick={() => setSwatchModal(null)}
      aria-label="Back"
      style={{
        position:"absolute", top:24, left:24,
        background:"none", border:"none", color:"#F4F1EB",
        fontSize:11, letterSpacing:2, textTransform:"uppercase", fontWeight:600,
        cursor:"pointer", display:"flex", alignItems:"center", gap:6, padding:8,
        transition:"color 0.2s",
      }}
      onMouseEnter={e=>e.currentTarget.style.color="#D4AE7A"}
      onMouseLeave={e=>e.currentTarget.style.color="#F4F1EB"}
    >← Back</button>
  );

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-pad" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,zIndex:0,background:`linear-gradient(to bottom, rgba(9,9,10,0.82) 0%, rgba(9,9,10,0.70) 40%, rgba(9,9,10,0.88) 100%), url('/MMR Hero Pic.png') center/cover no-repeat`}}/>

        <div className="inner" style={{position:"relative",zIndex:1,width:"100%"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:12,marginBottom:28,animation:"fadeUp 0.8s ease both"}}>
            <div style={{width:28,height:1,background:C.accent,flexShrink:0}}/>
            <span style={{fontSize:"clamp(0.75rem,1.1vw,0.95rem)",letterSpacing:3.5,color:C.accent,textTransform:"uppercase",fontWeight:500}}>Premium Metal Roofing · Dallas–Fort Worth</span>
          </div>
          <h1 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(3.5rem,5.5vw,7rem)",fontWeight:700,lineHeight:1.05,color:C.white,marginBottom:24,maxWidth:720,animation:"fadeUp 0.8s ease 0.1s both"}}>
            The Last Roof<br/><span style={{color:C.accent,fontStyle:"italic"}}>You'll Ever Put On Your House</span>
          </h1>
          <p style={{fontSize:"clamp(1.125rem,1.3vw,1.1875rem)",lineHeight:1.8,color:C.mutedLight,maxWidth:480,marginBottom:40,fontWeight:500,animation:"fadeUp 0.8s ease 0.2s both"}}>
            For DFW homeowners done replacing their asphalt roof every decade.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center",animation:"fadeUp 0.8s ease 0.3s both"}}>
            <a href="/visualizer" className="cta-btn" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"15px 32px",background:C.accent,color:C.black,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"all 0.2s",whiteSpace:"nowrap"}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.accentLight;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.accent;}}
            >See Your Home With Metal →</a>
          </div>
          {/* Trust bar */}
          <div className="trust-bar" style={{display:"flex",gap:28,marginTop:48,flexWrap:"wrap",animation:"fadeUp 0.8s ease 0.4s both"}}>
            {["50-Year Lifespan","Up to 35% Insurance Discount","10-Year Workmanship Warranty"].map(t=>(
              <div key={t} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:C.accent,flexShrink:0}}/>
                <span style={{fontSize:12,color:C.muted}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF BAR (replaces placeholder testimonial pending real reviews) ── */}
      <div style={{background:C.card,borderTop:`1px solid ${C.border}`,padding:"clamp(36px,5vw,56px) 24px",textAlign:"center"}}>
        <div style={{maxWidth:680,margin:"0 auto",display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"14px 40px"}}>
          {["Rendered from your actual home, not a stock photo","Satellite-precision measurements","10-year workmanship warranty, in writing"].map(t=>(
            <div key={t} style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:C.accent,flexShrink:0}}/>
              <span style={{fontSize:13,color:C.mutedLight,letterSpacing:0.3}}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section style={{borderTop:`1px solid ${C.border}`,background:C.surface}}>
        <div className="inner grid-4">
          {stats.map((s,i)=>(
            <Reveal key={s.label} delay={i*0.07}>
              <div className="stat-border" style={{padding:"44px 32px",borderRight:i<3?`1px solid ${C.border}`:"none",textAlign:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(40px,4vw,52px)",fontWeight:700,color:C.accent,lineHeight:1,marginBottom:8}}>
                  <Counter to={s.val} suffix={s.suffix}/>
                </div>
                <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.muted}}>{s.label}</div>
                {s.note && (
                  <div style={{fontSize:10,color:C.muted,opacity:0.55,lineHeight:1.5,marginTop:8,maxWidth:170,marginLeft:"auto",marginRight:"auto"}}>
                    *{s.note}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <div style={{borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,background:C.surface,padding:"8px 24px",textAlign:"center"}}>
        <p style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:C.muted,maxWidth:640,margin:"8px auto",lineHeight:1.6}}>
          Figures represent industry estimates and vary by home, carrier, and installation. Individual results will vary, and actual savings are not guaranteed. Consult your insurance and utility providers for personalized savings.
        </p>
      </div>

      {/* ── ECONOMICS ── */}
      <section id="why-metal" className="section-pad" style={{background:C.black,borderTop:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
        {/* Subtle diagonal texture */}
        <div style={{position:"absolute",inset:0,backgroundImage:`repeating-linear-gradient(135deg,transparent,transparent 48px,${C.border}0A 48px,${C.border}0A 49px)`,pointerEvents:"none"}}/>
        <div className="inner" style={{position:"relative"}}>
          <Reveal>
            <div style={{textAlign:"center",marginBottom:64}}>
              <div style={{fontSize:15,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:14}}>The Real Math</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.875rem,4.8vw,4.5rem)",fontWeight:700,color:C.white,lineHeight:1.1,marginBottom:20}}>
                Why DFW Homeowners Are<br/><span style={{fontStyle:"italic",color:C.accent}}>Done With Asphalt</span>
              </h2>
              <p style={{fontSize:16,color:C.mutedLight,lineHeight:1.8,maxWidth:560,margin:"0 auto"}}>
                In a hail zone like Dallas–Fort Worth, asphalt roofing isn't a long-term asset — it's a recurring expense. Here's what the numbers actually look like.
              </p>
            </div>
          </Reveal>

          {/* Two-column comparison */}
          <div className="grid-2" style={{gap:3,marginBottom:48}}>
            {/* Asphalt column */}
            <Reveal delay={0}>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"clamp(28px,4vw,48px)",height:"100%"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:"#52525B",flexShrink:0}}/>
                  <div style={{fontSize:17,letterSpacing:2.5,textTransform:"uppercase",color:C.muted}}>Asphalt Shingle Roof</div>
                </div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3vw,32px)",fontWeight:700,color:C.white,marginBottom:32,lineHeight:1.2}}>
                  A cost you keep<br/>paying — forever.
                </div>
                {[
                  {icon:"↻", label:"Replacement cycle",    val:"Every 8–10 years in DFW's hail climate"},
                  {icon:"▲", label:"Insurance deductible", val:"2% of home value — and rising with home prices"},
                  {icon:"$", label:"On an $800K home",     val:"$16,000 deductible per claim — often exceeding replacement cost"},
                  {icon:"↑", label:"Trajectory",           val:"Deductibles and home values both trending up — your exposure grows every year"},
                ].map(item=>(
                  <div key={item.label} style={{display:"flex",gap:16,padding:"18px 0",borderBottom:`1px solid ${C.border}`,alignItems:"flex-start"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:C.card,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:C.muted,flexShrink:0,marginTop:2}}>{item.icon}</div>
                    <div>
                      <div style={{fontSize:12,letterSpacing:1.5,textTransform:"uppercase",color:C.muted,marginBottom:4}}>{item.label}</div>
                      <div style={{fontSize:16,color:C.text,lineHeight:1.6}}>{item.val}</div>
                    </div>
                  </div>
                ))}
                {/* Insight callout */}
                <div style={{marginTop:28,padding:"18px 20px",background:C.card,borderRadius:6,border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:16,color:C.mutedLight,lineHeight:1.7,fontStyle:"italic"}}>
                    When your deductible equals or exceeds what a replacement costs, insurance provides no real benefit for your roof — you're effectively self-insuring either way.
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Metal column */}
            <Reveal delay={0.1}>
              <div style={{background:C.card,border:`1px solid ${C.accentDark}`,borderRadius:8,padding:"clamp(28px,4vw,48px)",height:"100%",position:"relative",overflow:"hidden"}}>
                {/* Gold top bar */}
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${C.accentDark},${C.accent},${C.accentDark})`}}/>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:C.accent,flexShrink:0}}/>
                  <div style={{fontSize:17,letterSpacing:2.5,textTransform:"uppercase",color:C.accent}}>Metal Roof</div>
                </div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3vw,32px)",fontWeight:700,color:C.white,marginBottom:32,lineHeight:1.2}}>
                  One investment.<br/>Decades of returns.
                </div>
                {[
                  {icon:"∞", label:"Replacement cycle",     val:"Once. A quality metal roof outlasts the mortgage — and then some.", gold:true},
                  {icon:"▼", label:"Insurance premiums",    val:"Metal roofs qualify for significant carrier discounts in Texas hail zones.", gold:true},
                  {icon:"❄", label:"Energy savings",        val:"Metal's thermal properties reduce cooling costs — a real line item in DFW summers.", gold:true},
                  {icon:"◆", label:"Curb appeal & value",   val:"Clean lines, premium materials, and a profile that reads as intentional — not default. Metal roofing has become the standard on new construction across DFW's most sought-after communities.", gold:true},
                  {icon:"✓", label:"The 20–30 year picture", val:"When you account for avoided replacements, insurance premium savings, and energy reduction, metal typically pays for itself within the life of your home.", gold:true},
                ].map(item=>(
                  <div key={item.label} style={{display:"flex",gap:16,padding:"18px 0",borderBottom:`1px solid ${C.border}`,alignItems:"flex-start"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:item.gold?`${C.accentDark}44`:C.surface,border:`1px solid ${item.gold?C.accentDark:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:item.gold?C.accent:C.muted,flexShrink:0,marginTop:2}}>
                      {item.icon === '❄' ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="2" x2="12" y2="22"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/>
                          <line x1="12" y1="2" x2="9" y2="5"/>
                          <line x1="12" y1="2" x2="15" y2="5"/>
                          <line x1="12" y1="22" x2="9" y2="19"/>
                          <line x1="12" y1="22" x2="15" y2="19"/>
                          <line x1="2" y1="12" x2="5" y2="9"/>
                          <line x1="2" y1="12" x2="5" y2="15"/>
                          <line x1="22" y1="12" x2="19" y2="9"/>
                          <line x1="22" y1="12" x2="19" y2="15"/>
                        </svg>
                      ) : item.icon}
                    </div>
                    <div>
                      <div style={{fontSize:12,letterSpacing:1.5,textTransform:"uppercase",color:item.gold?C.accent:C.muted,marginBottom:4}}>{item.label}</div>
                      <div style={{fontSize:16,color:C.text,lineHeight:1.6}}>{item.val}</div>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:28,padding:"18px 20px",background:`${C.accentDark}22`,borderRadius:6,border:`1px solid ${C.accentDark}`}}>
                  <div style={{fontSize:16,color:C.accentLight,lineHeight:1.7,fontStyle:"italic"}}>
                    If you're already paying out of pocket every decade, the gap between asphalt and metal is smaller than most homeowners expect — and the gap in outcomes is enormous.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bottom summary bar */}
          <Reveal delay={0.15}>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
              {/* Social proof bar */}
              <div style={{borderBottom:`1px solid ${C.border}`,padding:"20px clamp(24px,4vw,48px)",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                <p style={{fontSize:16,color:C.mutedLight,margin:0,lineHeight:1.6,fontStyle:"italic"}}>
                  <span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:C.accent,marginRight:12,verticalAlign:"middle",flexShrink:0}}/>
                  Metal roofing is now standard on new construction across Prosper, Celina, Westlake, and Southlake. Existing homeowners in these communities are making the same upgrade — and it shows.
                </p>
              </div>
              {/* CTA row */}
              <div style={{padding:"clamp(24px,3vw,36px) clamp(24px,4vw,48px)",display:"flex",gap:32,alignItems:"center",flexWrap:"wrap",justifyContent:"space-between"}}>
                <div style={{flex:1,minWidth:260}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(18px,2.5vw,26px)",fontWeight:700,color:C.white,lineHeight:1.3,marginBottom:8}}>
                    The upgrade is smaller than you think.<br/><span style={{color:C.accent,fontStyle:"italic"}}>The difference is permanent.</span>
                  </div>
                  <p className="muted-body" style={{fontSize:16,color:C.muted,lineHeight:1.7,margin:0}}>
                    For a home in the $700K–$1M range, the real question isn't whether you can afford metal — it's whether paying for asphalt again makes any sense at all.
                  </p>
                </div>
                <a href="/estimate" className="cta-btn" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"16px 32px",background:C.accent,color:C.black,fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"all 0.2s",whiteSpace:"nowrap",flexShrink:0}}
                  onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
                  onMouseLeave={e=>e.currentTarget.style.background=C.accent}
                >Get a Free Estimate →</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ROOF TYPES ── */}
      <section id="products" className="section-pad products-section" style={{background:C.surface,borderTop:`1px solid ${C.border}`}}>
        <div className="inner">
          <Reveal>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:20}}>
              <div>
                <div style={{fontSize:15,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:10}}>Our Products</div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.75rem,4.3vw,3.75rem)",fontWeight:700,color:C.white,lineHeight:1.1}}>
                  Four Systems.<br/>One Standard.
                </h2>
              </div>
              {/* Tab strip — scrollable on mobile */}
              <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:4,overflow:"hidden",overflowX:"auto",flexShrink:0,maxWidth:"100%"}}>
                {roofTypes.map(t=>(
                  <button key={t.id} onClick={()=>setActiveTab(t.id)}
                    style={{padding:"9px 14px",fontSize:10,letterSpacing:1,textTransform:"uppercase",color:activeTab===t.id?C.black:C.muted,background:activeTab===t.id?C.accent:"transparent",borderRight:`1px solid ${C.border}`,transition:"all 0.2s",whiteSpace:"nowrap"}}
                  >{t.label}</button>
                ))}
              </div>
            </div>
          </Reveal>
          {activeType && (
            <Reveal key={activeTab}>
              <div className="grid-2" style={{border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
                {/* Image panel */}
                <div style={{display:"flex",flexDirection:"column",height:"100%",minWidth:0}}>
                  <a
                    href={`/visualizer?roofType=${visualizerRoofTypeMap[activeTab]}`}
                    style={{display:"block",overflow:"hidden",cursor:"pointer",flex:"1 1 auto",minHeight:280}}
                  >
                    <img
                      src={heroMap[activeTab]}
                      alt={`${activeType.label} metal roof`}
                      loading="lazy"
                      decoding="async"
                      style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.3s ease"}}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                  </a>
                  {/* Swatch row */}
                  <div style={{flexShrink:0,minWidth:0,background:C.black,borderTop:`1px solid ${C.border}`,padding:"26px clamp(20px,3vw,32px) 28px"}}>
                    {activeTab === "stone" ? (
                      <>
                        <div style={{display:"flex",alignItems:"flex-start",gap:16,overflowX:"auto",padding:"12px 12px 14px",margin:"-12px -12px -14px"}}>
                          {(stoneTileLevel === "profiles" ? stoneProfileChips : stoneShingleChips).map(chip=>(
                            <SwatchChip key={chip.key} chip={chip} size="tile" badge={chip.key === "shingle" ? "2 Styles" : undefined}
                              onClick={()=>stoneTileLevel==="profiles" ? handleStoneProfileChipClick(chip) : handleStoneShingleChipClick(chip)}/>
                          ))}
                        </div>
                        {stoneTileLevel === "profiles" ? (
                          <div style={{marginTop:18,fontSize:11,letterSpacing:0.6,color:C.muted}}>Tap a profile to explore its colors</div>
                        ) : (
                          <button
                            onClick={()=>setStoneTileLevel("profiles")}
                            style={{marginTop:18,fontSize:11,letterSpacing:0.6,color:C.muted,background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left",transition:"color 0.2s"}}
                            onMouseEnter={e=>e.currentTarget.style.color=C.mutedLight}
                            onMouseLeave={e=>e.currentTarget.style.color=C.muted}
                          >← Back to profiles</button>
                        )}
                      </>
                    ) : (
                      <>
                        <div style={{display:"flex",alignItems:"flex-start",gap:10,overflowX:"auto",padding:"12px 12px 14px",margin:"-12px -12px -14px"}}>
                          {swatchChips.map((chip,i)=>(
                            <SwatchChip key={chip.src || chip.hex || `${chip.name}-${i}`} chip={chip} onClick={()=>openSwatchModal(activeTab, chip)}/>
                          ))}
                          {swatchOverflow > 0 && (
                            <SwatchChip label={`+${swatchOverflow}`} onClick={()=>openSwatchModal(activeTab)}/>
                          )}
                        </div>
                        <button
                          onClick={()=>openSwatchModal(activeTab)}
                          style={{marginTop:18,fontSize:11,letterSpacing:0.6,color:C.muted,background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left",transition:"color 0.2s"}}
                          onMouseEnter={e=>e.currentTarget.style.color=C.mutedLight}
                          onMouseLeave={e=>e.currentTarget.style.color=C.muted}
                        >{swatchData.caption(swatchData.full.length)}</button>
                      </>
                    )}
                  </div>
                </div>
                {/* Info panel */}
                <div style={{background:C.black,padding:"clamp(28px,4vw,52px)",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:32}}>
                  <div>
                    <div style={{fontSize:10,color:C.accent,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{badgeMap[activeTab]}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,3vw,36px)",fontWeight:700,color:C.white,marginBottom:20}}>{activeType.label}</div>
                    <p style={{fontSize:16,color:C.mutedLight,lineHeight:1.8,marginBottom:28}}>{activeType.desc}</p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                      {(specMap[activeTab]||[]).map(item=>(
                        <div key={item.k} style={{padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
                          <div style={{fontSize:9,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{item.k}</div>
                          <div style={{fontSize:14,color:C.white,fontWeight:500}}>{item.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:14}}>
                    <a href={`/visualizer?roofType=${visualizerRoofTypeMap[activeTab]}`} className="cta-btn"
                      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 24px",background:C.accent,color:C.black,fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"background 0.2s",width:"fit-content"}}
                      onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
                      onMouseLeave={e=>e.currentTarget.style.background=C.accent}
                    >See it on your home →</a>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <ProductGallery
        items={swatchModal?.items || []}
        index={swatchModal ? swatchModal.index : null}
        onNavigate={(i)=>setSwatchModal(m => m ? {...m, index:i} : m)}
        onClose={()=>setSwatchModal(null)}
        renderItem={swatchModal?.material === "copper" ? copperRenderItem : undefined}
        header={stoneModalBack}
        footer={swatchModalFooter}
        hideCaption
        showThumbnails
      />

      {/* ── GALLERY ── */}
      <section id="gallery" className="section-pad" style={{borderTop:`1px solid ${C.border}`}}>
        <div className="inner">
          <Reveal>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{fontSize:15,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:12}}>Our Work</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.75rem,4.3vw,3.75rem)",fontWeight:700,color:C.white}}>DFW Installations</h2>
            </div>
          </Reveal>
          <div className="grid-3" style={{gap:14}}>
            {galleryItems.map((item,i)=>(
              <Reveal key={item.label} delay={i*0.06}>
                <div
                  onClick={() => setLightboxIndex(i)}
                  style={{ cursor: "pointer", height: 260, overflow: "hidden", borderRadius: 4, position: "relative" }}
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: item.objectPosition || "center center", display: "block", transition: "transform 0.3s ease", pointerEvents: "auto" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ProductGallery
        items={galleryItems}
        index={lightboxIndex}
        onNavigate={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />

      {/* ── PROCESS ── */}
      <section id="process" className="section-pad" style={{background:C.surface,borderTop:`1px solid ${C.border}`}}>
        <div className="inner">
          <Reveal>
            <div style={{textAlign:"center",marginBottom:56}}>
              <div style={{fontSize:15,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:14}}>Our Process</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.75rem,4.3vw,3.75rem)",fontWeight:700,color:C.white}}>From Address to Installation</h2>
            </div>
          </Reveal>
          <div className="grid-4" style={{gap:2}}>
            {steps.map((step,i)=>{
              const Tag = step.href ? 'a' : 'div';
              const linkProps = step.href ? {href:step.href,...(step.href.startsWith('http')?{target:"_blank",rel:"noopener noreferrer"}:{})} : {};
              return (
              <Reveal key={step.n} delay={i*0.09}>
                <Tag {...linkProps} style={{padding:"40px 28px",background:C.card,border:`1px solid ${C.border}`,borderRadius:4,height:"100%",transition:"border-color 0.3s",...(step.href?{display:"block",textDecoration:"none"}:{})}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.accentDark}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
                >
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:56,fontWeight:700,color:C.border,lineHeight:1,marginBottom:20,userSelect:"none"}}>{step.n}</div>
                  <div style={{width:28,height:2,background:C.accent,marginBottom:16}}/>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:C.white,fontWeight:700,marginBottom:8}}>{step.title}</h3>
                  {step.time && <div style={{fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:C.accent,marginBottom:12}}>{step.time}</div>}
                  <p style={{fontSize:16,color:C.mutedLight,lineHeight:1.8,margin:0}}>{step.body}</p>
                </Tag>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 40-POINT ASSESSMENT ── */}
      <section id="assessment" className="section-pad" style={{background:C.black,borderTop:`1px solid ${C.border}`}}>
        <div className="inner">
          <Reveal>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{fontSize:15,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:14}}>Included With Every Estimate — Free</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.75rem,4.3vw,3.75rem)",fontWeight:700,color:C.white,lineHeight:1.1,marginBottom:20}}>
                The 40-Point Roof<br/><span style={{fontStyle:"italic",color:C.accent}}>& Structure Assessment</span>
              </h2>
              <p style={{fontSize:16,color:C.mutedLight,lineHeight:1.8,maxWidth:640,margin:"0 auto"}}>
                Before we deliver your firm number, we inspect your roof's structure, weatherproofing, ventilation, and every penetration — 40 points in all. It's the same diagnostic professional inspectors charge for, done free with every estimate, so your price is locked before installation day — not renegotiated after.
              </p>
            </div>
          </Reveal>
          <div className="grid-3" style={{gap:14}}>
            {ASSESSMENT_CATEGORIES.map((cat,i)=>(
              <Reveal key={cat.label} delay={i*0.07}>
                <div style={{padding:24,background:C.card,border:`1px solid ${C.border}`,borderRadius:6,height:"100%"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10,gap:10}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:C.white,fontWeight:700}}>{cat.label}</div>
                    <div style={{fontSize:11,color:C.accent,letterSpacing:1,whiteSpace:"nowrap"}}>{cat.count} pts</div>
                  </div>
                  <p style={{fontSize:14,color:C.mutedLight,lineHeight:1.7,margin:0}}>{cat.example}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div style={{textAlign:"center",marginTop:40}}>
              <a href="https://api.leadconnectorhq.com/widget/booking/gG1ruFfEWkUXO7eIB8NR" target="_blank" rel="noopener noreferrer" className="cta-btn" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"15px 32px",background:C.accent,color:C.black,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"all 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
                onMouseLeave={e=>e.currentTarget.style.background=C.accent}
              >Book Your Free Consultation →</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE METROPLEX STANDARD ── */}
      <section id="standard" className="section-pad" style={{background:C.card,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${C.accentDark},${C.accent},${C.accentDark})`}}/>
        <div className="inner" style={{maxWidth:840,textAlign:"center"}}>
          <Reveal>
            <div style={{fontSize:15,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:14}}>The Metroplex Standard</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.75rem,4.3vw,3.75rem)",fontWeight:700,color:C.white,lineHeight:1.15,marginBottom:24}}>
              One Project Lead.<br/><span style={{fontStyle:"italic",color:C.accent}}>One Warranty. Zero Chasing.</span>
            </h2>
            <p style={{fontSize:16,color:C.mutedLight,lineHeight:1.8,maxWidth:600,margin:"0 auto 48px"}}>
              Most roof replacements mean juggling a salesman, a crew foreman, and a warranty department that stops answering. Here, you have one project lead from your first call to your final walkthrough — and every roof we install is backed by a 10-year workmanship warranty, in writing, in your contract.
            </p>
          </Reveal>
          <div className="grid-3" style={{gap:16,textAlign:"left"}}>
            {[
              {label:"10-Year Workmanship Warranty", body:"Written into your contract. Not a handshake.", icon:"shield"},
              {label:"Manufacturer Material Warranty", body:"Panel and finish coverage direct from the manufacturer, registered in your name.", icon:"shield-check"},
              {label:"Licensed & Insured in Texas", body:"Class 4 impact-rated systems, engineered for DFW hail.", icon:"badge"},
            ].map((p,i)=>(
              <Reveal key={p.label} delay={i*0.08}>
                <div style={{padding:24,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,height:"100%"}}>
                  <div style={{marginBottom:14}}>
                    {p.icon==="shield" && (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinejoin="round">
                        <path d="M12 2.5 L19.5 5.5 V11.2 C19.5 16.1 16.3 19.8 12 21.5 C7.7 19.8 4.5 16.1 4.5 11.2 V5.5 Z"/>
                      </svg>
                    )}
                    {p.icon==="shield-check" && (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2.5 L19.5 5.5 V11.2 C19.5 16.1 16.3 19.8 12 21.5 C7.7 19.8 4.5 16.1 4.5 11.2 V5.5 Z"/>
                        <path d="M8.75 11.5 L10.8 13.5 L15.25 9"/>
                      </svg>
                    )}
                    {p.icon==="badge" && (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8.5" r="5.5"/>
                        <path d="M9.5 8.5 L11.2 10.2 L14.5 6.5"/>
                        <path d="M8.3 13.3 L6.5 21.5 L12 18.3 L17.5 21.5 L15.7 13.3"/>
                      </svg>
                    )}
                  </div>
                  <div style={{fontSize:13,letterSpacing:1,color:C.accent,fontWeight:600,marginBottom:10,lineHeight:1.4}}>{p.label}</div>
                  <div style={{fontSize:14,color:C.mutedLight,lineHeight:1.7}}>{p.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREDENTIALS (reviews section held for real testimonials) ── */}
      <section id="reviews" className="section-pad" style={{borderTop:`1px solid ${C.border}`}}>
        <div className="inner">
          <Reveal>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:20}}>
              <div>
                <div style={{fontSize:15,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:10}}>Built to a Standard</div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.625rem,4.2vw,3.5rem)",fontWeight:700,color:C.white}}>Why DFW Homeowners Trust the Install</h2>
              </div>
            </div>
          </Reveal>
          <div className="grid-3" style={{gap:16}}>
            {credentials.map((cItem,i)=>(
              <Reveal key={cItem.label} delay={i*0.09}>
                <div style={{padding:28,background:C.card,border:`1px solid ${C.border}`,borderRadius:6,display:"flex",flexDirection:"column",gap:14,height:"100%"}}>
                  <div style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:C.accent}}>{cItem.eyebrow}</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.white,fontWeight:700,lineHeight:1.25}}>{cItem.label}</div>
                  <p style={{fontSize:15,color:C.mutedLight,lineHeight:1.75,margin:0,flex:1}}>{cItem.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREAS ── */}
      <section id="service-areas" className="section-pad" style={{background:C.surface,borderTop:`1px solid ${C.border}`}}>
        <div className="inner">
          <Reveal>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{fontSize:15,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:12}}>Service Areas</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.625rem,4.2vw,3.5rem)",fontWeight:700,color:C.white}}>Serving the DFW Metroplex</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{display:"flex",flexWrap:"wrap",gap:9,justifyContent:"center"}}>
              {cities.map(city=>(
                <a key={city} href={
                  city === "Southlake"         ? "/metal-roofing-southlake-tx" :
                  city === "Frisco"            ? "/metal-roofing-frisco-tx" :
                  city === "Prosper"           ? "/metal-roofing-prosper-tx" :
                  city === "Westlake"          ? "/metal-roofing-westlake-tx" :
                  city === "Celina"            ? "/metal-roofing-celina-tx" :
                  city === "McKinney"          ? "/metal-roofing-mckinney-tx" :
                  city === "Allen"             ? "/metal-roofing-allen-tx" :
                  city === "Plano"             ? "/metal-roofing-plano-tx" :
                  city === "Colleyville"       ? "/metal-roofing-colleyville-tx" :
                  city === "Keller"            ? "/metal-roofing-keller-tx" :
                  city === "Trophy Club"       ? "/metal-roofing-trophy-club-tx" :
                  city === "Flower Mound"      ? "/metal-roofing-flower-mound-tx" :
                  city === "Mansfield"         ? "/metal-roofing-mansfield-tx" :
                  city === "Forney"            ? "/metal-roofing-forney-tx" :
                  city === "Rockwall"          ? "/metal-roofing-rockwall-tx" :
                  city === "Midlothian"        ? "/metal-roofing-midlothian-tx" :
                  city === "Waxahachie"        ? "/metal-roofing-waxahachie-tx" :
                  city === "Burleson"          ? "/metal-roofing-burleson-tx" :
                  city === "Lewisville"        ? "/metal-roofing-lewisville-tx" :
                  city === "Coppell"           ? "/metal-roofing-coppell-tx" :
                  city === "Richardson"        ? "/metal-roofing-richardson-tx" :
                  city === "Highland Village"  ? "/metal-roofing-highland-village-tx" :
                  city === "Argyle"            ? "/metal-roofing-argyle-tx" :
                  city === "Northlake"         ? "/metal-roofing-northlake-tx" :
                  city === "Roanoke"           ? "/metal-roofing-roanoke-tx" :
                  city === "Grapevine"         ? "/metal-roofing-grapevine-tx" :
                  city === "Anna"              ? "/metal-roofing-anna-tx" :
                  city === "Fate"              ? "/metal-roofing-fate-tx" :
                  city === "Royse City"        ? "/metal-roofing-royse-city-tx" :
                  "#"
                } style={{padding:"9px 18px",border:`1px solid ${C.border}`,borderRadius:2,fontSize:12,color:C.mutedLight,letterSpacing:1,transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.mutedLight;}}
                >{city}</a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section-pad" style={{background:C.black,borderTop:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 40px,${C.border}14 40px,${C.border}14 41px)`,pointerEvents:"none"}}/>
        <div style={{maxWidth:640,margin:"0 auto",textAlign:"center",position:"relative"}}>
          <Reveal>
            <div style={{fontSize:15,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:18}}>Ready to Start?</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.875rem,5vw,4.5rem)",fontWeight:700,color:C.white,lineHeight:1.1,marginBottom:20}}>
              Get a Precision Estimate<br/><span style={{fontStyle:"italic",color:C.accent}}>Built From Your Actual Roof</span>
            </h2>
            <p style={{fontSize:16,color:C.mutedLight,lineHeight:1.8,marginBottom:40}}>
              We use satellite imaging to generate precise measurements for your exact roof — not a guess from the driveway. Your estimate reflects the real scope of your project.
            </p>
            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
              <a href="/visualizer" className="cta-btn" style={{padding:"16px 36px",background:C.accent,color:C.black,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"all 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
                onMouseLeave={e=>e.currentTarget.style.background=C.accent}
              >Visualize My Roof →</a>
              <a href={`tel:+18173823338`} className="cta-btn" style={{padding:"16px 28px",border:`1px solid ${C.borderLight}`,color:C.mutedLight,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:500,borderRadius:2,transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.borderLight;e.currentTarget.style.color=C.mutedLight;}}
              >{PHONE}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

/* ═══════════════════════════════
   ROOT
═══════════════════════════════ */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("stone");
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);
  useEffect(()=>{
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  },[]);

  return (
    <div style={{background:C.black,color:C.text,fontFamily:"'Outfit',system-ui,sans-serif",overflowX:"hidden",minHeight:"100vh"}}>
      <style>{fonts + globalStyles}</style>
      <Nav scrolled={scrolled}/>
      <HomePage activeTab={activeTab} setActiveTab={setActiveTab}/>
      <Footer setActiveTab={setActiveTab}/>
    </div>
  );
}
