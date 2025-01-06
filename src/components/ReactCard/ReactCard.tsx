export default function ReactCard({ text }: ReactCardProps) {
  return (
    <div className="fancy-card">
      <h1>SCREAMER</h1>
      {text}
    </div>
  )
}

export interface ReactCardProps {
  text: string
}
