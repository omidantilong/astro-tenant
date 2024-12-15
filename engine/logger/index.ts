import pc from "picocolors"

// This is a very quick and dirty logger lifted from another personal
// project The dim color from pico doesnt quite match the dim from
// kleurs/color which is what Astro uses, which is annoying. Either
// switch this to use kleur/colors or maybe find a way to use the built
// in Astro logger instead?

export function log(message: string) {
  const time = new Date()
  const h = String(time.getHours()).padStart(2, "0")
  const m = String(time.getMinutes()).padStart(2, "0")
  const s = String(time.getSeconds()).padStart(2, "0")

  console.log(pc.white(`${pc.dim(`${h}:${m}:${s}`)} `) + "" + message)
}
