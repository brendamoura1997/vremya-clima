import { Skeleton } from "./ui/skeleton";

function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]">
          <Skeleton className="h-[340px] w-full rounded-3xl" />
          <Skeleton className="h-[340px] w-full rounded-3xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Skeleton className="h-[320px] w-full rounded-3xl" />
          <Skeleton className="h-[320px] w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default WeatherSkeleton;
