'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { C, Logo } from './brand'

const NAV_LINKS = [
  {label:"About Us",      href:"/about"},
  {label:"Why Metal",     href:"/#why-metal"},
  {label:"Our Products",  href:"/#products"},
  {label:"Gallery",       href:"/#gallery"},
  {label:"Our Process",   href:"/#process"},
  {label:"Why Us",        href:"/#standard"},
  {label:"Service Areas", href:"/#service-areas"},
]

/*
 * City pages have their own why-metal/our-products/process/standard
 * sections. Without this, every nav click bounced a city-page visitor back
 * to the homepage — abandoning the city-specific content (and city page's
 * own matching section) they were already looking at. Gallery doesn't exist
 * on the homepage-only path, but city pages have their own copy now too.
 *
 * "Service Areas" points at the city page's own Nearby Cities section
 * (id="service-areas" on that section, doubling as this anchor target) —
 * not a full duplicate of the homepage's DFW-wide grid, just the closest
 * few cities, which is what "what else do you serve near me" actually
 * wants. The full grid is still one click away via footer/breadcrumb.
 */
const CITY_PAGE_OVERRIDES: Record<string,string> = {
  "Why Metal":     "#why-metal",
  "Our Products":  "#our-products",
  "Gallery":       "#gallery",
  "Our Process":   "#process",
  "Why Us":        "#standard",
  "Service Areas": "#service-areas",
}

// FAQ only exists on city pages (no homepage equivalent), so it's not a
// base NAV_LINKS entry — it's spliced in only when there's a city context.
const FAQ_LABEL = "FAQ"

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
    if (isCityPage && CITY_PAGE_OVERRIDES[l.label]) {
      return { ...l, href: CITY_PAGE_OVERRIDES[l.label] }
    }
    if (!isCityPage && returnCitySlug && CITY_PAGE_OVERRIDES[l.label]) {
      return { ...l, href: `/metal-roofing-${returnCitySlug}-tx${CITY_PAGE_OVERRIDES[l.label]}` }
    }
    return l
  })

  // Splice in FAQ right after "Our Process" — only when there's a city to
  // point it at, either the current page or the last one remembered.
  const faqCitySlug = isCityPage ? currentCitySlug : returnCitySlug
  if (faqCitySlug) {
    const faqHref = isCityPage ? "#faq" : `/metal-roofing-${faqCitySlug}-tx#faq`
    const processIdx = links.findIndex(l => l.label === "Our Process")
    links.splice(processIdx + 1, 0, { label: FAQ_LABEL, href: faqHref })
  }

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
              style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:C.mutedLight,fontWeight:500,transition:"color 0.2s",textDecoration:"none",fontFamily:"'Outfit',sans-serif"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.accent}
              onMouseLeave={e=>e.currentTarget.style.color=C.mutedLight}
            >{l.label}</a>
          ))}
          <a href="/estimate"
            style={{padding:"9px 22px",background:C.accent,color:C.black,fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"background 0.2s",whiteSpace:"nowrap",textDecoration:"none",fontFamily:"'Outfit',sans-serif"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
            onMouseLeave={e=>e.currentTarget.style.background=C.accent}
          >Free Estimate</a>
        </div>
        <button onClick={()=>setMOpen(o=>!o)}
          className="sitenav-hamburger"
          style={{display:"none",background:"none",border:"none",padding:"8px",color:C.white,fontSize:22,lineHeight:1,cursor:"pointer"}}
          aria-label="Menu"
        >{mOpen?"✕":"☰"}</button>
        <style>{`
          @media(max-width:640px){
            .sitenav-hamburger{display:flex !important;}
            .sitenav-links{display:none !important;}
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
          <a href="/estimate" onClick={()=>setMOpen(false)}
            style={{marginTop:24,padding:"16px",background:C.accent,color:C.black,fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:700,borderRadius:4,textAlign:"center",textDecoration:"none",fontFamily:"'Outfit',sans-serif"}}
          >Free Estimate</a>
        </div>
      )}
    </>
  )
}
