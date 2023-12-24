interface Props {
  data: {
    type: string
    title: string
    contentCollection: any
  }
}

export default function (props: Props) {
  if (!props) return

  const { title, contentCollection } = props.data

  return (
    <>
      <h2>{title}</h2>
      {contentCollection.items.length &&
        contentCollection.items.map((content: ContentComponent) => {
          if (content.type === "EditorialCard") return <h3>{content.cardHeading}</h3>
        })}
    </>
  )
}
