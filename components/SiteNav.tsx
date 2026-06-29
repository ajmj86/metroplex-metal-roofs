'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { C, Logo } from './brand'

const NAV_LINKS = [
  {label:"About Us",      href:"/#about"},
  {label:"Why Metal",     href:"/#why-metal"},
  {label:"Gallery",       href:"/#gallery"},
  {label:"Our Process",   href:"/#process"},
  {label:"Service Areas", href:"/#service-areas"},
  {label:"Reviews",       href:"/#reviews"},
]

export default function SiteNav() {
  const [mOpen, setMOpen] = useState(false)

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
          {NAV_LINKS.map(l=>(
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
          {NAV_LINKS.map(l=>(
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
