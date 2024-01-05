declare interface ContentfulPage {
  slug: string
  title: string
  parent: ContentfulPage
}

declare interface ContentfulLegacyPage {
  url: string
  title: string
  parentPage: ContentfulLegacyPage
}

declare interface Sys {
  sys: {
    id: string
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

declare interface Video extends sys {
  type: "Video"
  title: string
  videoUrl: string
  transcript: string
}

declare interface Image extends sys {
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

declare type Link = InternalLink | ExternalLink

declare type Entry = Section | EditorialCard | Text | Video | Image
