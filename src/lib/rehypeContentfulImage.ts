import { visit } from "unist-util-visit"
import type { Node } from "unist"
import type hast from "hast"
import { getAsset } from "./contentfulLegacy"

//import { h } from "hastscript"
//import { getAsset } from "../lib/contentfulLegacy"

// Contentful does not return asset data for embedded markdown images in
// the same way as normal assets, even though the embedded assets are
// still served via the Image API. The current image component in the
// publishing engine suffers from this same problem.
//
// But if the Text component was an .astro component rather than a
// reacty jsx component, we could do an async lookup of the asset id
// using the getAsset function exported from the contentful lib...
//
// This would allow us to construct a responsive img with srcset or a
// picture with nested sources, using the h function exposed by hast.
// This would be an improvement over the current implementation.
//
// As it stands, all this plugin does is append the quality parameter
// and return the amended url

export function rehypeContentfulImageSync() {
  // return async function transformer(tree: Node) {
  //   let imgNodes = findImgNodes(tree)
  // }

  return async function (tree: Node) {
    const images: hast.Element[] = collectNodes(tree)

    for (const image of images) {
      const src = image.properties.src as string
      image.properties.src = src + "?q=80"
    }
  }
}

export function rehypeContentfulImage() {
  // return async function transformer(tree: Node) {
  //   let imgNodes = findImgNodes(tree)
  // }

  return async function (tree: Node) {
    const images: hast.Element[] = collectNodes(tree)

    for (const image of images) {
      const src = String(image.properties.src)
      const id = src.split("/").at(-3)

      image.properties.src = src + "?q=80"

      if (id) {
        const { data } = await getAsset(id)
        image.properties.height = data.asset.height
        image.properties.width = data.asset.width
      }
    }
  }
}

function collectNodes(tree: Node) {
  const images: hast.Element[] = []
  visit(tree, { tagName: "img" }, (node: hast.Element) => {
    // visit() can also take:
    // index: number
    // parent: hast.Element

    // Sample img srcsets taken from existing image jinja component
    // <img
    // src="{{ asset.fields.file.url }}?w={{width}}&amp;q=80"
    // alt="{{ asset.fields.description }}"
    // width="{{ width }}"
    // height="{{ height }}"
    // srcset="{{ asset.fields.file.url }}?w={{divide2}}&amp;q=80 {{divide2}}w, {{ asset.fields.file.url }}?w={{width}}&amp;q=80 {{width}}w" />

    const src = String(node.properties.src)
    if (src && src.includes("images.ctfassets")) {
      images.push(node)
    }
  })

  return images
}
