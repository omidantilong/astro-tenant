// https://hashinteractive.com/blog/graphql-recursive-query-with-fragments/
// https://github.com/graphql/graphql-spec/issues/929

export async function getPage({ pathname }: { pathname: string }) {
  const slug = getSlugFromPath(pathname)
  const query = `
    fragment parentPage on Page {
      sys {
        id
      }
      title
      slug
    }
    fragment parentLookup on Page {
      parent {
        ...parentPage
        ...on Page {
          parent {
            ...parentPage
            ...on Page {
              parent {
                ...parentPage
                ...on Page {
                  parent {
                    ...parentPage
                  }
                }
              }
            }
          }
        }
      }
    }
    query { 
      pageCollection(where: {slug: "${slug}"}, limit: 1) { 
        items { 
          title,
          ...parentPage
          ...parentLookup
        } 
      } 
    }
  `

  //parentPagequery { blogPostCollection { items { ...blogFields } } } fragment blogFields on BlogPost { title date author { name gitHubUsername } }

  const data = await fetchData(query)

  //console.log(JSON.stringify(data, null, 2))
  return data
}

export function getSlugFromPath(pathname: string) {
  return pathname.split("/").at(-1)
}

export async function fetchData(query: string) {
  return await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${
      import.meta.env.CONTENTFUL_SPACE_ID
    }/environments/${import.meta.env.CONTENTFUL_ENV}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.CONTENTFUL_DELIVERY_API}`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((res) => res.json())
}

export function getPathSegments(page: ContentfulPage) {
  const path = [page.slug]

  if (page.parent) {
    path.push(getPathSegments(page.parent))
  }

  return path.reverse().join("/")
}

export function getFullPath(page: ContentfulPage) {
  return `/${getPathSegments(page)}`
}
