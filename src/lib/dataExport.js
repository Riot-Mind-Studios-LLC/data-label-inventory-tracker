import { MODELS } from "./models"

// Builds a plain-text summary of all label and DPL data, grouped by model.
export function buildExportText(labelData, dplData) {
  const lines = []
  lines.push("LABEL CO. INVENTORY EXPORT")
  lines.push(`Generated: ${new Date().toLocaleString()}`)
  lines.push("")

  const dbl = labelData.find((entry) => entry.sku === "AL-DBL")
  if (dbl) {
    lines.push("DRIVE BELT (DBL) - Universal")
    lines.push(`  ${dbl.sku}: ${dbl.quantity} in stock`)
    if (dbl.notes) lines.push(`    Notes: ${dbl.notes}`)
    lines.push("")
  }

  MODELS.forEach((model) => {
    const modelLabels = labelData.filter(
      (entry) => entry.model === model.code
    )
    if (modelLabels.length === 0) return

    lines.push(`${model.name.toUpperCase()}`)
    modelLabels.forEach((entry) => {
      lines.push(`  ${entry.sku}: ${entry.quantity} in stock`)
      if (entry.notes) lines.push(`    Notes: ${entry.notes}`)
    })

    const dplEntry = dplData.find((entry) => entry.model === model.code)
    if (dplEntry) {
      lines.push(`  ${dplEntry.sku}: (print-on-demand, no stock)`)
      if (dplEntry.notes) lines.push(`    Notes: ${dplEntry.notes}`)
    }

    lines.push("")
  })

  return lines.join("\n")
}

// Triggers a browser download of the given text as a .txt file.
export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// The single source of truth for which localStorage keys are "app data" -
// used by Clear All Data to know exactly what to wipe.
export const DATA_STORAGE_KEYS = ["labelInventoryData", "labelInventorySettings"]