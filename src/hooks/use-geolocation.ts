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

const PERMISSION_MESSAGE =
  "Permissão de localização negada. Habilite o acesso à localização.";

async function queryPermissionState(): Promise<PermissionState | null> {
  try {
    if (!navigator.permissions) return null;
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state;
  } catch {
    return null;
  }
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

    const initialState = await queryPermissionState();

    if (initialState === "prompt" || initialState === "denied") {
      setLocationData({
        coordinates: null,
        error: PERMISSION_MESSAGE,
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
      async (error) => {
        let errorMessage: string;
        let errorType: GeolocationErrorType;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = PERMISSION_MESSAGE;
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

        if (error.code !== error.TIMEOUT && errorType !== "denied") {
          const currentState = await queryPermissionState();
          if (currentState === "prompt" || currentState === "denied") {
            errorMessage = PERMISSION_MESSAGE;
            errorType = "denied";
          }
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

  useEffect(() => {
    let status: PermissionStatus | null = null;
    let cancelled = false;

    const handleChange = () => {
      if (status?.state === "granted") getLocation();
    };

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (cancelled) return;
          status = result;
          status.addEventListener("change", handleChange);
        })
        .catch(() => null);
    }

    return () => {
      cancelled = true;
      status?.removeEventListener("change", handleChange);
    };
  }, []);

  return {
    ...locationData,
    getLocation, // Método Expose para atualizar manualmente a localização
  };
}
