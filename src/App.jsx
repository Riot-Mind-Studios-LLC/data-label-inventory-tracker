import { useState, useEffect } from "react";
import { LABEL_CATALOG, DBL_PRODUCT } from "./lib/labelCatalog";
import { DPL_CATALOG } from "./lib/dplCatalog";
import {
  loadSavedData,
  saveData,
  loadSettings,
  saveSettings,
  mergeSavedData,
} from "./lib/storage";

function App() {
  const [labelData, setLabelData] = useState([]);
  const [dplData, setDplData] = useState([]);
  const [settings, setSettings] = useState({ lowStockThreshold: 5 });

  // On first load: merge saved localStorage data onto the static catalogs.
  useEffect(() => {
    const saved = loadSavedData();

    const fullLabelCatalog = [...LABEL_CATALOG, DBL_PRODUCT];
    const mergedLabels = fullLabelCatalog.map((entry) =>
      mergeSavedData(entry, saved),
    );
    setLabelData(mergedLabels);

    const mergedDpl = DPL_CATALOG.map((entry) => mergeSavedData(entry, saved));
    setDplData(mergedDpl);

    setSettings(loadSettings());
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-2xl font-bold">Label Co. Inventory Tracker</h1>
      <p className="text-muted-foreground">
        {labelData.length} label SKUs loaded, {dplData.length} DPL SKUs loaded
      </p>
    </div>
  );
}

export default App;
