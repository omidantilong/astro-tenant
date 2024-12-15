import type { EngineConfig } from "engine/types/engine"

export const engineDefaults: EngineConfig = {
  contentTypes: {
    Page: {
      contentQuery: () => ``,
      collectionQuery: ({ fragments, parentLookup }) => `
        ${fragments.pageData}
        query PageQuery {
          collection: pageCollection(limit: 1000) { 
            items { 
              ...pageData
              parent: parentPage {
                ${parentLookup(3)}
              }
            }
          }
        }`,
    },
  },
}
