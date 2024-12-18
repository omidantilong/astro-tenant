import { glob } from "glob"
import fs from "fs-extra"

import depcheck from "depcheck"

async function scan() {
  return await depcheck("dist", {
    package: {},
  }).then((unused) => unused.missing)
}

async function move(deps: Record<string, Array<string>>) {
  //const packages = await glob('node_modules/**/package.json')
  // const deps = await fs.readFile("./deps.json").then((f) => JSON.parse(f.toString()))

  // const required = new Set(
  //   deps.issues
  //     .flatMap((f: { unlisted: string }) => f.unlisted)
  //     .map((f: { name: string }) => f.name)
  // )

  await fs.emptyDir("./dist/node_modules")

  for (const mod in deps) {
    await fs.copy(`./node_modules/${mod}`, `./dist/node_modules/${mod}`)
  }

  const licenses = await glob("./dist/node_modules/**/LICENSE")
  const readmes = await glob("./dist/node_modules/**/readme*")
  const declarations = await glob("./dist/node_modules/**/*.d.ts")
  const tests = await glob("./dist/node_modules/**/test")
  const maps = await glob("./dist/node_modules/**/*.map")

  const files = [...licenses, ...readmes, ...declarations, ...tests, ...maps]

  for await (const file of files) {
    await fs.remove(file)
  }
}

async function run() {
  const deps = await scan()

  await move(deps)
}

run().then(() => console.log("Done"))
