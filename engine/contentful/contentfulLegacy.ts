// https://hashinteractive.com/blog/graphql-recursive-query-with-fragments/
// https://github.com/graphql/graphql-spec/issues/929

import type {
  EngineContentReference,
  EngineContentResponse,
  EngineContentTypeConfig,
} from "engine/types/engine"
import * as fragments from "./fragments"
import { engineConfig } from "tenant.config"
import { engineDefaults } from "engine/config/defaults.ts"

const contentTypes: EngineContentTypeConfig = {
  ...engineConfig.contentTypes,
  ...engineDefaults.contentTypes,
}

export function parentLookup(depth: number) {
  const parentQuery = []

  if (depth < 2) return ""

  for (let x = 1; x < depth; x++) {
    parentQuery.unshift("parent: parentPage { ... on Page { ...pageData ")
    parentQuery.push("} }")
  }

  const query = `
    ...on Page {
      ...pageData
      ${parentQuery.join("")}
    }
  `

  return query
}

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
    internalLinkCollection(where: { ${condition} } ) {
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
      redirectCollection(limit: 3000) {
        items {
          from,
          to
        }
      }
    }
  `

  const { data } = await fetchData({ query })

  for (let redirect of data.redirectCollection.items) {
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

export async function resolveLinks(entries: Array<ContentModule>) {
  // This function can be used to collect all InternalLink entries that
  // are direct children of a Section, reducing the number of HTTP requests
  // that are made behind the scenes. It could be further extended to
  // recursively search the tree, but not sure if this is needed with our
  // current models - needs further investigation.

  // It works by extracting all the sys.id values from each InternalLink
  // and mapping them to the parent entry's sys.id value. It then passes
  // the list of link ids into the getInternalLinkCollection function
  // which queries Contentful using the `id_in` query filter.

  // The returned list of links is then remapped to the entry ids and the
  // new link is injected into the corresponding entry, overwriting the
  // existing link property.

  const links: { [key: string]: InternalLink } = {}
  if (entries.length) {
    const linkMap: { [key: string]: string } = {}
    entries.forEach((entry) => {
      if (entry && "link" in entry && entry?.link?.type === "InternalLink") {
        linkMap[entry.link.sys.id] = entry.sys.id
      }

      // Lines below can collect links from content nested inside sections
      // See other comments in [...slug] and Section.astro for usage

      // if ("contentCollection" in entry) {
      //   entry.contentCollection.items.forEach((entry) => {
      //     if (entry && "link" in entry && entry?.link?.type === "InternalLink") {
      //       linkMap[entry.link.sys.id] = entry.sys.id
      //     }
      //   })
      // }
    })
    const linkIds = Object.keys(linkMap)
    //console.log(linkIds)

    if (linkIds.length) {
      const { data } = await getInternalLinkCollection(linkIds)

      data.internalLinkCollection.items.forEach((link: InternalLink) => {
        links[linkMap[link.sys.id]] = link
      })
    }
  }

  return links
}

export async function getEntryRef(pathname: string) {
  const pages = (await import("../../map.json")).default as any
  return pages[pathname] ? pages[pathname] : false
}
