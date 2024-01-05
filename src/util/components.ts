type ComponentMap = { [key: string]: { default: Function } }

export async function collectComponents({ entries }: { entries: Entry[] }): Promise<ComponentMap> {
  console.log("Collecting components")
  const components: ComponentMap = {}

  for (const entry of entries) {
    if (entry && !components[entry.type]) {
      try {
        components[entry.type] = await import(`../components/${entry.type}/${entry.type}.astro`)
      } catch (e) {
        console.log(`No component for ${entry.type}`)
      }
    }
  }

  return components
}
