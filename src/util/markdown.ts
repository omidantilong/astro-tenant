import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeUnwrapImages from "rehype-unwrap-images"
import rehypeStringify from "rehype-stringify"
import { rehypeContentfulImage } from "./rehypeContentfulImage"

export async function parse(text: string) {
  const processor = unified()
    .use(remarkParse)
    .use(rehypeUnwrapImages)
    .use(remarkRehype)
    .use(rehypeContentfulImage)
    .use(rehypeStringify)
  const parsed = await processor.process(text)
  return parsed.toString()
}
