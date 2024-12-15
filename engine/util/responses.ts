export function pageNotFound() {
  return new Response(new Blob(), { status: 404 })
}
