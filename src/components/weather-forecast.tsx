import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Calendar, Droplets, Wind } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ForecastData } from "@/api/types";
import { WeatherIcon } from "./weather-icon";
import { useSettings } from "@/context/settings-provider";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  const { formatTemperature } = useSettings();

  // Agrupa o clima por dia e pega a temp min/max para o dia
  const dailyForecasts = data.list.reduce(
    (acc, forecast) => {
      const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

      if (!acc[date]) {
        acc[date] = {
          temp_min: forecast.main.temp_min,
          temp_max: forecast.main.temp_max,
          humidity: forecast.main.humidity,
          wind: forecast.wind.speed,
          weather: forecast.weather[0],
          date: forecast.dt,
        };
      } else {
        acc[date].temp_min = Math.min(
          acc[date].temp_min,
          forecast.main.temp_min,
        );
        acc[date].temp_max = Math.max(
          acc[date].temp_max,
          forecast.main.temp_max,
        );
      }

      return acc;
    },
    {} as Record<string, DailyForecast>,
  );

  // Pega os próximos 5 dias
  const nextDays = Object.values(dailyForecasts).slice(1, 6);

  // Formata a temperatura
  const formatTemp = (temp: number) =>
    formatTemperature(temp, { withUnit: true });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base">
          <Calendar className="h-5 w-5 text-primary" />
          Clima para os próximos dias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="grid grid-cols-3 items-center gap-y-2 py-3 sm:grid-cols-[minmax(0,1fr)_8.5rem_4.5rem_6rem] sm:gap-x-4"
            >
              <div className="col-span-3 flex items-center gap-3 sm:col-span-1">
                <WeatherIcon
                  code={day.weather.icon.replace("n", "d")}
                  label={day.weather.description}
                  className="h-10 w-10 shrink-0"
                />
                <div>
                  <p className="text-sm font-medium capitalize">
                    {format(new Date(day.date * 1000), "EEE, d MMM", {
                      locale: ptBR,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {day.weather.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="flex items-center text-blue-500">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {formatTemp(day.temp_min)}
                </span>
                <span className="flex items-center text-red-500">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {formatTemp(day.temp_max)}
                </span>
              </div>

              <div className="col-span-3 flex items-end gap-3 sm:col-span-1">
                <span className="flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{day.humidity}%</span>
                </span>
                <span className="flex items-center justify-end gap-1 sm:justify-start">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{day.wind}m/s</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
