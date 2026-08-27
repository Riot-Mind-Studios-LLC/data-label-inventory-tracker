import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LABEL_CATALOG, DBL_PRODUCT } from "./lib/labelCatalog";
import { DPL_CATALOG } from "./lib/dplCatalog";
import { MODELS } from "./lib/models";
import {
  loadSavedData,
  saveData,
  loadSettings,
  saveSettings,
  mergeSavedData,
} from "./lib/storage";
import ModelView from "./components/ModelView";
import Dashboard from "./components/Dashboard";

function App() {
  const [labelData, setLabelData] = useState([]);
  const [dplData, setDplData] = useState([]);
  const [settings, setSettings] = useState({ lowStockThreshold: 5 });
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    const saved = loadSavedData();

    const fullLabelCatalog = [...LABEL_CATALOG, DBL_PRODUCT];
    const mergedLabels = fullLabelCatalog.map((entry) =>
      mergeSavedData(entry, saved),
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time load from localStorage on mount, not derived from other state
    setLabelData(mergedLabels);

    const mergedDpl = DPL_CATALOG.map((entry) => mergeSavedData(entry, saved));
    setDplData(mergedDpl);

    setSettings(loadSettings());
  }, []);

  // Writes the current labelData + dplData together into one combined
  // localStorage object, so neither save ever wipes out the other's data.
  function persistAll(nextLabelData, nextDplData) {
    const toSave = {};
    nextLabelData.forEach((entry) => {
      toSave[entry.sku] = {
        quantity: entry.quantity,
        notes: entry.notes,
        lastUpdated: entry.lastUpdated,
      };
    });
    nextDplData.forEach((entry) => {
      toSave[entry.sku] = {
        notes: entry.notes,
        lastUpdated: entry.lastUpdated,
      };
    });
    saveData(toSave);
  }

  function handleSaveLabel(sku, updates) {
    const timestamp = new Date().toISOString();
    const nextLabelData = labelData.map((entry) =>
      entry.sku === sku
        ? { ...entry, ...updates, lastUpdated: timestamp }
        : entry,
    );
    setLabelData(nextLabelData);
    persistAll(nextLabelData, dplData);
    toast.success(`Saved ${sku}`);
  }

  function handleSaveDpl(sku, updates) {
    const timestamp = new Date().toISOString();
    const nextDplData = dplData.map((entry) =>
      entry.sku === sku
        ? { ...entry, ...updates, lastUpdated: timestamp }
        : entry,
    );
    setDplData(nextDplData);
    persistAll(labelData, nextDplData);
    toast.success(`Saved ${sku}`);
  }

  function handleSaveThreshold(newThreshold) {
    const next = { ...settings, lowStockThreshold: newThreshold };
    setSettings(next);
    saveSettings(next);
    toast.success("Threshold updated");
  }

  function handleJump(modelCode) {
    setActiveView(modelCode);
  }

  const dblEntry = labelData.find((entry) => entry.sku === "AL-DBL");
  const isLoading = labelData.length === 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ToastContainer theme="dark" position="bottom-right" />
      <header className="border-b border-border px-8 py-6">
        <h1 className="text-2xl font-bold">Label Co. Inventory Tracker</h1>
      </header>

      <div className="px-8 py-6">
        <div className="hidden sm:block">
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
        </div>

        <div className="sm:hidden">
          <Select value={activeView} onValueChange={setActiveView}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dashboard">Dashboard</SelectItem>
              {MODELS.map((model) => (
                <SelectItem key={model.code} value={model.code}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {!isLoading && activeView === "dashboard" && (
            <Dashboard
              labelData={labelData}
              settings={settings}
              onSaveThreshold={handleSaveThreshold}
              onJump={handleJump}
              onSaveLabel={handleSaveLabel}
              dblEntry={dblEntry}
              dplData={dplData}
            />
          )}
          {!isLoading &&
            MODELS.map(
              (model) =>
                activeView === model.code && (
                  <ModelView
                    key={model.code}
                    model={model}
                    labelData={labelData}
                    dplData={dplData}
                    onSaveLabel={handleSaveLabel}
                    onSaveDpl={handleSaveDpl}
                    threshold={settings.lowStockThreshold}
                  />
                ),
            )}
        </div>
      </div>
    </div>
  );
}

export default App;
