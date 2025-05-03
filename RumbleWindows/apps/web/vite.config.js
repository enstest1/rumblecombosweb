import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true, // Listen on all addresses, including network
    // NO PROXY SECTION - Direct calls with CORS
  },
  resolve: {
    // Aliases are not needed for this simple structure
  },
});