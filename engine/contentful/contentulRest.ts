import type {
  EngineContentReference,
  EngineContentResponse,
  EngineContentTypeConfig,
} from "engine/types/engine"

import { engineDefaults } from "engine/config/defaults"
import { engineConfig } from "tenant.config"

import resolveResponse from "contentful-resolve-response"

const contentTypes: EngineContentTypeConfig = {
  ...engineConfig.contentTypes,
  ...engineDefaults.contentTypes,
}

export async function getContentRest(ref: EngineContentReference) {
  //https://cdn.contentful.com/spaces/{space_id}/environments/{environment_id}/entries/{entry_id}?access_token={access_token}

  const query = [
    "https://cdn.contentful.com/spaces/",
    import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
    "/environments/",
    import.meta.env.PUBLIC_CONTENTFUL_ENV,
    "/entries/",
    "?access_token=",
    import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_API,
    `&sys.id=${ref.id}`,
    "&include=4",
  ].join("")

  const response = await fetchData({ query })
  const resolved = resolveResponse(response)
  const data = resolved[0]

  const sys = {
    contentType: data.sys.contentType.sys.id,
    id: data.sys.id,
    createdAt: data.sys.createdAt,
    updatedAt: data.sys.updatedAt,
    publishedVersion: data.sys.publishedVersion,
    locale: data.sys.locale,
  }

  return { content: data.fields, sys }
}

async function fetchData({ query }: { query: string }) {
  return await fetch(query).then(async (res) => {
    const data = await res.json()
    //console.log(data)
    return data
  })
}
// const contentful = createClient({
//   space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
//   environment: "master",
//   accessToken: import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_API,
// })
// type PageEntrySkeleton = {
//   fields: { productName: EntryFieldTypes.Text }
//   contentTypeId: 'product'
// }
// export async function getContentRest(ref: EngineContentReference) {
//   const { fields, sys }: Entry = await contentful
//     .getEntry(ref.id)
//     .then((entry) => ({ fields: entry.fields, sys: entry.sys }))
//     .catch((error) => console.error(error))
//   //console.log(data.fields)

//   console.log(fields, sys)
//   return { fields, sys }
//   //console.log(data.sys.contentType)
// }

// export async function fetchData({ query, preview = false }: { query: string; preview?: boolean }) {
//   const token = preview
//     ? import.meta.env.PUBLIC_CONTENTFUL_PREVIEW_API
//     : import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_API

//   const spaceId = import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID
//   const spaceEnv = import.meta.env.PUBLIC_CONTENTFUL_ENV

//   return await fetch(
//     `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${spaceEnv}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ query }),
//     }
//   ).then((res) => {
//     //console.log(res)
//     console.log(`Query complexity: ${res.headers.get("X-Contentful-Graphql-Query-Cost")} / 11000`)
//     return res.json()
//   })
// }

// export async function getContent(ref: EngineContentReference): Promise<EngineContentResponse> {
//   const query = contentTypes[ref.type as keyof EngineContentTypeConfig].contentQuery({
//     ref,
//     fragments,
//     parentLookup,
//   })https://cdn.contentful.com/spaces/{space_id}/environments/{environment_id}/entries/{entry_id}?access_token={access_token}
//   const { data, errors } = await fetchData({ query })
//   const { content } = data
//   return { content, errors }
// }
