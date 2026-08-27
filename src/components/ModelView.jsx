import { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ListLabelSection from "./ListLabelSection";
import ListBundleSection from "./ListBundleSection";
import CardDplNotes from "./CardDplNotes";
import { calculateDplNeeded } from "@/lib/dplDemand";

const PRODUCT_ORDER = ["BJB", "CJB", "PCM", "DBL"];
const BUNDLE_NUMBERS = [1, 2, 3];

export default function ModelView({
  model, labelData, dplData, onSaveLabel, onSaveDpl, threshold,
}) {
  const groupedByProduct = useMemo(() => {
    const groups = {};
    for (const product of PRODUCT_ORDER) {
      groups[product] = labelData.filter((entry) => {
        if (product === "DBL") return entry.product === "DBL";
        return entry.model === model.code && entry.product === product;
      });
    }
    return groups;
  }, [labelData, model.code]);

  const dplEntry = dplData.find((entry) => entry.model === model.code);
  const dplNeeded = calculateDplNeeded(model);

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
            threshold={threshold}
          />
        ))}

                <section className="mb-8">
          <h3 className="text-lg font-semibold">Door Placard (DPL)</h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Print-on-demand — no stock tracked, notes only
          </p>
          {dplEntry && <CardDplNotes variant={dplEntry} onSave={onSaveDpl} />}
        </section>
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
  );
}
