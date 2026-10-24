import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const escape = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Fills the {{site.*}} placeholders in index.html from content.json.
const siteMeta = () => ({
  name: 'site-meta',
  transformIndexHtml: (html) => {
    const { site } = JSON.parse(readFileSync(new URL('./content.json', import.meta.url), 'utf8'));
    return html.replace(/\{\{site\.(\w+)\}\}/g, (_, key) => escape(site[key] ?? ''));
  },
});

export default defineConfig({
  plugins: [react(), siteMeta()],
  build: {
    chunkSizeWarningLimit: 900,
  },
});
