import type { AstroIntegration, ViteUserConfig } from "astro"
import type { EngineDefaultRoutes } from "engine/types/engine"
import fs from "fs-extra"

/*
This is a very simple example of an Astro integration injecting custom
routes. This is controlled by a config option, customIndex.

Setting it to false will use the integration slug route. 

Setting it to true will use the local slug route.

NOTE: IRL this engine integration would live inside node_modules. This
has no bearing on its functionality (in fact this is the exact same
approach that Starlight uses).

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

const defaultRoutes: EngineDefaultRoutes = {
  "./src/pages/[...slug].astro": () => ({
    pattern: "[...slug]",
    entrypoint: "./engine/pages/[...slug].astro",
  }),
  "./src/pages/404.astro": () => ({
    pattern: "404",
    entrypoint: "./engine/pages/404.astro",
  }),
}

//export function engine({ ...opts }: { output: "server" | "static" }): AstroIntegration {
export function engine(): AstroIntegration {
  //const astroConfig: AstroUserConfig = {}
  const viteConfig: ViteUserConfig = {}

  if (process.env.NODE_ENV === "production") {
    viteConfig.ssr = {
      noExternal: true,
      external: ["node:fs", "fs", "node:path", "react", "react-dom", "scheduler"],
    }
  }

  return {
    name: "engine",
    hooks: {
      "astro:route:setup": async ({ route }) => {
        if (route.component.endsWith(".md") || route.component.endsWith(".html")) {
          route.prerender = true
        }
      },
      "astro:config:setup": async ({ injectRoute, updateConfig, addMiddleware }) => {
        // if (!opts.customIndex) {
        //   injectRoute(defaultRoute())
        // }
        // Another way of doing this, without using the customIndex option
        // Manually test for existence of local template
        // Could be turned into an array of default template paths to check
        // if (!fs.existsSync("./src/pages/[...slug].astro")) injectRoute(defaultRoute())

        // And another way, using a defaultRoutes object
        for (const route in defaultRoutes) {
          if (!fs.existsSync(route)) injectRoute(defaultRoutes[route]())
        }

        updateConfig({
          trailingSlash: "ignore",
          vite: {
            ssr: viteConfig.ssr || {},
          },
        })

        addMiddleware({
          entrypoint: "./engine/middleware/middleware.ts",
          order: "pre",
        })
      },
    },
  }
}
