// Starting to scratch out an idea for how to build an internal sitemap
// that can be used to resolve links and/or look up pages. First,
// collect a list of all pages and index by slug.

// Then our getPage function can lookup the full pathname from this map,
// and retrieve the ID of the page it needs to fetch. This removes the
// need to manually check the full path after the page has been
// retrieved from the CMS, by doing the check ahead of time.

// This could be extended to links too, if we had a page map indexed by ID.

import dotenv from "dotenv"
import fs from "fs-extra"

import { getFullPath, parentLookup } from "@/lib/contentfulLegacy"
import { pageData } from "@/lib/fragments"

dotenv.config({ path: `.env.development` })

export async function fetchData({ query, preview = false }: { query: string; preview?: boolean }) {
  const token = preview ? process.env.CONTENTFUL_PREVIEW_API : process.env.CONTENTFUL_DELIVERY_API
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const spaceEnv = process.env.CONTENTFUL_ENV

  return await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${spaceEnv}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((res) => {
    console.log(`Query complexity: ${res.headers.get("X-Contentful-Graphql-Query-Cost")} / 11000`)
    return res.json()
  })
}

export async function createPageMap() {
  const query = `
  ${pageData}
  query PageQuery {
    pageCollection(limit: 1000) { 
      items { 
        ...pageData
        parentPage {
          ${parentLookup(3)}
        }
      }
    }
  }`

  const data = await fetchData({ query })
  const pages = data.data.pageCollection.items

  const pageMap: { [key: string]: ContentfulLegacyPage } = {}

  pages.forEach((page: ContentfulLegacyPage) => {
    const url = getFullPath(page)

    pageMap[url] = page
  })

  await fs.writeFile("map.json", JSON.stringify(pageMap))
}

createPageMap().then(() => {
  console.log("Wrote map")
})
