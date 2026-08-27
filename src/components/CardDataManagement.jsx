import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buildExportText, downloadTextFile, DATA_STORAGE_KEYS } from "@/lib/dataExport"
import { toast } from "react-toastify"

export default function CardDataManagement({ labelData, dplData }) {
  const [confirmText, setConfirmText] = useState("")

  function handleExport() {
    const text = buildExportText(labelData, dplData)
    const filename = `label-co-inventory-${new Date().toISOString().split("T")[0]}.txt`
    downloadTextFile(filename, text)
    toast.success("Export downloaded")
  }

  function handleClearAll() {
    DATA_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
    toast.success("All data cleared")
    window.location.reload()
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="font-semibold">Data Management</p>
          <p className="text-sm text-muted-foreground">
            Export a text summary of all inventory, or clear all saved data.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleExport} variant="outline">
            Export All Data
          </Button>

          <AlertDialog onOpenChange={(open) => !open && setConfirmText("")}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Clear All Data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all inventory data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes every saved quantity, note, and
                  setting. This cannot be undone. Type DELETE below to
                  confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText("")}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  disabled={confirmText !== "DELETE"}
                >
                  Clear All Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}