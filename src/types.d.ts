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
}

declare interface Text {
  type: "Text"
  title: string
  text: string
}

declare type ContentComponent = Section | EditorialCard | Text
