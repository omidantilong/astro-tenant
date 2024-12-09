import { defineConfig } from "astro/config"
import { resolve } from "path"
import node from "@astrojs/node"
import react from "@astrojs/react"
import type { AstroIntegration } from "astro"

/*
This is a very simple example of an Astro integration injecting custom
routes. This is controlled by a config option, customIndex.

Setting it to false will use the integration slug route. 

Setting it to true will use the local slug route.

NOTE: IRL this engine integration would live inside node_modules. This has no
bearing on its functionality (in fact this is the exact same approach
that Starlight uses).

NOTE: Prior to Astro 5, Astro's routing logic would silently give
priority to injected routes, but would spit out multiple entry points
(files) for each match. That logic has changed and route collisions now
throw a warning (soon to be an error). To get around this, we can define
default routes in a function.

In the case where user wants local routes, customIndex is false and the
function is never called

In the case where user wants default routes, customIndex is true and
their local [...slug].astro shouldn't exist.

It would be cool if we could set build-time route priority info when
setting up `injectRoute`. But this seems to work fine for now, and
correctly outputs just one entry point when creating a build.


*/
const defaultRoute = () => {
  return {
    pattern: "[...slug]",
    entrypoint: "./engine/pages/[...slug].astro",
  }
}
function engine({ ...opts }): AstroIntegration {
  return {
    name: "engine",
    hooks: {
      "astro:config:setup": async ({ injectRoute }) => {
        if (!opts.customIndex) {
          injectRoute(defaultRoute())
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
      customIndex: true,
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
