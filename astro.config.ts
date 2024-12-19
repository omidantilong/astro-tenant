import { defineConfig } from "astro/config"
import node from "@astrojs/node"
import react from "@astrojs/react"
import UnoCSS from "unocss/astro"

import { engine } from "./engine/engine"

export default defineConfig({
  output: "server",
  devToolbar: { enabled: false },
  adapter: node({
    mode: "standalone",
  }),
  integrations: [engine(), UnoCSS(), react()],
  server: {
    port: 8020,
  },
  vite: {
    plugins: [
      // visualizer({
      //   emitFile: true,
      //   filename: "stats.html",
      // }),
    ],
    resolve: {
      alias: {
        "@/": "./src",
      },
    },
  },
})
