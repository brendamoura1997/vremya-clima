import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { RefreshCw } from "lucide-react";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  console.log(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      // reload nos dados do clima
    }
  };

  if (locationLoading) {
    // return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* CIDADES FAVORITAS */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">MEU LOCAL</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          // disabled={}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
        </Button>
      </div>

      {/* CLIMA ATUAL E POR HORÁRIO */}
    </div>
  );
};

export default WeatherDashboard;
