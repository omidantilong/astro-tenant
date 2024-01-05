// Slightly adapted from https://andrew.hedges.name/experiments/aspect_ratio/behaviors.js
// Reduce a numerator and denominator to it's smallest, integer ratio using Euclid's Algorithm

// from: http://pages.pacificcoast.net/~cazelais/euclid.html
function gcd(a: number, b: number): number {
  if (b === 0) return a
  return gcd(b, a % b)
}

export function reduceRatio(numerator: number, denominator: number) {
  if (typeof numerator !== "number" || typeof denominator !== "number") {
    return [0, 0]
  }

  let swapped = false
  let left: number = 0
  let right: number = 0

  // Take care of 1:1 case
  if (numerator === denominator) return [1, 1]

  // Make sure numerator is always the larger number
  if (numerator < denominator) {
    ;[numerator, denominator] = [denominator, numerator]
    swapped = true
  }

  const divisor = gcd(numerator, denominator)

  if (swapped) {
    left = denominator / divisor
    right = numerator / divisor
  } else {
    left = numerator / divisor
    right = denominator / divisor
  }

  // Handle special cases for common ratios
  if (8 === left && 5 === right) {
    left = 16
    right = 10
  }

  return [left, right]
}
