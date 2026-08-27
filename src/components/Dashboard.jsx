import CardThresholdSetting from "./CardThresholdSetting"
import ListLowStockAlerts from "./ListLowStockAlerts"
import TableBundleSummary from "./TableBundleSummary"
import CardLabelVariant from "./CardLabelVariant"
import { MODELS } from "@/lib/models"

export default function Dashboard({
  labelData,
  settings,
  onSaveThreshold,
  onJump,
  onSaveLabel,
  dblEntry,
}) {
  return (
    <div>
      <section className="mb-8">
        <CardThresholdSetting
          threshold={settings.lowStockThreshold}
          onSave={onSaveThreshold}
        />
      </section>

      <ListLowStockAlerts
        labelData={labelData}
        threshold={settings.lowStockThreshold}
        onJump={onJump}
      />

      <section className="mb-8">
        <h3 className="mb-3 text-lg font-semibold">Drive Belt (DBL)</h3>
        {dblEntry && <CardLabelVariant variant={dblEntry} onSave={onSaveLabel} />}
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Bundle Availability Summary</h3>
        {MODELS.map((model) => (
          <TableBundleSummary key={model.code} model={model} />
        ))}
      </section>
    </div>
  )
}