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

  const getLocation = async () => {
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

    let permissionState = "prompt";
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        permissionState = permission.state;
      } catch (e) {
        // Silenciosamente ignora se a API de permissões não estiver disponível
      }
    }

    if (permissionState === "denied") {
      setLocationData({
        coordinates: null,
        error:
          "Permissão de localização negada. Habilite o acesso à localização.",
        errorType: "denied",
        isLoading: false,
      });
      return;
    }

    if (permissionState === "prompt") {
      setLocationData({
        coordinates: null,
        error: "Precisamos da sua permissão para acessar a localização.",
        errorType: "denied",
        isLoading: false,
      });
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
            if (permissionState === "prompt") {
              errorMessage =
                "Precisamos da sua permissão para acessar a localização.";
              errorType = "denied";
            } else {
              errorMessage =
                "As informações de localização não estão disponíveis.";
              errorType = "unavailable";
            }
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
