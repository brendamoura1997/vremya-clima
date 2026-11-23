import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

export type GeolocationErrorType =
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported"
  | "unknown";

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  errorType: GeolocationErrorType | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    errorType: null,
    isLoading: true,
  });

  const getLocation = () => {
    setLocationData((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      errorType: null,
    }));

    if (!navigator.geolocation) {
      setLocationData({
        coordinates: null,
        error: "Seu browser não tem suporte à geolocalização",
        errorType: "unsupported",
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
          errorType: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage: string;
        let errorType: GeolocationErrorType;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Permissão de localização negada. Habilite o acesso à localização.";
            errorType = "denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "As informações de localização não estão disponíveis.";
            errorType = "unavailable";
            break;
          case error.TIMEOUT:
            errorMessage =
              "Tempo limite da solicitação de localização expirou.";
            errorType = "timeout";
            break;
          default:
            errorMessage = "Ocorreu um erro desconhecido.";
            errorType = "unknown";
        }

        setLocationData({
          coordinates: null,
          error: errorMessage,
          errorType,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
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
