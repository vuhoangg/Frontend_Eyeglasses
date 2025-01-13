import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({

  plugins: [react()],
  server: {
    port: process.env.VITE_PORT || 3000 , // Chạy server tại cổng 3000
    proxy: {
      '/api': { 
        target: process.env.VITE_API_URL , // Proxy API đến server backend
        changeOrigin: true,
      },
    },
  },

})
