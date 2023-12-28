import { visit } from "unist-util-visit"
import type { Node } from "unist"
import type hast from "hast"

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

export default function rehypeContentfulImage() {
  return function (tree: Node) {
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

      const src = node.properties.src as string
      if (src && src.includes("images.ctfassets")) {
        //const id = src.split("/").at(-3)
        //const {data} = await getAsset(id)
        node.properties.src = src + "?q=80"
        //node.properties.height = data.asset.height
      }
    })
  }
}
