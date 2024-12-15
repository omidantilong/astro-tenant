declare interface ContentfulPage {
  slug: string
  title: string
  parent: ContentfulPage
}

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
  modulesCollection: { items: Array<any> }
  heroCollection: { items: Array<Hero> }
}
declare interface ContentMap {
  [key: string]: {
    id: string
    type: string
  }
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

declare type ContentModule = Section | EditorialCard | Text | Video | Image
//declare type Entry = Section | EditorialCard | Text | Video | Image | Dummy
