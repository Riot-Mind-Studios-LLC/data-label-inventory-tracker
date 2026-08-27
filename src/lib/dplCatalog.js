import { MODELS } from "./models"

// DPL is print-on-demand - no quantity tracked.
// One SKU per model, no year variants (year/VIN is custom per order).
function buildDplCatalog() {
  return MODELS.map((m) => ({
    sku: `AL-${m.code}-DPL`,
    model: m.code,
    product: "DPL",
    notes: "",
    lastUpdated: null,
  }))
}

export const DPL_CATALOG = buildDplCatalog()