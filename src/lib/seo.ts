export interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

export const SITE_NAME = 'Smart Seed Australia';
export const SITE_URL = 'https://smartseedaustralia.com';
export const SITE_PHONE = '0491021536'; 
export const SITE_PHONE_RAW = '0491021536'; 
export const SITE_EMAIL = 'admin@smartseedaustralia.com'; 
export const SITE_ABN = ''; // placeholder
export const TAGLINE = 'Australia\'s Hydroseeding Specialists';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export const SERVICE_AREAS = [
  'New South Wales', 'NSW',
  'Australian Capital Territory', 'ACT',
  'Victoria', 'VIC',
  'Queensland', 'QLD',
  'South Australia', 'SA',
  'Western Australia', 'WA',
  'Northern Territory', 'NT',
  'Tasmania', 'TAS',
];

export const PRIMARY_AREAS = ['NSW', 'ACT', 'VIC'];

export function buildTitle(pageTitle: string): string {
  if (pageTitle === SITE_NAME) return `${SITE_NAME} | ${TAGLINE}`;
  return `${pageTitle} | ${SITE_NAME}`;
}

export function buildCanonical(path: string): string {
  return `${SITE_URL}${path}`;
}
