import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import Header from "./header";
import IntroLandscape from "./intro-landscape";
import { Footer } from "./footer";
import { cn } from "@/lib/utils";

const Layout = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      <Header />
      {isHome && <IntroLandscape />}
      <main
        className={cn(
          "container relative z-10 mx-auto min-h-[60vh] px-4 pb-12",
          isHome ? "-mt-12" : "py-8",
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
