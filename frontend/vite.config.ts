import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

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
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  }
})