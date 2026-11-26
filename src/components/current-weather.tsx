import { Card } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Thermometer, Wind } from "lucide-react";
import type { WeatherData, GeocodingResponse } from "@/api/types";
import { WeatherIcon } from "./weather-icon";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  // Formatar temperatura
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card className="h-full gap-0 overflow-hidden py-0">
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-3">
            {locationName && (
              <h2 className="text-sm font-medium">
                {locationName.name}
                {locationName.state && (
                  <span className="text-muted-foreground">
                    , {locationName.state}
                  </span>
                )}
                <span className="ml-2 text-xs text-muted-foreground">
                  {locationName.country}
                </span>
              </h2>
            )}
            <p className="flex items-start text-7xl leading-none font-extrabold tracking-tighter">
              {Math.round(temp)}
              <span className="ml-1 mt-1 text-3xl font-medium tracking-normal">
                °C
              </span>
            </p>
            <p className="text-sm font-medium">
              Sensação: {formatTemp(feels_like)}C
            </p>
          </div>
          <WeatherIcon
            code={currentWeather.icon}
            label={currentWeather.description}
            className="-mr-2 h-28 w-28 shrink-0 md:h-32 md:w-32"
          />
        </div>

        <div className="mt-auto flex items-center gap-3">
          <WeatherIcon
            code={currentWeather.icon}
            className="h-12 w-12 shrink-0"
          />
          <p className="text-sm font-semibold capitalize">
            {currentWeather.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x border-t bg-muted/50 py-4">
        <div className="flex items-center justify-center gap-2 px-2">
          <Droplets className="h-5 w-5 shrink-0 text-blue-500" />
          <div className="leading-tight">
            <p className="text-xs text-muted-foreground">Umidade</p>
            <p className="text-sm font-semibold">{humidity}%</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 px-2">
          <Wind className="h-5 w-5 shrink-0 text-blue-500" />
          <div className="leading-tight">
            <p className="text-xs text-muted-foreground">Vento</p>
            <p className="text-sm font-semibold">{speed} m/s</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 px-2">
          <Thermometer className="h-5 w-5 shrink-0 text-orange-500" />
          <div className="leading-tight">
            <p className="text-xs text-muted-foreground">Mín / Máx</p>
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <span className="flex items-center text-blue-500">
                <ArrowDown className="h-3 w-3" />
                {formatTemp(temp_min)}
              </span>
              <span className="flex items-center text-red-500">
                <ArrowUp className="h-3 w-3" />
                {formatTemp(temp_max)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
