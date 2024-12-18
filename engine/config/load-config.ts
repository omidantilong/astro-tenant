import type { EngineConfig } from "engine/types/engine"
import { loadConfig } from "c12"

//import { createConfigLoader } from "unconfig"
import defaultEngineConfig from "./defaults"

const defaults = await defaultEngineConfig

// export async function loadEngineConfig(cwd = process.cwd()): Promise<EngineConfig> {
//   const loader = createConfigLoader<EngineConfig>({
//     sources: [
//       {
//         files: ["tenant.config"],
//         extensions: ["ts", "js"],
//       },
//     ],
//     defaults,
//     merge: true,
//   })

//   const result = await loader.load()
//   return result.config
// }

export async function loadEngineConfig(): Promise<EngineConfig> {
  const result = await loadConfig<EngineConfig>({
    name: "tenant",
    configFile: "tenant.config",
    rcFile: false,
    globalRc: false,
    defaults,
    //dotenv: true,
    //globalRc: true,
  })

  return result.config
}
