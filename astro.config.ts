import { defineConfig } from "astro/config"
import node from "@astrojs/node"
import react from "@astrojs/react"
import UnoCSS from "unocss/astro"

import { engine } from "./engine/engine"
//import { engineConfig } from "./tenant.config.ts"

export default defineConfig({
  output: "server",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  adapter: node({
    mode: "standalone",
  }),
  integrations: [engine({}), UnoCSS(), react()],
  vite: {
    resolve: {
      alias: {
        "@/": "./src",
      },
    },
  },
})
