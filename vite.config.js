import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Chạy server tại cổng 3000
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Proxy API đến server backend
        changeOrigin: true,
      },
    },
  },

})
