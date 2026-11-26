import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Loader2, Clock, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useFavorite } from "@/hooks/use-favorite";

export function CitySearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { favorites } = useFavorite();
  const { history, clearHistory, addToHistory } = useSearchHistory();

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-city-search", handleOpen);
    return () => window.removeEventListener("open-city-search", handleOpen);
  }, []);

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");

    // Adiciona no histórico de pesquisa
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        variant="outline"
        aria-label="Procurar cidades"
        className="relative h-11 w-11 justify-center overflow-hidden rounded-full border-0 bg-card/80 px-0 text-sm font-normal text-search-input-text
        shadow-md backdrop-blur hover:bg-card dark:bg-[#0E0E1B] dark:hover:bg-[#0E0E1B] dark:border dark:border-[#3b3b5e] 
        light:hover:bg-card/100 sm:w-64 sm:justify-start sm:px-4 lg:w-[26rem]"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 text-search-input-text" />
        <span className="hidden sm:inline">Procurar cidades...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Procurar cidades..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {query.length > 2 && !isLoading && (
              <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
            )}

            {/* Sessão Favoritos */}
            {favorites.length > 0 && (
              <CommandGroup heading="Favoritos">
                {favorites.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                    onSelect={handleSelect}
                    className="cursor-pointer"
                  >
                    <Star className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>{city.name}</span>
                    {city.state && (
                      <span className="text-sm text-muted-foreground">
                        , {city.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {city.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Resultados da Pesquisa */}
            <CommandSeparator />
            {locations && locations.length > 0 && (
              <CommandGroup heading="Sugestões">
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {locations?.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                    className="cursor-pointer"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>{location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {location.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Sessão histórico de pesquisa */}
            {history.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <div className="flex items-center justify-between px-2 my-2">
                    <p className="text-xs text-muted-foreground">
                      Pesquisas recentes
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearHistory.mutate()}
                      className="cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" />
                      Limpar
                    </Button>
                  </div>
                  {history.map((location) => (
                    <CommandItem
                      key={location.id}
                      value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                      onSelect={handleSelect}
                      className="cursor-pointer"
                    >
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{location.name}</span>
                      {location.state && (
                        <span className="text-sm text-muted-foreground">
                          , {location.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        , {location.country}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {format(location.searchedAt, "d MMM, HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
