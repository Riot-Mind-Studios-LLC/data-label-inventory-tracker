import { LABEL_CATALOG, DBL_PRODUCT } from "./labelCatalog"

// Finds the correct label SKU for a given model + product + target year.
// - BJB/CJB: matches if targetYear falls within the variant's startYear-endYear range
// - PCM: matches if targetYear equals the variant's exact year (startYear === endYear === targetYear)
// - DBL: ignores model/year entirely, always returns the single universal SKU
// Returns the matching label object, or null if no variant exists for that combo
// (e.g. asking for PCM on a Marauder, or CJB for a 2003 Crown Victoria).
export function findLabelVariant(modelCode, product, targetYear) {
  if (product === "DBL") {
    return DBL_PRODUCT
  }

  const match = LABEL_CATALOG.find(
    (label) =>
      label.model === modelCode &&
      label.product === product &&
      targetYear >= label.startYear &&
      targetYear <= label.endYear
  )

  return match || null
}