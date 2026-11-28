// src/components/weather/favorite-cities.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import {
  X,
  Loader2,
  Star,
  Plus,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Eye,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorite } from "@/hooks/use-favorite";
import { useSettings } from "@/context/settings-provider";
import { toast } from "sonner";
import { WeatherIcon } from "@/components/weather-icon";
import { cn } from "@/lib/utils";

interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  animateIn: boolean;
  onRemove: (id: string) => void;
}

function FavoriteCityTablet({
  id,
  name,
  lat,
  lon,
  animateIn,
  onRemove,
}: Readonly<FavoriteCityTabletProps>) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });
  const { formatTemperature } = useSettings();
  const [mounted, setMounted] = useState(!animateIn);
  const [leaving, setLeaving] = useState(false);
  const [settled, setSettled] = useState(!animateIn);

  const expanded = mounted && !leaving;

  useEffect(() => {
    if (mounted) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [mounted]);

  useEffect(() => {
    if (!expanded) {
      setSettled(false);
      return;
    }
    if (settled) return;
    const timer = setTimeout(() => setSettled(true), 320);
    return () => clearTimeout(timer);
  }, [expanded, settled]);

  const handleClick = () => {
    void navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  const handleRemove = () => {
    if (leaving) return;
    setLeaving(true);
    toast.info(`${name} foi removido dos seus Favoritos`);
    window.setTimeout(() => onRemove(id), 300);
  };

  let content: ReactNode = null;

  if (isLoading) {
    content = (
      <div className="flex h-8 items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  } else if (weather) {
    content = (
      <>
        <WeatherIcon
          code={weather.weather[0].icon}
          label={weather.weather[0].description}
          className="h-10 w-10 shrink-0"
        />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="text-sm font-semibold">
            {formatTemperature(weather.main.temp, { withUnit: true })}
          </p>
        </div>
      </>
    );
  }

  return (
    <div
      className={cn(
        "grid shrink-0 transition-[grid-template-columns,opacity,margin] duration-300 ease-out",
        expanded
          ? "mr-4 grid-cols-[1fr] opacity-100"
          : "mr-0 grid-cols-[0fr] opacity-0",
      )}
    >
      <div className={cn("min-w-0", !settled && "overflow-hidden")}>
        <div className="relative h-14 min-w-[200px] md:min-w-[220px] lg:min-w-[240px] shrink-0">
          <button
            type="button"
            onClick={handleClick}
            className="flex h-full w-full cursor-pointer items-center gap-3 rounded-full border bg-card/80 py-2 pl-4 pr-12 text-left shadow-md shadow-primary/5 backdrop-blur outline-none transition-all hover:shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring/50"
            title={
              weather
                ? `${name}, ${weather.sys.country} - ${weather.weather[0].description}`
                : name
            }
          >
            {content}
          </button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Remover ${name} dos favoritos`}
            className="absolute right-3 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0 cursor-pointer"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CarouselArrowProps {
  direction: "left" | "right";
  visible: boolean;
  disabled: boolean;
  blocksClicks: boolean;
  onClick: () => void;
}

function CarouselArrow({
  direction,
  visible,
  disabled,
  blocksClicks,
  onClick,
}: Readonly<CarouselArrowProps>) {
  const isLeft = direction === "left";
  const Icon = isLeft ? ChevronLeft : ChevronRight;

  return (
    <div
      className={cn(
        "pointer-events-none absolute top-1 z-10 flex h-14 w-16 items-center transition-opacity duration-300 ease-out",
        isLeft
          ? "left-0 justify-start bg-gradient-to-r from-background/90 to-transparent"
          : "right-0 justify-end bg-gradient-to-l from-background/90 to-transparent",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <button
        type="button"
        aria-label={
          isLeft ? "Ver favoritos anteriores" : "Ver próximos favoritos"
        }
        tabIndex={visible && !disabled ? 0 : -1}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-primary/40 bg-card text-primary shadow-md outline-none transition-all duration-300 ease-out hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-card",
          blocksClicks ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <Icon className="h-5 w-5" />
      </button>
    </div>
  );
}

interface MoreOptionsMenuProps {
  enabled?: boolean;
  variant?: "outline" | "ghost";
  className?: string;
  triggerClassName?: string;
  onSeeMore: () => void;
  onAddCity: () => void;
}

function MoreOptionsMenu({
  enabled = true,
  variant = "outline",
  className,
  triggerClassName,
  onSeeMore,
  onAddCity,
}: Readonly<MoreOptionsMenuProps>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) setOpen(false);
  }, [enabled]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (action: () => void) => {
    setOpen(false);
    action();
  };

  const itemClassName =
    "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium outline-none transition-colors hover:bg-accent focus-visible:bg-accent";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant={variant}
        aria-haspopup="menu"
        aria-expanded={open}
        tabIndex={enabled ? 0 : -1}
        onClick={() => setOpen((current) => !current)}
        className={triggerClassName}
      >
        <LayoutGrid className="h-4 w-4" />
        Mais opções
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </Button>
      <div
        role="menu"
        aria-hidden={!open}
        className={cn(
          "absolute right-0 top-full z-30 mt-2 w-52 origin-top-right rounded-2xl border bg-popover p-1.5 shadow-lg shadow-primary/10 transition-all duration-200 ease-out",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0",
        )}
      >
        <button
          type="button"
          role="menuitem"
          tabIndex={open ? 0 : -1}
          onClick={() => handleSelect(onSeeMore)}
          className={itemClassName}
        >
          <Eye className="h-5 w-5 text-primary" />
          Ver mais
        </button>
        <button
          type="button"
          role="menuitem"
          tabIndex={open ? 0 : -1}
          onClick={() => handleSelect(onAddCity)}
          className={itemClassName}
        >
          <Plus className="h-5 w-5 text-primary" />
          Adicionar cidade
        </button>
      </div>
    </div>
  );
}

export function FavoriteCities() {
  const { favorites, removeFavorite } = useFavorite();
  const [initialIds] = useState(
    () => new Set(favorites.map((city) => city.id)),
  );

  const scrollerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [pages, setPages] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const hasFavorites = favorites.length > 0;

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const totalPages = Math.min(
      Math.max(Math.ceil(scroller.scrollWidth / scroller.clientWidth), 1),
      8,
    );

    setIsScrollable(maxScroll > 4);
    setCanScrollLeft(scroller.scrollLeft > 4);
    setCanScrollRight(scroller.scrollLeft < maxScroll - 4);
    setPages(totalPages);
    setActivePage(
      maxScroll > 0 && totalPages > 1
        ? Math.round((scroller.scrollLeft / maxScroll) * (totalPages - 1))
        : 0,
    );

    const cardsWidth = cardsRef.current?.offsetWidth ?? 0;
    const addWidth = addRef.current?.offsetWidth ?? 0;
    setHasOverflow(cardsWidth + addWidth > scroller.clientWidth + 1);
  }, []);

  useEffect(() => {
    updateScrollState();

    const observer = new ResizeObserver(updateScrollState);
    if (scrollerRef.current) observer.observe(scrollerRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    if (cardsRef.current) observer.observe(cardsRef.current);

    return () => observer.disconnect();
  }, [updateScrollState, hasFavorites, favorites.length]);

  const scrollByPage = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const scrollToPage = (page: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollTo({
      left: pages > 1 ? (maxScroll * page) / (pages - 1) : 0,
      behavior: "smooth",
    });
  };

  const openCitySearch = () => {
    window.dispatchEvent(new CustomEvent("open-city-search"));
  };

  if (!hasFavorites) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          Seus favoritos
        </h2>
        <MoreOptionsMenu
          variant="ghost"
          className="md:hidden"
          triggerClassName="h-9 rounded-full px-3"
          onSeeMore={openCitySearch}
          onAddCity={openCitySearch}
        />
      </div>

      <div className="flex items-center">
        <div className="min-w-0 flex-1">
          <div className="relative">
            <div
              ref={scrollerRef}
              onScroll={updateScrollState}
              className="min-w-0 overflow-x-auto pb-3 pt-1 md:pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div ref={contentRef} className="flex w-max items-center">
                <div ref={cardsRef} className="flex w-max items-center">
                  {favorites.map((city) => (
                    <FavoriteCityTablet
                      key={city.id}
                      id={city.id}
                      name={city.name}
                      lat={city.lat}
                      lon={city.lon}
                      animateIn={!initialIds.has(city.id)}
                      onRemove={() => removeFavorite.mutate(city.id)}
                    />
                  ))}
                </div>
                <div
                  aria-hidden={hasOverflow}
                  className={cn(
                    "hidden shrink-0 grid-cols-[1fr] transition-[grid-template-columns,opacity] duration-300 ease-out md:grid",
                    hasOverflow
                      ? "pointer-events-none grid-cols-[0fr] opacity-0"
                      : "opacity-100",
                  )}
                >
                  <div className="min-w-0 overflow-hidden">
                    <div ref={addRef} className="w-max">
                      <Button
                        variant="outline"
                        tabIndex={hasOverflow ? -1 : 0}
                        onClick={openCitySearch}
                        className="h-14 shrink-0 rounded-full border-primary bg-card/60 px-6 text-primary hover:bg-primary/10 hover:text-primary 
              dark:border-primary dark:bg-card/40"
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar cidade
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CarouselArrow
              direction="left"
              visible={isScrollable && canScrollLeft}
              disabled={!canScrollLeft}
              blocksClicks={isScrollable}
              onClick={() => scrollByPage(-1)}
            />
            <CarouselArrow
              direction="right"
              visible={isScrollable}
              disabled={!canScrollRight}
              blocksClicks={isScrollable}
              onClick={() => scrollByPage(1)}
            />
          </div>

          <div
            aria-hidden={pages <= 1}
            className={cn(
              "flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 ease-out md:hidden",
              pages > 1 ? "h-4 opacity-100" : "h-0 opacity-0",
            )}
          >
            {Array.from({ length: pages }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Ir para a página ${index + 1} dos favoritos`}
                tabIndex={pages > 1 ? 0 : -1}
                onClick={() => scrollToPage(index)}
                className={cn(
                  "h-2 cursor-pointer rounded-full transition-all duration-300 ease-out",
                  index === activePage ? "w-4 bg-primary" : "w-2 bg-primary/30",
                )}
              />
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "hidden h-12 shrink-0 bg-primary/60 transition-all duration-300 ease-out md:block",
            hasOverflow ? "ml-4 w-px opacity-100" : "ml-0 w-0 opacity-0",
          )}
        />

        <div className="relative z-20 ml-4 hidden h-14 w-40 shrink-0 md:block">
          <Button
            variant="outline"
            aria-hidden={hasOverflow}
            tabIndex={hasOverflow ? -1 : 0}
            onClick={openCitySearch}
            className={cn(
              "absolute inset-0 h-full w-full rounded-full bg-card/80 px-2 shadow-md transition-all duration-300 ease-out",
              hasOverflow
                ? "pointer-events-none scale-95 opacity-0"
                : "scale-100 opacity-100",
            )}
          >
            Ver todos
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div
            aria-hidden={!hasOverflow}
            className={cn(
              "absolute inset-0 transition-all duration-300 ease-out",
              hasOverflow
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0",
            )}
          >
            <MoreOptionsMenu
              enabled={hasOverflow}
              className="h-full"
              triggerClassName="h-full w-full rounded-full border-primary bg-card/80 px-4 text-primary shadow-md hover:bg-primary/10 hover:text-primary dark:border-primary"
              onSeeMore={openCitySearch}
              onAddCity={openCitySearch}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
