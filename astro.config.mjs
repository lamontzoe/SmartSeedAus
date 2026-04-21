// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://smartseedaustralia.com',
  integrations: [
    preact({ compat: true }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        'https://smartseedaustralia.com/',
        'https://smartseedaustralia.com/services/',
        'https://smartseedaustralia.com/about/',
        'https://smartseedaustralia.com/gallery/',
        'https://smartseedaustralia.com/faq/',
        'https://smartseedaustralia.com/contact/',
        'https://smartseedaustralia.com/quote/',
      ],
    }),
  ],
  image: {
    domains: [],
    remotePatterns: [],
  },
});
