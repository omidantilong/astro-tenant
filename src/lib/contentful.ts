export async function getPage({ slug }: { slug: string }) {
  const query = `
    fragment parentPage on Page {
      sys {
        id
      }
      title
      slug
    }
    query { 
      pageCollection(where: {slug: "${slug}"}, limit: 1) { 
        items { 
          title,
          parent {
            ...parentPage
          }
        } 
      } 
    }
  `

  //parentPagequery { blogPostCollection { items { ...blogFields } } } fragment blogFields on BlogPost { title date author { name gitHubUsername } }

  const data = await fetch(
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
  return data
}
