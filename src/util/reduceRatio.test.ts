import { it, expect, describe } from "vitest"
import { reduceRatio } from "./reduceRatio"

describe("reduce ratio to lowest form", () => {
  it("handles common cases", () => {
    expect(reduceRatio(2000, 100)).toStrictEqual([20, 1])
    expect(reduceRatio(100, 2000)).toStrictEqual([1, 20])
  })

  it("handles special cases for common aspect ratios", () => {
    expect(reduceRatio(8, 5)).toStrictEqual([16, 10])
  })

  it("handles zeroes", () => {
    expect(reduceRatio(10, 0)).toStrictEqual([1, 0])
    expect(reduceRatio(0, 10)).toStrictEqual([0, 1])
  })

  it("handles equal values", () => {
    expect(reduceRatio(10, 10)).toStrictEqual([1, 1])
    expect(reduceRatio(0, 0)).toStrictEqual([1, 1])
  })

  it("handles non numeric values", () => {
    /// @ts-expect-error
    expect(reduceRatio(null, null)).toStrictEqual([0, 0])

    /// @ts-expect-error
    expect(reduceRatio(false, false)).toStrictEqual([0, 0])

    /// @ts-expect-error
    expect(reduceRatio(undefined, undefined)).toStrictEqual([0, 0])

    ///@ts-expect-error
    expect(reduceRatio("10", "1")).toStrictEqual([0, 0])
  })
})
