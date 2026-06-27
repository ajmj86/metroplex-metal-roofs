'use client'

import Link from "next/link";
import { C, LEGAL_ENTITY, DBA_NAME, YEAR, Logo } from "./brand";

export function SiteFooter({ setActiveTab = () => {}, setPage = null }) {
  const footerLinks = {
    "Standing Seam":      {href:"/#products", onClick:(e)=>{e.preventDefault();setActiveTab("standing");setTimeout(()=>{const el=document.getElementById("products");if(el)el.scrollIntoView({behavior:"smooth"});},200);}},
    "Copper Roofing":     {href:"/#products", onClick:(e)=>{e.preventDefault();setActiveTab("copper");setTimeout(()=>{const el=document.getElementById("products");if(el)el.scrollIntoView({behavior:"smooth"});},200);}},
    "Stone-Coated Steel": {href:"/#products", onClick:(e)=>{e.preventDefault();setActiveTab("stone");setTimeout(()=>{const el=document.getElementById("products");if(el)el.scrollIntoView({behavior:"smooth"});},200);}},
    "R-Panel":            {href:"/#products", onClick:(e)=>{e.preventDefault();setActiveTab("rpanel");setTimeout(()=>{const el=document.getElementById("products");if(el)el.scrollIntoView({behavior:"smooth"});},200);}},
    "Free Visualizer":    {href:"/visualizer"},
    "Southlake":          {href:"/#service-areas", onClick:(e)=>{e.preventDefault();if(setPage){setPage("home");setTimeout(()=>{const el=document.getElementById("service-areas");if(el)el.scrollIntoView({behavior:"smooth"});},200);}else{window.location.href="/#service-areas";}}},
    "Frisco":             {href:"/#service-areas", onClick:(e)=>{e.preventDefault();if(setPage){setPage("home");setTimeout(()=>{const el=document.getElementById("service-areas");if(el)el.scrollIntoView({behavior:"smooth"});},200);}else{window.location.href="/#service-areas";}}},
    "Westlake":           {href:"/#service-areas", onClick:(e)=>{e.preventDefault();if(setPage){setPage("home");setTimeout(()=>{const el=document.getElementById("service-areas");if(el)el.scrollIntoView({behavior:"smooth"});},200);}else{window.location.href="/#service-areas";}}},
    "Prosper":            {href:"/#service-areas", onClick:(e)=>{e.preventDefault();if(setPage){setPage("home");setTimeout(()=>{const el=document.getElementById("service-areas");if(el)el.scrollIntoView({behavior:"smooth"});},200);}else{window.location.href="/#service-areas";}}},
    "McKinney":           {href:"/#service-areas", onClick:(e)=>{e.preventDefault();if(setPage){setPage("home");setTimeout(()=>{const el=document.getElementById("service-areas");if(el)el.scrollIntoView({behavior:"smooth"});},200);}else{window.location.href="/#service-areas";}}},
    "All DFW Areas →":    {href:"/#service-areas", onClick:(e)=>{e.preventDefault();if(setPage){setPage("home");setTimeout(()=>{const el=document.getElementById("service-areas");if(el)el.scrollIntoView({behavior:"smooth"});},200);}else{window.location.href="/#service-areas";}}},
    "About Us":           {href:"/#about", onClick:(e)=>{e.preventDefault();if(setPage){setPage("home");setTimeout(()=>{const el=document.getElementById("about");if(el){const offset=el.getBoundingClientRect().top+window.scrollY-100;window.scrollTo({top:offset,behavior:"smooth"});}},200);}else{window.location.href="/#about";}}},
    "Our Process":        {href:"/#process", onClick:(e)=>{e.preventDefault();if(setPage){setPage("home");setTimeout(()=>{const el=document.getElementById("process");if(el){const offset=el.getBoundingClientRect().top+window.scrollY-100;window.scrollTo({top:offset,behavior:"smooth"});}},200);}else{window.location.href="/#process";}}},
    "Reviews":            {href:"/#reviews", onClick:(e)=>{e.preventDefault();if(setPage){setPage("home");setTimeout(()=>{const el=document.getElementById("reviews");if(el){const offset=el.getBoundingClientRect().top+window.scrollY-100;window.scrollTo({top:offset,behavior:"smooth"});}},200);}else{window.location.href="/#reviews";}}},
    "Contact":            {href:"/terms#contact"},
  };

  return (
    <footer style={{borderTop:`1px solid ${C.border}`,padding:"48px 32px 28px",background:C.black}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 clamp(20px,5vw,48px)",overflowX:"hidden"}}>
        <div className="sfooter-grid" style={{display:"grid",gridTemplateColumns:"repeat(4, minmax(120px, 1fr))",gap:40,marginBottom:48,alignItems:"start"}}>
          <div>
            <Logo size={1.15} light={false}/>
            <p style={{marginTop:18,fontSize:16,color:C.muted,lineHeight:1.8,maxWidth:260}}>
              Premium metal roofing for DFW homeowners. Licensed partners. Satellite-based estimates. Lifetime results.
            </p>
          </div>
          {[
            {title:"Services",links:[
              ["Standing Seam","/#products"],
              ["Copper Roofing","/#products"],
              ["Stone-Coated Steel","/#products"],
              ["R-Panel","/#products"],
              ["Free Visualizer","/visualizer"],
            ]},
            {title:"Service Areas",links:[
              ["Southlake","/#service-areas"],
              ["Frisco","/#service-areas"],
              ["Westlake","/#service-areas"],
              ["Prosper","/#service-areas"],
              ["McKinney","/#service-areas"],
              ["All DFW Areas →","/#service-areas"],
            ]},
            {title:"Company",links:[
              ["About Us","/#about"],
              ["Our Process","/#process"],
              ["Reviews","/#reviews"],
              ["Contact","/terms#contact"],
            ]},
          ].map(col=>(
            <div key={col.title}>
              <div style={{fontSize:10,letterSpacing:2.5,color:C.accent,textTransform:"uppercase",marginBottom:18}}>{col.title}</div>
              {col.links.map(([l])=>{
                const fl = footerLinks[l];
                const isExt = fl?.href?.startsWith("http");
                const linkStyle = {display:"block",fontSize:13,color:C.muted,marginBottom:9,lineHeight:1.5,transition:"color 0.2s"};
                const hoverProps = {
                  onMouseEnter:(e)=>e.currentTarget.style.color=C.white,
                  onMouseLeave:(e)=>e.currentTarget.style.color=C.muted,
                };
                if (fl?.href?.startsWith("/") && !fl.onClick) {
                  return <Link key={l} href={fl.href} style={linkStyle} {...hoverProps}>{l}</Link>;
                }
                return (
                  <a key={l} href={fl?.href ?? "#"}
                    onClick={fl?.onClick}
                    target={isExt?"_blank":undefined}
                    rel={isExt?"noopener noreferrer":undefined}
                    style={linkStyle}
                    {...hoverProps}
                  >{l}</a>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:22,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{fontSize:11,color:C.muted,lineHeight:1.7}}>
            © {YEAR} {DBA_NAME} · A DBA of {LEGAL_ENTITY}<br/>
            <span style={{fontSize:10,opacity:0.6}}>Dallas–Fort Worth, Texas</span>
          </div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"}}>
            {[["Privacy Policy","/privacy"],["Terms of Service","/terms"]].map(([label,href])=>(
              <Link key={label} href={href}
                style={{fontSize:11,color:C.muted,transition:"color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.color=C.white}
                onMouseLeave={e=>e.currentTarget.style.color=C.muted}
              >{label}</Link>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .sfooter-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .sfooter-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
