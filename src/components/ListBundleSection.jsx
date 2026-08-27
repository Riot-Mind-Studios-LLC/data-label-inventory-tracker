import { getBundleAvailability } from "@/lib/bundleRules"
import CardBundleAvailability from "./CardBundleAvailability"

const BUNDLE_LABELS = {
  1: "Bundle 1 (BJB + DPL + DBL)",
  2: "Bundle 2 (BJB + PCM + DPL + DBL)",
  3: "Bundle 3 (BJB + CJB + PCM + DPL + DBL)",
}

export default function ListBundleSection({ model, bundleNumber, labelData }) {
  const years = []
  for (let y = model.yearStart; y <= model.yearEnd; y++) {
    years.push(y)
  }

  // Recalculate availability fresh every render, using current labelData -
  // quantities can change at any time, so this must never be cached/stale.
  const results = years.map((year) => ({
    year,
    availability: getBundleAvailability(model.code, bundleNumber, year),
  }))

  return (
    <section className="mb-8">
      <h3 className="mb-3 text-lg font-semibold">
        {BUNDLE_LABELS[bundleNumber]}
      </h3>
      <div className="flex flex-col gap-3">
        {results.map(({ year, availability }) => (
          <CardBundleAvailability
            key={year}
            year={year}
            availability={availability}
          />
        ))}
      </div>
    </section>
  )
}