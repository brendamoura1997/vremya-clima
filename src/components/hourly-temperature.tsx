import { useEffect, useState } from "react";
import { addDays, format, setHours, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { ToggleBar } from "@/components/ui/toggle-bar";
import { WeatherIcon } from "./weather-icon";

interface HourlyTemperatureProps {
  data: ForecastData;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
}

interface FiveDayChartData {
  ts: number;
  temp: number;
  feels_like: number;
  icon: string;
  description: string;
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

interface DayTickProps {
  x?: number;
  y?: number;
  payload?: { value: number };
}

type RangeValue = "24h" | "5d";

const MOBILE_QUERY = "(max-width: 639px)";
const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleChange = (event: MediaQueryListEvent) =>
      setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}

const DayTick = ({ x = 0, y = 0, payload }: DayTickProps) => {
  if (!payload) return null;

  const date = new Date(payload.value);
  const weekday = WEEKDAYS_SHORT[date.getDay()];

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fontSize={12}>
        <tspan x={0} dy={16} style={{ fill: "var(--muted-foreground)" }}>
          {weekday}
        </tspan>
        <tspan
          x={0}
          dy={14}
          fontWeight={600}
          style={{ fill: "var(--muted-foreground)" }}
        >
          {format(date, "d")}
        </tspan>
      </text>
    </g>
  );
};

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

function ChartLegend() {
  return (
    <ul
      aria-label="Legenda do gráfico"
      className="flex flex-wrap  gap-x-5 gap-y-1 text-xs justify-end font-medium text-muted-foreground mr-5.5"
    >
      <li className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-[3px] w-5 shrink-0 rounded-full bg-primary"
        />
        Temperatura
      </li>
      <li className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="w-5 shrink-0 border-t-2 border-dashed border-foreground/60"
        />
        Sensação térmica
      </li>
    </ul>
  );
}

function HourlyChart({ data }: { data: ForecastData }) {
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
    <div className="space-y-3">
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
      <ChartLegend />
    </div>
  );
}

function FiveDayChart({ data }: { data: ForecastData }) {
  const { convertTemperature, temperatureSymbol, formatTime } = useSettings();
  const isMobile = useIsMobile();

  const chartData: FiveDayChartData[] = data.list.map((item) => ({
    ts: item.dt * 1000,
    temp: Math.round(convertTemperature(item.main.temp)),
    feels_like: Math.round(convertTemperature(item.main.feels_like)),
    icon: item.weather[0].icon,
    description: item.weather[0].description,
  }));

  const values = chartData.flatMap((item) => [item.temp, item.feels_like]);
  const yMin = Math.floor(Math.min(...values)) - 2;
  const yMax = Math.ceil(Math.max(...values)) + 2;
  const peak = chartData.reduce((a, b) => (b.temp > a.temp ? b : a));

  const first = chartData[0].ts;
  const last = chartData[chartData.length - 1].ts;

  const dayTicks: number[] = [];
  for (
    let day = startOfDay(new Date(first));
    day.getTime() <= last;
    day = addDays(day, 1)
  ) {
    const noon = setHours(day, 12).getTime();
    if (noon >= first && noon <= last) dayTicks.push(noon);
  }

  const formatDayTick = (value: number) => {
    const label = format(new Date(value), "EEE, d", { locale: ptBR });
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="space-y-3">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 40,
              right: isMobile ? 20 : 32,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fiveDayFill" x1="0" y1="0" x2="0" y2="1">
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
              type="number"
              dataKey="ts"
              scale="time"
              domain={[first, last]}
              ticks={dayTicks}
              interval={0}
              tickFormatter={formatDayTick}
              tick={isMobile ? <DayTick /> : undefined}
              height={isMobile ? 46 : 30}
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
              width={isMobile ? 44 : 48}
              domain={[yMin, yMax]}
              allowDecimals={false}
              tickFormatter={(value) => `${value}${temperatureSymbol}`}
            />
            <Tooltip
              cursor={{ stroke: "var(--primary)", strokeDasharray: "4 4" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as FiveDayChartData;
                  const date = new Date(item.ts);
                  return (
                    <div className="space-y-2 rounded-xl border bg-popover p-3 shadow-md">
                      <div className="flex items-center gap-2">
                        <WeatherIcon
                          code={item.icon}
                          label={item.description}
                          className="h-8 w-8 shrink-0"
                        />
                        <div className="leading-tight">
                          <p className="text-xs font-semibold capitalize">
                            {format(date, "EEEE, d 'de' MMMM", {
                              locale: ptBR,
                            })}
                            {" · "}
                            {formatTime(date)}
                          </p>
                          <p className="text-[0.70rem] capitalize text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Temperatura
                          </span>
                          <span className="font-bold">
                            {item.temp}
                            {temperatureSymbol}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Sensação térmica
                          </span>
                          <span className="font-bold">
                            {item.feels_like}
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
              fill="url(#fiveDayFill)"
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
                { x: peak.ts, y: peak.temp },
                { x: peak.ts, y: yMin },
              ]}
              stroke="var(--primary)"
              strokeDasharray="4 4"
            />
            <ReferenceDot
              x={peak.ts}
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
      <ChartLegend />
    </div>
  );
}

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
  const [range, setRange] = useState<RangeValue>("24h");

  return (
    <Card className="h-full px-1">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 px-2 md:px-5">
        <CardTitle className="flex items-center gap-3 text-base">
          <TrendingUp className="h-5 w-5 text-primary" />
          {range === "5d"
            ? "Temperatura nos próximos 5 dias"
            : "Temperatura de hoje"}
        </CardTitle>
        <ToggleBar
          ariaLabel="Selecionar período do gráfico"
          value={range}
          onChange={setRange}
          options={[
            { value: "24h", label: "24h" },
            { value: "5d", label: "5 dias" },
          ]}
          className="w-full sm:w-44"
        />
      </CardHeader>
      <CardContent className="flex-1 px-1 md:px-5">
        {range === "5d" ? (
          <FiveDayChart data={data} />
        ) : (
          <HourlyChart data={data} />
        )}
      </CardContent>
    </Card>
  );
}
