import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

export interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

export function useFavorite() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>(
    "favorites",
    []
  );
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity, // Como estamos gerenciando os dados no localStorage
  });

  const addFavorite = useMutation({
    mutationFn: async (city: Omit<FavoriteCity, "id" | "addedAt">) => {
      const newFavorite: FavoriteCity = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        addedAt: Date.now(),
      };

      // Previne duplicatas
      const exists = favorites.some((fav) => fav.id === newFavorite.id);
      if (exists) return favorites;

      const newFavorites = [...favorites, newFavorite];
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      // Invalida e busca novamente
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = favorites.filter((city) => city.id !== cityId);
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      // Invalida e busca novamente
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    favorites: favoritesQuery.data,
    addFavorite,
    removeFavorite,
    isFavorite: (lat: number, lon: number) =>
      favorites.some((city) => city.lat === lat && city.lon === lon),
  };
}
