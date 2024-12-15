import { defineMiddleware } from "astro:middleware"

import { sanitizePath } from "engine/util/common"
//import { pageNotFound } from "engine/util/responses"

import { getPage, getFullPath, resolveLinks } from "engine/lib/contentfulLegacy"

import type { MiddlewareHandler } from "astro"

// https://github.com/getsentry/sentry-javascript/blob/develop/packages/astro/src/server/middleware.ts
function checkIsDynamicPageRequest(context: Parameters<MiddlewareHandler>[0]): boolean {
  try {
    return context.clientAddress != null
  } catch {
    return false
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const isDynamic = checkIsDynamicPageRequest(context)

  if (isDynamic) {
    const pathname = sanitizePath(context.url.pathname)
    const { data } = await getPage(pathname)

    // Would be nice to just return an actual Response here. This does
    // work but seems to bypass Astro's custom 404 page unlike next()
    // context.rewrite doesn't seem to work either

    //if (data.error) return new Response(new Blob(), { status: 404 })
    if (data.error) return next("/404")

    // Redirect if data.redirect is true
    if (data.redirect) return context.redirect(data.to)

    // Return 404 if there is no page with that slug
    if (!data?.pageCollection?.items) return next("/404")

    const page = data.pageCollection.items[0]

    const heroes: Hero[] = page.heroCollection.items || []
    const entries: Entry[] = page.modulesCollection.items || []
    const links = await resolveLinks(entries)

    context.locals.engine = { page, heroes, entries, links }
  }

  // if (context.url.pathname === "/some-test-path") {
  //   return Response.json({
  //     ok: true,
  //   })
  // }

  return next()
})
