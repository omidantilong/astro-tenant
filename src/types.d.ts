declare interface ContentfulPressReleasePage extends Sys {
  type: "PressRelease"
  slug: string
  title: string
}

declare type EngineContentEntry = ContentfulLegacyPage | ContentfulPressReleasePage
