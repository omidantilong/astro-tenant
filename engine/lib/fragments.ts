//export const fragments = {
export const pageData = `
  fragment pageData on Page {
    type: __typename
    sys {
      id
      publishedAt
    }
    title
    url
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
      type: __typename
      ...on Entry {
        sys { 
          id
        }
      }
    }
  }`
