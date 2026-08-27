import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LABEL_CATALOG, DBL_PRODUCT } from "./lib/labelCatalog"
import { DPL_CATALOG } from "./lib/dplCatalog"
import { MODELS } from "./lib/models"
import {
  loadSavedData,
  saveData,
  loadSettings,
  saveSettings,
  mergeSavedData,
} from "./lib/storage"
import ModelView from "./components/ModelView"

function App() {
  const [labelData, setLabelData] = useState([])
  const [dplData, setDplData] = useState([])
  const [settings, setSettings] = useState({ lowStockThreshold: 5 })
  const [activeView, setActiveView] = useState("dashboard")

  useEffect(() => {
    const saved = loadSavedData()

    const fullLabelCatalog = [...LABEL_CATALOG, DBL_PRODUCT]
    const mergedLabels = fullLabelCatalog.map((entry) =>
      mergeSavedData(entry, saved)
    )
    setLabelData(mergedLabels)

    const mergedDpl = DPL_CATALOG.map((entry) => mergeSavedData(entry, saved))
    setDplData(mergedDpl)

    setSettings(loadSettings())
  }, [])

  function handleSaveLabel(sku, updates) {
    const timestamp = new Date().toISOString()

    setLabelData((prev) => {
      const next = prev.map((entry) =>
        entry.sku === sku
          ? { ...entry, ...updates, lastUpdated: timestamp }
          : entry
      )

      // Persist every SKU's current data to localStorage, keyed by SKU.
      const toSave = {}
      next.forEach((entry) => {
        toSave[entry.sku] = {
          quantity: entry.quantity,
          notes: entry.notes,
          lastUpdated: entry.lastUpdated,
        }
      })
      saveData(toSave)

      return next
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-8 py-6">
        <h1 className="text-2xl font-bold">Label Co. Inventory Tracker</h1>
      </header>

      <div className="px-8 py-6">
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            {MODELS.map((model) => (
              <TabsTrigger key={model.code} value={model.code}>
                {model.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-6">
          {activeView === "dashboard" && <p>Dashboard view goes here</p>}
          {MODELS.map(
            (model) =>
              activeView === model.code && (
                <ModelView
                  key={model.code}
                  model={model}
                  labelData={labelData}
                  onSaveLabel={handleSaveLabel}
                />
              )
          )}
        </div>
      </div>
    </div>
  )
}

export default App