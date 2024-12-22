export interface EngineConfig {
  contentTypes: EngineContentTypeConfig
}

export interface EngineContentTypeConfig {
  [key: Capitalize<string>]: {
    root?: string
    entryQuery: ({ ref, fragments, parentLookup }: EngineEntryQueryCallback) => string
    collectionQuery: ({ fragments, parentLookup }: EngineCollectionQueryCallback) => string
  }
}

export interface EngineDefaultRoutes {
  [key: string]: () => { pattern: string; entrypoint: string }
}

export interface EngineFragmentCollection {
  [key: string]: string
}

export interface EngineEntryQueryCallback {
  ref: EngineEntryReference
  fragments: EngineFragmentCollection
  parentLookup: Function
}

export interface EngineCollectionQueryCallback {
  fragments: EngineFragmentCollection
  parentLookup: Function
}

export interface EngineEntryReference {
  id: string
  type: string
}

export interface EngineEntryResponse {
  entry: EngineEntry
  errors: any
}

export interface EnginePathMap {
  [key: string]: {
    id: string
    type: string
  }
}

export interface EngineReferenceMap {
  [key: string]: string
}

// export interface EngineLinkReference {
//   sys: {
//     id: string
//   }
//   page: ContentfulLegacyPage
// }
