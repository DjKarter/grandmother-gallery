/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const catalogVersion = createHash('sha256')
  .update(readFileSync(new URL('./public/api/paintings.json', import.meta.url)))
  .digest('hex')
  .slice(0, 16);

export default defineConfig({
  define: {
    'import.meta.env.VITE_CATALOG_VERSION': JSON.stringify(catalogVersion),
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  base: '/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
