import fs from "fs-extra"

async function run() {
  const externals = ["react", "react-dom", "scheduler"]

  for (const mod of externals) {
    await fs.copy(`./node_modules/${mod}`, `./dist/node_modules/${mod}`)
  }
}

run()
