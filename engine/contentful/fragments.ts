//import { parentLookup } from "engine/contentful/parentLookup"
import { parentLookup } from "engine/contentful/parentLookup"

//export const fragments = {
export const pageData = `
  fragment pageData on Page {
    type: __typename
    sys {
      id
      publishedAt
    }
    title
    slug: url
  }`

export const sys = `
  fragment sysFields on Entry {
    sys {
      id
    }
  }`

export const video = `
  fragment videoFields on Video {
    title
    videoUrl
    transcript
  }`

export const image = `
  fragment imageFields on Image {
    title
    image {
      url
      title
      description
      height
      width
    }
  }`

export const text = `
  fragment textFields on Text {
    title
    text
  }`

export const externalLink = `
  fragment externalLinkFields on ExternalLink {
    url
    linkStyle
    title
  }`

export const internalLink = `
  fragment internalLinkFields on InternalLink {
    type: __typename,
    sys {
      id
    }
    page { 
      ...on Page {
        slug: url
        parent: parentPage {
          ${parentLookup(3)}
        }
      }
    }
  }`
export const editorialCard = `
  fragment editorialCardFields on EditorialCard {
    cardHeading,
    cardLabel,
    cardBody,
    image {
      url,
      title,
      description
      height
      width
    }
    link {
      ...externalLinkFields
      ...internalLinkFields
    }
  }`

// It is possible to retrieve linked page data using the fragment below, for example on an editorialcard
// However it adds complexity to query, and probably doesn't scale super well
// The alternative is to compute this as part of the map function, so retrieve every InternalLink and construct its path ahead of time
// Although that sounds more expensive, it should actually be less complex

/*
        ...on InternalLink {
        page { 
          ...on Page {
            slug: url
            parent: parentPage {
                ${parentLookup(3)}
              }
          }
        }
      }*/
