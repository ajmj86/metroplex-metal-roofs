'use client'

/*
 * Shared interactive material/color selector — Material Type selector (Metal
 * | Synthetic Slate), tab strip, swatch chips (with the two-level stone
 * drill-down), color modal, and visualizer passthrough (roofType/style/
 * product/color URL params). Originally lived inline in Homepage.jsx;
 * extracted so CityPage.tsx can use the exact same picker instead of a
 * static, non-interactive product grid, and so the two can never drift out
 * of sync.
 *
 * activeTab/onTabChange are optional (controlled/uncontrolled pattern):
 * Homepage.jsx passes its own App-level activeTab state through, because
 * SiteFooter's "Standing Seam / Copper / ..." links need to set the tab
 * and scroll to #products. CityPage.tsx renders this fully uncontrolled —
 * each city page just manages its own local tab state.
 *
 * materialType is NOT separate state -- it's derived from activeTab (is it
 * one of the 3 Brava ids, or not). SiteFooter's links only ever set metal
 * tab ids and know nothing about materialType, so if it were independent
 * state a footer click while a Brava tab was active would desync (Brava
 * tab-row still showing, activeTab pointing at a metal id it doesn't
 * contain). Deriving it keeps activeTab the single source of truth.
 */

import { useState, useEffect, useRef } from "react";
import { C } from "./brand";
import { useUtmHref } from "@/lib/useUtmHref";
import { trackVisualizerCta, trackGuideLinkClick } from "@/lib/analytics";
import ProductGallery from "./ProductGallery";
import {
  STANDING_SEAM_COLORS, R_PANEL_COLORS, STONE_COLORS, STONE_PROFILE_TILES, STONE_SHINGLE_TILES,
  COPPER_PATINA_CHIPS, COPPER_INSTALL_PHOTOS,
} from "@/lib/productColors";
import { productsForStyle, MATERIAL_TYPE_DISPLAY_LABELS, styleHasWidthVariants, colorsForWidth, colorImageForWidth } from "@/lib/roofProducts";

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
          <img src={chip.src} alt="" loading="lazy" decoding="async" style={{
            width:"100%",height:"100%",objectFit:"cover",display:"block",
            ...(chip.imageScale ? { transform:`scale(${chip.imageScale})`, transformOrigin: chip.imageOrigin || "50% 50%" } : {}),
          }}/>
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

/*
 * ── Synthetic Slate (Brava) — a second Material Type alongside the 4 metal
 * materials below. Reuses lib/roofProducts.ts's synthetic_slate data (the
 * visualizer's own source of truth) via a thin adapter, rather than
 * re-deriving color data a third time. lib/bravaColors.ts is NOT used here
 * -- checked directly, it carries name + premiumBlend only, no image paths
 * (by its own doc comment, it exists purely for /synthetic-slate-roofing's
 * marketing copy).
 *
 * Ids match roofProducts.json's style keys directly (spanish_barrel_tile/
 * cedar_shake/slate) so they plug into productsForStyle() with no lookup
 * table of their own. Declared before roofTypes/heroMap/etc. below since
 * several of those merge these in directly.
 */
const bravaStyles = [
  { id: "spanish_barrel_tile", label: "Brava Spanish Barrel Tile", desc: "A rounded, high-relief barrel profile that reads as authentic clay tile from the curb, popular on Mediterranean, Spanish Colonial, and Tuscan-style homes across DFW." },
  { id: "cedar_shake",         label: "Brava Cedar Shake",         desc: "A deeply textured, hand-split shake profile for homeowners who want a rustic, natural-wood look without cedar's fire risk, rot, or ongoing upkeep." },
  { id: "slate",               label: "Brava Slate",               desc: "A crisp, dimensional slate profile, the closest match to authentic quarried slate, suited to historic-style, French Country, and traditional architecture." },
];
const BRAVA_TAB_IDS = bravaStyles.map(t => t.id);
// Same "flavor" colors already featured on /synthetic-slate-roofing's own
// profile cards, for visual consistency between the two pages.
const bravaHeroMap = {
  spanish_barrel_tile: "/products/synthetic_slate/spanish_barrel_tile/aged-mission.webp",
  cedar_shake:          "/products/synthetic_slate/cedar_shake/aged-cedar.jpg",
  slate:                "/products/synthetic_slate/slate/arendale-standard.jpg",
};
// All three profiles route to the same roofType; style disambiguates which.
const bravaVisualizerRoofTypeMap = {
  spanish_barrel_tile: "synthetic_slate",
  cedar_shake: "synthetic_slate",
  slate: "synthetic_slate",
};
// No per-profile anchors exist on /synthetic-slate-roofing today (checked
// directly -- only #pricing/#faq/#service-areas), so, like Stone-Coated
// Steel's own multi-product-line guide link, all three profiles point at
// the same page rather than a fragment that doesn't exist.
const bravaProductPageMap = {
  spanish_barrel_tile: "/synthetic-slate-roofing",
  cedar_shake: "/synthetic-slate-roofing",
  slate: "/synthetic-slate-roofing",
};
/*
 * ── Slate thumbnail zoom correction ──
 * Started as the exact scale/transformOrigin values tuned in
 * app/visualizer/page.tsx's SLATE_THUMB_ZOOM for these same 6 source
 * photos (the Slate colors with no width-variant photography, which read
 * as noticeably more zoomed-out than the other 7 colors' tightly-cropped
 * width-variant photos). Graphite and White were re-tuned down from the
 * visualizer's 2.05 (which reads correctly at the visualizer's 120px
 * swatch size, but over-zooms in this component's larger swatch-modal
 * preview) -- the other 4 keep the original value since they weren't
 * flagged as over-zoomed here.
 */
const SLATE_THUMB_ZOOM = {
  Graphite:      { scale: 1.55, origin: "50% 42%" },
  Washington:    { scale: 2.05, origin: "50% 38%" },
  White:         { scale: 1.55, origin: "50% 40%" },
  European:      { scale: 2.05, origin: "50% 40%" },
  "Pine Green":  { scale: 2.05, origin: "50% 38%" },
  "Tuscan Clay": { scale: 2.05, origin: "50% 42%" },
  /*
   * The 7 width-variant colors below were originally left out of this map
   * on the assumption that their source photos (cropped from Brava's
   * width-comparison graphics) were already "tightly zoomed" enough. Not
   * true at this component's 74px circular chip size: the object-fit:cover
   * crop keeps every row from the source photo, so it gets squeezed down
   * so far that Multi-Width's irregular tile widths and Standard's uniform
   * ones render nearly indistinguishable -- confirmed live, the difference
   * only became visible once the chip was clicked into the full-size
   * ProductGallery modal. Scale 1.35 / origin 50% 30% (tuned by rendering
   * actual candidate crops for all 7 colors, not picked by eye alone) crops
   * down to roughly one full tile row instead of four+, which is enough to
   * make the width irregularity itself legible at chip size for both
   * widths -- one shared value, not per-color, since Brava's width-
   * comparison photos share consistent framing across these 7 colors.
   */
  Arendale:         { scale: 1.35, origin: "50% 30%" },
  Atlantic:         { scale: 1.35, origin: "50% 30%" },
  Cottage:          { scale: 1.35, origin: "50% 30%" },
  "Light Arendale": { scale: 1.35, origin: "50% 30%" },
  Onyx:             { scale: 1.35, origin: "50% 30%" },
  Sandstone:        { scale: 1.35, origin: "50% 30%" },
  Victorian:        { scale: 1.35, origin: "50% 30%" },
};
/*
 * ── Spanish Barrel Tile / Cedar Shake badge-crop corrections ──
 * Same "Premium Blend" label, same top-left position/size, on the same 5
 * premiumBlend colors per style (see config/roofProducts.json) -- these
 * two styles otherwise need no zoom at all (their non-premiumBlend colors
 * are already visually consistent with each other, confirmed in the prior
 * Slate-only pass), so only the affected colors get a value here, tuned
 * to the minimum scale that clears the badge -- not SLATE_THUMB_ZOOM's
 * larger values, which also had a separate cross-color-consistency goal
 * these two styles don't need.
 */
const SPANISH_BARREL_ZOOM = {
  Autumn:                { scale: 1.18, origin: "85% 78%" },
  Mediterranean:         { scale: 1.18, origin: "85% 78%" },
  "Pine Green":          { scale: 1.18, origin: "85% 78%" },
  Sandstone:             { scale: 1.25, origin: "86% 78%" },
  "White Spanish Barrel": { scale: 1.18, origin: "85% 78%" },
};
const CEDAR_SHAKE_ZOOM = {
  Arendale:       { scale: 1.35, origin: "72% 64%" },
  "Light Arendale": { scale: 1.35, origin: "72% 64%" },
  "New Cedar":    { scale: 1.35, origin: "72% 64%" },
  Onyx:           { scale: 1.35, origin: "72% 64%" },
  White:          { scale: 1.35, origin: "72% 64%" },
};
const BRAVA_FLAT_ZOOM = {
  spanish_barrel_tile: SPANISH_BARREL_ZOOM,
  cedar_shake: CEDAR_SHAKE_ZOOM,
};
// Adapter: lib/roofProducts.ts's ColorOption (image1, ...) -> the flat
// {name, src} shape this component already expects from lib/productColors.js,
// plus the per-color zoom correction above for the two flat (non-width-tiered)
// Brava styles. Slate is width-tiered and handled separately in the component
// body (see slateChips) since it needs to react to slateWidth state.
const bravaColorsForStyle = (styleId) => {
  const [, product] = productsForStyle("synthetic_slate", styleId)[0] ?? [];
  const zoomMap = BRAVA_FLAT_ZOOM[styleId] ?? {};
  return (product?.colors ?? []).map(c => {
    const zoom = zoomMap[c.name];
    return { name: c.name, src: c.image1, imageScale: zoom?.scale, imageOrigin: zoom?.origin };
  });
};

/* ── Static data (module scope) ── */
const roofTypes = [
  {id:"stone",   label:"Stone-Coated Steel",  desc:"The look of architectural shingles with the strength of steel. Class 4 hail rating, ideal for HOA-governed DFW communities that require traditional aesthetics."},
  {id:"copper",  label:"Copper",              desc:"The most premium material in residential roofing. Develops a natural patina over decades, lasts 80 to 100 years, and signals enduring quality. Ideal for estate-level homes or architectural accents."},
  {id:"standing",label:"Standing Seam Steel", desc:"The gold standard in metal roofing. Hidden fasteners, clean architectural lines, and a 50+ year lifespan. Preferred by luxury homebuilders and architects across DFW."},
  {id:"rpanel",  label:"R-Panel",             desc:"A proven exposed-fastener metal panel system offering exceptional durability and longevity. A straightforward entry into metal roofing without sacrificing long-term performance."},
];
const specMap = {
  standing:[{k:"Lifespan",v:"50–70 yrs"},{k:"Hail Rating",v:"Class 4"},{k:"Wind",v:"High Wind Resistance"},{k:"Fastener",v:"Hidden"}],
  copper:  [{k:"Lifespan",v:"80–100 yrs"}, {k:"Patina",v:"Natural"},{k:"Wind",v:"High Wind Resistance"},{k:"Maintenance",v:"Near zero"}],
  stone:   [{k:"Lifespan",v:"40–70 yrs"},{k:"Hail Rating",v:"Class 4"},{k:"Wind",v:"High Wind Resistance"},{k:"Profile",v:"Shingle-style"}],
  rpanel:  [{k:"Lifespan",v:"40–60 yrs"},{k:"Hail Rating",v:"Class 4"},{k:"Wind",v:"High Wind Resistance"},{k:"Fastener",v:"Exposed"}],
};
// Brava cards use the same 2x2 spec grid as the metal cards. The color count
// comes from the color config for that profile.
const specGridFor = (tab) => {
  if (!BRAVA_TAB_IDS.includes(tab)) return specMap[tab] || [];
  const n = (productsForStyle("synthetic_slate", tab)[0]?.[1]?.colors ?? []).length;
  return [
    {k:"Hail Rating",v:"Class 4"},
    {k:"Warranty",v:"50-Year Limited"},
    {k:"Colors",v:String(n)},
    {k:"Construction",v:"Compression Molded"},
  ];
};
const badgeMap = {standing:"Popular Choice",copper:"Premium",stone:"HOA Friendly",rpanel:"Value Option",slate:"Premium Choice",cedar_shake:"Natural Wood Look",spanish_barrel_tile:"Clay Tile Look"};
// Standalone material landing pages (Phase 3) -- only populated for
// materials that have a page built so far. Tabs without an entry here just
// don't render the secondary "full guide" link.
// Visible label per guide page (not per tab), so all three Brava tabs read
// "Brava roofing" because they share one page.
const guideLabelMap = {
  standing:"standing seam metal",
  stone:"stone-coated steel",
  copper:"copper roofing",
  rpanel:"R-panel metal",
  spanish_barrel_tile:"Brava roofing",
  cedar_shake:"Brava roofing",
  slate:"Brava roofing",
};
const productPageMap = {
  standing:"/standing-seam-roofing",
  stone:"/stone-coated-steel-roofing",
  copper:"/copper-roofing",
  rpanel:"/r-panel-roofing",
  ...bravaProductPageMap,
};

/* Single hero shot per material — replaces the old 4-up collage image. */
const heroMap = {
  standing: "/Installation Pics/Standing-Seam-Steel-True-Black.PNG",
  copper:   "/Installation Pics/Standing-Seam-Copper.PNG",
  stone:    "/Installation Pics/Stone-Coated-Steel-Pacific-Tile-Timberwood.jpg",
  // No install photo exists for R-Panel — swatch stand-in until real photography is shot.
  rpanel:   "/products/r_panel/true-black.jpg",
  ...bravaHeroMap,
};
// All 7 product photos share one 4:3 frame (the stone-coated steel / standing
// seam aspect ratio) with object-fit: cover. Only the two square sources need a
// non-centered crop: copper keeps the whole main roof, R-panel keeps the whole
// panel with an even margin of white.
const heroPositionMap = {
  copper: "50% 75%",
  rpanel: "50% 32%",
};
const visualizerRoofTypeMap = {
  standing: "standing_seam",
  copper:   "copper_standing_seam",
  stone:    "stone_coated_steel",
  rpanel:   "r_panel",
  ...bravaVisualizerRoofTypeMap,
};

/*
 * roofProducts.json style/product keys for the swatch modal CTA's
 * passthrough params — flat materials have a single style/product pair,
 * stone varies by which tile the modal was opened from. The 3 Brava
 * profiles are flat in this same sense (one style, one product each) so
 * they slot into this map directly rather than needing their own.
 */
const flatMaterialVisualizerParams = {
  standing: { style: "standing_seam", product: "standing_seam" },
  rpanel:   { style: "r_panel",       product: "r_panel" },
  spanish_barrel_tile: { style: "spanish_barrel_tile", product: "brava_spanish_barrel_tile" },
  cedar_shake:          { style: "cedar_shake",         product: "brava_cedar_shake" },
  slate:                { style: "slate",               product: "brava_slate" },
};
/*
 * Main "See it on your home" CTA href, shared by the image-panel link and
 * the info-panel button. Unlike the swatch-modal CTA (which only fires once
 * a color has been picked), this is visible immediately on tab load, before
 * any color is chosen — so it never includes a color param.
 *
 * roofType=synthetic_slate has 3 different styles (unlike standing/r-panel,
 * which have exactly one), so it can't auto-resolve a style the way those
 * do -- the visualizer's own prefill effect requires an explicit ?style=
 * when hasExactlyOneProduct(roofType) is false (confirmed by reading that
 * effect directly). Building this from flatMaterialVisualizerParams like
 * the modal CTA already does gives Brava the style param it needs for free.
 * Stone and copper have no entry in that map, so their output is byte-
 * identical to the old roofType-only literal -- zero behavior change there.
 */
const materialVisualizerHref = (tab) => {
  const params = flatMaterialVisualizerParams[tab];
  return `/visualizer?${new URLSearchParams({
    roofType: visualizerRoofTypeMap[tab],
    ...(params ? { style: params.style, product: params.product } : {}),
  }).toString()}`;
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
  standing: { full: STANDING_SEAM_COLORS, rowOverride: null,      caption: n => `Available in ${n} colors, view all` },
  rpanel:   { full: R_PANEL_COLORS,       rowOverride: null,      caption: n => `Available in ${n} colors, view all` },
  copper:   { full: COPPER_PATINA_CHIPS,  rowOverride: null,      caption: () => "One material. A finish that evolves for generations." },
  spanish_barrel_tile: { full: bravaColorsForStyle("spanish_barrel_tile"), rowOverride: null, caption: n => `Available in ${n} colors, view all` },
  cedar_shake:          { full: bravaColorsForStyle("cedar_shake"),         rowOverride: null, caption: n => `Available in ${n} colors, view all` },
  slate:                { full: bravaColorsForStyle("slate"),               rowOverride: null, caption: n => `Available in ${n} colors, view all` },
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
  // Explicit `= undefined` (not just omitted) is required, not stylistic:
  // under allowJs, TS infers prop optionality from destructured defaults.
  // Without one here, activeTab/onTabChange got inferred as required,
  // which broke CityPage.tsx's uncontrolled usage at build time.
  activeTab: controlledActiveTab = undefined,
  onTabChange = undefined,
}) {
  const utm = useUtmHref();   // visualizer CTAs carry the stored UTMs
  const [internalTab, setInternalTab] = useState(initialTab);
  const activeTab = controlledActiveTab ?? internalTab;
  const setActiveTab = onTabChange ?? setInternalTab;

  // Derived, not its own state -- see the top-of-file note on why.
  const materialType = BRAVA_TAB_IDS.includes(activeTab) ? "synthetic_slate" : "metal";
  const handleMaterialTypeChange = (mt) => {
    setActiveTab(mt === "synthetic_slate" ? BRAVA_TAB_IDS[0] : "stone");
  };

  const activeType = [...roofTypes, ...bravaStyles].find(t=>t.id===activeTab);
  const groupTypes = materialType === "metal" ? roofTypes : bravaStyles;
  // Under 768px the sub-tab strip is one horizontally scrolling row; keep the
  // active tab in view. Scrolls the strip itself, never the page.
  const subTabsRef = useRef(null);
  // Edge fades / chevrons for that row: shown only while there is more to scroll that way.
  const [subScroll, setSubScroll] = useState({ left: false, right: false, activeL: false, activeR: false });
  useEffect(() => {
    const strip = subTabsRef.current;
    if (!strip) return;
    const update = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      // Whether the active tab sits under a chevron, so the glyph can switch to a dark color.
      const sr = strip.getBoundingClientRect();
      const ab = strip.querySelector('[data-active="true"]')?.getBoundingClientRect();
      setSubScroll(prev => {
        const next = {
          left: strip.scrollLeft > 4,
          right: strip.scrollLeft < max - 4,
          activeL: !!ab && ab.left < sr.left + 30 && ab.right > sr.left,
          activeR: !!ab && ab.right > sr.right - 30 && ab.left < sr.right,
        };
        return Object.keys(next).every(k => prev[k] === next[k]) ? prev : next;
      });
    };
    update();
    strip.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { strip.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [materialType, activeTab]);
  const nudgeSubTabs = (dir) => {
    const strip = subTabsRef.current;
    if (!strip) return;
    const w = strip.querySelector("button")?.offsetWidth ?? 120;
    // Clamp to the real scroll range: an unclamped target made iOS scroll past the ends and show an empty box.
    const max = Math.max(0, strip.scrollWidth - strip.clientWidth);
    const target = Math.max(0, Math.min(strip.scrollLeft + dir * w, max));
    strip.scrollTo({ left: target, behavior: "smooth" });
  };
  useEffect(() => {
    const strip = subTabsRef.current;
    const btn = strip?.querySelector('[data-active="true"]');
    if (!strip || !btn || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({ left: Math.max(0, btn.offsetLeft - (strip.clientWidth - btn.offsetWidth) / 2), behavior: "smooth" });
  }, [activeTab]);
  const [swatchModal, setSwatchModal] = useState(null); // { material, tileKey?, items, index } | null
  // Independent of swatchModal so it survives modal close (Back/Escape/backdrop) — see openStoneColorModal.
  const [stoneTileLevel, setStoneTileLevel] = useState("profiles"); // "profiles" | "shingle"
  // Same pattern as stoneTileLevel above — a sub-drill-down within one tab,
  // independent of swatchModal so it survives modal close. Matches the
  // visualizer's own Standard/Multi-Width split for this exact style (see
  // styleHasWidthVariants/colorsForWidth in lib/roofProducts.ts).
  const [slateWidth, setSlateWidth] = useState("standard"); // "standard" | "multi"

  // Slate-only: build the width-filtered color list live (not at module
  // scope like bravaColorsForStyle, since it needs to react to slateWidth),
  // and attach the zoom-correction values above per color/width. Other
  // Brava styles (Spanish Barrel Tile, Cedar Shake) have no width
  // distinction, so styleHasWidthVariants gates this off for them.
  const slateHasWidthVariants = styleHasWidthVariants("synthetic_slate", "slate");
  const slateColorsRaw = productsForStyle("synthetic_slate", "slate")[0]?.[1]?.colors ?? [];
  const slateVisibleColors = slateHasWidthVariants ? colorsForWidth(slateColorsRaw, slateWidth) : slateColorsRaw;
  const slateChips = slateVisibleColors.map(c => {
    const zoom = SLATE_THUMB_ZOOM[c.name];
    return {
      name: c.name,
      src: colorImageForWidth(c, slateHasWidthVariants ? slateWidth : null),
      imageScale: zoom?.scale,
      imageOrigin: zoom?.origin,
    };
  });
  // The big hero photo above the swatch row is a single static
  // representative shot per material (see heroMap/bravaHeroMap) that
  // doesn't track color selection for any material -- deliberate, one
  // "flavor" shot per tab. Slate's Width toggle is different: it's the
  // one selector in this whole section whose entire purpose is changing
  // what the tile pattern looks like, sitting directly above this same
  // hero image, so leaving the hero permanently on Arendale-standard's
  // photo while Multi-Width is selected read as broken, not as "one
  // representative shot" -- confirmed live, the hero never changed no
  // matter which width was active. Swaps the hero to Arendale's own
  // standard/multi photo (still the same representative color heroMap.slate
  // already used) to track slateWidth, same source data as the swatches.
  const slateHeroColor = slateColorsRaw.find(c => c.name === "Arendale");
  const slateHeroSrc = slateHasWidthVariants && slateHeroColor?.widthVariants
    ? colorImageForWidth(slateHeroColor, slateWidth)
    : heroMap.slate;

  const swatchDataByTabLive = activeTab === "slate"
    ? { ...swatchDataByTab, slate: { ...swatchDataByTab.slate, full: slateChips } }
    : swatchDataByTab;

  const swatchData = activeTab !== "stone" ? swatchDataByTabLive[activeTab] : null;
  const swatchChips = swatchData ? (swatchData.rowOverride ?? swatchData.full).slice(0, SWATCH_ROW_LIMIT) : [];
  const swatchOverflow = swatchData ? swatchData.full.length - swatchChips.length : 0;

  const openSwatchModal = (tab, item) => {
    if (tab === "copper") {
      setSwatchModal({ material: "copper", items: [{ name: "Copper Patina" }], index: 0 });
      return;
    }
    const full = swatchDataByTabLive[tab].full;
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
      <a href={utm(swatchModalHref)} onClick={()=>trackVisualizerCta("products_card",swatchModalHref)} className="cta-btn"
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
        <p style={{fontSize:14,color:C.mutedLight,lineHeight:1.7,margin:0}}>Copper isn't chosen from a color chart. It's one material whose surface evolves for decades.</p>
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
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",marginBottom:48,gap:28}}>
              {/*
               * maxWidth is a safety net, not the fix -- flex-wrap's
               * line-breaking decision uses each item's natural
               * (pre-shrink) width, so an unbounded heading here could
               * still push the row's total width past the .inner
               * container's 1200px on the wider 4-tab Metal row while
               * fitting on the narrower 3-tab Synthetic Slate row,
               * wrapping inconsistently between the two states. The real
               * fix is keeping heading callers' actual text short enough
               * to fit both states' worst case (Metal's 4-tab row, 463px)
               * -- CityPage.tsx's heading was shortened for exactly this
               * (see its own comment). 900px is generous headroom for
               * that, not a tight budget being relied on to force wraps.
               */}
              <div style={{maxWidth:900,minWidth:0}}>
                <div style={{fontSize:15,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:10}}>{eyebrow}</div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.75rem,4.3vw,3.75rem)",fontWeight:700,color:C.white,lineHeight:1.1}}>
                  {heading}
                </h2>
              </div>
              {/*
               * Material Type selector, stacked directly above the roof-type
               * tab strip as one grouped control cluster (both right-
               * aligned, same column, small gap) -- rather than its own
               * full-width row above the eyebrow/heading, which read as
               * disconnected page-header chrome instead of belonging to
               * this section. Same tab-strip visual language throughout
               * (bordered pill-row, dividers, accent-fill active state),
               * not the visualizer's rounded button-grid style. Metal
               * selection leaves the tab strip below completely untouched;
               * Synthetic Slate swaps it to the 3 Brava profiles.
               */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:10,flexShrink:0,maxWidth:"100%"}}>
                <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:4,overflow:"hidden",flexShrink:0}}>
                  {["metal","synthetic_slate"].map(mt=>(
                    <button key={mt} onClick={()=>handleMaterialTypeChange(mt)}
                      style={{padding:"9px 14px",fontSize:10,letterSpacing:1,textTransform:"uppercase",color:materialType===mt?C.black:C.muted,background:materialType===mt?C.accent:"transparent",borderRight:`1px solid ${C.border}`,transition:"all 0.2s",whiteSpace:"nowrap"}}
                    >{MATERIAL_TYPE_DISPLAY_LABELS[mt]}</button>
                  ))}
                </div>
                {/* Tab strip: wraps from 768px up; under 768px one row that scrolls sideways (see .ps-subtabs) */}
                <style>{`
                  @media (max-width:767px){
                    .ps-subtabs{flex-wrap:nowrap !important;overflow-x:auto !important;scroll-snap-type:x proximity;overscroll-behavior-x:none;scrollbar-width:none;-webkit-overflow-scrolling:touch}
                    .ps-subtabs::-webkit-scrollbar{display:none}
                    .ps-subtabs button{flex:0 0 auto;scroll-snap-align:start;padding:9px 11px !important;position:relative}
                    .ps-subtabs button[data-active="true"]{z-index:2}
                  }
                  .ps-subtabs-wrap{position:relative;display:flex;max-width:100%;flex-shrink:0}
                  .ps-subtabs-wrap .ps-subtabs{min-width:0}
                  .ps-subtabs-wrap .ps-fade,.ps-subtabs-wrap .ps-chev{display:none;position:absolute;top:1px;bottom:1px}
                  .ps-fade{width:56px;pointer-events:none;z-index:1}
                  .ps-fade-r{right:1px;background:linear-gradient(to left,${C.surface} 0,${C.surface} 48%,rgba(17,17,19,0))}
                  .ps-fade-l{left:1px;background:linear-gradient(to right,${C.surface} 0,${C.surface} 48%,rgba(17,17,19,0))}
                  .ps-chev{width:26px;z-index:3;padding:0 0 2px;background:none;border:none;color:${C.accent};font-size:20px;line-height:1;cursor:pointer}
                  .ps-chev-r{right:1px}
                  .ps-chev-dark{color:${C.black}}
                  .ps-chev-l{left:1px}
                  @media (max-width:767px){.ps-subtabs-wrap .ps-fade,.ps-subtabs-wrap .ps-chev{display:block}}
                `}</style>
                <div className="ps-subtabs-wrap">
                <div ref={subTabsRef} className="ps-subtabs" style={{display:"flex",flexWrap:"wrap",border:`1px solid ${C.border}`,borderRadius:4,overflow:"hidden",flexShrink:0,maxWidth:"100%"}}>
                  {(materialType==="metal" ? roofTypes : bravaStyles).map(t=>(
                    <button key={t.id} data-active={activeTab===t.id} onClick={()=>setActiveTab(t.id)}
                      style={{padding:"9px 14px",fontSize:10,letterSpacing:1,textTransform:"uppercase",color:activeTab===t.id?C.black:C.muted,background:activeTab===t.id?C.accent:"transparent",borderRight:`1px solid ${C.border}`,transition:"all 0.2s",whiteSpace:"nowrap"}}
                    >{t.label}</button>
                  ))}
                </div>
                {subScroll.left && <><div className="ps-fade ps-fade-l" aria-hidden="true"/><button type="button" className={`ps-chev ps-chev-l${subScroll.activeL ? " ps-chev-dark" : ""}`} aria-label="Previous options" onClick={()=>nudgeSubTabs(-1)}>‹</button></>}
                {subScroll.right && <><div className="ps-fade ps-fade-r" aria-hidden="true"/><button type="button" className={`ps-chev ps-chev-r${subScroll.activeR ? " ps-chev-dark" : ""}`} aria-label="More options" onClick={()=>nudgeSubTabs(1)}>›</button></>}
                </div>
              </div>
            </div>
          </Reveal>
          {activeType && (
            <Reveal key={activeTab}>
              <div className="grid-2" style={{border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
                {/* Image panel */}
                <div style={{display:"flex",flexDirection:"column",height:"100%",minWidth:0}}>
                  <a
                    href={utm(materialVisualizerHref(activeTab))}
                    onClick={()=>trackVisualizerCta("products_card",materialVisualizerHref(activeTab))}
                    style={{display:"block",overflow:"hidden",cursor:"pointer",flex:"0 0 auto",aspectRatio:"4 / 3",width:"100%"}}
                  >
                    <img
                      src={activeTab === "slate" ? slateHeroSrc : heroMap[activeTab]}
                      alt={`${activeType.label} roof`}
                      loading="lazy"
                      decoding="async"
                      style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:heroPositionMap[activeTab] ?? "center",display:"block",transition:"transform 0.3s ease"}}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                  </a>
                  {/* Swatch row */}
                  <div className="ps-swatch-block" style={{minWidth:0,background:C.black,borderTop:`1px solid ${C.border}`,padding:"26px clamp(20px,3vw,32px) 28px"}}>
                    {activeTab === "stone" ? (
                      <>
                        <div style={{display:"flex",alignItems:"flex-start",gap:16,overflowX:"auto",flex:"0 0 auto",padding:"12px 12px 14px",margin:"-12px -12px -14px"}}>
                          {(stoneTileLevel === "profiles" ? stoneProfileChips : stoneShingleChips).map(chip=>(
                            <SwatchChip key={chip.key} chip={chip} size="tile" badge={chip.key === "shingle" ? "2 Styles" : undefined}
                              onClick={()=>stoneTileLevel==="profiles" ? handleStoneProfileChipClick(chip) : handleStoneShingleChipClick(chip)}/>
                          ))}
                        </div>
                        {stoneTileLevel === "profiles" ? (
                          <div style={{marginTop:"auto",paddingTop:18,minHeight:57}}><div style={{fontSize:11,letterSpacing:0.6,color:C.muted}}>Tap a profile to explore its colors</div></div>
                        ) : (
                          <div style={{marginTop:"auto",paddingTop:18,minHeight:57}}><button
                            onClick={()=>setStoneTileLevel("profiles")}
                            style={{display:"block",fontSize:11,letterSpacing:0.6,color:C.muted,background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left",transition:"color 0.2s"}}
                            onMouseEnter={e=>e.currentTarget.style.color=C.mutedLight}
                            onMouseLeave={e=>e.currentTarget.style.color=C.muted}
                          >← Back to profiles</button></div>
                        )}
                      </>
                    ) : (
                      <>
                        {/*
                         * Width sub-selector, Slate only -- matches the
                         * visualizer's own Standard/Multi-Width split for
                         * this exact style (styleHasWidthVariants gates it
                         * off automatically for Spanish Barrel Tile/Cedar
                         * Shake, which have no width distinction). Same
                         * drill-down pattern as Stone-Coated Steel's
                         * profile/shingle tile level above, just a plain
                         * two-button toggle instead of tiles since there's
                         * no separate preview image per width tier here.
                         */}
                        <div style={{display:"flex",alignItems:"flex-start",gap:10,overflowX:"auto",flex:"0 0 auto",padding:"12px 12px 14px",margin:"-12px -12px -14px"}}>
                          {swatchChips.map((chip,i)=>(
                            <SwatchChip key={chip.src || chip.hex || `${chip.name}-${i}`} chip={chip} onClick={()=>openSwatchModal(activeTab, chip)}/>
                          ))}
                          {swatchOverflow > 0 && (
                            <SwatchChip label={`+${swatchOverflow}`} onClick={()=>openSwatchModal(activeTab)}/>
                          )}
                        </div>
                        <div className="ps-cap-wrap">
                          {/* Slate-only Standard/Multi-Width toggle lives with the caption: beside it on wide
                              blocks, above it otherwise. Only rendered when the tab has it, so no tab reserves space. */}
                          {activeTab === "slate" && slateHasWidthVariants && (
                            <div className="ps-width-toggle">
                              {["standard","multi"].map(w=>(
                                <button key={w} onClick={()=>setSlateWidth(w)}
                                  style={{padding:"7px 14px",fontSize:10,letterSpacing:1,textTransform:"uppercase",color:slateWidth===w?C.black:C.muted,background:slateWidth===w?C.accent:"transparent",border:`1px solid ${slateWidth===w?C.accent:C.border}`,borderRadius:4,cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap"}}
                                >{w==="standard" ? "Standard Slate" : "Multi-Width Slate"}</button>
                              ))}
                            </div>
                          )}
                        <div style={{paddingTop:18,minHeight:57}}><button
                          onClick={()=>openSwatchModal(activeTab)}
                          style={{display:"block",fontSize:13,letterSpacing:0.6,color:C.muted,background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left",transition:"color 0.2s"}}
                          onMouseEnter={e=>e.currentTarget.style.color=C.mutedLight}
                          onMouseLeave={e=>e.currentTarget.style.color=C.muted}
                        >{swatchData.caption(swatchData.full.length)}</button></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* Info panel */}
                <div style={{background:C.black,padding:"clamp(28px,4vw,52px)",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:32}}>
                  <div>
                    {badgeMap[activeTab] && (
                      <div style={{fontSize:10,color:C.accent,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{badgeMap[activeTab]}</div>
                    )}
                    {/*
                      * Title and description for every tab in the active group are stacked in one
                      * grid cell and only the active one is visible, so the cell is always as tall
                      * as the longest title/description in the group and nothing below moves when
                      * the tab changes.
                      */}
                    <div style={{display:"grid",marginBottom:20}}>
                      {groupTypes.map(t=>(
                        <div key={t.id} aria-hidden={t.id!==activeTab || undefined} style={{gridArea:"1 / 1",visibility:t.id===activeTab?"visible":"hidden",fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,3vw,36px)",fontWeight:700,color:C.white}}>{t.label}</div>
                      ))}
                    </div>
                    <div style={{display:"grid",marginBottom:28}}>
                      {groupTypes.map(t=>(
                        <p key={t.id} aria-hidden={t.id!==activeTab || undefined} style={{gridArea:"1 / 1",visibility:t.id===activeTab?"visible":"hidden",fontSize:16,color:C.mutedLight,lineHeight:1.8,margin:0}}>{t.desc}</p>
                      ))}
                    </div>
                    <div className="ps-spec-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridAutoRows:"minmax(var(--ps-spec-row),auto)",gap:0}}>
                      {specGridFor(activeTab).map(item=>(
                        <div key={item.k} style={{padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
                          <div style={{fontSize:9,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{item.k}</div>
                          <div style={{fontSize:14,color:C.white,fontWeight:500}}>{item.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <style>{`
                    .ps-spec-grid{--ps-spec-row:67px}
                    .ps-cap-wrap{margin-top:auto;position:relative}
                    .ps-width-toggle{display:flex;gap:8px;margin-bottom:-10px}
                    @media (min-width:768px) and (max-width:1024px),(min-width:1280px){.ps-width-toggle{position:absolute;right:0;top:12px;margin:0}}
                    .ps-swatch-block{display:flex;flex-direction:column;flex:0 0 auto;height:254px;overflow:hidden}
                    @media (max-width:640px){.ps-swatch-block{height:240px}}
                    .ps-cta-row{display:flex;flex-direction:row;align-items:center;flex-wrap:nowrap;gap:14px 28px}
                    .ps-guide-link{display:block;flex:1 1 0;min-width:0;line-height:1.5;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;color:${C.accent};text-decoration:none;transition:color 0.2s}
                    .ps-guide-link:hover,.ps-guide-link:focus-visible{color:${C.accentLight};text-decoration:underline}
                    @media (max-width:640px){.ps-cta-row{flex-direction:column;align-items:flex-start;gap:16px}.ps-guide-link{flex:0 0 auto;min-height:3em}}
                  `}</style>
                  <div className="ps-cta-row">
                    <a href={utm(materialVisualizerHref(activeTab))} onClick={()=>trackVisualizerCta("products_card",materialVisualizerHref(activeTab))} className="cta-btn"
                      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 24px",background:C.accent,color:C.black,fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,borderRadius:2,transition:"background 0.2s",width:"fit-content"}}
                      onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
                      onMouseLeave={e=>e.currentTarget.style.background=C.accent}
                    >See it on your home →</a>
                    {productPageMap[activeTab] && (
                      <a href={productPageMap[activeTab]} onClick={()=>trackGuideLinkClick(visualizerRoofTypeMap[activeTab] ?? activeTab)} className="ps-guide-link"
                        aria-label={`Learn more about ${guideLabelMap[activeTab]}`}
                        title={`Learn more about ${guideLabelMap[activeTab]}`}
                      >Learn more about <span style={{whiteSpace:"nowrap"}}>{guideLabelMap[activeTab]} →</span></a>
                    )}
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
