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

declare interface Section extends Sys {
  type: "Section"
  title: string
  contentCollection: {
    items: ContentComponent[]
  }
}

declare interface EditorialCard extends Sys {
  type: "EditorialCard"
  cardHeading: string
  cardLabel: string
  cardBody: string
  link: Link
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

declare type Link = InternalLink | ExternalLink

declare type ContentComponent = Section | EditorialCard | Text
