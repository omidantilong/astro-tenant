export function parentLookup(depth: number) {
  const parentQuery = []

  if (depth < 2) return ""

  for (let x = 1; x < depth; x++) {
    parentQuery.unshift("parent: parentPage { ... on Page { ...pageData ")
    parentQuery.push("} }")
  }

  const query = `
    ...on Page {
      ...pageData
      ${parentQuery.join("")}
    }
  `

  return query
}
