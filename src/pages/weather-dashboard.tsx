import { CurrentWeather } from "@/components/current-weather";
import { HourlyTemperature } from "@/components/hourly-temperature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WeatherDetails } from "@/components/weather-details";
import { WeatherForecast } from "@/components/weather-forecast";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import { FavoriteCities } from "@/components/favorite-cities";
import { LocationPrompt } from "@/components/location-prompt";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    errorType,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError || !coordinates) {
    return (
      <div className="space-y-6">
        <FavoriteCities />
        <LocationPrompt errorType={errorType} onRequestLocation={getLocation} />
      </div>
    );
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Falha ao buscar dados meteorológicos. Tente novamente.</p>
          <Button variant="outline" onClick={handleRefresh} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Repetir
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* CIDADES FAVORITAS */}
      <FavoriteCities />
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <MapPin className="h-5 w-5 text-blue-500" />
          Meu local
        </h2>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
          className="cursor-pointer rounded-xl bg-card/80 shadow-sm"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>

      {/* CLIMA ATUAL E POR HORÁRIO */}
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />
          <HourlyTemperature data={forecastQuery.data} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
