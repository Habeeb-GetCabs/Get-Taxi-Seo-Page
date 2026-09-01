import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

// Get all HTML files in root directory for multi-page build
function getHtmlEntries() {
  const root = process.cwd();
  const entries: Record<string, string> = {};
  
  const files = fs.readdirSync(root);
  for (const file of files) {
    if (file.endsWith('.html')) {
      const name = file.replace(/\.html$/, '');
      entries[name] = path.resolve(root, file);
    }
  }
  return entries;
}

export default defineConfig(() => {
  return {
    base: './',
    build: {
      rollupOptions: {
        input: getHtmlEntries(),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
