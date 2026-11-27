import type { LucideIcon } from "lucide-react";
import { Clock, Moon, SlidersHorizontal, Sun, Thermometer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleBar } from "@/components/ui/toggle-bar";
import { useTheme } from "@/context/theme-provider";
import { useSettings } from "@/context/settings-provider";
import { cn } from "@/lib/utils";

interface SettingsMenuProps {
  className?: string;
}

interface SettingRowProps {
  icon: LucideIcon;
  title: string;
  iconColor: string;
  iconBackground: string;
  children: React.ReactNode;
}

function SettingRow({
  icon: Icon,
  title,
  iconColor,
  iconBackground,
  children,
}: SettingRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3 rounded-2xl border bg-muted/50 p-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            iconBackground,
          )}
        >
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <div className="ml-auto w-32 shrink-0">{children}</div>
    </div>
  );
}

export function SettingsMenu({ className }: SettingsMenuProps) {
  const { theme, setTheme } = useTheme();
  const { temperatureUnit, setTemperatureUnit, timeFormat, setTimeFormat } =
    useSettings();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Abrir configurações"
          title="Configurações"
          className={cn(
            "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-card/80 text-primary shadow-md backdrop-blur transition-colors hover:bg-card md:h-11 md:w-11",
            className,
          )}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="bottom-0 left-0 md:max-h-[90vh] max-w-none translate-x-0 translate-y-0 gap-5 overflow-y-auto rounded-sm
      bg-card/95 py-6 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lg shadow-primary/5 backdrop-blur-xl 
      md:top-18 right-7 md:right-11 sm:bottom-auto sm:left-auto sm:max-w-sm sm:translate-y-0 sm:pb-6
      duration-300 data-[state=open]:[--tw-enter-scale:1]! data-[state=closed]:[--tw-exit-scale:1]!
      data-[state=open]:slide-in-from-bottom-16 data-[state=closed]:slide-out-to-bottom-16
      sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=closed]:slide-out-to-bottom-0
      sm:data-[state=open]:slide-in-from-right-full sm:data-[state=closed]:slide-out-to-right-full"
      >
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-3 text-base">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            Configurações
          </DialogTitle>
          <DialogDescription className="sr-only">
            Personalize tema, unidade de temperatura e formato de horário.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <SettingRow
            icon={isDark ? Moon : Sun}
            title="Tema"
            iconColor="text-purple-500"
            iconBackground="bg-purple-500/15"
          >
            <ToggleBar
              ariaLabel="Selecionar tema"
              value={isDark ? "dark" : "light"}
              onChange={(value) => setTheme(value)}
              options={[
                { value: "light", label: "Claro", icon: Sun, hideLabel: true },
                { value: "dark", label: "Escuro", icon: Moon, hideLabel: true },
              ]}
            />
          </SettingRow>

          <SettingRow
            icon={Thermometer}
            title="Temperatura"
            iconColor="text-orange-500"
            iconBackground="bg-orange-500/15"
          >
            <ToggleBar
              ariaLabel="Selecionar unidade de temperatura"
              value={temperatureUnit}
              onChange={setTemperatureUnit}
              options={[
                { value: "celsius", label: "°C" },
                { value: "fahrenheit", label: "°F" },
              ]}
            />
          </SettingRow>

          <SettingRow
            icon={Clock}
            title="Horário"
            iconColor="text-teal-500"
            iconBackground="bg-teal-500/15"
          >
            <ToggleBar
              ariaLabel="Selecionar formato de horário"
              value={timeFormat}
              onChange={setTimeFormat}
              options={[
                { value: "24h", label: "24h" },
                { value: "12h", label: "12h" },
              ]}
            />
          </SettingRow>
        </div>
      </DialogContent>
    </Dialog>
  );
}
