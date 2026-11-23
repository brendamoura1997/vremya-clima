import { MapPin, Search, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { GeolocationErrorType } from "@/hooks/use-geolocation";

interface LocationPromptProps {
  errorType: GeolocationErrorType | null;
  onRequestLocation: () => void;
}

const CONTENT: Record<
  GeolocationErrorType | "default",
  { title: string; description: string; actionLabel: string }
> = {
  default: {
    title: "Veja o clima da sua região",
    description:
      "Permita o acesso à sua localização para mostrarmos a previsão do tempo onde você está, ou busque qualquer cidade.",
    actionLabel: "Permitir localização",
  },
  denied: {
    title: "Precisamos da sua permissão",
    description:
      "Para mostrar o clima da sua região, clique no ícone de cadeado ao lado do endereço do site, permita a localização e tente novamente. Você também pode buscar uma cidade manualmente.",
    actionLabel: "Tentar novamente",
  },
  unavailable: {
    title: "Não conseguimos encontrar você agora",
    description:
      "Sua localização está indisponível no momento. Verifique sua conexão ou o GPS do dispositivo e tente novamente, ou busque uma cidade.",
    actionLabel: "Tentar novamente",
  },
  timeout: {
    title: "A localização está demorando",
    description:
      "Não recebemos sua localização a tempo. Isso costuma ser passageiro: tente novamente ou busque uma cidade.",
    actionLabel: "Tentar novamente",
  },
  unsupported: {
    title: "Localização não disponível neste navegador",
    description:
      "Seu navegador não oferece suporte à geolocalização, mas você ainda pode consultar o clima buscando uma cidade.",
    actionLabel: "",
  },
  unknown: {
    title: "Algo deu errado ao buscar sua localização",
    description:
      "Tente novamente ou busque uma cidade para ver a previsão do tempo.",
    actionLabel: "Tentar novamente",
  },
};

export function LocationPrompt({
  errorType,
  onRequestLocation,
}: LocationPromptProps) {
  const content = CONTENT[errorType ?? "default"];
  const canRetry = errorType !== "unsupported";

  const openCitySearch = () => {
    window.dispatchEvent(new CustomEvent("open-city-search"));
  };

  return (
    <Card className="mx-auto w-full max-w-xl overflow-hidden">
      <CardContent className="flex flex-col items-center gap-6 px-6 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <MapPin className="h-8 w-8 text-blue-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{content.title}</h2>
          <p className="text-sm text-muted-foreground">{content.description}</p>
        </div>

        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          {canRetry && (
            <Button onClick={onRequestLocation}>
              {errorType ? (
                <RefreshCw className="mr-2 h-4 w-4" />
              ) : (
                <MapPin className="mr-2 h-4 w-4" />
              )}
              {content.actionLabel}
            </Button>
          )}
          <Button variant="outline" onClick={openCitySearch}>
            <Search className="mr-2 h-4 w-4" />
            Buscar uma cidade
          </Button>
        </div>

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          Usamos sua localização apenas para exibir o clima. Ela não é
          armazenada.
        </p>
      </CardContent>
    </Card>
  );
}
