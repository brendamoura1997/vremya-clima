import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sunrise, Sunset, Compass, Gauge, Wind } from "lucide-react";
import { format } from "date-fns";
import type { WeatherData } from "@/api/types";

interface WeatherDetailsProps {
  data: WeatherData;
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  const { wind, main, sys } = data;

  // Formata o tempo com o date-fns
  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "HH:mm");
  };

  // Converte o grau do vento em direção
  const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
    const index =
      Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return directions[index];
  };

  const details = [
    {
      title: "Nascer do sol",
      value: formatTime(sys.sunrise),
      icon: Sunrise,
      color: "text-orange-500",
      background: "bg-orange-500/15",
    },
    {
      title: "Pôr do sol",
      value: formatTime(sys.sunset),
      icon: Sunset,
      color: "text-pink-500",
      background: "bg-pink-500/15",
    },
    {
      title: "Direção do Vento",
      value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
      icon: Compass,
      color: "text-teal-500",
      background: "bg-teal-500/15",
    },
    {
      title: "Pressão",
      value: `${main.pressure} hPa`,
      icon: Gauge,
      color: "text-purple-500",
      background: "bg-purple-500/15",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base">
          <Wind className="h-5 w-5 text-primary" />
          Detalhes do Clima
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid h-full auto-rows-fr gap-4 sm:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.title}
              className="flex items-center gap-4 rounded-2xl border bg-muted/50 p-4"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${detail.background}`}
              >
                <detail.icon className={`h-6 w-6 ${detail.color}`} />
              </div>
              <div className="space-y-1">
                <p className="text-sm leading-none text-muted-foreground">
                  {detail.title}
                </p>
                <p className="text-base font-semibold">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
