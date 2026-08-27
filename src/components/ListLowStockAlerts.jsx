import { getLowStockItems } from "@/lib/lowStock"
import CardLowStockAlert from "./CardLowStockAlert"

export default function ListLowStockAlerts({ labelData, threshold, onJump }) {
  const lowStockItems = getLowStockItems(labelData, threshold)

  if (lowStockItems.length === 0) {
    return (
      <section className="mb-8">
        <h3 className="mb-3 text-lg font-semibold">Low Stock Alerts</h3>
        <p className="text-sm text-muted-foreground">
          Nothing is currently at or below your threshold.
        </p>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <h3 className="mb-3 text-lg font-semibold">
        Low Stock Alerts ({lowStockItems.length})
      </h3>
      <div className="flex flex-col gap-3">
        {lowStockItems.map((entry) => (
          <CardLowStockAlert key={entry.sku} entry={entry} onJump={onJump} />
        ))}
      </div>
    </section>
  )
}