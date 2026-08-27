// Returns every label SKU currently at or below the threshold.
// DPL is never included - it has no quantity field, it's not real stock.
export function getLowStockItems(labelData, threshold) {
  return labelData.filter((entry) => entry.quantity <= threshold)
}