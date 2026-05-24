import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      customElement: [/\.ce\.vue$/]
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/sdk-entry.ts'),
      name: 'SmartCardSDK',
      cssFileName: 'smart-card-sdk',
      fileName: (format) => `smart-card-sdk.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
