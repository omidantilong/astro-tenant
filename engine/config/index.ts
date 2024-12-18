import type { EngineConfig } from "engine/types/engine"

export async function defineEngineConfig(config: EngineConfig) {
  return config
}

export * from "./load-config"
