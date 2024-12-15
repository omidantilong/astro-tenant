import { getInternalLinkCollection } from "engine/contentful"

export async function resolveLinks(entries: Array<ContentModule>) {
  // This function can be used to collect all InternalLink entries that
  // are direct children of a Section, reducing the number of HTTP requests
  // that are made behind the scenes. It could be further extended to
  // recursively search the tree, but not sure if this is needed with our
  // current models - needs further investigation.

  // It works by extracting all the sys.id values from each InternalLink
  // and mapping them to the parent entry's sys.id value. It then passes
  // the list of link ids into the getInternalLinkCollection function
  // which queries Contentful using the `id_in` query filter.

  // The returned list of links is then remapped to the entry ids and the
  // new link is injected into the corresponding entry, overwriting the
  // existing link property.

  const links: { [key: string]: InternalLink } = {}
  if (entries.length) {
    const linkMap: { [key: string]: string } = {}
    entries.forEach((entry) => {
      if (entry && "link" in entry && entry?.link?.type === "InternalLink") {
        linkMap[entry.link.sys.id] = entry.sys.id
      }

      // Lines below can collect links from content nested inside sections
      // See other comments in [...slug] and Section.astro for usage

      // if ("contentCollection" in entry) {
      //   entry.contentCollection.items.forEach((entry) => {
      //     if (entry && "link" in entry && entry?.link?.type === "InternalLink") {
      //       linkMap[entry.link.sys.id] = entry.sys.id
      //     }
      //   })
      // }
    })
    const linkIds = Object.keys(linkMap)
    //console.log(linkIds)

    if (linkIds.length) {
      const { data } = await getInternalLinkCollection(linkIds)

      data.internalLinkCollection.items.forEach((link: InternalLink) => {
        links[linkMap[link.sys.id]] = link
      })
    }
  }

  return links
}
