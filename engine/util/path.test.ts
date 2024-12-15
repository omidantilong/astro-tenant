import { it, expect, describe } from "vitest"
import { sanitizePath, getFullPath, getPathSegments } from "engine/util/path"

describe("sanitize a given path", () => {
  it("returns early when input is a single slash", () => {
    expect(sanitizePath("/")).toBe("/")
  })
  it("removes trailing slash when input is not a single slash", () => {
    expect(sanitizePath("/foo/")).toBe("/foo")
    expect(sanitizePath("/foo/bar/")).toBe("/foo/bar")
  })
})

describe("get path segments for a given page tree", () => {
  it("combines path segments from parent pages", () => {
    const entry = {
      slug: "brown",
      parent: {
        slug: "dog",
        parent: {
          slug: "animal",
        },
      },
    }

    //@ts-expect-error object is not a ContentfulLegacyPage
    expect(getPathSegments(entry)).toBe("animal/dog/brown")
  })

  it("returns a single segment when there are no parent pages", () => {
    const entry = {
      slug: "brown",
    }
    //@ts-expect-error object is not a ContentfulLegacyPage
    expect(getPathSegments(entry)).toBe("brown")
  })
})

describe("resolve the full path from a given content entry", () => {
  it("returns early when input is a single slash", () => {
    //@ts-expect-error object is not a ContentfulLegacyPage
    expect(getFullPath({ slug: "/" })).toBe("/")
  })
  it("combines path segments from parent page", () => {
    const entry = {
      slug: "brown",
      parent: {
        slug: "dog",
        parent: {
          slug: "animal",
        },
      },
    }
    //@ts-expect-error object is not a ContentfulLegacyPage
    expect(getFullPath(entry)).toBe("/animal/dog/brown")
  })
  it("prepends a root path when provided", () => {
    const entry = {
      slug: "brown",
      parent: {
        slug: "dog",
        parent: {
          slug: "animal",
        },
      },
    }
    //@ts-expect-error object is not a ContentfulLegacyPage
    expect(getFullPath(entry, "/nature")).toBe("/nature/animal/dog/brown")
  })
})
