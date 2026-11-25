import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CitySearch } from "./city-search";
import { ThemeToggle } from "./theme-toggle";

const Header = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        solid
          ? "bg-background/70 backdrop-blur-lg"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to={"/"} className="shrink-0">
          <img
            src="/logo.svg"
            alt="Vremya logo"
            className="h-8 w-auto md:h-11 dark:hidden"
          />
          <img
            src="/logo2.svg"
            alt="Vremya logo"
            className="hidden h-8 w-auto md:h-11 dark:block"
          />
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <CitySearch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
