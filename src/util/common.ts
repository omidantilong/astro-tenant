export function sanitizePath(path: string) {
  // If the incoming path is just a slash, return it
  // Otherwise remove the trailing slash

  if (path === "/") return path
  return path.endsWith("/") ? path.slice(0, -1) : path
}
