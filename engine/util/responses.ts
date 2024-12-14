export function pageNotFound() {
  return new Response("404", {
    status: 404,
    statusText: "Not Found",
  })
}
