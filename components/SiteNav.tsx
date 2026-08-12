'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { C, Logo } from './brand'

// Order matches the homepage's actual top-to-bottom section order (the
// canonical default every other page type falls back to) -- About Us stays
// first as an external page link, not a same-page anchor.
const NAV_LINKS = [
  {label:"About Us",      href:"/about"},
  {label:"Why Metal",     href:"/#why-metal"},
  {label:"Our Products",  href:"/#products"},
  {label:"Pricing",       href:"/#pricing"},
  {label:"Gallery",       href:"/#gallery"},
  {label:"Our Process",   href:"/#process"},
  {label:"Why Us",        href:"/#standard"},
  {label:"Service Areas", href:"/#service-areas"},
  {label:"FAQ",           href:"/#faq"},
]

/*
 * City pages have their own why-metal/our-products/gallery/process/
 * standard sections (own ids, same content shape as the homepage's, just
 * city-specific copy). Without this, every nav click bounced a city-page
 * visitor back to the homepage — abandoning the city-specific content they
 * were already looking at.
 *
 * Deliberately does NOT include Pricing/FAQ/Service Areas -- those three
 * use the exact same id on the homepage, every city page, AND every
 * material page, so they're handled once by UNIVERSAL_HREF below instead
 * of duplicating the same value here.
 */
const CITY_PAGE_OVERRIDES: Record<string,string> = {
  "Why Metal":    "#why-metal",
  "Our Products": "#our-products",
  "Gallery":      "#gallery",
  "Our Process":  "#process",
  "Why Us":       "#standard",
}

// The 5 standalone material pages (not city pages, not the homepage) --
// none share a common section shape for Why-Metal/Gallery/Process/etc, but
// all of them carry Pricing/FAQ/Service Areas under these same ids, so
// they participate in UNIVERSAL_HREF the same way city pages do.
const MATERIAL_PAGE_SLUGS = new Set([
  'standing-seam-roofing', 'stone-coated-steel-roofing', 'copper-roofing',
  'r-panel-roofing', 'synthetic-slate-roofing',
])

// Labels whose target section carries the IDENTICAL id on the homepage,
// every city page, and every material page -- no page-type-specific value
// needed, just "does the current page have its own copy of this section."
const UNIVERSAL_HREF: Record<string,string> = {
  "Pricing":       "#pricing",
  "FAQ":           "#faq",
  "Service Areas": "#service-areas",
}

/*
 * Remembers the last city page visited (sessionStorage, not a URL param —
 * avoids the Next.js useSearchParams/Suspense-boundary requirement on a nav
 * component rendered on every page). When a visitor leaves a city page for
 * About Us (or any other non-city page using SiteNav), the section links
 * that only exist on city pages now route back to that same city page
 * instead of bouncing to the generic homepage sections.
 */
const LAST_CITY_KEY = 'mmr_last_city_slug'

export default function SiteNav() {
  const [mOpen, setMOpen] = useState(false)
  const pathname = usePathname()
  const isCityPage = pathname?.startsWith('/metal-roofing-') ?? false
  const citySlugMatch = pathname?.match(/^\/metal-roofing-(.+)-tx\/?$/)
  const currentCitySlug = citySlugMatch ? citySlugMatch[1] : null
  const isMaterialPage = MATERIAL_PAGE_SLUGS.has((pathname ?? '').replace(/^\//, '').replace(/\/$/, ''))

  const [returnCitySlug, setReturnCitySlug] = useState<string | null>(null)

  useEffect(() => {
    if (isCityPage && currentCitySlug) {
      sessionStorage.setItem(LAST_CITY_KEY, currentCitySlug)
      setReturnCitySlug(null)
    } else {
      setReturnCitySlug(sessionStorage.getItem(LAST_CITY_KEY))
    }
  }, [pathname, isCityPage, currentCitySlug])

  const links = NAV_LINKS.map(l => {
    if (UNIVERSAL_HREF[l.label]) {
      if (isCityPage || isMaterialPage) return { ...l, href: UNIVERSAL_HREF[l.label] }
      if (returnCitySlug) return { ...l, href: `/metal-roofing-${returnCitySlug}-tx${UNIVERSAL_HREF[l.label]}` }
      return l
    }
    if (isCityPage && CITY_PAGE_OVERRIDES[l.label]) {
      return { ...l, href: CITY_PAGE_OVERRIDES[l.label] }
    }
    if (!isCityPage && returnCitySlug && CITY_PAGE_OVERRIDES[l.label]) {
      return { ...l, href: `/metal-roofing-${returnCitySlug}-tx${CITY_PAGE_OVERRIDES[l.label]}` }
    }
    return l
  })

  useEffect(() => {
    if (mOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mOpen])

  return (
    <>
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        background:"rgba(9,9,10,0.97)",
        backdropFilter:"blur(14px)",
        WebkitBackdropFilter:"blur(14px)",
        borderBottom:`1px solid ${C.border}`,
        padding:"0 32px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        height:84,
      }}>
        <Link href="/" className="nav-logo" style={{padding:0,flexShrink:0,display:"block",textDecoration:"none"}}>
          <Logo size={1.25}/>
        </Link>
        <div className="sitenav-links" style={{display:"flex",gap:28,alignItems:"center"}}>
          {links.map(l=>(
            <a key={l.label} href={l.href}
              style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:C.mutedLight,fontWeight:500,transition:"color 0.2s",textDecoration:"none",fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.accent}
              onMouseLeave={e=>e.currentTarget.style.color=C.mutedLight}
            >{l.label}</a>
          ))}
          <a href="/visualizer"
            style={{padding:"9px 22px",background:C.accent,color:C.black,fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"background 0.2s",whiteSpace:"nowrap",textDecoration:"none",fontFamily:"'Outfit',sans-serif"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
            onMouseLeave={e=>e.currentTarget.style.background=C.accent}
          >Free Visualizer + Estimate</a>
        </div>
        <button onClick={()=>setMOpen(o=>!o)}
          className="sitenav-hamburger"
          style={{display:"none",background:"none",border:"none",padding:"8px",color:C.white,fontSize:22,lineHeight:1,cursor:"pointer"}}
          aria-label="Menu"
        >{mOpen?"✕":"☰"}</button>
        {/*
         * whiteSpace:"nowrap" on each link's style (below) is required for
         * this breakpoint to mean anything -- without it the browser wraps
         * individual labels onto 2 lines instead of the container
         * registering overflow, so scrollWidth never reliably signals "too
         * narrow." With wrapping disabled and the breakpoint's own effect
         * on visibility isolated out (measuring right at a boundary
         * conflates "does content fit" with "did the query just flip"),
         * true content width measured at 1407px when this was first fixed
         * (7 base links + spliced-in FAQ). Phase 10 replaced the FAQ
         * splice with 4 real nav entries (Pricing/Assessment/Credentials/
         * FAQ, going from 7 to 11 links total), pushing it to 1730px.
         * Assessment and Credentials were then removed again (back to 9
         * links), re-lowering it to 1492px -- re-measured fresh via a
         * `!important` inline style set directly on the element, not
         * Playwright's addStyleTag (that injects into <head>, which loses
         * the cascade tie-break against this component's own <style> tag
         * rendering later in <body>, so it silently failed to override
         * anything below the then-current breakpoint during Phase 10's
         * cleanup pass). 1599px gives real margin above that. Using the
         * same breakpoint as Homepage.jsx's own Nav so the site switches
         * to the hamburger at a consistent window width everywhere
         * instead of fragmenting by page. Re-check this number if the
         * link count changes again.
         */}
        {/*
         * Same narrow-phone logo fix as Homepage.jsx's own Nav (see the
         * comment there for the full reasoning) -- SVG width overridden
         * via CSS (beats the presentation attribute without !important),
         * height:auto preserves the viewBox aspect ratio, linear
         * interpolation lands exactly on the original 300px at the 480px
         * boundary so there's no visual jump.
         */}
        <style>{`
          @media(max-width:1599px){
            .sitenav-hamburger{display:flex !important;}
            .sitenav-links{display:none !important;}
          }
          @media(max-width:480px){
            .nav-logo svg{width:clamp(150px, calc(93.75vw - 150px), 300px);height:auto;}
          }
        `}</style>
      </nav>
      {mOpen && (
        <div style={{position:"fixed",top:84,left:0,right:0,bottom:0,zIndex:199,background:"rgba(9,9,10,0.98)",display:"flex",flexDirection:"column",padding:"32px 24px",gap:4,overflowY:"auto"}}>
          {links.map(l=>(
            <a key={l.label} href={l.href} onClick={()=>setMOpen(false)}
              style={{padding:"16px 0",fontSize:18,letterSpacing:2,textTransform:"uppercase",color:C.mutedLight,fontFamily:"'Cormorant Garamond',serif",borderBottom:`1px solid ${C.border}`,textDecoration:"none"}}
            >{l.label}</a>
          ))}
          <a href="/visualizer" onClick={()=>setMOpen(false)}
            style={{marginTop:24,padding:"16px",background:C.accent,color:C.black,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:700,borderRadius:4,textAlign:"center",textDecoration:"none",fontFamily:"'Outfit',sans-serif"}}
          >Free Visualizer + Estimate</a>
        </div>
      )}
    </>
  )
}
