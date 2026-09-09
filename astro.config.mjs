// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    includeFiles: ['./public/images/logo-margagnano-white.png'],
  }),
  integrations: [react()],
  redirects: {
    '/rooms': '/suites',
    '/rooms/[slug]': '/suites/[slug]',
    '/la-masseria': '/masseria',
    '/la-cucina': '/cuisine',
  },

  alias: {
    '@': `${__dirname}/src`
  },

  vite: {
    plugins: [tailwindcss()]
  }
});