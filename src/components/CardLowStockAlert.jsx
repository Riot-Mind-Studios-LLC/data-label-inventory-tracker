import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CardLowStockAlert({ entry, onJump }) {
  const jumpTarget = entry.model || "F" // DBL has no model - jump to Ford as default

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="font-mono text-sm">{entry.sku}</p>
          <p className="text-sm text-muted-foreground">
            {entry.quantity} in stock
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => onJump(jumpTarget)}>
          View
        </Button>
      </CardContent>
    </Card>
  )
}