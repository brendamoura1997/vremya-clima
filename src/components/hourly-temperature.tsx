import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";

interface HourlyTemperatureProps {
  data: ForecastData;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
}

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
  //Pega os dados do clima de hoje  e formata para o chart

  const chartData: ChartData[] = data.list
    .slice(0, 8) // Pega as próximas 24 horas (intervalo de 3h)
    .map((item) => ({
      time: format(new Date(item.dt * 1000), "ha"), // formato unix, hour + am
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
    }));

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Temperatura de hoje</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={12}
                tickLine={true}
                axisLine={true}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={true}
                axisLine={true}
                tickFormatter={(value) => `${value}°C`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Temperatura
                            </span>
                            <span className="font-bold">
                              {payload[0].value}°C
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Sensação térmica
                            </span>
                            <span className="font-bold">
                              {payload[1].value}°C
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#64748b"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
