const DATA_KEY = "labelInventoryData"
const SETTINGS_KEY = "labelInventorySettings"

const DEFAULT_SETTINGS = { lowStockThreshold: 5 }

// Reads saved per-SKU data (quantity/notes/lastUpdated) from localStorage.
// Returns an empty object if nothing has been saved yet.
export function loadSavedData() {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (err) {
    console.error("Failed to load saved inventory data:", err)
    return {}
  }
}

// Saves the full per-SKU data object to localStorage.
export function saveData(data) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
    return true
  } catch (err) {
    console.error("Failed to save inventory data:", err)
    return false
  }
}

// Reads the global settings (currently just lowStockThreshold).
export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch (err) {
    console.error("Failed to load settings:", err)
    return DEFAULT_SETTINGS
  }
}

// Saves the global settings object to localStorage.
export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    return true
  } catch (err) {
    console.error("Failed to save settings:", err)
    return false
  }
}

// Merges saved per-SKU data onto a static catalog entry.
// If no saved data exists for this SKU, the catalog's own defaults are used.
export function mergeSavedData(catalogEntry, savedData) {
  const saved = savedData[catalogEntry.sku]
  if (!saved) return catalogEntry

  return { ...catalogEntry, ...saved }
}