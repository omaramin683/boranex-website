import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true,
    port: 3000,
    host: true  // Enable network access for mobile testing
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,  // Enable source maps for debugging
    target: 'esnext', // Optimal for M1 Macs
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})
