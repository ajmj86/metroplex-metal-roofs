/*
 * Shared install-photo gallery — used by both Homepage.jsx and CityPage.tsx
 * so the two never drift out of sync. These are general Metroplex
 * installation photos, not claimed to be city-specific.
 */
export interface GalleryItem {
  src: string
  label: string
  objectPosition?: string
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { src: '/Installation Pics/Standing-Seam-Steel-True-Black.PNG',                 label: 'Standing Seam Metal - True Black' },
  { src: '/Installation Pics/Standing-Seam-Copper.PNG',                           label: 'Standing Seam Copper', objectPosition: 'center 75%' },
  { src: '/Installation Pics/Stone-Coated-Steel-Pacific-Tile-Timberwood.jpg',     label: 'Stone-Coated Steel - Pacific Tile, Timberwood' },
  { src: '/Installation Pics/Stone-Coated-Steel-Pine-Crest Shake-Timberwood.PNG', label: 'Stone-Coated Steel - Pine-Crest Shake, Timberwood' },
  { src: '/Installation Pics/Standing-Seam-Steel-Natural-Metal.jpg',              label: 'Standing Seam Metal - Natural Metal' },
  { src: '/Installation Pics/Stone-Coated-Steel-Barrel-Vault-Tile-Barclay.PNG',   label: 'Stone-Coated Steel - Barrel-Vault Tile, Barclay' },
]
