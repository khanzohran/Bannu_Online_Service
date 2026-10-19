import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(),
      tailwindcss(),
    ],
    define: {
      'import.meta.env.VITE_Backend_base_ULR': JSON.stringify(
        (env.VITE_Backend_base_ULR || '').replace(/\/+$/, '')
      ),
    },
  }
})
