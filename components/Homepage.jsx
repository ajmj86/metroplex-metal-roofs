'use client'

import { useState, useEffect, useRef } from "react";

const C = {
  black:"#09090A", surface:"#111113", card:"#18181B",
  border:"#27272A", borderLight:"#3F3F46",
  accent:"#B8935A", accentLight:"#D4AE7A", accentDark:"#8C6A38",
  white:"#F4F1EB", muted:"#71717A", mutedLight:"#A1A1AA", text:"#E4E0D8",
};

const LEGAL_ENTITY = "Allied Roofing Partners LLC";
const DBA_NAME     = "Metroplex Metal Roofs";
const LEGAL_FULL   = `${DBA_NAME}, a DBA of ${LEGAL_ENTITY}`;
const PHONE        = "(214) 555-0000";
const EMAIL        = "info@metroplexmetalroofs.com";
const WEBSITE      = "www.metroplexmetalroofs.com";
const YEAR         = "2026";
const MONTH        = "June";

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');`;

const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #09090A; }
  ::-webkit-scrollbar-thumb { background: #27272A; border-radius: 2px; }
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
    .section-pad { padding: 56px 20px; }
    .hero-pad { padding: 100px 20px 56px; }
    .hide-mobile { display: none !important; }
    .nav-links { display: none !important; }
    .stat-border { border-right: none !important; border-bottom: 1px solid #27272A; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;

/* ── Logo ── */
const Logo = ({ size=1, light=false }) => {
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

/* ── Animated counter ── */
const Counter = ({ to, suffix="" }) => {
  const [val,setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting && !started.current){
        started.current=true;
        let s=0; const step=to/60;
        const t=setInterval(()=>{ s+=step; if(s>=to){setVal(to);clearInterval(t);}else setVal(Math.floor(s)); },16);
      }
    },{threshold:0.5});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

/* ── Nav ── */
const Nav = ({ setPage, scrolled }) => {
  const [mOpen, setMOpen] = useState(false);
  return (
    <>
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        background:scrolled||mOpen?"rgba(9,9,10,0.97)":"transparent",
        backdropFilter:scrolled||mOpen?"blur(14px)":"none",
        borderBottom:scrolled||mOpen?`1px solid ${C.border}`:"1px solid transparent",
        transition:"all 0.35s ease",
        padding:"0 32px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        height:68,
      }}>
        <button onClick={()=>{setPage("home");setMOpen(false);window.scrollTo(0,0);}} style={{padding:0,flexShrink:0}}>
          <Logo size={0.76}/>
        </button>
        {/* Desktop links */}
        <div className="nav-links" style={{display:"flex",gap:28,alignItems:"center"}}>
          {["Why Metal","Gallery","Process","Service Areas"].map(l=>(
            <a key={l} href={`#${l.toLowerCase().replace(" ","-")}`}
              style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:C.mutedLight,fontWeight:500,transition:"color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.accent}
              onMouseLeave={e=>e.currentTarget.style.color=C.mutedLight}
            >{l}</a>
          ))}
          <a href="#visualizer" style={{padding:"9px 22px",background:C.accent,color:C.black,fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"background 0.2s",whiteSpace:"nowrap"}}
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
        <div style={{position:"fixed",top:68,left:0,right:0,bottom:0,zIndex:199,background:"rgba(9,9,10,0.98)",display:"flex",flexDirection:"column",padding:"32px 24px",gap:4,overflowY:"auto"}}>
          {["Why Metal","Gallery","Process","Service Areas","Reviews"].map(l=>(
            <a key={l} href={`#${l.toLowerCase().replace(" ","-")}`} onClick={()=>setMOpen(false)}
              style={{padding:"16px 0",fontSize:18,letterSpacing:2,textTransform:"uppercase",color:C.mutedLight,fontFamily:"'Cormorant Garamond',serif",borderBottom:`1px solid ${C.border}`}}
            >{l}</a>
          ))}
          <a href="#visualizer" onClick={()=>setMOpen(false)} style={{marginTop:24,padding:"16px",background:C.accent,color:C.black,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:700,borderRadius:4,textAlign:"center"}}>
            Free Estimate
          </a>
        </div>
      )}
    </>
  );
};

/* ── Footer ── */
const Footer = ({ setPage }) => (
  <footer style={{borderTop:`1px solid ${C.border}`,padding:"48px 32px 28px",background:C.black}}>
    <div className="inner">
      <div className="grid-2a" style={{gap:40,marginBottom:48}}>
        <div>
          <Logo size={0.68}/>
          <p style={{marginTop:18,fontSize:13,color:C.muted,lineHeight:1.8,maxWidth:260}}>
            Premium metal roofing for DFW homeowners. Licensed partners. Satellite-based estimates. Lifetime results.
          </p>
        </div>
        {[
          {title:"Services",links:["Standing Seam","Copper Roofing","Stone-Coated Steel","R-Panel","Insurance Claims","Free Visualizer"]},
          {title:"Service Areas",links:["Southlake","Frisco","Westlake","Prosper","McKinney","All DFW Areas →"]},
          {title:"Company",links:["About Us","Our Process","Reviews","Contact"]},
        ].map(col=>(
          <div key={col.title}>
            <div style={{fontSize:10,letterSpacing:2.5,color:C.accent,textTransform:"uppercase",marginBottom:18}}>{col.title}</div>
            {col.links.map(l=>(
              <a key={l} href="#" style={{display:"block",fontSize:13,color:C.muted,marginBottom:9,lineHeight:1.5,transition:"color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.color=C.white}
                onMouseLeave={e=>e.currentTarget.style.color=C.muted}
              >{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{borderTop:`1px solid ${C.border}`,paddingTop:22,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div style={{fontSize:11,color:C.muted,lineHeight:1.7}}>
          © {YEAR} {DBA_NAME} · A DBA of {LEGAL_ENTITY}<br/>
          <span style={{fontSize:10,opacity:0.6}}>Dallas–Fort Worth, Texas</span>
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"}}>
          {[["Privacy Policy","privacy"],["Terms of Service","terms"]].map(([label,pg])=>(
            <a key={label} href="#" onClick={e=>{e.preventDefault();setPage(pg);window.scrollTo(0,0);}}
              style={{fontSize:11,color:C.muted,transition:"color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.white}
              onMouseLeave={e=>e.currentTarget.style.color=C.muted}
            >{label}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

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
        <button onClick={handleVisualize}
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
        <p style={{fontSize:13,color:C.muted,marginBottom:22,lineHeight:1.7}}>Enter your details to view your render and receive a free estimate.</p>

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
            <div style={{fontSize:12,color:C.mutedLight,lineHeight:1.75}}>
              I agree to receive SMS text messages from <strong style={{color:C.white}}>Metroplex Metal Roofs</strong> (Allied Roofing Partners LLC) at the number above, including estimate updates, consultation reminders, and project follow-ups. Message frequency varies. Msg &amp; data rates may apply. Reply <strong style={{color:C.white}}>STOP</strong> to cancel, <strong style={{color:C.white}}>HELP</strong> for help.
            </div>
          </label>

          {/* Email */}
          <label style={{display:"flex",gap:12,alignItems:"flex-start",cursor:"pointer"}}>
            <Checkbox checked={form.emailConsent} onChange={()=>setForm(f=>({...f,emailConsent:!f.emailConsent}))}/>
            <div style={{fontSize:12,color:C.mutedLight,lineHeight:1.75}}>
              I agree to receive emails from <strong style={{color:C.white}}>Metroplex Metal Roofs</strong> (Allied Roofing Partners LLC) regarding my estimate, project updates, and relevant roofing information. Unsubscribe at any time.
            </div>
          </label>
        </div>

        {/* Required disclosure box */}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"13px 15px",marginBottom:20}}>
          <p style={{fontSize:11,color:C.muted,lineHeight:1.8,margin:0}}>
            <strong style={{color:C.mutedLight}}>Consent to receive SMS or email messages is not required</strong> to obtain a quote or receive services from Metroplex Metal Roofs. Uncheck either box above to opt out. By submitting you agree to our{" "}
            <a href="#" style={{color:C.accent,textDecoration:"underline"}}>Privacy Policy</a> and{" "}
            <a href="#" style={{color:C.accent,textDecoration:"underline"}}>Terms of Service</a>.
          </p>
        </div>

        <button onClick={handleSubmit} disabled={submitting}
          style={{width:"100%",padding:"15px",background:submitting?C.accentDark:C.accent,color:C.black,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:700,borderRadius:4,cursor:submitting?"not-allowed":"pointer",transition:"background 0.2s"}}
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
        <p style={{fontSize:14,color:C.mutedLight,lineHeight:1.8,marginBottom:24}}>
          Your visualization is being prepared. Our team will follow up with your full render and free estimate — typically within one business day.
        </p>
        <div style={{fontSize:12,color:C.muted}}>Questions? <a href="tel:12145550000" style={{color:C.accent}}>{PHONE}</a></div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════
   HOME
═══════════════════════════════ */
const HomePage = () => {
  const [activeTab, setActiveTab] = useState("standing");

  const roofTypes = [
    {id:"standing",label:"Standing Seam",   desc:"The gold standard in metal roofing. Hidden fasteners, clean architectural lines, and a 50+ year lifespan. Preferred by luxury homebuilders and architects across DFW."},
    {id:"copper",  label:"Copper",           desc:"The most premium material in residential roofing. Develops a natural patina over decades, lasts 100+ years, and signals enduring quality. Ideal for estate-level homes or architectural accents."},
    {id:"stone",   label:"Stone-Coated Steel",desc:"The look of architectural shingles with the strength of steel. Class 4 hail rating — ideal for HOA-governed DFW communities that require traditional aesthetics."},
    {id:"rpanel",  label:"R-Panel",          desc:"A proven exposed-fastener metal panel system offering exceptional durability and longevity. A straightforward entry into metal roofing without sacrificing long-term performance."},
  ];
  const specMap = {
    standing:[{k:"Lifespan",v:"50–70 yrs"},{k:"Hail Rating",v:"Class 4"},{k:"Wind",v:"160 mph"},{k:"Fastener",v:"Hidden"}],
    copper:  [{k:"Lifespan",v:"100+ yrs"}, {k:"Patina",v:"Natural"},{k:"Wind",v:"160 mph"},{k:"Maintenance",v:"Near zero"}],
    stone:   [{k:"Lifespan",v:"40–70 yrs"},{k:"Hail Rating",v:"Class 4"},{k:"Wind",v:"120 mph"},{k:"Profile",v:"Shingle-style"}],
    rpanel:  [{k:"Lifespan",v:"40–60 yrs"},{k:"Hail Rating",v:"Class 4"},{k:"Wind",v:"120 mph"},{k:"Fastener",v:"Exposed"}],
  };
  const badgeMap = {standing:"Most Popular",copper:"Ultra Premium",stone:"HOA Friendly",rpanel:"Best Value"};

  const stats = [
    {val:50,suffix:"+ yrs",label:"Roof Lifespan"},
    {val:35,suffix:"%",    label:"Insurance Savings"},
    {val:15,suffix:"%",    label:"Energy Cost Reduction"},
    {val:340,suffix:"%",   label:"ROI vs. Asphalt"},
  ];

  const steps = [
    {n:"01",title:"Visualize Your Roof",   body:"Enter your address. Our AI visualizer pulls a street-level image of your home and renders it with your chosen metal roof style and color — before you commit to anything."},
    {n:"02",title:"Brief Consultation",    body:"A quick call with our team. We confirm your home's scope, timeline, and whether metal is the right fit. No pressure, no obligation."},
    {n:"03",title:"Precision Estimate",    body:"We use satellite imaging to generate exact measurements for your roof. Your estimate is built from real data — not a guess from the driveway."},
    {n:"04",title:"Expert Installation",   body:"Your project is executed by a credentialed local metal roofing specialist — licensed in Texas, fully insured, and selected for their proven expertise."},
  ];

  const reviews = [
    {name:"Michael T.",area:"Southlake, TX",text:"We've replaced two asphalt roofs on this house in 22 years. After last spring's hail we finally switched to standing seam. The process was completely different — they actually knew what they were talking about."},
    {name:"Jennifer R.",area:"Frisco, TX",  text:"I was skeptical about the cost at first. Then they walked me through the insurance discount and the 50-year math. This is the last roof I'll ever put on this house."},
    {name:"David K.",  area:"Westlake, TX", text:"Most roofing companies send a guy with a clipboard. Metroplex showed me a rendering of my actual house with a metal roof before we even talked numbers. Completely different level of professionalism."},
  ];

  const cities = ["Southlake","Frisco","Westlake","Prosper","Celina","McKinney","Allen","Plano","Colleyville","Keller","Trophy Club","Flower Mound","Mansfield","Forney","Rockwall"];

  const galleryItems = [
    {label:"Standing Seam · Luxury Residence", tag:'Shutterstock: "standing seam metal roof luxury home"'},
    {label:"Copper Roof · Estate Home",         tag:'Shutterstock: "copper roof luxury estate"'},
    {label:"Stone-Coated · Suburban Home",      tag:'Shutterstock: "stone coated steel roof residential"'},
    {label:"R-Panel · Modern Farmhouse",        tag:'Shutterstock: "metal panel roof farmhouse"'},
    {label:"Standing Seam · Wide Exterior Shot",  tag:'Shutterstock: "standing seam metal roof luxury home wide"'},
    {label:"Detail · Seam & Ridge Cap",         tag:'Shutterstock: "standing seam metal roof detail"'},
  ];

  const activeType = roofTypes.find(t=>t.id===activeTab);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-pad" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        {/* BG gradient — replace div background-image with real photo URL when ready */}
        <div style={{position:"absolute",inset:0,zIndex:0,background:`linear-gradient(135deg, #0F0D0A 0%, #1A1610 40%, #0D0C0B 100%)`}}>
          {/* Subtle gold radial glow */}
          <div style={{position:"absolute",top:"35%",right:"30%",width:700,height:700,background:`radial-gradient(circle, ${C.accentDark}18 0%, transparent 65%)`,pointerEvents:"none"}}/>
          {/* Photo swap note — remove this comment when adding real image:
              Set background-image: url('/your-hero-image.jpg') on the outer div,
              add backgroundSize:'cover', backgroundPosition:'center' */}
        </div>
        {/* Grid overlay */}
        <div style={{position:"absolute",inset:0,zIndex:1,pointerEvents:"none",backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,backgroundSize:"72px 72px",opacity:0.07}}/>

        <div className="inner" style={{position:"relative",zIndex:2,width:"100%"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:12,marginBottom:28,animation:"fadeUp 0.8s ease both"}}>
            <div style={{width:28,height:1,background:C.accent,flexShrink:0}}/>
            <span style={{fontSize:11,letterSpacing:3,color:C.accent,textTransform:"uppercase",fontWeight:500}}>Premium Metal Roofing · Dallas–Fort Worth</span>
          </div>
          <h1 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(42px,6vw,88px)",fontWeight:700,lineHeight:1.05,color:C.white,marginBottom:24,maxWidth:720,animation:"fadeUp 0.8s ease 0.1s both"}}>
            The Last Roof<br/><span style={{color:C.accent,fontStyle:"italic"}}>You'll Ever Need</span>
          </h1>
          <p style={{fontSize:"clamp(15px,2vw,17px)",lineHeight:1.8,color:C.mutedLight,maxWidth:480,marginBottom:40,fontWeight:300,animation:"fadeUp 0.8s ease 0.2s both"}}>
            Standing seam metal roofing engineered for North Texas weather. 50-year lifespan. Class 4 hail rating. Up to 35% insurance discount.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center",animation:"fadeUp 0.8s ease 0.3s both"}}>
            <a href="#visualizer" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"15px 32px",background:C.accent,color:C.black,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"all 0.2s",whiteSpace:"nowrap"}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.accentLight;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.accent;}}
            >See Your Home With Metal →</a>
            <a href="#process" style={{display:"inline-flex",alignItems:"center",padding:"15px 28px",border:`1px solid ${C.borderLight}`,color:C.mutedLight,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:500,borderRadius:2,transition:"all 0.2s",whiteSpace:"nowrap"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.borderLight;e.currentTarget.style.color=C.mutedLight;}}
            >How It Works</a>
          </div>
          {/* Trust bar */}
          <div style={{display:"flex",gap:28,marginTop:56,paddingTop:32,borderTop:`1px solid ${C.border}`,flexWrap:"wrap",animation:"fadeUp 0.8s ease 0.4s both"}}>
            {["Licensed & Insured Partners","Satellite Imaging Estimates","Class 4 Impact Rating","DFW Local"].map(t=>(
              <div key={t} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:C.accent,flexShrink:0}}/>
                <span style={{fontSize:12,color:C.muted}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,background:C.surface}}>
        <div className="inner grid-4">
          {stats.map((s,i)=>(
            <Reveal key={s.label} delay={i*0.07}>
              <div className="stat-border" style={{padding:"44px 32px",borderRight:i<3?`1px solid ${C.border}`:"none",textAlign:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(40px,4vw,52px)",fontWeight:700,color:C.accent,lineHeight:1,marginBottom:8}}>
                  <Counter to={s.val} suffix={s.suffix}/>
                </div>
                <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.muted}}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ECONOMICS ── */}
      <section className="section-pad" style={{background:C.black,borderTop:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
        {/* Subtle diagonal texture */}
        <div style={{position:"absolute",inset:0,backgroundImage:`repeating-linear-gradient(135deg,transparent,transparent 48px,${C.border}0A 48px,${C.border}0A 49px)`,pointerEvents:"none"}}/>
        <div className="inner" style={{position:"relative"}}>
          <Reveal>
            <div style={{textAlign:"center",marginBottom:64}}>
              <div style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:14}}>The Real Math</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(30px,4.5vw,56px)",fontWeight:700,color:C.white,lineHeight:1.1,marginBottom:20}}>
                Why DFW Homeowners Are<br/><span style={{fontStyle:"italic",color:C.accent}}>Done With Asphalt</span>
              </h2>
              <p style={{fontSize:15,color:C.mutedLight,lineHeight:1.8,maxWidth:560,margin:"0 auto"}}>
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
                  <div style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:C.muted}}>Asphalt Shingle Roof</div>
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
                    <div style={{width:28,height:28,borderRadius:"50%",background:C.card,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.muted,flexShrink:0,marginTop:2}}>{item.icon}</div>
                    <div>
                      <div style={{fontSize:10,letterSpacing:1.5,textTransform:"uppercase",color:C.muted,marginBottom:4}}>{item.label}</div>
                      <div style={{fontSize:14,color:C.text,lineHeight:1.6}}>{item.val}</div>
                    </div>
                  </div>
                ))}
                {/* Insight callout */}
                <div style={{marginTop:28,padding:"18px 20px",background:C.card,borderRadius:6,border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:12,color:C.mutedLight,lineHeight:1.7,fontStyle:"italic"}}>
                    "When your deductible equals or exceeds what a replacement costs, insurance provides no real benefit for your roof — you're effectively self-insuring either way."
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
                  <div style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:C.accent}}>Metal Roof</div>
                </div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3vw,32px)",fontWeight:700,color:C.white,marginBottom:32,lineHeight:1.2}}>
                  One investment.<br/>Decades of returns.
                </div>
                {[
                  {icon:"∞", label:"Replacement cycle",     val:"Once. A quality metal roof outlasts the mortgage — and then some.", gold:true},
                  {icon:"▼", label:"Insurance premiums",    val:"Metal roofs qualify for significant carrier discounts in Texas hail zones.", gold:true},
                  {icon:"❄", label:"Energy savings",        val:"Metal's thermal properties reduce cooling costs — a real line item in DFW summers.", gold:false},
                  {icon:"◆", label:"Curb appeal & value",   val:"Clean lines, premium materials, and a profile that reads as intentional — not default. Metal roofing has become the standard on new construction across DFW's most sought-after communities.", gold:true},
                  {icon:"✓", label:"The 20–30 year picture", val:"When you account for avoided replacements, insurance premium savings, and energy reduction, metal typically pays for itself within the life of your home.", gold:true},
                ].map(item=>(
                  <div key={item.label} style={{display:"flex",gap:16,padding:"18px 0",borderBottom:`1px solid ${C.border}`,alignItems:"flex-start"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:item.gold?`${C.accentDark}44`:C.surface,border:`1px solid ${item.gold?C.accentDark:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:item.gold?C.accent:C.muted,flexShrink:0,marginTop:2}}>{item.icon}</div>
                    <div>
                      <div style={{fontSize:10,letterSpacing:1.5,textTransform:"uppercase",color:item.gold?C.accent:C.muted,marginBottom:4}}>{item.label}</div>
                      <div style={{fontSize:14,color:C.text,lineHeight:1.6}}>{item.val}</div>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:28,padding:"18px 20px",background:`${C.accentDark}22`,borderRadius:6,border:`1px solid ${C.accentDark}`}}>
                  <div style={{fontSize:12,color:C.accentLight,lineHeight:1.7,fontStyle:"italic"}}>
                    "If you're already paying out of pocket every decade, the gap between asphalt and metal is smaller than most homeowners expect — and the gap in outcomes is enormous."
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
                <p style={{fontSize:13,color:C.mutedLight,margin:0,lineHeight:1.6,fontStyle:"italic"}}>
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
                  <p style={{fontSize:13,color:C.muted,lineHeight:1.7,margin:0}}>
                    For a home in the $700K–$1M range, the real question isn't whether you can afford metal — it's whether paying for asphalt again makes any sense at all.
                  </p>
                </div>
                <a href="#visualizer" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"16px 32px",background:C.accent,color:C.black,fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"all 0.2s",whiteSpace:"nowrap",flexShrink:0}}
                  onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
                  onMouseLeave={e=>e.currentTarget.style.background=C.accent}
                >Get a Free Estimate →</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── VISUALIZER CTA ── */}
      <section id="visualizer" className="section-pad" style={{position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",background:`radial-gradient(ellipse 70% 60% at 50% 50%,${C.accentDark}1A 0%,transparent 70%)`}}/>
        <div style={{maxWidth:740,margin:"0 auto",textAlign:"center",position:"relative"}}>
          <Reveal>
            <div style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:18}}>AI Roof Visualizer</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(32px,5vw,60px)",fontWeight:700,color:C.white,lineHeight:1.1,marginBottom:20}}>
              See Your Home With<br/><span style={{fontStyle:"italic",color:C.accent}}>a Metal Roof</span>
            </h2>
            <p style={{fontSize:15,color:C.mutedLight,lineHeight:1.8,maxWidth:500,margin:"0 auto 40px"}}>
              Enter your address. Our AI pulls a street-level image of your exact home and renders it with your chosen metal roof style and color — no imagination required.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <VisualizerGate/>
          </Reveal>
        </div>
      </section>

      {/* ── ROOF TYPES ── */}
      <section className="section-pad" style={{background:C.surface,borderTop:`1px solid ${C.border}`}}>
        <div className="inner">
          <Reveal>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:20}}>
              <div>
                <div style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:10}}>Our Products</div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:700,color:C.white,lineHeight:1.1}}>
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
                <ImgPlaceholder
                  label={`${activeType.label} — product photo`}
                  tag={`Shutterstock: "${activeType.label.toLowerCase()} metal roof luxury home"`}
                  style={{minHeight:320,borderRadius:0,border:"none",position:"relative"}}
                />
                {/* Info panel */}
                <div style={{background:C.black,padding:"clamp(28px,4vw,52px)",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:32}}>
                  <div>
                    <div style={{fontSize:10,color:C.accent,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{badgeMap[activeTab]}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,3vw,36px)",fontWeight:700,color:C.white,marginBottom:20}}>{activeType.label}</div>
                    <p style={{fontSize:15,color:C.mutedLight,lineHeight:1.8,marginBottom:28}}>{activeType.desc}</p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                      {(specMap[activeTab]||[]).map(item=>(
                        <div key={item.k} style={{padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
                          <div style={{fontSize:9,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{item.k}</div>
                          <div style={{fontSize:14,color:C.white,fontWeight:500}}>{item.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <a href="#visualizer" style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:11,letterSpacing:2,textTransform:"uppercase",color:C.accent,fontWeight:600,borderBottom:`1px solid ${C.accentDark}`,paddingBottom:4,width:"fit-content",transition:"color 0.2s"}}>
                    Get a Free Estimate →
                  </a>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className="section-pad" style={{borderTop:`1px solid ${C.border}`}}>
        <div className="inner">
          <Reveal>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:12}}>Our Work</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:700,color:C.white}}>DFW Installations</h2>
              <p style={{fontSize:12,color:C.muted,marginTop:10}}>Replace placeholders with licensed stock or job photos before launch</p>
            </div>
          </Reveal>
          <div className="grid-3" style={{gap:14}}>
            {galleryItems.map((item,i)=>(
              <Reveal key={item.label} delay={i*0.06}>
                <ImgPlaceholder label={item.label} tag={item.tag} style={{minHeight:220}}/>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" className="section-pad" style={{background:C.surface,borderTop:`1px solid ${C.border}`}}>
        <div className="inner">
          <Reveal>
            <div style={{textAlign:"center",marginBottom:56}}>
              <div style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:14}}>Our Process</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:700,color:C.white}}>From Address to Installation</h2>
            </div>
          </Reveal>
          <div className="grid-4" style={{gap:2}}>
            {steps.map((step,i)=>(
              <Reveal key={step.n} delay={i*0.09}>
                <div style={{padding:"40px 28px",background:C.card,border:`1px solid ${C.border}`,borderRadius:4,height:"100%",transition:"border-color 0.3s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.accentDark}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
                >
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:56,fontWeight:700,color:C.border,lineHeight:1,marginBottom:20,userSelect:"none"}}>{step.n}</div>
                  <div style={{width:28,height:2,background:C.accent,marginBottom:16}}/>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:C.white,fontWeight:700,marginBottom:12}}>{step.title}</h3>
                  <p style={{fontSize:13,color:C.mutedLight,lineHeight:1.8,margin:0}}>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" className="section-pad" style={{borderTop:`1px solid ${C.border}`}}>
        <div className="inner">
          <Reveal>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:20}}>
              <div>
                <div style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:10}}>Reviews</div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,4vw,44px)",fontWeight:700,color:C.white}}>What DFW Homeowners Say</h2>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                {"★★★★★".split("").map((s,i)=><span key={i} style={{color:C.accent,fontSize:20}}>{s}</span>)}
                <span style={{fontSize:12,color:C.muted,marginLeft:8}}>5.0 · Google</span>
              </div>
            </div>
          </Reveal>
          <div className="grid-3" style={{gap:16}}>
            {reviews.map((r,i)=>(
              <Reveal key={r.name} delay={i*0.09}>
                <div style={{padding:28,background:C.card,border:`1px solid ${C.border}`,borderRadius:6,display:"flex",flexDirection:"column",gap:16,height:"100%"}}>
                  <div style={{display:"flex",gap:2}}>{"★★★★★".split("").map((s,i)=><span key={i} style={{color:C.accent,fontSize:13}}>{s}</span>)}</div>
                  <p style={{fontSize:14,color:C.mutedLight,lineHeight:1.8,fontStyle:"italic",flex:1,margin:0}}>"{r.text}"</p>
                  <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16}}>
                    <div style={{fontSize:14,color:C.white,fontWeight:600}}>{r.name}</div>
                    <div style={{fontSize:11,color:C.muted,letterSpacing:1,marginTop:3}}>{r.area}</div>
                  </div>
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
              <div style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:12}}>Service Areas</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,4vw,44px)",fontWeight:700,color:C.white}}>Serving the DFW Metroplex</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{display:"flex",flexWrap:"wrap",gap:9,justifyContent:"center"}}>
              {cities.map(city=>(
                <a key={city} href="#" style={{padding:"9px 18px",border:`1px solid ${C.border}`,borderRadius:2,fontSize:12,color:C.mutedLight,letterSpacing:1,transition:"all 0.2s"}}
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
            <div style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:18}}>Ready to Start?</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(30px,5vw,56px)",fontWeight:700,color:C.white,lineHeight:1.1,marginBottom:20}}>
              Get a Precision Estimate<br/><span style={{fontStyle:"italic",color:C.accent}}>Built From Your Actual Roof</span>
            </h2>
            <p style={{fontSize:15,color:C.mutedLight,lineHeight:1.8,marginBottom:40}}>
              We use satellite imaging to generate precise measurements for your exact roof — not a guess from the driveway. Your estimate reflects the real scope of your project.
            </p>
            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
              <a href="#visualizer" style={{padding:"16px 36px",background:C.accent,color:C.black,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"all 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
                onMouseLeave={e=>e.currentTarget.style.background=C.accent}
              >Visualize My Roof →</a>
              <a href={`tel:12145550000`} style={{padding:"16px 28px",border:`1px solid ${C.borderLight}`,color:C.mutedLight,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:500,borderRadius:2,transition:"all 0.2s"}}
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
   LEGAL SHELL
═══════════════════════════════ */
const LH = ({children}) => <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,3vw,26px)",fontWeight:700,color:C.white,marginTop:44,marginBottom:14}}>{children}</h2>;

const LegalShell = ({title,children}) => (
  <div style={{maxWidth:760,margin:"0 auto",padding:"clamp(100px,12vw,130px) clamp(20px,5vw,48px) 80px"}}>
    <div style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:14}}>Legal</div>
    <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:C.white,marginBottom:10}}>{title}</h1>
    <p style={{fontSize:12,color:C.muted,marginBottom:48,letterSpacing:0.3}}>{LEGAL_FULL} · Last updated: {MONTH} {YEAR}</p>
    <div style={{fontSize:14,color:C.mutedLight,lineHeight:1.95}}>{children}</div>
  </div>
);

/* ═══════════════════════════════
   PRIVACY POLICY
═══════════════════════════════ */
const PrivacyPage = () => (
  <LegalShell title="Privacy Policy">
    <p>This Privacy Policy describes how {LEGAL_FULL} ("Company," "we," "us," or "our") collects, uses, and shares information about you when you visit {WEBSITE} (the "Site") or contact us in connection with our services. By using the Site, you agree to the collection and use of information in accordance with this policy.</p>

    <LH>1. Information We Collect</LH>
    <p><strong style={{color:C.white}}>Information you provide directly:</strong> When you submit a form, request an estimate, use our roof visualizer, or contact us, we may collect your name, email address, phone number, property address, and any other information you provide.</p>
    <p><strong style={{color:C.white}}>Information collected automatically:</strong> When you visit our Site we automatically collect certain technical information including your IP address, browser type, referring URL, pages viewed, and time on page. We use cookies and similar technologies for this purpose.</p>
    <p><strong style={{color:C.white}}>Visualizer tool:</strong> Our AI roof visualizer uses your provided property address to retrieve a publicly available street-level image of your home via third-party mapping services. We do not store retrieved imagery beyond your active session.</p>

    <LH>2. How We Use Your Information</LH>
    <p>We use collected information to respond to estimate requests and inquiries; provide and improve our services; communicate with you about your project; send service-related updates if you have opted in; comply with legal obligations; and prevent fraud.</p>
    <p>We do not sell your personal information to third parties.</p>

    <LH>3. How We Share Your Information</LH>
    <p><strong style={{color:C.white}}>Installation partners:</strong> To fulfill your roofing project, we may share relevant contact and property information with our network of vetted, licensed local roofing professionals. These partners are engaged solely for project execution and are not authorized to use your information for any other purpose.</p>
    <p><strong style={{color:C.white}}>CRM and marketing platforms:</strong> We use GoHighLevel as our customer relationship management platform. Your contact information may be stored and processed within that system, subject to its own privacy policies.</p>
    <p><strong style={{color:C.white}}>Legal requirements:</strong> We may disclose your information when required by law or valid legal process.</p>

    <LH>4. Cookies</LH>
    <p>Our Site uses cookies to enhance your experience and support analytics and marketing. You may disable cookies through your browser; however, some Site features may not function properly without them.</p>

    <LH>5. Data Retention</LH>
    <p>We retain your information as long as necessary to fulfill the purposes outlined here, comply with legal obligations, and resolve disputes. Project and estimate records are retained for a minimum of four years.</p>

    <LH>6. Your Rights</LH>
    <p>You may request access to, correction of, or deletion of your personal information by contacting us at {EMAIL}. We will respond to verified requests within 30 days.</p>

    <LH>7. Children's Privacy</LH>
    <p>Our Site is not directed to individuals under 18. We do not knowingly collect personal information from minors. Contact us immediately if you believe a minor has submitted information through our Site.</p>

    <LH>8. Changes to This Policy</LH>
    <p>We may update this Privacy Policy periodically. Material changes will be reflected in the "last updated" date at the top of this page.</p>

    <LH>9. Contact</LH>
    <p><strong style={{color:C.white}}>{LEGAL_FULL}</strong><br/>Dallas–Fort Worth, Texas<br/>Email: {EMAIL}<br/>Phone: {PHONE}</p>
  </LegalShell>
);

/* ═══════════════════════════════
   TERMS OF SERVICE
═══════════════════════════════ */
const TermsPage = () => (
  <LegalShell title="Terms of Service">
    <p>These Terms of Service ("Terms") govern your access to and use of {WEBSITE}, operated by {LEGAL_FULL} ("Company," "we," "us," or "our"). By accessing or using our Site, you agree to be bound by these Terms.</p>

    <LH>1. Company Identity</LH>
    <p>{DBA_NAME} is a registered assumed name (DBA) of {LEGAL_ENTITY}, a Texas limited liability company. All agreements entered into through or facilitated by this Site are agreements with {LEGAL_ENTITY}.</p>

    <LH>2. Services</LH>
    <p>{DBA_NAME} is a premium metal roofing company serving the Dallas–Fort Worth metroplex. We manage your project from initial consultation through completion, coordinating with our network of credentialed local roofing professionals to deliver a finished result that meets our quality standards.</p>
    <p>Nothing on this Site constitutes a binding contract or guarantee of services. All projects require a signed written agreement executed by an authorized representative of {LEGAL_ENTITY}.</p>

    <LH>3. Roof Visualizer Tool</LH>
    <p>Our AI-powered roof visualizer is provided for illustrative purposes only. Rendered images are computer-generated approximations and do not represent guaranteed outcomes, exact product appearances, or final installation specifications. Actual results will vary based on product selection, home architecture, lighting, and installation. By using the visualizer, you consent to the use of your property address to retrieve a publicly available street-level image of your home.</p>

    <LH>4. Estimates</LH>
    <p>Any cost ranges or preliminary figures discussed verbally or via email are non-binding until a formal written estimate is issued and signed by both parties. Written estimates are valid for 30 days from the date of issue unless otherwise stated. Final project costs are determined by confirmed measurements, material selection, and current pricing at the time of contract execution.</p>

    <LH>5. Intellectual Property</LH>
    <p>All content on this Site — including text, graphics, logos, and software — is the property of {LEGAL_ENTITY} or its licensors and is protected by applicable copyright and trademark law. You may not reproduce or distribute any Site content without our prior written permission.</p>

    <LH>6. Disclaimer of Warranties</LH>
    <p>THE SITE AND ITS CONTENT ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>

    <LH>7. Limitation of Liability</LH>
    <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, {LEGAL_ENTITY.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE SITE OR OUR SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF AMOUNTS PAID BY YOU IN THE PRIOR 12 MONTHS OR $100.</p>

    <LH>8. Indemnification</LH>
    <p>You agree to indemnify and hold harmless {LEGAL_ENTITY} and its members, officers, and agents from claims, damages, and expenses (including attorneys' fees) arising out of your use of the Site or violation of these Terms.</p>

    <LH>9. Governing Law</LH>
    <p>These Terms are governed by the laws of the State of Texas. Disputes shall be resolved exclusively in the state or federal courts of Dallas County, Texas, and you consent to personal jurisdiction there.</p>

    <LH>10. Changes to Terms</LH>
    <p>We may modify these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.</p>

    <LH>11. Contact</LH>
    <p><strong style={{color:C.white}}>{LEGAL_FULL}</strong><br/>Dallas–Fort Worth, Texas<br/>Email: {EMAIL}<br/>Phone: {PHONE}</p>
  </LegalShell>
);

/* ═══════════════════════════════
   ROOT
═══════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  return (
    <div style={{background:C.black,color:C.text,fontFamily:"'Outfit',system-ui,sans-serif",overflowX:"hidden",minHeight:"100vh"}}>
      <style>{fonts}{globalStyles}</style>
      <Nav setPage={setPage} scrolled={scrolled}/>
      {page==="home"    && <HomePage/>}
      {page==="privacy" && <PrivacyPage/>}
      {page==="terms"   && <TermsPage/>}
      <Footer setPage={setPage}/>
    </div>
  );
}
