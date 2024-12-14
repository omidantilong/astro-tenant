type ComponentMap = { [key: string]: { default: Function } }

const defaultComponents = ["Dummy"]

export async function collectComponents({ entries }: { entries: Entry[] }): Promise<ComponentMap> {
  console.log("Collecting components")
  const components: ComponentMap = {}

  for (const entry of entries) {
    if (entry && !components[entry.type]) {
      console.log(`TYPE IS ${entry.type}`)
      try {
        if (defaultComponents.includes(entry.type)) {
          //@ts-ignore
          components[entry.type] = await import(
            `@omidantilong/dummy-astro-package/${entry.type}.astro`
          )
        } else {
          components[entry.type] = await import(`../components/${entry.type}/${entry.type}.astro`)
        }
        console.log(`Found component for ${entry.type}`)
      } catch (e) {
        console.log(`No component for ${entry.type}`)
      }
    }
  }

  return components
}
