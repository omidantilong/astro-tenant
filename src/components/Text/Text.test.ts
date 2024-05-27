import { expect, it } from "vitest"
import { render } from "../../test/render"
import Text from "./Text.astro"

it("Renders some text", async () => {
  const result = await render(Text, {
    data: {
      text: "Lorem ipsum dolor sit amet",
    },
  })

  expect(result).toContain("Lorem ipsum dolor sit amet")
})
