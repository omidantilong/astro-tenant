import { defineToolbarApp } from "astro/toolbar"
import {
  synchronizePlacementOnUpdate,
  closeOnOutsideClick,
  createWindowElement,
} from "astro/runtime/client/dev-toolbar/apps/utils/window.js"

export default defineToolbarApp({
  init(canvas, app) {
    const window = createWindowElement(`
    <style>
      header {
        display: flex;
      }
    </style>
    `)

    synchronizePlacementOnUpdate(app, canvas)
    closeOnOutsideClick(app)

    canvas.append(window)

    const text = document.createElement("p")
    text.textContent = "Hello, Astro!"

    window.append(text)
  },
})
