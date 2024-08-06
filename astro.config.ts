import { defineConfig } from "astro/config"
import { resolve } from "path"
import node from "@astrojs/node"
import react from "@astrojs/react"

const __dirname = resolve()

// https://astro.build/config
export default defineConfig({
  output: "server",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  adapter: node({
    mode: "standalone",
  }),
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        //"@/": resolve(__dirname, "./src/"),
      },
    },
  },
})
