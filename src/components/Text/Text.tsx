//import { micromark } from "micromark"
import { parse } from "engine/contentful"

export default function ({ data }: { data: Text }) {
  const { title, text } = data
  //const parsed = micromark(text)

  const parsed = parse(text)

  //return <div>{parsed}</div>

  return <div dangerouslySetInnerHTML={{ __html: parsed }} />
}
