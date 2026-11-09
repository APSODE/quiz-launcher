import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  server: {
    port: 5173,
    proxy: { '/api': { target: process.env.API_TARGET || 'http://localhost:8787', changeOrigin: false } },
  },
  build: { target: 'es2022' },
});
