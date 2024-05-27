import { experimental_AstroContainer as AstroContainer } from "astro/container"
import type { AstroComponentFactory } from "astro/runtime/server/index.js"

export const render = async (Component: AstroComponentFactory, props: any) => {
  const container = await AstroContainer.create()
  const result = await container.renderToString(Component, {
    props,
  })

  return result
}
