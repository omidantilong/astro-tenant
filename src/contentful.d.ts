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

declare interface Entry {
  sys: {
    id: string
  }
}

declare interface Section extends Entry {
  type: "Section"
  title: string
  contentCollection: {
    items: ContentComponent[]
  }
}

declare interface EditorialCard extends Entry {
  type: "EditorialCard"
  cardHeading: string
  cardLabel: string
  cardBody: string
  link: Link
}

declare interface Text extends Entry {
  type: "Text"
  title: string
  text: string
}

declare interface InternalLink extends Entry {
  type: "InternalLink"
  page: ContentfulLegacyPage
  title: string
  linkStyle: string
}

declare interface ExternalLink extends Entry {
  type: "ExternalLink"
  url: string
  title: string
  linkStyle: string
}

declare type Link = InternalLink | ExternalLink

declare type ContentComponent = Section | EditorialCard | Text
