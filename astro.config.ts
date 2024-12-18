import { defineConfig } from "astro/config"
import node from "@astrojs/node"
import react from "@astrojs/react"
import UnoCSS from "unocss/astro"

import { engine } from "./engine/engine"
import type { SSROptions } from "vite"

//import { visualizer } from "rollup-plugin-visualizer"
//import { engineConfig } from "./tenant.config.ts"

const ssr: SSROptions =
  process.env.NODE_ENV === "production"
    ? {
        noExternal: true,
        external: ["node:fs", "fs", "node:path", "react", "react-dom"],
      }
    : {}

export default defineConfig({
  output: "server",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  adapter: node({
    mode: "standalone",
  }),
  integrations: [engine({}), UnoCSS(), react()],
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
    ssr,
    resolve: {
      alias: {
        "@/": "./src",
      },
    },
  },
})
