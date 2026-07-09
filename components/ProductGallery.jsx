'use client'

import { useEffect, useRef } from "react";

/* Small circular thumbnail strip below the main image — opt-in via showThumbnails. */
function ThumbnailStrip({ items, index, onNavigate }) {
  const activeRef = useRef(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index]);
  return (
    <div style={{ width: "100%", flexShrink: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", maxWidth: "100%", padding: "6px 4px 4px" }}>
        {items.map((it, i) => {
          const active = i === index;
          return (
            <button
              key={it.src || it.name || i}
              ref={active ? activeRef : null}
              onClick={e => { e.stopPropagation(); onNavigate(i); }}
              aria-label={it.label ?? it.name ?? `Color ${i + 1}`}
              aria-current={active}
              style={{
                flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
                overflow: "hidden", padding: 0, cursor: "pointer",
                border: active ? "2px solid #B8935A" : "1px solid #27272A",
                boxShadow: active ? "0 0 0 2px #B8935A55" : "none",
                opacity: active ? 1 : 0.75,
                transition: "opacity 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              {it.src && (
                <img src={it.src} alt="" loading="lazy" decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/*
 * Shared fullscreen lightbox — originally the inline gallery lightbox in
 * Homepage.jsx. `items`/`index` are controlled by the caller so the same
 * component can back both the photo gallery and the product swatch modals.
 *
 * Props:
 *  - items:     array of { src, label|name, objectPosition? }
 *  - index:     current item index, or null/undefined to render nothing
 *  - onNavigate(newIndex): called by the prev/next arrows and arrow keys
 *  - onClose():  called by Escape, the × button, or a click outside the frame
 *  - header?:   optional node rendered above the image/caption
 *  - footer?:   optional node rendered below the image/caption
 *  - renderItem?(item, index): optional override for the image/caption body
 *               (used by the copper modal, which shows a gradient instead
 *               of a photo)
 *  - hideCaption?: suppress the default name caption under the image, for
 *               callers whose footer already displays the item name
 *  - showThumbnails?: render a row of small clickable thumbnails (one per
 *               item) below the main image. Ignored when renderItem is
 *               set — a custom body has no "one photo at a time" concept
 *               for thumbnails to jump between. Opt-in so the Gallery
 *               lightbox (which doesn't pass it) is unaffected.
 */
export default function ProductGallery({ items, index, onNavigate, onClose, header, footer, renderItem, hideCaption, showThumbnails }) {
  const open = index !== null && index !== undefined && !!items?.length;

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      if (e.key === "ArrowRight" && index < items.length - 1) onNavigate(index + 1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, index, items, onNavigate, onClose]);

  if (!open) return null;

  const item = items[index];
  const label = item.label ?? item.name;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(9,9,10,0.95)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 20px", cursor: "zoom-out",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 24, right: 24,
          background: "none", border: "none", color: "#F4F1EB",
          fontSize: 28, cursor: "pointer", lineHeight: 1,
          padding: 8,
        }}
        aria-label="Close"
      >×</button>

      {index > 0 && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate(index - 1); }}
          style={{
            position: "absolute", left: "calc(50% - min(37.5vw, 380px) - 22px)", top: "calc(50% - 20px)",
            background: "#18181B", border: "none", color: "#B8935A", borderRadius: "50%",
            width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, cursor: "pointer", opacity: 1,
            boxShadow: "0 2px 12px rgba(0,0,0,0.4)", transition: "background 0.2s", zIndex: 2,
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#D4AE7A"}
          onMouseLeave={e => e.currentTarget.style.color = "#B8935A"}
          aria-label="Previous"
        >‹</button>
      )}

      {index < items.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate(index + 1); }}
          style={{
            position: "absolute", right: "calc(50% - min(37.5vw, 380px) - 22px)", top: "calc(50% - 20px)",
            background: "#18181B", border: "none", color: "#B8935A", borderRadius: "50%",
            width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, cursor: "pointer", opacity: 1,
            boxShadow: "0 2px 12px rgba(0,0,0,0.4)", transition: "background 0.2s", zIndex: 2,
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#D4AE7A"}
          onMouseLeave={e => e.currentTarget.style.color = "#B8935A"}
          aria-label="Next"
        >›</button>
      )}

      <div onClick={onClose} style={{ width: "min(75vw, 760px)", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: (header || footer || showThumbnails) ? 16 : 0 }}>
        {header && <div onClick={e => e.stopPropagation()} style={{ width: "100%", flexShrink: 0 }}>{header}</div>}

        <div style={{ width: "100%", flexShrink: 0, ...(renderItem ? {} : { height: "min(70vh, 580px)" }) }}>
          {renderItem ? renderItem(item, index) : (
            <>
              <div style={{ width: "100%", height: hideCaption ? "100%" : "calc(100% - 40px)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                <img
                  src={item.src}
                  alt={label}
                  draggable={false}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    objectPosition: item.objectPosition || "center center",
                    display: "block",
                    WebkitUserSelect: "none", userSelect: "none",
                    WebkitTouchCallout: "none",
                    pointerEvents: "none"
                  }}
                />
              </div>
              {!hideCaption && (
                <div style={{ color: "#A1A1AA", fontSize: 13, height: 40, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 1 }}>
                  {label}
                </div>
              )}
            </>
          )}
        </div>

        {showThumbnails && !renderItem && items.length > 1 && (
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", flexShrink: 0 }}>
            <ThumbnailStrip items={items} index={index} onNavigate={onNavigate} />
          </div>
        )}

        {footer && <div onClick={e => e.stopPropagation()} style={{ width: "100%", flexShrink: 0 }}>{footer}</div>}
      </div>
    </div>
  );
}
