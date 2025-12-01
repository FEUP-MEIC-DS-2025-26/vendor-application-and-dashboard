import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'
import manifest from './federation-manifest'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mips_vendor',
      filename: 'remoteEntry.js',
      exposes: {
        './VendorRegister': './src/pages/VendorRegister.tsx',
        './Dashboard': './src/pages/Dashboard.tsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
    {
      name: 'serve-federation-manifest',
      configureServer(server) {
        server.middlewares.use('/federation-manifest.json', (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', 'https://microfrontend-host-1054126107932.europe-west1.run.app');
          res.end(JSON.stringify(manifest));
        });
      }
    }
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  build: {
    // alvo que evita features ESM modernas no output
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      output: {
        // garante um único ficheiro clássico (IIFE/UMD)
        format: 'iife',                // iife funciona bem para scripts injetados como <script>
        name: 'mips_vendor',           // nome global usado pelo bundle IIFE/UMD
        entryFileNames: 'remoteEntry.js',
        inlineDynamicImports: true,    // força tudo num único bundle (evita chunks async)
      },
    },
  },
})