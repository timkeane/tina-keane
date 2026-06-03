import {defineConfig, splitVendorChunkPlugin} from 'vite';

export default defineConfig({
  base: '',
  server: {
    host: true,
  },
  build: {
    outDir: './dist',
    minify: 'terser'
  },
  plugins: [
    splitVendorChunkPlugin()
  ]
});
