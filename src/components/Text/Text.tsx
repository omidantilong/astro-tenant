//import { micromark } from "micromark"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import remarkUnwrapImages from "remark-unwrap-images"
import rehypeStringify from "rehype-stringify"
import rehypeContentfulImage from "../../lib/rehypeContentfulImage"

function processMarkdown(text: string) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkUnwrapImages)
    .use(remarkRehype)
    .use(rehypeContentfulImage)
    .use(rehypeStringify)
  const parsed = processor.processSync(text).toString()
  return parsed
}

export default function ({ data }: { data: Text }) {
  const { title, text } = data
  //const parsed = micromark(text)

  const parsed = processMarkdown(text)

  //return <div>{parsed}</div>

  return <div dangerouslySetInnerHTML={{ __html: parsed }} />
}
