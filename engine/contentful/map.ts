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

import type { EngineContentTypeConfig } from "engine/types/engine"

import { parentLookup } from "engine/contentful"
import * as fragments from "engine/contentful/fragments"

import { engineDefaults } from "engine/config/defaults"
import { getFullPath } from "engine/util/path"
import { engineConfig } from "tenant.config"

dotenv.config({ path: `.env.development` })

export async function fetchData({ query, preview = false }: { query: string; preview?: boolean }) {
  const token = preview
    ? process.env.PUBLIC_CONTENTFUL_PREVIEW_API
    : process.env.PUBLIC_CONTENTFUL_DELIVERY_API
  const spaceId = process.env.PUBLIC_CONTENTFUL_SPACE_ID
  const spaceEnv = process.env.PUBLIC_CONTENTFUL_ENV

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

export async function createContentMap() {
  const contentTypes: EngineContentTypeConfig = {
    ...engineConfig.contentTypes,
    ...engineDefaults.contentTypes,
  }

  const contentMap: ContentMap = {}

  for (const contentType in contentTypes) {
    const { collectionQuery, root } = contentTypes[contentType as keyof EngineContentTypeConfig]
    const query = collectionQuery({ fragments, parentLookup })
    const { data } = await fetchData({ query })

    data.collection.items.forEach((entry: EngineContentEntry) => {
      const resolvedPath = getFullPath(entry, root)

      contentMap[resolvedPath] = { id: entry.sys.id, type: entry.type }
    })
  }

  await fs.writeFile("map.json", JSON.stringify(contentMap))
}

createContentMap().then(() => {
  console.log("Wrote map")
})
