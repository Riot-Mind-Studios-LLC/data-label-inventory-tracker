import CardLabelVariant from "./CardLabelVariant"

const PRODUCT_LABELS = {
  BJB: "Battery Junction Box (BJB)",
  CJB: "Central Junction Box (CJB)",
  PCM: "Powertrain Control Module (PCM)",
  DBL: "Drive Belt (DBL)",
}

export default function ListLabelSection({ product, variants, onSave, threshold }) {
  if (variants.length === 0) return null

  return (
    <section className="mb-8">
      <h3 className="mb-3 text-lg font-semibold">
        {PRODUCT_LABELS[product] || product}
      </h3>
      <div className="flex flex-col gap-3">
        {variants.map((variant) => (
          <CardLabelVariant
            key={variant.sku}
            variant={variant}
            onSave={onSave}
            threshold={threshold}
          />
        ))}
      </div>
    </section>
  )
}