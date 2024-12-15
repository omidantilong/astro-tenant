import { it, expect, describe } from "vitest"
import { sanitizePath, getFullPath, getPathSegments } from "engine/util/path"

describe("sanitize a given path", () => {
  it("returns early when input is a single slash", () => {
    expect(sanitizePath("/")).toBe("/")
  })
})
