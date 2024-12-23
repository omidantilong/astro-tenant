/* 
All this needs cleaning up
Currently types are stored local in tenant
But graphql fragments are in fragments.ts in engine

In all likelihood, tenant are going to have to redefine graphql fragments and types
And may not be able to use defaults if their models are too different

Eventually we want to force people use standard models, but until then...?

Suggestions:

- Define fragments in tenant.config.ts
- Ship default set of fragments like we do currently
- Combine both sets of fragments like we do with contentTypes
- Store a default fragment inside each component (in dummy-components etc)?
*/

declare interface Sys {
  sys: {
    id: string
    publishedAt: string
  }
}

declare interface ContentfulLegacyPage extends Sys {
  type: "Page"
  slug: string
  title: string
  metaTitle: string
  parent: ContentfulLegacyPage
  modulesCollection: { items: Array<ContentModule> }
  heroCollection: { items: Array<Hero> }
}

declare interface Hero extends Sys {
  type: "Hero"
  title: string
  heroHeading: string
  heroBody: string
  image: ImageProps
  imageCaption: string
  link: Link
}

declare interface Section extends Sys {
  type: "Section"
  title: string
  contentCollection: {
    items: Entry[]
  }
}

declare interface EditorialCard extends Sys {
  type: "EditorialCard"
  cardHeading: string
  cardLabel: string
  cardBody: string
  link: Link
  image: ImageProps
}

declare interface Text extends Sys {
  type: "Text"
  title: string
  text: string
}

declare interface InternalLink extends Sys {
  type: "InternalLink"
  page: ContentfulLegacyPage
  title: string
  linkStyle: string
}

declare interface ExternalLink extends Sys {
  type: "ExternalLink"
  url: string
  title: string
  linkStyle: string
}

declare interface Video extends Sys {
  type: "Video"
  title: string
  videoUrl: string
  transcript: string
}

declare interface Image extends Sys {
  type: "Image"
  title: string
  image: ImageProps
}

declare type ImageProps = {
  url: string
  title: string
  description: string
  height: number
  width: number
}

// declare interface Dummy extends sys {
//   type: "Dummy"
//   title: string
// }

declare type Link = InternalLink | ExternalLink

declare type TenantModule = Section | EditorialCard | Text | Video | Image

declare interface ContentfulPressReleasePage extends Sys {
  type: "PressRelease"
  slug: string
  title: string
}

declare type EngineContentEntry = ContentfulLegacyPage | ContentfulPressReleasePage

//declare type Entry = Section | EditorialCard | Text | Video | Image | Dummy
