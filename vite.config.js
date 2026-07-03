import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use /portfolio only when deploying to GitHub Pages (set VITE_BASE_PATH=/portfolio/)
  // Leave unset for local dev so all routes work at /
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    // Redirect all 404s back to index.html so React Router handles the URL
    historyApiFallback: true,
  },
})
