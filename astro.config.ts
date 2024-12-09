import { defineConfig } from "astro/config"
import { resolve } from "path"
import node from "@astrojs/node"
import react from "@astrojs/react"
import type { AstroIntegration } from "astro"

/*
This is a very simple example of an Astro integration injecting custom
routes. Astro's route priority always gives higher priority to injected
routes, when we actually want priority to be more like Wordpress
template lookup (eg. if it exists in userland, use that instead)

However we can work around this with some simple config, or we could
build some template lookup logic into the integration if that gets
unmanageable. For now I think it's fine. 

Setting customIndex to false will use the integration slug route. 
Setting customIndex to true will use the local slug route.

IRL this engine integration would live inside node_modules. This has no
bearing on its functionality (in fact this is the exact same approach
that Starlight uses)
*/

function engine({ ...opts }): AstroIntegration {
  return {
    name: "engine",
    hooks: {
      "astro:config:setup": async ({ injectRoute }) => {
        if (!opts.customIndex) {
          injectRoute({
            pattern: "[...slug]",
            entrypoint: "engine/pages/[...slug].astro",
          })
        }
      },
    },
  }
}

const __dirname = resolve()

export default defineConfig({
  output: "server",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    engine({
      customIndex: false,
    }),
    react(),
  ],
  vite: {
    resolve: {
      alias: {
        //"@/": resolve(__dirname, "./src/"),
      },
    },
  },
})
