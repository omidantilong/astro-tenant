export interface EngineContentTypeConfig {
  [key: Capitalize<string>]: {
    root?: string
    entryQuery: ({ ref: EngineEntryReference, fragments, parentLookup }) => string
    collectionQuery: ({ fragments, parentLookup }) => string
  }
}

export interface EngineEntryQueryCallback {
  ref: EngineEntryReference
  fragements: any
  parentLookup: any
}

export interface EngineEntryReference {
  id: string
  type: string
}

export interface EngineConfig {
  contentTypes: EngineContentTypeConfig
}

export interface EngineDefaultRoutes {
  [key: string]: () => { pattern: string; entrypoint: string }
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

export interface EngineLinkReference {
  sys: {
    id: string
  }
  page: ContentfulLegacyPage
}
