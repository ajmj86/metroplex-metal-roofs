'use client'

/*
 * Shared interactive material/color selector — tab strip, swatch chips
 * (with the two-level stone drill-down), color modal, and visualizer
 * passthrough (roofType/style/product/color URL params). Originally lived
 * inline in Homepage.jsx; extracted so CityPage.tsx can use the exact same
 * picker instead of a static, non-interactive product grid, and so the two
 * can never drift out of sync.
 *
 * activeTab/onTabChange are optional (controlled/uncontrolled pattern):
 * Homepage.jsx passes its own App-level activeTab state through, because
 * SiteFooter's "Standing Seam / Copper / ..." links need to set the tab
 * and scroll to #products. CityPage.tsx renders this fully uncontrolled —
 * each city page just manages its own local tab state.
 */

import { useState, useEffect, useRef } from "react";
import { C } from "./brand";
import ProductGallery from "./ProductGallery";
import {
  STANDING_SEAM_COLORS, R_PANEL_COLORS, STONE_COLORS, STONE_PROFILE_TILES, STONE_SHINGLE_TILES,
  COPPER_PATINA_CHIPS, COPPER_INSTALL_PHOTOS,
} from "@/lib/productColors";

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
      }}>{displayName || " "}</span>
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

/* ── Static data (module scope) ── */
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

export default function ProductsSection({
  id = "products",
  eyebrow = "Our Products",
  heading = <>Four Systems.<br/>One Standard.</>,
  initialTab = "stone",
  activeTab: controlledActiveTab,
  onTabChange,
}) {
  const [internalTab, setInternalTab] = useState(initialTab);
  const activeTab = controlledActiveTab ?? internalTab;
  const setActiveTab = onTabChange ?? setInternalTab;

  const activeType = roofTypes.find(t=>t.id===activeTab);
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
    <>
      <section id={id} className="section-pad products-section" style={{background:C.surface,borderTop:`1px solid ${C.border}`}}>
        <div className="inner">
          <Reveal>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:20}}>
              <div>
                <div style={{fontSize:15,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:10}}>{eyebrow}</div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.75rem,4.3vw,3.75rem)",fontWeight:700,color:C.white,lineHeight:1.1}}>
                  {heading}
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
    </>
  );
}
