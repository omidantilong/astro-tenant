// https://hashinteractive.com/blog/graphql-recursive-query-with-fragments/
// https://github.com/graphql/graphql-spec/issues/929

import type {
  EngineContentReference,
  EngineContentResponse,
  EngineContentTypeConfig,
} from "engine/types/engine"
import * as fragments from "engine/contentful/fragments"
import { engineDefaults } from "engine/config/defaults"
import { parentLookup } from "engine/contentful/parentLookup"
import { resolveLinks } from "engine/contentful/resolveLinks"

import { engineConfig } from "tenant.config"

const contentTypes: EngineContentTypeConfig = {
  ...engineConfig.contentTypes,
  ...engineDefaults.contentTypes,
}

export { resolveLinks, parentLookup }

export { parse } from "./markdown"

export async function getInternalLink(id: string) {
  const query = `
    ${fragments.pageData} 
    query LinkQuery {
      internalLink(id: "${id}") {
        type: __typename
        ...on InternalLink {
          page {
            ${parentLookup(3)}
          }
        }
      }
    }
  `

  return await fetchData({ query })
}

export async function getInternalLinkCollection(links: string[]) {
  const condition = `sys: { id_in: [${links.map((link) => `"${link}"`)} ] }`

  const query = `
  ${fragments.pageData}
  query LinkCollectionQuery {
    collection: internalLinkCollection(where: { ${condition} } ) {
      items {
        type: __typename
        ...on InternalLink {
          sys {
            id
          }
          page {
            ${parentLookup(2)}
          }
        }
      }
    }
  }
  `

  return await fetchData({ query })
}

export async function getContent(ref: EngineContentReference): Promise<EngineContentResponse> {
  const query = contentTypes[ref.type as keyof EngineContentTypeConfig].contentQuery({
    ref,
    fragments,
    parentLookup,
  })
  const { data, errors } = await fetchData({ query })
  const { content } = data
  return { content, errors }
}

export async function getAsset(id: string) {
  const query = `
    query AssetQuery { 
      asset(id:"${id}") {
        title
        contentType
        width
        height
        sys {
          id
        }
      }
    }`
  return await fetchData({ query })
}

export async function getRedirect(pathname: string) {
  const query = `
    query RedirectQuery {
      collection: redirectCollection(limit: 3000) {
        items {
          from,
          to
        }
      }
    }
  `

  const { data } = await fetchData({ query })

  for (let redirect of data.collection.items) {
    const exp = `^${redirect.from}`
    if (pathname.match(exp)) {
      console.log("Redirect match")
      return redirect
    }
  }
}

export async function fetchData({ query, preview = false }: { query: string; preview?: boolean }) {
  const token = preview
    ? import.meta.env.PUBLIC_CONTENTFUL_PREVIEW_API
    : import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_API

  const spaceId = import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID
  const spaceEnv = import.meta.env.PUBLIC_CONTENTFUL_ENV

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
    //console.log(res)
    console.log(`Query complexity: ${res.headers.get("X-Contentful-Graphql-Query-Cost")} / 11000`)
    return res.json()
  })
}

export async function getEntryRef(pathname: string) {
  const pages = (await import("../../map.json")).default as any
  return pages[pathname] ? pages[pathname] : false
}
