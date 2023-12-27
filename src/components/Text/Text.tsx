import { micromark } from "micromark"

export default function ({ data }: { data: Text }) {
  const { title, text } = data

  const parsed = micromark(text)

  // If using react-remark instead, we can just return remarkSync(text)
  // here instead of using dangerouslySetInnerHTML

  return <div dangerouslySetInnerHTML={{ __html: parsed }} />
}
