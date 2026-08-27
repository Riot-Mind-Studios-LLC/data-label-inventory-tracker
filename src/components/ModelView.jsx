import { useMemo } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ListLabelSection from "./ListLabelSection"
import ListBundleSection from "./ListBundleSection"
import { calculateDplNeeded } from "@/lib/dplDemand"

const PRODUCT_ORDER = ["BJB", "CJB", "PCM", "DBL"]
const BUNDLE_NUMBERS = [1, 2, 3]

export default function ModelView({ model, labelData, onSaveLabel }) {
  const groupedByProduct = useMemo(() => {
    const groups = {}
    for (const product of PRODUCT_ORDER) {
      groups[product] = labelData.filter((entry) => {
        if (product === "DBL") return entry.product === "DBL"
        return entry.model === model.code && entry.product === product
      })
    }
    return groups
  }, [labelData, model.code])

  // Recalculated fresh every render - depends on live label quantities.
  const dplNeeded = calculateDplNeeded(model)

  return (
    <Tabs defaultValue="labels">
      <TabsList>
        <TabsTrigger value="labels">Labels</TabsTrigger>
        <TabsTrigger value="bundles">Bundles</TabsTrigger>
      </TabsList>

      <TabsContent value="labels" className="mt-6">
        {PRODUCT_ORDER.map((product) => (
          <ListLabelSection
            key={product}
            product={product}
            variants={groupedByProduct[product]}
            onSave={onSaveLabel}
          />
        ))}
      </TabsContent>

      <TabsContent value="bundles" className="mt-6">
        <section className="mb-8 rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">DPL needed</p>
          <p className="text-2xl font-bold">{dplNeeded}</p>
        </section>

        {BUNDLE_NUMBERS.map((bundleNumber) => (
          <ListBundleSection
            key={bundleNumber}
            model={model}
            bundleNumber={bundleNumber}
            labelData={labelData}
          />
        ))}
      </TabsContent>
    </Tabs>
  )
}