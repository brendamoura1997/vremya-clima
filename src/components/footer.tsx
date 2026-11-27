import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";

const circleButton =
  "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20";

export function Footer() {
  return (
    <footer className="container pb-0 md:pb-0 mt-5">
      <div className="relative overflow-hidden rounded-3xl border bg-card/80 shadow-lg shadow-primary/5 backdrop-blur-sm">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-primary/15 to-transparent [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)] md:block"
        />
        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center">
          <Link to={"/"} className="shrink-0">
            <img
              src="/logo.svg"
              alt="Vremya logo"
              className="h-5 md:h-7 w-auto dark:hidden"
            />
            <img
              src="/logo2.svg"
              alt="Vremya logo"
              className="hidden h-5 md:h-7 w-auto dark:block"
            />
          </Link>

          <div className="hidden h-12 w-px bg-primary md:block" />

          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold">
              Previsão do tempo com tecnologia de ponta
            </p>
            <p className="text-xs text-muted-foreground">
              Dados atualizados em tempo real para você planejar seu dia com
              mais segurança.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/brendamoura1997"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className={circleButton}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
                aria-hidden="true"
              >
                <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
              </svg>
            </a>
            <Link
              to={"https://www.linkedin.com/in/brenda-moura-ti/"}
              aria-label="Favoritos"
              className={circleButton}
            >
              <Heart className="h-5 w-5" />
            </Link>
            <ThemeToggle className="h-10 w-10 bg-primary/10 shadow-none hover:bg-primary/20" />
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-sm text-gray-400">
        Website by Brenda Moura
      </p>
    </footer>
  );
}
