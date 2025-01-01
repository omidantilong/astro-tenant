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

declare module "engine:types/cms" {
  interface PressReleasePage extends Sys {
    type: "PressRelease"
    slug: string
    title: string
    foo: string
  }
  interface LegacyPage extends Sys {
    type: "Page"
    slug: string
    title: string
    metaTitle: string
    parent: LegacyPage
    modulesCollection: { items: Array<TenantContentModule> }
    heroCollection: { items: Array<Hero> }
  }
  interface Hero extends Sys {
    type: "Hero"
    title: string
    heroHeading: string
    heroBody: string
    image: ImageProps
    imageCaption: string
    link: Link
  }

  interface Section extends Sys {
    type: "Section"
    title: string
    contentCollection: {
      items: Array<TenantContentModule>
    }
  }

  interface EditorialCard extends Sys {
    type: "EditorialCard"
    cardHeading: string
    cardLabel: string
    cardBody: string
    link: Link
    image: ImageProps
  }

  interface Text extends Sys {
    type: "Text"
    title: string
    text: string
  }

  interface InternalLink extends Sys {
    type: "InternalLink"
    page: LegacyPage
    title: string
    linkStyle: string
  }

  interface ExternalLink extends Sys {
    type: "ExternalLink"
    url: string
    title: string
    linkStyle: string
  }
  interface Video extends Sys {
    type: "Video"
    title: string
    videoUrl: string
    transcript: string
  }

  interface Image extends Sys {
    type: "Image"
    title: string
    image: ImageProps
  }

  interface ImageProps {
    url: string
    title: string
    description: string
    height: number
    width: number
  }

  type Link = InternalLink | ExternalLink

  //interface TenantPage extends DefaultPage {}

  type TenantPage = LegacyPage | PressReleasePage

  // type Page = DefaultPage | LegacyPage | PressReleasePage
  type TenantContentModule = Section | EditorialCard | Text | Video | Image
}
