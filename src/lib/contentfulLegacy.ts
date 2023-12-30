// https://hashinteractive.com/blog/graphql-recursive-query-with-fragments/
// https://github.com/graphql/graphql-spec/issues/929

const parentPageFragment = `
  fragment parent on Page {
    sys {
      id
    }
    title
    url
  }
`

export function parentLookup(depth: number) {
  const parentQuery = []

  if (depth < 2) return ""

  for (let x = 1; x < depth; x++) {
    parentQuery.unshift("parentPage { ... on Page { ...parent ")
    parentQuery.push("} }")
  }

  const query = `
    ...on Page {
      title
      url
      ${parentQuery.join("")}
    }
  `

  return query
}

export async function getPagePath({ id }: { id: string }) {
  const query = `
    query PagePathQuery {
      page(id: "${id}") {
        title
        url
        parentPage {
          ...on Page {
            title,
            url
          }
        }
      }
    }
  `

  return await fetchData({ query })
}

export async function getInternalLink({ id }: { id: string }) {
  const query = `
    ${parentPageFragment} 
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

export async function getInternalLinkCollection({ links }: { links: string[] }) {
  const condition = `sys: { id_in: [${links.map((link) => `"${link}"`)} ] }`

  const query = `
  ${parentPageFragment}
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

export async function getPage({ pathname }: { pathname: string }) {
  const redirect = await getRedirect(pathname)

  if (redirect) return { data: { redirect: true, ...redirect } }

  const slug = getSlugFromPath(pathname)

  const query = `
    query PageQuery {
      pageCollection(where: {url: "${slug}"}, limit: 1) { 
        items { 
          type: __typename
          sys {
            id
          }
          title,
          url,
          parentPage {
            ...on Page {
              title,
              url
            }
          }
          modulesCollection(limit: 10) {
            items {
              type: __typename
              ...on Entry {
                sys {
                  id
                }
              }
              ...on Text {
                title
                text
              }
              ...on Section {
                title
                contentCollection(limit: 20) {
                  items {
                    type: __typename
                    ...on Entry {
                      sys {
                        id
                      }
                    }
                    ...on EditorialCard {
                      cardHeading,
                      cardLabel,
                      cardBody,
                      image {
                        url,
                        title
                      }
                      link {
                        type: __typename
                        ...on Entry {
                          sys { 
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } 
      } 
    }`

  // const data = await fetchData({ query })
  // console.log(JSON.stringify(data, null, 2))
  return await fetchData({ query })
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
    ? import.meta.env.CONTENTFUL_PREVIEW_API
    : import.meta.env.CONTENTFUL_DELIVERY_API

  const spaceId = import.meta.env.CONTENTFUL_SPACE_ID
  const spaceEnv = import.meta.env.CONTENTFUL_ENV

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

export function getSlugFromPath(pathname: string) {
  return pathname.split("/").at(-1)
}

export function getPathSegments(page: ContentfulLegacyPage) {
  const path = [page.url]

  if (page.parentPage) {
    path.push(getPathSegments(page.parentPage))
  }

  return path.reverse().join("/")
}

export function getFullPath(page: ContentfulLegacyPage) {
  return `/${getPathSegments(page)}`
}
