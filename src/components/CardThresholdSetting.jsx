import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CardThresholdSetting({ threshold, onSave }) {
  const [draft, setDraft] = useState(threshold)
  const isDirty = Number(draft) !== threshold

  function handleSave() {
    onSave(Number(draft))
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Low-stock threshold</p>
          <p className="text-sm text-muted-foreground">
            SKUs at or below this quantity will be flagged
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-24"
          />
          <Button onClick={handleSave} disabled={!isDirty} size="sm">
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}