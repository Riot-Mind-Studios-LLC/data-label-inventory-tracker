import { MODELS } from "./models"

// Which models get CJB and PCM at all.
// Marauder (MM) never gets these two products.
const CJB_PCM_ELIGIBLE = ["F", "L", "MGM"]

// Builds one label variant entry.
function buildVariant({ model, product, yearLabel, startYear, endYear }) {
  const sku = `AL-${model}-${product}-${yearLabel}`
  return {
    sku,
    model,
    product,
    yearLabel,
    startYear,
    endYear,
    quantity: 0,
    notes: "",
    lastUpdated: null,
  }
}

function buildBJB(modelCode) {
  if (modelCode === "MM") {
    // Marauder: single variant covering both years
    return [
      buildVariant({
        model: modelCode,
        product: "BJB",
        yearLabel: "0304",
        startYear: 2003,
        endYear: 2004,
      }),
    ]
  }

  // Ford / Lincoln / Grand Marquis: 3 ranges
  return [
    { yearLabel: "0304", startYear: 2003, endYear: 2004 },
    { yearLabel: "0506", startYear: 2005, endYear: 2006 },
    { yearLabel: "0711", startYear: 2007, endYear: 2011 },
  ].map((range) =>
    buildVariant({ model: modelCode, product: "BJB", ...range })
  )
}

function buildCJB(modelCode) {
  if (!CJB_PCM_ELIGIBLE.includes(modelCode)) return []

  return [
    { yearLabel: "0506", startYear: 2005, endYear: 2006 },
    { yearLabel: "0711", startYear: 2007, endYear: 2011 },
  ].map((range) =>
    buildVariant({ model: modelCode, product: "CJB", ...range })
  )
}

function buildPCM(modelCode) {
  if (!CJB_PCM_ELIGIBLE.includes(modelCode)) return []

  const variants = []
  for (let year = 2005; year <= 2011; year++) {
    const shortYear = String(year).slice(-2) // 2005 -> "05"
    variants.push(
      buildVariant({
        model: modelCode,
        product: "PCM",
        yearLabel: shortYear,
        startYear: year,
        endYear: year,
      })
    )
  }
  return variants
}

// DBL is one single universal SKU - not tied to any model.
export const DBL_PRODUCT = {
  sku: "AL-DBL",
  model: null,
  product: "DBL",
  yearLabel: null,
  startYear: null,
  endYear: null,
  quantity: 0,
  notes: "",
  lastUpdated: null,
}

// Builds the full label catalog: every BJB/CJB/PCM variant for every model.
function buildLabelCatalog() {
  const catalog = []
  MODELS.forEach((m) => {
    catalog.push(...buildBJB(m.code))
    catalog.push(...buildCJB(m.code))
    catalog.push(...buildPCM(m.code))
  })
  return catalog
}

export const LABEL_CATALOG = buildLabelCatalog()