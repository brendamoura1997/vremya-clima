import { createContext, useContext, useMemo } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type TemperatureUnit = "celsius" | "fahrenheit";
export type TimeFormat = "24h" | "12h";

type FormatTemperatureOptions = {
  withUnit?: boolean;
};

type SettingsContextState = {
  temperatureUnit: TemperatureUnit;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
  temperatureSymbol: "°C" | "°F";
  convertTemperature: (celsius: number) => number;
  formatTemperature: (
    celsius: number,
    options?: FormatTemperatureOptions,
  ) => string;
  formatTime: (date: Date) => string;
  formatHour: (date: Date) => string;
};

const SettingsContext = createContext<SettingsContextState | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [temperatureUnit, setTemperatureUnit] =
    useLocalStorage<TemperatureUnit>("temperature-unit", "celsius");
  const [timeFormat, setTimeFormat] = useLocalStorage<TimeFormat>(
    "time-format",
    "24h",
  );

  const value = useMemo<SettingsContextState>(() => {
    const isFahrenheit = temperatureUnit === "fahrenheit";
    const temperatureSymbol = isFahrenheit ? "°F" : "°C";
    const is12h = timeFormat === "12h";

    const convertTemperature = (celsius: number) =>
      isFahrenheit ? (celsius * 9) / 5 + 32 : celsius;

    const formatTemperature = (
      celsius: number,
      options?: FormatTemperatureOptions,
    ) => {
      const rounded = Math.round(convertTemperature(celsius));
      return options?.withUnit
        ? `${rounded}${temperatureSymbol}`
        : `${rounded}°`;
    };

    const formatTime = (date: Date) =>
      format(date, is12h ? "hh:mm a" : "HH:mm");

    const formatHour = (date: Date) => format(date, is12h ? "h a" : "HH'h'");

    return {
      temperatureUnit,
      setTemperatureUnit,
      timeFormat,
      setTimeFormat,
      temperatureSymbol,
      convertTemperature,
      formatTemperature,
      formatTime,
      formatHour,
    };
  }, [temperatureUnit, setTemperatureUnit, timeFormat, setTimeFormat]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (context === undefined)
    throw new Error("useSettings must be used within a SettingsProvider");

  return context;
};
