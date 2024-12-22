import type { EngineConfig } from "engine/types"

export const engineConfig: EngineConfig = {
  contentTypes: {
    PressRelease: {
      root: "/media/news-releases",
      entryQuery: ({ ref }) => `
        query PressReleaseQuery {
          entry: pressRelease(id: "${ref.id}") {
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
}
