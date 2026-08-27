import { getBundleAvailability } from "./bundleRules"
import { BUNDLE_DEFINITIONS } from "./bundleRules"

// Every bundle that includes DPL, across every valid year for this model,
// contributes to how many DPLs would need to be printed to fulfill
// everything currently available. Sums it all into one number.
export function calculateDplNeeded(model) {
  let total = 0

  const bundleNumbers = Object.keys(BUNDLE_DEFINITIONS).filter((num) =>
    BUNDLE_DEFINITIONS[num].products.includes("DPL")
  )

  for (let year = model.yearStart; year <= model.yearEnd; year++) {
    for (const bundleNumber of bundleNumbers) {
      const availability = getBundleAvailability(model.code, bundleNumber, year)
      if (availability.available) {
        total += availability.quantity
      }
    }
  }

  return total
}