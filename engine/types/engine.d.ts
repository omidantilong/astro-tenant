export interface EngineContentTypeConfig {
  [key: Capitalize<string>]: {
    root?: string
    contentQuery: ({ ref: EngineContentReference, fragments, parentLookup }) => string
    collectionQuery: ({ fragments, parentLookup }) => string
  }
}

export interface EngineContentQueryFunction {
  fragments: Array<string>
  parentLookup: Function
}

export interface EngineContentReference {
  id: string
  type: string
}

export interface EngineConfig {
  contentTypes: EngineContentTypeConfig
}

export interface EngineDefaultRoutes {
  [key: string]: () => { pattern: string; entrypoint: string }
}

export interface EngineContentResponse {
  content: EngineContentEntry
  errors: any
}
