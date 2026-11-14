import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteSitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    ViteSitemap({
      hostname: 'https://prototype-f42.pages.dev',
      routes: [
        '/',
        '/pricing',
        '/services/business-websites',
        '/services/landing-pages',
        '/services/frontend-development',
        '/projects/pcp-media',
        '/projects/landmark',
        '/projects/apex-academy',
        '/projects/abc-portal'
      ]
    })
  ],
})