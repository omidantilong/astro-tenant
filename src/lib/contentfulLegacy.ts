// https://hashinteractive.com/blog/graphql-recursive-query-with-fragments/
// https://github.com/graphql/graphql-spec/issues/929

export async function getPageLegacy({ slug }: { slug: string }) {
  const query = `
    query { 
      pageCollection(where: {url: "${slug}"}, limit: 1) { 
        items { 
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
              ...on Text {
                title
                text
              }
              ...on Section {
                title
                contentCollection(limit: 20) {
                  items {
                    ...on EditorialCard {
                      cardHeading,
                      cardLabel,
                      cardBody,
                      image {
                        url,
                        title
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

  const data = await fetchData(query)

  //console.log(JSON.stringify(data, null, 2))
  return data
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

export function getFullPathLegacy({ page }: { page: ContentfulLegacyPage }) {
  const path = [page.url]

  if (page.parentPage) {
    path.push(getFullPathLegacy({ page: page.parentPage }))
  }

  return path.reverse().join("/")
}
