// src/components/weather/favorite-cities.tsx
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X, Loader2, Star, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorite } from "@/hooks/use-favorite";
import { toast } from "sonner";

interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

function FavoriteCityTablet({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTabletProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  const handleClick = () => {
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex h-14 min-w-[240px] shrink-0 cursor-pointer items-center gap-3 rounded-full border bg-card/80 py-2 pl-4 pr-12 shadow-md shadow-primary/5 backdrop-blur transition-all hover:shadow-lg"
      role="button"
      tabIndex={0}
      title={
        weather
          ? `${name}, ${weather.sys.country} - ${weather.weather[0].description}`
          : name
      }
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.info(`${name} foi removido dos seus Favoritos`);
        }}
      >
        <X className="h-4 w-4" />
      </Button>

      {isLoading ? (
        <div className="flex h-8 items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : weather ? (
        <>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
            className="h-10 w-10 shrink-0"
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="text-sm font-semibold">
              {Math.round(weather.main.temp)}°C
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function FavoriteCities() {
  const { favorites, removeFavorite } = useFavorite();

  if (!favorites.length) {
    return null;
  }

  const openCitySearch = () => {
    window.dispatchEvent(new CustomEvent("open-city-search"));
  };

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        Seus favoritos
      </h2>
      <div className="flex items-center gap-4">
        <ScrollArea className="min-w-0 flex-1 pb-4">
          <div className="flex items-center gap-4">
            {favorites.map((city) => (
              <FavoriteCityTablet
                key={city.id}
                {...city}
                onRemove={() => removeFavorite.mutate(city.id)}
              />
            ))}
            <Button
              variant="outline"
              onClick={openCitySearch}
              className="h-14 shrink-0 rounded-full border-primary bg-card/60 px-6 text-primary hover:bg-primary/10 hover:text-primary 
              dark:border-primary dark:bg-card/40"
            >
              <Plus className="h-4 w-4" />
              Adicionar cidade
            </Button>
          </div>
          <ScrollBar orientation="horizontal" className="mt-2" />
        </ScrollArea>
        <Button
          variant="outline"
          onClick={openCitySearch}
          className="hidden h-14 shrink-0 rounded-full bg-card/80 px-2 w-35 shadow-md md:inline-flex"
        >
          Ver todos
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
