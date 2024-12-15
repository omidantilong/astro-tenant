/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals extends Record<string, any> {
    engine: {
      page: ContentfulLegacyPage
      heroes: Hero[]
      entries: Entry[]
      links: {
        [key: string]: InternalLink
      }
    }
  }
}
