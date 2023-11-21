import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': import.meta.env,
  },
  preview: {
    host: true,
    port: 3000
  },
   server: {
    port: 3000, 
  },
})
