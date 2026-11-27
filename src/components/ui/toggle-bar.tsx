import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToggleBarOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
  hideLabel?: boolean;
}

interface ToggleBarProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly [ToggleBarOption<T>, ToggleBarOption<T>];
  ariaLabel: string;
  className?: string;
}

export function ToggleBar<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: ToggleBarProps<T>) {
  const activeIndex = options[0].value === value ? 0 : 1;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();
      const nextIndex = activeIndex === 0 ? 1 : 0;
      onChange(options[nextIndex].value);
      event.currentTarget
        .querySelectorAll<HTMLButtonElement>("button")
        [nextIndex]?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative grid grid-cols-2 rounded-full bg-muted p-1",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {options.map((option, index) => {
        const isActive = index === activeIndex;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full px-3 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span className={option.hideLabel ? "sr-only" : undefined}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
