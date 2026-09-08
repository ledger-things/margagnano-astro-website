// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  redirects: {
    '/rooms': '/suites',
    '/rooms/[slug]': '/suites/[slug]',
  },

  alias: {
    '@': `${__dirname}/src`
  },

  vite: {
    plugins: [tailwindcss()]
  }
});