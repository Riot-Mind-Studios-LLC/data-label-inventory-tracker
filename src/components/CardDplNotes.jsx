import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CardDplNotes({ variant, onSave }) {
  const [draftNotes, setDraftNotes] = useState(variant.notes)
  const isDirty = draftNotes !== variant.notes

  function handleSave() {
    onSave(variant.sku, { notes: draftNotes })
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="font-mono text-sm">{variant.sku}</p>
          {variant.lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(variant.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex flex-1 items-center gap-2">
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