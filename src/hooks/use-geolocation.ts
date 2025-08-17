import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  const getLocation = () => {
    setLocationData((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      setLocationData({
        coordinates: null,
        error: "Seu browser não tem suporte à geolocalização",
        isLoading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Permissão de localização negada. Habilite o acesso à localização.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "As informações de localização não estão disponíveis.";
            break;
          case error.TIMEOUT:
            errorMessage =
              "Tempo limite da solicitação de localização expirou.";
            break;
          default:
            errorMessage = "Ocorreu um erro desconhecido.";
        }

        setLocationData({
          coordinates: null,
          error: errorMessage,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // Pega a localização quando o componente monta
  useEffect(() => {
    getLocation();
  }, []);

  return {
    ...locationData,
    getLocation, // Método Expose para atualizar manualmente a localização
  };
}
