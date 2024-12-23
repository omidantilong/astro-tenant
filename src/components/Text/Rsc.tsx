export default async function Rsc({ text }: { text: string }) {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos/1?_delay=2000").then(
    (response) => response.json()
  )

  return (
    <div>
      {text}: {data.title}
    </div>
  )
}
