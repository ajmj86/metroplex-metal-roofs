export type ImageSource = 'streetview' | 'satellite' | 'upload';

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  smsConsent: boolean;
  emailConsent: boolean;
}

export const ROOF_TYPES = [
  {
    id: 'standing-seam',
    label: 'Standing Seam',
    detail: 'clean parallel vertical seam lines running ridge to eave',
  },
  {
    id: 'copper',
    label: 'Copper',
    detail: 'aged copper patina with subtle vertical panel lines',
  },
  {
    id: 'stone-coated-steel',
    label: 'Stone-Coated Steel',
    detail: 'textured stone-chip surface resembling architectural shingles',
  },
  {
    id: 'r-panel',
    label: 'R-Panel',
    detail: 'exposed fastener ribbed metal panels with prominent ribs',
  },
] as const;

export const COLORS = [
  { id: 'charcoal', label: 'Charcoal', hex: '#3A3A3A' },
  { id: 'aged-bronze', label: 'Aged Bronze', hex: '#8C6A38' },
  { id: 'slate-blue', label: 'Slate Blue', hex: '#4A6481' },
  { id: 'forest-green', label: 'Forest Green', hex: '#2D5016' },
  { id: 'barn-red', label: 'Barn Red', hex: '#7A2020' },
  { id: 'galvalume-silver', label: 'Galvalume Silver', hex: '#A8A8A8' },
] as const;
