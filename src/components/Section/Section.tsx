interface Props {
  data: {
    type: string
    title: string
    contentCollection: any
  }
}

import Text from "../Text/Text"

export default function (props: Props) {
  if (!props) return

  const { title, contentCollection } = props.data

  return (
    <>
      <h2>{title}</h2>
      {contentCollection.items.length &&
        contentCollection.items.map((entry: ContentModule) => {
          //console.log(content)
          if (entry.type === "EditorialCard") return <h3>{entry.cardHeading}</h3>
          if (entry.type === "Text") return <Text data={entry} />
        })}
    </>
  )
}
