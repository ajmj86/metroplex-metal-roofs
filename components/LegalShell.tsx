'use client'

import { useEffect, ReactNode } from "react";
import Link from "next/link";
import { C, LEGAL_FULL, MONTH, YEAR, fonts, globalStyles } from "./brand";
import { SiteFooter } from "./SiteFooter";
import SiteNav from "./SiteNav";

export const LH = ({children, id}: {children: ReactNode; id?: string}) => (
  <h2 id={id} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,3vw,26px)",fontWeight:700,color:C.white,marginTop:44,marginBottom:14}}>{children}</h2>
);

export const LegalShell = ({title, children}: {title: string; children: ReactNode}) => {
  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.getElementById(window.location.hash.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);
  return (
    <div style={{background:C.black,color:C.white,fontFamily:"'Outfit',system-ui,sans-serif",overflowX:"hidden",minHeight:"100vh"}}>
      <style>{fonts + globalStyles}</style>
      <SiteNav/>
      <div style={{maxWidth:760,margin:"0 auto",padding:"clamp(120px,12vw,150px) clamp(24px,5vw,48px) 80px"}}>
        <div style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:14}}>Legal</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:C.white,marginBottom:10}}>{title}</h1>
        <p style={{fontSize:12,color:C.muted,marginBottom:48,letterSpacing:0.3}}>{LEGAL_FULL} · Last updated: {MONTH} {YEAR}</p>
        <div style={{fontSize:14,color:C.mutedLight,lineHeight:1.95}}>{children}</div>
      </div>
      <SiteFooter/>
    </div>
  );
};
