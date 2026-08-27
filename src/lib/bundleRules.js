import { findLabelVariant } from "./labelLookup"

// What each bundle tier requires.
export const BUNDLE_DEFINITIONS = {
  1: { products: ["BJB", "DPL", "DBL"] },
  2: { products: ["BJB", "PCM", "DPL", "DBL"] },
  3: { products: ["BJB", "CJB", "PCM", "DPL", "DBL"] },
}

// Products that actually carry stock and can bottleneck a bundle.
// DPL is excluded here - it never limits availability, it's derived separately.
const STOCKED_PRODUCTS = ["BJB", "CJB", "PCM", "DBL"]

// Calculates a bundle's availability for a specific model + year.
// Returns:
//   { available: false, quantity: null } - bundle not offered for this model/year at all
//   { available: true, quantity: N, limitingProduct: "PCM" } - offered, N units possible
export function getBundleAvailability(modelCode, bundleNumber, targetYear) {
  const definition = BUNDLE_DEFINITIONS[bundleNumber]
  const stockedRequirements = definition.products.filter((p) =>
    STOCKED_PRODUCTS.includes(p)
  )

  let lowestQuantity = null
  let limitingProduct = null

  for (const product of stockedRequirements) {
    const variant = findLabelVariant(modelCode, product, targetYear)

    // If any required stocked product doesn't exist for this model/year,
    // the whole bundle isn't offered - stop and report unavailable.
    if (!variant) {
      return { available: false, quantity: null, limitingProduct: null }
    }

    if (lowestQuantity === null || variant.quantity < lowestQuantity) {
      lowestQuantity = variant.quantity
      limitingProduct = product
    }
  }

  return { available: true, quantity: lowestQuantity, limitingProduct }
}