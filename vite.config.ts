import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// '/' for the Docker/nginx deployment; GitHub Pages sets BASE_PATH to the
// repo subpath (e.g. /kraftskiva) in .github/workflows/deploy-pages.yml.
const basePath = process.env.BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base: basePath.endsWith('/') ? basePath : `${basePath}/`,
  plugins: [react()],
})
