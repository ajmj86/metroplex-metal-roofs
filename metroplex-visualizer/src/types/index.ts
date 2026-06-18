export type ImageSource = 'streetview' | 'satellite' | 'upload';

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  smsConsent: boolean;
  emailConsent: boolean;
}
