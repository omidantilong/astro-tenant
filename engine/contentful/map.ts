// These functions create maps of content that can be used to quickly
// look up a pathname to get its page (or other content type) id. They
// are just written to the file system as plain json files for now.

// Part of the refMap contains entries for every InternalLink content
// type, meaning links can be resolved quickly without additional api
// calls. But the alternative approach of extending the graphql query
// seems to be performing ok so far

import dotenv from "dotenv"
import { outputFile } from "fs-extra"

import type {
  EngineContentTypeConfig,
  EngineLinkReference,
  EnginePathMap,
  EngineReferenceMap,
} from "engine/types/engine"

import { parentLookup } from "engine/contentful/parentLookup"
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

export async function getInternalLinkCollection() {
  //const condition = `sys: { id_in: [${links.map((link) => `"${link}"`)} ] }`
  //collection: internalLinkCollection(where: { ${condition} } ) {

  const query = `
  ${fragments.pageData}
  query LinkCollectionQuery {
    collection: internalLinkCollection {
      items {
        type: __typename
        ...on InternalLink {
          sys {
            id
          }
          page {
            ...on Page {
              ${parentLookup(3)}
            }
          }
        }
      }
    }
  }
  `

  return await fetchData({ query })
}

export async function createContentMap() {
  const contentTypes: EngineContentTypeConfig = {
    ...engineConfig.contentTypes,
    ...engineDefaults.contentTypes,
  }

  const pathMap: EnginePathMap = {}
  const refMap: EngineReferenceMap = {}

  for (const contentType in contentTypes) {
    const { collectionQuery, root } = contentTypes[contentType as keyof EngineContentTypeConfig]
    const query = collectionQuery({ fragments, parentLookup })
    const { data } = await fetchData({ query })

    data.collection.items.forEach((entry: EngineContentEntry) => {
      const resolvedPath = getFullPath(entry, root)

      pathMap[resolvedPath] = { id: entry.sys.id, type: entry.type }
      refMap[entry.sys.id] = resolvedPath
    })
  }

  const { data } = await getInternalLinkCollection()

  data.collection.items.forEach((entry: EngineLinkReference) => {
    if (entry.page) {
      const resolvedPath = getFullPath(entry.page, "")

      refMap[entry.sys.id] = resolvedPath
    }
  })

  //await fs.writeFile("public/links.json", JSON.stringify(linkMap))
  //console.log(links)
  await outputFile("engine/paths.json", JSON.stringify(pathMap))
  await outputFile("engine/refs.json", JSON.stringify(refMap))
}

createContentMap().then(() => {
  console.log("Wrote map")
})
