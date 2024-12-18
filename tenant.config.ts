import { defineEngineConfig } from "./engine/config"

export default defineEngineConfig({
  contentTypes: {
    PressRelease: {
      root: "/media/news-releases",
      contentQuery: ({ ref }) => `
        query PressReleaseQuery {
          content: pressRelease(id: "${ref.id}") {
            sys {
              id
              publishedAt
            }
            title
            slug
            publishDate
            category
            text
          }
        }`,

      collectionQuery: ({ fragments, parentLookup }) => `
        query PressReleaseQuery {
          collection: pressReleaseCollection(limit: 1000) {
            items {
              type: __typename
              sys {
                id
                publishedAt
              }
              title
              slug
            }
          }
        }`,
    },
  },
})
