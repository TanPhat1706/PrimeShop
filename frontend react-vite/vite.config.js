import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  server: {
    historyApiFallback: true,
    host: true,
    port: 5173,
    allowedHosts: ['all', 'primeshop-vnpay.loca.lt'],
  },
  assetsInclude: ['**/*.json']
})
