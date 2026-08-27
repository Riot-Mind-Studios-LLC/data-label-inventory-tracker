import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CardLabelVariant({ variant, onSave }) {
  const [draftQuantity, setDraftQuantity] = useState(variant.quantity)
  const [draftNotes, setDraftNotes] = useState(variant.notes)

  const isDirty =
    draftQuantity !== variant.quantity || draftNotes !== variant.notes

  function handleSave() {
    onSave(variant.sku, {
      quantity: Number(draftQuantity),
      notes: draftNotes,
    })
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <p className="font-mono text-sm">{variant.sku}</p>
          {variant.lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(variant.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            type="number"
            min="0"
            value={draftQuantity}
            onChange={(e) => setDraftQuantity(e.target.value)}
            className="w-24"
          />
          <Input
            type="text"
            placeholder="Notes..."
            value={draftNotes}
            onChange={(e) => setDraftNotes(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSave} disabled={!isDirty} size="sm">
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}