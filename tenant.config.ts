import { defineEngineConfig } from "@omidantilong/engine/config"
import { PressRelease } from "./tenant/page-types/press-release"

export const engineConfig = defineEngineConfig({
  pageTypes: {
    PressRelease,
  },
})
