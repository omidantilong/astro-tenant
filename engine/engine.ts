import type { AstroIntegration } from "astro"
import fs from "fs-extra"

interface DefaultRoutes {
  [key: string]: Function
}

const defaultRoutes: DefaultRoutes = {
  "./src/pages/[...slug].astro": () => ({
    pattern: "[...slug]",
    entrypoint: "./engine/pages/[...slug].astro",
  }),
  "./src/pages/404.astro": () => ({
    pattern: "404",
    entrypoint: "./engine/pages/404.astro",
  }),
}

export function engine({ ...opts }): AstroIntegration {
  return {
    name: "engine",
    hooks: {
      "astro:config:setup": async ({ injectRoute, addMiddleware }) => {
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

        addMiddleware({
          entrypoint: "./engine/middleware/request.ts",
          order: "pre",
        })
      },
    },
  }
}
