
import { createContext, useContext, useState, useCallback } from "react";

export const SETTINGS_DEFAULTS = {
  criticalTempThreshold: 35,
  minWaterReserve: 20,
  emailReports: true,
  criticalSms: true,
  weeklySummary: false,
  maintenanceAlerts: true,
  language: "tr",
  unit: "celsius",
};

export const UNIT_SYMBOLS = { celsius: "°C", fahrenheit: "°F", kelvin: "K" };
export const LANG_LABELS = { tr: "Türkçe", en: "English", de: "Deutsch" };

export function convertTemp(celsius, unit) {
  if (unit === "fahrenheit") return Number((celsius * 9 / 5 + 32).toFixed(1));
  if (unit === "kelvin") return Number((celsius + 273.15).toFixed(2));
  return Number(celsius.toFixed(1));
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(SETTINGS_DEFAULTS);
  const [prevSettings, setPrevSettings] = useState(SETTINGS_DEFAULTS);

  const saveSettings = useCallback((newSettings) => {
    setPrevSettings(settings);
    setSettings(newSettings);
    return { prev: settings, next: newSettings };
  }, [settings]);

  const toDisplay = useCallback((celsius) => {
    return convertTemp(celsius, settings.unit);
  }, [settings.unit]);

  return (
    <SettingsContext.Provider value={{ settings, prevSettings, saveSettings, toDisplay, unitSymbol: UNIT_SYMBOLS[settings.unit] }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
