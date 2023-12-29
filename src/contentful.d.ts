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

declare interface Section {
  type: "Section"
  title: string
  contentCollection: {
    items: ContentComponent[]
  }
}

declare interface EditorialCard {
  type: "EditorialCard"
  cardHeading: string
  cardLabel: string
  cardBody: string
  link: Link
}

declare interface Text {
  type: "Text"
  title: string
  text: string
}

declare interface InternalLink {
  sys: {
    id: string
  }
  type: "InternalLink"
  page: ContentfulLegacyPage
  title: string
  linkStyle: string
}

declare interface ExternalLink {
  type: "ExternalLink"
  url: string
  title: string
  linkStyle: string
}

declare type Link = InternalLink | ExternalLink

declare type ContentComponent = Section | EditorialCard | Text
