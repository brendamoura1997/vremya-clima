import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ComposedChart,
  Area,
  Line,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { ForecastData } from "@/api/types";
import { useSettings } from "@/context/settings-provider";

interface HourlyTemperatureProps {
  data: ForecastData;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
}

interface PeakLabelProps {
  viewBox?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    cx?: number;
    cy?: number;
  };
  value: string;
}

const RANGES = [
  { label: "24h", enabled: true },
  { label: "7 dias", enabled: false },
  { label: "30 dias", enabled: false },
];

const PeakLabel = ({ viewBox, value }: PeakLabelProps) => {
  const cx = viewBox?.cx ?? (viewBox?.x ?? 0) + (viewBox?.width ?? 0) / 2;
  const cy = viewBox?.cy ?? (viewBox?.y ?? 0) + (viewBox?.height ?? 0) / 2;

  return (
    <g>
      <rect
        x={cx - 26}
        y={cy - 42}
        width={52}
        height={26}
        rx={13}
        style={{ fill: "var(--primary)" }}
      />
      <path
        d={`M${cx - 6} ${cy - 17} L${cx} ${cy - 10} L${cx + 6} ${cy - 17} Z`}
        style={{ fill: "var(--primary)" }}
      />
      <text
        x={cx}
        y={cy - 29}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
        style={{ fill: "var(--primary-foreground)" }}
      >
        {value}
      </text>
    </g>
  );
};

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
  const { convertTemperature, temperatureSymbol, formatHour } = useSettings();

  //Pega os dados do clima de hoje  e formata para o chart

  const chartData: ChartData[] = data.list
    .slice(0, 8) // Pega as próximas 24 horas (intervalo de 3h)
    .map((item) => ({
      time: formatHour(new Date(item.dt * 1000)), // formato unix, hour + am
      temp: Math.round(convertTemperature(item.main.temp)),
      feels_like: Math.round(convertTemperature(item.main.feels_like)),
    }));

  const values = chartData.flatMap((item) => [item.temp, item.feels_like]);
  const yMin = Math.floor(Math.min(...values)) - 2;
  const yMax = Math.ceil(Math.max(...values)) + 2;
  const peak = chartData.reduce((a, b) => (b.temp > a.temp ? b : a));

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-3 text-base">
          <TrendingUp className="h-5 w-5 text-primary" />
          Temperatura de hoje
        </CardTitle>
        <div className="flex items-center rounded-full bg-muted p-1">
          {RANGES.map((range) => (
            <button
              key={range.label}
              type="button"
              disabled={!range.enabled}
              aria-pressed={range.enabled}
              title={range.enabled ? undefined : "Indisponível no momento"}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                range.enabled
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "cursor-not-allowed text-muted-foreground opacity-60"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 40, right: 24, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    style={{ stopColor: "var(--primary)", stopOpacity: 0.35 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "var(--primary)", stopOpacity: 0.02 }}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--border)"
                strokeDasharray="0"
                vertical
                horizontal
              />
              <XAxis
                dataKey="time"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={true}
                axisLine={true}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={true}
                axisLine={true}
                width={48}
                domain={[yMin, yMax]}
                allowDecimals={false}
                tickFormatter={(value) => `${value}${temperatureSymbol}`}
              />
              <Tooltip
                cursor={{ stroke: "var(--primary)", strokeDasharray: "4 4" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border bg-popover p-2 shadow-md">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Temperatura
                            </span>
                            <span className="font-bold">
                              {payload[0].value}
                              {temperatureSymbol}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Sensação térmica
                            </span>
                            <span className="font-bold">
                              {payload[1].value}
                              {temperatureSymbol}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill="url(#tempFill)"
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="var(--foreground)"
                strokeOpacity={0.6}
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="5 5"
              />
              <ReferenceLine
                segment={[
                  { x: peak.time, y: peak.temp },
                  { x: peak.time, y: yMin },
                ]}
                stroke="var(--primary)"
                strokeDasharray="4 4"
              />
              <ReferenceDot
                x={peak.time}
                y={peak.temp}
                r={5}
                fill="var(--primary)"
                stroke="var(--card)"
                strokeWidth={2}
                label={<PeakLabel value={`${peak.temp}${temperatureSymbol}`} />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
