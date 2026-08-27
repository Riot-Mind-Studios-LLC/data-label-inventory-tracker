import { useMemo } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ListLabelSection from "./ListLabelSection"

const PRODUCT_ORDER = ["BJB", "CJB", "PCM", "DBL"]

export default function ModelView({ model, labelData, onSaveLabel }) {
  // Filter + group this model's variants by product, in a fixed display order.
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
        <p>Bundles view goes here</p>
      </TabsContent>
    </Tabs>
  )
}